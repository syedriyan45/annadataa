export const centralSchemes = [
  {
    id: 'pmkisan',
    name: 'PM Kisan Samman Nidhi',
    desc: 'Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly into the bank accounts of all landholding farmer families.',
    benefit: '₹6,000 / year direct benefit transfer (DBT)',
    eligibility: 'All landholding farmer families with cultivable land holdings in their names.',
    documents: 'Aadhaar Card, Land Record (Khatauni / 7/12 / RTC), Active Bank Account linked with Aadhaar.',
    portalName: 'PM-KISAN Official Portal',
    applyUrl: 'https://pmkisan.gov.in/'
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    desc: 'Comprehensive crop insurance covering non-preventable natural risks (drought, flood, unseasonal rain, pest outbreaks) from pre-sowing to post-harvest.',
    benefit: 'Max 2% premium for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops; balance subsidized by Govt.',
    eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
    documents: 'Crop Sowing Certificate / Patwari Report, Land Ownership Record (RoR), Bank Account details.',
    portalName: 'PMFBY National Portal',
    applyUrl: 'https://pmfby.gov.in/'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    desc: 'Timely and adequate formal credit support for cultivation expenses, post-harvest costs, and maintenance of farm assets at highly subsidized interest rates.',
    benefit: 'Credit limit up to ₹3 Lakh at 4% effective interest rate (with 3% prompt repayment incentive).',
    eligibility: 'Owner cultivators, tenant farmers, oral lessees, self-help groups (SHGs) of farmers.',
    documents: 'Application Form, Land Records (Khatauni), Identification Proof, Passport size photos.',
    portalName: 'KCC Portal via Dept of Agriculture',
    applyUrl: 'https://agricoop.nic.in/'
  },
  {
    id: 'pmksy',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (Per Drop More Crop)',
    desc: 'Subsidies for drip and sprinkler micro-irrigation systems to maximize water use efficiency and precision fertigation.',
    benefit: 'Up to 55% subsidy for small/marginal farmers, 45% for other farmers on micro-irrigation installations.',
    eligibility: 'Farmers having cultivable land with an assured water source (borewell, open well, or canal).',
    documents: 'Land Record (7/12 or RoR), Water Source Certificate, Quotation from empaneled micro-irrigation vendor.',
    portalName: 'PMKSY National Portal',
    applyUrl: 'https://pmksy.gov.in/'
  },
  {
    id: 'soilhealth',
    name: 'Soil Health Card Scheme',
    desc: 'Issuance of customized soil nutrient report cards every 2 years with crop-specific fertilizer and micronutrient dosage advisories.',
    benefit: 'Free soil testing for 12 critical parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC).',
    eligibility: 'All agricultural landowners and operational farmers across India.',
    documents: 'Soil sample collected by village agriculture assistant, Aadhaar number, Plot survey number.',
    portalName: 'Soil Health Card Portal',
    applyUrl: 'https://soilhealth.dac.gov.in/'
  }
];

