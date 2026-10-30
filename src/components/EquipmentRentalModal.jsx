import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import './EquipmentRentalModal.css';

const EQUIPMENT_OPTIONS = [
  'Tractor', 'Harvester', 'Rotavator', 'Cultivator', 'Seed Drill', 'Thresher',
  'Power Sprayer', 'Drone Sprayer', 'Water Pump', 'Laser Leveller', 'Baler', 'Other Machinery'
];
const FILTER_TYPES = ['All', ...EQUIPMENT_OPTIONS];
const INITIAL_FORM = {
  ownerName: '', phone: '', equipmentType: '', customName: '', brand: '', model: '',
  horsepower: '', engineCapacity: '', condition: 'Good', price: '', billingUnit: 'per day',
  state: '', district: '', taluk: '', hobli: '', village: '', photoUrl: '', rentalTerms: '',
  showPhoneToPublic: false
};
const API = '/api/rentals';
const iconFor = (type = '') => ({ Tractor: '🚜', Harvester: '🌾', Rotavator: '🔧', Cultivator: '🌱', 'Power Sprayer': '💧', 'Drone Sprayer': '🚁', 'Water Pump': '🚿' }[type] || '🛠️');
const locationFor = item => [item.village, item.hobli, item.taluk, item.district, item.city, item.state].filter(Boolean).join(', ') || item.pickupLocation || 'Location not provided';
const specsFor = item => [item.brand, item.model, item.horsepower, item.engineCapacity, item.condition].filter(Boolean);
const formatPrice = item => `₹${Number(item.rentalPrice).toLocaleString('en-IN')} ${item.billingUnit || 'per day'}`;

