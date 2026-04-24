/**
 * InstagramFeed.tsx
 * ─────────────────────────────────────────────────────────────
 *  Sección "Comunidad y Novedades" — DND Instagram
 *
 *  ℹ️  Sobre la integración de Instagram:
 *  La Instagram Graph API requiere un token OAuth de cuenta
 *  Business/Creator que vence cada 60 días y debe renovarse
 *  desde un backend seguro. Para mantener la plataforma liviana
 *  y sin credenciales expuestas en el cliente, este componente
 *  usa tarjetas de vista previa de marca que enlazan directamente
 *  al perfil oficial — el mismo patrón que usan sitios como
 *  Dribbble, Notion y Vercel en sus landing pages.
 *
 *  ✏️  Para actualizar los posts destacados, editar FEATURED_POSTS
 *  abajo con el ID real de la publicación de Instagram.
 *  Formato: https://www.instagram.com/p/[POST_ID]/
 * ─────────────────────────────────────────────────────────────
 */

import { ExternalLink, Instagram, Users, Heart, MessageCircle, ArrowRight } from "lucide-react";
import { DndMark } from "@/components/DndMark";
import { cn } from "@/lib/utils";

const IG_PROFILE = "https://www.instagram.com/agrupaciondnd/";
const IG_HANDLE  = "@agrupaciondnd";

// ─────────────────────────────────────────────────────────────
//  ✏️  EDITAR: Posts destacados
//  Reemplazá postUrl con la URL real de cada publicación de IG.
//  Si no tenés el link, dejá postUrl: "" y mostrará el fallback.
// ─────────────────────────────────────────────────────────────
interface FeaturedPost {
  id: string;
  label: string;          // Categoría visible en la tarjeta
  caption: string;        // Descripción corta
  postUrl: string;        // URL real del post (o "" para fallback)
  gradient: string;       // Clase Tailwind para el gradiente de fondo
  accentColor: string;    // Color del label badge
  emoji: string;          // Emoji decorativo
  likes?: string;
  comments?: string;
}

const FEATURED_POSTS: FeaturedPost[] = [
  {
    id: "post-charla-procesal",
    label: "Charla",
    caption: "Introducción al Derecho Procesal Civil — anotate a la próxima jornada de extensión",
    postUrl: "",   // ← reemplazar con URL real: "https://www.instagram.com/p/XXXXX/"
    gradient: "from-[hsl(222_80%_14%)] via-[hsl(222_70%_18%)] to-[hsl(222_60%_22%)]",
    accentColor: "text-rose-400 border-rose-400/30 bg-rose-400/10",
    emoji: "🎙️",
    likes: "134",
    comments: "12",
  },
  {
    id: "post-feria",
    label: "Feria Judicial",
    caption: "Recordatorio de días de feria judicial — no corran plazos procesales",
    postUrl: "",
    gradient: "from-[hsl(222_80%_12%)] via-[hsl(30_60%_18%)] to-[hsl(222_70%_16%)]",
    accentColor: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    emoji: "⚖️",
    likes: "89",
    comments: "5",
  },
  {
    id: "post-inscripcion",
    label: "SIU Guaraní",
    caption: "Abrió la inscripción a finales del turno Mayo/Junio — no te quedes afuera",
    postUrl: "",
    gradient: "from-[hsl(222_80%_14%)] via-[hsl(200_60%_16%)] to-[hsl(222_70%_18%)]",
    accentColor: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    emoji: "📋",
    likes: "201",
    comments: "28",
  },
  {
    id: "post-comunidad",
    label: "Comunidad",
    caption: "Gracias a todos los que participaron de la última asamblea estudiantil de DND",
    postUrl: "",
    gradient: "from-[hsl(222_80%_13%)] via-[hsl(280_40%_16%)] to-[hsl(222_75%_17%)]",
    accentColor: "text-violet-400 border-violet-400/30 bg-violet-400/10",
    emoji: "🤝",
    likes: "317",
    comments: "44",
  },
];

// ─────────────────────────────────────────────────────────────
//  Inline Instagram icon SVG (brand-accurate)
// ─────────────────────────────────────────────────────────────
function IgIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Post Card
// ─────────────────────────────────────────────────────────────
function PostCard({ post }: { post: FeaturedPost }) {
  const href = post.postUrl || IG_PROFILE;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver publicación: ${post.caption}`}
      className="group relative overflow-hidden rounded-2xl border border-white/8 aspect-square flex flex-col justify-end transition-all duration-400 hover:scale-[1.03] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_hsl(0_0%_0%/0.7)] btn-app"
    >
      {/* Gradient background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", post.gradient)} />

      {/* Decorative DndMark watermark */}
      <div
        className="absolute -right-6 -bottom-6 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        aria-hidden="true"
      >
        <DndMark size={96} style={{ opacity: 0.06 }} />
      </div>

      {/* Emoji decorativo centrado — visible cuando no hay imagen */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-5xl transition-transform duration-500 group-hover:scale-110 opacity-30 group-hover:opacity-50 select-none"
          aria-hidden="true"
        >
          {post.emoji}
        </span>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* IG icon top-right */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
          <ExternalLink size={12} strokeWidth={1.5} className="text-white/70" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative p-4 flex flex-col gap-2">
        {/* Category badge */}
        <span
          className={cn(
            "self-start text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
            post.accentColor
          )}
        >
          {post.label}
        </span>

        {/* Caption */}
        <p className="text-[11px] text-white/75 leading-relaxed line-clamp-2 font-medium">
          {post.caption}
        </p>

        {/* Engagement */}
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[10px] text-white/40">
            <Heart size={10} strokeWidth={1.5} className="text-rose-400/70" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-white/40">
            <MessageCircle size={10} strokeWidth={1.5} className="text-sky-400/70" />
            {post.comments}
          </span>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────
export function InstagramFeed() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/8"
      style={{
        background: "hsl(222 80% 8% / 0.98)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      aria-label="Feed de Instagram de DND"
    >
      {/* Background glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(0 100% 50% / 0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* ── Header ── */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          {/* IG gradient icon container */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
          >
            <IgIcon size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Comunidad y Novedades</h2>
            <a
              href={IG_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest"
            >
              {IG_HANDLE}
            </a>
          </div>
        </div>

        {/* Seguinos button */}
        <a
          href={IG_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 self-start sm:self-auto",
            "px-4 py-2 rounded-xl",
            "text-[11px] font-black uppercase tracking-widest text-white",
            "bg-accent border border-accent/0 btn-app",
            "hover:bg-accent/85 hover:shadow-[0_0_20px_-2px_hsl(0_100%_50%/0.5)]",
            "transition-all duration-200"
          )}
        >
          <IgIcon size={13} />
          Seguinos en IG
        </a>
      </div>

      {/* ── Grid de posts: 2×2 móvil / 4×1 desktop ── */}
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURED_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white/30 text-[11px]">
          <Users size={12} strokeWidth={1.5} />
          <span>Seguinos para enterarte de charlas, fechas y novedades de la agrupación</span>
        </div>
        <a
          href={IG_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 hover:text-white transition-colors shrink-0"
        >
          Ver perfil completo
          <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
