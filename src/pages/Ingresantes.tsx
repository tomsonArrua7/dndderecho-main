import { motion } from "framer-motion";
import { BookOpen, HelpCircle, CheckCircle, GraduationCap, Users, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Ingresantes = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10" />

      <div className="container py-16 md:py-24 max-w-6xl relative z-10">
        
        {/* Botón Volver */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent font-semibold transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al Inicio
        </Link>

        {/* Hero Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            Guía de Ingreso 2026
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            ¿Sos ingresante o querés ingresar a la Facultad?
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed font-medium">
            Sesiones de estudio, tutorías y simulacros en la primera materia y todas las materias de primer año. <span className="text-accent font-bold">Aseguramos tu ingreso y permanencia.</span>
          </p>
        </div>

        {/* Dos Columnas Principales: Querés ingresar / Ya sos ingresante */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* Tarjeta A: Aspirantes (Querés ingresar) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-elegant flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                ¿Querés Ingresar a la Facultad?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                El camino para ingresar a Ciencias Jurídicas y Sociales de la UNLP es sencillo si contás con la información correcta. Te acompañamos desde el trámite de inscripción.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Preinscripción online:</strong> Formulario obligatorio en el sistema SIU Guaraní (habitualmente habilitado entre noviembre y diciembre).
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Documentación requerida:</strong> DNI (original y copia), título secundario (legalizado o certificado de título en trámite), y foto carnet.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Tutorías DND de orientación:</strong> Realizamos charlas informativas online y presenciales sobre cómo inscribirte sin cometer errores.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 mt-8 flex items-center gap-3">
              <Button asChild className="bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-xl shadow-lg">
                <a href="https://www.jursoc.unlp.edu.ar" target="_blank" rel="noopener noreferrer">
                  Sitio Oficial UNLP
                </a>
              </Button>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Inscripciones 2026</span>
            </div>
          </motion.div>

          {/* Tarjeta B: Ingresantes (Ya estás cursando) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-elegant flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                ¿Ya sos Ingresante 2026?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                ¡Felicitaciones! Arrancaste tu carrera. DND te acompaña día a día en el Curso de Adaptación y en todas las cátedras de primer año para que tu cursada sea un éxito.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Sesiones de Estudio Colectivo:</strong> Nos juntamos en la facultad a repasar conceptos clave antes de cada clase y examen.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Tutorías académicas:</strong> Estudiantes avanzados te explican los temas más complejos de la primera materia (Derecho Romano / Civil I) de forma clara y accesible.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Simulacros de Examen escritos y orales:</strong> Perdé el miedo rindiendo exámenes de prueba idénticos a los parciales reales de la facultad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 mt-8 flex items-center gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20">
                <Link to="/auth">
                  Crear Cuenta Alumno
                </Link>
              </Button>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Aseguramos tu permanencia</span>
            </div>
          </motion.div>

        </div>

        {/* Sección: Videos Reels Autoplay */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">Tutorías en Acción</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Mirá cómo trabajamos día a día acompañando tu ingreso. Sesiones de repaso, simulacros y actividades presenciales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Reel 1 */}
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-white/5 group shadow-lg">
              <video
                src="/IMG_5646.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-accent" /> Clases de Apoyo
                </span>
                <h4 className="text-white font-bold text-base md:text-lg leading-tight">Simulacros de Examen</h4>
                <p className="text-white/50 text-[10px] md:text-xs mt-1 leading-relaxed">Repasamos y practicamos con exámenes reales de cursadas anteriores.</p>
              </div>
            </div>

            {/* Reel 2 */}
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-white/5 group shadow-lg">
              <video
                src="/IMG_6025.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-accent" /> Tutorías 2026
                </span>
                <h4 className="text-white font-bold text-base md:text-lg leading-tight">Jornadas de Ingreso</h4>
                <p className="text-white/50 text-[10px] md:text-xs mt-1 leading-relaxed">Orientación directa y grupos de estudio colectivos para ingresantes.</p>
              </div>
            </div>

            {/* Reel 3 */}
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-white/5 group shadow-lg">
              <video
                src="/IMG_7062.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-accent" /> Permanencia
                </span>
                <h4 className="text-white font-bold text-base md:text-lg leading-tight">Sesiones de Estudio</h4>
                <p className="text-white/50 text-[10px] md:text-xs mt-1 leading-relaxed">Te acompañamos en la primera materia y a lo largo de todo tu primer año.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Ingresantes;
