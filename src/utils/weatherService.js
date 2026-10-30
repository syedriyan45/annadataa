import { getCityCoords } from '../data/cityCoords';

// In-memory cache for weather data
// Format: { [cityKey]: { data: weatherData, timestamp: Date.now() } }
const weatherCache = {};
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Gets weather data for a city, using static coordinates when available,
 * and caching the forecast (both current and daily) to prevent duplicate loads.
 * 
 * @param {string} state 
 * @param {string} city 
 * @returns {Promise<object>} Weather forecast data containing current and daily fields.
 */
export const getWeatherData = async (state, city) => {
  const cacheKey = `${state || ''}_${city}`;
  const now = Date.now();

  // Check cache first
  if (weatherCache[cacheKey] && (now - weatherCache[cacheKey].timestamp < CACHE_EXPIRY_MS)) {
    console.log(`[WeatherService] Cache hit for ${city}`);
    return weatherCache[cacheKey].data;
  }

  // Get coordinates
  let latitude, longitude;
  const coords = getCityCoords(state, city);
  
  if (coords) {
    latitude = coords.lat;
    longitude = coords.lon;
    console.log(`[WeatherService] Static coordinates resolved for ${city}: ${latitude}, ${longitude}`);
  } else {
    // Fallback to Geocoding API if not pre-defined
    console.log(`[WeatherService] Coordinates not in static database. Fetching geocoding for ${city}...`);
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      latitude = geoData.results[0].latitude;
      longitude = geoData.results[0].longitude;
    } else {
      throw new Error(`Location coordinates could not be resolved for: ${city}`);
    }
  }

  // Single unified call for current and daily forecast parameters
  console.log(`[WeatherService] Fetching unified weather forecast for ${city}...`);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,relative_humidity_2m_max,wind_speed_10m_max&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API returned status ${res.status}`);
  }
  const data = await res.json();

  // Store in cache
  weatherCache[cacheKey] = {
    data,
    timestamp: now
  };

  return data;
};
