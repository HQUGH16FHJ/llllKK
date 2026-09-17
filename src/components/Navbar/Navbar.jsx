import { useState, useEffect } from 'react';
import Logo from '../Logo/Logo';
import './Navbar.css';

function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            className="navbar__admin-link"
            onClick={() => handleNav('admin')}
            title="后台管理"
          >
            ⚙
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
