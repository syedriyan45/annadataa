import React, { useState, useEffect } from 'react';
import './SchemesModal.css';
import { centralSchemes, fetchSchemesForState, fetchBeneficiaryStatus } from '../data/schemesApiSimulation';
import { useLanguage } from '../context/LanguageContext';
import { translateDBText } from '../utils/translator';

const SchemesModal = ({ isOpen, onClose, state }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('explorer');
  const [stateSchemes, setStateSchemes] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  useEffect(() => {
    if (isOpen && state) {
      fetchSchemesForState(state).then(setStateSchemes);
    }
  }, [isOpen, state]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.toLowerCase().includes(language)) || voices[0];
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setIsLoading(true);
    const data = await fetchBeneficiaryStatus(searchId);
    setBeneficiaryData(data);
    setIsLoading(false);

    if (data && data.status === 'active') {
      speakText(`Beneficiary status verified for ${data.name}. Total installments received: ${data.totalInstallments}. eKYC is completed.`);
    } else {
      speakText('Beneficiary record not found. Please ensure 10-digit mobile or 12-digit Aadhaar number is entered.');
    }
  };

  const handleSpeakScheme = (scheme) => {
    speakText(`${translateDBText(scheme.name, language)}. Benefit: ${scheme.benefit || ''}. ${translateDBText(scheme.desc, language)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="schemes-modal-overlay" onClick={onClose}>
      <div className="schemes-modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="schemes-modal-header">
          <div>
            <h2>🏛️ Government Agricultural Schemes & Direct Portals</h2>
            <p>Verified Central & State farmer welfare programs, eligibility criteria, and official government application gateways</p>
          </div>
          <button className="close-btn" onClick={onClose}>{t('modals.close')}</button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            📋 Explore Verified Schemes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            🔍 PM-KISAN Beneficiary Status
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'explorer' ? (
            <div className="schemes-grid">
              {/* Central Schemes */}
              <div className="scheme-section">
                <div className="section-title-wrap">
                  <h3>🇮🇳 Central Government Schemes</h3>
                  <span className="badge-federal">Nationwide</span>
                </div>

                <div className="scheme-list">
                  {centralSchemes.map(scheme => {
                    const isExpanded = expandedSchemeId === scheme.id;
                    return (
                      <div key={scheme.id} className="scheme-item glass-panel">
                        <div className="scheme-item-top">
                          <div>
                            <h4>{translateDBText(scheme.name, language)}</h4>
                            <div className="benefit-pill">💰 {scheme.benefit}</div>
                          </div>
                          <div className="scheme-actions-row">
                            <button 
                              className="speak-mini-btn" 
                              onClick={() => handleSpeakScheme(scheme)} 
                              title="Listen"
                            >
                              🔊
                            </button>
                            <a 
                              href={scheme.applyUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="official-apply-btn"
                            >
                              🌐 Official Portal ↗
                            </a>
                          </div>
                        </div>

                        <p className="scheme-desc">{translateDBText(scheme.desc, language)}</p>

                        <button 
                          className="toggle-criteria-btn"
                          onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                        >
                          {isExpanded ? '▲ Hide Eligibility & Documents' : '▼ View Eligibility & Required Documents'}
                        </button>

                        {isExpanded && (
                          <div className="expanded-criteria-box">
                            <div className="criteria-row">
                              <strong>🎯 Eligibility:</strong>
                              <span>{scheme.eligibility}</span>
                            </div>
                            <div className="criteria-row">
                              <strong>📄 Required Documents:</strong>
                              <span>{scheme.documents}</span>
                            </div>
                            <div className="criteria-row">
                              <strong>🏢 Department Portal:</strong>
                              <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
                                {scheme.portalName} ({scheme.applyUrl})
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* State Schemes */}
              <div className="scheme-section">
                <div className="section-title-wrap">
                  <h3>🚩 {state} State Government Schemes</h3>
                  <span className="badge-regional">State Specific</span>
                </div>

                <div className="scheme-list">
                  {stateSchemes.map((scheme, i) => {
                    const schemeKey = `state-${i}`;
                    const isExpanded = expandedSchemeId === schemeKey;
                    return (
                      <div key={i} className="scheme-item glass-panel">
                        <div className="scheme-item-top">
                          <div>
                            <h4>{translateDBText(scheme.name, language)}</h4>
                            {scheme.benefit && (
                              <div className="benefit-pill state-pill">💰 {scheme.benefit}</div>
                            )}
                          </div>
                          <div className="scheme-actions-row">
                            <button 
                              className="speak-mini-btn" 
                              onClick={() => handleSpeakScheme(scheme)} 
                              title="Listen"
                            >
                              🔊
                            </button>
                            {scheme.applyUrl && (
                              <a 
                                href={scheme.applyUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="official-apply-btn state-btn"
                              >
                                🌐 State Portal ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="scheme-desc">{translateDBText(scheme.desc, language)}</p>

                        {(scheme.eligibility || scheme.documents) && (
                          <>
                            <button 
                              className="toggle-criteria-btn"
                              onClick={() => setExpandedSchemeId(isExpanded ? null : schemeKey)}
                            >
                              {isExpanded ? '▲ Hide Criteria' : '▼ View Criteria & Documents'}
                            </button>

                            {isExpanded && (
                              <div className="expanded-criteria-box">
                                {scheme.eligibility && (
                                  <div className="criteria-row">
                                    <strong>🎯 Eligibility:</strong>
                                    <span>{scheme.eligibility}</span>
                                  </div>
                                )}
                                {scheme.documents && (
                                  <div className="criteria-row">
                                    <strong>📄 Documents:</strong>
                                    <span>{scheme.documents}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* PM-KISAN Status Checker */
            <div className="beneficiary-search">
              {/* Direct Official Link Banner */}
              <div className="official-pmkisan-banner">
                <div className="official-banner-text">
                  <h3>🏛️ Direct Government PM-KISAN Portal Gateway</h3>
                  <p>
                    For official live Aadhaar OTP eKYC verification and direct bank DBT tracking, visit the Ministry of Agriculture portal directly:
                  </p>
                </div>
                <a 
                  href="https://pmkisan.gov.in/BeneficiaryStatus_New.aspx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gov-portal-direct-btn"
                >
                  🚀 Open Official pmkisan.gov.in Beneficiary Page ↗
                </a>
              </div>

              {/* Educational Demonstration / Mock Checker */}
              <div className="demo-checker-box glass-panel">
                <div className="demo-badge-wrap">
                  <span className="demo-pill">Educational Practice Simulator</span>
                  <span className="demo-sub">Practice checking your status format before visiting the official portal</span>
                </div>

                <h3>Check Beneficiary Status (Practice Mode)</h3>
                <p>Enter 12-digit Aadhaar Number or 10-digit Registered Mobile Number:</p>
                
                <div className="search-input-group">
                  <input 
                    type="text" 
                    placeholder="Enter 10-digit mobile or 12-digit Aadhaar..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                  <button className="search-btn" onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Verifying PFMS...' : 'Verify Status'}
                  </button>
                </div>

                {beneficiaryData && (
                  beneficiaryData.status === 'active' ? (
                    <div className="status-result">
                      <div className="status-header">
                        <div>
                          <strong>{translateDBText(beneficiaryData.name, language)}</strong>
                          <div className="verified-tag">✓ Aadhaar Biometrically Verified</div>
                        </div>
                        <div className="status-info">
                          <label>Scheme Registration Date</label>
                          <span>{beneficiaryData.registrationDate}</span>
                        </div>
                      </div>

                      <div className="status-grid">
                        <div className="status-info">
                          <label>eKYC Status</label>
                          <span style={{ color: '#15803D', fontWeight: 800 }}>{beneficiaryData.ekycStatus}</span>
                        </div>
                        <div className="status-info">
                          <label>Payment Mode</label>
                          <span>Aadhaar Payment Bridge (APB)</span>
                        </div>
                        <div className="status-info">
                          <label>Bank Account Linking</label>
                          <span style={{ color: '#15803D' }}>{beneficiaryData.bankLinking}</span>
                        </div>
                        <div className="status-info">
                          <label>Total Installments Received</label>
                          <span style={{ color: 'var(--emerald-primary)', fontWeight: 800 }}>
                            {beneficiaryData.totalInstallments} Installments
                          </span>
                        </div>
                      </div>

                      <div className="status-footer">
                        <span className="last-credit-text">
                          ✓ {beneficiaryData.lastInstallment}
                        </span>
                        <button className="speak-mini-btn" onClick={() => speakText(beneficiaryData.lastInstallment)}>
                          🔊 Listen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="status-error">
                      ⚠️ No active beneficiary record matched. Please ensure you have entered a valid 10-digit mobile number or 12-digit Aadhaar number.
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemesModal;
