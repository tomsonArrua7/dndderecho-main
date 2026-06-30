import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  HelpCircle,
  FileDown
} from "lucide-react";
import { toast } from "sonner";
import { LISTA_ARCHIVOS_LINKS } from "@/data/links_todos";
import { MAPA_LINKS_MATERIAS } from "@/data/links_carpetas";

interface Materia {
  id: string;
  nombre: string;
  anio: number;
}

const Apuntes = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // Fetch materias from database
  useEffect(() => {
    async function fetchMaterias() {
      try {
        setLoadingMaterias(true);
        const { data, error } = await supabase
          .from("materias")
          .select("*")
          .order("anio", { ascending: true })
          .order("nombre", { ascending: true });
        
        if (error) throw error;
        setMaterias(data || []);
      } catch (err: any) {
        console.error("Error al cargar materias:", err.message);
        toast.error("No se pudieron cargar las materias.");
      } finally {
        setLoadingMaterias(false);
      }
    }

    fetchMaterias();
  }, []);

  // 1. Obtener carpetas oficiales de la materia seleccionada
  const foldersMateria = useMemo(() => {
    if (!selectedMateria) return null;
    const cleanMateria = selectedMateria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
    
    for (const [key, val] of Object.entries(MAPA_LINKS_MATERIAS)) {
      const normKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
      if (normKey === cleanMateria) return val;
    }
    for (const [key, val] of Object.entries(MAPA_LINKS_MATERIAS)) {
      const normKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
      if (normKey.includes(cleanMateria) || cleanMateria.includes(normKey)) return val;
    }
    return null;
  }, [selectedMateria]);

  // 2. Obtener lista de archivos individuales específicos para la materia seleccionada
  const archivosMateria = useMemo(() => {
    if (!selectedMateria) return [];
    const cleanMateria = selectedMateria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
    
    let matched = LISTA_ARCHIVOS_LINKS.filter(a => {
      const normKey = a.materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
      return normKey === cleanMateria;
    });

    if (matched.length === 0) {
      matched = LISTA_ARCHIVOS_LINKS.filter(a => {
        const normKey = a.materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
        return normKey.includes(cleanMateria) || cleanMateria.includes(normKey);
      });
    }
    return matched;
  }, [selectedMateria]);

  // 3. Filtrar archivos en caliente según el buscador del alumno
  const filteredArchivos = useMemo(() => {
    if (!filterQuery.trim()) return archivosMateria;
    const q = filterQuery.toLowerCase().trim();
    return archivosMateria.filter(a => 
      a.nombre.toLowerCase().includes(q) || 
      a.categoria.toLowerCase().includes(q)
    );
  }, [archivosMateria, filterQuery]);

  // 4. Agrupar por categoría
  const archivosPorCategoria = useMemo(() => {
    const groups: Record<string, typeof archivosMateria> = {};
    for (const a of filteredArchivos) {
      const cat = a.categoria || "Otros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(a);
    }
    return groups;
  }, [filteredArchivos]);

  return (
    <div className="container py-8 md:py-12 max-w-6xl flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] selection:bg-accent/30">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-black mb-2 flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5 text-accent" /> Biblioteca Digital
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white">
            Material de Estudio
          </h1>
          <p className="text-white/60 text-sm md:text-base mt-2 max-w-2xl">
            Explora las carpetas oficiales de Drive o busca y descarga directamente programas oficiales, resúmenes de cátedra y apuntes en PDF.
          </p>
        </div>

        <a 
          href="https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-2.5 px-4 rounded-xl transition-all self-start md:self-center"
        >
          Ver Drive Completo <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Sidebar: Selector de Materia */}
        <Card className="lg:col-span-4 p-5 bg-[#0D1224]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col justify-between h-fit gap-6 shadow-2xl">
          <div className="space-y-5">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" /> Selección de Materia
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Materia *</label>
                {loadingMaterias ? (
                  <div className="h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-xs text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Cargando materias...
                  </div>
                ) : (
                  <select
                    value={selectedMateria}
                    onChange={(e) => {
                      setSelectedMateria(e.target.value);
                      setFilterQuery("");
                    }}
                    className="w-full bg-background/50 border border-white/10 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0A0E1A]">-- Selecciona Materia --</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.nombre} className="bg-[#0A0E1A]">
                        {m.nombre} ({m.anio}° Año)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2 text-xs text-white/70">
            <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-accent">
              <AlertCircle className="h-4 w-4" /> Acceso sin límites
            </div>
            <p className="leading-relaxed text-white/50">
              Esta sección lee directamente tu base de datos de enlaces y carpetas de Google Drive. Es 100% offline, gratuita y sin límites de descarga.
            </p>
          </div>
        </Card>

        {/* Panel Principal: Carpetas y Archivos */}
        <Card className="lg:col-span-8 bg-[#0D1224]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl">
          
          {!selectedMateria ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <p className="text-white font-bold text-base">Explorador de Biblioteca</p>
                <p className="text-white/40 text-sm leading-relaxed">
                  Selecciona una materia de la lista en la barra lateral para ver su bibliografía, apuntes y accesos directos de Drive.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 p-6 space-y-6 overflow-y-auto">
              
              {/* Carpetas del Drive */}
              <div>
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Carpetas Principales de Drive</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={foldersMateria?.programas || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-accent/20 border border-white/5 hover:border-accent/30 rounded-xl flex items-center gap-3 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-accent transition-colors truncate">Programas</div>
                      <div className="text-[9px] text-white/40 truncate">Ver en Google Drive</div>
                    </div>
                  </a>

                  <a
                    href={foldersMateria?.apuntes || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-accent/20 border border-white/5 hover:border-accent/30 rounded-xl flex items-center gap-3 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-accent transition-colors truncate">Apuntes y Resúmenes</div>
                      <div className="text-[9px] text-white/40 truncate">Ver en Google Drive</div>
                    </div>
                  </a>

                  <a
                    href={foldersMateria?.bibliografia || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-accent/20 border border-white/5 hover:border-accent/30 rounded-xl flex items-center gap-3 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-accent transition-colors truncate">Bibliografía (Libros)</div>
                      <div className="text-[9px] text-white/40 truncate">Ver en Google Drive</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Buscador de Archivos */}
              <div className="relative shrink-0">
                <Search className="h-4 w-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar programa, resumen o archivo específico por palabra clave..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-[#10162D]/60 border border-white/10 text-white rounded-xl py-2 px-9 text-xs focus:ring-2 focus:ring-accent/50 outline-none transition-all placeholder:text-white/20"
                />
              </div>

              {/* Lista de PDFs */}
              <div className="space-y-5 flex-1 min-h-0">
                {archivosMateria.length === 0 ? (
                  <div className="p-5 bg-white/5 border border-white/5 rounded-xl text-center text-xs text-white/40 leading-relaxed">
                    No hay archivos individuales cargados en la base de datos de enlaces para esta materia. Puedes explorar el contenido completo navegando en las carpetas de Drive generales arriba.
                  </div>
                ) : Object.keys(archivosPorCategoria).length === 0 ? (
                  <div className="p-5 bg-white/5 border border-white/5 rounded-xl text-center text-xs text-white/40">
                    Ningún archivo coincide con tu búsqueda "{filterQuery}".
                  </div>
                ) : (
                  Object.entries(archivosPorCategoria).map(([categoria, lista]) => (
                    <div key={categoria} className="space-y-2.5">
                      <h5 className="text-[10px] font-black text-white/30 uppercase tracking-wider pl-1">{categoria}</h5>
                      <div className="space-y-1.5">
                        {lista.map((archivo, aIdx) => (
                          <div
                            key={aIdx}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-between gap-4 transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                                <FileDown className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white/90 truncate pr-2" title={archivo.nombre}>
                                  {archivo.nombre}
                                </div>
                                <div className="text-[9px] text-white/40 truncate">
                                  {archivo.materia}
                                </div>
                              </div>
                            </div>
                            <a
                              href={archivo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold bg-accent hover:bg-accent/90 text-white py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all shrink-0 active:scale-95 cursor-pointer"
                            >
                              Ver Archivo <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </Card>
      </div>

    </div>
  );
};

export default Apuntes;
