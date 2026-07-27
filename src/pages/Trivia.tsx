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
  Lock
} from "lucide-react";
import { 
  TRIVIA_QUESTIONS, 
  CATEGORIAS_TRIVIA, 
  MOCK_LEADERBOARD,
  TriviaQuestion, 
  LeaderboardEntry 
} from "@/data/triviaData";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  Scale,
  ShieldAlert,
  Landmark,
  FileText,
  MapPin,
  Building2,
  GraduationCap
};

export default function Trivia() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"juego" | "ranking">("juego");
  
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
  
  // Timer por pregunta (15s)
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  
  // User Stats & Leaderboard
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>("todas");
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState({
    totalJugadas: 0,
    totalCorrectas: 0,
    puntosTotales: 0,
    mejorRacha: 0
  });

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Estudiante Jursoc";
  const isAdmin = profile?.role === "admin";

  const fetchLeaderboardAndStats = async () => {
    if (!user) return;

    let currentStats = { ...userStats };
    const savedStats = localStorage.getItem(`dnd_trivia_stats_${user.id}`);
    if (savedStats) {
      try {
        currentStats = JSON.parse(savedStats);
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
          mejorRacha: (statsData as any).mejor_racha || 0
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
              aciertosPorcentaje: Math.round((currentStats.totalCorrectas / Math.max(1, currentStats.totalJugadas)) * 100),
              racha: currentStats.mejorRacha,
              avatarUrl: profile?.avatar_url
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
            aciertosPorcentaje: Math.round((currentStats.totalCorrectas / Math.max(1, currentStats.totalJugadas)) * 100),
            racha: currentStats.mejorRacha,
            avatarUrl: profile?.avatar_url
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

    const updatedStats = {
      totalJugadas: newTotalJugadas,
      totalCorrectas: newTotalCorrectas,
      puntosTotales: newPuntosTotales,
      mejorRacha: newMejorRacha
    };

    setUserStats(updatedStats);
    localStorage.setItem(`dnd_trivia_stats_${user.id}`, JSON.stringify(updatedStats));

    const myEntry: LeaderboardEntry = {
      id: user.id,
      posicion: 1,
      nombre: userName,
      facultad: "Jursoc UNLP",
      materiaFav: selectedCategoria === "todas" ? "Derecho General" : (CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria)?.nombre || "Derecho"),
      puntos: newPuntosTotales,
      aciertosPorcentaje: Math.round((newTotalCorrectas / Math.max(1, newTotalJugadas)) * 100),
      racha: newMejorRacha,
      avatarUrl: profile?.avatar_url
    };

    // Actualización inmediata en pantalla
    setLeaderboardList(prev => {
      const filtered = prev.filter(e => e.id !== user.id && e.nombre !== userName);
      const combined = [...filtered, myEntry].sort((a, b) => b.puntos - a.puntos);
      return combined.map((e, idx) => ({ ...e, posicion: idx + 1 }));
    });

    // Guardado resiliente en Supabase (partida + upsert directo a estadísticas)
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

    const newIds = selected.map(q => q.id);
    setUsedQuestionIds(prev => Array.from(new Set([...prev, ...newIds])));

    setQuestionsPool(selected);
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
  };

  const currentQuestion = questionsPool[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.respuesta_correcta_index;

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
            {/* USER PROFILE INFO BANNER */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={userName} className="w-10 h-10 rounded-full object-cover border border-red-500/40" />
                ) : (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Usuario Vinculado</p>
                  <p className="text-sm font-black text-white">{userName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-300 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Partidas</span>
                  <span className="text-sm text-white font-black">{userStats.totalJugadas}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Aciertos</span>
                  <span className="text-sm text-emerald-400 font-black">{userStats.totalCorrectas}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Puntos</span>
                  <span className="text-sm text-amber-400 font-black">{userStats.puntosTotales} PTS</span>
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

        {/* PESTAÑA: TOP RANKINGS */}
        {!inGame && activeTab === "ranking" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-6"
          >
            {/* FILTROS LEADERBOARD */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/10 p-3.5 md:p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-sm md:text-base text-white">Tabla de Posiciones Universitarias</h2>
              </div>

              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setLeaderboardFilter("todas")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[32px]",
                    leaderboardFilter === "todas" ? "bg-amber-500 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"
                  )}
                >
                  Top General
                </button>
                {CATEGORIAS_TRIVIA.slice(0, 3).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setLeaderboardFilter(cat.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[32px]",
                      leaderboardFilter === cat.id ? "bg-amber-500 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"
                    )}
                  >
                    Top {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLA RESPONSIVA DE POSICIONES */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 md:p-6 overflow-x-auto shadow-2xl">
              {filteredLeaderboard.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white">Aún no hay puntuaciones en esta clasificación.</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    ¡Sé el primero en jugar y registrar tus puntos oficiales en la tabla de posiciones!
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[10px] md:text-xs font-black uppercase">
                      <th className="pb-3 px-2 text-center">Pos</th>
                      <th className="pb-3 px-2">Estudiante</th>
                      <th className="pb-3 px-2 hidden sm:table-cell">Materia Fav</th>
                      <th className="pb-3 px-2 text-center">Aciertos</th>
                      <th className="pb-3 px-2 text-right">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeaderboard.map((u) => {
                      const isTop1 = u.posicion === 1;
                      const isTop2 = u.posicion === 2;
                      const isTop3 = u.posicion === 3;
                      const isMe = u.id === user.id || u.nombre === userName;

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
                          <td className="py-3 px-2 text-slate-400 hidden sm:table-cell">
                            {u.materiaFav}
                          </td>
                          <td className="py-3 px-2 text-center font-bold text-emerald-400">
                            {u.aciertosPorcentaje}%
                          </td>
                          <td className="py-3 px-2 text-right font-black text-white text-sm md:text-base">
                            {u.puntos} PTS
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
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
                
                let btnStyle = "bg-white/[0.02] border-white/10 text-slate-200 active:bg-white/10";

                if (isAnswered) {
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
                    disabled={isAnswered}
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
                onClick={() => { setInGame(false); setActiveTab("ranking"); }}
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px] text-xs uppercase"
              >
                <Trophy className="w-4 h-4" />
                <span>Ver Mi Posición</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
