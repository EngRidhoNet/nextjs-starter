"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('lang') as Language | null;
    if (stored === 'en' || stored === 'ar') setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang]);

  const setLang = useCallback((newLang: Language) => setLangState(newLang), []);

  const t = useCallback((key: string) => key, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
