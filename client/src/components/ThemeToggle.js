import React from 'react';
import '../styles/ThemeToggle.css';

const ThemeToggle = ({ theme, onThemeChange }) => {
  const themes = [
    { id: 'neon-dark', label: '🟣 Neon Dark', icon: '🌙' },
    { id: 'neon-light', label: '⭐ Neon Light', icon: '☀️' },
    { id: 'synthwave-dark', label: '🔮 Synthwave Dark', icon: '🌙' },
    { id: 'synthwave-light', label: '💛 Synthwave Light', icon: '☀️' },
  ];

  return (
    <div className="theme-toggle">
      <div className="theme-dropdown">
        <button className="theme-toggle-btn">
          🎨 THEME
        </button>
        <div className="theme-options">
          {themes.map(t => (
            <button
              key={t.id}
              className={`theme-option ${theme === t.id ? 'active' : ''}`}
              onClick={() => onThemeChange(t.id)}
            >
              <span className="theme-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
