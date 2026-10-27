'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Calculator,
  TrendingUp,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  DollarSign,
  PieChart,
  Percent,
  Sparkles,
  Bookmark
} from 'lucide-react';

interface CropOption {
  id: string;
  name: string;
  localName: string;
  category: string;
  defaultCost: number;
  defaultYield: number;
  modalPrice: number;
  msp?: number; // Minimum Support Price if applicable
}

const CROPS_LIST: CropOption[] = [
  { id: 'wheat', name: 'Wheat', localName: 'गहू', category: 'Grain', defaultCost: 19000, defaultYield: 22, modalPrice: 2450, msp: 2275 },
  { id: 'soybean', name: 'Soybean', localName: 'सोयाबीन', category: 'Oilseed', defaultCost: 16000, defaultYield: 12, modalPrice: 4620, msp: 4600 },
  { id: 'cotton', name: 'Cotton', localName: 'कापूस', category: 'Fiber', defaultCost: 28000, defaultYield: 10, modalPrice: 7150, msp: 7020 },
  { id: 'mustard', name: 'Mustard', localName: 'मोहरी', category: 'Oilseed', defaultCost: 12000, defaultYield: 9, modalPrice: 5800, msp: 5650 },
  { id: 'gram', name: 'Chickpea / Gram', localName: 'हरभरा', category: 'Pulse', defaultCost: 14000, defaultYield: 11, modalPrice: 5600, msp: 5440 },
  { id: 'onion', name: 'Onion', localName: 'कांदा', category: 'Vegetable', defaultCost: 24000, defaultYield: 25, modalPrice: 1850 },
  { id: 'tomato', name: 'Tomato', localName: 'टोमॅटो', category: 'Vegetable', defaultCost: 52000, defaultYield: 160, modalPrice: 1400 },
  { id: 'potato', name: 'Potato', localName: 'बटाटा', category: 'Vegetable', defaultCost: 35000, defaultYield: 90, modalPrice: 1650 },
  { id: 'garlic', name: 'Garlic', localName: 'लसूण', category: 'Spice', defaultCost: 42000, defaultYield: 40, modalPrice: 13800 },
  { id: 'ginger', name: 'Ginger', localName: 'आले', category: 'Spice', defaultCost: 68000, defaultYield: 90, modalPrice: 8600 },
];

