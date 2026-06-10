import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Noticia {
  id: string;
  title: string;
  desc_content: string;
  tag: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

const Noticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const { data, error } = await supabase
          .from("noticias")
          .select("id, title, desc_content, tag, created_at, profiles(full_name, avatar_url)")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNoticias(data as any[] || []);
      } catch (err: any) {
        console.error("Error fetching news:", err);
        toast.error("Error al cargar las noticias");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  return (
    <div className="container py-16 max-w-4xl">
      <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">Novedades</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">Noticias de la Agrupación</h1>
      <p className="text-muted-foreground text-lg mb-10">Comunicados, novedades académicas y actividades de DND.</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        </div>
      ) : noticias.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-xl text-muted-foreground">
          No hay comunicados disponibles en este momento.
        </div>
      ) : (
        <div className="grid gap-6">
          {noticias.map((n) => {
            const formattedDate = new Date(n.created_at).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            });

            return (
              <article
                key={n.id}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 shadow-paper hover:shadow-elegant flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase tracking-wider">
                      {n.tag}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formattedDate}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl mb-3 text-red-200/90 leading-tight">
                    {n.title}
                  </h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed mb-6">
                    {n.desc_content}
                  </p>
                </div>

                {/* Author details section */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  {n.profiles?.avatar_url ? (
                    <img
                      src={n.profiles.avatar_url}
                      alt={n.profiles.full_name || "Autor"}
                      className="h-9 w-9 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-white/5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {n.profiles?.full_name || "Agrupación DND"}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Publicado por DND Jursoc
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Noticias;
