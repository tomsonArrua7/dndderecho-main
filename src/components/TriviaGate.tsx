import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { INICIO_TEMPORADA_1 } from "@/data/triviaData";
import TriviaCuentaRegresiva from "@/pages/TriviaCuentaRegresiva";
import Trivia from "@/pages/Trivia";

/**
 * Decide qué se ve en /trivia según el momento:
 *
 *   antes de la apertura  -> cuenta regresiva, pública (es el anuncio)
 *   ya abierta, sin sesión -> a /auth, y vuelve acá al entrar
 *   ya abierta, con sesión -> el juego
 *
 * El tick por segundo hace que la transición ocurra sola: quien deje la pestaña
 * abierta con el contador en cero pasa al juego sin recargar.
 */
export const TriviaGate = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [abierta, setAbierta] = useState(() => Date.now() >= INICIO_TEMPORADA_1);

  useEffect(() => {
    if (abierta) return;
    const timer = setInterval(() => {
      if (Date.now() >= INICIO_TEMPORADA_1) setAbierta(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [abierta]);

  if (!abierta) return <TriviaCuentaRegresiva />;

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />;

  return <Trivia />;
};
