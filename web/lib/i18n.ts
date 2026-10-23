// Complete Multilingual Localization Dictionary for KisanMitra
// Supporting English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, Punjabi

export type Locale = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn' | 'pa';

export interface DashboardTranslations {
  cropTitle: string;
  changeCrop: string;
  changeMarket: string;
  modalPriceLabel: string;
  modalPriceValue: string;
  perQuintal: string;
  forecastDaysLabel: string;
  forecastDaysValue: string;
  forecastRange: string;
  bestMarketLabel: string;
  bestMarketValue: string;
  bestMarketSub: string;
  adviceLabel: string;
  adviceVerdict: string;
  adviceSub: string;

  priceForecastTitle: string;
  priceForecastSampleNote: string;
  todayLabel: string;

  bestMarketsTitle: string;
  tableMarket: string;
  tableDistance: string;
  tableNet: string;
  tableFooterNote: string;

  soilTitle: string;
  soilSubtitle: string;
  soilCrops: string[];

  fertilizerTitle: string;
  fertilizerApproved: string;
  fertilizerStages: string[];
  requestFromStore: string;

  askTitle: string;
  askSubtitle: string;
  askPlaceholder: string;

  footerDisclaimer: string;
}

export interface Translations {
  appName: string;
  tagline: string;
  subtagline: string;
  nav: {
    dashboard: string;
    prices: string;
    forecast: string;
    markets: string;
    soil: string;
    store: string;
    chat: string;
    alerts: string;
    admin: string;
    login: string;
    settings: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrices: string;
    ctaStore: string;
    ctaChat: string;
    linkWhatsApp: string;
  };
  features: {
    mandiTitle: string;
    mandiDesc: string;
    forecastTitle: string;
    forecastDesc: string;
    storeTitle: string;
    storeDesc: string;
    soilTitle: string;
    soilDesc: string;
    whatsappTitle: string;
    whatsappDesc: string;
  };
  store: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterSeeds: string;
    filterFertilizers: string;
    filterPesticides: string;
    requestBtn: string;
    inStock: string;
    expertApproved: string;
    khaatScheduleTitle: string;
    adjustedSoilBadge: string;
  };
  prices: {
    title: string;
    subtitle: string;
    modalPrice: string;
    minPrice: string;
    maxPrice: string;
    arrivals: string;
    sellOrWaitTitle: string;
    verdictSell: string;
    verdictWait: string;
  };
  chat: {
    title: string;
    placeholder: string;
    send: string;
    voiceBtn: string;
    listening: string;
    speaking: string;
    disclaimer: string;
    talkToExpert: string;
  };
  dashboard: DashboardTranslations;
  common: {
    selectCropTitle: string;
    selectMarketTitle: string;
    close: string;
    apply: string;
    rupeePerQuintal: string;
    rupeePerPack: string;
    approvedByExpert: string;
    disclaimerDecision: string;
  };
}

