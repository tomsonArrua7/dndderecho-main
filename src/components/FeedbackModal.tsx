import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, X, MessageSquareHeart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

/** Herramientas que se puntúan. El id es la clave que se guarda en jsonb. */
export const HERRAMIENTAS = [
  { id: "general", label: "La página en general" },
  { id: "trivia", label: "Trivia Jurídica" },
  { id: "biblioteca", label: "Biblioteca de apuntes" },
  { id: "asistente", label: "Asistente DND (IA)" },
  { id: "permutero", label: "Permutero" }
] as const;

export const FEEDBACK_ENVIADO_KEY = "dnd_feedback_enviado";

interface EstrellasProps {
  valor: number;
  onChange: (v: number) => void;
}

const Estrellas: React.FC<EstrellasProps> = ({ valor, onChange }) => (
  <div className="flex items-center gap-0.5 shrink-0">
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
        onClick={() => onChange(valor === n ? 0 : n)}
        className="p-0.5 cursor-pointer transition-transform active:scale-90"
      >
        <Star
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
            n <= valor ? "text-amber-400 fill-amber-400" : "text-slate-400 dark:text-slate-600"
          )}
        />
      </button>
    ))}
  </div>
);

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Encuesta corta: estrellas por herramienta y un comentario, todo opcional
 * salvo que haya puntuado algo. Entra en una sola pantalla a propósito, porque
 * cuanto más larga, menos gente la termina.
 */
export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [puntajes, setPuntajes] = useState<Record<string, number>>({});
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!isOpen) return null;

  const algoPuntuado = Object.values(puntajes).some(v => v > 0);

  const enviar = async () => {
    if (!user) {
      toast.error("Necesitás iniciar sesión para dejar tu opinión.");
      return;
    }
    if (!algoPuntuado && !comentario.trim()) {
      toast.info("Puntuá al menos una herramienta o dejanos un comentario.");
      return;
    }

    setEnviando(true);
    try {
      const limpios = Object.fromEntries(Object.entries(puntajes).filter(([, v]) => v > 0));
      const { error } = await supabase.from("feedback_general").insert({
        user_id: user.id,
        puntajes: limpios,
        comentario: comentario.trim() || null
      });
      if (error) throw error;

      try { localStorage.setItem(FEEDBACK_ENVIADO_KEY, "1"); } catch {}
      toast.success("¡Gracias! Tu opinión nos sirve un montón.");
      onClose();
    } catch (err) {
      console.error("Error al enviar feedback:", err);
      toast.error("No se pudo enviar. Probá de nuevo en un rato.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10060] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white relative max-h-[88dvh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pr-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <MessageSquareHeart className="w-3.5 h-3.5" /> Tu opinión
          </span>
          <h3 className="text-lg font-black">¿Cómo venimos?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Puntuá lo que uses. Te lleva menos de un minuto y nos ayuda a saber qué mejorar.
          </p>
        </div>

        <div className="space-y-1">
          {HERRAMIENTAS.map(h => (
            <div
              key={h.id}
              className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 dark:border-white/5 last:border-0"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 min-w-0">{h.label}</span>
              <Estrellas
                valor={puntajes[h.id] || 0}
                onChange={v => setPuntajes(p => ({ ...p, [h.id]: v }))}
              />
            </div>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value.slice(0, 600))}
          placeholder="¿Qué agregarías, sacarías o arreglarías? (opcional)"
          rows={3}
          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
        />

        <button
          onClick={enviar}
          disabled={enviando}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider cursor-pointer transition-all"
        >
          {enviando ? "Enviando..." : "Enviar mi opinión"}
        </button>
      </motion.div>
    </div>
  );
};
