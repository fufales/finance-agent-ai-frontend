import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

const LanguageContext = createContext();

const translations = {
  en,
  es
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }

    if (!value && language !== 'en') {
        // Fallback to English
        let fallbackValue = translations['en'];
        for (const k of keys) {
            fallbackValue = fallbackValue?.[k];
        }
        return fallbackValue || key;
    }

    return value || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
