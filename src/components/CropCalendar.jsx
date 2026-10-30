import React, { useState, useEffect } from 'react';
import './CropCalendar.css';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { indianStatesCities } from '../data/indianStatesCities';
import { translateDBText } from '../utils/translator';

// Comprehensive verified agricultural crop calendar database for Indian states
const regionalCropDatabase = {
  "Maharashtra": [
    { name: "Soybean", nameHi: "सोयाबीन", season: "Kharif", sowing: "June - July", harvest: "September - October", duration: "90-105 days", soil: "Black cotton soil, well-drained loam", water: "Medium (450-600 mm)", temp: "20°C - 30°C", icon: "🌱", keyActivity: "Pod borer inspection at 45 days, pod development stage weeding" },
    { name: "Cotton", nameHi: "कपास", season: "Kharif", sowing: "May - June", harvest: "November - February", duration: "150-180 days", soil: "Deep black soil (Regur)", water: "Medium-High (700-1200 mm)", temp: "21°C - 30°C", icon: "☁️", keyActivity: "Square formation monitoring, pink bollworm traps setup" },
    { name: "Jowar (Sorghum)", nameHi: "ज्वार", season: "Kharif", sowing: "June - July", harvest: "October - November", duration: "100-115 days", soil: "Clayey loam, medium black", water: "Low-Medium (400-500 mm)", temp: "26°C - 33°C", icon: "🌾", keyActivity: "Earhead emergence stage protection against shoot fly" },
    { name: "Wheat", nameHi: "गेहूँ", season: "Rabi", sowing: "October - November", harvest: "February - March", duration: "110-125 days", soil: "Fertile loam with neutral pH", water: "Irrigated (4-6 waterings)", temp: "15°C - 25°C", icon: "🌾", keyActivity: "Crown root initiation (CRI) irrigation at 21 days" },
    { name: "Gram (Chana)", nameHi: "चना", season: "Rabi", sowing: "October - November", harvest: "January - March", duration: "95-110 days", soil: "Well drained medium black soil", water: "Low (2-3 irrigations)", temp: "15°C - 22°C", icon: "🧆", keyActivity: "Nipping apical buds at 30-35 days to encourage branching" },
    { name: "Onion", nameHi: "प्याज़", season: "Rabi", sowing: "November - December", harvest: "March - April", duration: "120-135 days", soil: "Sandy loam rich in organic matter", water: "Frequent light irrigation", temp: "13°C - 24°C", icon: "🧅", keyActivity: "Bulb enlargement stage fertilization (Potash + Sulphur)" },
    { name: "Groundnut", nameHi: "मूंगफली", season: "Zaid", sowing: "January - February", harvest: "May - June", duration: "100-115 days", soil: "Sandy loam, loose soil for peg penetration", water: "6-8 irrigations during summer", temp: "25°C - 35°C", icon: "🥜", keyActivity: "Gypsum application at 30 days during flowering/pegging" }
  ],
  "Punjab": [
    { name: "Wheat", nameHi: "गेहूँ", season: "Rabi", sowing: "October - November", harvest: "April - May", duration: "135-150 days", soil: "Rich alluvial loam", water: "Canal/tubewell (4-5 irrigations)", temp: "12°C - 24°C", icon: "🌾", keyActivity: "Yellow rust vigilance during January and February" },
    { name: "Rice (Paddy)", nameHi: "धान", season: "Kharif", sowing: "June (transplanting)", harvest: "October - November", duration: "120-140 days", soil: "Clay loam with low water percolation", water: "High standing water initially", temp: "22°C - 32°C", icon: "🌾", keyActivity: "Laser land leveling before puddling, zinc sulphate dosing" },
    { name: "Cotton", nameHi: "कपास", season: "Kharif", sowing: "April - May", harvest: "October - November", duration: "160-180 days", soil: "Alluvial loam", water: "Canal irrigated", temp: "25°C - 35°C", icon: "☁️", keyActivity: "Whitefly monitoring on Bt cotton hybrids" },
    { name: "Mustard", nameHi: "सरसों", season: "Rabi", sowing: "September - October", harvest: "February - March", duration: "115-130 days", soil: "Loam to light sandy loam", water: "2-3 irrigations", temp: "10°C - 22°C", icon: "🌼", keyActivity: "Aphid control at flowering and siliqua formation" },
    { name: "Maize (Summer)", nameHi: "मक्का", season: "Zaid", sowing: "March - April", harvest: "June - July", duration: "85-95 days", soil: "Well drained fertile loam", water: "5-6 irrigations", temp: "25°C - 35°C", icon: "🌽", keyActivity: "Fall armyworm pheromone trapping" }
  ],
  "Uttar Pradesh": [
    { name: "Sugarcane", nameHi: "गन्ना", season: "Kharif", sowing: "February - March / Oct", harvest: "November - April", duration: "300-360 days", soil: "Deep rich loamy soil", water: "High (1500-2000 mm)", temp: "20°C - 35°C", icon: "🎋", keyActivity: "Earthing up before monsoon to prevent lodging" },
    { name: "Wheat", nameHi: "गेहूँ", season: "Rabi", sowing: "November - December", harvest: "March - April", duration: "120-135 days", soil: "Gangetic alluvial loam", water: "Irrigated", temp: "14°C - 24°C", icon: "🌾", keyActivity: "Zero tillage sowing right after paddy harvest" },
    { name: "Rice (Paddy)", nameHi: "धान", season: "Kharif", sowing: "June - July", harvest: "October - November", duration: "120-135 days", soil: "Clay loam", water: "High", temp: "24°C - 33°C", icon: "🌾", keyActivity: "Transplanting 21-day-old nursery seedlings" },
    { name: "Potato", nameHi: "आलू", season: "Rabi", sowing: "October - November", harvest: "January - March", duration: "90-110 days", soil: "Loose sandy loam with high humus", water: "Furrow irrigation (5-7 rounds)", temp: "15°C - 20°C", icon: "🥔", keyActivity: "Earthing up when plants are 15-20 cm high" },
    { name: "Moong (Green Gram)", nameHi: "मूंग", season: "Zaid", sowing: "March - April", harvest: "May - June", duration: "60-70 days", soil: "Well drained loam", water: "3-4 irrigations", temp: "28°C - 38°C", icon: "🌱", keyActivity: "Yellow mosaic virus tolerant variety selection" }
  ],
  "Gujarat": [
    { name: "Cotton", nameHi: "कपास", season: "Kharif", sowing: "June - July", harvest: "November - January", duration: "150-170 days", soil: "Black cotton & alluvial", water: "Medium", temp: "24°C - 34°C", icon: "☁️", keyActivity: "Nipping at 75-80 days to boost sympodial branching" },
    { name: "Groundnut", nameHi: "मूंगफली", season: "Kharif", sowing: "June - July", harvest: "October - November", duration: "105-120 days", soil: "Sandy loam, gravelly loam", water: "Medium", temp: "22°C - 30°C", icon: "🥜", keyActivity: "Tikka disease preventive spray with chlorothalonil" },
    { name: "Cumin (Jeera)", nameHi: "जीरा", season: "Rabi", sowing: "October - November", harvest: "February - March", duration: "100-115 days", soil: "Well drained sandy loam", water: "Light irrigation (avoid at flowering)", temp: "15°C - 22°C", icon: "🌿", keyActivity: "Blight monitoring during cloudy morning weather" },
    { name: "Castor", nameHi: "अरंडी", season: "Kharif", sowing: "July - August", harvest: "December - February", duration: "140-160 days", soil: "Sandy to loamy", water: "Low-Medium", temp: "20°C - 30°C", icon: "🍃", keyActivity: "Secondary spikes pruning for maximum primary yield" },
    { name: "Sesame (Til)", nameHi: "तिल", season: "Zaid", sowing: "February - March", harvest: "May - June", duration: "80-90 days", soil: "Light sandy loam", water: "3-4 irrigations", temp: "25°C - 35°C", icon: "🌱", keyActivity: "Thinning at 15-20 days to keep 15 cm spacing" }
  ],
  "Karnataka": [
    { name: "Ragi (Finger Millet)", nameHi: "रागी", season: "Kharif", sowing: "July - August", harvest: "November - December", duration: "110-125 days", soil: "Red sandy loam, clay loam", water: "Rainfed (Low-Medium)", temp: "20°C - 30°C", icon: "🌾", keyActivity: "Blast disease seed treatment with Trichoderma" },
    { name: "Maize", nameHi: "मक्का", season: "Kharif", sowing: "June - July", harvest: "September - October", duration: "105-120 days", soil: "Red sandy loam", water: "Medium", temp: "21°C - 30°C", icon: "🌽", keyActivity: "Side-dressing with Urea at knee-high and tasseling stages" },
    { name: "Coffee", nameHi: "कॉफी", season: "Kharif", sowing: "Perennial (June pruning)", harvest: "November - February", duration: "Perennial", soil: "Forest volcanic loamy soil, slightly acidic", water: "High monsoon + sprinkler blossom showers", temp: "18°C - 28°C", icon: "☕", keyActivity: "Shade lopping and Bordeaux mixture spray before monsoon" },
    { name: "Bengal Gram", nameHi: "चना", season: "Rabi", sowing: "October - November", harvest: "January - February", duration: "90-105 days", soil: "Black soil of North Karnataka", water: "Residual moisture", temp: "18°C - 25°C", icon: "🧆", keyActivity: "Helicoverpa pheromone traps installation" },
    { name: "Watermelon", nameHi: "तरबूज", season: "Zaid", sowing: "January - February", harvest: "April - May", duration: "80-90 days", soil: "Sandy river beds or well drained sandy loam", water: "Drip irrigation with fertigation", temp: "24°C - 35°C", icon: "🍉", keyActivity: "Fruit fly traps & straw mulching under fruits" }
  ],
  "Tamil Nadu": [
    { name: "Paddy (Samba/Thaladi)", nameHi: "धान", season: "Rabi", sowing: "August - October", harvest: "January - February", duration: "130-145 days", soil: "Cauvery delta clay loam", water: "Canal irrigated", temp: "20°C - 30°C", icon: "🌾", keyActivity: "SRI method transplanting with single seedling per hill" },
    { name: "Sugarcane", nameHi: "गन्ना", season: "Kharif", sowing: "December - February", harvest: "December - March", duration: "360 days", soil: "Deep alluvial loam", water: "Irrigated", temp: "22°C - 35°C", icon: "🎋", keyActivity: "Trash mulching to conserve soil moisture in summer" },
    { name: "Banana", nameHi: "केला", season: "Kharif", sowing: "February - April / Aug", harvest: "After 11-12 months", duration: "330-365 days", soil: "Rich clay loam with good drainage", water: "High drip frequency", temp: "22°C - 32°C", icon: "🍌", keyActivity: "De-suckering leaving only one follower sucker" },
    { name: "Black Gram (Urad)", nameHi: "उड़द", season: "Zaid", sowing: "January - February (Rice fallow)", harvest: "April - May", duration: "65-75 days", soil: "Clay loam with residual moisture", water: "Minimal", temp: "25°C - 35°C", icon: "🌱", keyActivity: "Broadcast seed in standing rice 5 days before harvest" }
  ],
  "Rajasthan": [
    { name: "Bajra (Pearl Millet)", nameHi: "बाजरा", season: "Kharif", sowing: "June - July", harvest: "September - October", duration: "80-90 days", soil: "Sandy to loamy sand", water: "Low (Drought tolerant)", temp: "28°C - 38°C", icon: "🌾", keyActivity: "Downy mildew resistant hybrid selection" },
    { name: "Mustard", nameHi: "सरसों", season: "Rabi", sowing: "September - October", harvest: "February - March", duration: "120-135 days", soil: "Loam to clay loam", water: "2-3 irrigations", temp: "10°C - 22°C", icon: "🌼", keyActivity: "First irrigation at 30 days after sowing" },
    { name: "Wheat", nameHi: "गेहूँ", season: "Rabi", sowing: "November", harvest: "March - April", duration: "125-140 days", soil: "Alluvial sandy loam", water: "Tubewell/canal", temp: "12°C - 25°C", icon: "🌾", keyActivity: "Termite control seed dressing with chlorpyrifos" },
    { name: "Cumin (Jeera)", nameHi: "जीरा", season: "Rabi", sowing: "October - November", harvest: "February - March", duration: "105-115 days", soil: "Sandy loam with light texture", water: "Light sprinkle", temp: "15°C - 22°C", icon: "🌿", keyActivity: "Powdery mildew prevention using wettable sulphur" }
  ]
};

