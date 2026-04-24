import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  CheckCircle2, BookOpen, Clock, BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos de plan ────────────────────────────────────────────────────
type PlanId = "plan5" | "plan6";

interface PlanMeta {
  id:          PlanId;
  nombre:      string;
  descripcion: string;
  tag:         string | null;
  totalMaterias: number;
  features:    string[];
}

const PLANES_META: PlanMeta[] = [
  {
    id:           "plan6",
    nombre:       "Plan de Estudios Nº 6",
    descripcion:  "Plan vigente desde 2019. Incluye materias de Cs. Sociales, Teoría del Conflicto, Talleres de Idioma y Prácticas Pre-profesionales.",
    tag:          "Vigente 2019",
    totalMaterias: TOTAL_MATERIAS_PLAN6,
    features: [
      "Mapa de correlatividades interactivo",
      "Flechas iluminadas al aprobar",
      "Talleres de Idioma y Prácticas (4 niveles)",
      "Seminarios con requisito del 50%",
      "Persistencia automática en Supabase",
    ],
  },
  {
    id:           "plan5",
    nombre:       "Plan de Estudios Nº 5",
    descripcion:  "Plan anterior, aún vigente para estudiantes que lo iniciaron antes de 2019.",
    tag:          "Plan anterior",
    totalMaterias: 30,
    features: [
      "Estructura clásica de 5 años",
      "Seguimiento de materias",
      "Persistencia automática en Supabase",
    ],
  },
];

// ── Stat pill ────────────────────────────────────────────────────────
const StatPill = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border px-5 py-3 min-w-[88px] bg-card/80 backdrop-blur-sm"
    style={{ borderColor: `${color}44` }}>
    <span className="text-2xl font-bold font-display" style={{ color }}>{value}</span>
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">{label}</span>
  </div>
);

// ── Progress bar ─────────────────────────────────────────────────────
const ProgressBar = ({ value, label }: { value: number; label: string }) => (
  <div>
    <div className="flex items-center justify-between text-xs mb-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-foreground">{value}%</span>
    </div>
    <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background: "linear-gradient(90deg, #1d4ed8, #22d3ee)",
          boxShadow: value > 0 ? "0 0 10px #22d3ee88" : "none",
        }}
      />
    </div>
  </div>
);

// ── Plan selector card ───────────────────────────────────────────────
interface PlanCardProps {
  plan: PlanMeta;
  progress: number;
  onClick: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, progress, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative flex flex-col gap-5 rounded-2xl border-2 p-7 text-left transition-all duration-300",
      "border-border bg-card hover:border-primary/60 hover:bg-primary/5",
      "hover:scale-[1.02] hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      "group"
    )}
  >
    {plan.tag && (
      <span className={cn(
        "absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
        plan.id === "plan6"
          ? "bg-accent/10 text-accent border border-accent/30"
          : "bg-secondary text-muted-foreground border border-border"
      )}>
        {plan.tag}
      </span>
    )}

    {/* Icon + title */}
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center
                      group-hover:bg-primary/20 transition-colors">
        <GraduationCap size={28} className="text-primary" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">{plan.nombre}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{plan.totalMaterias} materias</p>
      </div>
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed">{plan.descripcion}</p>

    {/* Features */}
    <ul className="space-y-1.5">
      {plan.features.map(f => (
        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 size={12} className="text-primary flex-shrink-0" />
          {f}
        </li>
      ))}
    </ul>

    {/* Progress */}
    <ProgressBar value={progress} label="Tu progreso guardado" />

    {/* CTA */}
    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
      <span>Abrir mapa</span>
      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);

// ── Plan 5 fallback (lista simple mientras no está completo) ─────────
const Plan5Fallback: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="container py-16 max-w-2xl mx-auto text-center">
    <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors">
      <ArrowLeft size={16} /> Volver al selector
    </button>
    <div className="rounded-2xl border border-border bg-card p-10">
      <GraduationCap size={48} className="text-primary mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-foreground mb-3">Plan Nº 5</h2>
      <p className="text-muted-foreground text-sm leading-relaxed">
        El mapa interactivo para el Plan 5 está en desarrollo. Por ahora podés gestionar tus materias del
        Plan 5 a través del administrador de Supabase o esperar la próxima actualización.
      </p>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════
