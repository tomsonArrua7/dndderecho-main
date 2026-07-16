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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-mask">
        {/* Fondo fotográfico con zoom suave */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={facultad}
            alt="Facultad de Derecho UNLP"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-primary-deep/70 mix-blend-multiply" />
        </motion.div>

        {/* Content */}
        <div className="container relative z-10 pt-20 pb-32 flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <DndMark size={140} className="drop-shadow-[0_0_40px_rgba(220,38,38,0.4)]" />
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-20 text-white tracking-tight max-w-2xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block text-xs uppercase tracking-[0.4em] text-accent font-black mb-6"
            >
              DND Jursoc · Facultad de Derecho
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block"
            >
              Defendamos
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block text-white/90"
            >
              Nuestro Derecho
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-16 font-medium leading-relaxed tracking-tight"
          >
            La plataforma estudiantil definitiva de DND Jursoc para la comunidad de la Facultad de Ciencias Jurídicas y Sociales (UNLP).
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button asChild size="xl" className="h-16 px-10 bg-accent text-white hover:bg-accent/90 shadow-[0_15px_30px_rgba(220,38,38,0.25)] rounded-2xl text-lg font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
              <Link to="/permutero">
                Comenzar <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="h-16 px-10 bg-white/5 text-white border-white/10 hover:bg-white/10 backdrop-blur-md rounded-2xl text-lg font-bold">
              <Link to="/auth">Ingreso Alumnos</Link>
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
