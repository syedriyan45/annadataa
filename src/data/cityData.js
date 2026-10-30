import { cityMainCrops } from './cityMainCrops';

const stateBaseData = {
  "Maharashtra": { cropKey: "soybean", diseaseKey: "yvm", baseTemp: 32 },
  "Punjab": { cropKey: "wheat", diseaseKey: "yellowRust", baseTemp: 28 },
  "Karnataka": { cropKey: "ragi", diseaseKey: "leafBlight", baseTemp: 25 },
  "West Bengal": { cropKey: "jute", diseaseKey: "stemRot", baseTemp: 30 },
  "Gujarat": { cropKey: "cotton", diseaseKey: "pinkBollworm", baseTemp: 35 },
  "Uttar Pradesh": { cropKey: "wheat", diseaseKey: "yvm", baseTemp: 30 },
  "Tamil Nadu": { cropKey: "tomato", diseaseKey: "leafBlight", baseTemp: 29 },
  "Andhra Pradesh": { cropKey: "tomato", diseaseKey: "leafBlight", baseTemp: 31 },
  "Telangana": { cropKey: "cotton", diseaseKey: "pinkBollworm", baseTemp: 33 },
  "Rajasthan": { cropKey: "sorghum", diseaseKey: "yvm", baseTemp: 36 },
  "Madhya Pradesh": { cropKey: "soybean", diseaseKey: "yvm", baseTemp: 31 },
  "Bihar": { cropKey: "wheat", diseaseKey: "stemRot", baseTemp: 29 },
  "Haryana": { cropKey: "wheat", diseaseKey: "yellowRust", baseTemp: 27 },
  "Kerala": { cropKey: "tomato", diseaseKey: "leafBlight", baseTemp: 28 },
  "Assam": { cropKey: "jute", diseaseKey: "stemRot", baseTemp: 26 },
  "Odisha": { cropKey: "jute", diseaseKey: "stemRot", baseTemp: 30 },
  "Chhattisgarh": { cropKey: "soybean", diseaseKey: "yvm", baseTemp: 32 }
};

const defaultBase = { cropKey: "soybean", diseaseKey: "yvm", baseTemp: 30 };

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getCropKeyFromName = (name) => {
  if (!name) return "soybean";
  const lower = name.toLowerCase();
  if (lower.includes("tur") || lower.includes("toor") || lower.includes("arhar") || lower.includes("pigeon")) return "toordal";
  if (lower.includes("wheat")) return "wheat";
  if (lower.includes("rice") || lower.includes("paddy")) return "rice";
  if (lower.includes("ragi")) return "ragi";
  if (lower.includes("sorghum") || lower.includes("jowar")) return "sorghum";
  if (lower.includes("cotton")) return "cotton";
  if (lower.includes("soybean")) return "soybean";
  if (lower.includes("onion")) return "onion";
  if (lower.includes("potato")) return "potato";
  if (lower.includes("tomato")) return "tomato";
  if (lower.includes("maize") || lower.includes("corn")) return "maize";
  if (lower.includes("mustard")) return "mustard";
  if (lower.includes("jute")) return "jute";
  if (lower.includes("groundnut") || lower.includes("peanut")) return "groundnut";
  if (lower.includes("coconut")) return "coconut";
  if (lower.includes("sugarcane")) return "sugarcane";
  if (lower.includes("orange")) return "orange";
  if (lower.includes("grape")) return "grape";
  if (lower.includes("pomegranate")) return "pomegranate";
  if (lower.includes("chilli")) return "chilli";
  if (lower.includes("turmeric")) return "turmeric";
  if (lower.includes("banana")) return "banana";
  if (lower.includes("tapioca")) return "tapioca";
  if (lower.includes("tea")) return "tea";
  if (lower.includes("bajra")) return "bajra";
  if (lower.includes("litchi")) return "litchi";
  if (lower.includes("makhana")) return "makhana";
  if (lower.includes("cashew")) return "cashew";
  return lower.replace(/[^a-z0-9]/g, "");
};

const CROP_TO_DISEASE = {
  wheat: "yellowRust",
  rice: "stemRot",
  toordal: "leafBlight",
  ragi: "leafBlight",
  sorghum: "yvm",
  groundnut: "stemRot",
  cotton: "pinkBollworm",
  soybean: "yvm",
  onion: "purpleBlotch",
  potato: "leafBlight",
  tomato: "leafBlight",
  maize: "leafBlight",
  mustard: "yellowRust",
  jute: "stemRot",
  coconut: "stemRot",
  sugarcane: "stemRot",
  orange: "leafBlight",
  grape: "leafBlight",
  pomegranate: "leafBlight",
  chilli: "leafBlight",
  turmeric: "leafBlight",
  banana: "leafBlight",
  tapioca: "stemRot",
  tea: "leafBlight",
  bajra: "yvm",
  litchi: "leafBlight",
  makhana: "stemRot",
  cashew: "leafBlight"
};

export const getCityData = (state, city) => {
  const base = stateBaseData[state] || defaultBase;
  const hash = hashString(city || "Default");
  
  // Deterministic variations
  const tempVar = (hash % 11) - 5; // -5 to +5
  const humidity = 30 + (hash % 51); // 30% to 80%
  const priceVar = (hash % 1001) - 500; // -500 to +500
  const schemes = 1 + (hash % 6); // 1 to 6
  const riskLevels = ["low", "medium", "high"];
  const riskLevel = riskLevels[hash % 3];
  
  const basePrice = 4500; // Average base price
  
  // Resolve city-specific crop recommendation
  const cityCrops = cityMainCrops[city];
  let cropKey = base.cropKey;
  if (cityCrops && cityCrops.length > 0) {
    cropKey = getCropKeyFromName(cityCrops[0]);
  }
  
  let diseaseKey = base.diseaseKey;
  if (CROP_TO_DISEASE[cropKey]) {
    diseaseKey = CROP_TO_DISEASE[cropKey];
  }

  return {
    weather: {
      temp: `${base.baseTemp + tempVar}°C`,
      humidity: `${humidity}%`,
      bestCropKey: cropKey
    },
    market: {
      cropKey: cropKey,
      price: `₹${basePrice + priceVar}`,
      trend: (hash % 2 === 0) ? "up" : "down",
      trendValue: `${(hash % 5) + 1}%`
    },
    advisory: {
      riskLevel: riskLevel,
      diseaseKey: diseaseKey
    },
    schemes: schemes
  };
};

// For backward compatibility or default state
export const cityData = {
  "Akola": getCityData("Maharashtra", "Akola")
};
