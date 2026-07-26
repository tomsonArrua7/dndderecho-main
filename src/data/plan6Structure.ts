// ====================================================================
// PLAN DE ESTUDIOS Nº 6 — Abogacía — UNLP
// Facultad de Ciencias Jurídicas y Sociales
// Resolución HCA vigente desde 2019
// ====================================================================

export type Duracion = "bimestral" | "trimestral" | "cuatrimestral" | "semestral" | "anual";
export type EstadoMateria = "pendiente" | "aprobada";
export type TipoRequisito = "aprobada";
export type TipoMateria = "regular" | "idioma" | "seminario" | "practica";

export interface Requisito {
  id: string;
  tipo: TipoRequisito;
}

export interface RequisitosEspeciales {
  primerAnioCompleto?: boolean;
  porcentajeCarrera?: number;
}

export interface Materia {
  id: string; // Código oficial (ej: "10111")
  nombre: string;
  nombreCorto: string;
  anio: number; // 1..5
  duracion: Duracion;
  horas: number;
  tipo: TipoMateria;
  requisitos: Requisito[];
  requisitosEspeciales?: RequisitosEspeciales;
}

export const MATERIAS_PLAN6: Materia[] = [
  // ══════════════════════════════════════════════════════════════════
  // PRIMER AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10610",
    nombre: "Introducción al Estudio de las Ciencias Sociales",
    nombreCorto: "Intro Cs. Sociales",
    anio: 1, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [],
  },
  {
    id: "10111",
    nombre: "Introducción al Derecho",
    nombreCorto: "Intro al Derecho",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10610", tipo: "aprobada" }],
  },
  {
    id: "10112",
    nombre: "Historia Constitucional",
    nombreCorto: "Hist. Constitucional",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10610", tipo: "aprobada" }],
  },
  {
    id: "10113",
    nombre: "Introducción a la Sociología",
    nombreCorto: "Intro Sociología",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10610", tipo: "aprobada" }],
  },
  {
    id: "10616",
    nombre: "Introducción al Pensamiento Científico",
    nombreCorto: "Intro Pensamiento Cient.",
    anio: 1, duracion: "cuatrimestral", horas: 32, tipo: "regular",
    requisitos: [{ id: "10610", tipo: "aprobada" }],
  },
  {
    id: "10121",
    nombre: "Derecho Romano",
    nombreCorto: "Derecho Romano",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10610", tipo: "aprobada" }],
  },
  {
    id: "10114",
    nombre: "Derecho Político",
    nombreCorto: "Derecho Político",
    anio: 1, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10113", tipo: "aprobada" },
      { id: "10112", tipo: "aprobada" }
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // SEGUNDO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10122",
    nombre: "Derecho Privado I - Civil",
    nombreCorto: "D. Privado I (Civil)",
    anio: 2, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10111", tipo: "aprobada" },
      { id: "10121", tipo: "aprobada" }
    ],
  },
  {
    id: "10123",
    nombre: "Derecho Privado II - Civil",
    nombreCorto: "D. Privado II (Civil)",
    anio: 2, duracion: "cuatrimestral", horas: 120, tipo: "regular",
    requisitos: [
      { id: "10122", tipo: "aprobada" },
      { id: "10627", tipo: "aprobada" }
    ],
  },
  {
    id: "10124",
    nombre: "Derecho Penal I",
    nombreCorto: "D. Penal I",
    anio: 2, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10122", tipo: "aprobada" },
      { id: "10125", tipo: "aprobada" }
    ],
  },
  {
    id: "10125",
    nombre: "Derecho Constitucional",
    nombreCorto: "D. Constitucional",
    anio: 2, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10111", tipo: "aprobada" },
      { id: "10114", tipo: "aprobada" }
    ],
  },
  {
    id: "10626",
    nombre: "Derechos Humanos",
    nombreCorto: "Derechos Humanos",
    anio: 2, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [{ id: "10125", tipo: "aprobada" }],
  },
  {
    id: "10627",
    nombre: "Teoría del Conflicto",
    nombreCorto: "Teoría del Conflicto",
    anio: 2, duracion: "cuatrimestral", horas: 32, tipo: "regular",
    requisitos: [
      { id: "10616", tipo: "aprobada" },
      { id: "10113", tipo: "aprobada" }
    ],
  },
  {
    id: "10617",
    nombre: "Taller de lecto-comprensión en Idioma I",
    nombreCorto: "Idioma I",
    anio: 2, duracion: "cuatrimestral", horas: 32, tipo: "idioma",
    requisitos: [],
    requisitosEspeciales: { primerAnioCompleto: true }
  },
  {
    id: "10618",
    nombre: "Taller de lecto-comprensión en Idioma II",
    nombreCorto: "Idioma II",
    anio: 2, duracion: "cuatrimestral", horas: 32, tipo: "idioma",
    requisitos: [],
    requisitosEspeciales: { primerAnioCompleto: true }
  },

  // ══════════════════════════════════════════════════════════════════
  // TERCER AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10132",
    nombre: "Derecho Privado IV - Comercial",
    nombreCorto: "D. Privado IV (Com.)",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10133", tipo: "aprobada" }],
  },
  {
    id: "10133",
    nombre: "Derecho Privado III - Civil",
    nombreCorto: "D. Privado III (Civil)",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10123", tipo: "aprobada" },
      { id: "10125", tipo: "aprobada" }
    ],
  },
  {
    id: "10134",
    nombre: "Derecho Procesal I",
    nombreCorto: "D. Procesal I",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10124", tipo: "aprobada" },
      { id: "10136", tipo: "aprobada" }
    ],
  },
  {
    id: "10115",
    nombre: "Economía Política",
    nombreCorto: "Economía Política",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10123", tipo: "aprobada" },
      { id: "10626", tipo: "aprobada" }
    ],
  },
  {
    id: "10135",
    nombre: "Derecho Penal II",
    nombreCorto: "D. Penal II",
    anio: 3, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10124", tipo: "aprobada" },
      { id: "10626", tipo: "aprobada" }
    ],
  },
  {
    id: "10136",
    nombre: "Derecho Público, Provincial y Municipal",
    nombreCorto: "D. Público Prov. y Mun.",
    anio: 3, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [{ id: "10125", tipo: "aprobada" }],
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
    nombreCorto: "D. Administrativo I",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10132", tipo: "aprobada" },
      { id: "10134", tipo: "aprobada" }
    ],
  },
  {
    id: "10142",
    nombre: "Derecho Privado VI - Comercial",
    nombreCorto: "D. Privado VI (Com.)",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10132", tipo: "aprobada" }],
  },
  {
    id: "10143",
    nombre: "Derecho Privado V - Civil",
    nombreCorto: "D. Privado V (Civil)",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10133", tipo: "aprobada" }],
  },
  {
    id: "10144",
    nombre: "Derecho Procesal II",
    nombreCorto: "D. Procesal II",
    anio: 4, duracion: "cuatrimestral", horas: 120, tipo: "regular",
    requisitos: [
      { id: "10134", tipo: "aprobada" },
      { id: "10132", tipo: "aprobada" },
      { id: "10133", tipo: "aprobada" }
    ],
  },
  {
    id: "10640",
    nombre: "Derecho Social del Trabajo",
    nombreCorto: "D. Social del Trabajo",
    anio: 4, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10132", tipo: "aprobada" }],
  },
  {
    id: "10649",
    nombre: "Mediación y Medios de Resolución de Conflictos",
    nombreCorto: "Mediación y Conflictos",
    anio: 4, duracion: "cuatrimestral", horas: 32, tipo: "regular",
    requisitos: [{ id: "10144", tipo: "aprobada" }],
  },
  {
    id: "10146",
    nombre: "Derecho Agrario",
    nombreCorto: "Derecho Agrario",
    anio: 4, duracion: "cuatrimestral", horas: 64, tipo: "regular",
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
    id: "10179",
    nombre: "Seminario",
    nombreCorto: "Seminario",
    anio: 4, duracion: "cuatrimestral", horas: 32, tipo: "seminario",
    requisitos: [],
    requisitosEspeciales: { porcentajeCarrera: 50 }
  },

  // ══════════════════════════════════════════════════════════════════
  // QUINTO AÑO
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10151",
    nombre: "Derecho Administrativo II",
    nombreCorto: "D. Administrativo II",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10141", tipo: "aprobada" },
      { id: "10144", tipo: "aprobada" }
    ],
  },
  {
    id: "10653",
    nombre: "Derecho de Familia",
    nombreCorto: "Derecho de Familia",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [{ id: "10143", tipo: "aprobada" }],
  },
  {
    id: "10152",
    nombre: "Derecho de la Navegación",
    nombreCorto: "Derecho Navegación",
    anio: 5, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [{ id: "10142", tipo: "aprobada" }],
  },
  {
    id: "10650",
    nombre: "Derecho Colectivo del Trabajo y Seg. Social",
    nombreCorto: "D. Colectivo y Seg. Soc.",
    anio: 5, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [{ id: "10640", tipo: "aprobada" }],
  },
  {
    id: "10154",
    nombre: "Derecho de Minería y Energía",
    nombreCorto: "D. Minería y Energía",
    anio: 5, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [{ id: "10141", tipo: "aprobada" }],
  },
  {
    id: "10155",
    nombre: "Sociología Jurídica",
    nombreCorto: "Sociología Jurídica",
    anio: 5, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [
      { id: "10653", tipo: "aprobada" },
      { id: "10147", tipo: "aprobada" }
    ],
  },
  {
    id: "10156",
    nombre: "Derecho Internacional Privado",
    nombreCorto: "D. Internacional Privado",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10142", tipo: "aprobada" },
      { id: "10659", tipo: "aprobada" }
    ],
  },
  {
    id: "10659",
    nombre: "Derecho de las Sucesiones",
    nombreCorto: "D. Sucesiones",
    anio: 5, duracion: "cuatrimestral", horas: 64, tipo: "regular",
    requisitos: [{ id: "10653", tipo: "aprobada" }],
  },
  {
    id: "10157",
    nombre: "Derecho Notarial y Registral",
    nombreCorto: "D. Notarial y Registral",
    anio: 5, duracion: "cuatrimestral", horas: 96, tipo: "regular",
    requisitos: [
      { id: "10142", tipo: "aprobada" },
      { id: "10659", tipo: "aprobada" }
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

  // ══════════════════════════════════════════════════════════════════
  // FORMACIÓN PRÁCTICA
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10657",
    nombre: "Práctica Supervisada Pre-profesional",
    nombreCorto: "Práctica PPS",
    anio: 5, duracion: "cuatrimestral", horas: 172, tipo: "practica",
    requisitos: [],
    requisitosEspeciales: { primerAnioCompleto: true }
  },
  {
    id: "10137",
    nombre: "Adaptaciones Profesionales Penales",
    nombreCorto: "Adaptaciones Penales",
    anio: 5, duracion: "cuatrimestral", horas: 120, tipo: "practica",
    requisitos: [{ id: "10134", tipo: "aprobada" }]
  },
  {
    id: "10148",
    nombre: "Adaptaciones Profesionales Civiles",
    nombreCorto: "Adaptaciones Civiles",
    anio: 5, duracion: "cuatrimestral", horas: 120, tipo: "practica",
    requisitos: [{ id: "10144", tipo: "aprobada" }]
  }
];

