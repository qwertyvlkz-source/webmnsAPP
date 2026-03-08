import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { User, CreditCard, MessageCircle, CheckCircle, Circle, Loader2 } from "lucide-react";

const ProfileScreen = () => {
  const { t } = useLang();

  const steps = [
    { key: "profile.design", status: "done" },
    { key: "profile.development", status: "active", progress: 70 },
    { key: "profile.testing", status: "pending" },
    { key: "profile.release", status: "pending" },
  ];

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4 pt-4">
      {/* Avatar & Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
          <User size={24} className="text-primary" />
        </span>
        <h1 className="text-lg font-bold text-foreground">{t("profile.greeting")}</h1>
      </motion.div>

      {/* Active Project */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-2xl border border-border bg-card p-4"
      >
        <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
          {t("profile.activeProject")}
        </p>
        <p className="text-base font-bold text-foreground">{t("profile.projectName")}</p>
      </motion.div>

      {/* Timeline */}
      <div className="mb-6 pl-2">
        {steps.map((s, i) => {
          const isDone = s.status === "done";
          const isActive = s.status === "active";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex gap-3"
            >
              {/* Line + Icon */}
              <div className="flex flex-col items-center">
                {isDone ? (
                  <CheckCircle size={22} className="text-accent" />
                ) : isActive ? (
                  <Loader2 size={22} className="animate-spin text-primary" />
                ) : (
                  <Circle size={22} className="text-muted-foreground/40" />
                )}
                {i < steps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 ${
                      isDone ? "bg-accent/40" : "bg-border"
                    }`}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-5">
                <span
                  className={`text-sm font-semibold ${
                    isDone
                      ? "text-accent"
                      : isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t(s.key)}
                </span>
                {isActive && s.progress !== undefined && (
                  <div className="mt-2 w-48">
                    <Progress
                      value={s.progress}
                      className="h-2 bg-secondary [&>div]:bg-primary"
                    />
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {s.progress}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          <CreditCard size={16} />
          {t("profile.pay")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground"
        >
          <MessageCircle size={16} />
          {t("profile.contact")}
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileScreen;
