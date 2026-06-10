import { useCallback, useEffect, useMemo, useState } from "react";
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
      <span className="text-amber-500 font-serif font-bold">{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
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
  const isHabilitada = estado === "habilitada";
  const isBloqueada = estado === "bloqueada";

  const showRequirements = () => {
    if (!isBloqueada) return;
    
    const missing = materia.requisitos
      .filter(r => allEstados[r.id] !== "aprobada")
      .map(r => planMaterias.find(m => m.id === r.id)?.nombreCorto || r.id);
    
    if (missing.length > 0) {
      toast.error(`Requisitos faltantes: ${missing.join(", ")}`, {
        icon: <Lock className="h-4 w-4 text-amber-500" />,
        style: { background: "#0a0e17", color: "#fefefe", border: "1px solid rgba(255,255,255,0.1)" }
      });
    } else if (materia.requisitosEspeciales?.primerAnioCompleto) {
      toast.error("Requiere tener todo 1º Año completo aprobado", {
        icon: <Lock className="h-4 w-4 text-amber-500" />,
        style: { background: "#0a0e17", color: "#fefefe", border: "1px solid rgba(255,255,255,0.1)" }
      });
    } else if (materia.requisitosEspeciales?.porcentajeCarrera) {
      toast.error(`Requiere tener el ${materia.requisitosEspeciales.porcentajeCarrera}% de las materias aprobadas`, {
        icon: <Lock className="h-4 w-4 text-amber-500" />,
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
        isHabilitada ? "bg-amber-950/10 border-amber-800/30 hover:border-amber-600/60" : 
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
          {isHabilitada && <BookOpen size={11} className="text-amber-500" />}
        </div>
        
        <h3 className={cn(
          "text-[12px] font-serif font-semibold leading-tight tracking-tight",
          isAprobada ? "text-emerald-200" : isBloqueada ? "text-white/35" : "text-amber-100/90"
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
      </div>
    </motion.div>
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

  const handleToggle = useCallback(async (id: string) => {
    if (!uid || !planId) return;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
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
            <GraduationCap size={14} className="text-amber-500" /> Planificación Académica
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
                className="group flex flex-col justify-between p-8 rounded-2xl bg-white/[0.01] border border-white/10 hover:border-amber-600/40 hover:bg-white/[0.02] transition-all text-left shadow-elegant min-h-[240px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">{plan.tag}</span>
                    <span className="text-xs text-white/30 font-mono">{plan.totalMaterias} Materias</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{plan.nombre}</h2>
                  <p className="text-white/45 text-xs leading-relaxed">{plan.descripcion}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-amber-400 mt-6 pt-4 border-t border-white/5 transition-colors">
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
      "min-h-screen bg-background transition-all duration-700",
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
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500/80">Jursoc</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                Abogacía <span className="text-white/20 font-sans text-xl md:text-2xl font-light">({planId === "plan6" ? "Plan 6" : "Plan 5"})</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <StatPill value={stats.aprobadas} label="Aprobadas" colorClass="text-emerald-400" />
            <StatPill value={stats.habilitadas} label="Habilitadas" colorClass="text-amber-500" />
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
              className="fixed bottom-8 right-8 z-[110] bg-slate-900 border border-amber-600/30 px-5 py-3 rounded-xl shadow-elegant flex items-center gap-3"
            >
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
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
              <FileText size={18} className="text-amber-500" />
              <h2 className="font-serif text-xl font-bold text-amber-100/90">Área de Formación Práctica</h2>
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
    </div>
  );
};

export default PlanEstudios;