const stateSchemesMap = {
  "Maharashtra": [
    {
      name: "Namo Shetkari Maha Sanman Nidhi",
      desc: "Additional financial incentive of ₹6,000 annually paid by the Government of Maharashtra, topping up PM-KISAN to a total of ₹12,000 per year.",
      benefit: '₹6,000 / year state top-up',
      eligibility: 'Active PM-KISAN beneficiaries registered within Maharashtra.',
      documents: 'Aadhaar, PM-KISAN registration ID, Bank account.',
      portalName: 'MahaDBT Farmer Portal',
      applyUrl: 'https://mahadbt.maharashtra.gov.in/'
    },
    {
      name: "Magel Tyala Shettale (Farm Pond Scheme)",
      desc: "Direct capital subsidy for individual farm ponds with plastic lining to harvest rainwater and protect crops during dry spells.",
      benefit: 'Up to ₹50,000 to ₹75,000 financial grant per farm pond.',
      eligibility: 'Farmers holding at least 0.60 hectare of cultivable agricultural land.',
      documents: '7/12 extract, 8A land certificate, Bank passbook.',
      portalName: 'MahaDBT Shettale Portal',
      applyUrl: 'https://mahadbt.maharashtra.gov.in/'
    }
  ],
  "Punjab": [
    {
      name: "Mukhyamantri Diggi Nirman Scheme",
      desc: "Capital grant assistance for the construction of water storage diggis (storage tanks) in canal-irrigated zones of Punjab.",
      benefit: 'Subsidy up to 85% of standard unit cost.',
      eligibility: 'Farmers with land at the tail ends of canal water distribution systems.',
      documents: 'Fard / Jamabandi, Canal irrigation sanction letter.',
      portalName: 'Punjab Agri Dept Portal',
      applyUrl: 'https://agri.punjab.gov.in/'
    },
    {
      name: "Crop Diversification Mission (Maize/Pulses)",
      desc: "Financial incentives to replace water-intensive summer paddy with maize, pulses, and oilseeds.",
      benefit: '₹7,000 per hectare incentive + subsidized seed kits.',
      eligibility: 'Paddy-growing farmers transitioning acreage to non-paddy crops.',
      documents: 'Aadhaar, Land ownership details, Sowing verification.',
      portalName: 'Punjab Agriculture Portal',
      applyUrl: 'https://agri.punjab.gov.in/'
    }
  ],
  "Karnataka": [
    {
      name: "Raitha Vidya Nidhi",
      desc: "Direct annual scholarship transferred to the children of registered farmer families pursuing higher education.",
      benefit: '₹2,500 to ₹11,000 annual scholarship based on course degree.',
      eligibility: 'Children of farmers holding valid FRUITS ID in Karnataka.',
      documents: 'FRUITS ID (Farmer Registration and Unified Beneficiary Information System), Student college ID, Aadhaar.',
      portalName: 'Karnataka FRUITS Portal',
      applyUrl: 'https://fruits.karnataka.gov.in/'
    },
    {
      name: "Krishi Bhagya Scheme",
      desc: "Integrated package of polyhouse / shade nets, polythene lined farm ponds, and diesel pumpsets in rainfed areas.",
      benefit: 'Up to 80% to 90% subsidy for SC/ST, 50% for general farmers.',
      eligibility: 'Dryland farmers in selected rainfed agro-climatic talukas.',
      documents: 'RTC (Pahani), FRUITS Card, Bank account.',
      portalName: 'Karnataka Agriculture Portal',
      applyUrl: 'https://raitamitra.karnataka.gov.in/'
    }
  ],
  "Uttar Pradesh": [
    {
      name: "UP Kisan Karj Rahat / Subsidy Portal",
      desc: "Agricultural input subsidies and farm machinery custom hiring centers booking across UP districts.",
      benefit: 'Direct subsidy for rotavators, tractors, laser levelers, and solar pumps.',
      eligibility: 'Registered farmers on the UP Agriculture Department portal.',
      documents: 'Kisan Panjikaran Sankhya (Registration No.), Khatauni, Aadhaar.',
      portalName: 'UP Agriculture Portal',
      applyUrl: 'http://upagriculture.com/'
    }
  ]
};

const genericStateSchemes = [
  {
    name: "State Agricultural Input Subsidy",
    desc: "Assistance for certified seeds, organic fertilizers, and biological bio-pesticides.",
    benefit: 'Direct subsidy up to 50% on notified agricultural inputs.',
    eligibility: 'Small and marginal farmers of the state.',
    documents: 'State Farmer Registration ID, Aadhaar card, Land record.',
    portalName: 'State Agriculture Portal',
    applyUrl: 'https://agricoop.nic.in/'
  },
  {
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    desc: "Subsidy on purchase of agricultural implements and machinery through Custom Hiring Centers (CHC).",
    benefit: '40% to 50% capital subsidy on tractor-mounted farm equipment.',
    eligibility: 'Individual farmers, cooperatives, and FPOs.',
    documents: 'Land possession certificate, Bank passbook, Aadhaar.',
    portalName: 'SMAM National Portal',
    applyUrl: 'https://agrimachinery.nic.in/'
  }
];

export const fetchSchemesForState = async (state) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return stateSchemesMap[state] || genericStateSchemes;
};

export const fetchBeneficiaryStatus = async (identifier) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const isFound = identifier.length >= 10;
  
  if (!isFound) {
    return { status: "not_found" };
  }

  return {
    status: "active",
    name: "Farmer " + (identifier.slice(-4)),
    aadhaarStatus: "Verified & Biometrically Authenticated",
    ekycStatus: "Completed (Active)",
    bankLinking: "Linked (Direct Benefit Transfer Active)",
    lastInstallment: "16th Installment (₹2,000) Credited Successfully",
    totalInstallments: 16,
    registrationDate: "12-08-2019",
    pfmsStatus: "PFMS Farmer Record Accepted"
  };
};
