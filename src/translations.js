export const translations = {
  en: {
    auth: { promptName: "Enter your name:", defaultName: "Farmer" },
    nav: { dashboard: "Dashboard", market: "Market", weather: "Weather", signIn: "Sign In", signOut: "Sign Out" },
    dashboard: { welcome: "Welcome back", guest: "Welcome, Farmer", subtitle: "Here is your agricultural information for today.", location: "📍 Auto (GPS)" },
    sections: {
      cropAdvisory: { title: "Crop Advisory", desc: "AI-powered crop disease diagnosis and personalized farming guidance." },
      weather: { title: "Weather Info", desc: "Local 7-day forecast and irrigation planning." },
      market: { title: "Market Prices", desc: "Real-time APMC market rates." },
      farmResource: { title: "Farm Equipment Rental", desc: "Rent tractors, sprayers & tools from nearby farmers. Or list your own." },
      marketplace: { title: "Direct Market", desc: "Commission-free trade directly with buyers." },
      govSchemes: { title: "Govt Schemes", desc: "Smart eligibility checker for all central & state schemes." },
      satellite: { title: "Satellite Monitoring", desc: "Monitor farm crop health from space with AI overlays." }
    },
    card: { explore: "Explore", stop: "⏸️ Stop", listen: "🔊 Listen", listenTitle: "Listen to description" },
    ai: {
      title: "Kisan AI",
      status: "Online",
      placeholder: "Type your question...",
      greeting: "Namaste! I am your AI farming assistant powered by Gemini. Ask me about weather, market prices, crop diseases, or government schemes!",
      defaultResponse: "I didn't quite understand. You can ask me about weather, market prices, crop diseases, or government schemes!",
      thinking: "Thinking...",
      weatherResponse: "Currently in {city}, {state} the weather is normal. No rain expected in the next 48 hours — good time for harvesting or pesticide spraying.",
      marketPriceSingle: "Current price of {crop} in {city} market is Rs.{price}/quintal. Trend is {trend}.",
      marketPriceList: "Current prices in {city} market: {crops}. Which specific crop would you like to know about?",
      schemesResponse: "Key schemes for you in {state}: {schemes}. Check the Govt Schemes section for more details!",
      pmKisanResponse: "PM Kisan installments are released every 4 months. Check your status in the Govt Schemes section using your Aadhaar or mobile number.",
      errorMessage: "Having trouble connecting. Please try again in a moment!",
      micTooltip: "Start Voice Input",
      micTooltipActive: "Stop Listening",
      trendUp: "Rising",
      trendDown: "Falling",
      apiKeyPrompt: "Enter your Gemini API Key to enable AI responses:",
      apiKeySave: "Save & Connect",
      apiKeyPlaceholder: "AIza...",
      geminiPowered: "Powered by Gemini AI"
    },
    alerts: { live: "Live Alerts", weather: "IMD: Heavy rainfall expected.", market: "APMC: Soybean MSP increased.", news: "New subsidy announced." },
    dataLabels: {
      highRisk: "⚠️ High Risk", mediumRisk: "⚠️ Medium Risk", lowRisk: "✅ Low Risk",
      humidity: "Humidity", recommended: "🌱 Recommended", trendUp: "▲", trendDown: "▼",
      schemesMatch: "new schemes match your profile!"
    },
    crops: { sorghum: "Sorghum", soybean: "Soybean", cotton: "Cotton", ragi: "Ragi", tomato: "Tomato", onion: "Onion", jute: "Jute", wheat: "Wheat", toordal: "Tur (Arhar)", rice: "Paddy (Rice)", groundnut: "Groundnut", potato: "Potato", maize: "Maize", mustard: "Mustard", coconut: "Coconut", sugarcane: "Sugarcane", orange: "Orange", grape: "Grape", pomegranate: "Pomegranate", chilli: "Chilli", turmeric: "Turmeric", banana: "Banana", tapioca: "Tapioca", tea: "Tea", bajra: "Bajra", litchi: "Litchi", makhana: "Makhana", cashew: "Cashew" },
    diseases: { yvm: "Yellow Vein Mosaic", pinkBollworm: "Pink Bollworm", leafBlight: "Leaf Blight", purpleBlotch: "Purple Blotch", stemRot: "Stem Rot", yellowRust: "Yellow Rust" },
    modals: {
      close: "✕ Close",
      advisory: {
        title: "Advanced Crop Advisory Center", subtitle: "Agriculture Intelligence",
        tabCalendar: "Crop Calendar", tabPests: "Treatment Center", tabDoctor: "AI Disease Doctor",
        searchPlaceholder: "Search 200+ crops...", allSeasons: "All Seasons", pests: "Pests",
        pestLabel: "Major Pest:", pesticide: "Pesticide", dosage: "Dosage",
        speakCrop: "Crop: {crop}. Season: {season}. Pests: {pests}.",
        speakProtection: "{crop} protection. Major pest is {pest}. Use {treatment}. Dosage: {dosage}.",
        zone: "Zone"
      },
      market: {
        title: "Live Market Prices", vsNearby: "vs Nearby Mandis", loading: "Fetching live prices...",
        colCommodity: "Commodity", colPrice: "Price (Rs./q)", colNearby: "Nearby Avg (200km)",
        colTrend: "Trend", colDiff: "vs Nearby",
        trendUp: "▲ Rising", trendDown: "▼ Falling",
        speakItem: "{name} price at {city} mandi is Rs.{price} per quintal. Trend is {trend}.",
        enamSync: "e-NAM Sync", agmarknetLive: "Agmarknet Live"
      },
      schemes: {
        title: "Government Welfare Schemes", subtitle: "Direct integration with State & Central Agriculture Portals",
        tabAvailable: "Available Schemes", tabStatus: "PM Kisan Status",
        centralGovt: "Central Schemes", stateGovt: "State Schemes",
        checkStatus: "Check PM Kisan Status", descStatus: "Enter mobile or Aadhaar to fetch live data",
        inputPlaceholder: "Enter 10-digit mobile or 12-digit Aadhaar",
        searchBtn: "Search", aadhaarAuth: "Aadhaar Verified", regDate: "Registration Date",
        ekyc: "e-KYC Status", payMode: "Payment Mode", bankStatus: "Bank Status",
        totalInst: "Total Installments", received: "Received", latest: "Latest",
        noData: "No beneficiary data found. Please try again.",
        verifSuccess: "Verification successful. Name: {name}. Total {installments} installments received. e-KYC: {ekyc}.",
        verifFailed: "No data found.", verifying: "Verifying...",
        federal: "Federal", regional: "Regional"
      }
    }
  },

  hi: {
    auth: { promptName: "अपना नाम दर्ज करें:", defaultName: "किसान" },
    nav: { dashboard: "डैशबोर्ड", market: "बाज़ार", weather: "मौसम", signIn: "साइन इन", signOut: "साइन आउट" },
    dashboard: { welcome: "वापसी पर स्वागत", guest: "स्वागत है, किसान", subtitle: "आज के लिए आपकी कृषि जानकारी यहाँ है।", location: "📍 ऑटो (जीपीएस)" },
    sections: {
      cropAdvisory: { title: "फसल सलाह", desc: "एआई-संचालित फसल रोग निदान और व्यक्तिगत खेती मार्गदर्शन।" },
      weather: { title: "मौसम जानकारी", desc: "स्थानीय 7-दिवसीय पूर्वानुमान और सिंचाई योजना।" },
      market: { title: "बाज़ार भाव", desc: "रियल-टाइम APMC बाज़ार दर।" },
      farmResource: { title: "कृषि उपकरण किराया", desc: "पास के किसानों से ट्रैक्टर, स्प्रेयर और उपकरण किराए पर लें।" },
      marketplace: { title: "सीधा बाज़ार", desc: "कमीशन-मुक्त व्यापार।" },
      govSchemes: { title: "सरकारी योजनाएं", desc: "स्मार्ट पात्रता जांचकर्ता।" }
    },
    card: { explore: "अन्वेषण करें", stop: "⏸️ रोकें", listen: "🔊 सुनें", listenTitle: "विवरण सुनें" },
    ai: {
      title: "किसान AI", status: "ऑनलाइन", placeholder: "अपना प्रश्न टाइप करें...",
      greeting: "नमस्ते! मैं आपका Gemini AI कृषि सहायक हूं। मुझसे मौसम, बाज़ार भाव, फसल रोग या सरकारी योजनाओं के बारे में पूछें!",
      defaultResponse: "मैं समझ नहीं पाया। आप मुझसे मौसम, मंडी भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं!",
      thinking: "सोच रहा हूं...",
      weatherResponse: "वर्तमान में {city}, {state} में मौसम सामान्य है। अगले 48 घंटों में बारिश की संभावना नहीं — कटाई या कीटनाशक छिड़काव के लिए अच्छा समय।",
      marketPriceSingle: "{city} मंडी में {crop} का वर्तमान भाव ₹{price}/क्विंटल है। रुझान {trend} है।",
      marketPriceList: "{city} मंडी के वर्तमान भाव: {crops}। आप किस फसल के बारे में जानना चाहते हैं?",
      schemesResponse: "{state} में आपके लिए मुख्य योजनाएं: {schemes}। 'सरकारी योजनाएं' अनुभाग में अधिक जानकारी पाएं!",
      pmKisanResponse: "पीएम किसान किस्त हर 4 महीने जारी होती है। आधार या मोबाइल नंबर से 'सरकारी योजनाएं' में स्थिति जांचें।",
      errorMessage: "डेटा स्रोत से जुड़ने में समस्या। कृपया दोबारा प्रयास करें!",
      micTooltip: "आवाज़ इनपुट शुरू करें", micTooltipActive: "सुनना बंद करें",
      trendUp: "बढ़त", trendDown: "गिरावट",
      apiKeyPrompt: "AI उत्तर सक्षम करने के लिए Gemini API कुंजी दर्ज करें:",
      apiKeySave: "सहेजें और कनेक्ट करें", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI द्वारा संचालित"
    },
    alerts: { live: "लाइव अलर्ट", weather: "IMD: भारी बारिश की संभावना।", market: "APMC: सोयाबीन MSP बढ़ा।", news: "नई सब्सिडी घोषित।" },
    dataLabels: {
      highRisk: "⚠️ उच्च जोखिम", mediumRisk: "⚠️ मध्यम जोखिम", lowRisk: "✅ कम जोखिम",
      humidity: "नमी", recommended: "🌱 अनुशंसित", trendUp: "▲", trendDown: "▼",
      schemesMatch: "नई योजनाएं आपकी प्रोफ़ाइल से मेल खाती हैं!"
    },
    crops: { sorghum: "ज्वार", soybean: "सोयाबीन", cotton: "कपास", ragi: "रागी", tomato: "टमाटर", onion: "प्याज़", jute: "जूट", wheat: "गेहूं", toordal: "तूर (अरहर)", rice: "धान (चावल)", groundnut: "मूंगफली", potato: "आलू", maize: "मक्का", mustard: "सरसों", coconut: "नारियल", sugarcane: "गन्ना", orange: "संतरा", grape: "अंगूर", pomegranate: "अनार", chilli: "मिर्च", turmeric: "हल्दी", banana: "केला", tapioca: "टैपिओका", tea: "चाय", bajra: "बाजरा", litchi: "लीची", makhana: "मखाना", cashew: "काजू" },
    diseases: { yvm: "येलो वेन मोज़ेक", pinkBollworm: "गुलाबी सुंडी", leafBlight: "पत्ती झुलसा", purpleBlotch: "बैंगनी धब्बा", stemRot: "तना सड़न", yellowRust: "पीली रतुआ" },
    modals: {
      close: "✕ बंद करें",
      advisory: {
        title: "उन्नत फसल सलाह केंद्र", subtitle: "कृषि बुद्धिमत्ता",
        tabCalendar: "फसल कैलेंडर", tabPests: "उपचार केंद्र", tabDoctor: "एआई रोग डॉक्टर",
        searchPlaceholder: "200+ फसलों में खोजें...", allSeasons: "सभी ऋतुएं", pests: "कीट",
        pestLabel: "प्रमुख कीट:", pesticide: "कीटनाशक", dosage: "खुराक",
        speakCrop: "फसल: {crop}। मौसम: {season}। कीट: {pests}।",
        speakProtection: "{crop} सुरक्षा। प्रमुख कीट {pest} है। उपचार: {treatment}। खुराक: {dosage}।",
        zone: "क्षेत्र"
      },
      market: {
        title: "लाइव बाज़ार भाव", vsNearby: "नज़दीकी मंडियों से तुलना", loading: "लाइव भाव लोड हो रहे हैं...",
        colCommodity: "फसल", colPrice: "भाव (₹/क्विं)", colNearby: "नज़दीकी औसत (200km)",
        colTrend: "रुझान", colDiff: "तुलना",
        trendUp: "▲ बढ़त", trendDown: "▼ गिरावट",
        speakItem: "{city} मंडी में {name} का भाव ₹{price} प्रति क्विंटल है। रुझान {trend} है।",
        enamSync: "ई-नाम सिंक", agmarknetLive: "एगमार्कनेट लाइव"
      },
      schemes: {
        title: "सरकारी कल्याण योजनाएं", subtitle: "राज्य और केंद्रीय कृषि पोर्टल के साथ एकीकरण",
        tabAvailable: "उपलब्ध योजनाएं", tabStatus: "पीएम किसान स्थिति",
        centralGovt: "केंद्रीय योजनाएं", stateGovt: "राज्य योजनाएं",
        checkStatus: "पीएम किसान स्थिति जांचें", descStatus: "लाइव डेटा के लिए मोबाइल या आधार दर्ज करें",
        inputPlaceholder: "10-अंकीय मोबाइल या 12-अंकीय आधार दर्ज करें",
        searchBtn: "खोजें", aadhaarAuth: "आधार सत्यापित", regDate: "पंजीकरण तिथि",
        ekyc: "ई-केवाईसी स्थिति", payMode: "भुगतान मोड", bankStatus: "बैंक स्थिति",
        totalInst: "कुल किस्तें", received: "प्राप्त", latest: "नवीनतम",
        noData: "इस आईडी के लिए कोई डेटा नहीं मिला। पुनः प्रयास करें।",
        verifSuccess: "सत्यापन सफल। नाम: {name}। कुल {installments} किस्तें प्राप्त। ई-केवाईसी: {ekyc}।",
        verifFailed: "कोई डेटा नहीं मिला।", verifying: "सत्यापित हो रहा है...",
        federal: "केंद्रीय", regional: "क्षेत्रीय"
      }
    }
  },

  mr: {
    auth: { promptName: "आपले नाव टाका:", defaultName: "शेतकरी" },
    nav: { dashboard: "डॅशबोर्ड", market: "बाजार", weather: "हवामान", signIn: "साइन इन", signOut: "साइन आउट" },
    dashboard: { welcome: "पुन्हा स्वागत", guest: "स्वागत आहे, शेतकरी", subtitle: "आजची तुमची कृषी माहिती येथे आहे.", location: "📍 ऑटो (जीपीएस)" },
    sections: {
      cropAdvisory: { title: "पीक सल्ला", desc: "एआई-चालित पीक रोग निदान आणि वैयक्तिक शेती मार्गदर्शन." },
      weather: { title: "हवामान माहिती", desc: "स्थानिक 7-दिवसीय अंदाज आणि सिंचन नियोजन." },
      market: { title: "बाजार भाव", desc: "रिअल-टाइम APMC बाजार दर." },
      farmResource: { title: "शेती उपकरण भाडे", desc: "जवळच्या शेतकऱ्यांकडून ट्रॅक्टर, फवारणी यंत्र भाड्याने घ्या." },
      marketplace: { title: "थेट बाजार", desc: "कमिशन-मुक्त व्यापार." },
      govSchemes: { title: "सरकारी योजना", desc: "स्मार्ट पात्रता तपासक." },
      satellite: { title: "उपग्रह निरीक्षण", desc: "अंतरिक्ष आणि कृत्रिम बुद्धिमत्ता (AI) च्या मदतीने पिकाच्या आरोग्याचे निरीक्षण करा." }
    },
    card: { explore: "एक्सप्लोर करा", stop: "⏸️ थांबा", listen: "🔊 ऐका", listenTitle: "वर्णन ऐका" },
    ai: {
      title: "किसान AI", status: "ऑनलाइन", placeholder: "तुमचा प्रश्न टाइप करा...",
      greeting: "नमस्कार! मी Gemini AI कृषी सहाय्यक आहे. हवामान, बाजार भाव, पीक रोग किंवा सरकारी योजनांबद्दल विचारा!",
      defaultResponse: "मला नीट समजले नाही. तुम्ही हवामान, मंडी भाव किंवा सरकारी योजनांबद्दल विचारू शकता!",
      thinking: "विचार करतो आहे...",
      weatherResponse: "सध्या {city}, {state} मध्ये हवामान सामान्य आहे. पुढील 48 तासात पाऊस नाही - कापणी किंवा फवारणीसाठी चांगला वेळ.",
      marketPriceSingle: "{city} बाजारात {crop} चा सध्याचा भाव ₹{price}/क्विंटल आहे. कल {trend} आहे.",
      marketPriceList: "{city} बाजारातील सध्याचे भाव: {crops}. कोणत्या पिकाबद्दल जाणून घ्यायचे?",
      schemesResponse: "{state} मध्ये तुमच्यासाठी मुख्य योजना: {schemes}. 'सरकारी योजना' विभागात अधिक माहिती पहा!",
      pmKisanResponse: "पीएम किसान हप्ता दर 4 महिन्यांनी जारी होतो. आधार किंवा मोबाईलने स्थिती तपासा.",
      errorMessage: "डेटा स्रोताशी जोडणे अवघड होत आहे. पुन्हा प्रयत्न करा!",
      micTooltip: "आवाज इनपुट सुरू करा", micTooltipActive: "ऐकणे थांबवा",
      trendUp: "वाढ", trendDown: "घट",
      apiKeyPrompt: "AI उत्तरे सक्षम करण्यासाठी Gemini API की टाका:",
      apiKeySave: "जतन करा", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI द्वारे"
    },
    alerts: { live: "थेट सूचना", weather: "IMD: जड पाऊस अपेक्षित.", market: "APMC: सोयाबीन MSP वाढ.", news: "नवीन अनुदान जाहीर." },
    dataLabels: {
      highRisk: "⚠️ उच्च धोका", mediumRisk: "⚠️ मध्यम धोका", lowRisk: "✅ कमी धोका",
      humidity: "आर्द्रता", recommended: "🌱 शिफारस केलेले", trendUp: "▲", trendDown: "▼",
      schemesMatch: "नवीन योजना तुमच्या प्रोफाइलशी जुळतात!"
    },
    crops: { sorghum: "ज्वारी", soybean: "सोयाबीन", cotton: "कापूस", ragi: "नाचणी", tomato: "टोमॅटो", onion: "कांदा", jute: "ताग", wheat: "गहू", toordal: "तूर (अरहर)", rice: "धान (भात)", groundnut: "भुईमूग", potato: "बटाटा", maize: "मका", mustard: "मोहरी", coconut: "नारळ", sugarcane: "ऊस", orange: "संत्री", grape: "द्राक्षे", pomegranate: "डाळिंब", chilli: "मिरची", turmeric: "हळद", banana: "केळी", tapioca: "साबुदाणा", tea: "चहा", bajra: "बाजरी", litchi: "लीची", makhana: "मखाना", cashew: "काजू" },
    diseases: { yvm: "येलो व्हेन मोझेक", pinkBollworm: "गुलाबी बोंड अळी", leafBlight: "करपा", purpleBlotch: "जांभळा डाग", stemRot: "खोड कूज", yellowRust: "पिवळी गंज" },
    modals: {
      close: "✕ बंद करा",
      advisory: {
        title: "प्रगत पीक सल्ला केंद्र", subtitle: "कृषी माहिती",
        tabCalendar: "पीक कॅलेंडर", tabPests: "उपचार केंद्र", tabDoctor: "AI रोग डॉक्टर",
        searchPlaceholder: "200+ पिकांमध्ये शोधा...", allSeasons: "सर्व हंगाम", pests: "कीड",
        pestLabel: "प्रमुख कीड:", pesticide: "कीटकनाशक", dosage: "मात्रा",
        speakCrop: "पीक: {crop}। हंगाम: {season}। कीड: {pests}।",
        speakProtection: "{crop} संरक्षण. प्रमुख कीड {pest}. {treatment} वापरा. मात्रा: {dosage}.",
        zone: "क्षेत्र"
      },
      market: {
        title: "थेट बाजार भाव", vsNearby: "जवळच्या बाजार समित्यांशी तुलना", loading: "थेट भाव लोड होत आहेत...",
        colCommodity: "पीक", colPrice: "दर (₹/क्विं)", colNearby: "जवळची सरासरी (200km)",
        colTrend: "कल", colDiff: "तुलना",
        trendUp: "▲ तेजी", trendDown: "▼ मंदी",
        speakItem: "{city} बाजारात {name} चा दर ₹{price} प्रति क्विंटल आहे. कल {trend} आहे.",
        enamSync: "ई-नाम सिंक", agmarknetLive: "एगमार्कनेट लाईव्ह"
      },
      schemes: {
        title: "सरकारी कल्याणकारी योजना", subtitle: "राज्य आणि केंद्रीय कृषी पोर्टलशी एकत्रीकरण",
        tabAvailable: "उपलब्ध योजना", tabStatus: "पीएम किसान स्थिती",
        centralGovt: "केंद्रीय योजना", stateGovt: "राज्य योजना",
        checkStatus: "पीएम किसान स्थिती तपासा", descStatus: "थेट डेटा मिळवण्यासाठी मोबाईल किंवा आधार टाका",
        inputPlaceholder: "10-अंकी मोबाईल किंवा 12-अंकी आधार टाका",
        searchBtn: "शोधा", aadhaarAuth: "आधार प्रमाणित", regDate: "नोंदणी तारीख",
        ekyc: "ई-केवाईसी स्थिती", payMode: "पेमेंट मोड", bankStatus: "बँक स्थिती",
        totalInst: "एकूण हप्ते", received: "प्राप्त", latest: "नवीनतम",
        noData: "या आयडीसाठी डेटा आढळला नाही. पुन्हा प्रयत्न करा.",
        verifSuccess: "पडताळणी यशस्वी. नाव: {name}. एकूण {installments} हप्ते. ई-केवाईसी: {ekyc}.",
        verifFailed: "डेटा आढळला नाही.", verifying: "पडताळणी सुरू...",
        federal: "केंद्रीय", regional: "प्रादेशिक"
      }
    }
  },

  bn: {
    auth: { promptName: "আপনার নাম লিখুন:", defaultName: "কৃষক" },
    nav: { dashboard: "ড্যাশবোর্ড", market: "বাজার", weather: "আবহাওয়া", signIn: "সাইন ইন", signOut: "সাইন আউট" },
    dashboard: { welcome: "স্বাগতম", guest: "স্বাগতম, কৃষক", subtitle: "আজকের জন্য আপনার কৃষি তথ্য এখানে রয়েছে।", location: "📍 অটো (GPS)" },
    sections: {
      cropAdvisory: { title: "ফসল পরামর্শ", desc: "এআই-চালিত ফসল রোগ নির্ণয় এবং ব্যক্তিগত কৃষি নির্দেশিকা।" },
      weather: { title: "আবহাওয়া তথ্য", desc: "স্থানীয় ৭ দিনের পূর্বাভাস এবং সেচ পরিকল্পনা।" },
      market: { title: "বাজার মূল্য", desc: "রিয়েল-টাইম APMC বাজারের হার।" },
      farmResource: { title: "কৃষি সরঞ্জাম ভাড়া", desc: "কাছের কৃষকদের কাছ থেকে ট্রাক্টর ও যন্ত্রপাতি ভাড়া নিন।" },
      marketplace: { title: "সরাসরি বাজার", desc: "কমিশন-মুক্ত বাণিজ্য।" },
      govSchemes: { title: "সরকারী প্রকল্প", desc: "স্মার্ট যোগ্যতা পরীক্ষক।" },
      satellite: { title: "স্যাটেলাইট পর্যবেক্ষণ", desc: "মহাকাশ থেকে স্যাটেলাইট এবং এআই-এর মাধ্যমে ফসলের স্বাস্থ্য পর্যবেক্ষণ করুন।" }
    },
    card: { explore: "অন্বেষণ করুন", stop: "⏸️ থামুন", listen: "🔊 শুনুন", listenTitle: "বিবরণ শুনুন" },
    ai: {
      title: "কিসান AI", status: "অনলাইন", placeholder: "আপনার প্রশ্ন টাইপ করুন...",
      greeting: "নমস্তে! আমি Gemini AI কৃষি সহকারী। আবহাওয়া, বাজার দর, ফসলের রোগ বা সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন!",
      defaultResponse: "আমি ঠিক বুঝতে পারছি না। আবহাওয়া, বাজার দর বা সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন!",
      thinking: "ভাবছি...",
      weatherResponse: "বর্তমানে {city}, {state}-এ আবহাওয়া স্বাভাবিক। আগামী ৪৮ ঘণ্টায় বৃষ্টির সম্ভাবনা নেই।",
      marketPriceSingle: "{city} বাজারে {crop}-এর বর্তমান মূল্য ₹{price}/কুইন্টাল। প্রবণতা {trend}।",
      marketPriceList: "{city} বাজারের বর্তমান মূল্য: {crops}। কোন ফসল সম্পর্কে জানতে চান?",
      schemesResponse: "{state}-এ আপনার জন্য প্রধান প্রকল্প: {schemes}। 'সরকারি প্রকল্প' বিভাগে বিস্তারিত দেখুন!",
      pmKisanResponse: "পিএম কিষাণ কিস্তি প্রতি ৪ মাস অন্তর দেওয়া হয়। আধার বা মোবাইল দিয়ে স্থিতি পরীক্ষা করুন।",
      errorMessage: "তথ্য উৎসের সাথে সংযোগ সমস্যা। পরে আবার চেষ্টা করুন!",
      micTooltip: "ভয়েস ইনপুট শুরু করুন", micTooltipActive: "শোনা বন্ধ করুন",
      trendUp: "বাড়ছে", trendDown: "কমছে",
      apiKeyPrompt: "AI উত্তর সক্রিয় করতে Gemini API কী লিখুন:",
      apiKeySave: "সংরক্ষণ করুন", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI দ্বারা"
    },
    alerts: { live: "সরাসরি সতর্কতা", weather: "IMD: ভারী বৃষ্টির সম্ভাবনা।", market: "APMC: সয়াবিনের MSP বৃদ্ধি।", news: "নতুন ভর্তুকি ঘোষণা।" },
    dataLabels: {
      highRisk: "⚠️ উচ্চ ঝুঁকি", mediumRisk: "⚠️ মাঝারি ঝুঁকি", lowRisk: "✅ কম ঝুঁকি",
      humidity: "আর্দ্রতা", recommended: "🌱 সুপারিশকৃত", trendUp: "▲", trendDown: "▼",
      schemesMatch: "নতুন প্রকল্প আপনার প্রোফাইলের সাথে মিলে যায়!"
    },
    crops: { sorghum: "জোয়ার", soybean: "সয়াবিন", cotton: "তুলা", ragi: "রাগি", tomato: "টমেটো", onion: "পেঁয়াজ", jute: "পাট", wheat: "গম", toordal: "অড়হর (তুর ডাল)", rice: "ধান", groundnut: "চিনাবাদাম", potato: "আলু", maize: "ভুট্টা", mustard: "সরিষা", coconut: "নারকেল", sugarcane: "আখ", orange: "কমলা", grape: "আঙুর", pomegranate: "ডালিম", chilli: "লঙ্কা", turmeric: "হলুদ", banana: "কলা", tapioca: "ট্যাপিওকা", tea: "চা", bajra: "বাজরা", litchi: "লিচু", makhana: "মাখনা", cashew: "কাজু" },
    diseases: { yvm: "ইয়েলো ভেইন মোজাইক", pinkBollworm: "পিঙ্ক বোলওয়ার্ম", leafBlight: "লিফ ব্লাইট", purpleBlotch: "পার্পল ব্লচ", stemRot: "স্টেম রট", yellowRust: "ইয়েলো রাস্ট" },
    modals: {
      close: "✕ বন্ধ করুন",
      advisory: {
        title: "উন্নত ফসল পরামর্শ কেন্দ্র", subtitle: "কৃষি তথ্য",
        tabCalendar: "ফসল ক্যালেন্ডার", tabPests: "চিকিৎসা কেন্দ্র", tabDoctor: "এআই রোগ ডাক্তার",
        searchPlaceholder: "২০০+ ফসলের মধ্যে খুঁজুন...", allSeasons: "সব ঋতু", pests: "কীটপতঙ্গ",
        pestLabel: "প্রধান কীট:", pesticide: "কীটনাশক", dosage: "মাত্রা",
        speakCrop: "ফসল: {crop}। ঋতু: {season}। কীট: {pests}।",
        speakProtection: "{crop} সুরক্ষা। প্রধান কীট {pest}। {treatment} ব্যবহার করুন। মাত্রা: {dosage}।",
        zone: "অঞ্চল"
      },
      market: {
        title: "লাইভ বাজার দর", vsNearby: "নিকটবর্তী বাজারের সাথে তুলনা", loading: "লাইভ মূল্য আনা হচ্ছে...",
        colCommodity: "ফসল", colPrice: "মূল্য (₹/q)", colNearby: "নিকটবর্তী গড় (200km)",
        colTrend: "ধারা", colDiff: "তুলনা",
        trendUp: "▲ ঊর্ধ্বমুখী", trendDown: "▼ নিম্নমুখী",
        speakItem: "{city} বাজারে {name}-এর মূল্য ₹{price}/কুইন্টাল। প্রবণতা {trend}।",
        enamSync: "ই-নাম সিঙ্ক", agmarknetLive: "অ্যাগমার্কনেট লাইভ"
      },
      schemes: {
        title: "সরকারি কল্যাণমূলক প্রকল্প", subtitle: "রাজ্য ও কেন্দ্রীয় কৃষি পোর্টালের সাথে একীকরণ",
        tabAvailable: "উপলব্ধ প্রকল্প", tabStatus: "পিএম কিষাণ স্থিতি",
        centralGovt: "কেন্দ্রীয় প্রকল্প", stateGovt: "রাজ্য প্রকল্প",
        checkStatus: "পিএম কিষাণ স্থিতি যাচাই", descStatus: "লাইভ তথ্যের জন্য মোবাইল বা আধার লিখুন",
        inputPlaceholder: "১০-সংখ্যার মোবাইল বা ১২-সংখ্যার আধার লিখুন",
        searchBtn: "অনুসন্ধান", aadhaarAuth: "আধার যাচাইকৃত", regDate: "নিবন্ধনের তারিখ",
        ekyc: "ই-কেওয়াইসি স্থিতি", payMode: "পেমেন্ট মোড", bankStatus: "ব্যাঙ্কের স্থিতি",
        totalInst: "মোট কিস্তি", received: "প্রাপ্ত", latest: "সর্বশেষ",
        noData: "কোন তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।",
        verifSuccess: "যাচাই সফল। নাম: {name}। মোট {installments} কিস্তি। ই-কেওয়াইসি: {ekyc}।",
        verifFailed: "কোন তথ্য পাওয়া যায়নি।", verifying: "যাচাই হচ্ছে...",
        federal: "কেন্দ্রীয", regional: "আঞ্চলিক"
      }
    }
  },

  gu: {
    auth: { promptName: "તમારું નામ દાખલ કરો:", defaultName: "ખેડૂત" },
    nav: { dashboard: "ડેશબોર્ડ", market: "બજાર", weather: "હવામાન", signIn: "સાઇન ઇન", signOut: "સાઇન આઉટ" },
    dashboard: { welcome: "ફરીથી સ્વાગત", guest: "સ્વાગત છે, ખેડૂત", subtitle: "અહીં આજની તમારી કૃષિ માહિતી છે.", location: "📍 ઓટો (GPS)" },
    sections: {
      cropAdvisory: { title: "પાક સલાહ", desc: "AI-સંચાલિત પાક રોગ નિદાન અને વ્યક્તિગત ખેતી માર્ગદર્શન." },
      weather: { title: "હવામાન માહિતી", desc: "સ્થાનિક 7-દિવસની આગાહી અને સિંચાઈ આયોજન." },
      market: { title: "બજાર ભાવ", desc: "રિઅલ-ટાઇમ APMC બજાર ભાવ." },
      farmResource: { title: "ખેત ઉપકરણ ભાડે", desc: "નજીકના ખેડૂતો પાસેથી ટ્રેક્ટર અને સ્પ્રેયર ભાડે લો." },
      marketplace: { title: "સીધું બજાર", desc: "કમિશન-મુક્ત વ્યાપાર." },
      govSchemes: { title: "સરકારી યોજનાઓ", desc: "સ્માર્ટ પાત્રતા તપાસ." },
      satellite: { title: "સેટેલાઇટ મોનિટરિંગ", desc: "અવકાશમાંથી સેટેલાઇટ અને એઆઈ દ્વારા પાકના સ્વાસ્થ્યની દેખરેખ રાખો।" }
    },
    card: { explore: "અન્વેષણ કરો", stop: "⏸️ થોભો", listen: "🔊 સાંભળો", listenTitle: "વિગત સાંભળો" },
    ai: {
      title: "કિસાન AI", status: "ઓનલાઇન", placeholder: "તમારો પ્રશ્ન લખો...",
      greeting: "નમસ્તે! હું Gemini AI ખેડૂત સહાયક છું. હવામાન, બજાર ભાવ, પાક રોગ અથવા સરકારી યોજનાઓ વિશે પૂછો!",
      defaultResponse: "મને સમજાયું નહીં. હવામાન, મંડીના ભાવ અથવા સરકારી યોજનાઓ વિશે પૂછો!",
      thinking: "વિચારી રહ્યો છું...",
      weatherResponse: "હાલ {city}, {state}માં હવામાન સામાન્ય છે. આગામી 48 કલાકમાં વરસાદ નથી.",
      marketPriceSingle: "{city} બજારમાં {crop}નો ભાવ ₹{price}/ક્વિન્ટલ છે. વલણ {trend} છે.",
      marketPriceList: "{city} બજારના ભાવ: {crops}. કયા પાક વિશે જાણવું છે?",
      schemesResponse: "{state}માં તમારા માટે યોજનાઓ: {schemes}. 'સરકારી યોજનાઓ'માં વધુ જુઓ!",
      pmKisanResponse: "PM Kisan હપ્તા દર 4 મહિને આવે છે. આધાર અથવા મોબાઇલ નંબરથી સ્થિતિ ચકાસો.",
      errorMessage: "ડેટા સ્ત્રોત સાથે સમસ્યા. ફરી પ્રયાસ કરો!",
      micTooltip: "વૉઇસ ઇનપુટ શરૂ કરો", micTooltipActive: "સાંભળવાનું બંધ કરો",
      trendUp: "વધારો", trendDown: "ઘટાડો",
      apiKeyPrompt: "AI ઉત્તરો માટે Gemini API કી દાખલ કરો:",
      apiKeySave: "સંગ્રહ કરો", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI દ્વારા"
    },
    alerts: { live: "લાઇવ ચેતવણી", weather: "IMD: ભારે વરસાદ અપેક્ષિત.", market: "APMC: સોયાબીન MSP વધ્યો.", news: "નવી સબસિડી જાહેર." },
    dataLabels: {
      highRisk: "⚠️ ઉચ્ચ જોખમ", mediumRisk: "⚠️ મધ્યમ જોખમ", lowRisk: "✅ ઓછું જોખમ",
      humidity: "ભેજ", recommended: "🌱 ભલામણ", trendUp: "▲", trendDown: "▼",
      schemesMatch: "નવી યોજનાઓ તમારી પ્રોફાઇલ સાથે મળે છે!"
    },
    crops: { sorghum: "જુવાર", soybean: "સોયાબીન", cotton: "કપાસ", ragi: "રાગી", tomato: "ટામેટાં", onion: "ડુંગળી", jute: "શણ", wheat: "ઘઉં", toordal: "તુવેર (અડદ)", rice: "ડાંગર", groundnut: "મગફળી", potato: "બટાકા", maize: "મકાઈ", mustard: "રાઈ", coconut: "નાળિયેર", sugarcane: "શેરડી", orange: "સંતરા", grape: "દ્રાક્ષ", pomegranate: "દાડમ", chilli: "મરચું", turmeric: "હળદર", banana: "કેળું", tapioca: "સાબુદાણા", tea: "ચા", bajra: "બાજરી", litchi: "લીચી", makhana: "મખાના", cashew: "કાજુ" },
    diseases: { yvm: "યલો વેઇન મોઝેક", pinkBollworm: "ગુલાબી ઇયળ", leafBlight: "પાન ઝળ", purpleBlotch: "જાંબલી ડાઘ", stemRot: "થડ સડો", yellowRust: "પીળો કાટ" },
    modals: {
      close: "✕ બંધ કરો",
      advisory: {
        title: "ઉન્નત પાક સલાહ કેન્દ્ર", subtitle: "કૃષિ માહિતી",
        tabCalendar: "પાક કૅલેન્ડર", tabPests: "સારવાર કેન્દ્ર", tabDoctor: "AI રોગ ડૉક્ટર",
        searchPlaceholder: "200+ પાકોમાં શોધો...", allSeasons: "બધી ઋતુ", pests: "જીવાત",
        pestLabel: "મુખ્ય જીવાત:", pesticide: "જંતુનાશક", dosage: "માત્રા",
        speakCrop: "પાક: {crop}। ઋતુ: {season}। જીવાત: {pests}।",
        speakProtection: "{crop} સુરક્ષા. મુખ્ય જીવાત {pest}. {treatment} વાપરો. માત્રા: {dosage}.",
        zone: "ઝોન"
      },
      market: {
        title: "લાઇવ બજાર ભાવ", vsNearby: "નજીકના બજારો સાથે સરખામણી", loading: "ભાવ આવી રહ્યા છે...",
        colCommodity: "પાક", colPrice: "ભાવ (₹/q)", colNearby: "નજીક સરેરાશ (200km)",
        colTrend: "વલણ", colDiff: "સરખામણી",
        trendUp: "▲ વધારો", trendDown: "▼ ઘટાડો",
        speakItem: "{city} બજારમાં {name}નો ભાવ ₹{price}/ક્વિન્ટલ. વલણ {trend}.",
        enamSync: "e-NAM સિંક", agmarknetLive: "Agmarknet લાઇવ"
      },
      schemes: {
        title: "સરકારી કલ્યાણ યોજનાઓ", subtitle: "રાજ્ય અને કેન્દ્ર કૃષિ પોર્ટલ સાથે",
        tabAvailable: "ઉપલબ્ધ યોજનાઓ", tabStatus: "PM Kisan સ્થિતિ",
        centralGovt: "કેન્દ્રીય યોજનાઓ", stateGovt: "રાજ્ય યોજનાઓ",
        checkStatus: "PM Kisan સ્થિતિ તપાસો", descStatus: "લાઇવ ડેટા માટે મોબાઇલ અથવા આધાર દાખલ કરો",
        inputPlaceholder: "10-અંકનો મોબાઇલ અથવા 12-અંકનો આધાર",
        searchBtn: "શોધો", aadhaarAuth: "આધાર ચકાસાયેલ", regDate: "નોંધણી તારીખ",
        ekyc: "e-KYC સ્થિતિ", payMode: "ચૂકવણી મોડ", bankStatus: "બેન્ક સ્થિતિ",
        totalInst: "કુલ હપ્તા", received: "પ્રાપ્ત", latest: "છેલ્લું",
        noData: "આ ID માટે ડેટા મળ્યો નથી. ફરી પ્રયાસ કરો.",
        verifSuccess: "ચકાસણી સફળ. નામ: {name}. કુલ {installments} હપ્તા. e-KYC: {ekyc}.",
        verifFailed: "ડેટા મળ્યો નથી.", verifying: "ચકાસણી...",
        federal: "કેન્દ્રીય", regional: "પ્રાદેશિક"
      }
    }
  },

  ta: {
    auth: { promptName: "உங்கள் பெயரை உள்ளிடவும்:", defaultName: "விவசாயி" },
    nav: { dashboard: "டாஷ்போர்டு", market: "சந்தை", weather: "வானிலை", signIn: "உள்நுழை", signOut: "வெளியேறு" },
    dashboard: { welcome: "மீண்டும் வரவேற்கிறோம்", guest: "வரவேற்கிறோம், விவசாயி", subtitle: "இன்றைய உங்கள் விவசாய தகவல்கள் இங்கே உள்ளன.", location: "📍 தானியங்கி (GPS)" },
    sections: {
      cropAdvisory: { title: "பயிர் ஆலோசனை", desc: "AI-இயக்கும் பயிர் நோய் கண்டறிதல் மற்றும் தனிப்பட்ட விவசாய வழிகாட்டல்." },
      weather: { title: "வானிலை தகவல்", desc: "உள்ளூர் 7-நாள் வானிலை முன்னறிவிப்பு மற்றும் நீர்ப்பாசன திட்டம்." },
      market: { title: "சந்தை விலைகள்", desc: "நேரடி APMC சந்தை விலைகள்." },
      farmResource: { title: "விவசாய உபகரண வாடகை", desc: "அருகிலுள்ள விவசாயிகளிடம் இருந்து டிராக்டர் வாடகைக்கு எடுக்கவும்." },
      marketplace: { title: "நேரடி சந்தை", desc: "கமிஷன் இல்லாத வர்த்தகம்." },
      govSchemes: { title: "அரசு திட்டங்கள்", desc: "தகுதி சரிபார்ப்பு." },
      satellite: { title: "செயற்கைக்கோள் கண்காணிப்பு", desc: "விண்வெளியில் இருந்து செயற்கைக்கோள் மற்றும் ஏআই மூலம் பயிர் ஆரோக்கியத்தை கண்காணியுங்கள்." }
    },
    card: { explore: "ஆராயுங்கள்", stop: "⏸️ நிறுத்து", listen: "🔊 கேளுங்கள்", listenTitle: "விவரணை கேளுங்கள்" },
    ai: {
      title: "கிசான் AI", status: "இணையத்தில்", placeholder: "உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்...",
      greeting: "வணக்கம்! நான் Gemini AI விவசாய உதவியாளர். வானிலை, சந்தை விலை, பயிர் நோய் அல்லது அரசு திட்டங்கள் பற்றி கேளுங்கள்!",
      defaultResponse: "புரியவில்லை. வானிலை, சந்தை விலை அல்லது அரசு திட்டங்கள் பற்றி கேளுங்கள்!",
      thinking: "யோசிக்கிறேன்...",
      weatherResponse: "தற்போது {city}, {state}-ல் வானிலை சாதாரணமாக உள்ளது. அடுத்த 48 மணி நேரத்தில் மழை இல்லை.",
      marketPriceSingle: "{city} சந்தையில் {crop} தற்போதைய விலை ₹{price}/குவிண்டால். போக்கு {trend}.",
      marketPriceList: "{city} சந்தை விலைகள்: {crops}. எந்த பயிர் பற்றி தெரிய வேண்டும்?",
      schemesResponse: "{state}-ல் உங்களுக்கான திட்டங்கள்: {schemes}. 'அரசு திட்டங்கள்' பிரிவில் மேலும் பாருங்கள்!",
      pmKisanResponse: "PM Kisan தவணைகள் ஒவ்வொரு 4 மாதத்திற்கும் வழங்கப்படுகின்றன. ஆதார் அல்லது மொபைல் மூலம் நிலையை சரிபார்க்கவும்.",
      errorMessage: "தரவு மூலத்துடன் இணைப்பில் சிக்கல். மீண்டும் முயற்சிக்கவும்!",
      micTooltip: "குரல் உள்ளீட்டை தொடங்கவும்", micTooltipActive: "கேட்பதை நிறுத்து",
      trendUp: "உயர்கிறது", trendDown: "குறைகிறது",
      apiKeyPrompt: "AI பதில்களுக்கு Gemini API Key உள்ளிடவும்:",
      apiKeySave: "சேமி மற்றும் இணை", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI ஆல் இயக்கப்படுகிறது"
    },
    alerts: { live: "நேரடி எச்சரிக்கைகள்", weather: "IMD: கனமழை எதிர்பார்க்கப்படுகிறது.", market: "APMC: சோயாபீன் MSP உயர்வு.", news: "புதிய மானியம் அறிவிப்பு." },
    dataLabels: {
      highRisk: "⚠️ அதிக ஆபத்து", mediumRisk: "⚠️ நடுத்தர ஆபத்து", lowRisk: "✅ குறைந்த ஆபத்து",
      humidity: "ஈரப்பதம்", recommended: "🌱 பரிந்துரைக்கப்பட்டது", trendUp: "▲", trendDown: "▼",
      schemesMatch: "புதிய திட்டங்கள் உங்கள் சுயவிவரத்துடன் பொருந்துகின்றன!"
    },
    crops: { sorghum: "சோளம்", soybean: "சோயாபீன்", cotton: "பருத்தி", ragi: "கேழ்வரகு", tomato: "தக்காளி", onion: "வெங்காயம்", jute: "சணல்", wheat: "கோதுமை", toordal: "துவரம் பருப்பு", rice: "நெல்", groundnut: "நிலக்கடலை", potato: "உருளைக்கிழங்கு", maize: "சோளம் (மக்காச்சோளம்)", mustard: "கடுகு", coconut: "தேங்காய்", sugarcane: "கரும்பு", orange: "ஆரஞ்சு", grape: "திராட்சை", pomegranate: "மாதுளை", chilli: "மிளகாய்", turmeric: "மஞ்சள்", banana: "வாழை", tapioca: "மரவள்ளிக்கிழங்கு", tea: "தேநீர்", bajra: "கம்பு", litchi: "லிச்சி", makhana: "தாமரை விதை", cashew: "முந்திரி" },
    diseases: { yvm: "மஞ்சள் நரம்பு மொசைக்", pinkBollworm: "இளஞ்சிவப்பு காய்புழு", leafBlight: "இலை கருகல்", purpleBlotch: "ஊதா புள்ளி", stemRot: "தண்டு அழுகல்", yellowRust: "மஞ்சள் துரு" },
    modals: {
      close: "✕ மூடு",
      advisory: {
        title: "மேம்பட்ட பயிர் ஆலோசனை மையம்", subtitle: "விவசாய நுண்ணறிவு",
        tabCalendar: "பயிர் அட்டவணை", tabPests: "சிகிச்சை மையம்", tabDoctor: "AI நோய் மருத்துவர்",
        searchPlaceholder: "200+ பயிர்களில் தேடுங்கள்...", allSeasons: "அனைத்து பருவங்கள்", pests: "பூச்சிகள்",
        pestLabel: "முக்கிய பூச்சி:", pesticide: "பூச்சிக்கொல்லி", dosage: "அளவு",
        speakCrop: "பயிர்: {crop}. பருவம்: {season}. பூச்சிகள்: {pests}.",
        speakProtection: "{crop} பாதுகாப்பு. முக்கிய பூச்சி {pest}. {treatment} பயன்படுத்துங்கள். அளவு: {dosage}.",
        zone: "மண்டலம்"
      },
      market: {
        title: "நேரடி சந்தை விலைகள்", vsNearby: "அருகிலுள்ள சந்தைகளுடன் ஒப்பீடு", loading: "விலைகள் வருகின்றன...",
        colCommodity: "பயிர்", colPrice: "விலை (₹/q)", colNearby: "அருகில் சராசரி (200km)",
        colTrend: "போக்கு", colDiff: "ஒப்பீடு",
        trendUp: "▲ உயர்கிறது", trendDown: "▼ குறைகிறது",
        speakItem: "{city} சந்தையில் {name} விலை ₹{price}/குவிண்டால். போக்கு {trend}.",
        enamSync: "e-NAM Sync", agmarknetLive: "Agmarknet நேரடி"
      },
      schemes: {
        title: "அரசு நல திட்டங்கள்", subtitle: "மாநில மற்றும் மத்திய விவசாய போர்ட்டல்களுடன் இணைப்பு",
        tabAvailable: "கிடைக்கும் திட்டங்கள்", tabStatus: "PM Kisan நிலை",
        centralGovt: "மத்திய திட்டங்கள்", stateGovt: "மாநில திட்டங்கள்",
        checkStatus: "PM Kisan நிலை சரிபார்க்க", descStatus: "நேரடி தரவுக்கு மொபைல் அல்லது ஆதார் உள்ளிடவும்",
        inputPlaceholder: "10 இலக்க மொபைல் அல்லது 12 இலக்க ஆதார்",
        searchBtn: "தேடு", aadhaarAuth: "ஆதார் சரிபார்க்கப்பட்டது", regDate: "பதிவு தேதி",
        ekyc: "e-KYC நிலை", payMode: "கட்டண முறை", bankStatus: "வங்கி நிலை",
        totalInst: "மொத்த தவணைகள்", received: "பெறப்பட்டது", latest: "சமீபத்திய",
        noData: "இந்த ID க்கு தரவு இல்லை. மீண்டும் முயற்சிக்கவும்.",
        verifSuccess: "சரிபார்ப்பு வெற்றிகரம். பெயர்: {name}. மொத்தம் {installments} தவணைகள். e-KYC: {ekyc}.",
        verifFailed: "தரவு இல்லை.", verifying: "சரிபார்க்கிறோம்...",
        federal: "மத்திய", regional: "மாநில"
      }
    }
  },

  te: {
    auth: { promptName: "మీ పేరు నమోదు చేయండి:", defaultName: "రైతు" },
    nav: { dashboard: "డాష్‌బోర్డ్", market: "మార్కెట్", weather: "వాతావరణం", signIn: "సైన్ ఇన్", signOut: "సైన్ అవుట్" },
    dashboard: { welcome: "తిరిగి స్వాగతం", guest: "స్వాగతం, రైతు", subtitle: "ఈరోజు మీ వ్యవసాయ సమాచారం ఇక్కడ ఉంది.", location: "📍 ఆటో (GPS)" },
    sections: {
      cropAdvisory: { title: "పంట సలహా", desc: "AI-ఆధారిత పంట వ్యాధి నిర్ధారణ మరియు వ్యక్తిగత వ్యవసాయ మార్గదర్శకం." },
      weather: { title: "వాతావరణ సమాచారం", desc: "స్థానిక 7-రోజుల అంచనా మరియు నీటిపారుదల ప్రణాళిక." },
      market: { title: "మార్కెట్ ధరలు", desc: "రియల్-టైమ్ APMC మార్కెట్ రేట్లు." },
      farmResource: { title: "వ్యవసాయ పరికరాల అద్దె", desc: "దగ్గరి రైతుల నుండి ట్రాక్టర్లు అద్దెకు తీసుకోండి." },
      marketplace: { title: "నేరుగా మార్కెట్", desc: "కమిషన్-రహిత వ్యాపారం." },
      govSchemes: { title: "ప్రభుత్వ పథకాలు", desc: "స్మార్ట్ అర్హత పరీక్షకుడు." },
      satellite: { title: "శాటిలైట్ పర్యవేక్షణ", desc: "అంతరిక్షం నుండి ఉపగ్రహం మరియు ఏఐ సహాయంతో పంట ఆరోగ్యాన్ని పర్యవేక్షించండి।" }
    },
    card: { explore: "అన్వేషించండి", stop: "⏸️ ఆపు", listen: "🔊 వినండి", listenTitle: "వివరణ వినండి" },
    ai: {
      title: "కిసాన్ AI", status: "ఆన్‌లైన్", placeholder: "మీ ప్రశ్న టైప్ చేయండి...",
      greeting: "నమస్తే! నేను Gemini AI వ్యవసాయ సహాయకుడిని. వాతావరణం, మార్కెట్ ధరలు, పంట వ్యాధులు లేదా ప్రభుత్వ పథకాల గురించి అడగండి!",
      defaultResponse: "అర్థం కాలేదు. వాతావరణం, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి అడగండి!",
      thinking: "ఆలోచిస్తున్నాను...",
      weatherResponse: "ప్రస్తుతం {city}, {state}లో వాతావరణం సాధారణంగా ఉంది. రాబోయే 48 గంటల్లో వర్షం లేదు.",
      marketPriceSingle: "{city} మార్కెట్‌లో {crop} ధర ₹{price}/క్వింటాల్. ధోరణి {trend}.",
      marketPriceList: "{city} మార్కెట్ ధరలు: {crops}. ఏ పంట గురించి తెలుసుకోవాలి?",
      schemesResponse: "{state}లో మీకు పథకాలు: {schemes}. 'ప్రభుత్వ పథకాలు'లో మరింత చూడండి!",
      pmKisanResponse: "PM Kisan వాయిదాలు ప్రతి 4 నెలలకు ఒకసారి విడుదలవుతాయి. ఆధార్ లేదా మొబైల్‌తో స్థితి తనిఖీ చేయండి.",
      errorMessage: "డేటా మూలంతో సమస్య. మళ్ళీ ప్రయత్నించండి!",
      micTooltip: "వాయిస్ ఇన్‌పుట్ ప్రారంభించండి", micTooltipActive: "వినడం ఆపు",
      trendUp: "పెరుగుతోంది", trendDown: "తగ్గుతోంది",
      apiKeyPrompt: "AI సమాధానాలకు Gemini API కీని నమోదు చేయండి:",
      apiKeySave: "సేవ్ చేయి", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI ద్వారా"
    },
    alerts: { live: "లైవ్ హెచ్చరికలు", weather: "IMD: భారీ వర్షం అంచనా.", market: "APMC: సోయాబీన్ MSP పెరిగింది.", news: "కొత్త సబ్సిడీ ప్రకటన." },
    dataLabels: {
      highRisk: "⚠️ అధిక ప్రమాదం", mediumRisk: "⚠️ మధ్యమ ప్రమాదం", lowRisk: "✅ తక్కువ ప్రమాదం",
      humidity: "తేమ", recommended: "🌱 సిఫార్సు చేయబడింది", trendUp: "▲", trendDown: "▼",
      schemesMatch: "కొత్త పథకాలు మీ ప్రొఫైల్‌కు సరిపోతున్నాయి!"
    },
    crops: { sorghum: "జొన్న", soybean: "సోయాబీన్", cotton: "పత్తి", ragi: "రాగి", tomato: "టమోటా", onion: "ఉల్లిపాయ", jute: "జనపనార", wheat: "గోధుమ", toordal: "కందిపప్పు", rice: "వరి (ధాన్యం)", groundnut: "వేరుశనగ", potato: "బంగాళదుంప", maize: "మొక్కజొన్న", mustard: "ఆవాలు", coconut: "కొబ్బరి", sugarcane: "చెరకు", orange: "నారింజ", grape: "ద్రాక్ష", pomegranate: "దానిమ్మ", chilli: "మిరపకాయ", turmeric: "పసుపు", banana: "అరటి", tapioca: "కర్రపెండలం", tea: "టీ", bajra: "సజ్జలు", litchi: "లిచీ", makhana: "తామర గింజలు", cashew: "జీడిపప్పు" },
    diseases: { yvm: "యెల్లో వెయిన్ మొజాయిక్", pinkBollworm: "గులాబీ కాయతొలిచే పురుగు", leafBlight: "ఆకు మాడు", purpleBlotch: "నీలి మచ్చ", stemRot: "కాండం కుళ్ళు", yellowRust: "పసుపు తుప్పు" },
    modals: {
      close: "✕ మూసివేయి",
      advisory: {
        title: "అభివృద్ధి చెందిన పంట సలహా కేంద్రం", subtitle: "వ్యవసాయ సమాచారం",
        tabCalendar: "పంట క్యాలెండర్", tabPests: "చికిత్స కేంద్రం", tabDoctor: "AI వ్యాధి డాక్టర్",
        searchPlaceholder: "200+ పంటలలో వెతకండి...", allSeasons: "అన్ని ఋతువులు", pests: "పురుగులు",
        pestLabel: "ప్రధాన పురుగు:", pesticide: "పురుగుమందు", dosage: "మోతాదు",
        speakCrop: "పంట: {crop}. ఋతువు: {season}. పురుగులు: {pests}.",
        speakProtection: "{crop} రక్షణ. ప్రధాన పురుగు {pest}. {treatment} వాడండి. మోతాదు: {dosage}.",
        zone: "జోన్"
      },
      market: {
        title: "లైవ్ మార్కెట్ ధరలు", vsNearby: "దగ్గరి మండీలతో పోలిక", loading: "ధరలు లోడ్ అవుతున్నాయి...",
        colCommodity: "పంట", colPrice: "ధర (₹/q)", colNearby: "దగ్గరి సగటు (200km)",
        colTrend: "ధోరణి", colDiff: "పోలిక",
        trendUp: "▲ పెరుగుతోంది", trendDown: "▼ తగ్గుతోంది",
        speakItem: "{city} మండీలో {name} ధర ₹{price}/క్వింటాల్. ధోరణి {trend}.",
        enamSync: "e-NAM సింక్", agmarknetLive: "Agmarknet లైవ్"
      },
      schemes: {
        title: "ప్రభుత్వ సంక్షేమ పథకాలు", subtitle: "రాష్ట్ర మరియు కేంద్ర వ్యవసాయ పోర్టల్‌తో అనుసంధానం",
        tabAvailable: "అందుబాటులో ఉన్న పథకాలు", tabStatus: "PM Kisan స్థితి",
        centralGovt: "కేంద్ర పథకాలు", stateGovt: "రాష్ట్ర పథకాలు",
        checkStatus: "PM Kisan స్థితి తనిఖీ చేయండి", descStatus: "లైవ్ డేటాకు మొబైల్ లేదా ఆధార్ నమోదు చేయండి",
        inputPlaceholder: "10-అంకెల మొబైల్ లేదా 12-అంకెల ఆధార్",
        searchBtn: "వెతకండి", aadhaarAuth: "ఆధార్ ధృవీకరించబడింది", regDate: "నమోదు తేదీ",
        ekyc: "e-KYC స్థితి", payMode: "చెల్లింపు మోడ్", bankStatus: "బ్యాంకు స్థితి",
        totalInst: "మొత్తం వాయిదాలు", received: "స్వీకరించబడింది", latest: "తాజా",
        noData: "ఈ ID కు డేటా లేదు. మళ్ళీ ప్రయత్నించండి.",
        verifSuccess: "ధృవీకరణ విజయవంతం. పేరు: {name}. మొత్తం {installments} వాయిదాలు. e-KYC: {ekyc}.",
        verifFailed: "డేటా లేదు.", verifying: "ధృవీకరిస్తున్నాం...",
        federal: "కేంద్ర", regional: "ప్రాంతీయ"
      }
    }
  },

  kn: {
    auth: { promptName: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ:", defaultName: "ರೈತ" },
    nav: { dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", market: "ಮಾರುಕಟ್ಟೆ", weather: "ಹವಾಮಾನ", signIn: "ಸೈನ್ ಇನ್", signOut: "ಸೈನ್ ಔಟ್" },
    dashboard: { welcome: "ಮತ್ತೆ ಸ್ವಾಗತ", guest: "ಸ್ವಾಗತ, ರೈತ", subtitle: "ಇಂದಿನ ನಿಮ್ಮ ಕೃಷಿ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.", location: "📍 ಸ್ವಯಂ (GPS)" },
    sections: {
      cropAdvisory: { title: "ಬೆಳೆ ಸಲಹೆ", desc: "AI-ಚಾಲಿತ ಬೆಳೆ ರೋಗ ನಿರ್ಣಯ ಮತ್ತು ವೈಯಕ್ತಿಕ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ." },
      weather: { title: "ಹವಾಮಾನ ಮಾಹಿತಿ", desc: "ಸ್ಥಳೀಯ 7-ದಿನದ ಮುನ್ಸೂಚನೆ ಮತ್ತು ನೀರಾವರಿ ಯೋಜನೆ." },
      market: { title: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು", desc: "ರಿಯಲ್-ಟೈಮ್ APMC ಮಾರುಕಟ್ಟೆ ದರಗಳು." },
      farmResource: { title: "ಕೃಷಿ ಉಪಕರಣ ಬಾಡಿಗೆ", desc: "ಹತ್ತಿರದ ರೈತರಿಂದ ಟ್ರ್ಯಾಕ್ಟರ್ ಬಾಡಿಗೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ." },
      marketplace: { title: "ನೇರ ಮಾರುಕಟ್ಟೆ", desc: "ಕಮಿಷನ್-ಮುಕ್ತ ವ್ಯಾಪಾರ." },
      govSchemes: { title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", desc: "ಸ್ಮಾರ್ಟ್ ಅರ್ಹತೆ ಪರಿಶೀಲಕ." },
      satellite: { title: "ಉಪಗ್ರಹ ಬೆಳೆ ಕಾವಲು", desc: "ಬಾಹ್ಯಾಕಾಶದಿಂದ ಉಪಗ್ರಹ ಮತ್ತು ಎಐ ಒಳನೋಟಗಳ ಮೂಲಕ ಬೆಳೆ ಆರೋಗ್ಯವನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ।" }
    },
    card: { explore: "ಅನ್ವೇಷಿಸಿ", stop: "⏸️ ನಿಲ್ಲಿಸಿ", listen: "🔊 ಕೇಳಿ", listenTitle: "ವಿವರಣೆ ಕೇಳಿ" },
    ai: {
      title: "ಕಿಸಾನ್ AI", status: "ಆನ್‌ಲೈನ್", placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ...",
      greeting: "ನಮಸ್ತೆ! ನಾನು Gemini AI ಕೃಷಿ ಸಹಾಯಕ. ಹವಾಮಾನ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ, ಬೆಳೆ ರೋಗ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ!",
      defaultResponse: "ಅರ್ಥವಾಗಲಿಲ್ಲ. ಹವಾಮಾನ, ಮಂಡಿ ಬೆಲೆ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ!",
      thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
      weatherResponse: "ಪ್ರಸ್ತುತ {city}, {state}ದಲ್ಲಿ ಹವಾಮಾನ ಸಾಮಾನ್ಯವಾಗಿದೆ. ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆ ಇಲ್ಲ.",
      marketPriceSingle: "{city} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ {crop} ಬೆಲೆ ₹{price}/ಕ್ವಿಂಟಾಲ್. ಟ್ರೆಂಡ್ {trend}.",
      marketPriceList: "{city} ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು: {crops}. ಯಾವ ಬೆಳೆ ಬಗ್ಗೆ ತಿಳಿಯಬೇಕು?",
      schemesResponse: "{state}ದಲ್ಲಿ ನಿಮಗಾಗಿ ಯೋಜನೆಗಳು: {schemes}. 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು'ನಲ್ಲಿ ಹೆಚ್ಚು ನೋಡಿ!",
      pmKisanResponse: "PM Kisan ಕಂತುಗಳು ಪ್ರತಿ 4 ತಿಂಗಳಿಗೊಮ್ಮೆ ಬಿಡುಗಡೆಯಾಗುತ್ತವೆ. ಆಧಾರ್ ಅಥವಾ ಮೊಬೈಲ್‌ನಿಂದ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ.",
      errorMessage: "ಡೇಟಾ ಮೂಲದೊಂದಿಗೆ ಸಮಸ್ಯೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!",
      micTooltip: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ", micTooltipActive: "ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
      trendUp: "ಏರುತ್ತಿದೆ", trendDown: "ಇಳಿಯುತ್ತಿದೆ",
      apiKeyPrompt: "AI ಉತ್ತರಗಳಿಗಾಗಿ Gemini API ಕೀ ನಮೂದಿಸಿ:",
      apiKeySave: "ಉಳಿಸಿ ಮತ್ತು ಸಂಪರ್ಕಿಸಿ", apiKeyPlaceholder: "AIza...", geminiPowered: "Gemini AI ಮೂಲಕ"
    },
    alerts: { live: "ಲೈವ್ ಎಚ್ಚರಿಕೆಗಳು", weather: "IMD: ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷಿತ.", market: "APMC: ಸೋಯಾಬೀನ್ MSP ಹೆಚ್ಚಳ.", news: "ಹೊಸ ಸಬ್ಸಿಡಿ ಘೋಷಣೆ." },
    dataLabels: {
      highRisk: "⚠️ ಹೆಚ್ಚಿನ ಅಪಾಯ", mediumRisk: "⚠️ ಮಧ್ಯಮ ಅಪಾಯ", lowRisk: "✅ ಕಡಿಮೆ ಅಪಾಯ",
      humidity: "ಆರ್ದ್ರತೆ", recommended: "🌱 ಶಿಫಾರಸು", trendUp: "▲", trendDown: "▼",
      schemesMatch: "ಹೊಸ ಯೋಜನೆಗಳು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ!"
    },
    crops: { sorghum: "ಜೋಳ", soybean: "ಸೋಯಾಬೀನ್", cotton: "ಹತ್ತಿ", ragi: "ರಾಗಿ", tomato: "ಟೊಮೆಟೊ", onion: "ಈರುಳ್ಳಿ", jute: "ಸೆಣಬು", wheat: "ಗೋಧಿ", toordal: "ತೊಗರಿ ಬೇಳೆ", rice: "ಭತ್ತ", groundnut: "ಕಡಲೆಕಾಯಿ", potato: "ಆಲೂಗಡ್ಡೆ", maize: "ಮೆಕ್ಕೆಜೋಳ", mustard: "ಸಾಸಿವೆ", coconut: "ತೆಂಗಿನಕಾಯಿ", sugarcane: "ಕಬ್ಬು", orange: "ಕಿತ್ತಳೆ", grape: "ದ್ರಾಕ್ಷಿ", pomegranate: "ದಾಳಿಂಬೆ", chilli: "ಮೆಣಸಿನಕಾಯಿ", turmeric: "ಅರಿಶಿನ", banana: "ಬಾಳೆಹಣ್ಣು", tapioca: "ಮರಗೆಣಸು", tea: "ಚಹಾ", bajra: "ಸಜ್ಜೆ", litchi: "ಲಿಚಿ", makhana: "ಮಖಾನಾ", cashew: "ಗೇರುಬೀಜ" },
    diseases: { yvm: "ಹಳದಿ ನರ ಮೊಜೇಕ್", pinkBollworm: "ಗುಲಾಬಿ ಕಾಯಿ ಹುಳ", leafBlight: "ಎಲೆ ಬಾಡು", purpleBlotch: "ನೇರಳೆ ಚುಕ್ಕೆ", stemRot: "ಕಾಂಡ ಕೊಳೆ", yellowRust: "ಹಳದಿ ತುಕ್ಕು" },
    modals: {
      close: "✕ ಮುಚ್ಚಿ",
      advisory: {
        title: "ಮುಂದುವರಿದ ಬೆಳೆ ಸಲಹಾ ಕೇಂದ್ರ", subtitle: "ಕೃಷಿ ಮಾಹಿತಿ",
        tabCalendar: "ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್", tabPests: "ಚಿಕಿತ್ಸಾ ಕೇಂದ್ರ", tabDoctor: "AI ರೋಗ ವೈದ್ಯ",
        searchPlaceholder: "200+ ಬೆಳೆಗಳಲ್ಲಿ ಹುಡುಕಿ...", allSeasons: "ಎಲ್ಲ ಋತುಗಳು", pests: "ಕೀಟಗಳು",
        pestLabel: "ಪ್ರಮುಖ ಕೀಟ:", pesticide: "ಕೀಟನಾಶಕ", dosage: "ಪ್ರಮಾಣ",
        speakCrop: "ಬೆಳೆ: {crop}. ಋತು: {season}. ಕೀಟಗಳು: {pests}.",
        speakProtection: "{crop} ರಕ್ಷಣೆ. ಪ್ರಮುಖ ಕೀಟ {pest}. {treatment} ಬಳಸಿ. ಪ್ರಮಾಣ: {dosage}.",
        zone: "ವಲಯ"
      },
      market: {
        title: "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು", vsNearby: "ಹತ್ತಿರದ ಮಂಡಿಗಳೊಂದಿಗೆ ಹೋಲಿಕೆ", loading: "ಬೆಲೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
        colCommodity: "ಬೆಳೆ", colPrice: "ಬೆಲೆ (₹/q)", colNearby: "ಹತ್ತಿರದ ಸರಾಸರಿ (200km)",
        colTrend: "ಟ್ರೆಂಡ್", colDiff: "ಹೋಲಿಕೆ",
        trendUp: "▲ ಏರಿಕೆ", trendDown: "▼ ಇಳಿಕೆ",
        speakItem: "{city} ಮಂಡಿಯಲ್ಲಿ {name} ಬೆಲೆ ₹{price}/ಕ್ವಿಂಟಾಲ್. ಟ್ರೆಂಡ್ {trend}.",
        enamSync: "e-NAM ಸಿಂಕ್", agmarknetLive: "Agmarknet ಲೈವ್"
      },
      schemes: {
        title: "ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು", subtitle: "ರಾಜ್ಯ ಮತ್ತು ಕೇಂದ್ರ ಕೃಷಿ ಪೋರ್ಟಲ್‌ನೊಂದಿಗೆ",
        tabAvailable: "ಲಭ್ಯ ಯೋಜನೆಗಳು", tabStatus: "PM Kisan ಸ್ಥಿತಿ",
        centralGovt: "ಕೇಂದ್ರ ಯೋಜನೆಗಳು", stateGovt: "ರಾಜ್ಯ ಯೋಜನೆಗಳು",
        checkStatus: "PM Kisan ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ", descStatus: "ಲೈವ್ ಡೇಟಾಗಾಗಿ ಮೊಬೈಲ್ ಅಥವಾ ಆಧಾರ್ ನಮೂದಿಸಿ",
        inputPlaceholder: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಅಥವಾ 12-ಅಂಕಿಯ ಆಧಾರ್",
        searchBtn: "ಹುಡುಕಿ", aadhaarAuth: "ಆಧಾರ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ", regDate: "ನೋಂದಣಿ ದಿನಾಂಕ",
        ekyc: "e-KYC ಸ್ಥಿತಿ", payMode: "ಪಾವತಿ ಮೋಡ್", bankStatus: "ಬ್ಯಾಂಕ್ ಸ್ಥಿತಿ",
        totalInst: "ಒಟ್ಟು ಕಂತುಗಳು", received: "ಸ್ವೀಕರಿಸಿದೆ", latest: "ಇತ್ತೀಚಿನ",
        noData: "ಈ ID ಗೆ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        verifSuccess: "ಪರಿಶೀಲನೆ ಯಶಸ್ವಿ. ಹೆಸರು: {name}. ಒಟ್ಟು {installments} ಕಂತುಗಳು. e-KYC: {ekyc}.",
        verifFailed: "ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ.", verifying: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
        federal: "ಕೇಂದ್ರ", regional: "ಪ್ರಾದೇಶಿಕ"
      }
    }
  }
};
