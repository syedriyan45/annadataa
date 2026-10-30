import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import ScanCrop from './components/ScanCrop';
import SatelliteMonitoring from './components/SatelliteMonitoring';
import Profile from './components/Profile';
import AuthPage from './components/AuthPage';
import CropCalendar from './components/CropCalendar';
import WeatherPage from './components/WeatherPage';
import MarketplacePage from './components/MarketplacePage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard onExploreSatellite={() => navigate('/monitor')} />} />
          <Route path="/calendar" element={<CropCalendar />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/market" element={<MarketplacePage />} />
          <Route path="/scan" element={<ScanCrop />} />
          <Route path="/monitor" element={<SatelliteMonitoring />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
      
      {/* Premium Floating Bottom Navigation Bar */}
      <div className="bottom-nav-container">
        <nav className="bottom-nav glass-panel">
          <button 
            className={`bottom-nav-item ${pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
            id="nav-btn-home"
            title="Home Dashboard"
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </button>

          <button 
            className={`bottom-nav-item ${pathname === '/calendar' ? 'active' : ''}`}
            onClick={() => navigate('/calendar')}
            id="nav-btn-calendar"
            title="Crop Calendar"
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">Calendar</span>
          </button>

          <button 
            className={`bottom-nav-item ${pathname === '/scan' ? 'active' : ''}`}
            onClick={() => navigate('/scan')}
            id="nav-btn-scan"
            title="Scan Crop Disease"
          >
            <span className="nav-icon">📷</span>
            <span className="nav-label">Scan</span>
          </button>

          <button 
            className={`bottom-nav-item ${pathname === '/weather' ? 'active' : ''}`}
            onClick={() => navigate('/weather')}
            id="nav-btn-weather"
            title="Weather"
          >
            <span className="nav-icon">⛅</span>
            <span className="nav-label">Weather</span>
          </button>

          <button 
            className={`bottom-nav-item ${pathname === '/market' ? 'active' : ''}`}
            onClick={() => navigate('/market')}
            id="nav-btn-market"
            title="Local Mandi Marketplace"
          >
            <span className="nav-icon">🤝</span>
            <span className="nav-label">Mandi</span>
          </button>

          <button 
            className={`bottom-nav-item ${pathname === '/monitor' ? 'active' : ''}`}
            onClick={() => navigate('/monitor')}
            id="nav-btn-monitor"
            title="Satellite Land Monitoring"
          >
            <span className="nav-icon">🛰️</span>
            <span className="nav-label">Monitor</span>
          </button>

          <button 
            className={`bottom-nav-item ${pathname === '/profile' ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
            id="nav-btn-profile"
            title="Farmer Profile"
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </nav>
      </div>

      <AIAssistant />
    </div>
  );
}

export default App;
