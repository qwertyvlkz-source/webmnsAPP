import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Zap, Award, ShieldCheck, ArrowRight, Star, TrendingUp, Users, Code2, Bell, Moon, Sun } from "lucide-react";

const whyUsIcons = [Zap, Award, ShieldCheck];
const whyUsKeys = [
  { title: "home.fast", desc: "home.fast.desc" },
  { title: "home.exp", desc: "home.exp.desc" },
  { title: "home.quality", desc: "home.quality.desc" },
];

const latestProjects = [
  { title: "Visa Site", image: "/images/visa.png", descRu: "Сайт визовых заявок", descEn: "Visa application website" },
  { title: "FIX Service", image: "/images/fix.png", descRu: "Сайт ремонтного сервиса", descEn: "Repair service website" },
  { title: "SEO Agency", image: "/images/seo.png", descRu: "SEO и digital-маркетинг", descEn: "SEO & digital marketing" },
  { title: "Visa Site", image: "/images/visa.png", descRu: "Сайт визовых заявок", descEn: "Visa application website" },
  { title: "FIX Service", image: "/images/fix.png", descRu: "Сайт ремонтного сервиса", descEn: "Repair service website" },
  { title: "SEO Agency", image: "/images/seo.png", descRu: "SEO и digital-маркетинг", descEn: "SEO & digital marketing" },
];

const stats = [
  { icon: TrendingUp, value: "150+", key: "home.stat.projects" },
  { icon: Users, value: "120+", key: "home.stat.clients" },
  { icon: Star, value: "4.9", key: "home.stat.rating" },
  { icon: Code2, value: "7+", key: "home.stat.years" },
];

const HomeScreen = ({ onOpenPartner }: { onOpenPartner?: () => void }) => {
  const { t, lang } = useLang();

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {/* Hero with notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-2 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-accent/15 p-5"
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-accent/20 blur-2xl" />
        <div className="relative flex items-start justify-between">
          <h1 className="whitespace-pre-line text-xl font-bold leading-tight text-foreground flex-1">
            {t("home.hero")}
          </h1>
          <motion.button whileTap={{ scale: 0.9 }} className="relative ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card/80 shadow-sm">
            <Bell size={17} className="text-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card/80" />
          </motion.button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="relative mt-4 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
        >
          {t("home.cta")}
          <ArrowRight size={16} />
        </motion.button>
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
      <div className="grid grid-cols-2 gap-3 pb-2">
        {latestProjects.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex flex-col justify-end rounded-2xl overflow-hidden h-[140px] shadow-lg"
          >
            <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative p-3">
              <span className="text-sm font-bold text-white">{p.title}</span>
              <span className="block text-[10px] text-white/70">{lang === "ru" ? p.descRu : p.descEn}</span>
            </div>
          </motion.div>
        ))}
      </div>

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
