import { useEffect, useState, useMemo } from "react";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Scale,
  CalendarPlus,
  ExternalLink,
  PartyPopper,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { academicDates, type AcademicDate, type CategoryKey } from "@/data/academicDates";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// ── Category metadata ─────────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  CategoryKey,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  inscripcion: {
    label: "Calendario Académico",
    icon: ClipboardList,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/25",
  },
  examen: {
    label: "Examen",
    icon: GraduationCap,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/25",
  },
  feria: {
    label: "Feria Judicial",
    icon: Scale,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
  },
  agrupacion: {
    label: "Aviso DND",
    icon: Megaphone,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/25",
  },
  cuatrimestre: {
    label: "Cursada / TP",
    icon: CalendarDays,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseDate(iso: string): Date {
  if (iso.includes("T")) return new Date(iso);
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = parseDate(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

function formatDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

function downloadICS(event: AcademicDate) {
  const fmt = (iso: string) => iso.replace(/-/g, "").replace(/:/g, "").split(".")[0];
  const start = fmt(event.date);
  const end = event.dateEnd ? fmt(event.dateEnd) : start;
  const desc = (event.description ?? "").replace(/\n/g, "\\n");
  const loc = event.location ?? "Facultad de Derecho UNLP";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DND Derecho UNLP//ES",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${start.slice(0, 8)}`,
    `DTEND;VALUE=DATE:${end.slice(0, 8)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `UID:${event.id}@dndjursoc.com.ar`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function openGoogleCalendar(event: AcademicDate) {
  const fmt = (iso: string) => iso.replace(/-/g, "").replace(/:/g, "").split(".")[0];
  const start = fmt(event.date);
  const end = event.dateEnd ? fmt(event.dateEnd) : start;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? "",
    location: event.location ?? "Facultad de Derecho UNLP",
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
}

function UrgencyBadge({ days }: { days: number }) {
  if (days < 0) return null;
  if (days <= 2) {
    return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-[9px] font-black uppercase">
        {days === 0 ? "¡Hoy!" : days === 1 ? "Mañ." : "2d"}
      </span>
    );
  }
  return null;
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: AcademicDate }) {
  const meta = CATEGORY_META[event.category] || CATEGORY_META.agrupacion;
  const Icon = meta.icon;
  const days = daysUntil(event.date);
  const isUrgent = days >= 0 && days <= 2;

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-300 w-full h-full",
        isUrgent
          ? "bg-accent/5 border-accent/30"
          : "bg-white/[0.03] border-white/8 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg border", meta.bg, meta.border)}>
          <Icon size={14} className={meta.color} />
        </div>
        <UrgencyBadge days={days} />
      </div>

      <div>
        <h3 className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-[11px] font-medium text-white/40">
          {formatDate(event.date)}
        </p>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center gap-4 py-8 px-4 w-full justify-center">
      <PartyPopper className="w-5 h-5 text-white/20" />
      <p className="text-xs font-medium text-white/40">Sin fechas próximas registradas</p>
    </div>
  );
}

export function UpcomingDates() {
  const [dbEvents, setDbEvents] = useState<AcademicDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobalEvents() {
      try {
        const yesterdayIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from("eventos")
          .select("*")
          .eq("es_global", true)
          .gte("fecha", yesterdayIso)
          .order("fecha", { ascending: true })
          .limit(6);

        if (!error && data) {
          const mapped: AcademicDate[] = data.map((e) => {
            let category: CategoryKey = "agrupacion";
            if (e.tipo === "parcial" || e.tipo === "final") category = "examen";
            else if (e.tipo === "entrega" || e.tipo === "clase") category = "cuatrimestre";
            else if (e.tipo === "academico") category = "inscripcion";

            return {
              id: e.id,
              category,
              title: e.titulo,
              description: e.descripcion || undefined,
              date: e.fecha,
              location: "Facultad de Derecho UNLP",
            };
          });
          setDbEvents(mapped);
        }
      } catch (err) {
        console.error("Error fetching global events for widget:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalEvents();
  }, []);

  const combinedDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter static dates to only future ones
    const staticFuture = academicDates.filter(
      (e) => parseDate(e.dateEnd ?? e.date) >= today
    );

    // Merge DB events and static future dates (DB events take precedence if IDs overlap)
    const dbIds = new Set(dbEvents.map((e) => e.id));
    const merged = [...dbEvents, ...staticFuture.filter((e) => !dbIds.has(e.id))];

    return merged
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .slice(0, 4);
  }, [dbEvents]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
            Próximas Fechas
          </h2>
        </div>
        <Link to="/calendario" className="text-[9px] font-bold uppercase tracking-widest text-accent/60 hover:text-accent transition-colors flex items-center gap-1">
          Ver todo <ChevronRight size={10} />
        </Link>
      </div>

      {/* Grid 2-col siempre — sin scroll horizontal */}
      <div className="grid grid-cols-2 gap-3">
        {loading ? (
          <div className="py-6 text-center text-xs text-white/30 col-span-2">
            Cargando fechas...
          </div>
        ) : combinedDates.length === 0 ? (
          <div className="col-span-2">
            <EmptyState />
          </div>
        ) : (
          combinedDates.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </section>
  );
}
