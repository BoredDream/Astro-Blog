import { Footer } from './Home.jsx';
import { tagUrl } from '../../lib/urls.js';

function CategoryPage({ posts }) {
  const tagMap = {};
  posts.forEach(p => {
    (p.tags || []).forEach(tag => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  const cats = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="inner-page">
      <div className="inner-page-head">
        <h2 className="inner-page-title serif">分类</h2>
        <span className="inner-page-count">{cats.length} 个</span>
      </div>
      <div className="cat-list">
        {cats.map(([name, count]) => (
          <a key={name} className="cat-item" href={tagUrl(name)}>
            <span className="cat-name serif"># {name}</span>
            <span className="cat-count">{count} 篇</span>
          </a>
        ))}
      </div>
      <div className="foot-pad" />
      <Footer />
    </div>
  );
}

export { CategoryPage };
