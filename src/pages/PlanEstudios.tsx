import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  MATERIAS_PLAN6,
  TOTAL_MATERIAS_PLAN6,
  calcularPorcentaje,
  getEstadoVisual,
  EstadoMateria,
  Materia,
} from "@/data/plan6Structure";
import {
  MATERIAS_PLAN5,
  TOTAL_MATERIAS_PLAN5,
  calcularPorcentajePlan5,
  getEstadoVisualPlan5,
} from "@/data/plan5Structure";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, ArrowLeft, GraduationCap, ChevronRight,
  CheckCircle2, Maximize2, Minimize2,
  Lock, BookOpen, Check, HelpCircle, FileText, Info
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

type PlanId = "plan5" | "plan6";

interface PlanMeta {
  id:            PlanId;
  nombre:        string;
  descripcion:   string;
  tag:           string | null;
  totalMaterias: number;
  features:      string[];
}

const PLANES_META: PlanMeta[] = [
  {
    id:            "plan6",
    nombre:        "Plan de Estudios Nº 6 (Vigente 2019)",
    descripcion:   "Plan moderno con enfoque en destrezas de litigación, mediación y talleres de idioma prácticos.",
    tag:           "Vigente",
    totalMaterias: TOTAL_MATERIAS_PLAN6,
    features: [
      "Estructura columnar por años",
      "Talleres de lecto-comprensión integrados",
      "Prácticas Supervisadas Pre-profesionales",
    ],
  },
  {
    id:            "plan5",
    nombre:        "Plan de Estudios Nº 5 (Histórico)",
    descripcion:   "Plan de estudios tradicional de la facultad con régimen opcional de cursadas y correlatividades clásicas.",
    tag:           "Histórico",
    totalMaterias: TOTAL_MATERIAS_PLAN5,
    features: [
      "Estructura clásica Jursoc",
      "Prácticas de procedimiento unificadas",
      "15 materias aprobadas para seminarios",
    ],
  },
];

const getPPSHours = (estadoStr: string) => {
  if (estadoStr === "aprobada") return 172;
  if (estadoStr && estadoStr.startsWith("horas:")) {
    return parseInt(estadoStr.split(":")[1]) || 0;
  }
  return 0;
};

// ── Componentes de UI Académicos ───────────────────────────────────────

const StatPill = ({ value, label, colorClass }: { value: number | string; label: string; colorClass: string }) => (
  <div
    className="flex flex-col items-center justify-center rounded-xl border border-white/10 px-5 py-3 min-w-[110px] bg-card/60 backdrop-blur-sm transition-all"
  >
    <span className={cn("text-2xl font-serif font-bold tracking-tight", colorClass)}>{value}</span>
    <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold mt-1">{label}</span>
  </div>
);