const enTranslations: Translations = {
  appName: 'AgriPulse',
  tagline: 'The Farmer’s Trusted Digital Agricultural Advisor',
  subtagline: 'Real-time Mandi rates, scientific fertilizer schedules, AI chatbot & products right on your phone.',
  nav: {
    dashboard: 'Dashboard',
    prices: 'Prices',
    forecast: 'Forecast',
    markets: 'Markets',
    soil: 'Soil',
    store: 'Store',
    chat: 'Chat',
    alerts: 'Alerts',
    admin: 'Agronomist',
    login: 'Login',
    settings: 'Settings'
  },
  hero: {
    badge: '🌾 100% Free Open Digital Public Good',
    title: 'Precision Mandi Intelligence, Smart Storage & Crop Care',
    subtitle: 'Live APMC market arrivals, 14-day ML price predictions, ICAR-approved fertilizer regimens, and 24x7 WhatsApp voice advisory.',
    ctaPrices: 'Check Live Mandi Prices',
    ctaStore: 'Explore Store & Fertilizer Plans',
    ctaChat: 'Ask AI Assistant with Voice',
    linkWhatsApp: 'Link WhatsApp'
  },
  features: {
    mandiTitle: 'Live APMC Mandi Rates',
    mandiDesc: 'Min, max, and modal prices across Indian mandis with 90-day trend lines and seasonal arrival patterns.',
    forecastTitle: '14 & 30-Day ML Price Forecasts',
    forecastDesc: 'Probabilistic p10, p50, and p90 price forecasting with explainable SHAP market drivers and risk warnings.',
    storeTitle: 'Farm Inputs & Fertilizer Schedule',
    storeDesc: 'Growth-stage khaat dosages (Basal, 30 days, 60 days) dynamically customized to Soil Health Card data.',
    soilTitle: 'Soil Health & Crop Matching',
    soilDesc: 'Satellite soil texture & pH evaluation coupled with Soil Health Card override for top 5 lucrative crops.',
    whatsappTitle: 'WhatsApp & Telegram Bots',
    whatsappDesc: 'Query in any Indian language with voice notes or text. Receive localized spoken audio responses.'
  },
  store: {
    title: 'KisanMitra Agri Store & Fertilizer Plans',
    subtitle: 'Certified Seeds, Nano Fertilizers & Crop Protection with Direct Enquiry Flow',
    filterAll: 'All Products',
    filterSeeds: 'Certified Seeds',
    filterFertilizers: 'Fertilizers & Nutrients',
    filterPesticides: 'Crop Protection & Bio',
    requestBtn: 'Request Delivery / Enquiry',
    inStock: 'Available Stock',
    expertApproved: 'ICAR / Agri University Verified',
    khaatScheduleTitle: 'Scientific Crop-Wise Fertilizer Schedule',
    adjustedSoilBadge: 'Adjusted for Soil Health Card Values'
  },
  prices: {
    title: 'Today’s APMC Mandi Prices & Arrivals',
    subtitle: 'Track real-time commodities and regional wholesale trends',
    modalPrice: 'Modal Price',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    arrivals: 'Arrivals (Tonnes)',
    sellOrWaitTitle: 'Sell Today or Wait? (Decision Engine)',
    verdictSell: 'SELL NOW (Favorable Peak)',
    verdictWait: 'WAIT & STORE (Upcoming Rise)'
  },
  chat: {
    title: 'KisanMitra Multilingual AI Companion',
    placeholder: 'Speak or type in your language (e.g. When to apply second dose of urea in wheat?)',
    send: 'Send',
    voiceBtn: 'Speak Question',
    listening: 'Listening... Please speak',
    speaking: 'Playing audio answer...',
    disclaimer: 'Grounding rule: Answers derived strictly from verified agronomic documents. For crop emergencies, consult local KVK.',
    talkToExpert: 'Talk to Agronomist (Human Handoff)'
  },
  dashboard: {
    cropTitle: 'Onion · Lasalgaon, Maharashtra',
    changeCrop: 'Change crop',
    changeMarket: 'Change market',
    modalPriceLabel: "Today's modal price",
    modalPriceValue: '₹2,300',
    perQuintal: '/ quintal',
    forecastDaysLabel: 'Forecast in 14 days',
    forecastDaysValue: '₹2,450',
    forecastRange: 'Range ₹2,200 to ₹2,700',
    bestMarketLabel: 'Best market, net income',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'Lasalgaon, 24 km away',
    adviceLabel: 'Advice',
    adviceVerdict: 'Wait',
    adviceSub: 'Prices may rise as arrivals fall',

    priceForecastTitle: 'Price forecast',
    priceForecastSampleNote: 'Most likely ₹2,450, range ₹2,200 to ₹2,700. Sample data.',
    todayLabel: 'Today',

    bestMarketsTitle: 'Best markets by net income',
    tableMarket: 'Market',
    tableDistance: 'Distance',
    tableNet: 'Net per quintal',
    tableFooterNote: 'Price minus transport, fee and loss. Rates are editable.',

    soilTitle: 'Soil and crop suggestions',
    soilSubtitle: 'Black soil, pH about 7.6 (satellite estimate, not a lab test)',
    soilCrops: [
      '1. Soybean, expected profit ₹[sample]',
      '2. Cotton, expected profit ₹[sample]',
      '3. Onion, expected profit ₹[sample]'
    ],

    fertilizerTitle: 'Fertilizer plan (khaat)',
    fertilizerApproved: 'Approved by company agronomist',
    fertilizerStages: [
      'At sowing: basal dose',
      '30 days: top dressing',
      '60 days: second top dressing'
    ],
    requestFromStore: 'Request from store',

    askTitle: 'Ask KisanMitra',
    askSubtitle: 'Type or speak in your language',
    askPlaceholder: 'When should I sell?',

    footerDisclaimer: 'Forecast is decision support, not a guarantee. Figures shown are sample data.'
  },
  common: {
    selectCropTitle: 'Select Crop',
    selectMarketTitle: 'Select Market',
    close: 'Close',
    apply: 'Apply',
    rupeePerQuintal: '₹/quintal',
    rupeePerPack: '₹',
    approvedByExpert: 'Expert Approved',
    disclaimerDecision: 'Forecast is decision support, not a guarantee.'
  }
};

