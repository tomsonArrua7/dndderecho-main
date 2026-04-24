import { useMemo } from "react";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Scale,
  CalendarPlus,
  ExternalLink,
  Clock,
  PartyPopper,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { academicDates, type AcademicDate, type CategoryKey } from "@/data/academicDates";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ── Category metadata ─────────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  CategoryKey,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  inscripcion: {
    label: "Inscripción",
    icon: ClipboardList,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/25",
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
    label: "DND",
    icon: Megaphone,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/25",
  },
  cuatrimestre: {
    label: "Cuatrimestre",
    icon: CalendarDays,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = parseDate(iso);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

function formatDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

function downloadICS(event: AcademicDate) {
  const fmt = (iso: string) => iso.replace(/-/g, "");
  const start = fmt(event.date);
  const end = event.dateEnd ? fmt(event.dateEnd) : fmt(event.date);
  const desc = (event.description ?? "").replace(/\n/g, "\\n");
  const loc = event.location ?? "";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DND Derecho UNLP//ES",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `UID:${event.id}@dnd.derecho.unlp.edu.ar`,
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
  const fmt = (iso: string) => iso.replace(/-/g, "");
  const start = fmt(event.date);
  const end = event.dateEnd ? fmt(event.dateEnd) : fmt(event.date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? "",
    location: event.location ?? "",
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
  const meta = CATEGORY_META[event.category];
  const Icon = meta.icon;
  const days = daysUntil(event.date);
  const isUrgent = days >= 0 && days <= 2;

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 min-w-[160px] md:min-w-0 md:w-full h-full",
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

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            onClick={() => openGoogleCalendar(event)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all btn-app"
          >
            <CalendarPlus size={12} />
          </button>
          <button
            onClick={() => downloadICS(event)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all btn-app"
          >
            <ExternalLink size={12} />
          </button>
        </div>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            Link
          </a>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center gap-4 py-6 px-4">
      <PartyPopper className="w-5 h-5 text-white/20" />
      <p className="text-xs font-medium text-white/40">Sin fechas próximas</p>
    </div>
  );
}

export function UpcomingDates() {
  const sorted = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...academicDates]
      .filter((e) => parseDate(e.dateEnd ?? e.date) >= today)
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .slice(0, 4);
  }, []);

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

      {/* Mobile: Horizontal Scroll | Desktop: Vertical Stack or Grid */}
      <div className="flex overflow-x-auto pb-4 gap-3 md:grid md:grid-cols-1 lg:grid-cols-2 scrollbar-hide snap-x snap-mandatory">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          sorted.map((event) => (
            <div key={event.id} className="snap-center">
              <EventCard event={event} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
