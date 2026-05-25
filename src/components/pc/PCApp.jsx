import React from 'react';
import { Placeholder } from '../shared/components.jsx';
import { PCSidebar, PCRail, PCFloatTop } from './PCComponents.jsx';
import { PCHero, PCFeed } from './PCFeed.jsx';
import { PCArticle } from './PCArticle.jsx';
import { PCCategoryPage, PCArchivePage, PCAboutPage, PCLinksPage } from './PCPages.jsx';
import { postUrl, tagUrl } from '../../lib/urls.js';
import { config } from '../../config.js';

const PAGE_SIZE = config.pagination.pageSize;

function PCSearchPage({ posts }) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const allTags = [...new Set(posts.flatMap(p => p.tags))];
  const results = query.trim()
    ? posts.filter(p =>
        p.title.includes(query) ||
        p.tags.some(t => t.includes(query)) ||
        (p.excerpt && p.excerpt.includes(query))
      )
    : [];

  return (
    <div className="pc-search-page">
      <div className="pc-inner-head">
        <h2 className="pc-inner-title">文章搜索</h2>
      </div>
      <div className="pc-search-bar">
        <input
          ref={inputRef}
          className="pc-search-input"
          placeholder="输入关键词搜索…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      {!query.trim() && (
        <div>
          <div className="pc-search-label">热门标签</div>
          <div className="pc-tags" style={{ marginBottom: 24 }}>
            {allTags.slice(0, 14).map(t => (
              <a key={t} className="pc-tag" href={tagUrl(t)}>{t}</a>
            ))}
          </div>
        </div>
      )}
      {query.trim() && results.length === 0 && (
        <div className="pc-search-empty">未找到“<strong>{query}</strong>”相关文章</div>
      )}
      {results.length > 0 && (
        <div className="pc-list">
          {results.map(p => (
            <a key={p.id} className="pc-card" href={postUrl(p)}>
              <div className="pc-card-img">
                <Placeholder variant={p.cover} label={p.coverLabel} />
              </div>
              <div className="pc-card-body">
                <div>
                  <h3 className="pc-card-title">{p.title}</h3>
                  {p.excerpt && <p className="pc-card-excerpt">{p.excerpt}</p>}
                </div>
                <div className="pc-card-foot">
                  <span>{p.date.slice(0, 10)}</span>
                  <div className="pc-card-meta">
                    {p.tags.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: 12 }}>{t}</span>)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function PCTagPage({ posts, tag }) {
  const filtered = posts.filter(p => p.tags.includes(tag));
  return (
    <div className="pc-center">
      <div className="pc-inner-head">
        <a href="/categories" style={{ display: "inline-flex", alignItems: "center", color: "var(--pc-ink-3)", paddingRight: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </a>
        <h2 className="pc-inner-title">#{tag}</h2>
        <span className="pc-inner-count">{filtered.length} 篇</span>
      </div>
      <div className="pc-list">
        {filtered.map(p => (
          <a key={p.id} className="pc-card" href={postUrl(p)}>
            <div className="pc-card-img">
              <Placeholder variant={p.cover} label={p.coverLabel} />
            </div>
            <div className="pc-card-body">
              <div>
                <h3 className="pc-card-title">{p.title}</h3>
                {p.excerpt && <p className="pc-card-excerpt">{p.excerpt}</p>}
              </div>
              <div className="pc-card-foot">
                <span>{p.date.slice(0, 10)}</span>
                <span>{p.relTime}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function PCNotFoundPage() {
  return (
    <div className="pc-not-found">
      <div className="pc-not-found-code">404</div>
      <div className="pc-not-found-msg">页面不见了</div>
      <a className="pc-not-found-btn" href="/">返回首页</a>
    </div>
  );
}

function PCApp({ page = "home", posts = [], post, tag, headings, readMin, pageNum = 1, children }) {
  const [dark, setDark] = React.useState(false);
  const [showTop, setShowTop] = React.useState(false);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (e) {}
      return next;
    });
  };

  const postIdx = post ? posts.findIndex(p => p.id === post.id) : -1;
  const prevPost = postIdx > 0 ? posts[postIdx - 1] : null;
  const nextPost = postIdx >= 0 && postIdx < posts.length - 1 ? posts[postIdx + 1] : null;

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pageStart = (pageNum - 1) * PAGE_SIZE;
  const pagePosts = posts.slice(pageStart, pageStart + PAGE_SIZE);
  const heroPosts = pageNum === 1 ? pagePosts.slice(0, 3) : [];
  const listPosts = pageNum === 1 ? pagePosts.slice(3) : pagePosts;

  const NAV_PAGES = ["home", "category", "archive", "about", "links"];
  const activeNav = page === "tag" ? "category" : (NAV_PAGES.includes(page) ? page : null);

  return (
    <div className="pc">
      <PCSidebar active={activeNav} dark={dark} onToggleDark={toggleDark} />
      <main className="pc-main">
        {page === "home" && pageNum === 1 && <PCHero posts={heroPosts} />}
        <div className="pc-body">
          {page === "home" && (
            <div className="pc-center">
              <PCFeed posts={listPosts} pageNum={pageNum} totalPages={totalPages} />
            </div>
          )}
          {page === "article" && post && (
            <PCArticle
              post={post}
              posts={posts}
              prevPost={prevPost}
              nextPost={nextPost}
              headings={headings}
              readMin={readMin}
            >{children}</PCArticle>
          )}
          {page === "category" && <PCCategoryPage posts={posts} />}
          {page === "archive" && <PCArchivePage posts={posts} />}
          {page === "about" && <PCAboutPage />}
          {page === "links" && <PCLinksPage />}
          {page === "search" && <PCSearchPage posts={posts} />}
          {page === "tag" && <PCTagPage posts={posts} tag={tag} />}
          {page === "404" && <PCNotFoundPage />}
          <PCRail posts={posts} />
        </div>
      </main>
      <PCFloatTop visible={showTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}

export default PCApp;
