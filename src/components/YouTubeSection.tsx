import { Youtube, ExternalLink, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const VIDEOS = [
  { 
    id: "v1", 
    title: "JUICIO POR JURADOS EN MINUTOS", 
    duration: "8:04",
    thumbnail: "https://img.youtube.com/vi/UhEXoPhafN4/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=UhEXoPhafN4"
  },
  { 
    id: "v2", 
    title: "INVESTIGACIÓN PENAL PREPARATORIA EN MINUTOS", 
    duration: "8:41",
    thumbnail: "https://img.youtube.com/vi/1gBysi28hAo/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=1gBysi28hAo"
  },
  { 
    id: "v3", 
    title: "CLASES DE TUTELA Y CURATELA EN MINUTOS", 
    duration: "3:34",
    thumbnail: "https://img.youtube.com/vi/JpPsQ1miLdQ/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=JpPsQ1miLdQ"
  },
];

export const YouTubeSection = () => {
  return (
    <section className="container py-24">
      <div className="flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-black text-white tracking-tight">Clases y Conceptos Rápidos</h2>
              <p className="text-white/40 text-sm font-medium">Contenido educativo de Derecho en Minutos</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col bg-[#0A0E1A]/60 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-600/30 transition-all duration-500 shadow-2xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl"
                  >
                    <Play className="fill-current h-6 w-6 ml-1" />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white/80">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-lg font-bold text-white mb-6 leading-tight group-hover:text-red-500 transition-colors">
                  {video.title}
                </h3>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors"
                >
                  Ver clase completa <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            asChild 
            size="xl" 
            className="h-16 px-12 bg-red-600 text-white hover:bg-red-700 shadow-[0_15px_30px_rgba(220,38,38,0.25)] rounded-[2rem] text-lg font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 border-none"
          >
            <a href="https://www.youtube.com/@DerechoenMinutos" target="_blank" rel="noopener noreferrer">
              VER TODAS LAS CLASES EN YOUTUBE
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
