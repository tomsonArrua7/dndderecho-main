import { motion } from "framer-motion";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bot, X } from "lucide-react";

export const CommunityButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3 items-end pointer-events-none">
      
      {/* Botón Flotante de la IA */}
      <div className="relative flex items-center pointer-events-auto">
        {/* Cartelito flotante (Visible sólo en pantallas medianas o superiores para evitar desbordes en celulares) */}
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="hidden md:flex absolute right-full mr-3 bg-white dark:bg-[#0D1224]/95 text-slate-900 dark:text-white border border-slate-200 dark:border-accent/30 px-3 py-2 rounded-2xl shadow-2xl items-center gap-2 text-[11px] md:text-xs font-black tracking-wide whitespace-nowrap"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>¿Dudas? Preguntale al Tutor IA 🤖</span>
            <button 
              onClick={() => setShowSpeechBubble(false)} 
              className="ml-1 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild className="w-12 h-12 md:w-14 md:h-14 p-0 bg-gradient-to-r from-accent to-[#C41E24] text-white rounded-full shadow-[0_4px_20px_rgba(229,9,20,0.4)] hover:shadow-accent-glow hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border border-accent/20">
                <Link to="/asistente" aria-label="Consultar Asistente Virtual">
                  <Bot className="w-6 h-6 md:w-7 md:h-7" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-foreground text-background font-medium py-1 px-3 rounded-lg text-xs mb-2">
              Preguntar al Tutor IA
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Botón de WhatsApp */}
      <div className="pointer-events-auto">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.a
                href="https://chat.whatsapp.com/BooxpAKePHHIc467D9NKit?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all duration-300 group border border-[#25D366]/20 cursor-pointer"
                aria-label="Sumate al grupo de avisos"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-foreground text-background font-medium py-1 px-3 rounded-lg text-xs mb-2">
              ¡Sumate al grupo de avisos!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );
};
