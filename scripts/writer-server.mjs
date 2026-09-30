import { randomBytes } from 'node:crypto';
import { execFile, spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { deleteDraft, finishPublish, getPost, listPosts, preparePublish, saveDraft } from './writer-store.mjs';

const runFile = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = '127.0.0.1';
const port = 4322;
const siteUrl = 'https://arianhgh.github.io';
const token = randomBytes(32).toString('hex');
const processor = await createMarkdownProcessor({
  remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex],
  shikiConfig: { theme: 'github-light' }
});
let publishing = false;
let astroChild;

function reply(response, status, body, contentType = 'application/json; charset=utf-8') {
  response.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  });
  response.end(contentType.startsWith('application/json') ? JSON.stringify(body) : body);
}

async function readJson(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw new Error('Expected JSON.');
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error('The post is too large.');
  }
  return JSON.parse(body);
}

async function command(label, executable, args, options = {}) {
  try {
    const result = await runFile(executable, args, {
      cwd: root, timeout: 180_000, maxBuffer: 2_000_000,
      env: { ...process.env, ...options.env }
    });
    if (result.stdout.trim()) process.stdout.write(`${label}: ${result.stdout.trim()}\n`);
    return result.stdout.trim();
  } catch (error) {
    const details = (error.stderr || error.stdout || error.message).trim().slice(-1200);
    throw new Error(`${label} failed. ${details}`);
  }
}

async function publish(post) {
  const branch = await command('Branch check', 'git', ['branch', '--show-current']);
  if (branch !== 'main') throw new Error('Publishing requires the main branch.');
  const remote = await command('Remote check', 'git', ['remote', 'get-url', 'origin']);
  if (!/github\.com[/:]Arianhgh\/Arianhgh\.github\.io(?:\.git)?$/i.test(remote)) {
    throw new Error('This folder is not connected to the portfolio repository.');
  }
  await command('Fetch', 'git', ['fetch', 'origin', 'main']);
  const local = await command('Local revision', 'git', ['rev-parse', 'HEAD']);
  const upstream = await command('Remote revision', 'git', ['rev-parse', 'origin/main']);
  if (local !== upstream) throw new Error('The GitHub repository changed. Sync it before publishing this post.');
  const relative = `src/content/posts/${post.target}`;
  const status = await command('Working tree check', 'git', ['status', '--porcelain', '--untracked-files=all']);
  const otherChanges = status.split('\n').filter(Boolean).filter((line) => line.slice(3) !== relative);
  if (otherChanges.length) throw new Error('There are other unsaved site changes. Commit or set them aside before publishing.');

  await command('Site check', 'npm', ['run', 'check']);
  await command('Build', 'npm', ['run', 'build'], { env: { SITE_URL: siteUrl, SITE_BASE: '/' } });
  if (status) {
    await command('Stage post', 'git', ['add', '--', relative]);
    await command('Commit post', 'git', ['commit', '-m', `Publish ${post.title}`, '--', relative]);
    await command('Push post', 'git', ['push', 'origin', 'main']);
  }
  await command('Deploy site', 'npm', ['run', 'deploy:pages']);
  await finishPublish(root, post.draftId);
  return { id: `post:${post.target}`, url: `${siteUrl}/writing/${post.slug}/` };
}

async function siteIsRunning() {
  try {
    const response = await fetch('http://127.0.0.1:4321/', { signal: AbortSignal.timeout(1000) });
    return response.ok && (await response.text()).includes('Arian Haghparast');
  } catch {
    return false;
  }
}

if (!(await siteIsRunning())) {
  astroChild = spawn(path.join(root, 'node_modules/.bin/astro'),
    ['dev', '--host', host, '--port', '4321'], { cwd: root, stdio: 'inherit' });
  for (let attempt = 0; attempt < 30 && !(await siteIsRunning()); attempt++) await sleep(300);
  if (!(await siteIsRunning())) throw new Error('The site could not start on port 4321.');
}

const server = http.createServer(async (request, response) => {
  try {
    const authority = request.headers.host;
    if (authority !== `${host}:${port}` && authority !== `localhost:${port}`) {
      reply(response, 403, { error: 'Local access only.' });
      return;
    }
    const url = new URL(request.url, `http://${authority}`);
    if (request.method === 'POST') {
      if (request.headers.origin !== `http://${authority}` || request.headers['x-writer-token'] !== token) {
        reply(response, 403, { error: 'Request not allowed.' });
        return;
      }
    }
    if (request.method === 'GET' && url.pathname === '/') {
      const html = (await readFile(path.join(root, 'scripts/writer-ui.html'), 'utf8'))
        .replace('__WRITER_TOKEN__', token);
      reply(response, 200, html, 'text/html; charset=utf-8');
    } else if (request.method === 'GET' && url.pathname === '/writer.css') {
      reply(response, 200, await readFile(path.join(root, 'scripts/writer-ui.css'), 'utf8'), 'text/css; charset=utf-8');
    } else if (request.method === 'GET' && url.pathname === '/writer.js') {
      reply(response, 200, await readFile(path.join(root, 'scripts/writer-ui.js'), 'utf8'), 'text/javascript; charset=utf-8');
    } else if (request.method === 'GET' && url.pathname === '/katex.css') {
      reply(response, 200, await readFile(path.join(root, 'node_modules/katex/dist/katex.min.css'), 'utf8'), 'text/css; charset=utf-8');
    } else if (request.method === 'GET' && url.pathname === '/api/posts') {
      reply(response, 200, { posts: await listPosts(root) });
    } else if (request.method === 'GET' && url.pathname === '/api/post') {
      reply(response, 200, { post: await getPost(root, url.searchParams.get('id') || '') });
    } else if (request.method === 'POST' && url.pathname === '/api/save') {
      reply(response, 200, { post: await saveDraft(root, await readJson(request)) });
    } else if (request.method === 'POST' && url.pathname === '/api/delete') {
      const { id } = await readJson(request);
      await deleteDraft(root, id);
      reply(response, 200, { deleted: true });
    } else if (request.method === 'POST' && url.pathname === '/api/preview') {
      const { body = '' } = await readJson(request);
      const rendered = await processor.render(String(body).slice(0, 200_000));
      reply(response, 200, { html: rendered.code });
    } else if (request.method === 'POST' && url.pathname === '/api/publish') {
      if (publishing) throw new Error('A post is already being published.');
      publishing = true;
      try {
        const post = await preparePublish(root, await readJson(request));
        reply(response, 200, await publish(post));
      } finally {
        publishing = false;
      }
    } else {
      reply(response, 404, { error: 'Not found.' });
    }
  } catch (error) {
    console.error(error);
    if (!response.headersSent) reply(response, 400, { error: error.message || 'Something went wrong.' });
  }
});

server.listen(port, host, () => {
  console.log(`Writing editor: http://${host}:${port}/`);
  console.log('Site preview: http://127.0.0.1:4321/');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close();
    astroChild?.kill(signal);
  });
}
