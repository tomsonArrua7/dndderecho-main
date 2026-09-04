import React, { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Bell, Sparkles, CheckCircle2, AlertCircle, ArrowRight, X, Repeat2, Check, Swords } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "profile" | "permuta" | "system" | "apuntes" | "duelo";
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
  // localStorage queda solo como cache de arranque para pintar algo antes de
  // que responda la base. La fuente de verdad es trivia_notificaciones.
  const [duelNotifs, setDuelNotifs] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("dnd_duel_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("dnd_dismissed_notifications") || "[]");
    } catch {
      return [];
    }
  });

  // Las notificaciones de duelo ahora las emite el servidor (trigger
  // trg_notificar_duelo_finalizado) en el momento en que cierra la sala, para
  // los dos jugadores. Se leen de la base, así llegan aunque el estudiante
  // haya cerrado la pestaña, esté en otro dispositivo o haya limpiado el caché.
  useEffect(() => {
    if (!user?.id) return;
    let cancelado = false;

    const mapearFila = (r: any) => ({
      notifId: r.id,
      id: r.data?.duelo_id || r.id,
      title: r.titulo,
      description: r.descripcion,
      materiaNombre: r.data?.materia_nombre,
      timestamp: r.created_at
        ? new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Reciente",
      seen: r.leida,
      date: r.created_at ? new Date(r.created_at).getTime() : Date.now()
    });

    const cargar = async () => {
      try {
        const { data, error } = await supabase
          .from("trivia_notificaciones")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (cancelado || error || !data) return;
        const mapeadas = data.map(mapearFila);
        setDuelNotifs(mapeadas);
        try {
          localStorage.setItem("dnd_duel_notifications", JSON.stringify(mapeadas));
        } catch {}
      } catch {}
    };

    cargar();

    // Entrega en vivo: sin polling y sin depender de eventos de la misma pestaña.
    const canal = supabase
      .channel(`notificaciones_trivia_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trivia_notificaciones",
          filter: `user_id=eq.${user.id}`
        },
        () => cargar()
      )
      .subscribe();

    // Red de respaldo por si el canal realtime no levanta.
    const respaldo = setInterval(cargar, 30000);

    return () => {
      cancelado = true;
      clearInterval(respaldo);
      supabase.removeChannel(canal);
    };
  }, [user?.id]);

  if (!user) return null;

  // Evaluate profile completeness
  const missingPhone = !profile?.telefono || profile.telefono.trim() === "";
  const missingAnio = !profile?.anio_ingreso;
  const isProfileIncomplete = missingPhone || missingAnio;

  const baseNotifications: NotificationItem[] = [
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

  const duelNotifications: NotificationItem[] = duelNotifs.map(dn => ({
    id: `duel-${dn.id}`,
    title: dn.title || "⚔️ Duelo 1v1 Finalizado",
    description: dn.description || `Tu rival completó el duelo de ${dn.materiaNombre || 'Trivia'}. ¡Consultá el resultado!`,
    type: "duelo",
    isPending: !dn.seen,
    timestamp: dn.timestamp || "Duelo 1v1",
    actionText: "Ver Marcador",
    actionPath: `/trivia?dueloId=${dn.id}`,
  }));

  const notifications: NotificationItem[] = [...duelNotifications, ...baseNotifications];

  // Active (non-dismissed) notifications count
  const pendingCount = (isProfileIncomplete ? 1 : 0) + duelNotifications.filter(d => !dismissedIds.includes(d.id) && d.isPending).length;

  const handleAction = (item: NotificationItem) => {
    setOpen(false);
    if (item.type === "profile") {
      setIsModalOpen(true);
    } else if (item.type === "duelo") {
      // Marcar duelo notif como vista
      const duelId = item.id.replace("duel-", "");
      const notif = duelNotifs.find((d: any) => d.id === duelId);

      const updated = duelNotifs.map((d: any) => d.id === duelId ? { ...d, seen: true } : d);
      setDuelNotifs(updated);
      try {
        localStorage.setItem("dnd_duel_notifications", JSON.stringify(updated));
      } catch {}

      // Marcarla leída en la base para que quede leída también en el celular.
      if (notif?.notifId) {
        supabase
          .from("trivia_notificaciones")
          .update({ leida: true })
          .eq("id", notif.notifId)
          .then(() => {})
          .catch(() => {});
      }
      if (item.actionPath) navigate(item.actionPath);
    } else if (item.actionPath) {
      navigate(item.actionPath);
    }
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    localStorage.setItem("dnd_dismissed_notifications", JSON.stringify(next));

    // Si es una notificación de duelo, el descarte también viaja a la base
    // para que no reaparezca al abrir la app en otro dispositivo.
    if (id.startsWith("duel-")) {
      const duelId = id.replace("duel-", "");
      const notif = duelNotifs.find((d: any) => d.id === duelId);
      if (notif?.notifId) {
        supabase
          .from("trivia_notificaciones")
          .update({ leida: true })
          .eq("id", notif.notifId)
          .then(() => {})
          .catch(() => {});
      }
    }
  };

  return (
    <>
      {/* Bell Button (High performance touch response) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer border shrink-0 touch-manipulation active:scale-95",
          open
            ? "bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/40"
            : isProfileIncomplete
            ? "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/30"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 dark:border-white/10"
        )}
        title="Notificaciones"
        aria-label="Abrir centro de notificaciones"
      >
        <Bell className="h-4 w-4" strokeWidth={2} />

        {/* Badge count */}
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 text-[9px] font-black text-white items-center justify-center leading-none shadow-md">
              !
            </span>
          </span>
        )}
      </button>

      {/* Notification Center Dialog (Optimized for 0ms lag on mobile WebKit) */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          {/* Opaque dark overlay (No heavy backdrop GPU blurs) */}
          <DialogPrimitive.Overlay className="fixed inset-0 z-[9990] bg-black/70 dark:bg-black/85 transition-opacity duration-150" />

          {/* Flexbox Viewport Centered Container */}
          <div className="fixed inset-0 z-[9991] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
            <DialogPrimitive.Content
              className="pointer-events-auto w-full max-w-sm sm:max-w-md bg-white dark:bg-[#0D1322] border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative outline-none"
            >
              {/* Header */}
              <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <DialogPrimitive.Title className="font-display font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">
                    Notificaciones
                  </DialogPrimitive.Title>
                </div>

                <div className="flex items-center gap-2">
                  {pendingCount > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[9px] font-black uppercase font-mono">
                      1 Pendiente
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Al día
                    </span>
                  )}

                  <DialogPrimitive.Close
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/60 dark:hover:text-white transition-colors cursor-pointer outline-none shrink-0"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </DialogPrimitive.Close>
                </div>
              </div>

              {/* Notifications list */}
              <div className="py-4 space-y-3 overflow-y-auto max-h-[60vh] flex-1">
                {notifications.map((item) => {
                  if (dismissedIds.includes(item.id)) return null;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAction(item)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group",
                        item.isPending
                          ? "bg-red-50/80 border-red-200 dark:bg-red-950/30 dark:border-red-500/50 hover:border-red-400 shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/10"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.type === "profile" && (
                            <div className={cn(
                              "p-1.5 rounded-xl border shrink-0",
                              item.isPending
                                ? "bg-red-500/20 border-red-500/30 text-red-500 dark:text-red-400"
                                : "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            )}>
                              {item.isPending ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </div>
                          )}
                          {item.type === "permuta" && (
                            <div className="p-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-500 dark:text-blue-400 shrink-0">
                              <Repeat2 className="w-4 h-4" />
                            </div>
                          )}
                          {item.type === "duelo" && (
                            <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0">
                              <Swords className="w-4 h-4" />
                            </div>
                          )}
                          <h4 className={cn(
                            "text-xs font-black tracking-tight",
                            item.isPending ? "text-red-900 dark:text-white" : "text-slate-900 dark:text-white/90"
                          )}>
                            {item.title}
                          </h4>
                        </div>

                        <span className="text-[9px] font-mono text-slate-400 dark:text-white/40 shrink-0">
                          {item.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-white/70 leading-relaxed font-sans pl-1">
                        {item.description}
                      </p>

                      {/* Action button inside card */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(item);
                          }}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-xl border touch-manipulation",
                            item.isPending
                              ? "bg-red-600 text-white border-red-600 hover:bg-red-700 dark:bg-red-500/20 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500 dark:hover:text-white"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                          )}
                        >
                          <span>{item.actionText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {!item.isPending && (
                          <button
                            type="button"
                            onClick={(e) => dismissNotification(item.id, e)}
                            className="text-slate-400 hover:text-slate-700 dark:text-white/30 dark:hover:text-white/70 p-1 rounded transition-colors"
                            title="Descartar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer banner for incomplete profiles */}
              {isProfileIncomplete && (
                <div className="pt-3 border-t border-red-200 dark:border-red-500/30 flex items-center justify-between gap-2 shrink-0">
                  <span className="text-[10px] text-red-600 dark:text-red-200 font-semibold leading-tight">
                    ⚠️ Tenés datos pendientes en tu perfil.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-md touch-manipulation"
                  >
                    Completar
                  </button>
                </div>
              )}
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Complete Profile Modal */}
      <CompleteProfileModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
