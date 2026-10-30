import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionCard from './SectionCard';
import AlertBanner from './AlertBanner';
import MarketModal from './MarketModal';
import SchemesModal from './SchemesModal';
import AdvisoryModal from './AdvisoryModal';
import EquipmentRentalModal from './EquipmentRentalModal';
import MeghdootModal from './MeghdootModal';
import './Dashboard.css';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { getCityData } from '../data/cityData';
import { indianStatesCities } from '../data/indianStatesCities';
import { translateDBText } from '../utils/translator';
import { getWeatherData } from '../utils/weatherService';

const Dashboard = ({ onExploreSatellite }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, selectedState, setSelectedState, selectedCity, setSelectedCity } = useUser();
  const [realLocation, setRealLocation] = useState(null);
  const [realWeather, setRealWeather] = useState({ temp: null, humidity: null, loading: false, isRaining: false });
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState(false);
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isMeghdootModalOpen, setIsMeghdootModalOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setRealLocation("📍 Locating...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            
            const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
            const state = data.address.state || "";
            
            if (city && state) {
              setRealLocation(`📍 ${city}, ${state}`);
            } else if (state) {
              setRealLocation(`📍 ${state}`);
            } else {
              setRealLocation(`📍 ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            }
          } catch (error) {
            console.error("Geocoding failed:", error);
            setRealLocation(t('dashboard.location'));
          }
        },
        (error) => {
          console.warn("Geolocation denied:", error.message);
          setRealLocation("📍 Location Access Denied");
        }
      );
    } else {
      setRealLocation(t('dashboard.location'));
    }
  }, []);

  const currentData = getCityData(selectedState, selectedCity);

  useEffect(() => {
    const fetchWeather = async () => {
      setRealWeather({ temp: null, humidity: null, loading: true, isRaining: false });
      try {
        const weatherData = await getWeatherData(selectedState, selectedCity);
        const code = weatherData.current.weather_code;
        const raining = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99);
        setRealWeather({
          temp: `${Math.round(weatherData.current.temperature_2m)}°C`,
          humidity: `${weatherData.current.relative_humidity_2m}%`,
          loading: false,
          isRaining: raining
        });
      } catch (error) {
        console.error("Weather fetch failed:", error);
        const humVal = parseInt(currentData.weather.humidity) || 50;
        setRealWeather({
          temp: currentData.weather.temp,
          humidity: currentData.weather.humidity,
          loading: false,
          isRaining: humVal > 70
        });
      }
    };
    fetchWeather();
  }, [selectedState, selectedCity]);

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

  const renderWeatherWidget = () => (
    <>
      <div className="widget-row">
        <div>
          <div className="widget-highlight">{realWeather.loading ? "..." : (realWeather.temp || currentData.weather.temp)}</div>
          <div className="widget-subtext">{t('dataLabels.humidity')}: {realWeather.loading ? "..." : (realWeather.humidity || currentData.weather.humidity)}</div>
        </div>
      </div>
      <div className="widget-subtext" style={{marginTop: '0.5rem', color: '#B45309', fontWeight: 700}}>
        {t('dataLabels.recommended')}: {t(`crops.${currentData.weather.bestCropKey}`)}
      </div>
    </>
  );

  const renderMarketWidget = () => (
    <div className="widget-row">
      <div>
        <div className="widget-subtext">{t(`crops.${currentData.market.cropKey}`)}</div>
        <div className="widget-highlight" style={{fontSize: '1.2rem'}}>{currentData.market.price}</div>
      </div>
      <div className="widget-highlight" style={{color: currentData.market.trend === 'up' ? '#10B981' : '#EF4444', fontSize: '1rem'}}>
        {currentData.market.trend === 'up' ? t('dataLabels.trendUp') : t('dataLabels.trendDown')} {currentData.market.trendValue}
      </div>
    </div>
  );

  const renderSchemesWidget = () => (
    <div className="widget-scheme">
      <span>✨</span> {currentData.schemes} {t('dataLabels.schemesMatch')}
    </div>
  );

  const renderDiseaseWidget = () => {
    const color = currentData.advisory.riskLevel === 'high' ? '#EF4444' : (currentData.advisory.riskLevel === 'medium' ? '#F59E0B' : '#10B981');
    const riskLabel = currentData.advisory.riskLevel === 'high' ? t('dataLabels.highRisk') : (currentData.advisory.riskLevel === 'medium' ? t('dataLabels.mediumRisk') : t('dataLabels.lowRisk'));
    return (
      <div className="widget-subtext" style={{color: color, fontWeight: 700}}>
        {riskLabel}: {t(`diseases.${currentData.advisory.diseaseKey}`)}
      </div>
    );
  };

  const sections = [
    {
      id: 1,
      type: 'advisory',
      title: t('sections.cropAdvisory.title'),
      description: t('sections.cropAdvisory.desc'),
      icon: '🌱',
      color: '#10B981',
      widgetData: renderDiseaseWidget(),
      onExplore: () => setIsAdvisoryModalOpen(true)
    },
    {
      id: 2,
      type: 'weather',
      title: t('sections.weather.title'),
      description: t('sections.weather.desc'),
      icon: '⛅',
      color: '#3B82F6',
      widgetData: renderWeatherWidget(),
      onExplore: () => navigate('/weather')
    },
    {
      id: 3,
      type: 'market',
      title: t('sections.market.title'),
      description: t('sections.market.desc'),
      icon: '📈',
      color: '#F59E0B',
      widgetData: renderMarketWidget(),
      onExplore: () => setIsMarketModalOpen(true)
    },
    {
      id: 4,
      type: 'rental',
      title: t('sections.farmResource.title') || 'Farm Equipment Rental',
      description: t('sections.farmResource.desc') || 'Rent tractors, sprayers & tools from nearby farmers. Or list your own equipment.',
      icon: '🚜',
      color: '#8B5CF6',
      widgetData: (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: '#F3E8FF', color: '#7C3AED', border: '1px solid #DDD6FE', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>✅ 10 Available</span>
          <span style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>💰 From ₹350/day</span>
        </div>
      ),
      onExplore: () => setIsEquipmentModalOpen(true)
    },
    {
      id: 5,
      type: 'marketplace',
      title: 'Annadata Local Mandi',
      description: 'Zero middleman local agricultural trading with strict same-city matching between farmers and buyers.',
      icon: '🤝',
      color: '#EC4899',
      widgetData: (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: '#FCE7F3', color: '#DB2777', border: '1px solid #FBCFE8', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>📍 {selectedCity} Mandi</span>
          <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>0% Commission</span>
        </div>
      ),
      onExplore: () => navigate('/market')
    },
    {
      id: 6,
      type: 'schemes',
      title: t('sections.govSchemes.title'),
      description: t('sections.govSchemes.desc'),
      icon: '🏛️',
      color: '#14B8A6',
      widgetData: renderSchemesWidget(),
      onExplore: () => setIsSchemesModalOpen(true)
    },
    {
      id: 7,
      type: 'satellite',
      title: t('sections.satellite.title') || 'Satellite Monitoring & Bhoomi RTC',
      description: t('sections.satellite.desc') || 'Monitor farm crop health from space with AI overlays and verified state land registry.',
      icon: '🛰️',
      color: '#22C55E',
      widgetData: (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>🟢 Connected</span>
          <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>🛰️ Sentinel-2</span>
        </div>
      ),
      onExplore: onExploreSatellite
    },
    {
      id: 8,
      type: 'calendar',
      title: 'Location-Based Crop Calendar',
      description: 'Scientific Kharif, Rabi, and Zaid sowing and harvesting schedules tailored to your district agro-climatic zone.',
      icon: '📅',
      color: '#059669',
      widgetData: (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>ICAR Zones</span>
          <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>Sowing Dates</span>
        </div>
      ),
      onExplore: () => navigate('/calendar')
    }
  ];

  return (
    <div className="dashboard-container">
      <AlertBanner />
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>{user ? `${t('dashboard.welcome')}, ${user.name}` : t('dashboard.guest')}</h2>
          <p>{t('dashboard.subtitle')}</p>
        </div>
        <div className="location-controls glass-panel">
          <div className="location-selectors">
            <select value={selectedState} onChange={handleStateChange}>
              {Object.keys(indianStatesCities).map(state => (
                <option key={state} value={state}>{translateDBText(state, language)}</option>
              ))}
            </select>
            <select value={selectedCity} onChange={handleCityChange}>
              {indianStatesCities[selectedState]?.map(city => (
                <option key={city} value={city}>{translateDBText(city, language)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        {sections.map(section => (
          <SectionCard 
            key={section.id}
            cardType={section.type}
            isRaining={realWeather.isRaining}
            marketTrend={currentData.market.trend}
            title={section.title}
            description={section.description}
            icon={section.icon}
            primaryColor={section.color}
            exploreText={t('card.explore')}
            widgetData={section.widgetData}
            onExplore={section.onExplore}
          />
        ))}
      </div>
      
      <MarketModal 
        isOpen={isMarketModalOpen} 
        onClose={() => setIsMarketModalOpen(false)} 
        state={selectedState} 
        city={selectedCity} 
      />

      <SchemesModal 
        isOpen={isSchemesModalOpen} 
        onClose={() => setIsSchemesModalOpen(false)} 
        state={selectedState} 
      />

      <EquipmentRentalModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
      />

      <AdvisoryModal 
        isOpen={isAdvisoryModalOpen} 
        onClose={() => setIsAdvisoryModalOpen(false)} 
        state={selectedState} 
        city={selectedCity} 
      />

      <MeghdootModal 
        isOpen={isMeghdootModalOpen} 
        onClose={() => setIsMeghdootModalOpen(false)} 
        state={selectedState} 
        city={selectedCity} 
      />
    </div>
  );
};

export default Dashboard;
