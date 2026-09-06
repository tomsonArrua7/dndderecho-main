import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flag, X, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TriviaQuestion } from "@/data/triviaData";
import { cn } from "@/lib/utils";

export interface ReportarPreguntaModalProps {
  isOpen: boolean;
  pregunta: TriviaQuestion | null;
  userId?: string;
  onClose: () => void;
}

const MOTIVOS = [
  { id: "respuesta_incorrecta", label: "La respuesta correcta está mal" },
  { id: "redaccion", label: "Está mal redactada o se entiende mal" },
  { id: "desactualizada", label: "El contenido está desactualizado" },
  { id: "otro", label: "Otro" }
] as const;

/**
 * Reporte de una pregunta del banco. Es deliberadamente corto: un motivo y, si
 * quiere, un comentario. Cuanto más pide, menos gente lo usa.
 */
export const ReportarPreguntaModal: React.FC<ReportarPreguntaModalProps> = ({
  isOpen,
  pregunta,
  userId,
  onClose
}) => {
  const [motivo, setMotivo] = useState<string>("respuesta_incorrecta");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!isOpen || !pregunta) return null;

  const enviar = async () => {
    if (!userId) {
      toast.error("Necesitás iniciar sesión para reportar.");
      return;
    }
    setEnviando(true);
    try {
      const { error } = await supabase.from("trivia_reportes_pregunta").insert({
        pregunta_id: pregunta.id,
        user_id: userId,
        motivo,
        comentario: comentario.trim() || null,
        pregunta_texto: pregunta.pregunta,
        materia: pregunta.categoria_nombre,
        origen: pregunta.origen || null
      });

      // El código 23505 es la restricción única: ya había reportado esta misma
      // pregunta. No es un error que valga la pena mostrarle como tal.
      if (error && (error as { code?: string }).code !== "23505") throw error;

      toast.success("¡Gracias! Vamos a revisarla.");
      setComentario("");
      onClose();
    } catch (err) {
      console.error("Error al reportar la pregunta:", err);
      toast.error("No se pudo enviar el reporte. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10060] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white relative"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pr-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5" /> Reportar pregunta
          </span>
          <h3 className="text-lg font-black">¿Qué le pasa a esta pregunta?</h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.04] rounded-2xl p-3 line-clamp-3">
          {pregunta.pregunta}
        </p>

        <div className="space-y-2">
          {MOTIVOS.map(m => (
            <button
              key={m.id}
              onClick={() => setMotivo(m.id)}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2",
                motivo === m.id
                  ? "bg-red-500/10 border-red-500/60 text-red-700 dark:text-red-300"
                  : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              )}
            >
              <span>{m.label}</span>
              {motivo === m.id && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value.slice(0, 400))}
          placeholder="Contanos algo más (opcional)"
          rows={2}
          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
        />

        <button
          onClick={enviar}
          disabled={enviando}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider cursor-pointer transition-all"
        >
          {enviando ? "Enviando..." : "Enviar reporte"}
        </button>
      </motion.div>
    </div>
  );
};
