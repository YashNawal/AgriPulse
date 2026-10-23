'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { ChevronDown, X, Send } from 'lucide-react';
import {
  MOCK_PRODUCTS,
  MOCK_FERTILIZER_PLANS,
  Product,
  sharedApiClient
} from '@shared/index';

export default function StorePage() {
  const { t, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const [filterType, setFilterType] = useState<'all' | 'seed' | 'fertilizer'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');

  // Request Modal State
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const strings = {
    title: isEn ? 'Seeds and fertilizer' : isMr ? 'बियाणे आणि खते' : 'बीज और खाद',
    all: isEn ? 'All' : isMr ? 'सर्व' : 'सभी',
    seeds: isEn ? 'Seeds' : isMr ? 'बियाणे' : 'बीज',
    fertilizer: isEn ? 'Fertilizer' : isMr ? 'खत' : 'उर्वरक',
    cropLabel: isEn ? 'Crop: ' : isMr ? 'पीक: ' : 'फसल: ',
    photo: isEn ? 'Photo' : isMr ? 'फोटो' : 'फोटो',
    request: isEn ? 'Request' : isMr ? 'मागणी करा' : 'मांगें',
    scheduleTitle: isEn ? `Fertilizer schedule: ${selectedCrop}` : isMr ? `खताचे वेळापत्रक: ${selectedCrop}` : `खाद का कार्यक्रम: ${selectedCrop}`,
    approvedBadge: isEn ? 'Approved by agronomist' : isMr ? 'तज्ञांद्वारे मंजूर' : 'विशेषज्ञ द्वारा मंज़ूर',
    stage: isEn ? 'Stage' : isMr ? 'टप्पा' : 'स्टेज',
    fertHeader: isEn ? 'Fertilizer' : isMr ? 'खत' : 'खाद',
    amountHeader: isEn ? 'Amount per acre' : isMr ? 'मात्रा प्रति एकर' : 'मात्रा प्रति एकड़',
    atSowing: isEn ? 'At sowing' : isMr ? 'पेरणीच्या वेळी' : 'बुवाई के समय',
    days30: isEn ? '30 days' : isMr ? '३० दिवसांनी' : '30 दिन बाद',
    days60: isEn ? '60 days' : isMr ? '६० दिवसांनी' : '60 दिन बाद',
    adjustNotice: isEn
      ? 'Amounts adjust to your Soil Health Card values when you enter them.'
      : isMr
      ? 'माती परीक्षण अहवालानुसार (Soil Health Card) खतांची मात्रा आपोआप बदलेल.'
      : 'मिट्टी की जांच के मान से खुराक बदल सकती है।',
    talkExpert: isEn ? 'Talk to an expert' : isMr ? 'कृषी तज्ञांशी बोला' : 'विशेषज्ञ से बात करें',
    modalTitle: isEn ? 'Request Delivery from Local Depot' : isMr ? 'स्थानिक केंद्राकडे मागणी नोंदवा' : 'स्थानीय डिपो से मांग करें',
    nameLabel: isEn ? 'Your Name' : isMr ? 'आपले नाव' : 'आपका नाम',
    phoneLabel: isEn ? 'Mobile Number' : isMr ? 'मोबाईल नंबर' : 'मोबाइल नंबर',
    villageLabel: isEn ? 'Village' : isMr ? 'गाव' : 'गाँव',
    submitBtn: isEn ? 'Send Request' : isMr ? 'मागणी पाठवा' : 'अनुरोध भेजें'
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (filterType === 'seed' && p.category !== 'seed') return false;
    if (filterType === 'fertilizer' && p.category !== 'fertilizer') return false;
    return true;
  });

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const result = await sharedApiClient.submitProductRequest({
      productId: activeProduct.id,
      productName: activeProduct.name,
      crop: activeProduct.crop,
      quantity: orderQuantity,
      farmerName: farmerName || 'Farmer',
      farmerPhone: farmerPhone || '+91 98220 12345',
      village: farmerVillage || 'Lasalgaon',
      district: 'Nashik',
      notes: 'Direct from depot'
    });

    setRequestStatus(result.message);
    setTimeout(() => {
      setActiveProduct(null);
      setRequestStatus(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title Bar & Filter Pills matching Page 7 Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mr-2">
            {strings.title}
          </h1>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                filterType === 'all'
                  ? 'bg-[#165b33] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {strings.all}
            </button>

            <button
              onClick={() => setFilterType('seed')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                filterType === 'seed'
                  ? 'bg-[#165b33] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {strings.seeds}
            </button>

            <button
              onClick={() => setFilterType('fertilizer')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                filterType === 'fertilizer'
                  ? 'bg-[#165b33] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {strings.fertilizer}
            </button>

            {/* Crop Dropdown Pill */}
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="pl-3.5 pr-8 py-1.5 rounded-full bg-white border border-gray-300 text-xs font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#165b33] shadow-xs cursor-pointer"
              >
                <option value="Wheat">{strings.cropLabel}Wheat ▾</option>
                <option value="Onion">{strings.cropLabel}Onion ▾</option>
                <option value="Soybean">{strings.cropLabel}Soybean ▾</option>
                <option value="Cotton">{strings.cropLabel}Cotton ▾</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Layout matching Page 7 Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Product Cards Grid (Width ~7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                {/* Photo placeholder (clean light sage box from screenshot) */}
                <div className="w-full h-36 bg-[#e4ede6] rounded-xl flex items-center justify-center text-xs font-semibold text-[#165b33]">
                  {strings.photo}
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-gray-900 text-sm">
                    {prod.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {prod.packSize} · ₹{prod.price}
                  </div>
                </div>

                {/* Request Button */}
                <button
                  onClick={() => setActiveProduct(prod)}
                  className="w-full py-2 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  {strings.request}
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Fertilizer Schedule Sidebar Card matching Page 7 */}
          <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-gray-900 leading-snug">
                {strings.scheduleTitle}
              </h2>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-300 text-gray-600 shrink-0 text-center">
                {strings.approvedBadge}
              </span>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-semibold pb-2">
                  <th className="pb-2.5">{strings.stage}</th>
                  <th className="pb-2.5">{strings.fertHeader}</th>
                  <th className="pb-2.5">{strings.amountHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="py-2.5 font-medium">{strings.atSowing}</td>
                  <td className="py-2.5">[Name]</td>
                  <td className="py-2.5 text-gray-500">[Set by expert]</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">{strings.days30}</td>
                  <td className="py-2.5">[Name]</td>
                  <td className="py-2.5 text-gray-500">[Set by expert]</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">{strings.days60}</td>
                  <td className="py-2.5">[Name]</td>
                  <td className="py-2.5 text-gray-500">[Set by expert]</td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs text-gray-500 leading-relaxed">
              {strings.adjustNotice}
            </p>

            <Link
              href="/admin"
              className="inline-block px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs font-semibold text-gray-800 shadow-xs transition-colors"
            >
              {strings.talkExpert}
            </Link>
          </div>

        </div>

        {/* Product Request Modal */}
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-sm">{strings.modalTitle}</h3>
                <button onClick={() => setActiveProduct(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-gray-600">
                <strong className="text-gray-900 block">{activeProduct.name}</strong>
                {activeProduct.packSize} · ₹{activeProduct.price}
              </div>

              <form onSubmit={handleSendRequest} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">{strings.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#165b33]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">{strings.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#165b33]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">{strings.villageLabel}</label>
                  <input
                    type="text"
                    required
                    value={farmerVillage}
                    onChange={(e) => setFarmerVillage(e.target.value)}
                    placeholder="e.g. Lasalgaon"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#165b33]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  {strings.submitBtn}
                </button>

                {requestStatus && (
                  <div className="text-xs text-[#165b33] font-bold text-center bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    {requestStatus}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Global Footer Note */}
        <div className="text-xs text-gray-500 pt-4 pb-8">
          {t.dashboard.footerDisclaimer}
        </div>
      </main>
    </div>
  );
}
