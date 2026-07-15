import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth, type User as AuthUser } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useTheme } from "next-themes";
import {
  User, LogOut, CheckCircle, Loader2,
  ChevronRight, CreditCard, Users,
  Check,
  Mail, Lock, UserIcon, HelpCircle, MessageSquare, Settings,
} from "lucide-react";
import TicketsScreen from "@/screens/TicketsScreen";
import OrdersScreen from "@/screens/OrdersScreen";
import FAQScreen from "@/screens/FAQScreen";
import { langNames, type Lang } from "@/i18n/translations";
import ReferralDashboard from "@/components/ReferralDashboard";
import { normalizeReferralData, type ReferralData } from "@/lib/referral";
import { getLoginValidationKey, getRegistrationValidationKey } from "@/lib/profile-validation";

const GoogleIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-[18px] w-[18px] shrink-0">
    <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.875 2.684-6.614Z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.181l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.584-5.037-3.711H.956v2.333A9 9 0 0 0 9 18Z" />
    <path fill="#FBBC05" d="M3.963 10.709A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.281-1.709V4.958H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.042l3.007-2.333Z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.507.454 3.44 1.346l2.582-2.582C13.463.892 11.426 0 9 0A9 9 0 0 0 .956 4.958l3.007 2.333C4.672 5.164 6.656 3.58 9 3.58Z" />
  </svg>
);

