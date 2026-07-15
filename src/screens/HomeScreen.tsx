import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  Award,
  Braces,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  CreditCard,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  LayoutTemplate,
  Loader2,
  Palette,
  Quote,
  RefreshCw,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLang } from "@/i18n/LanguageContext";
import { fetchPortfolio, pickLocale, resolveImageUrl, type PortfolioItem } from "@/lib/portfolio";
import {
  fetchServices,
  formatApproximateUah,
  formatServicePrice,
  getServiceFeatures,
  getServiceName,
  isPopularService,
  isStartingPrice,
  type Service,
} from "@/lib/services";

const testimonials = [
  { name: "Andrii K.", role: "home.review1.role", text: "home.review1.text" },
  { name: "Maria L.", role: "home.review2.role", text: "home.review2.text" },
  { name: "Pavel S.", role: "home.review3.role", text: "home.review3.text" },
];

const advantages = [
  { icon: Code2, title: "home.tech", desc: "home.tech.desc", tone: "from-blue-500/20 to-violet-500/10 text-blue-600 dark:text-blue-300" },
  { icon: ShieldCheck, title: "home.quality", desc: "home.quality.desc", tone: "from-emerald-500/20 to-cyan-500/10 text-emerald-600 dark:text-emerald-300" },
  { icon: Zap, title: "home.fast", desc: "home.fast.desc", tone: "from-amber-400/25 to-orange-500/10 text-amber-600 dark:text-amber-300" },
  { icon: Award, title: "home.exp", desc: "home.exp.desc", tone: "from-fuchsia-500/20 to-violet-500/10 text-fuchsia-600 dark:text-fuchsia-300" },
];

const stats = [
  { icon: TrendingUp, value: "500+", key: "home.stat.projects" },
  { icon: Gauge, value: "100%", key: "home.stat.deadlines" },
  { icon: Award, value: "7+", key: "home.stat.years" },
  { icon: Star, value: "5/5", key: "home.stat.rating" },
];

const cardTones = [
  "from-blue-500/14 via-blue-500/5 to-transparent border-blue-400/25",
  "from-fuchsia-500/14 via-violet-500/5 to-transparent border-fuchsia-400/25",
  "from-emerald-500/14 via-emerald-500/5 to-transparent border-emerald-400/25",
  "from-violet-500/14 via-blue-500/5 to-transparent border-violet-400/25",
  "from-amber-400/15 via-orange-400/5 to-transparent border-amber-400/25",
];

function getServiceIcon(serviceId: number): LucideIcon {
  const icons: Record<number, LucideIcon> = {
    1: LayoutTemplate,
    2: Building2,
    3: ShoppingCart,
    4: Smartphone,
    5: FileText,
    6: Palette,
    7: Apple,
    8: Braces,
    9: RefreshCw,
  };
  return icons[serviceId] ?? Globe2;
}

