import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import { deleteDraft, finishPublish, getPost, listPosts, preparePublish, saveDraft, slugify } from './writer-store.mjs';

async function workspace(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'arian-writer-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

const input = {
  title: 'What changed in this run?',
  date: '2026-09-30',
  kind: 'note',
  summary: 'A small debugging note.',
  body: 'A model result moved. **Why?**'
};

test('saves a private draft and publishes valid Astro Markdown', async (t) => {
  const root = await workspace(t);
  const draft = await saveDraft(root, input);
  assert.match(draft.id, /^draft:/);
  assert.equal((await listPosts(root))[0].status, 'draft');
  const prepared = await preparePublish(root, { ...input, id: draft.id });
  const file = path.join(root, 'src/content/posts', prepared.target);
  const parsed = matter(await readFile(file, 'utf8'));
  assert.equal(parsed.data.title, input.title);
  assert.equal(parsed.data.slug, 'what-changed-in-this-run');
  assert.equal(parsed.data.draft, false);
  assert.match(parsed.content, /\*\*Why\?\*\*/);
  await finishPublish(root, draft.id);
  assert.equal((await listPosts(root))[0].status, 'published');
});

test('editing a published post retains its URL slug', async (t) => {
  const root = await workspace(t);
  const first = await preparePublish(root, input);
  await finishPublish(root, first.draftId);
  const published = await getPost(root, `post:${first.target}`);
  const revision = await saveDraft(root, { ...published, title: 'A better title', body: 'Revised body.' });
  const second = await preparePublish(root, { ...revision, body: 'Revised body.' });
  assert.equal(second.target, first.target);
  assert.equal(second.slug, first.slug);
  assert.match((await readFile(path.join(root, 'src/content/posts', first.target), 'utf8')), /Revised body/);
});

test('rejects invalid dates, empty published posts, and path traversal', async (t) => {
  const root = await workspace(t);
  assert.equal(slugify('Trying & learning'), 'trying-learning');
  await assert.rejects(saveDraft(root, { ...input, date: '2026-02-30' }), /valid date/);
  await assert.rejects(preparePublish(root, { ...input, body: '' }), /Write something/);
  await assert.rejects(getPost(root, 'post:../../secret.md'), /Invalid post/);
});

test('deletes only local drafts', async (t) => {
  const root = await workspace(t);
  const draft = await saveDraft(root, input);
  await deleteDraft(root, draft.id);
  assert.deepEqual(await listPosts(root), []);
  await assert.rejects(deleteDraft(root, 'post:2026-09-30-example.md'), /Only local drafts/);
});
