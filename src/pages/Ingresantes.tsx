import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  GraduationCap, 
  Users, 
  Calendar, 
  ArrowLeft,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Instagram,
  Youtube,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FAQItem {
  pregunta: string;
  respuesta: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    pregunta: "¿Qué es una cátedra y una comisión?",
    respuesta: "La comisión es la cursada diaria que vas a tener en un grupo reducido con un docente adjunto a cargo. La cátedra en cambio, a cargo del titular engloba a todas aquellas comisiones. Es una clase semanal multitudinaria."
  },
  {
    pregunta: "¿Cómo promocionar una materia?",
    respuesta: "En nuestra carrera podemos promocionar las materias sin necesidad de ir a la última instancia, llamada coloquio. Vas a promocionar la materia obteniendo un promedio de 6 en los distintos parciales."
  },
  {
    pregunta: "¿Qué es un programa?",
    respuesta: "El programa de estudio te va a ayudar mucho durante tu cursada. Allí se encuentra todo el contenido que vas a dar en la materia dividido por bolillas (unidades)."
  },
  {
    pregunta: "¿Qué es una mesa libre?",
    respuesta: "Una mesa libre es una modalidad de evaluación en la cual los estudiantes estudian la materia personalmente, sin tener la obligación de cursar. Luego, se accede a un examen oral. Mesas libres hay todos los meses y de todas las materias y cátedras, a excepción de enero y julio. La facultad publica una grilla a principio de cuatrimestre con las fechas de las mismas."
  },
  {
    pregunta: "¿Qué es el Siu Guaraní?",
    respuesta: "El Siu Guaraní es la plataforma virtual en la cual todos los estudiantes vamos a inscribirnos a las materias y a los exámenes libres. Allí, además, nos cargarán todas nuestras notas finales de las cursadas o evaluaciones."
  },
  {
    pregunta: "¿Qué son las Cátedras Virtuales?",
    respuesta: "Cuando hablamos de Cátedras Virtuales, nos referimos al campus virtual en el que los docentes de cada cátedra y comisión publican contenido y avisos referidos a la materia. Es importante matricularse en el espacio de cada docente para no perderse información relevante."
  }
];

const ACTIVIDADES = [
  {
    titulo: "Preparemos Socio",
    descripcion: "Ciclo de tutorías que brindan compañeros de DND para ayudarte a preparar tu primera materia libre de la carrera.",
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20"
  },
  {
    titulo: "Clases Pre-parcial",
    descripcion: "Clases especiales dictadas por docentes de materias de primer año para acompañarlos e instruirlos a la hora de preparar sus parciales.",
    color: "from-red-500/10 to-rose-500/5",
    border: "border-red-500/20"
  },
  {
    titulo: "Visitas Guiadas",
    descripcion: "Recorridos presenciales por el edificio de la Facultad destinados a estudiantes secundarios de 6to año de escuelas públicas y privadas.",
    color: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20"
  },
  {
    titulo: "Sesión de Estudio",
    descripcion: "Jornadas de repaso intensivo previo a las evaluaciones, dictados de forma solidaria por estudiantes avanzados para estudiantes ingresantes.",
    color: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20"
  }
];

