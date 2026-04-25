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
    <div className="flex flex-col min-h-screen">

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden hero-mask bg-primary-deep">

        {/* Fondo fotográfico */}
        <div className="absolute inset-0 -z-10">
          <img
            src={facultad}
            alt="Edificio histórico de la Facultad de Derecho UNLP"
            className="w-full h-full object-cover object-center scale-105"
            width={1920} height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-primary-deep/65 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        {/* DndMark gigante como watermark decorativo — esquina derecha */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none select-none"
          aria-hidden="true"
        >
          <DndMark size={520} style={{ opacity: 0.07 }} />
        </div>

        {/* Contenido del hero */}
        <div className="container py-32 md:py-48 max-w-5xl text-center z-10 animate-hero-content relative">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-md border border-accent/40 text-xs font-bold mb-8 text-accent-foreground tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
            Plataforma Estudiantil Oficial
          </div>

          {/* La "D" icónica centrada ANTES del título */}
          <div className="flex justify-center mb-6">
            <DndMark size={80} />
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-black leading-[0.95] mb-8 text-white tracking-tighter">
            Defendamos<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">
              Nuestro Derecho
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/75 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            La herramienta académica definitiva para estudiantes de la Facultad de Ciencias Jurídicas y Sociales de la UNLP.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
            <Button asChild size="xl" className="bg-accent text-white hover:bg-accent/90 shadow-accent transition-all hover:scale-105 active:scale-95 text-lg font-bold btn-app">
              <Link to="/permutero">
                Ir al Permutero <ArrowRight className="ml-2 h-6 w-6" strokeWidth={1.5} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/5 text-white border-white/20 hover:bg-white/10 backdrop-blur-sm text-lg btn-app">
              <Link to="/auth">Ingreso Estudiantil</Link>
            </Button>
          </div>

          {/* Ghost Button: Conocé nuestra historia */}
          <div className="flex justify-center">
            <Link 
              to="/#quienes-somos" 
              className="group relative inline-flex items-center text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Conocé nuestra historia 
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          HERO ACTIONS (Ingresantes + Permutas)
          ════════════════════════════════════════════════════════════ */}
      <HeroActions />

      {/* ════════════════════════════════════════════════════════════
          FEATURES SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative container py-16 z-20">
        <div className="bg-card/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-16 shadow-elegant">

          {/* Header sección — con D mark pequeña */}
          <div className="max-w-3xl mb-16 flex items-start gap-5">
            <DndMark size={56} className="shrink-0 mt-1 hidden md:block" />
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-accent font-black mb-3">
                Servicios Académicos
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-5 text-foreground tracking-tight">
                Todo lo que necesitás<br/> para tu cursada
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Herramientas diseñadas para resolver las necesidades reales de los estudiantes, desde permutas hasta el seguimiento del plan de estudios.
              </p>
            </div>
          </div>

          {/* Grid de features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {features.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className={cn(
                  "group relative p-7 rounded-2xl border transition-all duration-500 btn-app",
                  f.accent
                    ? "bg-accent/5 border-accent/20 hover:bg-accent/10 hover:border-accent/40"
                    : "bg-background/40 border-white/5 hover:bg-background/60 hover:border-white/15"
                )}
              >
                {f.accent && (
                  <div className="absolute -top-3 -right-2 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest shadow-accent animate-pulse">
                    Popular
                  </div>
                )}
                <div className={cn(
                  "inline-flex p-3.5 rounded-xl mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                  f.accent ? "bg-accent text-white shadow-accent" : "bg-primary/15 text-white border border-white/10"
                )}>
                  <f.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-foreground tracking-tight">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{f.desc}</p>
                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-primary group-hover:text-accent transition-colors">
                  Explorar <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CALENDARIO / FECHAS SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="container pb-24">
        <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">
              <CalendarDays className="h-3 w-3" /> Agenda Estudiantil
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight leading-tight">
              Tu Carrera, <br/>
              <span className="text-white/40">Día a Día.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              No te pierdas ninguna inscripción ni mesa de examen. Guardá las fechas críticas directo en tu calendario o descargalas como archivo <code>.ics</code>.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4 md:p-8">
            <UpcomingDates />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ABOUT US — Quiénes Somos
          ════════════════════════════════════════════════════════════ */}
      <AboutUs />

      {/* ════════════════════════════════════════════════════════════
          INSTAGRAM — Comunidad y Novedades
          ════════════════════════════════════════════════════════════ */}
      <section className="container py-24">
        <InstagramFeed />
      </section>
    </div>
  );
};

export default Index;
