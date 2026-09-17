import { useEffect, useState } from 'react';
import './Hero.css';

function Hero({ profile, socials, onNavigate }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="hero">
      {/* 动态背景 */}
      <div className="hero__bg">
        <div className="hero__bg-gradient"></div>
        <div className="hero__bg-grid"></div>
        <div 
          className="hero__bg-orb hero__bg-orb--1"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div 
          className="hero__bg-orb hero__bg-orb--2"
          style={{ transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)` }}
        ></div>
        <div className="hero__bg-noise"></div>
        
        {/* 粒子效果 */}
        <div className="hero__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="hero__particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container hero__content">
        <div className="hero__text">
          <div className="hero__badge animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="hero__badge-dot"></span>
            {profile.location} · {profile.title}
          </div>
          
          <h1 className="hero__title animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            你好，我是
            <br />
            <span className="gradient-text">{profile.name}</span>
          </h1>
          
          <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            {profile.bio}
          </p>
          
          <div className="hero__actions animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <button onClick={() => onNavigate('gallery')} className="hero__btn hero__btn--primary">
              <span>浏览照片</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button onClick={() => onNavigate('blog')} className="hero__btn hero__btn--secondary">
              阅读文章
            </button>
          </div>

          {/* 社交链接 */}
          <div className="hero__socials animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
            {socials.slice(0, 4).map((social) => (
              <a
                key={social.id}
                href={social.url}
                className="hero__social-link"
                title={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="hero__social-icon">{social.icon}</span>
                <span className="hero__social-handle">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="hero__portrait animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <img src={profile.avatar || '/images/avatar.jpg'} alt={profile.name} />
          <div className="hero__portrait-badge">
            <span></span>
            {profile.location}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
