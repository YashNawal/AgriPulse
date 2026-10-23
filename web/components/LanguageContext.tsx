'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations, Translations } from '@/lib/i18n';
import { SUPPORTED_LANGUAGES, LanguageMeta } from '@shared/types';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  languages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Check saved language
    const saved = localStorage.getItem('kisanmitra_lang') as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('kisanmitra_lang', newLocale);
  };

  const currentTranslations = translations[locale] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: currentTranslations,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
