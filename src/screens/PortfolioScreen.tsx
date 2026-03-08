import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

type Category = "all" | "web" | "mobile" | "design";

const projects = [
  { id: 1, title: "Visa Site", cat: "web" as Category, image: "/images/visa.png", tech: "Next.js, Tailwind, TypeScript", descRu: "Сайт визовых заявок", descEn: "Visa application website" },
  { id: 2, title: "FIX Service", cat: "web" as Category, image: "/images/fix.png", tech: "React, Node.js, PostgreSQL", descRu: "Сайт ремонтного сервиса", descEn: "Repair service website" },
  { id: 3, title: "SEO Agency", cat: "web" as Category, image: "/images/seo.png", tech: "React, Tailwind, Framer Motion", descRu: "SEO и digital-маркетинг", descEn: "SEO & digital marketing" },
  { id: 4, title: "Visa Site", cat: "design" as Category, image: "/images/visa.png", tech: "Figma, Adobe XD", descRu: "Сайт визовых заявок", descEn: "Visa application website" },
  { id: 5, title: "FIX Service", cat: "mobile" as Category, image: "/images/fix.png", tech: "React Native, TypeScript", descRu: "Сайт ремонтного сервиса", descEn: "Repair service website" },
  { id: 6, title: "SEO Agency", cat: "design" as Category, image: "/images/seo.png", tech: "Figma, Illustrator", descRu: "SEO и digital-маркетинг", descEn: "SEO & digital marketing" },
];

const filters: { key: Category; label: string }[] = [
  { key: "all", label: "portfolio.all" },
  { key: "web", label: "portfolio.web" },
  { key: "mobile", label: "portfolio.mobile" },
  { key: "design", label: "portfolio.design" },
];

const PortfolioScreen = () => {
  const { t, lang } = useLang();
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

      {/* Project Cards - Grid */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(p)}
                className="relative flex flex-col justify-end rounded-2xl overflow-hidden h-[140px] cursor-pointer shadow-sm"
              >
                <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative p-3">
                  <span className="text-sm font-bold text-white">{p.title}</span>
                  <span className="block text-[10px] text-white/70">
                    {lang === "ru" ? p.descRu : p.descEn}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent className="bg-card border-border">
          <DrawerHeader>
            <DrawerTitle className="text-foreground">{selected?.title}</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              {selected && (lang === "ru" ? selected.descRu : selected.descEn)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8">
            {selected && (
              <div className="relative mb-4 h-[160px] rounded-2xl overflow-hidden">
                <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
              </div>
            )}
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
