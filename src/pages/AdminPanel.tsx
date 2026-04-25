import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [permutas, setPermutas] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState<{ id: number; permutero_activo: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Check role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
      const currentRole = profile?.role?.toLowerCase()?.trim() || "estudiante";
      setRole(currentRole);

      if (currentRole === "admin") {
        // Fetch data
        const [{ data: perms }, { data: settings }] = await Promise.all([
          supabase.from("permutas").select("*, materias(nombre)").order("created_at", { ascending: false }),
          supabase.from("app_settings").select("*").eq("id", 1).single()
        ]);
        setPermutas(perms || []);
        setAppSettings(settings || { id: 1, permutero_activo: true });
      }
    } catch (err) {
      console.error("Critical error in AdminPanel loadData:", err);
      toast.error("Error al cargar datos del panel de administrador.");
    } finally {
      setLoading(false);
    }
  };

  const togglePermutero = async () => {
    if (!appSettings) return;
    setUpdating(true);
    const newValue = !appSettings.permutero_activo;
    const { error } = await supabase
      .from("app_settings")
      .update({ permutero_activo: newValue })
      .eq("id", 1);
    
    if (error) {
      toast.error("Error al actualizar estado");
    } else {
      setAppSettings({ ...appSettings, permutero_activo: newValue });
      toast.success(newValue ? "Permutero habilitado" : "Permutero deshabilitado");
    }
    setUpdating(false);
  };

  const deleteAllPermutas = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar TODAS las permutas? Esta acción no se puede deshacer.")) return;
    
    setUpdating(true);
    // No direct way to delete all rows easily from UI without a function if RLS prevents it?
    // Wait, admins have RLS bypass in the policy.
    const { error } = await supabase.from("permutas").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // trick to delete all since we can't do delete().is("id", not null) easily, wait actually .neq works.
    
    if (error) {
      toast.error("Error al borrar permutas: " + error.message);
    } else {
      toast.success("Todas las permutas fueron eliminadas");
      setPermutas([]);
    }
    setUpdating(false);
  };

  if (authLoading || loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (role !== "admin") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p className="mb-4">Tu rol actual es: <strong>{role}</strong></p>
        <p className="text-muted-foreground">Necesitás tener el rol 'admin' en la tabla profiles para ver este panel.</p>
        <Button className="mt-6" asChild>
          <Navigate to="/dashboard" />
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid gap-8">
        {/* Settings */}
        <section className="p-6 bg-card border rounded-xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Temporada de Permutas</h2>
            <p className="text-muted-foreground text-sm">Activa o desactiva la publicación de nuevas permutas.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{appSettings?.permutero_activo ? "Habilitado" : "Deshabilitado"}</span>
            <Switch 
              checked={appSettings?.permutero_activo} 
              onCheckedChange={togglePermutero} 
              disabled={updating}
            />
          </div>
        </section>

        {/* Permutas */}
        <section className="p-6 bg-card border rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Gestión de Permutas ({permutas.length})</h2>
            <Button variant="destructive" onClick={deleteAllPermutas} disabled={updating || permutas.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" /> Borrar todas
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-2 rounded-tl-md">Materia</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Contacto</th>
                  <th className="px-4 py-2 rounded-tr-md">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {permutas.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{p.materias?.nombre}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        p.status === 'activa' ? 'bg-green-100 text-green-800' :
                        p.status === 'realizada' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{p.nombre_contacto} ({p.telefono})</td>
                    <td className="px-4 py-2">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {permutas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted-foreground">No hay permutas cargadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
