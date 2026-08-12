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
import { Turnstile } from "@/components/Turnstile";

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

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

// Detecta si la URL actual tiene indicadores de flujo de recuperación de contraseña
// Detecta si la URL actual contiene un error en hash o search (por ejemplo otp_expired)
function getUrlError(): string | null {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  
  const errorDesc = params.get("error_description") || hashParams.get("error_description");
  const errorCode = params.get("error_code") || hashParams.get("error_code");
  const error = params.get("error") || hashParams.get("error");

  if (errorCode === "otp_expired" || (errorDesc && errorDesc.toLowerCase().includes("expired"))) {
    return "El enlace de recuperación ha expirado o ya fue utilizado. Por favor, solicitá un nuevo enlace.";
  }

  if (error || errorCode || errorDesc) {
    return errorDesc ? decodeURIComponent(errorDesc.replace(/\+/g, " ")) : "El enlace de recuperación es inválido o ha expirado.";
  }

  return null;
}

// Detecta si la URL actual tiene indicadores de flujo de recuperación de contraseña válido con token/código/hash
function isRecoveryUrl(): boolean {
  if (getUrlError()) return false;
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  
  return !!(
    params.get("token") || 
    params.get("token_hash") || 
    params.get("code") || 
    (params.get("type") === "recovery" && (params.get("token") || params.get("code"))) || 
    (hash.includes("type=recovery") && (hash.includes("access_token") || hash.includes("refresh_token")))
  );
}

