import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Bell, CheckCheck, X, Info, ShoppingCart, MessageSquare, AlertTriangle } from "lucide-react";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/i18n/LanguageContext";

/** Pick the right icon for notification type */
function NotifIcon({ type }: { type: string }) {
  const cls = "w-4 h-4 shrink-0";
  switch (type) {
    case "order":
      return <ShoppingCart className={`${cls} text-emerald-500`} />;
    case "ticket":
    case "message":
      return <MessageSquare className={`${cls} text-blue-500`} />;
    case "warning":
      return <AlertTriangle className={`${cls} text-amber-500`} />;
    default:
      return <Info className={`${cls} text-primary`} />;
  }
}

/** Format relative time (e.g. "2m ago", "3h ago", "yesterday") */
function timeAgo(dateStr: string, lang: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === "uk" || lang === "ru") {
    if (mins < 1) return "щойно";
    if (mins < 60) return `${mins} хв`;
    if (hours < 24) return `${hours} год`;
    if (days === 1) return "вчора";
    return `${days} д`;
  }
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "yesterday";
  return `${days}d`;
}

const TopAppBar = () => {
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { t, lang } = useLang();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelOpen]);

  const handleBellClick = () => {
    if (!isAuthenticated) return;
    setPanelOpen((prev) => !prev);
  };

  const handleNotifClick = (n: Notification) => {
    if (!n.read) {
      markAsRead(n.id);
    }
  };

  return (
    <div className="relative z-30 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 bg-background/60 backdrop-blur-xl border-b border-border/40">
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
        <div className="flex flex-col leading-[1.05] ml-1.5">
          <span className="text-[11px] font-black tracking-[0.18em] text-foreground uppercase">
            DIGITAL
          </span>
          <span className="text-[11px] font-black tracking-[0.18em] bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase drop-shadow-sm">
            AGENCY
          </span>
        </div>
      </div>

      {/* Notification bell */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleBellClick}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/70 shadow-sm backdrop-blur-md"
      >
        <Bell size={18} className="text-foreground" />
        {isAuthenticated && unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-card"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-4 top-full mt-1 w-[calc(100vw-32px)] max-w-sm rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/70 shadow-2xl overflow-hidden z-50"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">{t("settings.notifications")}</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => markAllAsRead()}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
                  >
                    <CheckCheck size={12} />
                    {lang === "ru" || lang === "uk" ? "Прочитать все" : "Mark all read"}
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPanelOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-[360px] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Bell size={28} className="text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">
                    {lang === "ru" || lang === "uk" ? "Нет уведомлений" : "No notifications yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {notifications.map((n) => (
                    <motion.button
                      key={n.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNotifClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                        n.read ? "bg-transparent" : "bg-primary/5"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        n.read ? "bg-secondary/60" : "bg-primary/10"
                      }`}>
                        <NotifIcon type={n.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-semibold leading-tight truncate ${
                            n.read ? "text-muted-foreground" : "text-foreground"
                          }`}>
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug line-clamp-2">
                          {n.message}
                        </p>
                        <span className="mt-1 block text-[10px] text-muted-foreground/60">
                          {timeAgo(n.created_at, lang)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopAppBar;
