import { useEffect, useState } from "react";
import { Instagram, Heart, MessageCircle, Mic, Gavel, Clipboard, Info, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeholdPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption: string;
  timestamp: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  children?: { mediaUrl: string }[];
}

const CATEGORIES = {
  CHARLA: {
    label: "CHARLA",
    color: "bg-red-600",
    icon: Mic,
    keywords: ["charla", "conferencia", "mesa", "debate", "encuentro", "vivo"],
  },
  FERIA: {
    label: "FERIA JUDICIAL",
    color: "bg-amber-500",
    icon: Gavel,
    keywords: ["feria", "judicial", "juzgado", "tribunales", "justicia"],
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
        const response = await fetch("https://behold.so/api/feed/VLE0e125oUyyQydPF11F");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        // Solo tomamos los primeros 4 o 8 posts
        setPosts(Array.isArray(data) ? data.slice(0, 8) : []);
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
    <section className="w-full py-20 px-4 md:px-8 bg-background relative overflow-hidden">
      {/* Glow background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header de la Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-bold tracking-widest text-white/40 uppercase">Instagram Feed</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              Comunidad y <span className="text-gradient-primary italic">Novedades</span>
            </h2>
          </div>

          <a
            href="https://www.instagram.com/agrupaciondnd/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
          >
            Seguinos en IG
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Grid de Fichas */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-[2rem] bg-white/5" />
                <Skeleton className="h-4 w-2/3 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
            <p className="text-white/60 font-medium">No se pudo cargar el feed en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group flex flex-col bg-[#0A0E1A] rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={post.mediaUrl}
          alt={post.caption?.slice(0, 100)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Capa de Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Icono de Categoría Flotante */}
        <div className="absolute top-5 left-5 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <CategoryIcon className="h-5 w-5 text-white" />
        </div>

        {/* Badge de Categoría */}
        <div className={cn(
          "absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg",
          category.color
        )}>
          {category.label}
        </div>
      </div>

      {/* Contenido / Footer de la Ficha */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Interacción (Mocada si la API no la trae) */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-white/60 text-xs font-bold">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>+120</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60 text-xs font-bold">
            <MessageCircle className="h-4 w-4" />
            <span>12</span>
          </div>
        </div>

        {/* Texto de la Publicación */}
        <p className="text-white/80 text-sm leading-relaxed font-medium line-clamp-3 overflow-hidden relative">
          {post.caption || "Sin descripción disponible."}
          <span className="absolute bottom-0 right-0 w-full h-6 bg-gradient-to-t from-[#0A0E1A] to-transparent pointer-events-none" />
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            {new Date(post.timestamp).toLocaleDateString("es-AR", { day: '2-digit', month: 'short' })}
          </span>
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
            <ExternalLink className="h-3 w-3 text-white/40" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
