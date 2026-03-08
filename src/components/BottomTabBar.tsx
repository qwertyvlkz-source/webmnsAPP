import { Home, LayoutGrid, PlusCircle, User } from "lucide-react";
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
  const { t } = useLang();

  return (
    <nav className="px-3 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
      <div className="flex items-center justify-around rounded-2xl bg-card shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border px-1 py-1">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = active === i;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(i)}
              className="relative flex min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2"
            >
              {tab.accent ? (
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md ${
                    isActive
                      ? "bg-primary shadow-primary/30"
                      : "bg-primary/80"
                  }`}
                >
                  <Icon size={22} className="text-primary-foreground" />
                </span>
              ) : (
                <>
                  <Icon
                    size={20}
                    className={isActive ? "text-primary" : "text-muted-foreground"}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="tab-dot"
                      className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </>
              )}
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(tab.key)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
