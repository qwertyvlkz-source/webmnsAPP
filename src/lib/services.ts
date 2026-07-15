import type { Lang } from "@/i18n/translations";
import { api } from "@/lib/api";

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
}

interface ServicesResponse {
  success: boolean;
  services: Service[];
}

const polishFallbacks: Record<number, { name: string; features: string[] }> = {
  1: { name: "Landing page", features: ["Responsywny design", "Do 5 sekcji", "Podstawowe SEO", "Formularz kontaktowy", "Termin: 5–7 dni"] },
  2: { name: "Strona firmowa", features: ["Unikalny design", "Do 15 stron", "CMS WordPress", "Optymalizacja SEO", "Termin: 7–10 dni"] },
  3: { name: "Sklep internetowy", features: ["Pełny e-commerce", "Nieograniczona liczba produktów", "Systemy płatności", "Integracja CRM", "Termin: 14 dni"] },
  4: { name: "Aplikacja Android", features: ["Natywna aplikacja Android", "Publikacja w Google Play", "Nowoczesny UI/UX", "Powiadomienia push", "Termin: 30–60 dni"] },
  5: { name: "Blog", features: ["Indywidualny design", "Konfiguracja CMS", "Optymalizacja SEO", "Wersja mobilna", "1 miesiąc wsparcia"] },
  6: { name: "Strona portfolio", features: ["Integracja galerii", "Formularz kontaktowy", "Szybkie ładowanie", "Wersja mobilna", "1 miesiąc wsparcia"] },
  7: { name: "Aplikacja iPhone (iOS)", features: ["Natywna aplikacja iOS", "Publikacja w App Store", "Powiadomienia push", "Integracja API", "3 miesiące wsparcia"] },
  8: { name: "Aplikacja webowa (SaaS / MVP)", features: ["Logika biznesowa", "Architektura bazy danych", "Tworzenie API", "Panele użytkowników", "6 miesięcy wsparcia"] },
  9: { name: "Redesign strony", features: ["Audyt UX/UI", "Nowoczesny UI", "Optymalizacja mobilna", "Wyższa konwersja"] },
};

export function parseLocalizedValue(value: string | null | undefined, lang: Lang): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    if (parsed && typeof parsed === "object") {
      const localized = parsed[lang] ?? parsed.en ?? parsed.uk ?? Object.values(parsed)[0];
      return typeof localized === "string" ? localized : value;
    }
  } catch {
    // The API also accepts plain strings.
  }
  return value;
}

export function getServiceName(service: Service, lang: Lang): string {
  if (lang === "pl" && polishFallbacks[service.id]) return polishFallbacks[service.id].name;
  return parseLocalizedValue(service.name, lang);
}

export function getServiceFeatures(service: Service, lang: Lang): string[] {
  if (lang === "pl" && polishFallbacks[service.id]) return polishFallbacks[service.id].features;
  return parseLocalizedValue(service.description, lang)
    .split(/\r?\n/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

export async function fetchServices(): Promise<Service[]> {
  const data = await api.get<ServicesResponse>("/services", { noAuth: true });
  if (!data.success || !Array.isArray(data.services)) throw new Error("Invalid services response");
  return data.services;
}

export function formatServicePrice(price: Service["price"]): string {
  return Number(price).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatApproximateUah(price: Service["price"], lang: Lang): string {
  const locales: Record<Lang, string> = { uk: "uk-UA", ru: "ru-RU", en: "en-US", pl: "pl-PL", de: "de-DE" };
  return new Intl.NumberFormat(locales[lang], { maximumFractionDigits: 1 }).format(Number(price) * 41.7);
}

export const isStartingPrice = (serviceId: number) => [3, 4, 7, 8].includes(serviceId);
export const isPopularService = (serviceId: number) => serviceId === 2;
