import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowLeft, Users, Gift, TrendingUp, Star, Copy, Check, DollarSign, UserPlus, Eye, ShoppingCart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const benefits = [
  { icon: Gift, titleKey: "partner.benefit1", descKey: "partner.benefit1.desc" },
  { icon: TrendingUp, titleKey: "partner.benefit2", descKey: "partner.benefit2.desc" },
  { icon: Star, titleKey: "partner.benefit3", descKey: "partner.benefit3.desc" },
];

const mockReferrals = [
  { name: "Иван К.", date: "05.03.2026", amount: "$150", status: "paid" },
  { name: "Мария С.", date: "01.03.2026", amount: "$300", status: "paid" },
  { name: "Алексей Д.", date: "28.02.2026", amount: "$0", status: "pending" },
  { name: "Ольга В.", date: "20.02.2026", amount: "$200", status: "paid" },
];

const PartnerScreen = ({ onBack }: { onBack: () => void }) => {
  const { t, lang } = useLang();
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  const refLink = "https://webmns.com/ref/partner123";

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success(lang === "ru" ? "Ссылка скопирована!" : "Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <ArrowLeft size={20} className="text-muted-foreground" />
        </motion.button>
        <h1 className="text-xl font-bold text-foreground">{t("home.partner")}</h1>
      </div>

      <AnimatePresence mode="wait">
        {!joined ? (
          <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
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
              onClick={() => setJoined(true)}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              {t("partner.join")}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: DollarSign, value: "$650", label: lang === "ru" ? "Заработано" : "Earned" },
                { icon: UserPlus, value: "4", label: lang === "ru" ? "Рефералов" : "Referrals" },
                { icon: Eye, value: "128", label: lang === "ru" ? "Переходов" : "Clicks" },
                { icon: ShoppingCart, value: "3", label: lang === "ru" ? "Заказов" : "Orders" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col items-center gap-1 rounded-2xl bg-card border border-border p-4"
                  >
                    <Icon size={18} className="text-primary" />
                    <span className="text-lg font-bold text-foreground">{s.value}</span>
                    <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Referral link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-card border border-border p-4 mb-4"
            >
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                {lang === "ru" ? "Ваша ссылка" : "Your Link"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground truncate">
                  {refLink}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Balance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-primary/30 bg-primary/10 p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  {lang === "ru" ? "Баланс" : "Balance"}
                </span>
                <span className="text-lg font-bold text-foreground">$650</span>
              </div>
              <Progress value={65} className="h-1.5 bg-secondary [&>div]:bg-primary" />
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {lang === "ru" ? "$650 из $1000 до бонуса" : "$650 of $1000 to bonus"}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
              >
                {lang === "ru" ? "Вывести средства" : "Withdraw"}
              </motion.button>
            </motion.div>

            {/* Referral history */}
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {lang === "ru" ? "История рефералов" : "Referral History"}
            </h3>
            <div className="flex flex-col gap-2 mb-4">
              {mockReferrals.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center justify-between rounded-xl bg-card border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{r.amount}</p>
                    <span className={`text-[10px] font-semibold ${r.status === "paid" ? "text-accent" : "text-warning"}`}>
                      {r.status === "paid"
                        ? lang === "ru" ? "Выплачено" : "Paid"
                        : lang === "ru" ? "Ожидание" : "Pending"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerScreen;
