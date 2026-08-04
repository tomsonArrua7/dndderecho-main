import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bot, 
  Send, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Lock,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  CheckCircle2,
  Wrench
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-[13px] md:text-sm leading-relaxed text-slate-800 dark:text-white/95">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
        if (isBullet) {
          trimmed = trimmed.substring(2);
        }

        // Expresión regular para detectar **negrita**, [texto](enlace) y URLs puras
        const tokenRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|https?:\/\/[^\s\)]+)/g;
        const tokens = trimmed.split(tokenRegex);
        const parts: React.ReactNode[] = [];

        tokens.forEach((token, tIdx) => {
          if (token.startsWith("**") && token.endsWith("**")) {
            parts.push(
              <strong key={tIdx} className="font-extrabold text-slate-950 dark:text-[#E5E7EB] text-[14px] md:text-[15px] tracking-wide">
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith("[") && token.includes("](")) {
            const closingBracket = token.indexOf("]");
            const text = token.substring(1, closingBracket);
            const url = token.substring(closingBracket + 2, token.length - 1);
            parts.push(
              <a
                key={tIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-bold inline-flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20 transition-all duration-200 hover:bg-accent/20 text-xs md:text-sm"
              >
                {text} <ExternalLink className="h-3 w-3 inline shrink-0" />
              </a>
            );
          } else if (token.startsWith("http://") || token.startsWith("https://")) {
            parts.push(
              <a
                key={tIdx}
                href={token}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-bold inline-flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20 transition-all duration-200 hover:bg-accent/20 text-xs md:text-sm"
              >
                Ver Enlace <ExternalLink className="h-3 w-3 inline shrink-0" />
              </a>
            );
          } else {
            parts.push(token);
          }
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="text-accent mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-slate-700 dark:text-white/80">{parts}</span>
            </div>
          );
        }

        if (trimmed === "") {
          return <div key={idx} className="h-2" />;
        }

        return <p key={idx} className="text-slate-800 dark:text-white/95">{parts}</p>;
      })}
    </div>
  );
}

