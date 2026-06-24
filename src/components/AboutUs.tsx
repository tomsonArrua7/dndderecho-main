import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

const images = [
  "/IMG_7827.jpg",
  "/IMG_7829.PNG",
  "/IMG_7832.PNG",
  "/IMG_7833.PNG",
];

export const AboutUs = () => {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  return (
    <section id="quienes-somos" className="relative bg-[#050B14] py-24 border-t border-white/5 scroll-mt-14">
      <div className="container max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Texto de introducción */}
          <div className="lg:w-5/12 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              Nuestra Identidad
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Quiénes <br/>
              <span className="text-white/40">Somos?</span>
            </h2>
            
            <div className="relative pl-6 border-l-2 border-accent">
              <p className="text-white/70 text-lg md:text-xl leading-relaxed font-serif italic">
                "Somos la Agrupación DND, un espacio formado por y para estudiantes de la Facultad de Ciencias Jurídicas y Sociales de la UNLP. Creemos en una facultad moderna, con herramientas digitales al servicio del alumno y una defensa constante de nuestros derechos académicos."
              </p>
            </div>
          </div>

          {/* Galería */}
          <div className="lg:w-7/12 w-full">
            {/* Desktop Grid (Mosaic) */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {images.map((src, i) => (
                <GalleryImage key={i} src={src} alt={`DND Gallery ${i}`} className={i === 0 || i === 3 ? "aspect-square" : "aspect-[4/3]"} />
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
      </div>
    </section>
  );
};

const GalleryImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`relative w-full overflow-hidden rounded-2xl group border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-elegant ${className}`}>
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
