import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Globe, Smartphone, Search, Check, ArrowUpRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * Responsive shell for the mobile-first app.
 * - On phones it stays full-bleed (edge to edge, 100dvh).
 * - On large screens it becomes a two-column landing: a brand/marketing panel
 *   on the left and the live app inside a phone frame on the right, so the
 *   surrounding space reads as a real website page instead of empty padding.
 */
const featureIcons = [Globe, Smartphone, Search] as const;
const featureKeys = ["shell.feat1", "shell.feat2", "shell.feat3"] as const;
const shellStats = [
  { value: "150+", key: "home.stat.projects" },
  { value: "120+", key: "home.stat.clients" },
  { value: "4.9", key: "home.stat.rating" },
] as const;

const AppShell = ({ children }: { children: ReactNode }) => {
  const { t } = useLang();

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-background">
      {/* Light website canvas — only visible on >= lg screens */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/70" />
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -left-32 top-0 h-[36rem] w-[36rem] rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-accent/[0.06] blur-3xl" />
      </div>

      {/* MOBILE / TABLET: app full screen. DESKTOP: two-column landing. */}
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1240px] items-center justify-center lg:grid lg:grid-cols-[1.05fr_auto] lg:items-center lg:gap-12 lg:px-10 lg:py-10">
        {/* Brand / marketing panel — desktop only */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:flex-col lg:justify-center"
        >
          <div className="mb-6 flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
              <span className="text-sm font-black text-white">W</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight">WebMNS</span>
          </div>

          <span className="label-mono mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
            {t("shell.eyebrow")}
          </span>

          <h1 className="max-w-xl whitespace-pre-line text-5xl leading-[1.05] tracking-tight text-foreground">
            {t("shell.title")}
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            {t("shell.subtitle")}
          </p>

          <ul className="mt-7 space-y-3">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <li key={key} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span className="text-[15px] font-medium text-foreground/90">{t(key)}</span>
                  <Check size={16} className="ml-auto text-primary/70" />
                </li>
              );
            })}
          </ul>

          <div className="mt-9 flex items-center gap-3">
            <button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5">
              {t("home.cta")}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <div className="flex items-center gap-5 pl-3">
              {shellStats.map((s) => (
                <div key={s.key}>
                  <div className="text-xl font-extrabold leading-none text-foreground">{s.value}</div>
                  <div className="label-mono mt-1 text-[9px] text-muted-foreground">{t(s.key)}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* App — full screen on mobile, phone frame on desktop */}
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
