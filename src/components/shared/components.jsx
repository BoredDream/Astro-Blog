// Shared components for the blog mobile clone
import { NAV_URL } from '../../lib/urls.js';
import { config } from '../../config.js';

// ───────────────────────────── Ink-circle brand mark ─────────────────────────────
function BrandMark({ size = 38, color, withText = true }) {
  const styleColor = color ? { color } : null;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={styleColor}>
      <path
        d="M27.5 5C14.2 5.4 5 16.2 6 28.4c1 11.4 10.9 21.3 22.4 21.4 12 .1 22-9.8 22.2-21.6.2-12.4-9.5-22.8-22-23.2-.4 0-.8 0-1.1 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M19 22h18M20 22l-2.5-4M36 22l2.5-4M21 30h14M28 22v14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ───────────────────────────── Header ─────────────────────────────
function Header({ onHamburger, brandName }) {
  return (
    <div className="header">
      <a className="brand" href="/">
        <BrandMark size={38} />
        <div className="brand-title serif">{brandName}</div>
      </a>
      <button className="hamburger" onClick={onHamburger} aria-label="menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  );
}

// ───────────────────────────── Floating widgets ─────────────────────────────
function FloatingMoon({ dark, onToggle }) {
  return (
    <button className="float-moon" onClick={onToggle} aria-label="toggle theme">
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>
        </svg>
      )}
    </button>
  );
}

// ───────────────────────────── Drawer (slide-out menu) ─────────────────────────────
function Drawer({ open, onClose, currentPage }) {
  const links = [
    { id: "home",     label: "首页", href: NAV_URL.home },
    { id: "category", label: "分类", href: NAV_URL.category },
    { id: "archive",  label: "归档", href: NAV_URL.archive },
    { id: "about",    label: "关于", href: NAV_URL.about },
    { id: "links",    label: "友链", href: NAV_URL.links },
  ];
  return (
    <>
      <div
        className="drawer-scrim"
        onClick={onClose}
        style={{
          background: open ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0)",
          pointerEvents: open ? "auto" : "none",
        }}
      ></div>
      <aside
        className="drawer"
        style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
      >
        <div className="drawer-head">
          <BrandMark size={56} color="#fff" />
        </div>
        <nav className="drawer-nav">
          {links.map(l => (
            <a
              key={l.id}
              className={"drawer-link serif" + (currentPage === l.id ? " active" : "")}
              href={l.href}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="drawer-social">
          {config.social.github && (
            <a href={config.social.github} title="GitHub" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.9 0-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"/>
              </svg>
            </a>
          )}
          {config.social.x && (
            <a href={config.social.x} title="X" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
          {config.social.wechat && (
            <button title={`微信：${config.social.wechat}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 4C5.4 4 2 6.9 2 10.5c0 2 1.1 3.9 2.8 5.1L4 18l2.6-1.4c.9.2 1.9.4 2.9.4.3 0 .5 0 .8-.1-.2-.5-.3-1.1-.3-1.7 0-3.3 3.2-6 7.1-6h.6C17.2 6.2 13.7 4 9.5 4zM7 9.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                <path d="M22 15.2c0-2.8-2.8-5.2-6.2-5.2s-6.2 2.3-6.2 5.2 2.8 5.2 6.2 5.2c.7 0 1.4-.1 2.1-.3l1.9 1-.5-1.7c1.6-.9 2.7-2.5 2.7-4.2zm-8.2-.8a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"/>
              </svg>
            </button>
          )}
          <a title="Search" href="/search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="m20 20-3.5-3.5"/>
            </svg>
          </a>
        </div>
      </aside>
    </>
  );
}

// ───────────────────────────── Post flags (置顶 / 草稿) ─────────────────────────────
function PostFlags({ post }) {
  if (!post || (!post.pinned && !post.draft)) return null;
  return (
    <div className="post-flags">
      {post.pinned && <span className="post-flag pinned">置顶</span>}
      {post.draft && <span className="post-flag draft">草稿</span>}
    </div>
  );
}

// ───────────────────────────── Image placeholder ─────────────────────────────
function Placeholder({ variant, label }) {
  if (typeof variant === 'string') {
    return (
      <img
        src={variant}
        alt={label || ''}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }
  return (
    <div className={`ph ph-${variant}`}>
      {label}
    </div>
  );
}

export { BrandMark, Header, FloatingMoon, Drawer, Placeholder, PostFlags };
