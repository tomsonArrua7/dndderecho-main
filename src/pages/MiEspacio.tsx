import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CalendarDays, GraduationCap, Repeat2, Sparkles, User, Trash2 } from "lucide-react";
import { toast } from "sonner";

const MiEspacio = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ aprobadas: 0, eventos: 0, permutas: 0, matches: 0 });
  const [name, setName] = useState("");
  const [myPermutas, setMyPermutas] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: ums }, { count: evCount }, { data: pData }, { count: mCount }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("user_materias").select("estado").eq("user_id", user.id),
        supabase.from("eventos").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("permutas").select("*, materias(nombre)").eq("user_id", user.id).or("status.eq.activa,status.is.null"),
        supabase.from("matches").select("*", { count: "exact", head: true }),
      ]);
      const activePermutas = pData || [];
      setName(profile?.full_name || user.email?.split("@")[0] || "");
      setStats({
        aprobadas: ums?.filter((u) => u.estado === "aprobada").length || 0,
        eventos:   evCount || 0,
        permutas:  activePermutas.length,
        matches:   mCount  || 0,
      });
      setMyPermutas(activePermutas);
    })();
  }, [user]);

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

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashCard
          to="/plan"
          icon={GraduationCap}
          title="Plan de Estudios"
          stats={`${stats.aprobadas} materias aprobadas`}
          color="primary"
        />
        <DashCard
          to="/calendario"
          icon={CalendarDays}
          title="Calendario Académico"
          stats={`${stats.eventos} evento${stats.eventos !== 1 ? "s" : ""} guardados`}
          color="primary"
        />
        <DashCard
          to="/permutero"
          icon={Repeat2}
          title="Permutero"
          stats={`${stats.permutas} permuta${stats.permutas !== 1 ? "s" : ""} activas`}
          color="accent"
        />
      </div>

      {myPermutas.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Mis Permutas Activas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPermutas.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-card border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{p.materias?.nombre}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tengo: C{p.comision_tiene} | Busco: {p.comisiones_busca.map((c: number) => `C${c}`).join(", ")}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => removePermuta(p.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
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
