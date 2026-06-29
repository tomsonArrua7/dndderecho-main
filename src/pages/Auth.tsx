import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Scale, MailOpen, CheckCircle, KeyRound, Lock } from "lucide-react";
import logo from "@/assets/dnd-logo.png";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});
const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  anioIngreso: z.string()
    .regex(/^\d{4}$/, "El año de ingreso debe ser un número de 4 dígitos")
    .refine((val) => {
      const yr = parseInt(val, 10);
      return yr >= 1980 && yr <= 2026;
    }, "El año debe estar entre 1980 y 2026"),
});

// Detecta si la URL actual tiene indicadores de flujo de recuperación de contraseña
function isRecoveryUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  return window.location.pathname === "/auth/recovery" ||
         params.get("type") === "recovery" ||
         window.location.hash.includes("type=recovery");
}

// Detecta si la URL actual viene de un link de confirmación de Supabase
function getConfirmationCode(): { type: "pkce"; code: string } | { type: "hash" } | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const hash = window.location.hash;
  if (code) return { type: "pkce", code };
  if (hash.includes("access_token") && (hash.includes("type=signup") || hash.includes("type=invite") || hash.includes("type=recovery"))) {
    return { type: "hash" };
  }
  return null;
}

const Auth = () => {
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const recoveryActive = isRecoveryUrl();
  const [tab, setTab] = useState<"signin" | "signup" | "forgot" | "forgot-success" | "update-password">(
    recoveryActive ? "update-password" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [anioIngreso, setAnioIngreso] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const isRecoveryFlow = useRef(recoveryActive);
  const hasExchanged = useRef(false);

  // "idle" | "loading" | "confirmed" | "error"
  const [confirmState, setConfirmState] = useState<"idle" | "loading" | "confirmed" | "error">(
    () => (getConfirmationCode() ? "loading" : "idle")
  );

  // Escuchar evento PASSWORD_RECOVERY de Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        isRecoveryFlow.current = true;
        setConfirmState("idle");
        setTab("update-password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Intercambia el código PKCE (o valida el hash) por una sesión real
  useEffect(() => {
    const info = getConfirmationCode();
    if (!info) return;

    if (hasExchanged.current) return;
    hasExchanged.current = true;

    // Limpiamos la URL del navegador a /auth limpia
    window.history.replaceState(null, "", "/auth");

    if (info.type === "hash") {
      // Si el hash indica recovery, marcamos el flujo de recuperación y terminamos cargando
      if (window.location.hash.includes("type=recovery")) {
        isRecoveryFlow.current = true;
        setConfirmState("idle");
        return;
      }
      setConfirmState("confirmed");
      return;
    }

    // Flujo PKCE: intercambiar code por sesión
    supabase.auth.exchangeCodeForSession(info.code).then(({ error }) => {
      if (error) {
        console.error("PKCE exchange error:", error);
        setConfirmState("error");
      } else {
        if (!isRecoveryFlow.current) {
          setConfirmState("confirmed");
        } else {
          setConfirmState("idle");
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si el usuario ya está logueado y no estamos confirmando un mail ni actualizando contraseña, redirigir
  if (!authLoading && user && confirmState === "idle" && tab !== "update-password") {
    return <Navigate to={from} replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message);
      return;
    }
    toast.success("¡Bienvenido/a!");
    navigate(from, { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ email, password, fullName, anioIngreso });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { error } = await signUp(email, password, fullName, parseInt(anioIngreso, 10));
    setSubmitting(false);
    if (error) {
      if (error.message.includes("already")) toast.error("Ese email ya está registrado");
      else toast.error(error.message);
      return;
    }
    setSignUpSuccess(true);
  };

  const handleGoToSignIn = async () => {
    await signOut();
    setConfirmState("idle");
    setTab("signin");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Ingresá tu correo electrónico");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-recovery-email", {
        body: { 
          email: email.trim(),
          origin: window.location.origin
        }
      });
      setSubmitting(false);

      if (error) {
        throw error;
      }

      if (data && data.error) {
        const msg = data.error === "User not found" || data.error.includes("User not found")
          ? "No existe un usuario registrado con ese correo" 
          : data.error;
        toast.error(msg);
        return;
      }

      setTab("forgot-success");
    } catch (err: any) {
      setSubmitting(false);
      console.error("Error sending recovery email:", err);
      toast.error(err.message || "Error al enviar el correo de recuperación");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Contraseña restablecida con éxito");
    isRecoveryFlow.current = false;
    navigate(from, { replace: true });
  };

  // ── PANTALLA: verificando código ─────────────────────────────────────
  if (confirmState === "loading") {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Verificando tu cuenta...</p>
        </div>
      </div>
    );
  }

  // ── PANTALLA: mail confirmado ─────────────────────────────────────────
  if (confirmState === "confirmed") {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-elegant text-center space-y-6 animate-hero-content">
          <div className="mx-auto h-20 w-20 bg-green-500/10 border-2 border-green-500/30 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-black text-foreground">¡Mail confirmado!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Tu cuenta ya se encuentra activa. Ya podés ingresar a la plataforma con tu email y contraseña.
            </p>
          </div>
          <Button
            onClick={handleGoToSignIn}
            size="lg"
            className="w-full rounded-xl font-bold text-base h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95"
          >
            Ingresar a la plataforma
          </Button>
        </div>
      </div>
    );
  }

  // ── PANTALLA: link inválido o expirado ───────────────────────────────
  if (confirmState === "error") {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-destructive/30 rounded-3xl p-10 shadow-elegant text-center space-y-6">
          <div className="space-y-3">
            <h1 className="font-display text-2xl font-black text-foreground">Link inválido o expirado</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              El enlace de confirmación ya fue usado o expiró. Intentá registrarte nuevamente.
            </p>
          </div>
          <Button onClick={() => setConfirmState("idle")} variant="outline" className="w-full rounded-xl">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // ── PANTALLA PRINCIPAL: formulario de login / registro ───────────────
  return (
    <div className="container py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      <div className="hidden md:block">
        <img src={logo} alt="DND" className="w-48 mb-6" />
        <h1 className="font-display text-4xl font-bold mb-4 text-foreground">Ingreso Estudiantil</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Accedé a tu plan de estudios, calendario académico y publicá permutas de comisión.
        </p>
        <div className="mt-8 p-4 rounded-xl bg-card border border-border shadow-paper">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Tu cuenta es <span className="text-foreground font-medium">opcional</span>. Las noticias y apuntes son de acceso libre.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant animate-hero-content">
        {signUpSuccess ? (
          // ── Cuenta creada: pedimos confirmar mail ──
          <div className="flex flex-col items-center text-center py-4 space-y-6">
            <div className="mx-auto h-20 w-20 bg-green-500/10 border-2 border-green-500/30 text-green-500 rounded-full flex items-center justify-center">
              <MailOpen className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                ¡Cuenta creada! Confirmá tu mail
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                Te enviamos un enlace de verificación a tu bandeja de entrada. Hacé clic en ese enlace para activar tu cuenta.
              </p>
            </div>
            <Button
              onClick={() => { setSignUpSuccess(false); setTab("signin"); }}
              variant="outline"
              className="w-full rounded-xl font-semibold border-border hover:bg-muted h-11"
            >
              Ya confirmé — Ir a Iniciar Sesión
            </Button>
          </div>
        ) : tab === "forgot" ? (
          // ── Solicitar Recuperación ──
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-foreground">Recuperar contraseña</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ingresá tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar instrucciones
              </Button>
            </form>
            <Button onClick={() => setTab("signin")} variant="ghost" className="w-full rounded-xl">
              Volver a Iniciar sesión
            </Button>
          </div>
        ) : tab === "forgot-success" ? (
          // ── Éxito al solicitar recuperación ──
          <div className="flex flex-col items-center text-center py-4 space-y-6">
            <div className="mx-auto h-20 w-20 bg-primary/10 border-2 border-primary/30 text-primary rounded-full flex items-center justify-center">
              <MailOpen className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                ¡Email enviado!
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                Te enviamos las instrucciones de restablecimiento de contraseña a tu correo. Revisá tu carpeta de entrada y spam.
              </p>
            </div>
            <Button
              onClick={() => setTab("signin")}
              variant="outline"
              className="w-full rounded-xl font-semibold border-border hover:bg-muted h-11"
            >
              Volver al Inicio
            </Button>
          </div>
        ) : tab === "update-password" ? (
          // ── Cambiar Contraseña ──
          <div className="space-y-6">
            <div className="space-y-2 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mb-2">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Nueva contraseña</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Ingresá tu nueva contraseña a continuación. Debe tener un mínimo de 6 caracteres.
              </p>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="new-pass">Nueva contraseña</Label>
                <Input id="new-pass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <div>
                <Label htmlFor="confirm-new-pass">Confirmar nueva contraseña</Label>
                <Input id="confirm-new-pass" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar contraseña
              </Button>
            </form>
          </div>
        ) : (
          <Tabs value={tab === "signin" || tab === "signup" ? tab : "signin"} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 mb-6 w-full">
              <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="si-pass">Contraseña</Label>
                  <Input id="si-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setTab("forgot")}
                      className="text-sm text-primary hover:text-primary/80 hover:underline font-bold transition-all"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ingresar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="su-name">Nombre completo</Label>
                  <Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80} />
                </div>
                <div>
                  <Label htmlFor="su-anio-ingreso">Año de ingreso a la facultad</Label>
                  <Input 
                    id="su-anio-ingreso" 
                    type="text" 
                    maxLength={4}
                    placeholder="Ej: 2023"
                    value={anioIngreso} 
                    onChange={(e) => setAnioIngreso(e.target.value.replace(/\D/g, "").slice(0, 4))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="su-pass">Contraseña</Label>
                  <Input id="su-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear cuenta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </div>

    </div>
  );
};

export default Auth;