const hiTranslations: Translations = {
  appName: 'AgriPulse (किसानमित्र)',
  tagline: 'भारतीय किसानों का सच्चा साथी व सलाहकार',
  subtagline: 'सही मंडी भाव, खाद का समय, AI चैटबॉट और कृषि उत्पाद सीधे आपके फोन पर।',
  nav: {
    dashboard: 'डैशबोर्ड',
    prices: 'मंडी भाव',
    forecast: 'पूर्वानुमान',
    markets: 'बेचें या रुकें',
    soil: 'मिट्टी व फसल',
    store: 'खाद-बीज स्टोर',
    chat: 'AI सहायक',
    alerts: 'अलर्ट',
    admin: 'कृषि विशेषज्ञ',
    login: 'लॉगिन',
    settings: 'सेटिंग्स'
  },
  hero: {
    badge: '🌾 100% निःशुल्क किसान डिजिटल सेवा',
    title: 'सही मंडी, सही भाव और सही खाद का सटीक फैसला',
    subtitle: 'मंडी के ताजा भाव, 14 दिनों का सटीक पूर्वानुमान, ICAR प्रमाणित खाद अनुसूची और व्हाट्सएप पर 24x7 सलाह।',
    ctaPrices: 'आज के मंडी भाव देखें',
    ctaStore: 'खाद-बीज स्टोर व खाद तालिका',
    ctaChat: 'AI सहायक से पूछें (आवाज से)',
    linkWhatsApp: 'व्हाट्सएप से जोड़ें'
  },
  features: {
    mandiTitle: 'लाइव APMC मंडी भाव',
    mandiDesc: 'देशभर की मंडियों के न्यूनतम, अधिकतम और मॉडल भाव। 90 दिनों का ट्रेंड व मौसमी ग्राफ।',
    forecastTitle: '14 व 30 दिन का भाव अनुमान',
    forecastDesc: 'AI मशीन लर्निंग द्वारा भाव के उतार-चढ़ाव (p10, p50, p90) का वैज्ञानिक विश्लेषण।',
    storeTitle: 'खाद-बीज स्टोर व खाद शेड्यूल',
    storeDesc: 'फसल की अवस्था अनुसार वैज्ञानिक खाद डोज (बेसल, 30 दिन, 60 दिन) व घर बैठे मंगाने की सुविधा।',
    soilTitle: 'मृदा स्वास्थ्य व फसल चयन',
    soilDesc: 'मिट्टी की जांच (Soil Card) के अनुसार फसल व खाद की मात्रा में स्वचालित सुधार।',
    whatsappTitle: 'व्हाट्सएप व टेलीग्राम बॉट',
    whatsappDesc: 'अपनी मातृभाषा में बोलकर या लिखकर सवाल पूछें। वॉइस नोट में ही तुरंत जवाब पाएं।'
  },
  store: {
    title: 'किसानमित्र कृषि स्टोर व खाद तालिका',
    subtitle: 'प्रमाणित बीज, नैनो यूरिया, डीएपी व फसल सुरक्षा उत्पाद — सीधे मंगाएं',
    filterAll: 'सभी उत्पाद',
    filterSeeds: 'प्रमाणित बीज',
    filterFertilizers: 'खाद व उर्वरक',
    filterPesticides: 'कीटनाशक व फफूंदनाशक',
    requestBtn: 'ऑर्डर / पूछताछ भेजें',
    inStock: 'उपलब्ध स्टॉक',
    expertApproved: 'ICAR कृषि विश्वविद्यालय द्वारा अनुमोदित',
    khaatScheduleTitle: 'फसलावस्था अनुसार वैज्ञानिक खाद तालिका',
    adjustedSoilBadge: 'मृदा स्वास्थ्य कार्ड (Soil Health Card) से समायोजित'
  },
  prices: {
    title: 'आज के ताजा मंडी भाव व आवक',
    subtitle: 'अपने नजदीकी APMC मंडी के प्रामाणिक भाव देखें',
    modalPrice: 'मॉडल भाव',
    minPrice: 'न्यूनतम',
    maxPrice: 'अधिकतम',
    arrivals: 'दैनिक आवक',
    sellOrWaitTitle: 'आज बेचें या रुकें? (निर्णय इंजन)',
    verdictSell: 'आज ही बेचें (Sell Now)',
    verdictWait: 'रुकें व भंडारण करें (Wait & Store)'
  },
  chat: {
    title: 'किसानमित्र AI कृषक साथी',
    placeholder: 'अपनी भाषा में बोलें या लिखें (जैसे: गेंहू में पहली खाद कब दें?)',
    send: 'भेजें',
    voiceBtn: 'बोलकर पूछें',
    listening: 'सुन रहा है... बोलिए',
    speaking: 'उत्तर सुना रहा है...',
    disclaimer: 'यह AI सलाह ICAR दस्तावेजों पर आधारित है। आपात स्थिति में स्थानीय कृषि केंद्र से संपर्क करें।',
    talkToExpert: 'कृषि विशेषज्ञ (Agronomist) से बात करें'
  },
  dashboard: {
    cropTitle: 'प्याज · लासलगांव, महाराष्ट्र',
    changeCrop: 'फसल बदलें',
    changeMarket: 'मंडी बदलें',
    modalPriceLabel: 'आज का मॉडल भाव',
    modalPriceValue: '₹2,300',
    perQuintal: '/ क्विंटल',
    forecastDaysLabel: '14 दिन में भाव अनुमान',
    forecastDaysValue: '₹2,450',
    forecastRange: 'सीमा ₹2,200 से ₹2,700',
    bestMarketLabel: 'सर्वोत्तम मंडी, शुद्ध आय',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'लासलगांव, 24 किमी दूर',
    adviceLabel: 'सलाह',
    adviceVerdict: 'रुकें (Wait)',
    adviceSub: 'आवक घटने से भाव बढ़ सकते हैं',

    priceForecastTitle: 'भाव पूर्वानुमान (Price forecast)',
    priceForecastSampleNote: 'सबसे संभावित ₹2,450, रेंज ₹2,200 से ₹2,700. नमूना डेटा।',
    todayLabel: 'आज',

    bestMarketsTitle: 'शुद्ध आय अनुसार प्रमुख मंडियां',
    tableMarket: 'मंडी',
    tableDistance: 'दूरी',
    tableNet: 'शुद्ध प्रति क्विंटल',
    tableFooterNote: 'भाड़ा, मंडी शुल्क व घट काटकर। दरें संपादन योग्य हैं।',

    soilTitle: 'मृदा व फसल सुझाव',
    soilSubtitle: 'काली मिट्टी, pH लगभग 7.6 (सैटेलाइट अनुमान, लैब टेस्ट नहीं)',
    soilCrops: [
      '1. सोयाबीन, अपेक्षित लाभ ₹38,500/एकड़',
      '2. कपास, अपेक्षित लाभ ₹34,200/एकड़',
      '3. प्याज, अपेक्षित लाभ ₹42,000/एकड़'
    ],

    fertilizerTitle: 'खाद अनुसूची (Fertilizer plan)',
    fertilizerApproved: 'कंपनी कृषि विशेषज्ञ द्वारा अनुमोदित',
    fertilizerStages: [
      'बुवाई के समय: बेसल डोज (DAP + पोटाश)',
      '30 दिन: पहली टॉप ड्रेसिंग (नीम कोटेड यूरिया)',
      '60 दिन: द्वितीय टॉप ड्रेसिंग (पोषक छिड़काव)'
    ],
    requestFromStore: 'स्टोर से मंगाएं',

    askTitle: 'किसानमित्र से पूछें',
    askSubtitle: 'अपनी भाषा में लिखें या बोलें',
    askPlaceholder: 'मुझे फसल कब बेचनी चाहिए?',

    footerDisclaimer: 'पूर्वानुमान केवल निर्णय सहायता है, कोई गारंटी नहीं। आंकड़े नमूना डेटा हैं।'
  },
  common: {
    selectCropTitle: 'फसल चुनें',
    selectMarketTitle: 'मंडी चुनें',
    close: 'बंद करें',
    apply: 'लागू करें',
    rupeePerQuintal: '₹/क्विंटल',
    rupeePerPack: '₹',
    approvedByExpert: 'विशेषज्ञ अनुमोदित',
    disclaimerDecision: 'पूर्वानुमान केवल निर्णय सहायता के लिए है, कोई निश्चित गारंटी नहीं।'
  }
};

