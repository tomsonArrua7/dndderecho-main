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

interface Materia { id: string; nombre: string; anio: number }
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
  created_at: string;
  materias?: { nombre: string; anio: number };
}
interface Match {
  id: string;
  permuta_a: string;
  permuta_b: string;
  user_a: string;
  user_b: string;
}

const phoneSchema = z.string().trim().min(8, "Teléfono inválido").max(20, "Teléfono inválido").regex(/^[+\d\s()-]+$/, "Teléfono inválido");

const Permutero = () => {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [permutas, setPermutas] = useState<PermutaRow[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [appSettings, setAppSettings] = useState<{ permutero_activo: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMateria, setFilterMateria] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // form
  const [materiaId, setMateriaId] = useState("");
  const [tiene, setTiene] = useState("");
  const [busca, setBusca] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [notas, setNotas] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [{ data: mats }, { data: perms }, { data: ms }, { data: settings }] = await Promise.all([
      supabase.from("materias").select("id,nombre,anio").order("anio").order("nombre"),
      supabase.from("permutas").select("*, materias(nombre, anio)").eq("status", "activa").order("created_at", { ascending: false }),
      user ? supabase.from("matches").select("*") : Promise.resolve({ data: [] as Match[] }),
      supabase.from("app_settings").select("permutero_activo").eq("id", 1).maybeSingle(),
    ]);
    setMaterias(mats || []);
    setPermutas((perms as PermutaRow[]) || []);
    setMatches((ms as Match[]) || []);
    setAppSettings(settings || { permutero_activo: true });
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,telefono").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.full_name && !nombre) setNombre(data.full_name);
      if (data?.telefono && !telefono) setTelefono(data.telefono);
    });
  }, [user, open]);

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
  }, [matches, permutas, user]);

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
    await supabase.from("permutas").update({ status: 'realizada' }).eq("id", id);
    setPermutas((p) => p.filter((x) => x.id !== id));
    toast.success("¡Permuta marcada como realizada!");
  };

  const filtered = useMemo(() => {
    return permutas.filter((p) => {
      if (filterMateria !== "all" && p.materia_id !== filterMateria) return false;
      if (search && !(p.materias?.nombre || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [permutas, filterMateria, search]);

  const myActiveMatches = user ? matches.filter((m) => m.user_a === user.id || m.user_b === user.id) : [];

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
                    {materias.map((m) => (
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

      {user && myActiveMatches.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-accent text-accent-foreground border border-accent shadow-accent-glow flex items-center gap-3">
          <div className="p-2 rounded-full bg-white/20 animate-match"><Sparkles className="h-5 w-5" /></div>
          <div className="font-display font-semibold">
            ¡Tenés {myActiveMatches.length} match{myActiveMatches.length > 1 ? "es" : ""} activo{myActiveMatches.length > 1 ? "s" : ""}! Te resaltamos abajo las permutas con las que coincidís.
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
          <SelectTrigger className="sm:w-64 bg-card"><SelectValue /></SelectTrigger>
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

                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-semibold">
                  {p.materias?.anio}° Año
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