export default function Ingresantes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" /> Guía de Ingreso 2026
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            ¿Sos ingresante o querés ingresar a la Facultad?
          </h1>
          <p className="text-slate-650 dark:text-white/70 text-base md:text-lg leading-relaxed font-medium">
            Sesiones de estudio, tutorías y simulacros en la primera materia y todas las materias de primer año. <span className="text-accent font-bold">Aseguramos tu ingreso y permanencia.</span>
          </p>
        </div>

        {/* BOTÓN DE SUPERVIVENCIA (Survival Links Card) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent animate-bounce" /> ¡Botón de Supervivencia 2026!
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed font-medium">
              Accede a los canales oficiales y únete a las comisiones de ingresantes de tu año para no perderte nada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <a href="https://chat.whatsapp.com/GVjq0ZK7zFG04JO4ha9ZOu" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4" /> WhatsApp Ingresantes <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <a href="https://www.instagram.com/ingresantesjursoc/?hl=es-la" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" /> Instagram 2026 <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-650/10 flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <a href="https://www.youtube.com/@DerechoenMinutos" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-4.5 w-4.5" /> Canal YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Dos Columnas Principales: Querés ingresar / Ya sos ingresante */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* Tarjeta A: Aspirantes (Querés ingresar) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                ¿Querés Ingresar a la Facultad?
              </h2>
              <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">
                El camino para ingresar a Ciencias Jurídicas y Sociales de la UNLP es sencillo si contás con la información correcta. Te acompañamos desde el trámite de inscripción.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                    <strong>Preinscripción online:</strong> Formulario obligatorio en el sistema SIU Guaraní (habitualmente habilitado entre noviembre y diciembre).
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                    <strong>Documentación requerida:</strong> DNI (original y copia), título secundario (legalizado o certificado de título en trámite), y foto carnet.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                    <strong>Tutorías DND de orientación:</strong> Realizamos charlas informativas online y presenciales sobre cómo inscribirte sin cometer errores.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-white/5 mt-8 flex items-center gap-3">
              <Button asChild className="bg-slate-100 hover:bg-slate-200 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 font-bold rounded-xl shadow-lg border border-slate-200 dark:border-none text-slate-800 cursor-pointer">
                <a href="https://www.jursoc.unlp.edu.ar" target="_blank" rel="noopener noreferrer">
                  Sitio Oficial UNLP
                </a>
              </Button>
              <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-black tracking-wider">Inscripciones 2026</span>
            </div>
          </motion.div>

          {/* Tarjeta B: Ingresantes (Ya estás cursando) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                ¿Ya sos Ingresante 2026?
              </h2>
              <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">
                ¡Felicitaciones! Arrancaste tu carrera. DND te acompaña día a día en el Curso de Adaptación y en todas las cátedras de primer año para que tu cursada sea un éxito.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                    <strong>Sesiones de Estudio Colectivo:</strong> Nos juntamos en la facultad a repasar conceptos clave antes de cada clase y examen.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                    <strong>Tutorías académicas:</strong> Estudiantes avanzados te explican los temas más complejos de la primera materia (Derecho Romano / Civil I) de forma clara y accesible.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-medium">
                    <strong>Simulacros de Examen escritos y orales:</strong> Perdé el miedo rindiendo exámenes de prueba idénticos a los parciales reales de la facultad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-white/5 mt-8 flex items-center gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 cursor-pointer">
                <Link to="/auth">
                  Crear Cuenta Alumno
                </Link>
              </Button>
              <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-black tracking-wider">Aseguramos tu permanencia</span>
            </div>
          </motion.div>

        </div>

        {/* SOS INGRESANTE - FAQ ACCORDION SECTION */}
        <div className="mb-20 space-y-8">
          <div className="text-left max-w-2xl space-y-3">
            <h3 className="font-serif text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-7 w-7 text-accent" /> SOS Ingresante
            </h3>
            <p className="text-slate-500 dark:text-muted-foreground text-sm font-medium">
              Seguro tenés estas preguntas sobre la cursada o el funcionamiento institucional: por eso te brindamos toda esta información detallada.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full py-4 px-6 flex items-center justify-between gap-4 text-left font-bold text-slate-800 dark:text-white/90 hover:text-accent transition-colors outline-none cursor-pointer"
                  >
                    <span className="text-sm md:text-base">{item.pregunta}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 dark:text-white/30 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-accent" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-650 dark:text-white/60 leading-relaxed font-medium border-t border-slate-100 dark:border-white/5">
                          {item.respuesta}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* NUESTRAS ACTIVIDADES GRID */}
        <div className="mb-20 space-y-8">
          <div className="text-left max-w-2xl space-y-3">
            <h3 className="font-serif text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-7 w-7 text-accent" /> Nuestras Actividades de Apoyo
            </h3>
            <p className="text-slate-500 dark:text-muted-foreground text-sm font-medium">
              Conocé las actividades periódicas organizadas por los compañeros de DND para garantizar tu permanencia en la facultad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACTIVIDADES.map((act, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-2xl bg-gradient-to-br ${act.color} border ${act.border} shadow-sm space-y-3 transition-transform duration-300 hover:scale-[1.01]`}
              >
                <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">{act.titulo}</h4>
                <p className="text-xs md:text-sm text-slate-650 dark:text-white/60 leading-relaxed font-medium">{act.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Videos Reels Autoplay */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Tutorías en Acción</h3>
            <p className="text-slate-500 dark:text-muted-foreground text-sm font-medium">
              Mirá cómo trabajamos día a día acompañando tu ingreso. Sesiones de repaso, simulacros y actividades presenciales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Reel 1 */}
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-slate-200 dark:border-white/5 group shadow-lg">
              <video
                src="/IMG_5646.mp4"
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
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-slate-200 dark:border-white/5 group shadow-lg">
              <video
                src="/IMG_6025.mp4"
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
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-slate-200 dark:border-white/5 group shadow-lg">
              <video
                src="/IMG_7062.mp4"
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

            {/* Reel 4 */}
            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] md:aspect-[3/4] border border-slate-200 dark:border-white/5 group shadow-lg">
              <video
                src="/IMG_4329.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="h-3 w-3 text-accent" /> Acompañamiento
                </span>
                <h4 className="text-white font-bold text-base md:text-lg leading-tight">Talleres de Apoyo</h4>
                <p className="text-white/50 text-[10px] md:text-xs mt-1 leading-relaxed">Acompañamiento personalizado para resolver dudas del inicio de la carrera.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
