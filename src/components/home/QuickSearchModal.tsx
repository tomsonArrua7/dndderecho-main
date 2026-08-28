import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  Repeat2, 
  Bot, 
  GraduationCap, 
  CalendarDays, 
  FileText, 
  Sparkles, 
  Trophy, 
  Newspaper, 
  ExternalLink, 
  X, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { MAPA_LINKS_MATERIAS } from "@/data/links_carpetas";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface SearchItem {
  id: string;
  title: string;
  category: "Materia" | "Herramienta" | "Trámite" | "Comunidad";
  description: string;
  to?: string;
  externalUrl?: string;
  icon: any;
}

const STATIC_TOOLS: SearchItem[] = [
  {
    id: "apuntes",
    title: "Biblioteca Digital y Apuntes",
    category: "Herramienta",
    description: "Acceso a resúmenes, programas y bibliografía de todas las cátedras",
    to: "/apuntes",
    icon: BookOpen
  },
  {
    id: "permutero",
    title: "Permutero DND",
    category: "Herramienta",
    description: "Publicá y encontrá permutas de comisión en tiempo real",
    to: "/permutero",
    icon: Repeat2
  },
  {
    id: "asistente",
    title: "Tutor IA: Asistente DND",
    category: "Herramienta",
    description: "Consultas académicas, resúmenes y orientación 24/7 con Inteligencia Artificial",
    to: "/asistente",
    icon: Bot
  },
  {
    id: "plan",
    title: "Plan de Estudios Interactivo",
    category: "Herramienta",
    description: "Malla curricular, correlatividades y seguimiento de tu carrera",
    to: "/plan",
    icon: GraduationCap
  },
  {
    id: "calendario",
    title: "Calendario Académico",
    category: "Herramienta",
    description: "Fechas de inscripción, cursadas, mesas de examen y recesos",
    to: "/calendario",
    icon: CalendarDays
  },
  {
    id: "trivia",
    title: "Trivia Jurídica",
    category: "Comunidad",
    description: "Desafío diario de preguntas de derecho, ranking semanal e insignias",
    to: "/trivia",
    icon: Trophy
  },
  {
    id: "ingresantes",
    title: "Guía de Ingresantes 2026",
    category: "Trámite",
    description: "Información inicial, cursos de ingreso, edificios y primeros pasos en UNLP",
    to: "/ingresantes",
    icon: Sparkles
  },
  {
    id: "notas-formularios",
    title: "Modelos de Notas y Formularios",
    category: "Trámite",
    description: "Descarga de formularios oficiales, notas para mesa especial y reclamos",
    to: "/notas-formularios",
    icon: FileText
  },
  {
    id: "recomendaciones",
    title: "Recomendaciones de Cátedras",
    category: "Comunidad",
    description: "Opiniones y recomendaciones estudiantiles sobre cursadas y docentes",
    to: "/recomendaciones",
    icon: ShieldCheck
  },
  {
    id: "noticias",
    title: "Noticias y Campañas",
    category: "Comunidad",
    description: "Últimas novedades gremiales, académicas e institucionales de la facultad",
    to: "/noticias",
    icon: Newspaper
  },
];

export const QuickSearchModal = ({ isOpen, onClose, initialQuery = "" }: QuickSearchModalProps) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  // Handle Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Combine static items and subjects from database/map
  const subjectItems: SearchItem[] = useMemo(() => {
    return Object.keys(MAPA_LINKS_MATERIAS).map((materiaNombre) => {
      const links = MAPA_LINKS_MATERIAS[materiaNombre];
      return {
        id: `materia-${materiaNombre}`,
        title: materiaNombre,
        category: "Materia",
        description: "Apuntes, bibliografía y programas oficiales de la cátedra",
        to: `/apuntes?buscar=${encodeURIComponent(materiaNombre)}`,
        externalUrl: links.apuntes || links.bibliografia || undefined,
        icon: BookOpen
      };
    });
  }, []);

  const allItems = useMemo(() => [...STATIC_TOOLS, ...subjectItems], [subjectItems]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        destacados: STATIC_TOOLS.slice(0, 6),
        materias: subjectItems.slice(0, 4)
      };
    }
    const matches = allItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

    return {
      destacados: matches.filter((m) => m.category !== "Materia"),
      materias: matches.filter((m) => m.category === "Materia")
    };
  }, [query, allItems, subjectItems]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.to) {
      navigate(item.to);
    } else if (item.externalUrl) {
      window.open(item.externalUrl, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10"
          >
            {/* Input Header */}
            <div className="p-4 sm:p-5 border-b border-border/60 flex items-center gap-3 bg-muted/20">
              <Search className="w-5 h-5 text-accent shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscá materias, apuntes, trámites, permutas..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base sm:text-lg font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground text-xs font-semibold px-2 transition-colors shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Sugerencias Rápidas */}
              {!query && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    Sugerencias frecuentes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Derecho Penal", "Derecho Civil", "Derecho Constitucional", "Derecho Laboral", "Permutero", "Guía Ingreso"].map((sug) => (
                      <button
                        key={sug}
                        onClick={() => setQuery(sug)}
                        className="px-3 py-1.5 rounded-full bg-muted/60 hover:bg-accent/15 hover:text-accent border border-border text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Herramientas y Accesos */}
              {filteredResults.destacados.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    Herramientas y Trámites
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredResults.destacados.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="group flex items-start gap-3 p-3 rounded-2xl bg-card hover:bg-accent/10 border border-border hover:border-accent/30 text-left transition-all duration-200 active:scale-[0.98]"
                      >
                        <div className="p-2 rounded-xl bg-muted group-hover:bg-accent/20 group-hover:text-accent text-muted-foreground transition-colors shrink-0">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-foreground group-hover:text-accent truncate">
                              {item.title}
                            </h4>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Materias y Apuntes */}
              {filteredResults.materias.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      Materias y Programas
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {filteredResults.materias.length} disponibles
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredResults.materias.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border text-left transition-all duration-200 group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                            <BookOpen className="w-4 h-4 text-accent" />
                          </div>
                          <div className="truncate">
                            <div className="text-sm font-bold text-foreground group-hover:text-accent truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Ver apuntes, libros y programas
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            Biblioteca
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sin resultados */}
              {filteredResults.destacados.length === 0 && filteredResults.materias.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    No encontramos resultados para "{query}"
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Probá buscando por materia (ej. <em>Romano</em>, <em>Obligaciones</em>) o ingresá a la biblioteca completa.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/apuntes?buscar=${encodeURIComponent(query)}`);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-md shadow-accent/20 hover:bg-accent/90 transition-all"
                  >
                    Buscar en Biblioteca completa <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/60 bg-muted/10 text-center text-xs text-muted-foreground flex items-center justify-between px-5">
              <span>Tip: Usá las sugerencias para navegar rápido</span>
              <span className="font-semibold text-accent">DND Jursoc</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
