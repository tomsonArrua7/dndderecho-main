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
  FileSpreadsheet, Download, Eye, CheckCircle, Clock, Check
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminPanel() {
  const { user, profile: myProfile, loading: authLoading } = useAuth();
  const [permutas, setPermutas] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [correcciones, setCorrecciones] = useState<any[]>([]);
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
  
  // Mailing States
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [sendingMail, setSendingMail] = useState(false);

  // User Filter & Sort States
  const [searchUserProfile, setSearchUserProfile] = useState("");
  const [userSortOrder, setUserSortOrder] = useState<"recent" | "az" | "year">("recent");

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
      "Rol": p.role === "admin" ? "Administrador" : p.role === "escritor" ? "Escritor" : "Estudiante",
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
        { data: perms }, 
        { count: usersCount }, 
        { data: settings },
        { count: partidasCount },
        { count: duelosCount },
        { data: corrs }
      ] = await Promise.all([
        supabase.from("permutas").select("*, materias(nombre)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("app_settings").select("*").eq("id", 1).single(),
        supabase.from("trivia_partidas").select("*", { count: "exact", head: true }),
        supabase.from("trivia_duelos").select("*", { count: "exact", head: true }),
        supabase.from("asistente_correcciones").select("*").order("created_at", { ascending: false })
      ]);

      setTotalUsersCount(usersCount || 0);
      setCorrecciones(corrs || []);

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

      setPermutas(perms || []);
      setProfiles(allProfiles);
      setAppSettings(settings || { id: 1, permutero_activo: true, modo_mantenimiento: false });
      setTotalPartidasCount(partidasCount || 0);
      setTotalDuelosCount(duelosCount || 0);
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error("Error al cargar datos del panel.");
    } finally {
      setLoading(false);
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

  const handleSendMassMail = async () => {
    if (!mailSubject.trim() || !mailBody.trim()) {
      toast.error("Completá asunto y cuerpo.");
      return;
    }
    if (!confirm(`¿Enviar mail a TODOS (${profiles.length})?`)) return;

    setSendingMail(true);
    try {
      const { data, error } = await supabase.functions.invoke("mass-mailing", {
        body: { subject: mailSubject, body: mailBody },
      });
      if (error) throw error;
      toast.success(`Mail enviado con éxito.`);
      setMailSubject(""); setMailBody("");
    } catch (err: any) {
      toast.error("Error: " + (err.message || "Error desconocido"));
    } finally {
      setSendingMail(false);
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

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg px-6">General</TabsTrigger>
          <TabsTrigger value="permutas" className="rounded-lg px-6">Permutas ({permutas.length})</TabsTrigger>
          <TabsTrigger value="usuarios" className="rounded-lg px-6">Usuarios ({totalUsersCount || profiles.length})</TabsTrigger>
          <TabsTrigger value="asistente" className="rounded-lg px-6">Asistente IA ({correcciones.length})</TabsTrigger>
        </TabsList>

        {/* --- TAB: GENERAL --- */}
        <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="p-8 bg-card border rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Temporada de Permutas</h2>
              <p className="text-muted-foreground text-sm">Habilita o deshabilita la creación de nuevas publicaciones.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold uppercase tracking-widest ${appSettings?.permutero_activo ? "text-green-500" : "text-destructive"}`}>
                {appSettings?.permutero_activo ? "Activo" : "Pausado"}
              </span>
              <Switch checked={appSettings?.permutero_activo} onCheckedChange={togglePermutero} disabled={updating} />
            </div>
          </section>

          <section className="p-8 bg-card border rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Modo Solo Administradores (Mantenimiento)</h2>
              <p className="text-muted-foreground text-sm">Cuando está activo, los estudiantes solo verán la pantalla de próximamente/mantenimiento.</p>
            </div>
            <div className="flex items-center gap-4">
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
        </TabsContent>

        {/* --- TAB: PERMUTAS --- */}
        <TabsContent value="permutas" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/30 p-4 rounded-2xl border">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por materia..." 
                className="pl-10 bg-background border-none shadow-none" 
                value={searchMateria}
                onChange={e => setSearchMateria(e.target.value)}
              />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por usuario..." 
                className="pl-10 bg-background border-none shadow-none"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Usuario</th>
                  <th className="px-6 py-4 text-left font-semibold">Materia</th>
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
                        <div className="font-medium text-foreground">{prof?.full_name || "Usuario Desconocido"}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{p.telefono}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{p.materias?.nombre}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'activa' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => deletePermuta(p.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 size={16} />
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

          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
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
                    <td className="px-6 py-4 capitalize">{p.role}</td>
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
