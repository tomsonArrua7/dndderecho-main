import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Plus, Trash2, Bell, Copy, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  parcial: "bg-red-500/10 text-red-400 border border-red-500/20",
  final: "bg-purple-550/10 text-purple-400 border border-purple-550/20",
  entrega: "bg-amber-500/10 text-amber-400 border border-amber-550/20",
  clase: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  otro: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
};

const chipStyle: Record<string, string> = {
  parcial: "bg-red-500/10 text-red-400 border-red-500/20",
  final: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entrega: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  clase: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  otro: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const truncateTitle = (t: string) => {
  return t.length > 12 ? t.slice(0, 10) + "..." : t;
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
  const [showSyncDialog, setShowSyncDialog] = useState(false);

  // Month navigation state
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Detail day dialog state
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Inline inputs state
  const [inlineFecha, setInlineFecha] = useState("");
  const [inlineTitulo, setInlineTitulo] = useState("");
  const [inlineTipo, setInlineTipo] = useState<Evento["tipo"]>("parcial");

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
      if (nextState) {
        setShowSyncDialog(true);
      }
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

  const submitInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inlineTitulo.trim() || !inlineFecha) return;
    
    // Almacenamos al mediodía local para evitar desfases de zona horaria al formatear
    const localDate = new Date(inlineFecha + "T12:00:00");

    const { error } = await supabase.from("eventos").insert({
      user_id: user.id,
      titulo: inlineTitulo.trim().slice(0, 120),
      descripcion: null,
      tipo: inlineTipo,
      fecha: localDate.toISOString(),
      es_global: false,
    });

    if (error) {
      console.error("Error saving event:", error);
      toast.error("No se pudo guardar");
      return;
    }

    toast.success("Fecha agregada");
    setInlineTitulo("");
    setInlineFecha("");
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
    toast.success("Evento eliminado");
  };

  const getGoogleCalendarLink = (e: Evento) => {
    const start = new Date(e.fecha).toISOString().replace(/-|:|\.\d+/g, "");
    const end = new Date(new Date(e.fecha).getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, ""); // +1 hour
    const details = e.descripcion || "Evento de DND Derecho";
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.titulo)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=Facultad+de+Derecho+UNLP&sf=true&output=xml`;
  };

  // Month navigation math
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthLabel = currentDate.toLocaleString("es", { month: "long" });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const currentYear = currentDate.getFullYear();

  const gridDays = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    const firstDay = new Date(y, m, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 is Sun, 1 is Mon...
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevMonthDays = new Date(y, m, 0).getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(y, m - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(y, m, i),
        isCurrentMonth: true
      });
    }

    // Next month padding
    const totalCells = days.length <= 35 ? 35 : 42;
    const nextMonthDaysToAdd = totalCells - days.length;
    for (let i = 1; i <= nextMonthDaysToAdd; i++) {
      days.push({
        date: new Date(y, m + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentDate]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return eventos.filter(e => isSameDay(new Date(e.fecha), selectedDay));
  }, [selectedDay, eventos]);

  const upcoming = eventos.filter((e) => new Date(e.fecha) >= new Date(Date.now() - 86400000));
  const past = eventos.filter((e) => new Date(e.fecha) < new Date(Date.now() - 86400000));

  return (
    <div className="container py-12 max-w-4xl space-y-12">
      
      {/* Title Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Tu agenda</div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">Calendario académico</h1>
          <p className="text-muted-foreground mt-2">Gestioná tus cursadas, entregas y exámenes.</p>
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
      <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-elegant transition-all">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
            <Bell className={`h-4 w-4 ${suscripto ? "text-accent fill-accent/10" : "text-muted-foreground"}`} />
            🔔 Avisos Fundamentales de DND
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            Suscribite para ver automáticamente en tu agenda los avisos oficiales de la agrupación (inscripción a cursadas, fechas clave, clases de apoyo).
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

      {/* MONTHLY CALENDAR GRID BLOCK */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-elegant space-y-6">
        
        {/* Calendar Title & Month Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Calendario de cursada</h2>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Año lectivo {currentYear}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8 rounded-lg border-border hover:bg-white/5"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <span className="font-serif text-base font-bold text-foreground min-w-32 text-center uppercase tracking-wide">
              {capitalizedMonth} {currentYear}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 rounded-lg border-border hover:bg-white/5"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Weekday Columns Headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
              <div key={day} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {gridDays.map((cell, idx) => {
              const dayEvents = eventos.filter(e => isSameDay(new Date(e.fecha), cell.date));
              const isToday = isSameDay(new Date(), cell.date);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDay(cell.date);
                  }}
                  className={cn(
                    "min-h-[76px] p-2 rounded-xl border flex flex-col justify-between transition-all relative cursor-pointer select-none",
                    !cell.isCurrentMonth
                      ? "bg-transparent border-transparent opacity-20 pointer-events-none"
                      : isToday
                        ? "bg-accent border-accent text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                  )}
                >
                  {/* Day number */}
                  <span className={cn(
                    "text-[10px] font-bold self-end",
                    isToday ? "text-white" : "text-white/40"
                  )}>
                    {cell.date.getDate()}
                  </span>

                  {/* Day Events chips list */}
                  <div className="flex flex-col gap-1 w-full overflow-hidden mt-1.5">
                    {dayEvents.slice(0, 2).map(e => (
                      <div
                        key={e.id}
                        className={cn(
                          "text-[8px] font-bold px-1.5 py-0.5 rounded truncate border text-center select-none",
                          isToday 
                            ? "bg-white/20 text-white border-white/30" 
                            : chipStyle[e.tipo] || chipStyle.otro
                        )}
                      >
                        {truncateTitle(e.titulo)}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className={cn("text-[7px] font-bold pl-1 mt-0.5", isToday ? "text-white/80" : "text-white/30")}>
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend overlays */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-white/5 text-[9px] font-bold uppercase tracking-wider text-white/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Hoy
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Día de Cursada
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Parcial
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> TP
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Calendario académico
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Examen Final
          </div>
        </div>

        {/* INLINE AGREGAR EVENTO FORM */}
        <form onSubmit={submitInline} className="pt-6 border-t border-white/5 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Plus size={14} className="text-emerald-500" /> Agregar fecha importante
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-full md:w-44">
              <Input
                type="date"
                required
                value={inlineFecha}
                onChange={(e) => setInlineFecha(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 h-10 rounded-xl focus:border-accent"
              />
            </div>
            
            <div className="w-full flex-1">
              <Input
                type="text"
                placeholder="Descripción del evento..."
                required
                maxLength={120}
                value={inlineTitulo}
                onChange={(e) => setInlineTitulo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-xs placeholder:text-white/20 h-10 rounded-xl focus:border-accent"
              />
            </div>

            <div className="w-full md:w-44">
              <Select value={inlineTipo} onValueChange={(v: any) => setInlineTipo(v)}>
                <SelectTrigger className="w-full bg-white/5 border border-white/10 text-xs h-10 rounded-xl focus:border-accent">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border border-white/15">
                  <SelectItem value="clase">Día de Cursada</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="entrega">TP (Entrega)</SelectItem>
                  <SelectItem value="otro">Calendario Académico</SelectItem>
                  <SelectItem value="final">Examen Final</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus size={18} />
            </Button>
          </div>
        </form>
      </div>

      {/* Upcomming list sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title="Próximos eventos" eventos={upcoming} onRemove={remove} onAddCalendar={getGoogleCalendarLink} isAdminOrWriter={isAdminOrWriter} />
        <Section title="Eventos pasados" eventos={past} onRemove={remove} onAddCalendar={getGoogleCalendarLink} muted isAdminOrWriter={isAdminOrWriter} />
      </div>

      {/* Day Events detail modal dialog */}
      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="bg-slate-950 border border-white/10 text-white rounded-2xl p-6 max-w-md shadow-[0_0_50px_rgba(0,0,0,0.4)]">
          <DialogHeader>
            <div className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold mb-1">Detalle del Día</div>
            <DialogTitle className="font-serif text-xl font-bold text-red-200">
              {selectedDay?.toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[360px] overflow-y-auto pr-2">
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-xs">
                No hay eventos cargados para esta fecha.
              </div>
            ) : (
              selectedDayEvents.map(e => (
                <div key={e.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 shadow-paper">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase font-mono tracking-wider", tipoColor[e.tipo])}>
                        {e.tipo}
                      </span>
                      {e.es_global && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded border bg-red-650/20 border-red-500/30 text-red-400 font-bold uppercase font-mono tracking-wider">
                          Aviso DND
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-white leading-normal truncate">{e.titulo}</h4>
                    {e.descripcion && <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{e.descripcion}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="icon" variant="ghost" asChild title="Agregar a Google Calendar" className="h-8 w-8 hover:bg-white/5 rounded-lg">
                      <a href={getGoogleCalendarLink(e)} target="_blank" rel="noopener noreferrer">
                        <Calendar className="h-4 w-4 text-accent" />
                      </a>
                    </Button>
                    {(!e.es_global || isAdminOrWriter) && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={async () => {
                          await remove(e.id);
                          // Si es el día seleccionado, forzamos cierre para refrescar o actualizamos estado
                        }} 
                        title="Eliminar"
                        className="h-8 w-8 hover:bg-red-500/10 text-red-400/80 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

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
  <div className="space-y-4">
    <h2 className="font-display text-lg font-bold text-foreground uppercase tracking-wider">{title}</h2>
    {eventos.length === 0 ? (
      <div className="p-8 rounded-2xl border border-dashed border-border bg-card/40 text-center text-muted-foreground text-xs font-medium">
        Sin eventos registrados.
      </div>
    ) : (
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {eventos.slice(0, 8).map((e) => {
          const d = new Date(e.fecha);
          return (
            <div key={e.id} className={cn("p-4 rounded-xl bg-card border border-border shadow-paper flex items-center gap-4 transition-all hover:border-white/10", muted && "opacity-60")}>
              <div className="text-center min-w-[50px] border-r border-border pr-4 shrink-0">
                <div className="text-xl font-display font-bold text-primary leading-none">{d.getDate()}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold mt-1">{d.toLocaleString("es", { month: "short" })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider font-mono", tipoColor[e.tipo])}>{e.tipo}</span>
                  {e.es_global && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded border bg-red-650/20 border-red-500/30 text-red-400 font-bold uppercase tracking-wider font-mono">
                      Aviso DND
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono">{d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="font-bold text-xs truncate text-foreground leading-snug">{e.titulo}</div>
                {e.descripcion && <div className="text-[10px] text-muted-foreground truncate mt-0.5">{e.descripcion}</div>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="icon" variant="ghost" asChild title="Agregar a Google Calendar" className="h-8 w-8 hover:bg-white/5 rounded-lg">
                  <a href={onAddCalendar(e)} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                  </a>
                </Button>
                {(!e.es_global || isAdminOrWriter) && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onRemove(e.id)} 
                    title="Eliminar" 
                    className="h-8 w-8 hover:bg-red-500/10 text-red-400/85 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
