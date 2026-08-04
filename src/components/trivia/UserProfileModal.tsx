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
}

export const LOGROS_MEDALLAS = [
  { id: 'partidas_10', titulo: 'Primeros Pasos', descripcion: 'Completar 10 evaluaciones', icono: '🎯', minPartidas: 10 },
  { id: 'partidas_50', titulo: 'Constancia Académica', descripcion: 'Completar 50 evaluaciones', icono: '⚡', minPartidas: 50 },
  { id: 'partidas_100', titulo: 'Veterano de Trivia', descripcion: 'Completar 100 evaluaciones', icono: '🔥', minPartidas: 100 },
  { id: 'partidas_250', titulo: 'Maestro del Examen', descripcion: 'Completar 250 evaluaciones', icono: '👑', minPartidas: 250 }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName = "Estudiante de Abogacía",
  userAvatar
}) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [medallas, setMedallas] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchProfileAndMedals = async () => {
      setLoading(true);
      try {
        const { data: statsData } = await supabase
          .from("trivia_estadisticas_usuario")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (statsData) setStats(statsData);
        else setStats({ puntos_totales: 0, victorias_duelo: 0, derrotas_duelo: 0, empates_duelo: 0, partidas_jugadas: 0 });

        const { data: medallasData } = await supabase
          .from("trivia_medallas_usuario")
          .select("*")
          .eq("user_id", userId);

        if (medallasData) setMedallas(medallasData);
        else setMedallas([]);
      } catch (err) {
        console.error("Error al cargar perfil de usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndMedals();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const puntosTotales = stats?.puntos_totales || 0;
  const rangoActual = calcularRango(puntosTotales);
  const totalJugadas = stats?.partidas_jugadas || 0;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 cursor-pointer overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-gradient-to-b from-[#0D1527] via-[#080E1A] to-[#050B14] border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden max-h-[92vh] flex flex-col cursor-default"
        >
          {/* BOTÓN CERRAR CON ÁREA TOUCH AMPLIADA */}
          <button
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-slate-200 transition-all cursor-pointer z-30 touch-manipulation flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CABECERA DE PERFIL */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left border-b border-white/10 pb-4 shrink-0 pr-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600/30 via-amber-500/20 to-slate-900 border-2 border-red-500/50 p-1 flex items-center justify-center shadow-xl shadow-red-950/40 shrink-0 relative">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-lg sm:text-2xl uppercase">
                  {userName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-slate-950 shadow text-[10px] sm:text-xs">
                🎓
              </span>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-400 font-mono block">
                FICHA OFICIAL DE ESTUDIANTE
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white truncate">{userName}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 text-[11px] sm:text-xs font-bold font-mono">
                  {rangoActual.nombre}
                </span>
                <span className="text-[11px] sm:text-xs text-amber-400 font-mono font-bold">
                  {puntosTotales} PTS
                </span>
              </div>
            </div>
          </div>

          {/* CONTENIDO INTERACTIVO DESPLAZABLE */}
          <div className="overflow-y-auto pr-1 space-y-4 text-xs leading-relaxed flex-1 scrollbar-none">
            
            {/* RESUMEN DE ESTADÍSTICAS GLOBALES */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase block">Partidas</span>
                <span className="text-sm sm:text-base font-black text-white font-mono">{totalJugadas}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] text-amber-400 font-black uppercase block">Racha Máx</span>
                <span className="text-sm sm:text-base font-black text-amber-400 font-mono">x{stats?.mejor_racha || 0}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-0.5 sm:space-y-1">
                <span className="text-[9px] sm:text-[10px] text-emerald-400 font-black uppercase block">Duelos 1v1</span>
                <span className="text-[11px] sm:text-xs font-black text-emerald-400 font-mono block">
                  {stats?.victorias_duelo || 0}V - {stats?.derrotas_duelo || 0}D
                </span>
              </div>
            </div>

            {/* MEDALLERO Y VITRINA DE TROFEOS */}
            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span>Vitrina de Medallas y Logros</span>
                </h4>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                  {medallas.length + (totalJugadas >= 10 ? 1 : 0)} Medallas
                </span>
              </div>

              {/* MEDALLAS COMPETITIVAS (ORO, PLATA, BRONCE) */}
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-400/80 block font-mono">Medallas de Podio (Temporadas)</span>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-2xl border text-center space-y-0.5 sm:space-y-1 relative overflow-hidden",
                    medallas.some(m => m.tipo === 'oro') ? "bg-amber-500/10 border-amber-400 text-amber-200" : "bg-white/[0.02] border-white/10 opacity-40"
                  )}>
                    <span className="text-xl sm:text-2xl block">🥇</span>
                    <span className="font-bold text-[10px] sm:text-xs block text-white truncate">Oro</span>
                    <span className="text-[9px] text-amber-400 font-mono block font-black">
                      x{medallas.filter(m => m.tipo === 'oro').length}
                    </span>
                  </div>

                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-2xl border text-center space-y-0.5 sm:space-y-1 relative overflow-hidden",
                    medallas.some(m => m.tipo === 'plata') ? "bg-slate-300/10 border-slate-300 text-slate-200" : "bg-white/[0.02] border-white/10 opacity-40"
                  )}>
                    <span className="text-xl sm:text-2xl block">🥈</span>
                    <span className="font-bold text-[10px] sm:text-xs block text-white truncate">Plata</span>
                    <span className="text-[9px] text-slate-300 font-mono block font-black">
                      x{medallas.filter(m => m.tipo === 'plata').length}
                    </span>
                  </div>

                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-2xl border text-center space-y-0.5 sm:space-y-1 relative overflow-hidden",
                    medallas.some(m => m.tipo === 'bronce') ? "bg-amber-800/10 border-amber-600 text-amber-300" : "bg-white/[0.02] border-white/10 opacity-40"
                  )}>
                    <span className="text-xl sm:text-2xl block">🥉</span>
                    <span className="font-bold text-[10px] sm:text-xs block text-white truncate">Bronce</span>
                    <span className="text-[9px] text-amber-500 font-mono block font-black">
                      x{medallas.filter(m => m.tipo === 'bronce').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* MEDALLAS DE RANGO JURÍDICO (12 NIVELES) */}
              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-red-400/80 block font-mono">Medallas por Rango Alcanzado</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {RANGOS_JURIDICOS.map((rango) => {
                    const unlocked = puntosTotales >= rango.minPuntos;
                    return (
                      <div
                        key={rango.id}
                        className={cn(
                          "p-2 sm:p-2.5 rounded-2xl border flex items-center gap-2 transition-all",
                          unlocked
                            ? "bg-red-500/10 border-red-500/40 text-white"
                            : "bg-white/[0.02] border-white/5 opacity-35"
                        )}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs sm:text-sm shrink-0">
                          {unlocked ? '🏅' : '🔒'}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[10px] sm:text-[11px] text-white block truncate">{rango.nombre}</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-400 block font-mono">{rango.minPuntos} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MEDALLAS DE LOGROS DE PARTIDAS */}
              <div className="space-y-1.5 sm:space-y-2 pt-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-blue-400/80 block font-mono">Medallas por Hitos de Evaluaciones</span>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {LOGROS_MEDALLAS.map((logro) => {
                    const unlocked = totalJugadas >= logro.minPartidas;
                    return (
                      <div
                        key={logro.id}
                        className={cn(
                          "p-2.5 sm:p-3 rounded-2xl border flex items-center gap-2.5 transition-all",
                          unlocked
                            ? "bg-blue-500/10 border-blue-500/40 text-white"
                            : "bg-white/[0.02] border-white/5 opacity-35"
                        )}
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-sm sm:text-lg shrink-0">
                          {unlocked ? logro.icono : '🔒'}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[11px] sm:text-xs text-white block truncate">{logro.titulo}</span>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">{logro.descripcion}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* BOTÓN INFERIOR DE CERRAR FICHA PARA DISPOSITIVOS MÓVILES */}
          <div className="pt-2 border-t border-white/10 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all touch-manipulation"
            >
              Cerrar Ficha de Estudiante
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