// Detecta si la URL actual viene de un link de confirmación de Supabase
function getConfirmationCode(): { type: "pkce"; code: string } | { type: "hash" } | { type: "token_hash"; token: string } | null {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const hash = window.location.hash;
  const token = params.get("token");
  if (token) return { type: "token_hash", token };
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
    recoveryActive ? "update-password" : (window.location.pathname === "/auth/recovery" ? "forgot" : "signin")
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [anioIngreso, setAnioIngreso] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Estados de captcha
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const isRecoveryFlow = useRef(recoveryActive);
  const hasExchanged = useRef(false);

  // Resetear captcha cuando cambie de pestaña
  useEffect(() => {
    setCaptchaToken(null);
    setCaptchaKey(prev => prev + 1);
  }, [tab]);

  const [urlError, setUrlError] = useState<string | null>(() => getUrlError());

  // "idle" | "loading" | "confirmed" | "error" | "expired"
  const [confirmState, setConfirmState] = useState<"idle" | "loading" | "confirmed" | "error" | "expired">(
    () => (getUrlError() ? "expired" : (getConfirmationCode() ? "loading" : "idle"))
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

  // Intercambia el código PKCE (o valida el hash / token) por una sesión real
  useEffect(() => {
    const errMsg = getUrlError();
    if (errMsg) {
      setUrlError(errMsg);
      setConfirmState("expired");
      return;
    }

    const info = getConfirmationCode();
    if (!info) return;

    if (hasExchanged.current) return;
    hasExchanged.current = true;

    // Guardamos la información del hash y search ANTES de limpiar la URL
    const rawHash = window.location.hash;
    const rawSearch = window.location.search;

    const isRecovery = 
      window.location.pathname === "/auth/recovery" ||
      rawHash.includes("type=recovery") ||
      rawSearch.includes("type=recovery");

    // Limpiamos la URL del navegador manteniendo la ruta /auth/recovery
    window.history.replaceState(null, "", "/auth/recovery");

    if (isRecovery) {
      isRecoveryFlow.current = true;
      setConfirmState("idle");
      setTab("update-password");
      if (info.type === "token_hash") {
        setRecoveryToken(info.token);
      }
      if (info.type === "pkce") {
        supabase.auth.exchangeCodeForSession(info.code).catch((err) => console.error("PKCE exchange error:", err));
      }
      return;
    }

    if (info.type === "hash") {
      setConfirmState("confirmed");
      return;
    }

    if (info.type === "token_hash") {
      // Guardamos el token en el estado para verificarlo recién cuando envíe el formulario
      setRecoveryToken(info.token);
      isRecoveryFlow.current = true;
      setConfirmState("idle");
      setTab("update-password");
      return;
    }

    // Flujo PKCE para confirmación de email
    supabase.auth.exchangeCodeForSession(info.code).then(({ error }) => {
      if (error) {
        console.error("PKCE exchange error:", error);
        setConfirmState("error");
      } else {
        setConfirmState("confirmed");
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

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      toast.error("Por favor, completá el captcha.");
      return;
    }

    setSubmitting(true);
    const { error } = await signIn(email, password, captchaToken || undefined);
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message);
      setCaptchaToken(null);
      setCaptchaKey(prev => prev + 1);
      return;
    }
    toast.success("¡Bienvenido/a!");
    navigate(from, { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ email, password, fullName, anioIngreso });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      toast.error("Por favor, completá el captcha.");
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email, password, fullName, parseInt(anioIngreso, 10), captchaToken || undefined);
    setSubmitting(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("over_email_send_rate_limit")) {
        toast.error("Límite temporal de correos alcanzado. Te sugerimos ingresar directamente con 'Continuar con Google' que es instantáneo.", { duration: 6000 });
      } else if (msg.includes("already")) {
        toast.error("Ese email ya está registrado. Si ya tenés cuenta, iniciá sesión.");
      } else {
        toast.error(error.message);
      }
      setCaptchaToken(null);
      setCaptchaKey(prev => prev + 1);
      return;
    }
    setSignUpSuccess(true);
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      toast.error(error.message);
      setSubmitting(false);
    }
  };


  const handleGoToSignIn = async () => {
    await signOut();
    setConfirmState("idle");
    setTab("signin");
    navigate("/auth");
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

    // 1. Si tenemos el token de recuperación, iniciamos sesión primero verificando el OTP
    if (recoveryToken) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: recoveryToken,
        type: "recovery"
      });
      if (verifyError) {
        setSubmitting(false);
        console.error("Token verification error:", verifyError);
        toast.error("El enlace de recuperación es inválido o ha expirado. Solicitá uno nuevo.");
        setUrlError("El enlace de recuperación es inválido o ha expirado.");
        setConfirmState("expired");
        return;
      }
    }

    // 2. Verificar que exista sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSubmitting(false);
      toast.error("No hay una sesión activa de recuperación. Por favor solicitá un enlace nuevo.");
      setUrlError("El enlace de recuperación ha expirado o ya fue utilizado.");
      setConfirmState("expired");
      return;
    }

    // 3. Ahora que el usuario tiene sesión activa, actualizamos su contraseña
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setSubmitting(false);
    
    if (updateError) {
      console.error("Update password error:", updateError);
      if (updateError.message.includes("Auth session missing") || (updateError as any).status === 403) {
        toast.error("El enlace de recuperación expiró. Por favor solicitá un nuevo enlace.");
        setUrlError("El enlace de recuperación ha expirado o ya fue utilizado.");
        setConfirmState("expired");
        return;
      }
      toast.error(updateError.message);
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

  // ── PANTALLA: enlace de recuperación expirado / no válido ──────────────
  if (confirmState === "expired") {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-amber-500/30 rounded-3xl p-10 shadow-elegant text-center space-y-6 animate-hero-content">
          <div className="mx-auto h-20 w-20 bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center">
            <KeyRound className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-2xl font-bold text-foreground">Enlace expirado o no válido</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {urlError || "El enlace de recuperación ha vencido o ya fue utilizado. Por razones de seguridad, solicitá un nuevo correo."}
            </p>
          </div>
          <Button
            onClick={() => { setConfirmState("idle"); setTab("forgot"); navigate("/auth"); }}
            size="lg"
            className="w-full rounded-xl font-bold text-base h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95"
          >
            Solicitar nuevo enlace de recuperación
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
        <div className="p-3 bg-[#0D1224] dark:bg-transparent rounded-2xl w-fit mb-6 shadow-md border border-[#1E293B] dark:border-transparent">
          <img src={logo} alt="DND" className="w-48" />
        </div>
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
                      className="text-sm text-primary dark:text-slate-200 hover:text-primary/80 dark:hover:text-white hover:underline font-bold transition-all"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                {TURNSTILE_SITE_KEY && (
                  <Turnstile
                    key={`signin-${captchaKey}`}
                    siteKey={TURNSTILE_SITE_KEY}
                    onVerify={setCaptchaToken}
                  />
                )}
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ingresar
                </Button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200/10"></div>
                  <span className="flex-shrink mx-4 text-slate-400/60 text-xs uppercase font-bold tracking-wider">O continuar con</span>
                  <div className="flex-grow border-t border-slate-200/10"></div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2 h-12 rounded-xl transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
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
                {TURNSTILE_SITE_KEY && (
                  <Turnstile
                    key={`signup-${captchaKey}`}
                    siteKey={TURNSTILE_SITE_KEY}
                    onVerify={setCaptchaToken}
                  />
                )}
                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear cuenta
                </Button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200/10"></div>
                  <span className="flex-shrink mx-4 text-slate-400/60 text-xs uppercase font-bold tracking-wider">O continuar con</span>
                  <div className="flex-grow border-t border-slate-200/10"></div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2 h-12 rounded-xl transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
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
