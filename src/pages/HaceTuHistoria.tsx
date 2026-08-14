import { useState, useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ETAPAS_CARRERA, 
  SKILLS_DISPONIBLES, 
  PROVINCIAS_ARGENTINA,
  MUNICIPIOS_PBA,
  LOGROS_JUEGO,
  CarreraGuardada,
  CareerScoreBreakdown,
  PreguntaJuridicaMinijuego,
  SkillDefinition, 
  EtapaVida, 
  OpcionDilema,
  ImpactoStats,
  RamasPuntuacion,
  EventoInesperado,
  LogroDefinition,
  calculateCareerScore,
  calcularArquetipoFinal,
  ArquetipoFinal
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
  XCircle,
  LogOut,
  Zap,
  Leaf,
  Shield,
  Home,
  Activity,
  Filter,
  Eye,
  X,
  Medal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffConfig {
  expertoCount: number;
  juniorCount: number;
  hasContador: boolean;
  estudioNombre: string;
}

const TODAS_LAS_RAMAS_FILTRO = [
  "Todas las ramas",
  "Litigio Penal & Garantías",
  "Derecho Civil, Comercial & Corporativo",
  "Derecho Público & Administrativo",
  "Ciberderecho & Prueba Digital",
  "Derecho del Trabajo & Seguridad Social",
  "Derecho de Familia & Sucesiones",
  "Derecho Internacional & DDHH",
  "Derecho Ambiental & Recursos Naturales"
];

export default function HaceTuHistoria() {
  const { user, profile, loading } = useAuth();
  
  // Verificación estricta de Beta (Admin o Betatester)
  const isBetaUser = profile?.role === "admin" || profile?.role === "betatester";

  // Pestañas Pre-Juego: "setup" | "ranking" | "logros" | "historial"
  const [activePreGameTab, setActivePreGameTab] = useState<"setup" | "ranking" | "logros" | "historial">("setup");

  // Setup Inicial de Personaje: Selector de Provincia y Ciudad
  const [selectedProvincia, setSelectedProvincia] = useState("Buenos Aires");
  const [selectedMunicipioPBA, setSelectedMunicipioPBA] = useState("La Plata (Capital)");
  const [customCiudadNatal, setCustomCiudadNatal] = useState("");
  const [selectedEdadInicial, setSelectedEdadInicial] = useState<18 | 25>(18);
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  
  // Estado del Juego
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEtapaIdx, setCurrentEtapaIdx] = useState(0);

  // Opciones Aleatorias Seleccionadas para la Etapa Actual
  const [currentRandomOpciones, setCurrentRandomOpciones] = useState<OpcionDilema[]>([]);

  // Estadísticas del jugador
  const [prestigio, setPrestigio] = useState(50);
  const [contactos, setContactos] = useState(50);
  const [etica, setEtica] = useState(50);
  const [templanza, setTemplanza] = useState(75);
  const [dineroPesos, setDineroPesos] = useState(35000);

  // Desafíos jurídicos acertados en la partida actual
  const [desafiosAcertados, setDesafiosAcertados] = useState(0);

  // Modal de Confirmación de Renuncia Voluntaria
  const [showResignModal, setShowResignModal] = useState(false);

  // Estado del Minijuego Jurídico Modal
  const [activeQuiz, setActiveQuiz] = useState<{ desafio: PreguntaJuridicaMinijuego; opcionOriginal: OpcionDilema } | null>(null);
  const [quizSelectedOptionIdx, setQuizSelectedOptionIdx] = useState<number | null>(null);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState(false);

  // Gestión de Empleados y Gastos Fijos (Etapa 7+)
  const [staff, setStaff] = useState<StaffConfig>({
    expertoCount: 0,
    juniorCount: 0,
    hasContador: false,
    estudioNombre: "DND & Asociados"
  });

  // Logros Desbloqueados
  const [unlockedLogros, setUnlockedLogros] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dnd_historia_logros");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Historial de Carreras Propias
  const [carrerasPasadas, setCarrerasPasadas] = useState<CarreraGuardada[]>(() => {
    try {
      const saved = localStorage.getItem("dnd_historia_carreras");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Ranking Global desde Supabase
  const [rankingGlobal, setRankingGlobal] = useState<CarreraGuardada[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [selectedRamaFilter, setSelectedRamaFilter] = useState("Todas las ramas");
  const [inspectedCareer, setInspectedCareer] = useState<CarreraGuardada | null>(null);

  const [newLogroAlert, setNewLogroAlert] = useState<LogroDefinition | null>(null);

  // Evento Inesperado Activo de la Etapa
  const [activeRandomEvent, setActiveRandomEvent] = useState<EventoInesperado | null>(null);
  const [hasDismissedEvent, setHasDismissedEvent] = useState(false);

  // Puntuación acumulativa por 8 ramas del derecho
  const [ramas, setRamas] = useState<RamasPuntuacion>({
    penal: 0,
    civilComercial: 0,
    administrativoPublico: 0,
    cibertech: 0,
    laboral: 0,
    ambiental: 0,
    familia: 0,
    internacional: 0
  });

  // Resumen Bi-Anual
  const [showBiAnnualSummary, setShowBiAnnualSummary] = useState(false);
  const [lastImpact, setLastImpact] = useState<ImpactoStats | null>(null);

  // Historial de la partida
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [lastScoreBreakdown, setLastScoreBreakdown] = useState<CareerScoreBreakdown | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("dnd_historia_logros", JSON.stringify(unlockedLogros));
    } catch {
      // Ignorar
    }
  }, [unlockedLogros]);

  useEffect(() => {
    try {
      localStorage.setItem("dnd_historia_carreras", JSON.stringify(carrerasPasadas));
    } catch {
      // Ignorar
    }
  }, [carrerasPasadas]);

  // Cargar Ranking Global de Supabase
  const fetchRankingGlobal = async () => {
    try {
      setRankingLoading(true);
      const { data, error } = await supabase
        .from("historia_carreras_ranking" as any)
        .select("*")
        .order("puntos_totales", { ascending: false })
        .limit(100);

      if (data && !error) {
        const mapped: CarreraGuardada[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          nombreJugador: row.nombre_jugador,
          avatarUrl: row.avatar_url,
          fechaISO: new Date(row.created_at).toLocaleDateString("es-AR"),
          ciudadNatal: row.ciudad_natal,
          edadFinal: row.edad_final,
          ovrFinal: row.ovr_final,
          patrimonioFinal: Number(row.patrimonio_final),
          prestigioFinal: row.prestigio_final,
          contactosFinal: row.contactos_final,
          eticaFinal: row.etica_final,
          templanzaFinal: row.templanza_final,
          tituloObtenido: row.titulo_obtenido,
          ramaPredominante: row.rama_predominante,
          fueVictoria: row.fue_victoria,
          motivoCierre: row.motivo_cierre || "",
          desafiosAcertados: row.desafios_juridicos_acertados,
          logrosCount: row.logros_obtenidos_count,
          puntosTotales: row.puntos_totales
        }));
        setRankingGlobal(mapped);
      }
    } catch (err) {
      console.error("Error al cargar ranking global:", err);
    } finally {
      setRankingLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingGlobal();
  }, []);

  // Al cambiar de etapa, seleccionar evento inesperado y opciones aleatorias del pool
  useEffect(() => {
    if (gameStarted && ETAPAS_CARRERA[currentEtapaIdx]) {
      const stage = ETAPAS_CARRERA[currentEtapaIdx];

      // 1. Evento inesperado
      if (stage.eventosInesperados && stage.eventosInesperados.length > 0) {
        const randomIndex = Math.floor(Math.random() * stage.eventosInesperados.length);
        const selectedEvent = stage.eventosInesperados[randomIndex];
        setActiveRandomEvent(selectedEvent);
        setHasDismissedEvent(false);

        const imp = selectedEvent.impacto;
        setPrestigio(p => applyStatChange(p, imp.prestigio));
        setContactos(c => applyStatChange(c, imp.contactos));
        setEtica(e => applyStatChange(e, imp.etica));
        setTemplanza(s => applyStatChange(s, imp.templanza));
        setDineroPesos(d => Math.max(0, d + imp.dineroPesos));
      } else {
        setActiveRandomEvent(null);
      }

      // 2. Opciones de la etapa: Garantizar SIEMPRE todas las opciones auténticas del escenario
      setCurrentRandomOpciones([...stage.opciones]);
    }
  }, [currentEtapaIdx, gameStarted]);

  const getCiudadNatalNombre = () => {
    if (selectedProvincia === "Buenos Aires") {
      return selectedMunicipioPBA;
    }
    return customCiudadNatal.trim() ? `${customCiudadNatal.trim()} (${selectedProvincia})` : selectedProvincia;
  };

  // CURVA EXPONENCIAL DE DIFICULTAD (HARD DECAY FORMULA)
  function applyStatChange(currentVal: number, change: number): number {
    if (change <= 0) return Math.min(100, Math.max(0, currentVal + change));

    let nerfedGain = change;
    if (currentVal >= 90) {
      nerfedGain = Math.round(change * 0.15);
    } else if (currentVal >= 80) {
      nerfedGain = Math.round(change * 0.30);
    } else if (currentVal >= 70) {
      nerfedGain = Math.round(change * 0.50);
    }

    nerfedGain = Math.max(1, nerfedGain);
    return Math.min(100, currentVal + nerfedGain);
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
      tech: Math.min(100, Math.round((prestigio * 0.35) + (templanza * 0.25) + (ramas.cibertech * 0.40))),
      laboral: Math.min(100, Math.round((contactos * 0.35) + (etica * 0.25) + (ramas.laboral * 0.40))),
      ambiental: Math.min(100, Math.round((prestigio * 0.35) + (etica * 0.25) + (ramas.ambiental * 0.40))),
      familia: Math.min(100, Math.round((etica * 0.40) + (templanza * 0.20) + (ramas.familia * 0.40))),
      internacional: Math.min(100, Math.round((prestigio * 0.40) + (contactos * 0.20) + (ramas.internacional * 0.40)))
    };
  };

  const getDominantBranch = () => {
    const ovrs = calculateOVRRamas();
    const scores = [
      { name: "Litigio Penal & Garantías", ovr: ovrs.penal },
      { name: "Derecho Civil, Comercial & Corporativo", ovr: ovrs.civil },
      { name: "Derecho Público & Administrativo", ovr: ovrs.publico },
      { name: "Ciberderecho & Prueba Digital", ovr: ovrs.tech },
      { name: "Derecho del Trabajo & Seguridad Social", ovr: ovrs.laboral },
      { name: "Derecho de Familia & Sucesiones", ovr: ovrs.familia },
      { name: "Derecho Internacional & DDHH", ovr: ovrs.internacional },
      { name: "Derecho Ambiental & Recursos Naturales", ovr: ovrs.ambiental }
    ];
    scores.sort((a, b) => b.ovr - a.ovr);
    return scores[0];
  };

  const getCustomCareerTitle = () => {
    if (dineroPesos >= 20000000) {
      return {
        titulo: "💰 Magnate Corporativo & Firma Millonaria",
        mencion: "Destacado por construir un patrimonio económico extraordinario en la abogacía."
      };
    }
    if (prestigio >= contactos && prestigio >= etica && prestigio >= templanza) {
      return {
        titulo: "⚖️ Catedrático Ilustre & Maestro del Derecho",
        mencion: "Reconocido en toda la provincia por tu impecable doctrina y prestigio técnico."
      };
    }
    if (contactos >= prestigio && contactos >= etica && contactos >= templanza) {
      return {
        titulo: "🤝 Referente del Foro & Operador Institucional",
        mencion: "Destacado por tejer redes profesionales y académicas decisivas en la UNLP y la función pública."
      };
    }
    if (etica >= prestigio && etica >= contactos && etica >= templanza) {
      return {
        titulo: "🏛️ Baluarte Moral & Defensor Incorruptible",
        mencion: "Ejemplo intachable de ética procesal ante el Colegio de Abogados de La Plata."
      };
    }
    return {
      titulo: "🧠 Litigante de Acero & Mente Imperturbable",
      mencion: "Sobreviviente a la presión procesal extrema con una templanza admirable."
    };
  };

  const calculateGastosFijosBianuales = () => {
    if (currentEtapaIdx < 6) return 0;
    const costoMatriculaCALP = 250000;
    const costoExpertos = staff.expertoCount * 2400000;
    const costoJuniors = staff.juniorCount * 900000;
    const costoContador = staff.hasContador ? 700000 : 0;
    return costoMatriculaCALP + costoExpertos + costoJuniors + costoContador;
  };

  const checkLogrosUnlock = (newPrestigio: number, newContactos: number, newEtica: number, newTemplanza: number, newDinero: number, currentStageIdx: number) => {
    LOGROS_JUEGO.forEach((logro) => {
      if (unlockedLogros.includes(logro.id)) return;

      let isUnlocked = false;
      if (logro.id === "logro_honores" && currentStageIdx === 5 && newPrestigio >= 75) isUnlocked = true;
      if (logro.id === "logro_magnate" && newDinero >= 25000000) isUnlocked = true;
      if (logro.id === "logro_incorruptible" && currentStageIdx >= 10 && newEtica >= 85) isUnlocked = true;
      if (logro.id === "logro_estrellas" && currentStageIdx >= 7) isUnlocked = true;
      if (logro.id === "logro_dnd_socio" && currentStageIdx >= 8) isUnlocked = true;
      if (logro.id === "logro_patria_chica" && selectedProvincia !== "Buenos Aires" && currentStageIdx >= 6) isUnlocked = true;
      if (logro.id === "logro_mente_acero" && newTemplanza >= 85) isUnlocked = true;
      if (logro.id === "logro_operador" && newContactos >= 85) isUnlocked = true;
      if (logro.id === "logro_burnout_survivor" && newTemplanza > 0 && newTemplanza < 20) isUnlocked = true;

      if (isUnlocked) {
        setUnlockedLogros(prev => [...prev, logro.id]);
        setNewLogroAlert(logro);
      }
    });
  };

  const saveCareerToHistory = async (fueVictoria: boolean, motivo: string) => {
    const finalOvr = calculateOVRGeneral();
    const titleObj = getCustomCareerTitle();
    const dominant = getDominantBranch();
    const finalAge = ETAPAS_CARRERA[currentEtapaIdx]?.edadFin || 65;
    const playerName = profile?.full_name || profile?.email?.split("@")[0] || "Estudiante de Jursoc";
    const playerAvatar = profile?.avatar_url || null;

    const breakdown = calculateCareerScore(
      finalOvr,
      etica,
      desafiosAcertados,
      dineroPesos,
      unlockedLogros.length,
      fueVictoria
    );

    setLastScoreBreakdown(breakdown);

    const nuevaCarrera: CarreraGuardada = {
      id: Date.now().toString(),
      userId: user?.id,
      nombreJugador: playerName,
      avatarUrl: playerAvatar || undefined,
      fechaISO: new Date().toLocaleDateString("es-AR"),
      ciudadNatal: getCiudadNatalNombre(),
      edadFinal: finalAge,
      ovrFinal: finalOvr,
      patrimonioFinal: dineroPesos,
      prestigioFinal: prestigio,
      contactosFinal: contactos,
      eticaFinal: etica,
      templanzaFinal: templanza,
      tituloObtenido: titleObj.titulo,
      ramaPredominante: dominant.name,
      fueVictoria,
      motivoCierre: motivo,
      desafiosAcertados,
      logrosCount: unlockedLogros.length,
      puntosTotales: breakdown.puntosTotales,
      scoreBreakdown: breakdown
    };

    setCarrerasPasadas(prev => [nuevaCarrera, ...prev]);

    // Guardar en Supabase para el Hall de la Fama Global
    try {
      await supabase.from("historia_carreras_ranking" as any).insert({
        user_id: user?.id || null,
        nombre_jugador: playerName,
        avatar_url: playerAvatar,
        puntos_totales: breakdown.puntosTotales,
        ovr_final: finalOvr,
        patrimonio_final: dineroPesos,
        prestigio_final: prestigio,
        contactos_final: contactos,
        etica_final: etica,
        templanza_final: templanza,
        edad_final: finalAge,
        ciudad_natal: getCiudadNatalNombre(),
        titulo_obtenido: titleObj.titulo,
        rama_predominante: dominant.name,
        fue_victoria: fueVictoria,
        motivo_cierre: motivo,
        desafios_juridicos_acertados: desafiosAcertados,
        logros_obtenidos_count: unlockedLogros.length
      });
      fetchRankingGlobal();
    } catch (err) {
      console.error("Error al persistir carrera en Supabase:", err);
    }
  };

  const startNewGame = () => {
    if (!selectedSkill) return;

    setPrestigio(50);
    setContactos(50);
    setEtica(50);
    setTemplanza(selectedEdadInicial === 25 ? 65 : 80);
    const initialRamas: RamasPuntuacion = {
      penal: selectedSkill.id === "litigio_penal" ? 20 : 0,
      civilComercial: selectedSkill.id === "civil_comercial" ? 20 : 0,
      administrativoPublico: selectedSkill.id === "publico_administrativo" ? 20 : 0,
      cibertech: selectedSkill.id === "ciberderecho_tech" ? 20 : 0,
      laboral: selectedSkill.id === "laboral_seg_social" ? 20 : 0,
      familia: selectedSkill.id === "familia_sucesiones" ? 20 : 0,
      internacional: selectedSkill.id === "internacional_ddhh" ? 20 : 0,
      ambiental: selectedSkill.id === "ambiental_recursos" ? 20 : 0
    };
    setRamas(initialRamas);
    setStaff({ expertoCount: 0, juniorCount: 0, hasContador: false, estudioNombre: "DND & Asociados" });
    setDesafiosAcertados(0);
    setLastScoreBreakdown(null);
    
    setCurrentEtapaIdx(selectedEdadInicial === 25 ? 1 : 0);
    setActiveQuiz(null);
    setQuizSelectedOptionIdx(null);
    setQuizAnswerSubmitted(false);
    setShowResignModal(false);
    setNewLogroAlert(null);
    setLastFeedback(null);
    setLastImpact(null);
    setShowBiAnnualSummary(false);
    setGameOverReason(null);
    setIsVictory(false);
    setGameStarted(true);
  };

  const confirmResignation = () => {
    setShowResignModal(false);
    const motivo = `🚪 Retiro Voluntario / Renuncia a los ${ETAPAS_CARRERA[currentEtapaIdx]?.edadInicio || 18} Años`;
    saveCareerToHistory(false, motivo);
    resetGame();
  };

  const handleMakeChoice = (opcion: OpcionDilema) => {
    if (opcion.costoPesosRequerido && dineroPesos < opcion.costoPesosRequerido) {
      return;
    }

    if (opcion.desafioJuridico) {
      setActiveQuiz({ desafio: opcion.desafioJuridico, opcionOriginal: opcion });
      setQuizSelectedOptionIdx(null);
      setQuizAnswerSubmitted(false);
      return;
    }

    applyChoiceImpact(opcion, true);
  };

  const applyChoiceImpact = (opcion: OpcionDilema, isCorrectQuiz: boolean) => {
    let impact = { ...opcion.impacto };

    if (!isCorrectQuiz) {
      impact.prestigio = -15;
      impact.templanza = -12;
    } else if (opcion.desafioJuridico) {
      impact.prestigio += 5;
      setDesafiosAcertados(prev => prev + 1);
    }

    setLastImpact(impact);

    let newPrestigio = applyStatChange(prestigio, impact.prestigio);
    let newContactos = applyStatChange(contactos, impact.contactos);
    let newEtica = applyStatChange(etica, impact.etica);
    let newTemplanza = applyStatChange(templanza, impact.templanza);

    const gastosFijos = calculateGastosFijosBianuales();
    let netDineroChange = impact.dineroPesos - gastosFijos;

    if (staff.expertoCount > 0) newPrestigio = Math.min(100, newPrestigio + (staff.expertoCount * 3));
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
        cibertech: prev.cibertech + (impact.impactoRamas?.cibertech || 0),
        laboral: prev.laboral + (impact.impactoRamas?.laboral || 0),
        ambiental: prev.ambiental + (impact.impactoRamas?.ambiental || 0),
        familia: prev.familia + (impact.impactoRamas?.familia || 0),
        internacional: prev.internacional + (impact.impactoRamas?.internacional || 0)
      }));
    }

    const finalFeedback = isCorrectQuiz
      ? (opcion.desafioJuridico ? `✨ ¡Demostraste solvencia en el examen jurídico! ${opcion.feedbackNarrativo}` : opcion.feedbackNarrativo)
      : `❌ Cometiste un error técnico en el fundamento jurídico. Sufriste impugnación procesal y pérdida de prestigio.`;

    setLastFeedback(finalFeedback);
    checkLogrosUnlock(newPrestigio, newContactos, newEtica, newTemplanza, newDinero, currentEtapaIdx);

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

  const submitQuizAnswer = (selectedIdx: number) => {
    setQuizSelectedOptionIdx(selectedIdx);
    setQuizAnswerSubmitted(true);
  };

  const confirmQuizResult = () => {
    if (!activeQuiz || quizSelectedOptionIdx === null) return;
    const isCorrect = quizSelectedOptionIdx === activeQuiz.desafio.opcionCorrectaIdx;
    const opcionOriginal = activeQuiz.opcionOriginal;
    setActiveQuiz(null);
    applyChoiceImpact(opcionOriginal, isCorrect);
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
    setShowResignModal(false);
    setGameOverReason(null);
    setIsVictory(false);
    setLastScoreBreakdown(null);
  };

  // Filtrado del Ranking Global
  const filteredRanking = useMemo(() => {
    if (selectedRamaFilter === "Todas las ramas") {
      return rankingGlobal;
    }
    return rankingGlobal.filter(c => c.ramaPredominante.toLowerCase().includes(selectedRamaFilter.toLowerCase().split(" ")[0]));
  }, [rankingGlobal, selectedRamaFilter]);

  if (!loading && (!user || !isBetaUser)) {
    return <Navigate to="/mi-espacio" replace />;
  }

  const currentEtapa: EtapaVida = ETAPAS_CARRERA[currentEtapaIdx];
  const dominantBranch = getDominantBranch();
  const currentOVRGeneral = calculateOVRGeneral();
  const gastosFijosActuales = calculateGastosFijosBianuales();
  const customTitleObj = getCustomCareerTitle();

  // 1. PANTALLA PRE-JUEGO
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-8 md:py-12 px-4 relative overflow-hidden transition-colors">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Plataforma DND & Asociados — UNLP</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-slate-200 dark:to-indigo-400 dark:bg-clip-text">
              HACÉ TU HISTORIA
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Simulador RPG de vida profesional para estudiantes de Derecho de la UNLP. Competí en el Hall de la Fama, resolvé casos prácticos y forjá tu legado en Tribunales.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActivePreGameTab("setup")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "setup"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Nueva Carrera</span>
              </button>

              <button
                onClick={() => { setActivePreGameTab("ranking"); fetchRankingGlobal(); }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "ranking"
                    ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/30"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>🏆 Hall de la Fama</span>
              </button>

              <button
                onClick={() => setActivePreGameTab("logros")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "logros"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Logros ({unlockedLogros.length}/{LOGROS_JUEGO.length})</span>
              </button>

              <button
                onClick={() => setActivePreGameTab("historial")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                  activePreGameTab === "historial"
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                )}
              >
                <History className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>Mis Carreras ({carrerasPasadas.length})</span>
              </button>
            </div>
          </div>

          {/* PESTAÑA 1: SETUP DE NUEVA CARRERA */}
          {activePreGameTab === "setup" && (
            <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 rounded-3xl p-6 space-y-6 shadow-xl dark:shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>1. Origen Geográfico (Provincia y Ciudad Natal)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Provincia:</span>
                    <div className="relative">
                      <select
                        value={selectedProvincia}
                        onChange={(e) => setSelectedProvincia(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white font-bold text-xs appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer pr-10"
                      >
                        {PROVINCIAS_ARGENTINA.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      {selectedProvincia === "Buenos Aires" ? "Municipio / Ciudad de PBA:" : "Escribí tu Ciudad Natal:"}
                    </span>

                    {selectedProvincia === "Buenos Aires" ? (
                      <div className="relative">
                        <select
                          value={selectedMunicipioPBA}
                          onChange={(e) => setSelectedMunicipioPBA(e.target.value)}
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white font-bold text-xs appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer pr-10"
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
                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2. Edad al Comenzar</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedEdadInicial(18)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1",
                      selectedEdadInicial === 18
                        ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 text-slate-900 dark:text-white shadow-lg"
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900 dark:text-white">🎓 18 Años (Ingresante UNLP)</span>
                      {selectedEdadInicial === 18 && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Inicio desde 1er año. Ahorros iniciales de $35.000 y Templanza 80.</p>
                  </button>

                  <button
                    onClick={() => setSelectedEdadInicial(25)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1",
                      selectedEdadInicial === 25
                        ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 text-slate-900 dark:text-white shadow-lg"
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900 dark:text-white">💼 +25 Años (Estudiante Adulto)</span>
                      {selectedEdadInicial === 25 && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Arrancás trabajando de empleado ($450.000/mes), pero con más nivel de estrés (Templanza 65).</p>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Especialidad Técnica Inicial (8 Ramas del Derecho)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SKILLS_DISPONIBLES.map((skill) => (
                    <div
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between group shadow-sm dark:shadow-lg",
                        selectedSkill?.id === skill.id
                          ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 text-slate-900 dark:text-white ring-1 ring-indigo-500"
                          : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-slate-900 dark:text-white">{skill.nombre}</span>
                          {selectedSkill?.id === skill.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{skill.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!selectedSkill}
                  onClick={startNewGame}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all min-h-[50px]",
                    selectedSkill
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30 cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-white/5"
                  )}
                >
                  <span>Iniciar Simulación de Carrera</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* PESTAÑA 2: HALL DE LA FAMA / RANKING GLOBAL */}
          {activePreGameTab === "ranking" && (
            <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 rounded-3xl p-6 space-y-6 shadow-xl dark:shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    <span>Hall de la Fama — Mejores Carreras de Jursoc</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tabla de posiciones general clasificada por Puntos Totales de Carrera.</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  <select
                    value={selectedRamaFilter}
                    onChange={(e) => setSelectedRamaFilter(e.target.value)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {TODAS_LAS_RAMAS_FILTRO.map((rama) => (
                      <option key={rama} value={rama}>{rama}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PODIO TOP 3 */}
              {filteredRanking.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {/* Puesto 2 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800/80 dark:to-slate-950 border border-slate-300 dark:border-slate-400/40 text-center space-y-2 order-2 md:order-1 shadow-sm">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-200 dark:bg-slate-400/20 border border-slate-400/50 flex items-center justify-center text-slate-700 dark:text-slate-300 font-black text-sm">
                      🥈 2º
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900 dark:text-white truncate">{filteredRanking[1].nombreJugador}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{filteredRanking[1].tituloObtenido}</p>
                    </div>
                    <div className="pt-1">
                      <span className="text-lg font-black text-slate-800 dark:text-slate-300 font-mono">{(filteredRanking[1].puntosTotales || 0).toLocaleString("es-AR")} pts</span>
                      <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase">{filteredRanking[1].ramaPredominante}</p>
                    </div>
                  </div>

                  {/* Puesto 1 */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-100 via-amber-50 to-white dark:from-amber-500/20 dark:via-slate-900 dark:to-slate-950 border border-amber-400 dark:border-amber-500/50 text-center space-y-2 order-1 md:order-2 shadow-md dark:shadow-xl dark:shadow-amber-500/10">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/30 border border-amber-500/60 flex items-center justify-center text-amber-600 dark:text-amber-300 font-black text-base shadow-lg">
                      🥇 1º
                    </div>
                    <div>
                      <p className="font-black text-base text-amber-600 dark:text-amber-300 truncate">{filteredRanking[0].nombreJugador}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">{filteredRanking[0].tituloObtenido}</p>
                    </div>
                    <div className="pt-1">
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{(filteredRanking[0].puntosTotales || 0).toLocaleString("es-AR")} pts</span>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{filteredRanking[0].ramaPredominante}</p>
                    </div>
                  </div>

                  {/* Puesto 3 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-slate-950 border border-amber-300 dark:border-amber-700/40 text-center space-y-2 order-3 shadow-sm">
                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-700/20 border border-amber-700/50 flex items-center justify-center text-amber-700 dark:text-amber-600 font-black text-sm">
                      🥉 3º
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900 dark:text-white truncate">{filteredRanking[2].nombreJugador}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{filteredRanking[2].tituloObtenido}</p>
                    </div>
                    <div className="pt-1">
                      <span className="text-lg font-black text-amber-700 dark:text-amber-600 font-mono">{(filteredRanking[2].puntosTotales || 0).toLocaleString("es-AR")} pts</span>
                      <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase">{filteredRanking[2].ramaPredominante}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* LISTA COMPLETA DE POSICIONES */}
              {rankingLoading ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">Cargando Hall de la Fama...</div>
              ) : filteredRanking.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
                  <Trophy className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay carreras registradas con este filtro.</p>
                  <p className="text-xs text-slate-500">Completá una partida para aparecer en el podio de Jursoc.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredRanking.map((carrera, index) => (
                    <div
                      key={carrera.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-amber-500/40 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={cn(
                          "w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0",
                          index === 0 && "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40",
                          index === 1 && "bg-slate-200 dark:bg-slate-400/20 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-400/40",
                          index === 2 && "bg-amber-100 dark:bg-amber-700/20 text-amber-800 dark:text-amber-600 border border-amber-300 dark:border-amber-700/40",
                          index > 2 && "bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                        )}>
                          #{index + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xs md:text-sm text-slate-900 dark:text-white truncate">{carrera.nombreJugador}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-[9px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                              {carrera.ciudadNatal}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{carrera.tituloObtenido}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-black text-sm md:text-base text-amber-600 dark:text-amber-400 font-mono block">
                            {(carrera.puntosTotales || 0).toLocaleString("es-AR")} pts
                          </span>
                          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase block">{carrera.ramaPredominante}</span>
                        </div>

                        <button
                          onClick={() => setInspectedCareer(carrera)}
                          className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border border-slate-300 dark:border-white/10 transition-all cursor-pointer"
                          title="Inspeccionar Ficha de Carrera"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PESTAÑA 3: LOGROS */}
          {activePreGameTab === "logros" && (
            <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 rounded-3xl p-6 space-y-6 shadow-xl dark:shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <span>Galería de Logros Desbloqueables ({LOGROS_JUEGO.length} Logros Totales)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Los logros conseguidos se acumulan entre todas tus carreras jugadas.</p>
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
                          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40 text-slate-900 dark:text-amber-200"
                          : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 opacity-60 text-slate-500 dark:text-slate-400"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border font-bold",
                        isUnlocked ? "bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-300" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-400 dark:text-slate-500"
                      )}>
                        {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">{logro.nombre}</h4>
                          {isUnlocked && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">Desbloqueado</span>}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{logro.descripcion}</p>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">Requisito: {logro.requisitoTexto}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PESTAÑA 4: MIS CARRERAS PASADAS */}
          {activePreGameTab === "historial" && (
            <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 rounded-3xl p-6 space-y-6 shadow-xl dark:shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <span>Mis Carreras Anteriores</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Registro histórico de todas las partidas jugadas en este dispositivo.</p>
              </div>

              {carrerasPasadas.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
                  <History className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Aún no completaste ninguna carrera.</p>
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
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200"
                          : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-500/40 text-red-900 dark:text-red-200"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border",
                            carrera.fueVictoria ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300" : "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300"
                          )}>
                            {carrera.fueVictoria ? "Jubilación a los 65 Años" : `Final a los ${carrera.edadFinal} Años`}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{carrera.fechaISO}</span>
                        </div>
                        <h4 className="font-black text-base text-slate-900 dark:text-white">{carrera.ciudadNatal}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">{carrera.motivoCierre}</p>
                      </div>

                      <div className="flex items-center gap-4 text-right self-end sm:self-center">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Puntaje</span>
                          <span className="text-lg font-black text-amber-400 font-mono">{(carrera.puntosTotales || 0).toLocaleString("es-AR")}</span>
                        </div>
                        <div className="border-l border-white/10 pl-4">
                          <span className="text-[9px] uppercase font-black text-slate-400 block">Patrimonio ($)</span>
                          <span className="text-base font-black text-emerald-400 font-mono">{formatPesos(carrera.patrimonioFinal)}</span>
                        </div>
                        <button
                          onClick={() => setInspectedCareer(carrera)}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MODAL DE INSPECCIÓN DE FICHA DE CARRERA */}
          {inspectedCareer && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
                <button
                  onClick={() => setInspectedCareer(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 dark:text-amber-400">
                    <Medal className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{inspectedCareer.nombreJugador || "Estudiante de Jursoc"}</h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">{inspectedCareer.tituloObtenido}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Ciudad: {inspectedCareer.ciudadNatal} | Rama: {inspectedCareer.ramaPredominante}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Puntaje Total</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">{(inspectedCareer.puntosTotales || 0).toLocaleString("es-AR")}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">OVR Final</span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{inspectedCareer.ovrFinal}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Patrimonio Neto</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatPesos(inspectedCareer.patrimonioFinal)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Casos Acertados</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{inspectedCareer.desafiosAcertados || 0}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 block">Desenlace:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{inspectedCareer.motivoCierre}</p>
                </div>

                <button
                  onClick={() => setInspectedCareer(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 2. MODAL DE MINIJUEGO DESAFÍO JURÍDICO
  if (activeQuiz) {
    const { desafio, opcionOriginal } = activeQuiz;
    const isCorrectAnswer = quizSelectedOptionIdx === desafio.opcionCorrectaIdx;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-12 px-4 flex items-center justify-center relative overflow-hidden transition-colors">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-amber-500/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Scale className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
              ⚖️ CASO PRÁCTICO / DESAFÍO JURÍDICO — NIVEL {desafio.dificultad}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white pt-1">Demostrá Solvencia Normativa</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Respondé basándote en los artículos del Código aplicable para asegurar el beneficio.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">Caso Práctico:</span>
            <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug">{desafio.pregunta}</p>
          </div>

          <div className="space-y-2.5">
            {desafio.opciones.map((opcText, idx) => {
              const isSelected = quizSelectedOptionIdx === idx;
              const isRightOption = idx === desafio.opcionCorrectaIdx;

              let btnStyle = "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-900 dark:text-white";

              if (quizAnswerSubmitted) {
                if (isRightOption) btnStyle = "bg-emerald-100 dark:bg-emerald-600/30 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-lg font-bold";
                else if (isSelected && !isRightOption) btnStyle = "bg-red-100 dark:bg-red-600/30 border-red-500 text-red-900 dark:text-red-200 font-bold";
                else btnStyle = "bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-400 opacity-50";
              } else if (isSelected) {
                btnStyle = "bg-amber-100 dark:bg-amber-500/30 border-amber-500 text-slate-900 dark:text-white font-bold";
              }

              return (
                <button
                  key={idx}
                  disabled={quizAnswerSubmitted}
                  onClick={() => submitQuizAnswer(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all text-xs md:text-sm flex items-center justify-between gap-3 cursor-pointer",
                    btnStyle
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 text-slate-700 dark:text-white">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opcText}</span>
                  </div>

                  {quizAnswerSubmitted && isRightOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                  {quizAnswerSubmitted && isSelected && !isRightOption && <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {quizAnswerSubmitted && (
            <div className={cn(
              "p-4 rounded-2xl border text-xs space-y-1.5",
              isCorrectAnswer ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200" : "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-500/40 text-red-900 dark:text-red-200"
            )}>
              <div className="flex items-center gap-2 font-black uppercase text-[11px]">
                {isCorrectAnswer ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                <span>{isCorrectAnswer ? "¡FUNDAMENTACIÓN CORRECTA (+5 PRESTIGIO / +500 PTS RANKING)!" : "FUNDAMENTACIÓN INCORRECTA (-15 PRESTIGIO / -12 TEMPLANZA)"}</span>
              </div>
              <p className="leading-relaxed text-slate-700 dark:text-slate-200">{desafio.explicacion}</p>
            </div>
          )}

          {quizAnswerSubmitted && (
            <button
              onClick={confirmQuizResult}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar Historia</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // MODAL DE CONFIRMACIÓN DE RENUNCIA VOLUNTARIA
  if (showResignModal) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-12 px-4 flex items-center justify-center relative overflow-hidden transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-500/40 rounded-3xl p-6 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 dark:text-red-400">
            <LogOut className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">¿Renunciar a la Carrera?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Esta acción guardará tu partida actual en el Hall of Fame como "Retiro Voluntario" a los {currentEtapa.edadInicio} años.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowResignModal(false)}
              className="w-1/2 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={confirmResignation}
              className="w-1/2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Sí, Renunciar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. MODAL RESUMEN BI-ANUAL
  if (showBiAnnualSummary && lastImpact) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-12 px-4 flex items-center justify-center relative overflow-hidden transition-colors">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
              RESUMEN DE RESULTADOS DE ETAPA [{currentEtapa.edadInicio} - {currentEtapa.edadFin} AÑOS]
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white pt-1">Impacto Directo de Tu Elección</h2>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-200 text-xs md:text-sm space-y-1">
            <p className="font-bold text-indigo-600 dark:text-indigo-300 text-[11px] uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Consecuencia Procesal / Personal:
            </p>
            <p className="italic leading-relaxed text-slate-700 dark:text-slate-300">{lastFeedback}</p>
          </div>

          {currentEtapaIdx >= 6 && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-amber-500/30 text-xs font-bold space-y-1">
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Deducción de Gastos Fijos (Matrícula + Staff):</span>
                <span className="text-red-500 dark:text-red-400 font-mono">-{formatPesos(gastosFijosActuales)}</span>
              </div>
            </div>
          )}

          <AnimatePresence>
            {newLogroAlert && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-3"
              >
                <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400 shrink-0 animate-bounce" />
                <div>
                  <p className="font-black text-amber-700 dark:text-amber-300 uppercase text-[10px]">¡LOGRO DESBLOQUEADO!</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{newLogroAlert.nombre}</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-200/80">{newLogroAlert.descripcion}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">⚖️ Prestigio:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.prestigio >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {lastImpact.prestigio >= 0 ? `+${lastImpact.prestigio}` : lastImpact.prestigio}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">🤝 Contactos:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.contactos >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {lastImpact.contactos >= 0 ? `+${lastImpact.contactos}` : lastImpact.contactos}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">🏛️ Ética:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.etica >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {lastImpact.etica >= 0 ? `+${lastImpact.etica}` : lastImpact.etica}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">🧠 Templanza:</span>
              <span className={cn("font-mono font-black text-sm", lastImpact.templanza >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
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

  // 4. PANTALLA GAME OVER (CON DESGLOSE DE PUNTOS)
  if (gameOverReason) {
    const breakdown = lastScoreBreakdown || calculateCareerScore(currentOVRGeneral, etica, desafiosAcertados, dineroPesos, unlockedLogros.length, false);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-12 px-4 flex items-center justify-center relative overflow-hidden transition-colors">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-500 dark:text-red-400">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-600 dark:text-red-400 uppercase tracking-tight">GAME OVER — MUERTE SÚBITA</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Carrera interrumpida a los {currentEtapa.edadInicio} años</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-slate-800 dark:text-slate-200 text-xs md:text-sm leading-relaxed text-left space-y-2">
            <p className="font-bold">{gameOverReason}</p>
          </div>

          {/* DESGLOSE DE PUNTUACIÓN */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Puntaje Final de Carrera</span>
              <span className="text-xl font-black text-red-600 dark:text-red-400 font-mono">{breakdown.puntosTotales.toLocaleString("es-AR")} pts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div>• Base OVR ({currentOVRGeneral}): <span className="font-mono text-slate-900 dark:text-white">+{breakdown.baseOvrScore}</span></div>
              <div>• Casos Acertados ({desafiosAcertados}): <span className="font-mono text-slate-900 dark:text-white">+{breakdown.desafiosScore}</span></div>
              <div>• Bono Ética ({etica}): <span className={cn("font-mono", breakdown.eticaBonus >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>{breakdown.eticaBonus >= 0 ? `+${breakdown.eticaBonus}` : breakdown.eticaBonus}</span></div>
              <div>• Patrimonio Neto: <span className="font-mono text-slate-900 dark:text-white">+{breakdown.patrimonioScore}</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Configurar Nueva Carrera</span>
            </button>
            <button
              onClick={() => { resetGame(); setActivePreGameTab("ranking"); }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all text-center cursor-pointer"
            >
              Ver Hall de la Fama
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. PANTALLA VICTORIA / JUBILACIÓN A LOS 65 AÑOS (CON DESGLOSE DETALLADO DE SCORE)
  if (isVictory) {
    const breakdown = lastScoreBreakdown || calculateCareerScore(currentOVRGeneral, etica, desafiosAcertados, dineroPesos, unlockedLogros.length, true);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-12 px-4 flex items-center justify-center relative overflow-hidden transition-colors">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              ¡JUBILACIÓN COMPLETADA A LOS 65 AÑOS!
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-400 pt-2">{customTitleObj.titulo}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic max-w-md mx-auto">{customTitleObj.mencion}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">Origen: {getCiudadNatalNombre()} — FCJyS UNLP | Rama: {dominantBranch.name}</p>
          </div>

          {/* ARQUETIPO DE GRADUADO (PÁGINA 14 DEL MANUAL) */}
          {(() => {
            const arquetipo = calcularArquetipoFinal(templanza, contactos, etica, prestigio);
            return (
              <div className="p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-500/10 border-2 border-amber-500/30 text-left space-y-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    Arquetipo de Egresado UNLP
                  </span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {arquetipo.titulo}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {arquetipo.descripcion}
                </p>
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-950/70 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 italic">
                  💬 <strong>El Copero dice:</strong> "{arquetipo.fraseCopero}"
                </div>
              </div>
            );
          })()}

          {/* TARJETA GIGANTE DE PUNTAJE TOTAL DE CARRERA */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-100 via-amber-50 to-indigo-50 dark:from-amber-500/20 dark:via-slate-950 dark:to-indigo-500/20 border border-amber-300 dark:border-amber-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <span className="text-xs font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest">PUNTAJE FINAL RANKING</span>
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">{breakdown.puntosTotales.toLocaleString("es-AR")} PTS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left text-xs">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black block">Base OVR ({currentOVRGeneral})</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+{breakdown.baseOvrScore}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black block">Bono Ética ({etica})</span>
                <span className={cn("font-mono font-bold", breakdown.eticaBonus >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                  {breakdown.eticaBonus >= 0 ? `+${breakdown.eticaBonus}` : breakdown.eticaBonus}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black block">Casos Acertados ({desafiosAcertados})</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">+{breakdown.desafiosScore}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black block">Patrimonio Neto</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+{breakdown.patrimonioScore}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black block">Logros ({unlockedLogros.length})</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">+{breakdown.logrosScore}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black block">Bono Cúspide</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">+{breakdown.victoriaBonus}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Patrimonio Neto Final ($)</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatPesos(dineroPesos)}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs font-bold text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent">⚖️ Pres.: <span className="text-amber-600 dark:text-amber-400 block font-mono text-sm">{prestigio}</span></div>
              <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent">🤝 Contactos: <span className="text-indigo-600 dark:text-indigo-400 block font-mono text-sm">{contactos}</span></div>
              <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent">🏛️ Ética: <span className="text-emerald-600 dark:text-emerald-400 block font-mono text-sm">{etica}</span></div>
              <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent">🧠 Templanza: <span className="text-rose-600 dark:text-rose-400 block font-mono text-sm">{templanza}</span></div>
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
            <button
              onClick={() => { resetGame(); setActivePreGameTab("ranking"); }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all text-center cursor-pointer"
            >
              Ver en el Hall de la Fama
            </button>
            <Link
              to="/mi-espacio"
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-bold text-xs transition-all text-center"
            >
              Volver a Mi Espacio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 6. PANTALLA PRINCIPAL DE JUEGO (CON OPCIONES ALEATORIAS DEL POOL)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A14] text-slate-900 dark:text-white py-6 md:py-10 px-3 md:px-8 relative overflow-hidden transition-colors">
      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* HEADER DE ESTADO CON OVR GIGANTE Y BOTÓN DE RENUNCIA */}
        <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 rounded-3xl p-4 md:p-6 space-y-4 shadow-xl dark:shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/30">
                  [{currentEtapa.edadInicio} a {currentEtapa.edadFin} Años]
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                  {getCiudadNatalNombre()}
                </span>
                {desafiosAcertados > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    {desafiosAcertados} Casos Acertados
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">{currentEtapa.puesto}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-br from-amber-100 via-white to-indigo-100 dark:from-amber-500/20 dark:via-slate-950 dark:to-indigo-500/20 p-3 rounded-2xl border border-amber-300 dark:border-amber-500/40 shadow-inner">
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300 block">OVR GENERAL</span>
                  <span className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight drop-shadow-md">{currentOVRGeneral}</span>
                </div>
              </div>

              <button
                onClick={() => setShowResignModal(true)}
                title="Renunciar a la carrera voluntariamente"
                className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 dark:text-red-400 transition-all cursor-pointer flex flex-col items-center justify-center shrink-0"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase">Renunciar</span>
              </button>
            </div>
          </div>

          {/* TABLERO DE STATS LIMPIAS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-black">⚖️ Prestigio</span>
              <span className="font-mono font-black text-base text-amber-600 dark:text-amber-400">{prestigio}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-black">🤝 Contactos</span>
              <span className="font-mono font-black text-base text-indigo-600 dark:text-indigo-400">{contactos}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-black">🏛️ Ética</span>
              <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">{etica}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-black">🧠 Templanza</span>
              <span className={cn("font-mono font-black text-base", templanza < 30 ? "text-red-500 dark:text-red-400 animate-pulse" : "text-rose-600 dark:text-rose-400")}>
                {templanza}
              </span>
            </div>
          </div>

          {/* PANEL DE EMPLEADOS */}
          {currentEtapaIdx >= 6 && (
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Gestión de Personal & Gastos Fijos de {staff.estudioNombre}</span>
                </span>
                <span className="text-xs font-mono font-bold text-red-500 dark:text-red-400">
                  Gastos Fijos Bianuales: {formatPesos(gastosFijosActuales)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">👨‍⚖️ Abogado Experto</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">$2.400.000/2 años (+3 Pres)</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setStaff(s => ({ ...s, expertoCount: Math.max(0, s.expertoCount - 1) }))}
                      className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-white/20"
                    >-</button>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{staff.expertoCount}</span>
                    <button
                      onClick={() => setStaff(s => ({ ...s, expertoCount: s.expertoCount + 1 }))}
                      className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-500"
                    >+</button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">💼 Abogado Junior</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">$900.000/2 años (Económico)</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setStaff(s => ({ ...s, juniorCount: Math.max(0, s.juniorCount - 1) }))}
                      className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-white/20"
                    >-</button>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{staff.juniorCount}</span>
                    <button
                      onClick={() => setStaff(s => ({ ...s, juniorCount: s.juniorCount + 1 }))}
                      className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-500"
                    >+</button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">📊 Contador Público</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">$700.000/2 años (Optimiza $)</p>
                  </div>
                  <button
                    onClick={() => setStaff(s => ({ ...s, hasContador: !s.hasContador }))}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all",
                      staff.hasContador ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {staff.hasContador ? "Contratado ✓" : "Contratar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TARJETA DE EVENTO INESPERADO */}
        <AnimatePresence mode="wait">
          {activeRandomEvent && !hasDismissedEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "p-4 md:p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden",
                activeRandomEvent.tipo === "positivo" && "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200",
                activeRandomEvent.tipo === "negativo" && "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-500/40 text-red-900 dark:text-red-200",
                activeRandomEvent.tipo === "neutro" && "bg-slate-100 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Dice5 className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/80">
                    ¡EVENTO INESPERADO DE ETAPA!
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">{activeRandomEvent.titulo}</h4>
                <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed">{activeRandomEvent.descripcion}</p>
              </div>

              <button
                onClick={() => setHasDismissedEvent(true)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer border border-slate-300 dark:border-white/10 transition-all self-end md:self-center"
              >
                Entendido ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NARRATIVA Y DILEMA DE LA ETAPA */}
        <div className="bg-white/95 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-5 md:p-8 space-y-6 shadow-xl dark:shadow-2xl">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{currentEtapa.titulo}</h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{currentEtapa.contextoEscenario}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/15 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              El Dilema Crítico:
            </span>
            <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug">{currentEtapa.dilemaTexto}</p>
          </div>

          {/* OPCIONES DE ACCIÓN SELECCIONADAS ALEATORIAMENTE PARA ESTA PARTIDA */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>¿Qué decisión tomás? (Variables generadas para esta carrera)</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">🎲 Variedad Aleatoria</span>
            </span>

            <div className="space-y-2.5">
              {currentRandomOpciones.map((opcion) => {
                const isSkillLocked = opcion.requiereSkillId && opcion.requiereSkillId !== selectedSkill?.id;
                if (isSkillLocked) return null;

                const isOriginLocked = opcion.requiereOrigenFueraLaPlata && selectedProvincia === "Buenos Aires" && selectedMunicipioPBA.includes("La Plata");
                if (isOriginLocked) return null;

                const isSkillOption = Boolean(opcion.requiereSkillId && opcion.requiereSkillId === selectedSkill?.id);
                const hasQuizMinigame = Boolean(opcion.desafioJuridico);
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
                        ? "bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-white/5 opacity-50 cursor-not-allowed"
                        : isSkillOption
                        ? "bg-indigo-50/80 dark:bg-gradient-to-r dark:from-indigo-600/30 dark:via-slate-900 dark:to-violet-600/30 border-indigo-400 dark:border-indigo-500/60 shadow-md cursor-pointer"
                        : hasQuizMinigame
                        ? "bg-amber-50/80 dark:bg-gradient-to-r dark:from-amber-600/20 dark:via-slate-900 dark:to-indigo-600/20 border-amber-400 dark:border-amber-500/50 hover:border-amber-500 cursor-pointer"
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/20 cursor-pointer"
                    )}
                  >
                    <div className="space-y-1">
                      {isSkillOption && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                          [Opción Desbloqueada por Skill: {selectedSkill?.nombre}]
                        </span>
                      )}

                      {hasQuizMinigame && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 inline-flex items-center gap-1">
                          <Scale className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                          [Caso Práctico: Desafío Normativo +500 pts]
                        </span>
                      )}

                      <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {opcion.texto}
                      </p>

                      {!hasEnoughMoney && (
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Fondos Insuficientes: Se requieren {formatPesos(opcion.costoPesosRequerido || 0)} (Tenés {formatPesos(dineroPesos)})
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
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
