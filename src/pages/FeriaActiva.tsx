import { BookOpen, RefreshCw, DollarSign, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeriaActiva() {
  return (
    <div className="container py-12 max-w-5xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* Hero Section */}
      <div className="mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/50 bg-accent/10 text-accent text-xs font-black uppercase tracking-widest mb-2 shadow-accent-glow">
          <BookOpen size={14} className="text-accent" />
          Feria Activa Estudiantil
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black text-foreground leading-tight">
          Nuestra Feria de Libros <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-500">
            Todo el Año
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          La <strong>Feria Activa</strong> no es la feria judicial, sino nuestro proyecto de feria de libros permanente. Funciona de manera continua para que puedas intercambiar, comprar y vender tus manuales y apuntes de Derecho cuando lo necesites.
        </p>
      </div>

      {/* Como Funciona Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="p-8 rounded-2xl bg-card border border-border shadow-paper hover:-translate-y-1 transition-transform group">
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <RefreshCw size={24} />
          </div>
          <h3 className="text-xl font-bold font-display mb-3 text-foreground">1. Traé tus Libros</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Acercate a nuestra mesa con los apuntes, fotocopias o manuales que ya no uses. Nosotros los recibimos y los ponemos a disposición de la comunidad estudiantil.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-card border border-border shadow-paper hover:-translate-y-1 transition-transform group">
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <DollarSign size={24} />
          </div>
          <h3 className="text-xl font-bold font-display mb-3 text-foreground">2. Precios Populares</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Todos los materiales se ofrecen a un costo muchísimo menor que en la fotocopiadora. Nuestra prioridad es garantizar el acceso al material de estudio.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-card border border-border shadow-paper hover:-translate-y-1 transition-transform group">
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Handshake size={24} />
          </div>
          <h3 className="text-xl font-bold font-display mb-3 text-foreground">3. Solidaridad</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lo que recaudás podés usarlo para llevarte otros libros de la misma feria. Es un círculo solidario pensado por y para estudiantes.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-12 text-center shadow-elegant">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            ¿Tenés material para dejar?
          </h2>
          <p className="text-muted-foreground">
            Encontranos de lunes a viernes en nuestra mesa en la facultad. ¡Sumate a este proyecto colectivo!
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/#quienes-somos"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-8 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-accent-glow"
            >
              Contactanos
            </Link>
            <Link
              to="/permutero"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-semibold hover:bg-accent/10 hover:text-accent transition-colors"
            >
              Ver Permutero Digital
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
