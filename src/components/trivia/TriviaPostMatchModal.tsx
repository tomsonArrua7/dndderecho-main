import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  Scale, 
  Zap, 
  ShieldAlert, 
  Medal, 
  Swords, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { RangoJuridico, calcularRango, RANGOS_JURIDICOS } from "@/data/triviaData";
import { cn } from "@/lib/utils";

export interface TriviaPostMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  resultado: "victoria" | "derrota" | "empate" | "evaluacion_completada";
  puntosCambio: number; // Ej: +25, +50, -15
  puntosTotalesAntes: number;
  puntosTotalesDespues: number;
  correctAnswersCount: number;
  totalQuestions: number;
  maxStreak: number;
  isDuel1v1?: boolean;
  duelDetails?: {
    rivalNombre: string;
    p1Nombre: string;
    p1Puntos: number;
    p1Aciertos: number;
    p2Nombre: string;
    p2Puntos: number;
    p2Aciertos: number;
  };
}

export const TriviaPostMatchModal: React.FC<TriviaPostMatchModalProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  resultado,
  puntosCambio,
  puntosTotalesAntes,
  puntosTotalesDespues,
  correctAnswersCount,
  totalQuestions,
  maxStreak,
  isDuel1v1 = false,
  duelDetails
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showFloatingText, setShowFloatingText] = useState(false);

  const rangoAntes = calcularRango(puntosTotalesAntes);
  const rangoDespues = calcularRango(puntosTotalesDespues);

  const proximoRangoIndex = RANGOS_JURIDICOS.findIndex(r => r.id === rangoDespues.id) + 1;
  const proximoRango = RANGOS_JURIDICOS[proximoRangoIndex] || null;

  // Porcentaje antes y después para la animación de la barra
  const percentAntes = proximoRango
    ? Math.max(5, Math.min(100, Math.round(((puntosTotalesAntes - rangoDespues.minPuntos) / (proximoRango.minPuntos - rangoDespues.minPuntos)) * 100)))
    : 100;

  const percentDespues = proximoRango
    ? Math.max(5, Math.min(100, Math.round(((puntosTotalesDespues - rangoDespues.minPuntos) / (proximoRango.minPuntos - rangoDespues.minPuntos)) * 100)))
    : 100;

  useEffect(() => {
    if (isOpen) {
      // Iniciar con la barra en el valor anterior
      setAnimatedProgress(percentAntes);
      setShowFloatingText(false);

      // Tras 400ms, animar la barra hacia el nuevo porcentaje
      const barTimer = setTimeout(() => {
        setAnimatedProgress(percentDespues);
        setShowFloatingText(true);
      }, 500);

      return () => clearTimeout(barTimer);
    }
  }, [isOpen, percentAntes, percentDespues]);

  if (!isOpen) return null;

  const isVictoria = resultado === "victoria" || (resultado === "evaluacion_completada" && puntosCambio >= 0);
  const isDerrota = resultado === "derrota" || (resultado === "evaluacion_completada" && puntosCambio < 0);
  const isEmpate = resultado === "empate";

  const precisionPorcentaje = totalQuestions > 0 
    ? Math.round((correctAnswersCount / totalQuestions) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-gradient-to-b from-[#111C35] via-[#0A1326] to-[#060B16] border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black relative overflow-hidden text-center space-y-5"
      >
        {/* Glow ambient de fondo */}
        <div className={cn(
          "absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40",
          isVictoria ? "bg-emerald-500" : isDerrota ? "bg-rose-600" : "bg-amber-500"
        )} />

        {/* 1. TÍTULO GIGANTE DE IMPACTO (VICTORIA / DERROTA / EMPATE) */}
        <div className="relative z-10 space-y-2 pt-2">
          <div className="flex justify-center">
            <div className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center border shadow-2xl transition-transform duration-300",
              isVictoria ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-emerald-950/60 animate-bounce" :
              isDerrota ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-rose-950/60" :
              "bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-950/60"
            )}>
              {isVictoria && <Trophy className="w-10 h-10 drop-shadow-md text-amber-300" />}
              {isDerrota && <XCircle className="w-10 h-10 drop-shadow-md text-rose-400" />}
              {isEmpate && <Scale className="w-10 h-10 drop-shadow-md text-amber-300" />}
            </div>
          </div>

          <h2 className={cn(
            "text-3xl sm:text-4xl font-black uppercase tracking-tight drop-shadow-lg",
            isVictoria ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300" :
            isDerrota ? "text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-300 to-orange-400" :
            "text-amber-300"
          )}>
            {isVictoria && "¡VICTORIA!"}
            {isDerrota && "DERROTA"}
            {isEmpate && "¡EMPATE!"}
          </h2>

          <p className="text-xs text-slate-300 font-medium">
            {isDuel1v1 && duelDetails ? (
              <span>Duelo directo vs <strong className="text-white">{duelDetails.rivalNombre}</strong></span>
            ) : (
              <span>Sesión de Entrenamiento Completada</span>
            )}
          </p>
        </div>

        {/* 2. ANIMACIÓN CENTRAL DE LA BARRA DE PUNTOS DE RANGO + TEXTO FLOTANTE */}
        <div className="relative z-10 bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <span>{isDuel1v1 ? "Progreso de Rango Oficial (1vs1)" : "Entrenamiento Individual (Sin variación de Rango)"}</span>
            </span>
            <span className="font-mono text-amber-300 font-black">
              {puntosTotalesDespues.toLocaleString()} PTS DE RANGO
            </span>
          </div>

          {/* CONTENEDOR DE LA BARRA CON TEXTO FLOTANTE */}
          <div className="relative pt-6 pb-1">
            
            {/* TEXTO FLOTANTE ANIMADO (+50 PTS en verde brillante, -15 PTS en rojo o +0 en práctica) */}
            <AnimatePresence>
              {showFloatingText && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: -22, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={cn(
                    "absolute top-0 right-2 px-3 py-1 rounded-full text-xs sm:text-sm font-black font-mono shadow-xl border flex items-center gap-1 z-20",
                    !isDuel1v1
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : puntosCambio >= 0 
                      ? "bg-emerald-500 text-black border-emerald-300 shadow-emerald-500/50 animate-bounce" 
                      : "bg-rose-600 text-white border-rose-300 shadow-rose-600/50 animate-pulse"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {!isDuel1v1 ? "Modo Práctica (0 Pts de Rango)" : (puntosCambio >= 0 ? `+${puntosCambio}` : puntosCambio) + " PTS DE RANGO"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pista de la barra */}
            <div className="w-full h-4 sm:h-5 bg-slate-950 rounded-full p-0.5 border border-white/15 shadow-inner overflow-hidden relative">
              <div
                style={{ width: `${animatedProgress}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                  puntosCambio >= 0 
                    ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-md shadow-emerald-500/50" 
                    : "bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 shadow-md shadow-rose-600/50"
                )}
              >
                {/* Brillo dinámico */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <img 
                src={rangoDespues.imagenUrl || `/logos-rangos/Nivel${rangoDespues.nivel || 1}.png`} 
                alt={rangoDespues.nombre} 
                className="w-4 h-4 object-contain shrink-0" 
              />
              <span>Rango: <strong className="text-white">Nivel {rangoDespues.nivel || 1} • {rangoDespues.nombre}</strong></span>
            </div>
            {proximoRango && (
              <div className="flex items-center gap-1.5">
                <img 
                  src={proximoRango.imagenUrl || `/logos-rangos/Nivel${proximoRango.nivel || 2}.png`} 
                  alt={proximoRango.nombre} 
                  className="w-3.5 h-3.5 object-contain shrink-0" 
                />
                <span>Próximo: <strong className="text-amber-300">{proximoRango.nombre}</strong></span>
              </div>
            )}
          </div>

        </div>

        {/* 3. DESGLOSE 1V1 (SI ES DUELO) O ESTADÍSTICAS */}
        {isDuel1v1 && duelDetails ? (
          <div className="relative z-10 grid grid-cols-2 gap-2 text-left">
            <div className={cn(
              "p-3 rounded-2xl border flex flex-col justify-between",
              isVictoria ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10"
            )}>
              <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{duelDetails.p1Nombre}</span>
              <span className="text-lg font-black text-white font-mono">{duelDetails.p1Puntos} PTS</span>
              <span className="text-[10px] text-emerald-400 font-bold">{duelDetails.p1Aciertos}/5 aciertos</span>
            </div>

            <div className={cn(
              "p-3 rounded-2xl border flex flex-col justify-between",
              isDerrota ? "bg-rose-500/10 border-rose-500/30" : "bg-white/5 border-white/10"
            )}>
              <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{duelDetails.p2Nombre}</span>
              <span className="text-lg font-black text-white font-mono">{duelDetails.p2Puntos} PTS</span>
              <span className="text-[10px] text-rose-400 font-bold">{duelDetails.p2Aciertos}/5 aciertos</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Aciertos</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {correctAnswersCount} / {totalQuestions}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Precisión</span>
              <span className="text-base font-black text-amber-300 font-mono">
                {precisionPorcentaje}%
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Racha</span>
              <span className="text-base font-black text-blue-400 font-mono">
                x{maxStreak}
              </span>
            </div>
          </div>
        )}

        {/* 4. BOTONES DE ACCIÓN GIGANTES */}
        <div className="relative z-10 flex flex-col gap-2.5 pt-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onPlayAgain}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[52px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>JUGAR OTRA PARTIDA</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-all cursor-pointer min-h-[46px]"
          >
            Volver al Menú Principal
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