const ProgressBar = ({ value, label }: { value: number; label: string }) => (
  <div className="w-full">
    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold mb-2 px-1">
      <span className="text-white/40">{label}</span>
      <span className="text-red-500 font-serif font-bold">{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-red-750 to-red-500"
      />
    </div>
  </div>
);

// ── Materia Card (Academic Style) ─────────────────────────────────────

const MateriaCard = ({ 
  materia, 
  estado, 
  onToggle, 
  allEstados,
  planMaterias
}: { 
  materia: Materia; 
  estado: string; 
  onToggle: (id: string) => void;
  allEstados: Record<string, EstadoMateria>;
  planMaterias: Materia[];
}) => {
  const isAprobada = estado === "aprobada";
  const isHabilitada = estado === "habilitada" || estado.startsWith("horas:");
  const isBloqueada = estado === "bloqueada";

  const isPPS = materia.id === "10657";
  const rawEstado = allEstados[materia.id] || "pendiente";
  const ppsHours = isPPS ? getPPSHours(rawEstado) : 0;

  const showRequirements = () => {
    if (!isBloqueada) return;
    
    const missing = materia.requisitos
      .filter(r => allEstados[r.id] !== "aprobada")
      .map(r => planMaterias.find(m => m.id === r.id)?.nombreCorto || r.id);
    
    if (missing.length > 0) {
      toast.error(`Requisitos faltantes: ${missing.join(", ")}`, {
        icon: <Lock className="h-4 w-4 text-red-550" />,
        style: { background: "#0a0e17", color: "#fefefe", border: "1px solid rgba(255,255,255,0.1)" }
      });
    } else if (materia.requisitosEspeciales?.primerAnioCompleto) {
      toast.error("Requiere tener todo 1º Año completo aprobado", {
        icon: <Lock className="h-4 w-4 text-red-550" />,
        style: { background: "#0a0e17", color: "#fefefe", border: "1px solid rgba(255,255,255,0.1)" }
      });
    } else if (materia.requisitosEspeciales?.porcentajeCarrera) {
      toast.error(`Requiere tener el ${materia.requisitosEspeciales.porcentajeCarrera}% de las materias aprobadas`, {
        icon: <Lock className="h-4 w-4 text-red-550" />,
        style: { background: "#0a0e17", color: "#fefefe", border: "1px solid rgba(255,255,255,0.1)" }
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isBloqueada ? 0.55 : 1, 
        scale: 1,
      }}
      whileHover={!isBloqueada ? { y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
      onClick={() => isBloqueada ? showRequirements() : onToggle(materia.id)}
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden shadow-elegant",
        isAprobada ? "bg-emerald-950/15 border-emerald-800/40 hover:border-emerald-700/60" : 
        isHabilitada ? "bg-red-950/5 border-red-900/20 hover:border-red-700/50" : 
        "bg-slate-900/10 border-white/5 cursor-not-allowed"
      )}
    >
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono tracking-widest text-white/30">
            CÓD. {materia.id}
          </span>
          {isBloqueada && <Lock size={11} className="text-white/20" />}
          {isAprobada && <Check size={13} className="text-emerald-400 font-bold" strokeWidth={3} />}
          {isHabilitada && !isAprobada && <BookOpen size={11} className="text-red-500" />}
        </div>
        
        <h3 className={cn(
          "text-[12px] font-serif font-semibold leading-tight tracking-tight",
          isAprobada ? "text-emerald-200" : isBloqueada ? "text-white/35" : "text-red-200/90"
        )}>
          {materia.nombre}
        </h3>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-[8px] uppercase tracking-wider text-white/20">
            {materia.duracion}
          </span>
          <span className="text-[8px] font-mono text-white/20">
            {materia.horas} hs
          </span>
        </div>

        {isPPS && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px] text-white/50 mb-1 font-mono">
              <span>Acreditado:</span>
              <span className="font-bold text-red-400">{ppsHours} / 172 hs</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-red-650" 
                style={{ width: `${(ppsHours / 172) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Red and White Confetti Component ──────────────────────────────────
const RedWhiteConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#dc2626", "#ffffff", "#ef4444", "#f8fafc", "#b91c1c"];
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    const createBurst = (side: "left" | "right") => {
      const count = 80;
      const startX = side === "left" ? 0 : canvas.width;
      const startY = canvas.height * 0.8;
      
      for (let i = 0; i < count; i++) {
        const angle = side === "left" 
          ? -Math.PI / 4 + (Math.random() - 0.5) * 0.4 
          : -3 * Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        const speed = 15 + Math.random() * 20;

        particles.push({
          x: startX,
          y: startY,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.05 + Math.random() * 0.05,
        });
      }
    };

    createBurst("left");
    createBurst("right");

    const interval = setInterval(() => {
      if (particles.length < 150) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -20,
          size: Math.random() * 6 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 3,
          speedY: 2 + Math.random() * 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    }, 100);

    let animationId: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.25;
        p.speedX *= 0.98;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        p.x += Math.sin(p.wobble) * 0.5;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        if (p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
};

// ── Main Page ────────────────────────────────────────────────────────

const PlanEstudios = () => {
  const { user } = useAuth();
  const { isFocusMode, setFocusMode } = useApp();
  const [planId, setPlanId] = useState<PlanId | null>(() => {
    return (localStorage.getItem("dnd_selected_plan") as PlanId | null);
  });
  const [estados, setEstados] = useState<Record<string, EstadoMateria>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal PPS
  const [isPPSDialogOpen, setIsPPSDialogOpen] = useState(false);
  const [ppsInputHours, setPpsInputHours] = useState<number>(0);

  // Celebration state
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const uid = user?.id;

  const currentMaterias = useMemo(() => planId === "plan6" ? MATERIAS_PLAN6 : MATERIAS_PLAN5, [planId]);
  const currentTotal = useMemo(() => planId === "plan6" ? TOTAL_MATERIAS_PLAN6 : TOTAL_MATERIAS_PLAN5, [planId]);
  const currentCalcPct = useMemo(() => planId === "plan6" ? calcularPorcentaje : calcularPorcentajePlan5, [planId]);
  const currentGetEstado = useMemo(() => planId === "plan6" ? getEstadoVisual : getEstadoVisualPlan5, [planId]);

  useEffect(() => {
    if (!uid || !planId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("user_plan_progress")
          .select("materia_id, estado")
          .eq("user_id", uid)
          .eq("plan_id", planId);

        if (error) throw error;

        const estadosMap: Record<string, EstadoMateria> = {};
        (data ?? []).forEach(item => {
          estadosMap[item.materia_id] = item.estado as EstadoMateria;
        });
        setEstados(estadosMap);
      } catch (err) {
        console.error("Error fetching progress:", err);
        toast.error("No se pudo cargar tu progreso de materias.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [uid, planId]);

  const handlePlanChange = (newPlan: PlanId | null) => {
    setPlanId(newPlan);
    if (newPlan) {
      localStorage.setItem("dnd_selected_plan", newPlan);
    } else {
      localStorage.removeItem("dnd_selected_plan");
    }
  };

  const savePPSHours = async (hours: number) => {
    if (!uid || !planId) return;

    const nextState = hours === 172 ? "aprobada" : hours === 0 ? "pendiente" : `horas:${hours}`;
    const current = estados["10657"] || "pendiente";

    setEstados(prev => ({ ...prev, "10657": nextState }));
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_plan_progress")
        .upsert(
          {
            user_id: uid,
            plan_id: planId,
            materia_id: "10657",
            estado: nextState,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,plan_id,materia_id' }
        );

      if (error) throw error;
      setSaving(false);
      toast.success("Horas de práctica actualizadas", {
        style: { background: "#062f1c", color: "#34d399", border: "1px solid #10b981" }
      });
    } catch (err) {
      console.error("Error saving PPS hours:", err);
      toast.error("Error al guardar. Intenta de nuevo.");
      setEstados(prev => ({ ...prev, "10657": current }));
      setSaving(false);
    }
  };

  const handleToggle = useCallback(async (id: string) => {
    if (!uid || !planId) return;

    if (id === "10657") {
      const currentHours = getPPSHours(estados["10657"] || "pendiente");
      setPpsInputHours(currentHours);
      setIsPPSDialogOpen(true);
      return;
    }

    const current: EstadoMateria = estados[id] || "pendiente";
    const next: EstadoMateria = current === "aprobada" ? "pendiente" : "aprobada";

    // Optimistic Update
    setEstados(prev => ({ ...prev, [id]: next }));
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_plan_progress")
        .upsert(
          {
            user_id: uid,
            plan_id: planId,
            materia_id: id,
            estado: next,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,plan_id,materia_id' }
        );

      if (error) throw error;

      setSaving(false);
      if (next === "aprobada") {
        toast.success("Materia marcada como aprobada", {
          style: { background: "#062f1c", color: "#34d399", border: "1px solid #10b981" }
        });
      } else {
        toast("Materia desmarcada", {
          style: { background: "#0f172a", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }
        });
      }
    } catch (err) {
      console.error("Error saving progress:", err);
      toast.error("Error al sincronizar con el servidor. Reintentando...");
      // Rollback optimistic update
      setEstados(prev => ({ ...prev, [id]: current }));
      setSaving(false);
    }
  }, [uid, planId, estados]);

  const stats = useMemo(() => {
    const aprobadas = currentMaterias.filter(m => estados[m.id] === "aprobada").length;
    const habilitadas = currentMaterias.filter(m => currentGetEstado(m, estados) === "habilitada").length;
    const pct = currentCalcPct(estados);
    return { aprobadas, habilitadas, pct, total: currentTotal };
  }, [estados, currentMaterias, currentGetEstado, currentCalcPct, currentTotal]);

  useEffect(() => {
    if (!loading && stats.pct === 100) {
      if (!hasCelebrated) {
        setHasCelebrated(true);
        setIsCongratsOpen(true);
      }
    } else if (stats.pct < 100) {
      setHasCelebrated(false);
    }
  }, [stats.pct, hasCelebrated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 animate-pulse">
            Sincronizando Historial Académico
          </p>
        </div>
      </div>
    );
  }

  if (!planId) {
    return (
      <div className="container py-24 max-w-4xl text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] bg-white/5 border border-white/10 text-white/40 mb-8">
            <GraduationCap size={14} className="text-red-500" /> Planificación Académica
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Programa de Estudios
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Hacé el seguimiento de tu carrera de Abogacía de forma ordenada. Seleccioná tu plan de estudios oficial de la Facultad de Ciencias Jurídicas y Sociales (UNLP) para comenzar.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-3xl mx-auto">
            {PLANES_META.map(plan => (
              <button
                key={plan.id}
                onClick={() => handlePlanChange(plan.id)}
                className="group flex flex-col justify-between p-8 rounded-2xl bg-white/[0.01] border border-white/10 hover:border-red-650/40 hover:bg-white/[0.02] transition-all text-left shadow-elegant min-h-[240px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">{plan.tag}</span>
                    <span className="text-xs text-white/30 font-mono">{plan.totalMaterias} Materias</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{plan.nombre}</h2>
                  <p className="text-white/45 text-xs leading-relaxed">{plan.descripcion}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-red-400 mt-6 pt-4 border-t border-white/5 transition-colors">
                  Ingresar al plan <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-background transition-colors duration-200",
      isFocusMode ? "fixed inset-0 z-[100] overflow-y-auto py-12 px-8" : "py-12 px-8"
    )}>
      <div className="max-w-[1800px] mx-auto">
        {/* Academic Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 pb-8 border-b border-white/10">
          <div className="flex items-start gap-6">
            {!isFocusMode && (
              <button
                onClick={() => handlePlanChange(null)}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0"
                title="Cambiar Plan"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Universidad Nacional de La Plata</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-500/80">Jursoc</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                Abogacía <span className="text-white/20 font-sans text-xl md:text-2xl font-light">({planId === "plan6" ? "Plan 6" : "Plan 5"})</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <StatPill value={stats.aprobadas} label="Aprobadas" colorClass="text-emerald-400" />
            <StatPill value={stats.habilitadas} label="Habilitadas" colorClass="text-red-400" />
            <div className="w-56">
              <ProgressBar value={stats.pct} label="Plan Completado" />
            </div>
            <button
              onClick={() => setFocusMode(!isFocusMode)}
              className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
            >
              {isFocusMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {isFocusMode ? "Vista Normal" : "Modo Foco"}
            </button>
          </div>
        </div>

        {/* Global Syncing Status */}
        <AnimatePresence>
          {saving && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="fixed bottom-8 right-8 z-[110] bg-slate-900 border border-red-600/30 px-5 py-3 rounded-xl shadow-elegant flex items-center gap-3"
            >
              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Guardando en la nube...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Columnar Grid por Años */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 items-start mb-16">
          {[1, 2, 3, 4, 5].map(year => {
            // Materias regulares de este año
            const regularMaterias = currentMaterias.filter(m => m.anio === year && m.tipo === "regular");
            // Materias especiales de este año (idiomas, seminarios)
            const extraMaterias = currentMaterias.filter(m => m.anio === year && (m.tipo === "idioma" || m.tipo === "seminario"));

            return (
              <div key={year} className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-5 space-y-6 shadow-card-dnd">
                <div className="flex items-center gap-2 mb-2 pb-4 border-b border-white/5">
                  <span className="font-serif text-lg font-bold text-white/50">{year}º</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Año de Cursada</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {regularMaterias.map(m => (
                    <MateriaCard 
                      key={m.id} 
                      materia={m} 
                      estado={currentGetEstado(m, estados)} 
                      allEstados={estados}
                      onToggle={handleToggle} 
                      planMaterias={currentMaterias}
                    />
                  ))}

                  {extraMaterias.length > 0 && (
                    <div className="pt-4 mt-2 border-t border-white/5 space-y-4">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-white/20 mb-2">Talleres & Seminarios</div>
                      {extraMaterias.map(m => (
                        <MateriaCard 
                          key={m.id} 
                          materia={m} 
                          estado={currentGetEstado(m, estados)} 
                          allEstados={estados}
                          onToggle={handleToggle} 
                          planMaterias={currentMaterias}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección Especial: Formación Práctica (PPS y Adaptaciones) */}
        {planId === "plan6" && currentMaterias.some(m => m.tipo === "practica") && (
          <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-8 shadow-card-dnd mb-20">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <FileText size={18} className="text-red-500" />
              <h2 className="font-serif text-xl font-bold text-red-100/90">Área de Formación Práctica</h2>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Trayecto de Adaptación Profesional</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentMaterias.filter(m => m.tipo === "practica").map(m => (
                <MateriaCard 
                  key={m.id} 
                  materia={m} 
                  estado={currentGetEstado(m, estados)} 
                  allEstados={estados}
                  onToggle={handleToggle} 
                  planMaterias={currentMaterias}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Acreditación Horas PPS */}
      <Dialog open={isPPSDialogOpen} onOpenChange={setIsPPSDialogOpen}>
        <DialogContent className="max-w-md bg-slate-950 border border-white/10 text-white rounded-xl p-6">
          <DialogTitle className="font-serif text-xl font-bold mb-2 text-red-200">
            Acreditar Horas de Práctica
          </DialogTitle>
          <p className="text-white/50 text-xs mb-6">
            Ingresá la cantidad de horas de Práctica Supervisada Pre-profesional (PPS) realizadas. El rango permitido es de 0 a 172 horas.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="172"
                value={ppsInputHours}
                onChange={(e) => setPpsInputHours(Math.min(172, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center text-lg font-mono text-white outline-none focus:border-red-500"
              />
              <span className="text-white/40">/ 172 horas totales</span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsPPSDialogOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/50 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setIsPPSDialogOpen(false);
                  await savePPSHours(ppsInputHours);
                }}
                className="px-6 py-2 rounded-lg bg-red-650 hover:bg-red-700 text-xs font-bold uppercase tracking-widest text-white"
              >
                Guardar Horas
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confetti Celebration */}
      {isCongratsOpen && <RedWhiteConfetti />}

      {/* Graduation/Congrats Dialog */}
      <Dialog open={isCongratsOpen} onOpenChange={setIsCongratsOpen}>
        <DialogContent className="max-w-lg bg-slate-950 border border-red-500/20 text-white rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-650/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-650/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center py-6">
            <div className="h-20 w-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 mb-6 animate-bounce">
              <GraduationCap size={44} strokeWidth={1.5} />
            </div>
            
            <DialogTitle className="font-serif text-3xl md:text-4xl font-bold mb-3 tracking-tight text-red-200">
              ¡Felicitaciones!
            </DialogTitle>
            
            <p className="text-xl md:text-2xl font-serif font-semibold text-white mb-6">
              ¡Oficialmente sos Abogado/a!
            </p>
            
            <div className="w-full max-w-sm mx-auto my-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-serif italic text-xs leading-relaxed text-white/60">
              "Iuris praecepta sunt haec: honeste vivere, alterum non laedere, suum cuique tribuere."
              <span className="block mt-2 text-[10px] uppercase tracking-wider text-red-400/80 not-italic font-sans font-bold">
                — Ulpiano (Preceptos del Derecho)
              </span>
            </div>
            
            <p className="text-sm text-white/50 max-w-sm mb-8">
              Completaste el 100% de las materias de la carrera de Abogacía de la Facultad de Ciencias Jurídicas y Sociales de la Universidad Nacional de La Plata.
            </p>
            
            <button
              onClick={() => setIsCongratsOpen(false)}
              className="w-full max-w-xs py-3 px-6 rounded-xl bg-gradient-to-r from-red-750 to-red-600 hover:from-red-700 hover:to-red-500 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.5)] active:scale-95"
            >
              Comenzar a Ejercer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanEstudios;
