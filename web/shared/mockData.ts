import {
  Product,
  FertilizerPlan,
  CommodityMaster,
  PriceRecord,
  PriceForecast,
  MarketRanking,
  SellOrWaitDecision,
  SoilProfile,
  CropSuitability,
  HandoffTicket
} from './types';

export const MOCK_COMMODITIES: CommodityMaster[] = [
  {
    id: 1,
    name: 'Wheat',
    category: 'grain',
    localNames: { hi: 'गेहूं', mr: 'गहू', gu: 'ઘઉં', pa: 'ਕਣਕ' },
    msp: 2275 // 2024-25 MSP in ₹/quintal
  },
  {
    id: 2,
    name: 'Soybean',
    category: 'grain',
    localNames: { hi: 'सोयाबीन', mr: 'सोयाबीन', gu: 'સોયાબીન' },
    msp: 4892
  },
  {
    id: 3,
    name: 'Cotton',
    category: 'grain',
    localNames: { hi: 'कपास', mr: 'कापूस', gu: 'કપાસ' },
    msp: 7121
  },
  {
    id: 4,
    name: 'Mustard',
    category: 'grain',
    localNames: { hi: 'सरसों', mr: 'मोहरी', gu: 'રાઈ' },
    msp: 5650
  },
  {
    id: 5,
    name: 'Tomato',
    category: 'vegetable',
    localNames: { hi: 'टमाटर', mr: 'टोमॅटो', gu: 'ટામેટા' }
  },
  {
    id: 6,
    name: 'Onion',
    category: 'vegetable',
    localNames: { hi: 'प्याज', mr: 'कांदा', gu: 'ડુંગળી' }
  },
  {
    id: 7,
    name: 'Potato',
    category: 'vegetable',
    localNames: { hi: 'आलू', mr: 'बटाटा', gu: 'બટાકા' }
  },
  {
    id: 8,
    name: 'Turmeric',
    category: 'spice',
    localNames: { hi: 'हल्दी', mr: 'हळद', gu: 'હળદર' }
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'IFFCO Nano Urea Liquid',
    category: 'fertilizer',
    crop: 'All Crops (Wheat, Paddy, Vegetables)',
    brand: 'IFFCO',
    packSize: '500 ml Bottle (Equal to 1 Bag Urea)',
    price: 225,
    stock: 240,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    description: 'Eco-friendly nanotechnology foliar nitrogen spray. Increases crop yield with 80% nitrogen efficiency without groundwater leaching.',
    isAvailable: true
  },
  {
    id: 102,
    name: 'IFFCO Nano DAP Liquid',
    category: 'fertilizer',
    crop: 'Wheat, Soybean, Mustard',
    brand: 'IFFCO',
    packSize: '500 ml Bottle',
    price: 600,
    stock: 180,
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    description: 'Concentrated source of phosphorus and nitrogen for root establishment and healthy tillering at early stages.',
    isAvailable: true
  },
  {
    id: 103,
    name: 'Mahyco Gold Hybrid Wheat Seed HD-2967',
    category: 'seed',
    crop: 'Wheat (गेहूं)',
    brand: 'Mahyco',
    packSize: '40 kg Bag',
    price: 1850,
    stock: 95,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    description: 'High yielding certified seed with rust resistance, bold grains, and suitable for timely sown irrigated conditions.',
    isAvailable: true
  },
  {
    id: 104,
    name: 'Kaveri Cotton Seed Jaadu BG-II',
    category: 'seed',
    crop: 'Cotton (कपास)',
    brand: 'Kaveri Seeds',
    packSize: '450 g Packet',
    price: 864,
    stock: 130,
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    description: 'Top-rated bollgard II hybrid cotton. Big boll size, quick bursting, excellent sucking pest tolerance.',
    isAvailable: true
  },
  {
    id: 105,
    name: 'Coromandel Gromor 10:26:26 Complex',
    category: 'fertilizer',
    crop: 'Soybean, Potato, Sugarcane',
    brand: 'Coromandel International',
    packSize: '50 kg Bag',
    price: 1470,
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    description: 'High potassium and phosphorus complex fertilizer for tuber development, grain filling and drought resistance.',
    isAvailable: true
  },
  {
    id: 106,
    name: 'UPL Saaf Fungicide (Carbendazim + Mancozeb)',
    category: 'pesticide',
    crop: 'Tomato, Potato, Chilli, Groundnut',
    brand: 'UPL',
    packSize: '500 g Pack',
    price: 430,
    stock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    description: 'Systemic and contact broad-spectrum fungicide for leaf spot, blast, blight and damping-off protection.',
    isAvailable: true
  },
  {
    id: 107,
    name: 'Bayer Regent SC (Fipronil 5%)',
    category: 'pesticide',
    crop: 'Rice, Sugarcane, Cotton',
    brand: 'Bayer CropScience',
    packSize: '250 ml',
    price: 520,
    stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    description: 'Protects root zone against stem borer, leaf folder, and early shoot insects with plant growth enhancement effect.',
    isAvailable: true
  }
];

