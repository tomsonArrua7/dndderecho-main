import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Megaphone, 
  ArrowRight, 
  Calendar, 
  BellRing, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const SECONDARY_NOTICES = [
  {
    tag: "Fechas Clave",
    title: "Mesas de Examen Finales y Libres",
    desc: "Cronograma oficial de turnos de examen y confirmación de aulas por cátedra.",
    to: "/calendario",
    icon: Calendar
  },
  {
    tag: "Trámite",
    title: "Presentación de Prórrogas y Equivalencias",
    desc: "Descargá los modelos de notas prearmados y presentalos en secretaría.",
    to: "/notas-formularios",
    icon: FileText
  },
  {
    tag: "Académico",
    title: "Recomendaciones de Comisiones 2026",
    desc: "Leé las valoraciones de otros compañeros antes de armar tu horario de cursada.",
    to: "/recomendaciones",
    icon: CheckCircle2
  }
];

export const FeaturedCampaign = () => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <section className="container py-12 md:py-16 relative z-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent mb-1">
            <Megaphone className="w-4 h-4" />
            Novedades y Campañas
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
            Comunicados destacados
          </h2>
        </div>
        <Link
          to="/noticias"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-accent hover:underline"
        >
          Ver todas las noticias <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DESTACADO PRINCIPAL (7 o 8 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-7 relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-[#1C090E] via-[#0F0D1C] to-[#050814] p-8 md:p-10 shadow-2xl text-white flex flex-col justify-between"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/25 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/15 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-300 font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/40 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              DESTACADO · CICLO LECTIVO 2026
            </div>

            {/* Título de la Campaña */}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4 !text-white">
              Acompañamiento Académico y Guía de Inscripción a Cursadas
            </h3>

            {/* Breve descripción de 2 líneas */}
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              Información clara sobre comisiones, sistema SIU Guaraní, solicitud de permutas y material de estudio disponible desde el primer día.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 px-6"
            >
              <Link to="/noticias" className="flex items-center gap-2">
                Leer comunicado completo <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl"
            >
              <Link to="/ingresantes">
                Guía 2026
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* NOTICIAS SECUNDARIAS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {SECONDARY_NOTICES.map((notice, idx) => {
            const Icon = notice.icon;
            return (
              <motion.div
                key={notice.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <Link
                  to={notice.to}
                  className={cn(
                    "group flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300 h-full",
                    "hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
                    isLight
                      ? "bg-white border-slate-200/90 hover:border-slate-400"
                      : "bg-card/70 border-white/10 hover:border-white/25 backdrop-blur-md"
                  )}
                >
                  <div className="p-3 rounded-2xl bg-muted/80 text-muted-foreground group-hover:bg-accent/15 group-hover:text-accent transition-colors shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-accent block mb-1">
                      {notice.tag}
                    </span>
                    <h4 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1 mb-1">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notice.desc}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
