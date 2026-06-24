import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Trash2, Bell, Download, Minimize2, Maximize2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: "parcial" | "final" | "entrega" | "clase" | "otro";
  fecha: string;
  es_global: boolean;
  user_id: string;
}

const tipoColor: Record<string, string> = {
  parcial: "bg-accent/10 text-accent border-accent/40",
  final: "bg-accent/10 text-accent border-accent/40",
  entrega: "bg-warning/10 text-warning border-warning/40",
  clase: "bg-primary/10 text-primary border-primary/40",
  otro: "bg-secondary text-muted-foreground border-border",
};

const Calendario = () => {
  const { user, profile } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<Evento["tipo"]>("parcial");
  const [fecha, setFecha] = useState("");
  const [esGlobal, setEsGlobal] = useState(false);
  const [suscripto, setSuscripto] = useState(false);

  const isAdminOrWriter = profile?.role === "admin" || profile?.role === "escritor";

  const fetchSubscription = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("suscripto_calendario")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching subscription:", error);
      return;
    }
    if (data) {
      setSuscripto(data.suscripto_calendario);
    }
  };

  const fetchEventos = async () => {
    if (!user) return;
    let query = supabase.from("eventos").select("*");

    if (suscripto) {
      query = query.or(`user_id.eq.${user.id},es_global.eq.true`);
    } else {
      query = query.eq("user_id", user.id).eq("es_global", false);
    }

    const { data } = await query.order("fecha");
    setEventos((data as Evento[]) || []);
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  useEffect(() => {
    fetchEventos();
  }, [user, suscripto]);

  const toggleSubscription = async () => {
    if (!user) return;
    const nextState = !suscripto;
    setSuscripto(nextState);
    const { error } = await supabase
      .from("profiles")
      .update({ suscripto_calendario: nextState })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating subscription:", error);
      toast.error("No se pudo actualizar la suscripción");
      setSuscripto(!nextState);
    } else {
      toast.success(
        nextState 
          ? "Te suscribiste a los Avisos Fundamentales de DND" 
          : "Te desuscribiste de los Avisos Fundamentales"
      );
      fetchEventos();
    }
  };

  const copySyncLink = () => {
    const link = "https://api.dndjursoc.com.ar/functions/v1/calendario-ics";
    navigator.clipboard.writeText(link);
    toast.success("Enlace de calendario copiado al portapapeles. Pégalo en tu aplicación de calendario preferida.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !titulo.trim() || !fecha) return;
    const { error } = await supabase.from("eventos").insert({
      user_id: user.id,
      titulo: titulo.trim().slice(0, 120),
      descripcion: descripcion.trim().slice(0, 500) || null,
      tipo,
      fecha: new Date(fecha).toISOString(),
      es_global: esGlobal && isAdminOrWriter,
    });
    if (error) {
      console.error("Error saving event:", error);
      toast.error("No se pudo guardar");
      return;
    }
    toast.success("Evento agregado");
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setTipo("parcial");
    setEsGlobal(false);
    setOpen(false);
    fetchEventos();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) {
      console.error("Error removing event:", error);
      toast.error("No se pudo eliminar el evento");
      return;
    }
    setEventos((e) => e.filter((x) => x.id !== id));
  };

  const getGoogleCalendarLink = (e: Evento) => {
    const start = new Date(e.fecha).toISOString().replace(/-|:|\.\d+/g, "");
    const end = new Date(new Date(e.fecha).getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, ""); // +1 hour
    const details = e.descripcion || "Evento de DND Derecho";
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.titulo)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=Facultad+de+Derecho+UNLP&sf=true&output=xml`;
  };

  const upcoming = eventos.filter((e) => new Date(e.fecha) >= new Date(Date.now() - 86400000));
  const past = eventos.filter((e) => new Date(e.fecha) < new Date(Date.now() - 86400000));

  return (
    <div className="container py-12 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Tu agenda</div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">Calendario académico</h1>
          <p className="text-muted-foreground mt-2">Parciales, finales y entregas — en un solo lugar.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="lg"><Plus className="mr-2 h-4 w-4" /> Nuevo evento</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-border">
            <DialogHeader><DialogTitle className="font-display text-2xl">Agregar evento</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} required maxLength={120} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                      <SelectItem value="clase">Clase</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha y hora</Label>
                  <Input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
              </div>
              
              {isAdminOrWriter && (
                <div className="flex items-center gap-2 py-2 border-t border-b border-border">
                  <input
                    type="checkbox"
                    id="esGlobal"
                    checked={esGlobal}
                    onChange={(e) => setEsGlobal(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
                  />
                  <Label htmlFor="esGlobal" className="cursor-pointer font-bold text-accent text-xs">
                    📢 Publicar como Aviso Fundamental (Aviso Global de DND)
                  </Label>
                </div>
              )}

              <div>
                <Label>Notas (opcional)</Label>
                <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={500} rows={3} />
              </div>
              <Button type="submit" variant="hero" className="w-full">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscription Card */}
      <div className="mb-10 p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-elegant transition-all">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
            <Bell className={`h-4 w-4 ${suscripto ? "text-accent fill-accent/10" : "text-muted-foreground"}`} />
            🔔 Avisos Fundamentales de DND
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            Suscribite para ver automáticamente en tu agenda los avisos oficiales de la agrupación (inscripción a cursadas, mesas de exámenes, clases de apoyo).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant={suscripto ? "outline" : "hero"}
            onClick={toggleSubscription}
            className="w-full sm:w-auto uppercase tracking-wider text-[10px] font-bold h-10 px-5"
          >
            {suscripto ? "Desuscribirse" : "Suscribirse"}
          </Button>
          {suscripto && (
            <>
              <a
                href="https://www.google.com/calendar/render?cid=webcal%3A%2F%2Fapi.dndjursoc.com.ar%2Ffunctions%2Fv1%2Fcalendario-ics"
                target="_blank"
                rel="noopener noreferrer"
                title="Sincronizar con Google Calendar en 1 clic"
                className="w-full sm:w-auto uppercase tracking-wider text-[10px] font-bold h-10 px-4 flex items-center justify-center gap-2 bg-background border border-border hover:bg-accent/10 hover:border-accent/40 rounded-lg text-foreground hover:text-accent transition-all cursor-pointer text-center"
              >
                <ExternalLink size={12} /> Sync Google Calendar
              </a>
              <Button
                variant="outline"
                onClick={copySyncLink}
                title="Copiar dirección pública del calendario"
                className="w-full sm:w-auto uppercase tracking-wider text-[10px] font-bold h-10 px-4 flex items-center gap-2"
              >
                <Copy size={12} /> Copiar enlace sync
              </Button>
            </>
          )}
        </div>
      </div>

      <Section title="Próximos" eventos={upcoming} onRemove={remove} onAddCalendar={getGoogleCalendarLink} isAdminOrWriter={isAdminOrWriter} />
      <Section title="Pasados" eventos={past} onRemove={remove} onAddCalendar={getGoogleCalendarLink} muted isAdminOrWriter={isAdminOrWriter} />
    </div>
  );
};

const Section = ({ 
  title, 
  eventos, 
  onRemove, 
  onAddCalendar, 
  muted, 
  isAdminOrWriter 
}: { 
  title: string; 
  eventos: Evento[]; 
  onRemove: (id: string) => void; 
  onAddCalendar: (e: Evento) => string; 
  muted?: boolean; 
  isAdminOrWriter: boolean;
}) => (
  <div className="mb-10">
    <h2 className="font-display text-xl font-semibold mb-3 text-foreground">{title}</h2>
    {eventos.length === 0 ? (
      <div className="p-8 rounded-xl border border-dashed border-border bg-card/40 text-center text-muted-foreground text-sm">
        Sin eventos {title.toLowerCase()}
      </div>
    ) : (
      <div className="space-y-2">
        {eventos.map((e) => {
          const d = new Date(e.fecha);
          return (
            <div key={e.id} className={`p-4 rounded-xl bg-card border border-border shadow-paper flex items-center gap-4 ${muted ? "opacity-60" : ""} transition-all`}>
              <div className="text-center min-w-[60px] border-r border-border pr-4">
                <div className="text-2xl font-display font-bold text-primary">{d.getDate()}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{d.toLocaleString("es", { month: "short" })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${tipoColor[e.tipo]}`}>{e.tipo}</span>
                  {e.es_global && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-accent/20 border-accent/40 text-accent font-bold uppercase tracking-wider">
                      Aviso DND
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="font-semibold truncate text-foreground">{e.titulo}</div>
                {e.descripcion && <div className="text-xs text-muted-foreground truncate">{e.descripcion}</div>}
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" asChild title="Agregar a Google Calendar">
                  <a href={onAddCalendar(e)} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 text-accent" />
                  </a>
                </Button>
                {(!e.es_global || isAdminOrWriter) && (
                  <Button size="icon" variant="ghost" onClick={() => onRemove(e.id)} title="Eliminar">
                    <Trash2 className="h-4 w-4 text-destructive/70" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default Calendario;
