// 全站交互：主题切换、回到顶部、移动抽屉、右栏搜索回车跳转。
// 纯原生 JS，零依赖；由 Layout.astro 引入。

// ── 主题切换（明暗）─────────────────────────────────────────────
// aria-pressed 同步当前主题状态（暗色 = pressed）。
const syncThemeButtons = () => {
  const dark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  });
};
document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncThemeButtons();
  });
});
syncThemeButtons();

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

// ── 移动端抽屉（无障碍：ESC 关闭 + 打开聚焦 + Tab 焦点陷阱）─────
const drawer = document.querySelector('.drawer');
const scrim = document.querySelector('.drawer-scrim');
const hamburger = document.querySelector('[data-drawer-open]');
let lastFocus = null;
const setDrawer = (open) => {
  if (drawer) drawer.classList.toggle('open', open);
  if (scrim) scrim.classList.toggle('open', open);
  // 汉堡条 → X 动画
  if (hamburger) hamburger.classList.toggle('open', open);
  // 抽屉打开时锁定背景滚动
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    lastFocus = document.activeElement;
    const first = drawer && drawer.querySelector('nav a');
    if (first) first.focus();
  } else if (lastFocus) {
    lastFocus.focus();
    lastFocus = null;
  }
};
document.querySelectorAll('[data-drawer-open]').forEach((b) => b.addEventListener('click', () => setDrawer(true)));
document.querySelectorAll('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => setDrawer(false)));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !drawer || !drawer.classList.contains('open')) return;
  setDrawer(false);
});
if (drawer) {
  drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// ── 内容列高度 ≥ 右栏：rail 滑动停点与页脚底对齐 ───────────────
// PC 壳三栏布局下，右栏 sticky 的停点 = grid 行底（内容列底）。
// 内容列短于右栏时（分类/友链等页），把内容列 min-height 拉齐到右栏高度，
// 页脚随 flex 贴底，滚动到底时日历底部与 Copyright 平齐。
// 用 ResizeObserver 监听右栏高度（字体加载、缩放都会引起变化），始终同步。
const pcCenter = document.querySelector('.pc-center');
const pcRail = document.querySelector('.pc-rail');
if (pcCenter && pcRail) {
  const syncCenter = () => { pcCenter.style.minHeight = pcRail.offsetHeight + 'px'; };
  syncCenter();
  if (window.ResizeObserver) new ResizeObserver(syncCenter).observe(pcRail);
  else if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncCenter);
}

// ── 右栏搜索框：回车跳转到搜索页并携带关键词 ────────────────────
document.querySelectorAll('[data-rail-search]').forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = input.value.trim();
    window.location.href = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
  });
});
