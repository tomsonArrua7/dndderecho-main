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
  Loader2, ArrowLeft, GraduationCap, ChevronRight,
  CheckCircle2, Maximize2, Minimize2,
  Lock, Info, Check, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

// ── Clave de localStorage ────────────────────────────────────────────
const lsKey = (userId: string, planId: string) => `dnd_plan_${planId}_${userId}`;

function loadFromLS(userId: string, planId: string): Record<string, EstadoMateria> {
  try {
    const raw = localStorage.getItem(lsKey(userId, planId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToLS(userId: string, planId: string, data: Record<string, EstadoMateria>) {
  try {
    localStorage.setItem(lsKey(userId, planId), JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

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
    nombre:        "Plan de Estudios Nº 6",
    descripcion:   "Plan vigente desde 2019. Diseño minimalista y gestión de correlatividades.",
    tag:           "Vigente 2019",
    totalMaterias: TOTAL_MATERIAS_PLAN6,
    features: [
      "Vista columnar por años",
      "Correlatividad lógica invisible",
      "Modo Foco para máxima concentración",
    ],
  },
];

// ── Componentes de UI ────────────────────────────────────────────────

const StatPill = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div
    className="flex flex-col items-center justify-center rounded-2xl border px-6 py-3 min-w-[100px] bg-[#0A0E1A]/40 backdrop-blur-md transition-all border-white/5"
  >
    <span className="text-2xl font-black font-display tracking-tighter" style={{ color }}>{value}</span>
    <span className="text-[9px] uppercase tracking-widest text-white/30 font-black mt-0.5">{label}</span>
  </div>
);

const ProgressBar = ({ value, label }: { value: number; label: string }) => (
  <div className="w-full">
    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black mb-2 px-1">
      <span className="text-white/40">{label}</span>
      <span className="text-accent">{value}%</span>
    </div>
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-accent shadow-[0_0_10px_rgba(220,38,38,0.4)]"
      />
    </div>
  </div>
);

// ── Materia Card (Apple Style) ───────────────────────────────────────

const MateriaCard = ({ 
  materia, 
  estado, 
  onToggle, 
  allEstados 
}: { 
  materia: Materia; 
  estado: string; 
  onToggle: (id: string) => void;
  allEstados: Record<string, EstadoMateria>;
}) => {
  const isAprobada = estado === "aprobada";
  const isHabilitada = estado === "habilitada";
  const isBloqueada = estado === "bloqueada";

  const showRequirements = () => {
    if (!isBloqueada) return;
    
    const missing = materia.requisitos
      .filter(r => allEstados[r.id] !== "aprobada")
      .map(r => MATERIAS_PLAN6.find(m => m.id === r.id)?.nombreCorto || r.id);
    
    if (missing.length > 0) {
      toast.error(`Requisito faltante: ${missing.join(", ")}`, {
        icon: <AlertCircle className="h-4 w-4 text-accent" />,
        style: { background: "#0A0E1A", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
      });
    } else if (materia.requisitosEspeciales?.primerAnioCompleto) {
      toast.error("Requiere 1º Año completo aprobado", {
        icon: <Lock className="h-4 w-4 text-accent" />,
        style: { background: "#0A0E1A", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
      });
    } else if (materia.requisitosEspeciales?.porcentajeCarrera) {
      toast.error(`Requiere ${materia.requisitosEspeciales.porcentajeCarrera}% de la carrera`, {
        icon: <Lock className="h-4 w-4 text-accent" />,
        style: { background: "#0A0E1A", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isBloqueada ? 0.4 : 1, 
        scale: 1,
        borderColor: isHabilitada ? "#dc2626" : isAprobada ? "#10b981" : "rgba(255,255,255,0.05)"
      }}
      whileHover={!isBloqueada ? { scale: 1.02, y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
      onClick={() => isBloqueada ? showRequirements() : onToggle(materia.id)}
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
        "bg-[#0A0E1A] shadow-lg",
        isAprobada ? "bg-emerald-500/5 border-emerald-500/30" : 
        isHabilitada ? "border-accent/40 shadow-accent/5" : 
        "border-white/5"
      )}
    >
      {/* Background Pulse for Enabled */}
      {isHabilitada && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-accent pointer-events-none"
        />
      )}

      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">
            #{materia.id}
          </span>
          {isBloqueada && <Lock size={10} className="text-white/20" />}
          {isAprobada && <Check size={12} className="text-emerald-500" strokeWidth={3} />}
          {isHabilitada && <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
        </div>
        
        <h3 className={cn(
          "text-[11px] font-bold leading-tight tracking-tight",
          isAprobada ? "text-emerald-400" : isBloqueada ? "text-white/30" : "text-white/80"
        )}>
          {materia.nombre}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-1 h-1 rounded-full",
              materia.duracion === "anual" ? "bg-blue-500" : "bg-white/10"
            )} />
            <span className="text-[8px] font-medium text-white/20 uppercase tracking-widest">
              {materia.duracion}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────

const PlanEstudios = () => {
  const { user } = useAuth();
  const { isFocusMode, setFocusMode } = useApp();
  const [planId, setPlanId]   = useState<PlanId | null>(null);
  const [estados, setEstados] = useState<Record<string, EstadoMateria>>({});
  const [loading, setLoading] = useState(true);

  const uid = user?.id ?? "anon";

  useEffect(() => {
    const saved = loadFromLS(uid, "plan6");
    setEstados(saved);
    setLoading(false);
  }, [uid]);

  const handleToggle = useCallback((id: string) => {
    setEstados(prev => {
      const current: EstadoMateria = prev[id] || "pendiente";
      const next: EstadoMateria = current === "aprobada" ? "pendiente" : "aprobada";
      const updated = { ...prev, [id]: next };
      saveToLS(uid, "plan6", updated);
      
      if (next === "aprobada") {
        toast.success("Materia aprobada", { 
          style: { background: "#0A0E1A", color: "#fff", border: "1px solid #dc2626" } 
        });
      }
      return updated;
    });
  }, [uid]);

  const stats = useMemo(() => {
    const aprobadas = MATERIAS_PLAN6.filter(m => estados[m.id] === "aprobada").length;
    const habilitadas = MATERIAS_PLAN6.filter(m => getEstadoVisual(m, estados) === "habilitada").length;
    const pct = calcularPorcentaje(estados);
    return { aprobadas, habilitadas, pct, total: TOTAL_MATERIAS_PLAN6 };
  }, [estados]);

  if (loading) return null;

  if (!planId) {
    return (
      <div className="container py-32 max-w-4xl text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 text-white/40 mb-8">
            <GraduationCap size={14} className="text-accent" /> Planificación Académica
          </div>
          <h1 className="font-display text-7xl font-black text-white mb-8 tracking-tighter leading-none">
            Trazá tu <br/><span className="text-white/20 italic">Futuro.</span>
          </h1>
          <p className="text-white/40 text-xl font-medium mb-16">
            Gestioná tu progreso de manera visual y minimalista.
          </p>
          
          <div className="grid gap-6">
            {PLANES_META.map(plan => (
              <button
                key={plan.id}
                onClick={() => setPlanId(plan.id)}
                className="group flex items-center justify-between p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-accent/40 transition-all text-left"
              >
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">{plan.nombre}</h2>
                  <p className="text-white/40 text-sm max-w-sm">{plan.descripcion}</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <ChevronRight size={28} />
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
      isFocusMode ? "fixed inset-0 z-[100] overflow-y-auto" : "py-12 px-8"
    )}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="flex items-center gap-8">
            {!isFocusMode && (
              <button
                onClick={() => setPlanId(null)}
                className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4">Plan de Estudios Nº 6</div>
              <h1 className="font-display text-6xl font-black text-white tracking-tighter leading-none">Abogacía</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <StatPill value={stats.aprobadas} label="Aprobadas" color="#10b981" />
            <StatPill value={stats.habilitadas} label="Habilitadas" color="#dc2626" />
            <div className="w-64">
              <ProgressBar value={stats.pct} label="Carrera Completada" />
            </div>
            <button
              onClick={() => setFocusMode(!isFocusMode)}
              className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center gap-3"
            >
              {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              {isFocusMode ? "Salir Modo Foco" : "Modo Foco"}
            </button>
          </div>
        </div>

        {/* Columnar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 items-start mb-20">
          {[1, 2, 3, 4, 5, 6].map(year => {
            // Materias de este año
            const materias = year === 6 
              ? MATERIAS_PLAN6.filter(m => m.anio > 5 || ["10700", "10800", "10900"].some(id => m.id.startsWith(id.slice(0, 3))))
              : MATERIAS_PLAN6.filter(m => m.anio === year && !["10700", "10800", "10900"].some(id => m.id.startsWith(id.slice(0, 3))));

            if (year === 6) {
              // Special grouping for Idiomas, Prácticas, Seminarios in column 6
              const special = MATERIAS_PLAN6.filter(m => ["10700", "10800", "10900"].some(id => m.id.startsWith(id.slice(0, 3))));
              return (
                <div key={year} className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Extra</span>
                    <div className-="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="flex flex-col gap-4">
                    {special.sort((a,b) => a.id.localeCompare(b.id)).map(m => (
                      <MateriaCard 
                        key={m.id} 
                        materia={m} 
                        estado={getEstadoVisual(m, estados)} 
                        allEstados={estados}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={year} className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{year}º AÑO</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="flex flex-col gap-4">
                  {materias.map(m => (
                    <MateriaCard 
                      key={m.id} 
                      materia={m} 
                      estado={getEstadoVisual(m, estados)} 
                      allEstados={estados}
                      onToggle={handleToggle} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanEstudios;
