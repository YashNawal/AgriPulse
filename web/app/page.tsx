'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import {
  Mic,
  X,
  Check,
  MapPin,
  Compass,
  Sparkles,
  Search,
  Building2,
  TrendingUp,
  Clock,
  Truck,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { sharedApiClient } from '@shared/client';
import { FarmerPersonalSection } from '@/components/FarmerPersonalSection';
import {
  getSavedFarmerLocation,
  saveFarmerLocation,
  detectRealUserLocation,
  UserLocationDetails,
  POPULAR_AGRI_REGIONS,
  KOLHAPUR_LOCATION,
  DEFAULT_FARMER_LOCATION,
  searchIndianCityOrTaluka,
  getAllIndexedTalukas,
  INDIAN_TALUKAS,
} from '@/lib/location';
import {
  findNearestAndHighestMandis,
  NearestAndHighestSummary,
  INDIAN_MANDIS,
  getNearestMarketMultiCropPrices,
  NearestMarketMultiCropSummary,
  CropPriceOverview,
} from '@/lib/geoService';
import {
  ALL_INDIAN_CROPS,
  CROP_CATEGORIES,
  resolveCropMaster
} from '@/lib/cropDatabase';

const POPULAR_TALUKAS = [
  { name: 'Karvir', nameMr: 'करवीर (कोल्हापूर)', district: 'Kolhapur', lat: 16.7050, lon: 74.2433 },
  { name: 'Hatkanangale', nameMr: 'हातकणंगले', district: 'Kolhapur', lat: 16.7450, lon: 74.4450 },
  { name: 'Shirol', nameMr: 'शिरोळ', district: 'Kolhapur', lat: 16.7150, lon: 74.5950 },
  { name: 'Kagal', nameMr: 'कागल', district: 'Kolhapur', lat: 16.5780, lon: 74.3180 },
  { name: 'Panhala', nameMr: 'पन्हाळा', district: 'Kolhapur', lat: 16.8120, lon: 74.1100 },
  { name: 'Miraj', nameMr: 'मिरज', district: 'Sangli', lat: 16.8250, lon: 74.6450 },
  { name: 'Walwa', nameMr: 'वाळवा (इस्लामपूर)', district: 'Sangli', lat: 17.0500, lon: 74.2650 },
  { name: 'Karad', nameMr: 'कराड', district: 'Satara', lat: 17.2850, lon: 74.1850 },
  { name: 'Baramati', nameMr: 'बारामती', district: 'Pune', lat: 18.1550, lon: 74.5800 },
  { name: 'Lasalgaon', nameMr: 'लासलगाव', district: 'Nashik', lat: 20.1472, lon: 74.2255 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const d = t.dashboard;

  // Selected location, crop & market states (synchronized on mount to prevent SSR hydration mismatch)
  const [location, setLocation] = useState<UserLocationDetails>(DEFAULT_FARMER_LOCATION);
  const [selectedCrop, setSelectedCrop] = useState<string>('Ladyfinger');
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [marketModalOpen, setMarketModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [cropSearchQuery, setCropSearchQuery] = useState('');
  const [selectedCropCategory, setSelectedCropCategory] = useState<string>('all');

  // Taluka & City Live Search State
  const [talukaSearchQuery, setTalukaSearchQuery] = useState('');
  const [talukaSearchResults, setTalukaSearchResults] = useState<UserLocationDetails[]>([]);
  const [isSearchingTaluka, setIsSearchingTaluka] = useState(false);
  const [showTalukaDropdown, setShowTalukaDropdown] = useState(false);
  const [talukaBrowseDistrict, setTalukaBrowseDistrict] = useState<string>('all');

  // Multi-crop prices for Nearest Mandi Showcase
  const [nearestMarketData, setNearestMarketData] = useState<NearestMarketMultiCropSummary | null>(null);
  const [mandiCropFilterCategory, setMandiCropFilterCategory] = useState<string>('all');
  const [mandiCropSearchQuery, setMandiCropSearchQuery] = useState<string>('');
  const [mandiPriceDisplayUnit, setMandiPriceDisplayUnit] = useState<'kg' | 'quintal'>('kg');

  useEffect(() => {
    const saved = getSavedFarmerLocation();
    setLocation(saved);
  }, []);

  // Strict scroll containment: prevents background dashboard scrolling when scrolling dropdown or modals
  const handleScrollWheelContain = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const el = e.currentTarget;
    const isDown = e.deltaY > 0;
    if (isDown && el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
      e.preventDefault();
    } else if (!isDown && el.scrollTop <= 1) {
      e.preventDefault();
    }
  };

  // Lock background window scroll when any modal is open
  useEffect(() => {
    if (locationModalOpen || cropModalOpen || marketModalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [locationModalOpen, cropModalOpen, marketModalOpen]);

  // Update Multi-crop prices whenever location changes
  useEffect(() => {
    const multi = getNearestMarketMultiCropPrices(location.latitude, location.longitude, 2.0);
    setNearestMarketData(multi);
  }, [location]);

  // Debounced/instant search for City or Taluka, or full indexed list when browsing
  useEffect(() => {
    if (!talukaSearchQuery.trim()) {
      const all = getAllIndexedTalukas();
      const filtered = talukaBrowseDistrict === 'all'
        ? all
        : all.filter((t) => t.district.toLowerCase() === talukaBrowseDistrict.toLowerCase());
      setTalukaSearchResults(filtered);
      return;
    }

    let isMounted = true;
    setIsSearchingTaluka(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchIndianCityOrTaluka(talukaSearchQuery);
        if (isMounted) {
          setTalukaSearchResults(results);
        }
      } finally {
        if (isMounted) setIsSearchingTaluka(false);
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [talukaSearchQuery, talukaBrowseDistrict]);

  const handleSelectTaluka = (selected: UserLocationDetails) => {
    setLocation(selected);
    saveFarmerLocation(selected);
    setTalukaSearchQuery('');
    setTalukaSearchResults([]);
    setShowTalukaDropdown(false);
    setLocationModalOpen(false);
  };

  // Dynamic Mandi summary from live geodesic calculations
  const [mandiSummary, setMandiSummary] = useState<NearestAndHighestSummary | null>(null);

  useEffect(() => {
    const summary = findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      selectedCrop,
      2.0, // freight ₹2/q/km
      1.5, // 1.5% APMC fee
      1.0  // 1.0% transit loss
    );
    setMandiSummary(summary);
  }, [location, selectedCrop]);

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

  // Chat input
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(chatInput)}`);
  };

  const handleMicClick = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const defaultQuery = locale === 'mr'
        ? 'मी माल कधी विकावा?'
        : locale === 'hi'
        ? 'मुझे फसल कब बेचनी चाहिए?'
        : 'When should I sell?';
      setChatInput(defaultQuery);
      router.push(`/chat?q=${encodeURIComponent(defaultQuery)}`);
    }, 1200);
  };

  // Dynamic crop naming based on language from master agricultural catalog
  const selectedCropMaster = resolveCropMaster(selectedCrop);
  const cropNameDisplay = locale === 'mr'
    ? selectedCropMaster.nameMr
    : locale === 'hi'
    ? selectedCropMaster.nameHi
    : selectedCropMaster.nameEn;

  // Filtered crops for modal search & category filtering
  const filteredCrops = ALL_INDIAN_CROPS.filter((c) => {
    const matchesCat = selectedCropCategory === 'all' || c.category === selectedCropCategory;
    if (!matchesCat) return false;
    if (!cropSearchQuery.trim()) return true;
    const q = cropSearchQuery.toLowerCase().trim();
    return (
      c.key.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.nameMr.includes(q) ||
      c.nameHi.includes(q) ||
      c.aliases.some((a) => a.includes(q))
    );
  });

  const nearestMandiTitle = mandiSummary?.nearestMandi.mandi.name || `${location.village || 'Kolhapur'} APMC`;
  const displayTitle = `${cropNameDisplay} · ${nearestMandiTitle}, ${location.state || 'Maharashtra'}`;

  // Metric card computed values
  const nearestPrice = mandiSummary?.nearestMandi.grossPrice || 4200;
  const nearestPricePerKg = ((nearestPrice) / 100).toFixed(1);
  const forecast14DayPrice = Math.round(nearestPrice * 1.065);
  const forecast14DayPerKg = ((forecast14DayPrice) / 100).toFixed(1);
  const forecastRangeLow = Math.round(nearestPrice * 0.95);
  const forecastRangeHigh = Math.round(nearestPrice * 1.16);

  const bestNetPrice = mandiSummary?.highestNetMandi.netIncome || 4120;
  const bestNetPerKg = ((bestNetPrice) / 100).toFixed(1);
  const bestMarketName = mandiSummary?.highestNetMandi.mandi.name || 'Kolhapur APMC Market';
  const bestMarketDist = mandiSummary?.highestNetMandi.distanceKm ?? 2;

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title Bar with live GPS location & dynamic active crop */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/70 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {displayTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1.5">
              <span className="flex items-center gap-1 font-semibold text-gray-800">
                <MapPin className="w-3.5 h-3.5 text-[#165b33]" />
                <span>Your Location: {location.village}, {location.district}</span>
              </span>
              <span className="text-gray-400">({location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E)</span>
              {mandiSummary && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#165b33] border border-emerald-200 font-bold">
                  Nearest Mandi: {mandiSummary.nearestMandi.distanceKm} km
                </span>
              )}
              {mandiSummary && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                  Yesterday's Top Sell: ₹{mandiSummary.yesterdaysHighestNearMandi.yesterdayMaxPerKg}/kg ({mandiSummary.yesterdaysHighestNearMandi.mandiName})
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setLocationModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs sm:text-sm font-semibold text-gray-800 shadow-xs transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-[#165b33]" />
              <span>{location.village || location.district || 'Location'}</span>
            </button>
            <button
              onClick={() => setCropModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs sm:text-sm font-semibold text-gray-800 shadow-xs transition-all"
            >
              {d.changeCrop} ({cropNameDisplay})
            </button>
            <button
              onClick={() => setMarketModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs sm:text-sm font-semibold text-gray-800 shadow-xs transition-all"
            >
              {d.changeMarket}
            </button>
          </div>
        </div>

        {/* City & Taluka Search Bar with Live Suggestions & Strict Background Scroll Isolation */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-xs space-y-3 relative z-30">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={talukaSearchQuery}
                  onChange={(e) => {
                    setTalukaSearchQuery(e.target.value);
                    setShowTalukaDropdown(true);
                  }}
                  onFocus={() => {
                    setShowTalukaDropdown(true);
                  }}
                  placeholder={
                    locale === 'mr'
                      ? 'आपले शहर किंवा तालुक्याचे नाव शोधा (उदा. हातकणंगले, करवीर, शिरोळ, कागल, मिरज, कराड, बारामती, Lasalgaon...)'
                      : locale === 'hi'
                      ? 'अपना शहर या तालुका खोजें (उदा. हातकणंगले, करवीर, शिरोल, कागल, मिरज, कराड, बारामती...)'
                      : 'Search City or Taluka name (e.g. Karvir, Hatkanangale, Shirol, Kagal, Miraj, Karad, Baramati...)'
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#165b33] focus:bg-white transition-all shadow-2xs"
                />
                {talukaSearchQuery && (
                  <button
                    onClick={() => {
                      setTalukaSearchQuery('');
                      setShowTalukaDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Click-away backdrop overlay to shield background page and dismiss dropdown */}
              {showTalukaDropdown && (
                <div
                  className="fixed inset-0 z-40 bg-black/5"
                  onClick={() => setShowTalukaDropdown(false)}
                />
              )}

              {/* Live Auto-complete Taluka Dropdown with Strict Background Scroll Prevention */}
              {showTalukaDropdown && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col max-h-[360px] overscroll-contain animate-in fade-in duration-100"
                  style={{ overscrollBehavior: 'contain' }}
                >
                  {/* Dropdown Header with match count & district filter pills */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200 shrink-0 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#165b33]" />
                        <span>
                          {talukaSearchQuery.trim()
                            ? `${locale === 'mr' ? 'शोध निकाल' : 'Matching Talukas'} (${talukaSearchResults.length})`
                            : `${locale === 'mr' ? 'तालुक्यांची यादी' : 'Browse All Talukas'} (${talukaSearchResults.length})`}
                        </span>
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {locale === 'mr' ? 'स्क्रोल करून निवडा' : 'Scroll list to select'}
                      </span>
                    </div>

                    {/* Quick District Filter Chips inside Dropdown */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                      {[
                        { id: 'all', label: locale === 'mr' ? 'सर्व' : 'All' },
                        { id: 'Kolhapur', label: 'Kolhapur (कोल्हापूर)' },
                        { id: 'Sangli', label: 'Sangli (सांगली)' },
                        { id: 'Satara', label: 'Satara (सातारा)' },
                        { id: 'Pune', label: 'Pune (पुणे)' },
                        { id: 'Solapur', label: 'Solapur (सोलापूर)' },
                        { id: 'Nashik', label: 'Nashik (नाशिक)' },
                        { id: 'Belagavi', label: 'Belagavi (बेळगाव)' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setTalukaBrowseDistrict(d.id)}
                          className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-all ${
                            talukaBrowseDistrict.toLowerCase() === d.id.toLowerCase()
                              ? 'bg-[#165b33] text-white shadow-2xs'
                              : 'bg-white hover:bg-gray-200 text-gray-600 border border-gray-200/80'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Talukas List with strict boundary wheel isolation */}
                  <div
                    onWheel={handleScrollWheelContain}
                    className="overflow-y-auto divide-y divide-gray-100 flex-1 overscroll-contain touch-pan-y scrollbar-thin scrollbar-thumb-gray-200"
                    style={{ overscrollBehavior: 'contain' }}
                  >
                    {talukaSearchResults.map((result, idx) => {
                      const isSelected =
                        location.village.toLowerCase() === result.village.toLowerCase() ||
                        (location.taluka && location.taluka.toLowerCase() === result.village.toLowerCase());
                      return (
                        <button
                          key={`${result.displayName}-${idx}`}
                          onClick={() => handleSelectTaluka(result)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50/60 transition-colors flex items-center justify-between group ${
                            isSelected ? 'bg-emerald-50/80 font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#165b33] text-white' : 'bg-emerald-100/70 text-[#165b33]'
                              }`}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 group-hover:text-[#165b33] transition-colors">
                                {result.village}
                                {result.taluka && result.taluka !== result.village && (
                                  <span className="text-xs font-semibold text-gray-500 ml-1">({result.taluka})</span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {result.district}, {result.state} · GPS ({result.latitude.toFixed(2)}°N, {result.longitude.toFixed(2)}°E)
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#165b33] opacity-0 group-hover:opacity-100 transition-opacity">
                            {locale === 'mr' ? 'निवडा →' : 'Select →'}
                          </span>
                        </button>
                      );
                    })}
                    {talukaSearchResults.length === 0 && (
                      <div className="p-6 text-center text-xs text-gray-500">
                        {locale === 'mr' ? 'कोणताही तालुका आढळला नाही.' : 'No talukas found matching search.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* GPS Locate Button */}
            <button
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="px-4 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-xs transition-all active:scale-95"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? locale === 'mr' ? 'जीपीएस शोधत आहे...' : 'Detecting GPS...'
                  : locale === 'mr' ? 'थेट GPS स्थान वापरा' : 'Use Live GPS'}
              </span>
            </button>
          </div>

          {/* Quick Taluka Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-gray-400 shrink-0 uppercase tracking-wider mr-1">
              {locale === 'mr' ? 'लोकप्रिय तालुके:' : 'Popular Talukas:'}
            </span>
            {POPULAR_TALUKAS.map((pt) => {
              const isCurrent = location.village.toLowerCase() === pt.name.toLowerCase() ||
                (location.taluka && location.taluka.toLowerCase() === pt.name.toLowerCase());
              return (
                <button
                  key={pt.name}
                  onClick={() => handleSelectTaluka({
                    latitude: pt.lat,
                    longitude: pt.lon,
                    village: pt.name,
                    taluka: pt.name,
                    district: pt.district,
                    state: 'Maharashtra',
                    country: 'India',
                    displayName: `${pt.name}, ${pt.district}`,
                    source: 'search'
                  })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-[#165b33] text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#165b33] border border-gray-200/60'
                  }`}
                >
                  {locale === 'mr' ? `${pt.nameMr}` : pt.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Farmer Personal Land, GPS, Nearest Mandi & Crop Optimization */}
        <FarmerPersonalSection
          currentCrop={selectedCrop}
          onCropChange={setSelectedCrop}
          location={location}
          onLocationChange={setLocation}
        />

        {/* Row 1: Four Top Metrics Cards (Calculated directly in ₹/kg and ₹/quintal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Today's modal price in ₹/kg */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-36">
            <span className="text-xs font-semibold text-gray-500">
              {d.modalPriceLabel} (Today)
            </span>
            <div className="flex items-baseline gap-1.5 my-auto">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                ₹{nearestPricePerKg}
              </span>
              <span className="text-xs font-bold text-gray-600">
                / kg
              </span>
              <span className="text-xs text-gray-400">
                (₹{nearestPrice.toLocaleString('en-IN')}/q)
              </span>
            </div>
            <div className="text-[11px] text-gray-500 truncate">
              at {mandiSummary?.nearestMandi.mandi.name || 'Local Mandi'}
            </div>
          </div>

          {/* Card 2: Forecast in 14 days */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-36">
            <span className="text-xs font-semibold text-gray-500">
              {d.forecastDaysLabel}
            </span>
            <div className="flex items-baseline gap-1.5 my-auto">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-800 tracking-tight">
                ₹{forecast14DayPerKg}
              </span>
              <span className="text-xs font-bold text-gray-600">
                / kg
              </span>
              <span className="text-xs text-gray-400">
                (₹{forecast14DayPrice.toLocaleString('en-IN')}/q)
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Range ₹{(forecastRangeLow/100).toFixed(1)} to ₹{(forecastRangeHigh/100).toFixed(1)} / kg
            </div>
          </div>

          {/* Card 3: Best market, net income */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-36">
            <span className="text-xs font-semibold text-gray-500">
              {d.bestMarketLabel}
            </span>
            <div className="flex items-baseline gap-1.5 my-auto">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
                ₹{bestNetPerKg}
              </span>
              <span className="text-xs font-bold text-gray-600">
                / kg
              </span>
              <span className="text-xs text-gray-400">
                (₹{bestNetPrice.toLocaleString('en-IN')}/q)
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">
              {bestMarketName}, {bestMarketDist} km away
            </div>
          </div>

          {/* Card 4: Advice (Highlighted Yellow/Amber border matching image) */}
          <div className="bg-[#fffdfa] rounded-2xl p-5 border-2 border-amber-400 shadow-xs flex flex-col justify-between h-36">
            <span className="text-xs font-semibold text-amber-700">
              {d.adviceLabel}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight my-auto">
              {mandiSummary && mandiSummary.priceDifferencePerQuintal > 80 ? 'Hold / Wait' : 'Sell This Week'}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {mandiSummary && mandiSummary.priceDifferencePerQuintal > 0
                ? `Extra +₹${(mandiSummary.priceDifferencePerQuintal / 100).toFixed(1)}/kg in ${mandiSummary.highestPriceMandi.mandi.district}`
                : 'Steady demand across local mandis'}
            </div>
          </div>
        </div>

        {/* 6-Button Grid (Exact Replica of PDF Page 1 on Mobile) */}
        <div className="block md:hidden pt-2">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                title: locale === 'mr' ? 'भाव' : locale === 'hi' ? 'भाव' : 'Prices',
                href: '/prices',
                icon: (
                  <svg className="w-6 h-6 text-[#165b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              {
                title: locale === 'mr' ? 'अंदाज' : locale === 'hi' ? 'अनुमान' : 'Forecast',
                href: '/forecast',
                icon: (
                  <svg className="w-6 h-6 text-[#165b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: locale === 'mr' ? 'बाजार' : locale === 'hi' ? 'मंडी' : 'Markets',
                href: '/markets',
                icon: (
                  <svg className="w-6 h-6 text-[#165b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: locale === 'mr' ? 'खत' : locale === 'hi' ? 'खाद' : 'Fertilizer',
                href: '/store',
                icon: (
                  <svg className="w-6 h-6 text-[#165b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: locale === 'mr' ? 'माती' : locale === 'hi' ? 'मिट्टी' : 'Soil',
                href: '/soil',
                icon: (
                  <svg className="w-6 h-6 text-[#165b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )
              },
              {
                title: locale === 'mr' ? 'विचारा' : locale === 'hi' ? 'पूछें' : 'Ask AI',
                href: '/chat',
                icon: (
                  <svg className="w-6 h-6 text-[#165b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
              >
                {item.icon}
                <span className="text-sm font-bold text-gray-900 tracking-tight">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearest APMC Market & Multi-Crop Live Prices Showcase */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-900/10 shadow-xs space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-[#165b33] text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>
                    {locale === 'mr'
                      ? 'तुमच्या ठिकाणाहून सर्वात जवळची बाजार समिती'
                      : locale === 'hi'
                      ? 'आपके स्थान की निकटतम कृषि उपज मंडी'
                      : 'Closest APMC Mandi to Your Location'}
                  </span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>{nearestMarketData?.nearestMandi.name || `${location.village} APMC`}</span>
                <span className="text-sm sm:text-base font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {nearestMarketData?.distanceKm} km away
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {locale === 'mr'
                  ? `${location.taluka || location.village} (${location.district} जिल्हा) पासून थेट अंतर. खालील तक्त्यात या बाजार समितीतील सर्व प्रकारच्या शेतमालाचे आजचे थेट दर दिलेले आहेत.`
                  : locale === 'hi'
                  ? `${location.taluka || location.village} (${location.district} जिला) से वास्तविक दूरी। नीचे दी गई तालिका में इस मंडी के सभी फसलों के आज के ताज़ा भाव हैं।`
                  : `Calculated from ${location.taluka || location.village}, ${location.district} District. Below is the live price board across all crop commodities in this nearest market.`}
              </p>
            </div>

            {/* Quick Mandi Metrics Pill Group */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    {locale === 'mr' ? 'प्रवासाचा वेळ' : 'Transit Time'}
                  </span>
                  <span className="font-bold text-gray-800">~{nearestMarketData?.travelMinutesEstimate} mins</span>
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    {locale === 'mr' ? 'वाहतूक खर्च' : 'Freight Cost'}
                  </span>
                  <span className="font-bold text-gray-800">
                    ₹{nearestMarketData?.transportFreightPerKg}/kg (₹{nearestMarketData?.transportFreightPerQuintal}/q)
                  </span>
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="text-[10px] text-emerald-600 block font-medium">
                    {locale === 'mr' ? 'बाजार स्थिती' : 'Mandi Status'}
                  </span>
                  <span className="font-bold text-[#165b33]">
                    {locale === 'mr' ? 'सौदे सुरू (07 AM - 02 PM)' : 'Live Auction Active'}
                  </span>
                </div>
              </div>

              <Link
                href="/markets"
                className="px-3 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>{locale === 'mr' ? 'इतर मंड्यांशी तुलना' : 'Compare Mandis'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Filter Bar: Category Tabs + Crop Search + Unit Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', labelEn: 'All Crops', labelMr: 'सर्व पिके', labelHi: 'सभी फसलें' },
                { id: 'vegetable', labelEn: 'Vegetables', labelMr: 'भाजीपाला', labelHi: 'सब्जियां' },
                { id: 'grain', labelEn: 'Grains & Pulses', labelMr: 'धान्य व डाळी', labelHi: 'अनाज व दलहन' },
                { id: 'cash', labelEn: 'Cash Crops & Spices', labelMr: 'नगदी व मसाले', labelHi: 'नकदी व मसाले' },
                { id: 'fruit', labelEn: 'Fruits', labelMr: 'फळे', labelHi: 'फल' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMandiCropFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                    mandiCropFilterCategory === cat.id
                      ? 'bg-[#165b33] text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {locale === 'mr' ? cat.labelMr : locale === 'hi' ? cat.labelHi : cat.labelEn}
                </button>
              ))}
            </div>

            {/* In-table Search + Unit Toggle */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mandiCropSearchQuery}
                  onChange={(e) => setMandiCropSearchQuery(e.target.value)}
                  placeholder={
                    locale === 'mr'
                      ? 'या बाजारातील पीक शोधा (उदा. भेंडी, कांदा...)'
                      : 'Filter crops in this market...'
                  }
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#165b33]"
                />
              </div>

              {/* Unit Toggle Pill */}
              <div className="bg-gray-100 p-0.5 rounded-xl flex items-center text-xs font-bold shrink-0">
                <button
                  onClick={() => setMandiPriceDisplayUnit('kg')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mandiPriceDisplayUnit === 'kg'
                      ? 'bg-white text-gray-900 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  ₹ / kg
                </button>
                <button
                  onClick={() => setMandiPriceDisplayUnit('quintal')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mandiPriceDisplayUnit === 'quintal'
                      ? 'bg-white text-gray-900 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  ₹ / quintal
                </button>
              </div>
            </div>
          </div>

          {/* Responsive Multi-Crop Prices Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200/80">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-200 text-[11px] sm:text-xs">
                <tr>
                  <th className="py-3 px-3.5">
                    {locale === 'mr' ? 'शेतमाल / पीक' : locale === 'hi' ? 'फसल / जींस' : 'Crop / Commodity'}
                  </th>
                  <th className="py-3 px-3 text-emerald-800">
                    {locale === 'mr' ? 'उत्तम प्रत (Grade A)' : locale === 'hi' ? 'उत्तम गुणवत्ता' : 'Grade A (Top)'}
                  </th>
                  <th className="py-3 px-3 text-gray-900">
                    {locale === 'mr' ? 'सरासरी भाव (Modal)' : locale === 'hi' ? 'औसत भाव' : 'Modal Price'}
                  </th>
                  <th className="py-3 px-3 text-amber-800">
                    {locale === 'mr' ? 'कालचा उच्चांकी भाव' : locale === 'hi' ? 'कल का उच्चतम' : "Yesterday's High"}
                  </th>
                  <th className="py-3 px-3 text-[#165b33]">
                    {locale === 'mr' ? 'हातात निव्वळ भाव' : locale === 'hi' ? 'हाथ में शुद्ध भाव' : 'Net in Hand'}
                  </th>
                  <th className="py-3 px-3 text-gray-500">
                    {locale === 'mr' ? 'आजची आवक' : locale === 'hi' ? 'आवक' : 'Arrivals'}
                  </th>
                  <th className="py-3 px-3 text-right">
                    {locale === 'mr' ? 'कृती' : locale === 'hi' ? 'कार्य' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
                {(nearestMarketData?.crops || [])
                  .filter((c) => {
                    const matchCat = mandiCropFilterCategory === 'all' || c.category === mandiCropFilterCategory;
                    if (!matchCat) return false;
                    if (!mandiCropSearchQuery.trim()) return true;
                    const q = mandiCropSearchQuery.toLowerCase().trim();
                    return (
                      c.cropKey.toLowerCase().includes(q) ||
                      c.nameEn.toLowerCase().includes(q) ||
                      c.nameMr.includes(q) ||
                      c.nameHi.includes(q)
                    );
                  })
                  .map((cropItem) => {
                    const isSelected = selectedCrop.toLowerCase() === cropItem.cropKey.toLowerCase();
                    const isKg = mandiPriceDisplayUnit === 'kg';

                    const goodDisplay = isKg
                      ? `₹${cropItem.goodProductPerKg.toFixed(1)}/kg`
                      : `₹${Math.round(cropItem.goodProductPerKg * 100).toLocaleString('en-IN')}/q`;

                    const modalDisplay = isKg
                      ? `₹${cropItem.modalPricePerKg.toFixed(1)}/kg`
                      : `₹${cropItem.modalPriceQuintal.toLocaleString('en-IN')}/q`;

                    const yesterdayDisplay = isKg
                      ? `₹${cropItem.yesterdayHighestPerKg.toFixed(1)}/kg`
                      : `₹${Math.round(cropItem.yesterdayHighestPerKg * 100).toLocaleString('en-IN')}/q`;

                    const netDisplay = isKg
                      ? `₹${cropItem.netInHandPerKg.toFixed(1)}/kg`
                      : `₹${cropItem.netInHandQuintal.toLocaleString('en-IN')}/q`;

                    return (
                      <tr
                        key={cropItem.cropKey}
                        className={`hover:bg-emerald-50/40 transition-colors ${
                          isSelected ? 'bg-emerald-50/60 font-semibold' : ''
                        }`}
                      >
                        {/* Crop Name Column */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="font-bold text-gray-900 block">
                                {locale === 'mr'
                                  ? `${cropItem.nameMr} (${cropItem.nameEn})`
                                  : `${cropItem.nameEn} (${cropItem.nameMr})`}
                              </span>
                              <span className="text-[10px] text-gray-400 font-semibold capitalize">
                                {cropItem.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Grade A / Good Quality */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-bold text-xs">
                            {goodDisplay}
                          </span>
                        </td>

                        {/* Modal Price */}
                        <td className="py-3 px-3">
                          <span className="font-extrabold text-gray-900 text-sm">
                            {modalDisplay}
                          </span>
                          {isKg && (
                            <span className="text-[10px] text-gray-400 block font-normal">
                              (₹{cropItem.modalPriceQuintal.toLocaleString('en-IN')}/q)
                            </span>
                          )}
                        </td>

                        {/* Yesterday's Top Sold */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 font-bold text-xs">
                            {yesterdayDisplay}
                          </span>
                        </td>

                        {/* Net In Hand (After freight & fees) */}
                        <td className="py-3 px-3">
                          <span className="font-black text-[#165b33] text-sm">
                            {netDisplay}
                          </span>
                          <span className="text-[10px] text-emerald-600 block">
                            {locale === 'mr' ? 'वाहतूक व सेस वजा जाता' : 'After freight & cess'}
                          </span>
                        </td>

                        {/* Arrivals */}
                        <td className="py-3 px-3 text-gray-600 font-medium">
                          {cropItem.arrivalsTonnes} {locale === 'mr' ? 'टन' : 'Tonnes'}
                        </td>

                        {/* Select Crop Action Button */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedCrop(cropItem.cropKey);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-gray-100 hover:bg-[#165b33] text-gray-700 hover:text-white'
                            }`}
                          >
                            {isSelected
                              ? locale === 'mr' ? '✓ निवडलेले' : '✓ Active'
                              : locale === 'mr' ? 'विश्लेषण करा' : 'Analyze'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 pt-1">
            <div>
              💡 {locale === 'mr'
                ? 'कोणत्याही पिकावर "विश्लेषण करा" क्लिक केल्यास वर त्याचे १४-दिवसीय अंदाज आणि माती सुसंगतता अपडेट होईल.'
                : 'Click "Analyze" on any crop above to immediately view its 14-day price trend and agronomy advice.'}
            </div>
            <div className="font-medium text-emerald-800">
              {locale === 'mr' ? 'दैनिक अपडेट: आज सकाळी ०६:३०' : 'Daily Board Updated: Today 06:30 AM'}
            </div>
          </div>
        </div>

        {/* Row 2: Price forecast (Left) & Best markets by net income (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Card: Price forecast Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">
                {d.priceForecastTitle}
              </h2>

              {/* Clean SVG Chart reproducing the exact curve and green shaded forecast cone */}
              <div className="w-full h-48 relative flex items-center justify-center">
                <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                  {/* Subtle baseline */}
                  <line x1="10" y1="130" x2="490" y2="130" stroke="#e5e7eb" strokeWidth="1.5" />

                  {/* Vertical dashed line for "Today" */}
                  <line x1="310" y1="20" x2="310" y2="130" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="318" y="32" fill="#6b7280" fontSize="11" fontWeight="500">
                    {d.todayLabel}
                  </text>

                  {/* Shaded Forecast Cone (p10 to p90 band into the future) */}
                  <polygon
                    points="310,85 490,40 490,95 310,85"
                    fill="#d1fae5"
                    fillOpacity="0.8"
                  />

                  {/* Historical Solid Black Price Curve */}
                  <path
                    d="M 10,95 L 50,90 L 90,105 L 130,80 L 170,85 L 210,70 L 260,75 L 310,85"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Forecast Center Dotted Line (p50 projection) */}
                  <path
                    d="M 310,85 L 490,65"
                    fill="none"
                    stroke="#165b33"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    strokeLinecap="round"
                  />

                  {/* Today dot indicator */}
                  <circle cx="310" cy="85" r="3.5" fill="#1f2937" />
                </svg>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">
              {d.priceForecastSampleNote}
            </div>
          </div>

          {/* Right Card: Best markets by net income Table */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">
                {d.bestMarketsTitle}
              </h2>

              <div className="w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200/70 text-xs font-semibold text-gray-500">
                      <th className="pb-3">{d.tableMarket}</th>
                      <th className="pb-3">{d.tableDistance}</th>
                      <th className="pb-3">{d.tableNet}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800 text-[14px]">
                    {mandiSummary?.allRanked.slice(0, 4).map((item) => (
                      <tr key={item.mandi.id} className="hover:bg-gray-50/50">
                        <td className="py-2.5 font-bold text-gray-900">{item.mandi.name}</td>
                        <td className="py-2.5 text-gray-600">{item.distanceKm} km</td>
                        <td className="py-2.5 font-bold text-[#165b33]">₹{item.netIncome.toLocaleString('en-IN')}</td>
                      </tr>
                    )) || (
                      <tr className="hover:bg-gray-50/50">
                        <td className="py-2.5 font-bold text-gray-900">Kolhapur APMC Market</td>
                        <td className="py-2.5 text-gray-600">2 km</td>
                        <td className="py-2.5 font-bold text-[#165b33]">₹2,380</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">
              {d.tableFooterNote}
            </div>
          </div>
        </div>

        {/* Row 3: Soil suggestions (Left), Fertilizer plan (Center), Ask KisanMitra (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Soil and crop suggestions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {d.soilTitle}
              </h2>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                {d.soilSubtitle}
              </p>

              <div className="space-y-2 text-sm text-gray-800 font-medium">
                {d.soilCrops.map((cropText, index) => (
                  <div key={index} className="text-gray-800">
                    {cropText}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Fertilizer plan (khaat) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {d.fertilizerTitle}
              </h2>
              <div className="text-xs font-semibold text-[#165b33] mt-1 mb-3">
                {d.fertilizerApproved}
              </div>

              <ul className="space-y-1.5 text-sm text-gray-800">
                {d.fertilizerStages.map((stage, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{stage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/store"
                className="inline-block px-4 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {d.requestFromStore}
              </Link>
            </div>
          </div>

          {/* Card 3: Ask KisanMitra */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {d.askTitle}
              </h2>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                {d.askSubtitle}
              </p>

              <form onSubmit={handleAskSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={d.askPlaceholder}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#165b33]"
                />

                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-[#165b33] hover:bg-[#124828] text-white'
                  }`}
                  title="Speak query"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer matching reference image */}
        <div className="text-xs text-gray-500 pt-4 pb-8">
          {d.footerDisclaimer}
        </div>
      </main>

      {/* Change Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Select Your City or Taluka</h3>
                <p className="text-xs text-gray-500">Recalculates nearest mandis, freight & multi-crop prices</p>
              </div>
              <button onClick={() => setLocationModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City / Taluka Search Input inside Modal */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={talukaSearchQuery}
                onChange={(e) => setTalukaSearchQuery(e.target.value)}
                placeholder={
                  locale === 'mr'
                    ? 'तालुका किंवा शहराचे नाव शोधा (उदा. हातकणंगले, करवीर...)'
                    : 'Search Taluka or City (e.g. Hatkanangale, Kagal...)'
                }
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            {/* Live Search Results inside Modal */}
            {talukaSearchResults.length > 0 && (
              <div
                onWheel={handleScrollWheelContain}
                className="space-y-1 overflow-y-auto max-h-48 border border-emerald-100 rounded-xl p-1 bg-emerald-50/30 shrink-0 overscroll-contain touch-pan-y"
                style={{ overscrollBehavior: 'contain' }}
              >
                <span className="text-[10px] font-bold text-[#165b33] px-2 block">
                  Search Results ({talukaSearchResults.length}):
                </span>
                {talukaSearchResults.map((result, idx) => (
                  <button
                    key={`modal-result-${idx}`}
                    onClick={() => handleSelectTaluka(result)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs bg-white hover:bg-emerald-50 border border-gray-200/60 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-gray-900 block">{result.village}</span>
                      <span className="text-[10px] text-gray-500">{result.district}, {result.state}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#165b33]">Select →</span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="w-full py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting via Browser GPS...' : '📍 Detect Live GPS via Browser'}</span>
            </button>

            <div
              onWheel={handleScrollWheelContain}
              className="space-y-1.5 pt-1 overflow-y-auto flex-1 overscroll-contain touch-pan-y"
              style={{ overscrollBehavior: 'contain' }}
            >
              <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider">
                Popular Agricultural Hubs & Talukas:
              </span>
              {POPULAR_AGRI_REGIONS.map((region) => {
                const isSelected =
                  location.village.toLowerCase() === region.village.toLowerCase() ||
                  location.district.toLowerCase() === region.district.toLowerCase();
                return (
                  <button
                    key={region.displayName}
                    onClick={() => handleSelectPresetRegion(region)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-[#165b33] border-emerald-300 font-bold'
                        : 'hover:bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{region.village}, {region.district}</span>
                      <span className="text-[10px] text-gray-500">{region.state}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#165b33]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Change Crop Modal with all Indian crops, live search & category filters */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-gray-200 space-y-3.5 overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">{t.common.selectCropTitle}</h3>
                <p className="text-xs text-gray-500">
                  {locale === 'mr' ? 'भारतातील सर्व प्रकारच्या भाज्या, धान्य, डाळी व नगदी पिके' : 'All Crops & Vegetables across Indian Mandis'}
                </p>
              </div>
              <button
                onClick={() => setCropModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cropSearchQuery}
                onChange={(e) => setCropSearchQuery(e.target.value)}
                placeholder={
                  locale === 'mr'
                    ? 'पिकाचे नाव शोधा (उदा. भेंडी, टोमॅटो, लसूण, केळी, गहू...)'
                    : 'Search crop or vegetable (e.g. Ladyfinger, Garlic, Banana...)'
                }
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none text-[11px]">
              <button
                onClick={() => setSelectedCropCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  selectedCropCategory === 'all'
                    ? 'bg-[#165b33] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {locale === 'mr' ? 'सर्व पिके' : 'All'}
              </button>
              {CROP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCropCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                    selectedCropCategory === cat.id
                      ? 'bg-[#165b33] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {locale === 'mr' ? cat.labelMr : cat.labelEn}
                </button>
              ))}
            </div>

            {/* Filtered Crops List */}
            <div
              onWheel={handleScrollWheelContain}
              className="overflow-y-auto space-y-1.5 flex-1 pr-1 overscroll-contain touch-pan-y"
              style={{ overscrollBehavior: 'contain' }}
            >
              {filteredCrops.map((crop) => {
                const isSelected = selectedCrop.toLowerCase() === crop.key.toLowerCase();
                return (
                  <button
                    key={crop.key}
                    onClick={() => {
                      setSelectedCrop(crop.key);
                      setCropModalOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-[#165b33] border-emerald-300 font-bold shadow-xs'
                        : 'hover:bg-gray-50 text-gray-800 border-gray-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">
                          {locale === 'mr' ? `${crop.nameMr} (${crop.nameEn})` : `${crop.nameEn} (${crop.nameMr})`}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                          {crop.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 block mt-0.5">
                        {locale === 'mr' ? 'अपेक्षित भाव' : 'Benchmark'}: ₹{(crop.benchmarkModalQuintal / 100).toFixed(1)}/kg (₹{crop.benchmarkModalQuintal.toLocaleString('en-IN')}/q) · {crop.expectedYieldQuintalPerAcre} q/acre
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#165b33] shrink-0" />}
                  </button>
                );
              })}
              {filteredCrops.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-500">
                  {locale === 'mr' ? 'कोणतेही पीक आढळले नाही' : 'No crops found matching search.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Market Modal listing all regional APMC mandis */}
      {marketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] flex flex-col p-5 shadow-2xl border border-gray-200 space-y-3.5 overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">{t.common.selectMarketTitle}</h3>
                <p className="text-xs text-gray-500">
                  {locale === 'mr' ? 'भारतातील प्रमुख कृषी उत्पन्न बाजार समित्या' : 'APMC Mandis & Markets across India'}
                </p>
              </div>
              <button onClick={() => setMarketModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              onWheel={handleScrollWheelContain}
              className="overflow-y-auto space-y-1.5 flex-1 pr-1 overscroll-contain touch-pan-y"
              style={{ overscrollBehavior: 'contain' }}
            >
              {INDIAN_MANDIS.map((mandi) => {
                const isSelected = mandiSummary?.nearestMandi.mandi.id === mandi.id;
                return (
                  <button
                    key={mandi.id}
                    onClick={() => {
                      setMarketModalOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-[#165b33] border-emerald-300 font-bold shadow-xs'
                        : 'hover:bg-gray-50 text-gray-700 border-gray-100'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-gray-900">{mandi.name}</span>
                      <span className="text-[10px] text-gray-500">{mandi.district}, {mandi.state}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#165b33] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
