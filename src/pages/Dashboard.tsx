import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CalendarDays, GraduationCap, Repeat2, Sparkles } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ aprobadas: 0, cursando: 0, eventos: 0, permutas: 0, matches: 0 });
  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: ums }, { count: evCount }, { count: pCount }, { count: mCount }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("user_materias").select("estado").eq("user_id", user.id),
        supabase.from("eventos").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("permutas").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("activa", true),
        supabase.from("matches").select("*", { count: "exact", head: true }),
      ]);
      setName(profile?.full_name || user.email?.split("@")[0] || "");
      setStats({
        aprobadas: ums?.filter((u) => u.estado === "aprobada").length || 0,
        cursando: ums?.filter((u) => u.estado === "cursando").length || 0,
        eventos: evCount || 0,
        permutas: pCount || 0,
        matches: mCount || 0,
      });
    })();
  }, [user]);

  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-10">
        <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Tu espacio</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Hola, <span className="text-primary">{name}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Acá vas a encontrar todo lo tuyo de un vistazo.</p>
      </div>

      {stats.matches > 0 && (
        <div className="mb-8 p-5 rounded-xl bg-accent text-accent-foreground border border-accent shadow-accent-glow flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-white/15 animate-match"><Sparkles className="h-5 w-5" /></div>
            <div>
              <div className="font-display font-bold text-lg">¡Tenés {stats.matches} match{stats.matches > 1 ? "es" : ""}!</div>
              <div className="text-sm text-white/85">Revisá tus permutas para ver los datos de contacto.</div>
            </div>
          </div>
          <Button asChild className="bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-paper">
            <Link to="/permutero">Ver permutas</Link>
          </Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashCard to="/plan" icon={GraduationCap} title="Plan de estudios" stats={`${stats.aprobadas} aprobadas · ${stats.cursando} cursando`} />
        <DashCard to="/calendario" icon={CalendarDays} title="Calendario" stats={`${stats.eventos} evento${stats.eventos !== 1 ? "s" : ""} guardados`} />
        <DashCard to="/permutero" icon={Repeat2} title="Permutero" stats={`${stats.permutas} permuta${stats.permutas !== 1 ? "s" : ""} activas`} accent />
      </div>
    </div>
  );
};

const DashCard = ({ to, icon: Icon, title, stats, accent }: { to: string; icon: any; title: string; stats: string; accent?: boolean }) => (
  <Link to={to} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:-translate-y-0.5 transition-smooth shadow-paper hover:shadow-elegant group">
    <div className={`inline-flex p-3 rounded-lg mb-4 ${accent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{stats}</p>
    <span className="inline-block mt-4 text-xs font-medium text-primary group-hover:translate-x-1 transition-smooth">Abrir →</span>
  </Link>
);

export default Dashboard;