const EquipmentRentalModal = ({ isOpen, onClose }) => {
  const { token, user, selectedState, selectedCity } = useUser();
  const [activeTab, setActiveTab] = useState('browse');
  const [filterType, setFilterType] = useState('All');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [form, setForm] = useState(() => ({ ...INITIAL_FORM, state: selectedState || '', district: selectedCity || '', ownerName: user?.name || '', phone: user?.phone || '' }));
  const idempotencyKeyRef = useRef(window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const authHeaders = useMemo(() => token ? { Authorization: `Bearer ${token}` } : {}, [token]);
  const showToast = message => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  const loadListings = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await fetch(API);
      const result = await response.json();
      if (!response.ok || !result.success || !Array.isArray(result.data)) throw new Error(result.error || 'Could not load equipment listings.');
      // Backend is the source of truth; no demo or localStorage fallback.
      setEquipmentList(result.data.filter(item => item.status === 'approved' && item.available === true && !item.isDeleted));
    } catch (error) {
      setEquipmentList([]);
      setLoadError(error.message || 'Unable to connect to equipment rentals. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyListings = useCallback(async () => {
    if (!token) { setMyListings([]); return; }
    try {
      const response = await fetch(`${API}/my`, { headers: authHeaders });
      const result = await response.json();
      if (response.ok && result.success) setMyListings(Array.isArray(result.data) ? result.data : []);
    } catch { /* Browse and submit remain usable if this optional panel fails. */ }
  }, [token, authHeaders]);

  useEffect(() => {
    if (!isOpen) return;
    loadListings();
    loadMyListings();
  }, [isOpen, loadListings, loadMyListings]);

  useEffect(() => {
    if (isOpen && activeTab === 'browse') loadListings();
  }, [filterType, filterAvailable, isOpen, activeTab, loadListings]);

  useEffect(() => {
    setForm(current => ({ ...current, ownerName: current.ownerName || user?.name || '', phone: current.phone || user?.phone || '', state: current.state || selectedState || '', district: current.district || selectedCity || '' }));
  }, [user, selectedState, selectedCity]);

  const filtered = useMemo(() => equipmentList.filter(item => {
    const type = item.equipmentType || item.type;
    const name = item.name || '';
    const location = locationFor(item);
    const matchType = filterType === 'All' || type === filterType;
    const matchAvailability = !filterAvailable || item.available === true;
    const matchSearch = `${name} ${location} ${item.brand || ''} ${item.model || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchAvailability && matchSearch;
  }), [equipmentList, filterType, filterAvailable, searchQuery]);

  const handleFormChange = event => {
    const { name, value, type, checked } = event.target;
    setForm(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    setFormError('');
    if (!/^\+?91?[6-9]\d{9}$/.test(form.phone.replace(/[\s()-]/g, '')) && !/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setFormError('Enter a valid Indian mobile number (10 digits starting with 6–9).'); return;
    }
    if (!form.ownerName.trim() || !form.customName.trim() || !form.equipmentType || !form.price || Number(form.price) <= 0 || !form.billingUnit || !form.village.trim()) {
      setFormError('Please complete all required fields and enter a valid rental price.'); return;
    }
    if (['Tractor', 'Harvester', 'Power Sprayer', 'Water Pump'].includes(form.equipmentType) && !form.horsepower.trim() && !form.engineCapacity.trim()) {
      setFormError('For this engine-powered equipment, provide horsepower or engine capacity.'); return;
    }
    setSubmitting(true);
    try {
      const idempotencyKey = idempotencyKeyRef.current;
      const payload = {
        ownerName: form.ownerName.trim(), contactPhone: form.phone.trim(), equipmentType: form.equipmentType,
        name: form.customName.trim(), brand: form.brand.trim(), model: form.model.trim(),
        horsepower: form.horsepower.trim(), engineCapacity: form.engineCapacity.trim(), condition: form.condition,
        rentalPrice: Number(form.price), billingUnit: form.billingUnit, state: form.state.trim(),
        district: form.district.trim(), taluk: form.taluk.trim(), hobli: form.hobli.trim(), village: form.village.trim(),
        pickupLocation: [form.village, form.hobli, form.taluk, form.district, form.state].filter(Boolean).join(', '),
        photoUrl: form.photoUrl.trim(), rentalTerms: form.rentalTerms.trim(), showPhoneToPublic: form.showPhoneToPublic
      };
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey, ...authHeaders },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not submit your listing. Please try again.');
      idempotencyKeyRef.current = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setFormSuccess(true);
      showToast('Listing submitted. It will appear after verification and approval.');
      setForm({ ...INITIAL_FORM, state: selectedState || '', district: selectedCity || '', ownerName: user?.name || '', phone: user?.phone || '' });
      await loadMyListings();
    } catch (error) {
      setFormError(error.message || 'Network error. Your listing was not confirmed; please retry.');
    } finally { setSubmitting(false); }
  };

  const updateAvailability = async (item, available) => {
    if (!token) return;
    try {
      const response = await fetch(`${API}/${encodeURIComponent(item.id)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ available })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not update listing.');
      await Promise.all([loadMyListings(), loadListings()]);
      showToast('Listing availability updated.');
    } catch (error) { showToast(error.message); }
  };

  const deleteListing = async item => {
    if (!token || !window.confirm('Remove this equipment listing?')) return;
    try {
      const response = await fetch(`${API}/${encodeURIComponent(item.id)}`, { method: 'DELETE', headers: authHeaders });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not remove listing.');
      await Promise.all([loadMyListings(), loadListings()]);
      showToast('Listing removed.');
    } catch (error) { showToast(error.message); }
  };

  if (!isOpen) return null;
  const engineFieldsRelevant = ['Tractor', 'Harvester', 'Power Sprayer', 'Water Pump', 'Drone Sprayer'].includes(form.equipmentType);

  return (
    <>
      <div className="rental-overlay" onClick={onClose}>
        <div className="rental-modal" onClick={event => event.stopPropagation()}>
          <div className="rental-header">
            <div className="rental-header-left"><h2>🚜 Farm Equipment Rental</h2><p>Browse verified equipment · List your own equipment</p></div>
            <button className="rental-close-btn" onClick={onClose}>✕ Close</button>
          </div>
          <div className="rental-stats-bar">
            <div className="rental-stat"><span>🚜</span><span>Approved listings:</span><span className="stat-count">{equipmentList.length}</span></div>
            <div className="rental-stat"><span>✅</span><span>Available now:</span><span className="stat-count">{equipmentList.filter(item => item.available).length}</span></div>
            <div className="rental-stat"><span>🛡️</span><span>Owner-submitted listings only</span></div>
          </div>
          <div className="rental-tabs">
            <button className={`rental-tab-btn ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>🔍 Browse Rentals</button>
            <button className={`rental-tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => { setActiveTab('list'); setFormSuccess(false); }}>📋 List My Equipment</button>
            {token && <button className={`rental-tab-btn ${activeTab === 'mine' ? 'active' : ''}`} onClick={() => { setActiveTab('mine'); loadMyListings(); }}>📦 My Listings</button>}
          </div>
          <div className="rental-body">
            {activeTab === 'browse' && <>
              <div className="rental-filters">
                <input type="text" className="rental-search-input" placeholder="🔍 Search equipment or location..." value={searchQuery} onChange={event => setSearchQuery(event.target.value)} />
                <button className={`filter-chip ${filterAvailable ? 'active' : ''}`} onClick={() => setFilterAvailable(previous => !previous)}>✅ Available Only</button>
              </div>
              <div className="rental-filters" style={{ marginBottom: '1.2rem' }}>
                {FILTER_TYPES.map(type => <button key={type} className={`filter-chip ${filterType === type ? 'active' : ''}`} onClick={() => setFilterType(type)}>{type}</button>)}
              </div>
              {loading ? <div className="rental-empty-state">Loading approved equipment…</div> : loadError ? <div className="rental-empty-state rental-error-state"><p>{loadError}</p><button className="form-submit-btn" onClick={loadListings}>Retry</button></div> : filtered.length === 0 ? (
                <div className="rental-empty-state"><h3>No Equipment Available for Rent</h3><p>Equipment listings will appear here when owners list their equipment.</p><button className="form-submit-btn" onClick={() => setActiveTab('list')}>List Your Equipment</button></div>
              ) : <div className="equipment-grid">{filtered.map(item => <div key={item.id} className="equipment-card">
                <div className="eq-card-top"><div className="eq-icon-name"><span className="eq-icon">{iconFor(item.equipmentType)}</span><div><div className="eq-name">{item.name}</div><div className="eq-type-badge">{item.equipmentType}</div></div></div><div className="eq-price-badge">{formatPrice(item)}</div></div>
                {item.photoUrl && <img className="rental-equipment-photo" src={item.photoUrl} alt={item.name} loading="lazy" />}
                <div className="eq-owner-info"><div className="eq-owner-name">👤 {item.ownerName || 'Equipment owner'}</div><div className="eq-location">📍 {locationFor(item)}</div></div>
                <div className="eq-specs">{specsFor(item).map((spec, index) => <span key={`${item.id}-${index}`} className="eq-spec-chip">{spec}</span>)}</div>
                {item.rentalTerms && <p className="rental-terms">{item.rentalTerms}</p>}
                <div className="eq-card-footer"><span className="availability-chip available">● Available</span><span className="eq-type-badge">Approved listing</span></div>
                {item.showPhoneToPublic && item.ownerPhone && <p className="rental-public-contact">Owner contact: {item.ownerPhone}</p>}
              </div>)}</div>}
            </>}

            {activeTab === 'list' && <div className="list-form-container">
              {formSuccess ? <div className="form-success"><div className="success-icon">✓</div><h3>Submission Received</h3><p>Your equipment is saved and pending verification/approval. It will not appear in Browse Rentals until approved.</p><button className="form-submit-btn" onClick={() => { setFormSuccess(false); setActiveTab('browse'); loadListings(); }}>Back to Browse Rentals</button></div> : <>
                <div className="list-form-title">List Your Equipment for Rent</div>
                <div className="list-form-subtitle">You can submit as a guest or while signed in. Listings remain private until approved.</div>
                {!token && <p className="rental-notice">Guest submission is enabled. Your listing will remain pending until your details are verified and the listing is approved.</p>}
                <form onSubmit={handleFormSubmit}>
                  <div className="form-grid">
                    <div className="form-group"><label htmlFor="ownerName">Owner full name *</label><input id="ownerName" name="ownerName" value={form.ownerName} onChange={handleFormChange} minLength="2" maxLength="100" required /></div>
                    <div className="form-group"><label htmlFor="phone">Mobile number *</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="10-digit Indian mobile" value={form.phone} onChange={handleFormChange} maxLength="16" required /></div>
                    <div className="form-group"><label htmlFor="equipmentType">Equipment type *</label><select id="equipmentType" name="equipmentType" value={form.equipmentType} onChange={handleFormChange} required><option value="">-- Select type --</option>{EQUIPMENT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}</select></div>
                    <div className="form-group"><label htmlFor="customName">Equipment name *</label><input id="customName" name="customName" value={form.customName} onChange={handleFormChange} placeholder="e.g. Tractor 575 DI" minLength="3" maxLength="120" required /></div>
                    <div className="form-group"><label htmlFor="brand">Brand</label><input id="brand" name="brand" value={form.brand} onChange={handleFormChange} maxLength="80" /></div>
                    <div className="form-group"><label htmlFor="model">Model</label><input id="model" name="model" value={form.model} onChange={handleFormChange} maxLength="80" /></div>
                    {engineFieldsRelevant && <><div className="form-group"><label htmlFor="horsepower">Horsepower (HP)</label><input id="horsepower" name="horsepower" value={form.horsepower} onChange={handleFormChange} maxLength="30" placeholder="e.g. 45 HP" /></div><div className="form-group"><label htmlFor="engineCapacity">Engine capacity</label><input id="engineCapacity" name="engineCapacity" value={form.engineCapacity} onChange={handleFormChange} maxLength="30" placeholder="e.g. 2500 cc" /></div></>}
                    <div className="form-group"><label htmlFor="condition">Equipment condition *</label><select id="condition" name="condition" value={form.condition} onChange={handleFormChange} required><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs maintenance</option></select></div>
                    <div className="form-group"><label htmlFor="price">Rental price (₹) *</label><input id="price" name="price" type="number" min="1" max="10000000" value={form.price} onChange={handleFormChange} required /></div>
                    <div className="form-group"><label htmlFor="billingUnit">Rental unit *</label><select id="billingUnit" name="billingUnit" value={form.billingUnit} onChange={handleFormChange} required><option value="per hour">Per hour</option><option value="per day">Per day</option><option value="per acre">Per acre</option><option value="per week">Per week</option></select></div>
                    <div className="form-group"><label htmlFor="state">State</label><input id="state" name="state" value={form.state} onChange={handleFormChange} maxLength="80" /></div>
                    <div className="form-group"><label htmlFor="district">District *</label><input id="district" name="district" value={form.district} onChange={handleFormChange} maxLength="100" required /></div>
                    <div className="form-group"><label htmlFor="taluk">Taluk</label><input id="taluk" name="taluk" value={form.taluk} onChange={handleFormChange} maxLength="100" /></div>
                    <div className="form-group"><label htmlFor="hobli">Hobli</label><input id="hobli" name="hobli" value={form.hobli} onChange={handleFormChange} maxLength="100" /></div>
                    <div className="form-group"><label htmlFor="village">Village / pickup location *</label><input id="village" name="village" value={form.village} onChange={handleFormChange} maxLength="120" required /></div>
                    <div className="form-group"><label htmlFor="photoUrl">Equipment photo URL (optional)</label><input id="photoUrl" name="photoUrl" type="url" value={form.photoUrl} onChange={handleFormChange} placeholder="https://…" maxLength="1000" /></div>
                    <div className="form-group full-width"><label htmlFor="rentalTerms">Additional details / rental requirements</label><textarea id="rentalTerms" name="rentalTerms" value={form.rentalTerms} onChange={handleFormChange} maxLength="1500" placeholder="Operator, fuel, delivery, usage terms…" /></div>
                    <div className="form-group full-width"><label className="rental-consent"><input type="checkbox" name="showPhoneToPublic" checked={form.showPhoneToPublic} onChange={handleFormChange} /> I consent to showing my phone number publicly after approval.</label></div>
                  </div>
                  {formError && <div className="rental-form-error" role="alert">{formError}</div>}
                  <button type="submit" className="form-submit-btn" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Equipment for Approval'}</button>
                </form>
              </>}
            </div>}

            {activeTab === 'mine' && <div className="list-form-container"><div className="list-form-title">My Equipment Listings</div>{myListings.length === 0 ? <div className="rental-empty-state"><p>You have no listings associated with this signed-in account.</p><button className="form-submit-btn" onClick={() => setActiveTab('list')}>List Your Equipment</button></div> : <div className="equipment-grid">{myListings.map(item => <div key={item.id} className="equipment-card"><div className="eq-name">{item.name}</div><p>{locationFor(item)}</p><p>Status: <strong>{item.status}</strong></p><p>{formatPrice(item)}</p><div className="eq-card-footer"><button className="filter-chip" onClick={() => updateAvailability(item, !item.available)}>{item.available ? 'Mark unavailable' : 'Mark available'}</button><button className="filter-chip" onClick={() => deleteListing(item)}>Remove listing</button></div></div>)}</div>}</div>}
          </div>
        </div>
      </div>
      {toast && <div className="rental-toast" role="status">{toast}</div>}
    </>
  );
};

export default EquipmentRentalModal;
