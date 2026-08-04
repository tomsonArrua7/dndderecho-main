import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Trophy, Swords, Zap, Award, Flame, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TriviaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TriviaGuideModal: React.FC<TriviaGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'modos' | 'puntos' | 'temporadas' | 'medallas'>('modos');

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
                TUTORIAL Y GUÍA OFICIAL
              </span>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight truncate">
                Reglas & Guía de la Trivia
              </h2>
            </div>
          </div>

          {/* NAVEGACIÓN DE SUB-PESTAÑAS DE LA GUÍA (SCROLLABLE EN MOBILE) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-white/10 rounded-2xl overflow-x-auto scrollbar-none shrink-0 flex-nowrap">
            <button
              onClick={() => setActiveGuideTab('modos')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'modos' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Modos</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('puntos')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'puntos' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Puntos & Penalizaciones</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('temporadas')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'temporadas' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Temporadas & Resets</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('medallas')}
              className={cn(
                "px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap",
                activeGuideTab === 'medallas' ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              )}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Medallas & Perfiles</span>
            </button>
          </div>

          {/* CONTENIDO INTERACTIVO SEGÚN PESTAÑA */}
          <div className="overflow-y-auto pr-1 space-y-3 sm:space-y-4 text-slate-300 text-xs leading-relaxed flex-1 scrollbar-none">
            
            {/* SECCIÓN 1: MODOS DE JUEGO */}
            {activeGuideTab === 'modos' && (
              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs shrink-0">1</span>
                    <span>Evaluación Completa (Modo Solo)</span>
                  </h3>
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                    Elegí la materia o filtrá por año de cursada (1º a 6º Año) y seleccioná la cantidad de preguntas (5, 10, 15 o 20). 
                    Cada pregunta correcta suma **+100 PTS base** más bonificación por velocidad de respuesta.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs shrink-0">2</span>
                    <span>Duelos 1vs1 en Tiempo Real</span>
                  </h3>
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                    Creá una sala o unite al desafío directo de otro estudiante. Ambos responderán exactamente el mismo examen de 5 preguntas.
                    El jugador que obtenga más puntos al responder gana el duelo.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Parcial Flash con IA</span>
                  </h3>
                  <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                    Ingresá cualquier materia de la facultad. La Inteligencia Artificial generará en tiempo real un examen universitario adaptado para evaluarte al instante.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: PUNTOS, RANGOS Y PENALIZACIONES */}
            {activeGuideTab === 'puntos' && (
              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ganancia de Puntos (Aprobación &gt;= 50%)</span>
                  </h3>
                  <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                    Si respondés el **50% o más de las preguntas correctamente** (ej. 3 de 5 aciertos), sumás los puntos acumulados a tu perfil y escalás en el **Ranking General**.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-red-500/10 border border-red-500/40 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-red-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>⚠️ Penalización por Desempeño Insuficiente (&lt; 50%)</span>
                  </h3>
                  <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                    Si desaprobás (respondés más de la mitad mal), **se te restan puntos acumulados**. Si tus puntos bajan del nivel de tu rango actual, **bajas automáticamente de Rango Jurídico y caés en el Ranking General**.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Puntuación en Duelos 1vs1</span>
                  </h3>
                  <ul className="space-y-1 text-slate-300 text-[11px] sm:text-xs list-disc list-inside">
                    <li><strong className="text-emerald-400">Victoria 🥇:</strong> +50 PTS a tu Rango y Ranking de Duelistas.</li>
                    <li><strong className="text-amber-400">Empate 🤝:</strong> +20 PTS a ambos participantes.</li>
                    <li><strong className="text-red-400">Derrota 💔:</strong> <span className="text-red-300 font-bold">-40 PTS de penalización</span> (te resta puntos y te hace bajar en la clasificación).</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: TEMPORADAS & RESETS */}
            {activeGuideTab === 'temporadas' && (
              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2D0B12] via-[#1A0B12] to-[#0D1527] border border-red-500/40 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-white flex flex-wrap items-center gap-2">
                    <span>🚀 Gran Inicio de Temporada Competitiva</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                      23 de Agosto 20:00 hs
                    </span>
                  </h3>
                  <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                    El ranking oficial entra en vigencia a partir del **23 de Agosto a las 20:00 hs**, dando inicio al primer ciclo de competencias de la facultad.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-400 block font-mono">RESETS SEMANALES (1V1)</span>
                    <h4 className="font-bold text-xs text-white">Ranking de Duelistas</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                      Cada 7 días se resetea la tabla de duelistas. Los 3 mejores reciben Medallas Olímpicas (Oro 🥇, Plata 🥈, Bronce 🥉).
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-red-400 block font-mono">RESETS MENSUALES</span>
                    <h4 className="font-bold text-xs text-white">Ranking General & Rangos</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                      Cada mes se resetean las posiciones globales. Se premia al podio mensual y se otorgan las Medallas de Rango Jurídico alcanzadas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 4: MEDALLAS Y PERFILES */}
            {activeGuideTab === 'medallas' && (
              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Medallero Olímpico & Vitrina de Logros</span>
                  </h3>
                  <p className="text-slate-300 text-[11px] sm:text-xs">
                    Tus medallas ganadas se almacenan para siempre en tu **Vitrina Personal**. Podés desbloquear:
                  </p>
                  <ul className="space-y-1 text-slate-300 text-[11px] sm:text-xs list-disc list-inside pt-1">
                    <li><strong>Medallas de Podio:</strong> Oro 🥇, Plata 🥈 y Bronce 🥉 por podios en temporadas.</li>
                    <li><strong>Medallas de Rango:</strong> 12 medallas exclusivas correspondientes a cada nivel de la escala jurídica.</li>
                    <li><strong>Medallas de Logros:</strong> Por alcanzar hitos (10, 50, 100 y 250 evaluaciones completadas).</li>
                  </ul>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1.5">
                  <h3 className="font-black text-xs sm:text-sm text-blue-300 flex items-center gap-2">
                    <span>👤 Ficha e Inspección de Estudiantes</span>
                  </h3>
                  <p className="text-slate-200 text-[11px] sm:text-xs leading-relaxed">
                    Haciendo clic en el nombre o avatar de cualquier alumno en el Ranking General, Ranking de Duelistas o Marcador de Duelo, podrás abrir su **Ficha Oficial** e inspeccionar todas sus estadísticas y su vitrina completa de medallas.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* PIE DEL MODAL */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0 gap-2">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">
              ¡Demostrá tus conocimientos y convertite en Jurisconsulto!
            </span>
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all shrink-0"
            >
              ¡A Jugar!
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
