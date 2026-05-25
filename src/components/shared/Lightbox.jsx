import React from 'react';

// 图片点击放大遮罩。src 为空时不渲染。
function Lightbox({ src, alt, onClose }) {
  React.useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <img
        className="lightbox-img"
        src={src}
        alt={alt || ''}
        onClick={(e) => e.stopPropagation()}
      />
      <button className="lightbox-close" onClick={onClose} aria-label="关闭">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

export default Lightbox;
