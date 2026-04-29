import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  MATERIAS_PLAN6,
  TOTAL_MATERIAS_PLAN6,
  calcularPorcentaje,
  getEstadoVisual,
  EstadoMateria,
} from "@/data/plan6Structure";
import { MapaInteractivo } from "@/components/MapaInteractivo";
import {
  Loader2, ArrowLeft, GraduationCap, ChevronRight,
  CheckCircle2, BarChart2, Maximize2, Minimize2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

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
    descripcion:   "Plan vigente desde 2019. Incluye materias de Cs. Sociales, Teoría del Conflicto y Prácticas.",
    tag:           "Vigente 2019",
    totalMaterias: TOTAL_MATERIAS_PLAN6,
    features: [
      "Mapa interactivo con correlatividades",
      "Seguimiento de progreso en tiempo real",
      "Requisitos de Seminarios (50%)",
    ],
  },
  {
    id:            "plan5",
    nombre:        "Plan de Estudios Nº 5",
    descripcion:   "Plan anterior para ingresantes previos a 2019.",
    tag:           "Plan anterior",
    totalMaterias: 30,
    features: [
      "Estructura clásica de 5 años",
      "Seguimiento de materias",
    ],
  },
];

const StatPill = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div
    className="flex flex-col items-center justify-center rounded-2xl border px-6 py-3 min-w-[100px] bg-card/40 backdrop-blur-md transition-all hover:bg-card/60"
    style={{ borderColor: `${color}33` }}
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
    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(0,255,255,0.3)]"
      />
    </div>
  </div>
);

interface PlanCardProps { plan: PlanMeta; progress: number; onClick: () => void; }
const PlanCard: React.FC<PlanCardProps> = ({ plan, progress, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative flex flex-col gap-6 rounded-3xl border p-8 text-left transition-all duration-300",
      "border-white/5 bg-white/[0.02] hover:border-accent/40 hover:bg-accent/5",
      "hover:scale-[1.02] hover:shadow-2xl group active:scale-[0.98]"
    )}
  >
    {plan.tag && (
      <span className={cn(
        "absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase",
        plan.id === "plan6" ? "bg-accent/20 text-accent border border-accent/30" : "bg-white/5 text-white/40 border border-white/10"
      )}>
        {plan.tag}
      </span>
    )}
    <div className="flex items-center gap-5">
      <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors border border-accent/20">
        <GraduationCap size={32} className="text-accent" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-black text-white tracking-tight">{plan.nombre}</h2>
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-1">{plan.totalMaterias} materias totales</p>
      </div>
    </div>
    <p className="text-sm text-white/50 leading-relaxed">{plan.descripcion}</p>
    <ProgressBar value={progress} label="Completado" />
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
      Comenzar seguimiento <ChevronRight size={14} />
    </div>
  </button>
);

const PlanEstudios = () => {
  const { user } = useAuth();
  const { isFocusMode, setFocusMode } = useApp();
  const [planId, setPlanId]   = useState<PlanId | null>(null);
  const [estados, setEstados] = useState<Record<string, EstadoMateria>>({});
  const [loading, setLoading] = useState(true);

  const uid = user?.id ?? "anon";

  useEffect(() => {
    if (!user) return;
    const saved = loadFromLS(uid, "plan6");
    setEstados(saved);
    setLoading(false);
  }, [user, uid]);

  const handleToggle = useCallback((id: string) => {
    setEstados(prev => {
      const current: EstadoMateria = prev[id] || "pendiente";
      const next: EstadoMateria = current === "aprobada" ? "pendiente" : "aprobada";
      const updated = { ...prev, [id]: next };
      saveToLS(uid, "plan6", updated);
      
      if (next === "aprobada") {
        toast.success("Materia aprobada", { 
          style: { background: "#050505", color: "#fff", border: "1px solid #ff0000" } 
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative h-16 w-16">
          <Loader2 className="animate-spin h-16 w-16 text-accent opacity-20" />
          <Loader2 className="animate-spin h-16 w-16 text-accent absolute top-0 left-0 [animation-duration:1.5s]" />
        </div>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando…</p>
      </div>
    );
  }

  if (!planId) {
    return (
      <div className="container py-20 max-w-5xl">
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-accent/10 border border-accent/30 text-accent mb-8"
          >
            <GraduationCap size={14} /> Gestión Académica
          </motion.div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            Tu Carrera, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Bajo Control</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium">
            Mapeá tu futuro. Seleccioná tu plan de estudios para visualizar correlatividades y trazar tu camino al título.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {PLANES_META.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              progress={plan.id === "plan6" ? stats.pct : 0}
              onClick={() => setPlanId(plan.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out",
      isFocusMode ? "fixed inset-0 z-[100] bg-background p-0" : "py-8 px-6 max-w-[1600px] mx-auto w-full"
    )}>
      {/* Dashboard Header */}
      {!isFocusMode && (
        <div className="flex flex-col gap-10 mb-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setPlanId(null)}
                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-90"
              >
                <ArrowLeft size={20} className="text-white/60" />
              </button>
              <div>
                <h1 className="font-display text-3xl font-black text-white tracking-tight leading-none mb-2">
                  Plan de Estudios Nº 6
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Sincronizado con perfil estudiantil
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatPill value={stats.aprobadas} label="Aprobadas" color="#22d3ee" />
              <StatPill value={stats.habilitadas} label="Habilitadas" color="#3b82f6" />
              <StatPill value={stats.total - stats.aprobadas} label="Pendientes" color="#fca5a5" />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
            <ProgressBar value={stats.pct} label="Progreso Total de Carrera" />
            <button
              onClick={() => setFocusMode(true)}
              className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 hover:border-accent/40 transition-all active:scale-95"
            >
              <Maximize2 size={16} className="text-accent group-hover:scale-110 transition-transform" />
              Modo Foco
            </button>
          </div>
        </div>
      )}

      {/* Focus Mode Close Button */}
      {isFocusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="fixed top-6 right-6 z-[110] flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-accent hover:border-accent transition-all active:scale-90 shadow-2xl"
        >
          <Minimize2 size={16} /> Salir Modo Foco
        </button>
      )}

      {/* Interactive Map */}
      <div className={cn(
        "relative rounded-3xl border border-white/5 bg-black/40 overflow-hidden shadow-2xl transition-all duration-500",
        isFocusMode ? "h-screen w-screen rounded-none border-none" : "h-[700px]"
      )}>
        <MapaInteractivo
          estados={estados}
          onToggle={handleToggle}
          saving={false}
          porcentaje={stats.pct}
        />
      </div>

      {!isFocusMode && (
        <div className="mt-8 flex flex-wrap gap-8 items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Info size={14} className="text-accent" />
              Guía Visual:
            </div>
            {[
              { label: "Aprobada", color: "bg-cyan-500" },
              { label: "Habilitada", color: "border-blue-500 border-2" },
              { label: "Cursando", color: "bg-red-500" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                <div className={cn("w-3 h-3 rounded-full shadow-sm", item.color)} />
                {item.label}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-accent/50">
            DND · Defendamos Nuestro Derecho
          </span>
        </div>
      )}
    </div>
  );
};

export default PlanEstudios;
