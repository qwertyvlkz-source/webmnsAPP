import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Zap, Award, ShieldCheck, ArrowRight, Star, TrendingUp, Users, Code2, Bell, Moon, Sun, Loader2, ExternalLink } from "lucide-react";

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

interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  url: string | null;
  category: string | null;
}

const HomeScreen = ({ onOpenPartner }: { onOpenPartner?: () => void }) => {
  const { t } = useLang();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [latestProjects, setLatestProjects] = useState<PortfolioItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Load latest projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get<{ success: boolean; data: PortfolioItem[] }>("/portfolio", { noAuth: true });
        if (data.success && data.data) {
          // Show only the latest 4
          setLatestProjects(data.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const getImageUrl = (image: string | null) => {
    if (!image) return null;
    return image.startsWith("http") ? image : `https://webmns.com${image}`;
  };

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {/* Hero with notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-4 overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-2xl p-6 shadow-xl shadow-primary/5"
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

        <div className="relative flex items-start justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="whitespace-pre-line text-2xl font-extrabold leading-tight text-foreground flex-1 tracking-tight"
          >
            {t("home.hero")}
          </motion.h1>
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            className="relative ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm border border-border/50"
          >
            <Bell size={18} className="text-foreground" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
          </motion.button>
        </div>
        
        <div className="relative mt-6 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30"
          >
            {t("home.cta")}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => setDark(!dark)} 
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm border border-border/50"
          >
            {dark ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
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
            <div key={i} className="flex flex-col items-center gap-1 rounded-xl bg-card p-3 border border-border">
              <Icon size={16} className="text-accent" />
              <span className="text-base font-bold text-foreground">{s.value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{t(s.key)}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Why Us */}
      <h2 className="mb-3 mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("home.why")}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {whyUsKeys.map((item, i) => {
          const Icon = whyUsIcons[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 border border-border text-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                <Icon size={18} className="text-primary" />
              </span>
              <span className="text-xs font-semibold text-foreground leading-tight">
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
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("home.latest")}
      </h2>

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
              {getImageUrl(p.image) ? (
                <img src={getImageUrl(p.image)!} alt={p.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative p-3">
                <span className="text-sm font-bold text-white">{p.title}</span>
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
            <DialogTitle className="text-foreground">{selected?.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selected?.description || selected?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-5">
            {selected && getImageUrl(selected.image) && (
              <div className="relative mb-4 rounded-2xl overflow-hidden">
                <img src={getImageUrl(selected.image)!} alt={selected.title} className="w-full object-contain" />
              </div>
            )}
            {selected?.category && (
              <>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  {t("portfolio.tech")}
                </p>
                <p className="mb-5 text-sm text-foreground">{selected.category}</p>
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
