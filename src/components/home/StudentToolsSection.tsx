import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  FolderOpen, 
  GraduationCap, 
  ArrowRight,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { MAPA_LINKS_MATERIAS } from "@/data/links_carpetas";

const ANIOS_ACADEMICOS = [
  { anio: 1, label: "1° Año", materias: ["Derecho Romano", "Introducción al Derecho", "Derecho Político", "Historia Constitucional"] },
  { anio: 2, label: "2° Año", materias: ["Derecho Constitucional", "Derecho Civil I", "Derecho Penal I", "Economía Política"] },
  { anio: 3, label: "3° Año", materias: ["Derecho Civil II", "Derecho Penal II", "Derecho Comercial I", "Derecho Procesal I"] },
  { anio: 4, label: "4° Año", materias: ["Derecho Civil III", "Derecho Comercial II", "Derecho del Trabajo", "Derecho Administrativo I"] },
  { anio: 5, label: "5° Año", materias: ["Derecho Civil IV", "Derecho Internacional Público", "Derecho Agrario y Minero", "Derecho Procesal II"] },
  { anio: 6, label: "6° Año", materias: ["Derecho Civil V (Plan 5)", "Derecho de las Sucesiones (Plan 6)", "Derecho Internacional Privado", "Filosofía del Derecho"] },
];

export const StudentToolsSection = () => {
  const [selectedAnio, setSelectedAnio] = useState(1);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const currentAnioData = ANIOS_ACADEMICOS.find((a) => a.anio === selectedAnio) || ANIOS_ACADEMICOS[0];

  return (
    <section className="container py-12 md:py-16 relative z-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent mb-1">
            <Layers className="w-4 h-4" />
            Herramientas para Estudiantes
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
            Explorador académico por año
          </h2>
        </div>
        <Link
          to="/apuntes"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-accent hover:underline"
        >
          Ver catálogo completo de materias <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs Selector de Año */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {ANIOS_ACADEMICOS.map((tab) => {
          const isActive = tab.anio === selectedAnio;
          return (
            <button
              key={tab.anio}
              onClick={() => setSelectedAnio(tab.anio)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0",
                isActive
                  ? "bg-accent text-white border-accent shadow-md shadow-accent/25 scale-105"
                  : isLight
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    : "bg-card/70 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Materias del Año Seleccionado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentAnioData.materias.map((materiaNombre) => {
          const links = MAPA_LINKS_MATERIAS[materiaNombre] || { apuntes: "", bibliografia: "", programas: "" };

          return (
            <motion.div
              key={materiaNombre}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "p-5 rounded-3xl border flex flex-col justify-between transition-all duration-300 group",
                "hover:shadow-lg hover:-translate-y-1",
                isLight
                  ? "bg-white border-slate-200/90 hover:border-red-500/40"
                  : "bg-card/70 border-white/10 hover:border-red-500/40 backdrop-blur-md"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {currentAnioData.label}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-foreground mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
                  {materiaNombre}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  Resúmenes, programas oficiales y material de cátedra de la UNLP.
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <Link
                  to={`/apuntes?buscar=${encodeURIComponent(materiaNombre)}`}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  Ver apuntes <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {links.apuntes && (
                  <a
                    href={links.apuntes}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Carpeta en Google Drive"
                    className="p-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
