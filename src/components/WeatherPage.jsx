import React, { useState, useEffect, useCallback } from 'react';
import './WeatherPage.css';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { getWeatherData } from '../utils/weatherService';
import { indianStatesCities } from '../data/indianStatesCities';
import { translateDBText } from '../utils/translator';

const getWeatherIconAndLabel = (code) => {
  if (code === 0) return { icon: "☀️", label: "Clear Sky / साफ़ मौसम" };
  if (code === 1 || code === 2 || code === 3) return { icon: "⛅", label: "Partly Cloudy / आंशिक बादल" };
  if (code === 45 || code === 48) return { icon: "🌫️", label: "Foggy / कोहरा" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", label: "Light Drizzle / हल्की बूंदाबांदी" };
  if (code >= 61 && code <= 65) return { icon: "🌧️", label: "Rain / वर्षा" };
  if (code >= 71 && code <= 77) return { icon: "❄️", label: "Cold / Frost / पाला" };
  if (code >= 80 && code <= 82) return { icon: "⛈️", label: "Showers / भारी बारिश" };
  if (code >= 95 && code <= 99) return { icon: "⚡", label: "Thunderstorm / आंधी-तूफान" };
  return { icon: "⛅", label: "Cloudy / बादल" };
};

const WeatherPage = () => {
  const { selectedState, setSelectedState, selectedCity, setSelectedCity } = useUser();
  const { language } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(600); // 10 min countdown

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(selectedState, selectedCity);
      setWeather(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setRefreshCountdown(600);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError("Unable to connect to live meteorological service. Showing cached or regional estimates.");
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedCity]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Auto-refresh timer every 10 min
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          fetchWeather();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchWeather]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    if (indianStatesCities[state] && indianStatesCities[state].length > 0) {
      setSelectedCity(indianStatesCities[state][0]);
    }
  };

  const current = weather?.current;
  const daily = weather?.daily;
  const hourly = weather?.hourly;

  const weatherMeta = current ? getWeatherIconAndLabel(current.weather_code) : { icon: "⛅", label: "Loading..." };

  // Generate agricultural advisory alerts based on live numbers
  const generateFarmingAdvisories = () => {
    if (!current) return [];
    const advisories = [];
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const wind = current.wind_speed_10m;
    const isRain = (current.weather_code >= 51 && current.weather_code <= 67) || 
                   (current.weather_code >= 80 && current.weather_code <= 99);

    if (isRain) {
      advisories.push({
        type: 'danger',
        title: '🌧️ Heavy Rain Alert: Postpone Spraying & Harvesting',
        desc: 'Active precipitation detected. Immediately suspend foliar chemical spraying, fertilizer top-dressing, and harvest stacking in open threshing yards.'
      });
    }

    if (temp >= 36) {
      advisories.push({
        type: 'warning',
        title: '🌡️ High Heat Stress Advisory',
        desc: `Temperature is at ${temp}°C. Give light evening irrigation to standing horticultural and vegetable crops to prevent heat-induced flower drop.`
      });
    } else if (temp <= 10) {
      advisories.push({
        type: 'warning',
        title: '❄️ Cold Temperature & Frost Alert',
        desc: `Low temperature (${temp}°C) recorded. Irrigate fields or create smoke mulch at field borders to protect sensitive potato and mustard crops from frost.`
      });
    }

    if (humidity > 80 && !isRain) {
      advisories.push({
        type: 'caution',
        title: '🍄 High Humidity: Fungal Disease Vigilance',
        desc: `Relative humidity is elevated at ${humidity}%. Favorable for downy mildew, leaf blast, and powdery mildew. Inspect lower leaf canopies.`
      });
    }

    if (wind > 20) {
      advisories.push({
        type: 'caution',
        title: '💨 High Wind Warning: Secure Crops & Avoid Spraying',
        desc: `Wind speed is ${wind} km/h. Avoid drone or tractor spraying due to chemical drift. Provide support staking to banana and tall sugarcane crops.`
      });
    }

    if (advisories.length === 0) {
      advisories.push({
        type: 'good',
        title: '☀️ Favorable Farming Conditions',
        desc: 'Current weather parameters are optimal for standard field operations, sowing, intercultural weeding, and balanced irrigation.'
      });
    }

    return advisories;
  };

  const advisories = generateFarmingAdvisories();

  return (
    <div className="weather-page-container">
      {/* Top Header & Location Bar */}
      <div className="weather-header-card glass-panel">
        <div className="weather-title-row">
          <div>
            <h1>⛅ {selectedCity} Farm Weather & Live Agro-Alerts</h1>
            <p className="subtitle">
              Hyper-local meteorological telemetry powered by Open-Meteo High-Resolution Agricultural Models
            </p>
          </div>
          <div className="weather-actions">
            <div className="refresh-tag">
              Auto-refresh in {Math.floor(refreshCountdown / 60)}:{(refreshCountdown % 60).toString().padStart(2, '0')}
            </div>
            <button className="manual-refresh-btn" onClick={fetchWeather} disabled={loading}>
              {loading ? 'Refreshing...' : '🔄 Refresh Now'}
            </button>
          </div>
        </div>

        {/* Location Dropdowns */}
        <div className="weather-location-bar">
          <div className="select-box">
            <label>State / राज्य:</label>
            <select value={selectedState} onChange={handleStateChange}>
              {Object.keys(indianStatesCities).map(s => (
                <option key={s} value={s}>{translateDBText(s, language)}</option>
              ))}
            </select>
          </div>
          <div className="select-box">
            <label>District / Mandi Location:</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              {indianStatesCities[selectedState]?.map(c => (
                <option key={c} value={c}>{translateDBText(c, language)}</option>
              ))}
            </select>
          </div>
          {lastUpdated && (
            <div className="last-sync-badge">
              ✓ Synchronized at: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {error && <div className="weather-error-banner">{error}</div>}

      {/* Hero Weather Section */}
      {current && (
        <div className="weather-hero-grid">
          <div className="main-temp-card glass-panel">
            <div className="temp-header">
              <span className="weather-large-icon">{weatherMeta.icon}</span>
              <div className="temp-numbers">
                <span className="big-degree">{Math.round(current.temperature_2m)}°C</span>
                <span className="weather-desc">{weatherMeta.label}</span>
              </div>
            </div>

            <div className="temp-sub-stats">
              <div className="stat-pill">
                <span>Feels Like:</span>
                <strong>{current.apparent_temperature ? `${Math.round(current.apparent_temperature)}°C` : `${Math.round(current.temperature_2m)}°C`}</strong>
              </div>
              <div className="stat-pill">
                <span>Elevation:</span>
                <strong>{weather?.elevation || '280'}m MSL</strong>
              </div>
            </div>
          </div>

          <div className="weather-metrics-grid">
            <div className="metric-box glass-panel">
              <span className="metric-icon">💧</span>
              <div className="metric-val">{current.relative_humidity_2m}%</div>
              <div className="metric-name">Relative Humidity</div>
            </div>
            <div className="metric-box glass-panel">
              <span className="metric-icon">💨</span>
              <div className="metric-val">{current.wind_speed_10m} km/h</div>
              <div className="metric-name">Wind Velocity</div>
            </div>
            <div className="metric-box glass-panel">
              <span className="metric-icon">🧭</span>
              <div className="metric-val">{current.wind_direction_10m || 240}°</div>
              <div className="metric-name">Wind Direction</div>
            </div>
            <div className="metric-box glass-panel">
              <span className="metric-icon">🌧️</span>
              <div className="metric-val">{current.precipitation !== undefined ? `${current.precipitation} mm` : '0 mm'}</div>
              <div className="metric-name">Current Rain</div>
            </div>
          </div>
        </div>
      )}

      {/* Farming Advisories Section */}
      <div className="advisories-section glass-panel">
        <h2>📢 Real-Time Agricultural Advisories (ICAR / KVK Aligned)</h2>
        <div className="advisory-cards-list">
          {advisories.map((adv, idx) => (
            <div key={idx} className={`advisory-alert-card alert-type-${adv.type}`}>
              <h3>{adv.title}</h3>
              <p>{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast */}
      {daily && daily.time && (
        <div className="forecast-section glass-panel">
          <h2>📅 7-Day Weather Outlook for {selectedCity}</h2>
          <div className="forecast-scroll-row">
            {daily.time.slice(0, 7).map((dayTime, i) => {
              const dateObj = new Date(dayTime);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              const dayMeta = getWeatherIconAndLabel(daily.weather_code[i]);
              const maxTemp = Math.round(daily.temperature_2m_max[i]);
              const minTemp = Math.round(daily.temperature_2m_min[i]);
              const rainSum = daily.precipitation_sum ? daily.precipitation_sum[i] : 0;

              return (
                <div key={i} className={`forecast-day-card ${i === 0 ? 'today-card' : ''}`}>
                  <div className="forecast-day-title">{i === 0 ? 'Today' : dayName}</div>
                  <div className="forecast-icon">{dayMeta.icon}</div>
                  <div className="forecast-temps">
                    <span className="forecast-max">{maxTemp}°</span>
                    <span className="forecast-min">{minTemp}°</span>
                  </div>
                  <div className="forecast-rain">
                    💧 {rainSum > 0 ? `${rainSum}mm` : '0mm'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 24-Hour Timeline */}
      {hourly && hourly.time && (
        <div className="hourly-section glass-panel">
          <h2>⏰ 24-Hour Weather & Spray Timing Window</h2>
          <div className="hourly-scroll-row">
            {hourly.time.slice(0, 24).map((hTime, idx) => {
              const hourDate = new Date(hTime);
              const hourLabel = hourDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });
              const hTemp = Math.round(hourly.temperature_2m[idx]);
              const hHum = hourly.relative_humidity_2m[idx];
              const hRain = hourly.precipitation ? hourly.precipitation[idx] : 0;

              return (
                <div key={idx} className="hourly-node">
                  <span className="hour-label">{hourLabel}</span>
                  <span className="hour-temp">{hTemp}°C</span>
                  <span className="hour-humidity">💧 {hHum}%</span>
                  {hRain > 0 && <span className="hour-rain">🌧️ {hRain}mm</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
