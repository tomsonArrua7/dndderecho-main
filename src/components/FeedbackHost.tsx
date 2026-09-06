import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareHeart, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { FeedbackModal, FEEDBACK_ENVIADO_KEY } from "@/components/FeedbackModal";

/** Cualquier parte de la app abre la encuesta disparando este evento. */
export const EVENTO_ABRIR_FEEDBACK = "dnd_abrir_feedback";

export const abrirFeedback = () => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_FEEDBACK));

const INVITACION_DESCARTADA_KEY = "dnd_feedback_invitacion_descartada";
const DEMORA_INVITACION_MS = 45_000;

/**
 * Monta la encuesta una sola vez para toda la app y decide cuándo invitar a
 * completarla. La invitación aparece una única vez por usuario: si la descarta
 * o la responde, no vuelve.
 */
export const FeedbackHost = () => {
  const { user } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [invitacionVisible, setInvitacionVisible] = useState(false);

  useEffect(() => {
    const abrir = () => setModalAbierto(true);
    window.addEventListener(EVENTO_ABRIR_FEEDBACK, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_FEEDBACK, abrir);
  }, []);

  useEffect(() => {
    if (!user) return;

    let vigente = true;
    let timer: ReturnType<typeof setTimeout>;

    const evaluar = async () => {
      try {
        if (localStorage.getItem(FEEDBACK_ENVIADO_KEY) || localStorage.getItem(INVITACION_DESCARTADA_KEY)) return;
      } catch {}

      // Se consulta la base además del localStorage: alguien que respondió
      // desde el celular no debería volver a ver la invitación en la compu.
      const { count, error } = await supabase
        .from("feedback_general")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error || !vigente) return;
      if ((count ?? 0) > 0) {
        try { localStorage.setItem(FEEDBACK_ENVIADO_KEY, "1"); } catch {}
        return;
      }

      timer = setTimeout(() => vigente && setInvitacionVisible(true), DEMORA_INVITACION_MS);
    };

    evaluar();
    return () => { vigente = false; clearTimeout(timer); };
  }, [user]);

  const descartarInvitacion = () => {
    setInvitacionVisible(false);
    try { localStorage.setItem(INVITACION_DESCARTADA_KEY, "1"); } catch {}
  };

  return (
    <>
      <AnimatePresence>
        {invitacionVisible && !modalAbierto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            /* Abajo a la izquierda: a la derecha ya viven el Tutor IA y WhatsApp. */
            className="fixed bottom-5 left-5 z-[9000] max-w-[280px] rounded-2xl bg-[#0D1527] border border-white/15 shadow-2xl p-4 space-y-2.5"
          >
            <button
              onClick={descartarInvitacion}
              aria-label="No, gracias"
              className="absolute top-2 right-2 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 pr-6">
              <MessageSquareHeart className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs font-black text-white">¿Nos das una mano?</span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Contanos qué te parece la página. Es menos de un minuto y nos sirve muchísimo.
            </p>
            <button
              onClick={() => { setInvitacionVisible(false); setModalAbierto(true); }}
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] uppercase tracking-wider cursor-pointer transition-all"
            >
              Dar mi opinión
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setInvitacionVisible(false);
        }}
      />
    </>
  );
};
