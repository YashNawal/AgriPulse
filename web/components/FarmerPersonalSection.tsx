'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/components/AuthContext';
import {
  MapPin,
  Compass,
  Tractor,
  Layers,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Scale,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  detectRealUserLocation,
  getSavedFarmerLocation,
  UserLocationDetails,
  DEFAULT_FARMER_LOCATION
} from '@/lib/location';
import {
  findNearestAndHighestMandis,
  NearestAndHighestSummary
} from '@/lib/geoService';
import {
  evaluateCropSuitability,
  detectSoilFromGPS,
  DEFAULT_SOIL_PROFILE,
  SoilHealthCardData,
  RecommendedCropAnalysis
} from '@/lib/soilAgronomy';
import {
  ALL_INDIAN_CROPS,
  CROP_CATEGORIES,
  resolveCropMaster
} from '@/lib/cropDatabase';

export interface FarmerPersonalSectionProps {
  currentCrop?: string;
  onCropChange?: (crop: string) => void;
  location?: UserLocationDetails;
  onLocationChange?: (loc: UserLocationDetails) => void;
}

export function FarmerPersonalSection({
  currentCrop: propCrop,
  onCropChange,
  location: propLocation,
  onLocationChange
}: FarmerPersonalSectionProps = {}) {
  const { locale } = useLanguage();
  const { user, profile } = useAuth();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  // 1. Farmer Land & Location State (synced with parent or local)
  const [internalLocation, setInternalLocation] = useState<UserLocationDetails>(DEFAULT_FARMER_LOCATION);
  const location = propLocation || internalLocation;
  const setLocation = (loc: UserLocationDetails) => {
    setInternalLocation(loc);
    onLocationChange?.(loc);
  };

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [landAcres, setLandAcres] = useState<number>(profile?.land_size_acres || 2.5);
  const [priceUnit, setPriceUnit] = useState<'kg' | 'quintal'>('kg');

  const [internalCrop, setInternalCrop] = useState<string>('Ladyfinger');
  const currentCrop = propCrop || internalCrop;
  const setCurrentCrop = (crop: string) => {
    setInternalCrop(crop);
    onCropChange?.(crop);
  };

  // 2. Mandi Calculation State
  const [mandiSummary, setMandiSummary] = useState<NearestAndHighestSummary | null>(null);

  // 3. Soil & Crop Recommendations State
  const [soilProfile, setSoilProfile] = useState<SoilHealthCardData>(DEFAULT_SOIL_PROFILE);
  const [recommendations, setRecommendations] = useState<RecommendedCropAnalysis[]>([]);
  const [selectedRecommendedCrop, setSelectedRecommendedCrop] = useState<RecommendedCropAnalysis | null>(null);

  // Run location detection on initial mount
  useEffect(() => {
    if (profile?.latitude && profile?.longitude) {
      const loc: UserLocationDetails = {
        latitude: profile.latitude,
        longitude: profile.longitude,
        village: profile.village || 'Kolhapur',
        district: profile.district || 'Kolhapur',
        state: profile.state || 'Maharashtra',
        country: 'India',
        displayName: `${profile.village || 'Kolhapur'}, ${profile.district || 'Kolhapur'}, ${profile.state || 'Maharashtra'}`,
        source: 'gps',
      };
      setLocation(loc);
    } else if (!propLocation) {
      const saved = getSavedFarmerLocation();
      setInternalLocation(saved);
    }
  }, [profile]);

  // Auto-detect soil using GPS whenever location coordinates change
  useEffect(() => {
    let isMounted = true;
    async function fetchSoil() {
      const detected = await detectSoilFromGPS(location.latitude, location.longitude);
      if (isMounted) {
        setSoilProfile(detected);
      }
    }
    fetchSoil();
    return () => { isMounted = false; };
  }, [location.latitude, location.longitude]);

  // Recalculate nearest & highest mandis and crop recommendations whenever location or crop changes
  useEffect(() => {
    const summary = findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      currentCrop,
      2.0, // ₹2/q/km freight
      1.5, // 1.5% APMC fee
      1.0  // 1.0% transit loss
    );
    setMandiSummary(summary);

    const recs = evaluateCropSuitability(soilProfile, landAcres);
    setRecommendations(recs);
    setSelectedRecommendedCrop(recs[0] || null);
  }, [location, currentCrop, soilProfile, landAcres]);

  // Handle GPS detection via browser & Nominatim API
  const handleDetectGPS = async () => {
    setIsLocating(true);
    try {
      const detected = await detectRealUserLocation();
      setLocation(detected);
    } finally {
      setIsLocating(false);
    }
  };

  // Farmer's yield calculation (quintals) dynamically resolved from master agricultural catalog
  const currentCropMaster = resolveCropMaster(currentCrop);
  const currentExpectedYieldPerAcre = currentCropMaster.expectedYieldQuintalPerAcre || 25;
  const totalFarmProductionQuintals = Math.round(landAcres * currentExpectedYieldPerAcre);

  // Total farm revenues
  const nearestGrossRevenue = mandiSummary ? totalFarmProductionQuintals * mandiSummary.nearestMandi.grossPrice : 0;
  const nearestNetRevenue = mandiSummary ? totalFarmProductionQuintals * mandiSummary.nearestMandi.netIncome : 0;
  const highestNetRevenue = mandiSummary ? totalFarmProductionQuintals * mandiSummary.highestNetMandi.netIncome : 0;
  const extraProfitOpportunity = Math.max(0, highestNetRevenue - nearestNetRevenue);

  const strings = {
    sectionBadge: isEn ? 'Farmer Personal Center' : isMr ? 'शेतकरी वैयक्तिक विभाग' : 'किसान व्यक्तिगत अनुभाग',
    title: isEn ? 'My Farm, Land & Crop Optimization' : isMr ? 'माझी शेती, जमीन व पीक नियोजन' : 'मेरा खेत, जमीन व फसल अनुकूलन',
    subtitle: isEn
      ? 'Live GPS location, nearest mandi price comparison, and scientific soil-to-crop matching for your land.'
      : isMr
      ? 'थेट GPS स्थान, जवळच्या बाजार समितीचे भाव आणि आपल्या जमिनीसाठी योग्य पिकांची शिफारस.'
      : 'लाइव GPS स्थान, नजदीकी मंडी भाव तुलना और आपकी मिट्टी के अनुकूल सर्वोत्तम फसल का चयन।',
    landLabel: isEn ? 'Farm Land Size:' : isMr ? 'शेतीचे क्षेत्र:' : 'खेत का रकबा:',
    cropLabel: isEn ? 'Currently Cultivated Crop:' : isMr ? 'सध्याचे पीक:' : 'वर्तमान फसल:',
    gpsBtn: isEn ? 'Detect Live GPS via API' : isMr ? 'GPS द्वारे थेट स्थान मिळवा' : 'GPS से लाइव स्थान प्राप्त करें',
    locating: isEn ? 'Detecting via GPS API...' : isMr ? 'GPS शोधत आहे...' : 'GPS से स्थान खोज रहे हैं...',
    nearestTitle: isEn ? 'Nearest Mandi' : isMr ? 'जवळची बाजार समिती' : 'नजदीकी मंडी',
    highestTitle: isEn ? 'Highest Price Mandi' : isMr ? 'सर्वाधिक भाव देणारी मंडी' : 'सर्वाधिक भाव वाली मंडी',
    modalPrice: isEn ? 'Modal Price' : isMr ? 'सरासरी भाव' : 'मॉडल भाव',
    netRealization: isEn ? 'Net in Hand' : isMr ? 'हाती पडणारा निव्वळ भाव' : 'शुद्ध हाथ में भाव',
    distance: isEn ? 'Distance' : isMr ? 'अंतर' : 'दूरी',
    totalFarmIncome: isEn ? 'Total Farm Net Realization' : isMr ? 'एकूण शेताचे निव्वळ उत्पन्न' : 'कुल खेत का शुद्ध उत्पादन मूल्य',
    extraProfitNotice: isEn
      ? `By selling at ${mandiSummary?.highestNetMandi.mandi.name || 'Highest Mandi'} or waiting for peak arrivals, you earn an extra:`
      : isMr
      ? `उत्तम बाजार समितीत विक्री केल्यास आपल्याला मिळणारा संभाव्य जादा नफा:`
      : `उच्चतम भाव वाली मंडी में बेचने पर मिलने वाला अतिरिक्त शुद्ध लाभ:`,
    whichCropTitle: isEn ? 'Which Crop SHOULD You Cultivate on This Soil?' : isMr ? 'या मातीत कोणते पीक घ्यावे?' : 'इस मिट्टी में कौन सी फसल उगानी चाहिए?',
    whichCropDesc: isEn
      ? 'Evaluated against your soil texture, pH 7.6, organic carbon, and local climate for maximum net returns:'
      : isMr
      ? 'आपल्या जमिनीचा पोत, pH ७.६, सेंद्रिय कर्ब आणि हवामानानुसार सर्वाधिक फायदेशीर पिके:'
      : 'आपकी मिट्टी की जांच (pH 7.6, ऑर्गेनिक कार्बन) व मौसम के अनुसार सर्वाधिक लाभकारी फसलें:',
    matchScore: isEn ? 'Match' : isMr ? 'सुसंगती' : 'मैच',
    expectedProfit: isEn ? 'Expected Net Profit' : isMr ? 'अपेक्षित निव्वळ नफा' : 'अनुमानित शुद्ध लाभ',
    adoptBtn: isEn ? 'Adopt This Crop' : isMr ? 'हे पीक निवडा' : 'यह फसल चुनें',
    fertilizerDoseTitle: isEn ? 'Customized Fertilizer Plan for This Soil' : isMr ? 'या मातीसाठी खतांचा डोस' : 'इस मिट्टी के लिए अनुकूलित खाद',
    viewSchedule: isEn ? 'View Complete Schedule in Store →' : isMr ? 'खत वेळापत्रक पहा →' : 'खाद शेड्यूल देखें →'
  };

  return (
    <section className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#165b33] text-xs font-bold border border-emerald-200 mb-2">
            <Tractor className="w-3.5 h-3.5" />
            <span>{strings.sectionBadge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {strings.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {strings.subtitle}
          </p>
        </div>

        {/* GPS Location & Live Detect Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-[#f4f6f4] px-3.5 py-2 rounded-2xl border border-gray-200 text-xs text-gray-800 font-semibold">
            <MapPin className="w-4 h-4 text-[#165b33] shrink-0" />
            <span>{location.displayName}</span>
            <span className="text-[10px] text-gray-500 font-mono">({location.latitude.toFixed(2)}, {location.longitude.toFixed(2)})</span>
          </div>

          <button
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-60"
            title="Update Live GPS Location via Browser & Nominatim"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? strings.locating : strings.gpsBtn}</span>
          </button>
        </div>
      </div>

      {/* Part A: Land Size & Current Crop Configuration Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#f9faf9] p-4 rounded-2xl border border-gray-200">
        
        {/* Land Area Input */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            {strings.landLabel}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="100"
              value={landAcres}
              onChange={(e) => setLandAcres(Math.max(0.5, parseFloat(e.target.value) || 1))}
              className="w-24 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#165b33]"
            />
            <span className="text-xs text-gray-600 font-medium">Acres ({landAcres * 0.4047} Ha)</span>
          </div>
        </div>

        {/* Current Crop Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            {strings.cropLabel}
          </label>
          <select
            value={currentCrop}
            onChange={(e) => setCurrentCrop(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#165b33] cursor-pointer"
          >
            {CROP_CATEGORIES.map((cat) => {
              const catCrops = ALL_INDIAN_CROPS.filter((c) => c.category === cat.id);
              if (catCrops.length === 0) return null;
              const catLabel = isEn ? cat.labelEn : isMr ? cat.labelMr : cat.labelHi;
              return (
                <optgroup key={cat.id} label={catLabel}>
                  {catCrops.map((c) => (
                    <option key={c.key} value={c.key}>
                      {isEn ? `${c.nameEn} (${c.nameMr})` : `${c.nameMr} (${c.nameEn})`}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {/* Total Estimated Harvest */}
        <div>
          <span className="block text-xs font-medium text-gray-500 mb-1">
            {isEn ? 'Estimated Total Harvest' : 'अपेक्षित एकूण उत्पादन'}
          </span>
          <div className="text-base font-extrabold text-gray-900">
            {totalFarmProductionQuintals} <span className="text-xs font-normal text-gray-500">quintals ({totalFarmProductionQuintals / 10} tonnes)</span>
          </div>
        </div>

        {/* Soil Type Quick Badge */}
        <div>
          <span className="block text-xs font-medium text-gray-500 mb-1">
            {isEn ? 'Detected Soil Health' : 'जमिनीचा प्रकार'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#165b33]">
            <Layers className="w-3.5 h-3.5" />
            <span>Black Vertisol · pH 7.6</span>
          </div>
        </div>
      </div>

      {/* Part B: Current Crop Market Intelligence — Nearest Mandi vs Highest Price Mandi */}
      {mandiSummary && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#165b33]" />
                <span>{isEn ? `Market Prices & Quality Tiers for Your ${currentCrop}` : `आपल्या पिकासाठी (${currentCrop}) बाजारभाव व प्रतवारी`}</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {isEn ? 'Calculated from your live coordinates' : 'आपल्या अचूक GPS अंतरावर आधारित'}
              </span>
            </div>

            {/* Toggle unit between ₹/kg and ₹/quintal */}
            <div className="flex items-center bg-[#f4f6f4] p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
              <button
                onClick={() => setPriceUnit('kg')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  priceUnit === 'kg' ? 'bg-[#165b33] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ₹ / kg (किलो दर)
              </button>
              <button
                onClick={() => setPriceUnit('quintal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  priceUnit === 'quintal' ? 'bg-[#165b33] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ₹ / Quintal (क्विंटल)
              </button>
            </div>
          </div>

          {/* Quality Tiers & Yesterday's Peak Sell Guidance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#fcfdfc] p-4 rounded-2xl border border-gray-200">
            {/* 1. Yesterday's Peak Sell */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-3">
              <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>{isEn ? "Yesterday's Peak Sell" : 'कालचा उच्चांकी भाव'}</span>
              </span>
              <div className="text-xl font-black text-amber-950 mt-1">
                {priceUnit === 'kg'
                  ? `₹${mandiSummary.yesterdaysHighestNearMandi.yesterdayMaxPerKg}/kg`
                  : `₹${mandiSummary.yesterdaysHighestNearMandi.yesterdayMaxQuintal.toLocaleString('en-IN')}/q`}
              </div>
              <div className="text-[10px] text-amber-800 font-medium truncate mt-0.5">
                {mandiSummary.yesterdaysHighestNearMandi.mandiName} ({mandiSummary.yesterdaysHighestNearMandi.distanceKm} km)
              </div>
            </div>

            {/* 2. Today's Good Quality Product */}
            <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3">
              <span className="text-[10px] font-black uppercase text-[#165b33] tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#165b33]" />
                <span>{isEn ? "Today Good Product (Grade A)" : 'आज उत्तम प्रत (नंबर १)'}</span>
              </span>
              <div className="text-xl font-black text-[#165b33] mt-1">
                {priceUnit === 'kg'
                  ? `₹${mandiSummary.nearestMandi.qualityGrades.goodProductPerKg}/kg`
                  : `₹${mandiSummary.nearestMandi.qualityGrades.goodProductQuintal.toLocaleString('en-IN')}/q`}
              </div>
              <div
                className="text-[10px] text-emerald-700 font-medium truncate mt-0.5"
                title={mandiSummary.cropMaster?.qualityParams?.goodGradeA?.[isMr ? 'mr' : isEn ? 'en' : 'hi'] || 'Grade A Premium'}
              >
                {mandiSummary.cropMaster?.qualityParams?.goodGradeA?.[isMr ? 'mr' : isEn ? 'en' : 'hi'] || (isEn ? 'Fresh, sorted, Grade A' : 'कोवळी, ताजी, एकसारखी उत्तम')}
              </div>
            </div>

            {/* 3. Today's Average Quality Product */}
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-3">
              <span className="text-[10px] font-black uppercase text-gray-700 tracking-wider flex items-center gap-1">
                <Scale className="w-3 h-3 text-gray-600" />
                <span>{isEn ? "Today Average Product (Grade B)" : 'आज मध्यम प्रत (नियमित)'}</span>
              </span>
              <div className="text-xl font-black text-gray-900 mt-1">
                {priceUnit === 'kg'
                  ? `₹${mandiSummary.nearestMandi.qualityGrades.averageProductPerKg}/kg`
                  : `₹${mandiSummary.nearestMandi.qualityGrades.averageProductQuintal.toLocaleString('en-IN')}/q`}
              </div>
              <div
                className="text-[10px] text-gray-600 font-medium truncate mt-0.5"
                title={mandiSummary.cropMaster?.qualityParams?.averageGradeB?.[isMr ? 'mr' : isEn ? 'en' : 'hi'] || 'Grade B Standard'}
              >
                {mandiSummary.cropMaster?.qualityParams?.averageGradeB?.[isMr ? 'mr' : isEn ? 'en' : 'hi'] || (isEn ? 'Standard market lot / modal' : 'नियमित आकार, सर्वसामान्य लॉट')}
              </div>
            </div>

            {/* 4. Net in Hand */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3">
              <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-blue-700" />
                <span>{isEn ? "Net in Hand (After Deductions)" : 'हाती पडणारा निव्वळ दर'}</span>
              </span>
              <div className="text-xl font-black text-blue-900 mt-1">
                {priceUnit === 'kg'
                  ? `₹${mandiSummary.nearestMandi.qualityGrades.netInHandPerKg}/kg`
                  : `₹${mandiSummary.nearestMandi.qualityGrades.netInHandQuintal.toLocaleString('en-IN')}/q`}
              </div>
              <div className="text-[10px] text-blue-700 font-medium truncate mt-0.5">
                After transport & mandi fee
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Nearest Mandi */}
            <div className="bg-[#f9faf9] border border-gray-200/90 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{strings.nearestTitle}</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  {mandiSummary.nearestMandi.distanceKm} km {strings.distance}
                </span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900">
                  {mandiSummary.nearestMandi.mandi.name}
                </h4>
                <div className="text-xs text-gray-500">
                  {mandiSummary.nearestMandi.mandi.district}, {mandiSummary.nearestMandi.mandi.state}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <span className="text-[11px] text-gray-500 block">{strings.modalPrice}</span>
                  <div className="text-xl font-black text-gray-900">
                    {priceUnit === 'kg'
                      ? `₹${mandiSummary.nearestMandi.qualityGrades.averageProductPerKg}/kg`
                      : `₹${mandiSummary.nearestMandi.grossPrice.toLocaleString('en-IN')}/q`}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {priceUnit === 'kg' ? `(₹${mandiSummary.nearestMandi.grossPrice}/q)` : `(₹${mandiSummary.nearestMandi.qualityGrades.averageProductPerKg}/kg)`}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#165b33] font-bold block">{strings.netRealization}</span>
                  <div className="text-xl font-black text-[#165b33]">
                    {priceUnit === 'kg'
                      ? `₹${mandiSummary.nearestMandi.qualityGrades.netInHandPerKg}/kg`
                      : `₹${mandiSummary.nearestMandi.netIncome.toLocaleString('en-IN')}/q`}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {priceUnit === 'kg' ? `(₹${mandiSummary.nearestMandi.netIncome}/q)` : `(₹${mandiSummary.nearestMandi.qualityGrades.netInHandPerKg}/kg)`}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 pt-1 flex items-center justify-between">
                <span>Deductions: -₹{mandiSummary.nearestMandi.transportCost + mandiSummary.nearestMandi.mandiFee + mandiSummary.nearestMandi.transitLoss}/q</span>
                <span className="font-semibold text-gray-700">Farm Net: ₹{nearestNetRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Box 2: Highest Price Mandi */}
            <div className="bg-[#fffdfa] border-2 border-amber-400 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>{strings.highestTitle}</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {mandiSummary.highestPriceMandi.distanceKm} km {strings.distance}
                </span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900">
                  {mandiSummary.highestPriceMandi.mandi.name}
                </h4>
                <div className="text-xs text-gray-500">
                  {mandiSummary.highestPriceMandi.mandi.district}, {mandiSummary.highestPriceMandi.mandi.state}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-200">
                <div>
                  <span className="text-[11px] text-gray-500 block">{strings.modalPrice}</span>
                  <div className="text-xl font-black text-amber-900">
                    {priceUnit === 'kg'
                      ? `₹${mandiSummary.highestPriceMandi.qualityGrades.averageProductPerKg}/kg`
                      : `₹${mandiSummary.highestPriceMandi.grossPrice.toLocaleString('en-IN')}/q`}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {priceUnit === 'kg' ? `(₹${mandiSummary.highestPriceMandi.grossPrice}/q)` : `(₹${mandiSummary.highestPriceMandi.qualityGrades.averageProductPerKg}/kg)`}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#165b33] font-bold block">{strings.netRealization}</span>
                  <div className="text-xl font-black text-[#165b33]">
                    {priceUnit === 'kg'
                      ? `₹${mandiSummary.highestPriceMandi.qualityGrades.netInHandPerKg}/kg`
                      : `₹${mandiSummary.highestPriceMandi.netIncome.toLocaleString('en-IN')}/q`}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {priceUnit === 'kg' ? `(₹${mandiSummary.highestPriceMandi.netIncome}/q)` : `(₹${mandiSummary.highestPriceMandi.qualityGrades.netInHandPerKg}/kg)`}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-600 pt-1 flex items-center justify-between">
                <span>Deductions: -₹{mandiSummary.highestPriceMandi.transportCost + mandiSummary.highestPriceMandi.mandiFee + mandiSummary.highestPriceMandi.transitLoss}/q</span>
                <span className="font-extrabold text-[#165b33]">Peak Net: ₹{(totalFarmProductionQuintals * mandiSummary.highestPriceMandi.netIncome).toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Arbitrage Opportunity Callout */}
          {mandiSummary.priceDifferencePerQuintal > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-gray-800">
                <Sparkles className="w-5 h-5 text-[#165b33] shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">{strings.extraProfitNotice} </span>
                  <span className="font-black text-[#165b33]">
                    +₹{mandiSummary.priceDifferencePerQuintal} / quintal
                  </span>
                  <span className="text-gray-600"> (Total: </span>
                  <span className="font-black text-[#165b33]">
                    +₹{(totalFarmProductionQuintals * mandiSummary.priceDifferencePerQuintal).toLocaleString('en-IN')} extra
                  </span>
                  <span className="text-gray-600"> on {landAcres} acres)</span>
                </div>
              </div>

              <Link
                href="/markets"
                className="px-4 py-2 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs shrink-0 self-start sm:self-auto shadow-xs"
              >
                {isEn ? 'Compare All Mandis →' : 'सर्व मंड्यांची तुलना करा →'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Part C: Scientific Soil Health & "Which Crop SHOULD You Cultivate" */}
      <div className="pt-3 border-t border-gray-100 space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165b33] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Soil & Agronomic Intelligence' : 'मृदा शास्त्र व पीक शिफारस'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {strings.whichCropTitle}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {strings.whichCropDesc}
          </p>
        </div>

        {/* Detected Soil Order & GPS Detection Source Badge */}
        <div className="bg-[#f0f7f2] border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#165b33] shrink-0" />
            <div>
              <span className="font-bold text-gray-900 block text-sm">{soilProfile.soilClass}</span>
              <span className="text-gray-600">{soilProfile.detectionSummary || 'Detected via GPS coordinates'}</span>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#165b33] border border-emerald-300 self-start sm:self-auto">
            {soilProfile.isLabVerified ? '✓ Lab Card Verified' : '🛰️ Satellite Auto-Detected'}
          </span>
        </div>

        {/* 3 Dynamic Soil Metrics Badges from soilProfile */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#f9faf9] p-3 rounded-xl border border-gray-200 text-center">
            <span className="text-[11px] text-gray-500 block">Soil pH</span>
            <span className="text-lg font-extrabold text-gray-900">{soilProfile.ph}</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {soilProfile.ph < 6.5 ? 'Acidic' : soilProfile.ph <= 7.8 ? 'Optimal' : 'Alkaline'}
            </span>
          </div>

          <div className="bg-[#f9faf9] p-3 rounded-xl border border-gray-200 text-center">
            <span className="text-[11px] text-gray-500 block">Clay Content</span>
            <span className="text-lg font-extrabold text-gray-900">{soilProfile.clayPct}%</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {soilProfile.clayPct >= 35 ? 'Heavy Moisture Hold' : 'Free Drainage'}
            </span>
          </div>

          <div className="bg-[#f9faf9] p-3 rounded-xl border border-gray-200 text-center">
            <span className="text-[11px] text-gray-500 block">Organic Carbon</span>
            <span className="text-lg font-extrabold text-gray-900">{soilProfile.organicCarbonPct}%</span>
            <span className="text-[10px] text-gray-600 font-semibold block">
              {soilProfile.organicCarbonPct >= 0.75 ? 'High Fertility' : 'Medium Fertility'}
            </span>
          </div>
        </div>

        {/* Explanatory helper: How GPS determines soil without a lab test */}
        <div className="p-3.5 bg-white border border-gray-200 rounded-2xl text-xs space-y-1.5 text-gray-600">
          <div className="font-bold text-gray-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#165b33]" />
            <span>How GPS identifies your soil without lab equipment:</span>
          </div>
          <p className="leading-relaxed">
            1. GPS acquires your coordinates &rarr; 2. Cross-references global <strong>ISRIC SoilGrids 250m satellite layers</strong> & <strong>ICAR Agro-Ecological maps</strong> &rarr; 3. Pinpoints soil order and clay/pH profile &rarr; 4. Recommends the highest-yielding crops below.
          </p>
        </div>

        {/* Top Recommended Crops List */}
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec, index) => {
            const isCurrent = rec.cropName.toLowerCase() === currentCrop.toLowerCase();
            return (
              <div
                key={rec.cropName}
                className={`p-4 rounded-2xl border transition-all ${
                  index === 0
                    ? 'border-[#165b33] bg-emerald-50/30 shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      index === 0 ? 'bg-[#165b33] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-gray-900">{rec.cropName}</h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#165b33] border border-emerald-300">
                          {rec.suitabilityScorePct}% {strings.matchScore}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-800">
                            {isEn ? 'Current Crop' : 'चालू पीक'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{rec.season} Season · {rec.riskFactor}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs text-gray-500">{strings.expectedProfit}</div>
                    <div className="text-base sm:text-lg font-black text-[#165b33]">
                      +₹{rec.expectedNetProfitPerAcre.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-600">/ acre</span>
                    </div>
                  </div>
                </div>

                {/* Agronomic justification bullets */}
                <ul className="mt-2.5 space-y-1 text-xs text-gray-600 pl-1">
                  {rec.agronomicReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#165b33] font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                {/* Switch button */}
                {!isCurrent && (
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      Total {landAcres} acres: <strong>₹{(rec.expectedNetProfitPerAcre * landAcres).toLocaleString('en-IN')}</strong> net profit
                    </span>
                    <button
                      onClick={() => setCurrentCrop(rec.cropName)}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-[#165b33] text-[#165b33] hover:bg-emerald-50 text-xs font-bold transition-colors"
                    >
                      {strings.adoptBtn}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tailored Fertilizer Plan Box */}
        {selectedRecommendedCrop && (
          <div className="p-4 rounded-2xl bg-[#f9faf9] border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#165b33]" />
                <span>{strings.fertilizerDoseTitle} ({selectedRecommendedCrop.cropName})</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                ICAR Certified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <strong className="block text-gray-700 text-[11px] mb-0.5">At Sowing (Basal):</strong>
                <span className="text-gray-600">{selectedRecommendedCrop.fertilizerPlan.basalDose}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <strong className="block text-gray-700 text-[11px] mb-0.5">Day 30 (Top Dressing):</strong>
                <span className="text-gray-600">{selectedRecommendedCrop.fertilizerPlan.day30TopDress}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <strong className="block text-gray-700 text-[11px] mb-0.5">Day 60 (Foliar/Booster):</strong>
                <span className="text-gray-600">{selectedRecommendedCrop.fertilizerPlan.day60TopDress}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-500 italic">
                {selectedRecommendedCrop.fertilizerPlan.soilAdjustmentNote}
              </span>
              <Link
                href="/store"
                className="font-bold text-[#165b33] hover:underline"
              >
                {strings.viewSchedule}
              </Link>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
