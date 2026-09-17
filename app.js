const fallback = {
  profile: {
    name: '刘琪硕',
    title: '生活记录者 / 创作者',
    tagline: '记录生活，也记录成长。',
    bio: '喜欢摄影、音乐与文字，用镜头保存日常，用文字整理想法，在普通的日子里寻找值得纪念的光。',
    avatar: 'assets/images/avatar.jpg',
    location: '中国 · 河南',
    email: '3401049114@qq.com',
    douyin: '@刘琪硕',
    availability: '开放交流与合作',
  },
  photos: [
    {
      id: 'photo-01',
      title: '生活里的光',
      category: '日常',
      date: '2026-09-18',
      location: '河南 · 登封',
      description: '一张随手记录的照片，留住了那天的光线与心情。',
      image: 'assets/images/photo-01.png',
    },
  ],
  portfolio: [
    {
      id: 'project-01',
      title: '刘琪硕的个人网站',
      category: '网站',
      date: '2026',
      description: '纯静态 HTML、CSS、JavaScript 个人网站，包含照片、音乐、文章与本地后台管理。',
      cover: 'assets/images/photo-01.png',
      link: '',
    },
    {
      id: 'project-02',
      title: '日常摄影记录',
      category: '摄影',
      date: '2026',
      description: '收集生活里的光线、城市、人物与旅行片段。',
      cover: 'assets/images/photo-01.png',
      link: '',
    },
  ],
  posts: [
    {
      id: 'post-01',
      title: '为什么要认真记录日常生活',
      category: '生活随笔',
      date: '2026-09-18',
      readTime: '4 分钟',
      excerpt: '很多值得记住的瞬间并不特别，只是我们愿意停下来认真看一眼。',
      cover: 'assets/images/photo-01.png',
      status: 'published',
      content:
        '<p>以前总觉得生活要发生一些大事才值得记录，后来才发现，真正让人怀念的往往都是很普通的时刻。</p><p>一束落在桌面上的光、路上听到的歌、和朋友说过的几句话，都可能成为以后的记忆。</p>',
    },
    {
      id: 'post-02',
      title: '音乐让普通时刻有了情绪',
      category: '音乐',
      date: '2026-08-28',
      readTime: '3 分钟',
      excerpt: '同一首歌，在不同的天气和心情里，会变成完全不同的故事。',
      cover: 'assets/images/photo-01.png',
      status: 'published',
      content:
        '<p>音乐最特别的地方，是它会替一个普通时刻加上记忆。</p><p>后来再听到同一段旋律，就会想起当时走过的地方、身边的人和空气里的温度。</p>',
    },
  ],
  music: [
    {
      id: 'music-01',
      title: '想自由',
      artist: '王安宇',
      url: 'assets/music/xiangziyou.mp3',
      cover: 'assets/images/photo-01.png',
    },
  ],
};

const $ = (selector) => document.querySelector(selector);
let data = fallback;
let audioReady = false;

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value = '') {
  return String(value).replaceAll('-', '.');
}

