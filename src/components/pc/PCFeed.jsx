import { Placeholder, PostFlags } from '../shared/components.jsx';
import { postUrl } from '../../lib/urls.js';
import { config } from '../../config.js';
import Pagination from '../shared/Pagination.jsx';

const YEAR = new Date().getFullYear();

function PCHero({ posts }) {
  const [hero, ...side] = posts;
  if (!hero) return null;
  return (
    <div className="pc-hero">
      <a className="pc-hero-main" href={postUrl(hero)}>
        <div className="pc-hero-img"><Placeholder variant={hero.cover} label={hero.coverLabel} /></div>
        <PostFlags post={hero} />
        <div className="pc-hero-title">{hero.title}</div>
      </a>
      <div className="pc-hero-side">
        {side.map(p => (
          <a key={p.id} className="pc-hero-tile" href={postUrl(p)}>
            <div className="pc-hero-img"><Placeholder variant={p.cover} label={p.coverLabel} /></div>
            <PostFlags post={p} />
            <div className="pc-hero-title">{p.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function PCFeed({ posts, pageNum = 1, totalPages = 1 }) {
  return (
    <>
      <div className="pc-list">
        {posts.map(p => <PCCard key={p.id} post={p} />)}
      </div>
      <Pagination current={pageNum} total={totalPages} className="pc-pagination" />
      <div className="pc-footer">
        <div>Copyright © {config.footer.since}–{YEAR} {config.site.name}</div>
        {config.footer.icp && <div>{config.footer.icp}</div>}
        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.75 }}>
          <a href="/rss.xml" style={{ color: "inherit" }}>RSS</a>
          {" · "}
          <a href="/sitemap-index.xml" style={{ color: "inherit" }}>站点地图</a>
        </div>
      </div>
    </>
  );
}

function PCCard({ post }) {
  return (
    <a className="pc-card" href={postUrl(post)}>
      <div className="pc-card-img">
        {post.tags && post.tags[0] && (
          <div className="pc-card-cat">{post.tags[0]}</div>
        )}
        <PostFlags post={post} />
        <Placeholder variant={post.cover} label={post.coverLabel} />
      </div>
      <div className="pc-card-body">
        <div>
          <h3 className="pc-card-title">{post.title}</h3>
          {post.excerpt && <p className="pc-card-excerpt">{post.excerpt}</p>}
        </div>
        <div className="pc-card-foot">
          <span>{post.relTime || "1 月前"}</span>
          <div className="pc-card-meta">
            <span className="m">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {post.views}
            </span>
            <span className="m">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.5-9.5-9.2C.7 8 2.5 4 6.4 4c2 0 3.6 1.1 4.6 2.6C12 5.1 13.6 4 15.6 4c3.9 0 5.7 4 3.9 7.8C19 16.5 12 21 12 21z"/>
              </svg>
              {post.likes}
            </span>
            {/* 评论数已停用
            <span className="m">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              {post.comments}
            </span>
            */}
          </div>
        </div>
      </div>
    </a>
  );
}

export { PCHero, PCFeed, PCCard };
