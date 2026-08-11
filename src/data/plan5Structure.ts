// ====================================================================
// PLAN DE ESTUDIOS Nº 5 — Abogacía — UNLP
// Facultad de Ciencias Jurídicas y Sociales
// ====================================================================

import { Materia, EstadoMateria } from "./plan6Structure";

export interface RequisitosEspecialesPlan5 {
  materiasAprobadasMinimas?: number;
}

export interface MateriaPlan5 extends Omit<Materia, 'requisitosEspeciales'> {
  requisitosEspeciales?: RequisitosEspecialesPlan5;
}

export const MATERIAS_PLAN5: MateriaPlan5[] = [
  // ══════════════════════════════════════════════════════════════════
  // PRIMER AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10111",
    nombre: "Introducción al Derecho",
    nombreCorto: "Intro al Derecho",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [],
  },
  {
    id: "10112",
    nombre: "Historia Constitucional",
    nombreCorto: "Hist. Constitucional",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [],
  },
  {
    id: "10113",
    nombre: "Introducción a la Sociología",
    nombreCorto: "Intro Sociología",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [],
  },
  {
    id: "10114",
    nombre: "Derecho Político",
    nombreCorto: "Derecho Político",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10112", tipo: "aprobada" },
      { id: "10113", tipo: "aprobada" }
    ],
  },
  {
    id: "10115",
    nombre: "Economía Política",
    nombreCorto: "Economía Política",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10113", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // SEGUNDO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10121",
    nombre: "Derecho Romano",
    nombreCorto: "Derecho Romano",
    anio: 2, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [],
  },
  {
    id: "10122",
    nombre: "Derecho Civil I",
    nombreCorto: "Derecho Civil I",
    anio: 2, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [
      { id: "10111", tipo: "aprobada" },
      { id: "10121", tipo: "aprobada" }
    ],
  },
  {
    id: "10123",
    nombre: "Derecho Civil II",
    nombreCorto: "Derecho Civil II",
    anio: 2, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [{ id: "10122", tipo: "aprobada" }],
  },
  {
    id: "10124",
    nombre: "Derecho Penal I",
    nombreCorto: "Derecho Penal I",
    anio: 2, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [{ id: "10122", tipo: "aprobada" }],
  },
  {
    id: "10125",
    nombre: "Derecho Constitucional",
    nombreCorto: "Derecho Constitucional",
    anio: 2, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10114", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // TERCER AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10132",
    nombre: "Derecho Comercial I",
    nombreCorto: "Derecho Comercial I",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10123", tipo: "aprobada" }],
  },
  {
    id: "10133",
    nombre: "Derecho Civil III",
    nombreCorto: "Derecho Civil III",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10123", tipo: "aprobada" }],
  },
  {
    id: "10134",
    nombre: "Derecho Procesal I",
    nombreCorto: "Derecho Procesal I",
    anio: 3, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [
      { id: "10135", tipo: "aprobada" },
      { id: "10136", tipo: "aprobada" }
    ],
  },
  {
    id: "10135",
    nombre: "Derecho Penal II",
    nombreCorto: "Derecho Penal II",
    anio: 3, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [{ id: "10124", tipo: "aprobada" }],
  },
  {
    id: "10136",
    nombre: "Derecho Público Provincial y Municipal",
    nombreCorto: "D. Púb. Prov. y Mun.",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10125", tipo: "aprobada" }],
  },
  {
    id: "10137",
    nombre: "Adaptación profesional prácticas penales",
    nombreCorto: "Prácticas Penales",
    anio: 3, duracion: "cuatrimestral", horas: 144, tipo: "practica",
    requisitos: [{ id: "10134", tipo: "aprobada" }],
  },
  {
    id: "10138",
    nombre: "Derecho Internacional Público",
    nombreCorto: "D. Internacional Público",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10125", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // CUARTO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10141",
    nombre: "Derecho Administrativo I",
    nombreCorto: "Derecho Admin. I",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10134", tipo: "aprobada" },
      { id: "10136", tipo: "aprobada" }
    ],
  },
  {
    id: "10142",
    nombre: "Derecho Comercial II",
    nombreCorto: "Derecho Comercial II",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10132", tipo: "aprobada" },
      { id: "10134", tipo: "aprobada" }
    ],
  },
  {
    id: "10143",
    nombre: "Derecho Civil IV",
    nombreCorto: "Derecho Civil IV",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10133", tipo: "aprobada" }],
  },
  {
    id: "10144",
    nombre: "Derecho Procesal II",
    nombreCorto: "Derecho Procesal II",
    anio: 4, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [{ id: "10134", tipo: "aprobada" }],
  },
  {
    id: "10145",
    nombre: "Derecho Social del trabajo y prevención",
    nombreCorto: "D. Social del Trabajo",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10132", tipo: "aprobada" },
      { id: "10133", tipo: "aprobada" }
    ],
  },
  {
    id: "10146",
    nombre: "Derecho agrario",
    nombreCorto: "Derecho Agrario",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10141", tipo: "aprobada" }],
  },
  {
    id: "10147",
    nombre: "Filosofía del Derecho",
    nombreCorto: "Filosofía del Derecho",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10134", tipo: "aprobada" }],
  },
  {
    id: "10148",
    nombre: "Adap. prof. de proc. civiles y comerciales",
    nombreCorto: "Prácticas Civ. y Com.",
    anio: 4, duracion: "cuatrimestral", horas: 144, tipo: "practica",
    requisitos: [{ id: "10144", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // QUINTO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10151",
    nombre: "Derecho Administrativo II",
    nombreCorto: "Derecho Admin. II",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10141", tipo: "aprobada" },
      { id: "10144", tipo: "aprobada" }
    ],
  },
  {
    id: "10152",
    nombre: "Derecho de la Navegación marítimo, fluvial y aéreo",
    nombreCorto: "Derecho Navegación",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10142", tipo: "aprobada" }],
  },
  {
    id: "10153",
    nombre: "Derecho Civil V",
    nombreCorto: "Derecho Civil V",
    anio: 5, duracion: "cuatrimestral", horas: 144, tipo: "regular",
    requisitos: [{ id: "10143", tipo: "aprobada" }],
  },
  {
    id: "10154",
    nombre: "Derecho de Minería y Energía",
    nombreCorto: "D. Minería y Energía",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10141", tipo: "aprobada" }],
  },
  {
    id: "10155",
    nombre: "Sociología Jurídica",
    nombreCorto: "Sociología Jurídica",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10147", tipo: "aprobada" }],
  },
  {
    id: "10156",
    nombre: "Derecho Internacional Privado",
    nombreCorto: "D. Internacional Privado",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10153", tipo: "aprobada" },
      { id: "10152", tipo: "aprobada" }
    ],
  },
  {
    id: "10157",
    nombre: "Derecho Notarial y Registral",
    nombreCorto: "Derecho Notarial",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10153", tipo: "aprobada" },
      { id: "10142", tipo: "aprobada" }
    ],
  },
  {
    id: "10158",
    nombre: "Finanzas y Derecho Financiero",
    nombreCorto: "Finanzas y D. Fin.",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10115", tipo: "aprobada" },
      { id: "10151", tipo: "aprobada" }
    ],
  },
  {
    id: "10179",
    nombre: "Seminario",
    nombreCorto: "Seminario",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "seminario",
    requisitos: [],
    requisitosEspeciales: { materiasAprobadasMinimas: 15 }
  },
];

export const TOTAL_MATERIAS_PLAN5 = MATERIAS_PLAN5.length;

export function calcularPorcentajePlan5(estados: Record<string, EstadoMateria>): number {
  const aprobadas = MATERIAS_PLAN5.filter(m => estados[m.id] === "aprobada").length;
  return Math.round((aprobadas / TOTAL_MATERIAS_PLAN5) * 100);
}

export function getEstadoVisualPlan5(
  materia: MateriaPlan5,
  estados: Record<string, EstadoMateria>
): EstadoMateria | "habilitada" | "bloqueada" {
  const estadoPropio = estados[materia.id] || "pendiente";
  if (estadoPropio === "aprobada") return "aprobada";

  if (materia.requisitosEspeciales?.materiasAprobadasMinimas) {
    const aprobadas = MATERIAS_PLAN5.filter(m => estados[m.id] === "aprobada").length;
    if (aprobadas < materia.requisitosEspeciales.materiasAprobadasMinimas) return "bloqueada";
  }

  const todas = materia.requisitos.every(req => estados[req.id] === "aprobada");
  return todas ? "habilitada" : "bloqueada";
}
