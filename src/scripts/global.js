// 全站交互：主题切换、回到顶部、移动抽屉、右栏搜索回车跳转。
// 纯原生 JS，零依赖；由 Layout.astro 引入。

// ── 主题切换（明暗）─────────────────────────────────────────────
document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });
});

// ── 回到顶部（PC 与移动均监听 window，文档随 body 滚动）──────────
document.querySelectorAll('[data-scroll-top]').forEach((btn) => {
  const watch = btn.getAttribute('data-scroll-watch') || 'window';
  const isWindow = watch === 'window';
  const target = isWindow ? window : document.querySelector(watch);
  if (!target) return;
  const threshold = isWindow ? 400 : 300;
  const getTop = () => (isWindow ? window.scrollY : target.scrollTop);
  const onScroll = () => btn.classList.toggle('visible', getTop() > threshold);
  target.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', () => {
    target.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ── 移动端抽屉 ──────────────────────────────────────────────────
const drawer = document.querySelector('.drawer');
const scrim = document.querySelector('.drawer-scrim');
const setDrawer = (open) => {
  if (drawer) drawer.classList.toggle('open', open);
  if (scrim) scrim.classList.toggle('open', open);
};
document.querySelectorAll('[data-drawer-open]').forEach((b) => b.addEventListener('click', () => setDrawer(true)));
document.querySelectorAll('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => setDrawer(false)));

// ── 右栏搜索框：回车跳转到搜索页 ────────────────────────────────
document.querySelectorAll('[data-rail-search]').forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.location.href = '/search';
  });
});
