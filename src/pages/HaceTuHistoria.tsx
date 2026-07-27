import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  TEMPORADAS_JUEGO, 
  SKILLS_DISPONIBLES, 
  SkillDefinition, 
  TemporadaDilema, 
  OpcionDilema,
  ImpactoStats
} from "@/data/haceTuHistoriaData";
import { 
  ShieldAlert, 
  Scale, 
  Award, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Trophy,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HaceTuHistoria() {
  const { user, profile } = useAuth();
  
  // Acceso Beta / Admin
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

  // Estado del Juego
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  const [currentSeasonIdx, setCurrentSeasonIdx] = useState(0);

  // Estadísticas (Start at 50/100)
  const [stats, setStats] = useState<ImpactoStats>({
    prestigio: 50,
    contactos: 50,
    etica: 50,
    billetera: 50
  });

  // Historial de la partida
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [lastOptionText, setLastOptionText] = useState<string | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);

  const isAdminUser = profile?.role === "admin" || isAdminUnlocked;

  // Promedio OVR
  const calculateOVR = (s: ImpactoStats) => {
    return Math.round((s.prestigio + s.contactos + s.etica + s.billetera) / 4);
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = adminCodeInput.trim().toUpperCase();
    if (cleanCode === "ADMIN" || cleanCode === "ADMIN2026" || cleanCode === "AGY2026" || cleanCode === "SI" || cleanCode === "SI POSEO") {
      setIsAdminUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const startNewGame = (skill: SkillDefinition) => {
    setSelectedSkill(skill);
    setStats({ prestigio: 50, contactos: 50, etica: 50, billetera: 50 });
    setCurrentSeasonIdx(0);
    setLastFeedback(null);
    setLastOptionText(null);
    setGameOverReason(null);
    setIsVictory(false);
    setGameStarted(true);
  };

  const handleMakeChoice = (opcion: OpcionDilema) => {
    const newStats: ImpactoStats = {
      prestigio: Math.min(100, Math.max(0, stats.prestigio + opcion.impacto.prestigio)),
      contactos: Math.min(100, Math.max(0, stats.contactos + opcion.impacto.contactos)),
      etica: Math.min(100, Math.max(0, stats.etica + opcion.impacto.etica)),
      billetera: Math.min(100, Math.max(0, stats.billetera + opcion.impacto.billetera))
    };

    setStats(newStats);
    setLastOptionText(opcion.texto);
    setLastFeedback(opcion.feedbackNarrativo);

    // Verificar Game Over (Muerte Súbita)
    if (newStats.etica <= 0) {
      setGameOverReason("🏛️ RETIRO DE MATRÍCULA: El Tribunal de Disciplina del Colegio de Abogados de La Plata (CALP) resolvió sancionarte con el retiro definitivo de la matrícula profesional debido a infracciones graves a la ética procesal.");
      return;
    }
    if (newStats.billetera <= 0) {
      setGameOverReason("💰 QUIEBRA Y DESAHUCIO: Entraste en morosidad total. No podés saldar los aportes a la Caja Previsional ni el alquiler del despacho en Antigravity. Tuviste que abandonar el ejercicio de la abogacía.");
      return;
    }
    if (newStats.prestigio <= 0) {
      setGameOverReason("⚖️ ESCARNIO PÚBLICO: Perdiste la confianza de los Magistrados de Tribunales y la comunidad platense. Ningún cliente acepta ser representado por tu firma.");
      return;
    }
    if (newStats.contactos <= 0) {
      setGameOverReason("🤝 AISLAMIENTO POLÍTICO: Quedaste aislado sin margen de maniobra institucional en los pasillos judiciales ni en la UNLP. Tu práctica profesional quedó paralizada.");
      return;
    }

    // Avanzar de temporada o ganar
    if (currentSeasonIdx + 1 < TEMPORADAS_JUEGO.length) {
      setCurrentSeasonIdx(prev => prev + 1);
    } else {
      setIsVictory(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedSkill(null);
    setCurrentSeasonIdx(0);
    setGameOverReason(null);
    setIsVictory(false);
  };

  const currentSeason: TemporadaDilema = TEMPORADAS_JUEGO[currentSeasonIdx];

  // 1. PANTALLA BETA / ADMIN ACCESO RESTRINGIDO
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-lg w-full bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase font-display">
              ⚠️ MÓDULO FASE BETA
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              Acceso restringido. El sistema de usuarios de <strong>dndjursoc.com.ar</strong> indica que requiere validación de perfil Administrador para iniciar la simulación de carrera legal.
            </p>
          </div>

          <form onSubmit={handleAdminVerify} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Confirmación de Credenciales / Clave de Acceso
              </label>
              <input
                type="text"
                placeholder="Ingresá 'ADMIN' o 'SI'"
                value={adminCodeInput}
                onChange={(e) => setAdminCodeInput(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono font-bold placeholder:text-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {codeError && (
              <p className="text-xs text-red-400 font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 text-center">
                Código o confirmación inválida. Ingresá 'ADMIN' o 'SI' para acceder en fase Beta.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer min-h-[44px]"
            >
              Confirmar Acceso Administrador
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link to="/juegos" className="text-xs text-slate-400 hover:text-white underline">
              ← Volver al Hub de Juegos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. PANTALLA SELECCIÓN DE SKILL INICIAL
  if (isAdminUser && !gameStarted) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-8 md:py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulador de Carrera Jurídica — Antigravity Legal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              HACÉ TU HISTORIA
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Egresaste de la FCJyS (Jursoc UNLP) a los 23 años e ingresás al innovador estudio <strong>Antigravity</strong> en La Plata. Elegí tu especialidad técnica inicial para arrancar la Temporada 1.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILLS_DISPONIBLES.map((skill) => (
              <motion.div
                key={skill.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startNewGame(skill)}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all cursor-pointer space-y-3 flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                    {skill.id === "litigio_penal" && <Scale className="w-5 h-5" />}
                    {skill.id === "contratos" && <FileText className="w-5 h-5" />}
                    {skill.id === "rosca_politica" && <Users className="w-5 h-5" />}
                    {skill.id === "ciberseguridad" && <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <h3 className="font-black text-base text-white group-hover:text-indigo-300 transition-colors">{skill.nombre}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{skill.descripcion}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-indigo-400">
                  <span>{skill.beneficio}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. PANTALLA GAME OVER (MUERTE SÚBITA)
  if (gameOverReason) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-400 uppercase tracking-tight">GAME OVER — MUERTE SÚBITA</h2>
            <p className="text-xs text-slate-400 font-mono">Carrera interrumpida a los {currentSeason.edadInicio} años</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-slate-200 text-xs md:text-sm leading-relaxed text-left space-y-2">
            <p className="font-bold">{gameOverReason}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Nueva Carrera</span>
            </button>
            <Link
              to="/juegos"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all text-center"
            >
              Volver a Juegos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. PANTALLA VICTORIA / FINAL DE LA CARRERA
  if (isVictory) {
    const finalOVR = calculateOVR(stats);
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              ¡CARRERA COMPLETADA CON ÉXITO!
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white pt-2">Leyenda Jurídica de La Plata</h2>
            <p className="text-xs text-slate-400">Managing Partner en Antigravity & Referente del Fuero Bonaerense</p>
          </div>

          {/* STATS FINALES */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">OVR Final de Carrera</span>
              <span className="text-xl font-black text-amber-400 font-mono">{finalOVR} / 100</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-left">
              <div className="p-2 rounded-xl bg-white/5">⚖️ Prestigio: <span className="text-amber-400">{stats.prestigio}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🤝 Contactos: <span className="text-indigo-400">{stats.contactos}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🏛️ Ética: <span className="text-emerald-400">{stats.etica}</span></div>
              <div className="p-2 rounded-xl bg-white/5">💰 Billetera: <span className="text-green-400">{stats.billetera}</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Historia</span>
            </button>
            <Link
              to="/juegos"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all text-center"
            >
              Volver al Hub de Juegos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. MOTOR PRINCIPAL DE DIPLOMACIA Y DECISIONES (TEMPORADAS 1 A 4)
  const currentOVR = calculateOVR(stats);

  return (
    <div className="min-h-screen bg-[#070A14] text-white py-6 md:py-10 px-3 md:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* HEADER DE ESTADO */}
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-4 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-500/30">
                <Briefcase className="w-3 h-3" />
                <span>[{currentSeason.edadInicio} a {currentSeason.edadFin} Años]</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white mt-1">{currentSeason.puesto} — Antigravity</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">OVR General</span>
                <span className="text-xl font-black text-amber-400 font-mono">{currentOVR}</span>
              </div>
              {selectedSkill && (
                <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{selectedSkill.nombre}</span>
                </div>
              )}
            </div>
          </div>

          {/* TABLERO DE ESTADÍSTICAS (STATS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">⚖️ Prestigio</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-white">{stats.prestigio}/100</span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${stats.prestigio}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🤝 Contactos (Rosca)</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-white">{stats.contactos}/100</span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 transition-all duration-500" style={{ width: `${stats.contactos}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🏛️ Ética</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-white">{stats.etica}/100</span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${stats.etica}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">💰 Billetera</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-white">{stats.billetera}/100</span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${stats.billetera}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ULTIMO FEEDBACK NARRATIVO */}
        <AnimatePresence mode="wait">
          {lastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs md:text-sm space-y-1"
            >
              <p className="font-black text-[10px] uppercase text-indigo-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resultado de tu decisión anterior:
              </p>
              <p className="italic leading-relaxed">{lastFeedback}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NARRATIVA Y DILEMA DE LA TEMPORADA */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-black text-white">{currentSeason.titulo}</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{currentSeason.contextoEscenario}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/15 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              El Dilema Procesal:
            </span>
            <p className="text-sm md:text-base font-bold text-white leading-snug">{currentSeason.dilemaTexto}</p>
          </div>

          {/* OPCIONES DE ACCIÓN */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ¿Qué decisión tomás para continuar tu carrera en La Plata?
            </span>

            <div className="space-y-2.5">
              {currentSeason.opciones.map((opcion) => {
                const isSkillLocked = opcion.requiereSkillId && opcion.requiereSkillId !== selectedSkill?.id;
                if (isSkillLocked) return null; // No mostrar si es para otra skill

                const isSkillOption = Boolean(opcion.requiereSkillId && opcion.requiereSkillId === selectedSkill?.id);

                return (
                  <motion.button
                    key={opcion.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleMakeChoice(opcion)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer min-h-[54px] flex items-center justify-between gap-3 group",
                      isSkillOption
                        ? "bg-gradient-to-r from-indigo-600/30 via-slate-900 to-violet-600/30 border-indigo-500/60 shadow-lg shadow-indigo-900/20"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                    )}
                  >
                    <div className="space-y-1">
                      {isSkillOption && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          [Opción Desbloqueada por Skill: {selectedSkill?.nombre}]
                        </span>
                      )}
                      <p className="text-xs md:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {opcion.texto}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
