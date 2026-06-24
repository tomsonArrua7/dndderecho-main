/**
 * ============================================================
 *  academicDates.ts — Fechas Académicas DND
 * ============================================================
 *  ✏️  EDITA ESTE ARCHIVO MES A MES para actualizar el widget
 *  de "Próximas Fechas" en la Landing Page.
 *
 *  Campos:
 *  ─────────────────────────────────────────────────────────
 *  id          → Identificador único (string, sin espacios)
 *  category    → Tipo de evento (ver CategoryKey abajo)
 *  title       → Título corto del evento
 *  description → Descripción opcional (se muestra en la tarjeta)
 *  date        → Fecha ISO 8601: "YYYY-MM-DD"
 *  dateEnd     → (opcional) Fecha de fin para rangos: "YYYY-MM-DD"
 *  location    → (opcional) Lugar o enlace (string)
 *  link        → (opcional) URL para más info
 * ============================================================
 */

export type CategoryKey =
  | "inscripcion"   // 📋 Inscripción en SIU Guaraní
  | "examen"        // 📝 Mesa de examen / parcial
  | "feria"         // ⚖️  Feria judicial (días inhábiles)
  | "agrupacion"    // 🎙️  Evento de DND (charlas, talleres)
  | "cuatrimestre"; // 🎓  Inicio/fin de cuatrimestre

export interface AcademicDate {
  id: string;
  category: CategoryKey;
  title: string;
  description?: string;
  /** Fecha ISO "YYYY-MM-DD" */
  date: string;
  /** Fecha de fin para rangos, ISO "YYYY-MM-DD" */
  dateEnd?: string;
  location?: string;
  link?: string;
}

// ============================================================
//  🗓️  LISTADO DE FECHAS — Editar aquí
// ============================================================
export const academicDates: AcademicDate[] = [
  // ── Inscripción a finales ────────────────────────────────
  {
    id: "inscripcion-finales-mayo-2026",
    category: "inscripcion",
    title: "Inscripción a Finales — Turno Mayo/Junio",
    description: "Período de inscripción a mesas de examen final a través del SIU Guaraní. No te olvides de verificar las correlatividades.",
    date: "2026-04-28",
    dateEnd: "2026-05-03",
    link: "https://guarani.unlp.edu.ar",
  },

  // ── Inscripción a cursadas ───────────────────────────────
  {
    id: "inscripcion-cursadas-2do-cuatrimestre-2026",
    category: "inscripcion",
    title: "Inscripción a Cursadas — 2° Cuatrimestre",
    description: "Inscripción a materias del segundo cuatrimestre a través del SIU Guaraní por franjas horarias.",
    date: "2026-07-27",
    dateEnd: "2026-07-31",
    location: "SIU Guaraní UNLP",
    link: "https://guarani.unlp.edu.ar",
  },

  // ── Mesas de exámenes de Julio ───────────────────────────
  {
    id: "mesas-examenes-julio-2026",
    category: "examen",
    title: "Mesas de Exámenes Finales (Turno Julio)",
    description: "Turno oficial de exámenes finales de Julio. Recordá chequear las aulas asignadas en cartelera.",
    date: "2026-07-06",
    dateEnd: "2026-07-11",
    location: "Facultad de Ciencias Jurídicas y Sociales — UNLP",
  },

  // ── Mesas de examen ─────────────────────────────────────
  {
    id: "mesa-examen-mayo-2026",
    category: "examen",
    title: "Turno de Exámenes Mayo — 1ª Semana",
    description: "Primera semana del turno de finales de Mayo. Consultá el aula y el tribunal en SIU Guaraní.",
    date: "2026-05-11",
    dateEnd: "2026-05-16",
    location: "Aulas a confirmar — SIU Guaraní",
    link: "https://guarani.unlp.edu.ar",
  },

  // ── Charla DND ──────────────────────────────────────────
  {
    id: "charla-dnd-procesal-mayo",
    category: "agrupacion",
    title: "Charla: Introducción al Derecho Procesal Civil",
    description: "Jornada de extensión organizada por DND con docentes de la cátedra. Cupos limitados — inscripción previa.",
    date: "2026-05-07",
    location: "Aula Magna — Facultad de Derecho UNLP",
    link: "https://instagram.com/agrupaciondnd",
  },
];
