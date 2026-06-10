import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Scale, MailOpen, CheckCircle } from "lucide-react";
import logo from "@/assets/dnd-logo.png";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});
const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Ingresá tu nombre").max(80),
});

const Auth = () => {
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [mailConfirmed, setMailConfirmed] = useState(() => {
    const hash = window.location.hash;
    return hash.includes("access_token") && (hash.includes("type=signup") || hash.includes("type=invite"));
  });

  useEffect(() => {
    if (mailConfirmed) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [mailConfirmed]);

  if (!authLoading && user && !mailConfirmed) return <Navigate to={from} replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) { toast.error(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message); return; }
    toast.success("¡Bienvenido/a!");
    navigate(from, { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ email, password, fullName });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { error } = await signUp(email, password, fullName);
    setSubmitting(false);
    if (error) {
      if (error.message.includes("already")) toast.error("Ese email ya está registrado");
      else toast.error(error.message);
      return;
    }
    toast.success("Cuenta creada. ¡Ingresá!");
    setSignUpSuccess(true);
  };

  const handleGoToSignIn = async () => {
    await signOut();
    setMailConfirmed(false);
    setTab("signin");
  };

  if (mailConfirmed) {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-elegant text-center space-y-6 animate-hero-content">
          <div className="mx-auto h-16 w-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-black text-foreground">¡Mail confirmado!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tu cuenta ya se encuentra activa. Ya podés ingresar a la plataforma.
            </p>
          </div>
          <Button 
            onClick={handleGoToSignIn} 
            size="lg" 
            className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95"
          >
            Ir al ingreso de alumnos
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col items-center text-center py-6 space-y-6 animate-fade-in">
            <div className="mx-auto h-16 w-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center animate-bounce">
              <MailOpen className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-foreground">¡Cuenta creada con éxito!</h2>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                Por favor, confirma tu mail para ingresar. Te enviamos un enlace de verificación a tu bandeja de entrada.
              </p>
            </div>
            <Button 
              onClick={() => { setSignUpSuccess(false); setTab("signin"); }} 
              variant="outline" 
              className="w-full rounded-xl font-semibold border-border hover:bg-muted"
            >
              Ir al Iniciar Sesión
            </Button>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
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
