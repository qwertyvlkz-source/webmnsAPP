import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { fetchPortfolio, pickLocale, resolveImageUrl, type PortfolioItem } from "@/lib/portfolio";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

type Category = "all" | string;

const PortfolioScreen = () => {
  const { t, lang } = useLang();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category>("all");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPortfolio()
      .then((data) => {
        setItems(data);
        const cats = [...new Set(data.map((p) => p.category).filter(Boolean))] as string[];
        setCategories(cats);
      })
      .catch((error) => console.error("Failed to load portfolio:", error))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? items : items.filter((p) => p.category === filter);

  // Category label translations
  const getCategoryLabel = (cat: string): string => {
    const key = `portfolio.${cat.toLowerCase()}`;
    const translated = t(key);
    return translated !== key ? translated : cat;
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">{t("portfolio.loading")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">{t("portfolio.title")}</h1>
      </div>

      {/* Filter Chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setFilter("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {t("portfolio.all")}
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.93 }}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {getCategoryLabel(cat)}
          </motion.button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <AlertCircle size={32} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("portfolio.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(p)}
                  className="relative flex flex-col justify-end rounded-2xl overflow-hidden h-[140px] cursor-pointer shadow-sm"
                >
                  {resolveImageUrl(p.image) ? (
                    <img
                      src={resolveImageUrl(p.image)!}
                      alt={pickLocale(p.title, lang)}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative p-3">
                    <span className="text-sm font-bold text-white">{pickLocale(p.title, lang)}</span>
                    {p.category && (
                      <span className="block text-[10px] text-white/70">
                        {getCategoryLabel(p.category)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border-border p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="text-foreground">{pickLocale(selected?.title, lang)}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {pickLocale(selected?.description, lang) || (selected?.category && getCategoryLabel(selected.category))}
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-5">
            {selected && resolveImageUrl(selected.image) && (
              <div className="relative mb-4 rounded-2xl overflow-hidden">
                <img
                  src={resolveImageUrl(selected.image)!}
                  alt={pickLocale(selected.title, lang)}
                  className="w-full object-contain"
                />
              </div>
            )}
            {(selected?.technologies?.length || selected?.category) && (
              <>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  {t("portfolio.tech")}
                </p>
                <p className="mb-5 text-sm text-foreground">
                  {selected?.technologies?.length
                    ? selected.technologies.join(", ")
                    : selected?.category && getCategoryLabel(selected.category)}
                </p>
              </>
            )}
            <div className="flex gap-2">
              {selected?.url && (
                <motion.a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground"
                >
                  <ExternalLink size={14} />
                  {t("home.learnMore")}
                </motion.a>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                {t("portfolio.orderSimilar")}
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioScreen;
