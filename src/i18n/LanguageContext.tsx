import React, { createContext, useContext, useState, useCallback } from "react";
import translations, { type Lang } from "./translations";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "ru",
  setLang: () => {},
  t: (k) => k,
});

export const useLang = () => useContext(LangContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("ru");
  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? key,
    [lang]
  );
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
