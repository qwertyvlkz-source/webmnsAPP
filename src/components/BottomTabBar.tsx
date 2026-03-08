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
    <nav className="flex items-end justify-around border-t border-border bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-2 pb-[env(safe-area-inset-bottom)] pt-1">
      {tabs.map((tab, i) => {
        const Icon = tab.icon;
        const isActive = active === i;
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(i)}
            className={`flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 ${
              tab.accent ? "relative -mt-3" : ""
            }`}
          >
            {tab.accent ? (
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${
                  isActive
                    ? "bg-primary shadow-primary/30"
                    : "bg-primary/80"
                }`}
              >
                <Icon size={24} className="text-primary-foreground" />
              </span>
            ) : (
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-primary/15" : ""}`}>
                <Icon
                  size={21}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
              </span>
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
    </nav>
  );
};

export default BottomTabBar;
