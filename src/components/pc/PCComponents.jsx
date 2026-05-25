import { Solar } from 'lunar-javascript';
import { BrandMark } from '../shared/components.jsx';
import { NAV_URL, postUrl, tagUrl } from '../../lib/urls.js';
import { config } from '../../config.js';

const MONTHS   = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const WEEKDAYS = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];

function getTodayCalendar() {
  const now    = new Date();
  const solar  = Solar.fromDate(now);
  const lunar  = solar.getLunar();
  const yi     = lunar.getDayYi();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const quote  = config.quotes[dayOfYear % config.quotes.length];
  return {
    month:      MONTHS[now.getMonth()],
    weekday:    WEEKDAYS[now.getDay()],
    day:        now.getDate().toString(),
    lunarDate:  `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    auspicious: yi.length > 0 ? `宜${yi[0]}` : '诸事皆宜',
    quote:      quote.text,
    quoteAuthor: quote.author,
  };
}

function PCSidebar({ active, dark, onToggleDark }) {
  const links = [
    { id: "home",     label: "首页", href: NAV_URL.home },
    { id: "category", label: "分类", href: NAV_URL.category },
    { id: "archive",  label: "归档", href: NAV_URL.archive },
    { id: "about",    label: "关于", href: NAV_URL.about },
    { id: "links",    label: "友链", href: NAV_URL.links },
  ];
  return (
    <aside className="pc-side">
      <a className="pc-side-brand" href="/" aria-label="首页">
        <BrandMark size={44} color="#fff" />
      </a>
      <nav className="pc-side-nav">
        {links.map(l => (
          <a
            key={l.id}
            className={"pc-side-link" + (active === l.id ? " active" : "")}
            href={l.href}
          >{l.label}</a>
        ))}
      </nav>
      <div className="pc-side-social">
        {config.social.github && (
          <a href={config.social.github} title="GitHub" aria-label="github" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.9 0-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"/>
            </svg>
          </a>
        )}
        {config.social.x && (
          <a href={config.social.x} title="X" aria-label="x" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        )}
        {config.social.wechat && (
          <button title={`微信：${config.social.wechat}`} aria-label="wechat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5 4C5.4 4 2 6.9 2 10.5c0 2 1.1 3.9 2.8 5.1L4 18l2.6-1.4c.9.2 1.9.4 2.9.4.3 0 .5 0 .8-.1-.2-.5-.3-1.1-.3-1.7 0-3.3 3.2-6 7.1-6h.6C17.2 6.2 13.7 4 9.5 4zM7 9.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              <path d="M22 15.2c0-2.8-2.8-5.2-6.2-5.2s-6.2 2.3-6.2 5.2 2.8 5.2 6.2 5.2c.7 0 1.4-.1 2.1-.3l1.9 1-.5-1.7c1.6-.9 2.7-2.5 2.7-4.2zm-8.2-.8a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"/>
            </svg>
          </button>
        )}
        <button title="切换主题" aria-label="theme" onClick={onToggleDark}>
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
        <a title="搜索" aria-label="search" href="/search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/>
            <path d="m20 20-3.5-3.5"/>
          </svg>
        </a>
      </div>
    </aside>
  );
}

function CalendarWidget() {
  const cal = getTodayCalendar();
  return (
    <div className="pc-cal">
      <div className="pc-cal-head">
        <span>{cal.month}</span>
        <span>{cal.lunarDate}</span>
        <span>{cal.weekday}</span>
      </div>
      <div className="pc-cal-day">{cal.day}</div>
      <div className="pc-cal-yi">{cal.auspicious}</div>
      <div className="pc-cal-quote">{cal.quote}</div>
      <div className="pc-cal-author">{cal.quoteAuthor}</div>
    </div>
  );
}

function PCRail({ posts }) {
  const recent = posts ? posts.slice(0, 5) : [];
  /* 评论功能已停用
  const comments = [
    { name: "Zebin",      target: "学会向这个世界妥协" },
    { name: "一只喵",      target: "夏至未至" },
    { name: "桃子",       target: "富文本编辑器简史" },
    { name: "Edwin Zeng", target: "夏至未至" },
    { name: "西风",       target: "夏至未至" },
  ];
  */
  const allTags = posts ? [...new Set(posts.flatMap(p => p.tags))].slice(0, 12) : [];

  const handleSearchKey = (e) => {
    if (e.key === "Enter") window.location.href = "/search";
  };

  return (
    <aside className="pc-rail">
      <div className="pc-search">
        <input
          type="text"
          placeholder="文章寻踪（输入后回车）"
          onKeyDown={handleSearchKey}
        />
      </div>

      <div className="pc-widget">
        <div className="pc-widget-head">流年拾忆</div>
        <ul className="pc-recent">
          {recent.map(p => (
            <li key={p.id}>
              <a href={postUrl(p)}>{p.title}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* 评论功能已停用
      <div className="pc-widget">
        <div className="pc-widget-head">雁过留声</div>
        <ul className="pc-comments">
          {comments.map((c, i) => (
            <li key={i}>
              <span className="pc-comments-name">{c.name}</span>
              发表在<span className="pc-comments-target">《{c.target}》</span>
            </li>
          ))}
        </ul>
      </div>
      */}

      <div className="pc-widget">
        <div className="pc-widget-head">文踪墨迹</div>
        <div className="pc-tags">
          {allTags.map(t => (
            <a key={t} className="pc-tag" href={tagUrl(t)}>{t}</a>
          ))}
        </div>
      </div>

      <div className="pc-widget">
        <div className="pc-widget-head">时光只言</div>
        <CalendarWidget />
      </div>
    </aside>
  );
}

function PCFloatTop({ visible, onClick }) {
  return (
    <button
      className={"pc-float-top" + (visible ? " visible" : "")}
      onClick={onClick}
      aria-label="scroll to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  );
}

export { PCSidebar, PCRail, PCFloatTop };
