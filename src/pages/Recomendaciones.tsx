import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookmarkCheck, 
  Search, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Clock, 
  BookOpen, 
  AlertCircle,
  FileSearch,
  Filter,
  Layers,
  Sprout,
  Users
} from "lucide-react";
import { MATERIAS_PLAN6, Materia } from "@/data/plan6Structure";
import { cn } from "@/lib/utils";

export interface RecomendacionData {
  materiaId: string;
  driveViewUrl: string;
  drivePreviewUrl: string;
  descripcion: string;
  fechaActualizacion: string;
}

// Datos de Recomendaciones oficiales compartidas
export const RECOMENDACIONES_MAP: Record<string, RecomendacionData> = {
  // DERECHO ROMANO (10121)
  "10121": {
    materiaId: "10121",
    driveViewUrl: "https://drive.google.com/file/d/1Iitm7axdGzWv7K69hkkkS34kYoKRNJdz/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1Iitm7axdGzWv7K69hkkkS34kYoKRNJdz/preview",
    descripcion: "Recomendaciones integrales de cursada, análisis de cátedras, metodología de parciales y conceptos clave para Derecho Romano.",
    fechaActualizacion: "Agosto 2026"
  },
  // HISTORIA CONSTITUCIONAL (10112)
  "10112": {
    materiaId: "10112",
    driveViewUrl: "https://drive.google.com/file/d/1n0Wyq5xtCZ2gN4VkJkMJimVngacYDNG0/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1n0Wyq5xtCZ2gN4VkJkMJimVngacYDNG0/preview",
    descripcion: "Guía oficial de lectura, análisis de programas de cátedras y tips de estudio para Historia Constitucional.",
    fechaActualizacion: "Agosto 2026"
  },
  // INTRODUCCIÓN A LA SOCIOLOGÍA (10113)
  "10113": {
    materiaId: "10113",
    driveViewUrl: "https://drive.google.com/file/d/1HFgbK8so_sDo5U1rf3p3ZSm7UxsyPAIw/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1HFgbK8so_sDo5U1rf3p3ZSm7UxsyPAIw/preview",
    descripcion: "Recomendaciones de lectura de autores sociológicos, evaluación de comisiones y tips para los exámenes.",
    fechaActualizacion: "Agosto 2026"
  },
  // INTRODUCCIÓN AL DERECHO (10111)
  "10111": {
    materiaId: "10111",
    driveViewUrl: "https://drive.google.com/file/d/1ZSU_A_9e5bZ2clIXJOUr1I8q6Rx62e5L/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1ZSU_A_9e5bZ2clIXJOUr1I8q6Rx62e5L/preview",
    descripcion: "Orientación inicial para ingresantes, resumen de doctrinas, cátedras recomendadas y modelos de examen.",
    fechaActualizacion: "Agosto 2026"
  }
};

// Secciones del menú: -1 = Ingresantes, 1..5 = Años 1 a 5
const NOM_SECCIONES: Record<number, string> = {
  [-1]: "INGRESANTES (Primer Año)",
  1: "Primer Año (1º Año)",
  2: "Segundo Año (2º Año)",
  3: "Tercer Año (3º Año)",
  4: "Cuarto Año (4º Año)",
  5: "Quinto Año (5º Año)"
};

