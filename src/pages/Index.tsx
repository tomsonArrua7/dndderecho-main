import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookMarked, CalendarDays, GraduationCap, Repeat2, ShieldCheck, Sparkles } from "lucide-react";
import facultad from "@/assets/rectorado-unlp.jpg";

const features = [
  { icon: Repeat2, title: "Permutero de Comisiones", desc: "Encontrá tu match para cambiar de comisión en segundos.", to: "/permutero", accent: true },
  { icon: GraduationCap, title: "Plan de Estudios", desc: "Marcá las materias aprobadas y las que estás cursando.", to: "/plan" },
  { icon: CalendarDays, title: "Calendario Académico", desc: "Anotá parciales, finales y entregas en tu agenda personal.", to: "/calendario" },
  { icon: BookMarked, title: "Apuntes y Noticias", desc: "Material de cátedra y novedades de la facultad.", to: "/apuntes" },
];

const Index = () => {
  return (
    <div>
      {/* HERO con foto Facultad + overlay azul */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={facultad}
            alt="Edificio histórico de la Universidad Nacional de La Plata"
            className="w-full h-full object-cover object-center"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        </div>

        <div className="container py-24 md:py-36 max-w-4xl animate-float-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-xs font-medium mb-6 text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Agrupación estudiantil · Derecho UNLP
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6 text-white">
            Defendamos<br />
            <span className="text-white/90">Nuestro Derecho</span>
          </h1>
          <p className="text-lg text-white/90 max-w-xl mb-8">
            Una plataforma hecha por y para estudiantes de la Facultad de Derecho de la UNLP.
            Permutas de comisiones, plan de estudios y agenda — todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
              <Link to="/permutero">
                Ir al Permutero <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white/60 hover:bg-white hover:text-primary">
              <Link to="/auth">Ingreso Estudiantil</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES — tarjetas papel */}
      <section className="container py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">Plataforma</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Todo lo que necesitás para cursar
          </h2>
          <p className="text-muted-foreground text-lg">
            Herramientas pensadas por estudiantes que entienden los problemas reales de la facu.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:-translate-y-1 transition-smooth shadow-paper hover:shadow-elegant"
            >
              {f.accent && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider shadow-accent-glow">
                  Destacado
                </div>
              )}
              <div className={`inline-flex p-3 rounded-lg mb-4 ${f.accent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1.5 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
              <ArrowRight className="h-4 w-4 mt-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
            </Link>
          ))}
        </div>
      </section>

      {/* BANNER PERMUTERO */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-10 md:p-16 shadow-elegant">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/30 blur-3xl rounded-full" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url(${facultad})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-wider mb-4 shadow-accent-glow">
              <ShieldCheck className="h-3.5 w-3.5" /> Función estrella
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-bold mb-4 text-white">
              ¿Necesitás cambiar de comisión?
            </h3>
            <p className="text-white/85 text-lg mb-6">
              Publicá lo que tenés y lo que buscás. Cuando alguien coincida con tu permuta, te avisamos al instante con un <span className="text-white font-semibold">¡Hay un Match!</span>
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-paper">
              <Link to="/permutero">Buscar mi permuta <Repeat2 className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
