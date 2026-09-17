import './About.css';

function About({ profile, socials, fullPage = false }) {
  const stats = [
    { number: '50+', label: '摄影作品', icon: '📷' },
    { number: '20+', label: '文章随笔', icon: '✍️' },
    { number: '3+', label: '年创作经验', icon: '⚡' },
    { number: '∞', label: '热爱与坚持', icon: '❤️' },
  ];

  return (
    <section id="about" className={`about ${fullPage ? 'about--full' : ''}`}>
      <div className="container about__inner">
        {!fullPage && (
          <div className="about__header">
            <span className="section-label">关于我</span>
            <h2 className="section-title">
              认识一下
              <span className="gradient-text"> 我</span>
            </h2>
          </div>
        )}

        {fullPage && (
          <div className="about__header about__header--full">
            <span className="section-label">01 / 关于我</span>
            <h1 className="section-title">
              {profile.name}
              <br />
              <span className="gradient-text">{profile.title}</span>
            </h1>
          </div>
        )}

        <div className="about__content">
          {/* Left - Avatar & Info */}
          <div className="about__left">
            <div className="about__avatar-wrapper">
              <div className="about__avatar-glow"></div>
              <div className="about__avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <div className="about__avatar-placeholder">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="about__avatar-badge">
                <span className="about__avatar-status"></span>
                {profile.location}
              </div>
            </div>

            <div className="about__contact glass-card">
              <h3 className="about__contact-title">社交 & 联系</h3>
              <div className="about__contact-list">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    className="about__contact-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="about__contact-icon">{social.icon}</span>
                    <div>
                      <span className="about__contact-label">{social.name}</span>
                      <span className="about__contact-value">{social.handle}</span>
                    </div>
                    <svg
                      className="about__contact-arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Bio & Stats */}
          <div className="about__right">
            <div className="about__bio">
              <p className="about__bio-text">
                你好！我是<span className="highlight">{profile.name}</span>，
                {profile.bio}
              </p>
              <p className="about__bio-text">
                我相信<span className="highlight">记录是一种生活方式</span>。
                无论是镜头下的光影，还是文字里的情绪，
                每一次创作都是和这个世界对话的方式。
              </p>
              <p className="about__bio-text">
                如果你也喜欢摄影、音乐，或者只是想打个招呼——
                <span className="highlight">欢迎随时联系我</span>。
              </p>
            </div>

            <div className="about__stats">
              {stats.map((stat, index) => (
                <div key={index} className="about__stat-card glass-card">
                  <span className="about__stat-icon">{stat.icon}</span>
                  <span className="about__stat-number">{stat.number}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
