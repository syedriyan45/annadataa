import { useCallback, useEffect, useState } from 'react';
import './AlertBanner.css';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { fetchLiveAgriculturalAlerts } from '../utils/liveAlertsService';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

const formatUpdatedTime = (value, timezone) => {
  if (!value) return 'Time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Time unavailable';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: timezone || 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
  }).format(date);
};

const AlertBanner = () => {
  const { t } = useLanguage();
  const { selectedState, selectedCity } = useUser();
  const [status, setStatus] = useState('loading');
  const [alerts, setAlerts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [statusLocationKey, setStatusLocationKey] = useState('');
  const currentLocationKey = `${selectedCity}, ${selectedState}`;
  const visibleStatus = statusLocationKey === currentLocationKey ? status : 'loading';

  const loadAlerts = useCallback(async (signal) => {
    setStatusLocationKey(`${selectedCity}, ${selectedState}`);
    setStatus('loading');
    setErrorMessage('');
    setAlerts([]);
    setMeta(null);
    try {
      const result = await fetchLiveAgriculturalAlerts(selectedState, selectedCity, signal);
      if (signal.aborted) return;
      setAlerts(result.alerts);
      setMeta(result);
      setStatus(result.alerts.length ? 'success' : 'empty');
    } catch (error) {
      if (signal.aborted || error.name === 'AbortError') return;
      setStatus('error');
      setAlerts([]);
      setMeta(null);
      setErrorMessage(error.message || 'Live weather alerts could not be loaded.');
    }
  }, [selectedState, selectedCity]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) loadAlerts(controller.signal);
    });
    return () => controller.abort();
  }, [loadAlerts, retryCount]);

  useEffect(() => {
    const timer = window.setInterval(() => setRetryCount((value) => value + 1), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const retry = () => setRetryCount((value) => value + 1);
  const priorityLabel = (priority) => ({ critical: 'Critical', high: 'High priority', info: 'Information' }[priority] || 'Alert');

  return (
    <section className="alert-banner-container glass-panel" aria-live="polite" aria-label="Location-based live agricultural alerts">
      <div className={`alert-badge ${visibleStatus === 'success' ? 'has-alerts' : visibleStatus === 'error' ? 'has-error' : 'is-neutral'}`}>
        <span className={`pulse-dot ${visibleStatus !== 'success' ? 'no-pulse' : ''}`} aria-hidden="true">{visibleStatus === 'success' ? '●' : visibleStatus === 'error' ? '!' : '•'}</span>
        <span className="badge-text">{t('alerts.live')}</span>
      </div>

      <div className="live-alerts-content">
        <div className="live-alerts-heading">
          <span className="live-alerts-location">📍 {selectedCity}, {selectedState}</span>
          {meta && <span className="live-alerts-source">Forecast source: {meta.source}</span>}
        </div>

        {visibleStatus === 'loading' && (
          <div className="live-alerts-state" role="status"><span className="alert-loading-spinner" /> Checking current forecast for {selectedCity}…</div>
        )}

        {visibleStatus === 'empty' && (
          <div className="live-alerts-state empty-alert-state">
            <strong>No Active Alerts</strong>
            <span>There are no important alerts for your selected location right now.</span>
            <small>Data retrieved: {formatUpdatedTime(meta?.updatedAt, meta?.timezone)}</small>
          </div>
        )}

        {visibleStatus === 'error' && (
          <div className="live-alerts-state error-alert-state" role="alert">
            <strong>Alerts temporarily unavailable</strong>
            <span>{errorMessage}</span>
            <button type="button" className="alert-retry-button" onClick={retry}>Retry</button>
          </div>
        )}

        {visibleStatus === 'success' && (
          <>
            <div className="live-alerts-list">
              {alerts.map((alert) => (
                <article className={`live-alert-card priority-${alert.priority}`} key={alert.id}>
                  <div className="live-alert-card-topline">
                    <span className={`priority-label priority-label-${alert.priority}`}>{priorityLabel(alert.priority)}</span>
                    <span className="live-alert-period">{alert.period}</span>
                  </div>
                  <strong className="live-alert-title">{alert.title}</strong>
                  <p>{alert.description}</p>
                  <small>Area covered: {alert.location}</small>
                </article>
              ))}
            </div>
            <div className="live-alerts-updated">Data retrieved: {formatUpdatedTime(meta?.updatedAt, meta?.timezone)} · Auto-refreshes every 15 minutes</div>
          </>
        )}
        {visibleStatus === 'empty' && <div className="live-alerts-updated">Data retrieved: {formatUpdatedTime(meta?.updatedAt, meta?.timezone)} · Auto-refreshes every 15 minutes</div>}
      </div>
    </section>
  );
};

export default AlertBanner;
