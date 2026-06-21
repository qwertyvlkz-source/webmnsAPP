import { motion } from "framer-motion";
import { Rocket, Bell } from "lucide-react";

const TopAppBar = () => {
  return (
    <div className="relative z-10 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 bg-background/60 backdrop-blur-xl border-b border-border/40">
      {/* Animated rocket logo + DIGITAL AGENCY (webmns.com style) */}
      <div className="flex items-center gap-2.5">
        <motion.div
          animate={{ y: [0, -2.5, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-9 w-9 items-center justify-center"
        >
          {/* Exhaust trail (bottom-left of the rocket) */}
          <motion.span
            aria-hidden
            animate={{ opacity: [0.15, 0.7, 0.15], scale: [0.7, 1.15, 0.7] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0.5 h-3 w-1.5 origin-top rounded-full bg-gradient-to-b from-accent to-transparent blur-[1.5px]"
          />
          <motion.span
            aria-hidden
            animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 0.6, 1] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute bottom-1 left-1.5 h-2 w-1 origin-top rounded-full bg-gradient-to-b from-primary to-transparent blur-[1px]"
          />
          <Rocket
            size={26}
            strokeWidth={2}
            className="relative z-10 text-primary drop-shadow-[0_2px_6px_hsl(var(--primary)/0.35)]"
          />
        </motion.div>
        <div className="flex flex-col leading-[1.05]">
          <span className="label-mono text-[13px] font-bold tracking-[0.12em] text-foreground">
            DIGITAL
          </span>
          <span className="label-mono text-[13px] font-bold tracking-[0.12em] bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            AGENCY
          </span>
        </div>
      </div>

      {/* Notification bell (moved up from the hero, replaces the "Online" badge) */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/70 shadow-sm backdrop-blur-md"
      >
        <Bell size={18} className="text-foreground" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
      </motion.button>
    </div>
  );
};

export default TopAppBar;