const PlanEstudios = () => {
  const { user } = useAuth();
  const [planId, setPlanId]   = useState<PlanId | null>(null);
  const [estados, setEstados] = useState<Record<string, EstadoMateria>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // ── Cargar progreso guardado ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("user_materias")
        .select("materia_id,estado")
        .eq("user_id", user.id);

      if (error) {
        toast.error("Error al cargar tu progreso");
      } else {
        const map: Record<string, EstadoMateria> = {};
        (data ?? []).forEach(r => { map[r.materia_id] = r.estado as EstadoMateria; });
        setEstados(map);
      }
      setLoading(false);
    })();
  }, [user]);

  // ── Cycle estado: pendiente → cursando → aprobada → pendiente ────
  const cycleEstado = useCallback(async (id: string) => {
    if (!user) return;
    const current: EstadoMateria = estados[id] || "pendiente";
    const next: EstadoMateria =
      current === "pendiente" ? "cursando"  :
      current === "cursando"  ? "aprobada"  : "pendiente";

    setEstados(s => ({ ...s, [id]: next }));
    setSaving(true);

    const { error } = await supabase.from("user_materias").upsert(
      { user_id: user.id, materia_id: id, estado: next },
      { onConflict: "user_id,materia_id" }
    );

    setSaving(false);
    if (error) {
      setEstados(s => ({ ...s, [id]: current }));
      toast.error("No se pudo guardar el cambio");
    } else {
      const msgs: Record<EstadoMateria, string> = {
        cursando:  "✏️ Marcada como cursando",
        aprobada:  "✅ ¡Materia aprobada!",
        pendiente: "↩️ Vuelta a pendiente",
      };
      toast.success(msgs[next], { duration: 1600 });
    }
  }, [user, estados]);

  // ── Estadísticas ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    const aprobadas = MATERIAS_PLAN6.filter(m => estados[m.id] === "aprobada").length;
    const cursando  = MATERIAS_PLAN6.filter(m => estados[m.id] === "cursando").length;
    const habilitadas = MATERIAS_PLAN6.filter(m => {
      const vis = getEstadoVisual(m, estados);
      return vis === "habilitada";
    }).length;
    const pct = calcularPorcentaje(estados);
    return { aprobadas, cursando, habilitadas, pct, total: TOTAL_MATERIAS_PLAN6 };
  }, [estados]);

  const plan6Progress = stats.pct;
  const plan5Progress = 0; // placeholder

  // ── Loader ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p className="text-muted-foreground text-sm">Cargando tu progreso…</p>
      </div>
    );
  }

  // ── Plan 5 fallback ──────────────────────────────────────────────
  if (planId === "plan5") {
    return <Plan5Fallback onBack={() => setPlanId(null)} />;
  }

  // ════════════════════════════════════════════════════════════════
  // SELECTOR
  // ════════════════════════════════════════════════════════════════
  if (!planId) {
    return (
      <div className="container py-14 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 border border-primary/30 text-primary mb-5">
            <GraduationCap size={13} /> Plan de Estudios — Abogacía UNLP
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Qué plan estás cursando?
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Seleccioná tu plan de estudios para visualizar el mapa interactivo de correlatividades
            y llevar el seguimiento de tu carrera en tiempo real.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {PLANES_META.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              progress={plan.id === "plan6" ? plan6Progress : plan5Progress}
              onClick={() => setPlanId(plan.id)}
            />
          ))}
        </div>

        {/* Hint */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          💡 En el mapa: click en una materia para ciclar entre{" "}
          <strong className="text-foreground">Pendiente → Cursando → Aprobada</strong>.
          Tu progreso se guarda automáticamente.
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // MAPA PLAN 6
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="py-8 px-4 max-w-[1600px] mx-auto w-full">

      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlanId(null)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Plan de Estudios Nº 6 — Abogacía UNLP
            </h1>
            <p className="text-xs text-muted-foreground">
              Facultad de Ciencias Jurídicas y Sociales · UNLP · Vigente desde 2019
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          <StatPill value={stats.aprobadas}   label="Aprobadas"   color="#22d3ee" />
          <StatPill value={stats.cursando}    label="Cursando"    color="#ef4444" />
          <StatPill value={stats.habilitadas} label="Habilitadas" color="#3b82f6" />
          <StatPill value={stats.total - stats.aprobadas - stats.cursando} label="Pendientes" color="#475569" />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar value={stats.pct} label="Progreso de carrera (materias aprobadas)" />
        <p className="text-xs text-muted-foreground mt-1.5">
          {stats.aprobadas} de {stats.total} materias aprobadas
          {stats.pct >= 50 && (
            <span className="ml-2 text-orange-400 font-semibold">
              · ¡Habilitado para Seminarios!
            </span>
          )}
        </p>
      </div>

      {/* Map */}
      <div className="rounded-2xl border border-border bg-[hsl(222_47%_6%)] p-4 overflow-hidden shadow-elegant">
        <MapaInteractivo
          estados={estados}
          onCycleEstado={cycleEstado}
          saving={saving}
          porcentaje={stats.pct}
        />
      </div>

      {/* Footer hint */}
      <div className="mt-5 flex flex-wrap gap-4 items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} style={{ color: "#22d3ee" }} /> Aprobada</span>
          <span className="flex items-center gap-1.5"><BookOpen size={12} style={{ color: "#ef4444" }} /> Cursando</span>
          <span className="flex items-center gap-1.5"><Clock size={12} style={{ color: "#3b82f6" }} /> Habilitada para cursar</span>
          <span className="flex items-center gap-1.5"><BarChart2 size={12} /> Pasá el cursor por una materia para ver sus correlativas</span>
        </div>
        {saving && (
          <span className="flex items-center gap-1.5 text-primary">
            <Loader2 size={12} className="animate-spin" /> Guardando…
          </span>
        )}
      </div>
    </div>
  );
};

export default PlanEstudios;
