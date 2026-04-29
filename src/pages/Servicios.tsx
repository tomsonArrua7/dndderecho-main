import { AcademicLinks } from "@/components/AcademicLinks";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const Servicios = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Header de la página */}
      <section className="relative py-20 px-6 md:px-12 bg-primary-deep overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold mb-8 text-white/60 tracking-widest uppercase"
          >
            <ShieldCheck className="h-4 w-4 text-accent" />
            Acceso Directo Universitario
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6"
          >
            Servicios <br />
            <span className="text-accent italic">Académicos</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Centralizamos la información oficial de la Facultad de Ciencias Jurídicas y Sociales 
            para que tu cursada sea más simple.
          </motion.p>
        </div>
      </section>

      {/* Componente de Enlaces */}
      <AcademicLinks />

      {/* Sección Informativa Adicional opcional */}
      <section className="py-20 px-6 md:px-12 bg-[#0A0E1A]/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">¿No encontrás lo que buscás?</h3>
            <p className="text-white/40 mb-8">
              Si necesitás ayuda con algún trámite específico o tenés dudas sobre la información de la facultad, 
              no dudes en acercarte a nuestra mesa en el centro de estudiantes o escribirnos.
            </p>
            <a 
              href="https://www.jursoc.unlp.edu.ar/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent font-bold hover:underline"
            >
              Visitar sitio web oficial Jursoc →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Servicios;
