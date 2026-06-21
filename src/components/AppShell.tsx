import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Responsive shell for the mobile-first app.
 * - On phones it stays full-bleed (edge to edge, 100dvh).
 * - On large screens it centers the app inside a phone frame.
 */
const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-background">
      {/* Subtle background — only visible on >= lg screens */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/70" />
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -left-32 top-0 h-[36rem] w-[36rem] rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-accent/[0.06] blur-3xl" />
      </div>

      {/* App — full screen on mobile, phone frame centered on desktop */}
      <div className="relative mx-auto flex min-h-[100dvh] w-full items-center justify-center lg:px-10 lg:py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background lg:h-[840px] lg:max-h-[calc(100dvh-5rem)] lg:w-[390px] lg:rounded-[2.75rem] lg:border lg:border-border/70 lg:shadow-2xl lg:shadow-foreground/10 lg:ring-1 lg:ring-black/5"
        >
          {/* Desktop-only device notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-full bg-foreground/90 lg:block" />
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AppShell;
