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

const FALLBACK_POSTS: BeholdPost[] = [
  {
    id: "fb-1",
    permalink: "https://www.instagram.com/agrupaciondnd/",
    caption: "🇦🇷❤️ ¡FELIZ DÍA, AMIGOS Y AMIGAS! Acompañando a todos los estudiantes de la Facultad de Ciencias Jurídicas y Sociales UNLP.",
    timestamp: new Date().toISOString(),
    mediaType: "IMAGE",
    likeCount: 243,
    commentCount: 27,
    mediaUrl: ""
  },
  {
    id: "fb-2",
    permalink: "https://www.instagram.com/agrupaciondnd/",
    caption: "📚 NOVEDADES Y MATERIALES DND • Todo lo que necesitás para tus finales y parciales en JurSoc UNLP.",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    mediaType: "IMAGE",
    likeCount: 185,
    commentCount: 19,
    mediaUrl: ""
  },
  {
    id: "fb-3",
    permalink: "https://www.instagram.com/agrupaciondnd/",
    caption: "🏛️ INSCRIPCIONES Y FECHAS IMPORTANTES • Mantenete al día con los horarios de cursada y finales.",
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
    mediaType: "IMAGE",
    likeCount: 210,
    commentCount: 24,
    mediaUrl: ""
  },
  {
    id: "fb-4",
    permalink: "https://www.instagram.com/agrupaciondnd/",
    caption: "📣 SUMATE A DND • Representantes de los estudiantes en la FCJyS. Seguinos para no perderte nada.",
    timestamp: new Date(Date.now() - 86400000 * 14).toISOString(),
    mediaType: "IMAGE",
    likeCount: 194,
    commentCount: 15,
    mediaUrl: ""
  }
];

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
        let postsArray: BeholdPost[] = Array.isArray(data) ? data : data.posts || [];
        
        // Ordenar por fecha más reciente primero
        postsArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (postsArray.length === 0) {
          postsArray = FALLBACK_POSTS;
        }

        setPosts(postsArray.slice(0, 4));
      } catch (err) {
        console.error("Error fetching Instagram posts:", err);
        setPosts(FALLBACK_POSTS);
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, idx) => (
              <InstagramCard key={post.id || idx} post={post} index={idx} />
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
  const [imageError, setImageError] = useState(!displayImage);

  return (
    <motion.a
      href={post.permalink || "https://www.instagram.com/agrupaciondnd/"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-end p-8 transition-all hover:border-red-500/50"
    >
      {/* Imagen de Fondo o Fallback Visual DND */}
      <div className="absolute inset-0 bg-[#0A0E1A]">
        {!imageError ? (
          <img
            src={displayImage}
            alt="Instagram content"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          /* FONDO FALLBACK ELEGANTE DND CUANDO LA IMAGEN EXPIRÓ O ES UN POST ARCHIVADO */
          <div className="w-full h-full bg-gradient-to-br from-[#0A1C3D] via-[#0D1527] to-[#C41E24]/50 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/30 transition-all" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-black uppercase text-red-300 tracking-wider bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/30">
                DND Instagram
              </span>
              <Instagram className="w-6 h-6 text-white/40" />
            </div>
            <div className="relative z-10 my-auto text-center space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <Instagram className="w-12 h-12 text-red-500 mx-auto opacity-70" />
              <span className="text-xs font-black text-white/70 block uppercase tracking-wider">Publicación DND</span>
            </div>
          </div>
        )}

        {isVideo && !imageError && (
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
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg backdrop-blur-md",
          category.color
        )}>
          {category.label}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
          <CategoryIcon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Contenido Inferior */}
      <div className="relative z-10 space-y-4">
        {/* Métricas Reales */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold">
            <Heart className={cn("h-3.5 w-3.5", post.likeCount ? "text-red-500 fill-red-500" : "text-white/50")} />
            {post.likeCount && <span>{post.likeCount}</span>}
          </div>
          <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold">
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
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {new Date(post.timestamp).toLocaleDateString("es-AR", { day: '2-digit', month: 'short' })}
          </span>
          <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
        </div>
      </div>
    </motion.a>
  );
}
