import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  User, LogOut, CheckCircle, Circle, Loader2,
  FileText, ChevronRight, CreditCard, Users,
  Copy, Check, DollarSign, UserPlus, Eye, ShoppingCart,
  Mail, Lock, UserIcon, HelpCircle, MessageSquare, Settings,
} from "lucide-react";
import TicketsScreen from "@/screens/TicketsScreen";
import OrdersScreen from "@/screens/OrdersScreen";
import FAQScreen from "@/screens/FAQScreen";
import { langNames, type Lang } from "@/i18n/translations";

const ProfileScreen = ({ onOpenPartner }: { onOpenPartner?: () => void }) => {
  const { t, lang, setLang } = useLang();
  const { user, isAuthenticated, login, register, logout, isLoading: authLoading } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"projects" | "orders" | "tickets" | "partner" | "settings">("projects");
  const [copied, setCopied] = useState(false);
  const [refData, setRefData] = useState<{ referral_code: string; referral_link: string; total_referrals: number; total_earnings: number } | null>(null);

  // Fetch referral data when partner tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === "partner" && !refData) {
      api.get<{ data: any }>("/referral")
        .then((res) => { if (res.data) setRefData(res.data); })
        .catch(() => {});
    }
  }, [isAuthenticated, activeTab]);

  const refLink = refData?.referral_link || (user ? `https://webmns.com?ref=${user.referral_code || 'loading'}` : "");

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success(t("partner.linkCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { key: "profile.design", status: "done" },
    { key: "profile.development", status: "active", progress: 70 },
    { key: "profile.testing", status: "pending" },
    { key: "profile.release", status: "pending" },
  ];

  const tabs = [
    { key: "projects" as const, label: "profile.tab.projects", icon: FileText },
    { key: "orders" as const, label: "nav.orders", icon: CreditCard },
    { key: "tickets" as const, label: "profile.tab.tickets", icon: MessageSquare },
    { key: "partner" as const, label: "profile.tab.partner", icon: Users },
    { key: "settings" as const, label: "profile.tab.settings", icon: Settings },
  ];

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoginLoading(true);
    setLoginError("");
    const result = await login(email, password);
    if (!result.success) setLoginError(result.error || t("common.error"));
    setLoginLoading(false);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password !== confirmPassword) {
      setLoginError(lang === "uk" ? "Паролі не збігаються" : "Passwords don't match");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    const result = await register(name, email, password);
    if (!result.success) setLoginError(result.error || t("common.error"));
    setLoginLoading(false);
  };

  // Loading
  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // LOGIN / REGISTER SCREEN
  if (!isAuthenticated) {
    return (
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <User size={32} className="text-primary" />
          </span>
          <h1 className="text-xl font-bold text-foreground mb-1">
            {isRegisterMode ? t("profile.login.register") : t("profile.login.title")}
          </h1>
          <p className="text-xs text-muted-foreground mb-6">WebMNS Client Portal</p>
        </motion.div>

        {loginError && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-3 rounded-xl bg-destructive/10 border border-destructive/30 p-3">
            <p className="text-xs text-destructive font-medium">{loginError}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-3">
          {isRegisterMode && (
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("profile.login.name")} value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-card border-border py-5 pl-10" />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("profile.login.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-card border-border py-5 pl-10" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("profile.login.password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !isRegisterMode && handleLogin()} className="rounded-xl bg-card border-border py-5 pl-10" />
          </div>
          {isRegisterMode && (
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("profile.login.confirmPassword")} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRegister()} className="rounded-xl bg-card border-border py-5 pl-10" />
            </div>
          )}

          <motion.button whileTap={{ scale: 0.95 }} onClick={isRegisterMode ? handleRegister : handleLogin} disabled={loginLoading} className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 disabled:opacity-50">
            {loginLoading && <Loader2 size={16} className="animate-spin" />}
            {isRegisterMode ? t("profile.login.register") : t("profile.login.button")}
          </motion.button>

          {!isRegisterMode && (
            <button className="text-xs text-primary font-medium">{t("profile.login.forgot")}</button>
          )}

          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{t("profile.login.or")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <motion.button whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t("profile.login.google")}
          </motion.button>

          <button onClick={() => { setIsRegisterMode(!isRegisterMode); setLoginError(""); }} className="mt-2 text-xs text-muted-foreground">
            {isRegisterMode ? t("profile.login.button") : t("profile.login.register")}
          </button>
        </motion.div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <User size={20} className="text-primary" />
          </span>
          <div>
            <h1 className="text-base font-bold text-foreground">
              {t("profile.greeting")}, {user?.name || "User"}!
            </h1>
            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={logout} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <LogOut size={14} className="text-muted-foreground" />
        </motion.button>
      </div>

      {/* Scrollable Tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <Icon size={13} />
              {t(tab.label)}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div key="projects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="no-scrollbar h-full overflow-y-auto px-4 pb-4">
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-accent">{t("profile.activeProject")}</p>
                    <p className="text-sm font-bold text-foreground">{t("profile.project1.name")}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                <div className="pl-1">
                  {steps.map((s, i) => {
                    const isDone = s.status === "done";
                    const isActive = s.status === "active";
                    return (
                      <div key={i} className="flex gap-2.5">
                        <div className="flex flex-col items-center">
                          {isDone ? <CheckCircle size={18} className="text-accent" /> : isActive ? <Loader2 size={18} className="animate-spin text-primary" /> : <Circle size={18} className="text-muted-foreground/30" />}
                          {i < steps.length - 1 && <div className={`w-0.5 flex-1 my-0.5 ${isDone ? "bg-accent/40" : "bg-border"}`} />}
                        </div>
                        <div className="pb-3">
                          <span className={`text-xs font-semibold ${isDone ? "text-accent" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{t(s.key)}</span>
                          {isActive && s.progress !== undefined && (
                            <div className="mt-1.5 w-36">
                              <Progress value={s.progress} className="h-1.5 bg-secondary [&>div]:bg-primary" />
                              <span className="mt-0.5 block text-[10px] text-muted-foreground">{s.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">✓ {t("profile.completed")}</p>
                    <p className="text-sm font-bold text-foreground">{t("profile.project2.name")}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
              <OrdersScreen />
            </motion.div>
          )}

          {activeTab === "tickets" && (
            <motion.div key="tickets" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
              <TicketsScreen />
            </motion.div>
          )}

          {activeTab === "partner" && (
            <motion.div key="partner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="no-scrollbar h-full overflow-y-auto px-4 pb-4">
              {/* Stats */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { icon: DollarSign, value: `€${refData?.total_earnings || 0}`, label: t("partner.earned") },
                  { icon: UserPlus, value: String(refData?.total_referrals || 0), label: t("partner.referrals") },
                  { icon: Eye, value: "—", label: t("partner.clicks") },
                  { icon: ShoppingCart, value: "—", label: t("partner.orders") },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex flex-col items-center gap-1 rounded-2xl bg-card border border-border p-4">
                      <Icon size={18} className="text-primary" />
                      <span className="text-lg font-bold text-foreground">{s.value}</span>
                      <span className="text-[10px] text-muted-foreground">{s.label}</span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-3 rounded-2xl bg-card border border-border p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{t("partner.yourLink")}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground truncate">{refLink}</div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </motion.button>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{t("partner.balance")}</span>
                  <span className="text-lg font-bold text-foreground">€{refData?.total_earnings || 0}</span>
                </div>
                <Progress value={Math.min(((refData?.total_earnings || 0) / 1000) * 100, 100)} className="h-1.5 bg-secondary [&>div]:bg-primary" />
                <p className="text-[10px] text-muted-foreground mt-1.5">€{refData?.total_earnings || 0} / €1000 {t("partner.toBonus")}</p>
                <motion.button whileTap={{ scale: 0.95 }} className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
                  {t("partner.withdraw")}
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="no-scrollbar h-full overflow-y-auto px-4 pb-4">
              <h2 className="mt-3 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("settings.language")}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(langNames) as [Lang, string][]).map(([code, label]) => (
                  <motion.button
                    key={code}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setLang(code)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 transition-colors ${
                      lang === code ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    {lang === code && <CheckCircle size={16} className="text-primary" />}
                  </motion.button>
                ))}
              </div>

              <h2 className="mt-5 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("settings.title")}
              </h2>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                  <span className="text-sm font-semibold text-foreground">{t("settings.editProfile")}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
                <button className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                  <span className="text-sm font-semibold text-foreground">{t("settings.changePassword")}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
                <button className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                  <span className="text-sm font-semibold text-foreground">{t("settings.notifications")}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* FAQ link */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab("projects")} // TODO: route to FAQ
                className="mt-4 w-full flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
              >
                <HelpCircle size={18} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">{t("faq.title")}</span>
                <ChevronRight size={16} className="text-muted-foreground ml-auto" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileScreen;
