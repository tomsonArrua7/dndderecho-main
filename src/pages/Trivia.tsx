import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
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
  X
} from "lucide-react";
import { 
  TRIVIA_QUESTIONS, 
  CATEGORIAS_TRIVIA, 
  MOCK_LEADERBOARD,
  RANGOS_JURIDICOS,
  calcularRango,
  TriviaQuestion, 
  LeaderboardEntry,
  RangoJuridico
} from "@/data/triviaData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
  Gavel
};

export default function Trivia() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"juego" | "ranking">("juego");
  const [showRangosModal, setShowRangosModal] = useState(false);
  
  // Filtros de juego
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [selectedDificultad, setSelectedDificultad] = useState<string>("todas");
  const [questionsCount, setQuestionsCount] = useState<number>(5); // 5 preguntas mínimo

  // Estado del juego
  const [inGame, setInGame] = useState(false);
  const [questionsPool, setQuestionsPool] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  
  // Comodines de Cátedra (Lifelines)
  const [lifelines, setLifelines] = useState({
    used5050: false,
    usedHint: false,
    usedExtraTime: false
  });
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Historial de la Partida (Modo Repaso de Errores)
  const [gameHistory, setGameHistory] = useState<Array<{
    question: TriviaQuestion;
    userOptionIndex: number | null;
    isCorrect: boolean;
  }>>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Timer por pregunta (15s)
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  
  // User Stats & Leaderboard
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>("todas");
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<{
    totalJugadas: number;
    totalCorrectas: number;
    puntosTotales: number;
    mejorRacha: number;
    puntosPorCategoria: Record<string, number>;
  }>({
    totalJugadas: 0,
    totalCorrectas: 0,
    puntosTotales: 0,
    mejorRacha: 0,
    puntosPorCategoria: {}
  });

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Estudiante Jursoc";
  const isAdmin = profile?.role === "admin";

  const rangoActual = calcularRango(userStats.puntosTotales);
  const RangoIcon = ICON_MAP[rangoActual.iconoNombre] || BookOpen;

  const proximoRangoIndex = RANGOS_JURIDICOS.findIndex(r => r.id === rangoActual.id) + 1;
  const proximoRango = proximoRangoIndex < RANGOS_JURIDICOS.length ? RANGOS_JURIDICOS[proximoRangoIndex] : null;

  const puntosEnNivel = userStats.puntosTotales - rangoActual.minPuntos;
  const puntosSiguienteNivel = proximoRango ? (proximoRango.minPuntos - rangoActual.minPuntos) : 1;
  const porcentajeRango = proximoRango ? Math.min(100, Math.round((puntosEnNivel / Math.max(1, puntosSiguienteNivel)) * 100)) : 100;

  const fetchLeaderboardAndStats = async () => {
    if (!user) return;

    let currentStats = { ...userStats };
    const savedStats = localStorage.getItem(`dnd_trivia_stats_${user.id}`);
    if (savedStats) {
      try {
        currentStats = JSON.parse(savedStats);
        if (!currentStats.puntosPorCategoria) currentStats.puntosPorCategoria = {};
        setUserStats(currentStats);
      } catch (e) {}
    }

    try {
      // 1. Cargar Estadísticas del usuario desde Supabase
      const { data: statsData } = await supabase
        .from("trivia_estadisticas_usuario" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (statsData) {
        currentStats = {
          totalJugadas: (statsData as any).partidas_jugadas || 0,
          totalCorrectas: (statsData as any).total_aciertos || 0,
          puntosTotales: (statsData as any).puntos_totales || 0,
          mejorRacha: (statsData as any).mejor_racha || 0,
          puntosPorCategoria: (statsData as any).puntos_por_categoria || currentStats.puntosPorCategoria || {}
        };
        setUserStats(currentStats);
      }

      // 2. Cargar Leaderboard global desde Supabase (Vista trivia_leaderboard)
      const { data: boardData } = await supabase
        .from("trivia_leaderboard" as any)
        .select("*");

      if (boardData && boardData.length > 0) {
        setLeaderboardList(boardData as any);
      } else {
        // Si la BD no devuelve filas aún, mostramos la entrada del usuario si tiene puntos/partidas
        if (currentStats.puntosTotales > 0 || currentStats.totalJugadas > 0) {
          setLeaderboardList([
            {
              id: user.id,
              posicion: 1,
              nombre: userName,
              facultad: "Jursoc UNLP",
              materiaFav: "Derecho General",
              puntos: currentStats.puntosTotales,
              puntosPorCategoria: currentStats.puntosPorCategoria,
              aciertosPorcentaje: Math.round((currentStats.totalCorrectas / Math.max(1, currentStats.totalJugadas)) * 100),
              racha: currentStats.mejorRacha,
              avatarUrl: profile?.avatar_url,
              rangoNombre: calcularRango(currentStats.puntosTotales).nombre
            }
          ]);
        } else {
          setLeaderboardList([]);
        }
      }
    } catch (err) {
      console.error("Error al sincronizar datos de Supabase:", err);
      if (currentStats.puntosTotales > 0 || currentStats.totalJugadas > 0) {
        setLeaderboardList([
          {
            id: user.id,
            posicion: 1,
            nombre: userName,
            facultad: "Jursoc UNLP",
            materiaFav: "Derecho General",
            puntos: currentStats.puntosTotales,
            puntosPorCategoria: currentStats.puntosPorCategoria,
            aciertosPorcentaje: Math.round((currentStats.totalCorrectas / Math.max(1, currentStats.totalJugadas)) * 100),
            racha: currentStats.mejorRacha,
            avatarUrl: profile?.avatar_url,
            rangoNombre: calcularRango(currentStats.puntosTotales).nombre
          }
        ]);
      }
    }
  };

  useEffect(() => {
    fetchLeaderboardAndStats();
  }, [user?.id]);

  const saveStats = async (newCorrect: number, newScore: number, finalStreak: number) => {
    if (!user) return;

    const newTotalJugadas = userStats.totalJugadas + questionsPool.length;
    const newTotalCorrectas = userStats.totalCorrectas + newCorrect;
    const newPuntosTotales = userStats.puntosTotales + newScore;
    const newMejorRacha = Math.max(userStats.mejorRacha, finalStreak);

    const prevCatPoints = (userStats.puntosPorCategoria && userStats.puntosPorCategoria[selectedCategoria]) || 0;
    const newCatPoints = prevCatPoints + newScore;
    const newPuntosPorCategoria = {
      ...(userStats.puntosPorCategoria || {}),
      [selectedCategoria]: newCatPoints
    };

    const updatedStats = {
      totalJugadas: newTotalJugadas,
      totalCorrectas: newTotalCorrectas,
      puntosTotales: newPuntosTotales,
      mejorRacha: newMejorRacha,
      puntosPorCategoria: newPuntosPorCategoria
    };

    setUserStats(updatedStats);
    localStorage.setItem(`dnd_trivia_stats_${user.id}`, JSON.stringify(updatedStats));

    const updatedRango = calcularRango(newPuntosTotales);

    const myEntry: LeaderboardEntry = {
      id: user.id,
      posicion: 1,
      nombre: userName,
      facultad: "Jursoc UNLP",
      materiaFav: selectedCategoria === "todas" ? "Derecho General" : (CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria)?.nombre || "Derecho"),
      puntos: newPuntosTotales,
      puntosPorCategoria: newPuntosPorCategoria,
      aciertosPorcentaje: Math.round((newTotalCorrectas / Math.max(1, newTotalJugadas)) * 100),
      racha: newMejorRacha,
      avatarUrl: profile?.avatar_url,
      rangoNombre: updatedRango.nombre
    };

    // Actualización inmediata en pantalla
    setLeaderboardList(prev => {
      const filtered = prev.filter(e => e.id !== user.id && e.nombre !== userName);
      const combined = [...filtered, myEntry].sort((a, b) => b.puntos - a.puntos);
      return combined.map((e, idx) => ({ ...e, posicion: idx + 1 }));
    });

    // Guardado en Supabase
    try {
      await supabase.from("trivia_partidas" as any).insert({
        user_id: user.id,
        categoria_id: selectedCategoria,
        dificultad: selectedDificultad,
        puntos: newScore,
        aciertos: newCorrect,
        total_preguntas: questionsPool.length,
        racha_maxima: finalStreak
      });

      await supabase.from("trivia_estadisticas_usuario" as any).upsert({
        user_id: user.id,
        puntos_totales: newPuntosTotales,
        partidas_jugadas: newTotalJugadas,
        total_preguntas: newTotalJugadas,
        total_aciertos: newTotalCorrectas,
        mejor_racha: newMejorRacha,
        materia_favorita: selectedCategoria === "todas" ? "Derecho General" : (CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria)?.nombre || "Derecho"),
        puntos_por_categoria: newPuntosPorCategoria,
        rango_nombre: updatedRango.nombre,
        updated_at: new Date().toISOString()
      });

      await fetchLeaderboardAndStats();
    } catch (err) {
      console.error("Error guardando en Supabase:", err);
    }
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inGame && !isAnswered && !gameOver) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        handleSelectOption(-1);
      }
    }
    return () => clearTimeout(timer);
  }, [inGame, isAnswered, timeLeft, gameOver]);

  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);

  const startGame = () => {
    const targetCount = Math.max(questionsCount, 5);
    
    // 1. Filtrar por categoría
    let categoryPool = selectedCategoria === "todas" 
      ? TRIVIA_QUESTIONS 
      : TRIVIA_QUESTIONS.filter(q => q.id_categoria === selectedCategoria);
    
    if (categoryPool.length === 0) categoryPool = TRIVIA_QUESTIONS;

    // 2. Filtrar por dificultad
    let exactMatches = selectedDificultad === "todas"
      ? categoryPool
      : categoryPool.filter(q => q.dificultad === selectedDificultad);

    // Evitar preguntas usadas recientemente en la sesión
    let unusedMatches = exactMatches.filter(q => !usedQuestionIds.includes(q.id));
    if (unusedMatches.length < targetCount) {
      unusedMatches = exactMatches;
    }

    const shuffledExact = [...unusedMatches].sort(() => Math.random() - 0.5);
    const selected: TriviaQuestion[] = [...shuffledExact.slice(0, targetCount)];

    // 3. Relleno adaptativo si no se alcanza la cantidad objetivo
    if (selected.length < targetCount) {
      const remainingCategory = categoryPool.filter(q => !selected.some(s => s.id === q.id)).sort(() => Math.random() - 0.5);
      selected.push(...remainingCategory.slice(0, targetCount - selected.length));
    }

    if (selected.length < targetCount) {
      const generalRemaining = TRIVIA_QUESTIONS.filter(q => !selected.some(s => s.id === q.id)).sort(() => Math.random() - 0.5);
      selected.push(...generalRemaining.slice(0, targetCount - selected.length));
    }

    // Mezclar aleatoriamente el orden de las opciones para cada pregunta
    const preparedPool = selected.map(q => {
      const correctText = q.opciones[q.respuesta_correcta_index];
      const shuffledOptions = [...q.opciones].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(correctText);
      return {
        ...q,
        opciones: shuffledOptions,
        respuesta_correcta_index: newCorrectIndex
      };
    });

    const newIds = preparedPool.map(q => q.id);
    setUsedQuestionIds(prev => Array.from(new Set([...prev, ...newIds])));

    setQuestionsPool(preparedPool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);
    setGameOver(false);
    setInGame(true);
    setLifelines({ used5050: false, usedHint: false, usedExtraTime: false });
    setDisabledOptions([]);
    setShowHint(false);
    setGameHistory([]);
    setShowReviewModal(false);
  };

  const currentQuestion = questionsPool[currentIndex];

  // Handlers para Comodines
  const use5050 = () => {
    if (lifelines.used5050 || isAnswered || !currentQuestion) return;
    const correctIdx = currentQuestion.respuesta_correcta_index;
    const incorrectIndices = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
    const shuffled = [...incorrectIndices].sort(() => Math.random() - 0.5);
    const disabledTwo = shuffled.slice(0, 2);
    setDisabledOptions(disabledTwo);
    setLifelines(prev => ({ ...prev, used5050: true }));
  };

  const useHint = () => {
    if (lifelines.usedHint || isAnswered || !currentQuestion) return;
    setShowHint(true);
    setLifelines(prev => ({ ...prev, usedHint: true }));
  };

  const useExtraTime = () => {
    if (lifelines.usedExtraTime || isAnswered || !currentQuestion) return;
    setTimeLeft(prev => prev + 10);
    setLifelines(prev => ({ ...prev, usedExtraTime: true }));
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.respuesta_correcta_index;

    // Registrar respuesta para el modo repaso
    setGameHistory(prev => [
      ...prev,
      {
        question: currentQuestion,
        userOptionIndex: index,
        isCorrect
      }
    ]);

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      const speedBonus = timeLeft * 1; 
      const currentPoints = currentQuestion.puntos_base + speedBonus;
      setScore(prev => prev + currentPoints);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questionsPool.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setDisabledOptions([]);
      setShowHint(false);
    } else {
      setGameOver(true);
      saveStats(correctAnswersCount, score, maxStreak);
    }
  };

  const filteredLeaderboard = leaderboardFilter === "todas"
    ? leaderboardList
    : leaderboardList.filter(e => {
        const catObj = CATEGORIAS_TRIVIA.find(c => c.id === leaderboardFilter);
        return e.materiaFav.toLowerCase().includes(catObj?.nombre.toLowerCase() || "") || e.materiaFav.includes("General");
      });

  // SI NO ESTÁ AUTENTICADO O NO ES ADMIN: REDIRIGIR FUERA
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070A14] text-white py-6 md:py-10 px-3 md:px-8 relative overflow-hidden">
      {/* Visual Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-6 md:space-y-8">
        
        {/* HEADER PRINCIPAL */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] md:text-xs font-black uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Trivia Académica Jursoc / UNLP</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-red-400 bg-clip-text text-transparent">
            Desafío Jurídico DND
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto px-2">
            Medí tu rigor jurisprudencial. Acumulá puntos en tu perfil y competí en la clasificación oficial de la Facultad.
          </p>

          {/* NAVEGACIÓN PESTAÑA CELULAR / DESKTOP */}
          {!inGame && (
            <div className="flex justify-center pt-1">
              <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
                <button
                  onClick={() => setActiveTab("juego")}
                  className={cn(
                    "flex items-center gap-2 px-5 md:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer min-h-[40px]",
                    activeTab === "juego"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Modo Trivia</span>
                </button>
                <button
                  onClick={() => setActiveTab("ranking")}
                  className={cn(
                    "flex items-center gap-2 px-5 md:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer min-h-[40px]",
                    activeTab === "ranking"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Medal className="w-3.5 h-3.5 text-amber-300" />
                  <span>Top & Rankings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PESTAÑA: MODO TRIVIA (OPTIMIZADA PARA MÓVIL) */}
        {!inGame && activeTab === "juego" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
          >
            {/* USER PROFILE INFO & RANGO JURIDICO BANNER */}
            <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={userName} className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/50 shadow-md" />
                  ) : (
                    <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
                      <RangoIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-white">{userName}</h2>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider", rangoActual.badgeStyle)}>
                        {rangoActual.nombre}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{rangoActual.descripcion}</p>
                  </div>
                </div>

                {/* STATS RAPIDAS */}
                <div className="flex items-center gap-4 text-xs font-bold text-slate-300 w-full md:w-auto justify-between md:justify-end bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-black">Partidas</span>
                    <span className="text-sm text-white font-black">{userStats.totalJugadas}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-black">Aciertos</span>
                    <span className="text-sm text-emerald-400 font-black">{userStats.totalCorrectas}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-black">Puntuación</span>
                    <span className="text-sm text-amber-400 font-black">{userStats.puntosTotales} PTS</span>
                  </div>
                </div>
              </div>

              {/* BARRA DE PROGRESO DE RANGO JURIDICO */}
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <RangoIcon className="w-4 h-4 text-amber-400" />
                    <span>Progreso de Rango: <strong className="text-white">{rangoActual.nombre}</strong></span>
                  </span>
                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span className="text-slate-400 text-[11px]">
                      {proximoRango ? (
                        <>Siguiente: <strong className="text-amber-300">{proximoRango.nombre}</strong> ({proximoRango.minPuntos - userStats.puntosTotales} PTS restar.)</>
                      ) : (
                        <span className="text-amber-400 font-black">¡Magistratura Máxima!</span>
                      )}
                    </span>
                    <button
                      onClick={() => setShowRangosModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Ver Escala de Rangos</span>
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-950/60 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentajeRango}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full bg-gradient-to-r shadow-lg", rangoActual.colorGradient)}
                  />
                </div>
              </div>
            </div>

            {/* SELECCIÓN DE CANTIDAD DE PREGUNTAS */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
                <Timer className="w-4 h-4 text-red-400" />
                <span>1. Longitud de la Partida (Mínimo 5 Preguntas)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { count: 5, label: "5 Preguntas (Estándar Rápida)" },
                  { count: 10, label: "10 Preguntas (Desafío Completo)" },
                  { count: 15, label: "15 Preguntas (Maratón de Cátedra)" }
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => setQuestionsCount(item.count)}
                    className={cn(
                      "p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer min-h-[44px] flex items-center justify-center",
                      questionsCount === item.count
                        ? "bg-red-600/30 border-red-500 text-white shadow-md shadow-red-600/20"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SELECCIÓN DE MATERIA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
                  <Scale className="w-4 h-4 text-red-400" />
                  <span>2. Seleccioná una Materia / Rama</span>
                </h2>
                {selectedCategoria !== "todas" && (
                  <button 
                    onClick={() => setSelectedCategoria("todas")}
                    className="text-xs text-red-400 hover:underline font-bold"
                  >
                    Ver todas
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  onClick={() => setSelectedCategoria("todas")}
                  className={cn(
                    "cursor-pointer p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 group",
                    selectedCategoria === "todas"
                      ? "bg-gradient-to-br from-red-600/30 to-red-900/40 border-red-500/60 shadow-lg shadow-red-900/20"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Sparkles className={cn("w-5 h-5", selectedCategoria === "todas" ? "text-red-400" : "text-slate-400")} />
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-white">
                      {TRIVIA_QUESTIONS.length} preguntas
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Todas las Materias</h3>
                    <p className="text-[11px] text-slate-400">Examen integral multirrama</p>
                  </div>
                </div>

                {CATEGORIAS_TRIVIA.map((cat) => {
                  const Icon = ICON_MAP[cat.icono] || Scale;
                  const isSelected = selectedCategoria === cat.id;
                  const count = TRIVIA_QUESTIONS.filter(q => q.id_categoria === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategoria(cat.id)}
                      className={cn(
                        "cursor-pointer p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 group",
                        isSelected
                          ? "bg-gradient-to-br from-red-600/30 via-slate-900 to-indigo-900/40 border-red-500/60 shadow-lg shadow-red-900/20"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={cn("w-5 h-5", isSelected ? "text-red-400" : "text-slate-400")} />
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-white">
                          {count} preguntas
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xs md:text-sm text-white line-clamp-1">{cat.nombre}</h3>
                        <p className="text-[10px] md:text-[11px] text-slate-400 line-clamp-1">{cat.descripcion}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SELECCIÓN DE DIFICULTAD */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
                <Filter className="w-4 h-4 text-red-400" />
                <span>3. Nivel de Dificultad (Escala de Puntos)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: "todas", nombre: "Todas las Dificultades", desc: "Mezclado (10 - 50 pts)" },
                  { id: "facil", nombre: "Fácil (Básico)", desc: "Reglas normativas directas (+10 pts)" },
                  { id: "media", nombre: "Medio (Intermedio)", desc: "Excepciones y presupuestos (+25 pts)" },
                  { id: "dificil", nombre: "Experto (Avanzado)", desc: "Doctrina y opciones capciosas (+50 pts)" }
                ].map((dif) => {
                  const isSelected = selectedDificultad === dif.id;
                  return (
                    <button
                      key={dif.id}
                      onClick={() => setSelectedDificultad(dif.id)}
                      className={cn(
                        "p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer min-h-[50px]",
                        isSelected
                          ? "bg-red-500/20 border-red-500 text-white font-bold shadow-md shadow-red-500/10"
                          : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"
                      )}
                    >
                      <p className="font-bold text-xs md:text-sm">{dif.nombre}</p>
                      <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">{dif.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTÓN INICIAR */}
            <div className="pt-2 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-base md:text-lg py-3.5 px-8 rounded-2xl shadow-xl shadow-red-600/30 hover:from-red-500 hover:to-rose-500 transition-all duration-300 cursor-pointer min-h-[52px]"
              >
                <span>Comenzar Trivia ({questionsCount} Preguntas)</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PESTAÑA: TOP RANKINGS E INDEPENDIENTES POR RAMA */}
        {!inGame && activeTab === "ranking" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-6"
          >
            {/* FILTROS Y SELECTOR DE LEADERBOARD POR RAMA */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/10 p-3.5 md:p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="font-bold text-sm md:text-base text-white">Tabla de Posiciones Universitarias</h2>
                    <p className="text-[11px] text-slate-400">Puntuación {leaderboardFilter === "todas" ? "General Acumulada" : `específica de ${CATEGORIAS_TRIVIA.find(c => c.id === leaderboardFilter)?.nombre || "la rama"}`}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRangosModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Ver Escala de Rangos</span>
                </button>
              </div>

              {/* TABS SELECTORAS DE RAMAS INDEPENDIENTES */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setLeaderboardFilter("todas")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border min-h-[36px] flex items-center gap-1.5",
                    leaderboardFilter === "todas" 
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20" 
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  )}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Ranking General</span>
                </button>
                {CATEGORIAS_TRIVIA.map(cat => {
                  const CatIcon = ICON_MAP[cat.icono] || Scale;
                  const isSelected = leaderboardFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setLeaderboardFilter(cat.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border min-h-[36px] flex items-center gap-1.5",
                        isSelected 
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20" 
                          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                      )}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TABLA RESPONSIVA DE POSICIONES CON RANGOS JURÍDICOS */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 md:p-6 overflow-x-auto shadow-2xl">
              {(() => {
                const processedList = [...leaderboardList]
                  .map(e => {
                    const eCatPoints = e.puntosPorCategoria || {};
                    const displayPts = leaderboardFilter === "todas" 
                      ? e.puntos 
                      : (eCatPoints[leaderboardFilter] !== undefined 
                          ? eCatPoints[leaderboardFilter] 
                          : (e.materiaFav.toLowerCase().includes(CATEGORIAS_TRIVIA.find(c => c.id === leaderboardFilter)?.nombre.toLowerCase() || "___") ? e.puntos : 0));
                    return {
                      ...e,
                      displayPts,
                      rango: calcularRango(e.puntos)
                    };
                  })
                  .filter(e => leaderboardFilter === "todas" || e.displayPts > 0 || e.id === user?.id)
                  .sort((a, b) => b.displayPts - a.displayPts)
                  .map((e, idx) => ({ ...e, posicion: idx + 1 }));

                if (processedList.length === 0) {
                  return (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-white">Aún no hay puntuaciones registradas en esta rama.</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        ¡Jugá una partida en esta materia para inaugurar la tabla de posiciones oficiales!
                      </p>
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-[10px] md:text-xs font-black uppercase">
                        <th className="pb-3 px-2 text-center">Pos</th>
                        <th className="pb-3 px-2">Estudiante</th>
                        <th className="pb-3 px-2 text-center">Rango Jurídico</th>
                        <th className="pb-3 px-2 text-center hidden sm:table-cell">Aciertos</th>
                        <th className="pb-3 px-2 text-right">Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {processedList.map((u) => {
                        const isTop1 = u.posicion === 1;
                        const isTop2 = u.posicion === 2;
                        const isTop3 = u.posicion === 3;
                        const isMe = u.id === user?.id || u.nombre === userName;

                        return (
                          <tr key={u.id} className={cn("hover:bg-white/[0.02] transition-colors", isMe && "bg-red-500/10")}>
                            <td className="py-3 px-2 text-center">
                              <span className={cn(
                                "inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs",
                                isTop1 && "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20",
                                isTop2 && "bg-slate-300 text-slate-950",
                                isTop3 && "bg-amber-700 text-white",
                                !isTop1 && !isTop2 && !isTop3 && "bg-white/10 text-slate-300"
                              )}>
                                {u.posicion}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-bold text-white">
                              <div className="flex items-center gap-2">
                                <span>{u.nombre}</span>
                                {isMe && (
                                  <span className="text-[8px] bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded-full font-black uppercase">Tú</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider", u.rango.badgeStyle)}>
                                {u.rango.nombre}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center font-bold text-emerald-400 hidden sm:table-cell">
                              {u.aciertosPorcentaje}%
                            </td>
                            <td className="py-3 px-2 text-right font-black text-amber-400 text-sm md:text-base">
                              {u.displayPts} PTS
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* MODO EN JUEGO (OPTIMIZADO PARA MÓVIL) */}
        {inGame && !gameOver && currentQuestion && (
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 shadow-2xl relative"
          >
            {/* GAME STATUS BAR */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] md:text-xs font-black uppercase">
                  {currentQuestion.categoria_nombre}
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-black uppercase border",
                  currentQuestion.dificultad === "facil" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                  currentQuestion.dificultad === "media" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                  currentQuestion.dificultad === "dificil" && "bg-red-500/20 text-red-400 border-red-500/30"
                )}>
                  +{currentQuestion.puntos_base} PTS
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1 text-amber-400 font-black">
                  <Flame className="w-4 h-4" />
                  <span>{streak}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-black">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{score} PTS</span>
                </div>
              </div>
            </div>

            {/* PROGRESS BAR & TIMER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Pregunta {currentIndex + 1} de {questionsPool.length}</span>
                <span className={cn("flex items-center gap-1 font-mono text-xs font-black", timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-slate-200")}>
                  <Timer className="w-3.5 h-3.5" /> {timeLeft}s
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-600 to-amber-500 h-2 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questionsPool.length) * 100}%` }}
                />
              </div>
            </div>

            {/* COMODINES DE CÁTEDRA */}
            {!isAnswered && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Comodines de Cátedra:</span>
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                  <button
                    onClick={use5050}
                    disabled={lifelines.used5050}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer border min-h-[34px]",
                      lifelines.used5050
                        ? "bg-white/5 text-slate-600 border-white/5 cursor-not-allowed"
                        : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30"
                    )}
                    title="Elimina 2 opciones incorrectas"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>50:50</span>
                  </button>

                  <button
                    onClick={useHint}
                    disabled={lifelines.usedHint}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer border min-h-[34px]",
                      lifelines.usedHint
                        ? "bg-white/5 text-slate-600 border-white/5 cursor-not-allowed"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                    )}
                    title="Muestra la norma o jurisprudencia de la pregunta"
                  >
                    <BookOpenCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pista</span>
                  </button>

                  <button
                    onClick={useExtraTime}
                    disabled={lifelines.usedExtraTime}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer border min-h-[34px]",
                      lifelines.usedExtraTime
                        ? "bg-white/5 text-slate-600 border-white/5 cursor-not-allowed"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                    )}
                    title="Suma +10 segundos al temporizador"
                  >
                    <Timer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+10s</span>
                  </button>
                </div>
              </div>
            )}

            {/* PISTA MOSTRADA */}
            {showHint && !isAnswered && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <BookOpenCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[10px] uppercase text-amber-400">Pista de Cátedra:</p>
                  <p className="italic text-[11px]">{currentQuestion.fundamento_juridico}</p>
                </div>
              </div>
            )}

            {/* ENUNCIADO DE LA PREGUNTA */}
            <div className="py-1">
              <h2 className="text-base md:text-xl font-bold leading-relaxed text-white">
                {currentQuestion.pregunta}
              </h2>
            </div>

            {/* OPCIONES DE RESPUESTA CON BOTONES TÁCTILES */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQuestion.opciones.map((opcion, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.respuesta_correcta_index;
                const isDisabledBy5050 = disabledOptions.includes(idx);
                
                let btnStyle = "bg-white/[0.02] border-white/10 text-slate-200 active:bg-white/10";

                if (isDisabledBy5050) {
                  btnStyle = "bg-white/[0.01] border-white/5 opacity-20 pointer-events-none text-slate-600 line-through";
                } else if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/10";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-red-500/20 border-red-500 text-red-200 font-bold";
                  } else {
                    btnStyle = "bg-white/[0.01] border-white/5 opacity-40 text-slate-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered || isDisabledBy5050}
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      "w-full p-3.5 md:p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer text-xs md:text-sm min-h-[48px]",
                      btnStyle
                    )}
                  >
                    <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opcion}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* FUNDAMENTO JURÍDICO Y SIGUIENTE */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-white/10"
                >
                  <div className="p-3 md:p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs md:text-sm space-y-1">
                    <p className="font-black text-[10px] uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                      <BookOpenCheck className="w-3.5 h-3.5" /> Fundamento Jurídico Oficial:
                    </p>
                    <p className="leading-relaxed italic text-[11px] md:text-xs">{currentQuestion.fundamento_juridico}</p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={nextQuestion}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] text-xs uppercase tracking-wider"
                    >
                      <span>Siguiente Pregunta</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* FIN DE JUEGO */}
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 text-center space-y-5 shadow-2xl max-w-lg mx-auto"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">¡Partida Completada!</h2>
              <p className="text-slate-400 text-xs">Puntos registrados en tu cuenta de <strong className="text-white">{userName}</strong>.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Puntaje Ganado</p>
                <p className="text-2xl font-black text-red-400">+{score} PTS</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Aciertos</p>
                <p className="text-2xl font-black text-emerald-400">{correctAnswersCount} / {questionsPool.length}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              <button
                onClick={startGame}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] text-xs uppercase"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jugar Otra Vez</span>
              </button>

              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] text-xs uppercase"
              >
                <BookOpenCheck className="w-4 h-4 text-indigo-300" />
                <span>Repasar Explicaciones</span>
              </button>

              <button
                onClick={() => { setInGame(false); setActiveTab("ranking"); }}
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] text-xs uppercase"
              >
                <Trophy className="w-4 h-4" />
                <span>Ver Mi Posición</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* MODAL DE ESCALA DE RANGOS JURÍDICOS */}
        <AnimatePresence>
          {showRangosModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/15 rounded-3xl p-5 md:p-6 max-w-2xl w-full space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-2xl text-amber-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-black text-white">Escala de Rangos Jurídicos</h2>
                      <p className="text-xs text-slate-400">Escalafón de carrera según los puntos acumulados en el juego</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRangosModal(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {RANGOS_JURIDICOS.map((rango) => {
                    const RIcon = ICON_MAP[rango.iconoNombre] || BookOpen;
                    const isUserCurrentRank = rangoActual.id === rango.id;
                    return (
                      <div 
                        key={rango.id}
                        className={cn(
                          "p-3.5 md:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden",
                          isUserCurrentRank 
                            ? "bg-gradient-to-r from-amber-500/15 via-slate-800 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40" 
                            : "bg-white/[0.02] border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("p-3 rounded-2xl bg-gradient-to-br text-white shadow-md shrink-0", rango.colorGradient)}>
                            <RIcon className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-xs md:text-sm text-white">{rango.nombre}</h3>
                              {isUserCurrentRank && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                                  ⭐ Tu Rango Actual
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] md:text-xs text-slate-400 mt-0.5">{rango.descripcion}</p>
                          </div>
                        </div>

                        <div className="shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Puntaje Requerido</span>
                          <span className="font-black text-amber-400 text-xs md:text-sm">
                            {rango.maxPuntos === Infinity 
                              ? `${rango.minPuntos.toLocaleString()} + PTS` 
                              : `${rango.minPuntos.toLocaleString()} – ${rango.maxPuntos.toLocaleString()} PTS`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowRangosModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL DE REPASO DE ERRORES Y FUNDAMENTOS */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/15 rounded-3xl p-5 md:p-6 max-w-3xl w-full space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                      <BookOpenCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-black text-white">Repaso de la Partida</h2>
                      <p className="text-xs text-slate-400">Revisión de respuestas y fundamentos jurídicos oficiales</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {gameHistory.map((item, qIdx) => {
                    const q = item.question;
                    return (
                      <div 
                        key={qIdx}
                        className={cn(
                          "p-4 rounded-2xl border space-y-3",
                          item.isCorrect 
                            ? "bg-emerald-500/[0.03] border-emerald-500/30" 
                            : "bg-red-500/[0.03] border-red-500/30"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase border",
                              item.isCorrect ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-red-500/20 text-red-300 border-red-500/40"
                            )}>
                              {item.isCorrect ? "Correcta ✓" : "Incorrecta ✕"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{q.categoria_nombre}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400">Pregunta {qIdx + 1}</span>
                        </div>

                        <p className="font-bold text-sm text-white">{q.pregunta}</p>

                        <div className="space-y-1.5 text-xs">
                          {q.opciones.map((op, oIdx) => {
                            const isCorrectOpt = oIdx === q.respuesta_correcta_index;
                            const isUserSelected = oIdx === item.userOptionIndex;

                            return (
                              <div 
                                key={oIdx}
                                className={cn(
                                  "p-2.5 rounded-xl border flex items-center justify-between text-xs",
                                  isCorrectOpt && "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold",
                                  isUserSelected && !isCorrectOpt && "bg-red-500/20 border-red-500/50 text-red-200 line-through",
                                  !isCorrectOpt && !isUserSelected && "bg-white/[0.01] border-white/5 text-slate-400 opacity-60"
                                )}
                              >
                                <span>{String.fromCharCode(65 + oIdx)}. {op}</span>
                                {isCorrectOpt && <span className="text-[10px] uppercase font-black text-emerald-400 ml-2">Correcta</span>}
                                {isUserSelected && !isCorrectOpt && <span className="text-[10px] uppercase font-black text-red-400 ml-2">Tu Elección</span>}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs space-y-1">
                          <p className="font-black text-[10px] uppercase text-indigo-400 flex items-center gap-1">
                            <BookOpenCheck className="w-3.5 h-3.5" /> Fundamento Jurídico Oficial:
                          </p>
                          <p className="italic text-[11px] leading-relaxed">{q.fundamento_juridico}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Cerrar Repaso
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
