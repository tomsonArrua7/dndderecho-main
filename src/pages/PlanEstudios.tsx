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
  BLOQUES_ORIENTACION,
  ORIENTACION_REQUISITO,
  BloqueOrientacionId,
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
import { PLANES } from "@/data/planEstudiosData";
import { MapaNodos } from "@/components/MapaNodos";

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
    className="flex flex-col items-center justify-center rounded-xl border border-white/10 px-2 sm:px-5 py-2 sm:py-3 min-w-0 flex-1 sm:min-w-[100px] bg-card/60 backdrop-blur-sm transition-all"
  >
    <span className={cn("text-lg sm:text-2xl font-serif font-bold tracking-tight", colorClass)}>{value}</span>
    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 font-bold mt-0.5 sm:mt-1 truncate max-w-full">{label}</span>
  </div>
);

const ProgressBar = ({ value, label }: { value: number; label: string }) => (
  <div className="w-full">
    <div className="flex items-end justify-between mb-2.5 px-1">
      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-lg md:text-2xl font-display font-black text-accent drop-shadow-[0_0_10px_rgba(220,38,38,0.45)]">
        {value}%
      </span>
    </div>
    <div className="h-3.5 w-full rounded-full bg-slate-200/60 dark:bg-black/40 border border-slate-300 dark:border-white/15 p-[3px] overflow-hidden shadow-inner">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-accent shadow-[0_0_12px_rgba(220,38,38,0.6)] relative overflow-hidden"
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[pulse_2s_infinite] pointer-events-none" />
      </motion.div>
    </div>
  </div>
);

// ── Materia Card (Academic Style) ─────────────────────────────────────

