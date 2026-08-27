import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Loader2, Trash2, Search, UserMinus, UserCheck, Mail, ShieldAlert, 
  Users, Repeat, Trophy, Sparkles, TrendingUp, ShieldCheck, Activity, GraduationCap,
  FileSpreadsheet, Download, Eye, CheckCircle, Clock, Check, Brain,
  BarChart2, BookOpen, Layers, CheckCircle2, Percent
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CATEGORIAS_TRIVIA, TRIVIA_QUESTIONS, TriviaQuestion } from "@/data/triviaData";

export default function AdminPanel() {
  const { user, profile: myProfile, loading: authLoading } = useAuth();
  const [permutas, setPermutas] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [correcciones, setCorrecciones] = useState<any[]>([]);
  const [preguntasTriviaIA, setPreguntasTriviaIA] = useState<any[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [appSettings, setAppSettings] = useState<{ id: number; permutero_activo: boolean; modo_mantenimiento: boolean } | null>(null);
  const [totalPartidasCount, setTotalPartidasCount] = useState<number>(0);
  const [totalDuelosCount, setTotalDuelosCount] = useState<number>(0);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Correction Modal States
  const [selectedCorreccion, setSelectedCorreccion] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Search & Filter States
  const [searchMateria, setSearchMateria] = useState("");
  const [searchUser, setSearchUser] = useState("");
  
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [sendingMail, setSendingMail] = useState(false);

  // Permutas Counter State
  const [customPermutasCount, setCustomPermutasCount] = useState<string>("");

  // Permutas Histórico & Períodos Permanentes
  const [historicoPeriodos, setHistoricoPeriodos] = useState<any[]>([]);
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>("consolidado");
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archivePeriodName, setArchivePeriodName] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()} - ${d.getMonth() < 6 ? "1° Cuatrimestre" : "2° Cuatrimestre"}`;
  });

  // User Filter & Sort States
  const [searchUserProfile, setSearchUserProfile] = useState("");
  const [userSortOrder, setUserSortOrder] = useState<"recent" | "az" | "year">("recent");

  // Instagram Feed States
  const [instagramToken, setInstagramToken] = useState("");
  const [savingIgToken, setSavingIgToken] = useState(false);
  const [igLastSync, setIgLastSync] = useState<string | null>(null);
  const [igPostsCount, setIgPostsCount] = useState<number>(0);

  const exportUsersToExcel = () => {
    if (!profiles || profiles.length === 0) {
      toast.error("No hay usuarios para exportar");
      return;
    }

    const sortedProfiles = [...profiles].sort((a, b) =>
      (a.full_name || "").localeCompare(b.full_name || "", "es", { sensitivity: "base" })
    );

    const dataToExport = sortedProfiles.map((p, idx) => ({
      "N°": idx + 1,
      "Nombre Completo": p.full_name || "Sin nombre",
      "Año de Ingreso": p.anio_ingreso ? p.anio_ingreso : "No especificado",
      "Teléfono": p.telefono || "No especificado",
      "Rol": p.role === "admin" ? "Administrador" : p.role === "betatester" ? "Betatester" : p.role === "escritor" ? "Escritor" : "Estudiante",
      "Suscrito a Calendario": p.suscripto_calendario ? "Sí" : "No",
      "Estado de Veto": p.is_banned ? "Vetado" : "Activo",
      "Permutas Publicadas": userPermutaCount[p.id] || 0,
      "Fecha de Registro": p.created_at ? new Date(p.created_at).toLocaleString("es-AR") : "",
      "ID de Usuario": p.id,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes DND");

    worksheet["!cols"] = [
      { wch: 5 },   // N°
      { wch: 32 },  // Nombre
      { wch: 15 },  // Año ingreso
      { wch: 18 },  // Teléfono
      { wch: 15 },  // Rol
      { wch: 22 },  // Suscrito
      { wch: 12 },  // Estado
      { wch: 18 },  // Permutas
      { wch: 22 },  // Fecha registro
      { wch: 38 },  // ID
    ];

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Estudiantes_DND_Derecho_${today}.xlsx`);
    toast.success(`Exportados ${sortedProfiles.length} usuarios a Excel en orden alfabético.`);
  };

  const exportPermutasToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // 1. Hoja: Resumen General
    const resumenData = [
      { "Métrica": "Período Analizado", "Valor": permutaStats.nombrePeriodo },
      { "Métrica": "Personas Efectivamente Permutadas (Histórico + Activo)", "Valor": permutaStats.personasEfectivasTotal },
      { "Métrica": "Contador Histórico Acumulado (app_settings)", "Valor": permutaStats.historicoContador },
      { "Métrica": "Permutas Totales Registradas", "Valor": permutaStats.total },
      { "Métrica": "Permutas Activas (En búsqueda)", "Valor": permutaStats.activas },
      { "Métrica": "Permutas Realizadas (Concretadas)", "Valor": permutaStats.realizadas },
      { "Métrica": "Permutas Canceladas", "Valor": permutaStats.canceladas },
      { "Métrica": "Materia con Mayor Demanda", "Valor": permutaStats.topMateria ? `${permutaStats.topMateria.nombre} (${permutaStats.topMateria.total} publicaciones)` : "N/A" },
      { "Métrica": "Año de la Carrera con Mayor Demanda", "Valor": permutaStats.topAnio ? `${permutaStats.topAnio.anio}° Año (${permutaStats.topAnio.total} publicaciones, ${permutaStats.topAnio.pct}%)` : "N/A" },
    ];
    const wsResumen = XLSX.utils.json_to_sheet(resumenData);
    wsResumen["!cols"] = [{ wch: 55 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(workbook, wsResumen, "Resumen General");

    // 2. Hoja: Por Año de la Carrera
    const anioData = permutaStats.porAnioCarrera.map((a: any) => ({
      "Año de Carrera": `${a.anio}° Año`,
      "Total Permutas": a.total,
      "% del Total": `${a.pct}%`,
      "Permutas Activas": a.activas,
      "Permutas Realizadas": a.realizadas,
    }));
    const wsAnio = XLSX.utils.json_to_sheet(anioData);
    wsAnio["!cols"] = [{ wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, wsAnio, "Por Año de Carrera");

    // 3. Hoja: Ranking de Materias
    const materiasData = permutaStats.rankingMaterias.map((m: any, idx: number) => ({
      "Posición": idx + 1,
      "Materia": m.nombre,
      "Año de Cursada": `${m.anio}° Año`,
      "Total Permutas": m.total,
      "% sobre Total": `${permutaStats.total > 0 ? ((m.total / permutaStats.total) * 100).toFixed(1) : 0}%`,
      "Activas": m.activas,
      "Realizadas": m.realizadas,
    }));
    const wsMaterias = XLSX.utils.json_to_sheet(materiasData);
    wsMaterias["!cols"] = [{ wch: 10 }, { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(workbook, wsMaterias, "Ranking Materias");

    // 4. Hoja: Historial de Períodos Archivados
    if (historicoPeriodos.length > 0) {
      const periodosSheetData = historicoPeriodos.map((p, idx) => ({
        "N°": idx + 1,
        "Período / Temporada": p.nombre_periodo,
        "Fecha Cierre": p.fecha_cierre ? new Date(p.fecha_cierre).toLocaleDateString("es-AR") : "",
        "Total Permutas": p.total_permutas,
        "Realizadas": p.total_realizadas,
        "Activas": p.total_activas,
        "Personas Beneficiadas": p.personas_beneficiadas,
      }));
      const wsPeriodos = XLSX.utils.json_to_sheet(periodosSheetData);
      wsPeriodos["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(workbook, wsPeriodos, "Historial de Períodos");
    }

    // 5. Hoja: Detalle Permutas Actuales (si hay)
    if (permutas.length > 0) {
      const detalleData = permutas.map((p, idx) => {
        const prof = profiles.find(f => f.id === p.user_id);
        return {
          "N°": idx + 1,
          "Estudiante": prof?.full_name || p.nombre_contacto || "Desconocido",
          "Teléfono": p.telefono || "No especificado",
          "Materia": p.materias?.nombre || "No especificada",
          "Año Carrera": p.materias?.anio ? `${p.materias.anio}° Año` : "No especificado",
          "Comisión Tiene": p.comision_tiene,
          "Comisiones Busca": Array.isArray(p.comisiones_busca) ? p.comisiones_busca.join(", ") : p.comisiones_busca,
          "Estado": p.status || (p.activa ? "activa" : "inactiva"),
          "Fecha Publicación": p.created_at ? new Date(p.created_at).toLocaleString("es-AR") : "",
          "Notas": p.notas || "",
        };
      });
      const wsDetalle = XLSX.utils.json_to_sheet(detalleData);
      wsDetalle["!cols"] = [
        { wch: 5 }, { wch: 28 }, { wch: 16 }, { wch: 35 }, { wch: 14 },
        { wch: 16 }, { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 30 }
      ];
      XLSX.utils.book_append_sheet(workbook, wsDetalle, "Detalle Permutas Actuales");
    }

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Estadisticas_Permutas_DND_${today}.xlsx`);
    toast.success("¡Reporte estadístico de permutas exportado a Excel exitosamente!");
  };

  // Trivia Search & Export States
  const [triviaSearchQuery, setTriviaSearchQuery] = useState("");
  const [triviaYearFilter, setTriviaYearFilter] = useState<number>(0);
  const [triviaCategoryFilter, setTriviaCategoryFilter] = useState<string>("todas");
  const [triviaViewMode, setTriviaViewMode] = useState<"banco" | "moderacion">("banco");

  // Banco Consolidado Completo (100% de la Trivia: Base Local + Supabase DB)
  const allTriviaQuestionsConsolidated = useMemo(() => {
    const map = new Map<string, any>();
    
    // 1. Preguntas base del sistema
    TRIVIA_QUESTIONS.forEach(q => {
      if (q && q.id) {
        const cat = CATEGORIAS_TRIVIA.find(c => c.id === q.id_categoria);
        map.set(q.id, {
          ...q,
          anio: cat ? cat.anio : (q.anio || 1),
          categoria_nombre: cat ? cat.nombre : (q.categoria_nombre || "General"),
          origen: "Banco Base Oficial"
        });
      }
    });

    // 2. Preguntas de la base de datos Supabase
    preguntasTriviaIA.forEach(dbQ => {
      if (dbQ && dbQ.id) {
        const cat = CATEGORIAS_TRIVIA.find(c => c.id === dbQ.categoria_id || c.nombre.toLowerCase() === (dbQ.materia || "").toLowerCase());
        map.set(dbQ.id, {
          id: dbQ.id,
          id_categoria: dbQ.categoria_id || (cat ? cat.id : "todas"),
          categoria_nombre: dbQ.materia || (cat ? cat.nombre : "General"),
          anio: cat ? cat.anio : (dbQ.anio || 1),
          pregunta: dbQ.pregunta,
          opciones: Array.isArray(dbQ.opciones) ? dbQ.opciones : [dbQ.opcion_a, dbQ.opcion_b, dbQ.opcion_c, dbQ.opcion_d].filter(Boolean),
          respuesta_correcta_index: dbQ.opcion_correcta ?? dbQ.respuesta_correcta_index ?? 0,
          fundamento_juridico: dbQ.fundamento_juridico || "",
          dificultad: dbQ.dificultad || "media",
          puntos_base: dbQ.puntos_base || 100,
          origen: dbQ.aprobado ? "Base de Datos (Aprobada)" : "Base de Datos (Pendiente IA)"
        });
      }
    });

    return Array.from(map.values());
  }, [preguntasTriviaIA]);

  // Preguntas filtradas para visualización en vivo en el panel
  const filteredTriviaQuestions = useMemo(() => {
    return allTriviaQuestionsConsolidated.filter(q => {
      // Filtro Año
      if (triviaYearFilter > 0 && q.anio !== triviaYearFilter) return false;
      // Filtro Materia
      if (triviaCategoryFilter !== "todas" && q.id_categoria !== triviaCategoryFilter && q.categoria_nombre !== triviaCategoryFilter) return false;
      // Filtro Búsqueda
      if (triviaSearchQuery.trim()) {
        const query = triviaSearchQuery.toLowerCase();
        const matchPregunta = (q.pregunta || "").toLowerCase().includes(query);
        const matchMateria = (q.categoria_nombre || "").toLowerCase().includes(query);
        const matchFundamento = (q.fundamento_juridico || "").toLowerCase().includes(query);
        const matchId = (q.id || "").toLowerCase().includes(query);
        return matchPregunta || matchMateria || matchFundamento || matchId;
      }
      return true;
    });
  }, [allTriviaQuestionsConsolidated, triviaYearFilter, triviaCategoryFilter, triviaSearchQuery]);

  // Exportar a Excel
  const exportAllTriviaToExcel = () => {
    if (allTriviaQuestionsConsolidated.length === 0) {
      toast.error("No hay preguntas para exportar.");
      return;
    }

    const dataToExport = allTriviaQuestionsConsolidated.map((q, idx) => {
      const opciones = Array.isArray(q.opciones) ? q.opciones : [];
      const respIdx = q.respuesta_correcta_index ?? 0;
      const letras = ["A", "B", "C", "D"];
      const respLetra = letras[respIdx] || `(${respIdx + 1})`;
      const respTexto = opciones[respIdx] || "";

      return {
        "N°": idx + 1,
        "ID": q.id,
        "Año": q.anio ? `${q.anio}º Año` : "1º Año",
        "Materia": q.categoria_nombre || "General",
        "Dificultad": q.dificultad || "media",
        "Pregunta": q.pregunta || "",
        "Opción A": opciones[0] || "",
        "Opción B": opciones[1] || "",
        "Opción C": opciones[2] || "",
        "Opción D": opciones[3] || "",
        "Opción Correcta": respLetra,
        "Respuesta Correcta": respTexto,
        "Fundamento Jurídico": q.fundamento_juridico || "",
        "Puntos": q.puntos_base || 100,
        "Origen": q.origen || "Banco Oficial"
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banco Trivia UNLP");

    worksheet["!cols"] = [
      { wch: 5 },   // N°
      { wch: 15 },  // ID
      { wch: 10 },  // Año
      { wch: 32 },  // Materia
      { wch: 12 },  // Dificultad
      { wch: 65 },  // Pregunta
      { wch: 35 },  // Opción A
      { wch: 35 },  // Opción B
      { wch: 35 },  // Opción C
      { wch: 35 },  // Opción D
      { wch: 15 },  // Opción Correcta
      { wch: 35 },  // Respuesta Correcta
      { wch: 55 },  // Fundamento Jurídico
      { wch: 10 },  // Puntos
      { wch: 25 },  // Origen
    ];

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Banco_Trivia_DND_UNLP_Completo_${today}.xlsx`);
    toast.success(`¡Exportadas exitosamente ${allTriviaQuestionsConsolidated.length} preguntas a Excel!`);
  };

  // Exportar a JSON
  const exportAllTriviaToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allTriviaQuestionsConsolidated, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `banco_trivia_dnd_unlp_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`¡Descargadas ${allTriviaQuestionsConsolidated.length} preguntas en formato JSON!`);
  };

  const sortedAndFilteredProfiles = useMemo(() => {
    return [...profiles]
      .filter((p) => {
        if (!searchUserProfile.trim()) return true;
        const q = searchUserProfile.toLowerCase();
        const nameMatch = p.full_name?.toLowerCase().includes(q);
        const yearMatch = String(p.anio_ingreso || "").includes(q);
        const phoneMatch = p.telefono?.includes(q);
        return nameMatch || yearMatch || phoneMatch;
      })
      .sort((a, b) => {
        if (userSortOrder === "recent") {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (userSortOrder === "year") {
          return (Number(b.anio_ingreso) || 0) - (Number(a.anio_ingreso) || 0);
        }
        return (a.full_name || "").localeCompare(b.full_name || "", "es", { sensitivity: "base" });
      });
  }, [profiles, searchUserProfile, userSortOrder]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (myProfile?.role !== "admin") return;

      const [
        { count: usersCount }, 
        { data: settings },
        { count: partidasCount },
        { count: duelosCount },
        { data: corrs },
        { data: igConfig },
        { count: igCount }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("app_settings").select("*").eq("id", 1).single(),
        supabase.from("trivia_partidas").select("*", { count: "exact", head: true }),
        supabase.from("trivia_duelos").select("*", { count: "exact", head: true }),
        supabase.from("asistente_correcciones").select("*").order("created_at", { ascending: false }),
        supabase.from("instagram_config").select("*").eq("id", 1).maybeSingle(),
        supabase.from("instagram_feed").select("*", { count: "exact", head: true })
      ]);

      setTotalUsersCount(usersCount || 0);
      setCorrecciones(corrs || []);
      if (igConfig?.access_token) setInstagramToken(igConfig.access_token);
      setIgLastSync(igConfig?.last_sync_at || null);
      setIgPostsCount(igCount || 0);

      // Paginación para obtener la totalidad de permutas superando el límite por defecto de 1000 filas de Supabase
      let allPermutas: any[] = [];
      let permFrom = 0;
      const permStep = 1000;
      let keepFetchingPerms = true;

      while (keepFetchingPerms) {
        const { data: chunk, error: chunkErr } = await supabase
          .from("permutas")
          .select("*, materias(nombre, anio, codigo)")
          .order("created_at", { ascending: false })
          .range(permFrom, permFrom + permStep - 1);

        if (chunkErr || !chunk || chunk.length === 0) {
          keepFetchingPerms = false;
        } else {
          allPermutas.push(...chunk);
          if (chunk.length < permStep) {
            keepFetchingPerms = false;
          } else {
            permFrom += permStep;
          }
        }
      }

      // Paginación para obtener la totalidad de perfiles superando el límite por defecto de 1000 filas de Supabase
      let allProfiles: any[] = [];
      let from = 0;
      const step = 1000;
      let keepFetching = true;

      while (keepFetching) {
        const { data: chunk, error: chunkErr } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, from + step - 1);

        if (chunkErr || !chunk || chunk.length === 0) {
          keepFetching = false;
        } else {
          allProfiles.push(...chunk);
          if (chunk.length < step) {
            keepFetching = false;
          } else {
            from += step;
          }
        }
      }

      let periodosData: any[] = [];
      try {
        const { data: pData } = await supabase
          .from("permutas_historico_periodos" as any)
          .select("*")
          .order("created_at", { ascending: false });
        if (pData) periodosData = pData;
      } catch (e) {
        console.warn("Tabla permutas_historico_periodos no lista:", e);
      }

      setHistoricoPeriodos(periodosData);
      setPermutas(allPermutas);
      setProfiles(allProfiles);
      setAppSettings(settings || { id: 1, permutero_activo: true, modo_mantenimiento: false });
      setCustomPermutasCount(String((settings as any)?.personas_permutadas_count || 0));
      setTotalPartidasCount(partidasCount || 0);
      setTotalDuelosCount(duelosCount || 0);
      fetchTriviaIAPreguntas();
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error("Error al cargar datos del panel.");
    } finally {
      setLoading(false);
    }
  };

  const updatePermutasCount = async () => {
    const val = parseInt(customPermutasCount, 10);
    if (isNaN(val) || val < 0) {
      toast.error("Ingresá un número válido mayor o igual a 0.");
      return;
    }

    setUpdating(true);
    try {
      // 1. Intentar actualizar mediante RPC (bypass cache de PostgREST)
      const { error: rpcErr } = await supabase.rpc("update_personas_permutadas_count" as any, { new_val: val });
      if (rpcErr) {
        console.warn("RPC update_personas_permutadas_count falló, intentando actualización directa:", rpcErr);
        const { error: directErr } = await supabase
          .from("app_settings")
          .update({ personas_permutadas_count: val } as any)
          .eq("id", 1);

        if (directErr) throw directErr;
      }

      setAppSettings((prev: any) => prev ? { ...prev, personas_permutadas_count: val } : prev);
      toast.success(`Contador histórico de permutas actualizado a ${val} personas.`);
    } catch (err: any) {
      console.error("Error al actualizar contador de permutas:", err);
      toast.error("Error al actualizar contador: " + (err.message || "Error desconocido"));
    } finally {
      setUpdating(false);
    }
  };

  const togglePermutero = async () => {
    if (!appSettings) return;
    setUpdating(true);
    const newValue = !appSettings.permutero_activo;
    const { error } = await supabase.from("app_settings").update({ permutero_activo: newValue }).eq("id", 1);
    
    if (error) toast.error("Error al actualizar estado");
    else {
      setAppSettings({ ...appSettings, permutero_activo: newValue });
      toast.success(newValue ? "Permutero habilitado" : "Permutero deshabilitado");
    }
    setUpdating(false);
  };

  const toggleMantenimiento = async () => {
    if (!appSettings) return;
    setUpdating(true);
    const newValue = !appSettings.modo_mantenimiento;
    const { error } = await supabase.from("app_settings").update({ modo_mantenimiento: newValue }).eq("id", 1);
    
    if (error) toast.error("Error al actualizar modo mantenimiento");
    else {
      setAppSettings({ ...appSettings, modo_mantenimiento: newValue });
      toast.success(newValue ? "Modo Solo Administradores activado" : "Acceso público de estudiantes habilitado");
    }
    setUpdating(false);
  };

  const deletePermuta = async (id: string) => {
    if (!confirm("¿Borrar esta permuta?")) return;
    setUpdating(true);
    const { error } = await supabase.from("permutas").delete().eq("id", id);
    if (error) toast.error("Error: " + error.message);
    else {
      setPermutas(prev => prev.filter(p => p.id !== id));
      toast.success("Permuta eliminada");
    }
    setUpdating(false);
  };

  const deleteAllPermutas = async () => {
    if (!confirm("⚠️ ¿Estás seguro de que querés borrar TODAS las permutas de la plataforma?\n\nEsta acción eliminará todas las permutas publicadas, pero NO borrará el contador histórico de personas que lograron permutar.")) return;

    setUpdating(true);
    try {
      // 1. Obtener la cantidad de permutas realizadas actualmente para acumularlas en app_settings
      const { data: realizedPermutas } = await supabase
        .from("permutas")
        .select("id")
        .eq("status", "realizada");

      const realizedCount = (realizedPermutas?.length || 0);

      if (realizedCount > 0) {
        try {
          await supabase.rpc("increment_personas_permutadas", { inc_val: realizedCount });
        } catch (e) {
          const currentCount = (appSettings?.personas_permutadas_count || 0) + realizedCount;
          await supabase.from("app_settings").update({ personas_permutadas_count: currentCount } as any).eq("id", 1);
        }
      }

      // 2. Eliminar todas las filas de matches y permutas
      await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const { error } = await supabase.from("permutas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;

      setPermutas([]);
      toast.success("Todas las permutas fueron eliminadas. El contador de personas que lograron permutar se conservó intacto.");
    } catch (err: any) {
      console.error("Error al borrar todas las permutas:", err);
      toast.error("Error al borrar permutas: " + (err.message || "Error desconocido"));
    } finally {
      setUpdating(false);
    }
  };

  const deleteCorreccion = async (id: string) => {
    if (!confirm("¿Eliminar esta regla de corrección del asistente?")) return;
    setUpdating(true);
    const { error } = await supabase.from("asistente_correcciones").delete().eq("id", id);
    if (error) toast.error("Error: " + error.message);
    else {
      setCorrecciones(prev => prev.filter(c => c.id !== id));
      if (selectedCorreccion?.id === id) {
        setIsDetailModalOpen(false);
        setSelectedCorreccion(null);
      }
      toast.success("Corrección eliminada");
    }
    setUpdating(false);
  };

  const fetchTriviaIAPreguntas = async () => {
    try {
      const { data } = await supabase.from("trivia_preguntas").select("*").order("created_at", { ascending: false });
      if (data) setPreguntasTriviaIA(data);
    } catch (e) {}
  };

  const aprobarPreguntaTrivia = async (id: string) => {
    const { error } = await supabase.from("trivia_preguntas").update({ aprobado: true }).eq("id", id);
    if (error) {
      toast.error("Error al aprobar la pregunta de trivia: " + error.message);
    } else {
      toast.success("¡Pregunta aprobada e integrada a la Trivia pública!");
      setPreguntasTriviaIA(prev => prev.map(p => p.id === id ? { ...p, aprobado: true } : p));
    }
  };

  const eliminarPreguntaTrivia = async (id: string) => {
    if (!confirm("¿Eliminar esta pregunta de la Trivia?")) return;
    const { error } = await supabase.from("trivia_preguntas").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar pregunta: " + error.message);
    } else {
      toast.success("Pregunta eliminada con éxito.");
      setPreguntasTriviaIA(prev => prev.filter(p => p.id !== id));
    }
  };

  const approveCorreccion = async (id: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from("asistente_correcciones")
      .update({ aprobado: true })
      .eq("id", id);

    if (error) {
      toast.error("Error al aprobar: " + error.message);
    } else {
      toast.success("¡Corrección aprobada con éxito! La IA utilizará esta instrucción para futuras consultas.");
      setCorrecciones(prev => prev.map(c => c.id === id ? { ...c, aprobado: true } : c));
      if (selectedCorreccion?.id === id) {
        setSelectedCorreccion((prev: any) => prev ? { ...prev, aprobado: true } : null);
      }
    }
    setUpdating(false);
  };

  const openDetailModal = (c: any) => {
    setSelectedCorreccion(c);
    setIsDetailModalOpen(true);
  };

  const toggleBanUser = async (profileId: string, currentStatus: boolean) => {
    if (profileId === user?.id) {
      toast.error("No puedes vetarte a ti mismo.");
      return;
    }
    const action = currentStatus ? "levantar el veto a" : "vetar a";
    if (!confirm(`¿Estás seguro de ${action} este usuario?`)) return;

    setUpdating(true);
    const { error } = await supabase.from("profiles").update({ is_banned: !currentStatus }).eq("id", profileId);
    
    if (error) toast.error("Error: " + error.message);
    else {
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, is_banned: !currentStatus } : p));
      toast.success(currentStatus ? "Veto levantado" : "Usuario vetado");
    }
    setUpdating(false);
  };

  const updateUserRole = async (profileId: string, newRole: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", profileId);
      if (error) throw error;

      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, role: newRole } : p));
      toast.success(`Rol actualizado a "${newRole}" correctamente.`);
    } catch (err: any) {
      console.error("Error actualizando rol:", err);
      toast.error("Error al actualizar el rol del usuario.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMassMail = async () => {
    if (!mailSubject.trim() || !mailBody.trim()) {
      toast.error("Completá asunto y cuerpo.");
      return;
    }
    const countToMail = totalUsersCount || profiles.length;
    if (!confirm(`¿Enviar mail masivo a los ${countToMail} usuarios registrados?`)) return;

    setSendingMail(true);
    try {
      const { data, error } = await supabase.functions.invoke("mass-mailing", {
        body: { subject: mailSubject, body: mailBody },
      });
      if (error) throw error;
      const sentCount = data?.sent || 0;
      const totalCount = data?.total || countToMail;
      toast.success(`Mail masivo enviado con éxito a ${sentCount} de ${totalCount} usuarios.`);
      setMailSubject(""); setMailBody("");
    } catch (err: any) {
      toast.error("Error: " + (err.message || "Error desconocido"));
    } finally {
      setSendingMail(false);
    }
  };

  // Estadísticas Completas del Permutero (Período Actual, Históricos y Consolidado)
  const permutaStats = useMemo(() => {
    const historicoContador = (appSettings as any)?.personas_permutadas_count || 0;

    // Caso 1: Se seleccionó un período histórico específico archivado
    if (selectedPeriodFilter !== "consolidado" && selectedPeriodFilter !== "actual") {
      const pArchivado = historicoPeriodos.find(p => p.id === selectedPeriodFilter);
      if (pArchivado) {
        const total = pArchivado.total_permutas || 0;
        const realizadas = pArchivado.total_realizadas || 0;
        const activas = pArchivado.total_activas || 0;
        const canceladas = pArchivado.total_canceladas || 0;
        const porAnioCarrera = Array.isArray(pArchivado.stats_por_anio) ? pArchivado.stats_por_anio : [];
        const rankingMaterias = Array.isArray(pArchivado.stats_por_materia) ? pArchivado.stats_por_materia : [];
        const comisionesOfrecidas = pArchivado.stats_comisiones?.ofrecidas || [];
        const comisionesBuscadas = pArchivado.stats_comisiones?.buscadas || [];
        const topMateria = rankingMaterias[0] || null;
        const topAnio = [...porAnioCarrera].sort((a: any, b: any) => (b.total || 0) - (a.total || 0))[0] || null;

        return {
          nombrePeriodo: pArchivado.nombre_periodo,
          esArchivado: true,
          total,
          realizadas,
          activas,
          canceladas,
          historicoContador,
          personasEfectivasTotal: pArchivado.personas_beneficiadas || (realizadas * 2),
          porAnioCarrera,
          rankingMaterias,
          topMateria,
          topAnio,
          porAnioCalendario: {},
          comisionesOfrecidas,
          comisionesBuscadas,
        };
      }
    }

    // Datos del ciclo actual activo
    const totalActual = permutas.length;
    const realizadasActual = permutas.filter(p => p.status === "realizada").length;
    const activasActual = permutas.filter(p => p.status === "activa" || (!p.status && p.activa)).length;
    const canceladasActual = permutas.filter(p => p.status === "cancelada").length;

    // Por año carrera del actual
    const porAnioActual: Record<number, { total: number; realizadas: number; activas: number }> = {
      1: { total: 0, realizadas: 0, activas: 0 },
      2: { total: 0, realizadas: 0, activas: 0 },
      3: { total: 0, realizadas: 0, activas: 0 },
      4: { total: 0, realizadas: 0, activas: 0 },
      5: { total: 0, realizadas: 0, activas: 0 },
      6: { total: 0, realizadas: 0, activas: 0 },
    };

    const materiasActualMap: Record<string, { id: string; nombre: string; anio: number; total: number; realizadas: number; activas: number }> = {};
    const comisionesOfrecidasActual: Record<number, number> = {};
    const comisionesBuscadasActual: Record<number, number> = {};
    const porAnioCalendario: Record<string, number> = {};

    permutas.forEach(p => {
      const anio = p.materias?.anio || 1;
      const mNombre = p.materias?.nombre || "Materia no especificada";
      const mId = p.materia_id || "desconocido";
      const isRealizada = p.status === "realizada";
      const isActiva = p.status === "activa" || (!p.status && p.activa);

      if (porAnioActual[anio]) {
        porAnioActual[anio].total++;
        if (isRealizada) porAnioActual[anio].realizadas++;
        if (isActiva) porAnioActual[anio].activas++;
      }

      if (!materiasActualMap[mNombre]) {
        materiasActualMap[mNombre] = { id: mId, nombre: mNombre, anio, total: 0, realizadas: 0, activas: 0 };
      }
      materiasActualMap[mNombre].total++;
      if (isRealizada) materiasActualMap[mNombre].realizadas++;
      if (isActiva) materiasActualMap[mNombre].activas++;

      if (p.comision_tiene) {
        comisionesOfrecidasActual[p.comision_tiene] = (comisionesOfrecidasActual[p.comision_tiene] || 0) + 1;
      }
      if (Array.isArray(p.comisiones_busca)) {
        p.comisiones_busca.forEach((c: number) => {
          comisionesBuscadasActual[c] = (comisionesBuscadasActual[c] || 0) + 1;
        });
      }

      if (p.created_at) {
        const calYear = String(new Date(p.created_at).getFullYear());
        porAnioCalendario[calYear] = (porAnioCalendario[calYear] || 0) + 1;
      }
    });

    // Caso 2: Solo período actual en curso
    if (selectedPeriodFilter === "actual") {
      const rankingMaterias = Object.values(materiasActualMap).sort((a, b) => b.total - a.total);
      const anioEntries = Object.entries(porAnioActual).map(([anio, data]) => ({
        anio: Number(anio),
        ...data,
        pct: totalActual > 0 ? Math.round((data.total / totalActual) * 100) : 0,
      }));

      return {
        nombrePeriodo: "Período Actual en Curso",
        esArchivado: false,
        total: totalActual,
        realizadas: realizadasActual,
        activas: activasActual,
        canceladas: canceladasActual,
        historicoContador,
        personasEfectivasTotal: realizadasActual * 2,
        porAnioCarrera: anioEntries,
        rankingMaterias,
        topMateria: rankingMaterias[0] || null,
        topAnio: [...anioEntries].sort((a, b) => b.total - a.total)[0] || null,
        porAnioCalendario,
        comisionesOfrecidas: Object.entries(comisionesOfrecidasActual).sort((a, b) => b[1] - a[1]),
        comisionesBuscadas: Object.entries(comisionesBuscadasActual).sort((a, b) => b[1] - a[1]),
      };
    }

    // Caso 3: Consolidado Perpetuo (Actual + Todos los Históricos Archivados)
    let totalConsolidado = totalActual;
    let realizadasConsolidado = realizadasActual;
    let activasConsolidado = activasActual;
    let canceladasConsolidado = canceladasActual;

    const porAnioConsolidado: Record<number, { total: number; realizadas: number; activas: number }> = {
      1: { ...porAnioActual[1] },
      2: { ...porAnioActual[2] },
      3: { ...porAnioActual[3] },
      4: { ...porAnioActual[4] },
      5: { ...porAnioActual[5] },
      6: { ...porAnioActual[6] },
    };

    const materiasConsolidadasMap: Record<string, { id: string; nombre: string; anio: number; total: number; realizadas: number; activas: number }> = { ...materiasActualMap };
    const comisionesOfrecidasConsolidado: Record<number, number> = { ...comisionesOfrecidasActual };
    const comisionesBuscadasConsolidado: Record<number, number> = { ...comisionesBuscadasActual };

    historicoPeriodos.forEach(hist => {
      totalConsolidado += (hist.total_permutas || 0);
      realizadasConsolidado += (hist.total_realizadas || 0);
      activasConsolidado += (hist.total_activas || 0);
      canceladasConsolidado += (hist.total_canceladas || 0);

      // Sumar desglose por año
      if (Array.isArray(hist.stats_por_anio)) {
        hist.stats_por_anio.forEach((a: any) => {
          if (porAnioConsolidado[a.anio]) {
            porAnioConsolidado[a.anio].total += (a.total || 0);
            porAnioConsolidado[a.anio].realizadas += (a.realizadas || 0);
            porAnioConsolidado[a.anio].activas += (a.activas || 0);
          }
        });
      }

      // Sumar desglose por materias
      if (Array.isArray(hist.stats_por_materia)) {
        hist.stats_por_materia.forEach((m: any) => {
          if (!materiasConsolidadasMap[m.nombre]) {
            materiasConsolidadasMap[m.nombre] = { id: m.id || m.nombre, nombre: m.nombre, anio: m.anio || 1, total: 0, realizadas: 0, activas: 0 };
          }
          materiasConsolidadasMap[m.nombre].total += (m.total || 0);
          materiasConsolidadasMap[m.nombre].realizadas += (m.realizadas || 0);
          materiasConsolidadasMap[m.nombre].activas += (m.activas || 0);
        });
      }

      // Sumar comisiones
      if (hist.stats_comisiones?.ofrecidas && Array.isArray(hist.stats_comisiones.ofrecidas)) {
        hist.stats_comisiones.ofrecidas.forEach(([c, n]: [any, number]) => {
          comisionesOfrecidasConsolidado[Number(c)] = (comisionesOfrecidasConsolidado[Number(c)] || 0) + n;
        });
      }
      if (hist.stats_comisiones?.buscadas && Array.isArray(hist.stats_comisiones.buscadas)) {
        hist.stats_comisiones.buscadas.forEach(([c, n]: [any, number]) => {
          comisionesBuscadasConsolidado[Number(c)] = (comisionesBuscadasConsolidado[Number(c)] || 0) + n;
        });
      }
    });

    const rankingMateriasConsolidado = Object.values(materiasConsolidadasMap).sort((a, b) => b.total - a.total);
    const anioEntriesConsolidado = Object.entries(porAnioConsolidado).map(([anio, data]) => ({
      anio: Number(anio),
      ...data,
      pct: totalConsolidado > 0 ? Math.round((data.total / totalConsolidado) * 100) : 0,
    }));

    return {
      nombrePeriodo: "Histórico Consolidado (Todos los Períodos)",
      esArchivado: false,
      total: totalConsolidado,
      realizadas: realizadasConsolidado,
      activas: activasConsolidado,
      canceladas: canceladasConsolidado,
      historicoContador,
      personasEfectivasTotal: historicoContador + (realizadasActual * 2),
      porAnioCarrera: anioEntriesConsolidado,
      rankingMaterias: rankingMateriasConsolidado,
      topMateria: rankingMateriasConsolidado[0] || null,
      topAnio: [...anioEntriesConsolidado].sort((a, b) => b.total - a.total)[0] || null,
      porAnioCalendario,
      comisionesOfrecidas: Object.entries(comisionesOfrecidasConsolidado).sort((a, b) => b[1] - a[1]),
      comisionesBuscadas: Object.entries(comisionesBuscadasConsolidado).sort((a, b) => b[1] - a[1]),
    };
  }, [permutas, appSettings, historicoPeriodos, selectedPeriodFilter]);

  const archivarPeriodoYLimpiar = async () => {
    if (!archivePeriodName.trim()) {
      toast.error("Por favor indicá un nombre para el período a archivar.");
      return;
    }

    setUpdating(true);
    try {
      const actuales = permutas;
      const realizadasCount = actuales.filter(p => p.status === "realizada").length;
      const activasCount = actuales.filter(p => p.status === "activa" || (!p.status && p.activa)).length;
      const canceladasCount = actuales.filter(p => p.status === "cancelada").length;

      const porAnio: Record<number, { total: number; realizadas: number; activas: number }> = {
        1: { total: 0, realizadas: 0, activas: 0 },
        2: { total: 0, realizadas: 0, activas: 0 },
        3: { total: 0, realizadas: 0, activas: 0 },
        4: { total: 0, realizadas: 0, activas: 0 },
        5: { total: 0, realizadas: 0, activas: 0 },
        6: { total: 0, realizadas: 0, activas: 0 },
      };

      const materiasMap: Record<string, { nombre: string; anio: number; total: number; realizadas: number; activas: number }> = {};
      const comisionesOfrecidas: Record<number, number> = {};
      const comisionesBuscadas: Record<number, number> = {};

      actuales.forEach(p => {
        const anio = p.materias?.anio || 1;
        const mNombre = p.materias?.nombre || "Materia no especificada";
        const isRealizada = p.status === "realizada";
        const isActiva = p.status === "activa" || (!p.status && p.activa);

        if (porAnio[anio]) {
          porAnio[anio].total++;
          if (isRealizada) porAnio[anio].realizadas++;
          if (isActiva) porAnio[anio].activas++;
        }

        if (!materiasMap[mNombre]) {
          materiasMap[mNombre] = { nombre: mNombre, anio, total: 0, realizadas: 0, activas: 0 };
        }
        materiasMap[mNombre].total++;
        if (isRealizada) materiasMap[mNombre].realizadas++;
        if (isActiva) materiasMap[mNombre].activas++;

        if (p.comision_tiene) comisionesOfrecidas[p.comision_tiene] = (comisionesOfrecidas[p.comision_tiene] || 0) + 1;
        if (Array.isArray(p.comisiones_busca)) {
          p.comisiones_busca.forEach((c: number) => {
            comisionesBuscadas[c] = (comisionesBuscadas[c] || 0) + 1;
          });
        }
      });

      const anioArray = Object.entries(porAnio).map(([a, d]) => ({
        anio: Number(a),
        ...d,
        pct: actuales.length > 0 ? Math.round((d.total / actuales.length) * 100) : 0,
      }));

      const payload = {
        nombre_periodo: archivePeriodName.trim(),
        total_permutas: actuales.length,
        total_realizadas: realizadasCount,
        total_activas: activasCount,
        total_canceladas: canceladasCount,
        personas_beneficiadas: realizadasCount * 2,
        stats_por_anio: anioArray,
        stats_por_materia: Object.values(materiasMap).sort((a, b) => b.total - a.total),
        stats_comisiones: {
          ofrecidas: Object.entries(comisionesOfrecidas).sort((a, b) => b[1] - a[1]),
          buscadas: Object.entries(comisionesBuscadas).sort((a, b) => b[1] - a[1]),
        },
        raw_data_backup: actuales.map(p => ({
          id: p.id,
          materia: p.materias?.nombre,
          anio: p.materias?.anio,
          tiene: p.comision_tiene,
          busca: p.comisiones_busca,
          status: p.status,
          created_at: p.created_at
        }))
      };

      try {
        await supabase.from("permutas_historico_periodos" as any).insert(payload);
      } catch (errIns) {
        console.warn("Aviso insertando periodo historico:", errIns);
      }

      if (realizadasCount > 0) {
        try {
          await supabase.rpc("increment_personas_permutadas", { inc_val: realizadasCount * 2 });
        } catch (e) {
          const currentCount = (appSettings?.personas_permutadas_count || 0) + (realizadasCount * 2);
          await supabase.from("app_settings").update({ personas_permutadas_count: currentCount } as any).eq("id", 1);
        }
      }

      await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const { error: delErr } = await supabase.from("permutas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (delErr) throw delErr;

      setPermutas([]);
      toast.success(`¡Período "${archivePeriodName}" guardado en el histórico permanente y lista limpiada con éxito!`);
      setIsArchiveModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error("Error al archivar período:", err);
      toast.error("Error al archivar período: " + (err.message || "Error"));
    } finally {
      setUpdating(false);
    }
  };

  // Memoized Filters
  const filteredPermutas = useMemo(() => {
    return permutas.filter(p => {
      const materiaMatch = p.materias?.nombre?.toLowerCase().includes(searchMateria.toLowerCase());
      const userProfile = profiles.find(prof => prof.id === p.user_id);
      const userMatch = !searchUser || 
        userProfile?.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        userProfile?.email?.toLowerCase().includes(searchUser.toLowerCase());
      return materiaMatch && userMatch;
    });
  }, [permutas, profiles, searchMateria, searchUser]);

  const userPermutaCount = useMemo(() => {
    const counts: Record<string, number> = {};
    permutas.forEach(p => {
      counts[p.user_id] = (counts[p.user_id] || 0) + 1;
    });
    return counts;
  }, [permutas]);

  if (authLoading || loading) {
    return <div className="p-8 flex justify-center h-[60vh] items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  if (myProfile?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      {/* CABECERA OFICIAL */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-gradient-to-br from-[#0A1C3D] to-red-600/30 rounded-2xl border border-red-500/40 text-red-400 shadow-xl">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Panel de Administración</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">Oficial</span>
            </h1>
            <p className="text-xs text-slate-400">Métricas en tiempo real, control de usuarios, permutas y configuración del sistema DND.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0D1527] border border-white/15 text-xs text-slate-300 font-mono">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>FCJyS • UNLP</span>
        </div>
      </div>

      {/* SECCIÓN MÉTRICAS DESTACADAS Y PUBLICABLES PARA SCREENSHOTS / REDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TARJETA 1: ESTUDIANTES REGISTRADOS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-[#0A1C3D] via-[#0D1527] to-[#1F0B12]/80 border border-red-500/50 shadow-2xl space-y-3 group backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-mono font-black text-[10px] uppercase tracking-wider border border-red-500/40 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Crecimiento</span>
            </span>
          </div>

          <div>
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
              {totalUsersCount || profiles.length}
            </span>
            <h3 className="text-sm font-black text-slate-200 mt-1 flex items-center gap-1.5">
              <span>Estudiantes Registrados</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Cuentas creadas en DND Jursoc</p>
          </div>
        </motion.div>

        {/* TARJETA 2: PERMUTAS PUBLICADAS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-[#0D1527] via-[#0A1C3D]/60 to-slate-950 border border-blue-500/40 shadow-2xl space-y-3 group backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Repeat className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono font-black text-[10px] uppercase tracking-wider border border-blue-500/40">
              Permutero
            </span>
          </div>

          <div>
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
              {permutas.length}
            </span>
            <h3 className="text-sm font-black text-slate-200 mt-1">
              Permutas Publicadas
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Intercambios académicos creados</p>
          </div>
        </motion.div>

        {/* TARJETA 3: ESTADO DEL SISTEMA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-[#0D1527] via-[#0A1C3D]/60 to-slate-950 border border-emerald-500/40 shadow-2xl space-y-3 group backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black text-[10px] uppercase tracking-wider border border-emerald-500/40">
              Activo
            </span>
          </div>

          <div>
            <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
              100% Online
            </span>
            <h3 className="text-sm font-black text-slate-200 mt-1">
              Servicio Operativo
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Sistemas e Integración</p>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="general" className="space-y-6 sm:space-y-8">
        <TabsList className="bg-muted/50 p-1.5 rounded-2xl flex overflow-x-auto max-w-full justify-start sm:justify-center no-scrollbar space-x-1 border border-white/5">
          <TabsTrigger value="general" className="rounded-xl px-4 sm:px-6 py-2 text-xs font-bold shrink-0">General</TabsTrigger>
          <TabsTrigger value="permutas" className="rounded-xl px-4 sm:px-6 py-2 text-xs font-bold shrink-0">Permutas ({permutas.length})</TabsTrigger>
          <TabsTrigger value="usuarios" className="rounded-xl px-4 sm:px-6 py-2 text-xs font-bold shrink-0">Usuarios ({totalUsersCount || profiles.length})</TabsTrigger>
          <TabsTrigger value="asistente" className="rounded-xl px-4 sm:px-6 py-2 text-xs font-bold shrink-0">Asistente IA ({correcciones.length})</TabsTrigger>
          <TabsTrigger value="trivia" className="rounded-xl px-4 sm:px-6 py-2 text-xs font-bold shrink-0">Trivia ({allTriviaQuestionsConsolidated.length})</TabsTrigger>
        </TabsList>

        {/* --- TAB: GENERAL --- */}
        <TabsContent value="general" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="p-5 sm:p-8 bg-card border rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">Temporada de Permutas</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">Habilita o deshabilita la creación de nuevas publicaciones.</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <span className={`text-xs font-bold uppercase tracking-widest ${appSettings?.permutero_activo ? "text-green-500" : "text-destructive"}`}>
                {appSettings?.permutero_activo ? "Activo" : "Pausado"}
              </span>
              <Switch checked={appSettings?.permutero_activo} onCheckedChange={togglePermutero} disabled={updating} />
            </div>
          </section>

          <section className="p-5 sm:p-8 bg-card border rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">Modo Solo Administradores (Mantenimiento)</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">Cuando está activo, los estudiantes solo verán la pantalla de próximamente/mantenimiento.</p>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <span className={`text-xs font-bold uppercase tracking-widest ${appSettings?.modo_mantenimiento ? "text-amber-500 font-extrabold" : "text-green-500"}`}>
                {appSettings?.modo_mantenimiento ? "Solo Administradores" : "Acceso Público"}
              </span>
              <Switch checked={Boolean(appSettings?.modo_mantenimiento)} onCheckedChange={toggleMantenimiento} disabled={updating} />
            </div>
          </section>

          <section className="p-8 bg-card border rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Mail size={20} />
              <h2 className="text-xl font-semibold text-foreground">Mailing Masivo</h2>
            </div>
            <div className="grid gap-4">
              <Input placeholder="Asunto del correo" value={mailSubject} onChange={e => setMailSubject(e.target.value)} className="bg-background" />
              <textarea 
                className="w-full p-4 rounded-xl border bg-background min-h-[150px] outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
                placeholder="Escribe el mensaje para todos los estudiantes..."
                value={mailBody}
                onChange={e => setMailBody(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleSendMassMail} disabled={sendingMail || !mailSubject || !mailBody} className="min-w-[140px] rounded-xl">
                  {sendingMail ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Enviar a todos"}
                </Button>
              </div>
            </div>
          </section>

          <section className="p-5 sm:p-8 bg-card border rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <h2 className="text-lg sm:text-xl font-semibold">Feed Autónomo de Instagram (@agrupaciondnd)</h2>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Almacenado localmente en PostgreSQL. Sin intermediarios ni límites de visitas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-muted/60 text-muted-foreground px-3 py-1.5 rounded-lg border font-mono">
                  {igPostsCount} posts en base de datos
                </span>
                {igLastSync && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    Última sinc: {new Date(igLastSync).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3 pt-2 border-t">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Access Token de Meta / Instagram Graph API (Larga duración)</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Se auto-renueva cada 30 días de por vida una vez cargado
                </span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="password"
                  placeholder="Pegá tu token de Instagram aquí (ej: IGQJ...)"
                  value={instagramToken}
                  onChange={(e) => setInstagramToken(e.target.value)}
                  className="bg-background font-mono text-xs flex-1"
                />
                <Button
                  onClick={async () => {
                    setSavingIgToken(true);
                    try {
                      const tokenVal = instagramToken.trim();
                      const { error: updErr } = await supabase
                        .from("instagram_config")
                        .update({
                          access_token: tokenVal || null,
                          last_token_refresh: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", 1);

                      if (updErr) throw updErr;

                      toast.info("Token guardado. Sincronizando con Instagram...");
                      const { data: syncRes, error: syncErr } = await supabase.functions.invoke("sync-instagram-feed");
                      
                      if (syncErr) {
                        toast.warning("Token guardado, pero hubo un detalle al sincronizar: " + syncErr.message);
                      } else {
                        toast.success("¡Sincronizado con éxito con Meta Instagram!");
                      }

                      // Recargar datos
                      const [c1, c2] = await Promise.all([
                        supabase.from("instagram_config").select("*").eq("id", 1).maybeSingle(),
                        supabase.from("instagram_feed").select("*", { count: "exact", head: true }),
                      ]);
                      setIgLastSync(c1.data?.last_sync_at || null);
                      setIgPostsCount(c2.count || 0);
                    } catch (e: any) {
                      console.error("Error guardando token:", e);
                      toast.error("Error al guardar token: " + (e.message || ""));
                    } finally {
                      setSavingIgToken(false);
                    }
                  }}
                  disabled={savingIgToken}
                  className="rounded-xl font-bold gap-2 text-xs min-w-[170px]"
                >
                  {savingIgToken ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Activity className="w-4 h-4 text-accent" /> Guardar y Sincronizar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* --- TAB: PERMUTAS & ESTADÍSTICAS --- */}
        <TabsContent value="permutas" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* BARRA SUPERIOR DE CONTROL, SELECTOR DE PERÍODO Y EXPORTACIÓN */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-6 rounded-2xl border shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Estadísticas y Gestión de Permutas</h2>
              </div>
              <p className="text-muted-foreground text-xs">
                Métricas de permutas efectivas, análisis por año de cursada, materias con mayor demanda y archivo perpetuo por cuatrimestre.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* SELECTOR DE PERÍODO / TEMPORADA */}
              <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border">
                <span className="text-xs font-semibold text-muted-foreground px-1.5">Vista:</span>
                <select
                  value={selectedPeriodFilter}
                  onChange={e => setSelectedPeriodFilter(e.target.value)}
                  className="bg-background text-foreground text-xs font-bold rounded-lg px-2.5 py-1 border border-white/10 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="consolidado">📊 Todo el Histórico Consolidado (Permanente)</option>
                  <option value="actual">🟢 Período Actual Abierto ({permutas.length} permutas)</option>
                  {historicoPeriodos.map(h => (
                    <option key={h.id} value={h.id}>
                      📁 {h.nombre_periodo} ({h.total_permutas} permutas, {h.personas_beneficiadas} exitosas)
                    </option>
                  ))}
                </select>
              </div>

              {/* BOTÓN EXPORTAR A EXCEL */}
              <Button
                onClick={exportPermutasToExcel}
                variant="outline"
                className="rounded-xl text-xs font-bold px-3.5 h-9 flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Exportar a Excel (.xlsx)</span>
              </Button>

              {/* BOTÓN CERRAR PERÍODO Y ARCHIVAR */}
              <Button
                onClick={() => setIsArchiveModalOpen(true)}
                variant="outline"
                disabled={updating || permutas.length === 0}
                className="rounded-xl text-xs font-bold px-3.5 h-9 flex items-center gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cerrar Período y Guardar Histórico ({permutas.length})</span>
              </Button>

              {/* CONTADOR HISTÓRICO PERSISTENTE */}
              <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border">
                <span className="text-xs font-semibold px-2 text-muted-foreground whitespace-nowrap">
                  🎉 Contador histórico:
                </span>
                <Input
                  type="number"
                  min={0}
                  className="w-16 h-7 text-xs font-bold bg-background text-center rounded-lg border-muted"
                  value={customPermutasCount}
                  onChange={e => setCustomPermutasCount(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={updatePermutasCount}
                  disabled={updating}
                  className="h-7 text-xs font-bold rounded-lg px-2"
                >
                  Guardar
                </Button>
              </div>

              {/* BORRAR TODAS */}
              <Button
                variant="destructive"
                onClick={deleteAllPermutas}
                disabled={updating || permutas.length === 0}
                className="rounded-xl text-xs font-bold px-3 h-9 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Trash2 size={14} />
                Borrar ({permutas.length})
              </Button>
            </div>
          </div>

          {/* TARJETAS DE KPIS PRINCIPALES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: PERSONAS EFECTIVAMENTE PERMUTADAS */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-card to-card border border-emerald-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Efectivas
                </span>
              </div>
              <div className="text-3xl font-black text-foreground font-mono">
                {permutaStats.personasEfectivasTotal}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Personas Permutadas</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {permutaStats.historicoContador} histórico + {permutaStats.realizadas * 2} activas realizadas
                </p>
              </div>
            </div>

            {/* KPI 2: TOTAL DE PUBLICACIONES */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-card to-card border border-blue-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-blue-400">
                <Repeat className="w-5 h-5" />
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  Publicaciones
                </span>
              </div>
              <div className="text-3xl font-black text-foreground font-mono">
                {permutaStats.total}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Permutas Registradas</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {permutaStats.activas} en búsqueda · {permutaStats.realizadas} concretadas
                </p>
              </div>
            </div>

            {/* KPI 3: MATERIA MÁS DEMANDADA */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-card to-card border border-purple-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-purple-400">
                <Trophy className="w-5 h-5" />
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  Top Materia
                </span>
              </div>
              <div className="text-xl font-black text-foreground truncate" title={permutaStats.topMateria?.nombre || "Sin datos"}>
                {permutaStats.topMateria?.nombre || "Sin permutas"}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Materia con Más Permutas</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {permutaStats.topMateria ? `${permutaStats.topMateria.total} publicaciones (${permutaStats.total > 0 ? ((permutaStats.topMateria.total / permutaStats.total) * 100).toFixed(1) : 0}%)` : "Aún sin datos"}
                </p>
              </div>
            </div>

            {/* KPI 4: AÑO DE LA CARRERA CON MÁS PERMUTAS */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-card to-card border border-amber-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-400">
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  Año Líder
                </span>
              </div>
              <div className="text-3xl font-black text-foreground font-mono">
                {permutaStats.topAnio ? `${permutaStats.topAnio.anio}° Año` : "Sin datos"}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Año de Cursada con Más Demanda</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {permutaStats.topAnio ? `${permutaStats.topAnio.total} permutas (${permutaStats.topAnio.pct}% del total)` : "Aún sin datos"}
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN DETALLADA: DESGLOSE POR AÑO DE LA CARRERA (1° A 6°) */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Distribución por Año de la Carrera</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cantidad y porcentaje de permutas solicitadas según el año académico de la materia (1° a 6° año).
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground w-fit">
                Total: {permutaStats.total} permutas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {permutaStats.porAnioCarrera.map((item) => (
                <div key={item.anio} className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-foreground flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      <span>{item.anio}° Año de la Carrera</span>
                    </span>
                    <span className="text-xs font-bold font-mono text-primary">
                      {item.pct}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(item.pct, item.total > 0 ? 5 : 0)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span><strong>{item.total}</strong> permutas</span>
                    <span>{item.activas} activas · {item.realizadas} realizadas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN DETALLADA: RANKING DE MATERIAS CON MÁS PERMUTAS */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Ranking de Materias con Más Permutas</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Materias ordenadas de mayor a menor cantidad de solicitudes de permuta registradas.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground w-fit">
                {permutaStats.rankingMaterias.length} materias con actividad
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-muted-foreground">Posición</th>
                    <th className="px-4 py-3 text-left font-bold text-muted-foreground">Materia</th>
                    <th className="px-4 py-3 text-left font-bold text-muted-foreground">Año de Cursada</th>
                    <th className="px-4 py-3 text-center font-bold text-muted-foreground">Total Permutas</th>
                    <th className="px-4 py-3 text-center font-bold text-muted-foreground">% del Total</th>
                    <th className="px-4 py-3 text-center font-bold text-muted-foreground">Activas</th>
                    <th className="px-4 py-3 text-center font-bold text-muted-foreground">Realizadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {permutaStats.rankingMaterias.slice(0, 10).map((mat, idx) => {
                    const pct = permutaStats.total > 0 ? ((mat.total / permutaStats.total) * 100).toFixed(1) : "0";
                    return (
                      <tr key={mat.nombre} className="hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold">
                          {idx === 0 ? "🥇 1°" : idx === 1 ? "🥈 2°" : idx === 2 ? "🥉 3°" : `${idx + 1}°`}
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {mat.nombre}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-semibold">
                            {mat.anio}° Año
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-primary">
                          {mat.total}
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-muted-foreground">
                          {pct}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500">
                            {mat.activas}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                            {mat.realizadas}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {permutaStats.rankingMaterias.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground italic">
                        No hay permutas cargadas en la base de datos para generar el ranking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BUSCADOR Y LISTADO INDIVIDUAL DE PERMUTAS */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-foreground">Listado Detallado de Publicaciones</h3>
                <p className="text-xs text-muted-foreground">Filtrá y gestioná cada permuta individualmente.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/30 p-4 rounded-2xl border">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por materia..." 
                  className="pl-10 bg-background border-none shadow-none text-xs" 
                  value={searchMateria}
                  onChange={e => setSearchMateria(e.target.value)}
                />
              </div>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por estudiante..." 
                  className="pl-10 bg-background border-none shadow-none text-xs" 
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-card border rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Estudiante</th>
                    <th className="px-6 py-4 text-left font-semibold">Materia</th>
                    <th className="px-6 py-4 text-center font-semibold">Tiene Comisión</th>
                    <th className="px-6 py-4 text-center font-semibold">Busca Comisión</th>
                    <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                    <th className="px-6 py-4 text-left font-semibold">Estado</th>
                    <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPermutas.map(p => {
                    const prof = profiles.find(f => f.id === p.user_id);
                    return (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{prof?.full_name || p.nombre_contacto || "Usuario Desconocido"}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{p.telefono}</div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          <div>{p.materias?.nombre || "No especificada"}</div>
                          {p.materias?.anio && (
                            <span className="text-[10px] text-muted-foreground">{p.materias.anio}° Año</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-primary">
                          Comisión {p.comision_tiene}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-muted-foreground">
                          {Array.isArray(p.comisiones_busca) ? p.comisiones_busca.join(", ") : p.comisiones_busca}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString("es-AR") : ""}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'activa' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                            p.status === 'realizada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {p.status || (p.activa ? 'activa' : 'inactiva')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => deletePermuta(p.id)} className="text-destructive hover:bg-destructive/10 h-8 w-8">
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredPermutas.length === 0 && (
                <div className="p-12 text-center text-muted-foreground italic">No se encontraron permutas con los filtros actuales.</div>
              )}
            </div>
          </div>

          {/* MODAL DE CIERRE DE PERÍODO Y ARCHIVADO PERPETUO */}
          <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
            <DialogContent className="max-w-md bg-card border border-white/15">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Cerrar Período y Guardar Histórico</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Esta acción guardará un snapshot permanente con todas las estadísticas (por materia, por año, totales y concretadas) en el histórico perpetuo antes de reiniciar la lista para el próximo cuatrimestre.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Nombre del Período / Temporada</label>
                  <Input
                    value={archivePeriodName}
                    onChange={e => setArchivePeriodName(e.target.value)}
                    placeholder="Ej: 2026 - 1° Cuatrimestre"
                    className="text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border text-xs space-y-1.5">
                  <div className="font-semibold text-foreground">Resumen de este período a archivar:</div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Permutas publicadas:</span>
                    <strong className="text-foreground">{permutas.length}</strong>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Realizadas (exitosas):</span>
                    <strong className="text-emerald-400">{permutas.filter(p => p.status === 'realizada').length}</strong>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Personas a sumar al contador:</span>
                    <strong className="text-emerald-400">+{permutas.filter(p => p.status === 'realizada').length * 2} personas</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsArchiveModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={archivarPeriodoYLimpiar} 
                  disabled={updating || !archivePeriodName.trim()}
                  className="bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Guardar Histórico y Reiniciar</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* --- TAB: USUARIOS --- */}
        <TabsContent value="usuarios" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/30 p-4 rounded-2xl border">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, año de ingreso o teléfono..." 
                className="pl-10 bg-background border-none shadow-none text-xs" 
                value={searchUserProfile}
                onChange={e => setSearchUserProfile(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <select
                value={userSortOrder}
                onChange={(e) => setUserSortOrder(e.target.value as any)}
                className="bg-background border border-border text-foreground text-xs font-semibold rounded-xl px-3 h-10 outline-none cursor-pointer focus:ring-2 focus:ring-accent"
              >
                <option value="recent">🕒 Más recientes primero</option>
                <option value="az">🔤 Alfabético (A - Z)</option>
                <option value="year">🎓 Año de Ingreso (Mayor a menor)</option>
              </select>

              <Button 
                onClick={exportUsersToExcel} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl px-5 h-10 flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
              >
                <FileSpreadsheet size={16} />
                Exportar a Excel (.xlsx)
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Nombre Completo</th>
                  <th className="px-6 py-4 text-left font-semibold">Fecha Registro</th>
                  <th className="px-6 py-4 text-left font-semibold">Año Ingreso</th>
                  <th className="px-6 py-4 text-left font-semibold">Rol</th>
                  <th className="px-6 py-4 text-left font-semibold">Permutas Activas</th>
                  <th className="px-6 py-4 text-left font-semibold">Estado</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedAndFilteredProfiles.map(p => (
                  <tr key={p.id} className={`hover:bg-muted/10 transition-colors ${p.is_banned ? "bg-destructive/5" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{p.full_name || "Sin nombre"}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.id}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {p.created_at ? new Date(p.created_at).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "N/D"}
                    </td>
                    <td className="px-6 py-4">
                      {p.anio_ingreso ? (
                        <span className="font-mono font-bold text-accent text-xs px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20">
                          {p.anio_ingreso}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">N/D</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={p.role || "user"}
                        onChange={(e) => updateUserRole(p.id, e.target.value)}
                        className="bg-slate-900 border border-white/20 text-white font-bold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="user">Estudiante (User)</option>
                        <option value="betatester">⚡ Betatester</option>
                        <option value="escritor">✍️ Escritor</option>
                        <option value="admin">👑 Administrador</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold ${
                        (userPermutaCount[p.id] || 0) > 3 ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {userPermutaCount[p.id] || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.is_banned ? (
                        <span className="flex items-center gap-1 text-destructive font-black text-[10px] uppercase tracking-tighter">
                          <UserMinus size={12} /> Vetado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-500 font-bold text-[10px] uppercase tracking-tighter">
                          <UserCheck size={12} /> Activo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.id !== user?.id && (
                        <Button 
                          variant={p.is_banned ? "outline" : "destructive"} 
                          size="sm" 
                          onClick={() => toggleBanUser(p.id, p.is_banned)}
                          className="rounded-xl h-8 px-4"
                        >
                          {p.is_banned ? "Levantar Veto" : "Vetar Cuenta"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedAndFilteredProfiles.length === 0 && (
              <div className="p-12 text-center text-muted-foreground italic">No se encontraron usuarios con los filtros actuales.</div>
            )}
          </div>
        </TabsContent>

        {/* --- TAB: ASISTENTE IA CORRECCIONES --- */}
        <TabsContent value="asistente" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="text-accent h-5 w-5" /> Correcciones y Reglas de Aprendizaje del Bot
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Las correcciones <strong className="text-emerald-400">aprobadas por administradores</strong> se inyectan en tiempo real como verdades absolutas para el Asistente DND.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                {correcciones.filter(c => c.aprobado).length} Aprobadas
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                {correcciones.filter(c => !c.aprobado).length} Pendientes
              </span>
            </div>
          </div>

          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Materia / Contexto</th>
                  <th className="px-6 py-4 text-left font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left font-semibold">Pregunta Original</th>
                  <th className="px-6 py-4 text-left font-semibold">Respuesta Oficial Corregida</th>
                  <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {correcciones.map(c => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => openDetailModal(c)}
                  >
                    <td className="px-6 py-4 font-bold text-accent">
                      {c.materia}
                      {c.catedra && <span className="block text-[10px] text-muted-foreground font-normal">Cat: {c.catedra}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {c.aprobado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                          <CheckCircle size={11} /> Aprobada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider animate-pulse">
                          <Clock size={11} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium max-w-xs truncate" title={c.pregunta_original}>
                      {c.pregunta_original}
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground max-w-md line-clamp-2" title={c.respuesta_corregida}>
                      {c.respuesta_corregida}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDetailModal(c)}
                          className="h-8 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1"
                        >
                          <Eye size={14} /> Ver
                        </Button>

                        {!c.aprobado && (
                          <Button 
                            size="sm" 
                            onClick={() => approveCorreccion(c.id)} 
                            disabled={updating}
                            className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 font-bold"
                          >
                            <Check size={14} /> Aprobar
                          </Button>
                        )}

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteCorreccion(c.id)} 
                          disabled={updating}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {correcciones.length === 0 && (
              <div className="p-12 text-center text-muted-foreground italic">No hay reglas de corrección registradas aún.</div>
            )}
          </div>
        </TabsContent>

        {/* --- TAB: TRIVIA COMPLETA & BANCO DE PREGUNTAS --- */}
        <TabsContent value="trivia" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* TARJETA PRINCIPAL DE ACCIONES Y DESCARGA */}
          <div className="p-6 bg-card border rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2 text-foreground">
                  <Brain className="text-accent h-6 w-6" /> Banco General y Completo de Preguntas de Trivia
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Catálogo integral de <strong className="text-foreground">{allTriviaQuestionsConsolidated.length} preguntas</strong> de 1º a 5º Año (Plan 6 FCJyS UNLP) sincronizadas entre el banco oficial y la base de datos en tiempo real.
                </p>
              </div>

              {/* BOTONES DE EXPORTACIÓN DIRECTA */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Button
                  onClick={exportAllTriviaToExcel}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exportar Todo a Excel (.xlsx)</span>
                </Button>
                <Button
                  onClick={exportAllTriviaToJSON}
                  variant="outline"
                  className="text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 border-border hover:bg-muted"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar JSON (.json)</span>
                </Button>
              </div>
            </div>

            {/* ESTADÍSTICAS RÁPIDAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-[10px] uppercase font-black text-muted-foreground block">Total Preguntas</span>
                <span className="text-2xl font-black text-foreground font-mono">{allTriviaQuestionsConsolidated.length}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-[10px] uppercase font-black text-muted-foreground block">1º Año (7 Materias)</span>
                <span className="text-2xl font-black text-accent font-mono">
                  {allTriviaQuestionsConsolidated.filter(q => q.anio === 1).length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-[10px] uppercase font-black text-muted-foreground block">2º a 5º Año</span>
                <span className="text-2xl font-black text-emerald-500 font-mono">
                  {allTriviaQuestionsConsolidated.filter(q => (q.anio || 0) > 1).length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-[10px] uppercase font-black text-muted-foreground block">En Base Supabase / IA</span>
                <span className="text-2xl font-black text-indigo-400 font-mono">
                  {preguntasTriviaIA.length}
                </span>
              </div>
            </div>
          </div>

          {/* SELECTOR DE MODO: BANCO COMPLETO VS MODERACIÓN IA */}
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTriviaViewMode("banco")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  triviaViewMode === "banco"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground"
                }`}
              >
                📚 Explorar Banco Completo ({filteredTriviaQuestions.length})
              </button>
              <button
                onClick={() => setTriviaViewMode("moderacion")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  triviaViewMode === "moderacion"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground"
                }`}
              >
                <span>🤖 Moderación de IA</span>
                {preguntasTriviaIA.filter(p => !p.aprobado).length > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[10px] font-black rounded-full">
                    {preguntasTriviaIA.filter(p => !p.aprobado).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* VISTA 1: EXPLORADOR DEL BANCO COMPLETO */}
          {triviaViewMode === "banco" && (
            <div className="space-y-4">
              {/* FILTROS DE BÚSQUEDA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={triviaSearchQuery}
                    onChange={(e) => setTriviaSearchQuery(e.target.value)}
                    placeholder="Buscar por pregunta, fundamento o ID..."
                    className="pl-9 bg-card rounded-xl text-xs"
                  />
                </div>

                <select
                  value={triviaYearFilter}
                  onChange={(e) => setTriviaYearFilter(Number(e.target.value))}
                  className="bg-card border border-input rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value={0}>Todos los Años (1º a 5º Año)</option>
                  <option value={1}>1º Año</option>
                  <option value={2}>2º Año</option>
                  <option value={3}>3º Año</option>
                  <option value={4}>4º Año</option>
                  <option value={5}>5º Año</option>
                </select>

                <select
                  value={triviaCategoryFilter}
                  onChange={(e) => setTriviaCategoryFilter(e.target.value)}
                  className="bg-card border border-input rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="todas">Todas las Materias ({CATEGORIAS_TRIVIA.length - 1})</option>
                  {CATEGORIAS_TRIVIA.filter(c => c.id !== "todas").map(c => (
                    <option key={c.id} value={c.id}>
                      {c.anio > 0 ? `[${c.anio}º] ` : ""}{c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* TABLA DE PREGUNTAS */}
              <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                <div className="max-h-[600px] overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/80 sticky top-0 border-b z-10">
                      <tr>
                        <th className="px-4 py-3 font-black text-muted-foreground w-16">N° / ID</th>
                        <th className="px-4 py-3 font-black text-muted-foreground w-36">Materia / Año</th>
                        <th className="px-4 py-3 font-black text-muted-foreground">Pregunta y Opciones</th>
                        <th className="px-4 py-3 font-black text-muted-foreground w-64">Fundamento Jurídico</th>
                        <th className="px-4 py-3 font-black text-muted-foreground w-28 text-right">Origen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredTriviaQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                            No se encontraron preguntas con los filtros seleccionados.
                          </td>
                        </tr>
                      ) : (
                        filteredTriviaQuestions.slice(0, 100).map((q, idx) => {
                          const opciones = Array.isArray(q.opciones) ? q.opciones : [];
                          const respIdx = q.respuesta_correcta_index ?? 0;
                          const letras = ["A", "B", "C", "D"];

                          return (
                            <tr key={q.id || idx} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                                <span className="font-bold text-foreground">#{idx + 1}</span>
                                <span className="block text-[9px] truncate max-w-[70px]">{q.id}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-bold text-foreground block">{q.categoria_nombre}</span>
                                <span className="text-[10px] text-accent font-black uppercase">
                                  {q.anio ? `${q.anio}º Año` : "General"}
                                </span>
                              </td>
                              <td className="px-4 py-3 space-y-1.5 max-w-md">
                                <p className="font-semibold text-foreground leading-snug">{q.pregunta}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                                  {opciones.map((opc: string, oIdx: number) => (
                                    <div
                                      key={oIdx}
                                      className={`px-2 py-1 rounded-lg border ${
                                        oIdx === respIdx
                                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
                                          : "bg-muted/30 border-transparent text-muted-foreground"
                                      }`}
                                    >
                                      <span className="font-mono mr-1">({letras[oIdx]})</span>
                                      <span>{opc}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-[11px] text-muted-foreground leading-relaxed">
                                {q.fundamento_juridico || <span className="italic text-muted-foreground/60">Sin fundamento cargado</span>}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                                  {q.origen}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredTriviaQuestions.length > 100 && (
                  <div className="p-3 bg-muted/40 border-t text-center text-xs text-muted-foreground font-semibold">
                    Mostrando las primeras 100 preguntas de {filteredTriviaQuestions.length}. Usá el botón "Exportar Todo a Excel" para ver el catálogo completo.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VISTA 2: MODERACIÓN DE PREGUNTAS IA */}
          {triviaViewMode === "moderacion" && (
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Materia</th>
                    <th className="px-6 py-4 text-left font-semibold">Estado</th>
                    <th className="px-6 py-4 text-left font-semibold">Pregunta</th>
                    <th className="px-6 py-4 text-left font-semibold">Fundamento Jurídico</th>
                    <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {preguntasTriviaIA.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-xs text-muted-foreground italic">
                        No hay preguntas de Trivia generadas por IA para revisar en este momento.
                      </td>
                    </tr>
                  ) : (
                    preguntasTriviaIA.map(p => (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-accent">
                          {p.materia}
                          {p.catedra && <span className="block text-[10px] text-muted-foreground font-normal">Cat: {p.catedra}</span>}
                        </td>
                        <td className="px-6 py-4">
                          {p.aprobado ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                              <CheckCircle size={11} /> Aprobada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                              <Clock size={11} /> Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-xs text-xs font-semibold text-foreground leading-relaxed">
                          {p.pregunta}
                        </td>
                        <td className="px-6 py-4 max-w-xs text-xs text-muted-foreground leading-relaxed">
                          {p.fundamento_juridico || "Sin fundamento especificado"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!p.aprobado && (
                              <Button
                                size="sm"
                                onClick={() => aprobarPreguntaTrivia(p.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-lg"
                              >
                                Aprobar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => eliminarPreguntaTrivia(p.id)}
                              className="text-xs px-2.5 py-1 rounded-lg"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* MODAL DETALLE DE CORRECCIÓN COMPLETO */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-2xl space-y-5">
          {selectedCorreccion && (
            <>
              <DialogHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold font-mono text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-3 py-1 rounded-lg">
                    Materia: {selectedCorreccion.materia} {selectedCorreccion.catedra ? `(Cátedras ${selectedCorreccion.catedra})` : ""}
                  </span>

                  {selectedCorreccion.aprobado ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle size={13} /> APROBADA E INYECTADA EN IA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Clock size={13} /> PENDIENTE DE REVISIÓN ADMIN
                    </span>
                  )}
                </div>

                <DialogTitle className="font-display text-xl font-bold text-foreground mt-3">
                  Detalle Completo de la Corrección
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Registrada el {new Date(selectedCorreccion.created_at).toLocaleString("es-AR")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Pregunta Original */}
                <div className="space-y-1.5 p-4 rounded-xl bg-muted/40 border">
                  <label className="text-[11px] font-black text-accent uppercase tracking-wider block">
                    Pregunta Original del Alumno:
                  </label>
                  <p className="text-sm font-semibold text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedCorreccion.pregunta_original}
                  </p>
                </div>

                {/* Respuesta Original del Bot (si existe) */}
                {selectedCorreccion.respuesta_original && (
                  <div className="space-y-1.5 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <label className="text-[11px] font-black text-red-400 uppercase tracking-wider block">
                      Respuesta Original del Bot (Errónea / Incompleta):
                    </label>
                    <div className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed">
                      {selectedCorreccion.respuesta_original}
                    </div>
                  </div>
                )}

                {/* Respuesta Oficial Corregida (COMPLETA) */}
                <div className="space-y-1.5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <label className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block">
                    Respuesta Oficial Corregida (Instrucción Real para la IA):
                  </label>
                  <div className="text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed bg-background p-4 rounded-xl border border-border">
                    {selectedCorreccion.respuesta_corregida}
                  </div>
                </div>
              </div>

              {/* Botones de Acción del Modal */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                <Button 
                  variant="destructive" 
                  onClick={() => deleteCorreccion(selectedCorreccion.id)}
                  disabled={updating}
                  className="rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 size={15} /> Eliminar Corrección
                </Button>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    Cerrar
                  </Button>

                  {!selectedCorreccion.aprobado && (
                    <Button 
                      onClick={() => approveCorreccion(selectedCorreccion.id)}
                      disabled={updating}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl px-5 h-10 flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Check size={16} /> Aprobar Corrección Ahora
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
