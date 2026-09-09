import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface BotonLikeProps {
  noticiaId: string;
  /** user_id de cada like, tal como los devuelve la consulta a noticias_likes */
  likes: { user_id: string }[];
  size?: "sm" | "md";
}

const BotonLike = ({ noticiaId, likes, size = "md" }: BotonLikeProps) => {
  const { user } = useAuth();
  const [userIds, setUserIds] = useState<string[]>(() => likes.map((l) => l.user_id));
  const [enVuelo, setEnVuelo] = useState(false);

  // Si el listado se recarga (o cambia de noticia), volvemos a partir de los datos del servidor
  useEffect(() => {
    setUserIds(likes.map((l) => l.user_id));
  }, [noticiaId, likes]);

  const liked = !!user && userIds.includes(user.id);
  const count = userIds.length;

  const handleClick = async (e: React.MouseEvent) => {
    // El botón vive dentro de tarjetas que son links: no queremos navegar al tocarlo
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Debes iniciar sesión para dar me gusta a las noticias.");
      return;
    }
    if (enVuelo) return;

    const previos = userIds;
    setEnVuelo(true);
    setUserIds(liked ? previos.filter((id) => id !== user.id) : [...previos, user.id]);

    try {
      if (liked) {
        const { error } = await supabase
          .from("noticias_likes")
          .delete()
          .eq("noticia_id", noticiaId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("noticias_likes")
          .insert({ noticia_id: noticiaId, user_id: user.id });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Error toggling like:", err);
      setUserIds(previos);
      toast.error("Ocurrió un error al procesar tu me gusta.");
    } finally {
      setEnVuelo(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
      className={cn(
        "flex items-center gap-1.5 rounded-full border font-bold transition-all duration-200 cursor-pointer",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
        liked
          ? "bg-red-500/10 text-red-500 border-red-500/30 shadow-sm"
          : "bg-white/5 dark:bg-white/[0.02] text-muted-foreground border-border hover:border-red-500/20 hover:text-red-500 active:scale-95"
      )}
    >
      <Heart className={cn("h-4 w-4 transition-transform", liked && "fill-red-500 scale-110")} />
      <span>{count}</span>
    </button>
  );
};

export default BotonLike;
