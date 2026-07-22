import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Repeat2, ShieldCheck, Sparkles, Bot } from "lucide-react";
import { DndMark } from "@/components/DndMark";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const HeroActions = () => {
  const [realizadasCount, setRealizadasCount] = useState(0);

  useEffect(() => {
    supabase.from("permutas").select("*", { count: "exact", head: true }).eq("status", "realizada").then(({ count }) => {
      if (count !== null) setRealizadasCount(count);
    });
  }, []);

  return (
    <section className="container relative z-20 -mt-12 md:-mt-24 pb-16">
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Tarjeta B: Ingresantes (Prioridad Móvil - order 1) */}
        <div className="order-1 md:order-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E162B] via-[#080B17] to-[#04060E] p-8 md:p-12 shadow-2xl border border-white/10 group transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 text-white">
          {/* Glow sutil */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/15 blur-[80px] rounded-full transition-opacity duration-300 group-hover:opacity-70" />
          
          {/* DndMark decorativa */}
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none opacity-10 transition-transform duration-500 group-hover:scale-110">
            <DndMark size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-white/10 backdrop-blur-md">
                <BookOpen className="h-3 w-3 text-red-400" /> Nuevo Ingreso
              </div>
              <h3 className="font-display text-3xl md:text-5xl font-black mb-4 text-white leading-tight tracking-tight">
                ¿Sos Ingresante?
              </h3>
              <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed font-medium">
                Encontrá acá todo lo que necesitás para arrancar tu carrera en la UNLP: Guías, fechas clave y materiales iniciales.
              </p>
            </div>
            
            <Button asChild size="lg" className="w-fit bg-white text-slate-950 hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-xl text-base font-bold rounded-full px-8">
              <Link to="/ingresantes">
                Guía de Ingreso 2026 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Tarjeta A: Permutero (order 2 en móvil) */}
        <div className="order-2 md:order-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F0B12] via-[#0D0B16] to-[#04060E] p-8 md:p-12 shadow-2xl border border-white/10 group transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 text-white">
          {/* Glow rojo sutil */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/20 blur-[80px] rounded-full transition-opacity duration-300 group-hover:opacity-70" />
          
          {/* DndMark decorativa */}
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none opacity-10 transition-transform duration-500 group-hover:scale-110">
            <DndMark size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-300 font-black text-[10px] uppercase tracking-[0.2em] mb-6 border border-red-500/30 backdrop-blur-md">
                <ShieldCheck className="h-3 w-3 text-red-400" strokeWidth={1.5} /> Innovación
              </div>
              <h3 className="font-display text-3xl md:text-5xl font-black mb-4 text-white leading-tight tracking-tight">
                ¿Buscás cambiar de comisión?
              </h3>
              <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed font-medium">
                ¡Encontrá permuta rápido y fácil! Publicás, matcheas y listo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button asChild size="lg" className="w-fit bg-white text-slate-950 hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-xl text-base font-bold rounded-full px-8">
                <Link to="/permutero">
                  Comenzar ahora <Repeat2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {realizadasCount > 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                  <div className="bg-red-600 rounded-full p-1 shadow-red-500/40">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">
                    <strong>{realizadasCount}</strong> permutas
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta C: Asistente DND (Ancho Completo) */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1D0B12] via-[#0E1226] to-[#04060E] p-8 md:p-12 shadow-2xl border border-white/10 group transition-all duration-300 hover:scale-[1.02] hover:shadow-red-500/20 mt-6 text-white">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600/15 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/15 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-200 font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/30 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-red-400" /> Inteligencia Artificial
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                Tutor Virtual: Asistente DND
              </h3>
              <p className="text-white/70 text-base leading-relaxed font-medium">
                ¿Tenés dudas sobre alguna materia, cátedra o comisión? Nuestro asistente con IA lee tus apuntes y te responde en tiempo real con directrices específicas de tu cursada.
              </p>
            </div>
            
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-all duration-300 rounded-full px-8 shrink-0 border border-red-500/40">
              <Link to="/asistente" className="flex items-center gap-2">
                Consultar Asistente <Bot className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};
