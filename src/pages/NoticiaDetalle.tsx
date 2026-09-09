import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import BotonLike from "@/components/noticias/BotonLike";
import CuerpoNoticia from "@/components/noticias/CuerpoNoticia";
import { esOpinion } from "@/lib/noticias";
import { cn } from "@/lib/utils";

interface NoticiaCompleta {
  id: string;
  slug: string;
  title: string;
  desc_content: string;
  excerpt: string | null;
  content_format: string | null;
  tag: string;
  image_url?: string | null;
  image_align?: string | null;
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

/** Barra fina que muestra cuánto queda de la nota. En textos largos evita la sensación de pozo sin fondo. */
const useProgresoDeLectura = () => {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const alcanzable = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(alcanzable <= 0 ? 0 : Math.min(1, window.scrollY / alcanzable));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progreso;
};

const NoticiaDetalle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [noticia, setNoticia] = useState<NoticiaCompleta | null>(null);
  const [loading, setLoading] = useState(true);
  const progreso = useProgresoDeLectura();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const fetchNoticia = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("noticias")
          .select(
            "id, slug, title, desc_content, excerpt, content_format, tag, image_url, image_align, reading_minutes, created_at, profiles!noticias_author_id_fkey(full_name, avatar_url), noticias_likes(user_id)"
          )
          .eq("slug", slug)
          .maybeSingle();

        if (error) throw error;
        setNoticia((data as any) || null);
      } catch (err: any) {
        console.error("Error fetching news detail:", err);
        toast.error("Error al cargar la nota");
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [slug]);

  const compartir = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: noticia?.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado al portapapeles");
    } catch (err) {
      // El usuario puede cancelar el diálogo de compartir: eso no es un error que valga reportar
      if ((err as Error)?.name === "AbortError") return;
      toast.error("No se pudo compartir la nota");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="container py-24 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">No encontramos esta nota</h1>
        <p className="text-muted-foreground mb-8">
          Puede que haya sido eliminada o que el link esté mal escrito.
        </p>
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Noticias
        </Link>
      </div>
    );
  }

  const opinion = esOpinion(noticia.tag);
  const formattedDate = new Date(noticia.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const firma = (
    <div className="flex items-center gap-3">
      {noticia.profiles?.avatar_url ? (
        <img
          src={noticia.profiles.avatar_url}
          alt={noticia.profiles.full_name || "Autor"}
          className="h-10 w-10 rounded-full object-cover border border-white/10"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-white/5">
          <User className="h-5 w-5 text-primary" />
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-foreground">
          {noticia.profiles?.full_name || "Agrupación DND"}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {opinion ? "Columna de opinión · DND Jursoc" : "Publicado por DND Jursoc"}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Progreso de lectura */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-50" aria-hidden="true">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: (progreso * 100).toFixed(2) + "%" }}
        />
      </div>

      <div className="container py-12 md:py-16 max-w-3xl">
        <Link
          to="/noticias"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Noticias
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wider",
                opinion
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-primary/10 text-primary border-primary/20"
              )}
            >
              {noticia.tag}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {noticia.reading_minutes ?? 1} min de lectura
            </span>
          </div>

          <h1 className="font-serif font-bold text-3xl md:text-[2.75rem] leading-[1.15] text-red-200/90 mb-4">
            {noticia.title}
          </h1>

          {noticia.excerpt && (
            <p className="font-serif text-lg md:text-xl leading-relaxed text-muted-foreground border-l-2 border-primary/40 pl-4">
              {noticia.excerpt}
            </p>
          )}

          {/* En las notas de opinión la firma va arriba, como en un diario */}
          {opinion && <div className="mt-6 pt-6 border-t border-border/50">{firma}</div>}
        </header>

        {/* En una nota larga la imagen va a ancho completo: flotarla parte el texto en columnas ilegibles */}
        {noticia.image_url && (
          <img
            src={noticia.image_url}
            alt={noticia.title}
            className="w-full max-h-[420px] object-cover rounded-2xl border border-border/50 mb-10"
          />
        )}

        <CuerpoNoticia
          contenido={noticia.desc_content}
          formato={noticia.content_format}
          className="text-[1.0625rem] md:text-lg"
        />

        <footer className="mt-12 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          {!opinion && firma}
          {opinion && <div className="text-xs text-muted-foreground">Las opiniones son responsabilidad de quien firma.</div>}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={compartir}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white/5 dark:bg-white/[0.02] text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            >
              <Share2 className="h-4 w-4" /> Compartir
            </button>
            <BotonLike noticiaId={noticia.id} likes={noticia.noticias_likes || []} />
          </div>
        </footer>
      </div>
    </>
  );
};

export default NoticiaDetalle;
