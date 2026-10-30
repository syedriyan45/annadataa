export const cropData = [
  // Kharif Crops
  { id: 1, name: "Rice (Paddy)", season: "Kharif", zone: ["South", "East", "Central"], pests: ["Stem Borer", "Blast"], treatment: "Chlorpyrifos", dosage: "2ml/L" },
  { id: 2, name: "Maize", season: "Kharif", zone: ["North", "Central"], pests: ["Fall Armyworm"], treatment: "Emamectin Benzoate", dosage: "0.4g/L" },
  { id: 3, name: "Cotton", season: "Kharif", zone: ["West", "Central", "North"], pests: ["Pink Bollworm", "Whitefly"], treatment: "Profenophos", dosage: "2.5ml/L" },
  { id: 4, name: "Soybean", season: "Kharif", zone: ["Central", "West"], pests: ["Girdle Beetle", "YVM"], treatment: "Thiamethoxam", dosage: "0.5g/L" },
  // Rabi Crops
  { id: 5, name: "Wheat", season: "Rabi", zone: ["North", "Central"], pests: ["Yellow Rust", "Aphids"], treatment: "Propiconazole", dosage: "1ml/L" },
  { id: 6, name: "Mustard", season: "Rabi", zone: ["North", "West"], pests: ["Aphids", "White Rust"], treatment: "Imidacloprid", dosage: "0.3ml/L" },
  { id: 7, name: "Chickpea (Gram)", season: "Rabi", zone: ["Central", "North"], pests: ["Pod Borer"], treatment: "Indoxacarb", dosage: "1ml/L" },
  // Zaid Crops
  { id: 8, name: "Watermelon", season: "Zaid", zone: ["North", "South"], pests: ["Fruit Fly"], treatment: "Malathion", dosage: "2ml/L" },
  { id: 9, name: "Moong (Green Gram)", season: "Zaid", zone: ["Central", "North"], pests: ["Yellow Mosaic Virus"], treatment: "Acetamiprid", dosage: "0.5g/L" }
];

// Helper to expand to a massive list for the demo
const categories = ["Cereals", "Pulses", "Vegetables", "Fruits", "Oilseeds"];
const seasons = ["Kharif", "Rabi", "Zaid"];
const zones = ["North", "South", "East", "West", "Central"];

const generateExtendedData = () => {
  const extended = [...cropData];
  const additionalCrops = [
    "Sorghum", "Bajra", "Ragi", "Tur (Arhar)", "Urad", "Groundnut", "Sunflower", "Sugarcane", 
    "Tomato", "Brinjal", "Chilli", "Okra", "Potato", "Cabbage", "Cauliflower", "Onion", "Garlic",
    "Mango", "Banana", "Citrus", "Guava", "Grape", "Pomegranate", "Coconut", "Coffee", "Tea",
    "Cardamom", "Black Pepper", "Turmeric", "Ginger", "Cumin", "Coriander", "Fennel", "Fenugreek"
  ];

  additionalCrops.forEach((crop, index) => {
    extended.push({
      id: cropData.length + index + 1,
      name: crop,
      season: seasons[index % seasons.length],
      zone: [zones[index % zones.length], zones[(index + 1) % zones.length]],
      pests: ["Leaf Spot", "Aphids", "Root Rot"],
      treatment: "Neem Oil / Mancozeb",
      dosage: "3ml/L"
    });
  });

  return extended;
};

export const allCrops = generateExtendedData();

export const zoneMap = {
  "Maharashtra": "West",
  "Nagpur": "West",
  "Akola": "West",
  "Punjab": "North",
  "Ludhiana": "North",
  "Karnataka": "South",
  "Bengaluru": "South",
  "West Bengal": "East",
  "Kolkata": "East",
  "Uttar Pradesh": "North",
  "Lucknow": "North",
  "Tamil Nadu": "South",
  "Chennai": "South",
  "Gujarat": "West",
  "Ahmedabad": "West",
  "Madhya Pradesh": "Central",
  "Bhopal": "Central",
  "Delhi": "North"
};
