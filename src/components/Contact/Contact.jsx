import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      alert('消息已发送！我会尽快回复你。');
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { name: 'GitHub', icon: '⌨', url: '#', description: '@username' },
    { name: '邮箱', icon: '✉', url: 'mailto:hello@example.com', description: 'hello@example.com' },
    { name: '微信', icon: '💬', url: '#', description: 'WeChat_ID' },
    { name: '博客', icon: '✎', url: '#', description: 'blog.example.com' },
  ];

  return (
    <section id="contact" className="contact">
      <div className="contact__bg">
        <div className="contact__bg-gradient"></div>
        <div className="contact__bg-grid"></div>
      </div>

      <div className="container contact__inner">
        <div className="contact__header">
          <span className="section-label">04 / 联系我</span>
          <h2 className="contact__title">
            让我们一起
            <br />
            <span className="gradient-text">创造些什么</span>
          </h2>
          <p className="contact__subtitle">
            无论是项目合作、实习机会还是技术交流，都欢迎随时联系我。
            <br />
            我通常会在 24 小时内回复。
          </p>
        </div>

        <div className="contact__content">
          {/* Left - Contact Info */}
          <div className="contact__info">
            <div className="contact__info-card glass-card">
              <h3 className="contact__info-title">联系方式</h3>
              <div className="contact__info-list">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    className="contact__info-item"
                  >
                    <span className="contact__info-icon">{link.icon}</span>
                    <div>
                      <span className="contact__info-name">{link.name}</span>
                      <span className="contact__info-desc">{link.description}</span>
                    </div>
                    <svg
                      className="contact__info-arrow"
                      width="18"
                      height="18"
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

            <div className="contact__availability glass-card">
              <div className="contact__availability-header">
                <span className="contact__availability-dot"></span>
                <span>目前状态</span>
              </div>
              <p className="contact__availability-text">
                正在寻找 <strong>前端开发实习</strong> 机会
                <br />
                可远程或线下，随时可以开始
              </p>
            </div>
          </div>

          {/* Right - Contact Form */}
          <form className="contact__form glass-card" onSubmit={handleSubmit}>
            <h3 className="contact__form-title">发送消息</h3>
            
            <div className="contact__form-group">
              <label className="contact__form-label" htmlFor="name">
                姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact__form-input"
                placeholder="你的名字"
                required
              />
            </div>

            <div className="contact__form-group">
              <label className="contact__form-label" htmlFor="email">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact__form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="contact__form-group">
              <label className="contact__form-label" htmlFor="message">
                留言
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact__form-textarea"
                placeholder="想和我说什么？"
                rows={5}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="contact__form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="contact__form-spinner"></span>
                  发送中...
                </>
              ) : (
                <>
                  发送消息
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="contact__footer">
          <div className="contact__footer-left">
            <span className="contact__footer-logo">◆ Portfolio</span>
            <span className="contact__footer-copy">© 2024 All rights reserved.</span>
          </div>
          <div className="contact__footer-right">
            <span>用 ❤ 和 React 构建</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
