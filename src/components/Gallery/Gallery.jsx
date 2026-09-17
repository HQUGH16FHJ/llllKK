import { useState } from 'react';
import './Gallery.css';

function Gallery({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('全部');

  const categories = ['全部', ...new Set(photos.map((p) => p.category))];

  const filteredPhotos =
    filter === '全部' ? photos : photos.filter((p) => p.category === filter);

  return (
    <section className="gallery">
      <div className="container">
        <div className="gallery__header">
          <span className="section-label">光影记录</span>
          <h2 className="section-title">
            镜头下的
            <span className="gradient-text"> 世界</span>
          </h2>
          <p className="section-subtitle">
            用照片记录生活中的美好瞬间，每一张都有它的故事。
          </p>

          <div className="gallery__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`gallery__filter ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery__grid">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="gallery__item"
              onClick={() => setSelectedPhoto(photo)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="gallery__item-image">
                <img src={photo.image} alt={photo.title} loading="lazy" />
                <div className="gallery__item-overlay">
                  <div className="gallery__item-info">
                    <h3 className="gallery__item-title">{photo.title}</h3>
                    <div className="gallery__item-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {photo.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 灯箱 */}
      {selectedPhoto && (
        <div
          className="gallery__lightbox"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="gallery__lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery__lightbox-close"
              onClick={() => setSelectedPhoto(null)}
            >
              ✕
            </button>
            <div className="gallery__lightbox-image">
              <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            </div>
            <div className="gallery__lightbox-info">
              <div>
                <h3>{selectedPhoto.title}</h3>
                <p>{selectedPhoto.description}</p>
              </div>
              <div className="gallery__lightbox-meta">
                <div className="gallery__lightbox-meta-item">
                  <span className="gallery__lightbox-meta-icon">📍</span>
                  <div>
                    <span className="gallery__lightbox-meta-label">地点</span>
                    <span className="gallery__lightbox-meta-value">{selectedPhoto.location}</span>
                  </div>
                </div>
                <div className="gallery__lightbox-meta-item">
                  <span className="gallery__lightbox-meta-icon">🌐</span>
                  <div>
                    <span className="gallery__lightbox-meta-label">坐标</span>
                    <span className="gallery__lightbox-meta-value">{selectedPhoto.coordinates}</span>
                  </div>
                </div>
                <div className="gallery__lightbox-meta-item">
                  <span className="gallery__lightbox-meta-icon">📅</span>
                  <div>
                    <span className="gallery__lightbox-meta-label">日期</span>
                    <span className="gallery__lightbox-meta-value">{selectedPhoto.date}</span>
                  </div>
                </div>
                <div className="gallery__lightbox-meta-item">
                  <span className="gallery__lightbox-meta-icon">🏷️</span>
                  <div>
                    <span className="gallery__lightbox-meta-label">分类</span>
                    <span className="gallery__lightbox-meta-value">{selectedPhoto.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
