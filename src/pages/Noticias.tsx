import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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
    avatar_url: string | null;
  } | null;
  noticias_likes?: {
    user_id: string;
  }[];
}

const Noticias = () => {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const { data, error } = await supabase
          .from("noticias")
          .select("id, title, desc_content, tag, image_url, image_align, created_at, profiles(full_name, avatar_url), noticias_likes(user_id)")
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

  const handleLike = async (noticiaId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para dar me gusta a las noticias.");
      return;
    }

    const noticia = noticias.find((n) => n.id === noticiaId);
    if (!noticia) return;

    const alreadyLiked = noticia.noticias_likes?.some((l) => l.user_id === user.id) || false;

    // Actualización optimista de UI
    setNoticias((prev) =>
      prev.map((n) => {
        if (n.id === noticiaId) {
          const updatedLikes = alreadyLiked
            ? (n.noticias_likes || []).filter((l) => l.user_id !== user.id)
            : [...(n.noticias_likes || []), { user_id: user.id }];
          return { ...n, noticias_likes: updatedLikes };
        }
        return n;
      })
    );

    try {
      if (alreadyLiked) {
        // Remover like
        const { error } = await supabase
          .from("noticias_likes")
          .delete()
          .eq("noticia_id", noticiaId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Agregar like
        const { error } = await supabase
          .from("noticias_likes")
          .insert({
            noticia_id: noticiaId,
            user_id: user.id,
          });

        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Error toggling like:", err);
      // Revertir UI en caso de error
      setNoticias((prev) =>
        prev.map((n) => {
          if (n.id === noticiaId) {
            const revertedLikes = alreadyLiked
              ? [...(n.noticias_likes || []), { user_id: user.id }]
               : (n.noticias_likes || []).filter((l) => l.user_id !== user.id);
             return { ...n, noticias_likes: revertedLikes };
          }
          return n;
        })
      );
      toast.error("Ocurrió un error al procesar tu me gusta.");
    }
  };

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
                  
                  {/* Cuerpo de la noticia con imagen y ajuste de texto tipo Word */}
                  <div className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed mb-6 overflow-hidden">
                    {n.image_url && (
                      <img
                        src={n.image_url}
                        alt={n.title}
                        className={
                          n.image_align === "left"
                            ? "float-left mr-4 mb-2 max-w-[45%] md:max-w-[35%] rounded-xl border border-border/50 shadow-sm object-cover"
                            : n.image_align === "right"
                            ? "float-right ml-4 mb-2 max-w-[45%] md:max-w-[35%] rounded-xl border border-border/50 shadow-sm object-cover"
                            : "block mx-auto mb-4 max-w-full md:max-h-[350px] rounded-xl border border-border/50 object-cover"
                        }
                      />
                    )}
                    {n.desc_content}
                  </div>
                </div>

                {/* Author details & likes section */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
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

                  {/* Botón de Likes */}
                  {(() => {
                    const liked = n.noticias_likes?.some((l) => l.user_id === user?.id) || false;
                    const count = n.noticias_likes?.length || 0;
                    return (
                      <button
                        onClick={() => handleLike(n.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer ${
                          liked
                            ? "bg-red-500/10 text-red-500 border-red-500/30 shadow-sm scale-105"
                            : "bg-white/5 dark:bg-white/[0.02] text-muted-foreground border-border hover:border-red-500/20 hover:text-red-500 active:scale-95"
                        }`}
                      >
                        <Heart className={`h-4 w-4 transition-transform ${liked ? "fill-red-500 scale-110" : ""}`} />
                        <span>{count}</span>
                      </button>
                    );
                  })()}
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

