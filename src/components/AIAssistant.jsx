import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AIAssistant.css';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { fetchSimulatedMarketData } from '../data/marketApiSimulation';
import { fetchSchemesForState } from '../data/schemesApiSimulation';
import { getWeatherData } from '../utils/weatherService';
import { translateDBText } from '../utils/translator';

/* ── Language → BCP-47 map ── */
const LANG_MAP = {
  en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN',
  gu: 'gu-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN',
};

/* ── Gemini config (key from .env, never shown to user) ── */
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT = `You are Annadaata AI — a warm, expert agricultural assistant for Indian farmers.
Help with: crop disease, pest management, weather advice, mandi prices, government schemes (PM Kisan, PMFBY, KCC), irrigation, and equipment.
Rules:
- Answer in the SAME language the farmer used (Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu, Kannada, or English).
- Keep answers SHORT: 2-3 sentences max. Be direct and practical.
- Always end with ONE actionable tip the farmer can do TODAY.
- Use simple words. Be encouraging. Address the farmer as "bhai" (or local equivalent) to feel friendly.
- If live market/scheme data is given, use it in your answer.`;

const AIAssistant = () => {
  const { t, language } = useLanguage();
  const { selectedState, selectedCity } = useUser();

  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const synthRef       = useRef(window.speechSynthesis);

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  /* ── Greeting when language changes ── */
  useEffect(() => {
    setMessages([{ id: 1, text: t('ai.greeting'), isBot: true }]);
  }, [language]);

  /* ── Pre-load voices ── */
  useEffect(() => {
    const load = () => synthRef.current.getVoices();
    load();
    synthRef.current.addEventListener?.('voiceschanged', load);
    return () => synthRef.current.removeEventListener?.('voiceschanged', load);
  }, []);

  /* ── Wake word event ── */
  useEffect(() => {
    const handler = (e) => {
      setIsOpen(true);
      handleSend(e.detail.query);
    };
    window.addEventListener('wakeWordDetected', handler);
    return () => window.removeEventListener('wakeWordDetected', handler);
  }, [language, selectedState, selectedCity]);

  /* ════════════════════════════════════════════
     TTS — speak response loudly & clearly
  ════════════════════════════════════════════ */
  const speakLoudly = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const bcp = LANG_MAP[language] || 'en-IN';
    const voices = synthRef.current.getVoices();

    /* Pick the best voice — prefer Google voices for quality */
    const voice =
      voices.find(v => v.name.toLowerCase().includes('google') && v.lang === bcp) ||
      voices.find(v => v.lang === bcp) ||
      voices.find(v => v.lang.startsWith(language)) ||
      voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.includes('IN')) ||
      voices[0];

    if (voice) utterance.voice = voice;
    utterance.lang   = bcp;
    utterance.volume = 1;      // MAX volume
    utterance.rate   = 0.88;   // Slightly slower — easier to understand
    utterance.pitch  = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [language]);

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  /* ════════════════════════════════════════════
     GEMINI API call
  ════════════════════════════════════════════ */
  const callGemini = async (userMessage, context = '') => {
    const prompt = context ? `${userMessage}\n\n[Live Data: ${context}]` : userMessage;
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 180, temperature: 0.75 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  };

  /* ════════════════════════════════════════════
     VOICE INPUT — mic button
  ════════════════════════════════════════════ */
  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser. Try Chrome.'); return; }

    stopSpeaking(); // Stop any ongoing TTS before listening

    const rec = new SR();
    rec.lang             = LANG_MAP[language] || 'en-IN';
    rec.interimResults   = false;
    rec.maxAlternatives  = 1;

    rec.onstart  = () => setIsListening(true);
    rec.onerror  = () => setIsListening(false);
    rec.onend    = () => setIsListening(false);

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputValue(transcript);
      // Auto-send immediately after speech detected
      handleSend(transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  /* ════════════════════════════════════════════
     SEND MESSAGE
  ════════════════════════════════════════════ */
  const handleSend = async (text = inputValue) => {
    const trimmed = (typeof text === 'string' ? text : inputValue).trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { id: Date.now(), text: trimmed, isBot: false }]);
    setInputValue('');
    setIsThinking(true);

    let botResponse = t('ai.defaultResponse');

    try {
      /* Build live context to enrich Gemini answer */
      let ctx = `User is at ${selectedCity}, ${selectedState}. Language: ${language}.`;

      const lower = trimmed.toLowerCase();

      /* Inject live market prices if relevant */
      const marketKw = ['market','price','bhav','rate','mandi','भाव','ధర','விலை','ಬೆಲೆ','ভাব','ભાવ','बाजार','दर'];
      if (marketKw.some(k => lower.includes(k))) {
        try {
          const mkt = await fetchSimulatedMarketData(selectedState, selectedCity);
          const top = mkt.slice(0, 4)
            .map(d => `${d.name}: ₹${d.localPrice}/q (${d.trend === 'up' ? '▲' : '▼'})`)
            .join(', ');
          ctx += ` Today's ${selectedCity} mandi: ${top}.`;
        } catch (_) {}
      }

      /* Inject live weather if relevant */
      const weatherKw = ['weather', 'rain', 'temperature', 'mausam', 'barish', 'havaman', 'हवामान', 'मौसम', 'बारिश', 'ತಾಪಮಾನ', 'மழை', 'వర్షం'];
      if (weatherKw.some(k => lower.includes(k))) {
        try {
          const w = await getWeatherData(selectedState, selectedCity);
          if (w && w.current) {
            ctx += ` Current live weather at ${selectedCity}: ${Math.round(w.current.temperature_2m)}°C, Humidity: ${w.current.relative_humidity_2m}%, Wind: ${w.current.wind_speed_10m} km/h.`;
          }
        } catch (_) {}
      }

      /* Inject scheme names if relevant */
      const schemeKw = ['scheme','yojana','योजना','పథకం','திட்டம்','ಯೋಜನೆ','যোজনা','sarkari','govt'];
      if (schemeKw.some(k => lower.includes(k))) {
        try {
          const schemes = await fetchSchemesForState(selectedState);
          ctx += ` Active schemes in ${selectedState}: ${schemes.slice(0,3).map(s=>s.name).join(', ')}.`;
        } catch (_) {}
      }

      const answer = await callGemini(trimmed, ctx);
      if (answer) botResponse = answer;

    } catch (err) {
      console.error('Gemini error:', err);
      botResponse = t('ai.errorMessage');
    }

    setIsThinking(false);
    const botMsg = { id: Date.now() + 1, text: botResponse, isBot: true };
    setMessages(prev => [...prev, botMsg]);

    /* ★ AUTO-SPEAK every response — loudly ★ */
    speakLoudly(botResponse);
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className={`ai-assistant-container ${isOpen ? 'open' : ''}`}>

      {/* FAB button */}
      <button
        className={`fab-btn glass-panel ${isSpeaking ? 'pulse-active' : ''}`}
        onClick={() => { setIsOpen(o => !o); if (isSpeaking) stopSpeaking(); }}
        title="Kisan AI Assistant"
      >
        <span className="fab-icon">{isSpeaking ? '🔊' : '🤖'}</span>
      </button>

      {isOpen && (
        <div className="chat-window glass-panel">

          {/* ── Header ── */}
          <div className="chat-header">
            <div className="chat-title">
              <span className="robot-icon">🤖</span>
              <div>
                <h4>{t('ai.title')}</h4>
                <span className="status" style={{ color: '#15803D', fontWeight: 700 }}>
                  ✨ Gemini AI • {isSpeaking ? '🔊 Speaking...' : t('ai.status')}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {isSpeaking && (
                <button className="close-btn" onClick={stopSpeaking}
                  style={{ background: '#FEE2E2', color: '#DC2626', border: '2px solid #FECACA' }}
                  title="Stop speaking">
                  🔇 Stop
                </button>
              )}
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                <span>{msg.text}</span>
                {msg.isBot && (
                  <button
                    onClick={() => speakLoudly(msg.text)}
                    style={{ marginLeft: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', opacity: 0.65 }}
                    title="Speak again"
                  >🔊</button>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="message-bubble bot thinking">
                <span className="dot" /><span className="dot" /><span className="dot" />
                <span className="thinking-text">{t('ai.thinking')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder={isListening ? '🎙️ Listening...' : t('ai.placeholder')}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              style={{ background: isListening ? '#FEF3C7' : undefined }}
            />
            <button
              className={`mic-btn ${isListening ? 'pulse-active' : ''}`}
              onClick={toggleListen}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              style={{
                background: isListening ? '#DC2626' : '#15803D',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0 0.7rem',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
              }}
            >
              {isListening ? '🔴' : '🎙️'}
            </button>
            <button className="send-btn" onClick={() => handleSend()}>➤</button>
          </div>

          {/* ── Mic hint ── */}
          <div style={{ textAlign: 'center', padding: '0.3rem 0 0.6rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            🎙️ Tap mic → speak → AI answers aloud automatically
          </div>

        </div>
      )}
    </div>
  );
};

export default AIAssistant;
