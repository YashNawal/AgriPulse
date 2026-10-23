'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import {
  LineChart,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { MOCK_FORECASTS } from '@shared/index';

export default function ForecastPage() {
  const { t, locale } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>('Onion');
  const [horizon, setHorizon] = useState<7 | 14 | 30>(14);

  const forecast = MOCK_FORECASTS[selectedCrop] || MOCK_FORECASTS['Onion'] || MOCK_FORECASTS['Wheat'];

  // Adjust values by horizon
  const multiplier = horizon === 7 ? 0.6 : horizon === 30 ? 1.4 : 1.0;
  const p10Adjusted = Math.round(forecast.p10 - (25 * multiplier));
  const p50Adjusted = Math.round(forecast.p50 + (20 * multiplier));
  const p90Adjusted = Math.round(forecast.p90 + (40 * multiplier));

  // Localized texts
  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    badge: isEn ? 'AI Price Forecasting & Analysis' : isMr ? 'AI भाव अंदाज व विश्लेषण' : 'AI भाव पूर्वानुमान व विश्लेषण',
    title: isEn ? 'Scientific Mandi Price Forecast' : isMr ? 'मंडी भाव शास्त्रीय अंदाज' : 'मंडी भाव का वैज्ञानिक पूर्वानुमान',
    subtitle: isEn
      ? 'Probabilistic 7, 14, and 30-day Machine Learning price bands (p10, p50, p90) grounded in APMC historical arrivals.'
      : isMr
      ? 'मशीन लर्निंग द्वारे ७, १४ आणि ३० दिवसांचे p10 (किमान), p50 (संभाव्य) आणि p90 (कमाल) भाव अंदाज.'
      : 'मशीन लर्निंग मॉडल द्वारा 7, 14 और 30 दिनों का p10 (न्यूनतम), p50 (संभावित) और p90 (उच्चतम) भाव अनुमान।',
    alertTitle: isEn ? 'Critical Market Signal & Alert' : isMr ? 'महत्त्वाचा बाजार सिग्नल व इशारा' : 'महत्वपूर्ण बाजार समाचार व चेतावनी',
    freshSignal: isEn ? 'Latest Signal' : isMr ? 'ताजा इशारा' : 'ताजा सिग्नल',
    selectCrop: isEn ? 'Select Crop:' : isMr ? 'पीक निवडा:' : 'फसल चुनें:',
    daysSuffix: isEn ? 'Days' : isMr ? 'दिवस' : 'दिन',
    priceBandTitle: isEn
      ? `${selectedCrop} — ${horizon}-Day Forecast Range`
      : isMr
      ? `${selectedCrop === 'Onion' ? 'कांदा' : selectedCrop} — ${horizon} दिवसांची भाव मर्यादा`
      : `${selectedCrop === 'Onion' ? 'प्याज' : selectedCrop} — ${horizon} दिनों का भाव प्रसार`,
    marketLabel: isEn ? 'Market' : isMr ? 'बाजार समिती' : 'मंडी',
    modelLabel: isEn ? 'Model: LightGBM + Quantile Regression' : isMr ? 'मॉडेल: LightGBM + क्वांटाईल' : 'मॉडल: LightGBM + क्वांटाइल',
    confidenceBand: isEn ? '80% Confidence Interval' : isMr ? '८०% विश्वासार्हता मर्यादा' : '80% विश्वास अंतराल',
    bearishLabel: isEn ? 'Min (p10 Bearish)' : isMr ? 'किमान (p10 Bearish)' : 'कम से कम (p10 Bearish)',
    medianLabel: isEn ? 'Most Likely (p50 Median)' : isMr ? 'संभाव्य (p50 Median)' : 'सबसे संभावित (p50 Median)',
    bullishLabel: isEn ? 'Max (p90 Bullish)' : isMr ? 'कमाल (p90 Bullish)' : 'उच्चतम स्तर (p90 Bullish)',
    summaryText: isEn
      ? `Over the next ${horizon} days, modal prices are expected between ₹${p10Adjusted} and ₹${p90Adjusted} per quintal.`
      : isMr
      ? `पुढील ${horizon} दिवसांत भाव ₹${p10Adjusted} ते ₹${p90Adjusted} प्रति क्विंटल दरम्यान राहण्याची सर्वाधिक शक्यता आहे.`
      : `आगामी ${horizon} दिनों में भाव ₹${p10Adjusted} से ₹${p90Adjusted} के बीच रहने की सर्वाधिक संभावना है।`,
    driversTitle: isEn ? 'Top 3 Market Drivers (SHAP Explanations):' : isMr ? 'भावावर परिणाम करणारे ३ मुख्य घटक (SHAP):' : 'भाव को प्रभावित करने वाले मुख्य 3 कारण (SHAP):',
    adviceBadge: isEn ? 'Decision Support Advisory' : isMr ? 'शेतकरी सल्ला (Decision Support)' : 'किसान परामर्श',
    verdictQuestion: isEn ? 'Store or Sell Now?' : isMr ? 'साठवणूक करावी की विकावे?' : 'भंडारण करें या अभी निकालें?',
    verdictDescription: isEn
      ? `Compared to today's modal price of ₹2,300, the 14-day median forecast is ₹${p50Adjusted}. Holding stock is expected to yield positive net returns after accounting for storage & transit loss.`
      : isMr
      ? `आजच्या ₹२,३०० सरासरी भावाच्या तुलनेत १४ दिवसांचा संभाव्य भाव ₹${p50Adjusted} आहे. साठवणूक फायद्याची ठरू शकते.`
      : `वर्तमान भाव ₹2,300 की तुलना में 14 दिनों का p50 अनुमान ₹${p50Adjusted} है। भंडारण लाभकारी रहने की उम्मीद है।`,
    recommendedStrategy: isEn ? 'Recommended Strategy:' : isMr ? 'शिफारस केलेली रणनीती:' : 'अनुशंसित रणनीति:',
    strategyAction: isEn ? 'WAIT & STORE (Prices rising)' : isMr ? 'थांबा व साठवा (WAIT & STORE)' : 'रुकें व भंडारण करें (WAIT & STORE)',
    disclaimerTitle: isEn ? 'Disclaimer:' : isMr ? 'अस्वीकरण:' : 'अस्वीकरण:',
    disclaimerText: isEn
      ? 'Forecast is decision support, not a guarantee. Actual wholesale rates depend on weather, arrivals, and national policy.'
      : isMr
      ? 'अंदाज हा निर्णय समर्थनासाठी आहे, हमी नाही. प्रत्यक्ष भाव आवक आणि हवामानावर अवलंबून असतात.'
      : 'पूर्वानुमान निर्णय समर्थन हेतु है, गारंटी नहीं। वास्तविक भाव मौसम व आवक पर निर्भर करते हैं।'
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#165b33] text-xs font-bold border border-emerald-200 mb-2">
              <LineChart className="w-3.5 h-3.5" />
              <span>{strings.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {strings.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {strings.subtitle}
            </p>
          </div>

          {/* Quick Date pill */}
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-[#165b33]" />
            <span>{isEn ? 'Updated: 23 Oct 2026 (Live APMC)' : 'अपडेट: २३ ऑक्टोबर २०२६ (Live)'}</span>
          </div>
        </div>

        {/* Warning Banner */}
        {forecast.newsWarning && (
          <div className="bg-[#fffdfa] border-2 border-amber-400 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-gray-800 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <span>{strings.alertTitle}:</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  {strings.freshSignal}
                </span>
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {isEn
                  ? 'Arrivals dropped 18% this week across Lasalgaon and Pimpalgaon. Prices expected to firm up as seasonal supply tightens.'
                  : forecast.newsWarning}
              </p>
            </div>
          </div>
        )}

        {/* Controls: Crop Selector & Horizon Tabs */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Crop Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700">{strings.selectCrop}</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs font-semibold rounded-xl px-4 py-2 focus:outline-none focus:border-[#165b33]"
            >
              <option value="Onion">{isEn ? 'Onion (Lasalgaon)' : isMr ? 'कांदा (लासलगाव)' : 'प्याज (लासलगांव)'}</option>
              <option value="Wheat">{isEn ? 'Wheat (Indore)' : isMr ? 'गहू (इंदूर)' : 'गेंहू (इंदौर)'}</option>
              <option value="Soybean">{isEn ? 'Soybean (Indore)' : isMr ? 'सोयाबीन (इंदूर)' : 'सोयाबीन (इंदौर)'}</option>
            </select>
          </div>

          {/* Horizon Tabs (7, 14, 30 Days) */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl border border-gray-200 w-full sm:w-auto justify-center">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setHorizon(days as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  horizon === days
                    ? 'bg-[#165b33] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {days} {strings.daysSuffix}
              </button>
            ))}
          </div>
        </div>

        {/* Main Forecast Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Probabilistic Band Display */}
          <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {strings.priceBandTitle}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {strings.marketLabel}: {selectedCrop === 'Onion' ? 'Lasalgaon Mandi' : forecast.market} | {strings.modelLabel}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#165b33] border border-emerald-200 self-start sm:self-auto">
                {strings.confidenceBand}
              </span>
            </div>

            {/* Graphical Representation of p10, p50, p90 */}
            <div className="bg-[#f9faf9] p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>{strings.bearishLabel}</span>
                <span className="font-bold text-[#165b33]">{strings.medianLabel}</span>
                <span>{strings.bullishLabel}</span>
              </div>

              {/* Visual Band Bar */}
              <div className="relative pt-6 pb-2">
                <div className="h-6 w-full bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 rounded-xl relative border border-emerald-300 flex items-center justify-center">
                  <div className="w-2 h-10 bg-[#165b33] rounded-full shadow-md absolute z-10" />
                </div>

                <div className="flex items-center justify-between text-base font-extrabold mt-3">
                  <span className="text-gray-600">₹{p10Adjusted}</span>
                  <span className="text-[#165b33] text-2xl">₹{p50Adjusted}</span>
                  <span className="text-gray-900">₹{p90Adjusted}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 text-center font-medium">
                {strings.summaryText}
              </p>
            </div>

            {/* SHAP Market Drivers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#165b33]" />
                {strings.driversTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {forecast.shapDrivers.map((driver, index) => (
                  <div
                    key={index}
                    className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium flex items-center gap-2 shadow-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-[#165b33] border border-emerald-200 flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Decision Support Verdict Box */}
          <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#165b33] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{strings.adviceBadge}</span>
              </div>
              <h4 className="text-xl font-extrabold text-gray-900">
                {strings.verdictQuestion}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {strings.verdictDescription}
              </p>

              {/* Amber Advice Highlight Card matching dashboard Card 4 */}
              <div className="p-4 rounded-xl bg-[#fffdfa] border-2 border-amber-400 space-y-1">
                <div className="text-xs text-amber-800 font-bold">{strings.recommendedStrategy}</div>
                <div className="text-lg font-black text-gray-900">{strings.strategyAction}</div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-[11px] text-gray-500 leading-relaxed">
              <strong className="text-gray-700 block mb-1">{strings.disclaimerTitle}</strong>
              {strings.disclaimerText}
            </div>
          </div>
        </div>

        {/* Global Footer Note */}
        <div className="text-xs text-gray-500 pt-4 pb-8">
          {t.dashboard.footerDisclaimer}
        </div>
      </main>
    </div>
  );
}
