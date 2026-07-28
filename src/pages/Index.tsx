import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import rectoradoNueva from "@/assets/rectorado-nueva.png";
import logoDndNuevo from "@/assets/logo-dnd-nuevo.png";
import logoDndNuevoFondoBlanco from "@/assets/logo-dnd-nuevo-fondo-blanco.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InstagramFeed } from "@/components/InstagramFeed";
import { HeroActions } from "@/components/HeroActions";
import { motion } from "framer-motion";
import { YouTubeSection } from "@/components/YouTubeSection";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Index = () => {
  const [realizadasCount, setRealizadasCount] = useState(0);
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const heroLogoSrc = isLight ? logoDndNuevoFondoBlanco : logoDndNuevo;

  useEffect(() => {
    supabase.from("permutas").select("*", { count: "exact", head: true }).eq("status", "realizada").then(({ count }) => {
      if (count !== null) setRealizadasCount(count);
    });
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden w-full max-w-full">
        {/* Fondo fotográfico con zoom suave y capas duotono */}
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden w-full max-w-full"
        >
          <img
            src={rectoradoNueva}
            alt="Facultad de Derecho UNLP - Rectorado"
            className={cn(
              "w-full h-full object-cover object-center transition-opacity duration-500",
              isLight ? "opacity-35" : "opacity-90"
            )}
          />
          {/* Capa Duotono: Ajustado según modo día y modo noche (Centro Despejado para Fotografía) */}
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-200/75 via-white/20 to-red-200/75" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-background" />
              <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-sky-400/20 rounded-full blur-[130px] pointer-events-none" />
              <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-red-400/20 rounded-full blur-[130px] pointer-events-none" />
            </>
          ) : (
            <>
              {/* Gradientes Duotono Simétricos: Azul Izquierda / Rojo Derecha (Despejados en el centro) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#020726]/95 via-[#0A1D66]/65 via-28% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#2E030B]/95 via-[#8A0D20]/65 via-28% to-transparent" />

              {/* Focos Ambientales laterales ajustados a los extremos */}
              <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#0D2B8A]/35 rounded-full blur-[160px] pointer-events-none" />
              <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#B8122B]/35 rounded-full blur-[160px] pointer-events-none" />

              {/* Gradiente Vertical Inferior sutil para mantener clara la foto en el centro */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/50 via-18% to-transparent" />

              {/* Sombra Superior sutil para integrar la Navbar */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#060A18]/80 to-transparent" />
            </>
          )}
        </motion.div>

        {/* Content */}
        <div className="container relative z-10 pt-16 pb-24 md:pt-20 md:pb-28 flex flex-col items-center text-center">

          {/* Logo Principal Centrado */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-10"
          >
            <img 
              src={heroLogoSrc} 
              alt="Dnd." 
              className={cn(
                "w-60 sm:w-72 md:w-96 h-auto max-w-full object-contain transition-all duration-300",
                isLight ? "drop-shadow-[0_10px_25px_rgba(0,0,0,0.12)]" : "drop-shadow-[0_12px_35px_rgba(220,38,38,0.45)]"
              )}
            />
          </motion.div>

          {/* Párrafo Descriptivo */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={cn(
              "text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed tracking-wide px-4",
              isLight ? "text-slate-800 font-semibold" : "text-white/90"
            )}
          >
            La plataforma estudiantil de{" "}
            <span className="text-[#DC2626] font-extrabold drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]">
              DND Jursoc
            </span>{" "}
            para la comunidad de la Facultad de Ciencias Jurídicas y Sociales de la UNLP.
          </motion.p>

          {/* Botón Único: COMENZAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <Button
              asChild
              size="xl"
              className="h-14 md:h-16 px-12 md:px-16 bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-[0_12px_30px_rgba(220,38,38,0.4)] rounded-2xl text-base md:text-lg font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 border border-red-500/30"
            >
              <Link to="/auth">
                COMENZAR
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HERO ACTIONS (Ingresantes + Permutas) — STAGGERED
          ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <HeroActions />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          INSTAGRAM — SCROLL REVEAL
          ════════════════════════════════════════════════════════════ */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="container py-24"
      >
        <div className="p-1 rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent">
          <div className="bg-[#0A0E1A]/40 backdrop-blur-3xl rounded-[2.9rem] p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <InstagramFeed />
          </div>
        </div>
      </motion.div>

      {/* YouTube Section */}
      <YouTubeSection />

    </div>
  );
};

export default Index;
