import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  Repeat2, 
  Bot, 
  Trophy, 
  ArrowRight, 
  Sparkles,
  ArrowUpRight,
  GraduationCap
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import rectoradoNueva from "@/assets/rectorado-nueva.png";
import { QuickSearchModal } from "./QuickSearchModal";

const HERO_FEATURE_CARDS = [
  {
    title: "Apuntes",
    desc: "Biblioteca digital & programas",
    to: "/apuntes",
    icon: BookOpen,
    badge: "Drive UNLP",
    color: "from-blue-600/20 to-blue-900/10",
    border: "group-hover:border-blue-500/50",
    iconBg: "bg-blue-500/15 text-blue-500",
  },
  {
    title: "Permutas",
    desc: "Cambios de comisión en vivo",
    to: "/permutero",
    icon: Repeat2,
    badge: "Comunidad",
    color: "from-red-600/20 to-red-900/10",
    border: "group-hover:border-red-500/50",
    iconBg: "bg-red-500/15 text-red-500",
  },
  {
    title: "Tutor IA",
    desc: "Respuestas y consultas 24/7",
    to: "/asistente",
    icon: Bot,
    badge: "Inteligencia Artificial",
    color: "from-emerald-600/20 to-emerald-900/10",
    border: "group-hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/15 text-emerald-500",
  },
  {
    title: "Trivia Jurídica",
    desc: "Desafíos y ranking semanal",
    to: "/trivia",
    icon: Trophy,
    badge: "Puntos & Racha",
    color: "from-amber-600/20 to-amber-900/10",
    border: "group-hover:border-amber-500/50",
    iconBg: "bg-amber-500/15 text-amber-500",
  },
];

const SUGGESTIONS = [
  { label: "Derecho Penal", query: "Derecho Penal" },
  { label: "Derecho Civil", query: "Derecho Civil" },
  { label: "Constitucional", query: "Constitucional" },
  { label: "Laboral", query: "Laboral" },
  { label: "Permutero", query: "Permutero" },
];

export const HeroSection = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const handleOpenSearch = (initialQuery = "") => {
    setSearchInitialQuery(initialQuery);
    setIsSearchOpen(true);
  };

  return (
    <>
      <section className="relative min-h-[84vh] md:min-h-[86vh] flex items-center justify-center overflow-hidden w-full max-w-full pt-4 pb-12 md:py-16">
        
        {/* Background Image with Layered Duotones */}
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden w-full max-w-full"
        >
          <img
            src={rectoradoNueva}
            alt="Facultad de Ciencias Jurídicas y Sociales UNLP"
            className={cn(
              "w-full h-full object-cover object-center transition-opacity duration-500",
              isLight ? "opacity-30" : "opacity-85"
            )}
          />

          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-100/80 via-white/40 to-red-100/80" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-background" />
              <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sky-400/15 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-400/15 rounded-full blur-[120px] pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#020726]/95 via-[#0A1D66]/55 via-25% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#2E030B]/95 via-[#8A0D20]/55 via-25% to-transparent" />
              <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#0D2B8A]/30 rounded-full blur-[150px] pointer-events-none" />
              <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#B8122B]/30 rounded-full blur-[150px] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 via-15% to-transparent" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#060A18]/70 to-transparent" />
            </>
          )}
        </motion.div>

        {/* Content Container (Above-the-fold product focused) */}
        <div className="container relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto">
          
          {/* Badge Institucional */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/15 backdrop-blur-md mb-4 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className={cn(
              "text-[10px] sm:text-xs font-black tracking-widest uppercase",
              isLight ? "text-slate-800" : "text-white/90"
            )}>
              UNLP · Facultad de Ciencias Jurídicas y Sociales
            </span>
          </motion.div>

          {/* Título Principal Conciso y Memorable */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              "font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black max-w-3xl mx-auto leading-[1.12] tracking-tight mb-3",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            Tu vida en Derecho,{" "}
            <span className="text-accent underline decoration-red-500/40 underline-offset-4">
              más simple.
            </span>
          </motion.h1>

          {/* Subtítulo Breve y Humano */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              "text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6 sm:mb-8 font-medium leading-relaxed",
              isLight ? "text-slate-700 font-semibold" : "text-white/80"
            )}
          >
            Apuntes, herramientas y una comunidad creada por estudiantes, para estudiantes.
          </motion.p>

          {/* 🔍 BUSCADOR PROTAGONISTA COMPACTO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-2xl mb-4 sm:mb-6"
          >
            <div
              onClick={() => handleOpenSearch()}
              className={cn(
                "w-full flex items-center gap-3 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer group shadow-xl",
                isLight 
                  ? "bg-white/95 border-slate-300 hover:border-red-500 hover:shadow-red-500/10" 
                  : "bg-[#0A0E1A]/90 border-white/20 hover:border-red-500/60 hover:shadow-red-500/20 backdrop-blur-xl"
              )}
            >
              <div className="p-2 sm:p-2.5 rounded-xl bg-accent text-white shadow-md shadow-accent/30 group-hover:scale-105 transition-transform shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className={cn(
                  "text-xs sm:text-sm md:text-base font-semibold block truncate",
                  isLight ? "text-slate-500 group-hover:text-slate-800" : "text-white/60 group-hover:text-white"
                )}>
                  ¿Qué estás buscando?
                </span>
                <span className="text-[11px] text-muted-foreground hidden sm:block truncate">
                  Buscar apuntes, materias, trámites, permutas...
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-muted-foreground text-xs font-bold shrink-0">
                Buscar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Chips de sugerencias rápidas */}
            <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-2.5">
              <span className={cn("text-[11px] sm:text-xs font-bold uppercase tracking-wider mr-1", isLight ? "text-slate-600" : "text-white/50")}>
                Sugerencias:
              </span>
              {SUGGESTIONS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleOpenSearch(item.query)}
                  className={cn(
                    "px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all hover:scale-105 active:scale-95 border",
                    isLight
                      ? "bg-white/80 border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-400 hover:text-red-600"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-accent/20 hover:border-accent/40 hover:text-white backdrop-blur-md"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 📱💻 ZONA VISUAL: 4 TARJETAS DE FUNCIONALIDADES REALES (Feature 3 & Mobile 2x2) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-2 sm:mt-4"
          >
            {HERO_FEATURE_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.to}
                  className={cn(
                    "group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-left overflow-hidden",
                    "hover:shadow-lg hover:-translate-y-1 active:scale-[0.97]",
                    card.border,
                    isLight
                      ? "bg-white/95 border-slate-200/90 shadow-sm"
                      : "bg-[#0A0E1A]/85 border-white/10 backdrop-blur-xl shadow-md"
                  )}
                >
                  {/* Subtle top glow on hover */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    card.color
                  )} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className={cn("p-2 rounded-xl transition-transform duration-300 group-hover:scale-110", card.iconBg)}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-display text-xs sm:text-sm md:text-base font-black text-foreground group-hover:text-accent transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {card.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchInitialQuery}
      />
    </>
  );
};
