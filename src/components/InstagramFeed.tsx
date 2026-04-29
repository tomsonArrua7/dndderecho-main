import { useEffect, useState } from "react";
import { Instagram, Heart, MessageCircle, Mic, BookOpen, Clipboard, Info, ExternalLink, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeholdPost {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string; // Para Reels/Videos
  permalink: string;
  caption: string;
  timestamp: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  likeCount?: number;
  commentCount?: number;
}

const CATEGORIES = {
  CHARLA: {
    label: "CHARLA",
    color: "bg-red-600",
    icon: Mic,
    keywords: ["charla", "conferencia", "mesa", "debate", "encuentro", "vivo"],
  },
  FERIA: {
    label: "FERIA DEL LIBRO",
    color: "bg-amber-500",
    icon: BookOpen,
    keywords: ["feria", "libro", "stand", "editorial"],
  },
  SIU: {
    label: "SIU GUARANÍ",
    color: "bg-sky-500",
    icon: Clipboard,
    keywords: ["siu", "guarani", "inscripción", "examen", "parcial", "materia", "guaraní"],
  },
  DEFAULT: {
    label: "NOVEDADES",
    color: "bg-primary-glow",
    icon: Info,
    keywords: [],
  }
};

function getCategory(caption: string = "") {
  const lowerCaption = caption.toLowerCase();
  if (CATEGORIES.CHARLA.keywords.some(k => lowerCaption.includes(k))) return CATEGORIES.CHARLA;
  if (CATEGORIES.FERIA.keywords.some(k => lowerCaption.includes(k))) return CATEGORIES.FERIA;
  if (CATEGORIES.SIU.keywords.some(k => lowerCaption.includes(k))) return CATEGORIES.SIU;
  return CATEGORIES.DEFAULT;
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<BeholdPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://feeds.behold.so/VLE0e125oUyyQydPF11F");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const postsArray = Array.isArray(data) ? data : data.posts || [];
        setPosts(postsArray.slice(0, 4));
      } catch (err) {
        console.error("Error fetching Instagram posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-background relative">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera Pro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-accent uppercase tracking-[0.2em] text-xs font-black">
              <div className="w-8 h-[2px] bg-accent"></div>
              <span>Comunidad</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Instagram <span className="text-accent italic">Feed</span>
            </h2>
          </div>

          <a
            href="https://www.instagram.com/agrupaciondnd/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]"
          >
            Seguinos en IG
            <Instagram className="h-5 w-5" />
          </a>
        </div>

        {/* Layout de Fichas */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-[2.5rem] bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="w-full aspect-[2/1] flex flex-col items-center justify-center bg-primary-deep rounded-[3rem] border border-white/5 text-center p-10">
            <Info className="h-12 w-12 text-white/20 mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Feed no disponible</h3>
            <p className="text-white/40 max-w-md">No pudimos conectar con Instagram. Por favor, visita nuestro perfil directamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, idx) => (
              <InstagramCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InstagramCard({ post, index }: { post: BeholdPost; index: number }) {
  const category = getCategory(post.caption);
  const CategoryIcon = category.icon;
  const isVideo = post.mediaType === "VIDEO";
  const displayImage = post.thumbnailUrl || post.mediaUrl;

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-8"
    >
      {/* Imagen de Fondo (Reels/Videos usan thumbnailUrl) */}
      <div className="absolute inset-0 bg-[#0A0E1A]">
        <img
          src={displayImage}
          alt="Instagram content"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay Oscuro */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-deep/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Badge Superior */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg backdrop-blur-md",
          category.color
        )}>
          {category.label}
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
          <CategoryIcon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Contenido Inferior */}
      <div className="relative z-10 space-y-4">
        {/* Métricas Reales o Sinceras */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold">
            <Heart className={cn("h-3.5 w-3.5", post.likeCount ? "text-red-500 fill-red-500" : "text-white/40")} />
            {post.likeCount && <span>{post.likeCount}</span>}
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentCount && <span>{post.commentCount}</span>}
          </div>
        </div>

        {/* Caption Truncada (line-clamp-3) */}
        <p className="text-white text-sm font-medium leading-relaxed line-clamp-3">
          {post.caption || "Ver más en nuestro Instagram."}
        </p>

        {/* Footer con Fecha */}
        <div className="pt-2 flex items-center justify-between border-t border-white/10">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            {new Date(post.timestamp).toLocaleDateString("es-AR", { day: '2-digit', month: 'short' })}
          </span>
          <ExternalLink className="h-4 w-4 text-white/20 group-hover:text-white transition-colors" />
        </div>
      </div>
    </motion.a>
  );
}
