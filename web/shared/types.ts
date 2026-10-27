// KisanMitra Shared Types
// Covers all entities, multi-lingual support, store, and AI assistant interfaces

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'mr' // Marathi (मराठी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'bn' // Bengali (বাংলা)
  | 'pa'; // Punjabi (ਪੰਜਾਬੀ)

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  indicTransCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', indicTransCode: 'hin_Deva' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', indicTransCode: 'mar_Deva' },
  { code: 'en', name: 'English', nativeName: 'English', indicTransCode: 'eng_Latn' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', indicTransCode: 'guj_Gujr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', indicTransCode: 'tam_Taml' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', indicTransCode: 'tel_Telu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', indicTransCode: 'kan_Knda' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', indicTransCode: 'ben_Beng' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', indicTransCode: 'pan_Guru' },
];

export type CommodityCategory = 'grain' | 'spice' | 'fruit' | 'vegetable';

export interface CommodityMaster {
  id: number;
  name: string;
  category: CommodityCategory;
  localNames: Record<string, string>;
  msp?: number; // Minimum Support Price per quintal (₹)
}

export interface PriceRecord {
  id: number;
  commodityName: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalsTonnes: number;
  priceDate: string;
}

export interface PriceForecast {
  commodity: string;
  market: string;
  p10: number; // pessimistic 10th percentile
  p50: number; // most likely median
  p90: number; // optimistic 90th percentile
  horizonDays: 7 | 14 | 30;
  shapDrivers: string[]; // key drivers e.g. "Monsoon arrival in MP", "High festival demand"
  newsWarning?: string;
  disclaimer: string;
}

export interface MarketRanking {
  marketName: string;
  district: string;
  distanceKm: number;
  grossPrice: number;
  transportCost: number;
  mandiFee: number;
  transitLoss: number;
  netIncome: number;
  latitude: number;
  longitude: number;
  verdict: 'Best Net Income' | 'Alternate' | 'Avoid';
}

export interface SellOrWaitDecision {
  crop: string;
  currentModalPrice: number;
  projected14DayPrice: number;
  changePct: number;
  verdict: 'SELL NOW' | 'WAIT & STORE';
  confidence: string;
  storageLossRiskPct: number;
  summaryExplanation: string;
}

export interface SoilProfile {
  soilClass: string;
  ph: number;
  texture: string;
  organicCarbon: number;
  nitrogenKgHa?: number;
  phosphorusKgHa?: number;
  potassiumKgHa?: number;
  isEstimate: boolean; // true if satellite/SoilGrids, false if Soil Health Card lab verified
}

export interface CropSuitability {
  cropName: string;
  suitabilityScore: number; // 0 - 100
  reasons: string[];
  expectedYieldQuintalPerAcre: number;
  expectedProfitPerAcre: number;
}

export type ProductCategory = 'seed' | 'fertilizer' | 'pesticide';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  crop: string;
  brand: string;
  packSize: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  isAvailable: boolean;
}

export interface FertilizerPlan {
  id: number;
  crop: string;
  growthStage: string; // e.g. "Basal Dose (Sowing)", "30 Days (Vegetative)", "60 Days (Flowering/Fruiting)"
  fertilizer: string;
  quantityPerAcre: string;
  timing: string;
  notes: string;
  expertApproved: boolean;
  approvalSource: string; // e.g. "Approved by ICAR / State Agriculture University Agronomist"
  adjustedForSoil?: string; // e.g. "Low Phosphorus in Soil Card: DAP increased by 15%"
  disclaimer: string;
}

export interface ProductRequest {
  id: number;
  userId?: string;
  productId: number;
  productName?: string;
  crop?: string;
  quantity: number;
  farmerName: string;
  farmerPhone: string;
  village: string;
  district: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'bot' | 'agronomist';
  channel: 'web' | 'whatsapp' | 'telegram' | 'app';
  text: string;
  language: SupportedLanguage;
  sources?: string[];
  intent?: string;
  suggestedButtons?: string[];
  audioUrl?: string;
  timestamp: string;
  isHandoff?: boolean;
}

export interface HandoffTicket {
  id: number;
  farmerName: string;
  phone: string;
  question: string;
  language: SupportedLanguage;
  channel: 'web' | 'whatsapp' | 'telegram' | 'app';
  status: 'open' | 'answered' | 'closed';
  agronomistReply?: string;
  createdAt: string;
  answeredAt?: string;
}

export interface AdminStats {
  messagesToday: number;
  newProductRequests: number;
  openExpertQuestions: number;
  totalProducts: number;
  notFoundRatePct: number;
  languageBreakdown: Record<string, number>;
}

