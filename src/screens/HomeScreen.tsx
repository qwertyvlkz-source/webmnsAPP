import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { fetchPortfolio, pickLocale, resolveImageUrl, type PortfolioItem } from "@/lib/portfolio";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Zap, Award, ShieldCheck, ArrowRight, ArrowUpRight, Star, TrendingUp, Users, Code2, Loader2, ExternalLink, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const whyUsIcons = [Zap, Award, ShieldCheck];

const testimonials = [
  { name: "Andrii K.", role: "home.review1.role", text: "home.review1.text" },
  { name: "Maria L.", role: "home.review2.role", text: "home.review2.text" },
  { name: "Pavel S.", role: "home.review3.role", text: "home.review3.text" },
];
const whyUsKeys = [
  { title: "home.fast", desc: "home.fast.desc" },
  { title: "home.exp", desc: "home.exp.desc" },
  { title: "home.quality", desc: "home.quality.desc" },
];

const stats = [
  { icon: TrendingUp, value: "150+", key: "home.stat.projects" },
  { icon: Users, value: "120+", key: "home.stat.clients" },
  { icon: Star, value: "4.9", key: "home.stat.rating" },
  { icon: Code2, value: "7+", key: "home.stat.years" },
];

const HomeScreen = ({ onOpenPartner }: { onOpenPartner?: () => void }) => {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [latestProjects, setLatestProjects] = useState<PortfolioItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDir, setHeroDir] = useState(0); // -1 left, 1 right

  // Load latest projects from API
  useEffect(() => {
    fetchPortfolio()
      .then((data) => setLatestProjects(data.slice(0, 9)))
      .catch((error) => console.error("Failed to load portfolio:", error))
      .finally(() => setLoadingProjects(false));
  }, []);

  const heroProject = latestProjects[heroIndex] ?? null;
  const heroImage = resolveImageUrl(heroProject?.image ?? null);

  const heroNext = useCallback(() => {
    if (latestProjects.length <= 1) return;
    setHeroDir(1);
    setHeroIndex((prev) => (prev + 1) % latestProjects.length);
  }, [latestProjects.length]);

  const heroPrev = useCallback(() => {
    if (latestProjects.length <= 1) return;
    setHeroDir(-1);
    setHeroIndex((prev) => (prev - 1 + latestProjects.length) % latestProjects.length);
  }, [latestProjects.length]);

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {/* Hero with notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-4 overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-2xl p-6 shadow-xl shadow-primary/5"
      >
        {/* Soft static background accents (no motion) */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="label-mono mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("home.badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="whitespace-pre-line text-[28px] leading-[1.1] text-foreground"
          >
            {t("home.hero")}
          </motion.h1>
        </div>

        {/* Featured-project carousel with navigation arrows */}
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
          <AnimatePresence initial={false} custom={heroDir} mode="popLayout">
            <motion.div
              key={heroIndex}
              custom={heroDir}
              initial={{ opacity: 0, x: heroDir > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: heroDir > 0 ? -80 : 80 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={pickLocale(heroProject?.title, lang) || t("home.badge")}
                  className="h-36 w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/10">
                  <Code2 size={26} className="text-primary/50" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Project title overlay */}
          {heroProject && (
            <div className="absolute bottom-2 left-3 right-14 z-10">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {pickLocale(heroProject.title, lang)}
              </span>
            </div>
          )}

          {/* Navigation arrows */}
          {latestProjects.length > 1 && (
            <>
              <button
                onClick={heroPrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={heroNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {latestProjects.length > 1 && (
            <div className="absolute bottom-2 right-3 z-10 flex gap-1">
              {latestProjects.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="cta-shine relative flex min-h-[48px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30"
          >
            {t("home.cta")}
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 grid grid-cols-4 gap-3"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-1 rounded-xl bg-card p-3 border border-border transition-shadow hover:shadow-md hover:shadow-primary/10"
            >
              <Icon size={16} className="text-accent" />
              <span className="text-base font-bold text-foreground">{s.value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{t(s.key)}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Why Us */}
      <div className="mb-3 mt-6 flex items-center gap-2">
        <span className="h-1 w-4 rounded-full bg-primary" />
        <h2 className="label-mono text-[11px] font-medium text-muted-foreground">{t("home.why")}</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {whyUsKeys.map((item, i) => {
          const Icon = whyUsIcons[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 border border-border text-center transition-shadow hover:shadow-md hover:shadow-primary/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/15">
                <Icon size={18} className="text-primary" />
              </span>
              <span className="text-xs font-semibold text-foreground leading-tight">
                {t(item.title)}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {t(item.desc)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Partner Program */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-5 rounded-2xl border border-primary/30 bg-primary/10 p-4"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20">
            <Users size={16} className="text-primary" />
          </span>
          <h3 className="text-sm font-bold text-foreground">{t("home.partner")}</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{t("home.partner.desc")}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPartner}
          className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {t("home.learnMore")}
        </motion.button>
      </motion.div>

      {/* Latest Projects */}
      <div className="mb-3 mt-7 flex items-center gap-2">
        <span className="h-1 w-4 rounded-full bg-primary" />
        <h2 className="label-mono text-[11px] font-medium text-muted-foreground">{t("home.latest")}</h2>
      </div>

      {loadingProjects ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-primary" />
        </div>
      ) : latestProjects.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">{t("portfolio.empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-2">
          {latestProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(p)}
              className="group relative flex flex-col justify-end rounded-2xl overflow-hidden h-[140px] shadow-lg cursor-pointer"
            >
              {resolveImageUrl(p.image) ? (
                <img src={resolveImageUrl(p.image)!} alt={pickLocale(p.title, lang)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" loading="lazy" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight size={14} />
              </span>
              <div className="relative p-3">
                <span className="text-sm font-bold text-white">{pickLocale(p.title, lang)}</span>
                {p.category && (
                  <span className="block text-[10px] text-white/70">{p.category}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border-border p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="text-foreground">{pickLocale(selected?.title, lang)}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {pickLocale(selected?.description, lang) || selected?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-5">
            {selected && resolveImageUrl(selected.image) && (
              <div className="relative mb-4 rounded-2xl overflow-hidden">
                <img src={resolveImageUrl(selected.image)!} alt={pickLocale(selected.title, lang)} className="w-full object-contain" />
              </div>
            )}
            {(selected?.technologies?.length || selected?.category) && (
              <>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  {t("portfolio.tech")}
                </p>
                <p className="mb-5 text-sm text-foreground">
                  {selected?.technologies?.length ? selected.technologies.join(", ") : selected?.category}
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

      {/* Client Reviews (social proof before final CTA) */}
      <div className="mb-3 mt-7 flex items-center gap-2">
        <span className="h-1 w-4 rounded-full bg-primary" />
        <h2 className="label-mono text-[11px] font-medium text-muted-foreground">{t("home.reviews")}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 snap-x snap-mandatory">
        {testimonials.map((r, i) => (
          <Reveal
            key={i}
            delay={i * 0.08}
            className="min-w-[78%] snap-start sm:min-w-[260px]"
          >
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
              <Quote size={18} className="mb-2 text-primary/60" />
              <p className="flex-1 text-xs leading-relaxed text-foreground">{t(r.text)}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-primary-foreground">
                  {r.name.charAt(0)}
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t(r.role)}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={10} className="fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Services Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ease: "easeOut" }}
        className="mt-5 mb-2 rounded-2xl border border-border bg-gradient-to-r from-card to-secondary p-4"
      >
        <h3 className="text-sm font-bold text-foreground mb-1">{t("home.services")}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{t("home.servicesDesc")}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {t("home.learnMore")}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
