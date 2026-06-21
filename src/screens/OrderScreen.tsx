import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CheckCircle, Globe, ShoppingCart, Building2, Sparkles,
  ArrowLeft, Smartphone, Apple, Loader2, AlertCircle,
  FileText, Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

/** Parse a JSON-encoded locale string like {"en":"Landing","uk":"Лендінг",...} */
function parseLocale(val: string | null | undefined, lang: string): string {
  if (!val) return "";
  try {
    const obj = JSON.parse(val);
    if (typeof obj === "object" && obj !== null) {
      return obj[lang] || obj.en || obj.uk || Object.values(obj)[0] || val;
    }
  } catch {
    // not JSON, return as-is
  }
  return val;
}

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

const fallbackIcons: Record<string, typeof Globe> = {
  "Landing": Globe,
  "Лендінг": Globe,
  "Лендинг": Globe,
  "E-commerce": ShoppingCart,
  "Online Store": ShoppingCart,
  "Інтернет-магазин": ShoppingCart,
  "Интернет-магазин": ShoppingCart,
  "Corporate": Building2,
  "Корпоративний": Building2,
  "Корпоративный": Building2,
  "Custom": Sparkles,
  "Android": Smartphone,
  "iPhone": Apple,
  "iOS": Apple,
  "Blog": FileText,
  "Блог": FileText,
  "Portfolio": Globe,
  "Web Application": Globe,
};

function getIconForService(name: string): typeof Globe {
  for (const [key, icon] of Object.entries(fallbackIcons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return Globe;
}

const OrderScreen = () => {
  const { t, lang } = useLang();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 3;

  // Load services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get<{ success: boolean; services: Service[] }>("/services", { noAuth: true });
        if (data.success && data.services) {
          setServices(data.services);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
        toast.error(t("common.serverError"));
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [t]);

  const canNext =
    (step === 0 && selectedService) ||
    (step === 1 && description.trim()) ||
    (step === 2 && name && (phone || email));

  const handleSubmit = async () => {
    if (!selectedService) return;
    setSubmitting(true);

    try {
      // If authenticated, create via API
      if (isAuthenticated) {
        await api.post("/website-orders", {
          service_id: selectedService.id,
          description: JSON.stringify({
            type: selectedService.name,
            description,
            deadline,
            contact_name: name,
            contact_phone: phone,
            contact_email: email,
          }),
          total: selectedService.price,
        });
      }
      setStep(3);
    } catch (error) {
      console.error("Order submission error:", error);
      // Even if API fails, show success for non-authenticated users
      if (!isAuthenticated) {
        setStep(3);
      } else {
        toast.error(t("common.serverError"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedService(null);
    setDescription("");
    setDeadline("");
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden px-4 pt-4">
      {step < 3 && (
        <>
          <div className="mb-1 flex items-center gap-3">
            {step > 0 && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setStep(step - 1)}>
                <ArrowLeft size={20} className="text-muted-foreground" />
              </motion.button>
            )}
            <h1 className="text-xl font-bold text-foreground">{t("order.title")}</h1>
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} className="mb-5 h-1.5 bg-secondary [&>div]:bg-primary" />
        </>
      )}

      <AnimatePresence mode="wait">
        {/* Step 0: Select Service */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex-1 overflow-y-auto no-scrollbar">
            <p className="mb-4 text-sm font-medium text-muted-foreground">{t("order.step1")}</p>

            {loadingServices ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">{t("order.loadingServices")}</span>
              </div>
            ) : services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <AlertCircle size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("common.serverError")}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setLoadingServices(true); window.location.reload(); }}
                  className="text-xs text-primary font-semibold"
                >
                  {t("common.retry")}
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-2">
                {services.map((service) => {
                  const Icon = getIconForService(parseLocale(service.name, "en"));
                  const selected = selectedService?.id === service.id;
                  return (
                    <motion.button
                      key={service.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedService(service)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-colors ${
                        selected ? "border-primary bg-primary/10" : "border-border bg-card"
                      }`}
                    >
                      <Icon size={28} className={selected ? "text-primary" : "text-muted-foreground"} />
                      <span className={`text-xs font-semibold text-center leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
                        {parseLocale(service.name, lang)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {t("order.from")} €{Number(service.price).toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 1: Describe Project */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex-1">
            <p className="mb-4 text-sm font-medium text-muted-foreground">{t("order.step2")}</p>

            {selectedService && (
              <div className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  {(() => { const Icon = getIconForService(parseLocale(selectedService.name, "en")); return <Icon size={20} className="text-primary" />; })()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{parseLocale(selectedService.name, lang)}</p>
                  <p className="text-xs text-muted-foreground">{t("order.from")} €{Number(selectedService.price).toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  <FileText size={12} className="inline mr-1" />
                  {t("order.description")} *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("order.wishes")}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  <Calendar size={12} className="inline mr-1" />
                  {t("order.deadline")}
                </label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="rounded-xl border-border bg-card py-5 text-foreground"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Contact Info */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex-1">
            <p className="mb-4 text-sm font-medium text-muted-foreground">{t("order.step3")}</p>
            <div className="flex flex-col gap-3">
              <Input
                placeholder={t("order.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border bg-card py-6 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder={t("order.phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-border bg-card py-6 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder={t("order.email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-border bg-card py-6 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>
        )}

        {/* Success */}
        {step === 3 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <CheckCircle size={72} className="text-accent" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">{t("order.success")}</h2>
            <p className="text-sm text-muted-foreground text-center">{t("order.successDesc")}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="mt-4 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
            >
              {t("order.newOrder")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 3 && (
        <div className="pb-4 pt-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!canNext || submitting}
            onClick={() => (step === 2 ? handleSubmit() : setStep(step + 1))}
            className={`flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-semibold transition-opacity ${
              canNext && !submitting
                ? "bg-primary text-primary-foreground"
                : "bg-primary/40 text-primary-foreground/50"
            }`}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {step === 2 ? t("order.submit") : t("order.next")}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default OrderScreen;
