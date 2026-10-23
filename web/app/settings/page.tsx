'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthContext';
import { useLanguage } from '@/components/LanguageContext';
import { Locale } from '@/lib/i18n';
import {
  User,
  Settings,
  Globe,
  MapPin,
  Sprout,
  Phone,
  MessageCircle,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save
} from 'lucide-react';
import { sharedApiClient } from '@shared/client';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { languages, setLocale, locale, t } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    badge: isEn ? 'Farmer Profile & Sync' : isMr ? 'शेतकरी प्रोफाइल व खाते' : 'किसान प्रोफाइल व सेटिंग्स',
    title: isEn ? 'Farmer Settings & WhatsApp Sync' : isMr ? 'खाते माहिती व व्हॉट्सॲप जोडणी' : 'खाता व सेटिंग्स',
    subtitle: isEn
      ? 'Manage your preferred language, farm land size, village location, and link your 24x7 WhatsApp advisory bot.'
      : isMr
      ? 'आपली भाषा, शेतीचे क्षेत्र, गाव निवडा आणि २४x७ व्हॉट्सॲप सेवेशी खाते जोडा.'
      : 'भाषा, जमीन का रकबा, जिला व 24x7 व्हाट्सएप बॉट लिंक कोड प्रबंधित करें।',
    personalInfoTitle: isEn ? 'Personal Information' : isMr ? 'वैयक्तिक माहिती' : 'व्यक्तिगत जानकारी',
    fullNameLabel: isEn ? 'Full Name' : isMr ? 'पूर्ण नाव' : 'पूरा नाम',
    phoneLabel: isEn ? 'Mobile Number (WhatsApp)' : isMr ? 'मोबाईल नंबर (व्हॉट्सॲप)' : 'मोबाइल नंबर (व्हाट्सएप)',
    preferredLangLabel: isEn ? 'Primary App & Advisory Language' : isMr ? 'ॲप व सल्लागाराची भाषा' : 'प्राथमिक भाषा',
    locationTitle: isEn ? 'Farm Location & Land Details' : isMr ? 'शेतीचे स्थान व क्षेत्रफळ' : 'स्थान व खेत का रकबा',
    stateLabel: isEn ? 'State' : isMr ? 'राज्य' : 'राज्य',
    districtLabel: isEn ? 'District' : isMr ? 'जिल्हा' : 'जिला',
    villageLabel: isEn ? 'Village' : isMr ? 'गाव' : 'गाँव',
    landSizeLabel: isEn ? 'Total Farm Land Size (Acres)' : isMr ? 'एकूण शेती क्षेत्र (एकर)' : 'कुल जमीन का रकबा (एकड़)',
    saveBtn: isEn ? 'Save Profile Changes' : isMr ? 'बदल जतन करा' : 'जानकारी सहेजें',
    savedNotice: isEn ? 'Profile updated successfully!' : isMr ? 'माहिती यशस्वीरित्या अद्यतनित झाली!' : 'प्रोफाइल जानकारी सफलतापूर्वक अद्यतन की गई!',
    waCardTitle: isEn ? 'Link 24x7 WhatsApp Advisory Bot' : isMr ? '२४x७ व्हॉट्सॲप बॉट लिंक करा' : '24x7 व्हाट्सएप बॉट से लिंक करें',
    waCardDesc: isEn
      ? 'Receive morning APMC mandi rates, 14-day price predictions, and send voice questions directly on WhatsApp.'
      : isMr
      ? 'दररोज सकाळी थेट व्हॉट्सॲपवर बाजारभाव व भाव अंदाज मिळवा, आणि बोलून प्रश्न विचारा.'
      : 'रोज सुबह के ताजा मंडी भाव, 14 दिनों के भाव अनुमान व व्हाट्सएप पर सीधे बोलकर प्रश्न पूछें।',
    generateCodeBtn: isEn ? 'Generate 10-Min Link Code' : isMr ? '१०-मिनिट लिंक कोड मिळवा' : '10-मिनट लिंक कोड जनरेट करें',
    validNotice: isEn ? 'Valid for 10 minutes. Click below to launch WhatsApp:' : isMr ? '१० मिनिटे वैध. व्हॉट्सॲप सुरू करण्यासाठी खाली क्लिक करा:' : '10 मिनट के लिए मान्य। नीचे क्लिक करके व्हाट्सएप खोलें:',
    openWaBtn: isEn ? 'Open WhatsApp Chat' : isMr ? 'व्हॉट्सॲप उघडा' : 'व्हाट्सएप चैट खोलें',
    signOutBtn: isEn ? 'Sign Out of KisanMitra' : isMr ? 'लॉगआउट करा' : 'लॉगआउट करें'
  };

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [selectedLang, setSelectedLang] = useState<Locale>(locale);
  const [stateName, setStateName] = useState(profile?.state || 'Maharashtra');
  const [districtName, setDistrictName] = useState(profile?.district || 'Nashik');
  const [villageName, setVillageName] = useState(profile?.village || '');
  const [landSize, setLandSize] = useState(profile?.land_size_acres || 2.5);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // WhatsApp Linking code
  const [linkData, setLinkData] = useState<{ code: string; waLink: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setStateName(profile.state || 'Maharashtra');
      setDistrictName(profile.district || 'Nashik');
      setVillageName(profile.village || '');
      setLandSize(profile.land_size_acres || 2.5);
    }
  }, [profile]);

  const handleGenerateLinkCode = () => {
    const data = sharedApiClient.generateLinkCode();
    setLinkData(data);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    try {
      if (user) {
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
          phone: phone || null,
          language: selectedLang,
          state: stateName,
          district: districtName,
          village: villageName,
          land_size_acres: landSize,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
        await refreshProfile();
      }

      setLocale(selectedLang);
      setSaveMessage(strings.savedNotice);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage('Error: ' + (err.message || 'Could not save.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-gray-200/80 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#165b33] text-xs font-bold border border-emerald-200 mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>{strings.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {strings.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {strings.subtitle}
          </p>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Card 1: Personal Info */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#165b33]" />
              <span>{strings.personalInfoTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.fullNameLabel}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.phoneLabel}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">{strings.preferredLangLabel}</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code as Locale)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedLang === lang.code
                        ? 'bg-emerald-50 border-[#165b33] text-[#165b33] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-xs">{lang.name}</div>
                    <div className="text-[10px] text-gray-400">{lang.nativeName}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Location & Farm Details */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#165b33]" />
              <span>{strings.locationTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.stateLabel}</label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                >
                  <option value="Maharashtra">{isEn ? 'Maharashtra' : 'महाराष्ट्र'}</option>
                  <option value="Madhya Pradesh">{isEn ? 'Madhya Pradesh' : 'मध्य प्रदेश'}</option>
                  <option value="Gujarat">{isEn ? 'Gujarat' : 'गुजरात'}</option>
                  <option value="Rajasthan">{isEn ? 'Rajasthan' : 'राजस्थान'}</option>
                  <option value="Punjab">{isEn ? 'Punjab' : 'पंजाब'}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.districtLabel}</label>
                <input
                  type="text"
                  required
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.villageLabel}</label>
                <input
                  type="text"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="e.g. Lasalgaon"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>
            </div>

            <div className="max-w-xs text-xs">
              <label className="block text-gray-700 font-semibold mb-1">{strings.landSizeLabel}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{strings.saveBtn}</span>
            </button>

            {saveMessage && (
              <span className="text-xs text-[#165b33] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveMessage}</span>
              </span>
            )}
          </div>
        </form>

        {/* Card 3: WhatsApp Bot Linking */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <MessageCircle className="w-5 h-5 text-[#165b33]" />
            <h3 className="text-base font-bold text-gray-900">{strings.waCardTitle}</h3>
          </div>
          <p className="text-xs text-gray-500">
            {strings.waCardDesc}
          </p>

          {!linkData ? (
            <button
              onClick={handleGenerateLinkCode}
              className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#165b33] font-bold text-xs border border-gray-300 shadow-xs transition-all flex items-center gap-2"
            >
              <span>{strings.generateCodeBtn}</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-[#165b33]">
                LINK CODE: <span className="text-lg font-black tracking-widest">{linkData.code}</span>
              </div>
              <p className="text-gray-600">
                {strings.validNotice}
              </p>
              <a
                href={linkData.waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#165b33] text-white font-bold text-xs shadow-xs hover:bg-[#124828] transition-all"
              >
                <span>{strings.openWaBtn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Sign Out Card */}
        {user && (
          <div className="pt-2">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{strings.signOutBtn}</span>
            </button>
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
