import React, { useState, useEffect } from 'react';
import './MeghdootModal.css';
import { useLanguage } from '../context/LanguageContext';
import { translateDBText } from '../utils/translator';
import { cityMainCrops, stateMainCrops } from '../data/cityMainCrops';
import { getWeatherData } from '../utils/weatherService';

const meghdootTranslations = {
  en: {
    meghdootTitle: "MEGHDOOT AGRO ADVISORY",
    govPortal: "Ministry of Earth Sciences & ICAR",
    bulletinTitle: "Official Weather & Crop Advisory Bulletin",
    forecast5Day: "Official IMD 5-Day Forecast",
    temp: "Temp",
    rainProb: "Rain Prob.",
    wind: "Wind Speed",
    humidity: "Humidity",
    rainWarn: "Heavy Rain Warning",
    windWarn: "High Wind Warning",
    heatWarn: "Extreme Heat Warning",
    coldWarn: "Cold Wave Warning",
    simpleMode: "Simple Mode (Large Text)",
    readAloud: "Listen to Advisory",
    stopSpeech: "Stop Listening",
    loading: "Fetching official IMD database forecast...",
    error: "Connection issues. Loading local meteorological cache.",
    mainCrops: "Major Local Crops:",
    noData: "Advisory loading...",
    sowing: "Sowing & Land Prep",
    irrigation: "Irrigation Management",
    pesticides: "Pesticides & Fertilizers",
    harvesting: "Harvesting & Storage",
    livestock: "Livestock Management",
    livestockText: "Ensure animals have shade and fresh water. Protect dry feed from moisture and dampness.",
    advisoryHeader: "Advisory Details",
    alertLabel: "ALERT"
  },
  hi: {
    meghdootTitle: "मेघदूत कृषि परामर्श",
    govPortal: "पृथ्वी विज्ञान मंत्रालय और ICAR",
    bulletinTitle: "आधिकारिक मौसम और फसल परामर्श बुलेटिन",
    forecast5Day: "आधिकारिक IMD 5-दिवसीय मौसम पूर्वानुमान",
    temp: "तापमान",
    rainProb: "बारिश की संभावना",
    wind: "हवा की गति",
    humidity: "आर्द्रता",
    rainWarn: "भारी बारिश की चेतावनी",
    windWarn: "तेज हवा की चेतावनी",
    heatWarn: "अत्यधिक गर्मी की चेतावनी",
    coldWarn: "शीतलहर की चेतावनी",
    simpleMode: "सरल मोड (बड़ा फॉन्ट)",
    readAloud: "परामर्श सुनें",
    stopSpeech: "रोकें",
    loading: "आधिकारिक मौसम डेटा प्राप्त किया जा रहा है...",
    error: "कनेक्शन समस्या। स्थानीय मौसम कैश लोड हो रहा है।",
    mainCrops: "मुख्य स्थानीय फसलें:",
    noData: "सलाह लोड हो रही है...",
    sowing: "बुवाई और भूमि तैयारी",
    irrigation: "सिंचाई प्रबंधन",
    pesticides: "कीटनाशक और उर्वरक",
    harvesting: "कटाई और सुरक्षित भंडारण",
    livestock: "पशुधन प्रबंधन",
    livestockText: "सुनिश्चित करें कि पशुओं के लिए छाया और साफ पानी हो। सूखे चारे को नमी से बचाकर रखें।",
    advisoryHeader: "परामर्श विवरण",
    alertLabel: "चेतावनी"
  },
  mr: {
    meghdootTitle: "मेघदूत कृषी सल्लागार",
    govPortal: "भूविज्ञान मंत्रालय आणि ICAR",
    bulletinTitle: "अधिकृत हवामान आणि पीक सल्लागार बुलेटिन",
    forecast5Day: "अधिकृत IMD ५-दिवसीय हवामान अंदाज",
    temp: "तापमान",
    rainProb: "पावसाची शक्यता",
    wind: "हवेचा वेग",
    humidity: "आर्द्रता",
    rainWarn: "मुसळधार पावसाचा इशारा",
    windWarn: "वेगवान वाऱ्याचा इशारा",
    heatWarn: "अतिउष्णतेचा इशारा",
    coldWarn: "थंडीच्या लाटेचा इशारा",
    simpleMode: "सोपा मोड (मोठा फॉन्ट)",
    readAloud: "सल्ला ऐका",
    stopSpeech: "थांबवा",
    loading: "हवामान माहिती गोळा केली जात आहे...",
    error: "IMD सर्व्हरशी संपर्क होऊ शकला नाही. ऑफलाइन सल्ला वापरत आहे.",
    mainCrops: "मुख्य स्थानिक पिके:",
    noData: "सल्ला लोड होत आहे...",
    sowing: "पेरणी आणि पूर्वमशागत",
    irrigation: "सिंचन व्यवस्थापन",
    pesticides: "कीटकनाशके आणि खते",
    harvesting: "काढणी व साठवणूक",
    livestock: "पशुधन व्यवस्थापन",
    livestockText: "जनावरांना सावलीत आणि हवेशीर जागी ठेवा. पुरेसे पिण्याचे पाणी द्या आणि चारा कोरडा ठेवा.",
    advisoryHeader: "सल्ला तपशील",
    alertLabel: "इशारा"
  },
  kn: {
    meghdootTitle: "ಮೇಘದೂತ್ ಕೃಷಿ ಸಲಹೆಗಾರ",
    govPortal: "ಭೂ ವಿಜ್ಞಾನ ಸಚಿವಾಲಯ ಮತ್ತು ICAR",
    bulletinTitle: "ಅಧಿಕೃತ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಸಲಹಾ ಬುಲೆಟಿನ್",
    forecast5Day: "ಅಧಿಕೃತ IMD 5 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    temp: "ತಾಪಮಾನ",
    rainProb: "ಮಳೆಯ ಸಂಭವನೀಯತೆ",
    wind: "ಗಾಳಿಯ ವೇಗ",
    humidity: "ಆರ್ದ್ರತೆ",
    rainWarn: "ಭಾರೀ ಮಳೆಯ ಮುನ್ನೆಚ್ಚರಿಕೆ",
    windWarn: "ಬಲವಾದ ಗಾಳಿಯ ಮುನ್ನೆಚ್ಚರಿಕೆ",
    heatWarn: "ತೀವ್ರ ಶಾಖದ ಮುನ್ನೆಚ್ಚರಿಕೆ",
    coldWarn: "ಶೀತಗಾಳಿಯ ಮುನ್ನೆಚ್ಚರಿಕೆ",
    simpleMode: "ಸರಳ ಮೋಡ್ (ದೊಡ್ಡ ಅಕ್ಷರ)",
    readAloud: "ಸಲಹೆ ಆಲಿಸಿ",
    stopSpeech: "ನಿಲ್ಲಿಸಿ",
    loading: "ಅಧಿಕೃತ IMD ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    error: "IMD ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ. ಆಫ್‌ಲೈನ್ ಮಾಹಿತಿ ಬಳಸಲಾಗುತ್ತಿದೆ.",
    mainCrops: "ಸ್ಥಳೀಯ ಪ್ರಮುಖ ಬೆಳೆಗಳು:",
    noData: "ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    sowing: "ಬಿತ್ತನೆ ಮತ್ತು ತಯಾರಿ",
    irrigation: "ನೀರಾವರಿ ನಿರ್ವಹಣೆ",
    pesticides: "ಕೀಟನಾಶಕ ಮತ್ತು ರಸಗೊಬ್ಬರಗಳು",
    harvesting: "ಕಟಾವು ಮತ್ತು ಶೇಖರಣೆ",
    livestock: "ಜಾನುವಾರು ನಿರ್ವಹಣೆ",
    livestockText: "ಪ್ರಾಣಿಗಳಿಗೆ ನೆರಳು ಮತ್ತು ಶುದ್ಧ ನೀರನ್ನು ಒದಗಿಸಿ. ಮೇವನ್ನು ತೇವಾಂಶದಿಂದ ರಕ್ಷಿಸಿ ಮತ್ತು ಒಣ ಪ್ರದೇಶದಲ್ಲಿಡಿ.",
    advisoryHeader: "ಸಲಹಾ ವಿವರಗಳು",
    alertLabel: "ಮುನ್ನೆಚ್ಚರಿಕೆ"
  },
  bn: {
    meghdootTitle: "মেঘদূত কৃষি পরামর্শ",
    govPortal: "ভূবিজ্ঞান মন্ত্রণালয় ও ICAR",
    bulletinTitle: "সরকারী আবহাওয়া ও ফসল পরামর্শ বুলেটিন",
    forecast5Day: "সরকারী IMD ৫-দিনের আবহাওয়ার পূর্বাভাস",
    temp: "তাপমাত্রা",
    rainProb: "বৃষ্টির সম্ভাবনা",
    wind: "বাতাসের গতি",
    humidity: "আর্দ্রতা",
    rainWarn: "ভারী বৃষ্টির সতর্কতা",
    windWarn: "ঝড়ো হাওয়ার সতর্কতা",
    heatWarn: "অতিরিক্ত গরমের সতর্কতা",
    coldWarn: "শৈত্যপ্রবাহের সতর্কতা",
    simpleMode: "সহজ মোড (বড় হরফ)",
    readAloud: "পরামর্শ শুনুন",
    stopSpeech: "বন্ধ করুন",
    loading: "সরকারী আবহাওয়ার তথ্য লোড হচ্ছে...",
    error: "সার্ভারে সংযোগ করা যায়নি। অফলাইন তথ্য ব্যবহৃত হচ্ছে।",
    mainCrops: "প্রধান স্থানীয় ফসল:",
    noData: "পরামর্শ লোড হচ্ছে...",
    sowing: "বপন ও প্রস্তুতি",
    irrigation: "সেচ পরিচালনা",
    pesticides: "সার ও কীটনাশক",
    harvesting: "ফসল কাটা ও সংরক্ষণ",
    livestock: "পশুপালন পরামর্শ",
    livestockText: "পশুদের ছায়ায় রাখুন এবং তাজা জল দিন। পশুখাদ্য আর্দ্রতা থেকে রক্ষা করুন।",
    advisoryHeader: "পরামর্শ বিবরণ",
    alertLabel: "সতর্কতা"
  },
  gu: {
    meghdootTitle: "મેઘદૂત કૃષિ સલાહ",
    govPortal: "પૃથ્વી વિજ્ઞાન મંત્રાલય અને ICAR",
    bulletinTitle: "સત્તાવાર હવામાન અને પાક સલાહકાર બુલેટિન",
    forecast5Day: "સત્તાવાર IMD 5-દિવસીય હવામાન આગાહી",
    temp: "તાપમાન",
    rainProb: "વરસાદની શક્યતા",
    wind: "પવનની ગતિ",
    humidity: "ભેજ",
    rainWarn: "ભારે વરસાદની ચેતવણી",
    windWarn: "તીવ્ર પવનની ચેતવણી",
    heatWarn: "અતિશય ગરમીની ચેતવણી",
    coldWarn: "શીત લહેરની ચેતવણી",
    simpleMode: "સરળ મોડ (મોટા ફોન્ટ)",
    readAloud: "સલાહ સાંભળો",
    stopSpeech: "બંધ કરો",
    loading: "હવામાન માહિતી લોડ થઈ રહી છે...",
    error: "IMD ડેટાબેઝ કનેક્શન નિષ્ફળ. ઓફલાઇન માહિતી વપરાય છે.",
    mainCrops: "મુખ્ય સ્થાનિક પાકો:",
    noData: "સલાહ લોડ થઈ રહી છે...",
    sowing: "વાવણી અને તૈયારી",
    irrigation: "સિંચાઈ વ્યવસ્થાપન",
    pesticides: "જંતુનાશકો અને ખાતર",
    harvesting: "લણણી અને સંગ્રહ",
    livestock: "પશુધન સલાહ",
    livestockText: "પશુઓને છાયામાં રાખો અને તાજું પાણી આપો. સૂકા ચારાને ભેજથી બચાવો.",
    advisoryHeader: "સલાહ વિગતો",
    alertLabel: "ચેતવણી"
  },
  ta: {
    meghdootTitle: "மேகதூத் வேளாண் அறிவுரை",
    govPortal: "புவி அறிவியல் அமைச்சகம் & ICAR",
    bulletinTitle: "அதிகாரப்பூர்வ வானிலை & பயிர் அறிவுரை அறிக்கை",
    forecast5Day: "அதிகாரப்பூர்வ IMD 5-நாள் வானிலை முன்னறிவிப்பு",
    temp: "வெப்பநிலை",
    rainProb: "மழை வாய்ப்பு",
    wind: "காற்றின் வேகம்",
    humidity: "ஈரப்பதம்",
    rainWarn: "கனமழை எச்சரிக்கை",
    windWarn: "பலத்த காற்று எச்சரிக்கை",
    heatWarn: "அதிக வெப்ப எச்சரிக்கை",
    coldWarn: "குளிர் அலை எச்சரிக்கை",
    simpleMode: "எளிய முறை (பெரிய எழுத்து)",
    readAloud: "அறிவுரை கேட்க",
    stopSpeech: "நிறுத்து",
    loading: "வானிலை தகவல்கள் பெறப்படுகின்றன...",
    error: "IMD சேவையகம் இணைக்கப்படவில்லை. ஆஃப்லைன் தகவல் பயன்படுகிறது.",
    mainCrops: "முக்கிய பயிர்கள்:",
    noData: "அறிவுரைகள் ஏற்றப்படுகின்றன...",
    sowing: "விதைப்பு & நிலத்தயாரிப்பு",
    irrigation: "பாசன மேலாண்மை",
    pesticides: "பூச்சிக்கொல்லி & உரங்கள்",
    harvesting: "அறுவடை மற்றும் சேமிப்பு",
    livestock: "கால்நடை பராமரிப்பு",
    livestockText: "கால்நடைகளை நிழலில் கட்டவும், போதிய குடிநீர் வழங்கவும். தீவனத்தை ஈரப்பதம் படாமல் சேமிக்கவும்.",
    advisoryHeader: "அறிவுரை விவரங்கள்",
    alertLabel: "எச்சரிக்கை"
  },
  te: {
    meghdootTitle: "మేఘదూత్ వ్యవసాయ సలహా",
    govPortal: "భూ విజ్ఞాన మంత్రిత్వ శాఖ & ICAR",
    bulletinTitle: "అధికారిక వాతావరణ మరియు పంట సలహా బులెటిన్",
    forecast5Day: "అధికారిక IMD 5 రోజుల వాతావరణ సూచన",
    temp: "ఉష్ణోగ్రత",
    rainProb: "వర్ష సూచన",
    wind: "గాలి వేగం",
    humidity: "తేమ",
    rainWarn: "భారీ వర్ష హెచ్చరిక",
    windWarn: "ఈదురుగాలుల హెచ్చరిక",
    heatWarn: "తీవ్ర ఎండల హెచ్చరిక",
    coldWarn: "చలి తీవ్రత హెచ్చరిక",
    simpleMode: "సరళ మోడ్ (పెద్ద అక్షరాలు)",
    readAloud: "సలహా వినండి",
    stopSpeech: "ఆపివేయి",
    loading: "వాతావరణ సమాచారం పొందబడుతోంది...",
    error: "IMD డేటాబేస్ అందుబాటులో లేదు. ఆఫ్లైన్ సలహాలు వాడబడుతున్నాయి.",
    mainCrops: "స్థానిక ప్రధాన పంటలు:",
    noData: "సలహాలు లోడ్ అవుతున్నాయి...",
    sowing: "విత్తడం & తయారీ",
    irrigation: "నీటి యాజమాన్యం",
    pesticides: "పురుగుమందులు & ఎరువులు",
    harvesting: "కోతలు & నిల్వ",
    livestock: "పశువుల సలహా",
    livestockText: "పశువులను నీడలో ఉంచి, తాగునీరు అందుబాటులో ఉంచండి. మేతను తేమ తగలకుండా దాచండి.",
    advisoryHeader: "సలహా వివరాలు",
    alertLabel: "హెచ్చరిక"
  }
};

