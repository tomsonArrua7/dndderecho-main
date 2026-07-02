import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Newspaper, Trash2, PlusCircle, Calendar, Image as ImageIcon } from "lucide-react";

interface Noticia {
  id: string;
  title: string;
  desc_content: string;
  tag: string;
  image_url?: string | null;
  image_align?: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

const PanelEscritor = () => {
  const { user, profile } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("Novedades");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlign, setImageAlign] = useState("center");
  const [submitting, setSubmitting] = useState(false);

  // Access check: only writer or admin
  const hasAccess = profile?.role === "admin" || profile?.role === "escritor";

  useEffect(() => {
    if (!hasAccess) return;
    
    const fetchNoticias = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("noticias")
          .select("id, title, desc_content, tag, image_url, image_align, created_at, profiles(full_name)")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNoticias(data as any[] || []);
      } catch (err: any) {
        console.error("Error fetching news list:", err);
        toast.error("Error al cargar la lista de noticias");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, [hasAccess]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || !tag.trim()) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("noticias")
        .insert({
          title: title.trim(),
          desc_content: desc.trim(),
          tag: tag.trim(),
          image_url: imageUrl.trim() || null,
          image_align: imageAlign,
          author_id: user.id
        })
        .select("id, title, desc_content, tag, image_url, image_align, created_at, profiles(full_name)")
        .single();

      if (error) throw error;

      toast.success("¡Noticia publicada con éxito!");
      setNoticias(prev => [data as any, ...prev]);
      setTitle("");
      setDesc("");
      setTag("Novedades");
      setImageUrl("");
      setImageAlign("center");
    } catch (err: any) {
      console.error("Error creating news:", err);
      toast.error("Error al publicar la noticia: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta noticia?")) return;

    try {
      const { error } = await supabase
        .from("noticias")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Noticia eliminada correctamente.");
      setNoticias(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error("Error al eliminar la noticia: " + err.message);
    }
  };

  return (
    <div className="container py-12 max-w-5xl">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
        <Newspaper className="h-8 w-8 text-red-500" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Redacción y Comunicados</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white leading-none mt-1">Panel de Redacción</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulario de Creación */}
        <div className="md:col-span-1">
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/10 shadow-elegant">
            <h2 className="font-serif text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-red-500" />
              Nueva Noticia
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tag" className="text-white/70 text-xs">Categoría / Etiqueta</Label>
                <select
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500 mt-1"
                >
                  <option value="Novedades" className="bg-slate-950 text-white">Novedades</option>
                  <option value="Cursada" className="bg-slate-950 text-white">Cursada</option>
                  <option value="Asamblea" className="bg-slate-950 text-white">Asamblea</option>
                  <option value="Apuntes" className="bg-slate-950 text-white">Apuntes</option>
                  <option value="Institucional" className="bg-slate-950 text-white">Institucional</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title" className="text-white/70 text-xs">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ej: Nuevos resúmenes disponibles"
                  className="bg-white/5 border-white/10 text-white focus:border-red-500 mt-1"
                  maxLength={150}
                />
              </div>

              <div>
                <Label htmlFor="desc" className="text-white/70 text-xs">Contenido</Label>
                <textarea
                  id="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  placeholder="Escribe el cuerpo del comunicado aquí..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-red-500 mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-white/70 text-xs">URL de la Imagen (opcional)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="bg-white/5 border-white/10 text-white focus:border-red-500 mt-1"
                />
              </div>

              {imageUrl && (
                <div>
                  <Label htmlFor="imageAlign" className="text-white/70 text-xs">Alineación de la Imagen</Label>
                  <select
                    id="imageAlign"
                    value={imageAlign}
                    onChange={(e) => setImageAlign(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500 mt-1"
                  >
                    <option value="center" className="bg-slate-950 text-white">Centrado / Ancho Completo</option>
                    <option value="left" className="bg-slate-950 text-white">Izquierda (Ajuste estrecho)</option>
                    <option value="right" className="bg-slate-950 text-white">Derecha (Ajuste estrecho)</option>
                  </select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-650 hover:bg-red-700 text-xs font-bold uppercase tracking-widest text-white h-11"
                disabled={submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar Noticia
              </Button>
            </form>
          </div>
        </div>

        {/* Listado de Noticias */}
        <div className="md:col-span-2 space-y-4">
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
                  className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-start justify-between gap-4 hover:border-white/10 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        {n.tag}
                      </span>
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(n.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-[10px] text-white/30">
                        · Por {n.profiles?.full_name || "Agrupación"}
                      </span>
                      {n.image_url && (
                        <span className="text-[9px] font-semibold flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase">
                          <ImageIcon className="h-2.5 w-2.5" /> {n.image_align === "left" ? "Izq" : n.image_align === "right" ? "Der" : "Centrado"}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-sm line-clamp-1">{n.title}</h3>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{n.desc_content}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(n.id)}
                    className="h-8 w-8 text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0 self-center"
                    title="Eliminar Noticia"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
