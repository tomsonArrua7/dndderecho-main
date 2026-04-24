import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookMarked, CalendarDays, GraduationCap, Repeat2, ShieldCheck, Sparkles, Star } from "lucide-react";
import facultad from "@/assets/rectorado-unlp.jpg";
import { DndMark } from "@/components/DndMark";
import { cn } from "@/lib/utils";

const features = [
  { icon: Repeat2,      title: "Permutero de Comisiones", desc: "Encontrá tu match para cambiar de comisión en segundos.", to: "/permutero",       accent: true  },
  { icon: GraduationCap,title: "Plan de Estudios",        desc: "Marcá tus materias aprobadas y seguí tu progreso.",   to: "/plan"             },
  { icon: CalendarDays, title: "Calendario Académico",    desc: "Anotá parciales, finales y entregas en tu agenda.",   to: "/calendario"       },
  { icon: BookMarked,   title: "Apuntes y Noticias",      desc: "Material de cátedra y novedades de la facultad.",     to: "/apuntes"          },
  { icon: Star,         title: "Recomendaciones",         desc: "Opiniones de estudiantes sobre cátedras y docentes.", to: "/recomendaciones"  },
];

const Index = () => {
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
            <Sparkles className="h-3.5 w-3.5" />
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button asChild size="xl" className="bg-accent text-white hover:bg-accent/90 shadow-accent transition-all hover:scale-105 active:scale-95 text-lg font-bold">
              <Link to="/permutero">
                Ir al Permutero <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/5 text-white border-white/20 hover:bg-white/10 backdrop-blur-sm text-lg">
              <Link to="/auth">Ingreso Estudiantil</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURES SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative container py-32 -mt-10 z-20">
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
                  "group relative p-7 rounded-2xl border transition-all duration-500",
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
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-foreground tracking-tight">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{f.desc}</p>
                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-primary group-hover:text-accent transition-colors">
                  Explorar <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          BANNER CTA — Permutero
          ════════════════════════════════════════════════════════════ */}
      <section className="container pb-32">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-deep to-black p-10 md:p-24 shadow-elegant border border-white/5">

          {/* Glow rojo */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 blur-[120px] rounded-full" />

          {/* Imagen de fondo sutil */}
          <div
            className="absolute inset-0 opacity-[0.04] grayscale mix-blend-overlay"
            style={{ backgroundImage: `url(${facultad})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />

          {/* DndMark decorativa — esquina inferior derecha del banner */}
          <div
            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none"
            aria-hidden="true"
          >
            <DndMark size={320} style={{ opacity: 0.08 }} />
          </div>

          <div className="relative max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              {/* D pequeña en el badge del CTA */}
              <DndMark size={36} />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white font-black text-xs uppercase tracking-[0.2em] shadow-accent">
                <ShieldCheck className="h-4 w-4" /> Innovación Estudiantil
              </div>
            </div>

            <h3 className="font-display text-4xl md:text-7xl font-black mb-8 text-white leading-tight tracking-tighter">
              ¿Buscás cambiar<br/> de comisión?
            </h3>
            <p className="text-white/70 text-xl md:text-2xl mb-10 leading-relaxed font-medium">
              Nuestro algoritmo conecta estudiantes para que el intercambio sea automático.{" "}
              <span className="text-white font-bold underline decoration-accent underline-offset-8">Sin vueltas.</span>
            </p>
            <Button asChild size="xl" className="bg-white text-primary hover:bg-white/90 shadow-elegant text-lg font-bold rounded-full px-10">
              <Link to="/permutero">Comenzar ahora <Repeat2 className="ml-3 h-6 w-6" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
