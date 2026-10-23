'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthContext';
import { useLanguage } from '@/components/LanguageContext';
import { Locale } from '@/lib/i18n';
import {
  Sprout,
  Globe,
  MapPin,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Layers,
  Sparkles
} from 'lucide-react';
import { MOCK_COMMODITIES } from '@shared/index';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const { languages, setLocale, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    step: isEn ? 'Step' : isMr ? 'टप्पा' : 'कदम',
    of: isEn ? 'of' : isMr ? 'पैकी' : 'में से',
    step1Title: isEn ? 'Language Selection' : isMr ? 'मातृभाषा निवड' : 'मातृभाषा चयन',
    step2Title: isEn ? 'Farm Location' : isMr ? 'शेतीचे स्थान' : 'स्थान व जिला',
    step3Title: isEn ? 'Crops & Land' : isMr ? 'पिके व क्षेत्र' : 'खेत व फसलें',
    langHeading: isEn ? 'Select Your Preferred Language' : isMr ? 'आपली पसंतीची भाषा निवडा' : 'अपनी पसंदीदा भाषा चुनें',
    langSub: isEn
      ? 'KisanMitra will display mandi prices, forecasts, and answer queries in your chosen language.'
      : isMr
      ? 'किसानमित्र आपल्या निवडलेल्या भाषेत बोलेल आणि बाजारभाव दाखवेल.'
      : 'किसानमित्र आपकी चुनी हुई भाषा में बोलेगा, लिखेगा और मंडी भाव दिखाएगा।',
    locHeading: isEn ? 'Enter Your Farm / Mandi Region' : isMr ? 'आपल्या शेतीचे / बाजार समितीचे क्षेत्र' : 'अपना खेत / मंडी क्षेत्र दर्ज करें',
    locSub: isEn
      ? 'Used to compute transport freight, nearest mandi rankings, and local weather advisories.'
      : isMr
      ? 'जवळच्या बाजार समितीचे भाव व वाहतूक खर्च काढण्यासाठी आवश्यक.'
      : 'नजदीकी मंडी के भाव, परिवहन भाड़ा एवं मौसम चेतावनी के लिए आवश्यक।',
    gpsBtn: isEn ? 'Detect Current GPS Location' : isMr ? 'GPS द्वारे थेट स्थान मिळवा' : 'GPS स्थान प्राप्त करें',
    gpsDetecting: isEn ? 'Detecting location...' : isMr ? 'स्थान शोधत आहे...' : 'स्थान खोजा जा रहा है...',
    stateLabel: isEn ? 'State' : isMr ? 'राज्य' : 'राज्य',
    districtLabel: isEn ? 'District' : isMr ? 'जिल्हा' : 'जिला',
    villageLabel: isEn ? 'Village / Tehsil' : isMr ? 'गाव / तालुका' : 'गाँव / तहसील',
    cropsHeading: isEn ? 'Select Crops & Farm Size' : isMr ? 'पिके व शेतीचे क्षेत्र निवडा' : 'फसलें एवं खेत का रकबा',
    cropsSub: isEn
      ? 'Used for customized growth-stage fertilizer schedules and harvest advice.'
      : isMr
      ? 'खत वेळापत्रक व विक्री सल्ल्यासाठी आवश्यक.'
      : 'संतुलित खाद शेड्यूल व विक्रय सलाह के लिए आवश्यक।',
    landLabel: isEn ? 'Total Farm Land (Acres)' : isMr ? 'एकूण शेती क्षेत्र (एकर)' : 'कुल जमीन का रकबा (एकड़)',
    cropsLabel: isEn ? 'Select the crops you grow:' : isMr ? 'आपण घेत असलेली पिके निवडा:' : 'उगाई जाने वाली फसलें चुनें:',
    finishBtn: isEn ? 'Finish Setup & Open Dashboard' : isMr ? 'तयार! डॅशबोर्डवर जा' : 'सेटअप पूरा करें व डॅशबोर्ड खोलें',
    nextBtn: isEn ? 'Next Step' : isMr ? 'पुढील टप्पा' : 'अगला कदम',
    prevBtn: isEn ? 'Back' : isMr ? 'मागे' : 'पीछे'
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<Locale>(locale || 'en');
  const [stateName, setStateName] = useState(profile?.state || 'Maharashtra');
  const [districtName, setDistrictName] = useState(profile?.district || 'Nashik');
  const [villageName, setVillageName] = useState(profile?.village || 'Lasalgaon');
  const [landSize, setLandSize] = useState(profile?.land_size_acres || 2.5);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Onion']);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat?: number; lon?: number }>({});
  const [submitting, setSubmitting] = useState(false);

  const toggleCrop = (cropName: string) => {
    setSelectedCrops(prev =>
      prev.includes(cropName)
        ? prev.filter(c => c !== cropName)
        : [...prev, cropName]
    );
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported in browser. Please enter district manually.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGpsLoading(false);
        setStateName('Maharashtra');
        setDistrictName('Nashik');
      },
      (err) => {
        setGpsLoading(false);
        console.warn('GPS error:', err);
      }
    );
  };

  const handleFinishOnboarding = async () => {
    setSubmitting(true);
    try {
      if (user) {
        // 1. Update Profile in Supabase
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: profile?.full_name || user.user_metadata?.full_name || (isEn ? 'Farmer' : 'किसान भाई'),
          phone: profile?.phone || user.user_metadata?.phone || null,
          language: selectedLang,
          state: stateName,
          district: districtName,
          village: villageName,
          land_size_acres: landSize,
          latitude: coordinates.lat || 20.1485,
          longitude: coordinates.lon || 74.2255,
          updated_at: new Date().toISOString(),
        });

        await refreshProfile();
      }

      setLocale(selectedLang);
      router.push('/');
    } catch (err: any) {
      console.error('Onboarding save error:', err);
      router.push('/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{strings.step} {step} {strings.of} 3</span>
            <span className="text-[#165b33]">
              {step === 1 ? strings.step1Title : step === 2 ? strings.step2Title : strings.step3Title}
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="bg-[#165b33] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: LANGUAGE SELECTION (Exact match to PDF Page 8) */}
        {step === 1 && (
          <div className="space-y-6 pt-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                KisanMitra
              </h1>
              <p className="text-base sm:text-lg font-bold text-gray-800">
                अपनी भाषा चुनें · Choose your language
              </p>
            </div>

            {/* 2-Column Grid matching PDF Page 8 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { code: 'mr', name: 'मराठी' },
                { code: 'hi', name: 'हिन्दी' },
                { code: 'en', name: 'English' },
                { code: 'gu', name: 'ગુજરાતી' },
                { code: 'ta', name: 'தமிழ்' },
                { code: 'te', name: 'తెలుగు' },
                { code: 'kn', name: 'ಕನ್ನಡ' },
                { code: 'bn', name: 'বাংলা' },
                { code: 'pa', name: 'ਪੰਜਾਬੀ' },
                { code: 'ml', name: 'മലയാളം' },
              ].map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code as Locale)}
                    className={`h-14 px-4 rounded-2xl border text-base font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#165b33] border-[#165b33] text-white shadow-sm'
                        : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <span className="ml-1.5 font-black">✓</span>}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-gray-500 text-center font-medium">
              You can change the language any time in Settings.
            </p>

            <button
              onClick={() => { setLocale(selectedLang); setStep(2); }}
              className="w-full py-3.5 rounded-2xl bg-[#165b33] hover:bg-[#124828] text-white font-extrabold text-sm shadow-xs flex items-center justify-center gap-2 transition-all mt-4"
            >
              <span>{selectedLang === 'mr' ? 'पुढे · Next' : selectedLang === 'hi' ? 'आगे बढ़ें · Next' : 'Next'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: LOCATION & DISTRICT */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#165b33] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {strings.locHeading}
              </h2>
              <p className="text-xs text-gray-500">
                {strings.locSub}
              </p>
            </div>

            {/* GPS Detection Button */}
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={gpsLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Compass className={`w-4 h-4 text-[#165b33] ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? strings.gpsDetecting : strings.gpsBtn}</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.districtLabel}</label>
                <input
                  type="text"
                  required
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  placeholder="e.g. Nashik"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-xs">{strings.villageLabel}</label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="e.g. Lasalgaon"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{strings.prevBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{strings.nextBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CROPS & LAND SIZE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#165b33] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <Sprout className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {strings.cropsHeading}
              </h2>
              <p className="text-xs text-gray-500">
                {strings.cropsSub}
              </p>
            </div>

            <div className="text-xs">
              <label className="block text-gray-700 font-semibold mb-1">{strings.landLabel}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-xs">{strings.cropsLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOCK_COMMODITIES.map((c) => {
                  const isSelected = selectedCrops.includes(c.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCrop(c.name)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-[#165b33] text-[#165b33] shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{isEn ? c.name : c.localNames?.mr || c.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#165b33]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{strings.prevBtn}</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleFinishOnboarding}
                className="w-2/3 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <span>{submitting ? '...' : strings.finishBtn}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
