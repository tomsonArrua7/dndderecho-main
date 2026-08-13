import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Loader2, MessageCircle, Phone, Plus, Repeat2, Search, Sparkles, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { CardSkeleton } from "@/components/ui/skeleton";
import { MATERIAS_PLAN6 } from "@/data/plan6Structure";

interface Materia { id: string; nombre: string; anio: number; codigo: string }
interface PermutaRow {
  id: string;
  user_id: string;
  materia_id: string;
  comision_tiene: number;
  comisiones_busca: number[];
  telefono: string;
  nombre_contacto: string;
  notas: string | null;
  activa: boolean;
  status: "activa" | "realizada" | "cancelada";
  plan_id: string;
  created_at: string;
  materias?: { nombre: string; anio: number };
}
interface Match {
  id: string;
  permuta_a: string;
  permuta_b: string;
  user_a: string;
  user_b: string;
  permuta_a_row?: PermutaRow;
  permuta_b_row?: PermutaRow;
}

const phoneSchema = z.string().trim().min(8, "Teléfono inválido").max(20, "Teléfono inválido").regex(/^[+\d\s()-]+$/, "Teléfono inválido");

const Permutero = () => {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [permutas, setPermutas] = useState<PermutaRow[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [appSettings, setAppSettings] = useState<{ permutero_activo: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterMateria, setFilterMateria] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // form
  const [formPlanId, setFormPlanId] = useState("plan6");
  const [materiaId, setMateriaId] = useState("");
  const [tiene, setTiene] = useState("");
  const [busca, setBusca] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [notas, setNotas] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredMateriasForForm = useMemo(() => {
    const planMaterias = MATERIAS_PLAN6;
    const allowedCodes = new Set(planMaterias.map(m => m.id));
    return materias.filter(m => allowedCodes.has(m.codigo || ""));
  }, [materias]);

  const load = async () => {
    try {
      const [{ data: mats }, { data: ms }, { data: settings }, { data: countData }] = await Promise.all([
        supabase.from("materias").select("id,nombre,anio,codigo").order("anio").order("nombre"),
        user
          ? supabase
              .from("matches")
              .select("*, permuta_a_row:permutas!matches_permuta_a_fkey(*, materias(nombre)), permuta_b_row:permutas!matches_permuta_b_fkey(*, materias(nombre))")
          : Promise.resolve({ data: [] as Match[] }),
        supabase.from("app_settings").select("permutero_activo").eq("id", 1).maybeSingle(),
        supabase.rpc("get_completed_permutas_count" as any),
      ]);

      // Paginación para obtener la totalidad de permutas activas superando el límite por defecto de 1000 filas
      let allPermutas: PermutaRow[] = [];
      let permFrom = 0;
      const permStep = 1000;
      let keepFetchingPerms = true;

      while (keepFetchingPerms) {
        const { data: chunk, error: chunkErr } = await supabase
          .from("permutas")
          .select("*, materias(nombre, anio)")
          .or("status.eq.activa,status.is.null")
          .order("created_at", { ascending: false })
          .range(permFrom, permFrom + permStep - 1);

        if (chunkErr || !chunk || chunk.length === 0) {
          keepFetchingPerms = false;
        } else {
          allPermutas.push(...(chunk as PermutaRow[]));
          if (chunk.length < permStep) {
            keepFetchingPerms = false;
          } else {
            permFrom += permStep;
          }
        }
      }

      setMaterias(mats || []);
      setPermutas(allPermutas);
      setMatches((ms as Match[]) || []);
      setAppSettings(settings || { permutero_activo: true });
      setCompletedCount(Number(countData) || 0);
    } catch (err) {
      console.error("Critical error in Permutero load:", err);
      toast.error("Error al cargar la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const t = setTimeout(() => load(), 150); 
    return () => clearTimeout(t); 
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      supabase.from("profiles").select("full_name,telefono").eq("id", user.id).maybeSingle().then(({ data }) => {
        if (data?.full_name && !nombre) setNombre(data.full_name);
        if (data?.telefono && !telefono) setTelefono(data.telefono);
      });
    }, 150);
    return () => clearTimeout(t);
  }, [user?.id, open]);

  const matchedPermutaIds = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => { set.add(m.permuta_a); set.add(m.permuta_b); });
    return set;
  }, [matches]);

  useEffect(() => {
    if (!user) return;
    const myMatches = matches.filter((m) => m.user_a === user.id || m.user_b === user.id);
    if (myMatches.length === 0) return;
    const key = `dnd-notified-matches-${user.id}`;
    const seen = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
    const fresh = myMatches.filter((m) => !seen.has(m.id));
    fresh.forEach((m) => {
      const otherPermutaId = m.user_a === user.id ? m.permuta_b : m.permuta_a;
      const other = permutas.find((p) => p.id === otherPermutaId);
      toast.success("¡Hay un Match! 🎉", {
        description: other
          ? `Coincidiste con ${other.nombre_contacto} en ${other.materias?.nombre}. Te enviamos un email a ${user.email} con los datos de contacto (📞 ${other.telefono}).`
          : "Coincidiste con otra permuta. Revisá los datos de contacto.",
        duration: 8000,
      });
    });
    localStorage.setItem(key, JSON.stringify([...seen, ...fresh.map((m) => m.id)]));
  }, [matches, permutas, user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Necesitás iniciar sesión"); return; }
    if (!materiaId || !tiene || !busca || !telefono.trim() || !nombre.trim()) {
      toast.error("Completá todos los campos obligatorios");
      return;
    }
    const phoneCheck = phoneSchema.safeParse(telefono);
    if (!phoneCheck.success) { toast.error(phoneCheck.error.errors[0].message); return; }

    const buscaArr = busca.split(/[\s,]+/).map((x) => parseInt(x, 10)).filter((n) => Number.isFinite(n) && n > 0);
    const tieneNum = parseInt(tiene, 10);
    if (!Number.isFinite(tieneNum) || tieneNum <= 0) { toast.error("Comisión que tenés inválida"); return; }
    if (buscaArr.length === 0) { toast.error("Indicá al menos una comisión que buscás"); return; }
    if (buscaArr.includes(tieneNum)) { toast.error("No podés buscar la misma comisión que tenés"); return; }

    setSubmitting(true);
    const { error } = await supabase.from("permutas").insert({
      user_id: user.id,
      materia_id: materiaId,
      plan_id: formPlanId,
      comision_tiene: tieneNum,
      comisiones_busca: buscaArr,
      telefono: telefono.trim(),
      nombre_contacto: nombre.trim().slice(0, 80),
      notas: notas.trim().slice(0, 280) || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Permuta publicada");
    setMateriaId(""); setTiene(""); setBusca(""); setNotas("");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta permuta?")) return;
    await supabase.from("permutas").delete().eq("id", id);
    setPermutas((p) => p.filter((x) => x.id !== id));
    toast.success("Permuta eliminada");
  };

  const markAsDone = async (id: string) => {
    // Buscar si la permuta tiene una coincidencia (match) con otra permuta
    const relatedMatch = matches.find((m) => m.permuta_a === id || m.permuta_b === id);
    const targetIds = [id];
    if (relatedMatch) {
      if (relatedMatch.permuta_a && !targetIds.includes(relatedMatch.permuta_a)) targetIds.push(relatedMatch.permuta_a);
      if (relatedMatch.permuta_b && !targetIds.includes(relatedMatch.permuta_b)) targetIds.push(relatedMatch.permuta_b);
    }

    // Marcar ambas permutas como realizada
    const { error } = await supabase.from("permutas").update({ status: 'realizada' }).in("id", targetIds);
    if (error) {
      toast.error("Error al marcar como realizada: " + error.message);
      return;
    }

    // Incrementar en 2 personas el contador histórico persistente
    try {
      await supabase.rpc("increment_personas_permutadas", { inc_val: 2 });
    } catch (err) {
      console.warn("RPC increment_personas_permutadas falló, intentando actualización directa:", err);
      try {
        const { data: currentSet } = await supabase.from("app_settings").select("personas_permutadas_count").eq("id", 1).maybeSingle();
        const currentCount = (currentSet?.personas_permutadas_count || 0) + 2;
        await supabase.from("app_settings").update({ personas_permutadas_count: currentCount } as any).eq("id", 1);
      } catch (e) {
        console.error("Error en fallback de contador:", e);
      }
    }

    setPermutas((p) => p.filter((x) => !targetIds.includes(x.id)));
    setCompletedCount((prev) => prev + 2);
    toast.success("¡Permuta concretada con éxito! 🎉", {
      description: "Ambas partes fueron marcadas como realizadas y se sumaron 2 personas al contador."
    });
  };

  const filtered = useMemo(() => {
    return permutas.filter((p) => {
      if (filterPlan !== "all" && p.plan_id !== filterPlan) return false;
      if (filterMateria !== "all" && p.materia_id !== filterMateria) return false;
      if (search && !(p.materias?.nombre || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [permutas, filterPlan, filterMateria, search]);

  const myMatches = useMemo(() => {
    if (!user) return [];
    return matches.filter((m) => m.user_a === user.id || m.user_b === user.id);
  }, [matches, user]);

  const myActiveMatches = useMemo(() => {
    return myMatches.filter((m) => {
      const isUserA = m.user_a === user?.id;
      const other = isUserA ? m.permuta_b_row : m.permuta_a_row;
      return other?.status === "activa";
    });
  }, [myMatches, user?.id]);

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-semibold mb-3 text-accent">
            <Repeat2 className="h-3.5 w-3.5" /> Función estrella
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            El <span className="text-primary">Permutero</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Publicá tu comisión, dejá las que buscás y dejá que el sistema encuentre tu match.
          </p>
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              🎉 {completedCount === 1 ? "1 persona ya permutó" : `${completedCount} personas ya permutaron`}
            </span>
          </div>
        </div>
        
        {appSettings?.permutero_activo === false ? (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 rounded-lg font-medium">
            Permutero deshabilitado por el momento.
          </div>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {user ? (
                <Button variant="accent" size="lg" disabled={materias.length === 0}><Plus className="mr-2 h-4 w-4" /> Publicar permuta</Button>
              ) : (
                <Button asChild variant="accent" size="lg"><Link to="/auth">Iniciar sesión para publicar</Link></Button>
              )}
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card">
            <DialogHeader>
              <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">Ficha de inscripción</div>
              <DialogTitle className="font-display text-2xl">Publicar una permuta</DialogTitle>
              <DialogDescription>Tu nombre y teléfono se mostrarán solo a quien matchee con vos.</DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4 pt-2">
              <div>
                <Label className="text-foreground/80">Materia *</Label>
                <Select value={materiaId} onValueChange={setMateriaId}>
                  <SelectTrigger><SelectValue placeholder="Elegí una materia" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {filteredMateriasForForm.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.anio}° · {m.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-foreground/80">Comisión que TENÉS *</Label>
                  <Input type="number" min={1} placeholder="Ej: 5" value={tiene} onChange={(e) => setTiene(e.target.value)} required />
                </div>
                <div>
                  <Label className="text-foreground/80">Comisión que BUSCÁS *</Label>
                  <Input placeholder="Ej: 6, 7" value={busca} onChange={(e) => setBusca(e.target.value)} required />
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">Separá con coma si buscás varias.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-foreground/80">Tu nombre *</Label>
                  <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={80} />
                </div>
                <div>
                  <Label className="text-foreground/80">Teléfono *</Label>
                  <Input type="tel" placeholder="+54 221..." value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label className="text-foreground/80">Notas (opcional)</Label>
                <Textarea rows={2} maxLength={280} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Días/horarios preferidos, cátedra, etc." />
              </div>
              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar permuta
              </Button>
            </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {materias.length === 0 && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-card shadow-paper">
          <p className="text-sm text-muted-foreground">
            No hay materias cargadas en la base de datos. Cargá primero el catálogo de materias en Supabase para poder publicar permutas.
          </p>
        </div>
      )}

      {user && myMatches.length > 0 && (
        <div className="mb-10 p-6 rounded-2xl bg-slate-950/60 border border-accent/30 shadow-accent-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-accent/20 text-accent animate-match">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-foreground">Mis Matches Coincidentes</h2>
              <p className="text-xs text-muted-foreground">Revisá la disponibilidad de tus coincidencias y contactalos por WhatsApp.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {myMatches.map((m) => {
              const isUserA = m.user_a === user.id;
              const myPermuta = isUserA ? m.permuta_a_row : m.permuta_b_row;
              const otherPermuta = isUserA ? m.permuta_b_row : m.permuta_a_row;

              if (!myPermuta || !otherPermuta) return null;

              const otherStatus = otherPermuta.status || "activa";
              const isOtherActive = otherStatus === "activa";

              // Count other matches this counterpart has
              const otherMatchesCount = matches.filter(
                (match) =>
                  (match.permuta_a === otherPermuta.id || match.permuta_b === otherPermuta.id) &&
                  match.id !== m.id
              ).length;

              return (
                <div
                  key={m.id}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col justify-between transition-all bg-card/60",
                    isOtherActive
                      ? "border-accent/40 shadow-[0_0_15px_rgba(var(--accent),0.05)]"
                      : "border-white/5 opacity-60"
                  )}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground line-clamp-1 max-w-[200px]">
                        {otherPermuta.materias?.nombre}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                          isOtherActive
                            ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-400"
                            : "bg-slate-900/40 border-white/10 text-white/40"
                        )}
                      >
                        {isOtherActive ? "Disponible" : "Ya no disponible"}
                      </span>
                    </div>

                    <div className="flex gap-4 items-center my-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 justify-center">
                      <div className="text-center">
                        <span className="text-[8px] uppercase tracking-wider text-white/30 block font-semibold">Ofrecés</span>
                        <span className="font-display font-bold text-lg text-primary">C{myPermuta.comision_tiene}</span>
                      </div>
                      <Repeat2 className="h-4 w-4 text-white/20" />
                      <div className="text-center">
                        <span className="text-[8px] uppercase tracking-wider text-white/30 block font-semibold">Recibís</span>
                        <span className="font-display font-bold text-lg text-accent">C{otherPermuta.comision_tiene}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-white/70">
                      <p>
                        <span className="text-white/40">Contacto:</span>{" "}
                        <span className="font-semibold text-white">{otherPermuta.nombre_contacto}</span>
                      </p>
                      {otherPermuta.notas && (
                        <p className="italic text-white/50 text-[11px] line-clamp-2">
                          "{otherPermuta.notas}"
                        </p>
                      )}
                    </div>

                    {otherMatchesCount > 0 && isOtherActive && (
                      <div className="mt-3 p-2 rounded bg-red-500/5 border border-red-500/10 text-[10px] text-red-400 flex items-center gap-1.5 leading-normal">
                        <span>⚠️</span>
                        <span>
                          Este usuario también coincide con otros {otherMatchesCount} postulantes.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    {isOtherActive ? (
                      <Button asChild size="sm" variant="match" className="w-full sm:w-auto text-[10px] uppercase font-bold tracking-wider">
                        <a
                          href={`https://wa.me/${otherPermuta.telefono.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contactar WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 py-1.5 px-3 bg-white/5 rounded border border-white/5 block text-center w-full">
                        Permuta Concretada
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTROS */}
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar materia..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <Select value={filterMateria} onValueChange={setFilterMateria}>
          <SelectTrigger className="sm:w-60 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">Todas las materias</SelectItem>
            {materias.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.anio}° · {m.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-border bg-card text-center">
          <Repeat2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Todavía no hay permutas publicadas. ¡Sé el/la primera!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const isMatch = matchedPermutaIds.has(p.id);
            const isMine = user?.id === p.user_id;
            const myMatchPair = user
              ? matches.find((m) => (m.permuta_a === p.id || m.permuta_b === p.id) && (m.user_a === user.id || m.user_b === user.id))
              : null;
            const showContact = !!myMatchPair || isMine;

            return (
              <article
                key={p.id}
                className={cn(
                  "relative p-5 rounded-xl bg-card transition-smooth",
                  isMatch
                    ? "border-2 border-accent shadow-accent-glow"
                    : "border border-primary/30 hover:border-primary shadow-paper hover:shadow-elegant hover:-translate-y-0.5"
                )}
              >
                {isMatch && (
                  <div className="absolute -top-3 left-4">
                    <div className="bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-accent-glow flex items-center gap-1.5 animate-match">
                      <Sparkles className="h-3 w-3" /> ¡Hay un Match!
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-semibold">
                  <span>{p.materias?.anio}° Año</span>
                </div>
                <h3 className="font-display font-semibold text-lg leading-tight mb-4 line-clamp-2 text-foreground">
                  {p.materias?.nombre}
                </h3>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/30">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tiene</div>
                    <div className="font-display text-2xl font-bold text-primary">C{p.comision_tiene}</div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg border",
                    isMatch ? "bg-accent/10 border-accent/40" : "bg-secondary border-border"
                  )}>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Busca</div>
                    <div className={cn(
                      "font-display text-2xl font-bold",
                      isMatch ? "text-accent" : "text-foreground"
                    )}>
                      {p.comisiones_busca.map((c) => `C${c}`).join(" · ")}
                    </div>
                  </div>
                </div>

                {p.notas && <p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">"{p.notas}"</p>}

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm min-w-0 text-foreground/80">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{showContact ? p.nombre_contacto : "Anónimo"}</span>
                  </div>

                  {isMine ? (
                    <div className="flex gap-2">
                      {isMatch && (
                        <Button size="sm" variant="match" onClick={() => markAsDone(p.id)}>
                          Realizada
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : showContact ? (
                    <Button asChild size="sm" variant={isMatch ? "match" : "hero"}>
                      <a href={`https://wa.me/${p.telefono.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Visible al matchear
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Permutero;
