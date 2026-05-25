import { Placeholder } from '../shared/components.jsx';
import { Footer } from './Home.jsx';
import { config } from '../../config.js';

function AboutPage() {
  return (
    <div className="inner-page">
      <div className="inner-page-head">
        <h2 className="inner-page-title serif">关于</h2>
      </div>

      <div className="about-hero">
        <div className="about-avatar">
          <Placeholder variant={config.author.avatar || 1} label="portrait" />
        </div>
        <div className="about-info">
          <div className="about-name serif">{config.author.name}</div>
          <div className="about-tagline">{config.author.tagline}</div>
        </div>
      </div>

      <div className="about-stats">
        {config.author.stats.map(s => (
          <div key={s.label} className="about-stat">
            <div className="about-stat-num serif">{s.num}</div>
            <div className="about-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="about-body">
        {config.author.bio.map((para, i) => <p key={i}>{para}</p>)}
      </div>

      <div className="foot-pad" />
      <Footer />
    </div>
  );
}

export { AboutPage };
