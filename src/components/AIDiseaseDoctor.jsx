import React, { useRef, useState, useEffect } from 'react';
import './AIDiseaseDoctor.css';
import { useLanguage } from '../context/LanguageContext';
import { translateDBText } from '../utils/translator';
import { getLocationCropPriority } from '../data/cityMainCrops';

const languageMap = {
  'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'mr-IN', 'bn': 'bn-IN',
  'gu': 'gu-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'kn': 'kn-IN'
};

const COMMON_CROPS = [
  "Rice (Paddy)", "Wheat", "Cotton", "Tomato", "Maize", 
  "Soybean", "Sugarcane", "Potato", "Chilli", "Onion", "General / Other"
];

const AIDiseaseDoctor = ({ currentCrop, state, city }) => {
  const { language } = useLanguage();

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedCrop, setSelectedCrop] = useState(() => {
    const matched = COMMON_CROPS.find(k => 
      k.toLowerCase().includes(String(currentCrop || '').toLowerCase())
    );
    return matched || "Rice (Paddy)";
  });

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Start live camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      setCapturedImage(null);
      setAnalysisResponse(null);
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { ideal: 'environment' } } 
        });
      } catch (e) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Camera access denied or unavailable. Please upload a photo from your gallery.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.warn("Play error:", e));
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  // Handle uploaded photo from file input
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAnalysisResponse({
        status: 'invalid_image',
        errorTitle: 'Invalid File Format',
        errorMessage: 'Please upload an image file (JPG, PNG, WebP).'
      });
      return;
    }

    stopCamera();
    setAnalysisResponse(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCapturedImage(dataUrl);
      submitImageToBackend(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Capture frame from live video
  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedImage(dataUrl);
    stopCamera();
    submitImageToBackend(dataUrl, 'camera_capture.jpg');
  };

  // Submit to strict backend validation endpoint
  const submitImageToBackend = async (dataUrl, filename) => {
    setIsScanning(true);
    setAnalysisResponse(null);

    try {
      const res = await fetch('/api/ai-doctor/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          filename: filename || 'leaf_scan.jpg',
          cropName: selectedCrop
        })
      });

      const data = await res.json();
      setAnalysisResponse(data);
      setIsScanning(false);

      // Voice read-out of result
      if (data) {
        speakDiagnosis(data);
      }
    } catch (err) {
      console.error("Diagnosis request error:", err);
      setIsScanning(false);
      setAnalysisResponse({
        status: 'invalid_image',
        errorTitle: 'Diagnostic Service Connection Error',
        errorMessage: 'Unable to reach the diagnostic server. Please verify your connection and try again.'
      });
    }
  };

  const speakDiagnosis = (data) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let textToSpeak = '';
    if (data.status === 'invalid_image') {
      textToSpeak = 'Invalid image. Agricultural plant not detected. Please upload a clear photo of an affected plant or leaf.';
    } else if (data.status === 'unclear_image') {
      textToSpeak = 'Image quality insufficient. The plant photo is too blurry or dark. Please provide a clear, focused photo.';
    } else if (data.status === 'healthy') {
      textToSpeak = `Plant appears healthy. No obvious disease or pest symptoms were detected on this ${data.cropName || 'crop'}.`;
    } else if (data.status === 'inconclusive') {
      textToSpeak = 'Unable to determine the disease from this image. Visual evidence is insufficient. Please consult an agronomist at your local Krishi Vigyan Kendra.';
    } else if (data.status === 'diseased') {
      textToSpeak = `Diagnosis: ${data.diseaseName || data.diagnosisTitle}. Confidence level: ${data.confidence}. Recommended cure: ${data.treatment}. Dosage: ${data.dosage}.`;
    }

    if (textToSpeak) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const langCode = languageMap[language] || 'en-IN';
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === langCode) || voices[0];
      if (voice) utterance.voice = voice;
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="ai-doctor-container">
      {/* Header Banner */}
      <div className="doctor-header-card glass-panel">
        <h2>🔬 AI Crop Disease & Symptom Diagnosis</h2>
        <p className="subtitle">
          Two-Stage Agricultural Vision: Strict plant-relevance validation followed by evidence-based pathology assessment.
        </p>

        {/* Crop Selector */}
        <div className="crop-select-container">
          <label className="crop-select-label">Target Crop to Assess:</label>
          <select 
            className="crop-select-dropdown"
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              setAnalysisResponse(null);
            }}
          >
            {COMMON_CROPS.map(crop => (
              <option key={crop} value={crop}>
                {translateDBText(crop, language)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera / Upload Viewport */}
      <div className="camera-viewport glass-panel">
        {stream ? (
          <div className="video-wrapper">
            <video ref={videoRef} autoPlay playsInline muted />
            {isScanning && (
              <div className="scanner-overlay">
                <div className="scan-line"></div>
                <div className="scanning-indicator-label">Validating botanical features & inspecting lesions...</div>
              </div>
            )}
          </div>
        ) : capturedImage ? (
          <div className="captured-image-wrapper">
            <img src={capturedImage} alt="Crop Leaf Scan" className="scanned-leaf-preview" />
            {isScanning && (
              <div className="scanner-overlay">
                <div className="scan-line"></div>
                <div className="scanning-indicator-label">Analyzing visual symptoms & pathogen patterns...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="camera-placeholder">
            <span className="placeholder-icon">🍃</span>
            <div className="action-buttons-row">
              <button className="start-btn camera-action-btn" onClick={startCamera}>
                📷 Open Live Camera
              </button>
              <button 
                className="start-btn upload-action-btn" 
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload Leaf Photo
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
            </div>
            <p className="upload-tip">
              💡 Strict Validation: Only clear photos of crops, leaves, stems, or fruits are analyzed. Random objects, selfies, animals, and blurred photos are rejected.
            </p>
          </div>
        )}
      </div>

      {cameraError && <div className="diagnostic-error-banner">{cameraError}</div>}

      {/* Control Actions */}
      <div className="controls">
        {stream && !isScanning && (
          <div className="btn-group">
            <button className="capture-btn" onClick={captureFrame}>
              📸 Capture and Analyze Leaf
            </button>
            <button className="stop-btn" onClick={stopCamera}>
              ✕ Close Camera
            </button>
          </div>
        )}

        {capturedImage && !stream && !isScanning && (
          <div className="btn-group">
            <button 
              className="retry-btn" 
              onClick={() => {
                setCapturedImage(null);
                setAnalysisResponse(null);
              }}
            >
              🔄 Test Another Photo
            </button>
            <button 
              className="upload-another-btn" 
              onClick={() => fileInputRef.current?.click()}
            >
              📁 Upload New Image
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DIAGNOSIS RESULTS PANEL
          Strictly differentiated by status
      ───────────────────────────────────────────────────────────── */}
      {analysisResponse && (
        <div className={`diagnosis-result glass-panel animate-slide-up result-box-${analysisResponse.status}`}>
          
          {/* CASE A: INVALID IMAGE (Rejection - No disease shown) */}
          {analysisResponse.status === 'invalid_image' && (
            <div className="invalid-image-card">
              <div className="status-badge-row">
                <span className="rejection-pill">⚠️ STAGE 1 REJECTION</span>
              </div>
              <h3 className="rejection-title">
                {analysisResponse.errorTitle || 'Invalid Image — Agricultural Plant Not Detected'}
              </h3>
              <p className="rejection-desc">
                {analysisResponse.errorMessage || 'This image does not appear to contain a suitable crop or plant for disease diagnosis. Please upload a clear photo of the affected plant, leaf, stem, or fruit.'}
              </p>
              <div className="rejection-guidance-box">
                <strong>Why was this photo rejected?</strong>
                <ul>
                  <li>The image did not contain a recognizable crop, leaf, stem, or fruit.</li>
                  <li>Photos of people, selfies, animals, vehicles, buildings, or screenshots cannot be processed.</li>
                  <li>No diagnosis, probability, or treatment is fabricated for non-agricultural images.</li>
                </ul>
              </div>
            </div>
          )}

          {/* CASE B: UNCLEAR / BLURRY IMAGE (Request clearer photo) */}
          {analysisResponse.status === 'unclear_image' && (
            <div className="unclear-image-card">
              <div className="status-badge-row">
                <span className="unclear-pill">🔍 STAGE 1 QUALITY CHECK</span>
              </div>
              <h3 className="unclear-title">
                {analysisResponse.errorTitle || 'Image Quality Insufficient — Cannot Assess Symptoms'}
              </h3>
              <p className="unclear-desc">
                {analysisResponse.errorMessage || 'The plant in this image is too blurry, dark, or indistinct to reliably diagnose symptoms. Please provide a well-focused photo in good lighting.'}
              </p>
              <div className="clarity-tips-box">
                <strong>How to take an assessable crop leaf photo:</strong>
                <ul>
                  <li>Hold the camera steady 15–20 cm away from the affected leaf.</li>
                  <li>Ensure bright, indirect sunlight without deep shadows or motion blur.</li>
                  <li>Focus directly on the spots, lesions, or insect damage.</li>
                </ul>
              </div>
            </div>
          )}

          {/* CASE C: HEALTHY CROP (No disease invented) */}
          {analysisResponse.status === 'healthy' && (
            <div className="healthy-crop-card">
              <div className="status-badge-row">
                <span className="healthy-pill">✅ HEALTHY FOLIAGE</span>
                <span className="confidence-pill">Confidence: {analysisResponse.confidence}</span>
                <span className="source-pill">{analysisResponse.source}</span>
              </div>
              <h3 className="healthy-title">{analysisResponse.diagnosisTitle}</h3>
              <p className="healthy-desc">{analysisResponse.description}</p>
              
              <div className="healthy-advisory-box">
                <strong>🌿 Maintenance Advisory:</strong>
                <p>{analysisResponse.treatment}</p>
              </div>

              <div className="preliminary-note">
                ℹ️ {analysisResponse.disclaimer}
              </div>
            </div>
          )}

          {/* CASE D: INCONCLUSIVE (Low confidence / insufficient evidence) */}
          {analysisResponse.status === 'inconclusive' && (
            <div className="inconclusive-crop-card">
              <div className="status-badge-row">
                <span className="inconclusive-pill">❓ INCONCLUSIVE EVIDENCE</span>
                <span className="confidence-pill">{analysisResponse.confidence}</span>
              </div>
              <h3 className="inconclusive-title">{analysisResponse.diagnosisTitle}</h3>
              <p className="inconclusive-desc">{analysisResponse.description}</p>
              
              <div className="kvk-referral-box">
                <strong>🏢 Recommended Next Step:</strong>
                <p>{analysisResponse.treatment}</p>
              </div>

              <div className="preliminary-note">
                ⚠️ {analysisResponse.disclaimer}
              </div>
            </div>
          )}

          {/* CASE E: DISEASE DETECTED WITH CALIBRATED EVIDENCE */}
          {analysisResponse.status === 'diseased' && (
            <div className="diseased-crop-card">
              <div className="status-badge-row">
                <span className="disease-pill">🚨 {analysisResponse.cropName}: {analysisResponse.diseaseName}</span>
                <span className="confidence-pill">Confidence: {analysisResponse.confidence}</span>
                <span className={`severity-tag severity-${(analysisResponse.severity || 'medium').toLowerCase()}`}>
                  Severity: {analysisResponse.severity}
                </span>
                <span className="source-pill">{analysisResponse.source}</span>
              </div>

              <h3 className="disease-title">{analysisResponse.diagnosisTitle}</h3>

              {analysisResponse.visibleSymptoms && (
                <div className="symptoms-evidence-box">
                  <strong>🔍 Observed Visual Evidence:</strong>
                  <p>{analysisResponse.visibleSymptoms}</p>
                </div>
              )}

              <div className="treatment-grid">
                <div className="treatment-item">
                  <span className="treatment-lbl">💊 Recommended Treatment</span>
                  <p className="treatment-val">{analysisResponse.treatment}</p>
                </div>
                <div className="treatment-item">
                  <span className="treatment-lbl">📏 Application Dosage</span>
                  <p className="treatment-val">{analysisResponse.dosage}</p>
                </div>
              </div>

              <div className="expert-disclaimer-box">
                ⚠️ <strong>Agricultural Expert Advisory:</strong> {analysisResponse.disclaimer}
              </div>
            </div>
          )}

          {/* Voice button */}
          <button 
            className="speak-card-btn" 
            onClick={() => speakDiagnosis(analysisResponse)}
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.2rem' }}
          >
            🔊 Listen to Diagnosis
          </button>
        </div>
      )}
    </div>
  );
};

export default AIDiseaseDoctor;
