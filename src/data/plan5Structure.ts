// ====================================================================
// PLAN DE ESTUDIOS Nº 5 — Abogacía — UNLP
// Facultad de Ciencias Jurídicas y Sociales
// ====================================================================

import { Materia, EstadoMateria } from "./plan6Structure";

export const MATERIAS_PLAN5: Materia[] = [
  // ══════════════════════════════════════════════════════════════════
  // PRIMER AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "P5-01",
    nombre: "Introducción a la Sociología",
    nombreCorto: "Intro Sociología",
    anio: 1, duracion: "cuatrimestral", col: 0, row: 0,
    requisitos: [],
  },
  {
    id: "P5-02",
    nombre: "Historia Constitucional",
    nombreCorto: "Hist. Constitucional",
    anio: 1, duracion: "cuatrimestral", col: 0, row: 1,
    requisitos: [],
  },
  {
    id: "P5-03",
    nombre: "Introducción al Derecho",
    nombreCorto: "Intro al Derecho",
    anio: 1, duracion: "cuatrimestral", col: 0, row: 2,
    requisitos: [],
  },
  {
    id: "P5-04",
    nombre: "Derecho Romano",
    nombreCorto: "Derecho Romano",
    anio: 1, duracion: "cuatrimestral", col: 0, row: 3,
    requisitos: [],
  },
  {
    id: "P5-05",
    nombre: "Economía Política",
    nombreCorto: "Economía Política",
    anio: 1, duracion: "cuatrimestral", col: 1, row: 0,
    requisitos: [],
  },
  {
    id: "P5-06",
    nombre: "Derecho Político",
    nombreCorto: "Derecho Político",
    anio: 1, duracion: "cuatrimestral", col: 1, row: 1,
    requisitos: [],
  },
  {
    id: "P5-07",
    nombre: "Derecho Civil I",
    nombreCorto: "Derecho Civil I",
    anio: 1, duracion: "cuatrimestral", col: 1, row: 2,
    requisitos: [
      { id: "P5-03", tipo: "aprobada" },
      { id: "P5-04", tipo: "aprobada" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // SEGUNDO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "P5-08",
    nombre: "Derecho Internacional Público",
    nombreCorto: "D. Int. Público",
    anio: 2, duracion: "cuatrimestral", col: 2, row: 0,
    requisitos: [{ id: "P5-10", tipo: "aprobada" }],
  },
  {
    id: "P5-09",
    nombre: "Derecho Constitucional",
    nombreCorto: "D. Constitucional",
    anio: 2, duracion: "cuatrimestral", col: 2, row: 1,
    requisitos: [
      { id: "P5-02", tipo: "aprobada" },
      { id: "P5-03", tipo: "aprobada" },
    ],
  },
  {
    id: "P5-10",
    nombre: "Derecho Penal I",
    nombreCorto: "Derecho Penal I",
    anio: 2, duracion: "cuatrimestral", col: 2, row: 2,
    requisitos: [{ id: "P5-03", tipo: "aprobada" }],
  },
  {
    id: "P5-11",
    nombre: "Derecho Civil II",
    nombreCorto: "Derecho Civil II",
    anio: 2, duracion: "semestral", col: 2, row: 3,
    requisitos: [{ id: "P5-07", tipo: "aprobada" }],
  },
  {
    id: "P5-12",
    nombre: "Sociología Jurídica",
    nombreCorto: "Sociología Jurídica",
    anio: 2, duracion: "trimestral", col: 4, row: 0,
    requisitos: [{ id: "P5-01", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // TERCER AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "P5-13",
    nombre: "Derecho Público Provincial y Municipal",
    nombreCorto: "D. Púb. Provincial",
    anio: 3, duracion: "cuatrimestral", col: 3, row: 1,
    requisitos: [{ id: "P5-09", tipo: "aprobada" }],
  },
  {
    id: "P5-14",
    nombre: "Derecho Procesal I",
    nombreCorto: "Derecho Procesal I",
    anio: 3, duracion: "cuatrimestral", col: 3, row: 2,
    requisitos: [
      { id: "P5-03", tipo: "aprobada" },
      { id: "P5-09", tipo: "aprobada" },
    ],
  },
  {
    id: "P5-15",
    nombre: "Derecho Social",
    nombreCorto: "Derecho Social",
    anio: 3, duracion: "cuatrimestral", col: 3, row: 3,
    requisitos: [{ id: "P5-03", tipo: "aprobada" }],
  },
  {
    id: "P5-16",
    nombre: "Derecho Penal II",
    nombreCorto: "Derecho Penal II",
    anio: 3, duracion: "cuatrimestral", col: 3, row: 4,
    requisitos: [{ id: "P5-10", tipo: "aprobada" }],
  },
  {
    id: "P5-17",
    nombre: "Derecho Civil III",
    nombreCorto: "Derecho Civil III",
    anio: 3, duracion: "cuatrimestral", col: 3, row: 5,
    requisitos: [{ id: "P5-11", tipo: "aprobada" }],
  },
  {
    id: "P5-18",
    nombre: "Filosofía del Derecho",
    nombreCorto: "Filosofía del Derecho",
    anio: 3, duracion: "trimestral", col: 4, row: 1,
    requisitos: [{ id: "P5-03", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // CUARTO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "P5-19",
    nombre: "Prácticas Penales",
    nombreCorto: "Prácticas Penales",
    anio: 4, duracion: "semestral", col: 3, row: 0,
    requisitos: [
      { id: "P5-14", tipo: "aprobada" },
      { id: "P5-16", tipo: "aprobada" },
    ],
  },
  {
    id: "P5-20",
    nombre: "Derecho Procesal II",
    nombreCorto: "Derecho Procesal II",
    anio: 4, duracion: "semestral", col: 4, row: 2,
    requisitos: [
      { id: "P5-14", tipo: "aprobada" },
      { id: "P5-16", tipo: "aprobada" },
    ],
  },
  {
    id: "P5-21",
    nombre: "Derecho Administrativo I",
    nombreCorto: "Derecho Admin. I",
    anio: 4, duracion: "trimestral", col: 4, row: 3,
    requisitos: [{ id: "P5-09", tipo: "aprobada" }],
  },
  {
    id: "P5-22",
    nombre: "Derecho Comercial I",
    nombreCorto: "Derecho Comercial I",
    anio: 4, duracion: "trimestral", col: 4, row: 4,
    requisitos: [{ id: "P5-11", tipo: "aprobada" }],
  },
  {
    id: "P5-23",
    nombre: "Derecho Civil IV",
    nombreCorto: "Derecho Civil IV",
    anio: 4, duracion: "trimestral", col: 4, row: 5,
    requisitos: [{ id: "P5-17", tipo: "aprobada" }],
  },
  {
    id: "P5-24",
    nombre: "Derecho Administrativo II",
    nombreCorto: "Derecho Admin. II",
    anio: 4, duracion: "trimestral", col: 5, row: 1,
    requisitos: [{ id: "P5-21", tipo: "aprobada" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // QUINTO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "P5-25",
    nombre: "Prácticas Civiles y Comerciales",
    nombreCorto: "Prácticas Civ. y Com.",
    anio: 5, duracion: "semestral", col: 5, row: 0,
    requisitos: [
      { id: "P5-14", tipo: "aprobada" },
      { id: "P5-22", tipo: "aprobada" },
      { id: "P5-23", tipo: "aprobada" },
    ],
  },
  {
    id: "P5-26",
    nombre: "Minería y Energía",
    nombreCorto: "Minería y Energía",
    anio: 5, duracion: "trimestral", col: 5, row: 2,
    requisitos: [{ id: "P5-17", tipo: "aprobada" }],
  },
  {
    id: "P5-27",
    nombre: "Derecho Agrario",
    nombreCorto: "Derecho Agrario",
    anio: 5, duracion: "trimestral", col: 5, row: 3,
    requisitos: [{ id: "P5-17", tipo: "aprobada" }],
  },
  {
    id: "P5-28",
    nombre: "Derecho Comercial II",
    nombreCorto: "Derecho Comercial II",
    anio: 5, duracion: "trimestral", col: 5, row: 4,
    requisitos: [{ id: "P5-22", tipo: "aprobada" }],
  },
  {
    id: "P5-29",
    nombre: "Derecho Civil V",
    nombreCorto: "Derecho Civil V",
    anio: 5, duracion: "semestral", col: 5, row: 5,
    requisitos: [{ id: "P5-23", tipo: "aprobada" }],
  },
  {
    id: "P5-30",
    nombre: "Finanzas y Derecho Financiero",
    nombreCorto: "Finanzas y D. Fin.",
    anio: 5, duracion: "trimestral", col: 6, row: 0,
    requisitos: [
      { id: "P5-05", tipo: "aprobada" },
      { id: "P5-21", tipo: "aprobada" },
    ],
  },
  {
    id: "P5-31",
    nombre: "Derecho de la Navegación",
    nombreCorto: "Derecho Navegación",
    anio: 5, duracion: "semestral", col: 6, row: 1,
    requisitos: [{ id: "P5-22", tipo: "aprobada" }],
  },
  {
    id: "P5-32",
    nombre: "Derecho Notarial y Registral",
    nombreCorto: "Derecho Notarial",
    anio: 5, duracion: "trimestral", col: 6, row: 2,
    requisitos: [{ id: "P5-17", tipo: "aprobada" }],
  },
  {
    id: "P5-33",
    nombre: "Derecho Internacional Privado",
    nombreCorto: "D. Int. Privado",
    anio: 5, duracion: "cuatrimestral", col: 6, row: 3,
    requisitos: [
      { id: "P5-08", tipo: "aprobada" },
      { id: "P5-28", tipo: "aprobada" },
      { id: "P5-29", tipo: "aprobada" },
    ],
  },
];

export const TOTAL_MATERIAS_PLAN5 = MATERIAS_PLAN5.length;

export function calcularPorcentajePlan5(estados: Record<string, EstadoMateria>): number {
  const aprobadas = MATERIAS_PLAN5.filter(m => estados[m.id] === "aprobada").length;
  return Math.round((aprobadas / TOTAL_MATERIAS_PLAN5) * 100);
}

export function getEstadoVisualPlan5(
  materia: Materia,
  estados: Record<string, EstadoMateria>
): EstadoMateria | "habilitada" | "bloqueada" {
  const estadoPropio = estados[materia.id] || "pendiente";
  if (estadoPropio === "aprobada") return "aprobada";

  const todas = materia.requisitos.every(req => estados[req.id] === "aprobada");
  return todas ? "habilitada" : "bloqueada";
}
