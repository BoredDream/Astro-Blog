// 站点 URL 辅助函数 —— 路由 .astro 与 React 组件共用。
// 文章固定链接结构：/年/月/文章名（如 /2026/04/compromise）。

// 从文章对象提取 { year, month, slug }。date 形如 "2026-04-15 09:30"。
export function postParams(post) {
  const [datePart] = String(post.date).split(' ');
  const [year, month] = datePart.split('-');
  return { year, month, slug: post.id };
}

// 文章页 URL。
export function postUrl(post) {
  const { year, month, slug } = postParams(post);
  return `/${year}/${month}/${slug}`;
}

// 某标签下的文章列表 URL。
export function tagUrl(tag) {
  return `/categories/${encodeURIComponent(tag)}`;
}

// 首页分页 URL：第 1 页为 /，其余为 /page/N。
export function pageUrl(n) {
  return n <= 1 ? '/' : `/page/${n}`;
}

// 顶层导航 URL。
export const NAV_URL = {
  home: '/',
  category: '/categories',
  archive: '/archives',
  about: '/about',
  links: '/links',
  search: '/search',
};
