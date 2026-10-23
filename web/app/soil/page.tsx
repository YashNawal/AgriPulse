'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  X,
  Check,
  MapPin,
  Compass,
  ShieldCheck,
  Sparkles,
  Sprout,
  ArrowRight,
  Satellite,
  Info,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  detectRealUserLocation,
  getSavedFarmerLocation,
  saveFarmerLocation,
  UserLocationDetails,
  DEFAULT_FARMER_LOCATION
} from '@/lib/location';
import {
  evaluateCropSuitability,
  detectSoilFromGPS,
  DEFAULT_SOIL_PROFILE,
  SoilHealthCardData,
  RecommendedCropAnalysis
} from '@/lib/soilAgronomy';

export default function SoilPage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    title: isEn ? 'Soil Health & Crop Suitability' : isMr ? 'माती आरोग्य व योग्य पिके' : 'मृदा स्वास्थ्य व फसल उपयुक्तता',
    subtitle: isEn ? 'Live GPS satellite detection & agronomic matching' : isMr ? 'थेट GPS उपग्रह तपासणी व कृषी सल्ला' : 'लाइव GPS उपग्रह जाँच व फसल चयन',
    soilType: isEn ? 'Medium Deep Black Soil (Vertisol)' : isMr ? 'काळी कसदार जमीन (Vertisol)' : 'काली कपासी मिट्टी (Vertisol)',
    soilEstimate: isEn ? 'Auto-detected via Satellite GPS (ISRIC SoilGrids 250m)' : isMr ? 'उपग्रह GPS द्वारे स्वयंचलित तपासणी (SoilGrids 250m)' : 'उपग्रह GPS द्वारा स्वचालित जाँच (SoilGrids 250m)',
    ph: 'pH',
    clay: isEn ? 'Clay Content' : isMr ? 'मातीचे प्रमाण (Clay)' : 'मिट्टी का अंश (Clay)',
    orgCarbon: isEn ? 'Organic Carbon' : isMr ? 'सेंद्रिय कर्ब' : 'जैविक कार्बन',
    enterCardBtn: isEn ? 'Have a Physical Soil Health Card? Enter Lab Values' : isMr ? 'सॉइल हेल्थ कार्ड लॅब मान भरा (N, P, K, pH)' : 'सॉइल हेल्थ कार्ड लैब मान दर्ज करें (N, P, K)',
    topCropsTitle: isEn ? 'Which Crops SHOULD You Cultivate on This Soil?' : isMr ? 'या मातीत कोणती पिके घ्यावीत?' : 'इस मिट्टी में कौन सी फसलें उगानी चाहिए?',
    footerDisclaimer: isEn
      ? 'Suggestions combine soil texture, ICAR nutrient standards, local climate, and real-time APMC mandi price trends. Decision support system for Indian farmers.'
      : isMr
      ? 'शिफारसींमध्ये मातीचा पोत, ICAR पोषक घटक मानके, हवामान आणि प्रत्यक्ष बाजारभाव समाविष्ट आहेत. हा निर्णय समर्थनासाठी सल्ला आहे.'
      : 'सुझाव मिट्टी, ICAR पोषक मानकों, मौसम और वास्तविक मंडी भावों पर आधारित हैं। यह निर्णय समर्थन हेतु है।',
    modalTitle: isEn ? 'Enter Soil Health Card (SHC) Lab Values' : isMr ? 'सॉइल हेल्थ कार्ड प्रयोगशाळा नोंदी' : 'मृदा स्वास्थ्य कार्ड (SHC) लैब मान दर्ज करें',
    saveBtn: isEn ? 'Save & Re-evaluate Recommendations' : isMr ? 'जतन करा व शिफारसी अद्यतन करा' : 'सहेजें व नई फसल सिफारिशें देखें',
    perAcre: isEn ? '/ acre' : isMr ? '/ एकर' : '/ एकड़',
    labVerifiedBadge: isEn ? 'Lab Test Verified Values' : isMr ? 'प्रयोगशाळा चाचणी प्रमाणित' : 'प्रयोगशाला प्रमाणित मान'
  };

  // Location & GPS (synchronized on mount to prevent SSR hydration mismatch)
  const [location, setLocation] = useState<UserLocationDetails>(DEFAULT_FARMER_LOCATION);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showSatelliteGuide, setShowSatelliteGuide] = useState<boolean>(true);

  useEffect(() => {
    const saved = getSavedFarmerLocation();
    setLocation(saved);
  }, []);

  // Soil Data
  const [soilProfile, setSoilProfile] = useState<SoilHealthCardData>(DEFAULT_SOIL_PROFILE);
  const [modalOpen, setModalOpen] = useState(false);
  const [phInput, setPhInput] = useState('7.6');
  const [clayInput, setClayInput] = useState('48');
  const [ocInput, setOcInput] = useState('0.62');
  const [nitrogenInput, setNitrogenInput] = useState('240');
  const [phosphorusInput, setPhosphorusInput] = useState('14');
  const [potassiumInput, setPotassiumInput] = useState('310');

  // Evaluated Recommendations
  const [recommendations, setRecommendations] = useState<RecommendedCropAnalysis[]>([]);

  // Pre-configured test regions to demonstrate GPS soil changes
  const testRegions = [
    { name: 'Lasalgaon, Nashik (Maharashtra)', lat: 20.1472, lon: 74.2255, village: 'Lasalgaon', district: 'Nashik', state: 'Maharashtra', soilDesc: 'Black Vertisol' },
    { name: 'Ludhiana (Punjab)', lat: 30.9010, lon: 75.8573, village: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', soilDesc: 'Alluvial Loam' },
    { name: 'Coimbatore (Tamil Nadu)', lat: 11.0168, lon: 76.9558, village: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', soilDesc: 'Red Sandy Loam' },
    { name: 'Rajkot (Gujarat)', lat: 22.3039, lon: 70.8022, village: 'Rajkot', district: 'Rajkot', state: 'Gujarat', soilDesc: 'Aridic Vertisol' },
  ];

  useEffect(() => {
    const recs = evaluateCropSuitability(soilProfile, 2.5);
    setRecommendations(recs);
  }, [soilProfile]);

  // Load user saved soil inputs from Supabase if authenticated
  useEffect(() => {
    async function loadSavedLabData() {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('user_soil_inputs')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data && !error) {
          setSoilProfile(prev => ({
            ...prev,
            ph: data.ph ? Number(data.ph) : prev.ph,
            nitrogenKgHa: data.n ? Number(data.n) : prev.nitrogenKgHa,
            phosphorusKgHa: data.p ? Number(data.p) : prev.phosphorusKgHa,
            potassiumKgHa: data.k ? Number(data.k) : prev.potassiumKgHa,
            organicCarbonPct: data.organic_carbon ? Number(data.organic_carbon) : prev.organicCarbonPct,
            isLabVerified: true,
            detectedVia: 'lab_card',
            detectionSummary: 'Loaded from your saved Soil Health Card'
          }));
        }
      } catch (err) {
        console.warn('Could not load user soil inputs:', err);
      }
    }
    loadSavedLabData();
  }, [user?.id]);

  // Auto-detect soil from GPS whenever location coordinates update
  useEffect(() => {
    let isMounted = true;
    async function loadSoilData() {
      const detected = await detectSoilFromGPS(location.latitude, location.longitude);
      if (isMounted) {
        setSoilProfile(prev => {
          // Keep lab verified flag if user explicitly entered lab test
          if (prev.isLabVerified) {
            return {
              ...detected,
              ph: prev.ph,
              clayPct: prev.clayPct,
              organicCarbonPct: prev.organicCarbonPct,
              nitrogenKgHa: prev.nitrogenKgHa,
              phosphorusKgHa: prev.phosphorusKgHa,
              potassiumKgHa: prev.potassiumKgHa,
              isLabVerified: true,
              detectionSummary: 'Lab Verified + GPS Regional Profile'
            };
          }
          return detected;
        });
        setPhInput(detected.ph.toString());
        setClayInput(detected.clayPct.toString());
        setOcInput(detected.organicCarbonPct.toString());
        setNitrogenInput(detected.nitrogenKgHa.toString());
        setPhosphorusInput(detected.phosphorusKgHa.toString());
        setPotassiumInput(detected.potassiumKgHa.toString());
      }
    }
    loadSoilData();
    return () => { isMounted = false; };
  }, [location.latitude, location.longitude]);

  const handleDetectGPS = async () => {
    setIsLocating(true);
    try {
      const detected = await detectRealUserLocation();
      setLocation(detected);
      saveFarmerLocation(detected);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectRegion = (region: typeof testRegions[0]) => {
    const updatedLoc: UserLocationDetails = {
      latitude: region.lat,
      longitude: region.lon,
      village: region.village,
      district: region.district,
      state: region.state,
      country: 'India',
      displayName: `${region.village}, ${region.district}, ${region.state}`,
      source: 'gps'
    };
    setLocation(updatedLoc);
    saveFarmerLocation(updatedLoc);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SoilHealthCardData = {
      ...soilProfile,
      ph: parseFloat(phInput) || 7.6,
      clayPct: parseFloat(clayInput) || 48,
      organicCarbonPct: parseFloat(ocInput) || 0.62,
      nitrogenKgHa: parseFloat(nitrogenInput) || 240,
      phosphorusKgHa: parseFloat(phosphorusInput) || 14,
      potassiumKgHa: parseFloat(potassiumInput) || 310,
      isLabVerified: true,
      detectedVia: 'lab_card',
      detectionSummary: 'Verified with official Soil Health Card (SHC) laboratory test'
    };
    setSoilProfile(updated);
    setModalOpen(false);

    // Save to Supabase user_soil_inputs if authenticated
    if (user?.id) {
      try {
        await supabase.from('user_soil_inputs').upsert({
          user_id: user.id,
          n: updated.nitrogenKgHa,
          p: updated.phosphorusKgHa,
          k: updated.potassiumKgHa,
          ph: updated.ph,
          organic_carbon: updated.organicCarbonPct,
          notes: `Updated on ${new Date().toLocaleDateString()}`
        });
      } catch (err) {
        console.warn('Could not save soil inputs to Supabase:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900 pb-16">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header with live GPS location */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {strings.title}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {strings.subtitle} · <span className="font-semibold text-gray-800">{location.village}, {location.district}</span>
              <span className="text-xs text-gray-400 ml-1">({location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E)</span>
            </p>
          </div>

          <button
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-gray-800 transition-all shadow-xs self-start sm:self-auto disabled:opacity-60"
          >
            <Compass className={`w-3.5 h-3.5 text-[#165b33] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : '📍 Refresh Live GPS'}</span>
          </button>
        </div>

        {/* Educational Interactive Card: How GPS Automatically Detects Soil & Crop */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowSatelliteGuide(!showSatelliteGuide)}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#165b33] flex items-center justify-center">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {isEn ? 'How Does GPS Determine Soil Type Without a Lab Visit?' : 'प्रयोगशाळेत न जाता GPS द्वारे माती कशी ओळखली जाते?'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isEn ? 'Scientific 4-step satellite earth observation & ICAR pedometrics pipeline' : 'उपग्रह रिमोट सेन्सिंग व ICAR कृषी नकाशा कार्यप्रणाली'}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              {showSatelliteGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showSatelliteGuide && (
            <div className="pt-2 border-t border-gray-100 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-[#f9faf9] p-3 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span className="w-4 h-4 rounded-full bg-[#165b33] text-white flex items-center justify-center text-[10px]">1</span>
                    <span>GPS Coordinates</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Phone/browser GPS locks exact field latitude & longitude with 10m radius precision.
                  </p>
                </div>

                <div className="bg-[#f9faf9] p-3 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span className="w-4 h-4 rounded-full bg-[#165b33] text-white flex items-center justify-center text-[10px]">2</span>
                    <span>ISRIC SoilGrids</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Sentinel & Landsat 250m satellite rasters query topsoil clay %, pH, and organic carbon.
                  </p>
                </div>

                <div className="bg-[#f9faf9] p-3 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span className="w-4 h-4 rounded-full bg-[#165b33] text-white flex items-center justify-center text-[10px]">3</span>
                    <span>ICAR Agro-Zones</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Maps coordinates to Indian soil orders (Vertisol, Alluvial, Red Sandy Loam) & nutrient baselines.
                  </p>
                </div>

                <div className="bg-[#f9faf9] p-3 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span className="w-4 h-4 rounded-full bg-[#165b33] text-white flex items-center justify-center text-[10px]">4</span>
                    <span>Profit Matching</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Matches soil physics with root aeration + live APMC prices to rank highest net profit per acre.
                  </p>
                </div>
              </div>

              {/* Quick Regional Test Buttons */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                  🧪 Test Soil & Crop Detection Across Indian Agro-Zones:
                </span>
                <div className="flex flex-wrap gap-2">
                  {testRegions.map((reg) => {
                    const isSelected = Math.abs(location.latitude - reg.lat) < 0.2;
                    return (
                      <button
                        key={reg.name}
                        onClick={() => handleSelectRegion(reg)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#165b33] text-white border-[#165b33] font-bold shadow-xs'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {reg.name} · <span className="opacity-80">{reg.soilDesc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Soil Card matching Page 6 */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165b33] mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Detected Soil Order</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {soilProfile.soilClass}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {soilProfile.isLabVerified ? strings.labVerifiedBadge : soilProfile.detectionSummary || strings.soilEstimate}
              </p>
            </div>
            {soilProfile.isLabVerified ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#165b33] border border-emerald-300 self-start sm:self-auto">
                ✓ Lab Card Verified
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                🛰️ Satellite GPS Inferred
              </span>
            )}
          </div>

          {/* 3 Main Metric Boxes matching Page 6 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f9faf9] p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">{strings.ph}</span>
              <span className="text-2xl font-black text-gray-900 mt-0.5 block">{soilProfile.ph}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {soilProfile.ph < 6.5 ? 'Acidic' : soilProfile.ph <= 7.8 ? 'Optimal (Neutral)' : 'Alkaline'}
              </span>
            </div>

            <div className="bg-[#f9faf9] p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">{strings.clay}</span>
              <span className="text-2xl font-black text-gray-900 mt-0.5 block">{soilProfile.clayPct}%</span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {soilProfile.clayPct >= 35 ? 'Heavy Clay Texture' : soilProfile.clayPct >= 20 ? 'Loamy Texture' : 'Sandy Texture'}
              </span>
            </div>

            <div className="bg-[#f9faf9] p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">{strings.orgCarbon}</span>
              <span className="text-2xl font-black text-gray-900 mt-0.5 block">{soilProfile.organicCarbonPct}%</span>
              <span className="text-[10px] text-gray-600 font-semibold">
                {soilProfile.organicCarbonPct >= 0.75 ? 'High Fertility' : 'Medium Carbon'}
              </span>
            </div>
          </div>

          {/* N-P-K Secondary Bar */}
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-gray-500 text-[11px]">Nitrogen (N)</span>
              <div className="font-bold text-gray-900">{soilProfile.nitrogenKgHa} kg/ha (Medium)</div>
            </div>
            <div>
              <span className="text-gray-500 text-[11px]">Phosphorus (P)</span>
              <div className="font-bold text-gray-900">{soilProfile.phosphorusKgHa} kg/ha ({soilProfile.phosphorusKgHa < 15 ? 'Low' : 'Medium'})</div>
            </div>
            <div>
              <span className="text-gray-500 text-[11px]">Potassium (K)</span>
              <div className="font-bold text-gray-900">{soilProfile.potassiumKgHa} kg/ha (High)</div>
            </div>
          </div>

          {/* Enter Soil Health Card values button matching Page 6 */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#165b33] text-[#165b33] text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{strings.enterCardBtn}</span>
          </button>
        </div>

        {/* Section: Which crops SHOULD you cultivate on this soil matching Page 6 with actual computed figures */}
        <div className="space-y-4 pt-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {strings.topCropsTitle}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ranked by agronomic suitability match and expected profit per acre:
            </p>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={rec.cropName}
                className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#165b33] text-white flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{rec.cropName}</h3>
                      <span className="text-xs text-gray-500">{rec.season} · Expected Yield: {rec.expectedYieldQuintalPerAcre} q/acre</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-[#165b33]">
                      +₹{rec.expectedNetProfitPerAcre.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      net profit {strings.perAcre}
                    </div>
                  </div>
                </div>

                {/* Progress bar matching Page 6 */}
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#165b33] rounded-full transition-all duration-500"
                    style={{ width: `${rec.suitabilityScorePct}%` }}
                  />
                </div>

                {/* Agronomic justification bullets */}
                <div className="text-xs text-gray-600 space-y-1">
                  {rec.agronomicReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#165b33] font-bold">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Fertilizer Schedule snippet */}
                <div className="mt-2 p-3 bg-[#f9faf9] rounded-2xl border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-gray-800">Sowing Dose: </span>
                    <span className="text-gray-600">{rec.fertilizerPlan.basalDose}</span>
                  </div>
                  <Link
                    href="/store"
                    className="text-[#165b33] font-bold shrink-0 hover:underline"
                  >
                    View in Store →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer matching Page 6 */}
        <div className="text-xs text-gray-500 pt-3 pb-8 leading-relaxed">
          {strings.footerDisclaimer}
        </div>
      </main>

      {/* Soil Health Card Input Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">{strings.modalTitle}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Soil pH (6.0 - 8.5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={phInput}
                    onChange={(e) => setPhInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold focus:outline-none focus:border-[#165b33]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Clay Percentage (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={clayInput}
                    onChange={(e) => setClayInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold focus:outline-none focus:border-[#165b33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-semibold">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={ocInput}
                  onChange={(e) => setOcInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 font-bold focus:outline-none focus:border-[#165b33]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Available N (kg/ha)</label>
                  <input
                    type="number"
                    value={nitrogenInput}
                    onChange={(e) => setNitrogenInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-2 text-gray-900 font-bold focus:outline-none focus:border-[#165b33]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Available P (kg/ha)</label>
                  <input
                    type="number"
                    value={phosphorusInput}
                    onChange={(e) => setPhosphorusInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-2 text-gray-900 font-bold focus:outline-none focus:border-[#165b33]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">Available K (kg/ha)</label>
                  <input
                    type="number"
                    value={potassiumInput}
                    onChange={(e) => setPotassiumInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-2 text-gray-900 font-bold focus:outline-none focus:border-[#165b33]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs shadow-xs transition-colors mt-2"
              >
                {strings.saveBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
