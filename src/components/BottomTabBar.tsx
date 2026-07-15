import { useState, useRef, useEffect } from "react";
import { Home, LayoutGrid, PlusCircle, User, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";

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

const haptic = () => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(10);
};

const langOptions = [
  { id: "uk" as Lang, label: "🇺🇦 UA" },
  { id: "en" as Lang, label: "🇬🇧 EN" },
  { id: "pl" as Lang, label: "🇵🇱 PL" },
  { id: "de" as Lang, label: "🇩🇪 DE" },
  { id: "ru" as Lang, label: "🇷🇺 RU" },
];

const BottomTabBar = ({ active, onTabChange }: Props) => {
  const { t, langLabel, lang, setLang } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!showLangMenu) return;
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLangMenu]);

  return (
    <nav className="relative z-20 px-3 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5">
      <div className="flex items-center justify-around rounded-[1.35rem] border border-white/60 bg-card/85 px-1 py-0 shadow-[0_12px_36px_rgba(71,48,145,0.16)] backdrop-blur-2xl dark:border-white/10">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = active === i;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => { haptic(); onTabChange(i); }}
              aria-label={t(tab.key)}
              aria-current={isActive ? "page" : undefined}
              className="relative flex min-h-[44px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5"
            >
              {isActive && !tab.accent && (
                <motion.span
                  layoutId="tab-bg"
                  className="absolute inset-x-1 inset-y-1 z-0 rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.accent ? (
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                    isActive ? "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-blue-500 shadow-violet-500/35" : "bg-gradient-to-br from-violet-500 to-blue-500 shadow-violet-500/20"
                  }`}
                >
                  <Icon size={20} className="text-primary-foreground" />
                </span>
              ) : (
                <>
                  <Icon
                    size={19}
                    className={`relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`}
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
                className={`relative z-10 text-[9px] font-medium leading-none ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(tab.key)}
              </span>
            </motion.button>
          );
        })}

        {/* Language dropdown — opens upward */}
        <div className="relative flex" ref={langMenuRef}>
          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute bottom-full mb-3 right-0 flex flex-col overflow-hidden rounded-2xl bg-card/95 p-1 shadow-2xl backdrop-blur-2xl border border-border/70 z-50"
              >
                {langOptions.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLang(l.id);
                      setShowLangMenu(false);
                      haptic();
                    }}
                    className={`flex items-center justify-center rounded-xl px-4 py-2.5 text-[13px] font-bold transition-colors ${
                      lang === l.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { haptic(); setShowLangMenu((p) => !p); }}
            aria-label="Change language"
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5"
          >
            <Globe size={19} className="text-muted-foreground" />
            <span className="text-[9px] font-bold leading-none text-primary">
              {langLabel}
            </span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default BottomTabBar;
