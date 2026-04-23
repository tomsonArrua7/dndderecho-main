import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Estado = "pendiente" | "cursando" | "aprobada";
interface Materia { id: string; nombre: string; anio: number; }
interface UM { materia_id: string; estado: Estado; }

const PlanEstudios = () => {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [estados, setEstados] = useState<Record<string, Estado>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: mats }, { data: ums }] = await Promise.all([
        supabase.from("materias").select("id,nombre,anio").order("anio").order("nombre"),
        supabase.from("user_materias").select("materia_id,estado").eq("user_id", user.id),
      ]);
      setMaterias(mats || []);
      const map: Record<string, Estado> = {};
      (ums as UM[] | null)?.forEach((u) => (map[u.materia_id] = u.estado));
      setEstados(map);
      setLoading(false);
    })();
  }, [user]);

  const updateEstado = async (materiaId: string, nuevoEstado: Estado) => {
    if (!user) return;
    const prev = estados[materiaId] || "pendiente";
    setEstados((s) => ({ ...s, [materiaId]: nuevoEstado }));
    const { error } = await supabase.from("user_materias").upsert(
      { user_id: user.id, materia_id: materiaId, estado: nuevoEstado },
      { onConflict: "user_id,materia_id" }
    );
    if (error) {
      setEstados((s) => ({ ...s, [materiaId]: prev }));
      toast.error("No se pudo guardar");
    }
  };

  const filtered = useMemo(
    () => materias.filter((m) => m.nombre.toLowerCase().includes(filter.toLowerCase())),
    [materias, filter]
  );

  const grouped = useMemo(() => {
    const g: Record<number, Materia[]> = {};
    filtered.forEach((m) => { (g[m.anio] ||= []).push(m); });
    return g;
  }, [filtered]);

  const totals = useMemo(() => {
    const v = Object.values(estados);
    return { aprobadas: v.filter((e) => e === "aprobada").length, cursando: v.filter((e) => e === "cursando").length };
  }, [estados]);
  const completionPercentage = useMemo(() => {
    if (materias.length === 0) return 0;
    return Math.round((totals.aprobadas / materias.length) * 100);
  }, [totals.aprobadas, materias.length]);
  const effectivePercentage = useMemo(() => {
    if (materias.length === 0) return 0;
    return Math.round(((totals.aprobadas + totals.cursando) / materias.length) * 100);
  }, [totals.aprobadas, totals.cursando, materias.length]);

  const getProgressColor = (value: number) => {
    if (value < 40) return "bg-destructive";
    if (value < 70) return "bg-warning";
    return "bg-success";
  };

  if (loading) return <div className="container py-20 grid place-items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (materias.length === 0) {
    return (
      <div className="container py-12 max-w-5xl">
        <div className="rounded-xl bg-card border border-border shadow-paper p-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Plan de Estudios</h1>
          <p className="text-muted-foreground">
            No hay materias cargadas en la base de datos. Cargá el catálogo en Supabase y recargá esta pantalla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Tu trayecto</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">Plan de Estudios</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="px-3 py-1 rounded-full bg-success/10 text-success border border-success/30 font-semibold">{totals.aprobadas} aprobadas</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-semibold">{totals.cursando} cursando</span>
          <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border font-semibold">{materias.length - totals.aprobadas - totals.cursando} pendientes</span>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-paper">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progreso de carrera (aprobadas)</span>
            <span className="font-semibold text-foreground">{completionPercentage}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-2.5 bg-secondary"
            indicatorClassName={getProgressColor(completionPercentage)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {totals.aprobadas} de {materias.length} materias aprobadas
          </p>

          <div className="flex items-center justify-between text-sm mt-4 mb-2">
            <span className="text-muted-foreground">Progreso efectivo (aprobadas + cursando)</span>
            <span className="font-semibold text-foreground">{effectivePercentage}%</span>
          </div>
          <Progress
            value={effectivePercentage}
            className="h-2.5 bg-secondary"
            indicatorClassName={getProgressColor(effectivePercentage)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {totals.aprobadas + totals.cursando} de {materias.length} materias entre aprobadas y cursando
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar materia..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 bg-card" />
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([anio, mats]) => (
          <section key={anio} className="rounded-xl bg-card border border-border shadow-paper overflow-hidden">
            {/* Cabecera tipo libreta */}
            <header className="px-5 py-3 bg-primary/5 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-base font-semibold flex items-center gap-2 text-foreground">
                <GraduationCap className="h-4 w-4 text-primary" /> {anio}° Año
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                {mats.filter((m) => estados[m.id] === "aprobada").length} / {mats.length}
              </span>
            </header>

            {/* Filas tipo libreta */}
            <div className="divide-y divide-border">
              {mats.map((m, idx) => {
                const estado = estados[m.id] || "pendiente";
                const aprobada = estado === "aprobada";
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 transition-smooth",
                      aprobada && "bg-success/5",
                      estado === "cursando" && "bg-primary/[0.03]",
                      "hover:bg-secondary/60"
                    )}
                  >
                    <span className="text-xs font-mono text-muted-foreground w-6 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Checkbox
                      checked={aprobada}
                      onCheckedChange={(v) => updateEstado(m.id, v ? "aprobada" : "pendiente")}
                      className="h-5 w-5"
                    />
                    <button
                      onClick={() => updateEstado(m.id, aprobada ? "pendiente" : "aprobada")}
                      className={cn(
                        "flex-1 text-left text-sm font-medium",
                        aprobada ? "line-through text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {m.nombre}
                    </button>
                    <div className="flex gap-1 shrink-0">
                      <EstadoBtn active={estado === "cursando"} onClick={() => updateEstado(m.id, estado === "cursando" ? "pendiente" : "cursando")}>
                        Cursando
                      </EstadoBtn>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const EstadoBtn = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-2.5 py-1 rounded-md text-xs font-semibold border transition-smooth",
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
    )}
  >
    {children}
  </button>
);

export default PlanEstudios;
