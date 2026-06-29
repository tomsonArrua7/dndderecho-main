import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bot, 
  Send, 
  BookOpen, 
  Users, 
  Bookmark, 
  HelpCircle, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface Materia {
  id: string;
  nombre: string;
  anio: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  materia?: string;
  catedra?: string;
  comision?: string;
}

export default function AsistenteDND() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  
  // Form states
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedCatedra, setSelectedCatedra] = useState("");
  const [selectedComision, setSelectedComision] = useState("");
  const [pregunta, setPregunta] = useState("");
  
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch materias from database
  useEffect(() => {
    async function fetchMaterias() {
      try {
        setLoadingMaterias(true);
        const { data, error } = await supabase
          .from("materias")
          .select("id, nombre, anio")
          .order("anio")
          .order("nombre");
          
        if (error) throw error;
        if (data) setMaterias(data);
      } catch (err: any) {
        console.error("Error al cargar materias:", err);
        // Fallback en caso de error de conexión
        setMaterias([
          { id: "1", nombre: "Derecho Civil I", anio: 1 },
          { id: "2", nombre: "Derecho Penal I", anio: 1 },
          { id: "3", nombre: "Derecho Romano", anio: 1 },
          { id: "4", nombre: "Derecho Constitucional", anio: 2 },
        ]);
      } finally {
        setLoadingMaterias(false);
      }
    }
    fetchMaterias();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMateria) {
      toast.error("Por favor, selecciona una materia antes de consultar.");
      return;
    }
    if (!pregunta.trim()) {
      toast.error("Por favor, ingresa tu pregunta.");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: pregunta,
      materia: selectedMateria,
      catedra: selectedCatedra || undefined,
      comision: selectedComision || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setPregunta("");
    setIsLoadingResponse(true);

    try {
      // Petición a la Edge Function de Supabase
      const { data, error } = await supabase.functions.invoke("asistente", {
        body: {
          pregunta: userMessage.content,
          materia: userMessage.materia,
          catedra: userMessage.catedra || "",
          comision: userMessage.comision || ""
        },
      });

      if (error) throw error;
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.respuesta
        }
      ]);
    } catch (err: any) {
      console.error("Error al obtener respuesta del asistente:", err);
      // Intentar extraer el error JSON/texto detallado devuelto por la Edge Function
      if (err.context && typeof err.context.json === "function") {
        err.context.json().then((details: any) => {
          console.error("Detalles del error devuelto por la Edge Function:", details);
        }).catch(() => {});
      } else if (err.context && typeof err.context.text === "function") {
        err.context.text().then((text: string) => {
          console.error("Texto del error devuelto por la Edge Function:", text);
        }).catch(() => {});
      }
      toast.error("No se pudo obtener respuesta del Asistente DND.");
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `❌ **Error al invocar la Edge Function:**
          
No pudimos conectarnos con la función "asistente" en tu proyecto de Supabase.

**Pasos para solucionarlo:**
1. Asegúrate de haber desplegado la función en producción ejecutando en tu terminal local:
   \`supabase functions deploy asistente\`
2. Configura tu \`GEMINI_API_KEY\` en Supabase con:
   \`supabase secrets set GEMINI_API_KEY="tu_clave_api"\`

*Detalles del error: ${err.message || JSON.stringify(err)}*`
        }
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="container py-8 md:py-12 max-w-6xl flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] selection:bg-accent/30">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-black mb-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-accent animate-pulse" /> Inteligencia Artificial
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white">
            Asistente DND
          </h1>
          <p className="text-white/60 text-sm md:text-base mt-2 max-w-2xl">
            Tutor académico universitario integrado con el repositorio de apuntes de Drive.
            Pregunta sobre conceptos, fallos o temas específicos de tu cátedra y comisión.
          </p>
        </div>
        
        <a 
          href="https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-2.5 px-4 rounded-xl transition-all self-start md:self-center"
        >
          Ver Drive Oficial <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Sidebar de Configuración */}
        <Card className="lg:col-span-4 p-5 bg-[#0D1224]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col justify-between h-fit gap-6 shadow-2xl">
          <div className="space-y-5">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" /> Configuración de Estudio
            </h3>
            
            <div className="space-y-4">
              {/* Selector de Materias */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Materia *</label>
                {loadingMaterias ? (
                  <div className="h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-xs text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Cargando materias...
                  </div>
                ) : (
                  <select
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0A0E1A]">-- Selecciona Materia --</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.nombre} className="bg-[#0A0E1A]">
                        {m.nombre} ({m.anio}° Año)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selector de Cátedra */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                  Cátedra <HelpCircle className="h-3 w-3 text-white/30" title="Las cátedras a veces piden contenidos distintos." />
                </label>
                <select
                  value={selectedCatedra}
                  onChange={(e) => setSelectedCatedra(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#0A0E1A]">Cátedra General / No sé</option>
                  <option value="A" className="bg-[#0A0E1A]">Cátedra A</option>
                  <option value="B" className="bg-[#0A0E1A]">Cátedra B</option>
                  <option value="C" className="bg-[#0A0E1A]">Cátedra C</option>
                  <option value="Unica" className="bg-[#0A0E1A]">Cátedra Única</option>
                </select>
              </div>

              {/* Selector de Comisión */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Comisión</label>
                <input
                  type="text"
                  placeholder="Ej: 1, 4, A..."
                  value={selectedComision}
                  onChange={(e) => setSelectedComision(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Información RAG */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2 text-xs text-white/70">
            <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-accent">
              <Bot className="h-4 w-4" /> Aprendizaje de Cátedras
            </div>
            <p className="leading-relaxed">
              El asistente procesa información de la materia y de los apuntes correspondientes a tu cátedra y comisión.
              Esto permite adaptar la respuesta según el profesor a cargo.
            </p>
          </div>
        </Card>

        {/* Panel del Chat */}
        <Card className="lg:col-span-8 bg-[#0D1224]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-2xl">
          
          {/* Header del Chat */}
          <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Chat del Asistente DND</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                {selectedMateria ? `Estudiando ${selectedMateria}` : "Esperando configuración"}
              </div>
            </div>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/10">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                  <HelpCircle className="h-8 w-8" />
                </div>
                <div className="max-w-sm space-y-1.5">
                  <p className="text-white font-bold text-sm">¡Comienza tu consulta!</p>
                  <p className="text-white/40 text-xs leading-relaxed">
                    Selecciona tu materia en la barra lateral y escribe una pregunta académica para comenzar.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === "user" ? "bg-accent text-white" : "bg-[#181F3B] border border-white/10 text-accent"
                  }`}>
                    {msg.role === "user" ? "U" : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-accent/20 border border-accent/20 text-white rounded-tr-none" 
                      : "bg-[#10162B] border border-white/5 text-white/90 rounded-tl-none"
                  }`}>
                    {/* Renderización Markdown simplificada */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Animación de Pensando / Cargando */}
            {isLoadingResponse && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="h-8 w-8 rounded-full shrink-0 bg-[#181F3B] border border-white/10 flex items-center justify-center text-accent">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                </div>
                <div className="p-4 rounded-2xl bg-[#10162B] border border-white/5 text-white/40 text-xs flex items-center gap-2 rounded-tl-none">
                  El Asistente DND está leyendo tus apuntes de la materia...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Envío */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-white/5 shrink-0 flex gap-2">
            <input
              type="text"
              placeholder={selectedMateria ? `Escribe tu pregunta sobre ${selectedMateria}...` : "Selecciona una materia primero..."}
              disabled={!selectedMateria || isLoadingResponse}
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              className="flex-1 bg-background/50 border border-white/10 text-white rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 transition-all placeholder:text-white/20"
            />
            <Button 
              type="submit" 
              disabled={!selectedMateria || !pregunta.trim() || isLoadingResponse}
              className="bg-accent hover:bg-accent/90 text-white rounded-xl p-3 shrink-0 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

        </Card>
      </div>
    </div>
  );
}
