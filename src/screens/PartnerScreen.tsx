import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { ArrowLeft, Users, Gift, TrendingUp, Star, Copy, Check, DollarSign, UserPlus, Eye, ShoppingCart, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const benefits = [
  { icon: Gift, titleKey: "partner.benefit1", descKey: "partner.benefit1.desc" },
  { icon: TrendingUp, titleKey: "partner.benefit2", descKey: "partner.benefit2.desc" },
  { icon: Star, titleKey: "partner.benefit3", descKey: "partner.benefit3.desc" },
];

interface ReferralData {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  referrals: Array<{
    id: number;
    name: string;
    email: string;
    joined_at: string;
    status: string;
    earnings: number;
  }>;
}

const PartnerScreen = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLang();
  const { isAuthenticated } = useAuth();
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);

  const fetchReferralData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await api.get<{ data: ReferralData }>("/referral");
      if (data.data) {
        setReferralData(data.data);
        setJoined(true);
      }
    } catch (error) {
      console.error("Failed to load referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReferralData();
    }
  }, [isAuthenticated]);

  const refLink = referralData?.referral_link || "https://webmns.com?ref=...";

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success(t("partner.linkCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <ArrowLeft size={20} className="text-muted-foreground" />
        </motion.button>
        <h1 className="text-xl font-bold text-foreground">{t("home.partner")}</h1>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {!joined ? (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-6 mb-5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
                  <Users size={28} className="text-primary" />
                </span>
                <h2 className="text-lg font-bold text-foreground text-center">{t("partner.headline")}</h2>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{t("partner.intro")}</p>
              </motion.div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("partner.benefits")}
              </h3>

              <div className="flex flex-col gap-3 mb-5">
                {benefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 rounded-2xl bg-card border border-border p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                        <Icon size={18} className="text-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t(b.titleKey)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(b.descKey)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("partner.how")}
              </h3>

              <div className="flex flex-col gap-2 mb-5">
                {["partner.step1", "partner.step2", "partner.step3"].map((key, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 rounded-xl bg-card border border-border p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{t(key)}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isAuthenticated) {
                    fetchReferralData();
                  }
                  setJoined(true);
                }}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                {t("partner.join")}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: DollarSign, value: referralData ? `€${referralData.total_earnings}` : "€0", label: t("partner.earned") },
                  { icon: UserPlus, value: referralData?.total_referrals?.toString() || "0", label: t("partner.referrals") },
                  { icon: Eye, value: "—", label: t("partner.clicks") },
                  { icon: ShoppingCart, value: "—", label: t("partner.orders") },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex flex-col items-center gap-1 rounded-2xl bg-card border border-border p-4"
                    >
                      <Icon size={18} className="text-primary" />
                      <span className="text-lg font-bold text-foreground">{s.value}</span>
                      <span className="text-[10px] text-muted-foreground">{s.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Referral link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-card border border-border p-4 mb-4"
              >
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  {t("partner.yourLink")}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground truncate">
                    {refLink}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Balance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl border border-primary/30 bg-primary/10 p-4 mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {t("partner.balance")}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    €{referralData?.total_earnings || 0}
                  </span>
                </div>
                <Progress
                  value={Math.min(((referralData?.total_earnings || 0) / 1000) * 100, 100)}
                  className="h-1.5 bg-secondary [&>div]:bg-primary"
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  €{referralData?.total_earnings || 0} / €1000 {t("partner.toBonus")}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  {t("partner.withdraw")}
                </motion.button>
              </motion.div>

              {/* Referral history */}
              {referralData && referralData.referrals.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {t("partner.history")}
                  </h3>
                  <div className="flex flex-col gap-2 mb-4">
                    {referralData.referrals.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                        className="flex items-center justify-between rounded-xl bg-card border border-border p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{r.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(r.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">€{r.earnings}</p>
                          <span className={`text-[10px] font-semibold ${r.status === "active" ? "text-accent" : "text-warning"}`}>
                            {r.status === "active" ? t("partner.paid") : t("partner.pending")}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default PartnerScreen;