export default function Recomendaciones() {
  const [selectedAnio, setSelectedAnio] = useState<number>(0); // 0 = Todas las secciones
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSecciones, setExpandedSecciones] = useState<Record<number, boolean>>({
    [-1]: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  // Modal para previsualización de PDF incorporado
  const [activePdfModal, setActivePdfModal] = useState<{
    materiaNombre: string;
    materiaCodigo: string;
    rec: RecomendacionData;
  } | null>(null);

  const toggleSeccion = (sec: number) => {
    setExpandedSecciones(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Filtrar materias por sección (Ingresantes vs Años 1 a 5)
  const materiasPorSeccion = useMemo(() => {
    const queryLower = searchQuery.toLowerCase().trim();

    const agrupadas: Record<number, { materia: Materia; rec?: RecomendacionData }[]> = {
      [-1]: [], 1: [], 2: [], 3: [], 4: [], 5: []
    };

    MATERIAS_PLAN6.forEach(materia => {
      const rec = RECOMENDACIONES_MAP[materia.id];
      const matchesSearch = 
        !queryLower ||
        materia.nombre.toLowerCase().includes(queryLower) ||
        materia.nombreCorto.toLowerCase().includes(queryLower) ||
        materia.id.includes(queryLower);

      if (matchesSearch) {
        // Las recomendaciones con PDF son EXCLUSIVAMENTE para INGRESANTES (-1).
        // En los años 1 a 5, las materias se muestran en preparación ("Próximamente").
        if (materia.anio === 1) {
          agrupadas[-1].push({ materia, rec });
          agrupadas[1].push({ materia, rec: undefined });
        } else {
          agrupadas[materia.anio].push({ materia, rec: undefined });
        }
      }
    });

    return agrupadas;
  }, [searchQuery]);

  const totalActivas = useMemo(() => {
    return Object.keys(RECOMENDACIONES_MAP).length;
  }, []);

  return (
    <div className="min-h-screen bg-[#050B14] text-white py-8 md:py-14 px-4 md:px-8 relative overflow-hidden">
      {/* Luces decorativas de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 md:space-y-12">
        
        {/* HEADER DE LA SECCIÓN */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
            <BookmarkCheck className="w-4 h-4 text-red-400" />
            <span>Guía Académica DND Jursoc • UNLP</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-red-400 bg-clip-text text-transparent">
            Recomendaciones de Materias
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          </p>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS (INGRESANTES + AÑOS 1 A 5) */}
        <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-4 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Campo de búsqueda */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por materia o código (ej: Romano, 10111)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 font-medium text-xs md:text-sm focus:outline-none focus:border-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selector de categorías: Ingresantes, 1º a 5º Año */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedAnio(0)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0",
                  selectedAnio === 0
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                )}
              >
                Todas las Materias
              </button>

              {/* Botón Destacado de INGRESANTES */}
              <button
                onClick={() => setSelectedAnio(-1)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 border",
                  selectedAnio === -1
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                )}
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>INGRESANTES</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="4 PDFs Disponibles" />
              </button>

              {/* Años 1 a 5 */}
              {[1, 2, 3, 4, 5].map(anio => (
                <button
                  key={anio}
                  onClick={() => setSelectedAnio(anio)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1",
                    selectedAnio === anio
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  )}
                >
                  <span>{anio}º Año</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* LISTADO DE SECCIONES (INGRESANTES + AÑOS 1 A 5) */}
        <div className="space-y-6">
          {[-1, 1, 2, 3, 4, 5].map(sec => {
            if (selectedAnio !== 0 && selectedAnio !== sec) return null;

            const materias = materiasPorSeccion[sec] || [];
            if (materias.length === 0 && searchQuery) return null;

            const isExpanded = expandedSecciones[sec] || !!searchQuery;
            const activasSeccion = materias.filter(m => m.rec).length;
            const isIngresantes = sec === -1;

            return (
              <motion.div
                key={sec}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl transition-colors",
                  isIngresantes 
                    ? "bg-gradient-to-b from-[#0A1C3D] via-[#0D1527] to-[#07101E] border-emerald-500/40" 
                    : "bg-[#0D1527]/90 border-white/15"
                )}
              >
                {/* CABECERA DE LA SECCIÓN (DESPLEGABLE) */}
                <button
                  onClick={() => toggleSeccion(sec)}
                  className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 font-serif font-bold text-lg",
                      isIngresantes 
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-gradient-to-br from-red-500/20 to-indigo-500/20 border-white/10 text-red-400"
                    )}>
                      {isIngresantes ? <Sprout className="w-6 h-6 text-emerald-400" /> : `${sec}º`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg md:text-xl font-black text-white">{NOM_SECCIONES[sec]}</h3>
                        {isIngresantes && (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {materias.length} materias del Plan Nº 6
                        {activasSeccion > 0 && (
                          <span className="text-emerald-400 font-bold ml-2">
                            • {activasSeccion} recomendación{activasSeccion !== 1 ? "es" : ""} disponible{activasSeccion !== 1 ? "s" : ""} (PDF)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activasSeccion > 0 ? (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        PDFs Disponibles
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 text-slate-400 border border-white/10 font-mono">
                        Próximamente
                      </span>
                    )}

                    <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* CONTENIDO DESPLEGABLE CON LAS MATERIAS */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 p-4 md:p-6 space-y-4 bg-slate-950/60"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materias.map(({ materia, rec }) => (
                          <div
                            key={`${sec}-${materia.id}`}
                            className={cn(
                              "p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group",
                              rec
                                ? "bg-gradient-to-b from-[#0A1C3D] to-[#071329] border-emerald-500/40 hover:border-emerald-500 shadow-lg shadow-emerald-500/5"
                                : "bg-slate-900/50 border-white/10 hover:border-white/20 opacity-80"
                            )}
                          >
                            <div className="space-y-3">
                              {/* Header de la materia */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-slate-300 font-mono border border-white/10">
                                      CÓD. {materia.id}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                      {materia.duracion} • {materia.horas}hs
                                    </span>
                                  </div>
                                  <h4 className="text-base md:text-lg font-black text-white group-hover:text-red-400 transition-colors">
                                    {materia.nombre}
                                  </h4>
                                </div>

                                {rec ? (
                                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono shrink-0 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Activa</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-white/5 text-slate-400 border border-white/10 font-mono shrink-0">
                                    En preparación
                                  </span>
                                )}
                              </div>

                              {/* Descripción o estado */}
                              {rec ? (
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {rec.descripcion}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-500 italic">
                                  Actualmente no hay recomendaciones cargadas para esta materia. ¡El equipo de DND está preparando el material!
                                </p>
                              )}
                            </div>

                            {/* Botones de acción */}
                            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                              {rec ? (
                                <>
                                  <button
                                    onClick={() => setActivePdfModal({
                                      materiaNombre: materia.nombre,
                                      materiaCodigo: materia.id,
                                      rec
                                    })}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all min-w-[140px]"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>Ver PDF Recomendación</span>
                                  </button>

                                  <a
                                    href={rec.driveViewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Abrir en Google Drive"
                                  >
                                    <ExternalLink className="w-4 h-4 text-blue-400" />
                                    <span className="hidden sm:inline">Drive</span>
                                  </a>
                                </>
                              ) : (
                                <div className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Próximamente</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* MODAL DE VISUALIZACIÓN DE PDF DE RECOMENDACIÓN */}
      <AnimatePresence>
        {activePdfModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-5xl w-full bg-[#0D1527] border border-white/20 rounded-3xl p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl relative"
            >
              {/* Encabezado del visor */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/20 text-red-300 font-mono border border-red-500/30">
                        CÓD. {activePdfModal.materiaCodigo}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Documento Oficial DND
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white">
                      Recomendaciones: {activePdfModal.materiaNombre}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActivePdfModal(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Visor Iframe de Google Drive */}
              <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-white/10 overflow-hidden min-h-[500px]">
                <iframe
                  src={activePdfModal.rec.drivePreviewUrl}
                  className="w-full h-full min-h-[500px] border-0"
                  allow="autoplay"
                  title={`Recomendaciones ${activePdfModal.materiaNombre}`}
                />
              </div>

              {/* Footer con opciones de descarga y cierre */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 shrink-0 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  {activePdfModal.rec.descripcion}
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={activePdfModal.rec.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>Abrir en Drive</span>
                  </a>

                  <button
                    onClick={() => setActivePdfModal(null)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
