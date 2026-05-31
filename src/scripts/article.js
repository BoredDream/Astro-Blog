// 文章页交互：代码复制、标题锚点、图片灯箱、阅读进度、目录面板、
// 点赞、复制链接、音频播放器。纯原生 JS，仅在文章页引入。

const COPY_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const DONE_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

// ── 灯箱（按需创建单一遮罩）─────────────────────────────────────
let lightboxEl = null;
function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.remove();
  lightboxEl = null;
  document.body.style.overflow = '';
}
function openLightbox(src, alt) {
  closeLightbox();
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  const img = document.createElement('img');
  img.className = 'lightbox-img';
  img.src = src;
  img.alt = alt || '';
  img.addEventListener('click', (e) => e.stopPropagation());
  const close = document.createElement('button');
  close.className = 'lightbox-close';
  close.setAttribute('aria-label', '关闭');
  close.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  box.appendChild(img);
  box.appendChild(close);
  box.addEventListener('click', closeLightbox);
  document.body.appendChild(box);
  document.body.style.overflow = 'hidden';
  lightboxEl = box;
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ── 正文增强：复制按钮、标题锚点、图片放大 ──────────────────────
document.querySelectorAll('[data-article-body]').forEach((root) => {
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.dataset.enhanced) return;
    pre.dataset.enhanced = '1';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.setAttribute('aria-label', '复制代码');
    btn.innerHTML = COPY_ICON;
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = DONE_ICON;
        setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = COPY_ICON; }, 1600);
      }).catch(() => {});
    });
    pre.appendChild(btn);
  });

  root.querySelectorAll('h2[id], h3[id]').forEach((h) => {
    if (h.dataset.enhanced) return;
    h.dataset.enhanced = '1';
    const a = document.createElement('a');
    a.className = 'heading-anchor';
    a.href = '#' + h.id;
    a.textContent = '#';
    a.setAttribute('aria-hidden', 'true');
    h.appendChild(a);
  });

  root.querySelectorAll('img').forEach((img) => {
    img.classList.add('zoomable');
    img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
  });
});

// ── 阅读进度条 ─────────────────────────────────────────────────
document.querySelectorAll('[data-reading-progress]').forEach((bar) => {
  const watch = bar.getAttribute('data-reading-progress');
  const el = watch === 'window' ? null : document.querySelector(watch);
  const target = el || window;
  const compute = () => {
    let top, sh, ch;
    if (el) { top = el.scrollTop; sh = el.scrollHeight; ch = el.clientHeight; }
    else { const d = document.documentElement; top = d.scrollTop || document.body.scrollTop; sh = d.scrollHeight; ch = d.clientHeight; }
    const max = sh - ch;
    bar.style.width = (max > 0 ? Math.min(100, (top / max) * 100) : 0) + '%';
  };
  compute();
  target.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute);
});

// ── 目录面板 ───────────────────────────────────────────────────
(function initToc() {
  const bubble = document.querySelector('.pc-toc-bubble');
  const panel = document.querySelector('.pc-toc-panel');
  const scrim = document.querySelector('.pc-toc-scrim');
  if (!panel) return;
  const set = (open) => {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    if (scrim) scrim.classList.toggle('open', open);
    if (bubble) bubble.classList.toggle('hidden', open);
  };
  document.querySelectorAll('[data-toc-open]').forEach((b) => b.addEventListener('click', () => set(true)));
  document.querySelectorAll('[data-toc-close]').forEach((b) => b.addEventListener('click', () => set(false)));
  document.querySelectorAll('[data-toc-link]').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();

// ── 点赞（localStorage 记忆）────────────────────────────────────
document.querySelectorAll('[data-like-btn]').forEach((btn) => {
  const id = btn.getAttribute('data-post-id');
  const base = parseInt(btn.getAttribute('data-like-count') || '0', 10);
  const numEl = btn.querySelector('[data-like-num]');
  let liked = false;
  try { liked = localStorage.getItem('like:' + id) === '1'; } catch (e) {}
  const render = () => {
    btn.classList.toggle('liked', liked);
    if (numEl) numEl.textContent = String(base + (liked ? 1 : 0));
  };
  render();
  btn.addEventListener('click', () => {
    liked = !liked;
    try { liked ? localStorage.setItem('like:' + id, '1') : localStorage.removeItem('like:' + id); } catch (e) {}
    render();
  });
});

// ── 复制链接分享 ───────────────────────────────────────────────
document.querySelectorAll('[data-copy-link]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).catch(() => {});
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  });
});

// ── 音频播放器（支持直链 / 网易云 API）─────────────────────────
const NETEASE_API = import.meta.env.PUBLIC_NETEASE_API || '';
const fmtTime = (s) => {
  s = s || 0;
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
};
document.querySelectorAll('[data-audio-player]').forEach((root) => {
  const audio = root.querySelector('[data-audio-el]');
  const toggle = root.querySelector('[data-audio-toggle]');
  const seek = root.querySelector('[data-audio-seek]');
  const fill = root.querySelector('[data-audio-fill]');
  const timeEl = root.querySelector('[data-audio-time]');
  const iconPlay = root.querySelector('.icon-play');
  const iconPause = root.querySelector('.icon-pause');
  if (!audio) return;

  const setEnabled = (on) => {
    if (!toggle) return;
    toggle.style.opacity = on ? '' : '0.4';
    toggle.style.cursor = on ? '' : 'not-allowed';
  };

  const directUrl = root.getAttribute('data-audio-url');
  const neteaseId = root.getAttribute('data-netease-id');
  if (directUrl) {
    audio.src = directUrl;
  } else if (neteaseId && NETEASE_API) {
    setEnabled(false);
    fetch(`${NETEASE_API}/song/url?id=${neteaseId}&br=320000`)
      .then((r) => r.json())
      .then((d) => {
        const u = d && d.data && d.data[0] && d.data[0].url;
        if (u) { audio.src = u; setEnabled(true); }
      })
      .catch(() => {});
  } else {
    setEnabled(false);
  }

  if (toggle) toggle.addEventListener('click', () => {
    if (!audio.src) return;
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  audio.addEventListener('play', () => {
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = '';
  });
  audio.addEventListener('pause', () => {
    if (iconPlay) iconPlay.style.display = '';
    if (iconPause) iconPause.style.display = 'none';
  });
  audio.addEventListener('loadedmetadata', () => {
    if (timeEl) timeEl.textContent = fmtTime(0) + ' / ' + fmtTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (fill && audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    if (timeEl) timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    if (fill) fill.style.width = '0%';
  });
  if (seek) seek.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = seek.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
});
