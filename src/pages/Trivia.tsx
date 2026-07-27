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
  Zap
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
  Gavel,
  Sparkles,
  Users,
  Coins,
  Globe,
  Shield,
  Leaf,
  Award,
  BookOpenCheck
};

export default function Trivia() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"juego" | "duelos" | "ranking">("juego");
  const [showRangosModal, setShowRangosModal] = useState(false);

  // Filtro de Año de Carrera: 0 = Toda la Carrera, 1 = 1º Año, 2 = 2º Año, 3 = 3º Año, 4 = 4º Año, 5 = 5º Año
  const [selectedYearFilter, setSelectedYearFilter] = useState<number>(0);
  
  // Estado de Duelos 1v1
  const [duelosList, setDuelosList] = useState<DueloTrivia[]>([]);
  const [inputCodigoDuelo, setInputCodigoDuelo] = useState("");
  const [currentDuelo, setCurrentDuelo] = useState<DueloTrivia | null>(null);
  const [dueloRole, setDueloRole] = useState<"player1" | "player2" | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [dueloVersusModal, setDueloVersusModal] = useState<DueloTrivia | null>(null);
  const [createdDueloModal, setCreatedDueloModal] = useState<DueloTrivia | null>(null);
  const [dueloFilterTab, setDueloFilterTab] = useState<"publicas" | "mis_duelos">("publicas");
  
  // Filtros de juego
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [selectedDificultad, setSelectedDificultad] = useState<string>("todas");
  const [questionsCount, setQuestionsCount] = useState<number>(5);

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
  
  // Comodines
  const [lifelines, setLifelines] = useState({
    used5050: false,
    usedHint: false,
    usedExtraTime: false
  });
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [currentQuestionPenalty, setCurrentQuestionPenalty] = useState(0);

  // Historial de la Partida
  const [gameHistory, setGameHistory] = useState<Array<{
    question: TriviaQuestion;
    userOptionIndex: number | null;
    isCorrect: boolean;
  }>>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Timer por pregunta
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

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Estudiante de Abogacía";
  const isAdmin = profile?.role === "admin";

  const rangoActual = calcularRango(userStats.puntosTotales);
  const RangoIcon = ICON_MAP[rangoActual.iconoNombre] || BookOpen;

  const proximoRangoIndex = RANGOS_JURIDICOS.findIndex(r => r.id === rangoActual.id) + 1;
  const proximoRango = RANGOS_JURIDICOS[proximoRangoIndex] || null;
  const progresoPorcentaje = proximoRango
    ? Math.min(100, Math.round(((userStats.puntosTotales - rangoActual.minPuntos) / (proximoRango.minPuntos - rangoActual.minPuntos)) * 100))
    : 100;

  // Filtrado de Categorías según el Año Seleccionado
  const filteredCategorias = selectedYearFilter === 0
    ? CATEGORIAS_TRIVIA
    : CATEGORIAS_TRIVIA.filter(cat => cat.anio === selectedYearFilter || cat.id === "todas");

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

  // Cargar estadísticas del usuario
  useEffect(() => {
    if (!user) return;
    try {
      const savedStats = localStorage.getItem(`dnd_trivia_stats_${user.id}`);
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }
    } catch {
      // Ignorar
    }
  }, [user]);

  // Iniciar Trivia
  const handleStartGame = () => {
    let pool = [...TRIVIA_QUESTIONS];

    if (selectedCategoria !== "todas") {
      pool = pool.filter(q => q.id_categoria === selectedCategoria);
    }

    if (selectedDificultad !== "todas") {
      pool = pool.filter(q => q.dificultad === selectedDificultad);
    }

    if (pool.length === 0) {
      pool = [...TRIVIA_QUESTIONS];
    }

    // Mezclar aleatoriamente las preguntas
    pool = pool.sort(() => 0.5 - Math.random());
    const finalPool = pool.slice(0, Math.min(questionsCount, pool.length));

    setQuestionsPool(finalPool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameOver(false);
    setGameHistory([]);
    setLifelines({ used5050: false, usedHint: false, usedExtraTime: false });
    setDisabledOptions([]);
    setShowHint(false);
    setCurrentQuestionPenalty(0);
    setTimeLeft(15);
    setInGame(true);
  };

  // Responder pregunta
  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(optionIdx);

    const currentQ = questionsPool[currentIndex];
    const isCorrect = optionIdx === currentQ.respuesta_correcta_index;

    setGameHistory(prev => [...prev, {
      question: currentQ,
      userOptionIndex: optionIdx,
      isCorrect
    }]);

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 1.5);
      const streakBonus = streak * 5;
      const basePoints = currentQ.puntos_base || 10;
      const pointsEarned = Math.max(5, basePoints + timeBonus + streakBonus - currentQuestionPenalty);

      setScore(prev => prev + pointsEarned);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // Siguiente Pregunta
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionsPool.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setDisabledOptions([]);
      setShowHint(false);
      setCurrentQuestionPenalty(0);
    } else {
      finishGame();
    }
  };

  // Finalizar Partida
  const finishGame = () => {
    setGameOver(true);

    if (!user) return;

    const newStats = {
      totalJugadas: userStats.totalJugadas + 1,
      totalCorrectas: userStats.totalCorrectas + correctAnswersCount,
      puntosTotales: userStats.puntosTotales + score,
      mejorRacha: Math.max(userStats.mejorRacha, maxStreak),
      puntosPorCategoria: {
        ...userStats.puntosPorCategoria,
        [selectedCategoria]: (userStats.puntosPorCategoria[selectedCategoria] || 0) + score
      }
    };

    setUserStats(newStats);
    try {
      localStorage.setItem(`dnd_trivia_stats_${user.id}`, JSON.stringify(newStats));
    } catch {
      // Ignorar
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

    return (
      <div className="min-h-screen bg-[#070A14] text-white py-8 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-2xl w-full bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-xl">
          
          {/* BARRA SUPERIOR DE TIEMPO Y RACHA */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-500/30">
                Pregunta {currentIndex + 1} de {questionsPool.length}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                [{currentQ.categoria_nombre}]
              </span>
            </div>

            <div className="flex items-center gap-4">
              {streak > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30 animate-pulse">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Racha x{streak}</span>
                </div>
              )}

              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-black text-sm border",
                timeLeft <= 5 ? "bg-red-500/20 text-red-400 border-red-500/40 animate-bounce" : "bg-white/10 text-white border-white/10"
              )}>
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* PREGUNTA */}
          <div className="space-y-3">
            <h3 className="text-base md:text-xl font-bold text-white leading-relaxed">
              {currentQ.pregunta}
            </h3>
          </div>

          {/* OPCIONES DE RESPUESTA */}
          <div className="space-y-3">
            {currentQ.opciones.map((opc, idx) => {
              const isDisabled = disabledOptions.includes(idx);
              const isSelected = selectedOption === idx;
              const isRight = idx === currentQ.respuesta_correcta_index;

              let style = "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white";

              if (isAnswered) {
                if (isRight) style = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-950/40";
                else if (isSelected && !isRight) style = "bg-red-600/30 border-red-500 text-red-200 font-bold";
                else style = "bg-slate-950/40 border-white/5 text-slate-500 opacity-40";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered || isDisabled}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all text-xs md:text-sm flex items-center justify-between gap-3 cursor-pointer min-h-[50px]",
                    isDisabled && "opacity-20 cursor-not-allowed",
                    style
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opc}</span>
                  </div>

                  {isAnswered && isRight && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isRight && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* FUNDAMENTO JURÍDICO AL RESPONDER */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs space-y-1.5"
            >
              <span className="font-black uppercase tracking-wider text-[10px] text-indigo-300 block flex items-center gap-1">
                <BookOpenCheck className="w-3.5 h-3.5" /> Fundamento Normativo / Doctrinario:
              </span>
              <p className="leading-relaxed text-slate-300">{currentQ.fundamento_juridico}</p>
            </motion.div>
          )}

          {/* BOTÓN CONTINUAR */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{isLastQuestion ? "Ver Resultados de Partida" : "Siguiente Pregunta"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    );
  }

  // Renderizar Pantalla de Resultados de Partida (Game Over)
  if (gameOver) {
    return (
      <div className="min-h-screen bg-[#070A14] text-white py-12 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg w-full bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
              PARTIDA FINALIZADA
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white pt-2">Resumen de Evaluación</h2>
            <p className="text-xs text-slate-400">Puntaje obtenido: <span className="text-amber-400 font-mono font-black text-base">+{score} PTS</span></p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-bold">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-black">Aciertos</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{correctAnswersCount} / {questionsPool.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-black">Precisión</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {Math.round((correctAnswersCount / questionsPool.length) * 100)}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-black">Mejor Racha</span>
              <span className="text-lg font-black text-indigo-400 font-mono">x{maxStreak}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Partida</span>
            </button>
            <button
              onClick={() => setInGame(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              Volver al Menú de Materias
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA PRINCIPAL CON NAVEGACIÓN POR AÑO DE CARRERA
  return (
    <div className="min-h-screen bg-[#070A14] text-white py-8 md:py-12 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER PRINCIPAL */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-widest">
            <Scale className="w-4 h-4" />
            <span>Trivia Académica — Plan de Estudios Abogacía</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            EVALUACIÓN POR MATERIAS
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Poné a prueba tu conocimiento técnico recorriendo cada año de la carrera de abogacía o deslumbrá en el examen integral de Toda la Carrera.
          </p>

          {/* TARJETA DE RANGO Y PUNTOS DEL USUARIO */}
          <div className="max-w-md mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/15 flex items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <RangoIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">Tu Rango Actual:</span>
                  <h4 className="font-black text-sm text-white">{rangoActual.nombre}</h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Puntos Totales</span>
                <span className="text-lg font-black text-amber-400 font-mono">{userStats.puntosTotales} PTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* SELECTOR DE AÑOS DEL PLAN DE ESTUDIOS */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {[
            { id: 0, label: "Toda la Carrera", icon: Sparkles },
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
                  "px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border shadow-md",
                  isSelected
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500 text-white shadow-indigo-600/30 scale-105"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                <ItemIcon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* GRID DE SELECCIÓN DE MATERIA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>
                {selectedYearFilter === 0 ? "Examen Integral Multi-Materia" : `Materias de ${selectedYearFilter}º Año`}
              </span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {filteredCategorias.length} Opción(es) Disponible(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCategorias.map((cat) => {
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
                      ? "bg-gradient-to-br from-indigo-900/60 via-slate-900 to-violet-900/60 border-indigo-500 text-white shadow-indigo-900/30"
                      : "bg-slate-900/80 border-white/10 hover:border-white/25 hover:bg-slate-900/90 text-slate-300"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center border font-bold",
                        isSelected ? "bg-indigo-500/30 border-indigo-500 text-indigo-300" : "bg-white/5 border-white/10 text-slate-400 group-hover:text-white"
                      )}>
                        <CatIcon className="w-5 h-5" />
                      </div>

                      {cat.anio > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-slate-300 border border-white/10">
                          {cat.anio}º Año
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Global
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-indigo-300 transition-colors">
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
                    <div className="flex items-center gap-1 text-indigo-400 font-black">
                      <span>Seleccionar</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CONFIGURACIÓN Y BOTÓN INICIAR */}
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Cantidad de Preguntas:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionsCount(cnt)}
                    className={cn(
                      "py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer font-mono",
                      questionsCount === cnt
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                    )}
                  >
                    {cnt} Preguntas
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Nivel de Dificultad:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "todas", label: "Todas" },
                  { id: "facil", label: "Fácil" },
                  { id: "media", label: "Media" }
                ].map((dif) => (
                  <button
                    key={dif.id}
                    onClick={() => setSelectedDificultad(dif.id)}
                    className={cn(
                      "py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer",
                      selectedDificultad === dif.id
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]"
                    )}
                  >
                    {dif.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[52px]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Comenzar Evaluación Trivia ({questionsCount} Preguntas)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
