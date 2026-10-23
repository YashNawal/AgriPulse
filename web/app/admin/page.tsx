'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function AdminPage() {
  const { t } = useLanguage();

  const [activeSection, setActiveSection] = useState<'requests' | 'products' | 'plans' | 'questions' | 'stats'>('requests');
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySuccess(true);
    setTimeout(() => {
      setReplyText('');
      setReplySuccess(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] flex">
      
      {/* Left Sidebar matching Page 11 Screenshot */}
      <aside className="w-60 bg-[#165b33] text-white flex flex-col p-6 space-y-8 shrink-0 min-h-screen">
        <div className="text-xl font-bold tracking-tight text-white">
          KisanMitra Admin
        </div>

        <nav className="flex flex-col space-y-4 text-sm font-medium">
          <button
            onClick={() => setActiveSection('products')}
            className={`text-left transition-colors ${
              activeSection === 'products' ? 'text-white font-bold underline' : 'text-emerald-100/80 hover:text-white'
            }`}
          >
            Products
          </button>

          <button
            onClick={() => setActiveSection('plans')}
            className={`text-left transition-colors ${
              activeSection === 'plans' ? 'text-white font-bold underline' : 'text-emerald-100/80 hover:text-white'
            }`}
          >
            Fertilizer plans
          </button>

          <button
            onClick={() => setActiveSection('requests')}
            className={`text-left transition-colors ${
              activeSection === 'requests' ? 'text-white font-bold underline' : 'text-emerald-100/80 hover:text-white'
            }`}
          >
            Product requests
          </button>

          <button
            onClick={() => setActiveSection('questions')}
            className={`text-left transition-colors ${
              activeSection === 'questions' ? 'text-white font-bold underline' : 'text-emerald-100/80 hover:text-white'
            }`}
          >
            Expert questions
          </button>

          <button
            onClick={() => setActiveSection('stats')}
            className={`text-left transition-colors ${
              activeSection === 'stats' ? 'text-white font-bold underline' : 'text-emerald-100/80 hover:text-white'
            }`}
          >
            Statistics
          </button>
        </nav>
      </aside>

      {/* Right Content Area matching Page 11 Screenshot */}
      <main className="flex-1 p-8 space-y-6 max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Product requests
        </h1>

        {/* 3 Metric KPI Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-28">
            <span className="text-xs font-medium text-gray-500">New requests</span>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">[n]</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-28">
            <span className="text-xs font-medium text-gray-500">Open expert questions</span>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">[n]</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-28">
            <span className="text-xs font-medium text-gray-500">Messages today</span>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">[n]</span>
          </div>
        </div>

        {/* Table matching Page 11 Screenshot */}
        <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200/70 text-xs font-semibold text-gray-500">
              <tr>
                <th className="p-4">Farmer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Village</th>
                <th className="p-4">Language</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800 text-sm">
              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-medium">[Farmer name]</td>
                <td className="p-4">[Seed name] × [qty]</td>
                <td className="p-4 text-gray-600">[Village]</td>
                <td className="p-4 text-gray-600">Marathi</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fef3c7] text-[#92400e]">
                    New
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-medium">[Farmer name]</td>
                <td className="p-4">[Fertilizer name] × [qty]</td>
                <td className="p-4 text-gray-600">[Village]</td>
                <td className="p-4 text-gray-600">Hindi</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e0f2fe] text-[#0369a1]">
                    Contacted
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="p-4 font-medium">[Farmer name]</td>
                <td className="p-4">[Seed name] × [qty]</td>
                <td className="p-4 text-gray-600">[Village]</td>
                <td className="p-4 text-gray-600">Telugu</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#15803d]">
                    Delivered
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expert question Card matching Page 11 Screenshot */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Expert question
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Via WhatsApp · Language: Marathi · Auto-translated to English for you
            </p>
          </div>

          <div className="bg-[#f9faf9] p-3.5 rounded-xl border border-gray-200 text-sm text-gray-700">
            [Farmer's question appears here]
          </div>

          <form onSubmit={handleSendReply} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Your reply (sent in the farmer's language)
              </label>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter expert reply..."
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Send reply
              </button>

              {replySuccess && (
                <span className="text-xs text-[#165b33] font-semibold">
                  Reply sent successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
