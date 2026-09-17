const ADMIN_PASSWORD = 'lqs1030';
const STORAGE_KEY = 'clean_static_site_data';
const AUTH_KEY = 'clean_static_site_auth';

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
      description: '纯静态个人网站。',
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
      excerpt: '很多值得记住的瞬间并不特别。',
      content: '<p>认真记录，是为了以后还能想起当时的自己。</p>',
      cover: 'assets/images/photo-01.png',
      status: 'published',
    },
  ],
  music: [
    {
      id: 'music-01',
      title: '想自由',
      artist: '王安宇',
      album: '',
      url: 'assets/music/xiangziyou.mp3',
      cover: 'assets/images/photo-01.png',
    },
  ],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let data = fallback;

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  try {
    const response = await fetch('data/site.json', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return fallback;
  }
}

function saveData(message = '已保存到浏览器') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  $('#save-status').textContent = message;
  showToast(message);
}

function showToast(message, error = false) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.style.background = error ? '#ef4444' : '#1e293b';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function readFile(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function renderProfileForm() {
  const profile = data.profile;
  const fields = [
    ['name', '姓名', 'text'],
    ['title', '身份', 'text'],
    ['tagline', '一句话介绍', 'text'],
    ['location', '所在地', 'text'],
    ['email', '邮箱', 'email'],
    ['douyin', '抖音', 'text'],
    ['availability', '当前状态', 'text'],
    ['avatar', '头像路径', 'text'],
    ['bio', '个人简介', 'textarea'],
  ];
  $('#profile-form').innerHTML = `
    <div class="editor-grid">
      ${fields
        .filter(([, , type]) => type === 'text' || type === 'email')
        .map(
          ([key, label]) => `
            <label><span>${label}</span><input name="${key}" value="${esc(profile[key] || '')}"></label>`,
        )
        .join('')}
    </div>
    ${fields
      .filter(([, , type]) => type === 'textarea')
      .map(
        ([key, label]) => `
          <label><span>${label}</span><textarea name="${key}" rows="5">${esc(profile[key] || '')}</textarea></label>`,
      )
      .join('')}
    <label class="upload-label">上传头像<input id="avatar-upload" type="file" accept="image/*"></label>
  `;
  $('#profile-form').addEventListener('input', (event) => {
    if (!event.target.name) return;
    data.profile[event.target.name] = event.target.value;
  });
  $('#avatar-upload').addEventListener('change', (event) => {
    readFile(event.target.files[0], (url) => {
      data.profile.avatar = url;
      $('#profile-form [name="avatar"]').value = url;
      showToast('头像已读取，点击保存后生效');
    });
  });
}

function renderPhotos() {
  $('#photos-list').innerHTML = data.photos
    .map(
      (photo) => `
        <article class="admin-item" data-type="photos" data-id="${photo.id}">
          <div class="admin-item__image"><img src="${esc(photo.image)}" alt=""></div>
          <div class="admin-item__fields">
            <label><span>标题</span><input data-field="title" value="${esc(photo.title)}"></label>
            <div class="editor-grid">
              <label><span>分类</span><input data-field="category" value="${esc(photo.category)}"></label>
              <label><span>地点</span><input data-field="location" value="${esc(photo.location)}"></label>
            </div>
            <label><span>说明</span><textarea data-field="description">${esc(photo.description)}</textarea></label>
            <label class="upload-label">上传照片<input type="file" accept="image/*" data-upload-image></label>
          </div>
          <div class="admin-item__actions"><button data-delete>删除</button></div>
        </article>`,
    )
    .join('');
}

function renderProjects() {
  $('#projects-list').innerHTML = data.portfolio
    .map(
      (item) => `
        <article class="admin-item" data-type="portfolio" data-id="${item.id}">
          <div class="admin-item__image"><img src="${esc(item.cover)}" alt=""></div>
          <div class="admin-item__fields">
            <label><span>名称</span><input data-field="title" value="${esc(item.title)}"></label>
            <div class="editor-grid">
              <label><span>分类</span><input data-field="category" value="${esc(item.category)}"></label>
              <label><span>日期</span><input data-field="date" value="${esc(item.date)}"></label>
            </div>
            <label><span>说明</span><textarea data-field="description">${esc(item.description)}</textarea></label>
            <label class="upload-label">上传封面<input type="file" accept="image/*" data-upload-image></label>
          </div>
          <div class="admin-item__actions"><button data-delete>删除</button></div>
        </article>`,
    )
    .join('');
}

function renderPosts() {
  $('#posts-list').innerHTML = data.posts
    .map(
      (post) => `
        <article class="admin-item" data-type="posts" data-id="${post.id}">
          <div class="admin-item__image"><img src="${esc(post.cover)}" alt=""></div>
          <div class="admin-item__fields">
            <label><span>标题</span><input data-field="title" value="${esc(post.title)}"></label>
            <div class="editor-grid">
              <label><span>分类</span><input data-field="category" value="${esc(post.category)}"></label>
              <label><span>状态</span>
                <select data-field="status">
                  <option value="published" ${post.status !== 'draft' ? 'selected' : ''}>已发布</option>
                  <option value="draft" ${post.status === 'draft' ? 'selected' : ''}>草稿</option>
                </select>
              </label>
            </div>
            <label><span>摘要</span><textarea data-field="excerpt">${esc(post.excerpt)}</textarea></label>
            <label><span>正文 HTML</span><textarea data-field="content" data-code>${esc(post.content)}</textarea></label>
            <label class="upload-label">上传封面<input type="file" accept="image/*" data-upload-image></label>
          </div>
          <div class="admin-item__actions"><button data-delete>删除</button></div>
        </article>`,
    )
    .join('');
}

function renderMusic() {
  $('#music-list').innerHTML = data.music
    .map(
      (song) => `
        <article class="admin-item" data-type="music" data-id="${song.id}">
          <div class="admin-item__image"><img src="${esc(song.cover)}" alt=""></div>
          <div class="admin-item__fields">
            <label><span>歌曲名</span><input data-field="title" value="${esc(song.title)}"></label>
            <div class="editor-grid">
              <label><span>歌手</span><input data-field="artist" value="${esc(song.artist)}"></label>
              <label><span>专辑</span><input data-field="album" value="${esc(song.album || '')}"></label>
            </div>
            <label><span>音乐路径</span><input data-field="url" value="${esc(song.url)}"></label>
            <label class="upload-label">上传歌曲<input type="file" accept="audio/*" data-upload-audio></label>
          </div>
          <div class="admin-item__actions"><button data-delete>删除</button></div>
        </article>`,
    )
    .join('');
}

function renderAll() {
  renderProfileForm();
  renderPhotos();
  renderProjects();
  renderPosts();
  renderMusic();
}

function bindEvents() {
  $('#login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if ($('#password').value === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      showAdmin();
    } else {
      $('#login-error').textContent = '密码错误';
    }
  });

  $('#logout-button').addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    location.reload();
  });

  $('#admin-nav').addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    $$('#admin-nav button').forEach((item) => item.classList.toggle('active', item === button));
    $$('.admin-panel').forEach((panel) =>
      panel.classList.toggle('active', panel.dataset.panel === button.dataset.tab),
    );
  });

  $('#save-button').addEventListener('click', () => saveData());

  $('#export-button').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'site.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  $('#import-input').addEventListener('change', (event) => {
    readFile(event.target.files[0], (content) => {
      try {
        data = JSON.parse(content);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        renderAll();
        showToast('site.json 导入成功');
      } catch {
        showToast('JSON 格式错误', true);
      }
    });
  });

  document.addEventListener('input', (event) => {
    const item = event.target.closest('.admin-item');
    const field = event.target.dataset.field;
    if (!item || !field) return;
    const target = data[item.dataset.type].find((entry) => String(entry.id) === item.dataset.id);
    if (target) target[field] = event.target.value;
  });

  document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-delete]');
    if (deleteButton) {
      const item = deleteButton.closest('.admin-item');
      data[item.dataset.type] = data[item.dataset.type].filter(
        (entry) => String(entry.id) !== item.dataset.id,
      );
      renderAll();
      saveData('已删除');
    }
  });

  document.addEventListener('change', (event) => {
    const item = event.target.closest('.admin-item');
    if (!item) return;
    const target = data[item.dataset.type].find((entry) => String(entry.id) === item.dataset.id);
    if (!target) return;
    if (event.target.matches('[data-upload-image]')) {
      readFile(event.target.files[0], (url) => {
        target[item.dataset.type === 'posts' ? 'cover' : 'image'] = url;
        if (item.dataset.type === 'portfolio' || item.dataset.type === 'music') target.cover = url;
        renderAll();
        showToast('图片已读取');
      });
    }
    if (event.target.matches('[data-upload-audio]')) {
      readFile(event.target.files[0], (url) => {
        target.url = url;
        renderAll();
        showToast('音乐已读取');
      });
    }
  });

  $('#add-photo').addEventListener('click', () => {
    data.photos.push({
      id: `photo-${Date.now()}`,
      title: '新照片',
      category: '日常',
      location: '',
      description: '',
      image: 'assets/images/photo-01.png',
    });
    renderPhotos();
  });

  $('#add-project').addEventListener('click', () => {
    data.portfolio.push({
      id: `project-${Date.now()}`,
      title: '新作品',
      category: '作品',
      date: new Date().getFullYear().toString(),
      description: '',
      cover: 'assets/images/photo-01.png',
      link: '',
    });
    renderProjects();
  });

  $('#add-post').addEventListener('click', () => {
    data.posts.push({
      id: `post-${Date.now()}`,
      title: '新文章',
      category: '生活随笔',
      date: new Date().toISOString().slice(0, 10),
      readTime: '3 分钟',
      excerpt: '',
      content: '<p>文章内容...</p>',
      cover: 'assets/images/photo-01.png',
      status: 'published',
    });
    renderPosts();
  });

  $('#add-music').addEventListener('click', () => {
    data.music.push({
      id: `music-${Date.now()}`,
      title: '新歌曲',
      artist: '',
      album: '',
      url: 'assets/music/xiangziyou.mp3',
      cover: 'assets/images/photo-01.png',
    });
    renderMusic();
  });
}

function showAdmin() {
  $('#login-view').hidden = true;
  $('#admin-app').hidden = false;
  renderAll();
}

async function init() {
  data = await loadData();
  bindEvents();
  if (localStorage.getItem(AUTH_KEY) === 'true') showAdmin();
}

init();
