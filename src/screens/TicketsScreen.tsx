import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Send, Loader2, MessageCircle,
  AlertCircle, Clock, CheckCircle, Circle,
  ChevronRight,
} from "lucide-react";

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  messages_count?: number;
}

interface TicketMessage {
  id: number;
  message: string;
  is_admin: number;
  created_at: string;
  user_name?: string;
  user?: { name: string } | null;
}

interface TicketDetail extends Ticket {
  messages: TicketMessage[];
}

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  open: { color: "bg-blue-500/15 text-blue-600", icon: Circle },
  in_progress: { color: "bg-amber-500/15 text-amber-600", icon: Clock },
  resolved: { color: "bg-accent/15 text-accent", icon: CheckCircle },
  closed: { color: "bg-secondary text-muted-foreground", icon: CheckCircle },
};

const TicketsScreen = () => {
  const { t } = useLang();
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "detail" | "create">("list");
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Create form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [creating, setCreating] = useState(false);

  // Chat
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const data = await api.get<{ success: boolean; data: Ticket[] }>("/tickets");
      if (data.success) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const openTicket = async (ticketId: number) => {
    setLoadingDetail(true);
    setView("detail");
    try {
      const data = await api.get<TicketDetail>(`/tickets/${ticketId}`);
      setSelectedTicket(data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (error) {
      console.error("Failed to load ticket:", error);
      toast.error(t("common.serverError"));
      setView("list");
    } finally {
      setLoadingDetail(false);
    }
  };

  const createTicket = async () => {
    if (!subject.trim() || !message.trim()) return;
    setCreating(true);
    try {
      const data = await api.post<{ success: boolean; id: number }>("/tickets", {
        subject: subject.trim(),
        message: message.trim(),
        priority,
      });
      if (data.success) {
        toast.success(t("tickets.status.open"));
        setSubject("");
        setMessage("");
        setPriority("medium");
        setView("list");
        fetchTickets();
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error(t("common.serverError"));
    } finally {
      setCreating(false);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await api.post(`/tickets/${selectedTicket.id}/messages`, {
        message: chatInput.trim(),
      });
      setChatInput("");
      // Refresh ticket
      await openTicket(selectedTicket.id);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(t("common.serverError"));
    } finally {
      setSending(false);
    }
  };

  const getStatusKey = (status: string) => {
    const key = `tickets.status.${status}`;
    const translated = t(key);
    return translated !== key ? translated : status;
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 gap-3">
        <MessageCircle size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground text-center">{t("orders.loginRequired")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {/* TICKET LIST */}
        {view === "list" && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h1 className="text-xl font-bold text-foreground">{t("tickets.title")}</h1>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setView("create")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
              >
                <Plus size={16} className="text-primary-foreground" />
              </motion.button>
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
                <MessageCircle size={48} className="text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t("tickets.empty")}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("create")}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  {t("tickets.new")}
                </motion.button>
              </div>
            ) : (
              <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
                {tickets.map((ticket, i) => {
                  const config = statusConfig[ticket.status] || statusConfig.open;
                  const StatusIcon = config.icon;
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => openTicket(ticket.id)}
                      className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{ticket.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.color}`}>
                            <StatusIcon size={9} />
                            {getStatusKey(ticket.status)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground shrink-0 ml-2" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* CREATE TICKET */}
        {view === "create" && (
          <motion.div key="create" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-1 flex-col overflow-hidden px-4 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView("list")}>
                <ArrowLeft size={20} className="text-muted-foreground" />
              </motion.button>
              <h1 className="text-xl font-bold text-foreground">{t("tickets.new")}</h1>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              <Input
                placeholder={t("tickets.subject")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl border-border bg-card py-5"
              />

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">
                  {t("tickets.priority")}
                </label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <motion.button
                      key={p}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setPriority(p)}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                        priority === p
                          ? p === "high" ? "bg-destructive/15 text-destructive border-2 border-destructive/30" : "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {t(`tickets.priority.${p}`)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("tickets.message")}
                rows={5}
                className="w-full rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="pb-4 pt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={!subject.trim() || !message.trim() || creating}
                onClick={createTicket}
                className={`flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-semibold ${
                  subject.trim() && message.trim() && !creating
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/40 text-primary-foreground/50"
                }`}
              >
                {creating && <Loader2 size={16} className="animate-spin" />}
                {t("tickets.create")}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* TICKET DETAIL (CHAT) */}
        {view === "detail" && (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setView("list"); setSelectedTicket(null); }}>
                <ArrowLeft size={20} className="text-muted-foreground" />
              </motion.button>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-bold text-foreground truncate">{selectedTicket?.subject || "..."}</h1>
                {selectedTicket && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold mt-0.5 ${statusConfig[selectedTicket.status]?.color || statusConfig.open.color}`}>
                    {getStatusKey(selectedTicket.status)}
                  </span>
                )}
              </div>
            </div>

            {loadingDetail ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-3">
                  <div className="flex flex-col gap-2.5">
                    {selectedTicket?.messages.map((msg, i) => {
                      const isAdmin = msg.is_admin === 1;
                      const senderName = isAdmin
                        ? (msg.user?.name || msg.user_name || t("profile.chat.manager"))
                        : t("profile.chat.you");
                      return (
                        <div key={msg.id || i} className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
                          <span className="mb-0.5 text-[9px] font-medium text-muted-foreground">
                            {senderName} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                            isAdmin
                              ? "bg-card border border-border text-foreground rounded-bl-md"
                              : "bg-primary text-primary-foreground rounded-br-md"
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                {selectedTicket && selectedTicket.status !== "closed" && (
                  <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder={t("profile.chat.placeholder")}
                      className="flex-1 rounded-xl bg-card border-border py-5 text-sm"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={sendMessage}
                      disabled={!chatInput.trim() || sending}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                    >
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketsScreen;
