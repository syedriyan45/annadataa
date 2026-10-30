import React from 'react';
import AIDiseaseDoctor from './AIDiseaseDoctor';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';

const ScanCrop = () => {
  const { t } = useLanguage();
  const { selectedState, selectedCity } = useUser();

  return (
    <div className="scan-crop-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--emerald-dark)' }}>
          📷 {t('modals.advisory.tabDoctor') || 'Crop Disease Scan'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          Take a photo of your crop leaf to scan for pests and receive recommendations.
        </p>
      </div>
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#FFFFFF', border: '3px solid var(--emerald-primary)', borderRadius: '24px' }}>
        <AIDiseaseDoctor currentCrop="General" state={selectedState} city={selectedCity} />
      </div>
    </div>
  );
};

export default ScanCrop;
