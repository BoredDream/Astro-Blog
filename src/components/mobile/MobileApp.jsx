import React from 'react';
import { Header, FloatingMoon, Drawer } from '../shared/components.jsx';
import { config } from '../../config.js';
import { HomePage } from './Home.jsx';
import { ArticlePage } from './Article.jsx';
import { CategoryPage } from './Category.jsx';
import { ArchivePage } from './Archive.jsx';
import { AboutPage } from './About.jsx';
import { LinksPage } from './Links.jsx';
import { postUrl, tagUrl } from '../../lib/urls.js';

const BRAND_NAME = config.site.name;
const PAGE_SIZE = config.pagination.pageSize;

function ScrollTopButton({ visible, onClick }) {
  return (
    <button
      className={"float-top" + (visible ? " visible" : "")}
      onClick={onClick}
      aria-label="scroll to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  );
}

function SearchPage({ posts }) {
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
    <div>
      <div className="search-bar">
        <input
          ref={inputRef}
          className="search-input"
          placeholder="输入关键词搜索…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="search-cancel" onClick={() => history.back()}>取消</button>
      </div>
      {!query.trim() && (
        <div className="search-hot-tags">
          <div className="search-hot-label">热门标签</div>
          <div className="article-tags" style={{ flexWrap: "wrap", gap: 8 }}>
            {allTags.slice(0, 12).map(t => (
              <a key={t} className="tag" href={tagUrl(t)}>{t}</a>
            ))}
          </div>
        </div>
      )}
      {query.trim() && results.length === 0 && (
        <div className="search-empty">未找到相关文章</div>
      )}
      {results.length > 0 && (
        <div>
          {results.map(p => (
            <a key={p.id} className="arch-entry" href={postUrl(p)} style={{ margin: "0 16px", borderLeft: "none", borderBottom: "1px solid var(--hair)", padding: "14px 0" }}>
              <div>
                <div style={{ fontSize: 15, color: "var(--ink)", fontFamily: "Noto Serif SC, serif", marginBottom: 4 }}>{p.title}</div>
                {p.excerpt && <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>{p.excerpt}</div>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TagPage({ posts, tag }) {
  const filtered = posts.filter(p => p.tags.includes(tag));
  return (
    <div className="inner-page">
      <div className="inner-page-head">
        <a href="/categories" style={{ display: "inline-flex", alignItems: "center", color: "var(--ink-3)", marginRight: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </a>
        <h2 className="inner-page-title serif">#{tag}</h2>
        <span className="inner-page-count">{filtered.length} 篇</span>
      </div>
      <div className="arch-section">
        {filtered.map(p => (
          <a key={p.id} className="arch-entry" href={postUrl(p)}>
            <span className="arch-entry-day">{p.date.slice(0, 10)}</span>
            <span className="arch-entry-title">{p.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <div className="not-found-msg">页面不见了</div>
      <a className="not-found-btn" href="/">返回首页</a>
    </div>
  );
}

function MobileApp({ page = "home", posts = [], post, tag, readMin, pageNum = 1, children }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const [showTop, setShowTop] = React.useState(false);
  const scrollerRef = React.useRef(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (e) {}
      return next;
    });
  };

  const scrollToTop = () => {
    if (scrollerRef.current) scrollerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const postIdx = post ? posts.findIndex(p => p.id === post.id) : -1;
  const prevPost = postIdx > 0 ? posts[postIdx - 1] : null;
  const nextPost = postIdx >= 0 && postIdx < posts.length - 1 ? posts[postIdx + 1] : null;

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pageStart = (pageNum - 1) * PAGE_SIZE;
  const homePosts = posts.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="app">
      <div ref={scrollerRef} className="app-scroll">
        <Header brandName={BRAND_NAME} onHamburger={() => setDrawerOpen(true)} />
        {page === "home" && <HomePage posts={homePosts} pageNum={pageNum} totalPages={totalPages} />}
        {page === "article" && post && (
          <ArticlePage post={post} posts={posts} prevPost={prevPost} nextPost={nextPost} readMin={readMin}>{children}</ArticlePage>
        )}
        {page === "category" && <CategoryPage posts={posts} />}
        {page === "archive" && <ArchivePage posts={posts} />}
        {page === "about" && <AboutPage />}
        {page === "links" && <LinksPage />}
        {page === "search" && <SearchPage posts={posts} />}
        {page === "tag" && <TagPage posts={posts} tag={tag} />}
        {page === "404" && <NotFoundPage />}
      </div>
      <ScrollTopButton visible={showTop} onClick={scrollToTop} />
      <FloatingMoon dark={dark} onToggle={toggleDark} />
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPage={page}
      />
    </div>
  );
}

export default MobileApp;
