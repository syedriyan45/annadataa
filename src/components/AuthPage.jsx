import React, { useState, useEffect } from 'react';
import './AuthPage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { user, sendOtp, verifyOtp } = useUser();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim().replace(/[^\d]/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setLoading(true);
    const res = await sendOtp(cleanPhone);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(30); // 30-second cooldown
      setSuccessMsg(res.message || `OTP sent to +91 ${cleanPhone}. Please enter the 6-digit code.`);
    } else {
      setErrorMsg(res.error || 'Failed to send OTP. Please check your number.');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyOtp(phone.trim(), cleanOtp);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Phone verified successfully! Redirecting to farm dashboard...');
      setTimeout(() => navigate('/'), 800);
    } else {
      setErrorMsg(res.error || 'Invalid or expired OTP. Please try again.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo-badge">🌾</div>
          <h2>Farmer Sign In / Registration</h2>
          <p className="auth-subtitle">
            Secure Phone Number & OTP Verification. No passwords or email required.
          </p>
        </div>

        {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

        {!otpSent ? (
          /* Step 1: Mobile Phone Number Input */
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Mobile Number / मोबाइल नंबर</label>
              <div className="input-wrapper phone-input-wrapper">
                <span className="country-prefix">+91</span>
                <input
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/[^\d]/g, ''));
                    setErrorMsg('');
                  }}
                  autoFocus
                  required
                />
              </div>
              <span className="field-hint">Enter your 10-digit mobile number to receive a one-time password (OTP).</span>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="spinner-inline">⏳ Sending OTP...</span>
              ) : (
                'Send Verification OTP ➔'
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification Input */
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="phone-verified-bar">
              <span>📱 Number: <strong>+91 {phone}</strong></span>
              <button 
                type="button" 
                className="change-num-btn"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                Change Number
              </button>
            </div>

            <div className="form-group">
              <label>Enter 6-Digit OTP / ओटीपी दर्ज करें</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^\d]/g, ''));
                    setErrorMsg('');
                  }}
                  autoFocus
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading || otp.length !== 6}>
              {loading ? (
                <span className="spinner-inline">⏳ Verifying...</span>
              ) : (
                'Verify OTP and Sign In'
              )}
            </button>

            <div className="resend-row">
              {countdown > 0 ? (
                <span className="resend-countdown">
                  ⏱️ Resend OTP in {countdown}s
                </span>
              ) : (
                <button 
                  type="button" 
                  className="resend-btn"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  🔄 Resend OTP Code
                </button>
              )}
            </div>
          </form>
        )}

        <div className="security-notice">
          <span>🔒 End-to-end phone verification protected by rate-limiting and single-use cryptographic tokens.</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
