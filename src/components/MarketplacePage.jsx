import React, { useState, useEffect } from 'react';
import './MarketplacePage.css';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { indianStatesCities } from '../data/indianStatesCities';
import { translateDBText } from '../utils/translator';
import { useNavigate } from 'react-router-dom';

const INITIAL_DEMO_LISTINGS = [
  // Akola, Maharashtra
  {
    id: 'akola-1',
    cropName: 'Soybean (JS 335)',
    category: 'Oilseeds',
    quantity: '40',
    unit: 'Quintals',
    price: '4850',
    priceUnit: 'per Quintal',
    quality: 'Grade A Premium',
    moisture: '10.5%',
    description: 'Cleaned and double-sieved seed quality soybean harvest, zero mud balls.',
    sellerName: 'Rameshwar Patil',
    sellerPhone: '+91 98221 45678',
    state: 'Maharashtra',
    city: 'Akola',
    village: 'Borgaon Manju',
    postedDate: '2 days ago'
  },
  {
    id: 'akola-2',
    cropName: 'Cotton (BT White Gold)',
    category: 'Cash Crops',
    quantity: '25',
    unit: 'Quintals',
    price: '7300',
    priceUnit: 'per Quintal',
    quality: 'Long Staple High Micronaire',
    moisture: '8%',
    description: 'First picking cotton, spotless white bolls, dried in sun.',
    sellerName: 'Gajanan Deshmukh',
    sellerPhone: '+91 94230 78912',
    state: 'Maharashtra',
    city: 'Akola',
    village: 'Murtizapur Road',
    postedDate: 'Yesterday'
  },
  {
    id: 'akola-3',
    cropName: 'Tur (Arhar/Red Gram)',
    category: 'Pulses',
    quantity: '15',
    unit: 'Quintals',
    price: '9800',
    priceUnit: 'per Quintal',
    quality: 'Bold Grain Desi',
    moisture: '9.2%',
    description: 'Organically grown Maruti variety red gram directly from farm.',
    sellerName: 'Pandurang Kale',
    sellerPhone: '+91 97654 32109',
    state: 'Maharashtra',
    city: 'Akola',
    village: 'Balapur Taluka',
    postedDate: '3 days ago'
  },

  // Pune, Maharashtra
  {
    id: 'pune-1',
    cropName: 'Onion (Gavran Red)',
    category: 'Vegetables',
    quantity: '120',
    unit: 'Bags (50kg)',
    price: '1850',
    priceUnit: 'per Quintal',
    quality: 'Medium-Large Storage Quality',
    moisture: 'Dry skin',
    description: 'Chakan mandi grade red onions with long storage shelf life.',
    sellerName: 'Dnyaneshwar Shinde',
    sellerPhone: '+91 98812 34567',
    state: 'Maharashtra',
    city: 'Pune',
    village: 'Khed / Chakan',
    postedDate: 'Today'
  },
  {
    id: 'pune-2',
    cropName: 'Pomegranate (Bhagwa)',
    category: 'Fruits',
    quantity: '3',
    unit: 'Tons',
    price: '120',
    priceUnit: 'per Kg',
    quality: 'Export Grade (300g+)',
    moisture: 'Fresh Harvest',
    description: 'Dark red arils, high Brix sweetness, zero blemish.',
    sellerName: 'Sachin Jadhav',
    sellerPhone: '+91 98501 98765',
    state: 'Maharashtra',
    city: 'Pune',
    village: 'Baramati',
    postedDate: '1 day ago'
  },

  // Ludhiana, Punjab
  {
    id: 'ludhiana-1',
    cropName: 'Wheat (Sharbati DBW-187)',
    category: 'Grains',
    quantity: '80',
    unit: 'Quintals',
    price: '2650',
    priceUnit: 'per Quintal',
    quality: 'A+ Golden Grain',
    moisture: '9.8%',
    description: 'High protein content rotis, zero pesticide residue in grain test.',
    sellerName: 'Sardar Harpreet Singh',
    sellerPhone: '+91 98140 12345',
    state: 'Punjab',
    city: 'Ludhiana',
    village: 'Samrala',
    postedDate: 'Just now'
  },
  {
    id: 'ludhiana-2',
    cropName: 'Basmati Rice (1121 Pusa)',
    category: 'Grains',
    quantity: '50',
    unit: 'Quintals',
    price: '4200',
    priceUnit: 'per Quintal',
    quality: 'Extra Long Grain',
    moisture: '11%',
    description: 'Traditional aroma, moisture tested, direct farmer consignment.',
    sellerName: 'Gurdeep Singh Dhillon',
    sellerPhone: '+91 98720 54321',
    state: 'Punjab',
    city: 'Ludhiana',
    village: 'Khanna Mandi Area',
    postedDate: '2 days ago'
  },

  // Lucknow, Uttar Pradesh
  {
    id: 'lucknow-1',
    cropName: 'Dasheri Mango Pulp Quality',
    category: 'Fruits',
    quantity: '200',
    unit: 'Boxes (10kg)',
    price: '65',
    priceUnit: 'per Kg',
    quality: 'Naturally Ripened',
    moisture: 'Juicy',
    description: 'Authentic Malihabad orchard Dasheri mangos, plucked with stem.',
    sellerName: 'Mohammed Ashfaq',
    sellerPhone: '+91 94150 99887',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    village: 'Malihabad',
    postedDate: 'Yesterday'
  }
];

