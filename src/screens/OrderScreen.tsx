import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { CheckCircle, Globe, ShoppingCart, Building2, Sparkles, ArrowLeft, Smartphone, Apple } from "lucide-react";

const siteTypes = [
  { key: "order.landing", icon: Globe },
  { key: "order.ecommerce", icon: ShoppingCart },
  { key: "order.corporate", icon: Building2 },
  { key: "order.custom", icon: Sparkles },
  { key: "order.android", icon: Smartphone },
  { key: "order.ios", icon: Apple },
];

const budgetOptions = ["$500–$1k", "$1k–$3k", "$3k–$5k", "$5k+"];

const OrderScreen = () => {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const totalSteps = 3;

  const canNext =
    (step === 0 && type) ||
    (step === 1 && budget) ||
    (step === 2 && name && phone);

  const handleSubmit = () => setStep(3);

  const reset = () => {
    setStep(0);
    setType("");
    setBudget("");
    setUrgent(false);
    setName("");
    setPhone("");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden px-4 pt-4">
      {step < 3 && (
        <>
          <div className="mb-1 flex items-center gap-3">
            {step > 0 && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setStep(step - 1)}>
                <ArrowLeft size={20} className="text-muted-foreground" />
              </motion.button>
            )}
            <h1 className="text-xl font-bold text-foreground">{t("order.title")}</h1>
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} className="mb-5 h-1.5 bg-secondary [&>div]:bg-primary" />
        </>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex-1">
            <p className="mb-4 text-sm font-medium text-muted-foreground">{t("order.step1")}</p>
            <div className="grid grid-cols-2 gap-3">
              {siteTypes.map((s) => {
                const Icon = s.icon;
                const selected = type === s.key;
                return (
                  <motion.button
                    key={s.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setType(s.key)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-colors ${
                      selected ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <Icon size={28} className={selected ? "text-primary" : "text-muted-foreground"} />
                    <span className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                      {t(s.key)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex-1">
            <p className="mb-4 text-sm font-medium text-muted-foreground">{t("order.step2")}</p>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{t("order.budget")}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {budgetOptions.map((b) => (
                <motion.button
                  key={b}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setBudget(b)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                    budget === b ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {b}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-card border border-border p-4">
              <span className="text-sm font-medium text-foreground">{t("order.urgent")}</span>
              <Switch checked={urgent} onCheckedChange={setUrgent} />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex-1">
            <p className="mb-4 text-sm font-medium text-muted-foreground">{t("order.step3")}</p>
            <div className="flex flex-col gap-3">
              <Input
                placeholder={t("order.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border bg-card py-6 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder={t("order.phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-border bg-card py-6 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <CheckCircle size={72} className="text-accent" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">{t("order.success")}</h2>
            <p className="text-sm text-muted-foreground">{t("order.successDesc")}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="mt-4 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
            >
              {t("order.newOrder")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 3 && (
        <div className="pb-4 pt-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!canNext}
            onClick={() => (step === 2 ? handleSubmit() : setStep(step + 1))}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-opacity ${
              canNext
                ? "bg-primary text-primary-foreground"
                : "bg-primary/40 text-primary-foreground/50"
            }`}
          >
            {step === 2 ? t("order.submit") : t("order.next")}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default OrderScreen;
