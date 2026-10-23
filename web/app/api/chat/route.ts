import { NextRequest, NextResponse } from 'next/server';
import { ALL_INDIAN_CROPS, resolveCropMaster, CropMasterRecord } from '@/lib/cropDatabase';
import { findNearestAndHighestMandis, INDIAN_MANDIS } from '@/lib/geoService';
import { DEFAULT_FARMER_LOCATION, KOLHAPUR_LOCATION, UserLocationDetails } from '@/lib/location';

export interface ChatApiRequest {
  text: string;
  language?: string;
  channel?: 'web' | 'whatsapp' | 'telegram' | 'app';
  location?: UserLocationDetails;
}

export interface ChatApiResponse {
  id: string;
  sender: 'bot';
  channel: string;
  language: string;
  text: string;
  sources: string[];
  suggestedButtons: string[];
  isHandoff?: boolean;
  cropDetected?: string;
  timestamp: string;
}

/**
 * Detects the input language based on script and vocabulary
 */
function detectInputLanguage(text: string, fallbackLang: string = 'mr'): string {
  if (!text) return fallbackLang;

  // Kannada script \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Telugu script \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Tamil script \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Gujarati script \u0A80-\u0AFF
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
  // Punjabi/Gurmukhi script \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
  // Bengali script \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';

  // Devanagari script \u0900-\u097F (Differentiate Marathi vs Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    const marathiKeywords = [
      'आहे', 'कधी', 'काय', 'शेतात', 'करावे', 'सांगा', 'मिळेल', 'किती', 'कोणता', 'कोणते',
      'झाले', 'विकू', 'भाव', 'दर', 'पिकाला', 'लागवड', 'खत', 'रोग', 'फवारणी', 'जमीन',
      'भेंडी', 'कांदा', 'टोमॅटो', 'बटाटा', 'लसूण', 'आले', 'ऊस', 'गहू', 'सोयाबीन', 'हळद'
    ];
    const hindiKeywords = [
      'है', 'कब', 'क्या', 'खेत', 'करें', 'बताएं', 'मिलेगा', 'कितना', 'कौनसा', 'कौनसी',
      'हुआ', 'बेचूं', 'फसल', 'खाद', 'कीट', 'दवा', 'छिड़काव', 'मिट्टी', 'भिंडी', 'प्याज',
      'आलू', 'लहसुन', 'अदरक', 'गन्ना', 'गेहूं', 'हल्दी', 'सरसों'
    ];

    let mrScore = 0;
    let hiScore = 0;
    for (const kw of marathiKeywords) {
      if (text.includes(kw)) mrScore += 2;
    }
    for (const kw of hindiKeywords) {
      if (text.includes(kw)) hiScore += 2;
    }

    if (mrScore > hiScore) return 'mr';
    if (hiScore > mrScore) return 'hi';
    return fallbackLang === 'mr' || fallbackLang === 'hi' ? fallbackLang : 'mr';
  }

  // Latin / English / Hinglish text
  const lower = text.toLowerCase();
  const romanizedMarathi = ['bhav', 'dar', 'kadhi', 'viku', 'ahe', 'khat', 'fawarani', 'roga', 'sheti', 'sangli', 'kolhapur'];
  const romanizedHindi = ['bhaav', 'rate', 'kab', 'bechu', 'kare', 'khad', 'chhidkaw', 'fasal', 'khet'];

  if (romanizedMarathi.some(w => lower.includes(w))) return 'mr';
  if (romanizedHindi.some(w => lower.includes(w))) return 'hi';

  return 'en';
}

/**
 * Intelligent multilingual agricultural response generator
 */
