import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WakeWordListener.css';

const languageMap = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'mr': 'mr-IN',
  'bn': 'bn-IN',
  'gu': 'gu-IN',
  'ta': 'ta-IN',
  'te': 'te-IN',
  'kn': 'kn-IN'
};

const WakeWordListener = () => {
  const { t, language } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
    let recognition = null;

    if (isEnabled) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("Speech Recognition API not supported.");
        setIsEnabled(false);
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = languageMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcript = (finalTranscript || interimTranscript).toLowerCase();
        
        // Trigger words (handling various phonetic spellings and prefixes)
        const triggers = [
          'annadaata', 'annadata', 'anna data', 
          'hey annadaata', 'hey annadata', 'hey anna data', 
          'annadaata hi', 'annadata hi', 
          'namaste annadaata', 'namaste annadata'
        ];
        
        if (triggers.some(trigger => transcript.includes(trigger))) {
          console.log("Wake word detected:", transcript);
          
          // Dispatch global event to wake the AI Assistant
          const customEvent = new CustomEvent('wakeWordDetected', { 
            detail: { query: transcript.replace(/hey annadaata|hey annadata|hey anna data|annadaata|annadata/i, '').trim() } 
          });
          window.dispatchEvent(customEvent);
          
          // Stop recognition momentarily to prevent loops
          recognition.stop();
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setIsEnabled(false);
        }
      };

      recognition.onend = () => {
        // Automatically restart if still enabled
        if (isEnabled) {
          try {
            recognition.start();
          } catch (e) {
            console.error("Failed to restart recognition", e);
          }
        } else {
          setIsListening(false);
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }

    return () => {
      if (recognition) {
        recognition.onend = null; // Prevent restart loop on unmount
        recognition.stop();
      }
    };
  }, [isEnabled, language]);

  return (
    <button 
      className={`wake-word-btn ${isEnabled ? 'active' : ''}`}
      onClick={() => setIsEnabled(!isEnabled)}
      title={isEnabled ? t('ai.micTooltipActive') : t('ai.micTooltip')}
    >
      <span className="icon">🎙️</span>
      {isEnabled ? <span className="status-dot pulsing"></span> : null}
    </button>
  );
};

export default WakeWordListener;
