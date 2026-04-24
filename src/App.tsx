import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/"                element={<Index />} />
                <Route path="/auth"            element={<Auth />} />
                <Route path="/noticias"        element={<Noticias />} />
                <Route path="/apuntes"         element={<Apuntes />} />
                <Route path="/permutero"       element={<Permutero />} />
                <Route path="/recomendaciones" element={<Recomendaciones />} />

                {/* Ruta legacy /dashboard → redirige a /mi-espacio */}
                <Route path="/dashboard"       element={<ProtectedRoute><MiEspacio /></ProtectedRoute>} />
                <Route path="/mi-espacio"      element={<ProtectedRoute><MiEspacio /></ProtectedRoute>} />
                <Route path="/plan"            element={<ProtectedRoute><PlanEstudios /></ProtectedRoute>} />
                <Route path="/calendario"      element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
                <Route path="*"               element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
