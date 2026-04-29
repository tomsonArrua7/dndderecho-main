import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InstagramFeed() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Evitar cargar el script múltiples veces si ya existe
    if (document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://w.behold.so/widget.js";
    script.type = "module";
    script.defer = true;
    
    const handleLoad = () => setScriptLoaded(true);
    script.addEventListener("load", handleLoad);
    
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <section 
      className="w-full bg-primary rounded-[2rem] p-8 md:p-12 shadow-elegant border border-white/5 overflow-hidden relative"
      aria-label="Feed de Instagram de DND"
    >
      {/* Decoración de fondo (Glow) */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header con Título e Icono */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white tracking-tight">
                Novedades en Instagram
              </h2>
              <p className="text-white/60 text-sm font-medium mt-1 tracking-wide uppercase">
                Seguinos @agrupaciondnd
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/agrupaciondnd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold text-sm transition-all hover:bg-accent hover:text-white hover:scale-105 active:scale-95 shadow-elegant"
          >
            Ver perfil completo
          </a>
        </div>

        {/* Contenedor del Widget / Loading State */}
        <div className="relative min-h-[300px] w-full">
          {!scriptLoaded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton 
                  key={i} 
                  className="aspect-square bg-white/5 rounded-2xl border border-white/5" 
                />
              ))}
            </div>
          )}
          
          {/* 
            Widget de Behold:
            Se renderiza siempre, pero el script lo activará cuando cargue.
            La configuración de columnas (4x1 Desktop, 1x1 o 2x2 Mobile) 
            se recomienda ajustar desde el dashboard de Behold para este feed-id.
          */}
          <behold-widget feed-id="VLE0e125oUyyQydPF11F"></behold-widget>
        </div>
      </div>
    </section>
  );
}
