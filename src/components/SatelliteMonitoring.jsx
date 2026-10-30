import React, { useState, useEffect, useRef } from 'react';
import './SatelliteMonitoring.css';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { getCityCoords } from '../data/cityCoords';
import { getBhoomiRecord } from '../data/bhoomiData';

const SatelliteMonitoring = () => {
  const { t } = useLanguage();
  const { selectedState, selectedCity } = useUser();

  // Component States
  const [simpleMode, setSimpleMode] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState('north');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedRange, setSelectedRange] = useState('30d');
  const [activeWeek, setActiveWeek] = useState('current');
  const [selectedZone, setSelectedZone] = useState({
    name: 'North Section',
    status: 'healthy',
    score: 94,
    moisture: '48%',
    alert: 'None'
  });
  
  const [irrigationStatus, setIrrigationStatus] = useState('idle');
  const [fertilizerStatus, setFertilizerStatus] = useState('idle');
  const [recAdviceOpen, setRecAdviceOpen] = useState(false);
  const [bhoomiRecord, setBhoomiRecord] = useState(null);
  const [rtcNumberInput, setRtcNumberInput] = useState('102/1');
  const handleZoneClickRef = useRef(null);

  // Handle manual input of Bhoomi RTC/Survey number
  const handleRtcChange = (val) => {
    setRtcNumberInput(val);
    
    // Normalize and match with pre-defined map sections
    let matchedId = null;
    let matchedZone = null;
    
    if (val.includes('/1') || val === '1' || val.toLowerCase().includes('north')) {
      matchedId = 'north';
      matchedZone = { name: 'North Section', status: 'healthy', score: 94, moisture: '48%', alert: 'None' };
    } else if (val.includes('/2') || val === '2' || val.toLowerCase().includes('east')) {
      matchedId = 'east';
      matchedZone = { name: 'East Section', status: 'moderate', score: 75, moisture: '31%', alert: 'Irrigate North-East Edge' };
    } else if (val.includes('/3') || val === '3' || val.toLowerCase().includes('south')) {
      matchedId = 'south';
      matchedZone = { name: 'South Risk Zone', status: 'risk', score: 42, moisture: '18%', alert: 'High Fungal Disease Risk' };
    } else if (val.includes('/4') || val === '4' || val.toLowerCase().includes('west')) {
      matchedId = 'home-plot';
      matchedZone = { name: 'West Section', status: 'healthy', score: 89, moisture: '52%', alert: 'None' };
    }
    
    if (matchedId && matchedZone) {
      setSelectedFarm(matchedId);
      setSelectedZone(matchedZone);
    } else {
      // If user inputs a custom survey number, generate a fresh dynamic layout for it
      setSelectedFarm('custom_' + val.replace(/\s+/g, '_'));
    }
  };

  // Sync land registry data from Bhoomi database instantly
  useEffect(() => {
    if (selectedState && selectedCity) {
      const record = getBhoomiRecord(selectedState, selectedCity, selectedFarm, rtcNumberInput);
      setBhoomiRecord(record);
    }
  }, [selectedState, selectedCity, selectedFarm, rtcNumberInput]);

  // Dynamic geocoding/coordinate mapping
  const [mapCoords, setMapCoords] = useState({ lat: 17.3297, lng: 76.8343 }); // default Kalaburagi
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const mapRef = useRef(null);
  const polygonsRef = useRef([]);

  // Fetch coordinates of selected city dynamically using Open-Meteo geocoder (fast static lookup path first)
  useEffect(() => {
    const fetchCityCoords = async () => {
      if (!selectedCity) return;
      setGeocodingLoading(true);
      try {
        const coords = getCityCoords(selectedState, selectedCity);
        if (coords) {
          setMapCoords({ lat: coords.lat, lng: coords.lon });
          setGeocodingLoading(false);
          return;
        }

        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(selectedCity)}&count=1&language=en&format=json`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const { latitude, longitude } = data.results[0];
          setMapCoords({ lat: latitude, lng: longitude });
        }
      } catch (e) {
        console.error("Geocoding failed in SatelliteMonitoring:", e);
      } finally {
        setGeocodingLoading(false);
      }
    };
    fetchCityCoords();
  }, [selectedState, selectedCity]);

  // Load Google Maps API script and draw interactive polygons
  useEffect(() => {
    let active = true;

    const initGoogleMap = () => {
      if (!active) return;
      const mapContainer = document.getElementById('google-map');
      if (!mapContainer || !window.google || !window.google.maps) return;

      const mapOptions = {
        center: mapCoords,
        zoom: 16,
        mapTypeId: 'hybrid', // Satellite view with label overlays
        disableDefaultUI: true,
        zoomControl: true,
        tilt: 45
      };

      const map = new window.google.maps.Map(mapContainer, mapOptions);
      mapRef.current = map;

      // Clear existing polygons
      polygonsRef.current.forEach(p => p.setMap(null));
      polygonsRef.current = [];

      const lat = mapCoords.lat;
      const lng = mapCoords.lng;

      // Color-coded polygons for farm fields
      const zonesData = [
        {
          id: 'north',
          surveyNo: '102/1',
          name: 'North Section',
          status: 'healthy',
          score: 94,
          moisture: '48%',
          alert: 'None',
          color: '#10B981',
          coords: [
            { lat: lat + 0.0010, lng: lng - 0.0020 },
            { lat: lat + 0.0025, lng: lng - 0.0022 },
            { lat: lat + 0.0020, lng: lng - 0.0005 },
            { lat: lat + 0.0008, lng: lng - 0.0007 }
          ]
        },
        {
          id: 'east',
          surveyNo: '102/2',
          name: 'East Section',
          status: 'moderate',
          score: 75,
          moisture: '31%',
          alert: 'Irrigate North-East Edge',
          color: '#F59E0B',
          coords: [
            { lat: lat + 0.0020, lng: lng - 0.0005 },
            { lat: lat + 0.0028, lng: lng + 0.0015 },
            { lat: lat + 0.0012, lng: lng + 0.0018 },
            { lat: lat + 0.0008, lng: lng - 0.0007 }
          ]
        },
        {
          id: 'south',
          surveyNo: '102/3',
          name: 'South Risk Zone',
          status: 'risk',
          score: 42,
          moisture: '18%',
          alert: 'High Fungal Disease Risk',
          color: '#EF4444',
          coords: [
            { lat: lat - 0.0008, lng: lng - 0.0020 },
            { lat: lat + 0.0008, lng: lng - 0.0020 },
            { lat: lat + 0.0008, lng: lng - 0.0007 },
            { lat: lat - 0.0008, lng: lng - 0.0007 }
          ]
        },
        {
          id: 'home-plot',
          surveyNo: '102/4',
          name: 'West Section',
          status: 'healthy',
          score: 89,
          moisture: '52%',
          alert: 'None',
          color: '#10B981',
          coords: [
            { lat: lat - 0.0008, lng: lng - 0.0007 },
            { lat: lat + 0.0008, lng: lng - 0.0007 },
            { lat: lat + 0.0012, lng: lng + 0.0018 },
            { lat: lat - 0.0008, lng: lng + 0.0018 }
          ]
        }
      ];

      zonesData.forEach(zone => {
        const polygon = new window.google.maps.Polygon({
          paths: zone.coords,
          strokeColor: zone.color,
          strokeOpacity: 0.85,
          strokeWeight: 3,
          fillColor: zone.color,
          fillOpacity: 0.35,
          map: map
        });

        // Click event linking google map polygon click to UI details selection
        polygon.addListener('click', () => {
          if (handleZoneClickRef.current) {
            handleZoneClickRef.current(
              zone.id,
              zone.surveyNo,
              zone.name,
              zone.status,
              zone.score,
              zone.moisture,
              zone.alert
            );
          }
        });

        // Hover style changes
        polygon.addListener('mouseover', () => {
          polygon.setOptions({ fillOpacity: 0.6, strokeWeight: 4 });
        });
        polygon.addListener('mouseout', () => {
          polygon.setOptions({ fillOpacity: 0.35, strokeWeight: 3 });
        });

        polygonsRef.current.push(polygon);
      });
    };

    if (window.google && window.google.maps) {
      initGoogleMap();
    } else {
      const scriptId = 'google-maps-api-script';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?v=weekly`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', initGoogleMap);
    }

    return () => {
      active = false;
    };
  }, [mapCoords]);

  // Growth timeline mock data based on active week
  const timelineData = {
    week1: { growth: '+3%', health: 78, status: 'Moderate', desc: 'Germination phase' },
    week2: { growth: '+7%', health: 82, status: 'Healthy', desc: 'Vegetative growth' },
    week3: { growth: '+12%', health: 85, status: 'Healthy', desc: 'Flowering starter' },
    current: { growth: '+18%', health: 91, status: 'Excellent', desc: 'Optimum maturity' }
  };

  const handleZoneClick = (id, surveyNo, name, status, score, moisture, alert) => {
    setSelectedZone({ name, status, score, moisture, alert });
    setSelectedFarm(id);
    setRtcNumberInput(surveyNo);
  };

  // Set ref to prevent stale closures in Google Maps listener
  handleZoneClickRef.current = handleZoneClick;

  const handleWaterAction = () => {
    setIrrigationStatus('watering');
    setTimeout(() => {
      setIrrigationStatus('success');
      setSelectedZone(prev => {
        if (prev.name === 'East Section') {
          return { ...prev, score: 88, moisture: '55%', status: 'healthy', alert: 'Watered' };
        }
        return { ...prev, moisture: '60%' };
      });
    }, 2000);
  };

  const handleFertilizerAction = () => {
    setFertilizerStatus('applying');
    setTimeout(() => {
      setFertilizerStatus('success');
      setSelectedZone(prev => {
        if (prev.name === 'South Risk Zone') {
          return { ...prev, score: 62, alert: 'Nutrients Applied' };
        }
        return { ...prev, score: Math.min(prev.score + 5, 100) };
      });
    }, 2000);
  };

  const activeTimeline = timelineData[activeWeek];

  return (
    <div className="satellite-page-container">
      {/* Page Header */}
      <header className="satellite-header">
        <div className="title-section">
          <h2>Crop Monitoring</h2>
          <p className="headline">Monitor Your Farm from Space 🌾🛰️</p>
        </div>
        
        {/* Simple Mode Toggle */}
        <div className="toggle-container">
          <label className="switch-label" htmlFor="mode-toggle">
            <span className="toggle-text">Simple Mode / आसान दृश्य</span>
            <div className="switch-wrapper">
              <input 
                id="mode-toggle"
                type="checkbox" 
                checked={simpleMode} 
                onChange={(e) => setSimpleMode(e.target.checked)} 
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>
      </header>

      {/* Selectors Section (Hidden in Simple Mode) */}
      {!simpleMode && (
        <section className="selectors-card glass-panel">
          <div className="selector-group">
            <label htmlFor="rtc-input">🏛️ Enter {bhoomiRecord ? bhoomiRecord.recordType.split(' ')[0] : 'RTC'} / Survey No.</label>
            <input 
              id="rtc-input"
              type="text"
              value={rtcNumberInput}
              onChange={(e) => handleRtcChange(e.target.value)}
              placeholder="e.g. 102/1"
              className="rtc-text-input"
            />
          </div>
          <div className="selector-group">
            <label htmlFor="crop-select">🌱 Crop Category</label>
            <select id="crop-select" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
              <option value="wheat">Wheat / गेहूं</option>
              <option value="paddy">Paddy / धान</option>
              <option value="tomatoes">Tomatoes / टमाटर</option>
              <option value="cotton">Cotton / कपास</option>
            </select>
          </div>
          <div className="selector-group">
            <label htmlFor="range-select">📅 Date Range</label>
            <select id="range-select" value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </section>
      )}

      {/* Main Content Layout */}
      <div className="satellite-main-grid">
        
        {/* Left Column: Interactive Map & Legend */}
        <div className="map-column glass-panel">
          <div className="card-title-bar">
            <h3>🛰️ Satellite Health Map</h3>
            <span className="live-satellite-badge">🟢 Live Connection (Sentinel-2)</span>
          </div>
          
          <div className="map-view-container" style={{ position: 'relative', width: '100%', height: '320px', borderRadius: '20px', overflow: 'hidden', border: '3px solid #334155' }}>
            <div id="google-map" style={{ width: '100%', height: '100%' }}></div>
            {/* Satellite scan line sweep laser effect overlay */}
            <div className="satellite-scan-line-overlay"></div>
            {geocodingLoading && (
              <div className="map-loading-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FFF', fontWeight: 'bold', zIndex: 10 }}>
                Updating Coordinates...
              </div>
            )}
          </div>

          {/* Color-Coded Overlay Legend */}
          <div className="map-legend">
            <span className="legend-item"><span className="legend-dot green"></span> Healthy Area (🟢)</span>
            <span className="legend-item"><span className="legend-dot yellow"></span> Moderate Growth (🟡)</span>
            <span className="legend-item"><span className="legend-dot red"></span> Risk Area (🔴)</span>
          </div>

          {/* tapped Zone Detail panel */}
          <div className="zone-scorecard">
            <h4>Plot Detail: {selectedZone.name}</h4>
            <div className="scorecard-grid">
              <div className="metric">
                <span className="label">Status</span>
                <span className={`value status-badge ${selectedZone.status}`}>{selectedZone.status.toUpperCase()}</span>
              </div>
              <div className="metric">
                <span className="label">Crop Health Score</span>
                <span className="value score-val">{selectedZone.score}/100</span>
              </div>
              <div className="metric">
                <span className="label">Soil Moisture</span>
                <span className="value">{selectedZone.moisture}</span>
              </div>
              <div className="metric">
                <span className="label">Active Alert</span>
                <span className={`value ${selectedZone.alert !== 'None' ? 'alert-text-bold' : ''}`}>{selectedZone.alert}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics, Weather, AI Insights */}
        <div className="details-column">
          
          {/* Simple Mode View */}
          {simpleMode ? (
            <div className="simple-summary-card glass-panel">
              <h3 style={{ color: 'var(--emerald-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                🌱 Field Health Summary
              </h3>
              
              {bhoomiRecord && (
                <div className="simple-metric-row" style={{ background: '#F0F9FF', border: '2.5px solid #BAE6FD', padding: '0.8rem', borderRadius: '14px', marginBottom: '0.8rem' }}>
                  <div className="simple-icon-box green" style={{ background: '#E0F2FE', borderColor: '#BAE6FD' }}>🏛️</div>
                  <div className="simple-text-box">
                    <h4 style={{ color: '#0369A1', margin: 0 }}>{bhoomiRecord.recordType} (Bhoomi Sync)</h4>
                    <p style={{ fontWeight: 800, color: '#1E293B', margin: '2px 0' }}>{bhoomiRecord.ownerName} (Sur. {bhoomiRecord.surveyNo})</p>
                    <p style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 800, margin: 0 }}>🏛️ {bhoomiRecord.portalName}: {bhoomiRecord.verifiedStatus}</p>
                  </div>
                </div>
              )}

              <div className="simple-metric-row">
                <div className="simple-icon-box green">🌱</div>
                <div className="simple-text-box">
                  <h4>Overall Health: <span style={{ color: '#15803D' }}>Good (84/100)</span></h4>
                  <p>East Field has recovered slightly after irrigation.</p>
                </div>
              </div>

              <div className="simple-metric-row">
                <div className="simple-icon-box yellow">💧</div>
                <div className="simple-text-box">
                  <h4>Water Need: <span style={{ color: '#C2410C' }}>Moderate</span></h4>
                  <p>Zone B (East Section) needs watering soon.</p>
                </div>
              </div>

              <div className="simple-metric-row">
                <div className="simple-icon-box red">⚠️</div>
                <div className="simple-text-box">
                  <h4>Alerts: <span style={{ color: '#B91C1C' }}>1 Active Warning</span></h4>
                  <p>Fungal Rust risk detected in Zone C (South Risk Zone).</p>
                </div>
              </div>

              {/* Action buttons embedded in simple mode for speed */}
              <div className="smart-actions" style={{ marginTop: '1.5rem' }}>
                <button className="action-btn water" onClick={handleWaterAction} disabled={irrigationStatus !== 'idle'}>
                  {irrigationStatus === 'watering' ? '💧 Watering...' : irrigationStatus === 'success' ? '✅ Field Watered' : '💧 Water Zone B'}
                </button>
                <button className="action-btn advise" onClick={() => setRecAdviceOpen(o => !o)}>
                  🔍 View Remedy
                </button>
              </div>
              
              {recAdviceOpen && (
                <div className="remedy-popover" style={{ marginTop: '1rem', background: '#F8FAFC', border: '2px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Suggested Treatment:</strong>
                  <p style={{ fontSize: '0.95rem', margin: '0.4rem 0' }}>Spray Propiconazole 25% EC (1 ml per Litre of water) specifically in the South plot to suppress leaf rust.</p>
                </div>
              )}
            </div>
          ) : (
            // Full Detailed View
            <>
              {/* Bhoomi Land Registry Sync Card */}
              {bhoomiRecord && (
                <div className="glass-panel details-card bhoomi-card">
                  <div className="bhoomi-header-stripe">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🏛️</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>{bhoomiRecord.portalName}</h3>
                        <span className="bhoomi-gov-badge">Govt of {selectedState}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                      <span className="bhoomi-portal-badge">{bhoomiRecord.logoText} LIVE</span>
                      {bhoomiRecord.portalUrl && (
                        <a 
                          href={bhoomiRecord.portalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{
                            background: '#15803D',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          🌐 Open Official Portal ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="bhoomi-grid">
                    <div className="bhoomi-field">
                      <span className="label">Registered Owner</span>
                      <span className="value">{bhoomiRecord.ownerName}</span>
                    </div>
                    <div className="bhoomi-field">
                      <span className="label">Survey / Hissa No</span>
                      <span className="value">{bhoomiRecord.surveyNo}</span>
                    </div>
                    <div className="bhoomi-field">
                      <span className="label">Total Area</span>
                      <span className="value">{bhoomiRecord.areaAcres} Acres</span>
                    </div>
                    <div className="bhoomi-field">
                      <span className="label">Land Class</span>
                      <span className="value">{bhoomiRecord.cropClass}</span>
                    </div>
                    <div className="bhoomi-field">
                      <span className="label">Soil Type</span>
                      <span className="value">{bhoomiRecord.soilType}</span>
                    </div>
                    <div className="bhoomi-field">
                      <span className="label">Irrigation Source</span>
                      <span className="value">{bhoomiRecord.irrigationSource}</span>
                    </div>
                  </div>

                  <div className="bhoomi-status-bar">
                    <span style={{ fontSize: '1.2rem' }}>✅</span>
                    <span>BHOOMI SYNC: Satellite boundary coordinates match state land registry records. (Synced {bhoomiRecord.syncTimestamp})</span>
                  </div>
                  <div className="bhoomi-watermark">Official digital record • Secured via Government Blockchain Registry</div>
                </div>
              )}

              {/* Growth Tracking Timeline */}
              <div className="glass-panel details-card">
                <h3>📈 Growth Tracking Timeline</h3>
                
                <div className="timeline-weeks-selector">
                  {Object.keys(timelineData).map(wk => (
                    <button 
                      key={wk}
                      className={`week-btn ${activeWeek === wk ? 'active' : ''}`}
                      onClick={() => setActiveWeek(wk)}
                    >
                      {wk === 'current' ? 'Current' : `Week ${wk.replace('week', '')}`}
                    </button>
                  ))}
                </div>

                <div className="timeline-stats-grid">
                  <div className="timeline-stat">
                    <span className="lbl">Cumulative Growth</span>
                    <span className="val" style={{ color: 'var(--emerald-primary)' }}>{activeTimeline.growth}</span>
                  </div>
                  <div className="timeline-stat">
                    <span className="lbl">Estimated Health</span>
                    <span className="val">{activeTimeline.health}/100</span>
                  </div>
                  <div className="timeline-stat">
                    <span className="lbl">Condition</span>
                    <span className="val">{activeTimeline.desc}</span>
                  </div>
                </div>

                {/* Stylized Sparkline Chart */}
                <div className="timeline-chart-box">
                  <svg viewBox="0 0 300 60" className="sparkline">
                    <path 
                      d="M 10 50 L 90 42 L 185 30 L 290 10" 
                      fill="none" 
                      stroke="var(--emerald-primary)" 
                      strokeWidth="3" 
                    />
                    <circle cx="10" cy="50" r="4" fill="var(--emerald-primary)" />
                    <circle cx="90" cy="42" r="4" fill="var(--emerald-primary)" />
                    <circle cx="185" cy="30" r="4" fill="var(--emerald-primary)" />
                    <circle cx="290" cy="10" r="6" fill="var(--emerald-dark)" />
                  </svg>
                  <div className="chart-labels">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Current</span>
                  </div>
                </div>
              </div>

              {/* AI Insights Panel */}
              <div className="glass-panel details-card insights-card">
                <h3>🤖 Satellite AI Insights</h3>
                <ul className="insights-list">
                  <li>
                    <span className="insight-icon">💡</span>
                    <span>North section growth is **above average** (+18% cumulative leaf cover).</span>
                  </li>
                  <li>
                    <span className="insight-icon">⚠️</span>
                    <span className="warning">Disease probability **High** in South Risk Zone due to excessive root moisture last week.</span>
                  </li>
                  <li>
                    <span className="insight-icon">💧</span>
                    <span>Irrigation suggested for East Section within 24 hours to maintain stem density.</span>
                  </li>
                </ul>
              </div>

              {/* Smart Recommendations */}
              <div className="glass-panel details-card">
                <h3>⚡ Action Recommendations</h3>
                <div className="smart-actions">
                  <button className="action-btn water" onClick={handleWaterAction} disabled={irrigationStatus !== 'idle'}>
                    {irrigationStatus === 'watering' ? '💧 Watering...' : irrigationStatus === 'success' ? '✅ System Active' : '💧 Water Now'}
                  </button>
                  <button className="action-btn fertilize" onClick={handleFertilizerAction} disabled={fertilizerStatus !== 'idle'}>
                    {fertilizerStatus === 'applying' ? '🚜 Applying...' : fertilizerStatus === 'success' ? '✅ Nutrients Spread' : '🚜 Apply Fertilizer'}
                  </button>
                  <button className="action-btn advise" onClick={() => setRecAdviceOpen(o => !o)}>
                    📖 View Advice
                  </button>
                </div>

                {recAdviceOpen && (
                  <div className="remedy-popover" style={{ marginTop: '1rem', background: '#F8FAFC', border: '2px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
                    <strong>Recommended Actions:</strong>
                    <p style={{ fontSize: '0.95rem', margin: '0.4rem 0' }}>1. Initiate watering for East Section (Zone B) for 45 minutes.</p>
                    <p style={{ fontSize: '0.95rem', margin: '0.4rem 0' }}>2. Apply Nitrogen-rich organic manure to South plot to counter yellowing signs.</p>
                  </div>
                )}
              </div>

              {/* Weather & Alerts Integration */}
              <div className="glass-panel details-card weather-alerts-card">
                <div className="weather-mini-bar">
                  <div>
                    <h4>Weather (Local Forecast)</h4>
                    <span className="temp">32°C • Sunny</span>
                  </div>
                  <div className="forecast">
                    <strong>Rain Forecast:</strong> 20% probability tomorrow.
                    <br />
                    <strong>Irrigation:</strong> Apply water today.
                  </div>
                </div>

                <hr style={{ border: 0, height: '1px', background: '#E2E8F0', margin: '0.8rem 0' }} />

                <div className="alert-system">
                  <h4>⚠️ Critical Alerts</h4>
                  <div className="alert-item error">
                    <strong>Disease Alert:</strong> Fungal blight spreading in neighboring districts within 15km.
                  </div>
                  <div className="alert-item warning">
                    <strong>Weather Alert:</strong> High temperatures expected on Saturday (up to 39°C).
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SatelliteMonitoring;
