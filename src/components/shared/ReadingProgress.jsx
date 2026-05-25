import React from 'react';

// 顶部阅读进度条。scrollTarget 为 CSS 选择器；留空则监听 window。
function ReadingProgress({ scrollTarget }) {
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const el = scrollTarget ? document.querySelector(scrollTarget) : null;
    const target = el || window;

    const compute = () => {
      let scrollTop, scrollHeight, clientHeight;
      if (el) {
        scrollTop = el.scrollTop;
        scrollHeight = el.scrollHeight;
        clientHeight = el.clientHeight;
      } else {
        const d = document.documentElement;
        scrollTop = d.scrollTop || document.body.scrollTop;
        scrollHeight = d.scrollHeight;
        clientHeight = d.clientHeight;
      }
      const max = scrollHeight - clientHeight;
      setPct(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    };

    compute();
    target.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      target.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [scrollTarget]);

  return <div className="reading-progress" style={{ width: pct + '%' }} aria-hidden="true" />;
}

export default ReadingProgress;
