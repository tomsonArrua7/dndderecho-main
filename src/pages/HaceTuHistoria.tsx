import { useState } from "react";
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
  RamasPuntuacion
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
  Coins,
  TrendingUp,
  Award
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
  const [dineroPesos, setDineroPesos] = useState(35000); // Ahorros iniciales universitaria en Pesos

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

  // OVR Promedio
  const calculateOVR = () => {
    return Math.round((prestigio + contactos + etica) / 3);
  };

  const startNewGame = (skill: SkillDefinition) => {
    setSelectedSkill(skill);
    setPrestigio(50);
    setContactos(50);
    setEtica(50);
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
    const newDinero = Math.max(0, dineroPesos + impact.dineroPesos);

    setPrestigio(newPrestigio);
    setContactos(newContactos);
    setEtica(newEtica);
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
    if (newEtica <= 0) {
      setGameOverReason("🏛️ RETIRO DE MATRÍCULA: El Tribunal de Disciplina del Colegio de Abogados de La Plata (CALP) resolvió retirarte la matrícula profesional por faltas graves a la ética.");
      return;
    }
    if (newDinero <= 0 && currentEtapaIdx >= 3) {
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
              Comenzás a los 18 años como estudiante de 1er año en la FCJyS (Jursoc UNLP). Elegí tu inclinación o habilidad inicial para iniciar la aventura académica y profesional hasta los 65 años.
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

  // 2. MODAL RESUMEN BI-ANUAL DE CRECIMIENTO (CADA 2 AÑOS)
  if (showBiAnnualSummary && lastImpact) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg w-full bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
              RESUMEN BI-ANUAL DE CRECIMIENTO [{currentEtapa.edadInicio} - {currentEtapa.edadFin} AÑOS]
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white pt-1">Evolución de Tu Perfil Jurídico</h2>
          </div>

          {/* ULTIMO FEEDBACK */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs md:text-sm space-y-1">
            <p className="font-bold text-indigo-300 text-[11px] uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Impacto de tu última decisión:
            </p>
            <p className="italic leading-relaxed text-slate-300">{lastFeedback}</p>
          </div>

          {/* VARIACIÓN DE STATS */}
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">⚖️ Prestigio:</span>
              <span className={cn("font-mono font-black", lastImpact.prestigio >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.prestigio >= 0 ? `+${lastImpact.prestigio}` : lastImpact.prestigio}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">🤝 Contactos:</span>
              <span className={cn("font-mono font-black", lastImpact.contactos >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.contactos >= 0 ? `+${lastImpact.contactos}` : lastImpact.contactos}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">🏛️ Ética:</span>
              <span className={cn("font-mono font-black", lastImpact.etica >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.etica >= 0 ? `+${lastImpact.etica}` : lastImpact.etica}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">💰 Dinero Real:</span>
              <span className={cn("font-mono font-black", lastImpact.dineroPesos >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.dineroPesos >= 0 ? `+${formatPesos(lastImpact.dineroPesos)}` : formatPesos(lastImpact.dineroPesos)}
              </span>
            </div>
          </div>

          {/* PERFIL PREDOMINANTE DE RAMA */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-amber-300">
              <Award className="w-4 h-4" />
              <span>Perfil Predominante:</span>
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
              <span>Reintentar Nueva Carrera desde los 18 Años</span>
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
              ¡JUBILACIÓN A LOS 65 AÑOS COMPLETADA!
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white pt-2">Leyenda Jurídica Platense</h2>
            <p className="text-xs text-slate-400">Graduado/a de la FCJyS UNLP con una trayectoria histórica en la provincia</p>
          </div>

          {/* STATS FINALES */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Patrimonio Neto Acumulado ($)</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
              <div className="p-2.5 rounded-xl bg-white/5">⚖️ Prestigio: <span className="text-amber-400 block font-mono text-sm">{prestigio}</span></div>
              <div className="p-2.5 rounded-xl bg-white/5">🤝 Contactos: <span className="text-indigo-400 block font-mono text-sm">{contactos}</span></div>
              <div className="p-2.5 rounded-xl bg-white/5">🏛️ Ética: <span className="text-emerald-400 block font-mono text-sm">{etica}</span></div>
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

  // 5. PANTALLA PRINCIPAL DE JUEGO (ETAPAS DE 18 A 65 AÑOS)
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

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Patrimonio Neto ($)</span>
                <span className="text-lg md:text-xl font-black text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
              </div>
              {selectedSkill && (
                <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{selectedSkill.nombre}</span>
                </div>
              )}
            </div>
          </div>

          {/* TABLERO DE STATS & RAMA DOMINANTE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">⚖️ Prestigio Técnico</span>
              <span className="font-mono font-black text-sm text-amber-400">{prestigio}/100</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🤝 Contactos (Rosca)</span>
              <span className="font-mono font-black text-sm text-indigo-400">{contactos}/100</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">🏛️ Ética Profes.</span>
              <span className="font-mono font-black text-sm text-emerald-400">{etica}/100</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black block">📜 Rama Principal</span>
              <span className="font-black text-[11px] text-white truncate block">{dominantBranch.name}</span>
            </div>
          </div>
        </div>

        {/* NARRATIVA Y DILEMA DE LA ETAPA DE VIDA */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-black text-white">{currentEtapa.titulo}</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{currentEtapa.contextoEscenario}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/15 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              El Dilema de la Etapa:
            </span>
            <p className="text-sm md:text-base font-bold text-white leading-snug">{currentEtapa.dilemaTexto}</p>
          </div>

          {/* OPCIONES DE ACCIÓN */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ¿Qué camino elegís tomar?
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
