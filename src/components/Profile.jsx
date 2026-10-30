import React from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { translateDBText } from '../utils/translator';
import { indianStatesCities } from '../data/indianStatesCities';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, selectedState, setSelectedState, selectedCity, setSelectedCity, signOut } = useUser();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    if (indianStatesCities[state] && indianStatesCities[state].length > 0) {
      setSelectedCity(indianStatesCities[state][0]);
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="profile-container" style={{ maxWidth: '680px', margin: '0 auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '2.2rem', background: '#FFFFFF', border: '3px solid var(--emerald-primary)', borderRadius: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--emerald-dark)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          👨‍🌾 {t('nav.profile') || 'Farmer Profile & Settings'}
        </h2>
        
        {user ? (
          <div style={{ marginBottom: '2rem', background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '16px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '2px solid #15803D' }}>
                👨‍🌾
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--emerald-dark)' }}>{user.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, margin: '0.2rem 0 0' }}>
                  {user.email || 'Verified Annadata Member'}
                </p>
                <span style={{ display: 'inline-block', marginTop: '0.4rem', background: '#15803D', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  ✓ ACTIVE FARMER ACCOUNT
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem', padding: '1.2rem', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '16px' }}>
            <p style={{ fontWeight: 800, color: '#D97706', margin: 0, fontSize: '1.1rem' }}>Guest Mode (अतिथि मोड)</p>
            <p style={{ fontSize: '0.92rem', margin: '0.4rem 0 1rem', color: '#B45309' }}>
              Sign in or create an account to list produce in the local mandi, save farm records, and receive custom weather alerts.
            </p>
            <button 
              className="post-listing-btn"
              onClick={() => navigate('/auth')}
              style={{ width: '100%' }}
            >
              Sign In / Create Account
            </button>
          </div>
        )}

        <hr style={{ border: '0', height: '2px', background: 'var(--navy-light)', margin: '1.5rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 800, color: 'var(--emerald-dark)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              🌍 Farm State / राज्य
            </label>
            <select 
              value={selectedState} 
              onChange={handleStateChange}
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #CBD5E1', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {Object.keys(indianStatesCities).map(state => (
                <option key={state} value={state}>{translateDBText(state, language)}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: 'var(--emerald-dark)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              📍 Farm District / Mandi City / जिला
            </label>
            <select 
              value={selectedCity} 
              onChange={handleCityChange}
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #CBD5E1', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {indianStatesCities[selectedState]?.map(city => (
                <option key={city} value={city}>{translateDBText(city, language)}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: 'var(--emerald-dark)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              🗣️ Preferred Language / भाषा
            </label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #CBD5E1', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div>

        {user && (
          <button 
            className="speak-card-btn"
            onClick={() => {
              signOut();
              navigate('/');
            }}
            style={{ 
              marginTop: '2rem', 
              width: '100%', 
              justifyContent: 'center', 
              background: '#FEE2E2', 
              border: '2px solid #FCA5A5', 
              color: '#DC2626',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '0.8rem'
            }}
          >
            🔒 Sign Out of Annadata
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