const mrTranslations: Translations = {
  appName: 'AgriPulse (किसानमित्र)',
  tagline: 'महाराष्ट्रातील शेतकरी बांधवांचा विश्वासू मार्गदर्शक',
  subtagline: 'अचूक बाजारभाव, खत व्यवस्थापन, AI चॅटबॉट आणि कृषी उत्पादने आपल्या मोबाईलवर.',
  nav: {
    dashboard: 'डॅशबोर्ड',
    prices: 'बाजारभाव',
    forecast: 'भाव अंदाज',
    markets: 'विक्री की साठवणूक',
    soil: 'माती व पीक',
    store: 'खत-बियाणे दालन',
    chat: 'AI सल्लागार',
    alerts: 'सूचना',
    admin: 'कृषी तज्ञ',
    login: 'लॉगिन',
    settings: 'सेटिंग्ज'
  },
  hero: {
    badge: '🌾 १००% मोफत शेतकरी डिजिटल सेवा',
    title: 'योग्य बाजारपेठ, योग्य भाव आणि खतांचे अचूक नियोजन',
    subtitle: 'ताजे कृषी उत्पन्न बाजार समिती भाव, पुढील १४ दिवसांचा भाव अंदाज आणि व्हॉट्सॲपवर २४x७ मार्गदर्शन.',
    ctaPrices: 'आजचे बाजारभाव तपासा',
    ctaStore: 'खत-बियाणे दालन व खत वेळापत्रक',
    ctaChat: 'AI सल्लागाराला आवाजात विचारा',
    linkWhatsApp: 'व्हॉट्सॲप लिंक करा'
  },
  features: {
    mandiTitle: 'थेट APMC बाजारभाव',
    mandiDesc: 'लासलगाव, नाशिक, इंदूर सह सर्व प्रमुख बाजार समित्यांचे आजचे किमान, कमाल व सरासरी भाव.',
    forecastTitle: '१४ व ३० दिवसांचा अंदाज',
    forecastDesc: 'AI मशीन लर्निंग तंत्रज्ञानावर आधारित भावातील चढउतारांचे वैज्ञानिक विश्लेषण.',
    storeTitle: 'खत-बियाणे दालन व वेळापत्रक',
    storeDesc: 'पिकांच्या वाढीच्या टप्प्यानुसार (पेरणी, ३० दिवस, ६० दिवस) शास्त्रीय खत डोस आणि घरपोच मागणी.',
    soilTitle: 'मृदा आरोग्य व पीक निवड',
    soilDesc: 'माती परीक्षणानुसार पिकांची शिफारस व खतांच्या प्रमाणामध्ये अचूक बदल.',
    whatsappTitle: 'व्हॉट्सॲप व टेलिग्राम बॉट',
    whatsappDesc: 'मराठीत बोलून किंवा टाईप करून प्रश्न विचारा, व्हॉईस नोटमध्ये उत्तर मिळवा.'
  },
  store: {
    title: 'किसानमित्र कृषी दालन व खत वेळापत्रक',
    subtitle: 'प्रमाणित बियाणे, नॅनो युरिया, डीएपी व पीक संरक्षण — घरपोच मागणी करा',
    filterAll: 'सर्व उत्पादने',
    filterSeeds: 'प्रमाणित बियाणे',
    filterFertilizers: 'खते व सूक्ष्म अन्नद्रव्ये',
    filterPesticides: 'कीटकनाशके व बुरशीनाशके',
    requestBtn: 'मागणी नोंदवा / चौकशी करा',
    inStock: 'उपलब्ध साठा',
    expertApproved: 'कृषी विद्यापीठ व तज्ञांद्वारे प्रमाणित',
    khaatScheduleTitle: 'पिकाच्या वाढीनुसार शास्त्रीय खत वेळापत्रक',
    adjustedSoilBadge: 'माती परीक्षण अहवालानुसार (Soil Card) समायोजित'
  },
  prices: {
    title: 'आजचे ताजे कृषी उत्पन्न बाजारभाव',
    subtitle: 'आपल्या जवळच्या बाजार समितीचे अचूक भाव पहा',
    modalPrice: 'सरासरी भाव',
    minPrice: 'किमान',
    maxPrice: 'कमाल',
    arrivals: 'दैनिक आवक',
    sellOrWaitTitle: 'माल आज विकावा की साठवावा? (निर्णय सहाय्यक)',
    verdictSell: 'आजच विका (Sell Now)',
    verdictWait: 'साठवणूक करा (Wait & Store)'
  },
  chat: {
    title: 'किसानमित्र AI कृषी मित्र',
    placeholder: 'मराठीत बोला किंवा टाईप करा (उदा: कांद्यावरील करपा रोगावर काय उपाय?)',
    send: 'पाठवा',
    voiceBtn: 'आवाजात विचारा',
    listening: 'ऐकत आहे... बोला',
    speaking: 'उत्तर वाचून दाखवत आहे...',
    disclaimer: 'हा सल्ला ICAR च्या अधिकृत नोंदींवर आधारित आहे. तातडीच्या मदतीसाठी स्थानिक कृषी विज्ञान केंद्राशी संपर्क साधा.',
    talkToExpert: 'कृषी तज्ञांशी बोला (Talk to Expert)'
  },
  dashboard: {
    cropTitle: 'कांदा · लासलगाव, महाराष्ट्र',
    changeCrop: 'पीक बदला',
    changeMarket: 'बाजार समिती बदला',
    modalPriceLabel: 'आजचा सरासरी भाव',
    modalPriceValue: '₹२,३००',
    perQuintal: '/ क्विंटल',
    forecastDaysLabel: '१४ दिवसांचा भाव अंदाज',
    forecastDaysValue: '₹२,४५०',
    forecastRange: 'अपेक्षित कक्षा ₹२,२०० ते ₹२,७००',
    bestMarketLabel: 'उत्तम बाजारपेठ, निव्वळ नफा',
    bestMarketValue: '₹२,१८०',
    bestMarketSub: 'लासलगाव, २४ किमी अंतर',
    adviceLabel: 'सल्ला',
    adviceVerdict: 'थांबा (Wait)',
    adviceSub: 'आवक घटल्याने भावात वाढ संभवते',

    priceForecastTitle: 'भाव अंदाज (Price forecast)',
    priceForecastSampleNote: 'सर्वाधिक शक्यता ₹२,४५०, मर्यादा ₹२,२०० ते ₹२,७००. नमुना माहिती.',
    todayLabel: 'आज',

    bestMarketsTitle: 'निव्वळ नफ्यानुसार उत्तम बाजार समित्या',
    tableMarket: 'बाजार समिती',
    tableDistance: 'अंतर',
    tableNet: 'निव्वळ प्रति क्विंटल',
    tableFooterNote: 'वाहतूक खर्च व घट वजा जाता. दर बदलता येतील.',

    soilTitle: 'माती व पीक शिफारसी',
    soilSubtitle: 'काळी कसदार जमीन, pH सुमारे ७.६ (उपग्रह अंदाज, प्रयोगशाळा चाचणी नाही)',
    soilCrops: [
      '१. सोयाबीन, अपेक्षित नफा ₹३८,५००/एकर',
      '२. कापूस, अपेक्षित नफा ₹३४,२००/एकर',
      '३. कांदा, अपेक्षित नफा ₹४२,०००/एकर'
    ],

    fertilizerTitle: 'खत वेळापत्रक (खात नियोजन)',
    fertilizerApproved: 'कंपनी कृषी तज्ञांद्वारे प्रमाणित',
    fertilizerStages: [
      'पेरणीच्या वेळी: बेसल डोस (डीएपी + पोटॅश)',
      '३० दिवस: पहिली खत मात्रा (युरिया)',
      '६० दिवस: दुसरी खत मात्रा (फवारणी)'
    ],
    requestFromStore: 'स्टोअरमधून मागवा',

    askTitle: 'किसानमित्रला विचारा',
    askSubtitle: 'आपल्या भाषेत बोला किंवा टाईप करा',
    askPlaceholder: 'मी माल कधी विकावा?',

    footerDisclaimer: 'अंदाज हा निर्णय समर्थनासाठी आहे, हमी नाही. दर्शविलेले आकडे नमुना डेटा आहेत.'
  },
  common: {
    selectCropTitle: 'पीक निवडा',
    selectMarketTitle: 'बाजार समिती निवडा',
    close: 'बंद करा',
    apply: 'लागू करा',
    rupeePerQuintal: '₹/क्विंटल',
    rupeePerPack: '₹',
    approvedByExpert: 'तज्ञ प्रमाणित',
    disclaimerDecision: 'अंदाज हा निर्णय समर्थनासाठी आहे, हमी नाही.'
  }
};

export const translations: Record<Locale, Translations> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations,
  gu: { ...enTranslations, dashboard: { ...enTranslations.dashboard, cropTitle: 'Onion · Lasalgaon, Maharashtra' } },
  ta: { ...enTranslations, dashboard: { ...enTranslations.dashboard, cropTitle: 'Onion · Lasalgaon, Maharashtra' } },
  te: { ...enTranslations, dashboard: { ...enTranslations.dashboard, cropTitle: 'Onion · Lasalgaon, Maharashtra' } },
  kn: { ...enTranslations, dashboard: { ...enTranslations.dashboard, cropTitle: 'Onion · Lasalgaon, Maharashtra' } },
  bn: { ...enTranslations, dashboard: { ...enTranslations.dashboard, cropTitle: 'Onion · Lasalgaon, Maharashtra' } },
  pa: { ...enTranslations, dashboard: { ...enTranslations.dashboard, cropTitle: 'Onion · Lasalgaon, Maharashtra' } },
};
