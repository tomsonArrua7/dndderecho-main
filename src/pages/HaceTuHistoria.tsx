import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  ETAPAS_CARRERA, 
  SKILLS_DISPONIBLES, 
  SkillDefinition, 
  EtapaVida, 
  OpcionDilema,
  ImpactoStats,
  RamasPuntuacion,
  EventoInesperado
} from "@/data/haceTuHistoriaData";
import { 
  ShieldAlert, 
  Scale, 
  RotateCcw, 
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
  GraduationCap,
  TrendingUp,
  Award,
  Zap,
  Info,
  Dice5
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HaceTuHistoria() {
  const { user, profile, loading } = useAuth();
  
  // Verificación estricta de Admin
  const isAdminUser = profile?.role === "admin";

  // Estado del Juego
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  const [currentEtapaIdx, setCurrentEtapaIdx] = useState(0);

  // Estadísticas del jugador
  const [prestigio, setPrestigio] = useState(50);
  const [contactos, setContactos] = useState(50);
  const [etica, setEtica] = useState(50);
  const [saludMental, setSaludMental] = useState(80);
  const [dineroPesos, setDineroPesos] = useState(35000);

  // Evento Inesperado Activo de la Etapa
  const [activeRandomEvent, setActiveRandomEvent] = useState<EventoInesperado | null>(null);
  const [hasDismissedEvent, setHasDismissedEvent] = useState(false);

  // Puntuación acumulativa por rama del derecho
  const [ramas, setRamas] = useState<RamasPuntuacion>({
    penal: 0,
    civilComercial: 0,
    administrativoPublico: 0,
    cibertech: 0
  });

  // Resumen Bi-Anual
  const [showBiAnnualSummary, setShowBiAnnualSummary] = useState(false);
  const [lastImpact, setLastImpact] = useState<ImpactoStats | null>(null);

  // Historial de la partida
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);

  // Al iniciar o cambiar de etapa, seleccionar un Evento Inesperado aleatorio (1 de entre 5)
  useEffect(() => {
    if (gameStarted && ETAPAS_CARRERA[currentEtapaIdx]) {
      const stageEvents = ETAPAS_CARRERA[currentEtapaIdx].eventosInesperados;
      if (stageEvents && stageEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * stageEvents.length);
        const selectedEvent = stageEvents[randomIndex];
        setActiveRandomEvent(selectedEvent);
        setHasDismissedEvent(false);

        // Aplicar el impacto del evento inmediatamente a las stats
        const imp = selectedEvent.impacto;
        setPrestigio(p => Math.min(100, Math.max(0, p + imp.prestigio)));
        setContactos(c => Math.min(100, Math.max(0, c + imp.contactos)));
        setEtica(e => Math.min(100, Math.max(0, e + imp.etica)));
        setSaludMental(s => Math.min(100, Math.max(0, s + imp.saludMental)));
        setDineroPesos(d => Math.max(0, d + imp.dineroPesos));
      }
    }
  }, [currentEtapaIdx, gameStarted]);

  // Si no es admin, redirigir inmediatamente a /mi-espacio
  if (!loading && (!user || !isAdminUser)) {
    return <Navigate to="/mi-espacio" replace />;
  }

  // Formateador de Pesos Argentinos ($)
  const formatPesos = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Determinar la Rama del Derecho Predominante
  const getDominantBranch = (r: RamasPuntuacion) => {
    const scores = [
      { name: "Penalista & Garantías", score: r.penal, icon: Scale },
      { name: "Civilista & Comercial", score: r.civilComercial, icon: FileText },
      { name: "Derecho Público & Administrativo", score: r.administrativoPublico, icon: Users },
      { name: "Ciberderecho & Tech", score: r.cibertech, icon: ShieldCheck }
    ];
    scores.sort((a, b) => b.score - a.score);
    return scores[0];
  };

  // OVR Promedio Ponderado
  const calculateOVR = () => {
    return Math.round((prestigio * 0.35) + (contactos * 0.25) + (etica * 0.25) + (saludMental * 0.15));
  };

  const startNewGame = (skill: SkillDefinition) => {
    setSelectedSkill(skill);
    setPrestigio(50);
    setContactos(50);
    setEtica(50);
    setSaludMental(80);
    setDineroPesos(35000);
    setRamas({ penal: 0, civilComercial: 0, administrativoPublico: 0, cibertech: 0 });
    setCurrentEtapaIdx(0);
    setLastFeedback(null);
    setLastImpact(null);
    setShowBiAnnualSummary(false);
    setGameOverReason(null);
    setIsVictory(false);
    setGameStarted(true);
  };

  const handleMakeChoice = (opcion: OpcionDilema) => {
    const impact = opcion.impacto;
    setLastImpact(impact);

    const newPrestigio = Math.min(100, Math.max(0, prestigio + impact.prestigio));
    const newContactos = Math.min(100, Math.max(0, contactos + impact.contactos));
    const newEtica = Math.min(100, Math.max(0, etica + impact.etica));
    const newSaludMental = Math.min(100, Math.max(0, saludMental + impact.saludMental));
    const newDinero = Math.max(0, dineroPesos + impact.dineroPesos);

    setPrestigio(newPrestigio);
    setContactos(newContactos);
    setEtica(newEtica);
    setSaludMental(newSaludMental);
    setDineroPesos(newDinero);

    if (impact.impactoRamas) {
      setRamas(prev => ({
        penal: prev.penal + (impact.impactoRamas?.penal || 0),
        civilComercial: prev.civilComercial + (impact.impactoRamas?.civilComercial || 0),
        administrativoPublico: prev.administrativoPublico + (impact.impactoRamas?.administrativoPublico || 0),
        cibertech: prev.cibertech + (impact.impactoRamas?.cibertech || 0)
      }));
    }

    setLastFeedback(opcion.feedbackNarrativo);

    // Verificar Game Over (Muerte Súbita)
    if (newSaludMental <= 0) {
      setGameOverReason("🧠 BURNOUT TOTAL / COLAPSO POR ESTRÉS: El nivel de estrés extremo, insomnio y exigencia académica/laboral destruyeron tu salud mental. Tuviste que abandonar la profesión por indicación médica urgente.");
      return;
    }
    if (newEtica <= 0) {
      setGameOverReason("🏛️ RETIRO DE MATRÍCULA: El Tribunal de Disciplina del Colegio de Abogados de La Plata (CALP) resolvió retirarte la matrícula profesional por faltas graves a la ética.");
      return;
    }
    if (newDinero <= 0 && currentEtapaIdx >= 6) {
      setGameOverReason("💰 QUIEBRA Y DESAHUCIO FINANCIERO: Te quedaste sin un solo peso para saldar el alquiler del estudio y los aportes a la Caja Previsional. Tuviste que abandonar el ejercicio de la abogacía.");
      return;
    }
    if (newPrestigio <= 0) {
      setGameOverReason("⚖️ ESCARNIO PÚBLICO EN LA PLATA: Perdiste todo tu prestigio técnico. Los magistrados desestiman tus escritos por defecto y los clientes no confían en tu firma.");
      return;
    }

    // Mostrar Resumen Bi-Anual antes de pasar a la siguiente etapa
    setShowBiAnnualSummary(true);
  };

  const nextEtapa = () => {
    setShowBiAnnualSummary(false);
    if (currentEtapaIdx + 1 < ETAPAS_CARRERA.length) {
      setCurrentEtapaIdx(prev => prev + 1);
    } else {
      setIsVictory(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedSkill(null);
    setCurrentEtapaIdx(0);
    setGameOverReason(null);
    setIsVictory(false);
  };

  const currentEtapa: EtapaVida = ETAPAS_CARRERA[currentEtapaIdx];
  const dominantBranch = getDominantBranch(ramas);

  // 1. SELECCIÓN DE SKILL INICIAL
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-8 md:py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Simulador de Carrera Legal — UNLP & La Plata</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              HACÉ TU HISTORIA
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Comenzás a los 18 años como estudiante de 1er año en la FCJyS (Jursoc UNLP). Elegí tu habilidad técnica inicial para iniciar la aventura académica y profesional hasta los 65 años.
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

  // 2. MODAL RESUMEN BI-ANUAL DE CRECIMIENTO
  if (showBiAnnualSummary && lastImpact) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg w-full bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
              RESUMEN DE RESULTADOS DE ETAPA [{currentEtapa.edadInicio} - {currentEtapa.edadFin} AÑOS]
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white pt-1">Impacto Directo de Tu Elección</h2>
          </div>

          {/* ULTIMO FEEDBACK */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs md:text-sm space-y-1">
            <p className="font-bold text-indigo-300 text-[11px] uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Consecuencia Procesal / Personal:
            </p>
            <p className="italic leading-relaxed text-slate-300">{lastFeedback}</p>
          </div>

          {/* VARIACIÓN VOLÁTIL DE STATS */}
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">⚖️ Prestigio:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.prestigio >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.prestigio >= 0 ? `+${lastImpact.prestigio}` : lastImpact.prestigio}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">🤝 Contactos:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.contactos >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.contactos >= 0 ? `+${lastImpact.contactos}` : lastImpact.contactos}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">🏛️ Ética:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.etica >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.etica >= 0 ? `+${lastImpact.etica}` : lastImpact.etica}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">🧠 Salud Mental:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.saludMental >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.saludMental >= 0 ? `+${lastImpact.saludMental}` : lastImpact.saludMental}
              </span>
            </div>

            <div className="col-span-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">💰 Variación Financiera ($):</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.dineroPesos >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.dineroPesos >= 0 ? `+${formatPesos(lastImpact.dineroPesos)}` : formatPesos(lastImpact.dineroPesos)}
              </span>
            </div>
          </div>

          {/* PERFIL PREDOMINANTE DE RAMA */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-amber-300">
              <Award className="w-4 h-4" />
              <span>Inclinación de Rama Actual:</span>
            </div>
            <span className="text-white uppercase font-black">{dominantBranch.name}</span>
          </div>

          <button
            onClick={nextEtapa}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[46px]"
          >
            <span>Avanzar a los {currentEtapa.edadFin} Años</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
            <p className="text-xs text-slate-400 font-mono">Carrera interrumpida a los {currentEtapa.edadInicio} años</p>
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
              <span>Reintentar Nueva Carrera desde 1er Año (18 Años)</span>
            </button>
            <Link
              to="/mi-espacio"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all text-center"
            >
              Volver a Mi Espacio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. PANTALLA VICTORIA / JUBILACIÓN A LOS 65 AÑOS
  if (isVictory) {
    const finalOVR = calculateOVR();
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              ¡JUBILACIÓN COMPLETADA A LOS 65 AÑOS!
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white pt-2">Leyenda Jurídica de La Plata</h2>
            <p className="text-xs text-slate-400">Egresado/a de la FCJyS UNLP con trayectoria consagrada en la provincia</p>
          </div>

          {/* STATS FINALES */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Patrimonio Neto Final ($)</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs font-bold text-center">
              <div className="p-2 rounded-xl bg-white/5">⚖️ Pres.: <span className="text-amber-400 block font-mono text-sm">{prestigio}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🤝 Rosca: <span className="text-indigo-400 block font-mono text-sm">{contactos}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🏛️ Ética: <span className="text-emerald-400 block font-mono text-sm">{etica}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🧠 Salud: <span className="text-rose-400 block font-mono text-sm">{saludMental}</span></div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold flex items-center justify-between">
              <span className="text-indigo-300">Perfil de Rama Definitivo:</span>
              <span className="text-white uppercase font-black">{dominantBranch.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Historia desde 1er Año</span>
            </button>
            <Link
              to="/mi-espacio"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all text-center"
            >
              Volver a Mi Espacio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. PANTALLA PRINCIPAL DE JUEGO
  const currentOVR = calculateOVR();

  return (
    <div className="min-h-screen bg-[#070A14] text-white py-6 md:py-10 px-3 md:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* HEADER DE ESTADO Y MONEDA REAL */}
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-4 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>[{currentEtapa.edadInicio} a {currentEtapa.edadFin} Años de Edad]</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white mt-1">{currentEtapa.puesto}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">OVR General</span>
                <span className="text-xl font-black text-amber-400 font-mono">{currentOVR}</span>
              </div>
              <div className="text-right border-l border-white/10 pl-4">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Patrimonio ($)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
              </div>
            </div>
          </div>

          {/* TABLERO DE STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">⚖️ Prestigio</span>
              <span className="font-mono font-black text-sm text-amber-400">{prestigio}/100</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🤝 Rosca / Contactos</span>
              <span className="font-mono font-black text-sm text-indigo-400">{contactos}/100</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🏛️ Ética</span>
              <span className="font-mono font-black text-sm text-emerald-400">{etica}/100</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🧠 Salud Mental</span>
              <span className={cn("font-mono font-black text-sm", saludMental < 30 ? "text-red-400 animate-pulse" : "text-rose-400")}>
                {saludMental}/100
              </span>
            </div>
          </div>
        </div>

        {/* TARJETA DE EVENTO INESPERADO (RANDOM EVENT) */}
        <AnimatePresence mode="wait">
          {activeRandomEvent && !hasDismissedEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "p-4 md:p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden",
                activeRandomEvent.tipo === "positivo" && "bg-emerald-950/60 border-emerald-500/40 text-emerald-200 shadow-emerald-950/30",
                activeRandomEvent.tipo === "negativo" && "bg-red-950/60 border-red-500/40 text-red-200 shadow-red-950/30",
                activeRandomEvent.tipo === "neutro" && "bg-slate-900/90 border-slate-700 text-slate-200 shadow-slate-950/30"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Dice5 className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    ¡EVENTO INESPERADO DE ETAPA!
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{activeRandomEvent.titulo}</h4>
                <p className="text-xs text-white/80 leading-relaxed">{activeRandomEvent.descripcion}</p>
              </div>

              <button
                onClick={() => setHasDismissedEvent(true)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer border border-white/10 transition-all self-end md:self-center"
              >
                Entendido ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NARRATIVA Y DILEMA DE LA ETAPA DE VIDA */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-black text-white">{currentEtapa.titulo}</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{currentEtapa.contextoEscenario}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/15 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              El Dilema Crítico:
            </span>
            <p className="text-sm md:text-base font-bold text-white leading-snug">{currentEtapa.dilemaTexto}</p>
          </div>

          {/* OPCIONES DE ACCIÓN */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ¿Qué decisión tomás?
            </span>

            <div className="space-y-2.5">
              {currentEtapa.opciones.map((opcion) => {
                const isSkillLocked = opcion.requiereSkillId && opcion.requiereSkillId !== selectedSkill?.id;
                if (isSkillLocked) return null;

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
