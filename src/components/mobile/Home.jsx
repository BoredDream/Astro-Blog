import { Placeholder, PostFlags } from '../shared/components.jsx';
import { postUrl } from '../../lib/urls.js';
import { config } from '../../config.js';
import Pagination from '../shared/Pagination.jsx';

const YEAR = new Date().getFullYear();

function HomePage({ posts, pageNum = 1, totalPages = 1 }) {
  const isFirst = pageNum === 1;
  const featured = isFirst ? posts[0] : null;
  const tiles = isFirst ? posts.slice(1, 3) : [];
  const list = isFirst ? posts.slice(3) : posts;

  return (
    <div>
      {featured && (
        <a className="feature" href={postUrl(featured)}>
          <div className="feature-img">
            <Placeholder variant={featured.cover} label={featured.coverLabel} />
          </div>
          <PostFlags post={featured} />
          <div className="feature-title">{featured.title}</div>
        </a>
      )}

      {tiles.length > 0 && (
        <div className="grid-2">
          {tiles.map(p => (
            <a key={p.id} className="tile" href={postUrl(p)}>
              <div className="tile-img">
                <Placeholder variant={p.cover} label={p.coverLabel} />
              </div>
              <div className="tile-title">{p.title}</div>
            </a>
          ))}
        </div>
      )}

      {list.map(p => (
        <a key={p.id} className="post-card" href={postUrl(p)}>
          <div className="post-card-img">
            <PostFlags post={p} />
            <Placeholder variant={p.cover} label={p.coverLabel} />
          </div>
          <div className="post-card-body">
            <h3 className="post-card-title">{p.title}</h3>
            <div className="post-card-meta">
              <span className="m">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {p.views}
              </span>
              <span className="m">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {p.likes}
              </span>
              {/* 评论数已停用
              <span className="m">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                {p.comments}
              </span>
              */}
            </div>
          </div>
        </a>
      ))}

      <Pagination current={pageNum} total={totalPages} className="m-pagination" />

      <div className="foot-pad"></div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      <div className="copyright">Copyright © {config.footer.since}–{YEAR} {config.site.name}</div>
      {config.footer.icp && <div className="icp">{config.footer.icp}</div>}
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
        <a href="/rss.xml" style={{ color: "inherit" }}>RSS</a>
        {" · "}
        <a href="/sitemap-index.xml" style={{ color: "inherit" }}>站点地图</a>
      </div>
    </div>
  );
}

export { HomePage, Footer };
