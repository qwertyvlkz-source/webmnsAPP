import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

const NotFound = () => {
  const { t } = useLang();

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/70" />
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-3xl border border-border/60 bg-card/70 p-8 text-center shadow-2xl shadow-primary/10 backdrop-blur-2xl"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
        >
          <Compass size={30} className="text-white" />
        </motion.div>

        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-black tracking-tight text-transparent">
          404
        </h1>
        <p className="mt-2 text-lg font-semibold text-foreground">{t("notFound.title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("notFound.description")}
        </p>

        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
        >
          <ArrowLeft size={16} />
          {t("notFound.home")}
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;
