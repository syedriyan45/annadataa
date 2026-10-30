import { indianStatesCities } from './indianStatesCities';

const COMMODITIES = [
  { id: "wheat", name: "Wheat (Lokwan)", basePrice: 2200 },
  { id: "rice", name: "Paddy (Common)", basePrice: 2040 },
  { id: "toordal", name: "Tur (Arhar)", basePrice: 7250 },
  { id: "ragi", name: "Ragi", basePrice: 3850 },
  { id: "sorghum", name: "Sorghum", basePrice: 2970 },
  { id: "groundnut", name: "Groundnut", basePrice: 6200 },
  { id: "cotton", name: "Cotton (Long Staple)", basePrice: 7020 },
  { id: "soybean", name: "Soybean (Yellow)", basePrice: 4600 },
  { id: "onion", name: "Onion (Red)", basePrice: 1800 },
  { id: "potato", name: "Potato (Local)", basePrice: 1200 },
  { id: "tomato", name: "Tomato (Desi)", basePrice: 2500 },
  { id: "maize", name: "Maize (Hybrid)", basePrice: 2090 },
  { id: "mustard", name: "Mustard Seed", basePrice: 5050 },
  { id: "jute", name: "Jute (Raw)", basePrice: 5050 }
];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const NEARBY_DISTRICTS_MAP = {
  // Karnataka
  "Kalaburagi": ["Bijapur", "Bidar", "Basavakalyan", "Humnabad"],
  "Bijapur": ["Kalaburagi", "Belagavi", "Bidar", "Basavakalyan"],
  "Bidar": ["Kalaburagi", "Basavakalyan", "Humnabad", "Bijapur"],
  "Basavakalyan": ["Humnabad", "Bidar", "Kalaburagi", "Bijapur"],
  "Humnabad": ["Basavakalyan", "Bidar", "Kalaburagi", "Bijapur"],
  "Bengaluru": ["Mysuru", "Mangaluru", "Belagavi", "Hubballi-Dharwad"],
  "Mysuru": ["Bengaluru", "Mangaluru", "Belagavi", "Hubballi-Dharwad"],
  "Hubballi-Dharwad": ["Belagavi", "Kalaburagi", "Bijapur", "Mysuru"],
  "Mangaluru": ["Mysuru", "Bengaluru", "Belagavi", "Hubballi-Dharwad"],
  "Belagavi": ["Hubballi-Dharwad", "Bijapur", "Kalaburagi", "Mysuru"],
  
  // Maharashtra
  "Akola": ["Amravati", "Nagpur", "Nashik", "Aurangabad"],
  "Mumbai": ["Pune", "Nashik", "Aurangabad", "Solapur"],
  "Pune": ["Mumbai", "Nashik", "Solapur", "Aurangabad"],
  "Nagpur": ["Amravati", "Akola", "Solapur", "Nashik"],
  "Nashik": ["Pune", "Mumbai", "Aurangabad", "Akola"],
  "Aurangabad": ["Nashik", "Pune", "Solapur", "Akola"],
  "Solapur": ["Pune", "Mumbai", "Aurangabad", "Amravati"],
  "Amravati": ["Akola", "Nagpur", "Solapur", "Nashik"]
};

export const fetchSimulatedMarketData = async (state, city) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const cityHash = hashString(city);
  
  // Find nearby cities (use custom map if available, else fallback to state)
  let candidates = NEARBY_DISTRICTS_MAP[city];
  if (!candidates || candidates.length === 0) {
    const stateCities = indianStatesCities[state] || [];
    candidates = stateCities.filter(c => c !== city);
  }
  
  // Pick 2 pseudo-randomly
  const nearbyCity1 = candidates.length > 0 ? candidates[cityHash % candidates.length] : "Nearby Mandi A";
  const nearbyCity2 = candidates.length > 1 ? candidates[(cityHash + 1) % candidates.length] : "Nearby Mandi B";

  const data = COMMODITIES.map((commodity, index) => {
    const itemHash = hashString(city + commodity.id);
    
    // Generate realistic fluctuating price for current city
    const localVar = (itemHash % 401) - 200; // -200 to +200
    const localPrice = commodity.basePrice + localVar;
    
    // Generate comparison prices for nearby cities
    const nearby1Var = ((itemHash + 1) % 301) - 150;
    const nearbyPrice1 = commodity.basePrice + nearby1Var;
    
    const nearby2Var = ((itemHash + 2) % 301) - 150;
    const nearbyPrice2 = commodity.basePrice + nearby2Var;
    
    // Calculate average of nearby cities
    const avgNearby = Math.round((nearbyPrice1 + nearbyPrice2) / 2);
    
    // Determine trend (comparing local vs base, or just pseudo-random)
    const isUp = (itemHash % 2) === 0;
    
    return {
      id: commodity.id,
      name: commodity.name,
      localPrice: localPrice,
      nearbyAvg: avgNearby,
      nearbyCity1Name: nearbyCity1,
      nearbyCity1Price: nearbyPrice1,
      nearbyCity2Name: nearbyCity2,
      nearbyCity2Price: nearbyPrice2,
      trend: isUp ? 'up' : 'down',
      difference: localPrice - avgNearby
    };
  });

  return data;
};
