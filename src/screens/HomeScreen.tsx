import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Zap, Award, ShieldCheck, ArrowRight } from "lucide-react";

const whyUsIcons = [Zap, Award, ShieldCheck];
const whyUsKeys = [
  { title: "home.fast", desc: "home.fast.desc" },
  { title: "home.exp", desc: "home.exp.desc" },
  { title: "home.quality", desc: "home.quality.desc" },
];

const latestProjects = [
  { title: "FitLife", color: "from-indigo-600 to-cyan-500" },
  { title: "ShopMax", color: "from-emerald-600 to-teal-400" },
  { title: "TechCore", color: "from-violet-600 to-fuchsia-500" },
  { title: "EduPro", color: "from-amber-500 to-orange-500" },
];

const HomeScreen = () => {
  const { t } = useLang();

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 p-5"
      >
        <h1 className="whitespace-pre-line text-xl font-bold leading-tight text-foreground">
          {t("home.hero")}
        </h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          {t("home.cta")}
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>

      {/* Why Us */}
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("home.why")}
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {whyUsKeys.map((item, i) => {
          const Icon = whyUsIcons[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex min-w-[140px] flex-col gap-2 rounded-2xl bg-card p-4 border border-border"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Icon size={20} className="text-primary" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {t(item.title)}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(item.desc)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Latest Projects */}
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("home.latest")}
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {latestProjects.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            className={`flex min-w-[200px] flex-col justify-end rounded-2xl bg-gradient-to-br ${p.color} p-4 h-[140px]`}
          >
            <span className="text-lg font-bold text-white">{p.title}</span>
            <span className="text-xs text-white/70">webmns.dev</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
