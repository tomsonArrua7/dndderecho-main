import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import facultad from "@/assets/facultad_unlp_optimized.png";
import { DndMark } from "@/components/DndMark";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InstagramFeed } from "@/components/InstagramFeed";
import { HeroActions } from "@/components/HeroActions";
import { motion } from "framer-motion";
import { YouTubeSection } from "@/components/YouTubeSection";

const Index = () => {
  const [realizadasCount, setRealizadasCount] = useState(0);
  const location = useLocation();

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
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Fondo fotográfico con zoom suave y capas duotono */}
        <motion.div 
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <img
            src="/RectoradoNueva.png"
            alt="Facultad de Derecho UNLP - Rectorado"
            className="w-full h-full object-cover object-center"
          />
          {/* Capa Duotono Azul Marino (izquierda) a Rojo Carmesí (derecha) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040817]/95 via-[#0D122B]/80 to-[#5C0A19]/90" />
          {/* Capa de sombra vertical para suavizar bordes */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0A0E1A]" />
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
              src="/LogoDNDnuevo.png" 
              alt="Dnd." 
              className="w-60 sm:w-72 md:w-96 h-auto max-w-full object-contain drop-shadow-[0_12px_35px_rgba(220,38,38,0.35)]" 
            />
          </motion.div>

          {/* Párrafo Descriptivo */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed tracking-wide px-4"
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
