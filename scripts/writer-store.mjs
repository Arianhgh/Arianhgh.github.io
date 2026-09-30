import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const draftIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const postNamePattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

const draftsDirectory = (root) => path.join(root, '.local-drafts');
const postsDirectory = (root) => path.join(root, 'src/content/posts');

export const todayInToronto = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

export const slugify = (title) => title.toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}

function normalizeInput(input, publishing = false) {
  const title = String(input.title ?? '').trim();
  const summary = String(input.summary ?? '').trim();
  const body = String(input.body ?? '').trim();
  const kind = input.kind;
  const date = input.date;
  if (title.length > 160) throw new Error('Keep the title under 160 characters.');
  if (summary.length > 300) throw new Error('Keep the summary under 300 characters.');
  if (body.length > 200_000) throw new Error('This post is too long for the editor.');
  if (!['note', 'essay'].includes(kind)) throw new Error('Choose Note or Essay.');
  if (!validDate(date)) throw new Error('Choose a valid date.');
  if (publishing && !title) throw new Error('Add a title before publishing.');
  if (publishing && !body) throw new Error('Write something before publishing.');
  return { title, summary, body, kind, date };
}

function draftPath(root, id) {
  if (!draftIdPattern.test(id)) throw new Error('Invalid draft.');
  return path.join(draftsDirectory(root), `${id}.json`);
}

function postPath(root, name) {
  if (!postNamePattern.test(name)) throw new Error('Invalid post.');
  return path.join(postsDirectory(root), name);
}

async function readDraft(root, id) {
  return JSON.parse(await readFile(draftPath(root, id), 'utf8'));
}

async function readPublished(root, name) {
  const parsed = matter(await readFile(postPath(root, name), 'utf8'));
  const date = parsed.data.date instanceof Date
    ? parsed.data.date.toISOString().slice(0, 10)
    : String(parsed.data.date ?? '');
  return {
    id: `post:${name}`,
    title: String(parsed.data.title ?? ''),
    summary: String(parsed.data.summary ?? ''),
    body: parsed.content.trim(),
    kind: parsed.data.kind,
    date,
    slug: String(parsed.data.slug ?? ''),
    status: parsed.data.draft ? 'draft' : 'published'
  };
}

export async function listPosts(root) {
  await mkdir(draftsDirectory(root), { recursive: true });
  await mkdir(postsDirectory(root), { recursive: true });
  const drafts = (await readdir(draftsDirectory(root)))
    .filter((name) => draftIdPattern.test(name.replace(/\.json$/, '')) && name.endsWith('.json'));
  const posts = (await readdir(postsDirectory(root))).filter((name) => postNamePattern.test(name));
  const local = await Promise.all(drafts.map(async (name) => {
    const draft = await readDraft(root, name.slice(0, -5));
    return { id: `draft:${name.slice(0, -5)}`, title: draft.title || 'Untitled', date: draft.date, kind: draft.kind, status: 'draft' };
  }));
  const published = await Promise.all(posts.map(async (name) => {
    const post = await readPublished(root, name);
    return { id: post.id, title: post.title, date: post.date, kind: post.kind, status: post.status };
  }));
  return [...local.sort((a, b) => b.date.localeCompare(a.date)),
    ...published.sort((a, b) => b.date.localeCompare(a.date))];
}

export async function getPost(root, id) {
  if (id.startsWith('draft:')) {
    const draft = await readDraft(root, id.slice(6));
    return { id, ...draft, status: 'draft' };
  }
  if (id.startsWith('post:')) return readPublished(root, id.slice(5));
  throw new Error('Invalid post.');
}

export async function saveDraft(root, input) {
  const values = normalizeInput(input);
  let draftId;
  let target = null;
  if (input.id?.startsWith('draft:')) {
    draftId = input.id.slice(6);
    target = (await readDraft(root, draftId)).target ?? null;
  } else if (input.id?.startsWith('post:')) {
    target = input.id.slice(5);
    postPath(root, target);
    draftId = randomUUID();
  } else if (!input.id) {
    draftId = randomUUID();
  } else {
    throw new Error('Invalid post.');
  }
  const draft = { ...values, target };
  await mkdir(draftsDirectory(root), { recursive: true });
  await writeFile(draftPath(root, draftId), `${JSON.stringify(draft, null, 2)}\n`);
  return { id: `draft:${draftId}`, ...draft, status: 'draft' };
}

export async function preparePublish(root, input) {
  const values = normalizeInput(input, true);
  const draft = await saveDraft(root, { ...values, id: input.id });
  let target = draft.target;
  let slug = slugify(values.title);
  if (!slug) throw new Error('The title needs at least one letter or number.');
  if (!target) {
    target = `${values.date}-${slug}.md`;
    try {
      await readFile(postPath(root, target));
      throw new Error('A post with this date and title already exists. Open it from the list to edit it.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  } else {
    try {
      const existing = await readPublished(root, target);
      slug = existing.slug || slug;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  await writeFile(draftPath(root, draft.id.slice(6)), `${JSON.stringify({ ...values, target }, null, 2)}\n`);
  await mkdir(postsDirectory(root), { recursive: true });
  const markdown = matter.stringify(`${values.body}\n`, {
    title: values.title, slug, date: values.date, kind: values.kind,
    summary: values.summary, draft: false
  });
  await writeFile(postPath(root, target), markdown);
  return { draftId: draft.id, target, slug, title: values.title };
}

export async function finishPublish(root, draftId) {
  if (!draftId.startsWith('draft:')) throw new Error('Invalid draft.');
  await unlink(draftPath(root, draftId.slice(6)));
}

export async function deleteDraft(root, draftId) {
  if (!draftId.startsWith('draft:')) throw new Error('Only local drafts can be deleted here.');
  await unlink(draftPath(root, draftId.slice(6)));
}
