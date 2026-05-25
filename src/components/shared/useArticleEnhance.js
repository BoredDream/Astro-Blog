import { useEffect, useRef } from 'react';

const COPY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const DONE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

/**
 * 文章正文客户端增强：代码块复制按钮、标题锚点、正文图片点击放大。
 * @param bodyRef 指向文章正文容器的 ref
 * @param onImageClick 点击正文图片时的回调 (src, alt)
 */
export function useArticleEnhance(bodyRef, onImageClick) {
  // 用 ref 持有回调，避免回调每次渲染变化导致 effect 重跑。
  const cbRef = useRef(onImageClick);
  cbRef.current = onImageClick;

  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;

    // 1. 代码块复制按钮
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
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = COPY_ICON;
          }, 1600);
        }).catch(() => {});
      });
      pre.appendChild(btn);
    });

    // 2. 标题锚点（Astro 已为标题生成 id）
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

    // 3. 正文图片点击放大
    const handlers = [];
    root.querySelectorAll('img').forEach((img) => {
      img.classList.add('zoomable');
      const handler = () => cbRef.current && cbRef.current(img.currentSrc || img.src, img.alt);
      img.addEventListener('click', handler);
      handlers.push([img, handler]);
    });

    return () => {
      handlers.forEach(([img, h]) => img.removeEventListener('click', h));
    };
  }, [bodyRef]);
}