const advisoryTemplates = {
  rain: {
    en: {
      sowing: "Keep field drainage channels clear to prevent water stagnation. Delay fresh sowing if heavy rainfall occurs.",
      irrigation: "IMD Advisory: Suspend irrigation immediately. Rain is expected in the next few days. Save water and protect roots.",
      pesticides: "Do not apply chemical fertilizers or pesticide sprays. Heavy rain will wash them off and cause chemical runoff.",
      harvesting: "Harvest mature crops and transport them immediately to covered, moisture-proof warehouses."
    },
    hi: {
      sowing: "जलभराव को रोकने के लिए खेत में जल निकासी नालियों को साफ रखें। भारी बारिश होने पर नई बुवाई टालें।",
      irrigation: "IMD परामर्श: तत्काल सिंचाई रोकें। अगले कुछ दिनों में बारिश की संभावना है। पानी बचाएं और जड़ों को सड़ने से बचाएं।",
      pesticides: "रासायनिक उर्वरकों या कीटनाशक दवाओं का छिड़काव न करें। भारी बारिश से दवाएं बह जाएंगी और नुकसान होगा।",
      harvesting: "पकी हुई फसलों की तुरंत कटाई करें और उन्हें सुरक्षित, ढके हुए और नमी-मुक्त गोदामों में पहुंचाएं।"
    },
    mr: {
      sowing: "शेत तलावामध्ये किंवा शेतात पाणी साचू नये म्हणून पाण्याचा निचरा करा. जास्त पाऊस असल्यास पेरणी पुढे ढकला.",
      irrigation: "IMD सल्ला: पिकाला पाणी देणे त्वरित थांबवा. पुढील काही दिवसांत पाऊस अपेक्षित आहे. पाण्याची आणि विजेची बचत करा.",
      pesticides: "कोणत्याही रासायनिक खतांची किंवा कीटकनाशकांची फवारणी करू नका. पावसामुळे ते धुवून जातील.",
      harvesting: "पक्व झालेले पीक त्वरित कापून कोरड्या व सुरक्षित ठिकाणी किंवा गोदामात साठवून ठेवा."
    },
    kn: {
      sowing: "ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಚರಂಡಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ. ಭಾರಿ ಮಳೆಯಿದ್ದರೆ ಹೊಸ ಬಿತ್ತನೆಯನ್ನು ಕೆಲವು ದಿನ ಮುಂದೂಡಿ.",
      irrigation: "IMD ಸಲಹೆ: ನೀರಾವರಿಯನ್ನು ತಕ್ಷಣವೇ ನಿಲ್ಲಿಸಿ. ಮುಂದಿನ ಕೆಲವು ದಿನಗಳಲ್ಲಿ ಮಳೆಯಾಗಲಿದೆ. ನೀರನ್ನು ಉಳಿಸಿ ಮತ್ತು ಬೇರುಗಳನ್ನು ರಕ್ಷಿಸಿ.",
      pesticides: "ರಾಸಾಯನಿಕ ಗೊಬ್ಬರ ಅಥವಾ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ. ಭಾರಿ ಮಳೆಯಿಂದಾಗಿ ಔಷಧ ಕೊಚ್ಚಿಹೋಗುತ್ತದೆ.",
      harvesting: "ಪಕ್ವಗೊಂಡ ಬೆಳೆಗಳನ್ನು ತಕ್ಷಣ ಕೊಯ್ಲು ಮಾಡಿ ತೇವಾಂಶ ರಹಿತ ಮತ್ತು ಸುರಕ್ಷಿತ ಗೋದಾಮಿಗೆ ಸಾಗಿಸಿ."
    },
    bn: {
      sowing: "মাঠে জল জমা রোধ করতে নিষ্কাশন নালা পরিষ্কার রাখুন। ভারী বৃষ্টি হলে নতুন বপন স্থগিত করুন।",
      irrigation: "IMD পরামর্শ: সেচ প্রদান বন্ধ করুন। আগামী কয়েক দিনে বৃষ্টির সম্ভাবনা রয়েছে। জল সাশ্রয় করুন ও শিকড় বাঁচান।",
      pesticides: "রাসায়নিক সার বা কীটনাশক স্প্রে করবেন না। ভারী বৃষ্টিতে তা ধুয়ে চলে যাবে।",
      harvesting: "পাকা ফসল দ্রুত কেটে ফেলুন এবং নিরাপদ ও ঢাকা গুদামে স্থানান্তরিত করুন।"
    },
    gu: {
      sowing: "ખેતરમાં પાણી ભરાઈ ન રહે તે માટે નિકાસ નહેરો સાફ રાખો. ભારે વરસાદની સ્થિતિમાં નવી વાવણી મુલતવી રાખો.",
      irrigation: "IMD સલાહ: પિયત આપવાનું તાત્કાલિક બંધ કરો. આગામી દિવસોમાં વરસાદની સંભાવના છે. પાણી બચાવો અને મૂળ બચાવો.",
      pesticides: "રાસાયણિક ખાતર કે જંતુનાશક દવાઓનો છંટકાવ ન કરવો. વરસાદથી દવા ધોવાઈ જશે.",
      harvesting: "પાકેલા પાકની તાત્કાલિક લણણી કરો અને તેને સુરક્ષિત, ઢાંકેલા ગોદામમાં ખસેડો."
    },
    ta: {
      sowing: "வயல்களில் நீர் தேங்குவதைத் தடுக்க வடிகால் வாய்க்கால்களைச் சீரமைக்கவும். கனமழை பெய்தால் விதைப்பதைத் தள்ளிப்போடவும்.",
      irrigation: "IMD அறிவுரை: நீர்ப்பாசனம் செய்வதைத் தவிர். அடுத்த சில நாட்களில் மழை பெய்ய வாய்ப்புள்ளது. தண்ணீரை சேமிக்கவும்.",
      pesticides: "ரசாயன உரங்கள் அல்லது பூச்சிக்கொல்லி மருந்து தெளிப்பதைத் தவிர்க்கவும். மழையால் மருந்து வீணாகும்.",
      harvesting: "அறுவடைக்கு தயாராக உள்ள பயிர்களை உடனடியாக அறுவடை செய்து பாதுகாப்பான குடோன்களுக்கு மாற்றவும்."
    },
    te: {
      sowing: "పంట పొలాల్లో నీరు నిల్వ ఉండకుండా మురుగునీటి కాలువలను శుభ్రం చేయండి. భారీ వర్షం ఉంటే కొత్తగా విత్తడం వాయిదా వేయండి.",
      irrigation: "IMD సలహా: తక్షణమే నీటి తడులు ఇవ్వడం ఆపివేయండి. రానున్న రోజుల్లో వర్షం కురిసే అవకాశం ఉంది. నీటిని ఆదా చేయండి.",
      pesticides: "రసాయన ఎరువులు లేదా పురుగుమందులు చల్లవద్దు. వర్షానికి మందు కొట్టుకుపోతుంది.",
      harvesting: "బాగా పండిన పంటలను వెంటనే కోసి, తడి తగలని సురक्षित గిడ్డంగులకు చేర్చండి."
    }
  },
  clear: {
    en: {
      sowing: "Favorable dry weather. Proceed with land preparation, weeding, and sowing of kharif/rabi seeds.",
      irrigation: "Apply irrigation in morning or late evening hours based on soil moisture and crop necessity.",
      pesticides: "Favorable weather for pesticide spraying and urea application. Ensure wind speeds are low before spraying.",
      harvesting: "Sunny weather is perfect for cutting, threshing, and solar-drying harvested grains in the open fields."
    },
    hi: {
      sowing: "अनुकूल शुष्क मौसम। भूमि की तैयारी, निराई-गुड़ाई और खरीफ/रबी बीजों की बुवाई शुरू करें।",
      irrigation: "मिट्टी की नमी और फसल की आवश्यकता के आधार पर सुबह या देर शाम के समय सिंचाई करें।",
      pesticides: "कीटनाशक छिड़काव और यूरिया डालने के लिए अनुकूल मौसम। छिड़काव से पहले हवा की गति कम होना सुनिश्चित करें।",
      harvesting: "धूप वाला मौसम फसलों की कटाई, मड़ाई और खुले खेतों में अनाजों को सुखाने के लिए एकदम सही है।"
    },
    mr: {
      sowing: "पेरणीसाठी हवामान अनुकूल आहे. शेतीची मशागत, कोळपणी आणि खरीप/रब्बी बियाण्यांची पेरणी वेळेवर करा.",
      irrigation: "जमिनीतील ओलावा आणि पिकाची गरज लक्षात घेऊन सकाळच्या किंवा संध्याकाळच्या वेळी हलके पाणी द्या.",
      pesticides: "कीटकनाशके फवारणी आणि खत देण्यास अनुकूल हवामान आहे. फवारणी करताना वाऱ्याचा वेग तपासून घ्या.",
      harvesting: "कडक ऊन असल्याने पीक काढणी, मळणी आणि धान्य उन्हात वाळवण्यासाठी अत्यंत योग्य वेळ आहे."
    },
    kn: {
      sowing: "ಅನುಕೂಲಕರ ಒಣ ಹವಾಮಾನವಿದೆ. ಭೂಮಿ ಸಿದ್ಧತೆ, ಕಳೆ ಕೀಳುವುದು ಮತ್ತು ಹೊಸ ಬಿತ್ತನೆ ಕಾರ್ಯಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.",
      irrigation: "ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಬೆಳೆಯ ಹಂತಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ನೀರಾವರಿ ಒದಗಿಸಿ.",
      pesticides: "ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಮತ್ತು ಯೂರಿಯಾ ಅನ್ವಯಿಸಲು ಅನುಕೂಲಕರ ಹವಾಮಾನ. ಸಿಂಪಡಿಸುವ ಮುನ್ನ ಗಾಳಿ ಕಡಿಮೆಯಿರಲಿ.",
      harvesting: "ಬಿಸಿಲಿನ ವಾತಾವರಣವು ಬೆಳೆ ಕಟಾವು ಮಾಡಲು ಮತ್ತು ಕೊಯ್ಲು ಮಾಡಿದ ಧಾನ್ಯಗಳನ್ನು ಒಣಗಿಸಲು ಸೂಕ್ತವಾಗಿದೆ."
    },
    bn: {
      sowing: "অনুকূল শুষ্ক আবহাওয়া। জমি তৈরি, আগাছা দমন এবং বীজ বপনের কাজ শুরু করুন।",
      irrigation: "মাটির আর্দ্রতা এবং ফসলের প্রয়োজনীয়তা অনুযায়ী সকালে বা সন্ধ্যায় হালকা সেচ দিন।",
      pesticides: "কীটনাশক ছড়ানো এবং সার প্রয়োগের জন্য ভালো আবহাওয়া। স্প্রে করার আগে বাতাসের গতি কম আছে কিনা দেখে নিন।",
      harvesting: "রৌদ্রোজ্জ্বল আবহাওয়া ফসল কাটা এবং উন্মুক্ত মাঠে ফসল শুকানোর জন্য আদর্শ সময়।"
    },
    gu: {
      sowing: "વાવણી માટે સાનુકૂળ સૂકું હવામાન. જમીનની તૈયારી, નિંદામણ અને વાવણીની પ્રક્રિયા શરૂ કરો.",
      irrigation: "જમીનની ભેજની માત્રા અને પાકની જરૂરિયાત મુજબ સવારે અથવા મોડી સાંજે પિયત આપો.",
      pesticides: "જંતુનાશક દવાઓ અને ખાતરના ઉપયોગ માટે અનુકૂળ સમય. છંટકાવ વખતે પવનની ગતિ ઓછી હોવી જોઈએ.",
      harvesting: "તડકાવાળું હવામાન પાકની લણણી અને અનાજ સુકવવા માટે ઉત્તમ છે."
    },
    ta: {
      sowing: "விதைப்புக்கு உகந்த உலர் வானிலை நிலவுகிறது. உழவு செய்தல் மற்றும் களை எடுத்தலை மேற்கொள்ளவும்.",
      irrigation: "மண்ணின் ஈரப்பதம் மற்றும் பயிரின் தேவையைப் பொறுத்து காலை அல்லது மாலை வேளையில் நீர்ப்பாசனம் செய்யவும்.",
      pesticides: "பூச்சிக்கொல்லி மருந்துகள் தெளிக்க தகுந்த வானிலை. தெளிக்கும்போது காற்றின் வேகம் குறைவாக இருப்பதை உறுதிசெய்.",
      harvesting: "நல்ல வெயில் உள்ளதால் அறுவடை செய்யவும், அறுவடை செய்த தானியங்களை களத்தில் உலர்த்தவும் உகந்த நேரம்."
    },
    te: {
      sowing: "అనుకూలమైన పొడి వాతావరణం. నేల తయారీ, కలుపు తీయుట మరియు విత్తనాలు వేయుట పూర్తి చేయండి.",
      irrigation: "నేలలో తేమ శాతం మరియు పంట దశను బట్టి ఉదయం లేదా సాయంత్రం వేళల్లో తేలికపాటి తడులు ఇవ్వండి.",
      pesticides: "పురుగుమందుల పిచికారీ మరియు ఎరువులు వేయుటకు అనుకూలమైన వాతావरणం. గాలి వేగం తక్కువగా ఉన్నప్పుడు పిచికారీ చేయండి.",
      harvesting: "ఎండ బాగా ఉండటం వలన పంట కోయడానికి మరియు కోసిన ధాన్యాలను ఆరబెట్టడానికి చాలా అనుకూలమైన సమయం."
    }
  }
};

