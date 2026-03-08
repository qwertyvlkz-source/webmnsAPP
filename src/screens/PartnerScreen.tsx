import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowLeft, Users, Gift, TrendingUp, Star } from "lucide-react";

const benefits = [
  { icon: Gift, titleKey: "partner.benefit1", descKey: "partner.benefit1.desc" },
  { icon: TrendingUp, titleKey: "partner.benefit2", descKey: "partner.benefit2.desc" },
  { icon: Star, titleKey: "partner.benefit3", descKey: "partner.benefit3.desc" },
];

const PartnerScreen = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLang();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <ArrowLeft size={20} className="text-muted-foreground" />
        </motion.button>
        <h1 className="text-xl font-bold text-foreground">{t("home.partner")}</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-6 mb-5"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
          <Users size={28} className="text-primary" />
        </span>
        <h2 className="text-lg font-bold text-foreground text-center">{t("partner.headline")}</h2>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">{t("partner.intro")}</p>
      </motion.div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("partner.benefits")}
      </h3>

      <div className="flex flex-col gap-3 mb-5">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 rounded-2xl bg-card border border-border p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Icon size={18} className="text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t(b.titleKey)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(b.descKey)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("partner.how")}
      </h3>

      <div className="flex flex-col gap-2 mb-5">
        {["partner.step1", "partner.step2", "partner.step3"].map((key, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-card border border-border p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-sm text-foreground">{t(key)}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
      >
        {t("partner.join")}
      </motion.button>
    </div>
  );
};

export default PartnerScreen;
