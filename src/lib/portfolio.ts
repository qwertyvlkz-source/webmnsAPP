import { api } from "@/lib/api";
import type { Lang } from "@/i18n/translations";

/** A field that may be a plain string or a localized map ({ en, ru, uk, ... }). */
export type Localized = string | Partial<Record<Lang, string>> | null;

export interface PortfolioItem {
  id: number;
  title: Localized;
  description: Localized;
  image: string | null;
  url: string | null;
  category: string | null;
  technologies: string[];
  client: string | null;
}

interface RawPortfolioItem {
  id: number;
  title?: Localized;
  description?: Localized;
  image?: string | null;
  images?: string[] | null;
  url?: string | null;
  link?: string | null;
  category?: string | null;
  technologies?: string[] | null;
  client?: string | null;
}

// The list endpoint currently returns [] even though items exist, so the
// by-id fallback probes this many ids before giving up.
const MAX_FALLBACK_IDS = 30;

function normalize(raw: RawPortfolioItem): PortfolioItem {
  const image =
    (Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : raw.image) ?? null;
  return {
    id: raw.id,
    title: raw.title ?? null,
    description: raw.description ?? null,
    image,
    url: raw.url ?? raw.link ?? null,
    category: raw.category ?? null,
    technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
    client: raw.client ?? null,
  };
}

/** Resolve a localized field to a string for the active language, with fallbacks. */
export function pickLocale(value: Localized | undefined, lang: Lang): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.uk || value.ru || Object.values(value)[0] || "";
}

/** Turn a relative image path from the API into an absolute URL. */
export function resolveImageUrl(image: string | null): string | null {
  if (!image) return null;
  return image.startsWith("http") ? image : `https://webmns.com${image}`;
}

async function loadPortfolio(): Promise<PortfolioItem[]> {
  // 1) Preferred: the list endpoint.
  try {
    const res = await api.get<{ success: boolean; data: RawPortfolioItem[] }>("/portfolio", {
      noAuth: true,
    });
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(normalize);
    }
  } catch (error) {
    console.error("Portfolio list request failed:", error);
  }

  // 2) Fallback: the list endpoint returned empty — assemble it from individual
  //    items (`/portfolio/:id`), which the backend does serve correctly.
  const ids = Array.from({ length: MAX_FALLBACK_IDS }, (_, i) => i + 1);
  const results = await Promise.allSettled(
    ids.map((id) =>
      api.get<{ success: boolean; data: RawPortfolioItem }>(`/portfolio/${id}`, { noAuth: true })
    )
  );

  return results
    .flatMap((r) =>
      r.status === "fulfilled" && r.value?.success && r.value.data && typeof r.value.data.id === "number"
        ? [normalize(r.value.data)]
        : []
    )
    .sort((a, b) => b.id - a.id);
}

let cache: Promise<PortfolioItem[]> | null = null;

/** Fetch the portfolio once per session (shared between Home and Portfolio screens). */
export function fetchPortfolio(force = false): Promise<PortfolioItem[]> {
  if (!cache || force) {
    cache = loadPortfolio().catch((error) => {
      cache = null; // allow retry on next call
      throw error;
    });
  }
  return cache;
}
