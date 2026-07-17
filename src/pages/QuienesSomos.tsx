import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Users, 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  CheckCircle,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

const images = [
  "/IMG_7827.jpg",
  "/IMG_7829.PNG",
  "/IMG_7832.PNG",
  "/IMG_7833.PNG",
];

const CONSEJEROS = [
  {
    nombre: "Camilo Leavi Blazquez",
    periodo: "Consejero HCD (2023)",
    iniciales: "CL",
    avatarBg: "from-red-650 to-red-800"
  },
  {
    nombre: "Micaela Ramírez",
    periodo: "Consejera HCD (2024)",
    iniciales: "MR",
    avatarBg: "from-red-600 to-rose-700"
  },
  {
    nombre: "Santiago López",
    periodo: "Consejero HCD (2025-2026)",
    iniciales: "SL",
    avatarBg: "from-accent to-red-650"
  }
];

const PROYECTOS = [
  "Primer proyecto plebiscitado.",
  "Creación de la cátedra 2 de Derechos Humanos.",
  "Aula Abuelas de Plaza de Mayo.",
  "Calendario Académico Unificado.",
  "Portal de Difusión de Empleo y Pasantías.",
  "Plena implementación de las Bandas Horarias.",
  "Vacantes en preevaluativos.",
  "Protocolo ante Paros de Transporte.",
  "Modelo ONU Jursoc.",
  "Cursada en Bloque para 1er año.",
  "Semana de Finales.",
  "Honoris Causa Post Mortem al Papa Francisco.",
  "Nueva cátedra de Derecho Procesal 1.",
  "Declaración de interés de la Marcha Federal Universitaria.",
  "Debate Jursoc."
];

export default function QuienesSomos() {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10" />

      <div className="container py-12 md:py-20 max-w-6xl relative z-10 selection:bg-accent/30">
        
        {/* Botón Volver */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-muted-foreground hover:text-accent font-semibold transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al Inicio
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-24">
          
          {/* Texto de introducción */}
          <div className="lg:w-5/12 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" /> Nuestra Identidad
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              ¿Quiénes <br/>
              <span className="text-slate-400 dark:text-white/40">Somos?</span>
            </h1>
            
            <div className="relative pl-6 border-l-2 border-accent space-y-4 text-slate-650 dark:text-white/80 text-sm md:text-base leading-relaxed font-medium">
              <p>
                Somos DND: la segunda fuerza en la Facultad de Ciencias Jurídicas y Sociales. Una agrupación estudiantil comprometida con acompañar a los estudiantes durante su paso por la vida universitaria.
              </p>
              <p>
                Nacimos en el 2016 y trabajamos todos los días para brindar información útil, buscar soluciones reales a los problemas de la comunidad estudiantil y construir una Facultad más participativa, democrática y cercana a quienes verdaderamente la transitan.
              </p>
              <p className="font-extrabold text-accent">
                Hoy, además, somos la voz de los estudiantes en el Consejo Directivo.
              </p>
            </div>
          </div>

          {/* Galería de fotos */}
          <div className="lg:w-7/12 w-full">
            {/* Desktop Grid (Mosaic) */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {images.map((src, i) => (
                <GalleryImage 
                  key={i} 
                  src={src} 
                  alt={`DND Gallery ${i}`} 
                  className={i === 0 || i === 3 ? "aspect-square" : "aspect-[4/3]"} 
                />
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden overflow-hidden -mx-4 px-4" ref={emblaRef}>
              <div className="flex gap-4">
                {images.map((src, i) => (
                  <div key={i} className="flex-[0_0_80%] min-w-0">
                    <GalleryImage src={src} alt={`DND Gallery ${i}`} className="aspect-[4/3]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONSEJO DIRECTIVO SECTION */}
        <div className="mb-24 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              <GraduationCap className="h-4.5 w-4.5 text-accent" /> Órgano de Cogobierno
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Representación en el Consejo Directivo
            </h2>
            <p className="text-slate-650 dark:text-white/60 text-sm md:text-base leading-relaxed font-medium">
              Desde el 2023 somos tus representantes en el Consejo Directivo de la Facultad. El HCD es el órgano de cogobierno en donde se debaten y votan las decisiones más importantes de nuestra casa de estudios. En total hay 16 miembros. Por el claustro estudiantil hay 5 representantes y 1 de ellos corresponde a DND.
            </p>
          </div>

          {/* Tarjetas de Consejeros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONSEJEROS.map((con, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 shadow-xl flex items-center gap-4 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${con.avatarBg} text-white font-serif font-bold text-lg flex items-center justify-center shadow-lg shrink-0`}>
                  {con.iniciales}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-slate-800 dark:text-white text-base leading-tight truncate">{con.nombre}</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-accent mt-1 leading-none">{con.periodo}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PROYECTOS PRESENTADOS SECTION */}
        <div className="space-y-8">
          <div className="text-left max-w-2xl space-y-3">
            <h3 className="font-serif text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-7 w-7 text-accent" /> Proyectos Presentados
            </h3>
            <p className="text-slate-550 dark:text-muted-foreground text-sm font-medium">
              En estos poco más de 3 años, presentamos 15 proyectos claves en el HCD para mejorar tus condiciones académicas y de cursada como estudiante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROYECTOS.map((proy, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.005] hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-all flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-700 dark:text-white/80 font-medium leading-relaxed">{proy}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const GalleryImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`relative w-full overflow-hidden rounded-2xl group border border-slate-200 dark:border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-elegant cursor-pointer ${className}`}>
          {/* Overlay rojo muy sutil al hover */}
          <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center p-2">
          <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
