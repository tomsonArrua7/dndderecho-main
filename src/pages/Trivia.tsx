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
  Zap,
  Plus
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

export default function Trivia() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Pestañas Principales: "evaluacion" | "duelos" | "ranking"
  const [activeTab, setActiveTab] = useState<"evaluacion" | "duelos" | "ranking">("evaluacion");
  const [showRangosModal, setShowRangosModal] = useState(false);

  // Filtro de Año de Carrera: 0 = Toda la Carrera, 1 = 1º Año, 2 = 2º Año, 3 = 3º Año, 4 = 4º Año, 5 = 5º Año
  const [selectedYearFilter, setSelectedYearFilter] = useState<number>(0);
  
  // Estado de Duelos 1v1
  const [duelosList, setDuelosList] = useState<DueloTrivia[]>(() => {
    try {
      const saved = localStorage.getItem("dnd_duelos_list");
      return saved ? JSON.parse(saved) : [
        {
          id: "DND-829",
          esPublico: true,
          materiaId: "todas",
          materiaNombre: "Toda la Carrera",
          preguntasIds: [],
          player1Id: "p1_mock",
          player1Nombre: "Dr. Gonzalo Arrua",
          player1Aciertos: 5,
          player1TiempoMs: 14000,
          player1Puntos: 120,
          player1Completed: true,
          status: "esperando_rival",
          createdAt: "Hoy 17:30"
        }
      ];
    } catch {
      return [];
    }
  });

  const [inputCodigoDuelo, setInputCodigoDuelo] = useState("");
  const [createdDueloModal, setCreatedDueloModal] = useState<DueloTrivia | null>(null);
  const [dueloFilterTab, setDueloFilterTab] = useState<"publicas" | "mis_duelos">("publicas");
  const [copiedCode, setCopiedCode] = useState(false);

  // Filtros de juego Solo
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [selectedDificultad, setSelectedDificultad] = useState<string>("todas");
  const [questionsCount, setQuestionsCount] = useState<number>(5);

  // Estado del juego solo
  const [inGame, setInGame] = useState(false);
  const [questionsPool, setQuestionsPool] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Timer por pregunta
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  // Estadísticas del usuario acumuladas
  const [userStats, setUserStats] = useState<{
    totalJugadas: number;
    totalCorrectas: number;
    puntosTotales: number;
    mejorRacha: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(`dnd_trivia_user_stats`);
      return saved ? JSON.parse(saved) : { totalJugadas: 6, totalCorrectas: 28, puntosTotales: 863, mejorRacha: 8 };
    } catch {
      return { totalJugadas: 6, totalCorrectas: 28, puntosTotales: 863, mejorRacha: 8 };
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

  // Persistir duelos
  useEffect(() => {
    try {
      localStorage.setItem("dnd_duelos_list", JSON.stringify(duelosList));
    } catch {
      // Ignorar
    }
  }, [duelosList]);

  // Persistir stats
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

  // Iniciar Trivia Solo
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
    setTimeLeft(15);
    setInGame(true);
  };

  // Crear Duelo 1vs1
  const handleCreateDuelo = (esPublico: boolean) => {
    const randomCode = `DND-${Math.floor(100 + Math.random() * 900)}`;
    const cat = CATEGORIAS_TRIVIA.find(c => c.id === selectedCategoria) || CATEGORIAS_TRIVIA[0];

    const nuevoDuelo: DueloTrivia = {
      id: randomCode,
      esPublico,
      materiaId: cat.id,
      materiaNombre: cat.nombre,
      preguntasIds: TRIVIA_QUESTIONS.slice(0, 5).map(q => q.id),
      player1Id: user?.id || "p1_anon",
      player1Nombre: userName,
      player1Aciertos: 0,
      player1TiempoMs: 0,
      player1Puntos: 0,
      player1Completed: false,
      status: "esperando_rival",
      createdAt: "Recién creado"
    };

    setDuelosList(prev => [nuevoDuelo, ...prev]);
    setCreatedDueloModal(nuevoDuelo);
  };

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(optionIdx);

    const currentQ = questionsPool[currentIndex];
    const isCorrect = optionIdx === currentQ.respuesta_correcta_index;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 1.5);
      const streakBonus = streak * 5;
      const basePoints = currentQ.puntos_base || 10;
      const pointsEarned = Math.max(5, basePoints + timeBonus + streakBonus);

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

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionsPool.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameOver(true);
    setUserStats(prev => ({
      totalJugadas: prev.totalJugadas + 1,
      totalCorrectas: prev.totalCorrectas + correctAnswersCount,
      puntosTotales: prev.puntosTotales + score,
      mejorRacha: Math.max(prev.mejorRacha, maxStreak)
    }));
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
      <div className="min-h-screen bg-[#050B14] text-white py-8 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-2xl w-full bg-[#0D1527] border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-xl">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0A1C3D]/40 text-blue-300 text-xs font-black uppercase tracking-wider border border-[#0F2A5C]/50">
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

          <div className="space-y-3">
            <h3 className="text-base md:text-xl font-bold text-white leading-relaxed">
              {currentQ.pregunta}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQ.opciones.map((opc, idx) => {
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
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all text-xs md:text-sm flex items-center justify-between gap-3 cursor-pointer min-h-[50px]",
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

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#0A1C3D]/20 border border-[#0F2A5C]/40 text-blue-200 text-xs space-y-1.5"
            >
              <span className="font-black uppercase tracking-wider text-[10px] text-blue-300 block flex items-center gap-1">
                <BookOpenCheck className="w-3.5 h-3.5" /> Fundamento Normativo:
              </span>
              <p className="leading-relaxed text-slate-300">{currentQ.fundamento_juridico}</p>
            </motion.div>
          )}

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
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
            <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
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
                            ? "bg-[#0A1C3D] border-[#0F2A5C] text-white shadow-lg"
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
                            ? "bg-[#0A1C3D] border-[#0F2A5C] text-white shadow-lg"
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[52px]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Comenzar Evaluación Trivia ({questionsCount} Preguntas)</span>
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: DUELOS 1VS1 (SALAS DE DESAFÍO) */}
        {activeTab === "duelos" && (
          <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" />
                  <span>Salas de Duelo 1vs1 Académico</span>
                </h3>
                <p className="text-xs text-slate-400">Creá salas de competencia directa por materia o sumate por código de invitación.</p>
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
                    if (match) handleStartGame();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1C3D] hover:bg-[#0F2A5C] text-white font-black text-xs uppercase cursor-pointer shrink-0"
                >
                  Unirme
                </button>
              </div>
            </div>

            {/* LISTA DE SALAS DISPONIBLES */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Salas Públicas en Espera:</h4>
              {duelosList.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No hay salas de duelo públicas en espera. ¡Creá una nueva!</p>
              ) : (
                <div className="space-y-2.5">
                  {duelosList.map((duelo) => {
                    const isOwnRoom = duelo.player1Id === user?.id || duelo.player1Nombre === userName;

                    return (
                      <div
                        key={duelo.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                              {duelo.id}
                            </span>
                            <span className="text-xs font-black text-white">{duelo.materiaNombre}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">Creado por: <span className="text-blue-300 font-bold">{duelo.player1Nombre}</span></p>
                        </div>

                        {isOwnRoom ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold font-mono">
                              ⏳ Tu Sala (Esperando Rival)
                            </span>
                            <button
                              onClick={() => setDuelosList(prev => prev.filter(d => d.id !== duelo.id))}
                              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                              title="Eliminar Sala"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleStartGame}
                            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase cursor-pointer"
                          >
                            Aceptar Duelo 1v1
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: RANKING GENERAL ÚNICO */}
        {activeTab === "ranking" && (
          <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Tabla del Ranking General Único</span>
              </h3>
              <p className="text-xs text-slate-400">Ordenado por puntaje histórico acumulado de usuarios reales.</p>
            </div>

            <div className="space-y-2.5">
              {/* USUARIO ACTUAL EN RANKING */}
              <div className="p-4 rounded-2xl bg-[#0A1C3D]/40 border border-[#0F2A5C] flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center font-mono">
                    #1
                  </span>
                  <div>
                    <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                      <span>{userName}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">(Tú)</span>
                    </h4>
                    <p className="text-[11px] text-blue-300 font-bold">{rangoActual.nombre}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-red-400 font-mono">{userStats.puntosTotales} PTS</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Racha x{userStats.mejorRacha}</span>
                </div>
              </div>

              {MOCK_LEADERBOARD.length === 0 && (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                  <Trophy className="w-8 h-8 mx-auto text-amber-400 opacity-60" />
                  <h4 className="font-black text-sm text-white">¡Encabezás el Ranking General Único!</h4>
                  <p className="text-xs text-slate-400">Se han eliminado todos los perfiles ficticios. ¡Sumá más puntos en evaluaciones y duelos para defender tu posición!</p>
                </div>
              )}
            </div>
          </div>
        )}

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

      </div>
    </div>
  );
}