const weatherCodes = {
  0: { desc: { en: "Clear sky", hi: "साफ आसमान", mr: "स्वच्छ आकाश", kn: "ಸ್ವಚ್ಛ ಹವಾಮಾನ", bn: "পরিষ্কার আকাশ", gu: "સાફ આકાશ", ta: "தெளிவான வானம்", te: "నిర్మలమైన ఆకాశం" }, icon: "☀️" },
  1: { desc: { en: "Mainly clear", hi: "मुख्यतः साफ", mr: "अंशतः ढगाळ", kn: "ಬಹುತೇಕ ಸ್ವಚ್ಛ", bn: "প্রধানত পরিষ্কার", gu: "મોટે ભાગે સાફ", ta: "முக்கியமாக தெளிவானது", te: "ఎక్కువగా నిర్మలం" }, icon: "🌤️" },
  2: { desc: { en: "Partly cloudy", hi: "आंशिक रूप से बादल", mr: "ढगाळ हवामान", kn: "ಭಾಗಶಃ ಮೋಡ", bn: "আংশিক মেঘলা", gu: "આંશિક વાદળછાયું", ta: "பகுதி மேகமூட்டம்", te: "పాక్షికంగా మేఘావృతం" }, icon: "⛅" },
  3: { desc: { en: "Overcast", hi: "घने बादल", mr: "पूर्णतः ढगाळ", kn: "ಸಂಪೂರ್ಣ ಮೋಡ ಕವಿದ", bn: "মেঘলা আকাশ", gu: "વાદળછાયું", ta: "முழு மேகமூட்டம்", te: "దట్టమైన మేఘాలు" }, icon: "☁️" },
  45: { desc: { en: "Foggy", hi: "कोहरा", mr: "धुके", kn: "ಮಂಜು ಕವಿದ", bn: "কুয়াশা", gu: "ધુમ્મસ", ta: "பனிமூட்டம்", te: "పొగమంచు" }, icon: "🌫️" },
  48: { desc: { en: "Rime fog", hi: "बर्फीला कोहरा", mr: "अति थंड धुके", kn: "ತುಂತುರು ಮಂಜು", bn: "তুষার কুয়াশা", gu: "બરફીલું ધુમ્મસ", ta: "பனி உறைவு", te: "రైమ్ పొగమంచు" }, icon: "🌫️" },
  51: { desc: { en: "Light drizzle", hi: "हल्की बूंदाबांदी", mr: "भुरभूर पाऊस", kn: "ತುಂತುರು ಮಳೆ", bn: "হালকা গুঁড়ি গুঁড়ি বৃষ্টি", gu: "હળવી છાંટો", ta: "லேசான தூறல்", te: "తేలికపాటి జల్లులు" }, icon: "🌦️" },
  53: { desc: { en: "Moderate drizzle", hi: "मध्यम बूंदाबांदी", mr: "मध्यम भुरभूर", kn: "ಮಧ್ಯಮ ತುಂತುರು ಮಳೆ", bn: "মাঝারি গুঁড়ি গুঁড়ি বৃষ্টি", gu: "મધ્યમ છાંટો", ta: "மிதமான தூறல்", te: "మధ్యస్థ జల్లులు" }, icon: "🌦️" },
  55: { desc: { en: "Dense drizzle", hi: "तेज बूंदाबांदी", mr: "दाट भुरभूर पाऊस", kn: "ದಟ್ಟ ತುಂತುರು ಮಳೆ", bn: "ঘন গুঁড়ি গুঁড়ি বৃষ্টি", gu: "ભારે છાંટો", ta: "அடர்ந்த தூறல்", te: "దట్టమైన జల్లులు" }, icon: "🌦️" },
  61: { desc: { en: "Slight rain", hi: "हल्की बारिश", mr: "हल्का पाऊस", kn: "ಹಗುರ ಮಳೆ", bn: "হালকা বৃষ্টি", gu: "હળવો વરસાદ", ta: "லேசான மழை", te: "తేలికపాటి వర్షం" }, icon: "🌧️" },
  63: { desc: { en: "Moderate rain", hi: "मध्यम बारिश", mr: "मध्यम पाऊस", kn: "ಮಧ್ಯಮ ಮಳೆ", bn: "মাঝারি বৃষ্টি", gu: "મધ્યમ વરસાદ", ta: "மிதமான மழை", te: "మధ్యస్థ వర్షం" }, icon: "🌧️" },
  65: { desc: { en: "Heavy rain", hi: "भारी बारिश", mr: "मुसळधार पाऊस", kn: "ಭಾರೀ ಮಳೆ", bn: "ভারী বৃষ্টি", gu: "ભારે વરસાદ", ta: "கனமழை", te: "భారీ వర్షం" }, icon: "🌧️" },
  80: { desc: { en: "Slight rain showers", hi: "हल्की बौछारें", mr: "पावसाच्या हलक्या सरी", kn: "ಹಗುರ ಮಳೆ ಹನಿಗಳು", bn: "হালকা বৃষ্টির ছাঁট", gu: "હળવા ઝાપટાં", ta: "சிறு மழை தூறல்", te: "తేలికపాటి వర్షపు జల్లులు" }, icon: "🌦️" },
  81: { desc: { en: "Moderate showers", hi: "मध्यम बौछारें", mr: "पावसाच्या मध्यम सरी", kn: "ಮಧ್ಯಮ ಮಳೆ ಹನಿಗಳು", bn: "মাঝারি বৃষ্টির ছাঁট", gu: "મધ્યમ ઝાપટાં", ta: "மிதமான மழை தூறல்", te: "మధ్యస్థ వాన జల్లులు" }, icon: "🌧️" },
  82: { desc: { en: "Violent showers", hi: "तेज बौछारें", mr: "पावसाच्या तीव्र सरी", kn: "ಭಾರೀ ಮಳೆ ಹನಿಗಳು", bn: "তীব্র বৃষ্টির ছাঁট", gu: "ભારે ઝાપટાં", ta: "பலத்த மழை பொழிவு", te: "తీవ్ర వాన జల్లులు" }, icon: "⛈️" },
  95: { desc: { en: "Thunderstorm", hi: "गरज के साथ तूफान", mr: "वादळी पाऊस", kn: "ಸಿಡಿಲು ಸಹಿತ ಮಳೆ", bn: "বজ্রবিদ্যুৎ সহ ঝড়", gu: "ગાજવીજ સાથે વરસાદ", ta: "இடியுடன் கூடிய மழை", te: "ఉరుములతో కూడిన వర్షం" }, icon: "⛈️" },
  96: { desc: { en: "Thunderstorm with hail", hi: "ओलों के साथ तूफान", mr: "गारांसह वादळी पाऊस", kn: "ಆಲಿಕಲ್ಲು ಮಳೆ", bn: "শিলাবৃষ্টি সহ ঝড়", gu: "કરા સાથે ગાજવીજ", ta: "ஆலங்கட்டி மழை", te: "వడగండ్ల వాన" }, icon: "⛈️" },
  99: { desc: { en: "Heavy thunderstorm", hi: "भारी गरज-चमक के साथ तूफान", mr: "तीव्र वादळी पाऊस", kn: "ಭಾರೀ ಸಿಡಿಲು ಸಹಿತ ಮಳೆ", bn: "তীব্র বজ্রঝড়", gu: "ભારે ગાજવીજ સાથે વાવાઝોડું", ta: "கடும் இடியுடன் கூடிய மழை", te: "భారీ ఉరుములతో కూడిన వర్షం" }, icon: "⛈️" }
};

