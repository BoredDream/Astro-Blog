import React from 'react';
import { Placeholder } from '../shared/components.jsx';
import { postUrl, tagUrl } from '../../lib/urls.js';
import { useArticleEnhance } from '../shared/useArticleEnhance.js';
import Lightbox from '../shared/Lightbox.jsx';
import ReadingProgress from '../shared/ReadingProgress.jsx';

const NETEASE_API = import.meta.env.PUBLIC_NETEASE_API || '';

function ArticlePage({ post, posts, prevPost, nextPost, readMin, children }) {
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

  const bodyRef = React.useRef(null);
  const [lightbox, setLightbox] = React.useState(null);
  const openLightbox = React.useCallback((src, alt) => setLightbox({ src, alt }), []);
  useArticleEnhance(bodyRef, openLightbox);

  return (
    <div>
      <ReadingProgress scrollTarget=".app-scroll" />
      <header className="article-head">
        <h1 className="article-title serif">{post.title}</h1>
        <div className="article-date" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span>{post.date}</span>
          {post.updated && post.updated.slice(0, 10) !== String(post.date).slice(0, 10) && (
            <span style={{ color: "var(--ink-4)", fontSize: 12 }}>更新于 {post.updated.slice(0, 10)}</span>
          )}
          {readMin && <span style={{ color: "var(--ink-4)", fontSize: 12 }}>约 {readMin} 分钟</span>}
        </div>
        <div className="article-tags">
          {post.tags.map(t => (
            <a key={t} className="tag" href={tagUrl(t)}>{t}</a>
          ))}
        </div>
      </header>

      <div className="article-cover">
        <Placeholder variant={post.cover} label={post.coverLabel} />
      </div>

      <div className="article-body" ref={bodyRef}>
        {children}
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
          <div className="player">
            <div className="player-cover">
              <Placeholder variant={post.audio.cover} label="audio art" />
              <button
                className="player-play"
                onClick={togglePlay}
                style={{ position: 'absolute', ...(!audioSrc ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
                aria-label={playing ? "pause" : "play"}
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1d29">
                    <rect x="6" y="5" width="4" height="14" rx="1"/>
                    <rect x="14" y="5" width="4" height="14" rx="1"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1d29">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="player-body">
              <div>
                <div className="player-track-info">
                  <span className="tname serif">{post.audio.title}</span>
                  <span className="tartist">- {post.audio.artist}</span>
                </div>
                <div className="player-meta">
                  <div>作词：{post.audio.lyricist || "无"}</div>
                  <div>作曲：{post.audio.composer || "无"}</div>
                </div>
              </div>
              <div className="player-bar">
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
                <div className="player-time">
                  {fmt(currentTime)} / {fmt(duration)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {post.endImage && (
        <div className="article-end-image">
          <Placeholder variant={post.endImage.cover} label={post.endImage.label || "closing image"} />
        </div>
      )}

      {post.likes !== undefined && (
        <div className="article-like-wrap">
          <ArticleLike count={post.likes} postId={post.id} />
        </div>
      )}

      <ArticleShare />

      {related.length > 0 && (
        <ArticleRelated posts={related} />
      )}

      {/* 评论功能已停用 <ArticleComments count={post.comments || 0} /> */}

      {(prevPost || nextPost) && (
        <ArticleNav prev={prevPost} next={nextPost} />
      )}

      <Lightbox
        src={lightbox?.src}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}

function ArticleLike({ count, postId }) {
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
    <button className={"article-like" + (liked ? " liked" : "")} onClick={onClick} aria-label="like">
      <span className="heart">
        {liked ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 21s-7-4.5-9.5-9.2C.7 8 2.5 4 6.4 4c2 0 3.6 1.1 4.6 2.6C12 5.1 13.6 4 15.6 4c3.9 0 5.7 4 3.9 7.8C19 16.5 12 21 12 21z"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 21s-7-4.5-9.5-9.2C.7 8 2.5 4 6.4 4c2 0 3.6 1.1 4.6 2.6C12 5.1 13.6 4 15.6 4c3.9 0 5.7 4 3.9 7.8C19 16.5 12 21 12 21z"/>
          </svg>
        )}
      </span>
      <span className="count">{n}</span>
    </button>
  );
}

function ArticleShare() {
  const [copied, setCopied] = React.useState(false);
  const copyLink = () => {
    navigator.clipboard && navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="article-share">
      <button className={"article-share-btn" + (copied ? " copied" : "")} onClick={copyLink} title="复制链接">
        <span className="article-share-tip">已复制</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button className="article-share-btn" title="分享到微博">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.098 20c-4.012 0-7.098-2.09-7.098-5.367 0-1.734.961-3.64 2.627-5.232C7.48 7.687 9.463 7 11.123 7c.547 0 .87.065 1.09.152-.226-.688-.34-1.404-.34-2.152C11.873 2.246 13.84 1 15.57 1c1.7 0 3.32 1.196 3.32 3.296 0 .832-.213 1.66-.646 2.456C19.873 7.496 21 9.11 21 11.045 21 16.065 16.287 20 10.098 20z"/>
        </svg>
      </button>
      <button className="article-share-btn" title="分享到 X">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>
    </div>
  );
}

function ArticleRelated({ posts }) {
  return (
    <div className="article-related">
      <div className="article-related-title">相关文章</div>
      <div className="article-related-grid">
        {posts.map(p => (
          <a key={p.id} className="article-related-card" href={postUrl(p)}>
            <div className="article-related-img">
              <Placeholder variant={p.cover} label={p.coverLabel} />
            </div>
            <div className="article-related-name">{p.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

const SAMPLE_COMMENTS = [
  { name: "Zebin",   color: "#4a7fa5", date: "2026-05-13", text: "写得真好，很有共鸣。那种\"打开后台就能写\"的仪式感确实难以替代。" },
  { name: "一只喵",  color: "#a56b4a", date: "2026-05-14", text: "我也经历过同样的纠结，最后还是换回去了，哈哈。" },
  { name: "桃子",   color: "#7a5aa5", date: "2026-05-15", text: "轻盈未必是好事，这句话说得太对了。" },
];

function ArticleComments({ count }) {
  return (
    <div className="article-comments">
      <div className="article-comments-head">
        <h3 className="article-comments-title serif">留声</h3>
        <span className="article-comments-count">{count} 条</span>
      </div>
      {SAMPLE_COMMENTS.map((c, i) => (
        <div key={i} className="article-comment">
          <div className="article-comment-avatar" style={{ background: c.color }}>
            {c.name[0]}
          </div>
          <div className="article-comment-body">
            <div className="article-comment-meta">
              <span className="article-comment-name">{c.name}</span>
              <span className="article-comment-date">{c.date}</span>
            </div>
            <div className="article-comment-text">{c.text}</div>
          </div>
        </div>
      ))}
      <div className="article-comment-login">登录后参与留言</div>
    </div>
  );
}

function ArticleNav({ prev, next }) {
  return (
    <div className="article-nav">
      {prev ? (
        <a className="article-nav-item prev" href={postUrl(prev)}>
          <div className="article-nav-label">← 上一篇</div>
          <div className="article-nav-name">{prev.title}</div>
        </a>
      ) : (
        <div className="article-nav-item prev disabled" style={{ opacity: 0.3 }}>
          <div className="article-nav-label">← 上一篇</div>
        </div>
      )}
      {next ? (
        <a className="article-nav-item next" href={postUrl(next)}>
          <div className="article-nav-label">下一篇 →</div>
          <div className="article-nav-name">{next.title}</div>
        </a>
      ) : (
        <div className="article-nav-item next disabled" style={{ opacity: 0.3 }}>
          <div className="article-nav-label">下一篇 →</div>
        </div>
      )}
    </div>
  );
}

export { ArticlePage, ArticleLike, ArticleShare, ArticleRelated, ArticleComments, ArticleNav };
