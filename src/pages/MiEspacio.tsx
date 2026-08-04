import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CalendarDays, GraduationCap, Repeat2, Sparkles, User, Trash2, ArrowRight, Camera, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { UpcomingDates } from "@/components/UpcomingDates";
import { TOTAL_MATERIAS_PLAN6 } from "@/data/plan6Structure";
import { TOTAL_MATERIAS_PLAN5 } from "@/data/plan5Structure";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MiEspacio = () => {
  const { user, profile, reloadProfile } = useAuth();
  const [stats, setStats] = useState({ aprobadas: 0, total: 44, planName: "Plan 6", eventos: 0, permutas: 0, matches: 0 });
  const [name, setName] = useState("");
  const [myPermutas, setMyPermutas] = useState<any[]>([]);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAnioIngreso, setEditAnioIngreso] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Crop States
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgRenderSize, setImgRenderSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || "");
      setEditPhone((profile as any).telefono || "");
      setEditAnioIngreso(profile.anio_ingreso ? String(profile.anio_ingreso) : "");
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || user?.email?.split("@")[0] || "");
    }
  }, [profile, user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const planId = (localStorage.getItem("dnd_selected_plan") as "plan5" | "plan6") || "plan6";
        const total = planId === "plan5" ? TOTAL_MATERIAS_PLAN5 : TOTAL_MATERIAS_PLAN6;
        const planName = planId === "plan5" ? "Plan 5" : "Plan 6";

        const [{ data: profileData }, { data: ums, error: umsErr }, { count: evCount }, { data: pData }, { count: mCount }] = await Promise.all([
          supabase.from("profiles").select("full_name, anio_ingreso, avatar_url, role").eq("id", user.id).maybeSingle(),
          supabase.from("user_plan_progress").select("estado").eq("user_id", user.id).eq("plan_id", planId),
          supabase.from("eventos").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("permutas").select("*, materias(nombre)").eq("user_id", user.id).or("status.eq.activa,status.is.null"),
          supabase.from("matches").select("*", { count: "exact", head: true }),
        ]);

        if (umsErr) {
          console.error("Error loading plan progress:", umsErr);
        }

        const activePermutas = pData || [];
        setName(profileData?.full_name || user.email?.split("@")[0] || "");
        setStats({
          aprobadas: ums?.filter((u) => u.estado === "aprobada").length || 0,
          total,
          planName,
          eventos:   evCount || 0,
          permutas:  activePermutas.length,
          matches:   mCount  || 0,
        });
        setMyPermutas(activePermutas);
      } catch (err) {
        console.error("Error fetching Mi Espacio data:", err);
      }
    })();
  }, [user?.id]);

  const removePermuta = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta permuta?")) return;
    await supabase.from("permutas").delete().eq("id", id);
    setMyPermutas((p) => p.filter((x) => x.id !== id));
    setStats((s) => ({ ...s, permutas: s.permutas - 1 }));
    toast.success("Permuta eliminada");
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setTempImage(reader.result);
        setIsCropModalOpen(true);
      } else {
        toast.error("Error al leer el archivo");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleConfirmCrop = () => {
    if (!tempImage || !user) return;

    setUploading(true);

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Error al procesar la imagen");
      setUploading(false);
      return;
    }

    const img = new Image();
    img.src = tempImage;
    img.onload = async () => {
      ctx.clearRect(0, 0, 300, 300);
      ctx.fillStyle = "#0A0E1A";
      ctx.fillRect(0, 0, 300, 300);

      const ratio = 300 / 280;
      const canvasRenderW = imgRenderSize.w * ratio;
      const canvasRenderH = imgRenderSize.h * ratio;
      const canvasPosX = position.x * ratio;
      const canvasPosY = position.y * ratio;

      ctx.save();
      ctx.translate(150, 150);
      ctx.translate(canvasPosX, canvasPosY);
      ctx.scale(zoom, zoom);
      ctx.drawImage(img, -canvasRenderW / 2, -canvasRenderH / 2, canvasRenderW, canvasRenderH);
      ctx.restore();

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Error al generar el recorte");
          setUploading(false);
          return;
        }

        const filePath = `${user.id}/${Date.now()}.jpg`;

        try {
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

          if (updateError) throw updateError;

          toast.success("¡Foto de perfil actualizada!");
          await reloadProfile();
          setIsCropModalOpen(false);
          setTempImage(null);
        } catch (error: any) {
          console.error("Error al subir avatar:", error);
          toast.error("Error al subir la imagen: " + (error.message || error));
        } finally {
          setUploading(false);
        }
      }, "image/jpeg", 0.9);
    };

    img.onerror = () => {
      toast.error("Error al cargar la imagen original");
      setUploading(false);
    };
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedAnio = editAnioIngreso.trim();
    if (trimmedAnio === "") {
      toast.error("El año de ingreso es obligatorio");
      return;
    }
    const yr = parseInt(trimmedAnio, 10);
    if (isNaN(yr) || !/^\d{4}$/.test(trimmedAnio) || yr < 1980 || yr > 2026) {
      toast.error("El año de ingreso debe estar entre 1980 y 2026");
      return;
    }

    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editName,
          telefono: editPhone,
          anio_ingreso: yr,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("¡Perfil actualizado con éxito!");
      await reloadProfile();
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      toast.error("Error al guardar: " + (err.message || err));
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 py-6 md:py-12 md:px-8 md:container md:max-w-6xl">

      {/* ── Header mobile ── */}
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">
          Tu espacio personal
        </div>
        <h1 className="font-display text-2xl md:text-5xl font-bold text-foreground">
          Hola, <span style={{ color: "hsl(222 80% 55%)" }}>{name}</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-xs md:text-sm">
          Todo lo tuyo en un vistazo — materias, eventos y permutas.
        </p>
      </div>

      {/* ── Profile card + Edit button ── */}
      <div className="flex items-center gap-3 mb-4">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={name} className="h-10 w-10 rounded-full object-cover border border-border shrink-0" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center border border-border shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          {profile?.anio_ingreso && (
            <p className="text-[9px] font-bold text-accent uppercase tracking-wider">Ingreso: {profile.anio_ingreso}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="shrink-0 text-[10px] uppercase tracking-widest font-black h-8 px-3 border border-border/80 hover:bg-muted/80"
        >
          Editar
        </Button>
      </div>

      {/* ── Alert de match ── */}
      {stats.matches > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-accent text-accent-foreground border border-accent flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <div>
              <div className="font-bold text-sm">¡Tenés {stats.matches} match{stats.matches > 1 ? "es" : ""}!</div>
              <div className="text-xs text-white/85">Revisá tus permutas.</div>
            </div>
          </div>
          <Button asChild size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/20 shrink-0">
            <Link to="/permutero">Ver</Link>
          </Button>
        </div>
      )}

      {/* ── Main layout: single column mobile, sidebar desktop ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-3 lg:gap-6">

          {/* Progreso */}
          <Link
            to="/plan"
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-paper relative overflow-hidden group hover:border-primary/45 transition-all duration-200"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.03] bg-primary -translate-y-6 translate-x-6 pointer-events-none" />
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">Tu Progreso</h3>
              <p className="text-xs text-muted-foreground">{stats.aprobadas} de {stats.total} materias ({stats.planName})</p>
              <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(2, Math.min(100, (stats.aprobadas / stats.total) * 100))}%` }}
                />
              </div>
            </div>
            <ArrowRight className="shrink-0 h-4 w-4 text-primary/60 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Action Cards — reserva espacio fijo para evitar layout shift */}
          <div className="flex flex-col gap-2.5">
            {/* Cards de admin/beta — siempre reservan su espacio pero se ocultan si no es admin */}
            {(profile?.role === "admin" || profile?.role === "betatester") && (
              <>
                <DashCard to="/trivia" icon={Trophy} title="Trivia Jurídica" stats="Desafío por materias y duelos 1v1" color="accent" badge="Beta" />
                <DashCard to="/hace-tu-historia" icon={Sparkles} title="Hacé Tu Historia" stats="Simulador de carrera legal en La Plata" color="accent" badge="Beta" />
              </>
            )}
            <DashCard to="/permutero" icon={Repeat2} title="Permutero" stats={`${stats.permutas} permuta${stats.permutas !== 1 ? "s" : ""} activas`} color="primary" />
            <DashCard to="/calendario" icon={CalendarDays} title="Calendario" stats={`${stats.eventos} evento${stats.eventos !== 1 ? "s" : ""} guardados`} color="accent" />
          </div>

          {/* Permutas activas */}
          {myPermutas.length > 0 && (
            <div className="bg-card border rounded-2xl p-4 shadow-paper">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-foreground">Mis Permutas Activas</h2>
              <div className="flex flex-col gap-2">
                {myPermutas.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-background border flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">{p.materias?.nombre}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Tengo: C{p.comision_tiene} | Busco: {p.comisiones_busca.map((c: number) => `C${c}`).join(", ")}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removePermuta(p.id)} className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: UpcomingDates — solo visible en desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="p-5 rounded-2xl bg-card border shadow-paper h-full flex flex-col">
            <UpcomingDates />
          </div>
        </div>

      </div>

      {/* Modal Editar Perfil */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 shadow-2xl">
          <DialogTitle className="font-display text-xl font-bold mb-1 text-foreground">
            Editar Perfil
          </DialogTitle>
          <p className="text-muted-foreground text-xs mb-6">
            Actualizá tus datos personales y tu foto de perfil.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Foto de Perfil */}
            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/50 border border-border">
              <div className="relative group shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={name} className="h-16 w-16 rounded-full object-cover border border-border" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-border">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-background/80 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="avatar-file" className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-background border border-input text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs">
                  <Camera className="h-3.5 w-3.5 text-accent" />
                  {uploading ? "Subiendo..." : "Cambiar Foto"}
                </Label>
                <input 
                  id="avatar-file" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  disabled={uploading} 
                  className="hidden" 
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">Imágenes PNG, JPG o WEBP</p>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <Label htmlFor="edit-name" className="text-xs font-bold text-foreground">Nombre Completo</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="bg-background border-input text-foreground focus-visible:ring-accent mt-1.5"
                maxLength={80}
              />
            </div>

            {/* Año Ingreso */}
            <div>
              <Label htmlFor="edit-anio" className="text-xs font-bold text-foreground">Año de ingreso a la facultad</Label>
              <Input
                id="edit-anio"
                type="text"
                maxLength={4}
                value={editAnioIngreso}
                onChange={(e) => setEditAnioIngreso(e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
                placeholder="Ej: 2023"
                className="bg-background border-input text-foreground focus-visible:ring-accent mt-1.5"
              />
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="edit-phone" className="text-xs font-bold text-foreground">Teléfono de contacto</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-background border-input text-foreground focus-visible:ring-accent mt-1.5"
                placeholder="Ej: 2215016468"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-xs font-bold uppercase tracking-widest text-white shadow-sm"
                disabled={savingProfile || uploading}
              >
                {savingProfile && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para recortar foto de perfil */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 z-[200] shadow-2xl">
          <DialogTitle className="font-display text-lg font-bold mb-1 text-foreground">
            Ajustar foto de perfil
          </DialogTitle>
          <p className="text-muted-foreground text-xs mb-4">
            Arrastrá la foto para moverla y usá la barra de abajo para hacer zoom para que calce bien en el círculo.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            {/* Circular Preview Mask */}
            <div 
              className="relative w-[280px] h-[280px] overflow-hidden rounded-full border-2 border-border bg-muted cursor-move shadow-inner"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {tempImage && (
                <img
                  src={tempImage}
                  alt="Crop preview"
                  draggable={false}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
                    let w = 280;
                    let h = 280;
                    if (imgAspectRatio > 1) {
                      w = 280 * imgAspectRatio;
                    } else {
                      h = 280 / imgAspectRatio;
                    }
                    setImgRenderSize({ w, h });
                    setPosition({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: imgRenderSize.w ? `${imgRenderSize.w}px` : "auto",
                    height: imgRenderSize.h ? `${imgRenderSize.h}px` : "auto",
                    marginLeft: imgRenderSize.w ? `${-imgRenderSize.w / 2}px` : 0,
                    marginTop: imgRenderSize.h ? `${-imgRenderSize.h / 2}px` : 0,
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    maxWidth: "none",
                    maxHeight: "none",
                    pointerEvents: "none",
                  }}
                />
              )}
              <div className="absolute inset-0 rounded-full border-2 border-accent/40 pointer-events-none" />
            </div>

            {/* Zoom Slider */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Zoom</span>
                <span className="font-bold text-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setIsCropModalOpen(false);
                  setTempImage(null);
                }}
                className="px-4 py-2 rounded-lg bg-muted border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCrop}
                disabled={uploading}
                className="px-6 py-2 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-50 text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 shadow-sm transition-colors"
              >
                {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Guardar Foto
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DashCard = ({
  to, icon: Icon, title, stats, color, badge,
}: {
  to: string; icon: React.ElementType; title: string; stats: string; color: "primary" | "accent"; badge?: string;
}) => (
  <Link
    to={to}
    className="relative flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 active:scale-[0.97] transition-all duration-200 shadow-paper group overflow-hidden"
  >
    {/* Glow bg */}
    <div
      className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.07] -translate-y-6 translate-x-6 pointer-events-none"
      style={{ background: color === "accent" ? "hsl(var(--accent))" : "hsl(var(--primary))" }}
    />
    {/* Icon */}
    <div
      className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${
        color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
      }`}
    >
      <Icon className="h-5 w-5" />
    </div>
    {/* Text */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <h3 className="font-semibold text-sm text-foreground leading-tight">{title}</h3>
        {badge && (
          <span
            className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
              color === "accent" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{stats}</p>
    </div>
    {/* Arrow */}
    <ArrowRight
      className={`shrink-0 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200 ${
        color === "accent" ? "text-accent/60" : "text-primary/60"
      }`}
    />
  </Link>
);

export default MiEspacio;