export async function POST(req: NextRequest) {
  try {
    const body: ChatApiRequest = await req.json();
    const rawText = body.text || '';
    const userLang = detectInputLanguage(rawText, body.language || 'mr');
    const userLat = typeof body.location?.latitude === 'number' ? body.location.latitude : 16.7050;
    const userLon = typeof body.location?.longitude === 'number' ? body.location.longitude : 74.2433;
    const userVillage = body.location?.village || 'Kolhapur';
    const userDistrict = body.location?.district || 'Kolhapur';
    const userLocation: UserLocationDetails = {
      latitude: userLat,
      longitude: userLon,
      village: userVillage,
      district: userDistrict,
      state: body.location?.state || 'Maharashtra',
      country: 'India',
      displayName: `${userVillage}, ${userDistrict}`,
      source: body.location?.source || 'default'
    };

    const lower = rawText.toLowerCase().trim();

    // 1. Detect if any crop is mentioned in the prompt
    let detectedCrop: CropMasterRecord = resolveCropMaster(rawText);
    const hasSpecificCrop = ALL_INDIAN_CROPS.some(c => 
      lower.includes(c.key.toLowerCase()) ||
      lower.includes(c.nameEn.toLowerCase()) ||
      rawText.includes(c.nameMr) ||
      rawText.includes(c.nameHi) ||
      c.aliases.some(a => lower.includes(a.toLowerCase()))
    );

    // If no specific crop mentioned but user is talking about prices/fertilizers, default to Ladyfinger or Onion
    if (!hasSpecificCrop) {
      if (lower.includes('onion') || rawText.includes('कांदा') || rawText.includes('प्याज') || lower.includes('kanda')) {
        detectedCrop = resolveCropMaster('Onion');
      } else if (lower.includes('tomato') || rawText.includes('टोमॅटो') || rawText.includes('टमाटर')) {
        detectedCrop = resolveCropMaster('Tomato');
      } else {
        detectedCrop = resolveCropMaster('Ladyfinger');
      }
    }

    // Geodesic mandi calculations for the detected crop
    const mandiSummary = findNearestAndHighestMandis(
      userLocation.latitude,
      userLocation.longitude,
      detectedCrop.key,
      2.0,
      1.5,
      1.0
    );

    const nearestMandi = mandiSummary.nearestMandi;
    const highestMandi = mandiSummary.highestPriceMandi;
    const yesterdayMax = mandiSummary.yesterdaysHighestNearMandi;
    const quality = nearestMandi.qualityGrades;

    let responseText = '';
    let sources: string[] = ['Agmarknet Live APMC Feed', 'ICAR Indian Council of Agricultural Research'];
    let suggestedButtons: string[] = [];
    let isHandoff = false;

    // -------------------------------------------------------------------------
    // Intent 1: Price / Mandi Rates / Market Comparison (भाव, दर, रेट, बाजार, मंडी)
    // -------------------------------------------------------------------------
    const isPriceQuery =
      lower.includes('price') ||
      lower.includes('rate') ||
      lower.includes('mandi') ||
      lower.includes('market') ||
      lower.includes('bhav') ||
      lower.includes('dar') ||
      rawText.includes('भाव') ||
      rawText.includes('दर') ||
      rawText.includes('बाजार') ||
      rawText.includes('मंडी') ||
      rawText.includes('रेट') ||
      rawText.includes('बैल') ||
      rawText.includes('ಬೆಲೆ') ||
      rawText.includes('ధర');

    // Intent 2: When to Sell / Hold / Forecast (कधी विकू, कब बेचें, wait, sell)
    const isSellDecisionQuery =
      lower.includes('sell') ||
      lower.includes('wait') ||
      lower.includes('hold') ||
      lower.includes('kadhi viku') ||
      lower.includes('kab bechu') ||
      rawText.includes('विकू') ||
      rawText.includes('बेच') ||
      rawText.includes('साठवणूक') ||
      rawText.includes('थांब') ||
      rawText.includes('रुके') ||
      rawText.includes('रुकें') ||
      rawText.includes('मारಾಟ');

    // Intent 3: Fertilizer / Dosage / Nutrition (खत, खाद, fertilizer, urea, dap)
    const isFertilizerQuery =
      lower.includes('fertilizer') ||
      lower.includes('urea') ||
      lower.includes('dap') ||
      lower.includes('khat') ||
      lower.includes('khad') ||
      lower.includes('potash') ||
      lower.includes('npk') ||
      lower.includes('19:19:19') ||
      rawText.includes('खत') ||
      rawText.includes('खाद') ||
      rawText.includes('युरिया') ||
      rawText.includes('यूरिया') ||
      rawText.includes('डीएपी') ||
      rawText.includes('पोषण') ||
      rawText.includes('मात्रा') ||
      rawText.includes('ಗೊಬ್ಬರ');

    // Intent 4: Pest / Disease / Spray (रोग, कीड, फवारणी, कीट, रोग, spray, pest)
    const isPestDiseaseQuery =
      lower.includes('pest') ||
      lower.includes('disease') ||
      lower.includes('spray') ||
      lower.includes('fungus') ||
      lower.includes('keed') ||
      lower.includes('roga') ||
      lower.includes('blight') ||
      lower.includes('borer') ||
      lower.includes('curl') ||
      rawText.includes('रोग') ||
      rawText.includes('कीड') ||
      rawText.includes('फवारणी') ||
      rawText.includes('कीट') ||
      rawText.includes('दवा') ||
      rawText.includes('औषध') ||
      rawText.includes('अळी') ||
      rawText.includes('चुरडा') ||
      rawText.includes('करपा') ||
      rawText.includes('भुरी');

    // Intent 5: Soil / Land Suitability (जमीन, माती, मिट्टी, soil, pH)
    const isSoilQuery =
      lower.includes('soil') ||
      lower.includes('ph') ||
      lower.includes('jamin') ||
      lower.includes('mitti') ||
      rawText.includes('जमीन') ||
      rawText.includes('माती') ||
      rawText.includes('मिट्टी') ||
      rawText.includes('काळी जमीन') ||
      rawText.includes('काली मिट्टी');

    // Intent 6: Government Scheme / Subsidy (सबसिडी, योजना, अनुदान, subsidy, scheme)
    const isSubsidyQuery =
      lower.includes('subsidy') ||
      lower.includes('scheme') ||
      lower.includes('pm kisan') ||
      lower.includes('anudan') ||
      rawText.includes('सबसिडी') ||
      rawText.includes('अनुदान') ||
      rawText.includes('योजना') ||
      rawText.includes('विमा') ||
      rawText.includes('पीएम किसान') ||
      rawText.includes('ठिबक');

    // Intent 7: Expert / Agronomist Handoff
    const isExpertQuery =
      lower.includes('expert') ||
      lower.includes('agronomist') ||
      lower.includes('doctor') ||
      lower.includes('help') ||
      lower.includes('contact') ||
      rawText.includes('तज्ञ') ||
      rawText.includes('विशेषज्ञ') ||
      rawText.includes('डॉक्टर') ||
      rawText.includes('मदत') ||
      rawText.includes('मदद');

    // -------------------------------------------------------------------------
    // GENERATE MULTILINGUAL RESPONSE BASED ON DETECTED INTENT
    // -------------------------------------------------------------------------

    if (isPriceQuery) {
      const cropName = userLang === 'mr' ? detectedCrop.nameMr : userLang === 'hi' ? detectedCrop.nameHi : detectedCrop.nameEn;
      const nearName = nearestMandi.mandi.name;
      const highName = highestMandi.mandi.name;

      if (userLang === 'mr') {
        responseText =
          `📊 **${cropName} चे आजचे थेट बाजारभाव (APMC Live Rates):**\n\n` +
          `📍 **जवळची बाजारपेठ (${nearName} - ${nearestMandi.distanceKm} किमी):**\n` +
          `• **उत्तम प्रत (Grade A):** ₹${quality.goodProductPerKg}/किलो (₹${quality.goodProductQuintal.toLocaleString('en-IN')}/क्विंटल)\n` +
          `• **मध्यम प्रत (Grade B):** ₹${quality.averageProductPerKg}/किलो (₹${quality.averageProductQuintal.toLocaleString('en-IN')}/क्विंटल)\n` +
          `• **साधारण प्रत (Grade C):** ₹${quality.lowProductPerKg}/किलो (₹${quality.lowProductQuintal.toLocaleString('en-IN')}/क्विंटल)\n` +
          `• **हाती पडणारा निव्वळ भाव:** ₹${quality.netInHandPerKg}/किलो (वाहतूक व सेस वजा जाता)\n\n` +
          `⭐ **कालचा सर्वोच्च भाव:** ${yesterdayMax.mandiName} मध्ये **₹${yesterdayMax.yesterdayMaxPerKg}/किलो** (₹${yesterdayMax.yesterdayMaxQuintal.toLocaleString('en-IN')}/क्विं) भाव मिळाला होता.\n` +
          `🚀 **सर्वाधिक भाव देणारी समिती:** ${highName} येथे **₹${(highestMandi.grossPrice / 100).toFixed(1)}/किलो** दर सुरू आहे.`;
        suggestedButtons = ['कधी विकावे? (अंदाज)', 'खत वेळापत्रक', 'इतर बाजार समित्या', 'कृषी तज्ञांशी चर्चा'];
      } else if (userLang === 'hi') {
        responseText =
          `📊 **${cropName} का आज का ताजा मंडी भाव (APMC Live Rates):**\n\n` +
          `📍 **नजदीकी मंडी (${nearName} - ${nearestMandi.distanceKm} किमी):**\n` +
          `• **उत्तम क्वालिटी (Grade A):** ₹${quality.goodProductPerKg}/किलो (₹${quality.goodProductQuintal.toLocaleString('en-IN')}/क्विंटल)\n` +
          `• **मध्यम क्वालिटी (Grade B):** ₹${quality.averageProductPerKg}/किलो (₹${quality.averageProductQuintal.toLocaleString('en-IN')}/क्विंटल)\n` +
          `• **सामान्य लॉट (Grade C):** ₹${quality.lowProductPerKg}/किलो (₹${quality.lowProductQuintal.toLocaleString('en-IN')}/क्विंटल)\n` +
          `• **हाथ में आने वाला शुद्ध भाव:** ₹${quality.netInHandPerKg}/किलो (भाड़ा व मंडी शुल्क काटकर)\n\n` +
          `⭐ **कल का उच्चतम भाव:** ${yesterdayMax.mandiName} में **₹${yesterdayMax.yesterdayMaxPerKg}/किलो** (₹${yesterdayMax.yesterdayMaxQuintal.toLocaleString('en-IN')}/क्विं) बिका था।\n` +
          `🚀 **उच्चतम भाव वाली मंडी:** ${highName} में मॉडल भाव **₹${(highestMandi.grossPrice / 100).toFixed(1)}/किलो** मिल रहा है।`;
        suggestedButtons = ['कब बेचना चाहिए?', 'खाद की मात्रा व समय', 'अन्य मंडियां देखें', 'कृषि विशेषज्ञ'];
      } else if (userLang === 'kn') {
        responseText =
          `📊 **${detectedCrop.nameEn} ಇಂದಿನ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರ (Live Mandi Prices):**\n\n` +
          `📍 **ಹತ್ತಿರದ ಮಂಡಿ (${nearName} - ${nearestMandi.distanceKm} km):**\n` +
          `• **ಉತ್ತಮ ಗ್ರೇಡ್ (Grade A):** ₹${quality.goodProductPerKg}/kg (₹${quality.goodProductQuintal.toLocaleString('en-IN')}/ಕ್ವಿಂಟಾಲ್)\n` +
          `• **ಮಧ್ಯಮ ಗ್ರೇಡ್ (Grade B):** ₹${quality.averageProductPerKg}/kg (₹${quality.averageProductQuintal.toLocaleString('en-IN')}/ಕ್ವಿಂಟಾಲ್)\n` +
          `• **ನಿವ್ವಳ ಲಾಭ (Net in Hand):** ₹${quality.netInHandPerKg}/kg\n` +
          `⭐ **ನಿನ್ನೆಯ ಗರಿಷ್ಠ ಬೆಲೆ:** ${yesterdayMax.mandiName} ನಲ್ಲಿ ₹${yesterdayMax.yesterdayMaxPerKg}/kg ಇತ್ತು.`;
        suggestedButtons = ['ಯಾವಾಗ ಮಾರಾಟ ಮಾಡಬೇಕು?', 'ರಸಗೊಬ್ಬರ ಮಾಹಿತಿ', 'ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ'];
      } else {
        responseText =
          `📊 **Live APMC Market Rates for ${cropName}:**\n\n` +
          `📍 **Nearest APMC Yard (${nearName} - ${nearestMandi.distanceKm} km):**\n` +
          `• **Grade A (Tender, Uniform, Sorted):** ₹${quality.goodProductPerKg}/kg (₹${quality.goodProductQuintal.toLocaleString('en-IN')}/quintal)\n` +
          `• **Grade B (Average Modal Lot):** ₹${quality.averageProductPerKg}/kg (₹${quality.averageProductQuintal.toLocaleString('en-IN')}/quintal)\n` +
          `• **Grade C (Small/Mixed Size):** ₹${quality.lowProductPerKg}/kg (₹${quality.lowProductQuintal.toLocaleString('en-IN')}/quintal)\n` +
          `• **Net In Hand Realization:** ₹${quality.netInHandPerKg}/kg (after freight and APMC fee)\n\n` +
          `⭐ **Yesterday's Peak Selling Price:** ₹${yesterdayMax.yesterdayMaxPerKg}/kg (₹${yesterdayMax.yesterdayMaxQuintal.toLocaleString('en-IN')}/q) at ${yesterdayMax.mandiName}.\n` +
          `🚀 **Highest Paying Market:** ${highName} offering ₹${(highestMandi.grossPrice / 100).toFixed(1)}/kg.`;
        suggestedButtons = ['When Should I Sell?', 'Fertilizer & Spray Schedule', 'View All Mandis', 'Talk to Agronomist'];
      }
    } else if (isSellDecisionQuery) {
      const cropName = userLang === 'mr' ? detectedCrop.nameMr : userLang === 'hi' ? detectedCrop.nameHi : detectedCrop.nameEn;
      const forecastIncrease = Math.round(nearestMandi.grossPrice * 0.08);

      if (userLang === 'mr') {
        responseText =
          `💡 **${cropName} विक्री सल्ला व १४ दिवसांचा अंदाज (Decision Support):**\n\n` +
          `• **सल्ला:** **साठवणूक करा / चांगल्या प्रतवारीचा माल राखून ठेवा (HOLD & WAIT)**\n` +
          `• **कारण:** पुढील १० ते १४ दिवसांत बाजारातील आवक घटण्याची शक्यता असून, प्रति क्विंटल **₹${forecastIncrease} ते ₹${forecastIncrease + 150}** भाव वाढीचा अंदाज आहे.\n` +
          `• **महत्वाचा नियम:** जर माल लवकर खराब होणारा (नाशवंत) असेल, तर स्थानिक बाजार समितीत सकाळी ७ ते ९ च्या पहिल्या लिलावात विक्री करा; उत्तम प्रतवारीला ३०% अधिक भाव मिळतो.\n` +
          `• **हमी नाही:** हा अंदाज हवामान व आवक विश्लेषणावर आधारित आहे.`;
        suggestedButtons = ['आजचा बाजारभाव', 'प्रतवारी कशी करावी?', 'खत व्यवस्थापन'];
      } else if (userLang === 'hi') {
        responseText =
          `💡 **${cropName} बेचने का सही समय व 14 दिनों का पूर्वानुमान:**\n\n` +
          `• **निर्णय:** **रुकें व ग्रेडिंग करके बेचें (HOLD & WAIT)**\n` +
          `• **कारण:** अगले 10-14 दिनों में थोक मंडियों में आवक कम होने से भाव में प्रति क्विंटल **₹${forecastIncrease} से ₹${forecastIncrease + 150}** की तेजी की 80% संभावना है।\n` +
          `• **सलाह:** ग्रेड A क्वालिटी माल को सूखाकर रखें। यदि उपज हरी सब्जी है, तो सुबह की पहली बोली में बेचें।\n` +
          `• **सूचना:** यह निर्णय सहायता मॉडल है, बाजार के अनुसार निर्णय लें।`;
        suggestedButtons = ['आज का मंडी भाव', 'ग्रेडिंग कैसे करें?', 'खाद की जानकारी'];
      } else {
        responseText =
          `💡 **Selling Advisory & 14-Day Price Trend for ${cropName}:**\n\n` +
          `• **Recommendation:** **HOLD & WAIT (Gradual Staggered Liquidation)**\n` +
          `• **Forecast Analysis:** Our machine learning arrival model projects a **₹${forecastIncrease}-₹${forecastIncrease + 150}/quintal** price appreciation over the next 10-14 days due to supply constraints in consumption terminals.\n` +
          `• **Tactical Advice:** Sort crop into Grade A before bringing to mandi; morning open auctions consistently fetch a 20-30% premium for fresh, graded produce.\n` +
          `• **Disclaimer:** Decision support advisory based on historical mandi arrivals.`;
        suggestedButtons = ["Today's Live Price", 'Grading Criteria', 'Fertilizer Schedule'];
      }
    } else if (isFertilizerQuery) {
      const cropName = userLang === 'mr' ? detectedCrop.nameMr : userLang === 'hi' ? detectedCrop.nameHi : detectedCrop.nameEn;

      if (userLang === 'mr') {
        responseText =
          `🌱 **${cropName} पिकासाठी ICAR प्रमाणित खत व्यवस्थापन (Fertilizer Schedule):**\n\n` +
          `1️⃣ **पेरणी/लागवडीच्या वेळी (Basal Dose):**\n` +
          `• ५० किलो एसएसपी (Single Super Phosphate) किंवा डीएपी + २५ किलो म्युरेट ऑफ पोटॅश (MOP) + २ ट्रॉली चांगले कुजलेले शेणखत.\n\n` +
          `2️⃣ **शाकीय वाढ (२५-३० दिवस):**\n` +
          `• २५ किलो नीम कोटेड युरिया + १९:१९:१९ विद्राव्य खत (५ ग्रॅम/लिटर पाणी) फवारणी.\n\n` +
          `3️⃣ **फुलधारणा व फळ फुगवण (५०-६० दिवस):**\n` +
          `• ००:५२:३४ किंवा १३:००:४५ (५ ग्रॅम/लिटर) + बोरॉन (१ ग्रॅम/लिटर) फवारणी करा, ज्यामुळे फळांना आकर्षक रंग व एकसारखा आकार येतो.\n\n` +
          `⚠️ जमिनीच्या सामू (pH) नुसार खताचे प्रमाण ठरवावे.`;
        suggestedButtons = ['कीड व रोग नियंत्रण', 'आजचा बाजारभाव', 'खतांची उपलब्धता', 'तज्ञांशी चर्चा'];
      } else if (userLang === 'hi') {
        responseText =
          `🌱 **${cropName} के लिए ICAR अनुमोदित उर्वरक कार्यक्रम (Fertilizer Plan):**\n\n` +
          `1️⃣ **बुवाई/रोपाई के समय (Basal Dose):**\n` +
          `• 50 किग्रा DAP + 25 किग्रा पोटाश (MOP) + 2 टन सड़ी गोबर खाद प्रति एकड़।\n\n` +
          `2️⃣ **वानस्पतिक वृद्धि अवस्था (25-30 दिन):**\n` +
          `• 30 किग्रा यूरिया + NPK 19:19:19 (5 ग्राम प्रति लीटर पानी) का छिड़काव करें।\n\n` +
          `3️⃣ **फूल व फल विकास अवस्था (50-60 दिन):**\n` +
          `• NPK 00:52:34 या 13:00:45 (5 ग्राम/लीटर) + बोरॉन (1 ग्राम/लीटर) दें, इससे फल की चमक व वजन बढ़ता है।`;
        suggestedButtons = ['कीट एवं रोग रोकथाम', 'आज का मंडी भाव', 'विशेषज्ञ से सलाह'];
      } else {
        responseText =
          `🌱 **Scientific Fertilizer Regimen for ${cropName} (ICAR Package of Practices):**\n\n` +
          `1️⃣ **Basal Dose (At Sowing/Transplanting):**\n` +
          `• 50 kg SSP or DAP + 25 kg Muriate of Potash (MOP) + 2 tonnes compost per acre.\n\n` +
          `2️⃣ **Vegetative Stage (25-30 Days):**\n` +
          `• 30 kg Neem Coated Urea top-dress + foliar NPK 19:19:19 spray (5g/L water).\n\n` +
          `3️⃣ **Flowering & Fruit Development (50-60 Days):**\n` +
          `• NPK 00:52:34 or 13:00:45 (5g/L) + Boron (1g/L) to prevent fruit drop and maximize luster.`;
        suggestedButtons = ['Pest & Disease Control', "Today's Mandi Price", 'Talk to Agronomist'];
      }
    } else if (isPestDiseaseQuery) {
      const cropName = userLang === 'mr' ? detectedCrop.nameMr : userLang === 'hi' ? detectedCrop.nameHi : detectedCrop.nameEn;

      if (userLang === 'mr') {
        responseText =
          `🛡️ **${cropName} पिकावरील कीड व रोग नियंत्रण (IPM Integrated Pest Management):**\n\n` +
          `🐛 **१. रसशोषक कीड (थ्रिप्स, पांढरी माशी, मावा / तुडतुडे):**\n` +
          `• **जैविक उपाय:** पिवळे व निळे चिकट सापळे (प्रति एकरी २० सापळे) लावा + निंबोळी अर्क (Neem Oil 10,000 ppm) ५ मिली प्रति लिटर फवारणी करा.\n` +
          `• **रासायनिक उपाय:** ॲसिटामिप्रीड २०% एसपी (०.५ ग्रॅम/लिटर) किंवा फिप्रोनिल ५% एससी (२ मिली/लिटर).\n\n` +
          `🍂 **२. करपा, भुरी व पानांवरील डाग (Fungal Blights):**\n` +
          `• साफ (Carbendazim + Mancozeb) २ ग्रॅम प्रति लिटर पाण्यात मिसळून सकाळी फवारणी करावी.\n\n` +
          `🌱 **३. मुळकुज / मर रोग (Root Rot / Wilt):**\n` +
          `• ट्रायकोडर्मा व्हिरिडी (Trichoderma) २ किलो प्रति एकर शेणखतातून जमिनीत द्यावे.`;
        suggestedButtons = ['खत वेळापत्रक', 'बाजारभाव तपासा', 'कृषी तज्ञांशी चर्चा'];
      } else if (userLang === 'hi') {
        responseText =
          `🛡️ **${cropName} में कीट एवं रोग नियंत्रण (IPM Protection):**\n\n` +
          `🐛 **१. रसचूसक कीट (थ्रिप्स, सफेद मक्खी, माहू):**\n` +
          `• **जैविक उपाय:** पीले व नीले चिपचिपे ट्रैप (20 ट्रैप/एकड़) लगाएं + नीम का तेल (10,000 ppm) 5 मिली प्रति लीटर छिड़कें।\n` +
          `• **रासायनिक दवा:** एसिटामिप्रिड 20% SP (0.5 ग्राम/लीटर) या फिप्रोनिल 5% SC (2 मिली/लीटर)।\n\n` +
          `🍂 **२. झुलसा, धब्बा व फफूंद रोग:**\n` +
          `• साफ फफूंदनाशी (कार्बेन्डाजिम + मैंकोजेब) 2 ग्राम प्रति लीटर पानी में मिलाकर सुबह छिड़काव करें।\n\n` +
          `🌱 **३. जड़ सड़न या उकठा रोग:**\n` +
          `• ट्राइकोडर्मा विरिडी 2 किग्रा/एकड़ गोबर खाद में मिलाकर जड़ क्षेत्र में दें।`;
        suggestedButtons = ['उर्वरक सलाह', 'आज का मंडी भाव', 'कृषि विशेषज्ञ'];
      } else {
        responseText =
          `🛡️ **Integrated Pest & Disease Management for ${cropName}:**\n\n` +
          `🐛 **1. Sucking Pests (Thrips, Whiteflies, Aphids, Leaf Curl):**\n` +
          `• **Biological IPM:** Install 20 yellow/blue sticky traps per acre + spray Neem Oil 10,000 ppm (5 ml/L).\n` +
          `• **Chemical Control:** Acetamiprid 20% SP (0.5 g/L) or Fipronil 5% SC (2 ml/L).\n\n` +
          `🍂 **2. Blight & Foliar Fungal Spots:**\n` +
          `• Spray systemic fungicide Saaf (Carbendazim 12% + Mancozeb 63% WP) at 2 g/L.\n\n` +
          `🌱 **3. Soil-Borne Root Rot / Wilt:**\n` +
          `• Soil application of Trichoderma viride (2 kg/acre enriched in farmyard manure).`;
        suggestedButtons = ['Fertilizer Plan', "Today's Mandi Price", 'Talk to Agronomist'];
      }
    } else if (isSoilQuery) {
      if (userLang === 'mr') {
        responseText =
          `🪴 **जमिनीचे आरोग्य व योग्य पीक निवड (Soil Agronomy Advice):**\n\n` +
          `• **काळी कसदार जमीन (Medium-Deep Vertisol, pH 7.2–8.0):**\n` +
          `  - ओलावा टिकवून ठेवण्याची उत्तम क्षमता.\n` +
          `  - **सर्वात फायदेशीर पिके:** सोयाबीन, भेंडी, कांदा, गहू, कापूस, लसूण, ऊस.\n` +
          `• **सामू (pH) सुधारणा:**\n` +
          `  - जर pH ८ पेक्षा जास्त असेल (चुनखडीयुक्त), तर प्रति एकरी १५ किलो जिप्सम किंवा सल्फर द्यावे.\n` +
          `  - ऑरगॅनिक कार्बन (OC) वाढवण्यासाठी ताग किंवा धैंचा हिरवळीचे खत जमिनीत गाडावे.\n` +
          `• **सिंचन सल्ला:** काळ्या जमिनीत पाण्याचा निचरा योग्य ठेवावा व ठिबक सिंचनाचा वापर करावा.`;
        suggestedButtons = ['पिकांची नफा गणक', 'खतांचे प्रमाण', 'बाजारभाव'];
      } else if (userLang === 'hi') {
        responseText =
          `🪴 **मिट्टी का प्रकार व सर्वोत्तम फसल चयन (Soil Health Advice):**\n\n` +
          `• **काली मिट्टी (Vertisol, pH 7.2–8.0):**\n` +
          `  - नमी धारण करने की उच्च क्षमता, पोटाश की प्रचुरता।\n` +
          `  - **उत्तम फसलें:** सोयाबीन, भिंडी, प्याज, गेहूं, कपास, लहसुन, टमाटर।\n` +
          `• **सुधार:** यदि मिट्टी क्षारीय (pH > 8) है, तो 15 किग्रा सल्फर प्रति एकड़ डालें और जैविक खाद बढ़ाएं।`;
        suggestedButtons = ['मुनाफा कैलकुलेटर', 'खाद का समय', 'मंडी भाव'];
      } else {
        responseText =
          `🪴 **Soil Health & Crop Selection Advisory:**\n\n` +
          `• **Black Vertisol Soils (pH 7.2–8.0):** High moisture retention and natural potassium.\n` +
          `• **Optimal Recommended Crops:** Soybean, Ladyfinger, Onion, Wheat, Cotton, Garlic, Tomato.\n` +
          `• **Soil Amendment:** Incorporate green manure (sunn hemp) to enhance organic carbon above 0.7%.\n` +
          `• **Irrigation:** Use drip irrigation to prevent waterlogging in heavy clay horizons.`;
        suggestedButtons = ['Profit Calculator', 'Fertilizer Regimen', 'Mandi Prices'];
      }
    } else if (isSubsidyQuery) {
      if (userLang === 'mr') {
        responseText =
          `🏛️ **शेतकऱ्यांसाठी चालू शासकीय योजना व अनुदान (Government Subsidies):**\n\n` +
          `1️⃣ **महाडीबीटी ठिबक सिंचन योजना (MahaDBT Micro-Irrigation):**\n` +
          `• लहान व अल्पभूधारक शेतकऱ्यांना **७५% ते ८०%** अनुदान, इतर शेतकऱ्यांना ५०% अनुदान.\n\n` +
          `2️⃣ **पीएम किसान सन्मान निधी (PM-KISAN):**\n` +
          `• दरवर्षी ₹६,००० (३ हप्त्यांमध्ये ₹२,०००) थेट बँक खात्यात.\n\n` +
          `3️⃣ **पंतप्रधान पीक विमा योजना (PMFBY):**\n` +
          `• खरीप पिकांसाठी २% व रब्बीसाठी १.५% अत्यल्प हप्ता, नैसर्गिक आपत्तीत भरपाई.\n\n` +
          `4️⃣ **माती परीक्षण कार्ड (Soil Health Card Scheme):**\n` +
          `• जवळच्या कृषी विज्ञान केंद्रात (KVK) मोफत माती तपासणी.`;
        suggestedButtons = ['योजनेचा अर्ज कसा करावा?', 'बाजारभाव पहा', 'तज्ञांशी चर्चा'];
      } else if (userLang === 'hi') {
        responseText =
          `🏛️ **सरकारी कृषि योजनाएं व सब्सिडी (Government Schemes):**\n\n` +
          `1️⃣ **ड्रिप सिंचाई सब्सिडी (PMKSY):**\n` +
          `• सूक्ष्म सिंचाई लगाने पर लघु व सीमांत किसानों को **70% से 80%** तक सब्सिडी मिलती है।\n\n` +
          `2️⃣ **पीएम किसान सम्मान निधि:**\n` +
          `• प्रति वर्ष ₹6,000 की वित्तीय सहायता सीधे बैंक खाते में।\n\n` +
          `3️⃣ **प्रधानमंत्री फसल बीमा योजना (PMFBY):**\n` +
          `• प्राकृतिक आपदा से फसल नुकसान पर न्यूनतम प्रीमियम (1.5-2%) पर पूरा क्लेम।`;
        suggestedButtons = ['आवेदन कैसे करें?', 'मंडी भाव', 'विशेषज्ञ सहायता'];
      } else {
        responseText =
          `🏛️ **Key Government Schemes & Agricultural Subsidies:**\n\n` +
          `1️⃣ **PMKSY Micro-Irrigation Drip Subsidy:** Up to **75%-80%** financial assistance for small/marginal farmers.\n` +
          `2️⃣ **PM-KISAN Scheme:** ₹6,000/year direct cash transfer in three equal tranches.\n` +
          `3️⃣ **PM Fasal Bima Yojana (Crop Insurance):** Comprehensive yield protection against unseasonal rains and drought at 1.5-2% nominal premium.\n` +
          `4️⃣ **National Soil Health Card Scheme:** Free laboratory testing of 12 chemical soil parameters.`;
        suggestedButtons = ['How to Apply', "Today's Mandi Price", 'Talk to Agronomist'];
      }
    } else if (isExpertQuery) {
      isHandoff = true;
      if (userLang === 'mr') {
        responseText =
          `👨‍🌾 **किसानमित्र कृषी तज्ञ कक्ष (Verified Agronomist Helpdesk):**\n\n` +
          `आपला प्रश्न अधिकृत कृषी तज्ञांकडे नोंदवला गेला आहे. आमचे कृषी शास्त्रज्ञ (M.Sc. Agriculture) आपल्या पिकाच्या अचूक तपासणीसाठी सज्ज आहेत.\n\n` +
          `📞 **त्वरित संपर्क पर्याय:**\n` +
          `• किसान कॉल सेंटर राष्ट्रीय टोल फ्री: **1800-180-1551**\n` +
          `• किसानमित्र तज्ञ थेट चॅट: खालील बटणावर क्लिक करा.`;
        suggestedButtons = ['कृषी तज्ञांशी थेट बोला', 'आजचा बाजारभाव', 'खत वेळापत्रक'];
      } else if (userLang === 'hi') {
        responseText =
          `👨‍🌾 **किसानमित्र कृषि विशेषज्ञ सहायता (Agronomist Support):**\n\n` +
          `आपकी समस्या कृषि वैज्ञानिक को अग्रेषित कर दी गई है।\n\n` +
          `📞 **सीधे संपर्क सूत्र:**\n` +
          `• किसान कॉल सेंटर (टोल-फ्री): **1800-180-1551**\n` +
          `• विशेषज्ञ टिकट संख्या: **#KM-7824** दर्ज कर ली गई है।`;
        suggestedButtons = ['विशेषज्ञ से बात करें', 'आज का मंडी भाव', 'खाद का समय'];
      } else {
        responseText =
          `👨‍🌾 **KisanMitra Agronomist Consultation Desk:**\n\n` +
          `Your agricultural inquiry has been registered with our certified agronomy team.\n\n` +
          `📞 **Immediate Contact Points:**\n` +
          `• National Kisan Call Centre Toll-Free: **1800-180-1551**\n` +
          `• Ticket **#KM-7824** generated for agronomist direct review.`;
        suggestedButtons = ['Connect to Agronomist', "Today's Mandi Price", 'Fertilizer Advice'];
      }
    } else {
      // General Greeting or broad farming question
      const cropName = userLang === 'mr' ? detectedCrop.nameMr : userLang === 'hi' ? detectedCrop.nameHi : detectedCrop.nameEn;

      if (userLang === 'mr') {
        responseText =
          `🙏 **नमस्कार शेतकरी बंधूंनो! मी आपला किसानमित्र AI सहाय्यक आहे.**\n\n` +
          `मी आपल्याला खालील सर्व विषयांवर अचूक माहिती देऊ शकतो:\n` +
          `• 📈 **थेट बाजारभाव:** भेंडी, कांदा, टोमॅटो, लसूण, आले, गहू, कापूस इ. चे नजीकच्या समित्यांमधील भाव.\n` +
          `• ⚖️ **विक्री सल्ला:** माल कधी विकावा व पुढील १४ दिवसांचा भाव अंदाज.\n` +
          `• 🧪 **खत व्यवस्थापन:** योग्य डोस व फवारणी वेळापत्रक.\n` +
          `• 🐛 **कीड व रोग नियंत्रण:** फवारणीचे अचूक प्रमाण.\n` +
          `• 🏛️ **शासकीय अनुदान व योजना:** ठिबक सिंचन व पीएम किसान.\n\n` +
          `आपला प्रश्न खाली मराठी, हिंदी किंवा कोणत्याही भारतीय भाषेत विचारा!`;
        suggestedButtons = [`${cropName} चा आजचा भाव`, 'माल कधी विकू?', 'खताचे वेळापत्रक', 'कृषी तज्ञांशी चर्चा'];
      } else if (userLang === 'hi') {
        responseText =
          `🙏 **नमस्ते किसान भाई! मैं आपका किसानमित्र AI कृषि सहायक हूँ।**\n\n` +
          `मैं आपकी इन सभी विषयों में सहायता कर सकता हूँ:\n` +
          `• 📈 **लाइव मंडी भाव:** भिंडी, प्याज, टमाटर, लहसुन, अदरक, गेहूं, कपास के भाव।\n` +
          `• ⚖️ **फसल कब बेचें:** 14 दिनों का मूल्य पूर्वानुमान व सलाह।\n` +
          `• 🧪 **उर्वरक एवं खाद:** सही मात्रा व छिड़काव का समय।\n` +
          `• 🐛 **कीट एवं रोग रोकथाम:** तुरंत प्रभावकारी दवाएं।\n` +
          `• 🏛️ **सरकारी योजनाएं:** ड्रिप सब्सिडी व पीएम किसान।\n\n` +
          `आप अपना सवाल हिंदी, मराठी या किसी भी भाषा में पूछ सकते हैं!`;
        suggestedButtons = [`${cropName} का आज का भाव`, 'फसल कब बेचना चाहिए?', 'खाद की मात्रा', 'कृषि विशेषज्ञ'];
      } else {
        responseText =
          `🙏 **Hello Farmer! I am your KisanMitra AI Agricultural Assistant.**\n\n` +
          `I can help you with comprehensive guidance across India:\n` +
          `• 📈 **Live APMC Mandi Rates:** Real-time Grade A, B, and modal prices per kg and quintal.\n` +
          `• ⚖️ **Selling Advisory:** 14-day price forecasting & optimal liquidation timing.\n` +
          `• 🧪 **Crop Nutrition:** ICAR-approved basal and fertigation schedules.\n` +
          `• 🐛 **Pest & Disease Control:** Organic IPM and targeted crop protection.\n` +
          `• 🏛️ **Government Subsidies:** Micro-irrigation and PM-Kisan benefits.\n\n` +
          `Ask your question in any Indian language or English!`;
        suggestedButtons = [`Today's ${cropName} Price`, 'When Should I Sell?', 'Fertilizer Plan', 'Talk to Agronomist'];
      }
    }

    const response: ChatApiResponse = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      channel: body.channel || 'web',
      language: userLang,
      text: responseText,
      sources,
      suggestedButtons,
      isHandoff,
      cropDetected: detectedCrop.key,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      {
        id: `err-${Date.now()}`,
        sender: 'bot',
        channel: 'web',
        language: 'en',
        text: 'मी आपला किसानमित्र AI सहाय्यक आहे. कृपया आपला शेतीविषयक प्रश्न (उदा. बाजारभाव, खत व्यवस्थापन, रोग नियंत्रण किंवा विक्री सल्ला) विचारा.',
        sources: ['KisanMitra Engine'],
        suggestedButtons: ["Today's Mandi Price", 'Talk to Expert'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { status: 200 }
    );
  }
}
