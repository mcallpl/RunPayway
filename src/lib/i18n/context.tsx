"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Translations } from "./types";
import { en } from "./en";
import { es } from "./es";
import { hi } from "./hi";
import { pt } from "./pt";

export type LangCode = "en" | "es" | "pt" | "hi";

const TRANSLATION_MAP: Record<string, Translations> = { en, es, hi, pt };

const LanguageContext = createContext<{
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: Translations;
}>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const stored = localStorage.getItem("rp_lang") as LangCode | null;
    if (stored && (stored === "en" || stored === "es" || stored === "pt" || stored === "hi")) {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    localStorage.setItem("rp_lang", code);
  }, []);

  const t = TRANSLATION_MAP[lang] || TRANSLATION_MAP["en"] || en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
