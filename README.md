# goblog-astro

一款简洁优雅的 Astro 博客主题，采用三栏式 PC 布局 + 移动端抽屉导航，支持暗色模式与代码高亮。

> **截图预览**：在此替换为你的博客截图（建议尺寸 1280×800）

---

## 功能特性

- **双端布局**：PC 三栏（侧栏 + 内容 + 右侧挂件）& 移动端抽屉导航，通过 Astro `client:media` 条件渲染
- **暗色模式**：基于 `localStorage` 持久化，切换无闪烁
- **代码高亮**：Shiki 双主题（`github-light` / `github-dark`），随暗色模式自动切换
- **全文搜索**：客户端搜索，覆盖标题、标签、摘要，无需后端
- **RSS & Sitemap**：自动生成，开箱即用
- **SEO 优化**：Canonical 链接、Open Graph、Twitter Card
- **主题色可配置**：在 `src/config.js` 中修改主色、侧栏色、背景色
- **标签分类 & 归档**：按标签过滤、按年月归档
- **阅读时间**：自动计算（字数 ÷ 300）
- **代码复制按钮**：文章内代码块一键复制，带动画反馈
- **图片放大（Lightbox）**：点击文章图片全屏预览
- **音乐播放器**（可选）：支持网易云 ID 或直接 MP3 URL
- **草稿 & 置顶**：Front Matter 字段控制，草稿仅 dev 可见
- **友链页 & 关于页**：内置专属页面
- **新建文章脚本**：`npm run new -- <slug>` 自动生成 Markdown 模板

---

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/yourname/goblog-astro.git
cd goblog-astro
npm install
```

### 2. 修改配置

打开 `src/config.js`，这是**唯一需要修改的配置文件**：

```js
export const config = {
  site: {
    url: 'https://your-domain.com',  // ⚠️ 必填，RSS 和 Sitemap 依赖此项
    name: 'My Blog',
    description: '我的个人博客',
  },
  author: {
    name: 'Your Name',
    tagline: 'Your tagline',
    // ...
  },
  theme: {
    accent:  '#2f9aa8',  // 主色调
    sidebar: '#243152',  // 侧栏颜色
    bgLight: '#ece8df',  // 浅色背景
    bgDark:  '#1a2640',  // 深色背景
  },
  // ...
};
```

### 3. 启动开发服务器

```bash
npm run dev
# 访问 http://localhost:4321
```

---

## 配置参考

所有配置项均在 `src/config.js`，注释已内联。

| 区块 | 说明 |
|------|------|
| `site` | 站点 URL、名称、描述（URL 必须是真实域名） |
| `author` | 博主姓名、签名、头像、关于页简介和统计数字 |
| `footer` | 建站年份、ICP 备案号（留空不显示） |
| `social` | GitHub / X / 微信账号（留空不显示对应图标） |
| `pagination` | 首页每页文章数（默认 9） |
| `theme` | 主色调、侧栏色、浅色/深色背景 |
| `calendar` | 侧栏日历小部件（静态装饰，每月手动更新） |

**友链**在 `src/data/links.js` 中单独管理。

**网易云 API**（音乐播放器可选功能）在根目录 `.env` 中配置：
```
PUBLIC_NETEASE_API=https://your-netease-api.example.com
```

---

## 写文章

### 新建文章

```bash
npm run new -- my-article-slug
# 自动在 src/content/blog/my-article-slug.md 生成模板
```

### Front Matter 字段

```yaml
---
title: "文章标题"
date: "2024-01-15 10:00"
tags: ["技术", "随笔"]
cover: 3              # 1–7 纯色色块，或 '/images/posts/xxx.jpg'
coverLabel: "cover"
draft: false          # true = 仅 dev 可见
pinned: false         # true = 置顶
excerpt: "自定义摘要（可选，不填则自动截取正文）"
---
```

---

## 命令一览

| 命令 | 功能 |
|------|------|
| `npm run dev` | 启动本地开发服务器（localhost:4321） |
| `npm run build` | 构建生产站点到 `./dist/` |
| `npm run preview` | 本地预览构建结果 |
| `npm run new -- <slug>` | 新建文章 |

---

## 部署

项目为纯静态输出（`output: 'static'`），可部署到任意静态托管平台。

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

在 Vercel 导入 Git 仓库，构建命令 `npm run build`，输出目录 `dist`，无需其他配置。

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

在 Netlify 导入仓库，构建命令 `npm run build`，发布目录 `dist`。

### GitHub Pages

在 `.github/workflows/deploy.yml` 中配置 Astro 官方 Action，参考 [Astro 文档](https://docs.astro.build/zh-cn/guides/deploy/github/)。

---

## 技术栈

- [Astro](https://astro.build/) v4 — 静态站点生成框架
- [React](https://react.dev/) v18 — 交互组件（仅客户端增强）
- [@astrojs/rss](https://docs.astro.build/zh-cn/guides/rss/) — RSS 生成
- [@astrojs/sitemap](https://docs.astro.build/zh-cn/guides/integrations-guide/sitemap/) — Sitemap 生成
- [Shiki](https://shiki.style/) — 代码语法高亮

---

## 协议

[MIT License](./LICENSE) — 自由使用、修改和分发，保留原始版权声明即可。
