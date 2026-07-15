import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Bell, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type?: string;
  read: boolean | number;
  created_at: string;
}

const TopAppBar = () => {
  const { isAuthenticated } = useAuth();
  const { t, lang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await api.get<{ notifications: NotificationItem[] }>("/notifications");
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) void loadNotifications();
    else setNotifications([]);
  }, [isAuthenticated, loadNotifications]);

  const handleNotificationsOpen = async (open: boolean) => {
    setNotificationsOpen(open);
    if (!open || !isAuthenticated) return;
    await loadNotifications();
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    } catch {
      // Reading notifications still works if marking them as read fails.
    }
  };

  const hasUnread = notifications.some((item) => !item.read);
  const isDark = resolvedTheme !== "light";

  return (
    <>
      <header className="relative z-10 flex items-center justify-between border-b border-white/30 bg-background/70 px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)] shadow-[0_8px_30px_rgba(70,48,150,0.06)] backdrop-blur-2xl dark:border-white/5">
        {/* Animated rocket logo + DIGITAL AGENCY (webmns.com style) */}
        <div className="flex items-center gap-2.5">
        <motion.div
          animate={{ y: [0, -2.5, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-blue-500/15 shadow-sm"
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
        <div className="flex flex-col leading-[1.05]">
          <span className="label-mono bg-gradient-to-r from-violet-700 to-fuchsia-500 bg-clip-text text-[12px] font-black tracking-[0.1em] text-transparent dark:from-violet-300 dark:to-fuchsia-300">
            DIGITAL
          </span>
          <span className="label-mono bg-gradient-to-r from-fuchsia-500 to-blue-500 bg-clip-text text-[12px] font-black tracking-[0.1em] text-transparent">
            AGENCY
          </span>
        </div>
        </div>

        <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => void handleNotificationsOpen(true)}
          aria-label={t("notifications.title")}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-card/80 text-foreground shadow-[0_6px_18px_rgba(65,47,135,0.10)] backdrop-blur-md dark:border-white/10"
        >
          <Bell size={18} className="text-foreground" />
          {hasUnread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? t("settings.light") : t("settings.dark")}
          aria-pressed={isDark}
          title={isDark ? t("settings.light") : t("settings.dark")}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-card/80 text-foreground shadow-[0_6px_18px_rgba(65,47,135,0.10)] backdrop-blur-md dark:border-white/10"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        </div>
      </header>

      <Dialog open={notificationsOpen} onOpenChange={(open) => void handleNotificationsOpen(open)}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>{t("notifications.title")}</DialogTitle>
            <DialogDescription>{t("notifications.description")}</DialogDescription>
          </DialogHeader>
          {!isAuthenticated ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("notifications.loginRequired")}</p>
          ) : loading ? (
            <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-primary" /></div>
          ) : notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("notifications.empty")}</p>
          ) : (
            <div className="no-scrollbar max-h-[60vh] space-y-2 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className={`rounded-xl border p-3 ${notification.read ? "border-border bg-secondary/40" : "border-primary/30 bg-primary/10"}`}>
                  <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">{new Date(notification.created_at).toLocaleString(lang)}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopAppBar;
