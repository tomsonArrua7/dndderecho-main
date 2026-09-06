import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swords, Trophy, Medal, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { INICIO_TEMPORADA_1 } from "@/data/triviaData";
import { getRamaDeTemporada } from "@/data/ramasTrivia";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function desglosarRestante(ms: number) {
  const total = Math.max(0, ms);
  return {
    dias: Math.floor(total / 86400000),
    horas: Math.floor((total / 3600000) % 24),
    minutos: Math.floor((total / 60000) % 60),
    segundos: Math.floor((total / 1000) % 60)
  };
}

const Casillero = ({ valor, etiqueta }: { valor: number; etiqueta: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-xl">
      <span className="font-mono font-black text-2xl sm:text-3xl text-white tabular-nums">
        {String(valor).padStart(2, "0")}
      </span>
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{etiqueta}</span>
  </div>
);

/**
 * Pantalla pública que se muestra en /trivia hasta que arranca la temporada 1.
 * No pide sesión a propósito: es el anuncio, y quien todavía no tiene cuenta
 * debería poder verlo y registrarse antes de que abra.
 */
const TriviaCuentaRegresiva = () => {
  const { user } = useAuth();
  const [restante, setRestante] = useState(() => INICIO_TEMPORADA_1 - Date.now());

  useEffect(() => {
    const timer = setInterval(() => setRestante(INICIO_TEMPORADA_1 - Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { dias, horas, minutos, segundos } = desglosarRestante(restante);
  const ramaInicial = getRamaDeTemporada(1);

  const horaApertura = new Date(INICIO_TEMPORADA_1).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires"
  });

  return (
    <div className="min-h-screen bg-[#050B14] text-white py-10 md:py-16 px-4 relative [overflow-x:clip]">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative z-10 space-y-8"
      >
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-black text-[10px] uppercase tracking-[0.2em] border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Actualización nueva
          </span>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Trivia Jurídica DND
          </h1>

          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Duelos 1v1 contra otros estudiantes de la facultad, con puntos de rango, doce rangos
            jurídicos para escalar y temporadas que reparten medallas. Abre hoy a las {horaApertura}.
          </p>
        </div>

        {/* CONTADOR */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Casillero valor={dias} etiqueta="Días" />
          <Casillero valor={horas} etiqueta="Horas" />
          <Casillero valor={minutos} etiqueta="Min" />
          <Casillero valor={segundos} etiqueta="Seg" />
        </div>

        {/* QUÉ VIENE */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <Swords className="w-5 h-5 text-red-400" />
            <h3 className="font-black text-sm">Duelos 1v1</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Cinco preguntas contra un rival, con las mismas para los dos. Se gana o se pierde rango.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-sm">12 rangos</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              De Ingresante a Juez de la Corte, con su medalla y el ranking público de la facultad.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <Medal className="w-5 h-5 text-sky-400" />
            <h3 className="font-black text-sm">Temporadas</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Cierran los domingos y el podio se lleva oro, plata y bronce para siempre.
            </p>
          </div>
        </div>

        {/* RAMA DE ARRANQUE */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
              La Temporada 1 se juega con
            </span>
            <span className="font-black text-sm block">{ramaInicial.nombre}</span>
            <span className="text-xs text-white/60">{ramaInicial.detalle}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3">
          {user ? (
            <p className="text-sm text-white/60">
              Ya tenés tu cuenta lista. Cuando el contador llegue a cero, esta misma página se
              convierte en el juego.
            </p>
          ) : (
            <>
              <Button
                asChild
                size="lg"
                className="h-12 px-8 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_25px_rgba(220,38,38,0.35)]"
              >
                <Link to="/auth" className="flex items-center gap-2">
                  Crear mi cuenta <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-white/50">
                Necesitás una cuenta para jugar. Creála ahora y entrás apenas abra.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TriviaCuentaRegresiva;
