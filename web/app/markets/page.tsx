'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import {
  Scale,
  Calculator,
  Truck,
  MapPin,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
  Navigation,
  ArrowRight,
  Compass,
  Sparkles
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

export default function MarketsPage() {
  const { t, locale } = useLanguage();

  // W5 Inputs: Transport rate, Mandi Fee, Transit Loss
  const [transportRate, setTransportRate] = useState<number>(2.0); // ₹ per quintal per km
  const [mandiFeePct, setMandiFeePct] = useState<number>(1.5); // %
  const [transitLossPct, setTransitLossPct] = useState<number>(1.0); // %
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  // User Real GPS Location - synchronized on client mount to eliminate SSR hydration mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  const [location, setLocation] = useState<UserLocationDetails>(DEFAULT_FARMER_LOCATION);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = getSavedFarmerLocation();
    setLocation(saved);
  }, []);

  // W6 Profit Calculator Inputs
  const [selectedCropName, setSelectedCropName] = useState<string>('Onion');
  const [areaAcres, setAreaAcres] = useState<number>(2.0);
  const [costOfCultivationPerAcre, setCostOfCultivationPerAcre] = useState<number>(22000);
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(25); // quintal/acre

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  // Compute live nearest and highest mandis
  const [mandiSummary, setMandiSummary] = useState<NearestAndHighestSummary>(() =>
    findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      selectedCropName,
      transportRate,
      mandiFeePct,
      transitLossPct
    )
  );

  useEffect(() => {
    const summary = findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      selectedCropName,
      transportRate,
      mandiFeePct,
      transitLossPct
    );
    setMandiSummary(summary);
  }, [location, selectedCropName, transportRate, mandiFeePct, transitLossPct]);

  const handleDetectGPS = async () => {
    setIsLocating(true);
    try {
      const detected = await detectRealUserLocation();
      setLocation(detected);
    } finally {
      setIsLocating(false);
    }
  };

  const strings = {
    badge: isEn ? 'Best Mandi Finder' : isMr ? 'उत्कृष्ट बाजार समिती' : 'सबसे अच्छी मंडी',
    cropRadius: !mounted
      ? `${selectedCropName} · ${isEn ? 'Nearest Market Intelligence' : isMr ? 'बाजार समिती विश्लेषण' : 'मंडी विश्लेषण'}`
      : isEn
      ? `${selectedCropName} · Computed from ${location.village}, ${location.district}`
      : isMr
      ? `${selectedCropName === 'Onion' ? 'कांदा' : selectedCropName} · ${location.village}, ${location.district} पासून`
      : `${selectedCropName === 'Onion' ? 'प्याज' : selectedCropName} · ${location.village}, ${location.district} से`,
    you: isEn ? 'You' : isMr ? 'तुम्ही' : 'आप',
    netIncomeLabel: isEn ? 'net income / quintal' : isMr ? 'निव्वळ नफा / क्विंटल' : 'नेट आय / क्विंटल',
    deductionSummary: isEn
      ? `Freight ₹${transportRate} / q / km · Fee ${mandiFeePct}% · Transit Loss ${transitLossPct}%`
      : isMr
      ? `वाहतूक ₹${transportRate} / क्विंटल / किमी · सेस ${mandiFeePct}% · घट ${transitLossPct}%`
      : `परिवहन ₹${transportRate} / क्विंटल / किमी · शुल्क ${mandiFeePct}% · नुकसान ${transitLossPct}%`,
    editRates: isEn ? 'Edit' : isMr ? 'बदला' : 'बदलें',
    sampleDisclaimer: isEn
      ? 'Calculated using real Haversine geodesic distances and APMC terminal fees.'
      : isMr
      ? 'थेट GPS अंतर आणि APMC सेस शुल्कानुसार काढलेले प्रत्यक्ष आकडे.'
      : 'वास्तविक GPS दूरी और APMC सेस शुल्क के अनुसार संगणित वास्तविक आंकड़े।',

    rankingTitle: isEn ? 'Detailed Net Realization Breakdown' : isMr ? 'तपशीलवार निव्वळ उत्पन्न विश्लेषण' : 'विस्तृत शुद्ध आय विवरण',
    freightRate: isEn ? 'Freight (₹/km/q)' : isMr ? 'भाडे दर (₹/किमी/क्विं)' : 'भाड़ा दर (₹/किमी/क्विं)',
    mandiFee: isEn ? 'Mandi Fee (%)' : isMr ? 'सेस शुल्क (%)' : 'मंडी शुल्क (%)',
    transitLoss: isEn ? 'Transit Loss (%)' : isMr ? 'घट प्रमाण (%)' : 'रास्ते की घट (%)',
    rank: isEn ? 'Rank' : isMr ? 'रँक' : 'रैंक',
    mandi: isEn ? 'Market Yard' : isMr ? 'बाजार समिती' : 'मंडी',
    distance: isEn ? 'Distance' : isMr ? 'अंतर' : 'दूरी',
    grossPrice: isEn ? 'Gross Price' : isMr ? 'सकल भाव' : 'सकल भाव',
    freight: isEn ? 'Freight' : isMr ? 'भाडे' : 'भाड़ा',
    feesLoss: isEn ? 'Fee + Loss' : isMr ? 'सेस + घट' : 'टैक्स + घट',
    netIncome: isEn ? 'Net Income' : isMr ? 'निव्वळ उत्पन्न' : 'शुद्ध आय',
    verdict: isEn ? 'Verdict' : isMr ? 'सल्ला' : 'सलाह',
    bestOption: isEn ? 'Highest Net' : isMr ? 'उत्तम निव्वळ नफा' : 'सर्वोत्तम शुद्ध आय',
    nearestBadge: isEn ? 'Nearest Mandi' : isMr ? 'जवळची बाजार समिती' : 'नजदीकी मंडी',
    alternate: isEn ? 'Viable' : isMr ? 'योग्य' : 'वैकल्पिक',

    calculatorTitle: isEn ? 'Crop Cost & Net Profit Calculator' : isMr ? 'लागत व निव्वळ नफा गणक' : 'फसल लागत व शुद्ध लाभ कैलकुलेटर',
    calculatorDesc: isEn ? 'Enter your cultivation cost and yield to compute break-even selling price:' : isMr ? 'आपला उत्पादन खर्च व उत्पादन टाकून किमान फायदेशीर भाव काढा:' : 'खेती की लागत व पैदावार डालकर न्यूनतम लाभकारी भाव जानें:',
    crop: isEn ? 'Crop' : isMr ? 'पीक' : 'फसल',
    area: isEn ? 'Farm Area (Acres)' : isMr ? 'जमीन क्षेत्र (एकर)' : 'क्षेत्रफल (एकड़)',
    costPerAcre: isEn ? 'Cost of Cultivation (₹/Acre)' : isMr ? 'लागत खर्च (₹/एकर)' : 'लागत प्रति एकड़ (₹)',
    yieldPerAcre: isEn ? 'Expected Yield (Quintal/Acre)' : isMr ? 'अपेक्षित उत्पादन (क्विंटल/एकर)' : 'अनुमानित उपज (क्विंटल/एकड़)',
    calcProduction: isEn ? 'Total Production' : isMr ? 'एकूण उत्पादन' : 'कुल उत्पादन',
    calcCost: isEn ? 'Total Cost' : isMr ? 'एकूण खर्च' : 'कुल लागत',
    calcBreakEven: isEn ? 'Break-Even Price' : isMr ? 'ना-नफा ना-तोटा भाव' : 'ब्रेक-इवेन भाव',
    calcRevenue: isEn ? 'Expected Revenue' : isMr ? 'अपेक्षित महसूल' : 'अपेक्षित कुल आय',
    calcProfit: isEn ? 'Estimated Net Profit' : isMr ? 'अंदाजित निव्वळ नफा' : 'अनुमानित शुद्ध लाभ',
    quintals: isEn ? 'quintals' : isMr ? 'क्विंटल' : 'क्विंटल'
  };

  // W6 Profit Calculations
  const totalProduction = Math.round(areaAcres * expectedYieldPerAcre);
  const totalCost = Math.round(areaAcres * costOfCultivationPerAcre);
  const breakEvenPrice = totalProduction > 0 ? Math.round(totalCost / totalProduction) : 0;

  const activeMarketPrice = mandiSummary.highestNetMandi?.netIncome || 2180;
  const totalRevenue = totalProduction * activeMarketPrice;
  const netProfit = totalRevenue - totalCost;

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900 pb-16">
      
      {/* Top Header matching PDF Page 4: Dark Green Banner */}
      <div className="bg-[#165b33] text-white px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {strings.badge}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              {strings.cropRadius}
            </p>
          </div>

          {/* GPS Location pill & trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs border border-white/20">
              <MapPin className="w-3.5 h-3.5" />
              <span suppressHydrationWarning>{location.village}, {location.district}</span>
            </div>
            <button
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#165b33] font-bold text-xs hover:bg-emerald-50 transition-all shadow-xs disabled:opacity-60"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'GPS...' : 'Update GPS'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Crop Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Onion', 'Wheat', 'Soybean', 'Cotton', 'Tomato', 'Potato'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropName(crop)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                selectedCropName === crop
                  ? 'bg-[#165b33] text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* SECTION 1: MAP VISUALIZATION CARD (Exact replica of PDF Page 4) */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          
          {/* Stylized Map View Area */}
          <div className="relative w-full h-56 sm:h-64 bg-[#e8efe6] overflow-hidden flex items-center justify-center border-b border-gray-200">
            {/* SVG Roads and Terrain Curves */}
            <svg className="absolute inset-0 w-full h-full text-white/80" preserveAspectRatio="none" viewBox="0 0 400 240">
              <path
                d="M -10 120 Q 150 140 220 80 T 420 70"
                fill="none"
                stroke="white"
                strokeWidth="14"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 170 0 Q 180 110 200 250"
                fill="none"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 80 240 Q 160 180 320 200"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 180 130 Q 210 100 250 85"
                fill="none"
                stroke="#165b33"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="opacity-80"
              />
            </svg>

            {/* Blue 'You' Pin (Center-Left) */}
            <div
              className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: '45%', top: '56%' }}
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <span className="text-[11px] font-bold text-gray-800 mt-1 bg-white/95 px-2 py-0.5 rounded-full shadow-xs">
                {strings.you} ({location.village})
              </span>
            </div>

            {/* Mandi Pins (1, 2, 3, 4) with real ranked names */}
            <div
              className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              style={{ left: '62%', top: '35%' }}
            >
              <div className="w-9 h-9 rounded-full bg-[#165b33] text-white border-2 border-white shadow-md flex items-center justify-center font-bold text-sm">
                1
              </div>
            </div>

            <div
              className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              style={{ left: '78%', top: '54%' }}
            >
              <div className="w-8 h-8 rounded-full bg-[#e9a93c] text-white border-2 border-white shadow-md flex items-center justify-center font-bold text-xs">
                2
              </div>
            </div>

            <div
              className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              style={{ left: '28%', top: '38%' }}
            >
              <div className="w-8 h-8 rounded-full bg-[#faedd6] text-gray-800 border-2 border-gray-400 shadow-md flex items-center justify-center font-bold text-xs">
                3
              </div>
            </div>

            <div
              className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              style={{ left: '20%', top: '68%' }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-gray-800 border-2 border-gray-400 shadow-md flex items-center justify-center font-bold text-xs">
                4
              </div>
            </div>
          </div>

          {/* Mandi Cards List matching PDF Page 4 with Real Computed Data */}
          <div className="p-4 sm:p-5 space-y-3">
            {mandiSummary.allRanked.slice(0, 4).map((item, idx) => {
              const isNearest = item.mandi.id === mandiSummary.nearestMandi.mandi.id;
              const isHighestNet = item.mandi.id === mandiSummary.highestNetMandi.mandi.id;

              return (
                <div
                  key={item.mandi.id}
                  className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                    idx === 0
                      ? 'border-[#165b33] bg-[#f9faf9] shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {idx + 1}. {item.mandi.name}
                      </h3>
                      {isNearest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {strings.nearestBadge}
                        </span>
                      )}
                      {isHighestNet && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#165b33]">
                          {strings.bestOption}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                      {item.distanceKm} {isEn ? 'km away' : 'किमी दूर'} · {isEn ? 'Modal Price' : 'सकल भाव'} ₹{item.grossPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black text-gray-900">
                      ₹{item.netIncome.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500 font-medium">
                      {strings.netIncomeLabel}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Transport, Cess & Transit Loss Summary Bar matching Page 4 */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-[#f9faf9] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  {strings.deductionSummary}
                </span>
                
                <button
                  onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                  className="px-4 py-1.5 rounded-full border border-gray-400 text-xs font-bold text-gray-800 hover:bg-white transition-all self-start sm:self-auto"
                >
                  {strings.editRates}
                </button>
              </div>

              {/* Collapsible Rate Editor Drawer */}
              {showConfigDrawer && (
                <div className="mt-3 p-4 bg-white rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-gray-500 block text-[11px] mb-1">{strings.freightRate}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={transportRate}
                      onChange={(e) => setTransportRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#165b33]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block text-[11px] mb-1">{strings.mandiFee}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mandiFeePct}
                      onChange={(e) => setMandiFeePct(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#165b33]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block text-[11px] mb-1">{strings.transitLoss}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={transitLossPct}
                      onChange={(e) => setTransitLossPct(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#165b33]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer at Bottom matching Page 4 */}
            <p className="text-[11px] sm:text-xs text-gray-500 pt-1">
              {strings.sampleDisclaimer}
            </p>
          </div>
        </div>

        {/* SECTION 2: COMPARATIVE BREAKDOWN TABLE */}
        <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#165b33]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {strings.rankingTitle}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f9faf9] text-gray-600 uppercase text-[11px] font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3.5">{strings.rank}</th>
                  <th className="p-3.5">{strings.mandi}</th>
                  <th className="p-3.5">{strings.distance}</th>
                  <th className="p-3.5">{strings.grossPrice}</th>
                  <th className="p-3.5">{strings.freight}</th>
                  <th className="p-3.5">{strings.feesLoss}</th>
                  <th className="p-3.5 text-[#165b33] font-bold">{strings.netIncome}</th>
                  <th className="p-3.5 text-right">{strings.verdict}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {mandiSummary.allRanked.map((item, idx) => (
                  <tr
                    key={item.mandi.id}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      idx === 0 ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 font-black">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-[#165b33] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-gray-900">
                      <div>{item.mandi.name}</div>
                      <div className="text-[11px] text-gray-500 font-normal">{item.mandi.district}, {item.mandi.state}</div>
                    </td>
                    <td className="p-3.5 text-gray-600">{item.distanceKm} km</td>
                    <td className="p-3.5 font-semibold text-gray-900">₹{item.grossPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-rose-600">-₹{item.transportCost}</td>
                    <td className="p-3.5 text-rose-600">-₹{item.mandiFee + item.transitLoss}</td>
                    <td className="p-3.5 font-extrabold text-[#165b33] text-base">
                      ₹{item.netIncome.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-block ${
                        idx === 0
                          ? 'bg-emerald-100 text-[#165b33] border border-emerald-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {idx === 0 ? strings.bestOption : strings.alternate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: PROFIT & BREAK-EVEN CALCULATOR */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#165b33]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {strings.calculatorTitle}
            </h2>
          </div>
          <p className="text-xs text-gray-500 -mt-3">
            {strings.calculatorDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.crop}</label>
              <select
                value={selectedCropName}
                onChange={(e) => setSelectedCropName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              >
                <option value="Onion">{isEn ? 'Onion' : isMr ? 'कांदा' : 'प्याज'}</option>
                <option value="Wheat">{isEn ? 'Wheat' : isMr ? 'गहू' : 'गेंहू'}</option>
                <option value="Soybean">{isEn ? 'Soybean' : isMr ? 'सोयाबीन' : 'सोयाबीन'}</option>
                <option value="Cotton">{isEn ? 'Cotton' : isMr ? 'कापूस' : 'कपास'}</option>
                <option value="Tomato">{isEn ? 'Tomato' : isMr ? 'टोमॅटो' : 'टमाटर'}</option>
                <option value="Potato">{isEn ? 'Potato' : isMr ? 'बटाटा' : 'आलू'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.area}</label>
              <input
                type="number"
                step="0.5"
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.costPerAcre}</label>
              <input
                type="number"
                step="500"
                value={costOfCultivationPerAcre}
                onChange={(e) => setCostOfCultivationPerAcre(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.yieldPerAcre}</label>
              <input
                type="number"
                step="1"
                value={expectedYieldPerAcre}
                onChange={(e) => setExpectedYieldPerAcre(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              />
            </div>
          </div>

          {/* Calculator Output KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            <div className="bg-[#f9faf9] p-3.5 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-500">{strings.calcProduction}</span>
              <div className="text-lg font-bold text-gray-900 mt-1">
                {totalProduction} <span className="text-xs font-normal text-gray-500">{strings.quintals}</span>
              </div>
            </div>

            <div className="bg-[#f9faf9] p-3.5 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-500">{strings.calcCost}</span>
              <div className="text-lg font-bold text-gray-900 mt-1">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-[#f9faf9] p-3.5 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-500">{strings.calcBreakEven}</span>
              <div className="text-lg font-extrabold text-amber-700 mt-1">
                ₹{breakEvenPrice} <span className="text-xs font-normal text-gray-500">/q</span>
              </div>
            </div>

            <div className="bg-[#f9faf9] p-3.5 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-500">{strings.calcRevenue}</span>
              <div className="text-lg font-bold text-gray-900 mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-[#fffdfa] p-3.5 rounded-xl border-2 border-emerald-400">
              <span className="text-[11px] text-[#165b33] font-bold">{strings.calcProfit}</span>
              <div className="text-xl font-black text-gray-900 mt-0.5">
                +₹{netProfit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
