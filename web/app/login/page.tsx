'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthContext';
import { useLanguage } from '@/components/LanguageContext';
import {
  Sprout,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { t, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    signInTab: isEn ? 'Sign In' : isMr ? 'लॉगिन करा' : 'लॉगिन',
    signUpTab: isEn ? 'New Account' : isMr ? 'नवीन खाते' : 'नया खाता',
    signInTitle: isEn ? 'Welcome to KisanMitra' : isMr ? 'किसानमित्रमध्ये आपले स्वागत' : 'किसानमित्र में लॉगिन करें',
    signUpTitle: isEn ? 'Create Farmer Account' : isMr ? 'नवीन शेतकरी खाते तयार करा' : 'नया किसान खाता बनाएं',
    signInSub: isEn
      ? 'Access live Mandi rates, ICAR fertilizer plans & 24x7 WhatsApp advisory.'
      : isMr
      ? 'बाजारभाव, खत वेळापत्रक आणि व्हॉट्सॲप सेवेचा लाभ घ्या.'
      : 'मंडी भाव, खाद अनुसूची और व्हाट्सएप अलर्ट देखें।',
    signUpSub: isEn
      ? 'Join 100% free digital public good platform for farmers.'
      : isMr
      ? '१००% मोफत डिजिटल शेतकरी सेवेचा लाभ घ्या.'
      : '100% निःशुल्क डिजिटल किसान सेवा से तुरंत जुड़ें।',
    fullNameLabel: isEn ? 'Full Name' : isMr ? 'पूर्ण नाव' : 'पूरा नाम',
    fullNamePlaceholder: isEn ? 'e.g. Ramesh Patil' : isMr ? 'उदा. रमेश पाटील' : 'उदा. रमेश पटेल',
    phoneLabel: isEn ? 'Mobile Number (WhatsApp)' : isMr ? 'मोबाईल नंबर (व्हॉट्सॲप)' : 'मोबाइल नंबर (व्हाट्सएप)',
    phonePlaceholder: isEn ? '+91 98220 12345' : isMr ? '+९१ ९८२२० १२३४५' : '+91 98261 44521',
    emailLabel: isEn ? 'Email Address' : isMr ? 'ईमेल पत्ता' : 'ईमेल पता',
    emailPlaceholder: isEn ? 'farmer@example.com' : 'kisan@example.com',
    passwordLabel: isEn ? 'Password' : isMr ? 'पासवर्ड' : 'पासवर्ड',
    passwordPlaceholder: isEn ? 'At least 6 characters' : isMr ? 'किमान ६ अक्षरे' : 'कम से कम 6 अक्षर',
    signInBtn: isEn ? 'Sign In to Dashboard' : isMr ? 'डॅशबोर्डवर जा' : 'लॉगिन करें',
    signUpBtn: isEn ? 'Create Account & Continue' : isMr ? 'खाते तयार करा' : 'खाता बनाएं',
    googleBtn: isEn ? '1-Click Sign in with Google' : isMr ? 'Google द्वारे १-क्लिक लॉगिन' : 'Google द्वारा 1-क्लिक में लॉगिन',
    orDivider: isEn ? 'Or continue with email' : isMr ? 'किंवा ईमेलने सुरू ठेवा' : 'अथवा ईमेल से आगे बढ़ें',
    successSignIn: isEn ? 'Login successful! Redirecting...' : isMr ? 'लॉगिन यशस्वी! सुरू करत आहोत...' : 'लॉगिन सफल! मुख्य पृष्ठ पर जा रहे हैं...',
    successSignUp: isEn ? 'Account created successfully! Proceeding to setup...' : isMr ? 'खाते तयार झाले! ऑनबोर्डिंग सुरू करत आहोत...' : 'खाता बन गया! ऑनबोर्डिंग की ओर जा रहे हैं...',
    trustFootnote: isEn ? '100% Secure & Private • Backed by Supabase Auth' : isMr ? '१००% सुरक्षित व खाजगी • Supabase Auth सुरक्षित' : '100% सुरक्षित व निजी'
  };

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (profile && profile.state && profile.district) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
          },
        });

        if (error) throw error;

        // Create initial row in profiles table
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName || (isEn ? 'Farmer' : 'किसान भाई'),
            phone: phone || null,
            language: locale,
          });
        }

        setSuccessMessage(strings.successSignUp);
        setTimeout(() => router.push('/onboarding'), 1500);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setSuccessMessage(strings.successSignIn);
        setTimeout(() => router.push('/'), 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f4f6f4] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white border border-gray-200/80 p-8 rounded-2xl shadow-xs">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#165b33] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {mode === 'signin' ? strings.signInTitle : strings.signUpTitle}
          </h2>
          <p className="text-xs text-gray-500">
            {mode === 'signin' ? strings.signInSub : strings.signUpSub}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-[#165b33] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {strings.signInTab}
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-[#165b33] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {strings.signUpTab}
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#165b33] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#165b33] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.fullNameLabel}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={strings.fullNamePlaceholder}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{strings.phoneLabel}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={strings.phonePlaceholder}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-1">{strings.emailLabel}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={strings.emailPlaceholder}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">{strings.passwordLabel}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={strings.passwordPlaceholder}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{mode === 'signin' ? strings.signInBtn : strings.signUpBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-gray-400 absolute">
            {strings.orDivider}
          </span>
        </div>

        {/* 1-Click Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold flex items-center justify-center gap-3 shadow-xs transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{strings.googleBtn}</span>
        </button>

        {/* Security badge footer */}
        <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#165b33]" />
          <span>{strings.trustFootnote}</span>
        </div>
      </div>
    </div>
  );
}
