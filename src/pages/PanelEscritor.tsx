import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Newspaper,
  Trash2,
  PlusCircle,
  Calendar,
  Image as ImageIcon,
  Pencil,
  X,
  Clock,
  Star,
} from "lucide-react";
import CuerpoNoticia from "@/components/noticias/CuerpoNoticia";
import { TAGS_NOTICIAS, slugify, tiempoDeLectura, copeteAutomatico } from "@/lib/noticias";
import { cn } from "@/lib/utils";

interface Noticia {
  id: string;
  slug: string;
  title: string;
  desc_content: string;
  excerpt: string | null;
  content_format: string | null;
  tag: string;
  image_url?: string | null;
  image_align?: string | null;
  featured?: boolean | null;
  reading_minutes?: number | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

const CAMPOS =
  "id, slug, title, desc_content, excerpt, content_format, tag, image_url, image_align, featured, reading_minutes, created_at, profiles!noticias_author_id_fkey(full_name)";

const LIMITE_COPETE = 220;

const formInicial = {
  title: "",
  desc: "",
  excerpt: "",
  tag: "Novedades" as string,
  formato: "markdown" as "plain" | "markdown",
  imageUrl: "",
  imageAlign: "center",
  featured: false,
};

const PanelEscritor = () => {
  const { user, profile } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [pestania, setPestania] = useState<"escribir" | "preview">("escribir");
  const [submitting, setSubmitting] = useState(false);

  // Access check: only writer or admin
  const hasAccess = profile?.role === "admin" || profile?.role === "escritor";

  const set = <K extends keyof typeof formInicial>(campo: K, valor: (typeof formInicial)[K]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  useEffect(() => {
    if (!hasAccess) return;

    const fetchNoticias = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("noticias")
          .select(CAMPOS)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNoticias((data as any[]) || []);
      } catch (err: any) {
        console.error("Error fetching news list:", err);
        toast.error("Error al cargar la lista de noticias");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, [hasAccess]);

  const minutos = useMemo(() => tiempoDeLectura(form.desc), [form.desc]);
  const slugPreview = useMemo(() => slugify(form.title) || "nota", [form.title]);

  if (!user || !hasAccess) {
    if (!profile) {
      // Still loading auth context
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        </div>
      );
    }
    toast.error("No tienes permisos para acceder a esta sección.");
    return <Navigate to="/mi-espacio" replace />;
  }

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(formInicial);
    setPestania("escribir");
  };

  const empezarEdicion = (n: Noticia) => {
    setEditandoId(n.id);
    setForm({
      title: n.title,
      desc: n.desc_content,
      excerpt: n.excerpt || "",
      tag: n.tag,
      formato: n.content_format === "markdown" ? "markdown" : "plain",
      imageUrl: n.image_url || "",
      imageAlign: n.image_align || "center",
      featured: !!n.featured,
    });
    setPestania("escribir");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim() || !form.tag.trim()) {
      toast.error("El título, el contenido y la categoría son obligatorios");
      return;
    }

    // Si no escribieron copete, lo derivamos del cuerpo para que la tarjeta del índice no quede vacía
    const excerpt = form.excerpt.trim() || copeteAutomatico(form.desc, LIMITE_COPETE);

    const payload = {
      title: form.title.trim(),
      desc_content: form.desc.trim(),
      excerpt,
      content_format: form.formato,
      tag: form.tag.trim(),
      image_url: form.imageUrl.trim() || null,
      image_align: form.imageAlign,
      featured: form.featured,
    };

    setSubmitting(true);
    try {
      let guardadaId = editandoId;

      if (editandoId) {
        const { data, error } = await supabase
          .from("noticias")
          .update(payload)
          .eq("id", editandoId)
          .select(CAMPOS)
          .single();

        if (error) throw error;

        toast.success("Nota actualizada con éxito");
        setNoticias((prev) => prev.map((n) => (n.id === editandoId ? (data as any) : n)));
      } else {
        const { data, error } = await supabase
          .from("noticias")
          .insert({ ...payload, author_id: user.id })
          .select(CAMPOS)
          .single();

        if (error) throw error;

        toast.success("¡Nota publicada con éxito!");
        setNoticias((prev) => [data as any, ...prev]);
        guardadaId = (data as any).id;
      }

      // Sólo puede haber una nota destacada a la vez. Lo hacemos recién ahora: si el
      // guardado falla, no queremos haber dejado al sitio sin destacada.
      if (form.featured && guardadaId) {
        const { error: errorDestacadas } = await supabase
          .from("noticias")
          .update({ featured: false })
          .eq("featured", true)
          .neq("id", guardadaId);
        if (errorDestacadas) throw errorDestacadas;

        setNoticias((prev) =>
          prev.map((n) => (n.id !== guardadaId && n.featured ? { ...n, featured: false } : n))
        );
      }

      cancelarEdicion();
    } catch (err: any) {
      console.error("Error saving news:", err);
      toast.error("Error al guardar la nota: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta noticia?")) return;

    try {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;

      toast.success("Noticia eliminada correctamente.");
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      if (editandoId === id) cancelarEdicion();
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error("Error al eliminar la noticia: " + err.message);
    }
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
        <Newspaper className="h-8 w-8 text-red-500" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Redacción y Comunicados</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white leading-none mt-1">Panel de Redacción</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Editor */}
        <div className="lg:col-span-3">
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/10 shadow-elegant">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="font-serif text-lg font-bold text-red-200 flex items-center gap-2">
                {editandoId ? <Pencil className="h-5 w-5 text-red-500" /> : <PlusCircle className="h-5 w-5 text-red-500" />}
                {editandoId ? "Editar nota" : "Nueva nota"}
              </h2>

              {editandoId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelarEdicion}
                  className="text-white/50 hover:text-white text-xs h-8"
                >
                  <X className="h-3.5 w-3.5 mr-1" /> Cancelar edición
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tag" className="text-white/70 text-xs">Categoría / Etiqueta</Label>
                  <select
                    id="tag"
                    value={form.tag}
                    onChange={(e) => set("tag", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500 mt-1"
                  >
                    {TAGS_NOTICIAS.map((t) => (
                      <option key={t} value={t} className="bg-slate-950 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="formato" className="text-white/70 text-xs">Formato del cuerpo</Label>
                  <select
                    id="formato"
                    value={form.formato}
                    onChange={(e) => set("formato", e.target.value as "plain" | "markdown")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500 mt-1"
                  >
                    <option value="markdown" className="bg-slate-950 text-white">Markdown (con subtítulos y negritas)</option>
                    <option value="plain" className="bg-slate-950 text-white">Texto plano</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="text-white/70 text-xs">Título</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  placeholder="Ej: Por qué el nuevo plan de estudios nos deja afuera"
                  className="bg-white/5 border-white/10 text-white focus:border-red-500 mt-1"
                  maxLength={150}
                />
                <p className="text-[10px] text-white/30 mt-1 font-mono truncate">/noticias/{slugPreview}</p>
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-white/70 text-xs">
                  Copete / Bajada <span className="text-white/30">(opcional — se muestra en el listado)</span>
                </Label>
                <textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  rows={2}
                  maxLength={LIMITE_COPETE}
                  placeholder="Una o dos frases que resuman la nota e inviten a leerla."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-red-500 mt-1 resize-y"
                />
                <p className="text-[10px] text-white/30 mt-1">
                  {form.excerpt.length}/{LIMITE_COPETE} · Si lo dejás vacío lo generamos con el comienzo del cuerpo.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                  <Label className="text-white/70 text-xs">Contenido</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/30 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{minutos} min de lectura
                    </span>
                    <div className="flex rounded-lg border border-white/10 overflow-hidden">
                      {(["escribir", "preview"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPestania(p)}
                          className={cn(
                            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                            pestania === p ? "bg-red-600 text-white" : "bg-transparent text-white/40 hover:text-white/70"
                          )}
                        >
                          {p === "escribir" ? "Escribir" : "Vista previa"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {pestania === "escribir" ? (
                  <>
                    <textarea
                      id="desc"
                      value={form.desc}
                      onChange={(e) => set("desc", e.target.value)}
                      required
                      placeholder={"Escribí la nota acá. Podés pegar directamente desde Word.\n\n## Un subtítulo\n\nTexto en **negrita**, en *cursiva*, y:\n\n> una cita destacada"}
                      rows={22}
                      className="w-full min-h-[420px] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-red-500 resize-y font-serif leading-relaxed"
                    />
                    {form.formato === "markdown" && (
                      <p className="text-[10px] text-white/30 mt-1">
                        Markdown: <code className="text-white/50">## Subtítulo</code> ·{" "}
                        <code className="text-white/50">**negrita**</code> ·{" "}
                        <code className="text-white/50">*cursiva*</code> ·{" "}
                        <code className="text-white/50">&gt; cita</code> ·{" "}
                        <code className="text-white/50">- lista</code> · una línea en blanco separa párrafos.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="min-h-[420px] rounded-lg border border-white/10 bg-white/[0.02] px-5 py-5 overflow-x-auto">
                    {form.desc.trim() ? (
                      <CuerpoNoticia contenido={form.desc} formato={form.formato} />
                    ) : (
                      <p className="text-sm text-white/30">Todavía no escribiste nada.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imageUrl" className="text-white/70 text-xs">URL de la Imagen (opcional)</Label>
                  <Input
                    id="imageUrl"
                    value={form.imageUrl}
                    onChange={(e) => set("imageUrl", e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="bg-white/5 border-white/10 text-white focus:border-red-500 mt-1"
                  />
                </div>

                {form.imageUrl && (
                  <div>
                    <Label htmlFor="imageAlign" className="text-white/70 text-xs">Alineación en el listado</Label>
                    <select
                      id="imageAlign"
                      value={form.imageAlign}
                      onChange={(e) => set("imageAlign", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500 mt-1"
                    >
                      <option value="center" className="bg-slate-950 text-white">Centrado / Ancho Completo</option>
                      <option value="left" className="bg-slate-950 text-white">Izquierda (Ajuste estrecho)</option>
                      <option value="right" className="bg-slate-950 text-white">Derecha (Ajuste estrecho)</option>
                    </select>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 accent-red-600"
                />
                <span className="text-xs text-white/70 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  Destacar arriba de todo en Noticias
                </span>
              </label>

              <Button
                type="submit"
                className="w-full bg-red-650 hover:bg-red-700 text-xs font-bold uppercase tracking-widest text-white h-11"
                disabled={submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editandoId ? "Guardar cambios" : "Publicar nota"}
              </Button>
            </form>
          </div>
        </div>

        {/* Listado de Noticias */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-lg font-bold text-white/80">Publicaciones Recientes</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
          ) : noticias.length === 0 ? (
            <div className="p-8 rounded-xl border border-white/5 text-center text-white/40 text-sm">
              No hay noticias publicadas aún.
            </div>
          ) : (
            <div className="space-y-3">
              {noticias.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "p-4 rounded-xl bg-white/[0.01] border flex items-start justify-between gap-3 transition-colors",
                    editandoId === n.id ? "border-red-500/40" : "border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        {n.tag}
                      </span>
                      {n.featured && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded flex items-center gap-1">
                          <Star className="h-2.5 w-2.5" /> Destacada
                        </span>
                      )}
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(n.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {n.reading_minutes ?? 1} min
                      </span>
                      {n.image_url && (
                        <span className="text-[9px] font-semibold flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase">
                          <ImageIcon className="h-2.5 w-2.5" />{" "}
                          {n.image_align === "left" ? "Izq" : n.image_align === "right" ? "Der" : "Centrado"}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-sm line-clamp-2">{n.title}</h3>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                      {n.excerpt || n.desc_content}
                    </p>
                    <p className="text-[10px] text-white/25">
                      Por {n.profiles?.full_name || "Agrupación"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => empezarEdicion(n)}
                      className="h-8 w-8 text-white/30 hover:text-red-200 hover:bg-white/5"
                      title="Editar nota"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(n.id)}
                      className="h-8 w-8 text-white/30 hover:text-red-400 hover:bg-red-500/10"
                      title="Eliminar Noticia"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelEscritor;
