import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  BookOpenCheck, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Zap,
  Lock
} from "lucide-react";
import { TriviaQuestion } from "@/data/triviaData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface PowerUpsState {
  nulidadCount: number; // 50/50
  apelacionCount: number; // Escudo
  prorrogaCount: number; // +10s
  isApelacionActive: boolean; // Estado activo en la pregunta actual
  disabledOptionIndices: number[]; // Opciones anuladas por 50/50
}

export interface TriviaInGameViewProps {
  currentQuestion: TriviaQuestion;
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
  maxTime?: number;
  streak: number;
  selectedOption: number | null;
  isAnswered: boolean;
  onSelectOption: (index: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  solicitarExplicacionIA: (q: TriviaQuestion, selectedIndex: number) => void;
  loadingExplicacion: boolean;
  explicacionIA: string | null;
  powerUps: PowerUpsState;
  onUseNulidad: () => void;
  onUseApelacion: () => void;
  onUseProrroga: () => void;
  isDuelMode?: boolean;
}

export const TriviaInGameView: React.FC<TriviaInGameViewProps> = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
  timeLeft,
  maxTime = 20,
  streak,
  selectedOption,
  isAnswered,
  onSelectOption,
  onNextQuestion,
  isLastQuestion,
  solicitarExplicacionIA,
  loadingExplicacion,
  explicacionIA,
  powerUps,
  onUseNulidad,
  onUseApelacion,
  onUseProrroga,
  isDuelMode = false
}) => {
  // Cálculo SVG del Temporizador Circular
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const timeProgress = Math.max(0, Math.min(1, timeLeft / maxTime));
  const strokeDashoffset = circumference - (timeProgress * circumference);

  const isCriticalTime = timeLeft <= 5;
  const isWarningTime = timeLeft > 5 && timeLeft <= 10;

  const timerColor = isCriticalTime 
    ? "text-rose-500 stroke-rose-500" 
    : isWarningTime 
    ? "text-amber-400 stroke-amber-400" 
    : "text-emerald-400 stroke-emerald-400";

  const timerGlow = isCriticalTime 
    ? "shadow-[0_0_20px_rgba(244,63,94,0.4)] border-rose-500/50" 
    : isWarningTime 
    ? "shadow-[0_0_15px_rgba(251,191,36,0.3)] border-amber-500/40" 
    : "shadow-[0_0_15px_rgba(52,211,153,0.2)] border-emerald-500/30";

  return (
    <div className="w-full min-h-screen bg-[#050B14] text-white flex flex-col items-center justify-start px-3 sm:px-4 pt-3 pb-28 relative overflow-x-hidden select-none">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg mx-auto flex flex-col gap-4 relative z-10">
        
        {/* 1. TOP BAR: Conteo de Preguntas, Racha y Materia */}
        <div className="w-full flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0A1C3D] text-blue-300 text-xs font-black uppercase tracking-wider border border-[#0F2A5C] shadow-sm">
              {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="text-xs text-slate-400 font-bold max-w-[150px] sm:max-w-[200px] truncate">
              {currentQuestion.categoria_nombre}
            </span>
          </div>

          {streak > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40 animate-pulse shadow-md"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Racha x{streak}</span>
            </motion.div>
          )}
        </div>

        {/* 2. TEMPORIZADOR CIRCULAR EN LA PARTE SUPERIOR CENTRAL */}
        <div className="w-full flex justify-center py-1">
          <div className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center bg-[#0B1325]/90 border backdrop-blur-xl transition-all duration-300",
            timerGlow,
            isCriticalTime && "animate-pulse scale-105"
          )}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
              {/* Círculo de fondo */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Círculo animado de progreso */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={cn("transition-all duration-300 ease-out", timerColor)}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Texto del tiempo en el centro */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={cn(
                "font-mono font-black text-xl tracking-tight transition-colors duration-300",
                isCriticalTime ? "text-rose-400 scale-110" : isWarningTime ? "text-amber-300" : "text-emerald-300"
              )}>
                {timeLeft}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono -mt-1">
                seg
              </span>
            </div>

            {/* Alerta de Apelación Activa */}
            {powerUps.isApelacionActive && (
              <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-indigo-400 animate-bounce">
                🛡️ Escudo
              </div>
            )}
          </div>
        </div>

        {/* 3. CARD ELEVADA DE LA PREGUNTA */}
        <motion.div
          key={`q_${currentQuestion.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-3xl bg-gradient-to-b from-[#0F1A30]/95 via-[#0A1325]/95 to-[#060D1B]/98 border border-white/15 p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden space-y-4"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Pregunta de Evaluación</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                currentQuestion.dificultad === "dificil" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                currentQuestion.dificultad === "media" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              )}>
                {currentQuestion.dificultad || "media"}
              </span>
            </div>

            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-relaxed pt-1">
              {currentQuestion.pregunta}
            </h3>
          </div>
        </motion.div>

        {/* 4. 4 BOTONES DE RESPUESTA GRANDES (TOUCH-FRIENDLY & FEEDBACK TÁCTIL) */}
        <div className="w-full flex flex-col gap-3">
          {currentQuestion.opciones.map((opc, idx) => {
            const isSelected = selectedOption === idx;
            const isRight = idx === currentQuestion.respuesta_correcta_index;
            const isDisabledBy5050 = powerUps.disabledOptionIndices.includes(idx);

            let buttonStyle = "bg-[#0A1326]/90 border-white/10 hover:bg-[#101C35] hover:border-white/20 text-slate-100";

            if (isDisabledBy5050) {
              buttonStyle = "bg-slate-950/40 border-white/5 text-slate-600 line-through opacity-40 cursor-not-allowed pointer-events-none";
            } else if (isAnswered) {
              if (isRight) {
                buttonStyle = "bg-emerald-600/30 border-emerald-400 text-emerald-100 font-black shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/40";
              } else if (isSelected && !isRight) {
                buttonStyle = "bg-rose-600/30 border-rose-500 text-rose-100 font-black shadow-lg shadow-rose-950/60 ring-2 ring-rose-500/40";
              } else {
                buttonStyle = "bg-slate-950/50 border-white/5 text-slate-500 opacity-40";
              }
            }

            return (
              <motion.button
                key={idx}
                disabled={isAnswered || isDisabledBy5050}
                onClick={() => onSelectOption(idx)}
                whileTap={!isAnswered && !isDisabledBy5050 ? { scale: 0.98 } : {}}
                className={cn(
                  "w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 text-xs sm:text-sm md:text-base flex items-center justify-between gap-3 cursor-pointer min-h-[58px] active:scale-[0.98] active:brightness-125 shadow-md",
                  buttonStyle
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Letra A, B, C, D */}
                  <span className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 font-mono border transition-colors",
                    isDisabledBy5050 ? "bg-black/30 border-white/5 text-slate-600" :
                    isAnswered && isRight ? "bg-emerald-500/40 border-emerald-300 text-emerald-100 shadow-sm" :
                    isAnswered && isSelected && !isRight ? "bg-rose-500/40 border-rose-300 text-rose-100 shadow-sm" :
                    "bg-white/10 border-white/15 text-slate-200"
                  )}>
                    {isDisabledBy5050 ? <Lock className="w-3.5 h-3.5" /> : String.fromCharCode(65 + idx)}
                  </span>

                  <span className="leading-snug break-words">
                    {opc}
                  </span>
                </div>

                {isAnswered && isRight && (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 animate-bounce" />
                )}
                {isAnswered && isSelected && !isRight && (
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 5. FUNDAMENTO JURÍDICO & TUTOR PEDAGÓGICO IA */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-[#0A1C3D]/60 border border-[#0F2A5C] text-blue-200 text-xs space-y-2.5 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-black uppercase tracking-wider text-[10px] text-blue-300 flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4 text-blue-400" /> Fundamento Normativo Oficial:
                </span>
                
                {selectedOption !== currentQuestion.respuesta_correcta_index && (
                  <button
                    onClick={() => solicitarExplicacionIA(currentQuestion, selectedOption!)}
                    disabled={loadingExplicacion}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{loadingExplicacion ? "Consultando IA..." : "¿Por qué me equivoqué? (IA)"}</span>
                  </button>
                )}
              </div>

              <p className="leading-relaxed text-slate-200 text-xs sm:text-sm">
                {currentQuestion.fundamento_juridico || "Conforme al Código y la doctrina aplicable al Plan de Estudios de la FCJyS UNLP."}
              </p>

              {explicacionIA && (
                <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Explicación Pedagógica del Tutor IA:
                  </span>
                  <p className="leading-relaxed font-medium text-slate-200 text-xs sm:text-sm">{explicacionIA}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTÓN SIGUIENTE PREGUNTA */}
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNextQuestion}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[54px]"
          >
            <span>{isLastQuestion ? "Ver Resultados de Partida" : "Siguiente Pregunta"}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}

      </div>

      {/* 6. BOTTOM BAR ANCLADA AL PIE DEL CELULAR (POWER-UPS DOCK) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070D1B]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around gap-3">
          
          {/* POWER-UP 1: NULIDAD (50/50) */}
          <button
            onClick={onUseNulidad}
            disabled={isAnswered || powerUps.nulidadCount <= 0 || powerUps.disabledOptionIndices.length > 0}
            className={cn(
              "flex flex-col items-center gap-1 group cursor-pointer transition-all active:scale-95 min-w-[64px]",
              (isAnswered || powerUps.nulidadCount <= 0 || powerUps.disabledOptionIndices.length > 0) && "opacity-40 pointer-events-none"
            )}
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black font-mono shadow">
                {powerUps.nulidadCount}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              Nulidad (50/50)
            </span>
          </button>

          {/* POWER-UP 2: APELACIÓN (ESCUDO SEGUNDA OPORTUNIDAD) */}
          <button
            onClick={onUseApelacion}
            disabled={isAnswered || powerUps.apelacionCount <= 0 || powerUps.isApelacionActive}
            className={cn(
              "flex flex-col items-center gap-1 group cursor-pointer transition-all active:scale-95 min-w-[64px]",
              (isAnswered || powerUps.apelacionCount <= 0 || powerUps.isApelacionActive) && "opacity-40 pointer-events-none"
            )}
          >
            <div className={cn(
              "relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md group-hover:scale-105 transition-transform",
              powerUps.isApelacionActive && "ring-2 ring-indigo-400 animate-pulse"
            )}>
              <ShieldCheck className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-black font-mono shadow">
                {powerUps.apelacionCount}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">
              Apelación
            </span>
          </button>

          {/* POWER-UP 3: PRÓRROGA (+10S) */}
          <button
            onClick={onUseProrroga}
            disabled={isAnswered || powerUps.prorrogaCount <= 0}
            className={cn(
              "flex flex-col items-center gap-1 group cursor-pointer transition-all active:scale-95 min-w-[64px]",
              (isAnswered || powerUps.prorrogaCount <= 0) && "opacity-40 pointer-events-none"
            )}
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[10px] font-black font-mono shadow">
                {powerUps.prorrogaCount}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
              +10 Segundos
            </span>
          </button>

        </div>
      </div>

    </div>
  );
};
