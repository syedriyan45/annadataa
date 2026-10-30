import React, { useState } from 'react';
import './AdvisoryModal.css';
import { allCrops, zoneMap } from '../data/cropAdvisoryData';
import AIDiseaseDoctor from './AIDiseaseDoctor';
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

const AdvisoryModal = ({ isOpen, onClose, state, city }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('All');
  
  const userZone = zoneMap[state] || zoneMap[city] || "Central";
  
  const filteredCrops = allCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = selectedSeason === 'All' || crop.season === selectedSeason;
    const matchesZone = crop.zone.includes(userZone);
    return matchesSearch && matchesSeason && matchesZone;
  });

  // Sort crops: City/State main crops first, ordered by priority
  const sortedCrops = [...filteredCrops].sort((a, b) => {
    const priorityA = getLocationCropPriority(a.name, state, city);
    const priorityB = getLocationCropPriority(b.name, state, city);
    return priorityA - priorityB;
  });

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    const langPrefix = language;
    selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
                    voices.find(v => v.lang.toLowerCase().includes(langPrefix)) ||
                    voices.find(v => v.lang.includes('IN')) ||
                    voices.find(v => v.name.includes('Google') && v.lang.includes('en')) ||
                    voices.find(v => v.lang.includes('en-IN')) ||
                    voices[0];
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakCrop = (crop) => {
    const template = t('modals.advisory.speakCrop');
    const translatedName = translateDBText(crop.name, language);
    const translatedSeason = translateDBText(crop.season, language);
    const translatedPests = crop.pests.map(p => translateDBText(p, language)).join(', ');
    const speech = template
      .replace('{crop}', translatedName)
      .replace('{season}', translatedSeason)
      .replace('{pests}', translatedPests);
    speakText(speech);
  };

  const handleSpeakProtection = (crop) => {
    const template = t('modals.advisory.speakProtection');
    const translatedName = translateDBText(crop.name, language);
    const translatedPest = translateDBText(crop.pests[0], language);
    const translatedTreatment = translateDBText(crop.treatment, language);
    const translatedDosage = translateDBText(crop.dosage, language);
    const speech = template
      .replace('{crop}', translatedName)
      .replace('{pest}', translatedPest)
      .replace('{treatment}', translatedTreatment)
      .replace('{dosage}', translatedDosage);
    speakText(speech);
  };

  const protectionLabels = {
    en: "Protection",
    hi: "सुरक्षा",
    mr: "संरक्षण",
    bn: "সুরক্ষা",
    gu: "સુરક્ષા",
    ta: "பாதுகாப்பு",
    te: "రక్షణ",
    kn: "ರಕ್ಷಣೆ"
  };

  if (!isOpen) return null;

  return (
    <div className="advisory-modal-overlay" onClick={onClose}>
      <div className="advisory-modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="advisory-modal-header">
          <div>
            <h2>🌱 {t('modals.advisory.title')}</h2>
            <p>{t('modals.advisory.subtitle')} {translateDBText(city, language)}, {translateDBText(state, language)} ({t('modals.advisory.zone')}: {translateDBText(userZone, language)})</p>
          </div>
          <button className="close-btn" onClick={onClose}>{t('modals.close')}</button>
        </div>

        <div className="modal-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button 
            className="explore-btn"
            style={{ background: activeTab === 'calendar' ? 'var(--emerald-primary)' : '#E2E8F0', color: activeTab === 'calendar' ? '#FFF' : '#334155' }}
            onClick={() => setActiveTab('calendar')}
          >
            {t('modals.advisory.tabCalendar')}
          </button>
          <button 
            className="explore-btn"
            style={{ background: activeTab === 'pests' ? 'var(--emerald-primary)' : '#E2E8F0', color: activeTab === 'pests' ? '#FFF' : '#334155' }}
            onClick={() => setActiveTab('pests')}
          >
            {t('modals.advisory.tabPests')}
          </button>
          <button 
            className="explore-btn"
            style={{ background: activeTab === 'doctor' ? 'var(--emerald-primary)' : '#E2E8F0', color: activeTab === 'doctor' ? '#FFF' : '#334155' }}
            onClick={() => setActiveTab('doctor')}
          >
            {t('modals.advisory.tabDoctor')}
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'calendar' && (
            <div className="calendar-tab">
              <div className="filter-bar">
                <input 
                  type="text" 
                  placeholder={t('modals.advisory.searchPlaceholder')} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select 
                  value={selectedSeason} 
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="season-select"
                >
                  <option value="All">{t('modals.advisory.allSeasons')}</option>
                  <option value="Kharif">{translateDBText('Kharif', language)}</option>
                  <option value="Rabi">{translateDBText('Rabi', language)}</option>
                  <option value="Zaid">{translateDBText('Zaid', language)}</option>
                </select>
              </div>
              <div className="crop-list">
                {sortedCrops.map(crop => {
                  const isMain = isMainCropOfLocation(crop.name, state, city);
                  return (
                    <div key={crop.id} className={`crop-card-mini ${isMain ? "main-crop-card" : ""}`}>
                      <div className="crop-info">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <h4 style={{ margin: 0 }}>{translateDBText(crop.name, language)}</h4>
                          {isMain && (
                            <span className="main-crop-badge-advisory" style={{ alignSelf: 'flex-start' }}>
                              {mainCropLabel[language] || mainCropLabel['en']}
                            </span>
                          )}
                        </div>
                        <span className={`season-badge ${crop.season.toLowerCase()}`}>{translateDBText(crop.season, language)}</span>
                      </div>
                      <div className="crop-details" style={{ marginBottom: '1rem' }}>
                        <span><strong>{t('modals.advisory.pests')}:</strong> {crop.pests.map(p => translateDBText(p, language)).join(', ')}</span>
                      </div>
                      <button 
                        className="speak-card-btn"
                        onClick={() => handleSpeakCrop(crop)}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {t('card.listen')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pests' && (
            <div className="pests-tab">
              <div className="treatment-grid">
                {sortedCrops.slice(0, 12).map(crop => {
                  const isMain = isMainCropOfLocation(crop.name, state, city);
                  return (
                    <div key={crop.id} className={`treatment-card ${isMain ? "main-crop-card" : ""}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.8rem' }}>
                        <h4 style={{ margin: 0 }}>{translateDBText(crop.name, language)} {protectionLabels[language] || "Protection"}</h4>
                        {isMain && (
                          <span className="main-crop-badge-advisory">
                            {mainCropLabel[language] || mainCropLabel['en']}
                          </span>
                        )}
                      </div>
                      <div className="pest-alert">
                        <span className="alert-icon">⚠️</span>
                        <div>
                          <strong>{t('modals.advisory.pestLabel')}</strong> {translateDBText(crop.pests[0], language)}
                        </div>
                      </div>
                      <div className="remedy" style={{ marginBottom: '1.2rem' }}>
                        <div className="remedy-item">
                          <label>{t('modals.advisory.pesticide')}:</label>
                          <span>{translateDBText(crop.treatment, language)}</span>
                        </div>
                        <div className="remedy-item">
                          <label>{t('modals.advisory.dosage')}:</label>
                          <span className="dosage">{translateDBText(crop.dosage, language)}</span>
                        </div>
                      </div>
                      <button 
                        className="speak-card-btn"
                        onClick={() => handleSpeakProtection(crop)}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {t('card.listen')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'doctor' && (
            <AIDiseaseDoctor currentCrop={searchTerm || "General"} state={state} city={city} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisoryModal;
