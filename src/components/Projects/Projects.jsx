import './Projects.css';

function Projects({ items }) {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects__header">
          <div className="projects__header-left">
            <span className="section-label">精选作品</span>
            <h2 className="section-title">
              我的
              <span className="gradient-text"> 作品集</span>
            </h2>
          </div>
          <p className="section-subtitle projects__header-right">
            从摄影到开发，从文案到设计，
            每一个作品都是一次探索和成长。
          </p>
        </div>

        <div className="projects__grid">
          {items.map((item, index) => (
            <article
              key={item.id}
              className={`project-card ${index === 0 ? 'project-card--large' : ''}`}
            >
              <div className="project-card__image" style={{ background: item.gradient }}>
                {item.cover && (
                  <img src={item.cover} alt={item.title} className="project-card__image-img" />
                )}
                <div className="project-card__image-overlay"></div>
                <div className="project-card__image-content">
                  <span className="project-card__year">{item.date}</span>
                </div>
              </div>
              
              <div className="project-card__content">
                <div className="project-card__category">{item.category}</div>
                <h3 className="project-card__title">{item.title}</h3>
                <p className="project-card__description">{item.description}</p>
                {item.link && item.link !== '#' && (
                  <a href={item.link} className="project-card__more" target="_blank" rel="noopener noreferrer">
                    查看详情
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
