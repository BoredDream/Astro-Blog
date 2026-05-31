// 客户端搜索：读取页面内嵌的 #search-data，按标题/标签/摘要过滤。
// 同时驱动 PC（.pc-search-page）与移动端两套搜索界面。

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function postUrl(p) {
  const [d] = String(p.date).split(' ');
  const [y, m] = d.split('-');
  return `/${y}/${m}/${p.id}`;
}

function placeholder(cover, label) {
  if (typeof cover === 'string') {
    return `<img src="${esc(cover)}" alt="${esc(label)}" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`;
  }
  return `<div class="ph ph-${esc(cover)}">${esc(label)}</div>`;
}

function pcCard(p) {
  const tags = (p.tags || []).slice(0, 2).map((t) => `<span class="tag" style="font-size:12px">${esc(t)}</span>`).join('');
  return `<a class="pc-card" href="${postUrl(p)}">`
    + `<div class="pc-card-img">${placeholder(p.cover, p.coverLabel)}</div>`
    + `<div class="pc-card-body">`
    + `<div><h3 class="pc-card-title">${esc(p.title)}</h3>${p.excerpt ? `<p class="pc-card-excerpt">${esc(p.excerpt)}</p>` : ''}</div>`
    + `<div class="pc-card-foot"><span>${esc(String(p.date).slice(0, 10))}</span><div class="pc-card-meta">${tags}</div></div>`
    + `</div></a>`;
}

function mobileEntry(p) {
  return `<a class="arch-entry" href="${postUrl(p)}" style="margin:0 16px;border-left:none;border-bottom:1px solid var(--hair);padding:14px 0">`
    + `<div>`
    + `<div style="font-size:15px;color:var(--ink);font-family:Noto Serif SC,serif;margin-bottom:4px">${esc(p.title)}</div>`
    + `${p.excerpt ? `<div style="font-size:13px;color:var(--ink-3);line-height:1.6">${esc(p.excerpt)}</div>` : ''}`
    + `</div></a>`;
}

function initSearch(root, posts) {
  const input = root.querySelector('[data-search-input]');
  const hot = root.querySelector('[data-search-hot]');
  const empty = root.querySelector('[data-search-empty]');
  const results = root.querySelector('[data-search-results]');
  const cancel = root.querySelector('[data-search-cancel]');
  const isPc = root.classList.contains('pc-search-page');
  if (!input) return;

  if (cancel) cancel.addEventListener('click', () => history.back());

  const render = () => {
    const q = input.value.trim();
    if (!q) {
      if (hot) hot.hidden = false;
      if (empty) empty.hidden = true;
      if (results) results.innerHTML = '';
      return;
    }
    if (hot) hot.hidden = true;
    const matched = posts.filter((p) =>
      p.title.includes(q) ||
      (p.tags || []).some((t) => t.includes(q)) ||
      (p.excerpt && p.excerpt.includes(q))
    );
    if (!matched.length) {
      if (results) results.innerHTML = '';
      if (empty) {
        empty.hidden = false;
        empty.innerHTML = isPc ? `未找到“<strong>${esc(q)}</strong>”相关文章` : '未找到相关文章';
      }
      return;
    }
    if (empty) empty.hidden = true;
    if (results) results.innerHTML = matched.map((p) => (isPc ? pcCard(p) : mobileEntry(p))).join('');
  };

  input.addEventListener('input', render);
  render();
}

const dataEl = document.getElementById('search-data');
if (dataEl) {
  let posts = [];
  try { posts = JSON.parse(dataEl.textContent || '[]'); } catch (e) {}
  document.querySelectorAll('[data-search-root]').forEach((root) => initSearch(root, posts));
}
