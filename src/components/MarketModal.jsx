import React, { useState, useEffect } from 'react';
import './MarketModal.css';
import { fetchSimulatedMarketData } from '../data/marketApiSimulation';
import { useLanguage } from '../context/LanguageContext';
import { translateDBText } from '../utils/translator';
import { isMainCropOfLocation, getLocationCropPriority } from '../data/cityMainCrops';

const mainCropLabel = {
  en: "⭐ Main Crop",
  hi: "⭐ मुख्य फसल",
  mr: "⭐ मुख्य पीक",
  bn: "⭐ প্রধান ফসল",
  gu: "⭐ મુખ્ય પાક",
  ta: "⭐ முக்கிய பயிர்",
  te: "⭐ ప్రధాన పంట",
  kn: "⭐ मुख्य ಬೆಳೆ"
};

const MarketModal = ({ isOpen, onClose, state, city }) => {
  const { t, language } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchSimulatedMarketData(state, city).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen, state, city]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language;
    const selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
                          voices.find(v => v.lang.toLowerCase().includes(langPrefix)) ||
                          voices.find(v => v.lang.includes('IN')) ||
                          voices.find(v => v.name.includes('Google') && v.lang.includes('en')) ||
                          voices.find(v => v.lang.includes('en-IN')) ||
                          voices[0];
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakItem = (item) => {
    const template = t('modals.market.speakItem');
    const trendVal = item.trend === 'up' ? t('modals.market.trendUp') : t('modals.market.trendDown');
    const trendText = trendVal.replace(/[▲▼]/g, '').trim();
    const text = template
      .replace('{name}', translateDBText(item.name, language))
      .replace('{city}', translateDBText(city, language))
      .replace('{price}', item.localPrice)
      .replace('{trend}', trendText);
    speakText(text);
  };

  // Sort: Main Crops of the selected state/city first, ordered by priority
  const sortedData = [...data].sort((a, b) => {
    const priorityA = getLocationCropPriority(a.name, state, city);
    const priorityB = getLocationCropPriority(b.name, state, city);
    return priorityA - priorityB;
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📈 {t('modals.market.title')}</h2>
          <button className="close-btn" onClick={onClose}>{t('modals.close')}</button>
        </div>
        
        <div className="modal-body">
          <div className="market-info">
            <span className="source-badge enam">e-NAM Sync</span>
            <span className="source-badge agmarknet">Agmarknet Live</span>
            <span className="location-info">📍 {translateDBText(city, language)}, {translateDBText(state, language)} {t('modals.market.vsNearby')}</span>
          </div>

          {loading ? (
            <div className="loading-spinner">{t('modals.market.loading')}</div>
          ) : (
            <div className="table-container">
              <table className="market-table">
                <thead>
                  <tr>
                    <th>🔊</th>
                    <th>{t('modals.market.colCommodity')}</th>
                    <th>{translateDBText(city, language)} {t('modals.market.colPrice')}</th>
                    <th>{t('modals.market.colNearby')}</th>
                    <th>{t('modals.market.colTrend')}</th>
                    <th>{t('modals.market.colDiff')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, i) => {
                    const isMain = isMainCropOfLocation(item.name, state, city);
                    return (
                      <tr key={i} className={isMain ? "main-crop-row" : ""}>
                        <td>
                          <button 
                            className="speak-card-btn" 
                            onClick={() => handleSpeakItem(item)}
                            style={{ padding: '0.4rem 0.6rem' }}
                            title={t('card.listenTitle')}
                          >
                            🔊
                          </button>
                        </td>
                        <td className="commodity-name">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {translateDBText(item.name, language)}
                            {isMain && (
                              <span className="main-crop-badge">
                                {mainCropLabel[language] || mainCropLabel['en']}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="local-price">₹{item.localPrice}</td>
                        <td className="nearby-price">
                          ₹{item.nearbyAvg}
                          <div className="nearby-details">
                            ({translateDBText(item.nearbyCity1Name, language)}: ₹{item.nearbyCity1Price}, {translateDBText(item.nearbyCity2Name, language)}: ₹{item.nearbyCity2Price})
                          </div>
                        </td>
                        <td className={`trend ${item.trend}`} style={{ fontSize: '1.2rem' }}>
                          {item.trend === 'up' ? t('modals.market.trendUp') : t('modals.market.trendDown')}
                        </td>
                        <td className={`difference ${item.difference >= 0 ? 'positive' : 'negative'}`}>
                          {item.difference >= 0 ? '+' : ''}{item.difference}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketModal;
