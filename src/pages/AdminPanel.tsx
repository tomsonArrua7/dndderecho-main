import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Search, UserMinus, UserCheck, Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
  const { user, profile: myProfile, loading: authLoading } = useAuth();
  const [permutas, setPermutas] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState<{ id: number; permutero_activo: boolean } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Search & Filter States
  const [searchMateria, setSearchMateria] = useState("");
  const [searchUser, setSearchUser] = useState("");
  
  // Mailing States
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [sendingMail, setSendingMail] = useState(false);

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
        { data: profs }, 
        { data: settings }
      ] = await Promise.all([
        supabase.from("permutas").select("*, materias(nombre)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("app_settings").select("*").eq("id", 1).single()
      ]);

      setPermutas(perms || []);
      setProfiles(profs || []);
      setAppSettings(settings || { id: 1, permutero_activo: true });
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
        userProfile?.email?.toLowerCase().includes(searchUser.toLowerCase()); // Note: profiles might not have email, auth meta does
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
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground">Control de integridad, usuarios y permutas.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg px-6">General</TabsTrigger>
          <TabsTrigger value="permutas" className="rounded-lg px-6">Permutas ({permutas.length})</TabsTrigger>
          <TabsTrigger value="usuarios" className="rounded-lg px-6">Usuarios ({profiles.length})</TabsTrigger>
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
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Nombre Completo</th>
                  <th className="px-6 py-4 text-left font-semibold">Rol</th>
                  <th className="px-6 py-4 text-left font-semibold">Permutas Activas</th>
                  <th className="px-6 py-4 text-left font-semibold">Estado</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {profiles.map(p => (
                  <tr key={p.id} className={`hover:bg-muted/10 transition-colors ${p.is_banned ? "bg-destructive/5" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{p.full_name || "Sin nombre"}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.id}</div>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