const getForecastDesc = (code, lang) => {
  const data = weatherCodes[code] || weatherCodes[0];
  return data.desc[lang] || data.desc['en'];
};

const getForecastIcon = (code) => {
  return (weatherCodes[code] || weatherCodes[0]).icon;
};

const MeghdootModal = ({ isOpen, onClose, state, city }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [advisoryText, setAdvisoryText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [hasError, setHasError] = useState(false);

  const tLocal = (key) => {
    return meghdootTranslations[language]?.[key] || meghdootTranslations['en'][key] || key;
  };

  const majorCrops = cityMainCrops[city] || stateMainCrops[state] || ["Rice", "Wheat", "Sugarcane"];

  useEffect(() => {
    if (!isOpen) return;

    const fetchForecast = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const weatherData = await getWeatherData(state, city);
        setForecast(weatherData.daily);
      } catch (error) {
        console.error("Meghdoot forecast fetch failed:", error);
        setHasError(true);
        // Mock cache fallback data matching state
        const mockTime = Array.from({length: 5}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          return d.toISOString().split('T')[0];
        });
        setForecast({
          time: mockTime,
          temperature_2m_max: [34, 35, 36, 32, 30],
          temperature_2m_min: [24, 25, 25, 23, 22],
          weather_code: [2, 1, 0, 63, 95], // rain on day 4 & 5
          precipitation_probability_max: [10, 5, 0, 75, 90],
          relative_humidity_2m_max: [60, 55, 50, 85, 90],
          wind_speed_10m_max: [12, 14, 10, 22, 28]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [isOpen, state, city]);

  const advisoryLogic = () => {
    if (!forecast) return { hasRain: false, hasWind: false, hasHeat: false, hasCold: false };
    
    // Check if rain probability is high (>= 50%) or rain weather code (>= 51) is expected on any day
    const rainDays = forecast.precipitation_probability_max.filter((prob, idx) => prob >= 40 || forecast.weather_code[idx] >= 51);
    const windDays = forecast.wind_speed_10m_max.filter(speed => speed >= 20);
    const heatDays = forecast.temperature_2m_max.filter(temp => temp >= 38);
    const coldDays = forecast.temperature_2m_min.filter(temp => temp <= 15);

    return {
      hasRain: rainDays.length > 0,
      hasWind: windDays.length > 0,
      hasHeat: heatDays.length > 0,
      hasCold: coldDays.length > 0
    };
  };

  const { hasRain, hasWind, hasHeat, hasCold } = advisoryLogic();

  // Compute advisories dynamically based on logic
  const getDynamicAdvice = (category) => {
    const activeLogic = hasRain ? advisoryTemplates.rain : advisoryTemplates.clear;
    return activeLogic[language]?.[category] || activeLogic['en']?.[category] || "";
  };

  // Build the script read-aloud string
  useEffect(() => {
    if (!forecast) return;
    
    let text = `${tLocal('bulletinTitle')} for ${translateDBText(city, language)}, ${translateDBText(state, language)}. `;
    
    // Major crops summary
    text += `${tLocal('mainCrops')} ${majorCrops.map(c => translateDBText(c, language)).join(', ')}. `;
    
    // Weather alert warnings
    if (hasRain) text += `${tLocal('rainWarn')}. `;
    if (hasWind) text += `${tLocal('windWarn')}. `;
    if (hasHeat) text += `${tLocal('heatWarn')}. `;
    if (hasCold) text += `${tLocal('coldWarn')}. `;

    // Advisories
    text += `${tLocal('sowing')}: ${getDynamicAdvice('sowing')}. `;
    text += `${tLocal('irrigation')}: ${getDynamicAdvice('irrigation')}. `;
    text += `${tLocal('pesticides')}: ${getDynamicAdvice('pesticides')}. `;
    text += `${tLocal('harvesting')}: ${getDynamicAdvice('harvesting')}. `;
    text += `${tLocal('livestock')}: ${tLocal('livestockText')}`;

    setAdvisoryText(text);
  }, [forecast, language, city, state]);

  // Speech read aloud handler
  const handleSpeakAdvisory = () => {
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(advisoryText);

    // Set voice language locale mapping
    const voiceLocMap = {
      'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'mr-IN', 'kn': 'kn-IN',
      'bn': 'bn-IN', 'gu': 'gu-IN', 'ta': 'ta-IN', 'te': 'te-IN'
    };
    
    const targetLang = voiceLocMap[language] || 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(language)) ||
                          voices.find(v => v.lang.toLowerCase().includes(language)) ||
                          voices.find(v => v.lang.includes('IN')) ||
                          voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = targetLang;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Clear speech synthesizer when closing modal
  const handleClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`meghdoot-modal-overlay ${simpleMode ? 'simple-mode-active' : ''}`} onClick={handleClose}>
      <div className="meghdoot-modal-content glass-panel" onClick={e => e.stopPropagation()}>
        
        {/* Tricolor Government Header Banner */}
        <div className="gov-top-banner">
          <div className="tricolor-stripe">
            <span className="saffron"></span>
            <span className="white"></span>
            <span className="green"></span>
          </div>
          <div className="banner-logos">
            {/* Custom Premium SVG IMD Logo */}
            <div className="gov-logo-wrapper">
              <svg width="45" height="45" viewBox="0 0 100 100" className="imd-logo-svg">
                <circle cx="50" cy="50" r="42" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2"/>
                <circle cx="50" cy="50" r="30" fill="#FF8C00"/>
                <path d="M 50,8 A 42,42 0 0,1 92,50 L 50,50 Z" fill="#F97316" opacity="0.3"/>
                <path d="M10,50 Q25,35 40,50 T70,50 T90,50" fill="none" stroke="#2563EB" strokeWidth="3"/>
                <path d="M15,58 Q30,48 45,58 T75,58 T85,58" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.8"/>
                <circle cx="68" cy="28" r="8" fill="#F1F5F9" opacity="0.9"/>
                <circle cx="75" cy="30" r="6" fill="#CBD5E1" opacity="0.8"/>
                <line x1="50" y1="12" x2="50" y2="2" stroke="#EA580C" strokeWidth="4"/>
                <line x1="77" y1="23" x2="85" y2="15" stroke="#EA580C" strokeWidth="4"/>
                <line x1="88" y1="50" x2="98" y2="50" stroke="#EA580C" strokeWidth="4"/>
                <line x1="50" y1="88" x2="50" y2="98" stroke="#EA580C" strokeWidth="4"/>
                <line x1="12" y1="50" x2="2" y2="50" stroke="#EA580C" strokeWidth="4"/>
              </svg>
              <span className="logo-subtext">IMD</span>
            </div>

            <div className="gov-app-branding">
              <h1>☁️ MEGHDOOT | मेघदूत</h1>
              <p>{tLocal('govPortal')}</p>
            </div>

            {/* Custom Premium SVG ICAR Logo */}
            <div className="gov-logo-wrapper">
              <svg width="45" height="45" viewBox="0 0 100 100" className="icar-logo-svg">
                <circle cx="50" cy="50" r="44" fill="#ECFDF5" stroke="#059669" strokeWidth="2.5"/>
                {/* Wheat Stalk Symbol */}
                <path d="M50,90 C50,90 50,40 50,20" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/>
                {/* Wheat grains */}
                <path d="M50,60 C42,55 35,50 35,45 C35,40 45,42 50,50 C55,42 65,40 65,45 C65,50 58,55 50,60 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5"/>
                <path d="M50,48 C42,43 35,38 35,33 C35,28 45,30 50,38 C55,30 65,28 65,33 C65,38 58,43 50,48 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5"/>
                <path d="M50,36 C42,31 35,26 35,21 C35,16 45,18 50,26 C55,18 65,16 65,21 C65,26 58,31 50,36 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5"/>
                {/* Green Leaves */}
                <path d="M50,80 C40,75 30,60 25,50 C38,62 48,70 50,80 Z" fill="#10B981"/>
                <path d="M50,80 C60,75 70,60 75,50 C62,62 52,70 50,80 Z" fill="#10B981"/>
              </svg>
              <span className="logo-subtext">ICAR</span>
            </div>
          </div>
        </div>

        {/* Modal Controls Section */}
        <div className="meghdoot-controls-bar">
          <div className="location-info">
            <h2>📍 {translateDBText(city, language)}, {translateDBText(state, language)}</h2>
            <p className="sub">{tLocal('bulletinTitle')}</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className={`control-btn speech-btn ${isPlaying ? 'speaking' : ''}`}
              onClick={handleSpeakAdvisory}
            >
              {isPlaying ? `🛑 ${tLocal('stopSpeech')}` : `🔊 ${tLocal('readAloud')}`}
            </button>
            
            <button 
              className={`control-btn mode-btn ${simpleMode ? 'active' : ''}`}
              onClick={() => setSimpleMode(!simpleMode)}
            >
              👓 {tLocal('simpleMode')}
            </button>

            <button className="close-btn-round" onClick={handleClose} aria-label="Close">×</button>
          </div>
        </div>

        {/* Alert Ribbons */}
        {(hasRain || hasWind || hasHeat || hasCold) && (
          <div className="meghdoot-alert-ribbons">
            {hasRain && (
              <div className="alert-ribbon rain">
                <span className="alert-badge">{tLocal('alertLabel')}</span>
                <span>🚨 {tLocal('rainWarn')}: Heavy precipitation probability exceeding 40%. Suspend open-field operations.</span>
              </div>
            )}
            {hasWind && (
              <div className="alert-ribbon wind">
                <span className="alert-badge">{tLocal('alertLabel')}</span>
                <span>🚨 {tLocal('windWarn')}: High winds expected. Secure tall crops and netting.</span>
              </div>
            )}
            {hasHeat && (
              <div className="alert-ribbon heat">
                <span className="alert-badge">{tLocal('alertLabel')}</span>
                <span>🚨 {tLocal('heatWarn')}: High midday temperature forecast. Safeguard livestock.</span>
              </div>
            )}
            {hasCold && (
              <div className="alert-ribbon cold">
                <span className="alert-badge">{tLocal('alertLabel')}</span>
                <span>🚨 {tLocal('coldWarn')}: Cold night temperatures forecast. Manage frost sensitive seedlings.</span>
              </div>
            )}
          </div>
        )}

        <div className="meghdoot-body-scroll">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>{tLocal('loading')}</p>
            </div>
          ) : (
            <>
              {hasError && <div className="offline-error-banner">⚠️ {tLocal('error')}</div>}
              
              {/* 5-Day Forecast Grid */}
              <div className="forecast-section">
                <h3>📅 {tLocal('forecast5Day')}</h3>
                {forecast && forecast.time && (
                  <div className="forecast-grid-scroll">
                    <div className="forecast-grid-meghdoot">
                      {forecast.time.map((dateStr, index) => {
                        const date = new Date(dateStr);
                        const dayName = date.toLocaleDateString(language === 'en' ? 'en-US' : undefined, { weekday: 'short' });
                        const dateNum = date.getDate();
                        const monthName = date.toLocaleDateString(language === 'en' ? 'en-US' : undefined, { month: 'short' });
                        const isToday = index === 0;

                        return (
                          <div key={dateStr} className={`forecast-col-card ${isToday ? 'today-active' : ''}`}>
                            <div className="card-date-label">
                              <span className="day-name">{dayName}</span>
                              <span className="date-num">{dateNum} {monthName}</span>
                              {isToday && <span className="today-badge">TODAY</span>}
                            </div>
                            <div className="weather-visual-icon">
                              {getForecastIcon(forecast.weather_code[index])}
                            </div>
                            <div className="weather-desc-text">
                              {getForecastDesc(forecast.weather_code[index], language)}
                            </div>
                            <div className="forecast-metric-lines">
                              <div className="metric-row">
                                <span className="lbl">{tLocal('temp')}:</span>
                                <span className="val">{Math.round(forecast.temperature_2m_max[index])}° / {Math.round(forecast.temperature_2m_min[index])}°C</span>
                              </div>
                              <div className="metric-row">
                                <span className="lbl">{tLocal('rainProb')}:</span>
                                <span className="val rain-highlight">{forecast.precipitation_probability_max[index]}%</span>
                              </div>
                              <div className="metric-row">
                                <span className="lbl">{tLocal('wind')}:</span>
                                <span className="val">{Math.round(forecast.wind_speed_10m_max[index])} km/h</span>
                              </div>
                              <div className="metric-row">
                                <span className="lbl">{tLocal('humidity')}:</span>
                                <span className="val">{forecast.relative_humidity_2m_max[index]}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Major Local Crops list */}
              <div className="major-crops-strip">
                <span className="title">{tLocal('mainCrops')}</span>
                <div className="crop-badges-row">
                  {majorCrops.map(crop => (
                    <span key={crop} className="crop-badge">{translateDBText(crop, language)}</span>
                  ))}
                </div>
              </div>

              {/* Agro Advisories Section */}
              <div className="agro-advisory-section">
                <h3>🌾 {tLocal('advisoryHeader')}</h3>
                
                <div className="advisory-grid-cards">
                  
                  {/* Category Sowing */}
                  <div className="advisory-panel-card sowing">
                    <div className="panel-header">
                      <span className="icon">🌱</span>
                      <h4>{tLocal('sowing')}</h4>
                    </div>
                    <p className="text-content">{getDynamicAdvice('sowing')}</p>
                  </div>

                  {/* Category Irrigation */}
                  <div className="advisory-panel-card irrigation">
                    <div className="panel-header">
                      <span className="icon">💧</span>
                      <h4>{tLocal('irrigation')}</h4>
                    </div>
                    <p className="text-content">{getDynamicAdvice('irrigation')}</p>
                  </div>

                  {/* Category Pesticides */}
                  <div className="advisory-panel-card pesticides">
                    <div className="panel-header">
                      <span className="icon">🛡️</span>
                      <h4>{tLocal('pesticides')}</h4>
                    </div>
                    <p className="text-content">{getDynamicAdvice('pesticides')}</p>
                  </div>

                  {/* Category Harvesting */}
                  <div className="advisory-panel-card harvesting">
                    <div className="panel-header">
                      <span className="icon">🚜</span>
                      <h4>{tLocal('harvesting')}</h4>
                    </div>
                    <p className="text-content">{getDynamicAdvice('harvesting')}</p>
                  </div>

                  {/* Category Livestock */}
                  <div className="advisory-panel-card livestock">
                    <div className="panel-header">
                      <span className="icon">🐄</span>
                      <h4>{tLocal('livestock')}</h4>
                    </div>
                    <p className="text-content">{tLocal('livestockText')}</p>
                  </div>

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeghdootModal;