export default function AsistenteDND() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin" || profile?.role === "escritor";
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
  
  // Correction & Feedback States
  const [feedbackState, setFeedbackState] = useState<Record<number, "up" | "down">>({});
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionMsgIndex, setCorrectionMsgIndex] = useState<number | null>(null);
  const [correctionInputText, setCorrectionInputText] = useState("");
  const [isSavingCorrection, setIsSavingCorrection] = useState(false);

  // Estados para el cargador dinámico
  const [loadingTime, setLoadingTime] = useState(0);
  const [loadingStage, setLoadingStage] = useState("Buscando apuntes oficiales en la biblioteca...");
  const [showConfig, setShowConfig] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efecto para manejar el cronómetro de carga y las etapas
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoadingResponse) {
      setLoadingTime(0);
      setLoadingStage("Buscando en la base de datos de apuntes...");
      interval = setInterval(() => {
        setLoadingTime(prev => {
          const nextTime = prev + 1;
          if (nextTime === 3) {
            setLoadingStage("Analizando programas oficiales y bibliografía...");
          } else if (nextTime === 6) {
            setLoadingStage("Procesando consulta con Inteligencia Artificial...");
          } else if (nextTime === 9) {
            setLoadingStage("Redactando respuesta estructurada...");
          } else if (nextTime === 13) {
            setLoadingStage("Finalizando síntesis...");
          }
          return nextTime;
        });
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoadingResponse]);


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

  // Scroll to bottom of message list container only (prevents page kicking/scrolling down)
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoadingResponse]);

  const enviarPregunta = async (texto: string) => {
    if (!texto.trim()) {
      toast.error("Por favor, ingresa tu pregunta.");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: texto,
      materia: selectedMateria || undefined,
      catedra: selectedCatedra || undefined,
      comision: selectedComision || undefined
    };

    // Obtenemos el historial excluyendo mensajes vacíos o temporales
    const historialValido = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    setMessages(prev => [...prev, userMessage]);
    setPregunta("");
    setIsLoadingResponse(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://api.dndjursoc.com.ar").replace(/\/$/, "");
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

      const res = await fetch(`${supabaseUrl}/functions/v1/asistente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`,
          "apikey": supabaseAnonKey
        },
        body: JSON.stringify({
          pregunta: userMessage.content,
          materia: userMessage.materia || "General / Dudas de la web",
          catedra: userMessage.catedra || "",
          comision: userMessage.comision || "",
          historial: historialValido
        })
      });

      if (!res.ok) {
        let errJson: any;
        try {
          errJson = await res.json();
        } catch (e) {}
        throw new Error(errJson?.error || errJson?.detalles || `Error de servidor (${res.status})`);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = "";
        let buffer = "";
        let isFirstToken = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith(":")) continue;

            if (trimmedLine.startsWith("data: ")) {
              const dataStr = trimmedLine.replace(/^data:\s*/, "");
              if (dataStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(dataStr);
                const token = parsed.choices?.[0]?.delta?.content || "";
                if (token) {
                  accumulatedText += token;
                  if (isFirstToken) {
                    isFirstToken = false;
                    setIsLoadingResponse(false);
                    setMessages(prev => [
                      ...prev,
                      { role: "assistant", content: accumulatedText }
                    ]);
                  } else {
                    setMessages(prev => {
                      const newArr = [...prev];
                      newArr[newArr.length - 1] = {
                        role: "assistant",
                        content: accumulatedText
                      };
                      return newArr;
                    });
                  }
                }
              } catch (e) {
                // Parciales ignorados
              }
            }
          }
        }
      } else {
        const data = await res.json();
        setIsLoadingResponse(false);
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.respuesta }
        ]);
      }
    } catch (err: any) {
      console.error("Error al obtener respuesta del asistente:", err);
      toast.error("Ocurrió un error en la consulta.");
      setIsLoadingResponse(false);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `❌ **Error de conexión:**\n\n${err.message || "Error al procesar consulta."}`
        }
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviarPregunta(pregunta);
  };

  const handleSugerenciaClick = (sug: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para usar el Asistente.");
      return;
    }
    enviarPregunta(sug);
  };

  const handleFeedback = (idx: number, type: "up" | "down") => {
    setFeedbackState(prev => ({ ...prev, [idx]: type }));
    if (type === "up") {
      toast.success("¡Gracias por tu valoración!");
    } else {
      openCorrectionModal(idx);
    }
  };

  const openCorrectionModal = (idx: number) => {
    const msg = messages[idx];
    if (!msg || msg.role !== "assistant") return;
    setCorrectionMsgIndex(idx);

    const cleanIndex = msg.content.indexOf("[SUGERENCIAS]:");
    const initialText = cleanIndex === -1 ? msg.content.trim() : msg.content.substring(0, cleanIndex).trim();
    setCorrectionInputText(initialText);
    setIsCorrectionModalOpen(true);
  };

  const handleSaveCorrection = async () => {
    if (correctionMsgIndex === null) return;
    const msg = messages[correctionMsgIndex];
    const prevUserMsg = correctionMsgIndex > 0 ? messages[correctionMsgIndex - 1] : null;

    const preguntaOriginal = prevUserMsg?.content || "Consulta de materia";
    const materiaRef = selectedMateria || prevUserMsg?.materia || "General / Dudas de la web";

    if (!correctionInputText.trim()) {
      toast.error("Por favor ingresa el texto corregido.");
      return;
    }

    const isAdmin = profile?.role === "admin" || profile?.role === "escritor";

    setIsSavingCorrection(true);
    try {
      const { error } = await supabase.from("asistente_correcciones").insert({
        materia: materiaRef,
        catedra: selectedCatedra || null,
        comision: selectedComision || null,
        pregunta_original: preguntaOriginal,
        respuesta_original: msg.content,
        respuesta_corregida: correctionInputText.trim(),
        creado_por: user?.id || null,
        aprobado: isAdmin
      });

      if (error) throw error;

      if (isAdmin) {
        toast.success("¡Corrección guardada y aprobada! El Asistente DND aprenderá esta respuesta oficial para futuras consultas.");
      } else {
        toast.success("¡Gracias! Tu sugerencia fue enviada para ser revisada y aprobada por los administradores.");
      }
      
      // Actualizar mensaje en la interfaz
      setMessages(prev => prev.map((m, i) => i === correctionMsgIndex ? { ...m, content: correctionInputText.trim() } : m));
      setIsCorrectionModalOpen(false);
    } catch (err: any) {
      console.error("Error al guardar corrección:", err);
      toast.error("No se pudo guardar la corrección: " + (err.message || "Error de servidor"));
    } finally {
      setIsSavingCorrection(false);
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
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Asistente DND
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-sm md:text-base mt-2 max-w-2xl font-medium">
            Tutor académico universitario integrado con el repositorio de apuntes de Drive y la web.
            Pregunta sobre conceptos de tus materias, el permutero, apuntes o herramientas del sitio.
          </p>
        </div>
        
        <a 
          href="https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 py-2.5 px-4 rounded-xl transition-all self-start md:self-center"
        >
          Ver Drive Oficial <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Sidebar de Configuración */}
        <Card className={`lg:col-span-4 p-5 bg-white dark:bg-[#0D1224]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col justify-between h-fit gap-6 shadow-xl ${showConfig ? "block" : "hidden lg:flex"}`}>
          <div className="space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" /> Configuración de Estudio
            </h3>
            
            <div className="space-y-4">
              {/* Selector de Materias */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest">Materia (Opcional)</label>
                {loadingMaterias ? (
                  <div className="h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl flex items-center justify-center text-xs text-slate-400 dark:text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Cargando materias...
                  </div>
                ) : (
                  <select
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="w-full bg-white dark:bg-background/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all cursor-pointer"
                  >
                    <option value="" className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">-- General / Ninguna --</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.nombre} className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">
                        {m.nombre} ({m.anio}° Año)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selector de Cátedra */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                  Cátedra <HelpCircle className="h-3 w-3 text-slate-400 dark:text-white/30" title="Las cátedras a veces piden contenidos distintos." />
                </label>
                <select
                  value={selectedCatedra}
                  onChange={(e) => setSelectedCatedra(e.target.value)}
                  className="w-full bg-white dark:bg-background/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all cursor-pointer"
                >
                  <option value="" className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">Cátedra General / No sé</option>
                  <option value="1" className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">Cátedra 1</option>
                  <option value="2" className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">Cátedra 2</option>
                  <option value="3" className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">Cátedra 3</option>
                  <option value="Única" className="text-slate-800 dark:text-white dark:bg-[#0A0E1A]">Cátedra Única</option>
                </select>
              </div>

              {/* Selector de Comisión */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest">Comisión</label>
                <input
                  type="text"
                  placeholder="Ej: 1, 4, A..."
                  value={selectedComision}
                  onChange={(e) => setSelectedComision(e.target.value)}
                  className="w-full bg-white dark:bg-background/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Información RAG */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-150 dark:border-white/5 rounded-xl p-4 space-y-2 text-xs text-slate-600 dark:text-white/70">
            <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-1 text-accent">
              <Bot className="h-4 w-4 text-accent" /> Aprendizaje de Cátedras
            </div>
            <p className="leading-relaxed font-medium">
              El asistente procesa información de la materia y de los apuntes correspondientes a tu cátedra y comisión.
              Esto permite adaptar la respuesta según el profesor a cargo.
            </p>
          </div>
        </Card>

        {/* Panel del Chat */}
        <Card className="lg:col-span-8 bg-white dark:bg-[#0D1224]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col h-[520px] md:h-[630px] overflow-hidden shadow-xl">
          
          {/* Header del Chat */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#10162D] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Tutoría & Asistente DND</div>
                <div className="text-[10px] text-slate-550 dark:text-white/40 uppercase tracking-wider font-bold">
                  {selectedMateria ? `Estudiando ${selectedMateria}` : "Tutor general de la web"}
                </div>
              </div>
            </div>

            {/* Toggle Configuración Móvil */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="lg:hidden px-3.5 py-1.5 rounded-xl border border-slate-250 dark:border-white/10 text-xs font-bold text-slate-750 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
            >
              <span>⚙️</span>
              <span>{showConfig ? "Ocultar" : "Configurar"}</span>
            </button>
          </div>

          {/* Si el usuario NO está registrado, se bloquea el chat */}
          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 bg-slate-50/50 dark:bg-black/10">
              <div className="h-16 w-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Lock className="h-8 w-8 text-accent animate-pulse" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-slate-800 dark:text-white font-black text-lg">Área Protegida</h3>
                <p className="text-slate-550 dark:text-white/50 text-sm leading-relaxed font-semibold">
                  Para conversar con el **Tutor Virtual DND** e interactuar con la Inteligencia Artificial académica de la web, necesitas registrarte o iniciar sesión con tu cuenta de alumno.
                </p>
              </div>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full font-bold shadow-lg shadow-accent/25 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <Link to="/auth?redirect=/asistente">
                  Registrarse / Iniciar Sesión
                </Link>
              </Button>
            </div>
          ) : !isAdmin ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 bg-slate-50/50 dark:bg-black/10">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Wrench className="h-8 w-8 text-amber-500 animate-pulse" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-slate-800 dark:text-white font-black text-lg">Asistente IA en Mantenimiento</h3>
                <p className="text-slate-550 dark:text-white/50 text-sm leading-relaxed font-semibold">
                  Estamos realizando tareas de mantenimiento y actualización en el **Tutor Virtual DND** para ofrecerte respuestas más rápidas y precisas. Volverá a estar disponible para todos los estudiantes muy pronto.
                </p>
              </div>
              <Button asChild size="lg" className="bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold shadow-md cursor-pointer transition-all">
                <Link to="/">
                  Volver al Inicio
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Historial de Mensajes */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-black/10">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
                    <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center">
                      <Bot className="h-7 w-7 text-accent/80" />
                    </div>
                    <div className="max-w-md space-y-1.5 font-medium">
                      <p className="text-slate-800 dark:text-white font-black text-sm">¡Pregúntale al Tutor IA!</p>
                      <p className="text-slate-550 dark:text-white/40 text-xs leading-relaxed max-w-sm mx-auto">
                        Haz consultas sobre apuntes de estudio, bibliografía o sobre cualquier herramienta de esta web.
                      </p>
                    </div>

                    {/* Preguntas sugeridas de la página */}
                    <div className="pt-2 max-w-md w-full">
                      <p className="text-[10px] uppercase tracking-wider text-accent font-black mb-3">Preguntas sugeridas sobre la web:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                        {[
                          "¿Cómo funciona el Permutero para cambiar de comisión?",
                          "¿Dónde busco y descargo los apuntes y programas?",
                          "¿Cómo sincronizo el calendario con mi celular?",
                          "¿Qué herramientas y secciones tiene esta página?"
                        ].map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSugerenciaClick(sug)}
                            className="text-xs bg-slate-100 hover:bg-accent/15 dark:bg-white/5 dark:hover:bg-accent/20 border border-slate-200 dark:border-white/10 hover:border-accent/30 text-slate-700 dark:text-white/80 hover:text-accent dark:hover:text-white p-3 rounded-xl transition-all duration-200 text-left font-medium active:scale-[0.98] shadow-sm flex items-start gap-2 cursor-pointer"
                          >
                            <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                        msg.role === "user" ? "bg-accent text-white" : "bg-slate-200 dark:bg-[#181F3B] border border-slate-300 dark:border-white/10 text-accent"
                      }`}>
                        {msg.role === "user" ? "U" : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed w-full overflow-hidden break-words ${
                        msg.role === "user" 
                          ? "bg-accent/10 dark:bg-accent/20 border border-accent/20 text-slate-900 dark:text-white rounded-tr-none" 
                          : "bg-slate-100 dark:bg-[#10162B] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white/90 rounded-tl-none"
                      }`}>
                        {msg.role === "user" ? (
                          <div className="space-y-2 whitespace-pre-wrap font-medium">
                            {msg.content}
                          </div>
                        ) : (
                          (() => {
                            // Función auxiliar local para extraer sugerencias
                            const index = msg.content.indexOf("[SUGERENCIAS]:");
                            const cleanContent = index === -1 ? msg.content.trim() : msg.content.substring(0, index).trim();
                            const sugerenciasRaw = index === -1 ? "" : msg.content.substring(index + "[SUGERENCIAS]:".length).trim();
                            const sugerencias = sugerenciasRaw
                              .split("|")
                              .map(s => s.trim())
                              .filter(s => s.length > 0);
                            const isLastMessage = idx === messages.length - 1;

                            const sanitizedContent = cleanContent
                              .replace(/\]\s+\(/g, '](')
                              .replace(/`\[(.*?)\]\((.*?)\)`/g, '[$1]($2)');

                            return (
                              <div className="space-y-3">
                                <MarkdownRenderer content={sanitizedContent} />
                                
                                {/* Botones de Feedback y Corrección en tiempo real */}
                                <div className="pt-2.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2 flex-wrap text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleFeedback(idx, "up")}
                                      title="Esta respuesta es útil y correcta"
                                      className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                                        feedbackState[idx] === "up"
                                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                          : "bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/5 text-slate-600 dark:text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10"
                                      }`}
                                    >
                                      <ThumbsUp size={12} />
                                      <span>Útil</span>
                                    </button>
                                    
                                    <button
                                      onClick={() => handleFeedback(idx, "down")}
                                      title="Respuesta inexacta - Corregir"
                                      className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                                        feedbackState[idx] === "down"
                                          ? "bg-red-500/20 text-red-400 border-red-500/40"
                                          : "bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/5 text-slate-600 dark:text-white/60 hover:text-red-400 hover:bg-red-500/10"
                                      }`}
                                    >
                                      <ThumbsDown size={12} />
                                      <span>Inexacta</span>
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => openCorrectionModal(idx)}
                                    className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 py-1 px-2 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/20 transition-all cursor-pointer"
                                  >
                                    <Edit3 size={11} /> Corregir Respuesta en Tiempo Real
                                  </button>
                                </div>

                                {isLastMessage && sugerencias.length > 0 && (
                                  <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
                                    <p className="text-[10px] uppercase tracking-wider text-accent font-black flex items-center gap-1.5">
                                      <Sparkles className="h-3 w-3 text-accent animate-pulse" /> Preguntas de seguimiento sugeridas:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {sugerencias.map((sug, sIdx) => (
                                        <button
                                          key={sIdx}
                                          onClick={() => handleSugerenciaClick(sug)}
                                          className="text-xs bg-slate-200/60 hover:bg-accent/10 dark:bg-white/5 dark:hover:bg-accent/20 border border-slate-300/60 dark:border-white/10 hover:border-accent/30 text-slate-700 dark:text-white/80 hover:text-accent dark:hover:text-white px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer text-left font-medium active:scale-95"
                                        >
                                          {sug}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        )}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Animación de Pensando / Cargando */}
                {isLoadingResponse && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="h-8 w-8 rounded-full shrink-0 bg-slate-200 dark:bg-[#181F3B] border border-slate-300 dark:border-white/10 flex items-center justify-center text-accent">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#10162B] border border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/40 text-xs flex flex-col gap-1.5 rounded-tl-none font-medium">
                      <span className="text-slate-800 dark:text-white font-bold flex items-center gap-1.5">
                        Tutor DND IA
                      </span>
                      <span className="text-slate-555 dark:text-white/50 flex items-center gap-1.5 leading-relaxed">
                        {loadingStage} <span className="font-bold text-accent">({loadingTime}s)</span>
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Formulario de Envío */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-[#10162D]/60 shrink-0 flex gap-2">
                <input
                  type="text"
                  placeholder={selectedMateria ? `Escribe tu pregunta sobre ${selectedMateria}...` : "Escribe tu pregunta sobre la web o materias..."}
                  disabled={isLoadingResponse}
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  className="flex-1 bg-white dark:bg-background/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 transition-all placeholder:text-slate-400 dark:placeholder:text-white/20"
                />
                <Button 
                  type="submit" 
                  disabled={!pregunta.trim() || isLoadingResponse}
                  className="bg-accent hover:bg-accent/90 text-white rounded-xl p-3 shrink-0 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}

        </Card>
      </div>

      {/* Modal de Corrección en Tiempo Real */}
      <Dialog open={isCorrectionModalOpen} onOpenChange={setIsCorrectionModalOpen}>
        <DialogContent className="max-w-xl bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Edit3 className="text-accent h-5 w-5" /> Corregir Respuesta del Asistente
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Ingresa la respuesta oficial o directriz corregida. El bot aprenderá esta respuesta de inmediato para responder con máxima precisión en futuras consultas de esta materia.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="p-3 bg-muted/40 rounded-xl border text-xs space-y-1">
              <span className="font-bold text-accent uppercase tracking-wider block text-[10px]">Pregunta del Estudiante:</span>
              <p className="text-foreground font-medium">
                {correctionMsgIndex !== null && correctionMsgIndex > 0 ? messages[correctionMsgIndex - 1]?.content : "Consulta general"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Respuesta Oficial Corregida (Instrucción para la IA)</Label>
              <Textarea 
                rows={6}
                value={correctionInputText}
                onChange={(e) => setCorrectionInputText(e.target.value)}
                placeholder="Escribe aquí la respuesta exacta o directriz oficial que debe dar el bot..."
                className="bg-background border border-border text-xs rounded-xl p-3 focus:ring-accent font-medium leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setIsCorrectionModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveCorrection}
              disabled={isSavingCorrection || !correctionInputText.trim()}
              className="bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl px-5 h-10 flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isSavingCorrection ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 size={16} />}
              Guardar y Re-entrenar Bot
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
