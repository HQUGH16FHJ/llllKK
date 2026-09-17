import { useState, useEffect } from 'react';
import Logo from '../Logo/Logo';
import './Navbar.css';

function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio_theme') || 'light');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  const navLinks = [
    { id: 'home', label: '首页' },
    { id: 'gallery', label: '摄影' },
    { id: 'blog', label: '文章' },
    { id: 'portfolio', label: '作品' },
    { id: 'about', label: '关于' },
  ];

  const handleNav = (id) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <button className="navbar__logo" onClick={() => handleNav('home')}>
          <Logo size="sm" />
        </button>

        <div className={`navbar__links ${mobileMenuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`navbar__link ${currentPage === link.id ? 'active' : ''}`}
              onClick={() => handleNav(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="navbar__actions">
          <button
            className="navbar__theme"
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            title={theme === 'dark' ? '切换浅色模式' : '切换深色模式'}
            aria-label="切换深浅色"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.7 13.2A8.5 8.5 0 1 1 10.8 3.3 6.8 6.8 0 0 0 20.7 13.2Z" />
              </svg>
            )}
          </button>
          <button
            className="navbar__admin-link"
            onClick={() => handleNav('admin')}
            title="后台管理"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.37.32.7.6 1 .3.26.68.4 1.1.4h.09v4h-.09a1.7 1.7 0 0 0-1.7.6Z" />
            </svg>
          </button>
          <button className="navbar__cta" onClick={() => handleNav('about')}>
            <span>关于我</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          className={`navbar__mobile-toggle ${mobileMenuOpen ? 'navbar__mobile-toggle--open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