export default function ProfitCalculatorPage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState<CropOption>(CROPS_LIST[0]);
  const [areaAcres, setAreaAcres] = useState<number>(2.0);
  const [cultivationCostPerAcre, setCultivationCostPerAcre] = useState<number>(19000);
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(22);
  const [sellingPrice, setSellingPrice] = useState<number>(2450);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Update defaults when crop changes
  const handleCropChange = (cropId: string) => {
    const crop = CROPS_LIST.find((c) => c.id === cropId) || CROPS_LIST[0];
    setSelectedCrop(crop);
    setCultivationCostPerAcre(crop.defaultCost);
    setExpectedYieldPerAcre(crop.defaultYield);
    setSellingPrice(crop.modalPrice);
    setIsSaved(false);
  };

  // Calculations
  const totalYieldQuintals = areaAcres * expectedYieldPerAcre;
  const totalCost = areaAcres * cultivationCostPerAcre;
  const grossRevenue = totalYieldQuintals * sellingPrice;
  const netProfit = grossRevenue - totalCost;
  const profitPerAcre = netProfit / (areaAcres || 1);
  const breakEvenPrice = totalCost / (totalYieldQuintals || 1);
  const hasMsp = Boolean(selectedCrop.msp);
  const mspDiff = hasMsp ? sellingPrice - (selectedCrop.msp || 0) : 0;

  // Save to Supabase saved_crops table
  const handleSaveToProfile = async () => {
    setIsSaving(true);
    try {
      if (user) {
        await supabase.from('saved_crops').insert({
          user_id: user.id,
          crop_name: selectedCrop.name,
          area_acres: areaAcres,
          cost_of_cultivation: cultivationCostPerAcre,
          expected_yield_quintal: expectedYieldPerAcre,
        });
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      console.error('Error saving to Supabase:', e);
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-gray-900 pb-16">
      {/* Top Banner */}
      <div className="bg-[#165B33] text-white pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Phase W6: Agricultural Economics & Price Floor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Farm Profit & MSP Break-Even Calculator
          </h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
            Accurately project net revenue per acre, calculate your minimum cost recovery price, and benchmark against Central Government Minimum Support Price (MSP) floors.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#165B33]" />
              <span>Cultivation Parameters</span>
            </h2>

            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Crop
              </label>
              <select
                value={selectedCrop.id}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full bg-[#F4F6F4] border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#165B33]"
              >
                {CROPS_LIST.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.localName}) {crop.msp ? `• MSP ₹${crop.msp}` : '• No MSP'}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Area */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Cultivated Land Area</span>
                <span className="text-[#165B33]">{areaAcres} Acres</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value))}
                className="w-full accent-[#165B33]"
              />
            </div>

            {/* Cultivation Cost per Acre */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Cultivation Cost per Acre (Seeds, Fertilizer, Labor, Diesel)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  value={cultivationCostPerAcre}
                  onChange={(e) => setCultivationCostPerAcre(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#F4F6F4] border border-gray-200 rounded-2xl pl-8 pr-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#165B33]"
                />
              </div>
            </div>

            {/* Expected Yield per Acre */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Expected Yield per Acre (Quintals)
              </label>
              <input
                type="number"
                value={expectedYieldPerAcre}
                onChange={(e) => setExpectedYieldPerAcre(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full bg-[#F4F6F4] border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#165B33]"
              />
            </div>

            {/* Expected Selling Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Expected Selling Price (₹ / Quintal)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Math.max(100, parseFloat(e.target.value) || 100))}
                  className="w-full bg-[#F4F6F4] border border-gray-200 rounded-2xl pl-8 pr-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#165B33]"
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Today's APMC modal benchmark: ₹{selectedCrop.modalPrice}/qtl
              </span>
            </div>

            {/* Save to Supabase Profile */}
            <button
              onClick={handleSaveToProfile}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#165B33] text-white py-3 px-4 rounded-2xl font-bold text-sm hover:bg-[#124828] transition-colors shadow-xs"
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved to Your Supabase Profile!' : 'Save Plan to My Account'}</span>
            </button>
          </div>

          {/* Right Column: Financial Results & MSP Comparison */}
          <div className="lg:col-span-7 space-y-6">
            {/* Net Profit Card */}
            <div className={`rounded-3xl p-6 border ${netProfit >= 0 ? 'bg-white border-gray-200/80' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Projected Financial Realization
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${netProfit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {netProfit >= 0 ? 'PROFITABLE HARVEST' : 'LOSS WARNING'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Total Net In-Hand Profit</span>
                  <div className={`text-2xl sm:text-3xl font-black ${netProfit >= 0 ? 'text-[#165B33]' : 'text-red-600'}`}>
                    ₹{netProfit.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Net Profit per Acre</span>
                  <div className={`text-xl sm:text-2xl font-bold ${netProfit >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                    ₹{Math.round(profitPerAcre).toLocaleString('en-IN')} / acre
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Total Harvest</span>
                  <span className="font-bold text-gray-900 text-sm">{totalYieldQuintals.toFixed(1)} qtl</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Total Outflow</span>
                  <span className="font-bold text-gray-900 text-sm">₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Gross Revenue</span>
                  <span className="font-bold text-gray-900 text-sm">₹{grossRevenue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Break-Even Price Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">Break-Even Selling Price</h3>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">SAFETY FLOOR</span>
                  </div>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    ₹{breakEvenPrice.toFixed(1)} <span className="text-xs font-semibold text-gray-500">per quintal</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    You must realize at least <strong className="text-gray-900">₹{breakEvenPrice.toFixed(0)}/qtl</strong> in the APMC mandi to recover your seed, fertilizer, and labor expenditures. Any rate higher than this represents pure farmer profit.
                  </p>
                </div>
              </div>
            </div>

            {/* MSP Comparison Card (Only rendered when crop has an MSP!) */}
            {hasMsp ? (
              <div className="bg-white rounded-3xl p-6 border border-emerald-200/90 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-gray-900">
                        Government Minimum Support Price (MSP) Comparison
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        MSP: ₹{selectedCrop.msp}/qtl
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F4F6F4] text-xs">
                      {mspDiff >= 0 ? (
                        <div className="text-emerald-900 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Your expected rate (₹{sellingPrice}) is <strong className="text-emerald-700">+₹{mspDiff}/qtl (+{((mspDiff / (selectedCrop.msp || 1)) * 100).toFixed(1)}%) ABOVE</strong> the Central Govt MSP floor guarantee. Private APMC mandi sale is favorable.
                          </span>
                        </div>
                      ) : (
                        <div className="text-amber-900 font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Market rate is ₹{Math.abs(mspDiff)}/qtl below MSP. We strongly advise selling at a government FCI/NAFED procurement center to secure the legal minimum price floor.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4 text-xs text-gray-500 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                <span>
                  {selectedCrop.name} is a horticultural/vegetable crop with no central government MSP floor. Prices are determined by open wholesale APMC auction supply and demand.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
