import { Home, LayoutGrid, PlusCircle, User, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

interface Props {
  active: number;
  onTabChange: (i: number) => void;
}

const tabs = [
  { icon: Home, key: "nav.home" },
  { icon: LayoutGrid, key: "nav.portfolio" },
  { icon: PlusCircle, key: "nav.order", accent: true },
  { icon: User, key: "nav.profile" },
];

const BottomTabBar = ({ active, onTabChange }: Props) => {
  const { t, lang, setLang } = useLang();

  return (
    <nav className="px-3 pb-[max(env(safe-area-inset-bottom),6px)] pt-1">
      <div className="flex items-center justify-around rounded-2xl bg-card shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border px-1 py-0.5">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = active === i;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(i)}
              className="relative flex min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5"
            >
              {tab.accent ? (
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                    isActive ? "bg-primary shadow-primary/30" : "bg-primary/80"
                  }`}
                >
                  <Icon size={20} className="text-primary-foreground" />
                </span>
              ) : (
                <>
                  <Icon
                    size={19}
                    className={isActive ? "text-primary" : "text-muted-foreground"}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="tab-dot"
                      className="absolute -bottom-0 h-1 w-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </>
              )}
              <span
                className={`text-[9px] font-medium leading-none ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(tab.key)}
              </span>
            </motion.button>
          );
        })}
        {/* Language toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          className="flex min-w-[40px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5"
        >
          <Globe size={19} className="text-muted-foreground" />
          <span className="text-[9px] font-bold leading-none text-primary">
            {lang.toUpperCase()}
          </span>
        </motion.button>
      </div>
    </nav>
  );
};

export default BottomTabBar;