export const MOCK_FERTILIZER_PLANS: FertilizerPlan[] = [
  {
    id: 201,
    crop: 'Wheat (गेहूं)',
    growthStage: 'Basal Dose (बुवाई के समय / Sowing Stage)',
    fertilizer: 'DAP (Diammonium Phosphate) + MOP',
    quantityPerAcre: '50 kg DAP + 20 kg MOP per acre',
    timing: 'Incorporate into soil at final ploughing just before seed drilling',
    notes: 'Provides foundational phosphorus for root branching and early tillering.',
    expertApproved: true,
    approvalSource: 'Approved by ICAR-IIWBR & State Agriculture University Agronomists',
    adjustedForSoil: 'Low Soil Phosphorus detected: DAP increased by 10 kg/acre.',
    disclaimer: 'Fertilizer advice must be based on Soil Health Card lab tests. Consult local KVK agronomist.'
  },
  {
    id: 202,
    crop: 'Wheat (गेहूं)',
    growthStage: '1st Irrigation / Tillering (20-25 Days)',
    fertilizer: 'Neem Coated Urea + Zinc Sulphate (21%)',
    quantityPerAcre: '35 kg Urea + 5 kg Zinc per acre',
    timing: 'Top dress immediately after first crown root irrigation (CRI stage)',
    notes: 'Crucial for vigorous tiller production. Avoid water stagnation.',
    expertApproved: true,
    approvalSource: 'Approved by ICAR-IIWBR & State Agriculture University Agronomists',
    disclaimer: 'Fertilizer advice must be based on Soil Health Card lab tests. Consult local KVK agronomist.'
  },
  {
    id: 203,
    crop: 'Wheat (गेहूं)',
    growthStage: 'Booting / Spike Emergence (55-60 Days)',
    fertilizer: 'IFFCO Nano Urea Liquid + NPK 00:00:50',
    quantityPerAcre: '250 ml Nano Urea + 1 kg NPK 00:00:50 in 150L water',
    timing: 'Foliar spray during clear morning sunshine',
    notes: 'Maximizes grain weight, prevents tip drying, and enhances protein content.',
    expertApproved: true,
    approvalSource: 'Approved by ICAR-IIWBR & State Agriculture University Agronomists',
    disclaimer: 'Fertilizer advice must be based on Soil Health Card lab tests. Consult local KVK agronomist.'
  },
  {
    id: 204,
    crop: 'Cotton (कपास)',
    growthStage: 'Basal Dose (बुवाई पूर्व)',
    fertilizer: 'NPK 10:26:26 + Magnesium Sulphate',
    quantityPerAcre: '50 kg NPK + 10 kg MgSO4 per acre',
    timing: 'Apply in furrows 5 cm below seed depth',
    notes: 'Ensures balanced vegetative start and strong stem resistance.',
    expertApproved: true,
    approvalSource: 'Approved by ICAR-CICR Cotton Directorate',
    disclaimer: 'Do not exceed nitrogen doses in high rainfall black soils.'
  },
  {
    id: 205,
    crop: 'Tomato (टमाटर)',
    growthStage: 'Transplanting to 20 Days',
    fertilizer: 'NPK 19:19:19 (Water Soluble)',
    quantityPerAcre: '3 kg per acre via drip fertigation twice a week',
    timing: 'During evening drip cycle',
    notes: 'Stimulates fast root revival and early flower clusters.',
    expertApproved: true,
    approvalSource: 'Approved by Indian Institute of Horticultural Research (IIHR)',
    disclaimer: 'Check soil pH; maintain between 6.0 and 7.0 for optimal micronutrient uptake.'
  }
];

