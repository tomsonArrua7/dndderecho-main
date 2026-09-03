import { useState, useEffect, useRef, useMemo, Component, ErrorInfo } from "react";
import { Link, useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileModal } from "@/components/trivia/UserProfileModal";
import { TriviaGuideModal } from "@/components/trivia/TriviaGuideModal";
import { TriviaMobileDashboard } from "@/components/trivia/TriviaMobileDashboard";
import { PracticeSetupModal } from "@/components/trivia/PracticeSetupModal";
import { TriviaInGameView, PowerUpsState } from "@/components/trivia/TriviaInGameView";
import { TriviaPostMatchModal } from "@/components/trivia/TriviaPostMatchModal";
import { toast } from "sonner";
import { 
  Trophy, 
  Timer, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  BookOpenCheck, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  BarChart3, 
  Sparkles, 
  Scale, 
  ShieldAlert, 
  Landmark, 
  FileText, 
  MapPin, 
  Building2, 
  GraduationCap,
  ChevronRight,
  Filter,
  Medal,
  LogIn,
  Play,
  UserCheck,
  Lock,
  Gavel,
  BookOpen,
  Briefcase,
  Info,
  X,
  Swords,
  Globe,
  Users,
  Copy,
  Check,
  Search,
  Share2,
  Trash2,
  Coins,
  Shield,
  Leaf,
  Zap,
  Plus,
  RefreshCw,
  Calendar,
  Eye,
  Loader2
} from "lucide-react";
import { 
  TRIVIA_QUESTIONS, 
  CATEGORIAS_TRIVIA, 
  MOCK_LEADERBOARD,
  RANGOS_JURIDICOS,
  calcularRango,
  TriviaQuestion, 
  LeaderboardEntry,
  RangoJuridico,
  DueloTrivia,
  CategoriaTrivia
} from "@/data/triviaData";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, any> = {
  Scale,
  ShieldAlert,
  Landmark,
  FileText,
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Gavel,
  Sparkles,
  Users,
  Coins,
  Globe,
  Shield,
  Leaf,
  Award,
  BookOpenCheck,
  Medal,
  Zap
};

const SEASON_START_TIMESTAMP = new Date("2026-08-13T19:00:00-03:00").getTime();

