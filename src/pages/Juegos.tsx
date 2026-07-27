import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Swords, Sparkles, Scale, ShieldCheck, ArrowRight, Flame, BookOpenCheck, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Juegos() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#070A14] text-white py-8 md:py-14 px-4 md:px-8 relative overflow-hidden">
      {/* Visual Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 md:space-y-12">
        
        {/* HEADER DE LA SECCIÓN JUEGOS */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Centro de Entrenamiento Jurídico Jursoc</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-red-400 bg-clip-text text-transparent">
            Sección Juegos
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Poné a prueba tu rigor dogmático, simulá decisiones procesales en la ciudad de La Plata y competí con compañeros de la Facultad de Ciencias Jurídicas y Sociales (UNLP).
          </p>
        </div>

        {/* CONTENEDOR DE JUEGOS DESTACADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* JUEGO 1: TRIVIA JURÍDICA 1V1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-400">
                  <Trophy className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  213 Preguntas + Duelos 1v1
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  Desafío Jurídico Trivia
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Cuestionarios masivos por materias (Civil, Penal, Constitucional, Administrativo), 6 Rangos Jurídicos oficiales, Comodines de Cátedra y <strong>Duelos 1v1 en tiempo real</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Comodines de Cátedra</span>
                </div>
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Duelos 1v1 por Código</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/trivia"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs md:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-500/20 transition-all uppercase tracking-wider min-h-[46px]"
              >
                <span>¡Jugar Trivia Ahora!</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* JUEGO 2: HACÉ TU HISTORIA (ANTIGRAVITY LEGAL) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] via-slate-900 to-slate-950 border border-indigo-500/30 hover:border-indigo-500/60 transition-all shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-300">
                  <Scale className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Modo Carrera RPG
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                  HACÉ TU HISTORIA
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Aventura conversacional de simulación de carrera jurídica. Ingresás al estudio <strong>Antigravity</strong> en La Plata a los 23 años. Tomá decisiones éticas, políticas e influyentes para alcanzar la cima.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mecanismos de Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Avance de 2 en 2 años</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/hace-tu-historia"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs md:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-wider min-h-[46px]"
              >
                <span>Iniciar Mi Historia ⚡</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