const MateriaCard = ({ 
  materia, 
  estado, 
  onToggle, 
  allEstados,
  planMaterias,
  notas,
  onChangeNota
}: { 
  materia: Materia; 
  estado: string; 
  onToggle: (id: string) => void;
  allEstados: Record<string, EstadoMateria>;
  planMaterias: Materia[];
  notas: Record<string, number | null>;
  onChangeNota: (id: string, value: number | null) => Promise<void>;
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

        {isAprobada && !isPPS && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-white/5"
          >
            <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono">Calificación:</span>
            <select
              value={notas[materia.id] || ""}
              onChange={async (e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                await onChangeNota(materia.id, val);
              }}
              className="bg-white/5 border border-white/10 text-white text-[10px] rounded px-1.5 py-0.5 outline-none focus:border-emerald-500 cursor-pointer font-sans"
            >
              <option value="" className="bg-slate-950 text-white/50">-</option>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num} className="bg-slate-950 text-white">{num}</option>
              ))}
            </select>
          </div>
        )}

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
  const [notas, setNotas] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "map">("grid");
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<BloqueOrientacionId | null>(() => {
    return (localStorage.getItem("dnd_orientacion_bloque") as BloqueOrientacionId | null);
  });
  const [orientacionesAprobadas, setOrientacionesAprobadas] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("dnd_orientaciones_aprobadas") || "{}"); }
    catch { return {}; }
  });
  // Nombres escritos por el alumno para los slots libres (cuando no hay materias cargadas)
  // Estructura: { [bloqueId]: ["nombre1", "nombre2", "nombre3"] }
  const [orientacionNombres, setOrientacionNombres] = useState<Record<string, string[]>>(() => {
    try { return JSON.parse(localStorage.getItem("dnd_orientacion_nombres") || "{}"); }
    catch { return {}; }
  });

  // Modal PPS
  const [isPPSDialogOpen, setIsPPSDialogOpen] = useState(false);
  const [ppsInputHours, setPpsInputHours] = useState<number>(0);

  // Celebration state
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const uid = user?.id;

  const currentMaterias = useMemo(() => {
    const raw = planId === "plan6" ? MATERIAS_PLAN6 : MATERIAS_PLAN5;
    return raw.map(m => ({
      ...m,
      duracion: (m.duracion ||
                 (m.horas === 32 ? "bimestral" :
                  m.horas === 64 ? "trimestral" :
                  m.horas === 96 ? "cuatrimestral" :
                  m.horas === 120 ? "semestral" : "cuatrimestral")) as any
    }));
  }, [planId]);
  const currentTotal = useMemo(() => planId === "plan6" ? TOTAL_MATERIAS_PLAN6 : TOTAL_MATERIAS_PLAN5, [planId]);
  const currentCalcPct = useMemo(() => planId === "plan6" ? calcularPorcentaje : calcularPorcentajePlan5, [planId]);
  const currentGetEstado = useMemo(() => planId === "plan6" ? getEstadoVisual : getEstadoVisualPlan5, [planId]);

  const average = useMemo(() => {
    const aprobadasConNota = currentMaterias.filter(m => 
      m.id !== "10657" &&
      estados[m.id] === "aprobada" && 
      notas[m.id] !== undefined && 
      notas[m.id] !== null && 
      notas[m.id] > 0
    );
    if (aprobadasConNota.length === 0) return "0.00";
    const sum = aprobadasConNota.reduce((acc, m) => acc + (notas[m.id] || 0), 0);
    return (sum / aprobadasConNota.length).toFixed(2);
  }, [estados, notas, currentMaterias]);

  // Mapa de Nodos / Correlativas construído dinámicamente con códigos oficiales y correlatividades exactas
  const selectedPlanData = useMemo(() => {
    if (!planId) return null;
    
    // Agrupar materias por año y asignar columnas dinámicamente
    const yearCounters: Record<number, number> = {};
    const nodeMaterias = currentMaterias.map(m => {
      const year = m.anio;
      if (yearCounters[year] === undefined) {
        yearCounters[year] = 0;
      }
      const row = yearCounters[year];
      yearCounters[year]++;
      
      return {
        id: m.id,
        nombre: m.nombreCorto || m.nombre,
        anio: m.anio,
        tipo: m.duracion || "cuatrimestral",
        col: m.anio - 1,
        row: row,
        prereqs: m.requisitos.map(r => r.id)
      };
    });

    const connections = currentMaterias.flatMap(m => 
      m.requisitos.map(r => ({ from: r.id, to: m.id }))
    );

    return {
      id: planId,
      nombre: planId === "plan6" ? "Plan de Estudios Nº 6" : "Plan de Estudios Nº 5",
      descripcion: "",
      materias: nodeMaterias,
      conexiones: connections
    };
  }, [planId, currentMaterias]);

  const nodosEstados = estados;

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
          .select("materia_id, estado, nota")
          .eq("user_id", uid)
          .eq("plan_id", planId);

        if (error) throw error;

        const estadosMap: Record<string, EstadoMateria> = {};
        const notasMap: Record<string, number | null> = {};
        (data ?? []).forEach(item => {
          estadosMap[item.materia_id] = item.estado as EstadoMateria;
          notasMap[item.materia_id] = (item as any).nota !== null ? Number((item as any).nota) : null;
        });
        setEstados(estadosMap);
        setNotas(notasMap);
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
    setNotas(prev => ({ ...prev, "10657": null }));
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
            nota: null,
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
    if (next !== "aprobada") {
      setNotas(prev => ({ ...prev, [id]: null }));
    }
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
            nota: next === "aprobada" ? notas[id] || null : null,
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
  }, [uid, planId, estados, notas]);

  const handleUpdateNota = useCallback(async (materiaId: string, value: number | null) => {
    if (!uid || !planId) return;

    const current = notas[materiaId];

    // Optimistic Update
    setNotas(prev => ({ ...prev, [materiaId]: value }));
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_plan_progress")
        .upsert(
          {
            user_id: uid,
            plan_id: planId,
            materia_id: materiaId,
            estado: estados[materiaId] || "aprobada",
            nota: value,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,plan_id,materia_id' }
        );

      if (error) throw error;
      setSaving(false);
      toast.success("Nota guardada", {
        style: { background: "#062f1c", color: "#34d399", border: "1px solid #10b981" }
      });
    } catch (err) {
      console.error("Error saving grade:", err);
      toast.error("Error al guardar la nota. Intenta de nuevo.");
      setNotas(prev => ({ ...prev, [materiaId]: current }));
      setSaving(false);
    }
  }, [uid, planId, estados, notas]);



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
      "min-h-screen bg-background transition-colors duration-200 w-full max-w-full overflow-x-hidden",
      isFocusMode ? "fixed inset-0 z-[100] overflow-y-auto py-6 px-4 md:py-12 md:px-8" : "py-6 px-4 md:py-12 md:px-8"
    )}>
      <div className="max-w-[1800px] mx-auto w-full">
        {/* Academic Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 mb-8 md:mb-16 pb-6 md:pb-8 border-b border-white/10">
          <div className="flex items-start gap-4 sm:gap-6">
            {!isFocusMode && (
              <button
                onClick={() => handlePlanChange(null)}
                className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0"
                title="Cambiar Plan"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/30">Universidad Nacional de La Plata</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-red-500/80">Jursoc</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                Abogacía <span className="text-white/20 font-sans text-base sm:text-xl md:text-2xl font-light">({planId === "plan6" ? "Plan 6" : "Plan 5"})</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-6 w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <StatPill value={parseFloat(average) > 0 ? average : "-"} label="Promedio" colorClass="text-amber-400" />
              <StatPill value={stats.aprobadas} label="Aprobadas" colorClass="text-emerald-400" />
              <StatPill value={stats.habilitadas} label="Habilitadas" colorClass="text-red-400" />
            </div>
            <div className="w-full sm:w-56">
              <ProgressBar value={stats.pct} label="Plan Completado" />
            </div>
            <button
              onClick={() => setFocusMode(!isFocusMode)}
              className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
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

        {/* Switch Vista de Cuadrícula / Mapa de Correlativas */}
        <div className="flex items-center gap-2 mb-8 bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("grid")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeTab === "grid" 
                ? "bg-accent text-white shadow-md shadow-accent-glow" 
                : "text-white/40 hover:text-white/80"
            )}
          >
            Vista Cuadrícula
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeTab === "map" 
                ? "bg-accent text-white shadow-md shadow-accent-glow" 
                : "text-white/40 hover:text-white/80"
            )}
          >
            Mapa de Correlativas (Interactivo)
          </button>
        </div>

        {activeTab === "grid" ? (
          <>
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
                          notas={notas}
                          onChangeNota={handleUpdateNota}
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
                              notas={notas}
                              onChangeNota={handleUpdateNota}
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
              <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-8 shadow-card-dnd mb-8">
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
                      notas={notas}
                      onChangeNota={handleUpdateNota}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Sección de Orientaciones Obligatorias (solo Plan 6) ─── */}
            {planId === "plan6" && (() => {
              const aprobadas = currentMaterias.filter(m => estados[m.id] === "aprobada").length;
              const pct = stats.pct;
              const habilitado = aprobadas >= ORIENTACION_REQUISITO.materiasAprobadas || pct >= ORIENTACION_REQUISITO.porcentajeCarrera;
              const bloqueActual = bloqueSeleccionado ? BLOQUES_ORIENTACION.find(b => b.id === bloqueSeleccionado) : null;
              const aprobCount = bloqueActual
                ? bloqueActual.materias.length === 0
                  // Sin materias cargadas: contar slots de texto llenados
                  ? (orientacionNombres[bloqueActual.id] || []).filter(n => n.trim().length > 0).length
                  // Con materias cargadas: contar IDs marcados
                  : bloqueActual.materias.filter(m => orientacionesAprobadas[m.id]).length
                : 0;

              const BLOQUE_COLORS: Record<string, { border: string; bg: string; text: string; badge: string }> = {
                blue:    { border: "border-blue-500/40",   bg: "bg-blue-500/10",   text: "text-blue-300",   badge: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
                violet:  { border: "border-violet-500/40", bg: "bg-violet-500/10", text: "text-violet-300", badge: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
                amber:   { border: "border-amber-500/40",  bg: "bg-amber-500/10",  text: "text-amber-300",  badge: "bg-amber-500/20 border-amber-500/40 text-amber-300" },
                emerald: { border: "border-emerald-500/40",bg: "bg-emerald-500/10",text: "text-emerald-300",badge: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
              };

              return (
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-8 shadow-card-dnd mb-20">
                  {/* Encabezado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <GraduationCap size={18} className="text-amber-400" />
                      <h2 className="font-serif text-xl font-bold text-amber-100/90">Orientaciones Obligatorias</h2>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Plan Nº 6 · 5º Año</span>
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border font-mono",
                      habilitado
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/30"
                    )}>
                      {habilitado
                        ? `Habilitado · ${aprobadas} materias aprobadas`
                        : `Bloqueado · Se necesitan 32 mat. aprobadas o ${ORIENTACION_REQUISITO.porcentajeCarrera}% del plan`
                      }
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-white/40 leading-relaxed mb-6 max-w-3xl">
                    Para recibirse debés elegir <strong className="text-white/60">un bloque</strong> de orientación y aprobar <strong className="text-white/60">3 orientaciones</strong> dentro de él. Podés cursar orientaciones una vez que tengas <strong className="text-amber-400">32 materias aprobadas</strong> o el <strong className="text-amber-400">{ORIENTACION_REQUISITO.porcentajeCarrera}%</strong> de la carrera.
                  </p>

                  {/* Selector de bloque */}
                  <div className="mb-6">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">1. Elegí tu bloque de orientación</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      {BLOQUES_ORIENTACION.map(bloque => {
                        const col = BLOQUE_COLORS[bloque.color];
                        const isSelected = bloqueSeleccionado === bloque.id;
                        return (
                          <button
                            key={bloque.id}
                            disabled={!habilitado}
                            onClick={() => {
                              const next = isSelected ? null : bloque.id as BloqueOrientacionId;
                              setBloqueSeleccionado(next);
                              if (next) localStorage.setItem("dnd_orientacion_bloque", next);
                              else localStorage.removeItem("dnd_orientacion_bloque");
                            }}
                            className={cn(
                              "text-left p-4 rounded-xl border transition-all",
                              habilitado ? "cursor-pointer" : "cursor-not-allowed opacity-40",
                              isSelected
                                ? `${col.border} ${col.bg}`
                                : "border-white/10 bg-white/[0.02] hover:border-white/20"
                            )}
                          >
                            <div className={cn("text-[10px] font-black uppercase tracking-widest mb-1", isSelected ? col.text : "text-white/40")}>
                              {bloque.nombre}
                            </div>
                            <div className="text-[10px] text-white/30 leading-relaxed">
                              {bloque.descripcion}
                            </div>
                            {isSelected && (
                              <div className={cn("mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border", col.badge)}>
                                <Check size={9} strokeWidth={3} /> Bloque seleccionado
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slots de orientaciones */}
                  {bloqueActual && (
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">
                        2. Completá 3 orientaciones del bloque &quot;{bloqueActual.nombre}&quot; · {aprobCount}/3 aprobadas
                      </div>

                      {bloqueActual.materias.length === 0 ? (
                        // Slots libres: el alumno escribe el nombre de cada orientación cursada
                        (() => {
                          const nombres: string[] = orientacionNombres[bloqueActual.id] || ["", "", ""];
                          const filledCount = nombres.filter(n => n.trim().length > 0).length;
                          // Sincronizar aprobCount con slots llenados
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {[0, 1, 2].map(idx => {
                                const valor = nombres[idx] || "";
                                const lleno = valor.trim().length > 0;
                                return (
                                  <div
                                    key={idx}
                                    className={cn(
                                      "p-4 rounded-xl border transition-all flex flex-col gap-3",
                                      lleno
                                        ? "bg-emerald-950/15 border-emerald-800/40"
                                        : "border-dashed border-white/15 bg-white/[0.01]"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest",
                                        lleno ? "text-emerald-400" : "text-white/25"
                                      )}>
                                        Orientación {idx + 1}
                                      </span>
                                      {lleno
                                        ? <Check size={12} className="text-emerald-400" strokeWidth={3} />
                                        : <HelpCircle size={12} className="text-white/15" />
                                      }
                                    </div>
                                    <input
                                      type="text"
                                      disabled={!habilitado}
                                      value={valor}
                                      placeholder={habilitado ? "Escribir nombre de la orientación..." : "Bloqueado"}
                                      onChange={e => {
                                        const nuevos = [...nombres];
                                        nuevos[idx] = e.target.value;
                                        const next = { ...orientacionNombres, [bloqueActual.id]: nuevos };
                                        setOrientacionNombres(next);
                                        localStorage.setItem("dnd_orientacion_nombres", JSON.stringify(next));
                                      }}
                                      className={cn(
                                        "w-full bg-white/5 border rounded-lg px-3 py-2 text-[11px] text-white outline-none transition-all font-sans placeholder-white/20",
                                        lleno
                                          ? "border-emerald-700/50 focus:border-emerald-500"
                                          : "border-white/10 focus:border-amber-500/60",
                                        !habilitado && "cursor-not-allowed opacity-40"
                                      )}
                                    />
                                    {lleno && (
                                      <p className="text-[10px] text-emerald-300/70 font-medium leading-tight truncate">
                                        {valor.trim()}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()
                      ) : (
                        // Render de materias reales del bloque
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {bloqueActual.materias.map(mat => {
                            const isAprob = !!orientacionesAprobadas[mat.id];
                            return (
                              <motion.div
                                key={mat.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  if (!habilitado) return;
                                  const next = { ...orientacionesAprobadas, [mat.id]: !isAprob };
                                  setOrientacionesAprobadas(next);
                                  localStorage.setItem("dnd_orientaciones_aprobadas", JSON.stringify(next));
                                }}
                                className={cn(
                                  "p-4 rounded-xl border transition-all cursor-pointer",
                                  isAprob
                                    ? "bg-emerald-950/15 border-emerald-800/40 hover:border-emerald-700/60"
                                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                                )}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[8px] font-mono tracking-widest text-white/30">CÓD. {mat.id}</span>
                                  {isAprob && <Check size={13} className="text-emerald-400" strokeWidth={3} />}
                                </div>
                                <p className={cn(
                                  "text-[12px] font-serif font-semibold leading-tight",
                                  isAprob ? "text-emerald-200" : "text-red-200/90"
                                )}>{mat.nombre}</p>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}

                      {/* Progreso */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                            style={{ width: `${(Math.min(aprobCount, 3) / 3) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-white/30">{Math.min(aprobCount, 3)}/3</span>
                        {aprobCount >= 3 && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 size={12} /> Orientaciones completadas
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {!bloqueSeleccionado && habilitado && (
                    <div className="text-center text-[11px] text-white/25 italic mt-2">
                      Seleccioná un bloque arriba para ver tus orientaciones disponibles.
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        ) : (
          selectedPlanData && (
            <div className="mb-20 flex flex-col gap-6">
              {/* Cartel Explicativo del Mapa */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/20 to-black/20 border border-white/5 text-sm leading-relaxed shadow-lg backdrop-blur-md">
                <div className="flex items-start gap-3.5">
                  <div className="text-xl shrink-0 mt-0.5">💡</div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-1.5 tracking-tight text-base">
                      Mapa Interactivo de Correlativas
                    </h4>
                    <p className="text-white/60 mb-2.5 text-xs md:text-sm">
                      Este mapa te permite visualizar de forma gráfica cómo se estructuran las correlatividades de la carrera.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-white/50">
                      <li>Haz clic sobre cualquier materia para fijar sus conexiones.</li>
                      <li>En <strong className="text-amber-400 font-bold">amarillo</strong> se destacan las correlativas previas que necesitás tener aprobadas.</li>
                      <li>En <strong className="text-emerald-400 font-bold">verde</strong> se destacan las materias posteriores que se te habilitarán al aprobarla.</li>
                      <li>Los estados de cursada y aprobación se sincronizan automáticamente con lo que cargues.</li>
                    </ul>
                    <p className="text-xs text-accent font-semibold mt-3.5 italic border-t border-white/5 pt-2.5">
                      * Nota: Para marcar materias como cursadas, aprobadas o registrar tus notas, utilizá la pestaña de "Vista Cuadrícula".
                    </p>
                  </div>
                </div>
              </div>

              <MapaNodos 
                plan={selectedPlanData} 
                estados={nodosEstados} 
                notas={notas}
                saving={saving} 
              />
            </div>
          )
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
