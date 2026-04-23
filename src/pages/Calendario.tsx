import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: "parcial" | "final" | "entrega" | "clase" | "otro";
  fecha: string;
}

const tipoColor: Record<string, string> = {
  parcial: "bg-accent/10 text-accent border-accent/40",
  final: "bg-accent/10 text-accent border-accent/40",
  entrega: "bg-warning/10 text-warning border-warning/40",
  clase: "bg-primary/10 text-primary border-primary/40",
  otro: "bg-secondary text-muted-foreground border-border",
};

const Calendario = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<Evento["tipo"]>("parcial");
  const [fecha, setFecha] = useState("");

  const fetchEventos = async () => {
    if (!user) return;
    const { data } = await supabase.from("eventos").select("*").eq("user_id", user.id).order("fecha");
    setEventos((data as Evento[]) || []);
  };

  useEffect(() => { fetchEventos(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !titulo.trim() || !fecha) return;
    const { error } = await supabase.from("eventos").insert({
      user_id: user.id,
      titulo: titulo.trim().slice(0, 120),
      descripcion: descripcion.trim().slice(0, 500) || null,
      tipo,
      fecha: new Date(fecha).toISOString(),
    });
    if (error) { toast.error("No se pudo guardar"); return; }
    toast.success("Evento agregado");
    setTitulo(""); setDescripcion(""); setFecha(""); setTipo("parcial"); setOpen(false);
    fetchEventos();
  };

  const remove = async (id: string) => {
    await supabase.from("eventos").delete().eq("id", id);
    setEventos((e) => e.filter((x) => x.id !== id));
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
          <DialogContent className="bg-card">
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
              <div>
                <Label>Notas (opcional)</Label>
                <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={500} rows={3} />
              </div>
              <Button type="submit" variant="hero" className="w-full">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Section title="Próximos" eventos={upcoming} onRemove={remove} />
      <Section title="Pasados" eventos={past} onRemove={remove} muted />
    </div>
  );
};

const Section = ({ title, eventos, onRemove, muted }: { title: string; eventos: Evento[]; onRemove: (id: string) => void; muted?: boolean }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl font-semibold mb-3 text-foreground">{title}</h2>
    {eventos.length === 0 ? (
      <div className="p-8 rounded-xl border border-dashed border-border bg-card text-center text-muted-foreground text-sm">
        Sin eventos {title.toLowerCase()}
      </div>
    ) : (
      <div className="space-y-2">
        {eventos.map((e) => {
          const d = new Date(e.fecha);
          return (
            <div key={e.id} className={`p-4 rounded-xl bg-card border border-border shadow-paper flex items-center gap-4 ${muted ? "opacity-60" : ""}`}>
              <div className="text-center min-w-[60px] border-r border-border pr-4">
                <div className="text-2xl font-display font-bold text-primary">{d.getDate()}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{d.toLocaleString("es", { month: "short" })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${tipoColor[e.tipo]}`}>{e.tipo}</span>
                  <span className="text-xs text-muted-foreground">{d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="font-semibold truncate text-foreground">{e.titulo}</div>
                {e.descripcion && <div className="text-xs text-muted-foreground truncate">{e.descripcion}</div>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => onRemove(e.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default Calendario;