export const TOTAL_MATERIAS_PLAN6 = MATERIAS_PLAN6.length;

export function calcularPorcentaje(estados: Record<string, EstadoMateria>): number {
  const aprobadas = MATERIAS_PLAN6.filter(m => estados[m.id] === "aprobada").length;
  return Math.round((aprobadas / TOTAL_MATERIAS_PLAN6) * 100);
}

export function primerAnioCompleto(estados: Record<string, EstadoMateria>): boolean {
  return MATERIAS_PLAN6
    .filter(m => m.anio === 1)
    .every(m => estados[m.id] === "aprobada");
}

export function getEstadoVisual(
  materia: Materia,
  estados: Record<string, EstadoMateria>
): EstadoMateria | "habilitada" | "bloqueada" {
  const estadoPropio = estados[materia.id] || "pendiente";
  if (estadoPropio === "aprobada") return "aprobada";

  if (materia.requisitosEspeciales?.primerAnioCompleto && !primerAnioCompleto(estados)) {
    return "bloqueada";
  }
  if (materia.requisitosEspeciales?.porcentajeCarrera) {
    const pct = calcularPorcentaje(estados);
    if (pct < materia.requisitosEspeciales.porcentajeCarrera) return "bloqueada";
  }

  const todas = materia.requisitos.every(req => estados[req.id] === "aprobada");
  return todas ? "habilitada" : "bloqueada";
}
