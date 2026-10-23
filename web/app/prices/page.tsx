'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import {
  ChevronDown,
  MapPin,
  TrendingUp,
  Sparkles,
  Scale,
  Compass,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Info,
  Search,
  Filter
} from 'lucide-react';
import {
  INDIAN_MANDIS,
  findNearestAndHighestMandis,
  normalizeCropName,
  NearestAndHighestSummary,
  MandiRecord,
  getMandiCropPrice
} from '@/lib/geoService';
import {
  ALL_INDIAN_CROPS,
  CROP_CATEGORIES,
  resolveCropMaster,
  CropMasterRecord,
  CropCategory
} from '@/lib/cropDatabase';
import {
  getSavedFarmerLocation,
  saveFarmerLocation,
  detectRealUserLocation,
  UserLocationDetails,
  POPULAR_AGRI_REGIONS,
  DEFAULT_FARMER_LOCATION
} from '@/lib/location';

export default function PricesPage() {
  const { t, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  // Location state
  const [location, setLocation] = useState<UserLocationDetails>(DEFAULT_FARMER_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Unit toggle: 'kg' (₹/kg) vs 'quintal' (₹/q)
  const [priceUnit, setPriceUnit] = useState<'kg' | 'quintal'>('kg');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cropSearch, setCropSearch] = useState<string>('');
  const [selectedCropKey, setSelectedCropKey] = useState<string>('Ladyfinger');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('kolhapur-apmc');
  const [state, setState] = useState<string>('Maharashtra');

  // Load saved location on mount
  useEffect(() => {
    const saved = getSavedFarmerLocation();
    setLocation(saved);
  }, []);

  // Filter crops based on category & search term
  const filteredCrops = useMemo(() => {
    let list = ALL_INDIAN_CROPS;
    if (selectedCategory !== 'all') {
      list = list.filter(c => c.category === selectedCategory);
    }
    if (cropSearch.trim()) {
      const q = cropSearch.toLowerCase().trim();
      list = list.filter(c =>
        c.nameEn.toLowerCase().includes(q) ||
        c.nameMr.includes(q) ||
        c.nameHi.includes(q) ||
        c.aliases.some(a => a.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, cropSearch]);

  // Compute nearest & highest mandis summary based on live GPS and selected crop
  const mandiSummary = useMemo<NearestAndHighestSummary>(() => {
    return findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      selectedCropKey,
      2.0, // ₹2/q/km freight
      1.5, // 1.5% APMC fee
      1.0  // 1.0% transit loss
    );
  }, [location, selectedCropKey]);

  // Active Mandi resolution
  const activeMandi = useMemo<MandiRecord>(() => {
    const found = INDIAN_MANDIS.find(m => m.id === selectedMandiId);
    return found || mandiSummary.nearestMandi.mandi;
  }, [selectedMandiId, mandiSummary]);

  // Active crop master record & price data
  const currentCropMaster = mandiSummary.cropMaster || resolveCropMaster(selectedCropKey);
  const currentPriceData = useMemo(() => {
    return getMandiCropPrice(activeMandi, selectedCropKey);
  }, [activeMandi, selectedCropKey]);

  // Price metrics
  const minQuintal = currentPriceData.min;
  const maxQuintal = currentPriceData.max;
  const modalQuintal = currentPriceData.modal;
  const yesterdayMaxQuintal = currentPriceData.yesterdayMax || Math.round(maxQuintal * 1.04);
  const arrivals = currentPriceData.arrivalsTonnes;

  // Convert helper based on unit
  const formatPrice = (quintalPrice: number) => {
    if (priceUnit === 'kg') {
      const perKg = (quintalPrice / 100).toFixed(1);
      return `₹${perKg}`;
    }
    return `₹${quintalPrice.toLocaleString('en-IN')}`;
  };

  const unitLabel = priceUnit === 'kg'
    ? (isEn ? 'per kg' : isMr ? 'प्रति किलो' : 'प्रति किलो')
    : (isEn ? 'per quintal' : isMr ? 'प्रति क्विंटल' : 'प्रति क्विंटल');
  const unitSuffix = priceUnit === 'kg' ? '/kg' : '/q';

  // Handle GPS detect
  const handleDetectGPS = async () => {
    setIsLocating(true);
    try {
      const detected = await detectRealUserLocation();
      setLocation(detected);
      saveFarmerLocation(detected);
      setLocationModalOpen(false);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectPresetRegion = (region: UserLocationDetails) => {
    setLocation(region);
    saveFarmerLocation(region);
    setLocationModalOpen(false);
  };

  // Crop localized display title
  const activeCropNameDisplay = isMr
    ? currentCropMaster.nameMr
    : isEn
    ? currentCropMaster.nameEn
    : currentCropMaster.nameHi;

  const strings = {
    title: isEn
      ? 'All India Mandi Rates & Quality Grading'
      : isMr
      ? 'सर्व पिके व भाजीपाला बाजारभाव (प्रतवारीनुसार)'
      : 'अखिल भारतीय मंडी भाव एवं गुणवत्ता ग्रेडिंग',
    subtitle: isEn
      ? "Yesterday's highest selling price in all nearest markets & today's expected selling rates for Good vs Average product (₹/kg & ₹/q)."
      : isMr
      ? 'जवळच्या सर्व बाजार समित्यांमधील कालचा सर्वोच्च उच्चांकी भाव आणि आज उत्तम व मध्यम मालास मिळणारा भाव (रुपये/किलो आणि क्विंटल).'
      : 'सभी नजदीकी मंडियों में कल का सर्वाधिक भाव एवं आज अच्छी व औसत उपज के अनुमानित बिक्री दर (₹/किलो व ₹/क्विंटल)।',
    state: isEn ? 'State' : isMr ? 'राज्य' : 'राज्य',
    market: isEn ? 'Market / Mandi' : isMr ? 'बाजार समिती' : 'मंडी',
    crop: isEn ? 'Select Crop' : isMr ? 'पीक निवडा' : 'फसल चुनें',
    min: isEn ? 'Minimum Price' : isMr ? 'किमान भाव' : 'न्यूनतम भाव',
    max: isEn ? 'Maximum Price' : isMr ? 'कमाल भाव' : 'अधिकतम भाव',
    modal: isEn ? 'Modal (Average) Price' : isMr ? 'सरासरी (सर्वसामान्य) भाव' : 'मॉडल (औसत) भाव',
    arrivals: isEn ? 'Arrivals today' : isMr ? 'आजची आवक' : 'दैनिक आवक',
    last90Days: isEn ? 'Last 90 days price trend' : isMr ? 'मागील ९० दिवसांमधील भाव कल' : 'पिछले 90 दिनों का भाव रुझान',
    sampleData: isEn ? 'Historical APMC auction log' : isMr ? 'बाजार समिती लिलाव नोंद' : 'मंडी नीलामी डेटा',
    daysAgo: isEn ? '90 days ago' : isMr ? '९० दिवसांपूर्वी' : '90 दिन पहले',
    today: isEn ? 'Today' : isMr ? 'आज' : 'आज',
    bestMonthsTitle: isEn ? 'Best selling months (monthly average)' : isMr ? 'विक्रीसाठी सर्वोत्तम महिने (मासिक सरासरी)' : 'बिक्री के सर्वोत्तम महीने (मासिक औसत)',
    bestMonthsNote: isEn
      ? 'Dark bars represent peak harvest demand and highest realization months.'
      : isMr
      ? 'गडद हिरवे बार सर्वाधिक मागणी आणि सर्वोच्च भाव मिळणारे महिने दर्शवतात.'
      : 'गहरे हरे बार उच्च मांग और सर्वोत्तम भाव वाले महीनों को दर्शाते हैं।',
    yesterdayHeroTitle: isEn
      ? "Yesterday's Highest Selling Price in Nearest Markets"
      : isMr
      ? 'जवळच्या सर्व बाजार समित्यांमध्ये कालचा सर्वोच्च उच्चांकी विक्री भाव'
      : 'सभी नजदीकी मंडियों में कल का सर्वाधिक बिक्री भाव',
    yesterdayHeroSub: isEn
      ? 'Top recorded price achieved in yesterday\'s APMC auctions for'
      : isMr
      ? 'कालच्या लिलावामध्ये मिळालेला सर्वोच्च रेकॉर्ड भाव:'
      : 'कल की नीलामी में दर्ज किया गया शीर्ष भाव:',
    qualitySectionTitle: isEn
      ? "Today's Expected Selling Price by Product Quality"
      : isMr
      ? 'आजचा प्रतवारीनुसार विक्री भाव (उत्तम vs मध्यम vs कनिष्ठ प्रत)'
      : 'आज गुणवत्ता अनुसार अनुमानित बिक्री भाव (उत्तम vs औसत vs सामान्य)',
    qualitySectionSub: isEn
      ? 'How much can you sell your produce for today based on quality grading?'
      : isMr
      ? 'आपल्या मालाच्या गुणवत्तेनुसार आज मिळणारा अचूक भाव दर:'
      : 'अपनी उपज की गुणवत्ता के अनुसार आज आपको मिलने वाला उचित दर:',
    gradeGoodTitle: isEn ? 'Good Product (Grade A - Premium)' : isMr ? 'उत्तम प्रत (Grade A - नंबर १ माल)' : 'उत्तम माल (Grade A - प्रीमियम)',
    gradeAvgTitle: isEn ? 'Average Product (Grade B - Regular)' : isMr ? 'मध्यम प्रत (Grade B - सर्वसामान्य माल)' : 'औसत माल (Grade B - सामान्य)',
    gradeLowTitle: isEn ? 'Low Product (Grade C - Mixed/Delayed)' : isMr ? 'कनिष्ठ प्रत (Grade C - साधारण / निब्बर)' : 'निम्न माल (Grade C - साधारण)',
    compareTableTitle: isEn
      ? 'All Nearest APMC Markets - Rate & Quality Comparison'
      : isMr
      ? 'सर्व जवळच्या बाजार समित्यांचे थेट दर व प्रतवारी तुलना'
      : 'सभी नजदीकी मंडियों के लाइव भाव और गुणवत्ता तुलना',
  };

  // Popular quick crops
  const popularCrops = [
    { key: 'Ladyfinger', label: isMr ? 'भेंडी' : isEn ? 'Ladyfinger' : 'भिंडी' },
    { key: 'Onion', label: isMr ? 'कांदा' : isEn ? 'Onion' : 'प्याज' },
    { key: 'Tomato', label: isMr ? 'टोमॅटो' : isEn ? 'Tomato' : 'टमाटर' },
    { key: 'Potato', label: isMr ? 'बटाटा' : isEn ? 'Potato' : 'आलू' },
    { key: 'GreenChilli', label: isMr ? 'मिरची' : isEn ? 'Green Chilli' : 'हरी मिर्च' },
    { key: 'Ginger', label: isMr ? 'आले' : isEn ? 'Ginger' : 'अदरक' },
    { key: 'Garlic', label: isMr ? 'लसूण' : isEn ? 'Garlic' : 'लहसुन' },
    { key: 'Wheat', label: isMr ? 'गहू' : isEn ? 'Wheat' : 'गेहूं' },
    { key: 'Soybean', label: isMr ? 'सोयाबीन' : isEn ? 'Soybean' : 'सोयाबीन' },
    { key: 'Turmeric', label: isMr ? 'हळद' : isEn ? 'Turmeric' : 'हल्दी' },
    { key: 'Cotton', label: isMr ? 'कापूस' : isEn ? 'Cotton' : 'कपास' },
    { key: 'Pomegranate', label: isMr ? 'डाळिंब' : isEn ? 'Pomegranate' : 'अनार' },
    { key: 'Banana', label: isMr ? 'केळी' : isEn ? 'Banana' : 'केला' },
    { key: 'Grapes', label: isMr ? 'द्राक्षे' : isEn ? 'Grapes' : 'अंगूर' },
  ];

  const goodPerKg = (maxQuintal / 100).toFixed(1);
  const avgPerKg = (modalQuintal / 100).toFixed(1);
  const lowPerKg = (minQuintal / 100).toFixed(1);
  const topNearMandi = mandiSummary.yesterdaysHighestNearMandi;

  // Quality descriptions dynamically pulled from crop master
  const activeLang = isMr ? 'mr' : isEn ? 'en' : 'hi';
  const goodDesc = currentCropMaster.qualityParams.goodGradeA[activeLang] || currentCropMaster.qualityParams.goodGradeA.en;
  const avgDesc = currentCropMaster.qualityParams.averageGradeB[activeLang] || currentCropMaster.qualityParams.averageGradeB.en;
  const lowDesc = currentCropMaster.qualityParams.lowGradeC[activeLang] || currentCropMaster.qualityParams.lowGradeC.en;

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header with Title and Unit Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#165b33] text-xs font-bold border border-emerald-300">
                All India APMC Network · {ALL_INDIAN_CROPS.length}+ Crops & Vegetables
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                Agmarknet (DMI) Live Sync
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {location.village}, {location.district}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              {strings.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              {strings.subtitle}
            </p>
          </div>

          {/* Unit Toggle: ₹/kg (like rs/kg) vs ₹/Quintal */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center bg-white p-1 rounded-2xl border-2 border-[#165b33]/20 shadow-xs">
              <button
                onClick={() => setPriceUnit('kg')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  priceUnit === 'kg'
                    ? 'bg-[#165b33] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>₹ / kg (रुपये/किलो)</span>
              </button>
              <button
                onClick={() => setPriceUnit('quintal')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  priceUnit === 'quintal'
                    ? 'bg-[#165b33] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>₹ / Quintal (क्विंटल)</span>
              </button>
            </div>

            <button
              onClick={() => setLocationModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-gray-800 shadow-xs transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#165b33]" />
              <span>{location.village || 'Location'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#165b33] text-white shadow-xs'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            All Crops ({ALL_INDIAN_CROPS.length})
          </button>
          {CROP_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#165b33] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              {isMr ? cat.labelMr : isEn ? cat.labelEn : cat.labelHi}
            </button>
          ))}
        </div>

        {/* Quick Popular Crop Selector Pills */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 pl-1">
            Popular:
          </span>
          <div className="flex items-center gap-1.5">
            {popularCrops.map(c => {
              const isActive = selectedCropKey === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setSelectedCropKey(c.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-[#165b33] border border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Selection Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
          
          {/* 1. Crop Search Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Search Any Indian Crop / Vegetable:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Type crop name (e.g. Bhindi, पालक, Garlic, Turmeric)..."
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                className="w-full bg-[#fcfdfc] border border-gray-300 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
              {cropSearch && (
                <button
                  onClick={() => setCropSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 2. Crop Dropdown (Filtered list of all crops) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              {strings.crop} ({filteredCrops.length} available)
            </label>
            <div className="relative">
              <select
                value={selectedCropKey}
                onChange={(e) => setSelectedCropKey(e.target.value)}
                className="w-full bg-[#fcfdfc] border-2 border-emerald-600/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-gray-900 appearance-none focus:outline-none focus:border-[#165b33] shadow-xs cursor-pointer"
              >
                {filteredCrops.map(c => (
                  <option key={c.key} value={c.key}>
                    {isMr
                      ? `${c.nameMr} (${c.nameEn})`
                      : isEn
                      ? `${c.nameEn} (${c.nameMr})`
                      : `${c.nameHi} (${c.nameEn})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-emerald-800 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Market Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">{strings.market}</label>
            <div className="relative">
              <select
                value={selectedMandiId}
                onChange={(e) => setSelectedMandiId(e.target.value)}
                className="w-full bg-[#fcfdfc] border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:border-[#165b33] shadow-xs cursor-pointer"
              >
                {INDIAN_MANDIS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.district}, {m.state})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* HERO SECTION 1: Yesterday's Highest Selling Price Across All Nearest Markets */}
        <div className="rounded-3xl bg-gradient-to-r from-[#165b33] to-[#0f3d22] text-white p-6 sm:p-7 shadow-sm border border-emerald-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{strings.yesterdayHeroTitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {strings.yesterdayHeroSub} <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">{activeCropNameDisplay}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-emerald-100">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>{topNearMandi.mandiName}</span>
                </span>
                <span className="text-emerald-300 font-mono">({topNearMandi.distanceKm} km from you)</span>
                <span className="hidden sm:inline text-emerald-400">·</span>
                <span className="text-emerald-200">
                  {isEn ? 'Top lot traded yesterday' : 'कालच्या लिलावात नोंदवलेला सर्वाधिक उच्चांकी दर'}
                </span>
                {currentCropMaster.msp && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold">
                    Govt MSP: ₹{currentCropMaster.msp.toLocaleString('en-IN')}/q (₹{(currentCropMaster.msp / 100).toFixed(1)}/kg)
                  </span>
                )}
              </div>
            </div>

            {/* Peak Price Display in ₹/kg and Quintal */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center lg:text-right shrink-0 flex flex-col justify-center min-w-[240px]">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300 block mb-1">
                {isEn ? "Yesterday's Peak Sell Rate" : "कालचा सर्वाधिक विक्री दर"}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline justify-center lg:justify-end gap-1">
                <span>{priceUnit === 'kg' ? `₹${topNearMandi.yesterdayMaxPerKg}` : `₹${topNearMandi.yesterdayMaxQuintal.toLocaleString('en-IN')}`}</span>
                <span className="text-base sm:text-lg font-bold text-emerald-200">{unitSuffix}</span>
              </div>
              <div className="text-xs text-emerald-100 mt-1.5 flex items-center justify-center lg:justify-end gap-2">
                <span>Equivalent:</span>
                <span className="font-bold text-white">
                  {priceUnit === 'kg'
                    ? `₹${topNearMandi.yesterdayMaxQuintal.toLocaleString('en-IN')} / quintal`
                    : `₹${topNearMandi.yesterdayMaxPerKg} / kg`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* HERO SECTION 2: Today's Selling Price by Quality (Good Product vs Average vs Low) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165b33] mb-1">
                <Scale className="w-3.5 h-3.5" />
                <span>Crop Quality Grading & Price Realization</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                {strings.qualitySectionTitle}
              </h2>
              <p className="text-xs text-gray-500">
                {strings.qualitySectionSub} ({activeMandi.name}, {activeMandi.district})
              </p>
            </div>

            <div className="text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs self-start sm:self-auto">
              Current Unit: <span className="font-bold text-[#165b33]">{priceUnit === 'kg' ? '₹ / Kilogram (₹/kg)' : '₹ / Quintal (100 kg)'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Good Product / Grade A (Premium) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>TOP GRADE A</span>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#165b33] text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#165b33]" />
                  <span>{strings.gradeGoodTitle}</span>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-500 block">
                    {isEn ? "Today's Selling Rate" : "आजचा विक्री दर"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight flex items-baseline gap-1 my-1">
                    <span>{priceUnit === 'kg' ? `₹${goodPerKg}` : `₹${maxQuintal.toLocaleString('en-IN')}`}</span>
                    <span className="text-sm font-semibold text-gray-600">{unitSuffix}</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {priceUnit === 'kg'
                      ? `Range: ₹${(maxQuintal * 0.95 / 100).toFixed(1)} - ₹${goodPerKg}/kg (₹${maxQuintal}/q)`
                      : `₹${goodPerKg} / kg equivalent`}
                  </div>
                </div>

                <div className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900 block mb-1">Quality Parameters:</span>
                  {goodDesc}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">Premium Buyers:</span>
                <span className="font-bold text-gray-900">Retail & Export</span>
              </div>
            </div>

            {/* 2. Average Product / Grade B (Standard Most Common) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-900 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <span>MOST COMMON</span>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-300">
                  <Scale className="w-3.5 h-3.5 text-gray-700" />
                  <span>{strings.gradeAvgTitle}</span>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-500 block">
                    {isEn ? "Today's Modal Rate" : "आजचा सरासरी दर"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight flex items-baseline gap-1 my-1">
                    <span>{priceUnit === 'kg' ? `₹${avgPerKg}` : `₹${modalQuintal.toLocaleString('en-IN')}`}</span>
                    <span className="text-sm font-semibold text-gray-600">{unitSuffix}</span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {priceUnit === 'kg'
                      ? `Range: ₹${((modalQuintal * 0.95) / 100).toFixed(1)} - ₹${((modalQuintal * 1.05) / 100).toFixed(1)}/kg (₹${modalQuintal}/q)`
                      : `₹${avgPerKg} / kg equivalent`}
                  </div>
                </div>

                <div className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900 block mb-1">Quality Parameters:</span>
                  {avgDesc}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-semibold">Standard Buyers:</span>
                <span className="font-bold text-gray-900">APMC Commission Agent</span>
              </div>
            </div>

            {/* 3. Low Product / Grade C (Sorting Remainder / Delayed) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{strings.gradeLowTitle}</span>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-500 block">
                    {isEn ? "Floor Selling Rate" : "तळ भाव (किमान)"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-gray-700 tracking-tight flex items-baseline gap-1 my-1">
                    <span>{priceUnit === 'kg' ? `₹${lowPerKg}` : `₹${minQuintal.toLocaleString('en-IN')}`}</span>
                    <span className="text-sm font-semibold text-gray-500">{unitSuffix}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {priceUnit === 'kg'
                      ? `Range: ₹${lowPerKg} - ₹${((minQuintal * 1.1) / 100).toFixed(1)}/kg (₹${minQuintal}/q)`
                      : `₹${lowPerKg} / kg equivalent`}
                  </div>
                </div>

                <div className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900 block mb-1">Quality Parameters:</span>
                  {lowDesc}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold">Buyers:</span>
                <span className="font-bold text-gray-700">Local Vendors / Processing</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Standard Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Minimum */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-34">
            <span className="text-xs font-medium text-gray-500">
              {strings.min} ({unitLabel})
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight my-auto">
              {formatPrice(minQuintal)}
            </div>
            <div className="text-[11px] text-gray-500">
              {priceUnit === 'kg' ? `₹${minQuintal.toLocaleString('en-IN')} / quintal` : `₹${(minQuintal / 100).toFixed(1)} / kg`}
            </div>
          </div>

          {/* Card 2: Maximum */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-34">
            <span className="text-xs font-medium text-gray-500">
              {strings.max} ({unitLabel})
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800 tracking-tight my-auto">
              {formatPrice(maxQuintal)}
            </div>
            <div className="text-[11px] text-gray-500">
              {priceUnit === 'kg' ? `₹${maxQuintal.toLocaleString('en-IN')} / quintal` : `₹${(maxQuintal / 100).toFixed(1)} / kg`}
            </div>
          </div>

          {/* Card 3: Modal (most common) */}
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-900 shadow-xs flex flex-col justify-between h-34">
            <span className="text-xs font-semibold text-gray-900">
              {strings.modal} ({unitLabel})
            </span>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight my-auto">
              {formatPrice(modalQuintal)}
            </div>
            <div className="text-[11px] text-gray-600 font-semibold">
              {priceUnit === 'kg' ? `₹${modalQuintal.toLocaleString('en-IN')} / quintal` : `₹${(modalQuintal / 100).toFixed(1)} / kg`}
            </div>
          </div>

          {/* Card 4: Arrivals today */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-34">
            <span className="text-xs font-medium text-gray-500">
              {strings.arrivals}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight my-auto">
              {arrivals} tonnes
            </div>
            <div className="text-[11px] text-gray-500">
              {arrivals * 10} quintals total volume
            </div>
          </div>
        </div>

        {/* SECTION 3: All Nearest APMC Markets Comparison Table */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#165b33]" />
                <span>{strings.compareTableTitle}</span>
              </h3>
              <p className="text-xs text-gray-500">
                Ranked by distance from your location ({location.village}, {location.district}) for {activeCropNameDisplay}
              </p>
            </div>

            <span className="text-xs font-bold text-[#165b33] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
              Prices displayed in {unitLabel}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold">
                  <th className="py-3 px-3">Market / Mandi</th>
                  <th className="py-3 px-3">Distance</th>
                  <th className="py-3 px-3 text-amber-700 bg-amber-50/60 font-bold">Yesterday's Peak</th>
                  <th className="py-3 px-3 text-emerald-800 bg-emerald-50/60 font-bold">Good Quality (Grade A)</th>
                  <th className="py-3 px-3 font-bold">Average Quality (Grade B)</th>
                  <th className="py-3 px-3">Transport & Fees</th>
                  <th className="py-3 px-3 font-extrabold text-[#165b33]">Net in Hand</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mandiSummary.allRanked.map((item, idx) => {
                  const q = item.qualityGrades;

                  return (
                    <tr
                      key={item.mandi.id}
                      className={`hover:bg-[#f9faf9] transition-colors ${
                        item.mandi.id === activeMandi.id ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{item.mandi.name}</span>
                          {idx === 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800">
                              NEAREST
                            </span>
                          )}
                          {item.mandi.id === mandiSummary.highestNetMandi.mandi.id && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-[#165b33]">
                              BEST NET
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {item.mandi.district}, {item.mandi.state}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-gray-700">
                        {item.distanceKm} km
                      </td>

                      {/* Yesterday's Peak Sell */}
                      <td className="py-3.5 px-3 bg-amber-50/40 font-bold text-amber-900">
                        <div>
                          {priceUnit === 'kg' ? `₹${q.yesterdayHighestPerKg}` : `₹${q.yesterdayHighestQuintal.toLocaleString('en-IN')}`}
                          <span className="text-[10px] font-normal text-gray-500">{unitSuffix}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {priceUnit === 'kg' ? `(₹${q.yesterdayHighestQuintal}/q)` : `(₹${q.yesterdayHighestPerKg}/kg)`}
                        </span>
                      </td>

                      {/* Today's Good Quality Rate */}
                      <td className="py-3.5 px-3 bg-emerald-50/40 font-black text-emerald-800">
                        <div>
                          {priceUnit === 'kg' ? `₹${q.goodProductPerKg}` : `₹${q.goodProductQuintal.toLocaleString('en-IN')}`}
                          <span className="text-[10px] font-normal text-gray-500">{unitSuffix}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {priceUnit === 'kg' ? `(₹${q.goodProductQuintal}/q)` : `(₹${q.goodProductPerKg}/kg)`}
                        </span>
                      </td>

                      {/* Today's Average Quality Rate */}
                      <td className="py-3.5 px-3 font-bold text-gray-900">
                        <div>
                          {priceUnit === 'kg' ? `₹${q.averageProductPerKg}` : `₹${q.averageProductQuintal.toLocaleString('en-IN')}`}
                          <span className="text-[10px] font-normal text-gray-500">{unitSuffix}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {priceUnit === 'kg' ? `(₹${q.averageProductQuintal}/q)` : `(₹${q.averageProductPerKg}/kg)`}
                        </span>
                      </td>

                      {/* Freight & Deductions */}
                      <td className="py-3.5 px-3 text-xs text-gray-500">
                        -₹{priceUnit === 'kg' ? ((item.transportCost + item.mandiFee + item.transitLoss) / 100).toFixed(1) : (item.transportCost + item.mandiFee + item.transitLoss)}
                        <span className="text-[10px] block text-gray-400">₹{item.transportCost} freight</span>
                      </td>

                      {/* Net in Hand */}
                      <td className="py-3.5 px-3 font-black text-[#165b33]">
                        <div>
                          {priceUnit === 'kg' ? `₹${q.netInHandPerKg}` : `₹${q.netInHandQuintal.toLocaleString('en-IN')}`}
                          <span className="text-[10px] font-normal text-gray-500">{unitSuffix}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {priceUnit === 'kg' ? `(₹${q.netInHandQuintal}/q)` : `(₹${q.netInHandPerKg}/kg)`}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedMandiId(item.mandi.id)}
                          className="px-3 py-1.5 rounded-xl border border-gray-300 hover:border-[#165b33] text-xs font-bold text-gray-800 hover:text-[#165b33] transition-all"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Footer Note */}
        <div className="text-xs text-gray-500 pt-4 pb-8">
          {t.dashboard.footerDisclaimer}
        </div>
      </main>

      {/* Location Selection Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#165b33]" />
                <h3 className="text-lg font-bold text-gray-900">
                  {isEn ? 'Select Agricultural Location' : isMr ? 'आपले कृषी क्षेत्र निवडा' : 'अपना कृषि क्षेत्र चुनें'}
                </h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* GPS Auto Detect */}
            <button
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-sm shadow-xs transition-all disabled:opacity-60"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting via GPS API...' : 'Detect Exact Live GPS Location'}</span>
            </button>

            {/* Preset Agricultural Mandi Hubs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Popular Agricultural Mandi Regions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_AGRI_REGIONS.map((region) => (
                  <button
                    key={region.village}
                    onClick={() => handleSelectPresetRegion(region)}
                    className="p-3 rounded-xl border border-gray-200 hover:border-[#165b33] hover:bg-emerald-50/40 text-left transition-all"
                  >
                    <div className="text-xs font-bold text-gray-900">{region.village}</div>
                    <div className="text-[11px] text-gray-500">{region.district}, {region.state}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
