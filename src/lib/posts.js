import { getCollection } from 'astro:content';

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