const HomeScreen = ({ onOpenPartner, onTabChange }: { onOpenPartner?: () => void; onTabChange?: (tab: number) => void }) => {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [latestProjects, setLatestProjects] = useState<PortfolioItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewDir, setReviewDir] = useState(0);

  useEffect(() => {
    fetchPortfolio()
      .then((data) => setLatestProjects(data.slice(0, 6)))
      .catch((error) => console.error("Failed to load portfolio:", error))
      .finally(() => setLoadingProjects(false));
  }, []);

  const loadPricing = () => {
    setLoadingServices(true);
    fetchServices()
      .then(setServices)
      .catch((error) => {
        console.error("Failed to load services:", error);
        setServices([]);
      })
      .finally(() => setLoadingServices(false));
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const heroLines = t("home.hero").split("\n");

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-3 overflow-hidden rounded-[2rem] border border-violet-300/30 bg-gradient-to-br from-white/95 via-violet-50/90 to-blue-50/90 p-5 shadow-[0_24px_70px_rgba(92,68,210,0.16)] dark:from-slate-950/95 dark:via-violet-950/45 dark:to-blue-950/35"
      >
        <div className="pointer-events-none absolute -right-16 -top-14 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/35 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary shadow-sm dark:bg-white/10">
            <Sparkles size={12} />
            {t("home.badge")}
          </span>
          <h1 className="mt-4 text-[34px] font-black leading-[0.98] tracking-[-0.045em] text-foreground">
            <span className="block">{heroLines[0]}</span>
            <span className="mt-1 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              {heroLines[1] ?? ""}
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-[13px] font-medium leading-6 text-muted-foreground">
            {t("home.heroSubtitle")}
          </p>
        </div>

        <div className="hero-visual-grid relative mt-5 h-[188px] overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/65 shadow-inner dark:border-white/10 dark:bg-slate-950/55">
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-violet-300/40 bg-white/90 p-3 shadow-[0_18px_50px_rgba(88,70,190,0.22)] dark:bg-slate-900/90"
          >
            <div className="mb-3 flex items-center gap-1.5 border-b border-border/60 pb-2">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="ml-auto text-[8px] font-bold uppercase tracking-widest text-muted-foreground">webmns.dev</span>
            </div>
            <div className="grid grid-cols-[1fr_58px] gap-3">
              <div className="space-y-2">
                <span className="block h-2.5 w-4/5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                <span className="block h-2 w-full rounded-full bg-violet-200 dark:bg-violet-800/70" />
                <span className="block h-2 w-2/3 rounded-full bg-blue-200 dark:bg-blue-800/70" />
                <div className="flex gap-2 pt-1">
                  <span className="h-8 flex-1 rounded-lg bg-violet-100 dark:bg-violet-900/60" />
                  <span className="h-8 flex-1 rounded-lg bg-blue-100 dark:bg-blue-900/60" />
                </div>
              </div>
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/30">
                <Code2 size={27} />
              </div>
            </div>
          </motion.div>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute left-3 top-5 rounded-xl bg-violet-600 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">UI/UX</motion.span>
          <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 3.6, repeat: Infinity }} className="absolute bottom-4 left-5 rounded-xl bg-slate-900 px-3 py-1.5 text-[10px] font-black text-white shadow-lg dark:bg-white dark:text-slate-900">HTML</motion.span>
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute right-3 top-7 rounded-xl bg-fuchsia-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">API</motion.span>
          <span className="absolute bottom-4 right-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30"><Smartphone size={19} /></span>
        </div>

        <div className="relative mt-5 grid grid-cols-[1fr_auto] gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onTabChange?.(2)}
            className="cta-shine relative flex min-h-[50px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 px-4 text-sm font-extrabold text-white shadow-lg shadow-violet-500/30"
          >
            {t("home.cta")} <ArrowRight size={17} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onTabChange?.(1)}
            aria-label={t("home.portfolioCta")}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-violet-300/40 bg-white/75 text-primary shadow-sm dark:bg-white/10"
          >
            <ArrowUpRight size={19} />
          </motion.button>
        </div>
      </motion.section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3.5 shadow-sm backdrop-blur-xl"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 text-primary"><Icon size={18} /></span>
              <div><p className="text-lg font-black leading-none text-foreground">{stat.value}</p><p className="mt-1 text-[10px] font-semibold text-muted-foreground">{t(stat.key)}</p></div>
            </motion.div>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <span className="section-pill">{t("home.why")}</span>
          <h2 className="mt-2 text-[25px] font-black tracking-[-0.035em] text-foreground">{t("home.advantagesTitle")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[1.4rem] border border-border/60 bg-card/85 p-4 shadow-sm backdrop-blur-xl"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone}`}><Icon size={21} /></span>
                <h3 className="mt-3 text-[13px] font-extrabold leading-tight text-foreground">{t(item.title)}</h3>
                <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">{t(item.desc)}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <span className="section-pill">{t("pricing.eyebrow")}</span>
            <h2 className="mt-2 text-[25px] font-black tracking-[-0.035em] text-foreground">{t("pricing.title")}</h2>
          </div>
          <span className="mb-1 shrink-0 text-[10px] font-semibold text-muted-foreground">{services.length || 9} {t("pricing.packages")}</span>
        </div>

        {loadingServices ? (
          <div className="flex gap-3 overflow-hidden">
            {[0, 1].map((item) => <div key={item} className="h-[350px] w-[82%] shrink-0 animate-pulse rounded-[1.7rem] bg-secondary" />)}
          </div>
        ) : services.length === 0 ? (
          <button onClick={loadPricing} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card p-6 text-sm font-bold text-primary"><RefreshCw size={17} />{t("common.retry")}</button>
        ) : (
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.id);
              const popular = isPopularService(service.id);
              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={`relative flex w-[84%] shrink-0 snap-center flex-col overflow-hidden rounded-[1.7rem] border bg-gradient-to-br ${cardTones[index % cardTones.length]} bg-card p-5 shadow-[0_18px_45px_rgba(37,32,90,0.10)]`}
                >
                  <div className="flex min-h-7 items-start justify-between gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary shadow-sm"><Icon size={22} /></span>
                    {popular ? (
                      <span className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">{t("pricing.popular")}</span>
                    ) : (
                      <span className="rounded-full bg-card/75 px-2.5 py-1 text-[9px] font-bold text-muted-foreground shadow-sm">{t("pricing.installments")}</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-black tracking-[-0.025em] text-foreground">{getServiceName(service, lang)}</h3>
                  <div className="mt-2 flex items-end gap-1.5">
                    {isStartingPrice(service.id) && <span className="pb-1 text-xs font-bold text-muted-foreground">{t("pricing.from")}</span>}
                    <span className="text-[32px] font-black leading-none tracking-[-0.04em] text-foreground">€{formatServicePrice(service.price)}</span>
                    <span className="pb-1 text-[10px] font-semibold text-muted-foreground">/{t("pricing.project")}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">≈ {formatApproximateUah(service.price, lang)} ₴</p>
                  <ul className="mt-5 flex-1 space-y-3">
                    {getServiceFeatures(service, lang).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[12px] font-medium leading-relaxed text-foreground/80">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300"><Check size={10} strokeWidth={3} /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => onTabChange?.(2)} className={`mt-5 flex min-h-[46px] items-center justify-center gap-2 rounded-2xl text-xs font-extrabold ${popular ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25" : "bg-foreground text-background"}`}>
                    {t("pricing.orderNow")} <ArrowRight size={15} />
                  </motion.button>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mt-6 overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-blue-600 p-5 text-white shadow-xl shadow-violet-500/20"
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[18px] border-white/10" />
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"><CreditCard size={21} /></span>
        <h3 className="mt-4 text-xl font-black">{t("pricing.installmentTitle")}</h3>
        <p className="mt-2 text-xs leading-relaxed text-white/80">{t("pricing.installmentDesc")}</p>
        <button onClick={() => onTabChange?.(2)} className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-white text-xs font-extrabold text-violet-700 shadow-lg">{t("home.cta")} <ArrowRight size={15} /></button>
      </motion.section>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div><span className="section-pill">{t("portfolio.title")}</span><h2 className="mt-2 text-[25px] font-black tracking-[-0.035em] text-foreground">{t("home.latest")}</h2></div>
          <button onClick={() => onTabChange?.(1)} className="mb-1 text-[11px] font-extrabold text-primary">{t("home.viewAll")}</button>
        </div>
        {loadingProjects ? (
          <div className="flex items-center justify-center py-10"><Loader2 size={22} className="animate-spin text-primary" /></div>
        ) : latestProjects.length === 0 ? (
          <p className="py-5 text-center text-xs text-muted-foreground">{t("portfolio.empty")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {latestProjects.map((project, index) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(project)}
                className="group relative h-[155px] overflow-hidden rounded-[1.35rem] border border-white/20 bg-secondary text-left shadow-lg"
              >
                {resolveImageUrl(project.image) ? <img src={resolveImageUrl(project.image)!} alt={pickLocale(project.title, lang)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /> : <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 to-blue-500/25" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"><ArrowUpRight size={14} /></span>
                <span className="absolute inset-x-0 bottom-0 p-3.5 text-[13px] font-extrabold leading-tight text-white">{pickLocale(project.title, lang)}</span>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-7 overflow-hidden rounded-[1.7rem] border border-violet-300/25 bg-gradient-to-br from-violet-500/12 via-fuchsia-500/8 to-blue-500/12 p-5">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"><Users size={20} /></span><div><p className="text-[10px] font-black uppercase tracking-widest text-primary">10%</p><h3 className="text-base font-black text-foreground">{t("home.partner")}</h3></div></div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("home.partner.desc")}</p>
        <button onClick={onOpenPartner} className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-xs font-extrabold text-background">{t("home.learnMore")} <ArrowRight size={15} /></button>
      </motion.section>

      <section className="mt-9">
        <div className="mb-4"><span className="section-pill">{t("home.reviews")}</span><h2 className="mt-2 text-[25px] font-black tracking-[-0.035em] text-foreground">{t("home.trustTitle")}</h2></div>
        <AnimatePresence initial={false} custom={reviewDir} mode="popLayout">
          {(() => {
            const review = testimonials[reviewIdx];
            return (
              <motion.article key={reviewIdx} custom={reviewDir} initial={{ opacity: 0, x: reviewDir > 0 ? 50 : -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reviewDir > 0 ? -50 : 50 }} className="rounded-[1.6rem] border border-border/60 bg-card/85 p-5 shadow-sm backdrop-blur-xl">
                <Quote size={21} className="text-primary/50" />
                <p className="mt-3 text-[13px] font-medium leading-relaxed text-foreground">{t(review.text)}</p>
                <div className="mt-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-sm font-black text-white">{review.name.charAt(0)}</span><div><p className="text-xs font-extrabold text-foreground">{review.name}</p><p className="text-[10px] text-muted-foreground">{t(review.role)}</p></div><div className="ml-auto flex gap-0.5">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={10} className="fill-amber-400 text-amber-400" />)}</div></div>
              </motion.article>
            );
          })()}
        </AnimatePresence>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button onClick={() => { setReviewDir(-1); setReviewIdx((value) => (value - 1 + testimonials.length) % testimonials.length); }} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"><ChevronLeft size={16} /></button>
          <div className="flex gap-1.5">{testimonials.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${reviewIdx === index ? "w-5 bg-primary" : "w-1.5 bg-border"}`} />)}</div>
          <button onClick={() => { setReviewDir(1); setReviewIdx((value) => (value + 1) % testimonials.length); }} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"><ChevronRight size={16} /></button>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm overflow-hidden rounded-[1.6rem] border-border bg-card p-0">
          <DialogHeader className="px-5 pt-5"><DialogTitle>{pickLocale(selected?.title, lang)}</DialogTitle><DialogDescription>{pickLocale(selected?.description, lang) || selected?.category}</DialogDescription></DialogHeader>
          <div className="px-5 pb-5">
            {selected && resolveImageUrl(selected.image) && <img src={resolveImageUrl(selected.image)!} alt={pickLocale(selected.title, lang)} className="mb-4 w-full rounded-2xl object-contain" />}
            <div className="flex gap-2">
              {selected?.url && <a href={selected.url} target="_blank" rel="noopener noreferrer" className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary text-xs font-bold text-secondary-foreground"><ExternalLink size={14} />{t("home.learnMore")}</a>}
              <button onClick={() => { setSelected(null); onTabChange?.(2); }} className="min-h-[46px] flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-3 text-xs font-extrabold text-white">{t("portfolio.orderSimilar")}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeScreen;
