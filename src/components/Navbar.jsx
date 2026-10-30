import React, { useState } from 'react';
import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import WakeWordListener from './WakeWordListener';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="cyber-logo">
            <svg viewBox="0 0 100 100" className="logo-svg">
              <polygon points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" fill="none" stroke="var(--blue-accent)" strokeWidth="3" opacity="0.6"/>
              <polygon points="50 15, 80 30, 80 70, 50 85, 20 70, 20 30" fill="none" stroke="var(--teal-glow)" strokeWidth="1.5" strokeDasharray="5,5" className="spin-slow"/>
              <path d="M50 80 C 20 50, 30 20, 50 20 C 70 20, 80 50, 50 80 Z" fill="url(#leafGradient)" />
              <path d="M50 20 L 50 80 M 35 45 L 50 60 M 65 45 L 50 60" stroke="#071120" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="5" r="4" fill="var(--teal-glow)"/>
              <circle cx="90" cy="25" r="4" fill="var(--teal-glow)"/>
              <circle cx="10" cy="25" r="4" fill="var(--teal-glow)"/>
              <defs>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--emerald-light)" />
                  <stop offset="100%" stopColor="var(--emerald-primary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <h1>अन्नदाता</h1>
            <span className="subtitle">ANNADAATA</span>
          </div>
        </Link>
      </div>

      <button 
        className="mobile-hamburger-btn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          🏠 {t('nav.dashboard') || 'Dashboard'}
        </NavLink>

        <NavLink 
          to="/calendar" 
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          📅 Crop Calendar
        </NavLink>

        <NavLink 
          to="/weather" 
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          ⛅ {t('nav.weather') || 'Weather'}
        </NavLink>

        <NavLink 
          to="/market" 
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          🤝 {t('nav.market') || 'Mandi Market'}
        </NavLink>

        <NavLink 
          to="/monitor" 
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          🛰️ Satellite
        </NavLink>
        
        <div className="language-selector">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="lang-dropdown"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="bn">বাংলা</option>
            <option value="gu">ગુજરાતી</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
        
        <WakeWordListener />

        {user ? (
          <div className="user-nav-dropdown">
            <Link to="/profile" className="user-name-badge" onClick={() => setMobileMenuOpen(false)}>
              <span className="user-avatar-icon">👨‍🌾</span>
              <span className="user-name-text">{user.name}</span>
            </Link>
            <button className="nav-signout-btn" onClick={handleSignOut} title="Sign Out">
              Sign Out
            </button>
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="login-btn" 
            style={{ textDecoration: 'none', textAlign: 'center' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.signIn') || 'Sign In'}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
