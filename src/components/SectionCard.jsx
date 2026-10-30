import React, { useState } from 'react';
import './SectionCard.css';
import { useLanguage } from '../context/LanguageContext';

const SectionCard = ({ title, description, icon, primaryColor, exploreText, widgetData, onExplore, cardType, isRaining, marketTrend }) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Build a natural readable script:
    // e.g. "Crop Advisory. Get real-time pest details and cure instructions."
    const cleanText = `${title}. ${description}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    const langPrefix = language;
    selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
                    voices.find(v => v.lang.toLowerCase().includes(langPrefix)) ||
                    voices.find(v => v.lang.includes('IN')) ||
                    voices.find(v => v.name.includes('Google') && v.lang.includes('en')) ||
                    voices.find(v => v.lang.includes('en-IN')) ||
                    voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const renderAnimationBg = () => {
    if (!cardType) return null;

    const elements = [];
    
    if (cardType === 'weather') {
      if (isRaining) {
        for (let i = 0; i < 15; i++) {
          const style = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`
          };
          elements.push(<div key={`rain-${i}`} className="rain-drop" style={style}></div>);
        }
        return <div className="card-animated-bg weather-rain">{elements}</div>;
      } else {
        for (let i = 0; i < 3; i++) {
          const style = {
            top: `${10 + Math.random() * 40}%`,
            animationDelay: `${i * 3}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          };
          elements.push(<div key={`cloud-${i}`} className="cloud-particle" style={style}>☁️</div>);
        }
        return (
          <div className="card-animated-bg weather-sunny">
            <div className="sun-ray-pulse"></div>
            {elements}
          </div>
        );
      }
    }

    if (cardType === 'advisory') {
      if (isRaining) {
        for (let i = 0; i < 8; i++) {
          const rainStyle = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`
          };
          elements.push(<div key={`rain-advisory-${i}`} className="rain-drop" style={rainStyle}></div>);
        }
      }
      for (let i = 0; i < 6; i++) {
        const leafStyle = {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${4 + Math.random() * 4}s`,
          fontSize: `${12 + Math.random() * 14}px`
        };
        elements.push(<div key={`leaf-${i}`} className="floating-leaf" style={leafStyle}>🍃</div>);
      }
      return <div className="card-animated-bg advisory-bg">{elements}</div>;
    }

    if (cardType === 'market') {
      const arrow = marketTrend === 'up' ? '▲' : '▼';
      const arrowClass = marketTrend === 'up' ? 'trend-up-arrow' : 'trend-down-arrow';
      for (let i = 0; i < 5; i++) {
        const style = {
          left: `${10 + Math.random() * 80}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 3}s`
        };
        elements.push(
          <div key={`ticker-${i}`} className={`floating-ticker ${arrowClass}`} style={style}>
            {arrow}
          </div>
        );
      }
      return <div className="card-animated-bg market-bg">{elements}</div>;
    }

    if (cardType === 'rental') {
      for (let i = 0; i < 3; i++) {
        const style = {
          left: `${15 + i * 30}%`,
          top: `${20 + Math.random() * 50}%`,
          transform: `scale(${0.6 + Math.random() * 0.8})`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${6 + Math.random() * 8}s`
        };
        elements.push(
          <div key={`gear-${i}`} className="rotating-gear" style={style}>
            ⚙️
          </div>
        );
      }
      return <div className="card-animated-bg rental-bg">{elements}</div>;
    }

    if (cardType === 'marketplace') {
      for (let i = 0; i < 4; i++) {
        const style = {
          left: `${10 + Math.random() * 80}%`,
          top: `${20 + Math.random() * 60}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2.5 + Math.random() * 2.5}s`
        };
        elements.push(
          <div key={`node-${i}`} className="pulsing-node" style={style}>
            🤝
          </div>
        );
      }
      return <div className="card-animated-bg marketplace-bg">{elements}</div>;
    }

    if (cardType === 'schemes') {
      for (let i = 0; i < 5; i++) {
        const style = {
          left: `${10 + Math.random() * 80}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${4 + Math.random() * 4}s`
        };
        elements.push(
          <div key={`star-${i}`} className="floating-star" style={style}>
            ✨
          </div>
        );
      }
      return <div className="card-animated-bg schemes-bg">{elements}</div>;
    }

    return null;
  };

  return (
    <div 
      className="section-card glass-panel" 
      style={{ 
        '--card-primary': primaryColor
      }}
    >
      {renderAnimationBg()}
      <div className="card-content">
        <div className="card-header">
          <div className="icon-container">
            <span className="card-icon">{icon}</span>
          </div>
          <h3>{title}</h3>
        </div>
        
        {widgetData && (
          <div className="card-widget">
            {widgetData}
          </div>
        )}
        <div className="card-body">
          <p>{description}</p>
        </div>
        <div className="card-footer">
          <button 
            className={`speak-card-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handleSpeak}
            title={t('card.listenTitle')}
          >
            {isPlaying ? t('card.stop') : t('card.listen')}
          </button>
          
          <button className="explore-btn" onClick={onExplore}>
            {exploreText || "Explore"} <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
