import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('annadata_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('annadata_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedState, setSelectedState] = useState(() => {
    try {
      return localStorage.getItem('annadata_selectedState') || "Karnataka";
    } catch { return "Karnataka"; }
  });

  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      return localStorage.getItem('annadata_selectedCity') || "Kalaburagi";
    } catch { return "Kalaburagi"; }
  });

  // Verify session with backend on load
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('annadata_user', JSON.stringify(data.user));
            if (data.user.state) setSelectedState(data.user.state);
            if (data.user.city) setSelectedCity(data.user.city);
          } else {
            // Invalid or expired token
            setToken(null);
            setUser(null);
            localStorage.removeItem('annadata_token');
            localStorage.removeItem('annadata_user');
          }
        })
        .catch(() => {
          // Keep offline session if network issue
        });
    }
  }, [token]);

  // Persist location
  useEffect(() => {
    try {
      localStorage.setItem('annadata_selectedState', selectedState);
      localStorage.setItem('annadata_selectedCity', selectedCity);
    } catch (e) { /* ignore */ }
  }, [selectedState, selectedCity]);

  // Request OTP for Phone
  const sendOtp = async (phone) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Network error connecting to OTP authentication service.' };
    }
  };

  // Verify OTP and Sign In
  const verifyOtp = async (phone, otp) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();

      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('annadata_token', data.token);
        localStorage.setItem('annadata_user', JSON.stringify(data.user));
        if (data.user.state) setSelectedState(data.user.state);
        if (data.user.city) setSelectedCity(data.user.city);
      }
      return data;
    } catch (err) {
      return { success: false, error: 'Network error during OTP verification.' };
    }
  };

  // Update profile
  const updateProfile = async (name, state, city) => {
    if (!token) return { success: false, error: 'Not authenticated.' };
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, state, city })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('annadata_user', JSON.stringify(data.user));
        if (state) setSelectedState(state);
        if (city) setSelectedCity(city);
      }
      return data;
    } catch (err) {
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  // Sign out
  const signOut = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) { /* ignore */ }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('annadata_token');
    localStorage.removeItem('annadata_user');
  };

  return (
    <UserContext.Provider value={{ 
      token,
      user, 
      sendOtp, 
      verifyOtp, 
      updateProfile,
      signOut,
      selectedState, 
      setSelectedState, 
      selectedCity, 
      setSelectedCity 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
