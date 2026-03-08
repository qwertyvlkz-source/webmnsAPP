import { Bell } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

const TopAppBar = () => {
  const { lang, setLang } = useLang();

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <span className="text-lg font-bold tracking-tight text-foreground">
        WebMNS
      </span>
      <div className="flex items-center gap-1.5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setLang(lang === "ru" ? "en" : "ru")}
          className="flex h-8 items-center gap-0.5 rounded-full bg-secondary px-3 text-xs font-semibold"
        >
          <span className={lang === "ru" ? "text-primary font-bold" : "text-muted-foreground"}>RU</span>
          <span className="text-muted-foreground/50">/</span>
          <span className={lang === "en" ? "text-primary font-bold" : "text-muted-foreground"}>EN</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="relative flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
        </motion.button>
      </div>
    </header>
  );
};

export default TopAppBar;