async function loadData() {
  try {
    const response = await fetch('data/site.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('data unavailable');
    return await response.json();
  } catch {
    return fallback;
  }
}

function renderProfile() {
  const profile = data.profile;
  $('#hero-title').textContent = profile.title;
  $('#hero-name').textContent = profile.name;
  $('#hero-tagline').textContent = profile.tagline;
  $('#hero-bio').textContent = profile.bio;
  $('#hero-location').textContent = profile.location;
  $('#hero-email').textContent = profile.email;
  $('#hero-email').href = `mailto:${profile.email}`;
  $('#hero-douyin').textContent = profile.douyin;
  $('#hero-avatar').src = profile.avatar;
  $('#hero-availability').textContent = profile.availability;
  $('#about-bio').textContent = profile.bio;
  $('#about-name').textContent = profile.name;
  $('#about-role').textContent = profile.title;
  $('#about-location').textContent = profile.location;
  $('#about-email').textContent = profile.email;
  $('#contact-email').textContent = profile.email;
  $('#contact-link').href = `mailto:${profile.email}`;
  $('#footer-year').textContent = new Date().getFullYear();
}

function renderPhotos() {
  $('#photo-grid').innerHTML = data.photos
    .map(
      (photo) => `
        <button class="photo-card" type="button" data-preview="${esc(photo.image)}">
          <img src="${esc(photo.image)}" alt="${esc(photo.title)}" loading="lazy">
          <div><strong>${esc(photo.title)}</strong><span>${esc(photo.category)} · ${esc(photo.location)}</span></div>
        </button>`,
    )
    .join('');
}

function renderProjects() {
  $('#project-grid').innerHTML = data.portfolio
    .map(
      (item) => `
        <article class="project-card">
          <img src="${esc(item.cover)}" alt="${esc(item.title)}" loading="lazy">
          <div>
            <small>${esc(item.category)} · ${esc(item.date)}</small>
            <strong>${esc(item.title)}</strong>
            <p>${esc(item.description)}</p>
          </div>
        </article>`,
    )
    .join('');
}

function renderPosts() {
  const posts = data.posts.filter((post) => post.status !== 'draft');
  $('#post-list').innerHTML = posts
    .map(
      (post) => `
        <article class="post-card">
          <img src="${esc(post.cover)}" alt="${esc(post.title)}" loading="lazy">
          <div class="post-card__body">
            <small>${esc(post.category)} · ${esc(formatDate(post.date))}</small>
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.excerpt)}</p>
            <button type="button" data-post="${esc(post.id)}">阅读全文 →</button>
          </div>
        </article>`,
    )
    .join('');
}

function openArticle(id) {
  const post = data.posts.find((item) => item.id === id);
  if (!post) return;
  $('#article-category').textContent = post.category;
  $('#article-title').textContent = post.title;
  $('#article-meta').textContent = `${formatDate(post.date)} · ${post.readTime || ''}`;
  $('#article-cover').src = post.cover;
  $('#article-content').innerHTML = post.content;
  $('#article-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  $('#article-modal').hidden = true;
  document.body.style.overflow = '';
}

function openLightbox(src) {
  $('#lightbox-image').src = src;
  $('#lightbox').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  $('#lightbox').hidden = true;
  document.body.style.overflow = '';
}

function setupTheme() {
  const stored = localStorage.getItem('static-site-theme');
  const theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  renderThemeIcon();
  $('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('static-site-theme', next);
    renderThemeIcon();
  });
}

function renderThemeIcon() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('#theme-toggle').innerHTML = dark
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.7 13.2A8.5 8.5 0 1 1 10.8 3.3 6.8 6.8 0 0 0 20.7 13.2Z"/></svg>';
}

function setupMusic() {
  const music = data.music[0];
  const player = $('#music-player');
  if (!music) {
    player.hidden = true;
    return;
  }
  $('#music-title').textContent = music.title;
  $('#music-artist').textContent = music.artist;
  if (!audioReady) {
    $('#audio').src = music.url;
    audioReady = true;
  }
  $('#music-toggle').addEventListener('click', async () => {
    const audio = $('#audio');
    if (audio.paused) await audio.play();
    else audio.pause();
  });
  const updateState = () => {
    $('#music-toggle').textContent = $('#audio').paused ? '▶' : 'Ⅱ';
  };
  const updateProgress = () => {
    const audio = $('#audio');
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    $('#music-progress').style.width = duration ? `${(audio.currentTime / duration) * 100}%` : '0%';
    $('#music-time').textContent = `${Math.floor(audio.currentTime / 60)}:${String(
      Math.floor(audio.currentTime % 60),
    ).padStart(2, '0')}`;
  };
  $('#audio').addEventListener('play', updateState);
  $('#audio').addEventListener('pause', updateState);
  $('#audio').addEventListener('timeupdate', updateProgress);
  $('#audio').addEventListener('loadedmetadata', updateProgress);
}

function setupEvents() {
  $('#nav-menu-button').addEventListener('click', () => {
    $('#site-nav').classList.toggle('open');
  });
  $('#site-nav').addEventListener('click', () => $('#site-nav').classList.remove('open'));
  window.addEventListener(
    'scroll',
    () => $('#site-header').classList.toggle('is-scrolled', window.scrollY > 40),
    { passive: true },
  );
  document.addEventListener('click', (event) => {
    const preview = event.target.closest('[data-preview]');
    if (preview) return openLightbox(preview.dataset.preview);
    const post = event.target.closest('[data-post]');
    if (post) return openArticle(post.dataset.post);
  });
  $('#article-close').addEventListener('click', closeArticle);
  $('#article-modal').addEventListener('click', (event) => {
    if (event.target.id === 'article-modal') closeArticle();
  });
  $('#lightbox-close').addEventListener('click', closeLightbox);
  $('#lightbox').addEventListener('click', (event) => {
    if (event.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeArticle();
    closeLightbox();
  });
}

async function init() {
  data = await loadData();
  renderProfile();
  renderPhotos();
  renderProjects();
  renderPosts();
  setupTheme();
  setupMusic();
  setupEvents();
}

init();
