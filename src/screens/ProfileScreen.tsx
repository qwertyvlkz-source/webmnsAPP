import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  User, LogOut, CheckCircle, Circle, Loader2,
  FileText, MessageCircle, Send, ChevronRight, CreditCard, Users,
  Copy, Check, DollarSign, UserPlus, Eye, ShoppingCart,
} from "lucide-react";

// Mock chat messages
const mockMessages = [
  { from: "manager", text: "Добрый день! Дизайн утверждён, переходим к разработке.", textEn: "Good day! Design approved, moving to development.", time: "10:30" },
  { from: "you", text: "Отлично, спасибо!", textEn: "Great, thanks!", time: "10:32" },
  { from: "manager", text: "Прогресс разработки — 70%. Ожидайте обновление к пятнице.", textEn: "Development progress — 70%. Expect update by Friday.", time: "14:15" },
];

// Mock invoices
const mockInvoices = [
  { id: 1, titleRu: "Дизайн-макет", titleEn: "Design Mockup", amount: "$800", status: "paid" as const },
  { id: 2, titleRu: "Разработка (этап 1)", titleEn: "Development (phase 1)", amount: "$1,200", status: "paid" as const },
  { id: 3, titleRu: "Разработка (этап 2)", titleEn: "Development (phase 2)", amount: "$1,200", status: "pending" as const },
  { id: 4, titleRu: "Тестирование и запуск", titleEn: "Testing & Launch", amount: "$600", status: "pending" as const },
];

const mockReferrals = [
  { name: "Иван К.", nameEn: "Ivan K.", date: "05.03.2026", amount: "$150", status: "paid" as const },
  { name: "Мария С.", nameEn: "Maria S.", date: "01.03.2026", amount: "$300", status: "paid" as const },
  { name: "Алексей Д.", nameEn: "Alexey D.", date: "28.02.2026", amount: "$0", status: "pending" as const },
  { name: "Ольга В.", nameEn: "Olga V.", date: "20.02.2026", amount: "$200", status: "paid" as const },
];

const ProfileScreen = ({ onOpenPartner }: { onOpenPartner?: () => void }) => {
  const { t, lang } = useLang();
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "invoices" | "chat" | "partner">("projects");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [copied, setCopied] = useState(false);
  const refLink = "https://webmns.com/ref/partner123";

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success(lang === "ru" ? "Ссылка скопирована!" : "Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  const [messages, setMessages] = useState(mockMessages);

  const steps = [
    { key: "profile.design", status: "done" },
    { key: "profile.development", status: "active", progress: 70 },
    { key: "profile.testing", status: "pending" },
    { key: "profile.release", status: "pending" },
  ];

  const tabs = [
    { key: "projects" as const, label: "profile.tab.projects", icon: FileText },
    { key: "invoices" as const, label: "profile.tab.invoices", icon: CreditCard },
    { key: "partner" as const, label: "profile.tab.partner", icon: Users },
    { key: "chat" as const, label: "profile.tab.chat", icon: MessageCircle },
  ];

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { from: "you", text: chatInput, textEn: chatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
  };

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <User size={32} className="text-primary" />
          </span>
          <h1 className="text-xl font-bold text-foreground mb-1">{t("profile.login.title")}</h1>
          <p className="text-xs text-muted-foreground mb-6">WebMNS Client Portal</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-3">
          <Input placeholder={t("profile.login.email")} type="email" className="rounded-xl bg-card border-border py-5" />
          <Input placeholder={t("profile.login.password")} type="password" className="rounded-xl bg-card border-border py-5" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setLoggedIn(true)}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20"
          >
            {t("profile.login.button")}
          </motion.button>
          <button className="text-xs text-primary font-medium">{t("profile.login.forgot")}</button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{t("profile.login.or")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setLoggedIn(true)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t("profile.login.google")}
          </motion.button>

          <button className="mt-2 text-xs text-muted-foreground">{t("profile.login.register")}</button>
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
            <h1 className="text-base font-bold text-foreground">{t("profile.greeting")}</h1>
            <p className="text-[10px] text-muted-foreground">alexey@webmns.com</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setLoggedIn(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <LogOut size={14} className="text-muted-foreground" />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <Icon size={14} />
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
              {/* Project 1 - Active */}
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-accent">{t("profile.activeProject")}</p>
                    <p className="text-sm font-bold text-foreground">{t("profile.project1.name")}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                {/* Timeline */}
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

              {/* Project 2 - Completed */}
              <div className="mt-3 rounded-2xl border border-border bg-card p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">✓ {lang === "ru" ? "Завершён" : "Completed"}</p>
                    <p className="text-sm font-bold text-foreground">{t("profile.project2.name")}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>

              {/* Partner Program Link */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onOpenPartner}
                className="mt-3 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <Users size={18} className="text-primary" />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{t("home.partner")}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === "ru" ? "До 20% с каждого заказа" : "Up to 20% per order"}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-primary" />
              </motion.button>
            </motion.div>
          )}

          {activeTab === "invoices" && (
            <motion.div key="invoices" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="no-scrollbar h-full overflow-y-auto px-4 pb-4">
              <div className="mt-3 flex flex-col gap-2">
                {mockInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{lang === "ru" ? inv.titleRu : inv.titleEn}</p>
                      <p className="text-lg font-bold text-foreground">{inv.amount}</p>
                    </div>
                    {inv.status === "paid" ? (
                      <span className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5 text-[11px] font-semibold text-accent">
                        <CheckCircle size={12} />
                        {t("profile.invoice.paid")}
                      </span>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm"
                      >
                        {t("profile.invoice.pay")}
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex h-full flex-col">
              {/* Messages */}
              <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-3">
                <div className="flex flex-col gap-2.5">
                  {messages.map((msg, i) => {
                    const isYou = msg.from === "you";
                    return (
                      <div key={i} className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}>
                        <span className="mb-0.5 text-[9px] font-medium text-muted-foreground">
                          {isYou ? t("profile.chat.you") : t("profile.chat.manager")} · {msg.time}
                        </span>
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                          isYou ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border text-foreground rounded-bl-md"
                        }`}>
                          {lang === "ru" ? msg.text : msg.textEn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Input */}
              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("profile.chat.placeholder")}
                  className="flex-1 rounded-xl bg-card border-border py-5 text-sm"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileScreen;