const ProfileScreen = () => {
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { user, token, isAuthenticated, login, loginWithGoogle, register, logout, updateUser, isLoading: authLoading } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"orders" | "tickets" | "partner" | "settings" | "faq">("orders");
  const [refData, setRefData] = useState<ReferralData | null>(null);
  const [refLoading, setRefLoading] = useState(false);
  const [refError, setRefError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  const loadReferralData = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefLoading(true);
    setRefError("");
    try {
      const response = await api.get<{ data: ReferralData }>("/referral");
      if (response.data) setRefData(normalizeReferralData(response.data));
    } catch (error) {
      setRefError(error instanceof Error ? error.message : t("common.serverError"));
    } finally {
      setRefLoading(false);
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    setRefData(null);
    setRefError("");
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    api.get<{ preferences?: { notifications?: boolean } }>("/user/preferences")
      .then((response) => {
        if (!cancelled && typeof response.preferences?.notifications === "boolean") {
          setNotificationsEnabled(response.preferences.notifications);
        }
      })
      .catch(() => {
        // Local defaults remain available if server preferences cannot be loaded.
      });

    return () => { cancelled = true; };
  }, [isAuthenticated, user?.id]);

  // The referral endpoint creates a code on first read, so authenticated users
  // are enrolled automatically and do not need a fake second "join" action.
  useEffect(() => {
    if (isAuthenticated && activeTab === "partner" && !refData && !refLoading && !refError) {
      void loadReferralData();
    }
  }, [isAuthenticated, activeTab, refData, refLoading, refError, loadReferralData]);

  const tabs = [
    { key: "orders" as const, label: "nav.orders", icon: CreditCard },
    { key: "tickets" as const, label: "profile.tab.tickets", icon: MessageSquare },
    { key: "partner" as const, label: "profile.tab.partner", icon: Users },
    { key: "settings" as const, label: "profile.tab.settings", icon: Settings },
  ];

  const handleLogin = async () => {
    const validationKey = getLoginValidationKey(email, password);
    if (validationKey) {
      setLoginError(t(validationKey));
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    const result = await login(email, password);
    if (!result.success) setLoginError(result.error || t("common.error"));
    setLoginLoading(false);
  };

  const handleRegister = async () => {
    const validationKey = getRegistrationValidationKey(name, email, password, confirmPassword);
    if (validationKey) {
      setLoginError(t(validationKey));
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    const result = await register(name, email, password);
    if (!result.success) setLoginError(result.error || t("common.error"));
    setLoginLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setLoginError("");
    const result = await loginWithGoogle();
    if (!result.success) {
      setLoginError(result.error || t("common.error"));
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setLoginError(t("profile.login.emailRequired"));
      return;
    }
    setForgotLoading(true);
    setLoginError("");
    try {
      await api.post("/auth/forgot-password", { email: email.trim() }, { noAuth: true });
      toast.success(t("profile.login.resetSent"));
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : t("common.serverError"));
    } finally {
      setForgotLoading(false);
    }
  };

  const savePreferences = useCallback(async (overrides: { language?: Lang; theme?: string; notifications?: boolean }) => {
    try {
      await api.put("/user/preferences", {
        language: overrides.language ?? lang,
        theme: overrides.theme ?? theme ?? "dark",
        notifications: overrides.notifications ?? notificationsEnabled,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.serverError"));
    }
  }, [lang, notificationsEnabled, t, theme]);

  const openEditProfile = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setEditProfileOpen(true);
  };

  const saveProfile = async () => {
    if (!editName.trim() || !/^\S+@\S+\.\S+$/.test(editEmail.trim()) || !user) return;
    setSettingsSaving(true);
    try {
      const data = await api.put<{ user: AuthUser }>("/user/profile", { name: editName.trim(), email: editEmail.trim() });
      updateUser({ ...user, ...data.user });
      setEditProfileOpen(false);
      toast.success(t("settings.profileSaved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.serverError"));
    } finally {
      setSettingsSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPassword.length < 8) {
      toast.error(t("settings.passwordMin"));
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      toast.error(t("settings.passwordMismatch"));
      return;
    }
    setSettingsSaving(true);
    try {
      await api.put("/user/password", { current_password: currentPassword, new_password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setChangePasswordOpen(false);
      toast.success(t("settings.passwordSaved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.serverError"));
    } finally {
      setSettingsSaving(false);
    }
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
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading || loginLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary/70 disabled:opacity-50"
          >
            {googleLoading ? <Loader2 size={18} className="animate-spin text-primary" /> : <GoogleIcon />}
            {t("profile.login.google")}
          </motion.button>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("profile.login.or")}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

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
            <button
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className="flex items-center justify-center gap-2 text-xs text-primary font-medium disabled:opacity-50"
            >
              {forgotLoading && <Loader2 size={13} className="animate-spin" />}
              {t("profile.login.forgot")}
            </button>
          )}

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
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => void logout()}
          aria-label={t("profile.logout")}
          title={t("profile.logout")}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
        >
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
              <div className="mt-3">
                {refLoading ? (
                  <div className="flex min-h-48 items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-primary" />
                  </div>
                ) : (
                  <ReferralDashboard data={refData} error={refError} onRetry={loadReferralData} />
                )}
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
                    onClick={() => {
                      setLang(code);
                      void savePreferences({ language: code });
                    }}
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
                {t("settings.theme")}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {(["dark", "light"] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setTheme(value);
                      void savePreferences({ theme: value });
                    }}
                    className={`rounded-xl border p-3.5 text-sm font-semibold ${theme === value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"}`}
                  >
                    {t(`settings.${value}`)}
                  </button>
                ))}
              </div>

              <h2 className="mt-5 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("settings.title")}
              </h2>
              <div className="flex flex-col gap-2">
                <button onClick={openEditProfile} className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                  <span className="text-sm font-semibold text-foreground">{t("settings.editProfile")}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
                {token ? (
                  <button onClick={() => setChangePasswordOpen(true)} className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                    <span className="text-sm font-semibold text-foreground">{t("settings.changePassword")}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t("settings.googleAccount")}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{t("settings.googlePassword")}</p>
                    </div>
                    <GoogleIcon />
                  </div>
                )}
                <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
                  <span className="text-sm font-semibold text-foreground">{t("settings.notifications")}</span>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationsEnabled(checked);
                      void savePreferences({ notifications: checked });
                    }}
                    aria-label={t("settings.notifications")}
                  />
                </div>
              </div>

              {/* FAQ link */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab("faq")}
                className="mt-4 w-full flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
              >
                <HelpCircle size={18} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">{t("faq.title")}</span>
                <ChevronRight size={16} className="text-muted-foreground ml-auto" />
              </motion.button>
            </motion.div>
          )}

          {activeTab === "faq" && (
            <motion.div key="faq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full overflow-y-auto">
              <button onClick={() => setActiveTab("settings")} className="mx-4 mt-2 text-xs font-semibold text-primary">
                ← {t("order.back")}
              </button>
              <FAQScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>{t("settings.editProfile")}</DialogTitle>
            <DialogDescription>{t("settings.profileDescription")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input value={editName} onChange={(event) => setEditName(event.target.value)} placeholder={t("profile.login.name")} autoComplete="name" />
            <Input value={editEmail} onChange={(event) => setEditEmail(event.target.value)} placeholder={t("profile.login.email")} type="email" autoComplete="email" />
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setEditProfileOpen(false)} className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold">{t("common.cancel")}</button>
            <button onClick={saveProfile} disabled={settingsSaving || !editName.trim() || !/^\S+@\S+\.\S+$/.test(editEmail.trim())} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
              {settingsSaving ? <Loader2 size={16} className="mx-auto animate-spin" /> : t("common.save")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>{t("settings.changePassword")}</DialogTitle>
            <DialogDescription>{t("settings.passwordDescription")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder={t("settings.currentPassword")} type="password" autoComplete="current-password" />
            <Input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder={t("settings.newPassword")} type="password" autoComplete="new-password" />
            <Input value={newPasswordConfirm} onChange={(event) => setNewPasswordConfirm(event.target.value)} placeholder={t("settings.confirmPassword")} type="password" autoComplete="new-password" />
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setChangePasswordOpen(false)} className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold">{t("common.cancel")}</button>
            <button onClick={savePassword} disabled={settingsSaving || !currentPassword || !newPassword || !newPasswordConfirm} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
              {settingsSaving ? <Loader2 size={16} className="mx-auto animate-spin" /> : t("common.save")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileScreen;
