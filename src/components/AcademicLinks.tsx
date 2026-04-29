import { DoorOpen, CalendarDays, Hash, FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = [
  {
    title: "Aulas y Horarios",
    icon: DoorOpen,
    href: "https://www.jursoc.unlp.edu.ar/index.php/estudiantes/informacion/aulas-horarios.html",
    description: "Consultá dónde cursás y los horarios de cada comisión."
  },
  {
    title: "Calendario Académico",
    icon: CalendarDays,
    href: "https://www.jursoc.unlp.edu.ar/index.php/estudiantes/informacion/calendario-academico.html",
    description: "Fechas de inscripción, recesos y feriados universitarios."
  },
  {
    title: "Números de Sorteo",
    icon: Hash,
    href: "https://www.jursoc.unlp.edu.ar/index.php/estudiantes/informacion/numeros-de-sorteo.html",
    description: "Listados oficiales de sorteos para ingreso a materias."
  },
  {
    title: "Fechas de Examen",
    icon: FileText,
    href: "https://www.jursoc.unlp.edu.ar/index.php/estudiantes/informacion/examenes.html",
    description: "Cronograma de finales, parciales y recuperatorios."
  }
];

export function AcademicLinks() {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-3 text-accent uppercase tracking-[0.2em] text-xs font-black mb-4">
            <div className="w-8 h-[2px] bg-accent"></div>
            <span>Facultad Jursoc</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Servicios <span className="text-accent italic">Académicos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LINKS.map((link, index) => (
            <AcademicCard key={link.title} link={link} index={index} />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-white/20 text-xs font-bold uppercase tracking-widest">
          <InfoIcon className="h-3 w-3" />
          <span>Fuente: Información oficial jursoc.unlp.edu.ar</span>
        </div>
      </div>
    </section>
  );
}

function AcademicCard({ link, index }: { link: typeof LINKS[0]; index: number }) {
  const Icon = link.icon;

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col p-8 bg-[#0A0E1A] border border-white/5 rounded-[2rem] transition-all hover:border-red-600/40 hover:shadow-2xl hover:shadow-red-600/5 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600/5 blur-3xl rounded-full group-hover:bg-red-600/10 transition-colors" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-black text-white mb-3 group-hover:text-red-500 transition-colors">
          {link.title}
        </h3>
        
        <p className="text-white/40 text-sm leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
          {link.description}
        </p>

        <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/60 transition-colors">
          Acceder ahora
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>
    </motion.a>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
