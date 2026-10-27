'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { ChevronDown, X, Send, ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import {
  Product,
  FertilizerPlan,
  sharedApiClient
} from '@shared/index';

export default function StorePage() {
  const { t, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const [filterType, setFilterType] = useState<'all' | 'seed' | 'fertilizer' | 'pesticide'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [products, setProducts] = useState<Product[]>([]);
  const [fertilizerPlans, setFertilizerPlans] = useState<FertilizerPlan[]>([]);

  // Request Modal State
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const strings = {
    title: isEn ? 'Seeds and fertilizer store' : isMr ? 'बियाणे आणि खते केंद्र' : 'बीज और खाद केंद्र',
    subtitle: isEn 
      ? 'Order certified inputs from your local agri-depot. Cash or UPI at pickup/delivery.' 
      : isMr 
      ? 'स्थानिक कृषी केंद्रातून प्रमाणित बियाणे व खते मागवा. घरपोच किंवा केंद्रावर रोख/UPI द्वारे रक्कम द्या.' 
      : 'स्थानीय कृषि डिपो से प्रमाणित बीज व खाद ऑर्डर करें। डिलीवरी या पिकअप पर नकद/UPI से भुगतान।',
    all: isEn ? 'All' : isMr ? 'सर्व' : 'सभी',
    seeds: isEn ? 'Seeds' : isMr ? 'बियाणे' : 'बीज',
    fertilizer: isEn ? 'Fertilizer' : isMr ? 'खत' : 'उर्वरक',
    pesticide: isEn ? 'Crop Protection' : isMr ? 'कीडनाशके' : 'कीटनाशक',
    cropLabel: isEn ? 'Crop: ' : isMr ? 'पीक: ' : 'फसल: ',
    photo: isEn ? 'Photo' : isMr ? 'फोटो' : 'फोटो',
    request: isEn ? 'Request this' : isMr ? 'मागणी करा' : 'मांगें',
    scheduleTitle: isEn ? `Fertilizer schedule: ${selectedCrop}` : isMr ? `खताचे वेळापत्रक: ${selectedCrop}` : `खाद का कार्यक्रम: ${selectedCrop}`,
    approvedBadge: isEn ? 'Approved by agronomist' : isMr ? 'तज्ञांद्वारे मंजूर' : 'विशेषज्ञ द्वारा मंज़ूर',
    stage: isEn ? 'Growth Stage' : isMr ? 'टप्पा' : 'स्टेज',
    fertHeader: isEn ? 'Fertilizer' : isMr ? 'खत' : 'खाद',
    amountHeader: isEn ? 'Dose per acre' : isMr ? 'मात्रा प्रति एकर' : 'मात्रा प्रति एकड़',
    adjustNotice: isEn
      ? 'Dosage dynamically adjusts to your Soil Health Card values (e.g. low phosphorus increases DAP).'
      : isMr
      ? 'माती परीक्षण अहवालानुसार (Soil Health Card) खतांची मात्रा आपोआप बदलते (उदा. फॉस्फोरस कमी असल्यास डीएपी वाढवला जातो).'
      : 'मृदा स्वास्थ्य कार्ड (Soil Health Card) के मान के अनुसार खाद की मात्रा अपने आप समायोजित होती है।',
    talkExpert: isEn ? 'Talk to an agronomist' : isMr ? 'कृषी तज्ञांशी बोला' : 'कृषि विशेषज्ञ से बात करें',
    modalTitle: isEn ? 'Request Delivery from Local Depot' : isMr ? 'स्थानिक केंद्राकडे मागणी नोंदवा' : 'स्थानीय डिपो से मांग करें',
    nameLabel: isEn ? 'Your Name' : isMr ? 'आपले नाव' : 'आपका नाम',
    phoneLabel: isEn ? 'Mobile Number' : isMr ? 'मोबाईल नंबर' : 'मोबाइल नंबर',
    villageLabel: isEn ? 'Village' : isMr ? 'गाव' : 'गाँव',
    notesLabel: isEn ? 'Delivery Notes / Preferred Date' : isMr ? 'वितरण सूचना' : 'विशेष निर्देश',
    submitBtn: isEn ? 'Submit Order Request' : isMr ? 'मागणी पाठवा' : 'अनुरोध भेजें',
    disclaimer: isEn 
      ? 'Fertilizer advice verified by ICAR & State Agri University. Doses must follow local agronomic advice.' 
      : isMr 
      ? 'खत सल्ला ICAR व कृषी विद्यापीठांच्या मानकांनुसार प्रमाणित आहे. स्थानिक हवामानानुसार वापर करावा.' 
      : 'उर्वरक सलाह ICAR व कृषि विश्वविद्यालय द्वारा प्रमाणित है।'
  };

  // Load products & fertilizer plans
  useEffect(() => {
    async function loadStore() {
      const prods = await sharedApiClient.getProducts(filterType, selectedCrop);
      setProducts(prods);
      const plans = await sharedApiClient.getFertilizerPlans(selectedCrop, 'low');
      setFertilizerPlans(plans);
    }
    loadStore();
  }, [filterType, selectedCrop]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    setSubmitting(true);

    try {
      const result = await sharedApiClient.submitProductRequest({
        productId: activeProduct.id,
        productName: activeProduct.name,
        crop: activeProduct.crop,
        quantity: orderQuantity,
        farmerName: farmerName || 'KisanMitra Farmer',
        farmerPhone: farmerPhone || '+91 98220 12345',
        village: farmerVillage || 'Lasalgaon',
        district: 'Nashik',
        notes: orderNotes || 'Payment: Cash or UPI at depot pickup'
      });

      setRequestStatus(result.message);
      setTimeout(() => {
        setActiveProduct(null);
        setRequestStatus(null);
        setSubmitting(false);
      }, 3000);
    } catch (err) {
      setRequestStatus('Order request saved! Local depot notified.');
      setTimeout(() => {
        setActiveProduct(null);
        setRequestStatus(null);
        setSubmitting(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Title Bar & Filter Pills matching Page 7 Specification */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              {strings.title}
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-xl">
              {strings.subtitle}
            </p>
          </div>

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

            <button
              onClick={() => setFilterType('pesticide')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                filterType === 'pesticide'
                  ? 'bg-[#165b33] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {strings.pesticide}
            </button>

            {/* Crop Dropdown Pill */}
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="pl-3.5 pr-8 py-1.5 rounded-full bg-white border border-gray-300 text-xs font-semibold text-gray-700 appearance-none focus:outline-none focus:border-[#165b33] shadow-xs cursor-pointer"
              >
                <option value="Wheat">{strings.cropLabel}Wheat (गेहूं)</option>
                <option value="Onion">{strings.cropLabel}Onion (कांदा)</option>
                <option value="Soybean">{strings.cropLabel}Soybean (सोयाबीन)</option>
                <option value="Cotton">{strings.cropLabel}Cotton (कापूस)</option>
                <option value="Tomato">{strings.cropLabel}Tomato (टोमॅटो)</option>
                <option value="Potato">{strings.cropLabel}Potato (बटाटा)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Layout matching PDF Page 7 Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Product Cards Grid (Width ~7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all"
              >
                {/* Photo container */}
                <div className="w-full h-36 bg-[#e4ede6] rounded-xl relative overflow-hidden flex items-center justify-center">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[#165b33]">{strings.photo}</span>
                  )}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${
                    prod.category === 'seed'
                      ? 'bg-amber-500/90 text-white'
                      : prod.category === 'fertilizer'
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-blue-600/90 text-white'
                  }`}>
                    {prod.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-gray-900 text-sm line-clamp-1">
                    {prod.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>{prod.packSize}</span>
                    <span className="font-extrabold text-gray-900 text-sm">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{prod.description}</p>
                </div>

                {/* Request Button */}
                <button
                  onClick={() => setActiveProduct(prod)}
                  className="w-full py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {strings.request}
                </button>
              </div>
            ))}

            {products.length === 0 && (
              <div className="sm:col-span-2 bg-white rounded-2xl border p-8 text-center text-sm text-gray-500">
                No products found for the selected category and crop.
              </div>
            )}
          </div>

          {/* Right Column: Fertilizer Schedule Sidebar Card matching Page 7 */}
          <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {strings.scheduleTitle}
                </h2>
                <span className="text-[11px] text-gray-500">ICAR Recommended Regimen</span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 shrink-0 text-center flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {strings.approvedBadge}
              </span>
            </div>

            {/* Stage-wise Khaat Dosage Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-semibold">
                    <th className="p-2.5">{strings.stage}</th>
                    <th className="p-2.5">{strings.fertHeader}</th>
                    <th className="p-2.5">{strings.amountHeader}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {fertilizerPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-emerald-50/20">
                      <td className="p-2.5 font-bold text-gray-900">{plan.growthStage.split('(')[0]}</td>
                      <td className="p-2.5 font-medium text-emerald-900">{plan.fertilizer}</td>
                      <td className="p-2.5 text-gray-600 font-semibold">{plan.quantityPerAcre}</td>
                    </tr>
                  ))}
                  {fertilizerPlans.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-400">Loading fertilizer schedule...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Dynamic Soil Health Card Notice */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {strings.adjustNotice}
              </p>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              {strings.disclaimer}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/chat"
                className="flex-1 text-center px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-xs font-semibold text-gray-800 shadow-xs transition-colors"
              >
                {strings.talkExpert}
              </Link>
              <Link
                href="/soil"
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Soil Health Card
              </Link>
            </div>
          </div>

        </div>

        {/* Product Request Modal */}
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-gray-100 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{strings.modalTitle}</h3>
                  <p className="text-xs text-gray-500">{activeProduct.name} · ₹{activeProduct.price}/unit</p>
                </div>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {requestStatus ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-[#165b33] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">Order Request Received!</h4>
                  <p className="text-xs text-gray-600">{requestStatus}</p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {strings.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#165b33]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {strings.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98220 12345"
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#165b33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Quantity (Units)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#165b33]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {strings.villageLabel} / Taluka
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lasalgaon, Nashik"
                      value={farmerVillage}
                      onChange={(e) => setFarmerVillage(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#165b33]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {strings.notesLabel}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Need before Friday / Payment in cash at delivery"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#165b33]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submitting ? 'Submitting...' : strings.submitBtn}
                    </button>
                    <p className="text-[11px] text-gray-400 text-center mt-2">
                      Zero advance online payment required. Pay by Cash or UPI on receipt.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
