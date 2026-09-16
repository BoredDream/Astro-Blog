// ── 每日格言：手动换一条 ────────────────────────────────────────────
// 格言列表由 [data-quote-list] 的 JSON 提供，初始下标来自 data-quote-index
// （构建期按日期算出的当日格言），点击按钮循环往后取一条。
document.querySelectorAll('[data-quote-widget]').forEach((root) => {
  const listEl = root.querySelector('[data-quote-list]');
  const textEl = root.querySelector('[data-quote-text]');
  const authorEl = root.querySelector('[data-quote-author]');
  const btn = root.querySelector('[data-quote-next]');
  if (!listEl || !textEl || !btn) return;

  let quotes = [];
  try {
    quotes = JSON.parse(listEl.textContent || '[]');
  } catch {
    quotes = [];
  }
  if (!quotes.length) return;

  let index = Number(root.getAttribute('data-quote-index')) || 0;

  btn.addEventListener('click', () => {
    index = (index + 1) % quotes.length;
    const quote = quotes[index];
    textEl.textContent = quote.text || '';
    if (authorEl) {
      authorEl.textContent = quote.author || '';
      authorEl.style.display = quote.author ? '' : 'none';
    }
    // 重新触发一次淡入，让切换有反馈
    root.classList.remove('is-swapping');
    void root.offsetWidth;
    root.classList.add('is-swapping');
  });
});