export const MOCK_PRICES: PriceRecord[] = [
  {
    id: 1,
    commodityName: 'Wheat',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore APMC Mandi (Chhavani)',
    minPrice: 2450,
    maxPrice: 2950,
    modalPrice: 2720,
    arrivalsTonnes: 450,
    priceDate: '2026-10-23'
  },
  {
    id: 2,
    commodityName: 'Wheat',
    state: 'Madhya Pradesh',
    district: 'Dewas',
    market: 'Dewas Mandi',
    minPrice: 2400,
    maxPrice: 2820,
    modalPrice: 2640,
    arrivalsTonnes: 280,
    priceDate: '2026-10-23'
  },
  {
    id: 3,
    commodityName: 'Wheat',
    state: 'Madhya Pradesh',
    district: 'Ujjain',
    market: 'Ujjain Krishi Upaj Mandi',
    minPrice: 2480,
    maxPrice: 2980,
    modalPrice: 2760,
    arrivalsTonnes: 520,
    priceDate: '2026-10-23'
  },
  {
    id: 4,
    commodityName: 'Soybean',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore APMC Mandi (Chhavani)',
    minPrice: 4350,
    maxPrice: 4780,
    modalPrice: 4620,
    arrivalsTonnes: 850,
    priceDate: '2026-10-23'
  },
  {
    id: 5,
    commodityName: 'Cotton',
    state: 'Maharashtra',
    district: 'Nagpur',
    market: 'Nagpur APMC Cotton Yard',
    minPrice: 6800,
    maxPrice: 7650,
    modalPrice: 7350,
    arrivalsTonnes: 340,
    priceDate: '2026-10-23'
  },
  {
    id: 6,
    commodityName: 'Onion',
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon Mandi',
    minPrice: 1650,
    maxPrice: 2550,
    modalPrice: 2300,
    arrivalsTonnes: 1250,
    priceDate: '2026-10-23'
  }
];

export const MOCK_FORECASTS: Record<string, PriceForecast> = {
  'Onion': {
    commodity: 'Onion',
    market: 'Lasalgaon Mandi',
    p10: 2200,
    p50: 2450,
    p90: 2700,
    horizonDays: 14,
    shapDrivers: [
      'Supply arrivals tapering off in Nashik belt (+₹110)',
      'Southern state retail demand strengthening (+₹60)',
      'Export ban easing speculation in domestic markets (+₹80)'
    ],
    newsWarning: 'Arrivals dropped 18% this week across Lasalgaon and Pimpalgaon. Prices expected to firm up.',
    disclaimer: 'Forecast is decision support, not a guarantee. Figures shown are sample data.'
  },
  'Wheat': {
    commodity: 'Wheat',
    market: 'Indore APMC Mandi',
    p10: 2580,
    p50: 2810,
    p90: 3050,
    horizonDays: 14,
    shapDrivers: [
      'Strong festive flour demand (+₹65)',
      'Government buffer stock open tender delayed (+₹45)',
      'Lower arrivals reported across central MP mandis (+₹30)'
    ],
    newsWarning: 'Procurement centers opening announcement expected next week. Short-term price spike likely.',
    disclaimer: 'Forecast is decision support, not a guarantee.'
  },
  'Soybean': {
    commodity: 'Soybean',
    market: 'Indore APMC Mandi',
    p10: 4400,
    p50: 4680,
    p90: 4920,
    horizonDays: 14,
    shapDrivers: [
      'International edible oil tariff increase (+₹95)',
      'High moisture in fresh arrivals (-₹40)',
      'Crushers active with steady spot margins (+₹35)'
    ],
    newsWarning: 'Watch moisture levels; dry stock commands ₹120/q premium.',
    disclaimer: 'Forecast is decision support, not a guarantee.'
  },
  // Aliases for compatibility
  'Wheat (गेहूं)': {
    commodity: 'Wheat',
    market: 'Indore APMC Mandi',
    p10: 2580,
    p50: 2810,
    p90: 3050,
    horizonDays: 14,
    shapDrivers: [
      'Strong festive flour demand (+₹65)',
      'Government buffer stock open tender delayed (+₹45)',
      'Lower arrivals reported across central MP mandis (+₹30)'
    ],
    newsWarning: 'Procurement centers opening announcement expected next week. Short-term price spike likely.',
    disclaimer: 'Forecast is decision support, not a guarantee.'
  },
  'Soybean (सोयाबीन)': {
    commodity: 'Soybean',
    market: 'Indore APMC Mandi',
    p10: 4400,
    p50: 4680,
    p90: 4920,
    horizonDays: 14,
    shapDrivers: [
      'International edible oil tariff increase (+₹95)',
      'High moisture in fresh arrivals (-₹40)',
      'Crushers active with steady spot margins (+₹35)'
    ],
    newsWarning: 'Watch moisture levels; dry stock commands ₹120/q premium.',
    disclaimer: 'Forecast is decision support, not a guarantee.'
  }
};

export const MOCK_MARKET_RANKINGS: MarketRanking[] = [
  {
    marketName: 'Ujjain Krishi Upaj Mandi',
    district: 'Ujjain',
    distanceKm: 55,
    grossPrice: 2760,
    transportCost: 45,
    mandiFee: 28,
    transitLoss: 12,
    netIncome: 2675,
    latitude: 23.1765,
    longitude: 75.7885,
    verdict: 'Best Net Income'
  },
  {
    marketName: 'Indore APMC Mandi (Chhavani)',
    district: 'Indore',
    distanceKm: 18,
    grossPrice: 2720,
    transportCost: 20,
    mandiFee: 27,
    transitLoss: 8,
    netIncome: 2665,
    latitude: 22.7196,
    longitude: 75.8577,
    verdict: 'Alternate'
  },
  {
    marketName: 'Dewas Mandi',
    district: 'Dewas',
    distanceKm: 38,
    grossPrice: 2640,
    transportCost: 35,
    mandiFee: 26,
    transitLoss: 10,
    netIncome: 2569,
    latitude: 22.9676,
    longitude: 76.0534,
    verdict: 'Avoid'
  }
];

