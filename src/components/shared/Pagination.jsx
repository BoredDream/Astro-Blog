import { pageUrl } from '../../lib/urls.js';

// 生成页码序列：首页 + 尾页 + 当前页 ±2，其余用省略号。
function buildPages(current, total) {
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  const pages = [1];
  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('…');
  if (total > 1) pages.push(total);
  return pages;
}

function Pagination({ current = 1, total = 1, className = 'pc-pagination' }) {
  if (!total || total <= 1) return null;
  const pages = buildPages(current, total);

  return (
    <nav className={className} aria-label="分页导航">
      {current > 1
        ? <a className="pg-arrow" href={pageUrl(current - 1)} aria-label="上一页">‹</a>
        : <span className="pg-arrow disabled" aria-hidden="true">‹</span>}

      {pages.map((p, i) =>
        p === '…'
          ? <span key={`e${i}`} className="ellipsis">…</span>
          : p === current
            ? <span key={p} className="active" aria-current="page">{p}</span>
            : <a key={p} href={pageUrl(p)}>{p}</a>
      )}

      {current < total
        ? <a className="pg-arrow" href={pageUrl(current + 1)} aria-label="下一页">›</a>
        : <span className="pg-arrow disabled" aria-hidden="true">›</span>}
    </nav>
  );
}

export default Pagination;
