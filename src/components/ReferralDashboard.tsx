import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock3, Copy, Euro, RefreshCw, UserPlus, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageContext";
import type { ReferralData } from "@/lib/referral";

const locales = {
  uk: "uk-UA",
  ru: "ru-RU",
  en: "en-US",
  pl: "pl-PL",
  de: "de-DE",
} as const;

interface ReferralDashboardProps {
  data: ReferralData | null;
  error?: string;
  onRetry?: () => void;
}

const ReferralDashboard = ({ data, error, onRetry }: ReferralDashboardProps) => {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);

  const money = (value: number) =>
    new Intl.NumberFormat(locales[lang], {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  const handleCopy = async () => {
    if (!data?.referral_link) return;
    try {
      await navigator.clipboard.writeText(data.referral_link);
      setCopied(true);
      toast.success(t("partner.linkCopied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("common.error"));
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-5 text-center">
        <p className="text-sm font-semibold text-foreground">{t("partner.loadError")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw size={14} />
            {t("common.retry")}
          </button>
        )}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Euro, value: money(data.total_earnings), label: t("partner.available") },
          { icon: UserPlus, value: String(data.total_referrals), label: t("partner.referrals") },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon size={17} className="text-primary" />
              </span>
              <p className="text-xl font-bold tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-cyan-500/10 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/70">
              <Clock3 size={17} className="text-primary" />
            </span>
            <div>
              <p className="text-[11px] text-muted-foreground">{t("partner.pendingEarnings")}</p>
              <p className="text-base font-bold text-foreground">{money(data.pending_earnings)}</p>
            </div>
          </div>
          <p className="max-w-[155px] text-right text-[10px] leading-relaxed text-muted-foreground">
            {t("partner.rewardNote")}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-4"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("partner.yourLink")}
          </p>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            {data.referral_code}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 truncate rounded-xl bg-secondary px-3 py-3 text-xs text-foreground">
            {data.referral_link}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            disabled={!data.referral_link}
            aria-label={t("partner.copyLink")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
          </motion.button>
        </div>
      </motion.div>

      <div className="pt-1">
        <div className="mb-3 flex items-center gap-2">
          <UsersRound size={16} className="text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("partner.history")}
          </h3>
        </div>

        {data.referrals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-7 text-center">
            <p className="text-sm font-semibold text-foreground">{t("partner.empty")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("partner.emptyDesc")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.referrals.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 + index * 0.05 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{referral.name || referral.email}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {new Date(referral.joined_at).toLocaleDateString(locales[lang])}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-[10px] font-semibold ${referral.status === "active" ? "text-emerald-500" : "text-amber-500"}`}>
                    {referral.status === "active" ? t("partner.active") : t("partner.pending")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;
