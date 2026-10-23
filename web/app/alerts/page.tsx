'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { Bell, Plus, Check, MessageSquare, Phone, ExternalLink, X } from 'lucide-react';

export default function AlertsPage() {
  const { t, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    title: isEn ? 'Price alerts' : isMr ? 'भाव अलर्ट्स' : 'मूल्य अलर्ट्स',
    subtitle: isEn
      ? 'We tell you when the price reaches your target'
      : isMr
      ? 'आपल्या पिकाचा भाव इच्छित पातळीवर पोहोचताच त्वरित सूचना मिळवा'
      : 'भाव आपके तय किए गए लक्ष्य पर पहुँचते ही तुरंत अलर्ट पाएँ',
    triggeredToday: isEn ? 'Triggered today' : isMr ? 'आज प्राप्त अलर्ट' : 'आज ट्रिगर हुआ',
    triggeredNotice: isEn
      ? 'Onion in Lasalgaon crossed ₹2,500 (sample)'
      : isMr
      ? 'लासलगावमध्ये कांद्याने ₹२,५०० चा भाव ओलांडला (नमुना)'
      : 'लासलगांव में प्याज ₹2,500 पार कर गया (नमूना)',
    onionAlertTitle: isEn ? 'Onion · Lasalgaon' : isMr ? 'कांदा · लासलगाव' : 'प्याज · लासलगांव',
    onionAlertDesc: isEn ? 'Tell me when above ₹2,500' : isMr ? 'भाव ₹२,५०० च्या वर गेल्यास कळवा' : 'भाव ₹2,500 से ऊपर होने पर बताएं',
    soybeanAlertTitle: isEn ? 'Soybean · Latur' : isMr ? 'सोयाबीन · लातूर' : 'सोयाबीन · लातूर',
    soybeanAlertDesc: isEn ? 'Tell me when below ₹4,000' : isMr ? 'भाव ₹४,००० च्या खाली आल्यास कळवा' : 'भाव ₹4,000 से नीचे होने पर बताएं',
    on: isEn ? 'On' : isMr ? 'सुरू' : 'चालू',
    paused: isEn ? 'Paused' : isMr ? 'थांबवले' : 'रोका हुआ',
    sendAlertsTo: isEn ? 'Send alerts to' : isMr ? 'सूचना येथे पाठवा' : 'अलर्ट यहाँ भेजें',
    appChannel: isEn ? 'App ✓' : isMr ? 'ॲप ✓' : 'ऐप ✓',
    waChannel: isEn ? 'WhatsApp ✓' : isMr ? 'व्हॉट्सॲप ✓' : 'व्हाट्सएप ✓',
    telegramChannel: isEn ? 'Telegram' : isMr ? 'टेलिग्राम' : 'टेलीग्राम',
    linkWaBtn: isEn ? 'Link WhatsApp number' : isMr ? 'व्हॉट्सॲप नंबर जोडा' : 'व्हाट्सएप नंबर लिंक करें',
    newAlertBtn: isEn ? '+ New alert' : isMr ? '+ नवीन अलर्ट जोडा' : '+ नया अलर्ट जोड़ें',
    modalTitle: isEn ? 'Create Price Alert' : isMr ? 'नवीन भाव अलर्ट तयार करा' : 'नया मूल्य अलर्ट बनाएं',
    cropLabel: isEn ? 'Crop' : isMr ? 'पीक' : 'फसल',
    marketLabel: isEn ? 'Market' : isMr ? 'बाजार समिती' : 'मंडी',
    targetPriceLabel: isEn ? 'Target Price (₹/quintal)' : isMr ? 'लक्ष्य भाव (₹/क्विंटल)' : 'लक्षित भाव (₹/क्विंटल)',
    conditionAbove: isEn ? 'When price rises above' : isMr ? 'भाव यापेक्षा जास्त झाल्यावर' : 'भाव इससे अधिक होने पर',
    conditionBelow: isEn ? 'When price drops below' : isMr ? 'भाव यापेक्षा खाली आल्यावर' : 'भाव इससे नीचे होने पर',
    saveAlert: isEn ? 'Set Alert' : isMr ? 'अलर्ट सुरू करा' : 'अलर्ट सेट करें'
  };

  const [onionOn, setOnionOn] = useState(true);
  const [soybeanOn, setSoybeanOn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCrop, setNewCrop] = useState('Cotton');
  const [newMarket, setNewMarket] = useState('Nagpur');
  const [newPrice, setNewPrice] = useState('7500');

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900">
      <main className="max-w-md mx-auto px-4 py-8 space-y-5">
        
        {/* Header matching Page 9 Screenshot */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {strings.title}
          </h1>
          <p className="text-xs text-gray-500">
            {strings.subtitle}
          </p>
        </div>

        {/* Triggered Today Card (Amber Border / Light Yellow BG from Page 9) */}
        <div className="bg-[#fffdfa] border-2 border-amber-400 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs font-bold text-amber-800 block">
            {strings.triggeredToday}
          </span>
          <p className="text-sm font-semibold text-gray-900">
            {strings.triggeredNotice}
          </p>
        </div>

        {/* Alert 1: Onion */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {strings.onionAlertTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {strings.onionAlertDesc}
            </p>
          </div>
          <button
            onClick={() => setOnionOn(!onionOn)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              onionOn
                ? 'bg-[#165b33] text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            {onionOn ? strings.on : strings.paused}
          </button>
        </div>

        {/* Alert 2: Soybean */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {strings.soybeanAlertTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {strings.soybeanAlertDesc}
            </p>
          </div>
          <button
            onClick={() => setSoybeanOn(!soybeanOn)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              soybeanOn
                ? 'bg-[#165b33] text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            {soybeanOn ? strings.on : strings.paused}
          </button>
        </div>

        {/* Section: Send alerts to */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900">
            {strings.sendAlertsTo}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-[#165b33] text-white text-xs font-semibold shadow-xs">
              {strings.appChannel}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#165b33] text-white text-xs font-semibold shadow-xs">
              {strings.waChannel}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white text-gray-600 border border-gray-300 text-xs font-semibold">
              {strings.telegramChannel}
            </span>
          </div>

          <Link
            href="/settings"
            className="block w-full py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs font-semibold text-gray-800 text-center transition-colors shadow-xs"
          >
            {strings.linkWaBtn}
          </Link>
        </div>

        {/* Bottom CTA Button: + New alert matching Page 9 */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>{strings.newAlertBtn}</span>
        </button>

        {/* Global Footer Note */}
        <div className="text-xs text-gray-500 pt-3 text-center">
          {t.dashboard.footerDisclaimer}
        </div>
      </main>

      {/* New Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">{strings.modalTitle}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-600 mb-1 font-medium">{strings.cropLabel}</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#165b33]"
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Onion">Onion</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">{strings.marketLabel}</label>
                <input
                  type="text"
                  value={newMarket}
                  onChange={(e) => setNewMarket(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">{strings.targetPriceLabel}</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs shadow-xs transition-colors"
              >
                {strings.saveAlert}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
