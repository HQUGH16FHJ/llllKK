import './Logo.css';

function Logo({ size = 'md' }) {
  return (
    <div className={`logo logo--${size}`}>
      <div className="logo__mark">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo__svg">
          {/* 外圈 - 渐变圆环 */}
          <circle cx="20" cy="20" r="18" stroke="url(#grad1)" strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle cx="20" cy="20" r="14" stroke="url(#grad1)" strokeWidth="0.5" fill="none" opacity="0.3" />
          
          {/* 内部图形 - "骐"字首字母 Q 的抽象变形 + 星光 */}
          <path
            d="M20 8 L28 14 L28 26 L20 32 L12 26 L12 14 Z"
            fill="url(#grad1)"
            opacity="0.15"
          />
          
          {/* 核心图案 - 类似镜头光圈 + 星芒 */}
          <circle cx="20" cy="20" r="6" fill="url(#grad1)" opacity="0.9" />
          <circle cx="20" cy="20" r="3" fill="white" opacity="0.9" />
          
          {/* 星芒效果 */}
          <line x1="20" y1="6" x2="20" y2="10" stroke="url(#grad1)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="30" x2="20" y2="34" stroke="url(#grad1)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="20" x2="10" y2="20" stroke="url(#grad1)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="20" x2="34" y2="20" stroke="url(#grad1)" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* 对角星芒 */}
          <line x1="10" y1="10" x2="12.5" y2="12.5" stroke="url(#grad1)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="27.5" y1="27.5" x2="30" y2="30" stroke="url(#grad1)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="30" y1="10" x2="27.5" y2="12.5" stroke="url(#grad1)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="12.5" y1="27.5" x2="10" y2="30" stroke="url(#grad1)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 发光效果 */}
        <div className="logo__glow"></div>
      </div>
      
      <div className="logo__text">
        <span className="logo__name">骐迹</span>
        <span className="logo__subtitle">QISHUO · 记录生活</span>
      </div>
    </div>
  );
}

export default Logo;
