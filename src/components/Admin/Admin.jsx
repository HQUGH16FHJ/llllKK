import { useState, useEffect } from 'react';
import { getData, saveData, resetData, isAdmin, login, logout, getAdminPassword } from '../../data/store';
import './Admin.css';

function Admin({ onBack, onSave }) {
  const [authenticated, setAuthenticated] = useState(isAdmin());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);

  // 加载数据
  const loadData = async () => {
    const result = await getData();
    setData(result);
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await login(password);
    if (ok) {
      setAuthenticated(true);
    } else {
      setError('密码错误');
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setData(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('');
    const adminPwd = getAdminPassword();
    const result = await saveData(data, adminPwd);
    setSaving(false);
    if (result.success) {
      setSaveStatus('✓ ' + (result.message || '保存成功'));
      if (onSave) onSave();
    } else {
      setSaveStatus('✗ ' + (result.error || '保存失败'));
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      const newData = resetData();
      setData(newData);
      setSaveStatus('已重置为默认数据');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const updateField = (section, field, value) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  const addItem = (section, item) => {
    const newItem = { ...item, id: Date.now() };
    setData({
      ...data,
      [section]: [...data[section], newItem],
    });
  };

  const updateItem = (section, id, updates) => {
    setData({
      ...data,
      [section]: data[section].map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const deleteItem = (section, id) => {
    if (confirm('确定删除此项目吗？')) {
      setData({
        ...data,
        [section]: data[section].filter((item) => item.id !== id),
      });
    }
  };

  // 登录页
  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login__card glass-card">
          <h2>后台管理登录</h2>
          <p>请输入管理员密码</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="admin-login__input"
              autoFocus
            />
            {error && <p className="admin-login__error">{error}</p>}
            <button type="submit" className="admin-login__btn">
              登录
            </button>
          </form>
          <p className="admin-login__hint">默认密码：admin123</p>
          <button className="admin-login__back" onClick={onBack}>
            ← 返回首页
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin admin--loading">
        <div className="loading-spinner">
          <div className="loading-spinner__circle"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: '个人信息', icon: '👤' },
    { id: 'photos', label: '照片管理', icon: '📷' },
    { id: 'posts', label: '文章管理', icon: '📝' },
    { id: 'music', label: '音乐管理', icon: '🎵' },
    { id: 'portfolio', label: '作品集', icon: '💼' },
    { id: 'socials', label: '社交链接', icon: '🔗' },
  ];

  return (
    <div className="admin">
      {/* 侧边栏 */}
      <aside className="admin__sidebar">
        <div className="admin__logo">
          <span>◆</span>
          <span>管理后台</span>
        </div>
        <nav className="admin__nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin__nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-bottom">
          <button className="admin__btn-secondary" onClick={onBack}>
            ← 查看网站
          </button>
          <button className="admin__btn-logout" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="admin__main">
        <header className="admin__header">
          <h1>{tabs.find((t) => t.id === activeTab)?.label}</h1>
          <div className="admin__header-actions">
            {saveStatus && <span className={`admin__save-status ${saveStatus.includes('✓') ? 'success' : 'error'}`}>{saveStatus}</span>}
            <button className="admin__btn-secondary" onClick={handleReset}>
              重置默认
            </button>
            <button className="admin__btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '💾 保存更改'}
            </button>
          </div>
        </header>

        <div className="admin__content">
          {/* 个人信息 */}
          {activeTab === 'profile' && (
            <div className="admin__section">
              <div className="admin__form-group">
                <label>头像 URL</label>
                <input
                  type="text"
                  value={data.profile.avatar}
                  onChange={(e) => updateField('profile', 'avatar', e.target.value)}
                  placeholder="https://..."
                />
                {data.profile.avatar && (
                  <div className="admin__avatar-preview">
                    <img src={data.profile.avatar} alt="avatar" />
                  </div>
                )}
              </div>
              <div className="admin__form-row">
                <div className="admin__form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) => updateField('profile', 'name', e.target.value)}
                  />
                </div>
                <div className="admin__form-group">
                  <label>身份标签</label>
                  <input
                    type="text"
                    value={data.profile.title}
                    onChange={(e) => updateField('profile', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className="admin__form-row">
                <div className="admin__form-group">
                  <label>位置</label>
                  <input
                    type="text"
                    value={data.profile.location}
                    onChange={(e) => updateField('profile', 'location', e.target.value)}
                  />
                </div>
                <div className="admin__form-group">
                  <label>邮箱</label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) => updateField('profile', 'email', e.target.value)}
                  />
                </div>
              </div>
              <div className="admin__form-group">
                <label>个人简介</label>
                <textarea
                  rows="4"
                  value={data.profile.bio}
                  onChange={(e) => updateField('profile', 'bio', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 照片管理 */}
          {activeTab === 'photos' && (
            <div className="admin__section">
              <div className="admin__list">
                {data.photos.map((photo) => (
                  <div key={photo.id} className="admin__list-item glass-card">
                    <div className="admin__list-item-img">
                      <img src={photo.image} alt={photo.title} />
                    </div>
                    <div className="admin__list-item-body">
                      <input
                        type="text"
                        value={photo.title}
                        onChange={(e) => updateItem('photos', photo.id, { title: e.target.value })}
                        className="admin__list-item-title"
                      />
                      <div className="admin__form-row">
                        <input
                          type="text"
                          value={photo.location}
                          placeholder="地点"
                          onChange={(e) => updateItem('photos', photo.id, { location: e.target.value })}
                        />
                        <input
                          type="text"
                          value={photo.coordinates}
                          placeholder="坐标"
                          onChange={(e) => updateItem('photos', photo.id, { coordinates: e.target.value })}
                        />
                      </div>
                      <div className="admin__form-row">
                        <input
                          type="text"
                          value={photo.category}
                          placeholder="分类"
                          onChange={(e) => updateItem('photos', photo.id, { category: e.target.value })}
                        />
                        <input
                          type="date"
                          value={photo.date}
                          onChange={(e) => updateItem('photos', photo.id, { date: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        value={photo.image}
                        placeholder="图片 URL"
                        onChange={(e) => updateItem('photos', photo.id, { image: e.target.value })}
                      />
                      <textarea
                        rows="2"
                        value={photo.description}
                        placeholder="描述"
                        onChange={(e) => updateItem('photos', photo.id, { description: e.target.value })}
                      />
                    </div>
                    <button
                      className="admin__btn-delete"
                      onClick={() => deleteItem('photos', photo.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="admin__btn-add"
                onClick={() =>
                  addItem('photos', {
                    title: '新照片',
                    location: '',
                    coordinates: '',
                    category: '未分类',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    image: 'https://picsum.photos/seed/new' + Date.now() + '/800/600',
                  })
                }
              >
                + 添加照片
              </button>
            </div>
          )}

          {/* 文章管理 */}
          {activeTab === 'posts' && (
            <div className="admin__section">
              <div className="admin__list">
                {data.posts.map((post) => (
                  <div key={post.id} className="admin__list-item glass-card">
                    <div className="admin__list-item-body admin__list-item-body--full">
                      <input
                        type="text"
                        value={post.title}
                        onChange={(e) => updateItem('posts', post.id, { title: e.target.value })}
                        className="admin__list-item-title"
                      />
                      <div className="admin__form-row">
                        <input
                          type="text"
                          value={post.category}
                          placeholder="分类"
                          onChange={(e) => updateItem('posts', post.id, { category: e.target.value })}
                        />
                        <input
                          type="date"
                          value={post.date}
                          onChange={(e) => updateItem('posts', post.id, { date: e.target.value })}
                        />
                        <input
                          type="text"
                          value={post.readTime}
                          placeholder="阅读时间"
                          onChange={(e) => updateItem('posts', post.id, { readTime: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        value={post.cover}
                        placeholder="封面图 URL"
                        onChange={(e) => updateItem('posts', post.id, { cover: e.target.value })}
                      />
                      <textarea
                        rows="2"
                        value={post.excerpt}
                        placeholder="摘要"
                        onChange={(e) => updateItem('posts', post.id, { excerpt: e.target.value })}
                      />
                      <label>正文内容（支持 HTML）</label>
                      <textarea
                        rows="6"
                        value={post.content}
                        onChange={(e) => updateItem('posts', post.id, { content: e.target.value })}
                        className="admin__textarea-code"
                      />
                    </div>
                    <button
                      className="admin__btn-delete"
                      onClick={() => deleteItem('posts', post.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="admin__btn-add"
                onClick={() =>
                  addItem('posts', {
                    title: '新文章',
                    excerpt: '文章摘要...',
                    content: '<p>文章内容...</p>',
                    date: new Date().toISOString().split('T')[0],
                    category: '生活随笔',
                    cover: 'https://picsum.photos/seed/new' + Date.now() + '/800/500',
                    readTime: '5 分钟',
                  })
                }
              >
                + 添加文章
              </button>
            </div>
          )}

          {/* 音乐管理 */}
          {activeTab === 'music' && (
            <div className="admin__section">
              <div className="admin__list">
                {data.music.map((song) => (
                  <div key={song.id} className="admin__list-item glass-card">
                    <div className="admin__list-item-img admin__list-item-img--square">
                      <img src={song.cover} alt={song.title} />
                    </div>
                    <div className="admin__list-item-body">
                      <input
                        type="text"
                        value={song.title}
                        onChange={(e) => updateItem('music', song.id, { title: e.target.value })}
                        className="admin__list-item-title"
                      />
                      <div className="admin__form-row">
                        <input
                          type="text"
                          value={song.artist}
                          placeholder="歌手"
                          onChange={(e) => updateItem('music', song.id, { artist: e.target.value })}
                        />
                        <input
                          type="text"
                          value={song.album}
                          placeholder="专辑"
                          onChange={(e) => updateItem('music', song.id, { album: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        value={song.cover}
                        placeholder="封面 URL"
                        onChange={(e) => updateItem('music', song.id, { cover: e.target.value })}
                      />
                      <input
                        type="text"
                        value={song.url}
                        placeholder="音频 URL"
                        onChange={(e) => updateItem('music', song.id, { url: e.target.value })}
                      />
                    </div>
                    <button
                      className="admin__btn-delete"
                      onClick={() => deleteItem('music', song.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="admin__btn-add"
                onClick={() =>
                  addItem('music', {
                    title: '新歌曲',
                    artist: '未知歌手',
                    album: '',
                    cover: 'https://picsum.photos/seed/new' + Date.now() + '/200/200',
                    url: '/music/song.mp3',
                  })
                }
              >
                + 添加歌曲
              </button>
            </div>
          )}

          {/* 作品集 */}
          {activeTab === 'portfolio' && (
            <div className="admin__section">
              <div className="admin__list">
                {data.portfolio.map((item) => (
                  <div key={item.id} className="admin__list-item glass-card">
                    <div className="admin__list-item-img">
                      <img src={item.cover} alt={item.title} />
                    </div>
                    <div className="admin__list-item-body">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem('portfolio', item.id, { title: e.target.value })}
                        className="admin__list-item-title"
                      />
                      <div className="admin__form-row">
                        <input
                          type="text"
                          value={item.category}
                          placeholder="分类"
                          onChange={(e) => updateItem('portfolio', item.id, { category: e.target.value })}
                        />
                        <input
                          type="text"
                          value={item.date}
                          placeholder="年份"
                          onChange={(e) => updateItem('portfolio', item.id, { date: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.cover}
                        placeholder="封面 URL"
                        onChange={(e) => updateItem('portfolio', item.id, { cover: e.target.value })}
                      />
                      <input
                        type="text"
                        value={item.link}
                        placeholder="链接"
                        onChange={(e) => updateItem('portfolio', item.id, { link: e.target.value })}
                      />
                      <textarea
                        rows="2"
                        value={item.description}
                        placeholder="描述"
                        onChange={(e) => updateItem('portfolio', item.id, { description: e.target.value })}
                      />
                    </div>
                    <button
                      className="admin__btn-delete"
                      onClick={() => deleteItem('portfolio', item.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="admin__btn-add"
                onClick={() =>
                  addItem('portfolio', {
                    title: '新作品',
                    category: '未分类',
                    description: '作品描述...',
                    cover: 'https://picsum.photos/seed/new' + Date.now() + '/800/600',
                    link: '#',
                    date: new Date().getFullYear() + '',
                  })
                }
              >
                + 添加作品
              </button>
            </div>
          )}

          {/* 社交链接 */}
          {activeTab === 'socials' && (
            <div className="admin__section">
              <div className="admin__list">
                {data.socials.map((social) => (
                  <div key={social.id} className="admin__list-item glass-card admin__list-item--small">
                    <input
                      type="text"
                      value={social.icon}
                      onChange={(e) => updateItem('socials', social.id, { icon: e.target.value })}
                      className="admin__social-icon"
                    />
                    <div className="admin__list-item-body">
                      <input
                        type="text"
                        value={social.name}
                        onChange={(e) => updateItem('socials', social.id, { name: e.target.value })}
                      />
                      <input
                        type="text"
                        value={social.handle}
                        placeholder="账号/用户名"
                        onChange={(e) => updateItem('socials', social.id, { handle: e.target.value })}
                      />
                      <input
                        type="text"
                        value={social.url}
                        placeholder="链接 URL"
                        onChange={(e) => updateItem('socials', social.id, { url: e.target.value })}
                      />
                    </div>
                    <button
                      className="admin__btn-delete"
                      onClick={() => deleteItem('socials', social.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="admin__btn-add"
                onClick={() =>
                  addItem('socials', {
                    name: '新平台',
                    icon: '🔗',
                    url: '#',
                    handle: '@username',
                  })
                }
              >
                + 添加社交链接
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
