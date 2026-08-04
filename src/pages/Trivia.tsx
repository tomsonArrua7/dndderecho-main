import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

// Función para desordenar aleatoriamente las 4 opciones de cada pregunta
const prepareQuestionPool = (questions: TriviaQuestion[]): TriviaQuestion[] => {
  return questions.map(q => {
    const correctText = q.opciones[q.respuesta_correcta_index];
    const shuffled = [...q.opciones];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const newCorrectIndex = shuffled.indexOf(correctText);
    return {
      ...q,
      opciones: shuffled,
      respuesta_correcta_index: newCorrectIndex
    };
  });
};

export default function Trivia() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Pestañas Principales: "evaluacion" | "duelos" | "ranking"
  const [activeTab, setActiveTab] = useState<"evaluacion" | "duelos" | "ranking">("evaluacion");
  const [duelosSubTab, setDuelosSubTab] = useState<"disponibles" | "historial">("disponibles");
  const [showRangosModal, setShowRangosModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Filtro de Año de Carrera: 0 = Toda la Carrera, 1 = 1º Año, 2 = 2º Año, 3 = 3º Año, 4 = 4º Año, 5 = 5º Año
  const [selectedYearFilter, setSelectedYearFilter] = useState<number>(0);
  
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

  // Ranking conectado a Supabase (General y Duelistas)
  const [rankingSubTab, setRankingSubTab] = useState<"global" | "duelistas">("global");
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);
  const [duelistasLeaderboardList, setDuelistasLeaderboardList] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

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
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
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

  // Estados para funciones de IA
  const [explicacionIA, setExplicacionIA] = useState<string | null>(null);
  const [loadingExplicacion, setLoadingExplicacion] = useState(false);

  const [isParcialFlashModalOpen, setIsParcialFlashModalOpen] = useState(false);
  const [loadingParcialFlash, setLoadingParcialFlash] = useState(false);
  const [materiaParcialFlash, setMateriaParcialFlash] = useState("Derecho Civil I");
  const [dbTriviaQuestions, setDbTriviaQuestions] = useState<TriviaQuestion[]>([]);

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

  const allQuestionsCombined = useMemo(() => {
    return [...TRIVIA_QUESTIONS, ...dbTriviaQuestions];
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
          accion: "generar_parcial_flash",
          materia: materiaParcialFlash
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.preguntas && data.preguntas.length > 0) {
          const pool = prepareQuestionPool(data.preguntas);
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
          toast.success("¡Parcial Flash de 5 preguntas generado por la IA!");
        } else {
          toast.error("No se pudieron generar las preguntas del examen.");
        }
      } else {
        toast.error("Error al comunicarse con la IA.");
      }
    } catch (e) {
      toast.error("Error de red.");
    } finally {
      setLoadingParcialFlash(false);
    }
  };

  // Estadísticas del usuario acumuladas (sincronizadas con DB / LocalStorage)
  const [userStats, setUserStats] = useState<{
    totalJugadas: number;
    totalCorrectas: number;
    puntosTotales: number;
    mejorRacha: number;
    victoriasDuelo: number;
    derrotasDuelo: number;
    empatesDuelo: number;
    puntosDuelista: number;
  }>(() => {
    try {
      const saved = localStorage.getItem("dnd_trivia_user_stats");
      return saved ? JSON.parse(saved) : {
        totalJugadas: 0,
        totalCorrectas: 0,
        puntosTotales: 0,
        mejorRacha: 0,
        victoriasDuelo: 0,
        derrotasDuelo: 0,
        empatesDuelo: 0,
        puntosDuelista: 0
      };
    } catch {
      return {
        totalJugadas: 0,
        totalCorrectas: 0,
        puntosTotales: 0,
        mejorRacha: 0,
        victoriasDuelo: 0,
        derrotasDuelo: 0,
        empatesDuelo: 0,
        puntosDuelista: 0
      };
    }
  });

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Estudiante de Abogacía";
  const rangoActual = calcularRango(userStats.puntosTotales);
  const RangoIcon = ICON_MAP[rangoActual.iconoNombre] || BookOpen;

  const proximoRangoIndex = RANGOS_JURIDICOS.findIndex(r => r.id === rangoActual.id) + 1;
  const proximoRango = RANGOS_JURIDICOS[proximoRangoIndex] || null;
  const progresoPorcentaje = proximoRango
    ? Math.min(100, Math.round(((userStats.puntosTotales - rangoActual.minPuntos) / (proximoRango.minPuntos - rangoActual.minPuntos)) * 100))
    : 100;

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
        setUserStats({
          totalJugadas: data.partidas_jugadas || 0,
          totalCorrectas: data.total_aciertos || 0,
          puntosTotales: data.puntos_totales || 0,
          mejorRacha: data.mejor_racha || 0,
          victoriasDuelo: data.victorias_duelo || 0,
          derrotasDuelo: data.derrotas_duelo || 0,
          empatesDuelo: data.empates_duelo || 0,
          puntosDuelista: data.puntos_duelista || 0,
        });
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
          id: row.user_id,
          posicion: row.posicion || idx + 1,
          nombre: row.nombre || "Estudiante de Abogacía",
          facultad: "FCJyS - UNLP",
          materiaFav: row.materia_fav || "Toda la Carrera",
          puntos: row.puntos || 0,
          aciertosPorcentaje: row.aciertos_porcentaje || 0,
          racha: row.racha || 0,
          avatarUrl: row.avatar_url || undefined,
          rangoNombre: calcularRango(row.puntos || 0).nombre
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
    } catch (err) {
      console.error("Error al obtener ranking en Supabase:", err);
    } finally {
      setLoadingRanking(false);
    }
  };

  // Evaluar automáticamente si hay un duelo recién finalizado del jugador sin haber visto el modal (Estilo Preguntados)
  const checkAndTriggerUnseenResults = (duelos: DueloTrivia[], seenList: string[]) => {
    if (duelOutcomeModalRef.current) return;

    for (const duel of duelos) {
      const isP1 = (user?.id && duel.player1Id === user.id) || duel.player1Nombre === userName;
      const isP2 = (user?.id && duel.player2Id === user.id) || (duel.player2Nombre && duel.player2Nombre === userName);

      if (!isP1 && !isP2) continue;

      const isFinished = duel.status === "finalizado" || (duel.player1Completed && duel.player2Completed);

      if (isFinished && !seenList.includes(duel.id)) {
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
          ptsBonus = 10;
        } else {
          res = "empate";
          ptsBonus = 25;
        }

        markDuelAsSeen(duel.id);
        setActiveDuelRoom(duel);

        let duelQuestions = TRIVIA_QUESTIONS.filter(q => duel.preguntasIds.includes(q.id));
        if (duelQuestions.length === 0) duelQuestions = TRIVIA_QUESTIONS.slice(0, 5);
        setQuestionsPool(duelQuestions);

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

  // 3. Cargar Salas de Duelo 1vs1 desde Supabase DB
  const fetchDuelosFromSupabase = async () => {
    setLoadingDuelos(true);
    try {
      const { data, error } = await supabase
        .from("trivia_duelos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40);

      if (data && !error) {
        const mapped: DueloTrivia[] = data.map((d: any) => ({
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
          // Marcar duelos finalizados preexistentes como vistos para no mostrar popups antiguos al abrir la app
          const finishedIds = mapped
            .filter(d => d.status === "finalizado" || (d.player1Completed && d.player2Completed))
            .map(d => d.id);
          
          if (finishedIds.length > 0) {
            setSeenDuelResults(prev => {
              const updated = Array.from(new Set([...prev, ...finishedIds]));
              seenDuelResultsRef.current = updated;
              try {
                localStorage.setItem("dnd_seen_duel_results", JSON.stringify(updated));
              } catch {}
              return updated;
            });
          }
        } else {
          // Auto-activar modal únicamente para duelos que finalicen en tiempo real durante la sesión
          checkAndTriggerUnseenResults(mapped, seenDuelResultsRef.current);
        }
      }
    } catch (err) {
      console.error("Error al obtener duelos de Supabase:", err);
    } finally {
      setLoadingDuelos(false);
    }
  };

  // Escuchar cambios de autenticación, Polling 4s y Suscripción Realtime a trivia_duelos
  useEffect(() => {
    fetchUserStatsFromSupabase();
    fetchDuelosFromSupabase();
    fetchRankingFromSupabase();

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

  // Persistir stats localmente como fallback
  useEffect(() => {
    try {
      localStorage.setItem("dnd_trivia_user_stats", JSON.stringify(userStats));
    } catch {
      // Ignorar
    }
  }, [userStats]);

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

  // Filtrado de Categorías según el Año Seleccionado
  const filteredCategorias = selectedYearFilter === 0
    ? CATEGORIAS_TRIVIA
    : CATEGORIAS_TRIVIA.filter(cat => cat.anio === selectedYearFilter || cat.id === "todas");

  // Iniciar Trivia Solo (con desorden de opciones aleatorio)
  const handleStartGame = () => {
    setActiveDuelRoom(null);
    setExplicacionIA(null);
    let pool = [...allQuestionsCombined];

    if (selectedCategoria !== "todas") {
      pool = pool.filter(q => q.id_categoria === selectedCategoria);
    }

    if (pool.length === 0) {
      pool = [...allQuestionsCombined];
    }

    pool = pool.sort(() => 0.5 - Math.random());
    const finalPool = pool.slice(0, Math.min(questionsCount, pool.length));

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

  // Crear Duelo 1vs1 en Supabase
  const handleCreateDuelo = async (esPublico: boolean) => {
    const randomCode = `DND-${Math.floor(100 + Math.random() * 900)}`;
    const cat = CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria) || CATEGORIAS_TRIVIA[0];

    let pool = TRIVIA_QUESTIONS;
    if (cat.id !== "todas") {
      pool = pool.filter(q => q.id_categoria === cat.id);
    }
    if (pool.length < 5) pool = TRIVIA_QUESTIONS;
    const selectedQIds = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5).map(q => q.id);

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
    setActiveDuelRoom(duelo);

    // Cargar siempre las preguntas del duelo a questionsPool por si el usuario abre la revisión
    let duelQuestions = TRIVIA_QUESTIONS.filter(q => duelo.preguntasIds.includes(q.id));
    if (duelQuestions.length === 0) {
      duelQuestions = TRIVIA_QUESTIONS.slice(0, 5);
    }
    setQuestionsPool(duelQuestions);

    const isPlayer1 = (user?.id && duelo.player1Id === user.id) || duelo.player1Nombre === userName;
    const isPlayer2 = (user?.id && duelo.player2Id === user.id) || (duelo.player2Nombre && duelo.player2Nombre === userName);
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
        ptsBonus = 10;
      } else {
        res = "empate";
        ptsBonus = 25;
      }

      markDuelAsSeen(duelo.id);

      setDuelOutcomeModal({
        resultado: res,
        puntosGanados: ptsBonus,
        rivalNombre: oppName,
        p1Nombre: duelo.player1Nombre || "Jugador 1",
        p1Puntos: p1Score,
        p1Aciertos: p1Aciertos,
        p2Nombre: duelo.player2Nombre || "Jugador 2",
        p2Puntos: p2Score,
        p2Aciertos: p2Aciertos
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

    // Mezclar las 4 opciones de cada pregunta para este jugador
    setQuestionsPool(prepareQuestionPool(duelQuestions));
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

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentQ = questionsPool[currentIndex];
    const isCorrect = optionIndex === currentQ.respuesta_correcta_index;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 1.5);
      const pointsAdded = 10 + timeBonus;
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
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    if (!activeDuelRoom) {
      setGameOver(true);
    } else {
      setInGame(false);
      setGameOver(false);
    }

    let updatedStats = { ...userStats };
    updatedStats.totalJugadas += 1;
    updatedStats.totalCorrectas += correctAnswersCount;
    updatedStats.puntosTotales += score;
    updatedStats.mejorRacha = Math.max(userStats.mejorRacha, maxStreak);

    if (user) {
      try {
        await supabase.from("trivia_partidas").insert({
          user_id: user.id,
          categoria_id: selectedCategoria,
          dificultad: "todas",
          puntos: score,
          aciertos: correctAnswersCount,
          total_preguntas: questionsPool.length,
          racha_maxima: maxStreak
        });
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
          try {
            await supabase.rpc('fn_procesar_resultado_duelo', {
              p_duelo_id: activeDuelRoom.id,
              p_player1_puntos: p1Score,
              p_player1_aciertos: p1Aciertos,
              p_player2_puntos: p2Score,
              p_player2_aciertos: p2Aciertos
            });
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
            updatedStats.victoriasDuelo += 1;
          } else if (oppScore > myScore) {
            res = "derrota";
            ptsBonus = 10;
            updatedStats.derrotasDuelo += 1;
          } else {
            res = "empate";
            ptsBonus = 25;
            updatedStats.empatesDuelo += 1;
          }
          updatedStats.puntosDuelista += ptsBonus;

          markDuelAsSeen(activeDuelRoom.id);

          setDuelOutcomeModal({
            resultado: res,
            puntosGanados: ptsBonus,
            rivalNombre: p2Name,
            p1Nombre: room.player1_nombre || "Jugador 1",
            p1Puntos: p1Score,
            p1Aciertos: p1Aciertos,
            p2Nombre: room.player2_nombre || "Jugador 2",
            p2Puntos: p2Score,
            p2Aciertos: p2Aciertos
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
    if (catId === "todas") return TRIVIA_QUESTIONS.length;
    return TRIVIA_QUESTIONS.filter(q => q.id_categoria === catId).length;
  };

  // Renderizar Pregunta Activa
  if (inGame && questionsPool.length > 0 && !gameOver) {
    const currentQ = questionsPool[currentIndex];
    const isLastQuestion = currentIndex + 1 === questionsPool.length;
    const progressPercent = (timeLeft / 20) * 100;

    return (
      <div className="min-h-screen bg-[#050B14] text-white py-6 md:py-10 px-3 sm:px-4 flex items-center justify-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full bg-[#0D1527] border border-white/15 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-xl">
          
          {/* BARRA DE PROGRESO DEL TEMPORIZADOR (20 SEGUNDOS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0A1C3D] text-blue-300 text-xs font-black uppercase tracking-wider border border-[#0F2A5C]">
                  Pregunta {currentIndex + 1} de {questionsPool.length}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  [{currentQ.categoria_nombre}]
                </span>
              </div>

              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30 animate-pulse">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Racha x{streak}</span>
                  </div>
                )}

                {/* RELOJ VISUAL LLAMATIVO */}
                <div className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono font-black text-sm md:text-base border transition-all duration-300 shadow-md",
                  timeLeft > 10
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-emerald-950/20"
                    : timeLeft > 5
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-950/20"
                    : "bg-rose-500/30 text-rose-200 border-rose-500/60 animate-pulse scale-105 shadow-rose-950/50"
                )}>
                  <Timer className={cn("w-4 h-4 md:w-5 md:h-5", timeLeft <= 5 && "animate-spin text-rose-400")} />
                  <span>{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* Barra de progreso de tiempo con gradiente dinámico */}
            <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden border border-white/10 relative">
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  timeLeft > 10
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50"
                    : timeLeft > 5
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-sm shadow-amber-500/50"
                    : "bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 shadow-md shadow-rose-600/80"
                )}
              />
            </div>
          </div>

          {/* ENUNCIADO DE LA PREGUNTA */}
          <div className="space-y-2 pt-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-relaxed">
              {currentQ.pregunta}
            </h3>
          </div>

          {/* OPCIONES DE RESPUESTA (OPTIMIZADAS PARA CELULAR) */}
          <div className="space-y-3">
            {currentQ.opciones.map((opc, idx) => {
              const isSelected = selectedOption === idx;
              const isRight = idx === currentQ.respuesta_correcta_index;

              let style = "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-white";

              if (isAnswered) {
                if (isRight) style = "bg-emerald-600/30 border-emerald-500 text-emerald-100 font-bold shadow-lg shadow-emerald-950/50";
                else if (isSelected && !isRight) style = "bg-rose-600/30 border-rose-500 text-rose-100 font-bold shadow-lg shadow-rose-950/50";
                else style = "bg-slate-950/50 border-white/5 text-slate-500 opacity-40";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm md:text-base flex items-center justify-between gap-3 cursor-pointer min-h-[54px] active:scale-[0.98]",
                    style
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 font-mono border",
                      isAnswered && isRight ? "bg-emerald-500/30 border-emerald-400 text-emerald-200" :
                      isAnswered && isSelected && !isRight ? "bg-rose-500/30 border-rose-400 text-rose-200" :
                      "bg-white/10 border-white/15 text-slate-200"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opc}</span>
                  </div>

                  {isAnswered && isRight && <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isRight && <XCircle className="w-5 h-5 md:w-6 md:h-6 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* FUNDAMENTO JURÍDICO EXPLICATIVO */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#0A1C3D]/40 border border-[#0F2A5C] text-blue-200 text-xs space-y-2.5 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-black uppercase tracking-wider text-[10px] text-blue-300 flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4 text-blue-400" /> Fundamento Normativo Oficial:
                </span>
                {selectedOption !== currentQ.respuesta_correcta_index && (
                  <button
                    onClick={() => solicitarExplicacionIA(currentQ, selectedOption!)}
                    disabled={loadingExplicacion}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{loadingExplicacion ? "Consultando IA..." : "¿Por qué me equivoqué? (IA)"}</span>
                  </button>
                )}
              </div>

              <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">{currentQ.fundamento_juridico}</p>

              {explicacionIA && (
                <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Explicación Pedagógica del Tutor IA:
                  </span>
                  <p className="leading-relaxed font-medium text-slate-200 text-xs sm:text-sm">{explicacionIA}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* BOTÓN SIGUIENTE PREGUNTA */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] min-h-[52px]"
            >
              <span>{isLastQuestion ? "Ver Resultados de Partida" : "Siguiente Pregunta"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    );
  }

  // Renderizar Pantalla de Resultados de Partida
  if (gameOver) {
    return (
      <div className="min-h-screen bg-[#050B14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg w-full bg-[#0D1527] border border-red-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-300 text-[10px] font-black uppercase tracking-widest border border-red-500/30">
              PARTIDA FINALIZADA
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white pt-2">Resumen de Evaluación</h2>
            <p className="text-xs text-slate-400">Puntaje obtenido: <span className="text-red-400 font-mono font-black text-base">+{score} PTS</span></p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-bold">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-black">Aciertos</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{correctAnswersCount} / {questionsPool.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-black">Precisión</span>
              <span className="text-lg font-black text-red-400 font-mono">
                {Math.round((correctAnswersCount / questionsPool.length) * 100)}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-black">Mejor Racha</span>
              <span className="text-lg font-black text-blue-400 font-mono">x{maxStreak}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Partida</span>
            </button>
            <button
              onClick={() => {
                setInGame(false);
                setGameOver(false);
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              Volver al Menú de Materias
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA PRINCIPAL
  return (
    <div className="min-h-screen bg-[#050B14] text-white py-8 md:py-12 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER CON PAGO DE RANGO Y BARRA DE PROGRESO DE LOS 12 NIVELES */}
        <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-[#0A1C3D]/40 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <RangoIcon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">Tu Rango Jurídico:</span>
                <h3 className="text-lg md:text-xl font-black text-white">{rangoActual.nombre}</h3>
                <p className="text-[11px] text-slate-400">{rangoActual.descripcion}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[9px] uppercase font-black text-slate-400 block">Puntos Acumulados</span>
                <span className="text-2xl font-black text-red-400 font-mono">{userStats.puntosTotales} PTS</span>
                <span className="text-[10px] text-amber-300 font-bold block">
                  ⚔️ Duelista: {userStats.victoriasDuelo}V / {userStats.derrotasDuelo}D ({userStats.puntosDuelista} PTS)
                </span>
              </div>

              <button
                onClick={() => setShowRangosModal(true)}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                VER ESCALA DE RANGOS (12 Niveles)
              </button>
            </div>
          </div>

          {/* BARRA DE PROGRESO DE RANGO */}
          {proximoRango && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Progreso de Rango: <span className="text-white">{rangoActual.nombre}</span></span>
                <span className="text-red-400 font-mono font-black">
                  Siguiente: {proximoRango.nombre} ({proximoRango.minPuntos - userStats.puntosTotales} PTS restar.)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-[#0A1C3D] via-[#0F2A5C] to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${progresoPorcentaje}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* PESTAÑAS PRINCIPALES: EVALUACIÓN / DUELOS 1V1 / RANKING GENERAL ÚNICO */}
        <div className="flex items-center justify-center gap-2 pt-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("evaluacion")}
            className={cn(
              "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border shadow-lg",
              activeTab === "evaluacion"
                ? "bg-gradient-to-r from-[#0A1C3D] to-[#0F2A5C] border-[#0F2A5C] text-white shadow-[#0A1C3D]/30 scale-105"
                : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Evaluación por Materia</span>
          </button>

          <button
            onClick={() => setActiveTab("duelos")}
            className={cn(
              "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border shadow-lg",
              activeTab === "duelos"
                ? "bg-gradient-to-r from-[#0A1C3D] to-[#0F2A5C] border-[#0F2A5C] text-white shadow-[#0A1C3D]/30 scale-105"
                : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            <Swords className="w-4 h-4 text-amber-400" />
            <span>2. Duelos 1vs1 (Salas)</span>
          </button>

          <button
            onClick={() => setActiveTab("ranking")}
            className={cn(
              "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border shadow-lg",
              activeTab === "ranking"
                ? "bg-gradient-to-r from-[#0A1C3D] to-[#0F2A5C] border-[#0F2A5C] text-white shadow-[#0A1C3D]/30 scale-105"
                : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>3. Ranking General Único</span>
          </button>
        </div>

        {/* PESTAÑA 1: EVALUACIÓN POR MATERIA */}
        {activeTab === "evaluacion" && (
          <div className="space-y-6">
            {/* BOTÓN TODA LA CARRERA + SELECTOR DE AÑOS */}
            <div className="flex flex-col items-center gap-4">
              {/* Botón Toda la Carrera - standalone */}
              <button
                onClick={() => {
                  setSelectedYearFilter(0);
                  setSelectedCategoria("todas");
                }}
                className={cn(
                  "px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-3 border shadow-xl",
                  selectedYearFilter === 0
                    ? "bg-gradient-to-r from-red-600 to-red-500 border-red-500 text-white shadow-red-600/30 scale-105"
                    : "bg-[#0D1527] border-white/10 text-slate-300 hover:bg-[#0F2A5C]/30 hover:border-red-500/30"
                )}
              >
                <Sparkles className="w-5 h-5" />
                <span>🎓 Toda la Carrera</span>
              </button>

              {/* Separador */}
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">O elegí por año</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Tabs de Años */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { id: 1, label: "1º Año", icon: BookOpen },
                  { id: 2, label: "2º Año", icon: Landmark },
                  { id: 3, label: "3º Año", icon: Scale },
                  { id: 4, label: "4º Año", icon: FileText },
                  { id: 5, label: "5º Año", icon: GraduationCap }
                ].map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = selectedYearFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedYearFilter(item.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border",
                        isSelected
                          ? "bg-[#0A1C3D] border-[#0F2A5C] text-white shadow-lg"
                          : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                      )}
                    >
                      <ItemIcon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRID DE MATERIAS - Solo visible cuando se selecciona un año específico (1-5) */}
            {selectedYearFilter > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCategorias.filter(cat => cat.id !== "todas").map((cat) => {
                  const CatIcon = ICON_MAP[cat.icono] || BookOpen;
                  const isSelected = selectedCategoria === cat.id;
                  const qCount = getQuestionCountForCategory(cat.id);

                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategoria(cat.id)}
                      className={cn(
                        "p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between group shadow-xl relative overflow-hidden",
                        isSelected
                          ? "bg-gradient-to-br from-[#0A1C3D]/80 via-[#0D1527] to-[#1F0B12]/40 border-red-500/60 text-white shadow-red-900/20"
                          : "bg-[#0D1527]/80 border-white/10 hover:border-red-500/30 hover:bg-[#0D1527] text-slate-300"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center border font-bold",
                            isSelected ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-white/5 border-white/10 text-slate-400 group-hover:text-white"
                          )}>
                            <CatIcon className="w-5 h-5" />
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#0A1C3D]/50 text-blue-300 border border-[#0F2A5C]/50">
                            {cat.anio}º Año
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-base text-white group-hover:text-red-300 transition-colors">
                            {cat.nombre}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed pt-1">
                            {cat.descripcion}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-bold">
                        <span className="text-slate-400 font-mono">
                          {qCount} Preguntas
                        </span>
                        <div className="flex items-center gap-1 text-red-400 font-black">
                          <span>Seleccionar</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CONFIGURACIÓN Y BOTÓN INICIAR */}
            <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block text-center sm:text-left">
                  Cantidad de Preguntas por Evaluación:
                </label>
                <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto sm:mx-0">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionsCount(cnt)}
                      className={cn(
                        "py-3 rounded-2xl text-xs font-black border transition-all cursor-pointer font-mono active:scale-95",
                        questionsCount === cnt
                          ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-105"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08]"
                      )}
                    >
                      {cnt} Preguntas
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleStartGame}
                  className="py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] min-h-[52px]"
                >
                  <Play className="w-4.5 h-4.5 fill-white" />
                  <span>Comenzar Evaluación ({questionsCount} Preguntas)</span>
                </button>

                <button
                  onClick={() => setIsParcialFlashModalOpen(true)}
                  className="py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] min-h-[52px]"
                >
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  <span>⚡ Parcial Flash con IA (5 Preguntas)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: DUELOS 1VS1 (SALAS DE DESAFÍO Y HISTORIAL) */}
        {activeTab === "duelos" && (
          <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" />
                  <span>Salas de Duelo 1vs1 Académico</span>
                </h3>
                <p className="text-xs text-slate-400">Desafiá a colegas en salas directas o revisá tu historial de enfrentamientos.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCreateDuelo(true)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Sala Pública</span>
                </button>
                <button
                  onClick={() => handleCreateDuelo(false)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sala Privada</span>
                </button>
              </div>
            </div>

            {/* SUB-PESTAÑAS DE DUELOS: SALAS DISPONIBLES VS HISTORIAL DE DUELOS */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-white/10">
              <button
                onClick={() => setDuelosSubTab("disponibles")}
                className={cn(
                  "w-1/2 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  duelosSubTab === "disponibles"
                    ? "bg-[#0A1C3D] text-white border border-red-500/40 shadow-lg"
                    : "text-slate-400 hover:text-white"
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
                    : "text-slate-400 hover:text-white"
                )}
              >
                <BookOpenCheck className="w-4 h-4 text-blue-400" />
                <span>Historial de Duelos Jugados</span>
              </button>
            </div>

            {/* INGRESAR POR CÓDIGO */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-300">¿Tenés un código de duelo de un colega?</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Ej: DND-829"
                  value={inputCodigoDuelo}
                  onChange={(e) => setInputCodigoDuelo(e.target.value.toUpperCase())}
                  className="p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono font-bold text-xs uppercase focus:outline-none focus:border-red-500 w-full sm:w-40"
                />
                <button
                  onClick={() => {
                    const match = duelosList.find(d => d.id === inputCodigoDuelo);
                    if (match) handleJoinDuelo(match);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1C3D] hover:bg-[#0F2A5C] text-white font-black text-xs uppercase cursor-pointer shrink-0"
                >
                  Unirme
                </button>
              </div>
            </div>

            {/* VISTA 1: SALAS ACTIVAS DISPONIBLES (LOS DUELOS FINALIZADOS DESAPARECEN DE AQUÍ) */}
            {duelosSubTab === "disponibles" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Salas de Duelo Activas:</h4>
                  <button 
                    onClick={fetchDuelosFromSupabase}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <RefreshCw className={cn("w-3 h-3", loadingDuelos && "animate-spin")} />
                    <span>Actualizar</span>
                  </button>
                </div>

                {duelosList.filter(d => d.status !== "finalizado" && !(d.player1Completed && d.player2Completed)).length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                    <Swords className="w-8 h-8 mx-auto text-red-500 opacity-60" />
                    <p className="text-xs text-slate-400">No hay salas de duelo públicas en espera actualmente.</p>
                    <p className="text-[11px] text-slate-500 font-bold">¡Hacé click en "Crear Sala Pública" para desafiar a colegas en tiempo real!</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {duelosList
                      .filter(d => d.status !== "finalizado" && !(d.player1Completed && d.player2Completed))
                      .map((duelo) => {
                        const isPlayer1 = (user?.id && duelo.player1Id === user.id) || duelo.player1Nombre === userName;
                        const isPlayer2 = (user?.id && duelo.player2Id === user.id) || (duelo.player2Nombre && duelo.player2Nombre === userName);
                        const isParticipant = isPlayer1 || isPlayer2;
                        const myCompleted = isPlayer1 ? duelo.player1Completed : (isPlayer2 ? duelo.player2Completed : false);
                        const oppName = isPlayer1 ? (duelo.player2Nombre || "Esperando Rival...") : duelo.player1Nombre;

                        return (
                          <div
                            key={duelo.id}
                            className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                                  {duelo.id}
                                </span>
                                <span className="text-xs font-black text-white">{duelo.materiaNombre}</span>

                                {isParticipant && (
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border font-mono",
                                    myCompleted ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                                  )}>
                                    {myCompleted ? `⏳ Esperando a ${oppName}` : "🔥 ¡ES TU TURNO DE RESPONDER!"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Creado por: <span className="text-blue-300 font-bold">{duelo.player1Nombre}</span>
                                {duelo.player2Nombre && (
                                  <> vs <span className="text-red-300 font-bold">{duelo.player2Nombre}</span></>
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
            )}

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

        {/* PESTAÑA 3: RANKING GENERAL & RANKING DE DUELISTAS 1V1 */}
        {activeTab === "ranking" && (
          <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Tablas de Ranking de la Facultad</span>
                </h3>
                <p className="text-xs text-slate-400">Posiciones calculadas en tiempo real con la base de datos de estudiantes reales.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={fetchRankingFromSupabase}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", loadingRanking && "animate-spin")} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {/* SECTOR SUB-PESTAÑAS DE RANKING */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-white/10">
              <button
                onClick={() => setRankingSubTab("global")}
                className={cn(
                  "w-1/2 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  rankingSubTab === "global"
                    ? "bg-[#0A1C3D] text-white border border-red-500/40 shadow-lg"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Ranking General Único</span>
              </button>
              <button
                onClick={() => setRankingSubTab("duelistas")}
                className={cn(
                  "w-1/2 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  rankingSubTab === "duelistas"
                    ? "bg-[#0A1C3D] text-white border border-red-500/40 shadow-lg"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Swords className="w-4 h-4 text-red-400" />
                <span>Ranking de Duelistas (1v1)</span>
              </button>
            </div>

            {/* CONTENIDO RANKING GENERAL */}
            {rankingSubTab === "global" && (
              <div className="space-y-4">
                {/* WIDGET EXECUTIVE DE TU POSICIÓN OFICIAL */}
                {(() => {
                  const myEntry = leaderboardList.find(e => e.id === user?.id);
                  const myPos = myEntry?.posicion || 1;

                  return (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0A1C3D] via-[#0D1527] to-red-950/40 border-2 border-red-500/40 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-red-300 flex items-center gap-1.5 font-mono">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tu Ficha de Rendimiento en la Facultad</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-[10px] font-black uppercase text-red-200">
                          Tu Posición: #{myPos}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h4 className="text-base font-black text-white flex items-center gap-2">
                            <span>{userName}</span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono">TÚ</span>
                          </h4>
                          <p className="text-xs text-blue-300 font-bold">{rangoActual.nombre}</p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-950/60 p-2.5 rounded-xl border border-white/10 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-center px-2">
                            <span className="text-xs font-black text-slate-400 uppercase block text-[9px]">Puntaje</span>
                            <span className="text-sm font-black text-red-400 font-mono">{userStats.puntosTotales} PTS</span>
                          </div>
                          <div className="h-6 w-px bg-white/10" />
                          <div className="text-center px-2">
                            <span className="text-xs font-black text-slate-400 uppercase block text-[9px]">Racha Máx</span>
                            <span className="text-sm font-black text-amber-400 font-mono">x{userStats.mejorRacha}</span>
                          </div>
                          <div className="h-6 w-px bg-white/10" />
                          <div className="text-center px-2">
                            <span className="text-xs font-black text-slate-400 uppercase block text-[9px]">Precisión</span>
                            <span className="text-sm font-black text-emerald-400 font-mono">
                              {userStats.totalPreguntas > 0 
                                ? `${Math.round((userStats.totalAciertos / userStats.totalPreguntas) * 100)}%` 
                                : "0%"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* TABLA DE POSICIONES GENERALE */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 px-1">
                    <span>Tabla de Clasificación General:</span>
                  </h4>

                  {leaderboardList.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboardList.map((entry) => {
                        const isMe = entry.id === user?.id;

                        return (
                          <div
                            key={entry.id}
                            className={cn(
                              "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4",
                              isMe
                                ? "bg-red-950/30 border-red-500/60 shadow-lg shadow-red-900/10 ring-1 ring-red-500/30"
                                : "bg-slate-950/60 border-white/10 text-slate-300 hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center font-mono border",
                                entry.posicion === 1 ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-black" :
                                entry.posicion === 2 ? "bg-slate-300/20 text-slate-200 border-slate-300/40 font-black" :
                                entry.posicion === 3 ? "bg-amber-700/20 text-amber-400 border-amber-700/40 font-black" :
                                "bg-slate-800 text-slate-300 border-white/10"
                              )}>
                                #{entry.posicion}
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-white flex items-center gap-2">
                                  <span>{entry.nombre}</span>
                                  {isMe && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/40 text-[9px] font-black uppercase font-mono">
                                      TÚ
                                    </span>
                                  )}
                                </h5>
                                <span className="text-[11px] text-slate-400">{entry.rangoNombre || "Ingresante"}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black text-red-400 font-mono">{entry.puntos} PTS</span>
                              <span className="text-[10px] text-slate-400 block font-mono">Precisión: {entry.aciertosPorcentaje}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                      <Trophy className="w-8 h-8 mx-auto text-amber-400 opacity-60" />
                      <h4 className="font-black text-sm text-white">¡Liderás la Tabla de Posiciones!</h4>
                      <p className="text-xs text-slate-400">A medida que más estudiantes jueguen evaluaciones y duelos, sus puntajes aparecerán automáticamente aquí.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONTENIDO RANKING DE DUELISTAS 1V1 */}
            {rankingSubTab === "duelistas" && (
              <div className="space-y-4">
                {/* WIDGET EXECUTIVE DE DUELISTAS */}
                {(() => {
                  const myDuelistEntry = duelistasLeaderboardList.find(e => e.user_id === user?.id);
                  const myPosText = myDuelistEntry?.posicion ? `#${myDuelistEntry.posicion}` : "Sin Clasificar";

                  return (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/50 via-[#0A1C3D] to-slate-950 border-2 border-red-500/40 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono">
                          <Swords className="w-3.5 h-3.5 text-red-400" />
                          <span>Tu Récord Oficial en Duelos 1vs1</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black uppercase text-amber-300">
                          Posición 1v1: {myPosText}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h4 className="text-base font-black text-white flex items-center gap-2">
                            <span>{userName}</span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono">TÚ</span>
                          </h4>
                          <p className="text-xs text-slate-400">
                            Historial: <span className="text-emerald-400 font-bold">{userStats.victoriasDuelo} Victorias</span> • <span className="text-red-400 font-bold">{userStats.derrotasDuelo} Derrotas</span> • <span className="text-amber-400 font-bold">{userStats.empatesDuelo} Empates</span>
                          </p>
                        </div>

                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-right w-full sm:w-auto">
                          <span className="text-base font-black text-amber-400 font-mono block">{userStats.puntosDuelista} PTS</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Puntos de Duelista Acumulados</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* TABLA DE DUELISTAS BELOW */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 px-1">
                    <span>Tabla de Duelistas Destacados:</span>
                  </h4>

                  {duelistasLeaderboardList.length > 0 ? (
                    <div className="space-y-2">
                      {duelistasLeaderboardList.map((entry, idx) => {
                        const isMe = entry.user_id === user?.id;

                        return (
                          <div
                            key={entry.user_id || idx}
                            className={cn(
                              "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4",
                              isMe
                                ? "bg-red-950/30 border-red-500/60 shadow-lg shadow-red-900/10 ring-1 ring-red-500/30"
                                : "bg-slate-950/60 border-white/10 text-slate-300 hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center font-mono border",
                                (entry.posicion || idx + 1) === 1 ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-black" :
                                (entry.posicion || idx + 1) === 2 ? "bg-slate-300/20 text-slate-200 border-slate-300/40 font-black" :
                                (entry.posicion || idx + 1) === 3 ? "bg-amber-700/20 text-amber-400 border-amber-700/40 font-black" :
                                "bg-slate-800 text-slate-300 border-white/10"
                              )}>
                                #{entry.posicion || idx + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-white flex items-center gap-2">
                                  <span>{entry.nombre}</span>
                                  {isMe && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/40 text-[9px] font-black uppercase font-mono">
                                      TÚ
                                    </span>
                                  )}
                                </h5>
                                <span className="text-[11px] text-slate-400">
                                  <span className="text-emerald-400 font-bold">{entry.victorias || 0}V</span> - <span className="text-red-400 font-bold">{entry.derrotas || 0}D</span> - <span className="text-amber-400 font-bold">{entry.empates || 0}E</span>
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black text-amber-400 font-mono">{entry.puntos_duelista || 0} PTS</span>
                              <span className="text-[10px] text-slate-400 block font-mono">Duelos 1v1</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                      <Swords className="w-8 h-8 mx-auto text-red-400 opacity-60" />
                      <h4 className="font-black text-sm text-white">¡No hay duelistas registrados aún!</h4>
                      <p className="text-xs text-slate-400">Completá duelos 1v1 en la pestaña de Salas para acumular victorias y liderar el Ranking de Duelistas.</p>
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
                className="max-w-md w-full bg-[#0D1527] border border-red-500/40 rounded-3xl p-6 space-y-6 shadow-2xl relative text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Swords className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">¡Sala de Duelo Creada Exitosamente!</h3>
                  <p className="text-xs text-slate-300">Compartí este código con tu rival o inicien la partida directamente:</p>
                  
                  <div className="py-3 px-4 bg-slate-950 rounded-2xl border border-red-500/40 font-mono text-2xl font-black text-red-400 tracking-widest flex items-center justify-center gap-3 my-2">
                    <span>{createdDueloModal.id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdDueloModal.id);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-all cursor-pointer"
                      title="Copiar Código"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedCode && <span className="text-[10px] text-emerald-400 font-bold block">¡Código copiado al portapapeles!</span>}
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
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase cursor-pointer"
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
                className="max-w-md w-full bg-[#0D1527] border border-white/20 rounded-3xl p-6 space-y-6 shadow-2xl relative text-center"
              >
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center font-bold border shadow-xl",
                  duelOutcomeModal.resultado === "victoria" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                  duelOutcomeModal.resultado === "derrota" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                  "bg-amber-500/20 text-amber-400 border-amber-500/40"
                )}>
                  {duelOutcomeModal.resultado === "victoria" && <Trophy className="w-8 h-8 animate-bounce text-amber-400" />}
                  {duelOutcomeModal.resultado === "derrota" && <XCircle className="w-8 h-8 text-red-400" />}
                  {duelOutcomeModal.resultado === "empate" && <Scale className="w-8 h-8 text-amber-400" />}
                  {duelOutcomeModal.resultado === "esperando_rival" && <Timer className="w-8 h-8 text-blue-400 animate-spin" />}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">
                    {duelOutcomeModal.resultado === "victoria" && "🏆 ¡VICTORIA EN EL DUELO 1V1!"}
                    {duelOutcomeModal.resultado === "derrota" && "💔 DERROTA EN EL DUELO 1V1"}
                    {duelOutcomeModal.resultado === "empate" && "🤝 ¡EMPATE ACADÉMICO!"}
                    {duelOutcomeModal.resultado === "esperando_rival" && "⏳ PARTIDA REGISTRADA"}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {duelOutcomeModal.resultado === "esperando_rival"
                      ? "Tu puntaje ha sido guardado exitosamente. El resultado final del duelo se computará cuando tu rival complete las preguntas."
                      : `Enfrentamiento directo contra ${duelOutcomeModal.rivalNombre}`}
                  </p>

                  {duelOutcomeModal.puntosGanados > 0 && (
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-black text-xs border border-amber-500/40 my-1">
                      +{duelOutcomeModal.puntosGanados} PTS Duelista Acumulados
                    </span>
                  )}
                </div>

                {/* COMPARATIVA DE PUNTAJES DE AMBOS PARTICIPANTES */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Marcador del Duelo:</span>
                  
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[11px] font-bold text-blue-300 block truncate">{duelOutcomeModal.p1Nombre}</span>
                      <span className="text-base font-black text-white font-mono">{duelOutcomeModal.p1Puntos} PTS</span>
                      <span className="text-[10px] text-slate-400 block">{duelOutcomeModal.p1Aciertos}/5 aciertos</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[11px] font-bold text-red-300 block truncate">{duelOutcomeModal.p2Nombre}</span>
                      <span className="text-base font-black text-white font-mono">{duelOutcomeModal.p2Puntos} PTS</span>
                      <span className="text-[10px] text-slate-400 block">{duelOutcomeModal.p2Aciertos}/5 aciertos</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (questionsPool.length === 0 && activeDuelRoom?.preguntasIds) {
                        let duelQs = TRIVIA_QUESTIONS.filter(q => activeDuelRoom.preguntasIds.includes(q.id));
                        if (duelQs.length === 0) duelQs = TRIVIA_QUESTIONS.slice(0, 5);
                        setQuestionsPool(duelQs);
                      }
                      setDuelOutcomeModal(null);
                      setShowReviewModal(true);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpenCheck className="w-4 h-4" />
                    <span>Ver Respuestas y Fundamentos Normativos</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeDuelRoom?.id) {
                        markDuelAsSeen(activeDuelRoom.id);
                      }
                      setDuelOutcomeModal(null);
                      setInGame(false);
                      setGameOver(false);
                      setActiveDuelRoom(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    Volver al Menú Principal
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
                className="max-w-2xl w-full bg-[#0D1527] border border-white/20 rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-black text-white">Revisión de Preguntas y Fundamentos</h3>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {questionsPool.map((q, idx) => (
                    <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                      <span className="text-[10px] font-mono font-black text-red-400 uppercase block">Pregunta {idx + 1} • {q.categoria_nombre}</span>
                      <h4 className="font-bold text-sm text-white">{q.pregunta}</h4>
                      
                      <div className="space-y-1.5 pl-1">
                        {q.opciones.map((opc, opcIdx) => {
                          const isCorrect = opcIdx === q.respuesta_correcta_index;
                          return (
                            <div
                              key={opcIdx}
                              className={cn(
                                "p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 border font-mono",
                                isCorrect
                                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold"
                                  : "bg-white/[0.02] border-white/5 text-slate-400"
                              )}
                            >
                              <span>{String.fromCharCode(65 + opcIdx)}. {opc}</span>
                              {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-[#0A1C3D]/40 border border-[#0F2A5C]/50 text-xs space-y-1 text-slate-300">
                        <span className="font-black uppercase text-[10px] text-blue-300 block flex items-center gap-1">
                          ⚖️ Fundamento Jurídico:
                        </span>
                        <p className="leading-relaxed text-slate-300">{q.fundamento_juridico}</p>
                      </div>
                    </div>
                  ))}
                </div>

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
                className="max-w-2xl w-full bg-slate-900 border border-white/20 rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-black text-white">Escala Oficial de Rangos Jurídicos (12 Niveles)</h3>
                  </div>
                  <button
                    onClick={() => setShowRangosModal(false)}
                    className="p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {RANGOS_JURIDICOS.map((rango, idx) => {
                    const RIcon = ICON_MAP[rango.iconoNombre] || BookOpen;
                    const isUserCurrent = rango.id === rangoActual.id;

                    return (
                      <div
                        key={rango.id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all flex items-start gap-3.5",
                          isUserCurrent
                            ? "bg-[#0A1C3D]/30 border-red-500/60 text-white shadow-lg"
                            : "bg-white/[0.02] border-white/10 text-slate-300"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold shrink-0 text-amber-400 border border-white/10">
                          <RIcon className="w-5 h-5" />
                        </div>

                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-black text-sm text-white flex items-center gap-2">
                              <span>Nivel {idx + 1}: {rango.nombre}</span>
                              {isUserCurrent && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Tu Rango</span>}
                            </h4>
                            <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                              {rango.minPuntos} – {rango.maxPuntos > 100000 ? "15.000+" : `${rango.maxPuntos} PTS`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{rango.descripcion}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowRangosModal(false)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cerrar Escala
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL DIALOG: PARCIAL FLASH CON IA */}
        <Dialog open={isParcialFlashModalOpen} onOpenChange={setIsParcialFlashModalOpen}>
          <DialogContent className="max-w-md bg-[#0D1527] text-white border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
                <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" /> Generador de Parcial Flash con IA
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300">
                Ingresá la materia que querés evaluar. La IA generará en tiempo real un examen de 5 preguntas únicas adaptadas al nivel universitario de tu cursada.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Materia para el Parcial Flash</label>
              <input
                type="text"
                value={materiaParcialFlash}
                onChange={(e) => setMateriaParcialFlash(e.target.value)}
                placeholder="Ej: Derecho Civil I, Derecho Penal I, Romano..."
                className="w-full bg-slate-950 border border-white/15 text-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-amber-500 font-medium"
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

      </div>
    </div>
  );
}
