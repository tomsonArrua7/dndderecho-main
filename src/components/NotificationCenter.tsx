import React, { useState, useEffect, useRef } from "react";
import { Bell, Sparkles, CheckCircle2, AlertCircle, ArrowRight, X, Repeat2, BookOpen, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "profile" | "permuta" | "system" | "apuntes";
  isPending: boolean;
  timestamp: string;
  actionText?: string;
  actionPath?: string;
}

export const NotificationCenter: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("dnd_dismissed_notifications") || "[]");
    } catch {      return [];
    }
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  // Evaluate profile completeness
  const missingPhone = !profile?.telefono || profile.telefono.trim() === "";
  const missingAnio = !profile?.anio_ingreso;
  const isProfileIncomplete = missingPhone || missingAnio;

  const notifications: NotificationItem[] = [
    {
      id: "completar-perfil",
      title: isProfileIncomplete ? "¡Completá tu perfil!" : "Perfil completado",
      description: isProfileIncomplete
        ? `Te falta cargar: ${[missingPhone ? "teléfono" : "", missingAnio ? "año de ingreso" : ""].filter(Boolean).join(" y ")}. Es clave para permutar comisiones.`
        : "Tenés tu número de teléfono y año de ingreso al día.",
      type: "profile",
      isPending: isProfileIncomplete,
      timestamp: "Sistema",
      actionText: isProfileIncomplete ? "Completar ahora" : "Editar perfil",
    },
    {
      id: "permutero-activo",
      title: "Permutas de Comisiones",
      description: "Publicá tu comisión o buscá coincidencias con otros compañeros de la facultad.",
      type: "permuta",
      isPending: false,
      timestamp: "Info",
      actionText: "Ir al Permutero",
      actionPath: "/permutero",
    },
  ];

  // Active (non-dismissed) notifications count
  const pendingCount = isProfileIncomplete ? 1 : 0;

  const handleAction = (item: NotificationItem) => {
    setOpen(false);
    if (item.type === "profile") {
      setIsModalOpen(true);
    } else if (item.actionPath) {
      navigate(item.actionPath);
    }
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    localStorage.setItem("dnd_dismissed_notifications", JSON.stringify(next));
  };

  return (
    <>
      <div ref={containerRef} className="relative inline-block">
        {/* Bell Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "relative p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer border",
            open
              ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(220,38,38,0.3)]"
              : isProfileIncomplete
              ? "text-red-400 hover:bg-red-500/10 border-red-500/30 animate-pulse"
              : "text-white/60 hover:text-white hover:bg-white/10 border-white/10"
          )}
          title="Notificaciones"
          aria-label="Abrir centro de notificaciones"
        >
          <Bell className="h-4 w-4" strokeWidth={2} />

          {/* Badge count */}
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 text-[9px] font-black text-white items-center justify-center leading-none">
                !
              </span>
            </span>
          )}
        </motion.button>

        {/* Mobile backdrop overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden"
            />
          )}
        </AnimatePresence>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-3 top-16 z-50 max-w-sm mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96 sm:max-w-none"
            >
              <div className="bg-[#0A0E1A]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-none">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      <Bell className="w-4 h-4" />
                    </div>
                    <span className="font-display font-black text-xs uppercase tracking-widest text-white">
                      Notificaciones
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {pendingCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase font-mono">
                        1 Pendiente
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" /> Al día
                      </span>
                    )}

                    <button
                      onClick={() => setOpen(false)}
                      className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      title="Cerrar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications list */}
                <div className="p-3 space-y-2.5 max-h-[60vh] sm:max-h-80 overflow-y-auto">
                  {notifications.map((item) => {
                    if (dismissedIds.includes(item.id)) return null;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleAction(item)}
                        className={cn(
                          "p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group",
                          item.isPending
                            ? "bg-gradient-to-r from-red-950/30 via-slate-900/40 to-slate-900/60 border-red-500/40 hover:border-red-400 shadow-md"
                            : "bg-white/[0.02] border-white/10 hover:border-white/20"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.type === "profile" && (
                              <div className={cn(
                                "p-1.5 rounded-xl border shrink-0",
                                item.isPending
                                  ? "bg-red-500/20 border-red-500/30 text-red-400"
                                  : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                              )}>
                                {item.isPending ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                              </div>
                            )}
                            {item.type === "permuta" && (
                              <div className="p-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 shrink-0">
                                <Repeat2 className="w-4 h-4" />
                              </div>
                            )}
                            <h4 className={cn(
                              "text-xs font-black tracking-tight",
                              item.isPending ? "text-white" : "text-white/80"
                            )}>
                              {item.title}
                            </h4>
                          </div>

                          <span className="text-[9px] font-mono text-white/30 shrink-0">
                            {item.timestamp}
                          </span>
                        </div>

                        <p className="text-[11px] text-white/60 leading-relaxed font-sans pl-1">
                          {item.description}
                        </p>

                        {/* Action button inside card */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(item);
                            }}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer",
                              item.isPending
                                ? "text-red-400 hover:text-red-300"
                                : "text-white/50 hover:text-white"
                            )}
                          >
                            <span>{item.actionText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          {!item.isPending && (
                            <button
                              onClick={(e) => dismissNotification(item.id, e)}
                              className="text-white/20 hover:text-white/60 p-1 rounded transition-colors"
                              title="Descartar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer banner for incomplete profiles */}
                {isProfileIncomplete && (
                  <div className="p-3 bg-red-950/40 border-t border-red-500/20 flex items-center justify-between">
                    <span className="text-[10px] text-red-300 font-medium">
                      ⚠️ Tenés datos pendientes en tu perfil.
                    </span>
                    <button
                      onClick={() => {
                        setOpen(false);
                        setIsModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Completar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Complete Profile Modal */}
      <CompleteProfileModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
