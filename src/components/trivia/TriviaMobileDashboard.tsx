import React from "react";
import { motion } from "framer-motion";
import { 
  Swords, 
  BookOpen, 
  Sparkles, 
  Trophy, 
  Flame, 
  Shield, 
  ChevronRight, 
  Zap, 
  RotateCcw, 
  Scale, 
  Landmark, 
  Gavel, 
  Building2, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  Award, 
  BookOpenCheck, 
  Medal, 
  Users, 
  Share2, 
  Calendar,
  HelpCircle
} from "lucide-react";
import { RangoJuridico, RANGOS_JURIDICOS } from "@/data/triviaData";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Building2,
  GraduationCap,
  FileText,
  Briefcase,
  Award,
  Scale,
  BookOpenCheck,
  Gavel,
  Landmark,
  Medal,
  Sparkles,
  Shield,
  Trophy
};

export interface TriviaMobileDashboardProps {
  userName: string;
  userStats: {
    totalJugadas: number;
    totalCorrectas: number;
    puntosTotales: number;
    mejorRacha: number;
    victoriasDuelo: number;
    derrotasDuelo: number;
    empatesDuelo: number;
    puntosDuelista: number;
  };
  rangoActual: RangoJuridico;
  proximoRango: RangoJuridico | null;
  progresoPorcentaje: number;
  puntosFaltantes: number;
  seasonInfo: {
    isStarted: boolean;
    bannerTitle: string;
    badgeText: string;
    countdownText: string;
    weeklyCountdown: string;
    monthlyCountdown: string;
  };
  onStartRanked: () => void;
  onStartSolo: () => void;
  onOpenParcialFlash: () => void;
  onOpenRangosModal: () => void;
  onOpenGuideModal: () => void;
  onSelectTab: (tab: "evaluacion" | "duelos" | "ranking") => void;
  activeTab: "evaluacion" | "duelos" | "ranking";
}

