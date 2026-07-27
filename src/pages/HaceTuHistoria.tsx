import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  ETAPAS_CARRERA, 
  SKILLS_DISPONIBLES, 
  PROVINCIAS_ARGENTINA,
  MUNICIPIOS_PBA,
  LOGROS_JUEGO,
  CarreraGuardada,
  SkillDefinition, 
  EtapaVida, 
  OpcionDilema,
  ImpactoStats,
  RamasPuntuacion,
  EventoInesperado,
  LogroDefinition
} from "@/data/haceTuHistoriaData";
import { 
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
  Dice5,
  MapPin,
  Clock,
  Lock,
  Coins,
  Building2,
  UserPlus,
  ChevronDown,
  History,
  Medal,
  Calendar,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffConfig {
  expertoCount: number;
  juniorCount: number;
  hasContador: boolean;
  estudioNombre: string;
}

export default function HaceTuHistoria() {
  const { user, profile, loading } = useAuth();
  
  // Verificación estricta de Admin
  const isAdminUser = profile?.role === "admin";

  // Pestañas Pre-Juego: "setup" | "logros" | "historial"
  const [activePreGameTab, setActivePreGameTab] = useState<"setup" | "logros" | "historial">("setup");

  // Setup Inicial de Personaje: Selector de Provincia y Ciudad
  const [selectedProvincia, setSelectedProvincia] = useState("Buenos Aires");
  const [selectedMunicipioPBA, setSelectedMunicipioPBA] = useState("La Plata (Capital)");
  const [customCiudadNatal, setCustomCiudadNatal] = useState("");
  const [selectedEdadInicial, setSelectedEdadInicial] = useState<18 | 25>(18);
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  
  // Estado del Juego
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEtapaIdx, setCurrentEtapaIdx] = useState(0);

  // Estadísticas del jugador
  const [prestigio, setPrestigio] = useState(50);
  const [contactos, setContactos] = useState(50);
  const [etica, setEtica] = useState(50);
  const [templanza, setTemplanza] = useState(75);
  const [dineroPesos, setDineroPesos] = useState(35000);

  // Gestión de Empleados y Gastos Fijos (Etapa 7+)
  const [staff, setStaff] = useState<StaffConfig>({
    expertoCount: 0,
    juniorCount: 0,
    hasContador: false,
    estudioNombre: "DND & Asociados"
  });

  // Logros Desbloqueados (Persistidos en localStorage)
  const [unlockedLogros, setUnlockedLogros] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dnd_historia_logros");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Historial de Carreras Anteriores (Persistidas en localStorage)
  const [carrerasPasadas, setCarrerasPasadas] = useState<CarreraGuardada[]>(() => {
    try {
      const saved = localStorage.getItem("dnd_historia_carreras");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newLogroAlert, setNewLogroAlert] = useState<LogroDefinition | null>(null);

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

  // Guardar logros en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dnd_historia_logros", JSON.stringify(unlockedLogros));
    } catch {
      // Ignorar
    }
  }, [unlockedLogros]);

  // Guardar historial de carreras en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dnd_historia_carreras", JSON.stringify(carrerasPasadas));
    } catch {
      // Ignorar
    }
  }, [carrerasPasadas]);

  // Al iniciar o cambiar de etapa, seleccionar un Evento Inesperado aleatorio
  useEffect(() => {
    if (gameStarted && ETAPAS_CARRERA[currentEtapaIdx]) {
      const stageEvents = ETAPAS_CARRERA[currentEtapaIdx].eventosInesperados;
      if (stageEvents && stageEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * stageEvents.length);
        const selectedEvent = stageEvents[randomIndex];
        setActiveRandomEvent(selectedEvent);
        setHasDismissedEvent(false);

        const imp = selectedEvent.impacto;
        setPrestigio(p => applyStatChange(p, imp.prestigio));
        setContactos(c => applyStatChange(c, imp.contactos));
        setEtica(e => applyStatChange(e, imp.etica));
        setTemplanza(s => applyStatChange(s, imp.templanza));
        setDineroPesos(d => Math.max(0, d + imp.dineroPesos));
      }
    }
  }, [currentEtapaIdx, gameStarted]);

  // Guardar carrera terminada en el Hall of Fame
  const saveCareerToHistory = (fueVictoria: boolean, motivo: string) => {
    const nuevaCarrera: CarreraGuardada = {
      id: Date.now().toString(),
      fechaISO: new Date().toLocaleDateString("es-AR"),
      ciudadNatal: getCiudadNatalNombre(),
      edadFinal: ETAPAS_CARRERA[currentEtapaIdx]?.edadFin || 65,
      ovrFinal: calculateOVRGeneral(),
      patrimonioFinal: dineroPesos,
      ramaPredominante: getDominantBranch().name,
      fueVictoria,
      motivoCierre: motivo
    };
    setCarrerasPasadas(prev => [nuevaCarrera, ...prev]);
  };

  // Si no es admin, redirigir inmediatamente a /mi-espacio
  if (!loading && (!user || !isAdminUser)) {
    return <Navigate to="/mi-espacio" replace />;
  }

  const getCiudadNatalNombre = () => {
    if (selectedProvincia === "Buenos Aires") {
      return selectedMunicipioPBA;
    }
    return customCiudadNatal.trim() ? `${customCiudadNatal.trim()} (${selectedProvincia})` : selectedProvincia;
  };

  function applyStatChange(currentVal: number, change: number): number {
    if (change > 0 && currentVal >= 70) {
      const nerfedGain = Math.round(change * 0.5);
      return Math.min(100, currentVal + nerfedGain);
    }
    return Math.min(100, Math.max(0, currentVal + change));
  }

  const formatPesos = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateOVRGeneral = () => {
    return Math.round((prestigio * 0.35) + (contactos * 0.25) + (etica * 0.25) + (templanza * 0.15));
  };

  const calculateOVRRamas = () => {
    return {
      penal: Math.min(100, Math.round((prestigio * 0.35) + (contactos * 0.25) + (ramas.penal * 0.40))),
      civil: Math.min(100, Math.round((prestigio * 0.35) + (etica * 0.25) + (ramas.civilComercial * 0.40))),
      publico: Math.min(100, Math.round((contactos * 0.40) + (etica * 0.20) + (ramas.administrativoPublico * 0.40))),
      tech: Math.min(100, Math.round((prestigio * 0.35) + (templanza * 0.25) + (ramas.cibertech * 0.40)))
    };
  };

  const getDominantBranch = () => {
    const ovrs = calculateOVRRamas();
    const scores = [
      { name: "Penalista & Garantías", ovr: ovrs.penal, icon: Scale },
      { name: "Civilista & Comercial", ovr: ovrs.civil, icon: FileText },
      { name: "Derecho Público & Administrativo", ovr: ovrs.publico, icon: Users },
      { name: "Ciberderecho & Tech", ovr: ovrs.tech, icon: ShieldCheck }
    ];
    scores.sort((a, b) => b.ovr - a.ovr);
    return scores[0];
  };

  const calculateGastosFijosBianuales = () => {
    if (currentEtapaIdx < 6) return 0;
    const costoMatriculaCALP = 250000;
    const costoExpertos = staff.expertoCount * 2400000;
    const costoJuniors = staff.juniorCount * 900000;
    const costoContador = staff.hasContador ? 700000 : 0;
    return costoMatriculaCALP + costoExpertos + costoJuniors + costoContador;
  };

  const checkLogrosUnlock = (newPrestigio: number, newContactos: number, newEtica: number, newDinero: number, currentStageIdx: number) => {
    LOGROS_JUEGO.forEach((logro) => {
      if (unlockedLogros.includes(logro.id)) return;

      let isUnlocked = false;
      if (logro.id === "logro_honores" && currentStageIdx === 5 && newPrestigio >= 75) isUnlocked = true;
      if (logro.id === "logro_magnate" && newDinero >= 25000000) isUnlocked = true;
      if (logro.id === "logro_incorruptible" && currentStageIdx >= 10 && newEtica >= 85) isUnlocked = true;
      if (logro.id === "logro_estrellas" && currentStageIdx >= 7) isUnlocked = true;
      if (logro.id === "logro_dnd_socio" && currentStageIdx >= 8) isUnlocked = true;
      if (logro.id === "logro_patria_chica" && selectedProvincia !== "Buenos Aires" && currentStageIdx >= 6) isUnlocked = true;

      if (isUnlocked) {
        setUnlockedLogros(prev => [...prev, logro.id]);
        setNewLogroAlert(logro);
      }
    });
  };

  const startNewGame = () => {
    if (!selectedSkill) return;

    setPrestigio(50);
    setContactos(50);
    setEtica(50);
    setTemplanza(selectedEdadInicial === 25 ? 65 : 80);
    setDineroPesos(selectedEdadInicial === 25 ? 450000 : 35000);
    setRamas({ penal: 0, civilComercial: 0, administrativoPublico: 0, cibertech: 0 });
    setStaff({ expertoCount: 0, juniorCount: 0, hasContador: false, estudioNombre: "DND & Asociados" });
    
    setCurrentEtapaIdx(selectedEdadInicial === 25 ? 1 : 0);
    setNewLogroAlert(null);
    setLastFeedback(null);
    setLastImpact(null);
    setShowBiAnnualSummary(false);
    setGameOverReason(null);
    setIsVictory(false);
    setGameStarted(true);
  };

  const handleMakeChoice = (opcion: OpcionDilema) => {
    if (opcion.costoPesosRequerido && dineroPesos < opcion.costoPesosRequerido) {
      return;
    }

    const impact = opcion.impacto;
    setLastImpact(impact);

    let newPrestigio = applyStatChange(prestigio, impact.prestigio);
    let newContactos = applyStatChange(contactos, impact.contactos);
    let newEtica = applyStatChange(etica, impact.etica);
    let newTemplanza = applyStatChange(templanza, impact.templanza);

    const gastosFijos = calculateGastosFijosBianuales();
    let netDineroChange = impact.dineroPesos - gastosFijos;

    if (staff.expertoCount > 0) newPrestigio = Math.min(100, newPrestigio + (staff.expertoCount * 5));
    if (staff.hasContador) netDineroChange += 500000;

    const newDinero = dineroPesos + netDineroChange;

    setPrestigio(newPrestigio);
    setContactos(newContactos);
    setEtica(newEtica);
    setTemplanza(newTemplanza);
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
    checkLogrosUnlock(newPrestigio, newContactos, newEtica, newDinero, currentEtapaIdx);

    // Muerte Súbita o Bancarrota
    if (newTemplanza <= 0) {
      const reason = "🧠 BURNOUT TOTAL / COLAPSO POR ESTRÉS: El nivel de estrés extremo destruyó tu templanza. Tuviste que abandonar la profesión.";
      setGameOverReason(reason);
      saveCareerToHistory(false, reason);
      return;
    }
    if (newEtica <= 0) {
      const reason = "🏛️ RETIRO DE MATRÍCULA: El Tribunal de Disciplina del CALP resolvió retirarte la matrícula profesional por faltas graves.";
      setGameOverReason(reason);
      saveCareerToHistory(false, reason);
      return;
    }
    if (newDinero <= 0 && currentEtapaIdx >= 6) {
      const reason = `💰 BANCARROTA Y EMBARGO: Te quedaste sin liquidez para saldar la matrícula del CALP y sueldos (${formatPesos(gastosFijos)}).`;
      setGameOverReason(reason);
      saveCareerToHistory(false, reason);
      return;
    }

    setShowBiAnnualSummary(true);
  };

  const nextEtapa = () => {
    setShowBiAnnualSummary(false);
    if (currentEtapaIdx + 1 < ETAPAS_CARRERA.length) {
      setCurrentEtapaIdx(prev => prev + 1);
    } else {
      setIsVictory(true);
      saveCareerToHistory(true, "¡Jubilación de Leyenda a los 65 Años!");
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
  const dominantBranch = getDominantBranch();
  const currentOVRGeneral = calculateOVRGeneral();
  const gastosFijosActuales = calculateGastosFijosBianuales();

  // 1. PANTALLA PRE-JUEGO (SETUP / LOGROS / HALL OF FAME)
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-8 md:py-12 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Plataforma DND & Asociados — UNLP</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              HACÉ TU HISTORIA
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explorá la carrera de abogacía, consultá tus logros obtenidos y revisá tu historial de carreras anteriores.
            </p>

            {/* PESTAÑAS NAVEGADOR PRE-JUEGO */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActivePreGameTab("setup")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "setup"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                )}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Nueva Carrera</span>
              </button>

              <button
                onClick={() => setActivePreGameTab("logros")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "logros"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                )}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Logros ({unlockedLogros.length}/{LOGROS_JUEGO.length})</span>
              </button>

              <button
                onClick={() => setActivePreGameTab("historial")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "historial"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                )}
              >
                <History className="w-4 h-4 text-indigo-400" />
                <span>Carreras Anteriores ({carrerasPasadas.length})</span>
              </button>
            </div>
          </div>

          {/* VISTA 1: SETUP DE NUEVA CARRERA */}
          {activePreGameTab === "setup" && (
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
              
              {/* SELECTOR DE PROVINCIA Y CIUDAD */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>1. Origen Geográfico (Provincia y Ciudad Natal)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-bold">Provincia:</span>
                    <div className="relative">
                      <select
                        value={selectedProvincia}
                        onChange={(e) => setSelectedProvincia(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-950 border border-white/15 text-white font-bold text-xs appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer pr-10"
                      >
                        {PROVINCIAS_ARGENTINA.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-bold">
                      {selectedProvincia === "Buenos Aires" ? "Municipio / Ciudad de PBA:" : "Escribí tu Ciudad Natal:"}
                    </span>

                    {selectedProvincia === "Buenos Aires" ? (
                      <div className="relative">
                        <select
                          value={selectedMunicipioPBA}
                          onChange={(e) => setSelectedMunicipioPBA(e.target.value)}
                          className="w-full p-3 rounded-2xl bg-slate-950 border border-white/15 text-white font-bold text-xs appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer pr-10"
                        >
                          {MUNICIPIOS_PBA.map((muni) => (
                            <option key={muni} value={muni}>{muni}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Ej: Villa María, Rosario, San Rafael..."
                        value={customCiudadNatal}
                        onChange={(e) => setCustomCiudadNatal(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-950 border border-white/15 text-white font-bold text-xs focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* EDAD DE INICIO */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2. Edad al Comenzar</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedEdadInicial(18)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1",
                      selectedEdadInicial === 18
                        ? "bg-indigo-600/30 border-indigo-500 text-white shadow-lg"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-white">🎓 18 Años (Ingresante UNLP)</span>
                      {selectedEdadInicial === 18 && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">Inicio desde 1er año. Ahorros iniciales de $35.000 y Templanza 80.</p>
                  </button>

                  <button
                    onClick={() => setSelectedEdadInicial(25)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1",
                      selectedEdadInicial === 25
                        ? "bg-indigo-600/30 border-indigo-500 text-white shadow-lg"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-white">💼 +25 Años (Estudiante Adulto)</span>
                      {selectedEdadInicial === 25 && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">Arrancás trabajando de empleado ($450.000/mes), pero con más nivel de estrés (Templanza 65).</p>
                  </button>
                </div>
              </div>

              {/* SELECCIÓN DE SKILL INICIAL */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Especialidad Técnica Inicial</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SKILLS_DISPONIBLES.map((skill) => (
                    <div
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between group shadow-lg",
                        selectedSkill?.id === skill.id
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-white">{skill.nombre}</span>
                          {selectedSkill?.id === skill.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{skill.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTÓN INICIAR HISTORIA */}
              <div className="pt-4">
                <button
                  disabled={!selectedSkill}
                  onClick={startNewGame}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all min-h-[50px]",
                    selectedSkill
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30 cursor-pointer"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                  )}
                >
                  <span>Iniciar Simulación de Carrera</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* VISTA 2: GALERÍA DE LOGROS */}
          {activePreGameTab === "logros" && (
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Galería de Logros Desbloqueables</span>
                </h3>
                <p className="text-xs text-slate-400">Los logros conseguidos se acumulan entre todas tus carreras jugadas.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LOGROS_JUEGO.map((logro) => {
                  const isUnlocked = unlockedLogros.includes(logro.id);
                  return (
                    <div
                      key={logro.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all space-y-2 flex items-start gap-3",
                        isUnlocked
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                          : "bg-white/[0.02] border-white/10 opacity-60 text-slate-400"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border font-bold",
                        isUnlocked ? "bg-amber-500/20 border-amber-500/50 text-amber-300" : "bg-slate-800 border-white/10 text-slate-500"
                      )}>
                        {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-white">{logro.nombre}</h4>
                          {isUnlocked && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Desbloqueado</span>}
                        </div>
                        <p className="text-xs text-slate-300">{logro.descripcion}</p>
                        <p className="text-[10px] text-amber-400/80 font-mono font-bold">Requisito: {logro.requisitoTexto}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA 3: HISTORIAL DE CARRERAS (HALL OF FAME) */}
          {activePreGameTab === "historial" && (
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  <span>Historial de Carreras Anteriores (Hall of Fame)</span>
                </h3>
                <p className="text-xs text-slate-400">Registro histórico de todas las partidas jugadas hasta los 65 años o Game Over.</p>
              </div>

              {carrerasPasadas.length === 0 ? (
                <div className="p-8 text-center bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                  <History className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">Aún no completaste ninguna carrera.</p>
                  <p className="text-xs text-slate-500">Iniciá una simulación en la pestaña "Nueva Carrera" para inaugurar tu registro.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {carrerasPasadas.map((carrera) => (
                    <div
                      key={carrera.id}
                      className={cn(
                        "p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all",
                        carrera.fueVictoria
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                          : "bg-red-950/40 border-red-500/40 text-red-200"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border",
                            carrera.fueVictoria ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-red-500/20 border-red-500/40 text-red-300"
                          )}>
                            {carrera.fueVictoria ? "Jubilación a los 65 Años" : `Muerte Súbita a los ${carrera.edadFinal} Años`}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{carrera.fechaISO}</span>
                        </div>
                        <h4 className="font-black text-base text-white">{carrera.ciudadNatal}</h4>
                        <p className="text-xs text-slate-300 italic">{carrera.motivoCierre}</p>
                      </div>

                      <div className="flex items-center gap-4 text-right self-end sm:self-center">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">OVR Final</span>
                          <span className="text-lg font-black text-amber-400 font-mono">{carrera.ovrFinal}</span>
                        </div>
                        <div className="border-l border-white/10 pl-4">
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Patrimonio ($)</span>
                          <span className="text-base font-black text-emerald-400 font-mono">{formatPesos(carrera.patrimonioFinal)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs md:text-sm space-y-1">
            <p className="font-bold text-indigo-300 text-[11px] uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Consecuencia Procesal / Personal:
            </p>
            <p className="italic leading-relaxed text-slate-300">{lastFeedback}</p>
          </div>

          {currentEtapaIdx >= 6 && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-xs font-bold space-y-1">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Deducción de Gastos Fijos (Matrícula + Staff):</span>
                <span className="text-red-400 font-mono">-{formatPesos(gastosFijosActuales)}</span>
              </div>
            </div>
          )}

          <AnimatePresence>
            {newLogroAlert && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-3"
              >
                <Trophy className="w-6 h-6 text-amber-400 shrink-0 animate-bounce" />
                <div>
                  <p className="font-black text-amber-300 uppercase text-[10px]">¡LOGRO DESBLOQUEADO!</p>
                  <p className="font-bold text-white text-sm">{newLogroAlert.nombre}</p>
                  <p className="text-[11px] text-amber-200/80">{newLogroAlert.descripcion}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
              <span className="text-slate-400">🧠 Templanza:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.templanza >= 0 ? "text-emerald-400" : "text-red-400")}>
                {lastImpact.templanza >= 0 ? `+${lastImpact.templanza}` : lastImpact.templanza}
              </span>
            </div>
          </div>

          <button
            onClick={() => { setNewLogroAlert(null); nextEtapa(); }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[46px]"
          >
            <span>Avanzar a los {currentEtapa.edadFin} Años</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. PANTALLA GAME OVER
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
              <span>Configurar Nueva Carrera</span>
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
            <p className="text-xs text-slate-400">Origen: {getCiudadNatalNombre()} — FCJyS UNLP</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Patrimonio Neto Final ($)</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs font-bold text-center">
              <div className="p-2 rounded-xl bg-white/5">⚖️ Pres.: <span className="text-amber-400 block font-mono text-sm">{prestigio}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🤝 Contactos: <span className="text-indigo-400 block font-mono text-sm">{contactos}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🏛️ Ética: <span className="text-emerald-400 block font-mono text-sm">{etica}</span></div>
              <div className="p-2 rounded-xl bg-white/5">🧠 Templanza: <span className="text-rose-400 block font-mono text-sm">{templanza}</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Carrera</span>
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
  return (
    <div className="min-h-screen bg-[#070A14] text-white py-6 md:py-10 px-3 md:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* HEADER DE ESTADO CON OVR GIGANTE */}
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-4 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/30">
                  [{currentEtapa.edadInicio} a {currentEtapa.edadFin} Años]
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {getCiudadNatalNombre()}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white mt-1">{currentEtapa.puesto}</h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gradient-to-br from-amber-500/20 via-slate-950 to-indigo-500/20 p-3 rounded-2xl border border-amber-500/40 shadow-inner">
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 block">OVR GENERAL</span>
                  <span className="text-3xl md:text-4xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">{currentOVRGeneral}</span>
                </div>
              </div>

              <div className="text-right border-l border-white/10 pl-4 hidden sm:block">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Patrimonio ($)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
              </div>
            </div>
          </div>

          {/* TABLERO DE STATS LIMPIAS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-black">⚖️ Prestigio</span>
              <span className="font-mono font-black text-base text-amber-400">{prestigio}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-black">🤝 Contactos</span>
              <span className="font-mono font-black text-base text-indigo-400">{contactos}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-black">🏛️ Ética</span>
              <span className="font-mono font-black text-base text-emerald-400">{etica}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-black">🧠 Templanza</span>
              <span className={cn("font-mono font-black text-base", templanza < 30 ? "text-red-400 animate-pulse" : "text-rose-400")}>
                {templanza}
              </span>
            </div>
          </div>

          {/* PANEL DE EMPLEADOS */}
          {currentEtapaIdx >= 6 && (
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Gestión de Personal & Gastos Fijos de {staff.estudioNombre}</span>
                </span>
                <span className="text-xs font-mono font-bold text-red-400">
                  Gastos Fijos Bianuales: {formatPesos(gastosFijosActuales)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[11px]">👨‍⚖️ Abogado Experto</p>
                    <p className="text-[9px] text-slate-400">$2.400.000/2 años (+15 Pres)</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setStaff(s => ({ ...s, expertoCount: Math.max(0, s.expertoCount - 1) }))}
                      className="w-6 h-6 rounded-lg bg-white/10 text-white font-bold cursor-pointer hover:bg-white/20"
                    >-</button>
                    <span className="font-mono font-bold text-white text-xs">{staff.expertoCount}</span>
                    <button
                      onClick={() => setStaff(s => ({ ...s, expertoCount: s.expertoCount + 1 }))}
                      className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-500"
                    >+</button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[11px]">💼 Abogado Junior</p>
                    <p className="text-[9px] text-slate-400">$900.000/2 años (Económico)</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setStaff(s => ({ ...s, juniorCount: Math.max(0, s.juniorCount - 1) }))}
                      className="w-6 h-6 rounded-lg bg-white/10 text-white font-bold cursor-pointer hover:bg-white/20"
                    >-</button>
                    <span className="font-mono font-bold text-white text-xs">{staff.juniorCount}</span>
                    <button
                      onClick={() => setStaff(s => ({ ...s, juniorCount: s.juniorCount + 1 }))}
                      className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-500"
                    >+</button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[11px]">📊 Contador Público</p>
                    <p className="text-[9px] text-slate-400">$700.000/2 años (Optimiza $)</p>
                  </div>
                  <button
                    onClick={() => setStaff(s => ({ ...s, hasContador: !s.hasContador }))}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all",
                      staff.hasContador ? "bg-emerald-600 text-white" : "bg-white/10 text-slate-400"
                    )}
                  >
                    {staff.hasContador ? "Contratado ✓" : "Contratar"}
                  </button>
                </div>
              </div>
            </div>
          )}
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

          {/* OPCIONES DE ACCIÓN EXPANDIDAS */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ¿Qué decisión tomás? ({currentEtapa.opciones.length} variantes disponibles)
            </span>

            <div className="space-y-2.5">
              {currentEtapa.opciones.map((opcion) => {
                const isSkillLocked = opcion.requiereSkillId && opcion.requiereSkillId !== selectedSkill?.id;
                if (isSkillLocked) return null;

                const isOriginLocked = opcion.requiereOrigenFueraLaPlata && selectedProvincia === "Buenos Aires" && selectedMunicipioPBA.includes("La Plata");
                if (isOriginLocked) return null;

                const isSkillOption = Boolean(opcion.requiereSkillId && opcion.requiereSkillId === selectedSkill?.id);
                const hasEnoughMoney = !opcion.costoPesosRequerido || dineroPesos >= opcion.costoPesosRequerido;

                return (
                  <motion.button
                    key={opcion.id}
                    disabled={!hasEnoughMoney}
                    whileHover={hasEnoughMoney ? { scale: 1.01 } : {}}
                    whileTap={hasEnoughMoney ? { scale: 0.99 } : {}}
                    onClick={() => handleMakeChoice(opcion)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 min-h-[54px] flex items-center justify-between gap-3 group",
                      !hasEnoughMoney
                        ? "bg-slate-950/50 border-white/5 opacity-50 cursor-not-allowed"
                        : isSkillOption
                        ? "bg-gradient-to-r from-indigo-600/30 via-slate-900 to-violet-600/30 border-indigo-500/60 shadow-lg shadow-indigo-900/20 cursor-pointer"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20 cursor-pointer"
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

                      {!hasEnoughMoney && (
                        <p className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Fondos Insuficientes: Se requieren {formatPesos(opcion.costoPesosRequerido || 0)} (Tenés {formatPesos(dineroPesos)})
                        </p>
                      )}
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
