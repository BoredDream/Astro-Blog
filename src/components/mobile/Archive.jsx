import { Footer } from './Home.jsx';
import { postUrl } from '../../lib/urls.js';

function ArchivePage({ posts }) {
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
    <div className="inner-page">
      <div className="inner-page-head">
        <h2 className="inner-page-title serif">归档</h2>
        <span className="inner-page-count">共 {posts.length} 篇</span>
      </div>
      {groups.map(([month, ps]) => (
        <div key={month} className="arch-section">
          <div className="arch-month-head">
            <span className="arch-month-label">{month}</span>
            <span className="arch-month-count">{ps.length} 篇</span>
          </div>
          {ps.map(p => {
            const day = p.date.split(' ')[0].split('-')[2];
            return (
              <a key={p.id} className="arch-entry" href={postUrl(p)}>
                <span className="arch-entry-day">{day}</span>
                <span className="arch-entry-title serif">{p.title}</span>
              </a>
            );
          })}
        </div>
      ))}
      <div className="foot-pad" />
      <Footer />
    </div>
  );
}

export { ArchivePage };
