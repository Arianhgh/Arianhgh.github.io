import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const kind = process.argv[2];
const title = process.argv.slice(3).join(' ').trim();
if (!['note', 'essay'].includes(kind) || !title) {
  console.error('Usage: npm run new:note -- "Your title" (or new:essay)');
  process.exit(1);
}

const slug = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
if (!slug) throw new Error('The title needs at least one letter or number.');

const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const posts = path.join(root, 'src/content/posts');
const file = path.join(posts, `${date}-${slug}.md`);
const content = `---\ntitle: ${JSON.stringify(title)}\nslug: ${slug}\ndate: ${date}\nkind: ${kind}\nsummary: \"\"\ndraft: true\n---\n\n`;
await mkdir(posts, { recursive: true });
await writeFile(file, content, { flag: 'wx' });
console.log(file);
