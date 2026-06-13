import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { fetchPortfolio, pickLocale, resolveImageUrl, type PortfolioItem } from "@/lib/portfolio";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Zap, Award, ShieldCheck, ArrowRight, Star, TrendingUp, Users, Code2, Loader2, ExternalLink } from "lucide-react";
import HeroIllustration from "@/components/HeroIllustration";

const whyUsIcons = [Zap, Award, ShieldCheck];
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

  // Load latest projects from API
  useEffect(() => {
    fetchPortfolio()
      .then((data) => {
        // Show only the latest 9
        setLatestProjects(data.slice(0, 9));
      })
      .catch((error) => console.error("Failed to load portfolio:", error))
      .finally(() => setLoadingProjects(false));
  }, []);

  const renderHeroText = (text: string) => {
    // Parse <gradient> tags into styled spans
    const parts = text.split(/(<gradient>.*?<\/gradient>)/g);
    return parts.map((part, i) => {
      if (part.startsWith("<gradient>") && part.endsWith("</gradient>")) {
        const inner = part.slice(10, -11);
        return (
          <span key={i} className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {inner}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {/* Hero with notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-4 overflow-hidden rounded-[28px] bg-card/40 backdrop-blur-3xl p-6 shadow-2xl border border-border/50"
      >
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/40 blur-3xl" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-accent/30 blur-3xl" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay pointer-events-none" />

        <div className="relative flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="label-mono mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary tracking-widest"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
            {t("home.badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="whitespace-pre-line text-[32px] md:text-[38px] leading-[1.1] text-foreground font-['Calistoga',serif] tracking-tight"
          >
            {renderHeroText(t("home.hero"))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-3 text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed"
          >
            {t("home.hero.desc")}
          </motion.p>
        </div>

        {/* Hero illustration (monitor + gears + floating badges) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative mt-2"
        >
          <HeroIllustration />
        </motion.div>
        
        <div className="relative mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30"
          >
            {t("home.cta")}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-4 grid grid-cols-4 gap-3"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card/60 backdrop-blur-sm p-3 border border-border/60 shadow-sm"
            >
              <Icon size={18} className="text-accent drop-shadow-[0_2px_4px_hsl(var(--accent)/0.3)]" />
              <span className="text-[17px] font-black text-foreground tracking-tight">{s.value}</span>
              <span className="text-[9px] font-medium text-muted-foreground uppercase text-center leading-[1.1]">{t(s.key)}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Why Us */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-3 mt-6 flex items-center gap-2"
      >
        <span className="h-1 w-4 rounded-full bg-primary" />
        <h2 className="label-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{t("home.why")}</h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {whyUsKeys.map((item, i) => {
          const Icon = whyUsIcons[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-2 rounded-[20px] bg-card/60 backdrop-blur-sm p-4 border border-border/60 shadow-sm text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 shadow-inner">
                <Icon size={20} className="text-primary drop-shadow-[0_2px_4px_hsl(var(--primary)/0.3)]" />
              </div>
              <span className="text-[11px] font-bold text-foreground leading-tight">
                {t(item.title)}
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
              className="relative flex flex-col justify-end rounded-2xl overflow-hidden h-[140px] shadow-lg cursor-pointer"
            >
              {resolveImageUrl(p.image) ? (
                <img src={resolveImageUrl(p.image)!} alt={pickLocale(p.title, lang)} className="absolute inset-0 h-full w-full object-cover object-top" loading="lazy" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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

      {/* Services Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
