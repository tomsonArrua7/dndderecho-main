import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
};
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { AppProvider } from "@/context/AppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AlertCircle, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { DndMark } from "@/components/DndMark";
import Proximamente from "./pages/Proximamente";
import { useAuth } from "@/context/AuthContext";

import Index          from "./pages/Index";
import Auth           from "./pages/Auth";
import Noticias       from "./pages/Noticias";
import Apuntes        from "./pages/Apuntes";
import Permutero      from "./pages/Permutero";
import MiEspacio      from "./pages/MiEspacio";
import PlanEstudios   from "./pages/PlanEstudios";
import Calendario     from "./pages/Calendario";
import Recomendaciones from "./pages/Recomendaciones";
import NotFound       from "./pages/NotFound";
import AdminPanel     from "./pages/AdminPanel";
import Servicios      from "./pages/Servicios";
import PanelEscritor   from "./pages/PanelEscritor";
import AsistenteDND   from "./pages/AsistenteDND";
import Ingresantes   from "./pages/Ingresantes";
import QuienesSomos   from "./pages/QuienesSomos";
import Trivia         from "./pages/Trivia";

const queryClient = new QueryClient();

const SupabaseConfigWarning = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary-deep relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none select-none opacity-[0.03]">
        <DndMark size={520} />
      </div>

      <div className="max-w-xl w-full bg-card/60 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-elegant relative z-10 animate-hero-content">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-accent/20 border border-accent/40 text-accent animate-pulse">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-black text-center mb-4 text-white tracking-tight">
          Configuración Requerida
        </h1>
        <p className="text-white/70 text-center text-sm md:text-base mb-6 leading-relaxed">
          Para que la plataforma funcione en el servidor, necesitás vincular tu base de datos de <strong className="text-white">Supabase</strong>. Actualmente faltan las variables de entorno necesarias.
        </p>

        <div className="space-y-4 bg-background/50 border border-white/5 rounded-2xl p-5 mb-6 text-sm text-white/95">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 text-accent">1</div>
            <div>
              <p className="font-bold mb-0.5">Ingresá a tu panel de Netlify</p>
              <p className="text-xs text-white/60">Buscá este sitio web en tu lista de proyectos.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 text-accent">2</div>
            <div>
              <p className="font-bold mb-0.5">Configurá las variables de entorno</p>
              <p className="text-xs text-white/60">Ve a <strong>Site configuration</strong> &gt; <strong>Environment variables</strong> y agregá:</p>
              <div className="mt-2 space-y-1.5 font-mono text-xs bg-black/40 p-2.5 rounded border border-white/5 select-all">
                <p><span className="text-accent font-bold">VITE_SUPABASE_URL</span> = <span className="text-white/40">"tu_url_de_supabase"</span></p>
                <p><span className="text-accent font-bold">VITE_SUPABASE_ANON_KEY</span> = <span className="text-white/40">"tu_anon_key_de_supabase"</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 text-accent">3</div>
            <div>
              <p className="font-bold mb-0.5">Dispará un nuevo deploy</p>
              <p className="text-xs text-white/60">Bajo la pestaña <strong>Deploys</strong>, selecciona <strong>Trigger deploy</strong> &gt; <strong>Clear cache and deploy site</strong> para aplicar los cambios.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent/90 rounded-xl py-3 px-4 text-sm font-bold shadow-accent transition-all duration-200 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" /> Probar de nuevo
          </button>
          <a
            href="https://docs.netlify.com/configure-builds/environment-variables/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 active:scale-95"
          >
            Guía de Netlify <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, profile, loading } = useAuth();
  const [modoMantenimiento, setModoMantenimiento] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSettingsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("modo_mantenimiento")
          .eq("id", 1)
          .maybeSingle();

        if (data) {
          setModoMantenimiento(data.modo_mantenimiento);
        }
      } catch (err) {
        console.error("Error loading app settings:", err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();

    // Subscribe to realtime updates on settings change
    const channel = supabase
      .channel("app_settings_realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "app_settings", filter: "id=eq.1" },
        (payload) => {
          if (payload.new && typeof payload.new.modo_mantenimiento !== "undefined") {
            setModoMantenimiento(payload.new.modo_mantenimiento);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary-deep relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <DndMark size={80} className="animate-pulse" />
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === "admin";

  // Si el modo mantenimiento está activado y el usuario NO es admin, se restringe la navegación.
  if (modoMantenimiento && !isAdmin) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/recovery" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/ingresantes" element={<Ingresantes />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
        </Route>
        <Route path="*" element={<Proximamente />} />
      </Routes>
    );
  }

  // Si no está en mantenimiento o es admin, acceso completo.
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                element={<Index />} />
        <Route path="/auth"            element={<Auth />} />
        <Route path="/auth/recovery"   element={<Auth />} />
        <Route path="/noticias"        element={<Noticias />} />
        <Route path="/apuntes"         element={<Apuntes />} />
        <Route path="/permutero"       element={<Permutero />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/servicios"       element={<Servicios />} />
        <Route path="/asistente"       element={<AsistenteDND />} />
        <Route path="/ingresantes"     element={<Ingresantes />} />
        <Route path="/quienes-somos"   element={<QuienesSomos />} />
        <Route path="/trivia"          element={<ProtectedRoute><Trivia /></ProtectedRoute>} />

        {/* Ruta legacy /dashboard → redirige a /mi-espacio */}
        <Route path="/dashboard"       element={<ProtectedRoute><MiEspacio /></ProtectedRoute>} />
        <Route path="/mi-espacio"      element={<ProtectedRoute><MiEspacio /></ProtectedRoute>} />
        <Route path="/plan"            element={<ProtectedRoute><PlanEstudios /></ProtectedRoute>} />
        <Route path="/calendario"      element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
        <Route path="/admin"           element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/panel-escritor"  element={<ProtectedRoute><PanelEscritor /></ProtectedRoute>} />
        <Route path="*"               element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  if (!isSupabaseConfigured) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <SupabaseConfigWarning />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <AppProvider>
                <AppContent />
              </AppProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
