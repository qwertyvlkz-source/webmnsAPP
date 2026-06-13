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
  const { t, langLabel, cycleLang } = useLang();

  return (
    <nav className="px-3 pb-[max(env(safe-area-inset-bottom),4px)] pt-0.5">
      <div className="flex items-center justify-around rounded-2xl bg-card/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-border/60 px-1 py-0">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => onTabChange(i)}
              className="relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 outline-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-tab-pill"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              {tab.accent ? (
                <motion.span
                  whileTap={{ scale: 0.85 }}
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                    isActive ? "bg-gradient-to-br from-primary to-accent shadow-primary/40" : "bg-primary shadow-primary/20"
                  }`}
                >
                  <Icon size={20} className="text-white" />
                </motion.span>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                  className="relative z-10 flex flex-col items-center gap-0.5"
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? "text-primary drop-shadow-[0_2px_4px_hsl(var(--primary)/0.3)]" : "text-muted-foreground/70"}
                  />
                  <span
                    className={`text-[9px] font-bold leading-none ${
                      isActive ? "text-primary" : "text-muted-foreground/70"
                    }`}
                  >
                    {t(tab.key)}
                  </span>
                </motion.div>
              )}
            </button>
          );
        })}
        {/* Language toggle — cycles through UK → RU → EN → PL → DE */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={cycleLang}
          className="flex min-w-[40px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5"
        >
          <Globe size={19} className="text-muted-foreground" />
          <span className="text-[9px] font-bold leading-none text-primary">
            {langLabel}
          </span>
        </motion.button>
      </div>
    </nav>
  );
};

export default BottomTabBar;