const MarketplacePage = () => {
  const { user, selectedState, setSelectedState, selectedCity, setSelectedCity } = useUser();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-listings'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Listings state loaded from localStorage
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem('annadata_marketplace_listings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Listing load failed:", e);
    }
    return INITIAL_DEMO_LISTINGS;
  });

  // Modal for new listing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCategory, setNewCategory] = useState('Grains');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('Quintals');
  const [newPrice, setNewPrice] = useState('');
  const [newPriceUnit, setNewPriceUnit] = useState('per Quintal');
  const [newQuality, setNewQuality] = useState('Grade A');
  const [newMoisture, setNewMoisture] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Contact revealed phone state
  const [contactRevealed, setContactRevealed] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem('annadata_marketplace_listings', JSON.stringify(listings));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  }, [listings]);

  // STRICT SAME-CITY MATCHING:
  // Listings MUST match selectedState and selectedCity
  const localListings = listings.filter(item => {
    const isSameCity = item.city.toLowerCase() === selectedCity.toLowerCase() &&
                       item.state.toLowerCase() === selectedState.toLowerCase();
    return isSameCity;
  });

  // Filtered by user criteria
  const displayedListings = localListings.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
    return 0; // default newest
  });

  // User's own listings
  const myListings = listings.filter(item => {
    if (!user) return false;
    return item.sellerEmail === user.email || item.sellerName === user.name;
  });

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in or create an account to post produce listings.");
      navigate('/auth');
      return;
    }

    if (!newCropName || !newQuantity || !newPrice || !newPhone) {
      alert("Please fill in all mandatory fields: Crop Name, Quantity, Price, and Contact Phone.");
      return;
    }

    const newListingItem = {
      id: `custom-${Date.now()}`,
      cropName: newCropName.trim(),
      category: newCategory,
      quantity: newQuantity.trim(),
      unit: newUnit,
      price: newPrice.trim(),
      priceUnit: newPriceUnit,
      quality: newQuality,
      moisture: newMoisture ? `${newMoisture}%` : 'Standard',
      description: newDescription.trim() || 'Direct harvested crop from farmer.',
      sellerName: user.name,
      sellerEmail: user.email || '',
      sellerPhone: newPhone.trim(),
      state: selectedState,
      city: selectedCity,
      village: newVillage.trim() || selectedCity,
      postedDate: 'Just now'
    };

    setListings([newListingItem, ...listings]);
    setIsModalOpen(false);

    // Reset form
    setNewCropName('');
    setNewQuantity('');
    setNewPrice('');
    setNewPhone('');
    setNewVillage('');
    setNewDescription('');
    alert(`Success! Your crop listing for ${newCropName} has been published in ${selectedCity} marketplace.`);
  };

  const handleDeleteListing = (id) => {
    if (window.confirm("Are you sure you want to remove this crop listing?")) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  const toggleContact = (id) => {
    setContactRevealed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleStateChange = (e) => {
    const s = e.target.value;
    setSelectedState(s);
    if (indianStatesCities[s] && indianStatesCities[s].length > 0) {
      setSelectedCity(indianStatesCities[s][0]);
    }
  };

  return (
    <div className="marketplace-page">
      {/* Header Banner */}
      <div className="market-header-card glass-panel">
        <div className="market-header-flex">
          <div>
            <h1>🤝 Annadata Local Agricultural Marketplace</h1>
            <p className="subtitle">
              Strict Same-Mandi Zero-Middleman direct trading between local farmers & verified buyers
            </p>
          </div>
          <button className="post-listing-btn" onClick={() => setIsModalOpen(true)}>
            ➕ Sell Your Crop
          </button>
        </div>

        {/* Location selector */}
        <div className="market-location-bar">
          <div className="loc-group">
            <label>State / राज्य:</label>
            <select value={selectedState} onChange={handleStateChange}>
              {Object.keys(indianStatesCities).map(s => (
                <option key={s} value={s}>{translateDBText(s, language)}</option>
              ))}
            </select>
          </div>
          <div className="loc-group">
            <label>District / Mandi City:</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              {indianStatesCities[selectedState]?.map(c => (
                <option key={c} value={c}>{translateDBText(c, language)}</option>
              ))}
            </select>
          </div>

          <div className="strict-city-pill">
            🔒 Strict Same-City Matching: <strong>{selectedCity}, {selectedState}</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="market-tabs-row">
        <div className="tabs-left">
          <button 
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            🌾 Browse {selectedCity} Mandi ({localListings.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my-listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-listings')}
          >
            📋 My Crop Listings ({myListings.length})
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="controls-right">
            <div className="search-wrap">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Search crops or farmer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Latest Posted</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Categories Filter (for browse tab) */}
      {activeTab === 'browse' && (
        <div className="category-chips-bar">
          {['All', 'Grains', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Cash Crops'].map(cat => (
            <button
              key={cat}
              className={`cat-chip ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Listings Grid */}
      {activeTab === 'browse' ? (
        displayedListings.length > 0 ? (
          <div className="listings-grid">
            {displayedListings.map(item => (
              <div key={item.id} className="listing-card glass-panel">
                <div className="listing-card-header">
                  <div>
                    <span className="listing-category">{item.category}</span>
                    <h3 className="listing-crop-name">{item.cropName}</h3>
                  </div>
                  <div className="listing-price-badge">
                    <span className="price-num">₹{item.price}</span>
                    <span className="price-unit">/{item.priceUnit || 'Quintal'}</span>
                  </div>
                </div>

                <div className="listing-specs">
                  <div className="spec-item">
                    <span className="spec-label">Available Quantity</span>
                    <strong className="spec-val">📦 {item.quantity} {item.unit}</strong>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Quality Grade</span>
                    <strong className="spec-val">⭐ {item.quality}</strong>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Moisture Content</span>
                    <strong className="spec-val">💧 {item.moisture || 'Safe dry'}</strong>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Location / Mandi</span>
                    <strong className="spec-val">📍 {item.village}, {item.city}</strong>
                  </div>
                </div>

                {item.description && (
                  <p className="listing-desc">"{item.description}"</p>
                )}

                <div className="listing-footer">
                  <div className="seller-info">
                    <span className="seller-avatar">👨‍🌾</span>
                    <div>
                      <div className="seller-name">{item.sellerName}</div>
                      <div className="posted-time">Listed {item.postedDate}</div>
                    </div>
                  </div>

                  <button 
                    className="contact-seller-btn"
                    onClick={() => toggleContact(item.id)}
                  >
                    {contactRevealed[item.id] ? `📞 ${item.sellerPhone}` : '📞 Contact Farmer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-market-panel glass-panel">
            <span style={{ fontSize: '3.5rem' }}>🚜</span>
            <h3>No Active Listings in {selectedCity} Mandi</h3>
            <p>
              Under our strict local marketplace policy, you only see produce grown in <strong>{selectedCity}, {selectedState}</strong>.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Be the first local farmer to list your harvested crops, or switch to neighboring cities like <strong>Akola, Pune, or Ludhiana</strong> to view sample active mandis.
            </p>
            <button className="post-listing-btn" onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>
              ➕ Create First Listing in {selectedCity}
            </button>
          </div>
        )
      ) : (
        /* My Listings View */
        <div className="my-listings-view">
          {!user ? (
            <div className="empty-market-panel glass-panel">
              <h3>Sign In Required</h3>
              <p>Please sign in to view and manage your crop sales listings.</p>
              <button className="post-listing-btn" onClick={() => navigate('/auth')}>
                Sign In Now
              </button>
            </div>
          ) : myListings.length > 0 ? (
            <div className="listings-grid">
              {myListings.map(item => (
                <div key={item.id} className="listing-card glass-panel my-card">
                  <div className="listing-card-header">
                    <div>
                      <span className="listing-category">{item.category}</span>
                      <h3 className="listing-crop-name">{item.cropName}</h3>
                    </div>
                    <div className="listing-price-badge">
                      <span className="price-num">₹{item.price}</span>
                      <span className="price-unit">/{item.priceUnit || 'Quintal'}</span>
                    </div>
                  </div>

                  <div className="listing-specs">
                    <div className="spec-item">
                      <span className="spec-label">Quantity</span>
                      <strong className="spec-val">{item.quantity} {item.unit}</strong>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Location</span>
                      <strong className="spec-val">{item.city}, {item.state}</strong>
                    </div>
                  </div>

                  <div className="my-card-actions">
                    <button className="delete-listing-btn" onClick={() => handleDeleteListing(item.id)}>
                      🗑️ Remove Listing
                    </button>
                    <span className="active-status-tag">🟢 Active in Mandi</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-market-panel glass-panel">
              <span style={{ fontSize: '3rem' }}>📋</span>
              <h3>You have not listed any crops yet</h3>
              <p>Sell directly to verified millers, wholesale traders, and local buyers with zero commission.</p>
              <button className="post-listing-btn" onClick={() => setIsModalOpen(true)}>
                ➕ List Harvested Crop
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Listing Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-panel glass-panel">
            <div className="modal-header">
              <h2>🌾 Sell Your Crop in {selectedCity} Mandi</h2>
              <button className="close-x-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateListing} className="create-listing-form">
              <div className="form-two-cols">
                <div className="form-field">
                  <label>Crop & Variety Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Wheat (Sharbati), Cotton, Soybean"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Category *</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="Grains">Grains (अनाज)</option>
                    <option value="Pulses">Pulses (दालें)</option>
                    <option value="Oilseeds">Oilseeds (तिलहन)</option>
                    <option value="Vegetables">Vegetables (सब्जियां)</option>
                    <option value="Fruits">Fruits (फल)</option>
                    <option value="Cash Crops">Cash Crops (नकदी फसल)</option>
                  </select>
                </div>
              </div>

              <div className="form-two-cols">
                <div className="form-field">
                  <label>Quantity *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Unit *</label>
                  <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                    <option value="Quintals">Quintals (क्विंटल)</option>
                    <option value="Bags (50kg)">Bags (50kg बोरी)</option>
                    <option value="Tons">Tons (टन)</option>
                    <option value="Kg">Kilograms (किलो)</option>
                  </select>
                </div>
              </div>

              <div className="form-two-cols">
                <div className="form-field">
                  <label>Expected Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 4800"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Price Rate Unit *</label>
                  <select value={newPriceUnit} onChange={(e) => setNewPriceUnit(e.target.value)}>
                    <option value="per Quintal">per Quintal (प्रति क्विंटल)</option>
                    <option value="per Bag">per Bag (प्रति बोरी)</option>
                    <option value="per Ton">per Ton (प्रति टन)</option>
                    <option value="per Kg">per Kg (प्रति किलो)</option>
                  </select>
                </div>
              </div>

              <div className="form-two-cols">
                <div className="form-field">
                  <label>Quality Grade</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Grade A Bold / Sun Dried"
                    value={newQuality}
                    onChange={(e) => setNewQuality(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Moisture % (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 10.5"
                    value={newMoisture}
                    onChange={(e) => setNewMoisture(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-two-cols">
                <div className="form-field">
                  <label>Contact Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Village / Taluka</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Borgaon Manju"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Produce Description / Note for Buyers</label>
                <textarea 
                  rows="3" 
                  placeholder="Specify cleaning status, variety certification, loading assistance..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="form-submit-row">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="post-listing-btn">
                  Publish in {selectedCity} Mandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
