import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, Calendar, User, Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompleteProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user, profile, reloadProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [anioIngreso, setAnioIngreso] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setFullName(profile.full_name || "");
      setTelefono(profile.telefono || "");
      setAnioIngreso(profile.anio_ingreso ? String(profile.anio_ingreso) : "");
    }
  }, [open, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedPhone = telefono.trim();
    if (!trimmedPhone) {
      toast.error("Por favor ingresá tu número de teléfono / WhatsApp.");
      return;
    }

    const trimmedAnio = anioIngreso.trim();
    if (!trimmedAnio) {
      toast.error("Por favor ingresá tu año de ingreso.");
      return;
    }

    const yr = parseInt(trimmedAnio, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(yr) || yr < 1980 || yr > currentYear) {
      toast.error(`El año de ingreso debe ser un año válido entre 1980 y ${currentYear}.`);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || profile?.full_name || user.email?.split("@")[0],
          telefono: trimmedPhone,
          anio_ingreso: yr,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("¡Perfil completado con éxito!", {
        description: "Tus datos se guardaron correctamente. ¡Ahora podés permutar comisiones más fácil!",
        style: { background: "#062f1c", color: "#34d399", border: "1px solid #10b981" },
      });

      await reloadProfile();
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      toast.error("Error al guardar los datos: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0A0E1A] border border-white/15 text-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="space-y-3 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Estudiantil DND</span>
          </div>
          <DialogTitle className="text-2xl font-black font-display text-white tracking-tight">
            Completá tu Perfil
          </DialogTitle>
          <DialogDescription className="text-xs text-white/60 leading-relaxed">
            Ingresá tu teléfono y año de ingreso. Esta información agiliza la carga y contacto en el <strong className="text-white">Permutero de Comisiones</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 relative z-10">
          {/* Nombre Completo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <User className="w-3 h-3 text-red-400" />
              <span>Nombre y Apellido</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-red-500 focus:bg-white/10 outline-none transition-all"
            />
          </div>

          {/* Teléfono / WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Teléfono / WhatsApp <span className="text-red-400">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. 221 123-4567 o 11 9876-5432"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-emerald-500 focus:bg-white/10 outline-none transition-all"
            />
            <p className="text-[9px] text-white/40 italic">
              Será utilizado para coordinar la permuta cuando exista coincidencia.
            </p>
          </div>

          {/* Año de Ingreso */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span>Año de Ingreso a la Carrera <span className="text-red-400">*</span></span>
            </label>
            <input
              type="number"
              required
              min="1980"
              max={new Date().getFullYear()}
              value={anioIngreso}
              onChange={(e) => setAnioIngreso(e.target.value)}
              placeholder="Ej. 2023"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-mono"
            />
            <p className="text-[9px] text-white/40 italic">
              Permite validar correlatividades y tu plan de estudios oficial.
            </p>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-white/60 hover:text-white transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-650 to-red-600 hover:from-red-600 hover:to-red-500 text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Perfil</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-white/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Tus datos son privados y protegidos bajo normas de seguridad de la UNLP.</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
