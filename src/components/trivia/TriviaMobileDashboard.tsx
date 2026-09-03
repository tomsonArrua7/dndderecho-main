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
  HelpCircle,
  Play,
  Users,
  Target,
  Lock,
  Award
} from "lucide-react";
import { RangoJuridico } from "@/data/triviaData";
import { cn } from "@/lib/utils";

// Import 3D Assets generated for game modes
import rankedDuelsImg from "@/assets/ranked_duels_icon.jpg";
import practiceModeImg from "@/assets/practice_mode_icon.jpg";
import parcialFlashImg from "@/assets/parcial_flash_icon.jpg";

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
  onOpenPracticeModal: () => void;
  onOpenParcialFlash: () => void;
  onOpenRangosModal: () => void;
  onOpenGuideModal: () => void;
  onOpenMyProfile?: () => void;
  onSelectTab: (tab: "jugar" | "duelos" | "ranking" | "historial") => void;
  activeTab: "jugar" | "duelos" | "ranking" | "historial";
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
  onOpenPracticeModal,
  onOpenParcialFlash,
  onOpenRangosModal,
  onOpenGuideModal,
  onOpenMyProfile,
  onSelectTab,
  activeTab
}) => {
  const totalPartidas1v1 = (userStats.victoriasDuelo || 0) + (userStats.derrotasDuelo || 0) + (userStats.empatesDuelo || 0);
  const winrate1v1 = totalPartidas1v1 > 0 
    ? Math.round(((userStats.victoriasDuelo || 0) / totalPartidas1v1) * 100) 
    : 0;

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      
      {/* 1. TOP STATUS BAR: SEASON & REGLAS */}
      <div className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0A1124]/70 to-blue-950/40 border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
          <span className="text-xs font-black text-white uppercase tracking-wider truncate font-mono">
            {seasonInfo.badgeText}
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono">
            · {seasonInfo.weeklyCountdown}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenRangosModal}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Escala de Rangos</span>
            <span className="sm:hidden">Rangos</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Reglas</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT PLAYER CARD (GAME STATUS BAR) */}
      <div className="w-full rounded-3xl bg-gradient-to-b from-[#111A2E]/90 via-[#0A1122]/95 to-[#060B14]/98 border border-white/15 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Jugador + Rango con Medalla Oficial */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div 
                onClick={onOpenRangosModal}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-1 border border-amber-500/40 bg-gradient-to-br from-amber-500/20 via-black/60 to-white/5 shadow-xl shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all relative group"
                title="Tocar para ver Escala de Rangos Oficial"
              >
                <img
                  src={rangoActual.imagenUrl || `/logos-rangos/Nivel${rangoActual.nivel || 1}.png`}
                  alt={rangoActual.nombre}
                  className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-amber-500 text-black font-black text-[9px] uppercase tracking-wider shadow">
                  NIVEL {rangoActual.nivel || 1}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 
                    onClick={onOpenMyProfile}
                    className="text-base sm:text-lg font-black text-white tracking-tight truncate cursor-pointer hover:text-amber-300 transition-colors"
                    title="Tocar para ver mi perfil y medallas"
                  >
                    {userName || "Estudiante DND"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  <button
                    type="button"
                    onClick={onOpenRangosModal}
                    className="text-xs text-amber-300 font-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Nivel {rangoActual.nivel || 1} • {rangoActual.nombre}</span>
                    <ChevronRight className="w-3 h-3 text-amber-400/80" />
                  </button>
                  {onOpenMyProfile && (
                    <button
                      type="button"
                      onClick={onOpenMyProfile}
                      className="px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                      title="Ver mi perfil, vitrina y logros"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Mi Medallero</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Puntos de Rango */}
            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono">
                  PUNTOS DE RANGO
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">
                  {userStats.puntosTotales.toLocaleString()} <span className="text-xs text-amber-300/70 font-sans">PTS</span>
                </span>
              </div>
            </div>

          </div>

          {/* Barra de progreso de Rango */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Progreso de Rango</span>
              <span className="text-amber-300 font-mono font-black">{progresoPorcentaje}%</span>
            </div>
            
            <div className="w-full h-2.5 rounded-full bg-slate-950/80 border border-white/10 p-0.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, Math.min(100, progresoPorcentaje))}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full bg-gradient-to-r relative overflow-hidden",
                  rangoActual.colorGradient || "from-amber-500 via-orange-500 to-red-500"
                )}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-0.5">
              <span>
                {proximoRango ? (
                  <span className="flex items-center gap-1.5">
                    <img 
                      src={proximoRango.imagenUrl || `/logos-rangos/Nivel${proximoRango.nivel || 2}.png`} 
                      alt={proximoRango.nombre} 
                      className="w-4 h-4 object-contain inline-block"
                    />
                    <span>
                      Faltan <strong className="text-amber-300 font-mono font-black">{puntosFaltantes} pts</strong> para <strong className="text-white">{proximoRango.nombre}</strong>
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-300 font-black">👑 ¡Rango Máximo Jurídico Alcanzado!</span>
                )}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {userStats.puntosTotales} / {proximoRango ? proximoRango.minPuntos : "MAX"}
              </span>
            </div>
          </div>

          {/* Micro-stats chips (Tocar para abrir perfil) */}
          <div 
            onClick={onOpenMyProfile}
            className={cn(
              "grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center",
              onOpenMyProfile && "cursor-pointer group"
            )}
            title="Tocar para ver desglose completo en tu perfil"
          >
            <div className="p-2 rounded-2xl bg-white/[0.03] group-hover:bg-white/[0.07] border border-white/5 transition-colors">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Partidas</span>
              <span className="text-xs font-black text-white font-mono">{userStats.totalJugadas}</span>
            </div>
            <div className="p-2 rounded-2xl bg-white/[0.03] group-hover:bg-white/[0.07] border border-white/5 transition-colors">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Mejor Racha</span>
              <span className="text-xs font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> x{userStats.mejorRacha}
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-white/[0.03] group-hover:bg-white/[0.07] border border-white/5 transition-colors">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Winrate 1v1</span>
              <span className="text-xs font-black text-emerald-400 font-mono">{winrate1v1}%</span>
            </div>
          </div>

          {/* Botón directo de acceso a perfil, vitrina y logros */}
          {onOpenMyProfile && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenMyProfile}
                className="w-full py-2 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Ver Mi Perfil, Logros y Medallero</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400/80" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 3. NAVEGACIÓN PRINCIPAL: 4 PESTAÑAS LIMPIAS (SIN DUPLICADOS) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => onSelectTab("jugar")}
          className={cn(
            "p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider relative overflow-hidden active:scale-95 shadow-md",
            activeTab === "jugar"
              ? "bg-red-600 border-red-500 text-white shadow-red-600/30"
              : "bg-[#0D1527]/70 border-white/10 text-slate-400 hover:bg-[#0D1527] hover:text-white"
          )}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Modos de Juego</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("duelos")}
          className={cn(
            "p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider relative overflow-hidden active:scale-95 shadow-md",
            activeTab === "duelos"
              ? "bg-red-600 border-red-500 text-white shadow-red-600/30"
              : "bg-[#0D1527]/70 border-white/10 text-slate-400 hover:bg-[#0D1527] hover:text-white"
          )}
        >
          <Swords className="w-4 h-4" />
          <span>Salas 1v1</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("ranking")}
          className={cn(
            "p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider relative overflow-hidden active:scale-95 shadow-md",
            activeTab === "ranking"
              ? "bg-red-600 border-red-500 text-white shadow-red-600/30"
              : "bg-[#0D1527]/70 border-white/10 text-slate-400 hover:bg-[#0D1527] hover:text-white"
          )}
        >
          <Trophy className="w-4 h-4" />
          <span>Ranking & Podio</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("historial")}
          className={cn(
            "p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider relative overflow-hidden active:scale-95 shadow-md",
            activeTab === "historial"
              ? "bg-red-600 border-red-500 text-white shadow-red-600/30"
              : "bg-[#0D1527]/70 border-white/10 text-slate-400 hover:bg-[#0D1527] hover:text-white"
          )}
        >
          <Target className="w-4 h-4" />
          <span>Mi Historial</span>
        </button>
      </div>

      {/* 4. SI ESTÁ EN LA PESTAÑA 'JUGAR': SE MUESTRAN LAS 3 TARJETAS PRINCIPALES */}
      {activeTab === "jugar" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* TARJETA 1: DUELOS 1VS1 (RANKED COMPETITIVO) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative rounded-3xl p-6 bg-gradient-to-b from-[#200A10]/95 via-[#13060B]/95 to-[#090D1A]/95 border border-rose-500/40 hover:border-rose-500 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Glow rojo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Imagen 3D Badge */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-rose-500/30 shadow-lg relative group-hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src={rankedDuelsImg} 
                  alt="Duelo 1vs1 Ranked" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-rose-500/40 text-rose-300 text-[10px] font-mono font-black uppercase">
                  <Swords className="w-3 h-3" />
                  <span>Ranked Online</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 font-mono block">
                  ⚡ Competitivo · Puntos de Rango en juego
                </span>
                <h3 className="text-xl font-black text-white tracking-tight pt-0.5">
                  Duelos 1vs1
                </h3>
                <p className="text-xs text-slate-300 pt-1.5 leading-relaxed">
                  Competí en vivo contra otros estudiantes de la facultad. 5 preguntas simultáneas con reloj.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-5 relative z-10">
              <button
                type="button"
                onClick={onStartRanked}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Buscar Rival Rápido</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab("duelos")}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Ver Salas Privadas</span>
              </button>
            </div>
          </motion.div>

          {/* TARJETA 2: PRÁCTICA PERSONALIZADA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="group relative rounded-3xl p-6 bg-gradient-to-b from-[#0B152E]/95 via-[#080E20]/95 to-[#070A16]/95 border border-blue-500/40 hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Glow azul */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Imagen 3D Badge */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg relative group-hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src={practiceModeImg} 
                  alt="Práctica y Examen" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-blue-500/40 text-blue-300 text-[10px] font-mono font-black uppercase">
                  <BookOpen className="w-3 h-3" />
                  <span>Sin riesgo de ELO</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 font-mono block">
                  📖 Entrenamiento Personalizado
                </span>
                <h3 className="text-xl font-black text-white tracking-tight pt-0.5">
                  Práctica & Examen
                </h3>
                <p className="text-xs text-slate-300 pt-1.5 leading-relaxed">
                  Elegí materias específicas o toda la carrera y configurá la cantidad de preguntas a tu ritmo.
                </p>
              </div>
            </div>

            <div className="pt-5 relative z-10">
              <button
                type="button"
                onClick={onOpenPracticeModal}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>Configurar y Jugar</span>
              </button>
            </div>
          </motion.div>

          {/* TARJETA 3: PARCIAL FLASH IA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="group relative rounded-3xl p-6 bg-gradient-to-b from-[#1F1705]/95 via-[#130E03]/95 to-[#0A0D18]/95 border border-amber-500/40 hover:border-amber-500 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Glow dorado */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Imagen 3D Badge */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-amber-500/30 shadow-lg relative group-hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src={parcialFlashImg} 
                  alt="Parcial Flash IA" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono font-black uppercase">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>En Calibración Técnica</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/80 font-mono block">
                  🔧 Mantenimiento & Ajuste
                </span>
                <h3 className="text-xl font-black text-white tracking-tight pt-0.5">
                  Parcial Flash IA
                </h3>
                <p className="text-xs text-slate-300 pt-1.5 leading-relaxed">
                  Estamos optimizando los modelos de inteligencia artificial para una mayor precisión en el temario. Próximamente disponible.
                </p>
              </div>
            </div>

            <div className="pt-5 relative z-10">
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Módulo en Calibración</span>
              </button>
            </div>
          </motion.div>

        </div>
      )}

    </div>
  );
};
