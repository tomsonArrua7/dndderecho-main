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
        // Cargar estadísticas del usuario
        const { data: statsData } = await supabase
          .from("trivia_estadisticas_usuario")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (statsData) setStats(statsData);
        else setStats({ puntos_totales: 0, victorias_duelo: 0, derrotas_duelo: 0, empates_duelo: 0, partidas_jugadas: 0 });

        // Cargar medallas ganadas en Supabase
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
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-xl bg-gradient-to-b from-[#0D1527] to-[#050B14] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none"
        >
          {/* BOTÓN CERRAR */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CABECERA DE PERFIL */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left border-b border-white/10 pb-5 pt-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/30 via-amber-500/20 to-slate-900 border-2 border-red-500/50 p-1 flex items-center justify-center shadow-xl shadow-red-950/40 shrink-0 relative">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-2xl uppercase">
                  {userName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-slate-950 shadow text-xs">
                🎓
              </span>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">
                FICHA OFICIAL DE ESTUDIANTE
              </span>
              <h3 className="text-xl font-black text-white truncate">{userName}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 text-xs font-bold font-mono">
                  {rangoActual.nombre}
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {puntosTotales} PTS
                </span>
              </div>
            </div>
          </div>

          {/* RESUMEN DE ESTADÍSTICAS GLOBALES */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase block">Partidas</span>
              <span className="text-base font-black text-white font-mono">{totalJugadas}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-amber-400 font-black uppercase block">Racha Máx</span>
              <span className="text-base font-black text-amber-400 font-mono">x{stats?.mejor_racha || 0}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-emerald-400 font-black uppercase block">Duelos 1v1</span>
              <span className="text-xs font-black text-emerald-400 font-mono block">
                {stats?.victorias_duelo || 0}V - {stats?.derrotas_duelo || 0}D
              </span>
            </div>
          </div>

          {/* MEDALLERO Y VITRINA DE TROFEOS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Vitrina de Medallas y Logros</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {medallas.length + (totalJugadas >= 10 ? 1 : 0)} Medallas Desbloqueadas
              </span>
            </div>

            {/* MEDALLAS COMPETITIVAS (ORO, PLATA, BRONCE) */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-400/80 block">Medallas de Podio (Temporadas)</span>
              <div className="grid grid-cols-3 gap-3">
                <div className={cn(
                  "p-3 rounded-2xl border text-center space-y-1 relative overflow-hidden",
                  medallas.some(m => m.tipo === 'oro') ? "bg-amber-500/10 border-amber-400 text-amber-200" : "bg-white/[0.02] border-white/10 opacity-40"
                )}>
                  <span className="text-2xl block">🥇</span>
                  <span className="font-bold text-xs block text-white">Medalla de Oro</span>
                  <span className="text-[9px] text-amber-400 font-mono block font-black">
                    x{medallas.filter(m => m.tipo === 'oro').length}
                  </span>
                </div>

                <div className={cn(
                  "p-3 rounded-2xl border text-center space-y-1 relative overflow-hidden",
                  medallas.some(m => m.tipo === 'plata') ? "bg-slate-300/10 border-slate-300 text-slate-200" : "bg-white/[0.02] border-white/10 opacity-40"
                )}>
                  <span className="text-2xl block">🥈</span>
                  <span className="font-bold text-xs block text-white">Medalla de Plata</span>
                  <span className="text-[9px] text-slate-300 font-mono block font-black">
                    x{medallas.filter(m => m.tipo === 'plata').length}
                  </span>
                </div>

                <div className={cn(
                  "p-3 rounded-2xl border text-center space-y-1 relative overflow-hidden",
                  medallas.some(m => m.tipo === 'bronce') ? "bg-amber-800/10 border-amber-600 text-amber-300" : "bg-white/[0.02] border-white/10 opacity-40"
                )}>
                  <span className="text-2xl block">🥉</span>
                  <span className="font-bold text-xs block text-white">Medalla de Bronce</span>
                  <span className="text-[9px] text-amber-500 font-mono block font-black">
                    x{medallas.filter(m => m.tipo === 'bronce').length}
                  </span>
                </div>
              </div>
            </div>

            {/* MEDALLAS DE RANGO JURÍDICO (12 NIVELES) */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black uppercase text-red-400/80 block">Medallas por Rango Alcanzado</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {RANGOS_JURIDICOS.map((rango) => {
                  const unlocked = puntosTotales >= rango.minPuntos;
                  return (
                    <div
                      key={rango.id}
                      className={cn(
                        "p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all",
                        unlocked
                          ? "bg-red-500/10 border-red-500/40 text-white"
                          : "bg-white/[0.02] border-white/5 opacity-35"
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-sm shrink-0">
                        {unlocked ? '🏅' : '🔒'}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] text-white block truncate">{rango.nombre}</span>
                        <span className="text-[9px] text-slate-400 block font-mono">{rango.minPuntos} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MEDALLAS DE LOGROS DE PARTIDAS */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black uppercase text-blue-400/80 block">Medallas por Hitos de Evaluaciones</span>
              <div className="grid grid-cols-2 gap-2.5">
                {LOGROS_MEDALLAS.map((logro) => {
                  const unlocked = totalJugadas >= logro.minPartidas;
                  return (
                    <div
                      key={logro.id}
                      className={cn(
                        "p-3 rounded-2xl border flex items-center gap-3 transition-all",
                        unlocked
                          ? "bg-blue-500/10 border-blue-500/40 text-white"
                          : "bg-white/[0.02] border-white/5 opacity-35"
                      )}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg shrink-0">
                        {unlocked ? logro.icono : '🔒'}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-white block truncate">{logro.titulo}</span>
                        <span className="text-[10px] text-slate-400 block">{logro.descripcion}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
