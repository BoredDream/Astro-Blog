// ── PC 侧栏迷你音乐播放器 ──────────────────────────────────────────────
// 曲目由 [data-music-player] 上的 data-tracks 提供（config.music.tracks 序列化）。
// neteaseId 经 PUBLIC_NETEASE_API 换取播放地址，url 则直接使用直链。
// 未配置 API 且曲目只有 neteaseId 时，播放按钮保持禁用态。
const NETEASE_API = import.meta.env.PUBLIC_NETEASE_API || '';

const fmtTime = (s) => {
  if (!s || !isFinite(s)) return '00:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
};

document.querySelectorAll('[data-music-player]').forEach((root) => {
  const audio = root.querySelector('[data-music-el]');
  const toggle = root.querySelector('[data-music-toggle]');
  const nextBtn = root.querySelector('[data-music-next]');
  const seek = root.querySelector('[data-music-seek]');
  const fill = root.querySelector('[data-music-fill]');
  const timeEl = root.querySelector('[data-music-time]');
  const titleEl = root.querySelector('[data-music-title]');
  const artistEl = root.querySelector('[data-music-artist]');
  const iconPlay = root.querySelector('.icon-play');
  const iconPause = root.querySelector('.icon-pause');
  if (!audio || !toggle) return;

  let tracks = [];
  try {
    tracks = JSON.parse(root.getAttribute('data-tracks') || '[]');
  } catch {
    tracks = [];
  }
  if (!tracks.length) return;

  let index = 0;
  let token = 0; // 换曲后丢弃过期的 API 响应

  const setEnabled = (on) => {
    toggle.disabled = !on;
    root.classList.toggle('is-idle', !on);
  };

  // 播放前暂停页面上其它音频（文章页的播放器），避免两路声音叠在一起
  const pauseOthers = () => {
    document.querySelectorAll('audio').forEach((el) => {
      if (el !== audio) el.pause();
    });
  };

  const load = (i, autoplay) => {
    index = (i + tracks.length) % tracks.length;
    const track = tracks[index];
    const my = ++token;

    titleEl.textContent = track.title || '';
    artistEl.textContent = track.artist || '';
    fill.style.width = '0%';
    timeEl.textContent = '00:00 / 00:00';
    audio.pause();
    audio.removeAttribute('src');
    audio.load();

    const start = () => {
      if (!autoplay) return;
      pauseOthers();
      audio.play().catch(() => {});
    };

    if (track.url) {
      audio.src = track.url;
      setEnabled(true);
      start();
    } else if (track.neteaseId && NETEASE_API) {
      setEnabled(false);
      fetch(`${NETEASE_API}/song/url?id=${track.neteaseId}&br=320000`)
        .then((r) => r.json())
        .then((d) => {
          if (my !== token) return;
          const url = d && d.data && d.data[0] && d.data[0].url;
          if (!url) return;
          audio.src = url;
          setEnabled(true);
          start();
        })
        .catch(() => {});
    } else {
      setEnabled(false);
    }
  };

  load(0, false);

  toggle.addEventListener('click', () => {
    if (toggle.disabled || !audio.src) return;
    if (audio.paused) {
      pauseOthers();
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  if (nextBtn) nextBtn.addEventListener('click', () => load(index + 1, true));

  audio.addEventListener('play', () => {
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = '';
  });
  audio.addEventListener('pause', () => {
    if (iconPlay) iconPlay.style.display = '';
    if (iconPause) iconPause.style.display = 'none';
  });
  audio.addEventListener('loadedmetadata', () => {
    timeEl.textContent = '00:00 / ' + fmtTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) fill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
  });
  audio.addEventListener('ended', () => load(index + 1, true));

  if (seek) {
    seek.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = seek.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * audio.duration;
    });
  }
});
