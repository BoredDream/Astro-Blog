import { getCollection } from 'astro:content';
import { config } from '../config.js';

// dev 模式显示草稿，build（生产）时排除草稿。
const SHOW_DRAFTS = import.meta.env.DEV;

// 从 Markdown 正文提取纯文本摘要：剥离常见 Markdown 语法后取前 N 字。
function autoExcerpt(body, len = 120) {
  const text = String(body || '')
    .replace(/<!--[\s\S]*?-->/g, '')        // HTML 注释
    .replace(/```[\s\S]*?```/g, '')         // 代码围栏
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接 → 文字
    .replace(/^[#>\-*+\s]+/gm, '')          // 行首标记 # > - * +
    .replace(/[*_`~]/g, '')                 // 行内强调/代码符号
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > len ? text.slice(0, len) + '…' : text;
}

// 取博客集合条目：过滤草稿 + 排序（置顶优先，再按日期降序）。
// .astro 路由的 getStaticPaths 需要原始 entry（用于 entry.render()），故单独导出。
export async function getBlogEntries() {
  const entries = await getCollection('blog', ({ data }) => SHOW_DRAFTS || !data.draft);
  return entries.sort((a, b) => {
    if (!!a.data.pinned !== !!b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.date.localeCompare(a.data.date);
  });
}

// 取全部文章并映射为组件用的纯数据对象（缺摘要时自动生成）。
export async function getPosts() {
  const entries = await getBlogEntries();
  return entries.map((e) => ({
    id: e.slug,
    ...e.data,
    excerpt: e.data.excerpt || autoExcerpt(e.body),
  }));
}

// 文章页的上一篇 / 下一篇（按 posts 当前排序：置顶优先、再日期降序）。
export function getAdjacentPosts(posts, post) {
  const idx = post ? posts.findIndex((p) => p.id === post.id) : -1;
  return {
    prevPost: idx > 0 ? posts[idx - 1] : null,
    nextPost: idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

// 分页切片（分页逻辑的单一来源，含总页数）。
export function paginate(posts, pageNum = 1, pageSize = config.pagination.pageSize) {
  const totalPages = Math.ceil(posts.length / pageSize);
  const start = (pageNum - 1) * pageSize;
  return { pagePosts: posts.slice(start, start + pageSize), totalPages, pageNum };
}

// 标签计数，返回 [name, count][] 按数量降序。
export function getTagCounts(posts) {
  const tagMap = {};
  posts.forEach((p) => (p.tags || []).forEach((tag) => { tagMap[tag] = (tagMap[tag] || 0) + 1; }));
  return Object.entries(tagMap).sort((a, b) => b[1] - a[1]);
}

// 按单个标签过滤文章。
export function getPostsByTag(posts, tag) {
  return posts.filter((p) => (p.tags || []).includes(tag));
}
