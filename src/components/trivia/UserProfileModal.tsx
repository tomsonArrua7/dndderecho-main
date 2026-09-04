import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Swords, Award, Star, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { RANGOS_JURIDICOS, calcularRango } from '../../data/triviaData';
import { cn } from '../../lib/utils';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
  userAvatar?: string;
  initialStats?: {
    puntos?: number;
    racha?: number;
    aciertosPorcentaje?: number;
    partidasJugadas?: number;
    victoriasDuelo?: number;
    derrotasDuelo?: number;
  };
}

export const LOGROS_MEDALLAS = [
  { id: 'partidas_1', titulo: 'Iniciación Jurídica', descripcion: 'Completar 1 evaluación individual', icono: '🎯', minPartidas: 1 },
  { id: 'partidas_5', titulo: 'Hábito de Estudio', descripcion: 'Completar 5 evaluaciones de práctica', icono: '📘', minPartidas: 5 },
  { id: 'partidas_15', titulo: 'Codos Gastados', descripcion: 'Completar 15 evaluaciones en biblioteca', icono: '🏛️', minPartidas: 15 },
  { id: 'partidas_30', titulo: 'Doctrinario Serial', descripcion: 'Completar 30 evaluaciones de práctica', icono: '⚖️', minPartidas: 30 },
  { id: 'partidas_50', titulo: 'Maestría Práctica', descripcion: 'Completar 50 exámenes con rigor técnico', icono: '📜', minPartidas: 50 },
  { id: 'partidas_100', titulo: 'Jurisconsulto Incansable', descripcion: 'Alcanzar 100 evaluaciones de práctica', icono: '👑', minPartidas: 100 }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName = "Estudiante de Abogacía",
  userAvatar,
  initialStats
}) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [medallas, setMedallas] = useState<any[]>([]);

  // Bloquear scroll de la página de fondo en dispositivos móviles cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfileAndMedals = async () => {
      setLoading(true);
      try {
        if (userId) {
          const { data: statsData } = await supabase
            .from("trivia_estadisticas_usuario")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

          if (statsData) {
            setStats(statsData);
          } else if (initialStats) {
            setStats({
              puntos_totales: initialStats.puntos || 0,
              mejor_racha: initialStats.racha || 0,
              victorias_duelo: initialStats.victoriasDuelo || 0,
              derrotas_duelo: initialStats.derrotasDuelo || 0,
              partidas_jugadas: initialStats.partidasJugadas || 10
            });
          } else {
            setStats({ puntos_totales: 0, victorias_duelo: 0, derrotas_duelo: 0, empates_duelo: 0, partidas_jugadas: 0 });
          }

          const { data: medallasData } = await supabase
            .from("trivia_medallas_usuario")
            .select("*")
            .eq("user_id", userId);

          if (medallasData) setMedallas(medallasData);
          else setMedallas([]);
        } else if (initialStats) {
          setStats({
            puntos_totales: initialStats.puntos || 0,
            mejor_racha: initialStats.racha || 0,
            victorias_duelo: initialStats.victoriasDuelo || 0,
            derrotas_duelo: initialStats.derrotasDuelo || 0,
            partidas_jugadas: initialStats.partidasJugadas || 10
          });
        }
      } catch (err) {
        console.error("Error al cargar perfil de usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndMedals();
  }, [isOpen, userId, initialStats]);

  if (!isOpen) return null;

  const puntosTotales = stats?.puntos_totales ?? initialStats?.puntos ?? 0;
  const rangoActual = calcularRango(puntosTotales);
  const totalJugadas = stats?.partidas_jugadas ?? initialStats?.partidasJugadas ?? Math.max(1, Math.round(puntosTotales / 50));

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[10050] bg-black/80 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 cursor-pointer overflow-hidden"
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-white dark:bg-gradient-to-b dark:from-[#0D1527] dark:via-[#080E1A] dark:to-[#050B14] border border-slate-200 dark:border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden max-h-[85dvh] sm:max-h-[88vh] flex flex-col cursor-default text-slate-900 dark:text-white my-auto"
        >
          {/* BOTÓN CERRAR CON ÁREA TOUCH AMPLIADA */}
          <button
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 active:bg-slate-300 dark:active:bg-white/30 text-slate-700 dark:text-slate-200 transition-all cursor-pointer z-30 touch-manipulation flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CABECERA DE PERFIL */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left border-b border-slate-200 dark:border-white/10 pb-4 shrink-0 pr-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600/30 via-amber-500/20 to-slate-900 border-2 border-red-500/50 p-1 flex items-center justify-center shadow-xl shadow-red-950/40 shrink-0 relative">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-lg sm:text-2xl uppercase">
                  {userName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-950 shadow text-[10px] sm:text-xs">
                🎓
              </span>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 font-mono block">
                FICHA OFICIAL DE ESTUDIANTE • FCJyS UNLP
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">{userName}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                <img 
                  src={rangoActual.imagenUrl || `/logos-rangos/Nivel${rangoActual.nivel || 1}.png`} 
                  alt={rangoActual.nombre} 
                  className="w-5 h-5 object-contain shrink-0" 
                />
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-200 border border-red-500/30 text-[11px] sm:text-xs font-bold font-mono">
                  Nivel {rangoActual.nivel || 1} • {rangoActual.nombre}
                </span>
                <span className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                  {puntosTotales} PTS DE RANGO
                </span>
              </div>
            </div>
          </div>

          {/* CONTENIDO INTERACTIVO DESPLAZABLE */}
          <div className="overflow-y-auto pr-1 space-y-4 text-xs leading-relaxed flex-1 scrollbar-none overscroll-contain touch-pan-y">
            
            {/* RESUMEN DE ESTADÍSTICAS GLOBALES */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase block">Partidas</span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">{totalJugadas}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase block">Racha Máx</span>
                <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">x{stats?.mejor_racha ?? initialStats?.racha ?? 0}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase block">Duelos 1v1</span>
                <span className="text-[11px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                  {stats?.victorias_duelo ?? initialStats?.victoriasDuelo ?? 0}V - {stats?.derrotas_duelo ?? initialStats?.derrotasDuelo ?? 0}D
                </span>
              </div>
            </div>

            {/* MEDALLERO Y VITRINA DE TROFEOS */}
            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span>Vitrina de Medallas y Logros</span>
                </h4>
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {medallas.length + (totalJugadas >= 1 ? 1 : 0) + 1} Medallas
                </span>
              </div>

              {/* MEDALLA OFICIAL DEL RANGO ACTUAL */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-red-500/5 to-transparent border border-amber-500/30 flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/50 p-1 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-lg relative overflow-hidden">
                  <img 
                    src={rangoActual.imagenUrl || `/logos-rangos/Nivel${rangoActual.nivel || 1}.png`} 
                    alt={rangoActual.nombre} 
                    className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" 
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-black block font-mono">
                    Medalla de Rango Académico
                  </span>
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                    Nivel {rangoActual.nivel}: {rangoActual.nombre}
                  </h5>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {rangoActual.descripcion}
                  </p>
                </div>
              </div>

              {/* MEDALLAS COMPETITIVAS (ORO, PLATA, BRONCE) */}
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-600 dark:text-amber-400/80 block font-mono">Medallas de Podio (Temporadas)</span>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-2xl border text-center space-y-0.5 sm:space-y-1 relative overflow-hidden",
                    medallas.some(m => m.tipo === 'oro') ? "bg-amber-500/10 border-amber-400 text-amber-700 dark:text-amber-200" : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 opacity-40"
                  )}>
                    <span className="text-xl sm:text-2xl block">🥇</span>
                    <span className="font-bold text-[10px] sm:text-xs block text-slate-800 dark:text-white truncate">Oro</span>
                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono block font-black">
                      x{medallas.filter(m => m.tipo === 'oro').length}
                    </span>
                  </div>

                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-2xl border text-center space-y-0.5 sm:space-y-1 relative overflow-hidden",
                    medallas.some(m => m.tipo === 'plata') ? "bg-slate-200/50 border-slate-400 text-slate-800 dark:bg-slate-300/10 dark:border-slate-300 dark:text-slate-200" : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 opacity-40"
                  )}>
                    <span className="text-xl sm:text-2xl block">🥈</span>
                    <span className="font-bold text-[10px] sm:text-xs block text-slate-800 dark:text-white truncate">Plata</span>
                    <span className="text-[9px] text-slate-600 dark:text-slate-300 font-mono block font-black">
                      x{medallas.filter(m => m.tipo === 'plata').length}
                    </span>
                  </div>

                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-2xl border text-center space-y-0.5 sm:space-y-1 relative overflow-hidden",
                    medallas.some(m => m.tipo === 'bronce') ? "bg-amber-900/10 border-amber-600 text-amber-800 dark:text-amber-300" : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 opacity-40"
                  )}>
                    <span className="text-xl sm:text-2xl block">🥉</span>
                    <span className="font-bold text-[10px] sm:text-xs block text-slate-800 dark:text-white truncate">Bronce</span>
                    <span className="text-[9px] text-amber-700 dark:text-amber-500 font-mono block font-black">
                      x{medallas.filter(m => m.tipo === 'bronce').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* MEDALLAS DE RANGO JURÍDICO (12 NIVELES) */}
              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-red-600 dark:text-red-400/80 block font-mono">Medallas por Rango Alcanzado</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {RANGOS_JURIDICOS.map((rango) => {
                    const unlocked = puntosTotales >= rango.minPuntos;
                    return (
                      <div
                        key={rango.id}
                        className={cn(
                          "p-2 sm:p-2.5 rounded-2xl border flex items-center gap-2 transition-all",
                          unlocked
                            ? "bg-red-500/10 border-red-500/40 text-slate-900 dark:text-white font-medium"
                            : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-35"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center p-0.5 shrink-0 relative",
                          unlocked ? "bg-black/40 border-amber-500/40 shadow" : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 grayscale opacity-60"
                        )}>
                          <img 
                            src={rango.imagenUrl || `/logos-rangos/Nivel${rango.nivel}.png`} 
                            alt={rango.nombre} 
                            className="w-full h-full object-contain" 
                          />
                          {!unlocked && (
                            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-[10px]">
                              🔒
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[10px] sm:text-[11px] text-slate-900 dark:text-white block truncate">{rango.nombre}</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 block font-mono">{rango.minPuntos} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MEDALLAS DE LOGROS DE EVALUACIONES DE PRÁCTICA */}
              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-blue-600 dark:text-blue-400/80 block font-mono">
                    Logros de Evaluaciones y Estudio Individual
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                    {totalJugadas} Realizadas
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {LOGROS_MEDALLAS.map((logro) => {
                    const unlocked = totalJugadas >= logro.minPartidas;
                    const progresoPct = Math.min(100, Math.round((totalJugadas / logro.minPartidas) * 100));

                    return (
                      <div
                        key={logro.id}
                        className={cn(
                          "p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between gap-1.5 transition-all",
                          unlocked
                            ? "bg-blue-500/10 border-blue-500/40 text-slate-900 dark:text-white shadow-sm"
                            : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center text-base shrink-0",
                            unlocked 
                              ? "bg-blue-600/20 border-blue-500/40 text-blue-300" 
                              : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500"
                          )}>
                            {unlocked ? logro.icono : '🔒'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate">
                                {logro.titulo}
                              </span>
                              {unlocked ? (
                                <span className="text-[9px] font-black font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                  COMPLETO
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-slate-400">
                                  {totalJugadas}/{logro.minPartidas}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                              {logro.descripcion}
                            </span>
                          </div>
                        </div>

                        {!unlocked && (
                          <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progresoPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* BOTÓN INFERIOR DE CERRAR FICHA PARA DISPOSITIVOS MÓVILES */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 active:bg-slate-300 dark:active:bg-white/30 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all touch-manipulation"
            >
              Cerrar Ficha de Estudiante
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

