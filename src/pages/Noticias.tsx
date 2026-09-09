import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Calendar, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import BotonLike from "@/components/noticias/BotonLike";
import { TAGS_NOTICIAS, esOpinion, copeteAutomatico } from "@/lib/noticias";
import { cn } from "@/lib/utils";

interface NoticiaResumen {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  tag: string;
  image_url?: string | null;
  featured?: boolean | null;
  reading_minutes?: number | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  noticias_likes?: {
    user_id: string;
  }[];
}

const TODAS = "Todas";

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

const Noticias = () => {
  const [noticias, setNoticias] = useState<NoticiaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>(TODAS);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Deliberadamente no pedimos desc_content: el índice sólo muestra el copete.
        const { data, error } = await supabase
          .from("noticias")
          .select(
            "id, slug, title, excerpt, tag, image_url, featured, reading_minutes, created_at, profiles!noticias_author_id_fkey(full_name, avatar_url), noticias_likes(user_id)"
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNoticias((data as any[]) || []);
      } catch (err: any) {
        console.error("Error fetching news:", err);
        toast.error("Error al cargar las noticias");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Sólo ofrecemos filtros para categorías que realmente tienen notas publicadas
  const categorias = useMemo(() => {
    const presentes = new Set(noticias.map((n) => n.tag));
    return [TODAS, ...TAGS_NOTICIAS.filter((t) => presentes.has(t))];
  }, [noticias]);

  const visibles = useMemo(
    () => (filtro === TODAS ? noticias : noticias.filter((n) => n.tag === filtro)),
    [noticias, filtro]
  );

  const destacada = filtro === TODAS ? visibles.find((n) => n.featured) ?? visibles[0] : undefined;
  const resto = destacada ? visibles.filter((n) => n.id !== destacada.id) : visibles;

  return (
    <div className="container py-16 max-w-5xl">
      <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">Novedades</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">Noticias de la Agrupación</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Comunicados, novedades académicas, actividades y notas de opinión de DND.
      </p>

      {!loading && noticias.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={cn(
                "text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors",
                filtro === cat
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        </div>
      ) : visibles.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-xl text-muted-foreground">
          No hay comunicados disponibles en este momento.
        </div>
      ) : (
        <div className="space-y-10">
          {destacada && <TarjetaDestacada noticia={destacada} />}

          {resto.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {resto.map((n) => (
                <TarjetaNoticia key={n.id} noticia={n} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Etiqueta = ({ tag }: { tag: string }) => (
  <span
    className={cn(
      "text-xs px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wider",
      esOpinion(tag)
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-primary/10 text-primary border-primary/20"
    )}
  >
    {tag}
  </span>
);

const MetaLectura = ({ noticia }: { noticia: NoticiaResumen }) => (
  <div className="flex items-center gap-3 text-xs text-muted-foreground">
    <span className="flex items-center gap-1">
      <Calendar className="h-3.5 w-3.5" />
      {formatearFecha(noticia.created_at)}
    </span>
    <span className="flex items-center gap-1">
      <Clock className="h-3.5 w-3.5" />
      {noticia.reading_minutes ?? 1} min de lectura
    </span>
  </div>
);

const Firma = ({ noticia, size = "md" }: { noticia: NoticiaResumen; size?: "sm" | "md" }) => {
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {noticia.profiles?.avatar_url ? (
        <img
          src={noticia.profiles.avatar_url}
          alt={noticia.profiles.full_name || "Autor"}
          className={cn(dim, "rounded-full object-cover border border-white/10 shrink-0")}
        />
      ) : (
        <div className={cn(dim, "rounded-full bg-primary/10 flex items-center justify-center border border-white/5 shrink-0")}>
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
      <p className="text-xs font-bold text-foreground truncate">
        {noticia.profiles?.full_name || "Agrupación DND"}
      </p>
    </div>
  );
};

const TarjetaDestacada = ({ noticia }: { noticia: NoticiaResumen }) => (
  <article className="rounded-2xl bg-card border border-border overflow-hidden shadow-paper hover:shadow-elegant hover:border-primary/30 transition-all duration-300">
    <Link to={"/noticias/" + noticia.slug} className="block group">
      {noticia.image_url && (
        <img
          src={noticia.image_url}
          alt={noticia.title}
          className="w-full h-56 md:h-72 object-cover border-b border-border/50"
        />
      )}
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <Etiqueta tag={noticia.tag} />
          <MetaLectura noticia={noticia} />
        </div>
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-red-200/90 leading-tight mb-3 group-hover:text-red-200 transition-colors">
          {noticia.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {noticia.excerpt || copeteAutomatico(noticia.title)}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          Leer nota completa <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
    <div className="flex items-center justify-between gap-4 px-6 md:px-8 pb-6 pt-4 border-t border-border/50">
      <Firma noticia={noticia} />
      <BotonLike noticiaId={noticia.id} likes={noticia.noticias_likes || []} />
    </div>
  </article>
);

const TarjetaNoticia = ({ noticia }: { noticia: NoticiaResumen }) => (
  <article className="rounded-2xl bg-card border border-border overflow-hidden shadow-paper hover:shadow-elegant hover:border-primary/30 transition-all duration-300 flex flex-col">
    <Link to={"/noticias/" + noticia.slug} className="block group flex-1">
      {noticia.image_url && (
        <img
          src={noticia.image_url}
          alt={noticia.title}
          className="w-full h-40 object-cover border-b border-border/50"
        />
      )}
      <div className="p-5">
        <div className="mb-3">
          <Etiqueta tag={noticia.tag} />
        </div>
        <h3 className="font-serif font-bold text-lg text-red-200/90 leading-tight mb-2 line-clamp-2 group-hover:text-red-200 transition-colors">
          {noticia.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
          {noticia.excerpt || copeteAutomatico(noticia.title)}
        </p>
        <MetaLectura noticia={noticia} />
      </div>
    </Link>
    <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-3 border-t border-border/50">
      <Firma noticia={noticia} size="sm" />
      <BotonLike noticiaId={noticia.id} likes={noticia.noticias_likes || []} size="sm" />
    </div>
  </article>
);

export default Noticias;
