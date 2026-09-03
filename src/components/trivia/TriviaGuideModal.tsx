import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Trophy, 
  Swords, 
  Zap, 
  Award, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Lock,
  Medal,
  UserCheck
} from 'lucide-react';
import { RANGOS_JURIDICOS } from '@/data/triviaData';
import { cn } from '../../lib/utils';

export interface TriviaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TriviaGuideModal: React.FC<TriviaGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'modos' | 'puntos' | 'rangos' | 'temporadas' | 'logros'>('modos');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-gradient-to-b from-[#0D1527] via-[#080E1A] to-[#050B14] border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* BOTÓN CERRAR */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* CABECERA DE LA GUÍA */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 sm:pb-4 shrink-0 pr-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-red-600/30 to-amber-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-400 font-mono block">
                REGLAMENTO Y GUÍA OFICIAL
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight truncate">
                Reglas & Sistema de Rango
              </h2>
            </div>
          </div>

          {/* NAVEGACIÓN DE SUB-PESTAÑAS DE LA GUÍA */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-white/10 rounded-2xl overflow-x-auto scrollbar-none shrink-0 flex-nowrap">
            <button
              onClick={() => setActiveGuideTab('modos')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'modos' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Modos de Juego</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('puntos')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'puntos' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Puntos de Rango</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('rangos')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'rangos' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Medal className="w-3.5 h-3.5 text-amber-400" />
              <span>12 Rangos</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('temporadas')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'temporadas' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Temporadas & Podio</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('logros')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'logros' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Logros de Estudio</span>
            </button>
          </div>

          {/* CONTENIDO INTERACTIVO SEGÚN PESTAÑA */}
          <div className="overflow-y-auto pr-1 space-y-3 sm:space-y-4 text-slate-300 text-xs leading-relaxed flex-1 scrollbar-none">
            
            {/* SECCIÓN 1: MODOS DE JUEGO */}
            {activeGuideTab === 'modos' && (
              <div className="space-y-3">
                
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-[#0D1527] to-[#0A1020] border border-red-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-white flex items-center gap-2">
                      <Swords className="w-4 h-4 text-red-400" />
                      <span>1. Duelos 1vs1 Clasificatorios (Modo Competitivo)</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono font-bold">
                      OFICIAL 1V1
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Desafiá a otro estudiante en tiempo real. Ambos responderán exactamente las mismas <strong>5 preguntas</strong> con cronómetro sincronizado. 
                    Es la <strong>única modalidad donde ganás o perdés Puntos de Rango</strong> para escalar en el Ranking Oficial de la Facultad.
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono pt-1 text-slate-400">
                    <span className="text-emerald-400 font-bold">+50 PTS Victoria</span>
                    <span className="text-amber-400 font-bold">+25 PTS Empate</span>
                    <span className="text-red-400 font-bold">-15 PTS Derrota</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#0D1527] to-[#0A1020] border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <span>2. Entrenamiento & Práctica Individual</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-mono font-bold">
                      SIN RIESGO DE RANGO
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Elegí materias específicas por año de cursada (1º a 6º Año) y definí la cantidad de preguntas (5, 10, 15 o 20). 
                    <strong> No arriesgás Puntos de Rango</strong>: es tu espacio ideal para estudiar para los parciales y desbloquear los <strong>6 Logros de Estudio</strong> en tu vitrina de perfil.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 opacity-85">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>3. Parcial Flash con IA</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> En Calibración Técnica
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Generador de parciales instantáneos basados en inteligencia artificial. Actualmente en mantenimiento y ajuste para garantizar total exactitud con los programas de cátedra de la UNLP.
                  </p>
                </div>

              </div>
            )}

            {/* SECCIÓN 2: PUNTOS DE RANGO */}
            {activeGuideTab === 'puntos' && (
              <div className="space-y-3">
                
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <h3 className="font-black text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>¿Cómo se calculan los Puntos de Rango?</span>
                  </h3>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    Los <strong>Puntos de Rango</strong> miden tu rendimiento competitivo exclusivo en duelos 1vs1. 
                    El sistema es justo, transparente y premia la destreza frente a otros alumnos:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-center">
                      <span className="text-[10px] text-emerald-400 font-black uppercase font-mono block">VICTORIA 1V1</span>
                      <span className="text-xl font-black text-white font-mono">+50</span>
                      <span className="text-[10px] text-slate-400 block pt-0.5">Pts de Rango</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-center">
                      <span className="text-[10px] text-amber-400 font-black uppercase font-mono block">EMPATE 1V1</span>
                      <span className="text-xl font-black text-white font-mono">+25</span>
                      <span className="text-[10px] text-slate-400 block pt-0.5">Pts de Rango</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-red-500/30 text-center">
                      <span className="text-[10px] text-red-400 font-black uppercase font-mono block">DERROTA 1V1</span>
                      <span className="text-xl font-black text-white font-mono">-15</span>
                      <span className="text-[10px] text-slate-400 block pt-0.5">Pts de Rango</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <h3 className="font-black text-sm text-blue-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Protección de Piso y Descenso</span>
                  </h3>
                  <ul className="space-y-1.5 text-slate-300 text-xs list-disc list-inside">
                    <li><strong>Piso en 0 Puntos:</strong> Tus Puntos de Rango nunca serán negativos.</li>
                    <li><strong>Ascenso Automático:</strong> Al alcanzar el puntaje requerido de un nuevo rango, tu medalla y título se actualizan al instante.</li>
                    <li><strong>Descenso:</strong> Si acumulás derrotas y tu puntaje cae por debajo del umbral mínimo de tu rango, descenderás al nivel previo.</li>
                  </ul>
                </div>

              </div>
            )}

            {/* SECCIÓN 3: 12 RANGOS JURÍDICOS */}
            {activeGuideTab === 'rangos' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 leading-relaxed">
                  La carrera jurídica se compone de <strong>12 Niveles de Rango</strong>. Cada uno tiene su <strong>medalla circular oficial ilustrada</strong> que se exhibe en tu tarjeta y perfil público:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RANGOS_JURIDICOS.map((rango) => (
                    <div 
                      key={rango.nivel}
                      className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center shrink-0 shadow">
                        <img 
                          src={rango.imagenUrl || `/logos-rangos/Nivel${rango.nivel}.png`} 
                          alt={rango.nombre} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-xs text-white truncate">
                            {rango.nombre}
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 font-black shrink-0">
                            Nv.{rango.nivel}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
                          {rango.minPuntos === 0 ? "0 pts (Inicial)" : `${rango.minPuntos.toLocaleString()} pts`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 4: TEMPORADAS & PODIO */}
            {activeGuideTab === 'temporadas' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2D0B12] via-[#1A0B12] to-[#0D1527] border border-red-500/40 space-y-2">
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Ranking Oficial Unificado de la Facultad</span>
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Existe un <strong>único Ranking Oficial</strong>. Ya no hay rankings divididos ni confusos: todos los estudiantes compiten en una tabla de mérito centralizada ordenada por sus <strong>Puntos de Rango</strong> ganados en Duelos 1vs1.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <h3 className="font-black text-sm text-amber-300 flex items-center gap-2">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span>Cierre de Temporada & Medallas Olímpicas</span>
                  </h3>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    Al cumplirse el ciclo de la Temporada Competitiva, la tabla se cierra y los 3 mejores alumnos de la facultad son galardonados con medallas perpetuas:
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                    <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40">
                      <span className="text-base block">🥇</span>
                      <strong className="text-amber-300 text-xs block">Oro</strong>
                      <span className="text-[10px] text-slate-300">Campeón</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-300/20 border border-slate-300/40">
                      <span className="text-base block">🥈</span>
                      <strong className="text-slate-200 text-xs block">Plata</strong>
                      <span className="text-[10px] text-slate-300">Subcampeón</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-700/20 border border-amber-700/40">
                      <span className="text-base block">🥉</span>
                      <strong className="text-amber-400 text-xs block">Bronce</strong>
                      <span className="text-[10px] text-slate-300">3º Puesto</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <h4 className="font-black text-xs text-white">🔄 Reinicio Equitativo de Temporada</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Para que las nuevas generaciones y cursantes siempre tengan la oportunidad de llegar a la cima, al iniciar cada temporada los Puntos de Rango vuelven a 0 para todos. 
                    Sin embargo, <strong>las medallas de temporadas anteriores quedan grabadas para siempre en tu Medallero</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 5: LOGROS DE ESTUDIO */}
            {activeGuideTab === 'logros' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>6 Logros de Práctica Individual (Biblioteca)</span>
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Para incentivar tu estudio diario y preparación para parciales, cada evaluación individual completada suma progreso hacia estas 6 condecoraciones:
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">🎯 Iniciación Jurídica</span>
                      <span className="font-mono text-amber-400 font-bold">1 examen completado</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">📘 Hábito de Estudio</span>
                      <span className="font-mono text-amber-400 font-bold">5 exámenes completados</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">🏛️ Codos Gastados</span>
                      <span className="font-mono text-amber-400 font-bold">15 exámenes completados</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">⚖️ Doctrinario Serial</span>
                      <span className="font-mono text-amber-400 font-bold">30 exámenes completados</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">📜 Maestría Práctica</span>
                      <span className="font-mono text-amber-400 font-bold">50 exámenes completados</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">👑 Jurisconsulto Incansable</span>
                      <span className="font-mono text-amber-400 font-bold">100 exámenes completados</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                  <h4 className="font-black text-xs text-blue-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Tu Vitrina y Medallero Público</span>
                  </h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Podés presionar <strong>"Mi Medallero"</strong> o hacer clic en tu nombre en la tarjeta del jugador en cualquier momento para ver tus barras de progreso, logros desbloqueados y medallas. También podés inspeccionar el perfil de cualquier rival tocando su nombre en el Ranking Oficial.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* PIE DEL MODAL */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0 gap-2">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">
              ¡Estudiá, competí en duelos y alcanzá la cúspide jurídica!
            </span>
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all shrink-0"
            >
              ¡Entendido!
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
