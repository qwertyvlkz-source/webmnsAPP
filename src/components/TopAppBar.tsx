import { useLang } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

const TopAppBar = () => {
  const { t } = useLang();

  return (
    <div className="relative z-10 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 bg-background/60 backdrop-blur-xl border-b border-border/40">
      <div className="flex items-center gap-2.5">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
        >
          <div className="absolute inset-0 rounded-xl bg-white/20 blur-[2px] mix-blend-overlay" />
          <span className="relative z-10 text-[12px] font-black text-white">W</span>
        </motion.div>
        <span className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
          WebMNS
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-2.5 py-1 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/60 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Online</span>
      </div>
    </div>
  );
};

export default TopAppBar;