function getLiveSeasonInfo() {
  const now = Date.now();
  if (now < SEASON_START_TIMESTAMP) {
    const diff = Math.max(0, SEASON_START_TIMESTAMP - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const timeStr = d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
    return {
      isStarted: false,
      bannerTitle: "🚀 Próximo Inicio de Temporada Competitiva",
      badgeText: "Jueves 13 de Agosto 19:00 hs",
      countdownText: `Comienza en: ${timeStr}`,
      weeklyCountdown: `Comienza en: ${timeStr}`,
      monthlyCountdown: `Comienza en: ${timeStr}`
    };
  } else {
    const nowObj = new Date();
    const nextThursday = new Date(nowObj);
    let daysToAdd = (4 - nowObj.getDay() + 7) % 7;
    if (daysToAdd === 0 && (nowObj.getHours() > 19 || (nowObj.getHours() === 19 && nowObj.getMinutes() > 0))) {
      daysToAdd = 7;
    }
    nextThursday.setDate(nextThursday.getDate() + daysToAdd);
    nextThursday.setHours(19, 0, 0, 0);

    const diffW = Math.max(0, nextThursday.getTime() - now);
    const wd = Math.floor(diffW / (1000 * 60 * 60 * 24));
    const wh = Math.floor((diffW / (1000 * 60 * 60)) % 24);
    const wm = Math.floor((diffW / 1000 / 60) % 60);
    const ws = Math.floor((diffW / 1000) % 60);

    const nextMonth13 = new Date(nowObj);
    if (nowObj.getDate() > 13 || (nowObj.getDate() === 13 && nowObj.getHours() >= 19)) {
      nextMonth13.setMonth(nextMonth13.getMonth() + 1);
    }
    nextMonth13.setDate(13);
    nextMonth13.setHours(19, 0, 0, 0);

    const diffM = Math.max(0, nextMonth13.getTime() - now);
    const md = Math.floor(diffM / (1000 * 60 * 60 * 24));
    const mh = Math.floor((diffM / (1000 * 60 * 60)) % 24);
    const mm = Math.floor((diffM / 1000 / 60) % 60);
    const ms = Math.floor((diffM / 1000) % 60);

    return {
      isStarted: true,
      bannerTitle: "🔥 Temporada Competitiva Oficial en Curso",
      badgeText: "TEMPORADA ACTIVA",
      countdownText: `Reset 1v1 en: ${wd}d ${wh}h ${wm}m ${ws}s`,
      weeklyCountdown: `Reset Semanal 1v1 en: ${wd}d ${wh}h ${wm}m ${ws}s`,
      monthlyCountdown: `Reset Mensual General en: ${md}d ${mh}h ${mm}m ${ms}s`
    };
  }
}

// Función helper para encontrar preguntas con coincidencia 100% precisa de la materia/tema buscado
function findExactMatchingQuestions(userSubject: string, questions: TriviaQuestion[]): TriviaQuestion[] {
  if (!userSubject || !userSubject.trim()) return [];

  const raw = userSubject.trim().toLowerCase();
  const normUser = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Palabras estructurales a ignorar al comparar
  const stopWords = new Set(["derecho", "de", "del", "la", "el", "los", "las", "y", "e", "o", "u", "a", "en", "por", "materia", "catedra", "parcial", "flash"]);
  
  const queryTokens = normUser.split(/\s+/).filter(t => t && !stopWords.has(t));
  if (queryTokens.length === 0) {
    return questions.filter(q => {
      const cName = (q.categoria_nombre || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return cName === "derecho general" || cName === "introduccion al derecho";
    });
  }

  return questions.filter(q => {
    const catName = (q.categoria_nombre || "").toLowerCase();
    const catNorm = catName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Coincidencia exacta completa
    if (catNorm === normUser) return true;

    const catTokens = catNorm.split(/\s+/);

    // 2. Todos los tokens significativos de la búsqueda deben estar en el nombre de la categoría
    const matchesAllTokens = queryTokens.every(qToken => {
      return catTokens.some(cToken => {
        if (cToken === qToken) return true;
        // Mapeo números romanos / arábigos
        if (qToken === "1" && cToken === "i") return true;
        if (qToken === "i" && cToken === "1") return true;
        if (qToken === "2" && cToken === "ii") return true;
        if (qToken === "ii" && cToken === "2") return true;
        if (qToken === "3" && cToken === "iii") return true;
        if (qToken === "iii" && cToken === "3") return true;
        if (qToken === "4" && cToken === "iv") return true;
        if (qToken === "iv" && cToken === "4") return true;
        if (qToken === "5" && cToken === "v") return true;
        if (qToken === "v" && cToken === "5") return true;

        if (qToken.length >= 4 && cToken.includes(qToken)) return true;
        if (cToken.length >= 4 && qToken.includes(cToken)) return true;

        return false;
      });
    });

    if (!matchesAllTokens) return false;

    // 3. Control estricto de números de materia (evita cruzar I, II, III, IV, V)
    const isNum1 = queryTokens.some(t => t === "1" || t === "i" || t === "uno");
    const isNum2 = queryTokens.some(t => t === "2" || t === "ii" || t === "dos");
    const isNum3 = queryTokens.some(t => t === "3" || t === "iii" || t === "tres");
    const isNum4 = queryTokens.some(t => t === "4" || t === "iv" || t === "cuatro");
    const isNum5 = queryTokens.some(t => t === "5" || t === "v" || t === "cinco");

    const catIsNum1 = catTokens.some(t => t === "1" || t === "i" || t === "uno");
    const catIsNum2 = catTokens.some(t => t === "2" || t === "ii" || t === "dos");
    const catIsNum3 = catTokens.some(t => t === "3" || t === "iii" || t === "tres");
    const catIsNum4 = catTokens.some(t => t === "4" || t === "iv" || t === "cuatro");
    const catIsNum5 = catTokens.some(t => t === "5" || t === "v" || t === "cinco");

    if (isNum1 && (catIsNum2 || catIsNum3 || catIsNum4 || catIsNum5)) return false;
    if (isNum2 && (catIsNum1 || catIsNum3 || catIsNum4 || catIsNum5)) return false;
    if (isNum3 && (catIsNum1 || catIsNum2 || catIsNum4 || catIsNum5)) return false;
    if (isNum4 && (catIsNum1 || catIsNum2 || catIsNum3 || catIsNum5)) return false;
    if (isNum5 && (catIsNum1 || catIsNum2 || catIsNum3 || catIsNum4)) return false;

    return true;
  });
}

// Función para obtener de forma estricta y segura las preguntas de una materia/categoría específica
function getQuestionsForCategory(
  categoryId: string,
  categoryName: string,
  questions: TriviaQuestion[]
): TriviaQuestion[] {
  if (!categoryId || categoryId === "todas") {
    return [...questions];
  }

  // 1. Coincidencia directa por ID de categoría
  const matches = questions.filter(q => q.id_categoria === categoryId);

  // 2. Coincidencia por nombre exacto de la materia si es necesario (ej. preguntas de DB)
  if (categoryName && categoryName !== "Toda la Carrera") {
    const byName = findExactMatchingQuestions(categoryName, questions);
    const idSet = new Set(matches.map(q => q.id));
    for (const q of byName) {
      if (!idSet.has(q.id)) {
        matches.push(q);
        idSet.add(q.id);
      }
    }
  }

  return matches;
}

// Función que garantiza CERO preguntas repetidas por ID y por texto en cualquier modo de juego
function getStrictUniqueQuestions(
  primaryPool: TriviaQuestion[],
  count: number,
  fallbackPool: TriviaQuestion[] = []
): TriviaQuestion[] {
  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();
  const uniqueList: TriviaQuestion[] = [];

  const addQuestion = (q: TriviaQuestion) => {
    if (!q || !q.pregunta) return false;
    const normText = q.pregunta.trim().toLowerCase();
    if (!seenIds.has(q.id) && !seenTexts.has(normText)) {
      seenIds.add(q.id);
      seenTexts.add(normText);
      uniqueList.push(q);
      return true;
    }
    return false;
  };

  const shuffledPrimary = [...primaryPool].sort(() => 0.5 - Math.random());
  for (const q of shuffledPrimary) {
    if (uniqueList.length >= count) break;
    addQuestion(q);
  }

  if (uniqueList.length < count && fallbackPool.length > 0) {
    const shuffledFallback = [...fallbackPool].sort(() => 0.5 - Math.random());
    for (const q of shuffledFallback) {
      if (uniqueList.length >= count) break;
      addQuestion(q);
    }
  }

  return uniqueList;
}

// Función para desordenar aleatoriamente las 4 opciones de cada pregunta de forma segura
const prepareQuestionPool = (questions: TriviaQuestion[]): TriviaQuestion[] => {
  if (!Array.isArray(questions)) return [];
  return questions
    .filter(q => q && Array.isArray(q.opciones) && q.opciones.length > 0)
    .map(q => {
      const validIndex = (typeof q.respuesta_correcta_index === "number" && q.respuesta_correcta_index >= 0 && q.respuesta_correcta_index < q.opciones.length)
        ? q.respuesta_correcta_index
        : 0;
      const correctText = q.opciones[validIndex];
      const shuffled = [...q.opciones];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const newCorrectIndex = shuffled.indexOf(correctText);
      return {
        ...q,
        opciones: shuffled,
        respuesta_correcta_index: newCorrectIndex !== -1 ? newCorrectIndex : 0
      };
    });
};

export default function Trivia() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pestañas Principales: "jugar" | "duelos" | "ranking" | "historial"
  const [activeTab, setActiveTab] = useState<"jugar" | "duelos" | "ranking" | "historial">("jugar");
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [duelosSubTab, setDuelosSubTab] = useState<"disponibles" | "historial">("disponibles");
  const [showRangosModal, setShowRangosModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Filtro de Año y Materia para Evaluación Individual (Totalmente independiente)
  const [selectedYearFilter, setSelectedYearFilter] = useState<number>(0);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");

  // Filtro de Año y Materia para Duelos 1v1 (Totalmente independiente)
  const [dueloSelectedYearFilter, setDueloSelectedYearFilter] = useState<number>(0);
  const [dueloSelectedCategoria, setDueloSelectedCategoria] = useState<string>("todas");
  
  // Estado de Duelos 1v1 conectados a Supabase
  const [duelosList, setDuelosList] = useState<DueloTrivia[]>([]);
  const [loadingDuelos, setLoadingDuelos] = useState(false);
  const [inputCodigoDuelo, setInputCodigoDuelo] = useState("");
  const [createdDueloModal, setCreatedDueloModal] = useState<DueloTrivia | null>(null);
  const [activeDuelRoom, setActiveDuelRoom] = useState<DueloTrivia | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Registro de resultados de duelo ya vistos (para no repetir popups en cada refresco, estilo Preguntados)
  const [seenDuelResults, setSeenDuelResults] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dnd_seen_duel_results");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const seenDuelResultsRef = useRef<string[]>([]);
  useEffect(() => {
    seenDuelResultsRef.current = seenDuelResults;
  }, [seenDuelResults]);

  const isInitialLoadRef = useRef(true);

  const markDuelAsSeen = (duelId: string) => {
    if (!duelId) return;
    setSeenDuelResults(prev => {
      if (prev.includes(duelId)) return prev;
      const updated = [...prev, duelId];
      seenDuelResultsRef.current = updated;
      try {
        localStorage.setItem("dnd_seen_duel_results", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const activeDuelRoomRef = useRef<DueloTrivia | null>(null);
  useEffect(() => {
    activeDuelRoomRef.current = activeDuelRoom;
  }, [activeDuelRoom]);

  // Ranking conectado a Supabase (Oficial y Medallas)
  const [rankingSubTab, setRankingSubTab] = useState<"oficial" | "medallas">("oficial");
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);
  const [duelistasLeaderboardList, setDuelistasLeaderboardList] = useState<any[]>([]);
  const [medallasLeaderboardList, setMedallasLeaderboardList] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  // Modal para inspeccionar perfil público y medallas de otro estudiante
  const [inspectUserModal, setInspectUserModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName?: string;
    userAvatar?: string;
    initialStats?: {
      puntos?: number;
      racha?: number;
      aciertosPorcentaje?: number;
      partidasJugadas?: number;
      victoriasDuelo?: number;
      derrotasDuelo?: number;
    };
  }>({ isOpen: false, userId: null });

  const handleInspectUser = (
    userId?: string | null,
    userName?: string,
    avatarUrl?: string,
    initialStats?: {
      puntos?: number;
      racha?: number;
      aciertosPorcentaje?: number;
      partidasJugadas?: number;
      victoriasDuelo?: number;
      derrotasDuelo?: number;
    }
  ) => {
    setInspectUserModal({
      isOpen: true,
      userId: userId || null,
      userName: userName || "Estudiante de Abogacía",
      userAvatar: avatarUrl,
      initialStats
    });
  };

  // Modal de resultado final de Duelo 1v1
  const [duelOutcomeModal, setDuelOutcomeModal] = useState<{
    resultado: "victoria" | "derrota" | "empate" | "esperando_rival";
    puntosGanados: number;
    rivalNombre: string;
    p1Nombre: string;
    p1Puntos: number;
    p1Aciertos: number;
    p2Nombre: string;
    p2Puntos: number;
    p2Aciertos: number;
  } | null>(null);

  const duelOutcomeModalRef = useRef(duelOutcomeModal);
  useEffect(() => {
    duelOutcomeModalRef.current = duelOutcomeModal;
  }, [duelOutcomeModal]);

  // Filtros de juego Solo
  const [selectedDificultad, setSelectedDificultad] = useState<string>("todas");
  const [questionsCount, setQuestionsCount] = useState<number>(5);

  // Estado del juego solo / duelo
  const [inGame, setInGame] = useState(false);
  const [questionsPool, setQuestionsPool] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Timer por pregunta (20 segundos)
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  // Estados de Power-Ups (Nulidad 50/50, Apelación, Prórroga +10s)
  const [powerUps, setPowerUps] = useState<PowerUpsState>({
    nulidadCount: 2,
    apelacionCount: 1,
    prorrogaCount: 2,
    isApelacionActive: false,
    disabledOptionIndices: []
  });

  // Modal Post-Partida con animación de Elo y badge flotante de MMR
  const puntosTotalesAntesRef = useRef(0);
  const [postMatchModal, setPostMatchModal] = useState<{
    isOpen: boolean;
    resultado: "victoria" | "derrota" | "empate" | "evaluacion_completada";
    puntosCambio: number;
    puntosTotalesAntes: number;
    puntosTotalesDespues: number;
    correctAnswersCount: number;
    totalQuestions: number;
    maxStreak: number;
    isDuel1v1?: boolean;
    duelDetails?: {
      rivalNombre: string;
      p1Nombre: string;
      p1Puntos: number;
      p1Aciertos: number;
      p2Nombre: string;
      p2Puntos: number;
      p2Aciertos: number;
    };
  } | null>(null);

  // Estados para funciones de IA
  const [explicacionIA, setExplicacionIA] = useState<string | null>(null);
  const [loadingExplicacion, setLoadingExplicacion] = useState(false);

  const [isParcialFlashModalOpen, setIsParcialFlashModalOpen] = useState(false);
  const [loadingParcialFlash, setLoadingParcialFlash] = useState(false);
  const [materiaParcialFlash, setMateriaParcialFlash] = useState("Derecho Civil I");
  const [dbTriviaQuestions, setDbTriviaQuestions] = useState<TriviaQuestion[]>([]);

  // Estado y auto-apertura del Tutorial / Guía de juego en la primera visita
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Contador en tiempo real constante para la Temporada Competitiva (Inicio: Jueves 13 de Agosto 19:00 hs)
  const [seasonInfo, setSeasonInfo] = useState(() => getLiveSeasonInfo());

  useEffect(() => {
    const timer = setInterval(() => {
      setSeasonInfo(getLiveSeasonInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const guideSeen = localStorage.getItem("dnd_trivia_guide_seen");
      if (!guideSeen) {
        setShowGuideModal(true);
        localStorage.setItem("dnd_trivia_guide_seen", "true");
      }
    } catch {}
  }, []);

  // Cargar preguntas aprobadas de la base de datos Supabase
  useEffect(() => {
    async function fetchDbQuestions() {
      try {
        const { data, error } = await supabase.from("trivia_preguntas").select("*").eq("aprobado", true);
        if (!error && data && data.length > 0) {
          const mapped: TriviaQuestion[] = data
            .filter((d: any) => d && d.pregunta && Array.isArray(d.opciones) && d.opciones.length === 4)
            .map((d: any) => ({
              id: d.id || `db_${Math.random()}`,
              id_categoria: d.materia ? d.materia.toLowerCase().replace(/\s+/g, "_") : "general",
              categoria_nombre: d.materia || "Derecho General",
              dificultad: d.dificultad || "media",
              pregunta: d.pregunta,
              opciones: d.opciones,
              respuesta_correcta_index: typeof d.respuesta_correcta_index === "number" ? d.respuesta_correcta_index : 0,
              fundamento_juridico: d.fundamento_juridico || "",
              puntos_base: 100
            }));
          setDbTriviaQuestions(mapped);
        }
      } catch (e) {
        console.warn("No se pudieron cargar preguntas de DB Supabase:", e);
      }
    }
    fetchDbQuestions();
  }, []);

  // Pool general de preguntas estrictamente desduplicado por ID y por texto
  const allQuestionsCombined = useMemo(() => {
    const raw = [...TRIVIA_QUESTIONS, ...dbTriviaQuestions];
    const seenIds = new Set<string>();
    const seenTexts = new Set<string>();
    const result: TriviaQuestion[] = [];

    for (const q of raw) {
      if (!q || !q.pregunta) continue;
      const normText = q.pregunta.trim().toLowerCase();
      if (!seenIds.has(q.id) && !seenTexts.has(normText)) {
        seenIds.add(q.id);
        seenTexts.add(normText);
        result.push(q);
      }
    }
    return result;
  }, [dbTriviaQuestions]);

  const solicitarExplicacionIA = async (q: TriviaQuestion, opcionIndex: number) => {
    try {
      setLoadingExplicacion(true);
      setExplicacionIA(null);

      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://api.dndjursoc.com.ar").replace(/\/$/, "");
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

      const res = await fetch(`${supabaseUrl}/functions/v1/asistente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`,
          "apikey": supabaseAnonKey
        },
        body: JSON.stringify({
          accion: "explicar_fallo",
          pregunta_trivia: q.pregunta,
          opcion_elegida: q.opciones[opcionIndex] || "",
          opcion_correcta: q.opciones[q.respuesta_correcta_index] || "",
          fundamento: q.fundamento_juridico || ""
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExplicacionIA(data.explicacion);
      } else {
        toast.error("No se pudo consultar al tutor IA.");
      }
    } catch (e) {
      toast.error("Error de conexión.");
    } finally {
      setLoadingExplicacion(false);
    }
  };

  const generarParcialFlashIA = async () => {
    try {
      setLoadingParcialFlash(true);
      const materiaLimpia = materiaParcialFlash.trim();

      if (!materiaLimpia) {
        toast.error("Por favor ingresa una materia o tema.");
        return;
      }
      
      // 1. Obtener preguntas existentes que coincidan 100% de forma precisa con la materia solicitada
      const matchingExisting = findExactMatchingQuestions(materiaLimpia, allQuestionsCombined);

      // Si ya tenemos 5 o más preguntas exactas en nuestro banco masivo para esa materia, responder AL INSTANTE
      if (matchingExisting.length >= 5) {
        const selected = [...matchingExisting].sort(() => 0.5 - Math.random()).slice(0, 5);
        const pool = prepareQuestionPool(selected);
        setQuestionsPool(pool);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setCorrectAnswersCount(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setGameOver(false);
        setInGame(true);
        setTimeLeft(25);
        setIsParcialFlashModalOpen(false);
        toast.success(`⚡ ¡Parcial Flash de ${materiaLimpia} listo (5 preguntas de ${matchingExisting.length} disponibles)!`);
        return;
      }

      // Si tenemos entre 1 y 4 preguntas de la materia, usarlas todas e invocar la IA para completar las que faltan
      const selectedExisting = [...matchingExisting].sort(() => 0.5 - Math.random());
      const neededNewCount = 5 - selectedExisting.length;

      // 2. Invocar la IA para generar las preguntas faltantes de la materia
      let newAiQuestions: TriviaQuestion[] = [];
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://api.dndjursoc.com.ar").replace(/\/$/, "");
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(`${supabaseUrl}/functions/v1/asistente`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token || ""}`,
            "apikey": supabaseAnonKey
          },
          body: JSON.stringify({
            accion: "generar_parcial_flash",
            materia: materiaLimpia,
            cantidad: neededNewCount > 0 ? neededNewCount : 5
          }),
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);

        if (res && res.ok) {
          const data = await res.json();
          if (data.preguntas && data.preguntas.length > 0) {
            newAiQuestions = data.preguntas.map((q: any, idx: number) => ({
              id: `ai_${Date.now()}_${idx}`,
              id_categoria: materiaLimpia.toLowerCase().replace(/\s+/g, "_"),
              categoria_nombre: materiaLimpia,
              dificultad: "media" as const,
              pregunta: q.pregunta,
              opciones: q.opciones,
              respuesta_correcta_index: typeof q.respuesta_correcta_index === "number" ? q.respuesta_correcta_index : 0,
              fundamento_juridico: q.fundamento_juridico || `Generado por la IA para ${materiaLimpia}.`,
              puntos_base: 100
            }));

            // PERSISTIR LAS PREGUNTAS NUEVAS EN SUPABASE PARA SUMARLAS AL BANCO GLOBAL CONTINUAMENTE
            try {
              const toInsert = newAiQuestions.map(q => ({
                materia: materiaLimpia,
                dificultad: "media",
                pregunta: q.pregunta,
                opciones: q.opciones,
                respuesta_correcta_index: q.respuesta_correcta_index,
                fundamento_juridico: q.fundamento_juridico,
                aprobado: true
              }));
              await supabase.from("trivia_preguntas").insert(toInsert);
            } catch (errDb) {
              console.warn("Error al guardar preguntas IA en Supabase:", errDb);
            }
          }
        }
      } catch (eAi) {
        console.warn("Timeout o falla al invocar IA:", eAi);
      }

      // 3. Mezclar preguntas existentes de la materia + preguntas de la IA de la materia garantizando unicidad estricta
      const strictlyUnique = getStrictUniqueQuestions([...selectedExisting, ...newAiQuestions], 5, allQuestionsCombined);

      if (strictlyUnique.length === 0) {
        toast.error(`No se pudieron generar preguntas específicas para "${materiaLimpia}". Intenta nuevamente.`);
        return;
      }

      const pool = prepareQuestionPool(strictlyUnique);
      setQuestionsPool(pool);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setCorrectAnswersCount(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setGameOver(false);
      setInGame(true);
      setTimeLeft(25);
      setIsParcialFlashModalOpen(false);
      toast.success(`⚡ ¡Parcial Flash de ${materiaLimpia} listo!${newAiQuestions.length > 0 ? ` (+${newAiQuestions.length} preguntas IA sumadas al banco)` : ""}`);

    } catch (e) {
      toast.error("Error al iniciar Parcial Flash.");
    } finally {
      setLoadingParcialFlash(false);
    }
  };

  const [loadingGenerarIA, setLoadingGenerarIA] = useState(false);

  const handleGenerarPreguntasConIA = async (materiaParam?: string) => {
    const cat = CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria);
    const materiaNombre = (materiaParam || (cat && cat.id !== "todas" ? cat.nombre : "Derecho Constitucional")).trim();

    try {
      setLoadingGenerarIA(true);
      toast.info(`🧠 Invocando al Evaluador Académico IA (FCJyS UNLP) para ${materiaNombre}...`);

      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://api.dndjursoc.com.ar").replace(/\/$/, "");
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

      const res = await fetch(`${supabaseUrl}/functions/v1/asistente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`,
          "apikey": supabaseAnonKey
        },
        body: JSON.stringify({
          accion: "generar_preguntas_trivia",
          materia: materiaNombre,
          cantidad: 5
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.preguntas && data.preguntas.length > 0) {
          const catId = cat?.id || materiaNombre.toLowerCase().replace(/\s+/g, "_");
          const formatted: TriviaQuestion[] = data.preguntas.map((q: any, idx: number) => ({
            id: `ai_${catId}_${Date.now()}_${idx}`,
            id_categoria: catId,
            categoria_nombre: materiaNombre,
            dificultad: "media" as const,
            pregunta: q.pregunta,
            opciones: q.opciones,
            respuesta_correcta_index: typeof q.respuesta_correcta_index === "number" ? q.respuesta_correcta_index : 0,
            fundamento_juridico: q.fundamento_juridico || `Fundamentado según programa de ${materiaNombre} de la FCJyS UNLP.`,
            puntos_base: 100
          }));

          // Persistir en Supabase en segundo plano
          try {
            await supabase.from("trivia_preguntas").insert(
              formatted.map(q => ({
                materia: materiaNombre,
                dificultad: "media",
                pregunta: q.pregunta,
                opciones: q.opciones,
                respuesta_correcta_index: q.respuesta_correcta_index,
                fundamento_juridico: q.fundamento_juridico,
                aprobado: true
              }))
            );
          } catch (dbErr) {
            console.warn("No se pudo persistir en tabla trivia_preguntas:", dbErr);
          }

          // Añadir inmediatamente a la base en memoria
          setDbTriviaQuestions(prev => [...formatted, ...prev]);
          toast.success(`✨ ¡Se agregaron 5 nuevas preguntas oficiales de ${materiaNombre} al banco general!`);
        } else {
          toast.error("La IA no devolvió preguntas. Probá de nuevo.");
        }
      } else {
        toast.error("No se pudo conectar con el servicio de IA.");
      }
    } catch (err: any) {
      console.error("Error al invocar IA de Trivia:", err);
      toast.error("Error al generar preguntas con IA.");
    } finally {
      setLoadingGenerarIA(false);
    }
  };

  // Estadísticas del usuario acumuladas (sincronizadas con DB / LocalStorage)
  const [rawUserStats, setUserStats] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("dnd_trivia_user_stats");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && typeof parsed === "object") return parsed;
    } catch {}
    return {};
  });

  const userStats = useMemo(() => {
    return {
      totalJugadas: typeof rawUserStats?.totalJugadas === "number" ? rawUserStats.totalJugadas : 0,
      totalCorrectas: typeof rawUserStats?.totalCorrectas === "number" ? rawUserStats.totalCorrectas : 0,
      puntosTotales: typeof rawUserStats?.puntosTotales === "number" ? rawUserStats.puntosTotales : 0,
      mejorRacha: typeof rawUserStats?.mejorRacha === "number" ? rawUserStats.mejorRacha : 0,
      victoriasDuelo: typeof rawUserStats?.victoriasDuelo === "number" ? rawUserStats.victoriasDuelo : 0,
      derrotasDuelo: typeof rawUserStats?.derrotasDuelo === "number" ? rawUserStats.derrotasDuelo : 0,
      empatesDuelo: typeof rawUserStats?.empatesDuelo === "number" ? rawUserStats.empatesDuelo : 0,
      puntosDuelista: typeof rawUserStats?.puntosDuelista === "number" ? rawUserStats.puntosDuelista : 0,
    };
  }, [rawUserStats]);

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Estudiante de Abogacía";
  const rangoActual = calcularRango(userStats.puntosTotales);
  const RangoIcon = ICON_MAP[rangoActual.iconoNombre] || BookOpen;

  const proximoRangoIndex = RANGOS_JURIDICOS.findIndex(r => r.id === rangoActual.id) + 1;
  const proximoRango = RANGOS_JURIDICOS[proximoRangoIndex] || null;
  const progresoPorcentaje = proximoRango
    ? Math.min(100, Math.round(((userStats.puntosTotales - rangoActual.minPuntos) / (proximoRango.minPuntos - rangoActual.minPuntos)) * 100))
    : 100;
  const puntosFaltantes = proximoRango
    ? Math.max(0, proximoRango.minPuntos - userStats.puntosTotales)
    : 0;

  // 1. Cargar Estadísticas del usuario desde Supabase
  const fetchUserStatsFromSupabase = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("trivia_estadisticas_usuario")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data && !error) {
        const stats = {
          totalJugadas: data.partidas_jugadas || 0,
          totalCorrectas: data.total_aciertos || 0,
          puntosTotales: data.puntos_totales || 0,
          mejorRacha: data.mejor_racha || 0,
          victoriasDuelo: data.victorias_duelo || 0,
          derrotasDuelo: data.derrotas_duelo || 0,
          empatesDuelo: data.empates_duelo || 0,
          puntosDuelista: data.puntos_duelista || 0,
        };
        setUserStats(stats);
        localStorage.setItem("dnd_trivia_user_stats", JSON.stringify(stats));
      } else {
        const emptyStats = {
          totalJugadas: 0,
          totalCorrectas: 0,
          puntosTotales: 0,
          mejorRacha: 0,
          victoriasDuelo: 0,
          derrotasDuelo: 0,
          empatesDuelo: 0,
          puntosDuelista: 0,
        };
        setUserStats(emptyStats);
        localStorage.removeItem("dnd_trivia_user_stats");
      }
    } catch (err) {
      console.error("Error cargando estadísticas desde Supabase:", err);
    }
  };

  // 2. Cargar Ranking / Leaderboard General Real desde Supabase DB
  const fetchRankingFromSupabase = async () => {
    setLoadingRanking(true);
    try {
      const { data, error } = await supabase
        .from("trivia_leaderboard")
        .select("*")
        .order("puntos", { ascending: false })
        .limit(50);

      if (data && !error && data.length > 0) {
        const formatted: LeaderboardEntry[] = data.map((row: any, idx: number) => ({
          id: row.user_id || row.id || `rank_user_${idx}`,
          posicion: idx + 1,
          nombre: row.nombre || row.nombre_completo || row.full_name || "Estudiante de Abogacía",
          facultad: "FCJyS - UNLP",
          materiaFav: row.materia_fav || "Toda la Carrera",
          puntos: Number(row.puntos) || 0,
          aciertosPorcentaje: Number(row.aciertos_porcentaje) || 0,
          racha: Number(row.racha) || 0,
          avatarUrl: row.avatar_url || undefined,
          rangoNombre: calcularRango(Number(row.puntos) || 0).nombre
        }));
        setLeaderboardList(formatted);
      } else {
        setLeaderboardList([]);
      }

      const { data: duelData, error: duelError } = await supabase
        .from("trivia_leaderboard_duelistas")
        .select("*")
        .order("puntos_duelista", { ascending: false })
        .limit(50);

      if (duelData && !duelError && duelData.length > 0) {
        setDuelistasLeaderboardList(duelData);
      } else {
        setDuelistasLeaderboardList([]);
      }

      const { data: medallasData, error: medallasError } = await supabase
        .from("trivia_leaderboard_medallas")
        .select("*")
        .limit(50);

      if (medallasData && !medallasError && medallasData.length > 0) {
        setMedallasLeaderboardList(medallasData);
      } else {
        setMedallasLeaderboardList([]);
      }
    } catch (err) {
      console.error("Error al obtener ranking en Supabase:", err);
    } finally {
      setLoadingRanking(false);
    }
  };

  // Evaluar automáticamente si hay un duelo recién finalizado del jugador sin haber visto el modal (Estilo Preguntados)
  const checkAndTriggerUnseenResults = (duelos: DueloTrivia[], seenList: string[]) => {
    // Si el modal ya está abierto con un resultado FINAL (victoria/derrota/empate), no interrumpir
    const isModalOpenWithFinalResult = duelOutcomeModalRef.current && duelOutcomeModalRef.current.resultado !== "esperando_rival";
    if (isModalOpenWithFinalResult) return;

    for (const duel of duelos) {
      const isP1 = (user?.id && duel.player1Id === user.id) || duel.player1Nombre === userName;
      const isP2 = (user?.id && duel.player2Id === user.id) || (duel.player2Nombre && duel.player2Nombre === userName);

      if (!isP1 && !isP2) continue;

      const isFinished = duel.status === "finalizado" || (duel.player1Completed && duel.player2Completed);
      const isWaitingThisDuel = duelOutcomeModalRef.current?.resultado === "esperando_rival";
      const isUnseen = !seenList.includes(duel.id);

      if (isFinished && (isUnseen || isWaitingThisDuel)) {
        const myScore = isP1 ? (duel.player1Puntos || 0) : (duel.player2Puntos || 0);
        const oppScore = isP1 ? (duel.player2Puntos || 0) : (duel.player1Puntos || 0);
        const p1Score = duel.player1Puntos || 0;
        const p1Aciertos = duel.player1Aciertos || 0;
        const p2Score = duel.player2Puntos || 0;
        const p2Aciertos = duel.player2Aciertos || 0;
        const oppName = isP1 ? (duel.player2Nombre || "Rival") : (duel.player1Nombre || "Rival");

        let res: "victoria" | "derrota" | "empate" = "empate";
        let ptsBonus = 25;

        if (myScore > oppScore) {
          res = "victoria";
          ptsBonus = 50;
        } else if (oppScore > myScore) {
          res = "derrota";
          ptsBonus = -15;
        } else {
          res = "empate";
          ptsBonus = 25;
        }

        markDuelAsSeen(duel.id);
        setActiveDuelRoom(duel);

        // Guardar notificación persistente en el Centro de Notificaciones y disparar evento en vivo
        try {
          const currentNotifs = JSON.parse(localStorage.getItem("dnd_duel_notifications") || "[]");
          const existingIndex = currentNotifs.findIndex((n: any) => n.id === duel.id);
          const outcomeLabel = res === "victoria" ? "¡Victoria! (+50 pts)" : res === "derrota" ? "Derrota (-15 pts)" : "¡Empate! (+25 pts)";
          const newNotif = {
            id: duel.id,
            title: `⚔️ Duelo 1v1: ${duel.materiaNombre}`,
            description: `Tu rival ${oppName} completó el duelo. Resultado: ${outcomeLabel}`,
            materiaNombre: duel.materiaNombre,
            timestamp: duel.createdAt || "Reciente",
            seen: false,
            date: Date.now()
          };
          if (existingIndex >= 0) {
            currentNotifs[existingIndex] = newNotif;
          } else {
            currentNotifs.unshift(newNotif);
          }
          localStorage.setItem("dnd_duel_notifications", JSON.stringify(currentNotifs.slice(0, 20)));
          window.dispatchEvent(new CustomEvent("dnd_duel_notification_event"));
          toast.success(`⚔️ ¡${oppName} completó el duelo de ${duel.materiaNombre}! Resultado: ${outcomeLabel}`);
        } catch {}

        let duelQuestions = allQuestionsCombined.filter(q => duel.preguntasIds.includes(q.id));
        if (duelQuestions.length < 5) {
          const fallbackPool = getQuestionsForCategory(duel.materiaId, duel.materiaNombre, allQuestionsCombined);
          duelQuestions = getStrictUniqueQuestions(duelQuestions, 5, fallbackPool.length > 0 ? fallbackPool : allQuestionsCombined);
        } else {
          duelQuestions = getStrictUniqueQuestions(duelQuestions, 5, allQuestionsCombined);
        }
        setQuestionsPool(prepareQuestionPool(duelQuestions));

        setDuelOutcomeModal({
          resultado: res,
          puntosGanados: ptsBonus,
          rivalNombre: oppName,
          p1Nombre: duel.player1Nombre || "Jugador 1",
          p1Puntos: p1Score,
          p1Aciertos: p1Aciertos,
          p2Nombre: duel.player2Nombre || "Jugador 2",
          p2Puntos: p2Score,
          p2Aciertos: p2Aciertos
        });

        fetchUserStatsFromSupabase();
        fetchRankingFromSupabase();
        break;
      }
    }
  };

  // 3. Cargar Salas de Duelo 1vs1 desde Supabase DB (con eliminación automática de salas > 15 minutos sin rival)
  const fetchDuelosFromSupabase = async () => {
    setLoadingDuelos(true);
    try {
      // Limpieza proactiva en Supabase de salas en espera creadas hace más de 15 minutos sin rival
      const fifteenMinsAgoISO = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      supabase
        .from("trivia_duelos")
        .delete()
        .eq("status", "esperando_rival")
        .is("player2_id", null)
        .lt("created_at", fifteenMinsAgoISO)
        .then(() => {})
        .catch(() => {});

      const { data, error } = await supabase
        .from("trivia_duelos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);

      if (data && !error) {
        const now = Date.now();
        const mapped: DueloTrivia[] = data
          // Descartar salas expiradas (>15 minutos de espera sin rival)
          .filter((d: any) => {
            const isWaitingWithoutRival = !d.player2_id && d.status === "esperando_rival";
            if (isWaitingWithoutRival && d.created_at) {
              const diffMs = now - new Date(d.created_at).getTime();
              if (diffMs > 15 * 60 * 1000) return false;
            }
            return true;
          })
          .map((d: any) => ({
            id: d.id,
            esPublico: d.es_publico,
            materiaId: d.materia_id,
            materiaNombre: d.materia_nombre,
            preguntasIds: Array.isArray(d.preguntas_ids) ? d.preguntas_ids : [],
            player1Id: d.player1_id || "p1_anon",
            player1Nombre: d.player1_nombre,
            player1Aciertos: d.player1_aciertos || 0,
            player1TiempoMs: d.player1_tiempo_ms || 0,
            player1Puntos: d.player1_puntos || 0,
            player1Completed: d.player1_completed || false,
            player2Id: d.player2_id || undefined,
            player2Nombre: d.player2_nombre || undefined,
            player2Aciertos: d.player2_aciertos || 0,
            player2TiempoMs: d.player2_tiempo_ms || 0,
            player2Puntos: d.player2_puntos || 0,
            player2Completed: d.player2_completed || false,
            ganadorId: d.ganador_id || undefined,
            status: d.status || "esperando_rival",
            createdAt: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Reciente"
          }));

        setDuelosList(mapped);

        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          // En la carga inicial, sincronizar las notificaciones de los duelos finalizados para no perder ningún resultado
          for (const duel of mapped) {
            const isP1 = (user?.id && duel.player1Id === user.id) || duel.player1Nombre === userName;
            const isP2 = (user?.id && duel.player2Id === user.id) || (duel.player2Nombre && duel.player2Nombre === userName);
            if (!isP1 && !isP2) continue;
            const isFinished = duel.status === "finalizado" || (duel.player1Completed && duel.player2Completed);
            if (isFinished && !seenDuelResultsRef.current.includes(duel.id)) {
              const myScore = isP1 ? (duel.player1Puntos || 0) : (duel.player2Puntos || 0);
              const oppScore = isP1 ? (duel.player2Puntos || 0) : (duel.player1Puntos || 0);
              const oppName = isP1 ? (duel.player2Nombre || "Rival") : (duel.player1Nombre || "Rival");
              const res = myScore > oppScore ? "victoria" : oppScore > myScore ? "derrota" : "empate";
              const outcomeLabel = res === "victoria" ? "¡Victoria! (+50 pts)" : res === "derrota" ? "Derrota (-15 pts)" : "¡Empate! (+25 pts)";
              try {
                const currentNotifs = JSON.parse(localStorage.getItem("dnd_duel_notifications") || "[]");
                if (!currentNotifs.some((n: any) => n.id === duel.id)) {
                  const newNotif = {
                    id: duel.id,
                    title: `⚔️ Duelo 1v1: ${duel.materiaNombre}`,
                    description: `Tu rival ${oppName} completó el duelo. Resultado: ${outcomeLabel}`,
                    materiaNombre: duel.materiaNombre,
                    timestamp: duel.createdAt || "Reciente",
                    seen: false,
                    date: Date.now()
                  };
                  localStorage.setItem("dnd_duel_notifications", JSON.stringify([newNotif, ...currentNotifs].slice(0, 20)));
                  window.dispatchEvent(new CustomEvent("dnd_duel_notification_event"));
                }
              } catch {}
            }
          }
          checkAndTriggerUnseenResults(mapped, seenDuelResultsRef.current);
        } else {
          // Auto-activar modal y actualizar cuando el rival termina
          checkAndTriggerUnseenResults(mapped, seenDuelResultsRef.current);
        }
      }
    } catch (err) {
      console.error("Error al obtener duelos de Supabase:", err);
    } finally {
      setLoadingDuelos(false);
    }
  };

  // Historial de Actividad Reciente del Usuario desde Supabase DB
  const [recentActivityList, setRecentActivityList] = useState<any[]>([]);

  const fetchRecentActivityFromSupabase = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("trivia_partidas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data && !error) {
        setRecentActivityList(data);
      }
    } catch (err) {
      console.error("Error al obtener actividad reciente de Supabase:", err);
    }
  };

  // Escuchar cambios de autenticación, Polling 4s y Suscripción Realtime a trivia_duelos
  useEffect(() => {
    fetchUserStatsFromSupabase();
    fetchDuelosFromSupabase();
    fetchRankingFromSupabase();
    fetchRecentActivityFromSupabase();

    // Polling cada 4 segundos para asegurar sync fluida en celulares y PCs sin depender únicamente del socket
    const pollInterval = setInterval(() => {
      fetchDuelosFromSupabase();
    }, 4000);

    // Suscripción Realtime para notificación instantánea
    const channel = supabase
      .channel("public:trivia_duelos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trivia_duelos" },
        () => {
          fetchDuelosFromSupabase();
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [user?.id, userName]);

  // Auto-cargar sala si se navega con parámetro ?dueloId=... (desde Notificaciones)
  useEffect(() => {
    const duelIdParam = searchParams.get("dueloId");
    if (duelIdParam && duelosList.length > 0) {
      const match = duelosList.find(d => d.id === duelIdParam);
      if (match) {
        setActiveTab("duelos");
        handleJoinDuelo(match);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, duelosList]);

  // Fast-sync activo específicamente mientras se espera que el rival termine el duelo 1v1
  useEffect(() => {
    if (duelOutcomeModal?.resultado !== "esperando_rival" || !activeDuelRoom?.id) return;

    const fastSyncInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("trivia_duelos")
          .select("*")
          .eq("id", activeDuelRoom.id)
          .maybeSingle();

        if (data && !error) {
          const isFinished = data.status === "finalizado" || (data.player1_completed && data.player2_completed);
          if (isFinished) {
            fetchDuelosFromSupabase();
          }
        }
      } catch {}
    }, 2000);

    return () => clearInterval(fastSyncInterval);
  }, [duelOutcomeModal?.resultado, activeDuelRoom?.id]);

  // Persistir stats localmente como fallback
  useEffect(() => {
    try {
      localStorage.setItem("dnd_trivia_user_stats", JSON.stringify(userStats));
    } catch {
      // Ignorar
    }
  }, [userStats]);

  // Scroll instantáneo a arriba al iniciar cualquier partida (examen o duelo)
  useEffect(() => {
    if (inGame) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [inGame]);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inGame && !isAnswered && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && inGame && !gameOver) {
      handleAnswer(-1);
    }
    return () => clearInterval(timer);
  }, [inGame, isAnswered, gameOver, timeLeft]);

  // Filtrado de Categorías según el Año Seleccionado para Individual
  const filteredCategorias = selectedYearFilter === 0
    ? CATEGORIAS_TRIVIA
    : CATEGORIAS_TRIVIA.filter(cat => cat.anio === selectedYearFilter || cat.id === "todas");

  // Filtrado de Categorías según el Año Seleccionado para Duelos
  const filteredDueloCategorias = dueloSelectedYearFilter === 0
    ? CATEGORIAS_TRIVIA
    : CATEGORIAS_TRIVIA.filter(cat => cat.anio === dueloSelectedYearFilter || cat.id === "todas");

  // Power-Ups Handlers
  const handleUseNulidad = () => {
    if (isAnswered || powerUps.nulidadCount <= 0 || powerUps.disabledOptionIndices.length > 0) return;
    const currentQ = questionsPool[currentIndex];
    if (!currentQ) return;
    const wrongIndices = currentQ.opciones
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQ.respuesta_correcta_index);
    const shuffledWrong = [...wrongIndices].sort(() => 0.5 - Math.random()).slice(0, 2);
    setPowerUps(prev => ({
      ...prev,
      nulidadCount: Math.max(0, prev.nulidadCount - 1),
      disabledOptionIndices: shuffledWrong
    }));
    toast.success("⚖️ ¡Nulidad planteada! Se anularon 2 opciones incorrectas.");
  };

  const handleUseApelacion = () => {
    if (isAnswered || powerUps.apelacionCount <= 0 || powerUps.isApelacionActive) return;
    setPowerUps(prev => ({
      ...prev,
      apelacionCount: Math.max(0, prev.apelacionCount - 1),
      isApelacionActive: true
    }));
    toast.info("📜 ¡Recurso de Apelación preparado! Si errás esta pregunta, tendrás una segunda oportunidad.");
  };

  const handleUseProrroga = () => {
    if (isAnswered || powerUps.prorrogaCount <= 0) return;
    setTimeLeft(prev => prev + 10);
    setPowerUps(prev => ({
      ...prev,
      prorrogaCount: Math.max(0, prev.prorrogaCount - 1)
    }));
    toast.success("⏱️ ¡Prórroga de plazo solicitada! +10 segundos.");
  };

  // Iniciar Trivia Solo (con desorden de opciones aleatorio y CERO duplicados)
  const handleStartGame = () => {
    setActiveDuelRoom(null);
    setExplicacionIA(null);
    puntosTotalesAntesRef.current = userStats.puntosTotales;
    setPowerUps({
      nulidadCount: 2,
      apelacionCount: 1,
      prorrogaCount: 2,
      isApelacionActive: false,
      disabledOptionIndices: []
    });

    const cat = CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria);
    const catNombre = cat ? cat.nombre : "";

    let pool = getQuestionsForCategory(selectedCategoria, catNombre, allQuestionsCombined);

    if (pool.length === 0) {
      pool = selectedCategoria === "todas"
        ? [...allQuestionsCombined]
        : findExactMatchingQuestions(catNombre, allQuestionsCombined);
    }

    const finalPool = getStrictUniqueQuestions(pool, questionsCount, allQuestionsCombined);

    // Mezclar las 4 opciones de cada pregunta aleatoriamente
    setQuestionsPool(prepareQuestionPool(finalPool));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameOver(false);
    setTimeLeft(20);
    setInGame(true);
  };

  // Iniciar Modo Flash (5 preguntas ultra-rápidas con 10s por pregunta y CERO duplicados)
  const handleStartFlashGame = () => {
    setActiveDuelRoom(null);
    setExplicacionIA(null);
    puntosTotalesAntesRef.current = userStats.puntosTotales;
    setPowerUps({
      nulidadCount: 2,
      apelacionCount: 1,
      prorrogaCount: 2,
      isApelacionActive: false,
      disabledOptionIndices: []
    });

    const finalPool = getStrictUniqueQuestions(allQuestionsCombined, 5);

    setQuestionsPool(prepareQuestionPool(finalPool));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameOver(false);
    setTimeLeft(10);
    setInGame(true);
  };

  // Crear Duelo 1vs1 en Supabase (con selector propio de materia y CERO preguntas repetidas)
  const handleCreateDuelo = async (esPublico: boolean, overrideCatId?: string) => {
    const randomCode = `DND-${Math.floor(100 + Math.random() * 900)}`;
    const catIdToUse = overrideCatId || dueloSelectedCategoria;
    const cat = CATEGORIAS_TRIVIA.find(c => c.id === catIdToUse) || CATEGORIAS_TRIVIA[0];

    const pool = getQuestionsForCategory(cat.id, cat.nombre, allQuestionsCombined);
    const finalPool = getStrictUniqueQuestions(pool, 5, allQuestionsCombined);
    const selectedQIds = finalPool.map(q => q.id);

    const dbRow = {
      id: randomCode,
      es_publico: esPublico,
      materia_id: cat.id,
      materia_nombre: cat.nombre,
      preguntas_ids: selectedQIds,
      player1_id: user?.id || null,
      player1_nombre: userName,
      player1_aciertos: 0,
      player1_tiempo_ms: 0,
      player1_puntos: 0,
      player1_completed: false,
      status: "esperando_rival"
    };

    try {
      await supabase.from("trivia_duelos").insert(dbRow);
      fetchDuelosFromSupabase();
    } catch (err) {
      console.error("Error al crear duelo en Supabase:", err);
    }

    const nuevoDueloFrontend: DueloTrivia = {
      id: randomCode,
      esPublico,
      materiaId: cat.id,
      materiaNombre: cat.nombre,
      preguntasIds: selectedQIds,
      player1Id: user?.id || "p1_anon",
      player1Nombre: userName,
      player1Aciertos: 0,
      player1TiempoMs: 0,
      player1Puntos: 0,
      player1Completed: false,
      status: "esperando_rival",
      createdAt: "Recién creado"
    };

    setCreatedDueloModal(nuevoDueloFrontend);
  };

  // Unirse a un Duelo 1vs1 (por código o lista)
  const handleJoinDuelo = async (duelo: DueloTrivia) => {
    const isPlayer1 = (user?.id && duelo.player1Id === user.id) || duelo.player1Nombre === userName;
    const isPlayer2 = (user?.id && duelo.player2Id === user.id) || (duelo.player2Nombre && duelo.player2Nombre === userName);

    // Si la sala ya tiene 2 jugadores y quien intenta entrar no es ninguno de los 2
    if (!isPlayer1 && !isPlayer2 && duelo.player2Id && duelo.player2Nombre) {
      toast.error("Esta sala ya está ocupada por dos jugadores.");
      fetchDuelosFromSupabase();
      return;
    }

    setActiveDuelRoom(duelo);

    // Cargar siempre las preguntas del duelo garantizando estrictamente que coincidan y no se repitan
    let duelQuestions = allQuestionsCombined.filter(q => duelo.preguntasIds.includes(q.id));
    if (duelQuestions.length < 5) {
      const fallbackPool = getQuestionsForCategory(duelo.materiaId, duelo.materiaNombre, allQuestionsCombined);
      duelQuestions = getStrictUniqueQuestions(duelQuestions, 5, fallbackPool.length > 0 ? fallbackPool : allQuestionsCombined);
    } else {
      duelQuestions = getStrictUniqueQuestions(duelQuestions, 5, allQuestionsCombined);
    }
    setQuestionsPool(prepareQuestionPool(duelQuestions));

    const myCompleted = isPlayer1 ? duelo.player1Completed : (isPlayer2 ? duelo.player2Completed : false);
    const oppCompleted = isPlayer1 ? duelo.player2Completed : (isPlayer2 ? duelo.player1Completed : false);

    // 1. Si el duelo ya está completado por ambos o finalizado en la BD, mostrar directo el resultado final
    if (duelo.status === "finalizado" || (duelo.player1Completed && duelo.player2Completed)) {
      const p1Score = duelo.player1Puntos || 0;
      const p1Aciertos = duelo.player1Aciertos || 0;
      const p2Score = duelo.player2Puntos || 0;
      const p2Aciertos = duelo.player2Aciertos || 0;

      const myScore = isPlayer1 ? p1Score : p2Score;
      const oppScore = isPlayer1 ? p2Score : p1Score;
      const oppName = !isPlayer1 ? (duelo.player1Nombre || "Rival") : (duelo.player2Nombre || "Rival");

      let res: "victoria" | "derrota" | "empate" = "empate";
      let ptsBonus = 25;

      if (myScore > oppScore) {
        res = "victoria";
        ptsBonus = 50;
      } else if (oppScore > myScore) {
        res = "derrota";
        ptsBonus = -15;
      } else {
        res = "empate";
        ptsBonus = 25;
      }

      markDuelAsSeen(duelo.id);

      setPostMatchModal({
        isOpen: true,
        resultado: res,
        puntosCambio: ptsBonus,
        puntosTotalesAntes: Math.max(0, userStats.puntosTotales - ptsBonus),
        puntosTotalesDespues: userStats.puntosTotales,
        correctAnswersCount: isPlayer1 ? p1Aciertos : p2Aciertos,
        totalQuestions: 5,
        maxStreak: 0,
        isDuel1v1: true,
        duelDetails: {
          rivalNombre: oppName,
          p1Nombre: duelo.player1Nombre || "Jugador 1",
          p1Puntos: p1Score,
          p1Aciertos: p1Aciertos,
          p2Nombre: duelo.player2Nombre || "Jugador 2",
          p2Puntos: p2Score,
          p2Aciertos: p2Aciertos
        }
      });
      return;
    }

    // 2. Si este jugador YA completó su turno pero su rival aún no termina, mostrar modal de esperando rival sin reiniciar el juego
    if (myCompleted && !oppCompleted) {
      const p1Score = duelo.player1Puntos || 0;
      const p1Aciertos = duelo.player1Aciertos || 0;
      const p2Score = duelo.player2Puntos || 0;
      const p2Aciertos = duelo.player2Aciertos || 0;
      const oppName = !isPlayer1 ? (duelo.player1Nombre || "Rival") : (duelo.player2Nombre || "Esperando Rival...");

      setActiveDuelRoom(duelo);
      setDuelOutcomeModal({
        resultado: "esperando_rival",
        puntosGanados: 0,
        rivalNombre: oppName,
        p1Nombre: duelo.player1Nombre || "Jugador 1",
        p1Puntos: p1Score,
        p1Aciertos: p1Aciertos,
        p2Nombre: duelo.player2Nombre || "Esperando Rival...",
        p2Puntos: p2Score,
        p2Aciertos: p2Aciertos
      });
      return;
    }

    // 3. Si aún NO ha respondido, iniciar sesión de juego para este usuario
    setActiveDuelRoom(duelo);
    puntosTotalesAntesRef.current = userStats.puntosTotales;
    setPowerUps({
      nulidadCount: 2,
      apelacionCount: 1,
      prorrogaCount: 2,
      isApelacionActive: false,
      disabledOptionIndices: []
    });

    // Si entra como Rival (Jugador 2) por primera vez
    if (!isPlayer1 && !duelo.player2Id) {
      try {
        await supabase
          .from("trivia_duelos")
          .update({
            player2_id: user?.id || null,
            player2_nombre: userName,
            status: "en_curso"
          })
          .eq("id", duelo.id);
        fetchDuelosFromSupabase();
      } catch (err) {
        console.error("Error al unirse al duelo en Supabase:", err);
      }
    }

    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameOver(false);
    setTimeLeft(20);
    setInGame(true);
  };

  const handleDeleteDuelo = async (dueloId: string) => {
    if (!confirm(`¿Estás seguro de cancelar y eliminar la sala ${dueloId}?`)) return;

    try {
      const { error } = await supabase
        .from("trivia_duelos")
        .delete()
        .eq("id", dueloId);

      if (error) throw error;

      toast.success(`Sala ${dueloId} eliminada correctamente.`);
      fetchDuelosFromSupabase();
    } catch (err: any) {
      console.error("Error al eliminar sala:", err);
      toast.error("Error al cancelar la sala de duelo.");
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    const currentQ = questionsPool[currentIndex];
    if (!currentQ) return;

    const isCorrect = optionIndex === currentQ.respuesta_correcta_index;

    // Si falló pero tiene la Apelación activa:
    if (!isCorrect && powerUps.isApelacionActive && optionIndex >= 0) {
      setPowerUps(prev => ({
        ...prev,
        isApelacionActive: false,
        disabledOptionIndices: [...prev.disabledOptionIndices, optionIndex]
      }));
      toast.error("🛡️ ¡Apelación admitida! El fallo fue revocado. Elegí otra opción.");
      return;
    }

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (isCorrect) {
      // 📚 Cálculo escalonado de puntos según el año de la materia (1º a 5º año)
      const catObj = CATEGORIAS_TRIVIA.find(c => c.id === currentQ.id_categoria);
      const anio = catObj?.anio ?? 1;

      let basePoints = 15;
      if (anio === 1) basePoints = 15;
      else if (anio === 2) basePoints = 25;
      else if (anio === 3) basePoints = 35;
      else if (anio === 4) basePoints = 45;
      else if (anio === 5) basePoints = 60;
      else if (anio === 0) basePoints = 30;

      const diffMultiplier = currentQ.dificultad === "dificil" ? 1.5 : (currentQ.dificultad === "media" ? 1.25 : 1.0);
      const speedMultiplier = 0.8 + (anio > 0 ? anio * 0.2 : 0.6);
      const timeBonus = Math.floor(timeLeft * speedMultiplier);

      const pointsAdded = Math.round((basePoints * diffMultiplier) + timeBonus);
      setScore((prev) => prev + pointsAdded);
      setStreak((prev) => {
        const next = prev + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionsPool.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setPowerUps(prev => ({
        ...prev,
        disabledOptionIndices: [],
        isApelacionActive: false
      }));
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setInGame(false);
    setGameOver(true);

    const totalPreguntas = questionsPool.length || 5;
    const umbralAprobado = Math.ceil(totalPreguntas / 2);
    const esAprobado = correctAnswersCount >= umbralAprobado;

    // ⚔️ IMPORTANTE: La práctica individual es entrenamiento de estudio y NO varía el MMR competitivo.
    // Solo los Duelos 1vs1 otorgan y descuentan puntos de MMR / ELO.
    const isPracticeSolo = !activeDuelRoom;
    let puntosCambio = 0; // En práctica el delta de MMR es 0
    const oldPuntos = userStats.puntosTotales;
    const newPuntos = oldPuntos; // Inalterado en práctica

    let updatedStats = { ...userStats };
    updatedStats.totalJugadas += 1;
    updatedStats.totalCorrectas += correctAnswersCount;
    updatedStats.mejorRacha = Math.max(userStats.mejorRacha, maxStreak);
    // puntosTotales permanece intacto en práctica
    setUserStats(updatedStats);

    try {
      localStorage.setItem("dnd_trivia_user_stats", JSON.stringify(updatedStats));
    } catch {}

    if (isPracticeSolo) {
      setPostMatchModal({
        isOpen: true,
        resultado: esAprobado ? "victoria" : "derrota",
        puntosCambio: 0,
        puntosTotalesAntes: oldPuntos,
        puntosTotalesDespues: newPuntos,
        correctAnswersCount,
        totalQuestions: totalPreguntas,
        maxStreak
      });
    }

    if (user) {
      try {
        await supabase.from("trivia_partidas").insert({
          user_id: user.id,
          categoria_id: selectedCategoria,
          dificultad: "todas",
          puntos: 0, // En modo práctica el impacto en puntos de rango es estrictamente 0
          aciertos: correctAnswersCount,
          total_preguntas: totalPreguntas,
          racha_maxima: maxStreak
        });

        // En modo práctica solo actualizamos partidas jugadas y mejor racha sin tocar puntos_totales ni MMR
        if (isPracticeSolo) {
          await supabase.from("trivia_estadisticas_usuario").upsert({
            user_id: user.id,
            partidas_jugadas: updatedStats.totalJugadas,
            total_aciertos: updatedStats.totalCorrectas,
            mejor_racha: updatedStats.mejorRacha,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id" });
        }

        fetchRankingFromSupabase();
      } catch (err) {
        console.error("Error al registrar la partida en Supabase:", err);
      }
    }

    if (activeDuelRoom) {
      try {
        const isPlayer1 = (user?.id && activeDuelRoom.player1Id === user.id) || activeDuelRoom.player1Nombre === userName;
        
        const updateData = isPlayer1
          ? { player1_aciertos: correctAnswersCount, player1_puntos: score, player1_completed: true }
          : { player2_aciertos: correctAnswersCount, player2_puntos: score, player2_completed: true };

        // 1. Guardar primero el resultado de este jugador en Supabase
        await supabase.from("trivia_duelos").update(updateData).eq("id", activeDuelRoom.id);

        // 2. Traer el estado actualizado real de la sala desde Supabase
        const { data: currentRoomData } = await supabase
          .from("trivia_duelos")
          .select("*")
          .eq("id", activeDuelRoom.id)
          .maybeSingle();

        const room = currentRoomData || activeDuelRoom;
        
        const p1Score = isPlayer1 ? score : (room.player1_puntos || 0);
        const p1Aciertos = isPlayer1 ? correctAnswersCount : (room.player1_aciertos || 0);
        const p1Done = room.player1_completed || isPlayer1;

        const p2Score = !isPlayer1 ? score : (room.player2_puntos || 0);
        const p2Aciertos = !isPlayer1 ? correctAnswersCount : (room.player2_aciertos || 0);
        const p2Done = room.player2_completed || !isPlayer1;
        const p2Name = !isPlayer1 ? (room.player1_nombre || "Rival") : (room.player2_nombre || "Rival");

        if (p1Done && p2Done) {
          let rpcSuccess = false;
          try {
            const { error: rpcErr } = await supabase.rpc('fn_procesar_resultado_duelo', {
              p_duelo_id: activeDuelRoom.id,
              p_player1_puntos: p1Score,
              p_player1_aciertos: p1Aciertos,
              p_player2_puntos: p2Score,
              p_player2_aciertos: p2Aciertos
            });
            if (!rpcErr) rpcSuccess = true;
          } catch {
            await supabase.from("trivia_duelos").update({
              status: "finalizado",
              ganador_id: p1Score > p2Score ? "player1" : (p2Score > p1Score ? "player2" : "empate")
            }).eq("id", activeDuelRoom.id);
          }

          let res: "victoria" | "derrota" | "empate" = "empate";
          let ptsBonus = 25;

          const myScore = isPlayer1 ? p1Score : p2Score;
          const oppScore = isPlayer1 ? p2Score : p1Score;

          if (myScore > oppScore) {
            res = "victoria";
            ptsBonus = 50;
          } else if (oppScore > myScore) {
            res = "derrota";
            ptsBonus = -15;
          } else {
            res = "empate";
            ptsBonus = 25;
          }

          if (!rpcSuccess) {
            if (res === "victoria") updatedStats.victoriasDuelo += 1;
            else if (res === "derrota") updatedStats.derrotasDuelo += 1;
            else updatedStats.empatesDuelo += 1;
            updatedStats.puntosDuelista += ptsBonus;
          }

          markDuelAsSeen(activeDuelRoom.id);

          setPostMatchModal({
            isOpen: true,
            resultado: res,
            puntosCambio: ptsBonus,
            puntosTotalesAntes: oldPuntos,
            puntosTotalesDespues: Math.max(0, oldPuntos + ptsBonus),
            correctAnswersCount,
            totalQuestions: totalPreguntas,
            maxStreak,
            isDuel1v1: true,
            duelDetails: {
              rivalNombre: p2Name,
              p1Nombre: room.player1_nombre || "Jugador 1",
              p1Puntos: p1Score,
              p1Aciertos: p1Aciertos,
              p2Nombre: room.player2_nombre || "Jugador 2",
              p2Puntos: p2Score,
              p2Aciertos: p2Aciertos
            }
          });
        } else {
          setDuelOutcomeModal({
            resultado: "esperando_rival",
            puntosGanados: 0,
            rivalNombre: p2Name,
            p1Nombre: room.player1_nombre || "Jugador 1",
            p1Puntos: p1Score,
            p1Aciertos: p1Aciertos,
            p2Nombre: room.player2_nombre || "Esperando Rival...",
            p2Puntos: p2Score,
            p2Aciertos: p2Aciertos
          });
        }

        fetchDuelosFromSupabase();
      } catch (err) {
        console.error("Error al actualizar sala de duelo en Supabase:", err);
      }
    }

    setUserStats(updatedStats);
    if (user) {
      fetchRankingFromSupabase();
      fetchUserStatsFromSupabase();
    }
  };

  const getQuestionCountForCategory = (catId: string) => {
    if (catId === "todas") return allQuestionsCombined.length;
    const cat = CATEGORIAS_TRIVIA.find(c => c.id === catId);
    return getQuestionsForCategory(catId, cat ? cat.nombre : "", allQuestionsCombined).length;
  };

  // Renderizar Pregunta Activa (con componente mobile-first TriviaInGameView)
  if (inGame && questionsPool.length > 0 && !gameOver) {
    const currentQ = questionsPool[currentIndex];
    const isLastQuestion = currentIndex + 1 === questionsPool.length;

    return (
      <TriviaInGameView
        currentQuestion={currentQ}
        currentIndex={currentIndex}
        totalQuestions={questionsPool.length}
        timeLeft={timeLeft}
        maxTime={activeDuelRoom ? 20 : (questionsPool.length === 5 && timeLeft <= 10 ? 10 : 20)}
        streak={streak}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        onSelectOption={handleAnswer}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={isLastQuestion}
        solicitarExplicacionIA={solicitarExplicacionIA}
        loadingExplicacion={loadingExplicacion}
        explicacionIA={explicacionIA}
        powerUps={powerUps}
        onUseNulidad={handleUseNulidad}
        onUseApelacion={handleUseApelacion}
        onUseProrroga={handleUseProrroga}
        isDuelMode={!!activeDuelRoom}
      />
    );
  }

  // PANTALLA PRINCIPAL
  return (
    <div className="min-h-screen bg-[#050B14] text-white py-6 md:py-10 px-3 sm:px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 relative z-10">
        
        {/* DASHBOARD PRINCIPAL GAME HUB (PLAYER STATUS, NAVEGACIÓN Y CARDS 3D) */}
        <TriviaMobileDashboard
          userName={userName}
          userStats={userStats}
          rangoActual={rangoActual}
          proximoRango={proximoRango}
          progresoPorcentaje={progresoPorcentaje}
          puntosFaltantes={puntosFaltantes}
          seasonInfo={seasonInfo}
          onStartRanked={() => {
            const openRoom = duelosList.find(d => d.status === "esperando_rival" && d.esPublico && d.player1Id !== user?.id);
            if (openRoom) {
              toast.success(`⚡ ¡Oponente encontrado! Ingresando a la sala ${openRoom.id}...`);
              handleJoinDuelo(openRoom);
            } else {
              setActiveTab("duelos");
              handleCreateDuelo(true);
            }
          }}
          onOpenPracticeModal={() => setIsPracticeModalOpen(true)}
          onOpenParcialFlash={() => setIsParcialFlashModalOpen(true)}
          onOpenRangosModal={() => setShowRangosModal(true)}
          onOpenGuideModal={() => setShowGuideModal(true)}
          onOpenMyProfile={() => {
            handleInspectUser(user?.id, userName, profile?.avatar_url, {
              puntos: userStats.puntosTotales,
              racha: userStats.mejorRacha,
              partidasJugadas: userStats.totalJugadas,
              victoriasDuelo: userStats.victoriasDuelo,
              derrotasDuelo: userStats.derrotasDuelo
            });
          }}
          onSelectTab={(tab) => setActiveTab(tab)}
          activeTab={activeTab}
        />

        {/* MODAL LIMPIO DE CONFIGURACIÓN DE PRÁCTICA */}
        <PracticeSetupModal
          isOpen={isPracticeModalOpen}
          onClose={() => setIsPracticeModalOpen(false)}
          selectedYearFilter={selectedYearFilter}
          onSelectYear={(yr) => setSelectedYearFilter(yr)}
          selectedCategoria={selectedCategoria}
          onSelectCategoria={(cat) => setSelectedCategoria(cat)}
          questionsCount={questionsCount}
          onSelectQuestionsCount={(cnt) => setQuestionsCount(cnt)}
          onStartGame={handleStartGame}
        />

        {/* PESTAÑA: MI HISTORIAL Y CONSEJOS */}
        {activeTab === "historial" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              
              {/* IZQUIERDA: TU ACTIVIDAD RECIENTE (lg:col-span-8) */}
              <div className="lg:col-span-8 bg-white dark:bg-[#0D1527]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl text-slate-900 dark:text-white">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="font-black text-xs md:text-sm text-slate-900 dark:text-white uppercase tracking-wider">TU ACTIVIDAD RECIENTE</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Últimas Evaluaciones</span>
                </div>

                {/* VISTA TABLA DESKTOP */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase border-b border-slate-200 dark:border-white/10">
                        <th className="pb-3 px-2">Fecha</th>
                        <th className="pb-3 px-2">Tipo</th>
                        <th className="pb-3 px-2 text-center">Preguntas</th>
                        <th className="pb-3 px-2 text-center">Aciertos</th>
                        <th className="pb-3 px-2 text-right">Resultado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                      {recentActivityList.length > 0 ? (
                        recentActivityList.slice(0, 5).map((act, idx) => (
                          <tr key={act.id || idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                              {act.created_at ? new Date(act.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Hoy"}
                              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">{act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                            </td>
                            <td className="py-3 px-2 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                              <span>{act.categoria_id === "flash" ? "Modo Flash" : "Evaluación por Materia"}</span>
                            </td>
                            <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300 font-mono">
                              {act.total_preguntas || 10}
                            </td>
                            <td className="py-3 px-2 text-center font-black text-slate-900 dark:text-white font-mono text-sm">
                              {act.aciertos ?? 0} / {act.total_preguntas || 10}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                                {(act.aciertos || 0) >= Math.ceil((act.total_preguntas || 10) / 2) ? "Aprobado" : "Regular"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                            Aún no tenés evaluaciones registradas. ¡Iniciá tu primer desafío!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* VISTA TARJETAS MOBILE */}
                <div className="sm:hidden space-y-2.5">
                  {recentActivityList.length > 0 ? (
                    recentActivityList.slice(0, 3).map((act, idx) => (
                      <div key={act.id || idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                            {act.created_at ? new Date(act.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Hoy"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase">
                            {(act.aciertos || 0) >= Math.ceil((act.total_preguntas || 10) / 2) ? "Aprobado" : "Regular"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                            <span>{act.categoria_id === "flash" ? "Modo Flash" : "Evaluación por Materia"}</span>
                          </div>
                          <span className="font-mono font-black text-slate-900 dark:text-white text-sm">{act.aciertos ?? 0}/{act.total_preguntas || 10} aciertos</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-slate-500 dark:text-slate-400 text-xs">
                      Aún no tenés evaluaciones registradas. ¡Iniciá tu primer desafío!
                    </div>
                  )}
                </div>
              </div>

              {/* DERECHA: CONSEJOS (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-[#0D1527]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl flex flex-col justify-between text-slate-900 dark:text-white">
                <div className="space-y-3">
                  <h3 className="font-black text-xs md:text-sm text-slate-900 dark:text-white uppercase tracking-wider">CONSEJOS</h3>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    </div>
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white pt-1">Leé las preguntas con atención</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Tomate tu tiempo para entender bien cada consigna antes de responder. Podés consultar al Tutor IA al finalizar cada pregunta.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PESTAÑA 2: DUELOS 1VS1 (SALAS DE DESAFÍO Y HISTORIAL) */}
        {activeTab === "duelos" && (
          <div className="bg-white dark:bg-[#0D1527]/90 border border-slate-200 dark:border-white/15 rounded-3xl p-4 sm:p-6 space-y-6 shadow-xl text-slate-900 dark:text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  <span>Salas de Duelo 1vs1 Académico</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Desafiá a colegas en salas directas con selector propio de materias.</p>
              </div>
            </div>

            {/* PASO 1: SELECTOR INDEPENDIENTE DE MATERIA PARA EL DUELO (DESPLEGABLE + FILTRO DE AÑO) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 dark:bg-slate-950/80 bg-slate-50 border border-white/10 dark:border-white/10 border-slate-200 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  Elegí la materia para desafiar en el Duelo:
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {dueloSelectedCategoria === "todas" 
                    ? "Toda la Carrera (Mix general)" 
                    : (CATEGORIAS_TRIVIA.find(c => c.id === dueloSelectedCategoria)?.nombre || "Materia Seleccionada")}
                </span>
              </div>

              {/* Filtro Rápido de Años */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 text-slate-600 block">
                  Filtrar por año de la carrera:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { anio: 0, label: "Toda la Carrera" },
                    { anio: 1, label: "1º Año" },
                    { anio: 2, label: "2º Año" },
                    { anio: 3, label: "3º Año" },
                    { anio: 4, label: "4º Año" },
                    { anio: 5, label: "5º Año" },
                  ].map((item) => (
                    <button
                      key={item.anio}
                      onClick={() => {
                        setDueloSelectedYearFilter(item.anio);
                        if (item.anio === 0) setDueloSelectedCategoria("todas");
                        else {
                          const firstOfThatYear = CATEGORIAS_TRIVIA.find(c => c.anio === item.anio);
                          if (firstOfThatYear) setDueloSelectedCategoria(firstOfThatYear.id);
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 border",
                        dueloSelectedYearFilter === item.anio
                          ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/30"
                          : "bg-white/5 dark:bg-white/5 bg-slate-200 text-slate-300 dark:text-slate-300 text-slate-700 border-white/10 dark:border-white/10 border-slate-300 hover:bg-white/10"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menú Desplegable de Materia */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 text-slate-600 block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Desplegable de Materias disponibles:</span>
                </label>
                <select
                  value={dueloSelectedCategoria}
                  onChange={(e) => setDueloSelectedCategoria(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-900 bg-white border-2 border-red-500/60 focus:border-red-500 text-white dark:text-white text-slate-900 text-xs sm:text-sm font-black focus:outline-none shadow-xl cursor-pointer transition-all"
                >
                  {filteredDueloCategorias.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white py-2">
                      {cat.nombre} {cat.id === "todas" ? "(Toda la Carrera)" : `(${getQuestionCountForCategory(cat.id)} preguntas)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarjeta de Materia Seleccionada Actualmente */}
              {(() => {
                const currentCat = CATEGORIAS_TRIVIA.find(c => c.id === dueloSelectedCategoria) || CATEGORIAS_TRIVIA[0];
                const Icon = ICON_MAP[currentCat.icono] || BookOpen;
                const count = getQuestionCountForCategory(currentCat.id);

                return (
                  <div className="p-3.5 rounded-2xl bg-red-950/40 dark:bg-red-950/40 bg-red-50 border border-red-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-amber-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white dark:text-white text-slate-900 block">{currentCat.nombre}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold">
                            {currentCat.anio === 0 ? "General" : `${currentCat.anio}º Año`}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-600 block">
                          Banco de {count} preguntas exclusivas listas para el duelo
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] font-mono font-black text-amber-400 uppercase block">5 Preguntas 1v1</span>
                      <span className="text-[9px] text-slate-400">20s por turno</span>
                    </div>
                  </div>
                );
              })()}

              {/* Botones de Acción para Crear la Sala con la Materia Seleccionada */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/10 dark:border-white/10 border-slate-200">
                <button
                  onClick={() => handleCreateDuelo(true)}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Sala Pública ({CATEGORIAS_TRIVIA.find(c => c.id === dueloSelectedCategoria)?.nombre || "Toda la Carrera"})</span>
                </button>
                <button
                  onClick={() => handleCreateDuelo(false)}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 bg-slate-200 hover:bg-slate-300 text-white dark:text-white text-slate-800 font-black text-xs uppercase tracking-wider border border-white/10 dark:border-white/10 border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Crear Sala Privada (Con Código)</span>
                </button>
              </div>
            </div>

            {/* SUB-PESTAÑAS DE DUELOS: SALAS DISPONIBLES VS HISTORIAL DE DUELOS */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 dark:bg-slate-950 bg-slate-200 rounded-2xl border border-white/10 dark:border-white/10 border-slate-300">
              <button
                onClick={() => setDuelosSubTab("disponibles")}
                className={cn(
                  "w-1/2 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  duelosSubTab === "disponibles"
                    ? "bg-[#0A1C3D] text-white border border-red-500/40 shadow-lg"
                    : "text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white text-slate-600"
                )}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Salas Activas en Espera</span>
              </button>
              <button
                onClick={() => setDuelosSubTab("historial")}
                className={cn(
                  "w-1/2 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  duelosSubTab === "historial"
                    ? "bg-[#0A1C3D] text-white border border-red-500/40 shadow-lg"
                    : "text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white text-slate-600"
                )}
              >
                <BookOpenCheck className="w-4 h-4 text-blue-400" />
                <span>Historial de Duelos Jugados</span>
              </button>
            </div>

            {/* INGRESAR POR CÓDIGO */}
            <div className="p-4 rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] bg-slate-50 border border-white/10 dark:border-white/10 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700">¿Tenés un código de duelo de un colega?</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Ej: DND-829"
                  value={inputCodigoDuelo}
                  onChange={(e) => setInputCodigoDuelo(e.target.value.toUpperCase())}
                  className="p-2.5 rounded-xl bg-slate-950 dark:bg-slate-950 bg-white border border-white/15 dark:border-white/15 border-slate-300 text-white dark:text-white text-slate-900 font-mono font-bold text-xs uppercase focus:outline-none focus:border-red-500 w-full sm:w-40"
                />
                <button
                  onClick={() => {
                    const match = duelosList.find(d => d.id === inputCodigoDuelo);
                    if (match) {
                      handleJoinDuelo(match);
                    } else {
                      toast.error("Código de duelo no encontrado o sala expirada.");
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1C3D] hover:bg-[#0F2A5C] text-white font-black text-xs uppercase cursor-pointer shrink-0 shadow-md"
                >
                  Unirme
                </button>
              </div>
            </div>

            {/* VISTA 1: SALAS ACTIVAS DISPONIBLES (LOS DUELOS FINALIZADOS O CON 2 JUGADORES DESAPARECEN DE AQUÍ) */}
            {duelosSubTab === "disponibles" && (() => {
              const availableRooms = duelosList.filter(d => {
                const isFinished = d.status === "finalizado" || (d.player1Completed && d.player2Completed);
                if (isFinished) return false;

                const isPlayer1 = (user?.id && d.player1Id === user.id) || d.player1Nombre === userName;
                const isPlayer2 = (user?.id && d.player2Id === user.id) || (d.player2Nombre && d.player2Nombre === userName);
                const isParticipant = isPlayer1 || isPlayer2;

                // Si ya tiene 2 personas y no soy participante, no está disponible para ingresar
                if (d.player2Id && d.player2Nombre && !isParticipant) return false;

                // Si es privada y no soy participante, no se muestra
                if (!d.esPublico && !isParticipant) return false;

                return true;
              });

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-400 text-slate-600 tracking-wider">
                      Salas de Duelo Disponibles ({availableRooms.length}):
                    </h4>
                    <button 
                      onClick={fetchDuelosFromSupabase}
                      className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <RefreshCw className={cn("w-3 h-3", loadingDuelos && "animate-spin")} />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {availableRooms.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] bg-slate-50 border border-white/10 dark:border-white/10 border-slate-200 text-center space-y-2">
                      <Swords className="w-8 h-8 mx-auto text-red-500 opacity-60" />
                      <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600">No hay salas de duelo públicas en espera actualmente.</p>
                      <p className="text-[11px] text-slate-500 font-bold">¡Elegí una materia arriba y hacé click en "Crear Sala Pública" para desafiar a colegas en tiempo real!</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {availableRooms.map((duelo) => {
                        const isPlayer1 = (user?.id && duelo.player1Id === user.id) || duelo.player1Nombre === userName;
                        const isPlayer2 = (user?.id && duelo.player2Id === user.id) || (duelo.player2Nombre && duelo.player2Nombre === userName);
                        const isParticipant = isPlayer1 || isPlayer2;
                        const myCompleted = isPlayer1 ? duelo.player1Completed : (isPlayer2 ? duelo.player2Completed : false);
                        const oppName = isPlayer1 ? (duelo.player2Nombre || "Esperando Rival...") : duelo.player1Nombre;

                        return (
                          <div
                            key={duelo.id}
                            className="p-4 rounded-2xl bg-slate-950 dark:bg-slate-950 bg-white border border-white/10 dark:border-white/10 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                                  {duelo.id}
                                </span>
                                <span className="text-xs font-black text-white dark:text-white text-slate-900">{duelo.materiaNombre}</span>

                                {isParticipant && (
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border font-mono",
                                    myCompleted ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                                  )}>
                                    {myCompleted ? `⏳ Esperando a ${oppName}` : "🔥 ¡ES TU TURNO DE RESPONDER!"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-600">
                                Creado por: <span className="text-blue-300 dark:text-blue-300 text-blue-600 font-bold">{duelo.player1Nombre}</span>
                                {duelo.player2Nombre && (
                                  <> vs <span className="text-red-300 dark:text-red-300 text-red-600 font-bold">{duelo.player2Nombre}</span></>
                                )}
                              </p>
                            </div>

                            {isParticipant ? (
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                  onClick={() => handleJoinDuelo(duelo)}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer transition-all shadow-lg flex-1 sm:flex-initial text-center",
                                    myCompleted 
                                      ? "bg-blue-600 hover:bg-blue-500 text-white" 
                                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white animate-bounce"
                                  )}
                                >
                                  {myCompleted ? "Ver Estado / Marcador" : "¡Responder Ahora!"}
                                </button>
                                <button
                                  onClick={() => handleDeleteDuelo(duelo.id)}
                                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                  title="Cancelar y Eliminar Sala"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Eliminar</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                  onClick={() => handleJoinDuelo(duelo)}
                                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase cursor-pointer shadow-lg w-full sm:w-auto text-center"
                                >
                                  Aceptar Duelo 1v1
                                </button>
                                {profile?.role === "admin" && (
                                  <button
                                    onClick={() => handleDeleteDuelo(duelo.id)}
                                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                                    title="Eliminar Sala (Admin)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* VISTA 2: HISTORIAL DE DUELOS JUGADOS (COMPLETADOS) */}
            {duelosSubTab === "historial" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Historial de Duelos Finalizados:</h4>
                  <button 
                    onClick={fetchDuelosFromSupabase}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <RefreshCw className={cn("w-3 h-3", loadingDuelos && "animate-spin")} />
                    <span>Actualizar</span>
                  </button>
                </div>

                {duelosList.filter(d => d.status === "finalizado" || (d.player1Completed && d.player2Completed)).length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                    <Trophy className="w-8 h-8 mx-auto text-amber-400 opacity-60" />
                    <p className="text-xs text-slate-400">Aún no registrás duelos finalizados.</p>
                    <p className="text-[11px] text-slate-500 font-bold">Completá desafíos en 1v1 para ver tus marcadores y revisiones de preguntas aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {duelosList
                      .filter(d => d.status === "finalizado" || (d.player1Completed && d.player2Completed))
                      .map((duelo) => {
                        const isPlayer1 = duelo.player1Id === user?.id || duelo.player1Nombre === userName;
                        const p1Puntos = duelo.player1Puntos || 0;
                        const p2Puntos = duelo.player2Puntos || 0;

                        const myPuntos = isPlayer1 ? p1Puntos : p2Puntos;
                        const oppPuntos = isPlayer1 ? p2Puntos : p1Puntos;
                        const opponentName = !isPlayer1 ? duelo.player1Nombre : (duelo.player2Nombre || "Rival");

                        let badgeText = "🤝 Empate";
                        let badgeStyle = "bg-amber-500/20 text-amber-300 border-amber-500/30";

                        if (myPuntos > oppPuntos) {
                          badgeText = "🏆 Victoria";
                          badgeStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                        } else if (oppPuntos > myPuntos) {
                          badgeText = "💔 Derrota";
                          badgeStyle = "bg-red-500/20 text-red-300 border-red-500/30";
                        }

                        return (
                          <div
                            key={duelo.id}
                            className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-slate-300 font-mono border border-white/10">
                                  {duelo.id}
                                </span>
                                <span className="text-xs font-black text-white">{duelo.materiaNombre}</span>
                                <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase border", badgeStyle)}>
                                  {badgeText}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Enfrentamiento: <span className="text-blue-300 font-bold">{duelo.player1Nombre}</span> ({p1Puntos} PTS) vs <span className="text-red-300 font-bold">{opponentName}</span> ({p2Puntos} PTS)
                              </p>
                            </div>

                            <button
                              onClick={() => handleJoinDuelo(duelo)}
                              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                              <span>Ver Marcador y Respuestas</span>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: RANKING GENERAL, DUELISTAS Y MEDALLERO OLÍMPICO */}
        {activeTab === "ranking" && (
          <div className="space-y-6">
            
            {/* BREADCRUMB Y HEADER DE RANKING */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#0D1527]/90 border border-slate-200 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden text-slate-900 dark:text-white">
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 font-mono">
                  <span>TRIVIA</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>RANKING</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600/20 to-amber-500/10 border border-red-500/40 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0 shadow-lg">
                    <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ranking de la Facultad</h2>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Posiciones oficiales calculadas en tiempo real con la base de datos de estudiantes.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end relative z-10 border-t md:border-t-0 border-slate-200 dark:border-white/10 pt-3 md:pt-0">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 text-right min-w-[140px]">
                  <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 block">Tu posición actual</span>
                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-mono leading-tight">
                    {(() => {
                      const myUserId = user?.id;
                      const myName = userName?.trim().toLowerCase();
                      const myEmail = profile?.email?.toLowerCase();
                      
                      const found = leaderboardList.find(e => 
                        (myUserId && e.id === myUserId) ||
                        (myName && e.nombre && e.nombre.trim().toLowerCase() === myName) ||
                        (myEmail && e.nombre && e.nombre.toLowerCase().includes(myEmail.split("@")[0]))
                      );
                      
                      if (found) return `#${found.posicion}`;
                      if (userStats.puntosTotales > 0 && leaderboardList.length > 0) {
                        const betterPlayers = leaderboardList.filter(e => e.puntos > userStats.puntosTotales);
                        return `#${betterPlayers.length + 1}`;
                      }
                      return "--";
                    })()}
                  </span>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-mono font-bold block">{userStats.puntosTotales} pts</span>
                </div>

                <button
                  onClick={fetchRankingFromSupabase}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.04] dark:hover:bg-white/10 dark:border-white/15 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={cn("w-4 h-4 text-blue-500 dark:text-blue-400", loadingRanking && "animate-spin")} />
                  <span className="hidden sm:inline">Actualizar</span>
                </button>
              </div>
            </div>

            {/* BANNER DE INICIO OFICIAL DE TEMPORADA COMPETITIVA CON CONTADOR EN VIVO (JUEVES 13 DE AGOSTO 19:00 HS) */}
            <div className="p-4 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-[#2D0B12] dark:via-[#1A0B12] dark:to-[#0D1527] border border-slate-200 dark:border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md dark:shadow-xl text-slate-900 dark:text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 dark:bg-red-600/20 border border-red-500/30 dark:border-red-500/40 flex items-center justify-center text-red-500 dark:text-red-400 font-bold shrink-0 shadow-sm">
                  <Calendar className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                    <span>{seasonInfo.bannerTitle}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                      {seasonInfo.badgeText}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                    <span className="text-amber-600 dark:text-amber-400 font-mono font-bold mr-2">⏱️ {seasonInfo.countdownText}</span>
                    Resets semanales en Duelos 1v1 y mensuales en Ranking General con entrega de Medallas de Podio.
                  </p>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => handleInspectUser(user.id, userName, profile?.avatar_url)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Award className="w-4 h-4 fill-slate-950" />
                  <span>Mi Medallero</span>
                </button>
              )}
            </div>

            {/* TARJETAS HIGHLIGHT DE ESTADÍSTICAS EN TIEMPO REAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* TARJETA 1: MEJOR PUNTAJE (RED GLOW) */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#2D0B12] dark:via-[#1A0B12] dark:to-[#0D1527] border border-slate-200 dark:border-red-500/40 rounded-3xl p-5 shadow-lg dark:shadow-2xl relative overflow-hidden space-y-3 text-slate-900 dark:text-white">
                <div className="absolute right-2 -bottom-2 opacity-5 dark:opacity-10 text-red-500 pointer-events-none">
                  <Trophy className="w-28 h-28" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block">MEJOR PUNTAJE GENERAL</span>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white truncate">
                    {leaderboardList.length > 0 ? leaderboardList[0].nombre : userName}
                  </h4>
                  <span className="text-2xl md:text-3xl font-black text-red-600 dark:text-red-400 font-mono leading-none pt-1 block">
                    {leaderboardList.length > 0 ? leaderboardList[0].puntos : userStats.puntosTotales} pts
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-1 font-medium">
                    {leaderboardList.length > 0 ? (leaderboardList[0].rangoNombre || calcularRango(leaderboardList[0].puntos).nombre) : rangoActual.nombre}
                  </span>
                </div>
              </div>

              {/* TARJETA 2: RACHA MÁS ALTA (GOLD GLOW) */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#1A160B] dark:via-[#0D1527] dark:to-[#0D1527] border border-slate-200 dark:border-amber-500/40 rounded-3xl p-5 shadow-lg dark:shadow-2xl relative overflow-hidden space-y-3 text-slate-900 dark:text-white">
                <div className="absolute right-2 -bottom-2 opacity-5 dark:opacity-10 text-amber-500 pointer-events-none">
                  <Flame className="w-28 h-28" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block">RACHA MÁS ALTA</span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono leading-none">
                      x{Math.max(...leaderboardList.map(e => e.racha || 0), userStats.mejorRacha || 0)}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">aciertos consecutivos</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-1 font-medium">Récord registrado</span>
                </div>
              </div>

              {/* TARJETA 3: ESTUDIANTES CLASIFICADOS (BLUE GLOW) */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-[#0A1C3D]/60 dark:via-[#0D1527] dark:to-[#0D1527] border border-slate-200 dark:border-blue-500/40 rounded-3xl p-5 shadow-lg dark:shadow-2xl relative overflow-hidden space-y-3 text-slate-900 dark:text-white">
                <div className="absolute right-2 -bottom-2 opacity-5 dark:opacity-10 text-blue-500 pointer-events-none">
                  <Users className="w-28 h-28" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block">ESTUDIANTES CLASIFICADOS</span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                      {Math.max(leaderboardList.length, 1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">estudiantes activos</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-1 font-medium">Ranking oficial actual</span>
                </div>
              </div>

            </div>

            {/* BOTONES DE SUB-PESTAÑA (OFICIAL Y MEDALLERO) + IR A MI POSICIÓN */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 rounded-2xl w-full sm:w-auto">
                <button
                  onClick={() => setRankingSubTab("oficial")}
                  className={cn(
                    "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-2",
                    rankingSubTab === "oficial"
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Ranking Oficial de la Facultad</span>
                </button>
                <button
                  onClick={() => setRankingSubTab("medallas")}
                  className={cn(
                    "flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-2",
                    rankingSubTab === "medallas"
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Medallero de Temporadas</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const myEl = document.getElementById("my-user-rank-row");
                  if (myEl) myEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-white/[0.04] dark:hover:bg-white/10 dark:border-white/15 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
              >
                <span>🎯 Mi Posición</span>
              </button>
            </div>

            {/* CONTENIDO 1: RANKING OFICIAL UNIFICADO */}
            {rankingSubTab === "oficial" && (
              <div className="space-y-6">
                
                {/* EXHIBICIÓN VISUAL DEL PODIO TOP 3 REAL (SI HAY AL MENOS 1 JUGADOR) */}
                {leaderboardList.length > 0 && (
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-gradient-to-b dark:from-[#0D1527] dark:to-[#050B14] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl relative overflow-hidden pt-8 text-slate-900 dark:text-white">
                    <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-lg mx-auto min-h-[220px]">
                      
                      {/* PUESTO 2 (PLATA) */}
                      {leaderboardList[1] && (
                        <div 
                          onClick={() => handleInspectUser(leaderboardList[1].id, leaderboardList[1].nombre, leaderboardList[1].avatarUrl, { puntos: leaderboardList[1].puntos, racha: leaderboardList[1].racha, aciertosPorcentaje: leaderboardList[1].aciertosPorcentaje })}
                          className="flex flex-col items-center flex-1 space-y-2 cursor-pointer group"
                        >
                          <div className="relative">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-300 p-0.5 shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                              <div className="w-full h-full rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base uppercase">
                                {leaderboardList[1].nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                              </div>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                              2
                            </span>
                          </div>
                          <div className="text-center">
                            <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[100px] group-hover:text-red-600 dark:group-hover:text-slate-200">{leaderboardList[1].nombre}</h5>
                            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px] mx-auto">
                              <img 
                                src={calcularRango(leaderboardList[1].puntos).imagenUrl} 
                                alt="Rango" 
                                className="w-3.5 h-3.5 object-contain shrink-0" 
                              />
                              <span className="truncate">{leaderboardList[1].rangoNombre || calcularRango(leaderboardList[1].puntos).nombre}</span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 block pt-0.5">{leaderboardList[1].puntos} pts</span>
                          </div>
                          <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800/80 dark:to-slate-700/60 rounded-t-2xl border-t-2 border-slate-400 flex items-center justify-center font-mono font-black text-slate-600 dark:text-slate-400 text-lg shadow-sm">
                            #2
                          </div>
                        </div>
                      )}

                      {/* PUESTO 1 (ORO - MÁS ALTO) */}
                      {leaderboardList[0] && (
                        <div 
                          onClick={() => handleInspectUser(leaderboardList[0].id, leaderboardList[0].nombre, leaderboardList[0].avatarUrl, { puntos: leaderboardList[0].puntos, racha: leaderboardList[0].racha, aciertosPorcentaje: leaderboardList[0].aciertosPorcentaje })}
                          className="flex flex-col items-center flex-1 space-y-2 relative -top-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 dark:border-amber-400 p-0.5 shadow-xl shadow-amber-500/20 overflow-hidden ring-4 ring-amber-500/20 group-hover:scale-105 transition-transform">
                              <div className="w-full h-full rounded-full bg-amber-100 dark:bg-amber-600/30 flex items-center justify-center font-black text-amber-800 dark:text-amber-300 text-base sm:text-xl uppercase">
                                {leaderboardList[0].nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                              </div>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg">
                              1
                            </span>
                          </div>
                          <div className="text-center">
                            <h5 className="font-black text-xs sm:text-base text-slate-900 dark:text-white truncate max-w-[120px] group-hover:text-amber-600 dark:group-hover:text-amber-300">{leaderboardList[0].nombre}</h5>
                            <div className="flex items-center justify-center gap-1 text-[10px] text-amber-700 dark:text-amber-300/80 truncate max-w-[130px] mx-auto">
                              <img 
                                src={calcularRango(leaderboardList[0].puntos).imagenUrl} 
                                alt="Rango" 
                                className="w-4 h-4 object-contain shrink-0" 
                              />
                              <span className="truncate">{leaderboardList[0].rangoNombre || calcularRango(leaderboardList[0].puntos).nombre}</span>
                            </div>
                            <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 block pt-0.5">{leaderboardList[0].puntos} pts</span>
                          </div>
                          <div className="w-full h-32 bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 dark:from-amber-950/80 dark:via-amber-600/40 dark:to-amber-500/50 rounded-t-2xl border-t-2 border-amber-500 dark:border-amber-400 flex items-center justify-center font-mono font-black text-amber-800 dark:text-amber-300 text-2xl shadow-lg shadow-amber-500/20">
                            #1
                          </div>
                        </div>
                      )}

                      {/* PUESTO 3 (BRONCE) */}
                      {leaderboardList[2] && (
                        <div 
                          onClick={() => handleInspectUser(leaderboardList[2].id, leaderboardList[2].nombre, leaderboardList[2].avatarUrl, { puntos: leaderboardList[2].puntos, racha: leaderboardList[2].racha, aciertosPorcentaje: leaderboardList[2].aciertosPorcentaje })}
                          className="flex flex-col items-center flex-1 space-y-2 cursor-pointer group"
                        >
                          <div className="relative">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-600 p-0.5 shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                              <div className="w-full h-full rounded-full bg-amber-200 dark:bg-amber-900/50 flex items-center justify-center font-black text-amber-900 dark:text-amber-400 text-sm sm:text-base uppercase">
                                {leaderboardList[2].nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                              </div>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                              3
                            </span>
                          </div>
                          <div className="text-center">
                            <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[100px] group-hover:text-amber-700 dark:group-hover:text-amber-400">{leaderboardList[2].nombre}</h5>
                            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px] mx-auto">
                              <img 
                                src={calcularRango(leaderboardList[2].puntos).imagenUrl} 
                                alt="Rango" 
                                className="w-3.5 h-3.5 object-contain shrink-0" 
                              />
                              <span className="truncate">{leaderboardList[2].rangoNombre || calcularRango(leaderboardList[2].puntos).nombre}</span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-500 block pt-0.5">{leaderboardList[2].puntos} pts</span>
                          </div>
                          <div className="w-full h-20 bg-gradient-to-t from-amber-100 to-amber-50 dark:from-amber-950/80 dark:to-amber-900/60 rounded-t-2xl border-t-2 border-amber-600 flex items-center justify-center font-mono font-black text-amber-800 dark:text-amber-600 text-lg shadow-sm">
                            #3
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* TABLA REAL DE CLASIFICACIÓN GENERAL */}
                <div className="bg-white dark:bg-[#0D1527]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl text-slate-900 dark:text-white">
                  
                  {leaderboardList.length > 0 ? (
                    <>
                      {/* VISTA TABLA DESKTOP */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase border-b border-slate-200 dark:border-white/10">
                              <th className="pb-3 px-3">POSICIÓN</th>
                              <th className="pb-3 px-3">USUARIO Y RANGO JURÍDICO</th>
                              <th className="pb-3 px-3 text-right">PUNTOS DE RANGO</th>
                              <th className="pb-3 px-3 text-center">RACHA</th>
                              <th className="pb-3 px-3 text-right">PRECISIÓN</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                            {leaderboardList.map((entry) => {
                              const isMe = entry.id === user?.id || (userName && entry.nombre?.trim().toLowerCase() === userName.trim().toLowerCase());
                              const userRango = calcularRango(entry.puntos);
                              const rangoNombre = entry.rangoNombre || userRango.nombre;

                              return (
                                <tr 
                                  key={entry.id} 
                                  id={isMe ? "my-user-rank-row" : undefined}
                                  onClick={() => handleInspectUser(entry.id, entry.nombre, entry.avatarUrl, { puntos: entry.puntos, racha: entry.racha, aciertosPorcentaje: entry.aciertosPorcentaje })}
                                  className={cn(
                                    "hover:bg-slate-100/80 dark:hover:bg-white/[0.04] transition-colors cursor-pointer",
                                    entry.posicion === 1 && "bg-amber-500/[0.06] border-l-2 border-l-amber-500",
                                    entry.posicion === 2 && "bg-slate-300/[0.1] border-l-2 border-l-slate-400",
                                    entry.posicion === 3 && "bg-amber-700/[0.06] border-l-2 border-l-amber-600",
                                    isMe && "bg-red-500/10 border-l-2 border-l-red-500"
                                  )}
                                >
                                  <td className="py-4 px-3">
                                    <span className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs border shadow-sm",
                                      entry.posicion === 1 ? "bg-amber-500 text-slate-950 border-amber-300" :
                                      entry.posicion === 2 ? "bg-slate-300 text-slate-950 border-white" :
                                      entry.posicion === 3 ? "bg-amber-700 text-white border-amber-500" :
                                      "bg-slate-200 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10"
                                    )}>
                                      #{entry.posicion}
                                    </span>
                                  </td>
                                  <td className="py-4 px-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase shrink-0">
                                        {entry.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-slate-900 dark:text-white text-sm hover:underline">{entry.nombre}</span>
                                          {isMe && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-red-700 dark:text-red-200 border border-red-500/40 text-[9px] font-black uppercase font-mono">
                                              TÚ
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1.5 pt-0.5">
                                          <img 
                                            src={userRango.imagenUrl} 
                                            alt={userRango.nombre} 
                                            className="w-4 h-4 object-contain shrink-0" 
                                          />
                                          <span className="text-[11px] text-red-600 dark:text-red-300/90 font-medium block truncate">
                                            Nivel {userRango.nivel} • {rangoNombre}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-3 text-right font-black text-red-600 dark:text-red-400 font-mono text-sm">
                                    {entry.puntos} PTS
                                  </td>
                                  <td className="py-4 px-3 text-center">
                                    <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                                      x{entry.racha || 0} <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                                    </span>
                                  </td>
                                  <td className="py-4 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                    {entry.aciertosPorcentaje || 0}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* VISTA TARJETAS MOBILE DE JUGADORES REALES */}
                      <div className="sm:hidden space-y-2.5">
                        {leaderboardList.map((entry) => {
                          const isMe = entry.id === user?.id || (userName && entry.nombre?.trim().toLowerCase() === userName.trim().toLowerCase());
                          const userRango = calcularRango(entry.puntos);
                          const rangoNombre = entry.rangoNombre || userRango.nombre;

                          return (
                            <div 
                              key={entry.id} 
                              id={isMe ? "my-user-rank-row" : undefined}
                              onClick={() => handleInspectUser(entry.id, entry.nombre, entry.avatarUrl, { puntos: entry.puntos, racha: entry.racha, aciertosPorcentaje: entry.aciertosPorcentaje })}
                              className={cn(
                                "p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer",
                                isMe ? "bg-red-500/10 border-red-500" : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10"
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs border shrink-0",
                                  entry.posicion === 1 ? "bg-amber-500 text-slate-950 border-amber-300" :
                                  entry.posicion === 2 ? "bg-slate-300 text-slate-950 border-white" :
                                  entry.posicion === 3 ? "bg-amber-700 text-white border-amber-500" :
                                  "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10"
                                )}>
                                  {entry.posicion}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase shrink-0">
                                  {entry.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{entry.nombre}</span>
                                    {isMe && (
                                      <span className="px-1.5 py-0.2 rounded-full bg-red-500/30 text-red-700 dark:text-red-200 text-[8px] font-black uppercase font-mono shrink-0">
                                        TÚ
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 pt-0.5">
                                    <img 
                                      src={userRango.imagenUrl} 
                                      alt={userRango.nombre} 
                                      className="w-3.5 h-3.5 object-contain shrink-0" 
                                    />
                                    <span className="text-[10px] text-red-600 dark:text-red-300/90 block truncate">
                                      Nivel {userRango.nivel} • {rangoNombre}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono font-black text-red-600 dark:text-red-400 text-xs">{entry.puntos} PTS</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center space-y-3">
                      <Trophy className="w-10 h-10 mx-auto text-amber-500 dark:text-amber-400 opacity-60" />
                      <h4 className="font-black text-base text-slate-900 dark:text-white">¡Iniciá la Tabla de Posiciones!</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Aún no hay registros en Supabase. Completá tu primera evaluación o duelo para ser el #1 de la Facultad.
                      </p>
                    </div>
                  )}

                  {/* PIE Y SYNC */}
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        Ranking Oficial de la Facultad • Ordenado por Puntos de Rango acumulados en Duelos 1vs1
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* CONTENIDO 2: MEDALLERO OLÍMPICO CON CLASIFICACIÓN DE MEDALLAS ORO, PLATA Y BRONCE */}
            {rankingSubTab === "medallas" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#0D1527]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <h3 className="font-black text-xs md:text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>Tabla Olímpica de Medallas Ganadas</span>
                    </h3>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">Ordenado por 🥇 Oro &gt; 🥈 Plata &gt; 🥉 Bronce</span>
                  </div>

                  {medallasLeaderboardList.length > 0 ? (
                    <div className="space-y-2.5">
                      {medallasLeaderboardList.map((entry, idx) => {
                        const isMe = entry.user_id === user?.id || (userName && entry.nombre?.trim().toLowerCase() === userName.trim().toLowerCase());

                        return (
                          <div
                            key={entry.user_id || idx}
                            onClick={() => handleInspectUser(entry.user_id, entry.nombre, entry.avatar_url, { puntos: (entry.medallas_oro || 0) * 100 + (entry.medallas_plata || 0) * 50 })}
                            className={cn(
                              "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer",
                              isMe
                                ? "bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/30 text-slate-900 dark:text-white"
                                : "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-950/60 dark:border-white/10 text-slate-800 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center font-mono border shrink-0",
                                idx === 0 ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-black" :
                                idx === 1 ? "bg-slate-200 dark:bg-slate-300/20 text-slate-800 dark:text-slate-200 border-slate-300/40 font-black" :
                                idx === 2 ? "bg-amber-700/20 text-amber-800 dark:text-amber-400 border-amber-700/40 font-black" :
                                "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10"
                              )}>
                                #{idx + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 hover:underline">
                                  <span>{entry.nombre || "Estudiante"}</span>
                                  {isMe && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 border border-amber-500/40 text-[9px] font-black uppercase font-mono">
                                      TÚ
                                    </span>
                                  )}
                                </h5>
                                <div className="flex items-center gap-3 text-xs pt-0.5 font-mono font-bold">
                                  <span className="text-amber-600 dark:text-amber-400">🥇 {entry.medallas_oro || 0}</span>
                                  <span className="text-slate-600 dark:text-slate-300">🥈 {entry.medallas_plata || 0}</span>
                                  <span className="text-amber-700 dark:text-amber-600">🥉 {entry.medallas_bronce || 0}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">{entry.total_medallas || 0}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Medallas Totales</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center space-y-2">
                      <Award className="w-10 h-10 mx-auto text-amber-500 dark:text-amber-400 opacity-60" />
                      <h4 className="font-black text-base text-slate-900 dark:text-white">¡No hay medallas otorgadas aún!</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                        Las medallas olímpicas se otorgan a los mejores duelistas y campeones al finalizar los ciclos semanales y mensuales de competencia.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODAL SALA DE DUELO CREADA */}
        <AnimatePresence>
          {createdDueloModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-md w-full bg-white dark:bg-[#0D1527] border border-red-200 dark:border-red-500/40 rounded-3xl p-6 space-y-6 shadow-2xl relative text-center text-slate-900 dark:text-white"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/40 flex items-center justify-center text-red-600 dark:text-red-400">
                  <Swords className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">¡Sala de Duelo Creada Exitosamente!</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Compartí este código con tu rival o inicien la partida directamente:</p>
                  
                  <div className="py-3 px-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-red-200 dark:border-red-500/40 font-mono text-2xl font-black text-red-600 dark:text-red-400 tracking-widest flex items-center justify-center gap-3 my-2">
                    <span>{createdDueloModal.id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdDueloModal.id);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 text-xs transition-all cursor-pointer"
                      title="Copiar Código"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedCode && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">¡Código copiado al portapapeles!</span>}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      const duel = createdDueloModal;
                      setCreatedDueloModal(null);
                      handleJoinDuelo(duel);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Iniciar Duelo Ahora
                  </button>

                  <button
                    onClick={() => setCreatedDueloModal(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    Cerrar y Esperar Rival
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL DE RESULTADO DE DUELO 1V1 */}
        <AnimatePresence>
          {duelOutcomeModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-md w-full bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/20 rounded-3xl p-6 space-y-6 shadow-2xl relative text-center text-slate-900 dark:text-white"
              >
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center font-bold border shadow-xl",
                  duelOutcomeModal.resultado === "victoria" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40" :
                  duelOutcomeModal.resultado === "derrota" ? "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40" :
                  "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40"
                )}>
                  {duelOutcomeModal.resultado === "victoria" && <Trophy className="w-8 h-8 animate-bounce text-amber-500 dark:text-amber-400" />}
                  {duelOutcomeModal.resultado === "derrota" && <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />}
                  {duelOutcomeModal.resultado === "empate" && <Scale className="w-8 h-8 text-amber-500 dark:text-amber-400" />}
                  {duelOutcomeModal.resultado === "esperando_rival" && <Timer className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-spin" />}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {duelOutcomeModal.resultado === "victoria" && "🏆 ¡VICTORIA EN EL DUELO 1V1!"}
                    {duelOutcomeModal.resultado === "derrota" && "💔 DERROTA EN EL DUELO 1V1"}
                    {duelOutcomeModal.resultado === "empate" && "🤝 ¡EMPATE ACADÉMICO!"}
                    {duelOutcomeModal.resultado === "esperando_rival" && "⏳ PARTIDA REGISTRADA"}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {duelOutcomeModal.resultado === "esperando_rival"
                      ? "Tu puntaje ha sido guardado exitosamente. El resultado final del duelo se computará cuando tu rival complete las preguntas."
                      : "Duelo finalizado en tiempo real sincronizado."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setDuelOutcomeModal(null)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL DE REVISIÓN DE PREGUNTAS Y FUNDAMENTOS */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-2xl w-full bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/20 rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl relative text-slate-900 dark:text-white"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Revisión de Preguntas y Fundamentos</h3>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {questionsPool.map((q, idx) => (
                    <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-3">
                      <span className="text-[10px] font-mono font-black text-red-600 dark:text-red-400 uppercase block">Pregunta {idx + 1} • {q.categoria_nombre}</span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{q.pregunta}</h4>
                      
                      <div className="space-y-1.5 pl-1">
                        {q.opciones.map((opc, opcIdx) => {
                          const isCorrect = opcIdx === q.respuesta_correcta_index;
                          return (
                            <div
                              key={opcIdx}
                              className={cn(
                                "p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 border font-mono",
                                isCorrect
                                  ? "bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-bold"
                                  : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400"
                              )}
                            >
                              <span>{String.fromCharCode(65 + opcIdx)}. {opc}</span>
                              {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-[#0A1C3D]/40 border border-blue-200 dark:border-[#0F2A5C]/50 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                        <span className="font-black uppercase text-[10px] text-blue-700 dark:text-blue-300 block flex items-center gap-1">
                          ⚖️ Fundamento Jurídico:
                        </span>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{q.fundamento_juridico}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setInGame(false);
                      setGameOver(false);
                      setActiveDuelRoom(null);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    Volver al Menú Principal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL CON LA ESCALA DE LOS 12 RANGOS JURÍDICOS */}
        <AnimatePresence>
          {showRangosModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl relative text-slate-900 dark:text-white"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Escala Oficial de Rangos Jurídicos (12 Niveles)</h3>
                  </div>
                  <button
                    onClick={() => setShowRangosModal(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {RANGOS_JURIDICOS.map((rango, idx) => {
                    const isUserCurrent = rango.id === rangoActual.id;

                    return (
                      <div
                        key={rango.id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all flex items-start gap-3.5",
                          isUserCurrent
                            ? "bg-amber-500/10 border-amber-500/60 text-slate-900 dark:text-white shadow-md"
                            : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/60 p-1 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-xl relative overflow-hidden">
                          <img
                            src={rango.imagenUrl || `/logos-rangos/Nivel${rango.nivel || idx + 1}.png`}
                            alt={rango.nombre}
                            className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                            loading="lazy"
                          />
                        </div>

                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <span>Nivel {idx + 1}: {rango.nombre}</span>
                              {isUserCurrent && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40">Tu Rango Actual</span>}
                            </h4>
                            <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                              {rango.minPuntos} – {rango.maxPuntos > 100000 ? "15.000+" : `${rango.maxPuntos} PTS`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rango.descripcion}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowRangosModal(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cerrar Escala
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL DIALOG: PARCIAL FLASH CON IA */}
        <Dialog open={isParcialFlashModalOpen} onOpenChange={setIsParcialFlashModalOpen}>
          <DialogContent className="max-w-md bg-white dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" /> Generador de Parcial Flash con IA
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 dark:text-slate-300">
                Ingresá la materia que querés evaluar. La IA generará en tiempo real un examen de 5 preguntas únicas adaptadas al nivel universitario de tu cursada.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Materia para el Parcial Flash</label>
              <input
                type="text"
                value={materiaParcialFlash}
                onChange={(e) => setMateriaParcialFlash(e.target.value)}
                placeholder="Ej: Derecho Civil I, Derecho Penal I, Romano..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="pt-3 flex gap-2">
              <Button
                disabled={loadingParcialFlash || !materiaParcialFlash.trim()}
                onClick={generarParcialFlashIA}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl shadow-lg cursor-pointer"
              >
                {loadingParcialFlash ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generando examen con IA...
                  </>
                ) : (
                  "⚡ Comenzar Parcial Flash (5 Preguntas)"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* MODAL FICHA DE ESTUDIANTE Y MEDALLERO PÚBLICO */}
        <UserProfileModal
          isOpen={inspectUserModal.isOpen}
          onClose={() => setInspectUserModal(prev => ({ ...prev, isOpen: false }))}
          userId={inspectUserModal.userId}
          userName={inspectUserModal.userName}
          userAvatar={inspectUserModal.userAvatar}
          initialStats={inspectUserModal.initialStats}
        />

        {/* MODAL TUTORIAL Y GUÍA DE REGLAS Y PUNTOS DE LA TRIVIA */}
        <TriviaGuideModal
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
        />

        {/* MODAL DE RESULTADOS POST-PARTIDA CON ANIMACIÓN DE ELO Y TEXTO FLOTANTE DE MMR */}
        {postMatchModal && (
          <TriviaPostMatchModal
            isOpen={postMatchModal.isOpen}
            onClose={() => {
              setPostMatchModal(null);
              setInGame(false);
              setGameOver(false);
              setActiveDuelRoom(null);
            }}
            onPlayAgain={() => {
              setPostMatchModal(null);
              setGameOver(false);
              if (postMatchModal.isDuel1v1) {
                setActiveTab("duelos");
                handleCreateDuelo(true);
              } else {
                handleStartGame();
              }
            }}
            resultado={postMatchModal.resultado}
            puntosCambio={postMatchModal.puntosCambio}
            puntosTotalesAntes={postMatchModal.puntosTotalesAntes}
            puntosTotalesDespues={postMatchModal.puntosTotalesDespues}
            correctAnswersCount={postMatchModal.correctAnswersCount}
            totalQuestions={postMatchModal.totalQuestions}
            maxStreak={postMatchModal.maxStreak}
            isDuel1v1={postMatchModal.isDuel1v1}
            duelDetails={postMatchModal.duelDetails}
          />
        )}

      </div>
    </div>
  );
}

class TriviaErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Trivia Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050B14] text-white p-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-[#0D1527] border border-red-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Actualizando Módulo de Trivia</h2>
            <p className="text-xs text-slate-300">
              Se sincronizaron nuevos datos. Hacé clic para restaurar la vista fluida.
            </p>
            <button
              onClick={() => {
                try { localStorage.removeItem("dnd_trivia_user_stats"); } catch {}
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase cursor-pointer"
            >
              Cargar Trivia
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function TriviaWithBoundary() {
  return (
    <TriviaErrorBoundary>
      <Trivia />
    </TriviaErrorBoundary>
  );
}
