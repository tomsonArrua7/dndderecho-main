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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { academicDates, type AcademicDate, type CategoryKey } from "@/data/academicDates";

// ─────────────────────────────────────────────────────────────────────────────
//  Category metadata
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────────────────
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
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(iso: string): string {
  return parseDate(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

/** Generates an .ics blob and triggers download */
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

/** Opens Google Calendar "add event" with pre-filled data */
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

// ─────────────────────────────────────────────────────────────────────────────
//  Urgency badge
// ─────────────────────────────────────────────────────────────────────────────
function UrgencyBadge({ days }: { days: number }) {
  if (days < 0) return null;

  if (days <= 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-[10px] font-black uppercase tracking-widest animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
        {days === 0 ? "¡Hoy!" : days === 1 ? "¡Mañana!" : "En 2 días"}
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
        <Clock className="w-2.5 h-2.5" />
        {days}d
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-[10px] font-medium tracking-wide">
      <CalendarDays className="w-2.5 h-2.5" />
      {days}d
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Event Card
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: AcademicDate }) {
  const meta = CATEGORY_META[event.category];
  const Icon = meta.icon;
  const days = daysUntil(event.date);
  const isUrgent = days >= 0 && days <= 2;

  return (
    <article
      className={cn(
        "group relative flex gap-4 p-4 rounded-2xl border transition-all duration-300",
        "hover:scale-[1.015] hover:-translate-y-0.5",
        isUrgent
          ? "bg-accent/5 border-accent/25 hover:border-accent/50"
          : "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15"
      )}
    >
      {/* Category icon pill */}
      <div
        className={cn(
          "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border",
          meta.bg,
          meta.border
        )}
      >
        <Icon className={cn("w-4.5 h-4.5", meta.color)} size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              meta.color
            )}
          >
            {meta.label}
          </span>
          <UrgencyBadge days={days} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white leading-snug mb-1">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-[11px] text-white/45 leading-relaxed mb-2 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Date display */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-[11px] font-medium text-white/60">
            {formatDate(event.date)}
            {event.dateEnd && event.dateEnd !== event.date && (
              <> → {formatDateShort(event.dateEnd)}</>
            )}
          </span>

          {event.location && (
            <span className="text-[10px] text-white/35 truncate max-w-[140px]">
              📍 {event.location}
            </span>
          )}
        </div>
      </div>

      {/* Actions — visible on hover */}
      <div
        className={cn(
          "absolute right-3 bottom-3 flex items-center gap-1.5",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        )}
      >
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            title="Más información"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-colors"
          >
            <ExternalLink size={13} />
          </a>
        )}
        <button
          title="Agregar a Google Calendar"
          onClick={() => openGoogleCalendar(event)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white/50 hover:text-emerald-400 transition-colors"
        >
          <CalendarPlus size={13} />
        </button>
        <button
          title="Descargar archivo .ics"
          onClick={() => downloadICS(event)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 text-white/50 hover:text-sky-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <PartyPopper className="w-5 h-5 text-white/30" />
      </div>
      <p className="text-sm font-semibold text-white/60">Sin fechas críticas por ahora</p>
      <p className="text-xs text-white/35 max-w-[220px] leading-relaxed">
        Por el momento no hay fechas críticas. ¡Buen estudio, futuro colega! 🎓
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────────────────────
export function UpcomingDates() {
  const sorted = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...academicDates]
      .filter((e) => {
        // Show if start date hasn't passed more than 1 day, OR if end date is still in the future
        const endIso = e.dateEnd ?? e.date;
        return parseDate(endIso) >= today;
      })
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .slice(0, 6); // max 6 events to keep the widget clean
  }, []);

  const urgentCount = sorted.filter((e) => daysUntil(e.date) <= 2 && daysUntil(e.date) >= 0).length;

  return (
    <section
      className="w-full rounded-3xl border border-white/8 overflow-hidden"
      style={{
        background: "hsl(222 80% 9% / 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      aria-label="Próximas fechas académicas"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/30 border border-primary/40 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-white/70" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Próximas Fechas</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Calendario académico</p>
          </div>
        </div>

        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            {urgentCount} urgente{urgentCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Event list ── */}
      <div className="p-3 flex flex-col gap-2">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          sorted.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>

      {/* ── Footer ── */}
      {sorted.length > 0 && (
        <div className="px-5 py-3 border-t border-white/8">
          <p className="text-[10px] text-white/25 text-center">
            Pasá el cursor sobre una fecha para guardarla en tu calendario
          </p>
        </div>
      )}
    </section>
  );
}
