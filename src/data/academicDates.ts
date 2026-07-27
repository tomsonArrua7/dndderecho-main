/**
 * ============================================================
 *  academicDates.ts — Fechas Académicas DND
 * ============================================================
 *  Las fechas próximas reales son cargadas por los administradores
 *  desde la plataforma (al crear eventos globales / avisos).
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

// 🗓️ LISTADO DE FECHAS (Vacío por defecto - se cargan desde Supabase por admins)
export const academicDates: AcademicDate[] = [];
