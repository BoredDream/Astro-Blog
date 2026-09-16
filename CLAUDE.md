# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

- `npm run dev` — 开发服务器 http://localhost:4321（**只有此模式下草稿可见**）
- `npm run build` — 静态构建到 `./dist/`（草稿被排除）
- `npm run preview` — 预览构建产物
- `npm run new -- <slug>` — 生成 `src/content/blog/<slug>.md`；slug 必须匹配 `^[a-z0-9][a-z0-9-]*$`

没有测试、lint、格式化工具。

## 架构

Astro v4 静态站点（`output: 'static'`）。核心设计目标是**零客户端框架运行时**：页面在构建期渲染为 HTML，仅用少量手写原生 JS 做渐进增强。代码库是从 React/JSX 迁移到纯 `.astro` 的，**不要重新引入 UI 框架**。

### 双外壳渲染（最重要的模式）

每个路由都同时渲染 PC 外壳与移动外壳，由 CSS 断点决定显示哪一个：

```astro
<Layout ...>
  <PCShell page="home" posts={posts} pageNum={1} />
  <MobileShell page="home" posts={posts} pageNum={1} />
</Layout>
```

- `src/components/pc/PCShell.astro` 与 `src/components/mobile/MobileShell.astro` 各接收 `page` prop（`home` | `article` | `category` | `archive` | `about` | `links` | `search` | `tag` | `404`）并 switch 到对应子组件。**新增页面类型必须两个外壳都改。**
- 文章正文通过 `<slot />` 传入，PC 与移动各渲染一次，因此正文在输出 HTML 中出现**两遍**（这是刻意的，不是 bug）。
- 断点与视觉样式的唯一来源是 `public/styles/pc.css` 和 `public/styles/mobile.css`，由 `Layout.astro` 以普通 `<link>` 引入，**不是** Astro 组件作用域样式。视觉改动写这里。

### 数据流

`src/lib/posts.js` 是文章数据的唯一来源：

- `getBlogEntries()` — 原始集合条目（过滤草稿，置顶优先再按日期降序）。`getStaticPaths` 及需要 `entry.render()` 处使用。
- `getPosts()` — 映射为纯对象（`id` = slug，展开 frontmatter，`excerpt` 与 `relTime` 缺失时自动生成）。传给外壳/组件用这个。
- 辅助函数：`getAdjacentPosts`（上/下一篇）、`paginate`（分页切片，返回 `pagePosts`/`totalPages`）、`getTagCounts`、`getPostsByTag`。
- 草稿可见性由 `import.meta.env.DEV` 决定（`SHOW_DRAFTS`）。

`src/lib/urls.js` 拥有全部 URL 构造：文章永久链接 `/<year>/<month>/<slug>`（由 `date` 推导，路由文件 `src/pages/[year]/[month]/[slug].astro`）、首页分页 `/` 与 `/page/N`、标签页 `/categories/<tag>`、`NAV_URL`。不要硬编码路径。

`src/content/config.ts` 用 Zod 定义 `blog` 集合 schema：`cover` 既可以是 1–7 纯色占位符数字，也可以是图片路径；还有可选 `audio` 播放器与 `endImage` 尾图，以及 `draft`/`pinned`/`views`/`likes`/`updated` 等。

### 构建期与客户端的分工

- `Layout.astro` 负责全部 SEO：canonical、Open Graph（文章页 `og:type=article` + `og:image`）、Twitter Card、JSON-LD（由 `jsonLd` prop 传入）、RSS `<link>`、自托管字体，以及用 `define:vars={config.theme}` 注入主题色 CSS 变量。`<head>` 里有一段内联脚本在**绘制前**读取 `localStorage.theme` 给 `<html>` 加 `.dark` 防止闪烁。
- `src/scripts/` 下的原生 JS 通过 `<script>` 标签引入以便 Astro 打包：`global.js`（每页：主题切换、回到顶部、移动抽屉、右栏搜索）、`article.js`（仅文章页：代码复制、标题锚点、灯箱、阅读进度、TOC、点赞、复制链接、音频播放器）、`search.js`（`search.astro` 会把精简后的文章索引序列化进 `<script type="application/json" id="search-data">`）、`quote.js`（格言"换一条"）、`music.js`（PC 侧栏迷你播放器）。后两者由组件就近引入：`pc/Rail.astro` 引入 `quote.js`，`mobile/Drawer.astro` 也引入同一份 `quote.js`（两端共用），`pc/Sidebar.astro` 引入 `music.js`。**脚本与模板之间的约定是 `data-*` 属性**：`data-theme-toggle`、`data-scroll-top`、`data-drawer-open`/`data-drawer-close`、`data-article-body`、`data-toc-open`/`data-toc-close`/`data-toc-link`、`data-quote-widget`/`data-quote-next`/`data-quote-text`/`data-quote-author`/`data-quote-list`、`data-music-player`/`data-music-el`。改模板时不要删这些属性。格言列表由 `[data-quote-list]` 上的 JSON（`config.quotes` 序列化）提供。
- 文章页在 `[slug].astro` 内计算 `headings`（来自 `entry.render()`）与 `readMin`（正文去空白 ÷ 300，最小 1），再向下传给两个外壳。
- 日期相关的展示全部在**构建期**算好：`src/lib/quotes.js` 的 `getDailyQuote()` 按一年中的第几天在 `config.quotes` 里取当日格言，PC 右栏与移动抽屉共用同一函数以保证两端当天一致。

