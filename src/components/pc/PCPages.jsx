import React from 'react';
import { Placeholder } from '../shared/components.jsx';
import { LINKS, hostOf } from '../../data/links.js';
import { postUrl, tagUrl } from '../../lib/urls.js';
import { config } from '../../config.js';

const YEAR = new Date().getFullYear();

function PCInnerFooter() {
  return (
    <div className="pc-footer">
      <div>Copyright © {config.footer.since}–{YEAR} {config.site.name}</div>
      {config.footer.icp && <div>{config.footer.icp}</div>}
      <div style={{ marginTop: 4, fontSize: 12, opacity: 0.75 }}>
        <a href="/rss.xml" style={{ color: "inherit" }}>RSS</a>
        {" · "}
        <a href="/sitemap-index.xml" style={{ color: "inherit" }}>站点地图</a>
      </div>
    </div>
  );
}

function PCCategoryPage({ posts }) {
  const tagMap = {};
  posts.forEach(p => {
    (p.tags || []).forEach(tag => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  const cats = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="pc-center">
      <div className="pc-inner-head">
        <h2 className="pc-inner-title serif">分类</h2>
        <span className="pc-inner-count">{cats.length} 个标签</span>
      </div>
      <div className="pc-cat-grid">
        {cats.map(([name, count]) => (
          <a key={name} className="pc-cat-card" href={tagUrl(name)}>
            <div className="pc-cat-name serif"># {name}</div>
            <div className="pc-cat-count">{count} 篇</div>
          </a>
        ))}
      </div>
      <PCInnerFooter />
    </div>
  );
}

function PCArchivePage({ posts }) {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const groupMap = {};
  sorted.forEach(p => {
    const [datePart] = p.date.split(' ');
    const [yr, mo] = datePart.split('-');
    const key = `${yr}年${parseInt(mo, 10)}月`;
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(p);
  });
  const groups = Object.entries(groupMap);

  return (
    <div className="pc-center">
      <div className="pc-inner-head">
        <h2 className="pc-inner-title serif">归档</h2>
        <span className="pc-inner-count">共 {posts.length} 篇</span>
      </div>
      {groups.map(([month, ps]) => (
        <div key={month} className="pc-arch-section">
          <div className="pc-arch-month-head">
            <span className="pc-arch-month-label">{month}</span>
            <span className="pc-arch-month-count">{ps.length} 篇</span>
          </div>
          {ps.map(p => {
            const day = p.date.split(' ')[0].split('-')[2];
            return (
              <a key={p.id} className="pc-arch-entry" href={postUrl(p)}>
                <span className="pc-arch-entry-day">{day}</span>
                <span className="pc-arch-entry-title serif">{p.title}</span>
              </a>
            );
          })}
        </div>
      ))}
      <PCInnerFooter />
    </div>
  );
}

function PCAboutPage() {
  return (
    <div className="pc-about">
      <div className="pc-about-hero">
        <div className="pc-about-avatar">
          <Placeholder variant={config.author.avatar || 1} label="portrait" />
        </div>
        <div>
          <div className="pc-about-name serif">{config.author.name}</div>
          <div className="pc-about-tagline">{config.author.tagline}</div>
          <div className="pc-about-stats">
            {config.author.stats.map(s => (
              <div key={s.label} className="pc-about-stat">
                <div className="pc-about-stat-num serif">{s.num}</div>
                <div className="pc-about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pc-about-body">
        {config.author.bio.map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </div>
  );
}

function PCLinksPage() {
  return (
    <div className="pc-center">
      <div className="pc-inner-head">
        <h2 className="pc-inner-title serif">友链</h2>
        <span className="pc-inner-count">{LINKS.length} 个</span>
      </div>
      <div className="pc-links-grid">
        {LINKS.map(l => (
          <a
            key={l.id}
            className="pc-links-card"
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="pc-links-img">
              <Placeholder variant={l.variant} label="" />
            </div>
            <div className="pc-links-text">
              <div className="pc-links-name">{l.name}</div>
              <div className="pc-links-desc">{l.desc}</div>
              <div className="pc-links-host">
                <span>{hostOf(l.url)}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
      <PCInnerFooter />
    </div>
  );
}

export { PCCategoryPage, PCArchivePage, PCAboutPage, PCLinksPage };
