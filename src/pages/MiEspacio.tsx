import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CalendarDays, GraduationCap, Repeat2, Sparkles, User, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { UpcomingDates } from "@/components/UpcomingDates";
import { TOTAL_MATERIAS_PLAN6 } from "@/data/plan6Structure";
import { TOTAL_MATERIAS_PLAN5 } from "@/data/plan5Structure";

const MiEspacio = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ aprobadas: 0, total: 44, planName: "Plan 6", eventos: 0, permutas: 0, matches: 0 });
  const [name, setName] = useState("");
  const [myPermutas, setMyPermutas] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const planId = (localStorage.getItem("dnd_selected_plan") as "plan5" | "plan6") || "plan6";
        const total = planId === "plan5" ? TOTAL_MATERIAS_PLAN5 : TOTAL_MATERIAS_PLAN6;
        const planName = planId === "plan5" ? "Plan 5" : "Plan 6";

        const [{ data: profile }, { data: ums, error: umsErr }, { count: evCount }, { data: pData }, { count: mCount }] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
          supabase.from("user_plan_progress").select("estado").eq("user_id", user.id).eq("plan_id", planId),
          supabase.from("eventos").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("permutas").select("*, materias(nombre)").eq("user_id", user.id).or("status.eq.activa,status.is.null"),
          supabase.from("matches").select("*", { count: "exact", head: true }),
        ]);

        if (umsErr) {
          console.error("Error loading plan progress:", umsErr);
        }

        const activePermutas = pData || [];
        setName(profile?.full_name || user.email?.split("@")[0] || "");
        setStats({
          aprobadas: ums?.filter((u) => u.estado === "aprobada").length || 0,
          total,
          planName,
          eventos:   evCount || 0,
          permutas:  activePermutas.length,
          matches:   mCount  || 0,
        });
        setMyPermutas(activePermutas);
      } catch (err) {
        console.error("Error fetching Mi Espacio data:", err);
      }
    })();
  }, [user?.id]);

  const removePermuta = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta permuta?")) return;
    await supabase.from("permutas").delete().eq("id", id);
    setMyPermutas((p) => p.filter((x) => x.id !== id));
    setStats((s) => ({ ...s, permutas: s.permutas - 1 }));
    toast.success("Permuta eliminada");
  };

  return (
    <div className="container py-12 max-w-6xl">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            Tu espacio personal
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Hola, <span className="text-primary-glow" style={{ color: "hsl(222 80% 55%)" }}>{name}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Todo lo tuyo en un vistazo — materias, eventos y permutas.
          </p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card/80">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{name}</p>
            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Alert de match */}
      {stats.matches > 0 && (
        <div className="mb-8 p-5 rounded-xl bg-accent text-accent-foreground border border-accent shadow-accent-glow flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-white/15 animate-match">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-bold text-lg">
                ¡Tenés {stats.matches} match{stats.matches > 1 ? "es" : ""}!
              </div>
              <div className="text-sm text-white/85">
                Revisá tus permutas para ver los datos de contacto.
              </div>
            </div>
          </div>
          <Button asChild className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
            <Link to="/permutero">Ver permutas</Link>
          </Button>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Progress & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Plan de Estudios Progress Card */}
          <div className="p-6 rounded-2xl bg-card border shadow-paper relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.03] bg-primary -translate-y-8 translate-x-8" />
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl text-foreground">Tu Progreso</h3>
                  <p className="text-sm text-muted-foreground">{stats.aprobadas} de {stats.total} materias aprobadas ({stats.planName})</p>
                </div>
              </div>
              <Button asChild variant="outline" className="text-xs group hover:border-primary/50 transition-colors">
                <Link to="/plan" className="flex items-center gap-1.5">
                  Abrir Plan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
            
            {/* Simple progress bar representation */}
            <div className="w-full bg-secondary/50 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${Math.max(2, Math.min(100, (stats.aprobadas / stats.total) * 100))}%` }} 
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
              </div>
            </div>
            <p className="text-[10px] text-right text-muted-foreground uppercase tracking-widest font-bold">
              ~{Math.round((stats.aprobadas / stats.total) * 100)}% Completado
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <DashCard
              to="/permutero"
              icon={Repeat2}
              title="Permutero"
              stats={`${stats.permutas} permuta${stats.permutas !== 1 ? "s" : ""} activas`}
              color="accent"
            />
            <DashCard
              to="/calendario"
              icon={CalendarDays}
              title="Calendario Completo"
              stats={`${stats.eventos} evento${stats.eventos !== 1 ? "s" : ""} guardados`}
              color="primary"
            />
          </div>

          {/* Permutas List */}
          {myPermutas.length > 0 && (
            <div className="mt-4 bg-card border rounded-2xl p-5 shadow-paper">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-foreground">Mis Permutas Activas</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {myPermutas.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-background border flex items-center justify-between hover:border-border/80 transition-colors">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">{p.materias?.nombre}</h3>
                      <p className="text-[11px] font-medium text-muted-foreground mt-1">
                        Tengo: C{p.comision_tiene} | Busco: {p.comisiones_busca.map((c: number) => `C${c}`).join(", ")}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removePermuta(p.id)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Dates Widget */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl bg-card border shadow-paper h-full flex flex-col">
            <UpcomingDates />
          </div>
        </div>

      </div>
    </div>
  );
};

const DashCard = ({
  to, icon: Icon, title, stats, color,
}: {
  to: string; icon: React.ElementType; title: string; stats: string; color: "primary" | "accent";
}) => (
  <Link
    to={to}
    className="relative p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-paper hover:shadow-elegant group overflow-hidden"
  >
    {/* Glow corner */}
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] -translate-y-8 translate-x-8"
      style={{ background: color === "accent" ? "hsl(var(--accent))" : "hsl(var(--primary))" }}
    />
    <div className={`inline-flex p-3 rounded-xl mb-4 ${
      color === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
    }`}>
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{stats}</p>
    <span className={`inline-block mt-5 text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-200 ${
      color === "accent" ? "text-accent" : "text-primary"
    }`}>
      Abrir →
    </span>
  </Link>
);

export default MiEspacio;
