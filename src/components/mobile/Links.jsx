import { Placeholder } from '../shared/components.jsx';
import { Footer } from './Home.jsx';
import { LINKS, hostOf } from '../../data/links.js';

function LinksPage() {
  return (
    <div className="inner-page">
      <div className="inner-page-head">
        <h2 className="inner-page-title serif">友链</h2>
        <span className="inner-page-count">{LINKS.length} 个</span>
      </div>
      <div className="links-grid">
        {LINKS.map(l => (
          <a
            key={l.id}
            className="links-card"
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="links-img-area">
              <Placeholder variant={l.variant} label="" />
            </div>
            <div className="links-text-area">
              <div className="links-name">{l.name}</div>
              <div className="links-desc">{l.desc}</div>
              <div className="links-host">
                <span>{hostOf(l.url)}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export { LinksPage };
