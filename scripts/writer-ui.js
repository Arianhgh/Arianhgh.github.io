const token = document.querySelector('meta[name="writer-token"]').content;
const form = document.querySelector('#post-form');
const list = document.querySelector('#post-list');
const title = document.querySelector('#title');
const date = document.querySelector('#date');
const summary = document.querySelector('#summary');
const body = document.querySelector('#body');
const preview = document.querySelector('#preview');
const message = document.querySelector('#message');
const saveState = document.querySelector('#save-state');
const postState = document.querySelector('#post-state');
const saveButton = document.querySelector('#save-draft');
const publishButton = document.querySelector('#publish');
const deleteButton = document.querySelector('#delete-draft');
let currentId = null;
let dirty = false;

const today = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', 'X-Writer-Token': token } : undefined
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Something went wrong.');
  return result;
}

function values() {
  return {
    id: currentId,
    title: title.value,
    date: date.value,
    kind: form.elements.kind.value,
    summary: summary.value,
    body: body.value
  };
}

function setMessage(text, error = false) {
  message.textContent = text;
  message.classList.toggle('error', error);
}

function setBusy(busy) {
  saveButton.disabled = busy;
  publishButton.disabled = busy;
  deleteButton.disabled = busy;
  document.querySelector('#new-post').disabled = busy;
}

function markDirty() {
  dirty = true;
  saveState.textContent = 'Unsaved';
  setMessage('');
}

function fill(post) {
  currentId = post.id || null;
  title.value = post.title || '';
  date.value = post.date || today();
  summary.value = post.summary || '';
  body.value = post.body || '';
  form.elements.kind.value = post.kind || 'note';
  postState.textContent = post.status === 'published' ? 'Published' : currentId ? 'Draft' : 'New post';
  deleteButton.hidden = !currentId?.startsWith('draft:');
  saveState.textContent = '';
  dirty = false;
  setMessage('');
  showView('write');
  refreshList();
}

async function refreshList() {
  const { posts } = await api('/api/posts');
  list.replaceChildren();
  for (const status of ['draft', 'published']) {
    const entries = posts.filter((post) => post.status === status);
    if (!entries.length) continue;
    const group = document.createElement('section');
    group.className = 'post-group';
    const heading = document.createElement('h3');
    heading.textContent = status === 'draft' ? 'Drafts' : 'Published';
    group.append(heading);
    for (const post of entries) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-current', String(post.id === currentId));
      const name = document.createElement('strong');
      name.textContent = post.title || 'Untitled';
      const detail = document.createElement('small');
      detail.textContent = `${post.date} · ${post.kind}`;
      button.append(name, detail);
      button.addEventListener('click', () => openPost(post.id));
      group.append(button);
    }
    list.append(group);
  }
  if (!posts.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No posts yet.';
    list.append(empty);
  }
}

async function openPost(id) {
  if (dirty && !confirm('Leave this unsaved post?')) return;
  try {
    const { post } = await api(`/api/post?id=${encodeURIComponent(id)}`);
    fill(post);
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function saveDraft() {
  const { post } = await api('/api/save', { method: 'POST', body: JSON.stringify(values()) });
  currentId = post.id;
  deleteButton.hidden = false;
  dirty = false;
  postState.textContent = 'Draft';
  saveState.textContent = 'Saved locally';
  await refreshList();
}

async function showView(view) {
  const isPreview = view === 'preview';
  document.querySelector('#write-tab').setAttribute('aria-pressed', String(!isPreview));
  document.querySelector('#preview-tab').setAttribute('aria-pressed', String(isPreview));
  body.hidden = isPreview;
  preview.hidden = !isPreview;
  if (!isPreview) return;
  try {
    const { html } = await api('/api/preview', { method: 'POST', body: JSON.stringify({ body: body.value }) });
    preview.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><base href="http://127.0.0.1:4321/writing/preview/"><link rel="stylesheet" href="http://127.0.0.1:4322/katex.css"><style>body{max-width:660px;margin:0 auto;padding:26px;color:#343a35;font:18px/1.75 Georgia,serif}img{max-width:100%;height:auto}pre{overflow:auto;padding:14px;background:#f1f3ef}code{font-size:.85em}blockquote{margin-left:0;padding-left:18px;border-left:2px solid #dfe2dc}a{color:#335f50}</style></head><body>${html}</body></html>`;
  } catch (error) {
    setMessage(error.message, true);
  }
}

form.addEventListener('input', markDirty);
form.addEventListener('change', markDirty);
document.querySelector('#new-post').addEventListener('click', () => {
  if (dirty && !confirm('Leave this unsaved post?')) return;
  fill({ date: today(), kind: 'note' });
  title.focus();
});
document.querySelector('#write-tab').addEventListener('click', () => showView('write'));
document.querySelector('#preview-tab').addEventListener('click', () => showView('preview'));
saveButton.addEventListener('click', async () => {
  setBusy(true);
  try {
    await saveDraft();
    setMessage('Draft saved on this computer.');
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    setBusy(false);
  }
});
deleteButton.addEventListener('click', async () => {
  if (!currentId?.startsWith('draft:') || !confirm('Delete this local draft?')) return;
  setBusy(true);
  try {
    await api('/api/delete', { method: 'POST', body: JSON.stringify({ id: currentId }) });
    fill({ date: today(), kind: 'note' });
    setMessage('Draft deleted.');
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    setBusy(false);
  }
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setBusy(true);
  saveState.textContent = 'Publishing...';
  setMessage('Building and sending the post to GitHub Pages.');
  try {
    await saveDraft();
    const result = await api('/api/publish', { method: 'POST', body: JSON.stringify(values()) });
    currentId = result.id;
    dirty = false;
    postState.textContent = 'Published';
    deleteButton.hidden = true;
    saveState.textContent = 'Live';
    await refreshList();
    message.replaceChildren('Published. ');
    const link = document.createElement('a');
    link.href = result.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open post ↗';
    message.append(link);
  } catch (error) {
    saveState.textContent = 'Draft saved locally';
    setMessage(error.message, true);
  } finally {
    setBusy(false);
  }
});
window.addEventListener('beforeunload', (event) => {
  if (!dirty) return;
  event.preventDefault();
});

fill({ date: today(), kind: 'note' });
