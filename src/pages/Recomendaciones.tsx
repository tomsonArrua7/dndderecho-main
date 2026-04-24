import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Star, MessageCircle, Lock, ThumbsUp, ChevronRight } from "lucide-react";

// ── Datos de ejemplo (placeholder hasta conectar con Supabase) ────────
const RECOMENDACIONES_EJEMPLO = [
  {
    id: 1,
    categoria: "Cátedra",
    titulo: "Cátedra I de Derecho Privado II",
    cuerpo: "Muy buen nivel de exigencia, los parciales son complicados pero el equipo docente acompaña bien durante el cuatrimestre.",
    rating: 4,
    votos: 18,
    autor: "Estudiante anónimo",
    fecha: "Abril 2025",
  },
  {
    id: 2,
    categoria: "Docente",
    titulo: "Prof. García — Derecho Constitucional",
    cuerpo: "Las clases son muy dinámicas, usa casos reales y jurisprudencia reciente. El final oral es exigente pero justo.",
    rating: 5,
    votos: 32,
    autor: "Estudiante anónimo",
    fecha: "Marzo 2025",
  },
  {
    id: 3,
    categoria: "Cátedra",
    titulo: "Cátedra II de Derecho Penal I",
    cuerpo: "Buena cátedra para arrancar el año. Los JTP explican bien en las prácticas. El parcial tiene múltiple choice y desarrollo.",
    rating: 3,
    votos: 11,
    autor: "Estudiante anónimo",
    fecha: "Febrero 2025",
  },
];

const Estrellas = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const Recomendaciones = () => {
  const { user } = useAuth();

  return (
    <div className="container py-12 max-w-4xl">

      {/* Header */}
      <div className="mb-10">
        <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-2 flex items-center gap-2">
          <Star className="h-3 w-3" /> Comunidad DND
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
          Recomendaciones
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
          Opiniones de estudiantes sobre cátedras y docentes de la Facultad de Ciencias Jurídicas y Sociales.
          La información es compartida por la comunidad DND.
        </p>
      </div>

      {/* Banner CTA — si no está logeado */}
      {!user && (
        <div className="mb-8 flex items-center justify-between gap-4 p-5 rounded-xl border border-primary/30 bg-primary/5 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Iniciá sesión para opinar</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Podés leer todas las recomendaciones sin cuenta. Para dejar la tuya, necesitás estar registrado.
              </p>
            </div>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-glow transition-colors shrink-0"
          >
            Ingresar <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Botón publicar — si está logeado */}
      {user && (
        <div className="mb-8 flex items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card flex-wrap">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Compartí tu experiencia</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tu opinión anónima ayuda a otros estudiantes a elegir mejor sus cátedras.
              </p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-glow transition-colors shrink-0"
            title="Próximamente"
            onClick={() => alert("Función en desarrollo — ¡próximamente!")}
          >
            + Publicar recomendación
          </button>
        </div>
      )}

      {/* Lista de recomendaciones */}
      <div className="space-y-4">
        {RECOMENDACIONES_EJEMPLO.map(r => (
          <article
            key={r.id}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-200 hover:shadow-paper group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {r.categoria}
                </span>
                <h2 className="font-display font-semibold text-base text-foreground">
                  {r.titulo}
                </h2>
              </div>
              <Estrellas rating={r.rating} />
            </div>

            {/* Cuerpo */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {r.cuerpo}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground/60">
              <span>{r.autor} · {r.fecha}</span>
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors"
                title="Útil"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                {r.votos} útil{r.votos !== 1 ? "es" : ""}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Aviso placeholder */}
      <div className="mt-10 p-5 rounded-xl border border-border/50 bg-card/30 text-center">
        <p className="text-xs text-muted-foreground/60">
          Esta sección está en desarrollo activo. Pronto podrás filtrar por materia, cátedra y docente,
          y votar las recomendaciones más útiles.
        </p>
      </div>
    </div>
  );
};

export default Recomendaciones;
