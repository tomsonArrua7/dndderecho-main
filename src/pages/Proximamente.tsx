import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DndMark } from "@/components/DndMark";
import { useTheme } from "next-themes";
import { Sun, Moon, Lock, LogOut, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import facultad from "@/assets/facultad_unlp_optimized.png";
import { useState } from "react";
import { toast } from "sonner";

const Proximamente = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente");
    } catch (err) {
      toast.error("Error al cerrar sesión");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background image with overlay and blur */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 -z-10"
      >
        <img
          src={facultad}
          alt="Facultad de Derecho UNLP"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/90 via-primary-deep/80 to-primary-deep/95 dark:from-black/90 dark:via-black/85 dark:to-black/95" />
        <div className="absolute inset-0 bg-primary-deep/10 dark:bg-transparent mix-blend-multiply" />
      </motion.div>

      {/* Floating Theme Toggle in top-right */}
      <div className="absolute top-6 right-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-3 rounded-2xl bg-card/60 backdrop-blur-md border border-border text-foreground/80 hover:text-foreground shadow-elegant hover:bg-card/80 transition-all duration-300 flex items-center justify-center cursor-pointer"
          aria-label="Cambiar tema"
        >
          {resolvedTheme === "light" ? (
            <Moon className="h-5 w-5 text-indigo-500 fill-indigo-500/10" strokeWidth={2} />
          ) : (
            <Sun className="h-5 w-5 text-amber-400 fill-amber-400/10" strokeWidth={2} />
          )}
        </motion.button>
      </div>

      {/* Landing Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-elegant relative z-10 flex flex-col items-center text-center"
      >
        {/* Animated Brand Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <DndMark size={110} className="drop-shadow-[0_0_35px_rgba(220,38,38,0.35)]" />
        </motion.div>

        {/* Header titles */}
        <span className="text-[10px] tracking-[0.3em] font-black uppercase text-accent mb-3 block">
          DND Jursoc · Facultad de Derecho
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          PRÓXIMAMENTE
        </h1>

        {/* Separator line */}
        <div className="w-12 h-1 bg-accent rounded-full mb-8" />

        {/* Content conditional states */}
        {user ? (
          <div className="w-full space-y-6">
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-left space-y-3 flex items-start gap-4">
              <ShieldAlert className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-sm text-foreground">Acceso Restringido</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Iniciaste sesión como <strong className="text-foreground">{profile?.full_name || user.email}</strong> (Rango: <span className="font-semibold text-accent uppercase tracking-wider text-[10px]">{profile?.role || "estudiante"}</span>).
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  La plataforma se encuentra temporalmente en construcción. Solo las cuentas con rol de **Administrador** pueden acceder en esta etapa.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="flex-1 rounded-2xl h-12 uppercase tracking-wider text-[10px] font-bold border-border hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
              >
                <LogOut className="mr-2 h-4 w-4" /> {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-8">
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
              Estamos diseñando el espacio digital definitivo para los estudiantes de Derecho. Muy pronto vas a descubrir una nueva forma de transitar tu carrera. Mantenete atento.
            </p>

            <div className="pt-2">
              <Button
                onClick={() => navigate("/auth")}
                className="w-full rounded-2xl h-13 uppercase tracking-widest text-[11px] font-bold shadow-elegant group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" /> Acceso Admin
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Info footer */}
        <div className="mt-10 flex items-center gap-2 text-muted-foreground/60 text-[10px] uppercase font-bold tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>Fuerza Estudiantil Organizada</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Proximamente;
