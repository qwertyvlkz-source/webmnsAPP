import { Bell } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

const TopAppBar = () => {
  const { lang, setLang } = useLang();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      <span className="text-lg font-bold tracking-tight text-primary">
        WebMNS
      </span>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          className="flex h-8 items-center gap-1 rounded-lg bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground"
        >
          <span className={lang === "ru" ? "text-primary" : "text-muted-foreground"}>RU</span>
          <span className="text-muted-foreground">/</span>
          <span className={lang === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="relative p-1">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-accent" />
        </motion.button>
      </div>
    </header>
  );
};

export default TopAppBar;
