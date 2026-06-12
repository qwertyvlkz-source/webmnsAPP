import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { ChevronDown, HelpCircle, Globe, ShoppingCart, Smartphone, Clock, CreditCard, Users } from "lucide-react";

interface FAQItem {
  icon: typeof Globe;
  questionKey: string;
  answerKey: string;
}

const faqItems: FAQItem[] = [
  {
    icon: Globe,
    questionKey: "faq.q1",
    answerKey: "faq.a1",
  },
  {
    icon: Clock,
    questionKey: "faq.q2",
    answerKey: "faq.a2",
  },
  {
    icon: CreditCard,
    questionKey: "faq.q3",
    answerKey: "faq.a3",
  },
  {
    icon: ShoppingCart,
    questionKey: "faq.q4",
    answerKey: "faq.a4",
  },
  {
    icon: Smartphone,
    questionKey: "faq.q5",
    answerKey: "faq.a5",
  },
  {
    icon: Users,
    questionKey: "faq.q6",
    answerKey: "faq.a6",
  },
];

const FAQScreen = () => {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <HelpCircle size={20} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t("faq.title")}</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{t("faq.subtitle")}</p>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {faqItems.map((item, i) => {
          const Icon = item.icon;
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mt-2"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Icon size={16} className="text-primary" />
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">{t(item.questionKey)}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-muted-foreground" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                  {t(item.answerKey)}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQScreen;
