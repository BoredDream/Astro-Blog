import React from 'react';
import { Placeholder } from '../shared/components.jsx';
import { postUrl, tagUrl } from '../../lib/urls.js';
import { useArticleEnhance } from '../shared/useArticleEnhance.js';
import Lightbox from '../shared/Lightbox.jsx';
import ReadingProgress from '../shared/ReadingProgress.jsx';

// 在 .env 中配置: PUBLIC_NETEASE_API=https://your-netease-api.example.com
const NETEASE_API = import.meta.env.PUBLIC_NETEASE_API || '';

function PCArticle({ post, posts, prevPost, nextPost, headings, readMin, children }) {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [audioSrc, setAudioSrc] = React.useState(post.audio?.audioUrl || '');

  React.useEffect(() => {
    if (!post.audio?.neteaseId || !NETEASE_API || audioSrc) return;
    fetch(`${NETEASE_API}/song/url?id=${post.audio.neteaseId}&br=320000`)
      .then(r => r.json())
      .then(data => {
        const url = data?.data?.[0]?.url;
        if (url) setAudioSrc(url);
      })
      .catch(() => {});
  }, []);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !audioSrc) return;
    if (playing) { el.pause(); } else { el.play().catch(() => {}); }
  };

  const seekTo = (e) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const related = posts
    ? posts.filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t))).slice(0, 2)
    : [];
  const hasHeadings = headings && headings.length > 0;

  const bodyRef = React.useRef(null);
  const [lightbox, setLightbox] = React.useState(null);
  const openLightbox = React.useCallback((src, alt) => setLightbox({ src, alt }), []);
  useArticleEnhance(bodyRef, openLightbox);

  return (
    <div className="pc-center">
      <ReadingProgress />
      <article className="pc-article">
        <header className="pc-article-head">
          <h1 className="pc-article-title">{post.title}</h1>
          <div className="pc-article-meta">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pc-article-date">{post.date}</span>
              {post.updated && post.updated.slice(0, 10) !== String(post.date).slice(0, 10) && (
                <span className="pc-article-updated">更新于 {post.updated.slice(0, 10)}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {readMin && <span className="pc-article-read-time">约 {readMin} 分钟</span>}
              {post.tags && post.tags[0] && (
                <a className="pc-article-cat" href={tagUrl(post.tags[0])}>{post.tags[0]}</a>
              )}
            </div>
          </div>
        </header>

        <div className="pc-article-cover">
          <Placeholder variant={post.cover} label={post.coverLabel} />
        </div>

        {post.audio && (
          <>
            <audio
              ref={audioRef}
              src={audioSrc || undefined}
              onLoadedMetadata={e => setDuration(e.target.duration)}
              onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
              onEnded={() => { setCurrentTime(0); if (audioRef.current) audioRef.current.currentTime = 0; }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <div className="pc-article-player">
              <div className="player-cover">
                <Placeholder variant={post.audio.cover || 1} label="audio" />
                <button
                  className="player-play"
                  onClick={togglePlay}
                  aria-label={playing ? "pause" : "play"}
                  style={!audioSrc ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                >
                  {playing ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#1a1d29">
                      <rect x="6" y="5" width="4" height="14" rx="1"/>
                      <rect x="14" y="5" width="4" height="14" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#1a1d29">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="player-body">
                <div>
                  <div className="player-track">
                    <span className="tname">{post.audio.title}</span>
                    <span className="tartist">- {post.audio.artist}</span>
                  </div>
                  {post.audio.lyrics && (
                    <div className="player-lyrics">{post.audio.lyrics}</div>
                  )}
                </div>
                <div className="player-bar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--pc-ink-3)" }}>
                    <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                  <span className="player-time">{fmt(currentTime)} / {fmt(duration)}</span>
                  <div
                    className="player-bar-track"
                    onClick={seekTo}
                    style={{ cursor: audioSrc ? 'pointer' : 'default' }}
                  >
                    <div
                      className="player-bar-fill"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pc-article-body" ref={bodyRef}>
          {children}
        </div>

        {post.endImage && (
          <div className="pc-article-end-image">
            <Placeholder variant={post.endImage.cover} label={post.endImage.label || "closing image"} />
          </div>
        )}

        <div className="pc-article-actions">
          <PCArticleLike count={post.likes || 0} postId={post.id} />
          <PCArticleShare />
        </div>

        {related.length > 0 && (
          <div className="pc-article-related">
            <div className="pc-article-related-title">相关文章</div>
            <div className="pc-article-related-grid">
              {related.map(p => (
                <a key={p.id} className="pc-article-related-card" href={postUrl(p)}>
                  <div className="pc-article-related-img">
                    <Placeholder variant={p.cover} label={p.coverLabel} />
                  </div>
                  <div className="pc-article-related-name">{p.title}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 评论功能已停用 <PCArticleComments count={post.comments || 0} /> */}

        {(prevPost || nextPost) && (
          <div className="pc-article-nav">
            {prevPost ? (
              <a className="pc-article-nav-item prev" href={postUrl(prevPost)}>
                <div className="pc-article-nav-label">← 上一篇</div>
                <div className="pc-article-nav-name">{prevPost.title}</div>
              </a>
            ) : (
              <div className="pc-article-nav-item prev" style={{ opacity: 0.3 }}>
                <div className="pc-article-nav-label">← 上一篇</div>
              </div>
            )}
            {nextPost ? (
              <a className="pc-article-nav-item next" href={postUrl(nextPost)}>
                <div className="pc-article-nav-label">下一篇 →</div>
                <div className="pc-article-nav-name">{nextPost.title}</div>
              </a>
            ) : (
              <div className="pc-article-nav-item next" style={{ opacity: 0.3 }}>
                <div className="pc-article-nav-label">下一篇 →</div>
              </div>
            )}
          </div>
        )}
      </article>

      {hasHeadings && (
        <PCArticleTOC headings={headings} />
      )}

      <Lightbox
        src={lightbox?.src}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}

function PCArticleLike({ count, postId }) {
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    try {
      setLiked(localStorage.getItem('like:' + postId) === '1');
    } catch (e) {}
  }, [postId]);

  const onClick = () => {
    setLiked(v => {
      const next = !v;
      try {
        if (next) localStorage.setItem('like:' + postId, '1');
        else localStorage.removeItem('like:' + postId);
      } catch (e) {}
      return next;
    });
  };

  const n = count + (liked ? 1 : 0);

  return (
    <button className={"pc-article-like" + (liked ? " liked" : "")} onClick={onClick}>
      <span>
        {liked ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 21s-7-4.5-9.5-9.2C.7 8 2.5 4 6.4 4c2 0 3.6 1.1 4.6 2.6C12 5.1 13.6 4 15.6 4c3.9 0 5.7 4 3.9 7.8C19 16.5 12 21 12 21z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 21s-7-4.5-9.5-9.2C.7 8 2.5 4 6.4 4c2 0 3.6 1.1 4.6 2.6C12 5.1 13.6 4 15.6 4c3.9 0 5.7 4 3.9 7.8C19 16.5 12 21 12 21z"/>
          </svg>
        )}
      </span>
      <span>{n}</span>
    </button>
  );
}

function PCArticleShare() {
  const [copied, setCopied] = React.useState(false);
  const copyLink = () => {
    navigator.clipboard && navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="pc-article-share">
      <button className={"pc-share-btn" + (copied ? " copied" : "")} onClick={copyLink} title="复制链接">
        <span className="pc-share-tip">已复制</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button className="pc-share-btn" title="分享到微博">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.098 20c-4.012 0-7.098-2.09-7.098-5.367 0-1.734.961-3.64 2.627-5.232C7.48 7.687 9.463 7 11.123 7c.547 0 .87.065 1.09.152-.226-.688-.34-1.404-.34-2.152C11.873 2.246 13.84 1 15.57 1c1.7 0 3.32 1.196 3.32 3.296 0 .832-.213 1.66-.646 2.456C19.873 7.496 21 9.11 21 11.045 21 16.065 16.287 20 10.098 20zM16.78 5.09c.246-.468.394-.964.394-1.482 0-.993-.666-1.608-1.604-1.608-.975 0-1.872.767-1.872 2.0 0 .557.152 1.065.431 1.51.352-.088.72-.13 1.112-.13.575 0 1.11.08 1.539.21z"/>
        </svg>
      </button>
      <button className="pc-share-btn" title="分享到 X">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>
    </div>
  );
}

const PC_SAMPLE_COMMENTS = [
  { name: "Zebin",    color: "#4a7fa5", date: "2026-05-13", text: "写得真好，很有共鸣。那种\"打开后台就能写\"的仪式感确实难以替代。" },
  { name: "一只喵",   color: "#a56b4a", date: "2026-05-14", text: "我也经历过同样的纠结，最后还是换回去了，哈哈。" },
  { name: "桃子",    color: "#7a5aa5", date: "2026-05-15", text: "轻盈未必是好事，这句话说得太对了。" },
  { name: "Edwin Z", color: "#4a8a6a", date: "2026-05-16", text: "期待下一篇，继续写下去！" },
];

function PCArticleComments({ count }) {
  return (
    <div className="pc-article-comments">
      <div className="pc-article-comments-head">
        <h3 className="pc-article-comments-title">留声</h3>
        <span className="pc-article-comments-count">{count} 条</span>
      </div>
      {PC_SAMPLE_COMMENTS.map((c, i) => (
        <div key={i} className="pc-comment">
          <div className="pc-comment-avatar" style={{ background: c.color }}>{c.name[0]}</div>
          <div className="pc-comment-body">
            <div className="pc-comment-meta">
              <span className="pc-comment-name">{c.name}</span>
              <span className="pc-comment-date">{c.date}</span>
            </div>
            <div className="pc-comment-text">{c.text}</div>
          </div>
        </div>
      ))}
      <div className="pc-comment-login">登录后参与讨论</div>
    </div>
  );
}

function PCArticleTOC({ headings }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        className={"pc-toc-bubble" + (open ? " hidden" : "")}
        onClick={() => setOpen(true)}
        aria-label="打开目录"
        title="目录"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
        </svg>
      </button>

      <div
        className={"pc-toc-scrim" + (open ? " open" : "")}
        onClick={() => setOpen(false)}
      ></div>

      <aside className={"pc-toc-panel" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="pc-toc-panel-head">
          <span className="pc-toc-panel-title serif">目录</span>
          <button className="pc-toc-close" onClick={() => setOpen(false)} aria-label="关闭目录">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <nav className="pc-toc-panel-list">
          {headings.map((h, i) => (
            <a
              key={i}
              className={`pc-toc-item h${h.depth}`}
              href={`#${h.slug}`}
              onClick={() => setOpen(false)}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

export { PCArticle, PCArticleLike, PCArticleShare, PCArticleComments, PCArticleTOC };