### 配置与环境

- `src/config.js` 是唯一配置文件（站点、作者、页脚/备案、社交、音乐、分页、主题色、格言）。`config.site.url` 必须是真实域名——RSS、sitemap、canonical 都依赖它。
- `config.js` 顶部有两个模块级常量：`SINCE_YEAR`（关于页"写作年限"的起算年）与 `GITHUB_USER`（社交链接与关于页头像共用）。
- `config.author.stats` **是函数不是数组**：`stats(postCount)` 返回统计项，写作年限按当前年份算、累计文章取实际文章数。调用方必须传 `postCount`（两个外壳已传 `posts.length`），加字段时注意同步 `pc/pages/About.astro` 与 `mobile/About.astro`。
- `config.author.tagline` 留空则不渲染署名行（模板里是 `{config.author.tagline && ...}`），默认就是空串。
- `config.music.tracks` 驱动 PC 侧栏迷你播放器，每首二选一填 `neteaseId`（经 `PUBLIC_NETEASE_API` 换播放地址）或 `url`（直链）。
- `src/data/links.js` — 友链数据，单独管理。
- 根目录 `.env`：`PUBLIC_NETEASE_API`（可选网易云播放器，见 `.env.example`）。

### 构建期集成

- `astro.config.mjs`：`@astrojs/sitemap`、viewport 预取、Shiki 双主题（`github-light`/`github-dark`，`defaultColor: false`，随暗色模式切换）、内联 `rehypeLazyImages` 插件给正文 `<img>` 补 `loading=lazy`/`decoding=async`、远程图片 `remotePatterns`。
- RSS 在 `/rss.xml`（`src/pages/rss.xml.js`）。
- 字体自托管（`@fontsource/noto-serif-sc`、`@fontsource/jetbrains-mono`），不依赖 Google Fonts。Vercel Analytics 在 `Layout.astro` 末尾引入。

### `api/like.js`（Vercel Serverless Function）

不在 Astro 构建内，是 Vercel 函数：点赞计数持久化在 Upstash Redis REST。`GET /api/like?id=…` 读取，`POST { id, action }`（`like`/`unlike`）写入，`id` 必须匹配 `^[A-Za-z0-9_-]{1,64}$`。需要 Vercel 环境变量 `UPSTASH_REDIS_REST_URL` 与 `UPSTASH_REDIS_REST_TOKEN`。

**关键契约**：环境变量缺失或 Upstash 请求失败时返回 `{ count: null }`，前端据此回退为纯 `localStorage` 记忆。这正是"点赞功能可选"的实现方式——改动此文件时不要破坏这条降级路径。

### 新增文章

`npm run new -- <slug>` 在 `scripts/new-post.mjs` 里**内联**了一份 frontmatter 模板，而 `src/content/blog/_template.md` 是另一份独立模板（下划线前缀让 Astro 忽略它，不会被当成文章）。两者内容相近但不共享代码，改模板时需同步两处。

## 易踩的坑

- 所有跟"今天"有关的内容都在构建期固化：`relTime`（"3 天前"）与当日格言（`getDailyQuote()`）都是如此。静态站点不重新构建，它们跨天也不会变——这是刻意的取舍，不是 bug。
- 文章正文在输出 HTML 中出现两次（PC + 移动各一份），检查渲染结果时不要误判为重复 bug。
- `dist/`、`.astro/` 是生成物，`.zcode/` 是本地计划目录，均已在 `.gitignore` 中。
