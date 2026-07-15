import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import translations, { type Lang, langLabels } from "./translations";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  langLabel: string;
  cycleLang: () => void;
}

const LANG_STORAGE_KEY = "webmns_app_lang";
const LANG_ORDER: Lang[] = ["uk", "ru", "en", "pl", "de"];

function getInitialLang(): Lang {
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
  if (saved && LANG_ORDER.includes(saved)) return saved;

  // Try to detect from browser
  const browserLang = navigator.language.substring(0, 2).toLowerCase();
  const mapping: Record<string, Lang> = { uk: "uk", ru: "ru", en: "en", pl: "pl", de: "de" };
  return mapping[browserLang] || "uk";
}

const LangContext = createContext<LangContextType>({
  lang: "uk",
  setLang: () => {},
  t: (k) => k,
  langLabel: "UA",
  cycleLang: () => {},
});

export const useLang = () => useContext(LangContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_STORAGE_KEY, l);
  }, []);

  const cycleLang = useCallback(() => {
    const currentIndex = LANG_ORDER.indexOf(lang);
    const nextIndex = (currentIndex + 1) % LANG_ORDER.length;
    setLang(LANG_ORDER[nextIndex]);
  }, [lang, setLang]);

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? key,
    [lang]
  );

  const langLabel = langLabels[lang];

  // Persist on change
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, langLabel, cycleLang }}>
      {children}
    </LangContext.Provider>
  );
};
