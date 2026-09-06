import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swords, Calendar, Dices, ArrowRight, Copy, Check } from "lucide-react";
import { RamaId, getRamaById, getMateriasDeRama, CICLO_RAMAS } from "@/data/ramasTrivia";
import { cn } from "@/lib/utils";

export interface RuletaRamasModalProps {
  isOpen: boolean;
  ramaFija: RamaId;
  ramaAzar: RamaId;
  /** "crear" = acabás de abrir la sala. "unirse" = entrás a una sala ya sorteada. */
  modo: "crear" | "unirse";
  codigoSala?: string;
  onConfirmar: () => void;
  onCerrar: () => void;
}

/**
 * El resultado ya viene decidido y guardado en la sala: la ruleta lo revela, no
 * lo decide. Por eso el rival que entra después ve girar lo mismo que el creador.
 * La rama de la semana no gira (no es azar y sería engañoso mostrarla como tal):
 * se muestra de entrada y sólo sortea la segunda.
 */
export const RuletaRamasModal: React.FC<RuletaRamasModalProps> = ({
  isOpen,
  ramaFija,
  ramaAzar,
  modo,
  codigoSala,
  onConfirmar,
  onCerrar
}) => {
  const [girando, setGirando] = useState(true);
  const [visible, setVisible] = useState<RamaId>(ramaAzar);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setGirando(true);

    const candidatas = CICLO_RAMAS.filter(r => r !== ramaFija);
    let i = 0;
    let delay = 60;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      i++;
      setVisible(candidatas[i % candidatas.length]);
      delay = delay * 1.18;
      if (delay < 320) {
        timeout = setTimeout(tick, delay);
      } else {
        setVisible(ramaAzar);
        setGirando(false);
      }
    };
    timeout = setTimeout(tick, delay);

    return () => clearTimeout(timeout);
  }, [isOpen, ramaFija, ramaAzar]);

  if (!isOpen) return null;

  const fija = getRamaById(ramaFija);
  const azar = getRamaById(visible);
  const azarFinal = getRamaById(ramaAzar);

  return (
    <div className="fixed inset-0 z-[10050] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gradient-to-b dark:from-[#111C35] dark:via-[#0A1326] dark:to-[#060B16] border border-slate-200 dark:border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white relative overflow-hidden"
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
            {modo === "crear" ? "Sala creada" : "Entrando a la sala"}
            {codigoSala ? ` · ${codigoSala}` : ""}
          </span>
          <h3 className="text-xl font-black tracking-tight">Ramas del duelo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {modo === "crear"
              ? "Estas son las dos ramas que te tocaron. Tu rival va a responder exactamente lo mismo."
              : "El sorteo ya estaba hecho: te toca lo mismo que a quien creó la sala."}
          </p>
        </div>

        {/* RAMA FIJA DE LA SEMANA — no gira, no es azar */}
        <div className="relative z-10 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Rama de la semana
          </span>
          <h4 className="text-base font-black">{fija.nombre}</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">{fija.detalle}</p>
        </div>

        {/* SEGUNDA RAMA — esta sí se sortea */}
        <div className={cn(
          "relative z-10 p-4 rounded-2xl border space-y-1 transition-colors",
          girando
            ? "bg-slate-100 dark:bg-white/[0.04] border-slate-300 dark:border-white/20"
            : "bg-red-500/10 border-red-500/40"
        )}>
          <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <Dices className={cn("w-3.5 h-3.5", girando && "animate-spin")} />
            {girando ? "Sorteando segunda rama..." : "Segunda rama"}
          </span>
          <motion.h4
            key={azar.id + String(girando)}
            initial={{ opacity: 0.4, y: girando ? -6 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-base font-black", girando && "text-slate-500 dark:text-slate-400")}
          >
            {azar.nombre}
          </motion.h4>
          {!girando && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400">{azarFinal.detalle}</p>
          )}
        </div>

        {!girando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 text-[11px] text-slate-500 dark:text-slate-400 text-center"
          >
            5 preguntas · 20s por turno · 3 de {fija.nombre} y 2 de {azarFinal.nombre}
          </motion.div>
        )}

        {modo === "crear" && codigoSala && (
          <div className="relative z-10 p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Código para invitar
              </span>
              <span className="font-mono font-black text-lg text-red-600 dark:text-red-400 tracking-widest">
                {codigoSala}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(codigoSala);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
              }}
              className="p-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 cursor-pointer transition-all shrink-0 border border-slate-200 dark:border-transparent"
              title="Copiar código"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-2">
          <button
            onClick={onConfirmar}
            disabled={girando}
            className={cn(
              "w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all",
              girando
                ? "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white cursor-pointer active:scale-98"
            )}
          >
            <Swords className="w-4 h-4" />
            <span>{modo === "crear" ? "Empezar a responder" : "Aceptar duelo"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onCerrar}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-all"
          >
            {modo === "crear" ? "Después la juego" : "Cancelar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
