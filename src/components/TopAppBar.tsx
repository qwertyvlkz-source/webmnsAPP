import { Bell } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

const TopAppBar = () => {
  const { lang, setLang } = useLang();

  return (
    <header className="flex items-center justify-between bg-card backdrop-blur-md px-4 py-3 border-b border-border shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">W</span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          WebMNS
        </span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          className="flex h-8 items-center gap-1 rounded-lg bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground"
        >
          <span className={lang === "ru" ? "text-primary" : "text-muted-foreground"}>RU</span>
          <span className="text-muted-foreground">/</span>
          <span className={lang === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-card" />
        </motion.button>
      </div>
    </header>
  );
};

export default TopAppBar;