// Default fallback crops for other states
const genericNationalCrops = [
  { name: "Rice (Paddy)", nameHi: "धान", season: "Kharif", sowing: "June - July", harvest: "October - November", duration: "120-135 days", soil: "Clay loam", water: "High", temp: "22°C - 32°C", icon: "🌾", keyActivity: "Timely weeding and nitrogen top dressing" },
  { name: "Wheat", nameHi: "गेहूँ", season: "Rabi", sowing: "October - November", harvest: "March - April", duration: "120-140 days", soil: "Fertile loam", water: "Irrigated", temp: "15°C - 24°C", icon: "🌾", keyActivity: "CRI stage first watering at 21 days" },
  { name: "Mustard", nameHi: "सरसों", season: "Rabi", sowing: "October - November", harvest: "February - March", duration: "110-125 days", soil: "Sandy loam", water: "Low-Medium", temp: "12°C - 22°C", icon: "🌼", keyActivity: "Thinning out excess plants for spacing" },
  { name: "Moong (Green Gram)", nameHi: "मूंग", season: "Zaid", sowing: "March - April", harvest: "May - June", duration: "60-70 days", soil: "Well-drained loam", water: "3-4 irrigations", temp: "26°C - 36°C", icon: "🌱", keyActivity: "Pod-filling stage irrigation" }
];

