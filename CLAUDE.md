# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server at http://localhost:4321 (drafts are visible here only)
- `npm run build` — static build to `./dist/` (drafts excluded)
- `npm run preview` — serve the built `./dist/`
- `npm run new -- <slug>` — scaffold `src/content/blog/<slug>.md` from the template; slug must match `^[a-z0-9][a-z0-9-]*$`

There is no test suite, linter, or formatter configured.

## Architecture

Astro v4 static site generator, `output: 'static'`. The design goal is **zero client-side framework runtime** — pages are server-rendered to HTML at build time and progressively enhanced with a small amount of hand-written vanilla JS. (The codebase was migrated from React/JSX components to pure `.astro`; do not reintroduce a UI framework.)

### Dual-shell rendering (the core pattern)

Every page route renders **both** a PC shell and a mobile shell into the same `Layout`, and CSS breakpoints decide which one is visible. A typical page (e.g. `src/pages/index.astro`) looks like:

```astro
<Layout ...>
  <PCShell page="home" posts={posts} pageNum={1} />
  <MobileShell page="home" posts={posts} pageNum={1} />
</Layout>
```

- `src/components/pc/PCShell.astro` and `src/components/mobile/MobileShell.astro` each take a `page` prop (`home` | `article` | `category` | `archive` | `about` | `links` | `search` | `tag` | `404`) and switch on it to render the matching sub-component. **Adding a new page type means handling it in both shells.**
- Layout breakpoints live in `public/styles/pc.css` and `public/styles/mobile.css` — these are plain static stylesheets linked from `Layout.astro`, **not** Astro scoped/component styles. Visual changes go here.

### Data flow

- `src/lib/posts.js` is the single source for post data:
  - `getBlogEntries()` — raw content-collection entries (filters drafts, sorts **pinned-first then date desc**). Use this in `getStaticPaths` and wherever you need `entry.render()`.
  - `getPosts()` — entries mapped to plain objects (`id` = slug, spreads `data`, auto-generates `excerpt` from body when missing). Use this for passing data into shells/components.
- `src/lib/urls.js` owns all URL construction. Article permalinks are `/<year>/<month>/<slug>` derived from the post `date` (route file: `src/pages/[year]/[month]/[slug].astro`). Home pagination is `/` then `/page/N`. Use these helpers rather than hardcoding paths.
- `src/content/config.ts` defines the `blog` collection schema (Zod). Front-matter fields, `cover` (number 1–7 placeholder OR image path string), optional `audio` player, `draft`/`pinned`, etc. are validated here.

### Configuration

- `src/config.js` is the intended single config file (site, author, footer, social, pagination, theme colors, quotes). Theme colors are injected as CSS custom properties via `define:vars={config.theme}` in `Layout.astro`.
- `src/data/links.js` — friend-links data (managed separately).
- `.env` — `PUBLIC_NETEASE_API` for the optional NetEase music player.

### Client-side scripts

Vanilla JS in `src/scripts/`, imported via `<script>` tags (so Astro bundles them):
- `global.js` — imported by `Layout.astro` on every page (theme toggle, back-to-top, mobile drawer, rail search). Theme is applied pre-paint by an inline script in `<head>` reading `localStorage.theme`.
- `article.js` — imported only on the article route (code-copy, heading anchors, image lightbox, reading progress, TOC, like, copy-link, audio player).
- `search.js` — imported on `search.astro`, which serializes a minimal post index into a `<script type="application/json">` tag for client-side full-text search.

### Build-time integrations

- RSS at `/rss.xml` (`src/pages/rss.xml.js`) and sitemap (`@astrojs/sitemap`) — both depend on `config.site.url` being a real domain.
- Shiki dual-theme highlighting (`github-light`/`github-dark`, `defaultColor: false`) switches with dark mode; configured in `astro.config.mjs`, which also defines an inline `rehypeLazyImages` plugin adding `loading=lazy` to markdown images.
- `lunar-javascript` powers the sidebar lunar calendar — build-time only, never shipped to the client.