export const TriviaMobileDashboard: React.FC<TriviaMobileDashboardProps> = ({
  userName,
  userStats,
  rangoActual,
  proximoRango,
  progresoPorcentaje,
  puntosFaltantes,
  seasonInfo,
  onStartRanked,
  onStartSolo,
  onOpenParcialFlash,
  onOpenRangosModal,
  onOpenGuideModal,
  onSelectTab,
  activeTab
}) => {
  const RangoIcon = ICON_MAP[rangoActual.iconoNombre] || Shield;
  const totalPartidas1v1 = (userStats.victoriasDuelo || 0) + (userStats.derrotasDuelo || 0) + (userStats.empatesDuelo || 0);
  const winrate1v1 = totalPartidas1v1 > 0 
    ? Math.round(((userStats.victoriasDuelo || 0) / totalPartidas1v1) * 100) 
    : 0;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-5 px-3 sm:px-4 py-4 md:py-6 pb-28 select-none">
      
      {/* 1. TOP SEASON BANNER BADGE */}
      <div className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-red-600/15 via-amber-500/10 to-blue-600/15 border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
          <span className="text-[11px] font-black text-white uppercase tracking-wider truncate">
            {seasonInfo.badgeText}
          </span>
        </div>
        <button
          onClick={onOpenGuideModal}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Reglas</span>
        </button>
      </div>

      {/* 2. PLAYER CARD PRINCIPAL (MOBILE FIRST) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111C35]/95 via-[#0A1326]/95 to-[#060B16]/98 border border-white/15 p-5 sm:p-6 shadow-2xl shadow-black/70 backdrop-blur-xl"
      >
        {/* Glow ambient de rango */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Header del Player Card: Avatar + Rango + Puntos */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Escudo / Icono del Rango */}
              <div 
                onClick={onOpenRangosModal}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-0.5 border shadow-xl shrink-0 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br",
                  rangoActual.colorGradient || "from-amber-500 to-red-600",
                  "border-white/30"
                )}
              >
                <div className="w-full h-full rounded-[14px] bg-[#070D1D]/90 flex items-center justify-center text-amber-300 shadow-inner">
                  <RangoIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>

              {/* Nombre y Título del Rango */}
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                  Perfil de Jugador
                </span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  {userName}
                </h2>
                <div 
                  onClick={onOpenRangosModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-0.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-black cursor-pointer hover:bg-white/15 transition-all"
                >
                  <span>{rangoActual.nombre}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Puntos Elo / MMR Display */}
            <div className="text-right shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono block">
                ELO / MMR
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">
                {userStats.puntosTotales.toLocaleString()}
                <span className="text-xs font-bold text-amber-300/80 ml-1">PTS</span>
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO DE ELO GRUESA Y MUY VISUAL */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <span>Nivel de Rango</span>
              </span>
              <span className="font-mono text-amber-300 font-black">
                {progresoPorcentaje}%
              </span>
            </div>

            {/* Contenedor de la barra gruesa */}
            <div className="w-full h-4 sm:h-4.5 bg-slate-950/90 rounded-full p-0.5 border border-white/15 shadow-inner overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, Math.min(100, progresoPorcentaje))}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full bg-gradient-to-r shadow-md relative overflow-hidden",
                  rangoActual.colorGradient || "from-amber-500 via-orange-500 to-red-500"
                )}
              >
                {/* Efecto Shimmer brillante */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>

            {/* Texto de puntos faltantes para el próximo rango */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-0.5">
              <span>
                {proximoRango ? (
                  <span>
                    Faltan <strong className="text-amber-300 font-mono font-black">{puntosFaltantes} pts</strong> para <strong className="text-white">{proximoRango.nombre}</strong>
                  </span>
                ) : (
                  <span className="text-amber-300 font-black">👑 ¡Rango Máximo Alcanzado!</span>
                )}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {userStats.puntosTotales} / {proximoRango ? proximoRango.minPuntos : "MAX"}
              </span>
            </div>
          </div>

          {/* Quick Stats Chips */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Partidas</span>
              <span className="text-xs font-black text-white font-mono">{userStats.totalJugadas}</span>
            </div>
            <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Mejor Racha</span>
              <span className="text-xs font-black text-amber-400 font-mono flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-500" /> x{userStats.mejorRacha}
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Winrate 1v1</span>
              <span className="text-xs font-black text-emerald-400 font-mono">{winrate1v1}%</span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* 3. DOS BOTONES DE ACCIÓN GIGANTES (TOUCH-FRIENDLY) */}
      <div className="w-full flex flex-col gap-3.5 pt-1">
        
        {/* BOTÓN A: "JUGAR RANKED (1vs1)" (Diseño agresivo, colores competitivos, botón principal) */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartRanked}
          className="w-full relative overflow-hidden group rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-left shadow-2xl shadow-red-600/40 border border-red-400/40 cursor-pointer transition-all duration-300 min-h-[96px] flex items-center justify-between"
        >
          {/* Fondo animado resplandor */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black/30 border border-white/30 flex items-center justify-center text-amber-300 shadow-inner group-hover:rotate-6 transition-transform">
              <Swords className="w-8 h-8 text-amber-300 drop-shadow-md animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-black/40 text-amber-300 text-[10px] font-mono font-black uppercase tracking-wider border border-amber-400/30">
                  COMPETITIVO
                </span>
                <span className="text-[10px] font-bold text-white/90">⚡ MMR en juego</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-md">
                JUGAR RANKED (1vs1)
              </h3>
              <p className="text-xs text-white/80 font-medium">
                Enfrentate en vivo con otros estudiantes
              </p>
            </div>
          </div>

          <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-6 h-6" />
          </div>
        </motion.button>

        {/* BOTÓN B: "PRÁCTICA SÓLO" (Diseño secundario, colores neutros/elegantes) */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartSolo}
          className="w-full relative overflow-hidden group rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-[#0E182F] via-[#122040] to-[#0A1326] hover:from-[#132247] hover:to-[#0F1D38] text-white font-black text-left shadow-xl shadow-indigo-950/50 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition-all duration-300 min-h-[82px] flex items-center justify-between"
        >
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-black uppercase tracking-wider border border-indigo-500/30">
                  ENTRENAMIENTO
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Sin riesgo de Elo</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                PRÁCTICA SÓLO
              </h3>
            </div>
          </div>

          <div className="relative z-10 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-300 shrink-0 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5" />
          </div>
        </motion.button>

      </div>

      {/* 4. SECCIÓN ACCIONES SECUNDARIAS RÁPIDAS (PARCIAL FLASH & RANKINGS) */}
      <div className="w-full grid grid-cols-2 gap-3 pt-1">
        
        {/* PARCIAL FLASH IA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenParcialFlash}
          className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-left flex flex-col justify-between gap-2 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-mono">
              IA UNLP
            </span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
              Parcial Flash IA
            </h4>
            <p className="text-[10px] text-slate-400">5 preguntas de cualquier tema</p>
          </div>
        </motion.button>

        {/* RANKING & MEDALLERO */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTab("ranking")}
          className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-left flex flex-col justify-between gap-2 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 font-mono">
              TOP
            </span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-blue-300 transition-colors">
              Tabla de Posiciones
            </h4>
            <p className="text-[10px] text-slate-400">Medallero y Duelistas Top</p>
          </div>
        </motion.button>

      </div>

    </div>
  );
};