const CropCalendar = () => {
  const { selectedState, setSelectedState, selectedCity, setSelectedCity } = useUser();
  const { language, t } = useLanguage();

  const [activeSeason, setActiveSeason] = useState('All');
  const [pincode, setPincode] = useState('');
  const [locatingStatus, setLocatingStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const cropsForState = regionalCropDatabase[selectedState] || genericNationalCrops;

  const filteredCrops = cropsForState.filter(crop => {
    const matchesSeason = activeSeason === 'All' || crop.season.toLowerCase() === activeSeason.toLowerCase();
    const matchesQuery = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (crop.nameHi && crop.nameHi.includes(searchQuery));
    return matchesSeason && matchesQuery;
  });

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    if (indianStatesCities[state] && indianStatesCities[state].length > 0) {
      setSelectedCity(indianStatesCities[state][0]);
    }
  };

  const handlePincodeSearch = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      alert("Please enter a valid 6-digit Indian Postal PIN code.");
      return;
    }
    setLocatingStatus("Looking up PIN code...");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        const stateFound = postOffice.State;
        const districtFound = postOffice.District;
        
        if (indianStatesCities[stateFound]) {
          setSelectedState(stateFound);
          if (indianStatesCities[stateFound].includes(districtFound)) {
            setSelectedCity(districtFound);
          }
          setLocatingStatus(`📍 Located: ${postOffice.Name}, ${districtFound}, ${stateFound}`);
        } else {
          setLocatingStatus(`📍 Found: ${districtFound}, ${stateFound}`);
        }
      } else {
        setLocatingStatus("❌ PIN code not found. Please select State & District manually.");
      }
    } catch (err) {
      setLocatingStatus("❌ Error looking up PIN code. Please select manually.");
    }
  };

  const handleGeolocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocatingStatus("Detecting your GPS location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const state = data.address?.state;
          const city = data.address?.city || data.address?.state_district || data.address?.town || data.address?.county;
          
          if (state && indianStatesCities[state]) {
            setSelectedState(state);
            if (city && indianStatesCities[state].includes(city)) {
              setSelectedCity(city);
            }
            setLocatingStatus(`📍 Located: ${city || ''}, ${state}`);
          } else {
            setLocatingStatus(`📍 Coordinates: ${latitude.toFixed(2)}, ${longitude.toFixed(2)} (${state || 'India'})`);
          }
        } catch (e) {
          setLocatingStatus("❌ Geolocation lookup failed. Using current selection.");
        }
      },
      () => {
        setLocatingStatus("❌ Geolocation permission denied.");
      }
    );
  };

  return (
    <div className="crop-calendar-page">
      <div className="calendar-header-card glass-panel">
        <div className="header-info">
          <h1>📅 {t('sections.cropAdvisory.title') || 'Location-Based Crop Calendar'}</h1>
          <p className="subtitle">
            Scientific sowing, harvesting, and regional crop schedules tailored to your agro-climatic zone
          </p>
        </div>

        {/* Location selector bar */}
        <div className="calendar-location-bar">
          <div className="location-select-item">
            <label>State / राज्य:</label>
            <select value={selectedState} onChange={handleStateChange}>
              {Object.keys(indianStatesCities).map(s => (
                <option key={s} value={s}>{translateDBText(s, language)}</option>
              ))}
            </select>
          </div>

          <div className="location-select-item">
            <label>District / जिला:</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              {indianStatesCities[selectedState]?.map(c => (
                <option key={c} value={c}>{translateDBText(c, language)}</option>
              ))}
            </select>
          </div>

          <form className="pincode-form" onSubmit={handlePincodeSearch}>
            <input 
              type="text" 
              placeholder="Enter PIN code" 
              maxLength="6"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button type="submit" className="pincode-btn">Check PIN</button>
          </form>

          <button type="button" className="gps-btn" onClick={handleGeolocation} title="Auto-detect location">
            📍 Use My GPS
          </button>
        </div>

        {locatingStatus && (
          <div className="location-status-badge">
            {locatingStatus}
          </div>
        )}

        <div className="current-location-banner">
          <span>🌾 Showing scientific calendar recommendations for: </span>
          <strong>{selectedCity}, {selectedState}</strong>
        </div>
      </div>

      {/* Season Tabs & Search */}
      <div className="calendar-controls-bar">
        <div className="season-tabs">
          {['All', 'Kharif', 'Rabi', 'Zaid'].map(season => (
            <button 
              key={season}
              className={`season-tab-btn ${activeSeason === season ? 'active' : ''} ${season.toLowerCase()}-tab`}
              onClick={() => setActiveSeason(season)}
            >
              {season === 'All' && '🌱 All Seasons'}
              {season === 'Kharif' && '🌧️ Kharif (Monsoon)'}
              {season === 'Rabi' && '❄️ Rabi (Winter)'}
              {season === 'Zaid' && '☀️ Zaid (Summer)'}
            </button>
          ))}
        </div>

        <div className="crop-search-box">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Search crop (e.g. Wheat, Cotton)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="crop-grid">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop, idx) => (
            <div key={idx} className="crop-card glass-panel">
              <div className="crop-card-top">
                <div className="crop-icon-badge">{crop.icon}</div>
                <div className="crop-names">
                  <h3>{crop.name}</h3>
                  {crop.nameHi && <span className="name-hi">{crop.nameHi}</span>}
                </div>
                <span className={`season-tag tag-${crop.season.toLowerCase()}`}>
                  {crop.season}
                </span>
              </div>

              <div className="crop-timeline-visual">
                <div className="timeline-segment sowing-segment">
                  <span className="segment-label">🌱 Sowing</span>
                  <span className="segment-val">{crop.sowing}</span>
                </div>
                <div className="timeline-divider">➔</div>
                <div className="timeline-segment harvest-segment">
                  <span className="segment-label">🌾 Harvest</span>
                  <span className="segment-val">{crop.harvest}</span>
                </div>
              </div>

              <div className="crop-details-list">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <div>
                    <div className="detail-title">Duration</div>
                    <div className="detail-content">{crop.duration}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🧪</span>
                  <div>
                    <div className="detail-title">Soil Requirement</div>
                    <div className="detail-content">{crop.soil}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">💧</span>
                  <div>
                    <div className="detail-title">Water & Irrigation</div>
                    <div className="detail-content">{crop.water}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🌡️</span>
                  <div>
                    <div className="detail-title">Optimal Temperature</div>
                    <div className="detail-content">{crop.temp}</div>
                  </div>
                </div>
              </div>

              {crop.keyActivity && (
                <div className="key-activity-tip">
                  <span className="tip-badge">Agronomist Tip</span>
                  <p>{crop.keyActivity}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-crops-found glass-panel">
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3>No crops found for "{activeSeason}" season matching "{searchQuery}"</h3>
            <p>Try switching to "All Seasons" or search for another crop name.</p>
            <button className="reset-filter-btn" onClick={() => { setActiveSeason('All'); setSearchQuery(''); }}>
              Show All Recommended Crops
            </button>
          </div>
        )}
      </div>

      <div className="calendar-disclaimer-card glass-panel">
        <span className="disclaimer-icon">ℹ️</span>
        <div>
          <h4>Scientific Advisory Note:</h4>
          <p>
            Dates and periods are calculated based on Indian Council of Agricultural Research (ICAR) state agro-climatic zones. Actual sowing is heavily dependent on the onset of monsoon rains, local temperature variations, and soil moisture levels. Always cross-check with your local Krishi Vigyan Kendra (KVK).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;
