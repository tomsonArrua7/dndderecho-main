import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookMarked, CalendarDays, GraduationCap, Repeat2, ShieldCheck, Sparkles, Star } from "lucide-react";
import facultad from "@/assets/facultad_unlp_optimized.png";
import { DndMark } from "@/components/DndMark";
import { cn } from "@/lib/utils";
import { UpcomingDates } from "@/components/UpcomingDates";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InstagramFeed } from "@/components/InstagramFeed";
import { HeroActions } from "@/components/HeroActions";
import { AboutUs } from "@/components/AboutUs";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  { icon: Repeat2,      title: "Permutero de Comisiones", desc: "Encontrá tu match para cambiar de comisión en segundos.", to: "/permutero",       accent: true  },
  { icon: GraduationCap,title: "Plan de Estudios",        desc: "Marcá tus materias aprobadas y seguí tu progreso.",   to: "/plan"             },
  { icon: CalendarDays, title: "Calendario Académico",    desc: "Anotá parciales, finales y entregas en tu agenda.",   to: "/calendario"       },
  { icon: BookMarked,   title: "Apuntes y Noticias",      desc: "Material de cátedra y novedades de la facultad.",     to: "/apuntes"          },
  { icon: Star,         title: "Recomendaciones",         desc: "Opiniones de estudiantes sobre cátedras y docentes.", to: "/recomendaciones"  },
];

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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block"
            >
              Defendamos
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
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
            La experiencia académica definitiva para la comunidad de Ciencias Jurídicas y Sociales de la UNLP.
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

      {/* ════════════════════════════════════════════════════════════
          FEATURES SECTION — STAGGERED GRID
          ════════════════════════════════════════════════════════════ */}
      <section className="container py-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#0A0E1A]/60 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-8 md:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-4xl mb-20">
            <div className="text-[11px] uppercase tracking-[0.4em] text-accent font-black mb-6">
              Servicios Digitales
            </div>
            <h2 className="font-display text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter leading-[0.9]">
              Potenciamos tu <br/>
              <span className="text-white/20">Trayectoria.</span>
            </h2>
            <p className="text-white/40 text-xl max-w-2xl leading-relaxed font-medium tracking-tight">
              Diseñamos herramientas específicas para resolver los desafíos cotidianos de cada estudiante de la UNLP.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={f.to}
                  className={cn(
                    "group relative h-full flex flex-col p-8 rounded-[2rem] border transition-all duration-500",
                    f.accent
                      ? "bg-accent/5 border-accent/20 hover:bg-accent/10 hover:border-accent/40"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "inline-flex p-4 rounded-2xl mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    f.accent ? "bg-accent text-white shadow-[0_10px_20px_rgba(220,38,38,0.3)]" : "bg-white/5 text-white/60 border border-white/10"
                  )}>
                    <f.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3 text-white tracking-tight">{f.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed mb-8 font-medium">{f.desc}</p>
                  <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-accent transition-colors">
                    Explorar <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CALENDARIO / FECHAS — DEPTH EFFECT
          ════════════════════════════════════════════════════════════ */}
      <section className="container py-32">
        <div className="grid lg:grid-cols-[450px_1fr] gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">
              <CalendarDays className="h-4 w-4 text-accent" /> Agenda Inteligente
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter leading-[0.9]">
              Tu carrera, <br/>
              <span className="text-white/20 italic font-medium">Sincronizada.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10 font-medium">
              Gestionamos tus fechas críticas para que nunca pierdas una inscripción ni una mesa de examen. Tecnología al servicio de tu organización.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0E1A]/40 border border-white/5 rounded-[3rem] p-6 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <UpcomingDates />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ABOUT US
          ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        <AboutUs />
      </motion.div>
    </div>
  );
};

export default Index;
