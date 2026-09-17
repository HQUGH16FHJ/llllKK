import { useState } from 'react';
import './Blog.css';

function Blog({ posts, onReadMore }) {
  const [filter, setFilter] = useState('全部');

  const categories = ['全部', ...new Set(posts.map((p) => p.category))];
  const filteredPosts =
    filter === '全部' ? posts : posts.filter((p) => p.category === filter);

  return (
    <section className="blog-section">
      <div className="container">
        <div className="blog-section__header">
          <span className="section-label">文字记录</span>
          <h2 className="section-title">
            最新
            <span className="gradient-text"> 文章</span>
          </h2>
          <p className="section-subtitle">
            分享生活、旅行和技术的一些思考与感悟。
          </p>

          <div className="blog-section__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-section__filter ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-section__grid">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="blog-card glass-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onReadMore && onReadMore(post.id)}
            >
              <div className="blog-card__cover">
                <img src={post.cover} alt={post.title} loading="lazy" />
                <span className="blog-card__category">{post.category}</span>
              </div>
              <div className="blog-card__content">
                <div className="blog-card__meta">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__more">
                  <span>阅读全文</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;
