import { getCityCoords } from '../data/cityCoords';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

async function resolveLocation(state, city, signal) {
  const known = getCityCoords(state, city);
  if (known) {
    return { ...known, coveredArea: `${city}, ${state}`, coverageLevel: 'selected city' };
  }

  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=10&language=en&format=json`,
    { signal }
  );
  if (!response.ok) throw new Error('Could not look up the selected location.');
  const data = await response.json();
  const results = data.results || [];
  const match = results.find((item) =>
    item.country_code === 'IN' &&
    (!item.admin1 || item.admin1.toLowerCase() === String(state).toLowerCase())
  ) || results.find((item) => item.country_code === 'IN');

  if (!match) throw new Error(`Weather coverage is unavailable for ${city}, ${state}.`);
  const locality = [match.name, match.admin1].filter(Boolean).join(', ');
  return {
    lat: match.latitude,
    lon: match.longitude,
    coveredArea: locality || `${city}, ${state}`,
    coverageLevel: match.name.toLowerCase() === city.toLowerCase() ? 'selected location' : 'nearest matched location'
  };
}

function formatTime(value, timezone) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: timezone || 'Asia/Kolkata', hour: 'numeric', minute: '2-digit'
  }).format(date);
}

function formatPeriod(start, end, timezone) {
  const from = formatTime(start, timezone);
  const to = formatTime(end, timezone);
  if (!from) return 'Next 24 hours';
  if (!to || from === to) return `Around ${from}`;
  return `${from} – ${to}`;
}

function getRiskAlerts(data, location) {
  const alerts = [];
  const current = data.current || {};
  const hourly = data.hourly || {};
  const daily = data.daily || {};
  const timezone = data.timezone || 'Asia/Kolkata';
  const now = Date.now();
  const times = hourly.time || [];
  const next24 = times.map((time, index) => ({
    time,
    date: new Date(time).getTime(),
    precipitation: Number(hourly.precipitation?.[index] || 0),
    probability: Number(hourly.precipitation_probability?.[index] || 0),
    gust: Number(hourly.wind_gusts_10m?.[index] || 0),
    temperature: Number(hourly.temperature_2m?.[index]),
    code: Number(hourly.weather_code?.[index] || 0)
  })).filter((item) => item.date >= now - 60 * 60 * 1000 && item.date <= now + 24 * 60 * 60 * 1000);

  const rainHours = next24.filter((item) => item.precipitation >= 10 || (item.precipitation >= 5 && item.probability >= 70));
  const rainTotal = next24.reduce((sum, item) => sum + item.precipitation, 0);
  const maxRainProbability = Math.max(0, ...next24.map((item) => item.probability));
  if (rainTotal >= 50 || rainHours.some((item) => item.precipitation >= 30)) {
    const peak = [...next24].sort((a, b) => b.precipitation - a.precipitation)[0];
    alerts.push({
      id: 'heavy-rain', priority: 'critical', title: 'Heavy rainfall risk',
      description: `Forecast indicates about ${Math.round(rainTotal)} mm of rain in the next 24 hours. Avoid spraying and check field drainage.`,
      period: formatPeriod(rainHours[0]?.time || peak?.time, rainHours[rainHours.length - 1]?.time, timezone)
    });
  } else if (rainTotal >= 25 || (rainHours.length >= 2 && maxRainProbability >= 70)) {
    alerts.push({
      id: 'rainfall', priority: 'high', title: 'Rain may disrupt farm work',
      description: `Rain is forecast in the next 24 hours (${Math.round(rainTotal)} mm total, up to ${maxRainProbability}% probability). Consider postponing spraying or harvesting.`,
      period: formatPeriod(rainHours[0]?.time || next24.find((item) => item.precipitation > 0)?.time, rainHours[rainHours.length - 1]?.time, timezone)
    });
  }

  const storm = next24.find((item) => item.code >= 95 && item.code <= 99);
  if (storm) {
    alerts.push({
      id: 'thunderstorm', priority: 'critical', title: 'Thunderstorm risk',
      description: 'The forecast indicates thunderstorm conditions. Keep people and livestock sheltered and avoid exposed fields during lightning.',
      period: formatPeriod(storm.time, next24.find((item) => item.date > storm.date + 2 * 60 * 60 * 1000)?.time || storm.time, timezone)
    });
  }

  const peakGust = [...next24].sort((a, b) => b.gust - a.gust)[0];
  const currentGust = Number(current.wind_gusts_10m || 0);
  const gust = Math.max(currentGust, peakGust?.gust || 0);
  if (gust >= 75) {
    alerts.push({
      id: 'extreme-wind', priority: 'critical', title: 'Dangerous wind gusts forecast',
      description: `Wind gusts may reach ${Math.round(gust)} km/h. Secure lightweight farm equipment and protect vulnerable crops where possible.`,
      period: formatPeriod(peakGust?.time, peakGust?.time, timezone)
    });
  } else if (gust >= 50) {
    alerts.push({
      id: 'strong-wind', priority: 'high', title: 'Strong winds forecast',
      description: `Wind gusts may reach ${Math.round(gust)} km/h. Check support for tall crops and avoid pesticide spraying in strong winds.`,
      period: formatPeriod(peakGust?.time, peakGust?.time, timezone)
    });
  }

  const dailyMax = Number(daily.temperature_2m_max?.[0]);
  const dailyMin = Number(daily.temperature_2m_min?.[0]);
  const maxTemp = Math.max(Number(current.temperature_2m ?? -100), ...next24.map((item) => Number.isFinite(item.temperature) ? item.temperature : -100));
  if (dailyMax >= 42 || maxTemp >= 42) {
    alerts.push({
      id: 'extreme-heat', priority: 'critical', title: 'Extreme heat risk',
      description: `Temperatures may reach ${Math.round(Math.max(dailyMax || 0, maxTemp))}°C. Irrigate according to crop needs and reduce strenuous outdoor work during peak heat.`,
      period: 'Today'
    });
  } else if (dailyMax >= 40 || maxTemp >= 40) {
    alerts.push({
      id: 'high-heat', priority: 'high', title: 'High temperature advisory',
      description: `Temperatures may reach ${Math.round(Math.max(dailyMax || 0, maxTemp))}°C. Monitor crop water stress and check irrigation needs.`,
      period: 'Today'
    });
  }
  if (Number.isFinite(dailyMin) && dailyMin <= 4) {
    alerts.push({
      id: 'cold-stress', priority: 'high', title: 'Very low temperature risk',
      description: `The minimum temperature may fall to ${Math.round(dailyMin)}°C. Monitor sensitive crops for cold stress and follow local agricultural guidance.`,
      period: 'Overnight / early morning'
    });
  }

  const priorityOrder = { critical: 0, high: 1, info: 2 };
  return alerts
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .map((alert) => ({ ...alert, location: location.coveredArea }));
}

export async function fetchLiveAgriculturalAlerts(state, city, signal) {
  if (!state || !city) throw new Error('Select a state and city to view local alerts.');
  const location = await resolveLocation(state, city, signal);
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m',
    hourly: 'temperature_2m,precipitation,precipitation_probability,wind_gusts_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code',
    forecast_days: '2',
    timezone: 'auto'
  }).toString();

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}. Please retry shortly.`);
  const data = await response.json();
  if (!data.current || !Array.isArray(data.hourly?.time) || !Array.isArray(data.daily?.time)) {
    throw new Error('The weather provider returned incomplete forecast data. Please retry.');
  }

  const alerts = getRiskAlerts(data, location);
  return {
    alerts,
    location,
    source: 'Open-Meteo forecast · risk estimates, not official warnings',
    updatedAt: new Date().toISOString(),
    forecastValidAt: data.current.time || null,
    timezone: data.timezone || 'Asia/Kolkata'
  };
}
