# Arian Haghparast's portfolio and journal

A static Astro site with selected work and a Markdown journal. Only files inside `website` are part of the site; the private master resume in the parent directory is not published.

## Run locally

```bash
cd website
npm install
npm run write
```

Visit `http://127.0.0.1:4322/` to write. The command also starts the site preview at `http://127.0.0.1:4321/` if it is not already running. Both servers listen only on this computer. Run `npm run check`, `npm run test:writer`, and `npm run build` to verify changes.

## Publish writing

The writing screen has a title, Note/Essay choice, date, optional summary, Markdown text box, and preview. **Save draft** keeps a private JSON draft in `.local-drafts/`, which is ignored by Git. **Publish** checks and builds the site, commits only that post to `main`, pushes it to GitHub, and updates the live `gh-pages` branch. If a step fails, the draft remains on this computer. Published posts appear on the homepage, writing archive, and RSS feed. Future-dated posts stay unpublished until their date.

For file-based editing, `npm run new:note -- "Title"` and `npm run new:essay -- "Title"` still create Markdown drafts in `src/content/posts/`. The templates in `templates/` show both formats.

Each post supports standard Markdown, fenced code, images, footnotes, and `$inline$` or `$$display$$` math. Put images in `public/images/` and reference them from a post as `../../images/name.jpg` so links also work on a GitHub Pages subpath.

The public resume's source is `src/pages/resume.astro`. After editing it, open `/resume/` in the local preview and use your browser's Print to PDF action to refresh `public/resume.pdf`. Review both PDF pages and make sure the exported text contains only contact details you intend to publish.

## Deploy

The source is the `main` branch of `Arianhgh/Arianhgh.github.io`; the compiled site is published from `gh-pages` at `https://arianhgh.github.io/`. To deploy site changes outside the writing screen, commit and push `main`, then run `npm run deploy`. The old React version is preserved on `backup/portfolio-before-redesign-2026-09-30`.
