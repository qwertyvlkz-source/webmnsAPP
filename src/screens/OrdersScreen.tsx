import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  ClipboardList, Loader2, AlertCircle, ChevronRight,
  Clock, CheckCircle, Circle, CreditCard, ExternalLink,
  RefreshCw,
} from "lucide-react";

interface WebsiteOrder {
  id: number;
  order_number: string;
  website_type: string;
  status: string;
  budget: number;
  deadline: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  waiting_payment: "bg-amber-500/15 text-amber-600",
  paid: "bg-blue-500/15 text-blue-600",
  in_progress: "bg-primary/15 text-primary",
  review: "bg-purple-500/15 text-purple-600",
  completed: "bg-accent/15 text-accent",
  cancelled: "bg-destructive/15 text-destructive",
};

const statusIcons: Record<string, typeof Clock> = {
  waiting_payment: Clock,
  paid: CreditCard,
  in_progress: Loader2,
  review: ClipboardList,
  completed: CheckCircle,
  cancelled: Circle,
};

const OrdersScreen = () => {
  const { t } = useLang();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<WebsiteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WebsiteOrder | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

  const fetchOrders = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await api.get<{ success: boolean; data: WebsiteOrder[] }>("/website-orders");
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      if (!showRefresh) {
        // Silent fail on first load
      } else {
        toast.error(t("common.serverError"));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusKey = (status: string) => {
    const key = `orders.status.${status}`;
    const translated = t(key);
    return translated !== key ? translated : status;
  };

  const handlePay = async (orderId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPayingOrderId(orderId);
    try {
      const data = await api.post<{ paymentUrl?: string; message?: string }>("/payments/create", { orderId });
      if (data.paymentUrl) {
        window.open(data.paymentUrl, "_blank");
      } else {
        toast.error(data.message || t("common.serverError"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(t("common.serverError"));
    } finally {
      setPayingOrderId(null);
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 gap-3">
        <ClipboardList size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground text-center">{t("orders.loginRequired")}</p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">{t("orders.title")}</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
        >
          <RefreshCw size={14} className={`text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 gap-3">
          <ClipboardList size={48} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{t("orders.empty")}</p>
        </div>
      ) : (
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          <AnimatePresence>
            {orders.map((order, i) => {
              const StatusIcon = statusIcons[order.status] || Circle;
              const colorClass = statusColors[order.status] || "bg-secondary text-secondary-foreground";
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedOrder(order)}
                  className="mt-3 rounded-2xl border border-border bg-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground">{order.order_number}</p>
                      <p className="text-sm font-bold text-foreground">{order.website_type}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${colorClass}`}>
                      <StatusIcon size={10} className={order.status === "in_progress" ? "animate-spin" : ""} />
                      {getStatusKey(order.status)}
                    </span>
                    <span className="text-sm font-bold text-foreground">€{order.budget.toLocaleString()}</span>
                  </div>

                  {order.status === "waiting_payment" && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={payingOrderId === order.id}
                      onClick={(e) => handlePay(order.id, e)}
                      className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {payingOrderId === order.id ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                      {t("orders.pay")}
                    </motion.button>
                  )}

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-card border-t border-border p-5 pb-8"
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">{selectedOrder.order_number}</p>
                <h2 className="text-lg font-bold text-foreground">{selectedOrder.website_type}</h2>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusColors[selectedOrder.status] || "bg-secondary text-secondary-foreground"}`}>
                {getStatusKey(selectedOrder.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-secondary/50 p-3">
                <p className="text-[10px] text-muted-foreground uppercase">{t("order.price")}</p>
                <p className="text-lg font-bold text-foreground">€{selectedOrder.budget.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-3">
                <p className="text-[10px] text-muted-foreground uppercase">{t("order.deadline")}</p>
                <p className="text-sm font-semibold text-foreground">
                  {selectedOrder.deadline ? new Date(selectedOrder.deadline).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            {selectedOrder.status === "waiting_payment" && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={payingOrderId === selectedOrder.id}
                onClick={() => handlePay(selectedOrder.id)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {payingOrderId === selectedOrder.id ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
                {t("orders.pay")} — €{selectedOrder.budget.toLocaleString()}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrdersScreen;
