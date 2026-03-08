import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

type Category = "all" | "landing" | "ecommerce" | "corporate";

const projects = [
  { id: 1, title: "FitLife App", cat: "landing" as Category, tech: "React, Tailwind, Framer Motion", colorClass: "from-indigo-600 to-cyan-500" },
  { id: 2, title: "ShopMax Store", cat: "ecommerce" as Category, tech: "Next.js, Stripe, PostgreSQL", colorClass: "from-emerald-600 to-teal-400" },
  { id: 3, title: "TechCore Ltd", cat: "corporate" as Category, tech: "React, TypeScript, Supabase", colorClass: "from-violet-600 to-fuchsia-500" },
  { id: 4, title: "EduPro Platform", cat: "landing" as Category, tech: "Vite, React, Tailwind", colorClass: "from-amber-500 to-orange-500" },
  { id: 5, title: "GreenMarket", cat: "ecommerce" as Category, tech: "React, Node.js, MongoDB", colorClass: "from-green-600 to-lime-400" },
  { id: 6, title: "Nexus Corp", cat: "corporate" as Category, tech: "React, GraphQL, AWS", colorClass: "from-slate-600 to-blue-500" },
];

const filters: { key: Category; label: string }[] = [
  { key: "all", label: "portfolio.all" },
  { key: "landing", label: "portfolio.landing" },
  { key: "ecommerce", label: "portfolio.ecommerce" },
  { key: "corporate", label: "portfolio.corporate" },
];

const PortfolioScreen = () => {
  const { t } = useLang();
  const [filter, setFilter] = useState<Category>("all");
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.cat === filter);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">{t("portfolio.title")}</h1>
      </div>

      {/* Filter Chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {filters.map((f) => (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.93 }}
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {t(f.label)}
          </motion.button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(p)}
              className={`mb-3 flex h-[120px] cursor-pointer flex-col justify-end rounded-2xl bg-gradient-to-br ${p.colorClass} p-4`}
            >
              <span className="text-base font-bold text-white">{p.title}</span>
              <span className="text-xs capitalize text-white/70">{t(`portfolio.${p.cat}`)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Drawer */}
      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent className="bg-card border-border">
          <DrawerHeader>
            <DrawerTitle className="text-foreground">{selected?.title}</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              {selected && t(`portfolio.${selected.cat}`)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className={`mb-4 h-[140px] rounded-2xl bg-gradient-to-br ${selected?.colorClass}`} />
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
              {t("portfolio.tech")}
            </p>
            <p className="mb-5 text-sm text-foreground">{selected?.tech}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              {t("portfolio.orderSimilar")}
            </motion.button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PortfolioScreen;