export const MOCK_SELL_OR_WAIT: SellOrWaitDecision = {
  crop: 'Wheat (गेहूं)',
  currentModalPrice: 2720,
  projected14DayPrice: 2840,
  changePct: 4.4,
  verdict: 'WAIT & STORE',
  confidence: '82% High Confidence',
  storageLossRiskPct: 0.8,
  summaryExplanation: '14-day forecast projects prices climbing towards ₹2,840/q driven by mill procurement demand. Net expected gain of ₹85/q after deducting warehouse rental and moisture loss.'
};

export const MOCK_SOIL: SoilProfile = {
  soilClass: 'Medium Deep Black Clayey Soil (Vertisol)',
  ph: 7.6,
  texture: 'Clay Loam (हल्की चिकनी दोमट)',
  organicCarbon: 0.52,
  nitrogenKgHa: 195, // Low
  phosphorusKgHa: 14, // Low-Medium
  potassiumKgHa: 340, // High
  isEstimate: true
};

export const MOCK_RECOMMENDED_CROPS: CropSuitability[] = [
  {
    cropName: 'Wheat (HD-2967 / GW-322)',
    suitabilityScore: 94,
    reasons: ['Optimal clay loam retention', 'Favorable winter temp cycle', 'High market liquidity in MP'],
    expectedYieldQuintalPerAcre: 22,
    expectedProfitPerAcre: 38500
  },
  {
    cropName: 'Gram / Chana (JG-14 / Dollar)',
    suitabilityScore: 89,
    reasons: ['Deep taproot utilizes residual moisture', 'Atmospheric nitrogen fixing replenishes soil', 'MSP protected'],
    expectedYieldQuintalPerAcre: 10,
    expectedProfitPerAcre: 31200
  },
  {
    cropName: 'Mustard (Pusa Bold)',
    suitabilityScore: 84,
    reasons: ['Low irrigation requirement (2 watering cycles)', 'Resistant to mild alkaline pH', 'High edible oil price index'],
    expectedYieldQuintalPerAcre: 8.5,
    expectedProfitPerAcre: 27800
  },
  {
    cropName: 'Garlic (G-282 / Ooty-1)',
    suitabilityScore: 78,
    reasons: ['High cash crop value', 'Suitable for well-drained raised beds', 'High local Mandi demand in Mandsaur'],
    expectedYieldQuintalPerAcre: 32,
    expectedProfitPerAcre: 74000
  },
  {
    cropName: 'Potato (Kufri Jyoti)',
    suitabilityScore: 75,
    reasons: ['Rich potassium in soil aids tuber bulk', 'Quick 90-day turnaround', 'Requires close blight monitoring'],
    expectedYieldQuintalPerAcre: 90,
    expectedProfitPerAcre: 52000
  }
];

export const MOCK_HANDOFF_TICKETS: HandoffTicket[] = [
  {
    id: 501,
    farmerName: 'Ramesh Patel (रमेश पटेल)',
    phone: '+91 98261 44521',
    question: 'गेंहू की फसल में पीला रतुआ (Yellow Rust) के शुरुआती लक्षण दिख रहे हैं। क्या प्रोपिकोनाजोल 25% EC का छिड़काव तुरंत कर सकते हैं और कितनी मात्रा?',
    language: 'hi',
    channel: 'whatsapp',
    status: 'open',
    createdAt: '2026-10-23T10:15:00+05:30'
  },
  {
    id: 502,
    farmerName: 'Balasaheb Shinde (बाळासाहेब शिंदे)',
    phone: '+91 94220 89123',
    question: 'कांद्याला जास्त भाव मिळवण्यासाठी लासलगाव की पिंपळगाव मार्केटला माल पाठवणे योग्य राहील? वाहतूक खर्च कसा कमी करावा?',
    language: 'mr',
    channel: 'web',
    status: 'answered',
    agronomistReply: 'सध्या पिंपळगावमध्ये सुपर क्वालिटी कांद्याला ₹५० प्रति क्विंटल जास्तीचा भाव आहे. जर तुमचा माल ५ टन पेक्षा जास्त असेल तर पिंपळगाव निवडा, अन्यथा लासलगाव जवळ पडेल.',
    createdAt: '2026-10-22T16:20:00+05:30',
    answeredAt: '2026-10-22T17:05:00+05:30'
  }
];
