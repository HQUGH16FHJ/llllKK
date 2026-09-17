import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Gallery from './components/Gallery/Gallery';
import Blog from './components/Blog/Blog';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import Admin from './components/Admin/Admin';
import { getData } from './data/store';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    const result = await getData();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedPostId]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedPostId(null);
  };

  const handleReadPost = (postId) => {
    setSelectedPostId(postId);
  };

  const handleBackFromPost = () => {
    setSelectedPostId(null);
  };

  const handleDataChange = () => {
    loadData();
  };

  if (loading || !data) {
    return (
      <div className="app app--loading">
        <div className="loading-spinner">
          <div className="loading-spinner__circle"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  // 后台管理页面
  if (currentPage === 'admin') {
    return <Admin onBack={() => handleNavigate('home')} onSave={handleDataChange} />;
  }

  // 文章详情页
  if (selectedPostId) {
    const post = data.posts.find((p) => p.id === selectedPostId);
    return (
      <div className="app">
        <Navbar currentPage="blog" onNavigate={handleNavigate} />
        <MusicPlayer playlist={data.music} />
        <div className="container post-detail">
          <button className="post-detail__back" onClick={handleBackFromPost}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回文章列表
          </button>
          <span className="post-detail__category">{post?.category}</span>
          <h1 className="post-detail__title">{post?.title}</h1>
          <div className="post-detail__meta">
            <span>{post?.date}</span>
            <span>·</span>
            <span>{post?.readTime}</span>
          </div>
          <div className="post-detail__cover">
            <img src={post?.cover} alt={post?.title} />
          </div>
          <div
            className="post-detail__content"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <MusicPlayer playlist={data.music} />
      
      {currentPage === 'home' && (
        <>
          <Hero profile={data.profile} socials={data.socials} onNavigate={handleNavigate} />
          <Gallery photos={data.photos.slice(0, 6)} />
          <Blog posts={data.posts.slice(0, 3)} onReadMore={handleReadPost} />
          <Projects items={data.portfolio} />
          <About profile={data.profile} socials={data.socials} />
        </>
      )}

      {currentPage === 'gallery' && (
        <div className="page-wrapper">
          <div className="page-header">
            <span className="section-label">光影记录</span>
            <h1 className="section-title">
              摄影<span className="gradient-text">作品集</span>
            </h1>
            <p className="section-subtitle">
              用镜头记录生活中的美好瞬间，每一张照片都有它的故事与坐标。
            </p>
          </div>
          <Gallery photos={data.photos} />
        </div>
      )}

      {currentPage === 'blog' && (
        <div className="page-wrapper">
          <div className="page-header">
            <span className="section-label">文字记录</span>
            <h1 className="section-title">
              博客<span className="gradient-text">文章</span>
            </h1>
            <p className="section-subtitle">
              分享生活、旅行和技术的一些思考与感悟。
            </p>
          </div>
          <Blog posts={data.posts} onReadMore={handleReadPost} />
        </div>
      )}

      {currentPage === 'portfolio' && (
        <div className="page-wrapper">
          <div className="page-header">
            <span className="section-label">精选作品</span>
            <h1 className="section-title">
              我的<span className="gradient-text">作品集</span>
            </h1>
            <p className="section-subtitle">
              从摄影到开发，从文案到设计，每一个作品都是成长的印记。
            </p>
          </div>
          <Projects items={data.portfolio} />
        </div>
      )}

      {currentPage === 'about' && (
        <div className="page-wrapper">
          <About profile={data.profile} socials={data.socials} fullPage />
        </div>
      )}
    </div>
  );
}

export default App;
