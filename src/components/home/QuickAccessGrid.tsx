import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Repeat2, 
  Bot, 
  FileText, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const QUICK_CARDS = [
  {
    title: "Biblioteca Digital",
    subtitle: "Encontrá apuntes",
    description: "Resúmenes, programas y libros clasificados por cátedra y año de cursada.",
    to: "/apuntes",
    icon: BookOpen,
    badge: "Esencial",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    glowColor: "from-blue-600/10 to-transparent",
  },
  {
    title: "Plan de Estudios",
    subtitle: "Información académica",
    description: "Mapeá tu progreso en la carrera, correlatividades y materias pendientes.",
    to: "/plan",
    icon: GraduationCap,
    badge: "Malla 2026",
    badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    glowColor: "from-indigo-600/10 to-transparent",
  },
  {
    title: "Permutero DND",
    subtitle: "Cambiá de comisión",
    description: "Buscá compañeros para permutar tu horario y cursada de forma automática.",
    to: "/permutero",
    icon: Repeat2,
    badge: "Comunidad",
    badgeColor: "bg-red-500/10 text-red-500 border-red-500/20",
    glowColor: "from-red-600/10 to-transparent",
  },
  {
    title: "Asistente DND (IA)",
    subtitle: "Tutor inteligente",
    description: "Preguntale conceptos jurídicos, fallos y resúmenes específicos a cualquier hora.",
    to: "/asistente",
    icon: Bot,
    badge: "Inteligencia Artificial",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    glowColor: "from-emerald-600/10 to-transparent",
  },
  {
    title: "Notas y Formularios",
    subtitle: "Trámites oficiales",
    description: "Modelos de notas para mesa especial, prórrogas y solicitudes académicas.",
    to: "/notas-formularios",
    icon: FileText,
    badge: "Descargas",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    glowColor: "from-amber-600/10 to-transparent",
  },
  {
    title: "Guía de Ingreso",
    subtitle: "Ingresantes 2026",
    description: "Todo lo que necesitás saber para arrancar en la Facultad de Derecho de la UNLP.",
    to: "/ingresantes",
    icon: Sparkles,
    badge: "Nuevo Ciclo",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    glowColor: "from-purple-600/10 to-transparent",
  },
];

export const QuickAccessGrid = () => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <section className="container py-12 md:py-16 relative z-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Accesos Rápidos
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Herramientas principales para tu cursada
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Elegí el recurso que necesitás hoy y navegá sin complicaciones por la facultad.
        </p>
      </div>

      {/* Grid de 6 Tarjetas tipo Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {QUICK_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Link
                to={card.to}
                className={cn(
                  "group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl border transition-all duration-300 overflow-hidden",
                  "hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]",
                  isLight
                    ? "bg-white border-slate-200/90 hover:border-red-500/40 shadow-sm"
                    : "bg-[#0A0E1A]/80 border-white/10 hover:border-red-500/40 backdrop-blur-lg shadow-lg"
                )}
              >
                {/* Glow ambiental superior */}
                <div className={cn(
                  "absolute top-0 right-0 w-36 h-36 bg-gradient-to-br rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                  card.glowColor
                )} />

                <div>
                  {/* Card Header: Icono + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110",
                      isLight ? "bg-slate-100 text-slate-900" : "bg-white/5 text-white border border-white/10"
                    )}>
                      <Icon className="w-6 h-6 text-accent" strokeWidth={2} />
                    </div>

                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border",
                      card.badgeColor
                    )}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Textos */}
                  <div className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    {card.subtitle}
                  </div>
                  <h3 className="font-display text-xl font-black text-foreground mb-2 group-hover:text-accent transition-colors flex items-center gap-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer: CTA */}
                <div className="pt-6 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                  <span>Ingresar ahora</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/60 group-hover:bg-accent group-hover:text-white transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
