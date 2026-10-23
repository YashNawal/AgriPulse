'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export function Footer() {
  const { t, languages, setLocale, locale } = useLanguage();

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200 py-10 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#165b33]">AgriPulse</span>
            <span className="text-xs px-1.5 py-0.5 font-semibold text-emerald-800 bg-emerald-100 rounded">किसानमित्र</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{t.tagline}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href="/prices" className="text-gray-600 hover:text-gray-900">{t.nav.prices}</Link>
            <span className="text-gray-300">•</span>
            <Link href="/forecast" className="text-gray-600 hover:text-gray-900">{t.nav.forecast}</Link>
            <span className="text-gray-300">•</span>
            <Link href="/markets" className="text-gray-600 hover:text-gray-900">{t.nav.markets}</Link>
            <span className="text-gray-300">•</span>
            <Link href="/soil" className="text-gray-600 hover:text-gray-900">{t.nav.soil}</Link>
            <span className="text-gray-300">•</span>
            <Link href="/store" className="text-gray-600 hover:text-gray-900">{t.nav.store}</Link>
            <span className="text-gray-300">•</span>
            <Link href="/chat" className="text-gray-600 hover:text-gray-900">{t.nav.chat}</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-gray-400 text-[11px] gap-2">
          <div>
            {locale === 'en'
              ? 'Forecast is decision support, not a guarantee. All data sourced from verified agronomist research.'
              : 'पूर्वानुमान केवल निर्णय सहायता है, कोई गारंटी नहीं। ICAR मानकों पर आधारित।'}
          </div>
          <div>
            AgriPulse (किसानमित्र) © 2026 — Open Agriculture Public Good
          </div>
        </div>
      </div>
    </footer>
  );
}
