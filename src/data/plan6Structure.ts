// ====================================================================
// PLAN DE ESTUDIOS Nº 6 — Abogacía — UNLP
// Facultad de Ciencias Jurídicas y Sociales
// Resolución HCA vigente desde 2019
// ====================================================================
// Fuentes: mapa oficial JURSOC, guía 2019, SIU-Guaraní
// ====================================================================

export type Duracion = "bimestral" | "cuatrimestral" | "semestral" | "trimestral" | "anual";
export type EstadoMateria = "pendiente" | "aprobada";
export type TipoRequisito = "aprobada" | "cursada";

export interface Requisito {
  id: string;
  tipo: TipoRequisito; // "aprobada" = final aprobado | "cursada" = solo cursado
}

export interface RequisitosEspeciales {
  primerAnioCompleto?: boolean;   // requiere 1º año completo aprobado
  porcentajeCarrera?: number;     // requiere X% de la carrera aprobada
}

export interface Materia {
  id: string;           // código SIU Guaraní (ej: "10122")
  nombre: string;
  nombreCorto: string;  // nombre abreviado para el nodo
  anio: number;         // 1..5
  duracion: Duracion;
  col: number;          // columna en la grilla (0-indexed dentro del año)
  row: number;          // fila global en la grilla (0-indexed)
  requisitos: Requisito[];
  requisitosEspeciales?: RequisitosEspeciales;
  creditos?: number;
  horas?: number;
}

// ── Color coding (match visual del mapa JURSOC 2019) ────────────────
export const DURACION_STYLE: Record<Duracion, {
  label: string;
  borderColor: string;
  accentColor: string;
  bgColor: string;
  chipBg: string;
}> = {
  bimestral:      { label: "Bimestral",     borderColor: "#dc2626", accentColor: "#ef4444", bgColor: "#1c0505", chipBg: "#7f1d1d" },
  cuatrimestral:  { label: "Cuatrimestral", borderColor: "#cbd5e1", accentColor: "#e2e8f0", bgColor: "#0c1627", chipBg: "#334155" },
  semestral:      { label: "Semestral",     borderColor: "#f97316", accentColor: "#fb923c", bgColor: "#170a00", chipBg: "#7c2d12" },
  trimestral:     { label: "Trimestral",    borderColor: "#94a3b8", accentColor: "#cbd5e1", bgColor: "#0f1621", chipBg: "#1e293b" },
  anual:          { label: "Anual",         borderColor: "#1d4ed8", accentColor: "#3b82f6", bgColor: "#030918", chipBg: "#1e3a8a" },
};

// ── Estado styles ───────────────────────────────────────────────────
export const ESTADO_STYLE: Record<EstadoMateria | "habilitada" | "bloqueada", {
  borderColor: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
}> = {
  aprobada:   { borderColor: "#22d3ee", bgColor: "#042f2e", textColor: "#a5f3fc", glowColor: "rgba(34,211,238,0.4)" },
  habilitada: { borderColor: "#3b82f6", bgColor: "#0c1f44", textColor: "#bfdbfe", glowColor: "rgba(59,130,246,0.25)" },
  bloqueada:  { borderColor: "#1e293b", bgColor: "#0a0f1a", textColor: "#475569", glowColor: "none" },
  pendiente:  { borderColor: "#1e293b", bgColor: "#0a0f1a", textColor: "#475569", glowColor: "none" },
};

// ====================================================================
// MATERIAS — PLAN 6
// Grid layout: row = año (0-indexed), col = posición horizontal
// ====================================================================
export const MATERIAS_PLAN6: Materia[] = [

  // ══════════════════════════════════════════════════════════════════
  // PRIMER AÑO  (row: 0)
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10600",
    nombre: "Introducción al Estudio de las Ciencias Sociales",
    nombreCorto: "Intro Cs. Sociales",
    anio: 1, duracion: "cuatrimestral", col: 0, row: 0,
    requisitos: [], horas: 64,
  },
  {
    id: "10101",
    nombre: "Introducción al Derecho",
    nombreCorto: "Intro al Derecho",
    anio: 1, duracion: "cuatrimestral", col: 1, row: 0,
    requisitos: [], horas: 64,
  },
  {
    id: "10102",
    nombre: "Historia Constitucional Argentina y Latinoamericana",
    nombreCorto: "Historia Constitucional",
    anio: 1, duracion: "cuatrimestral", col: 2, row: 0,
    requisitos: [], horas: 64,
  },
  {
    id: "10601",
    nombre: "Introducción a la Sociología",
    nombreCorto: "Intro Sociología",
    anio: 1, duracion: "cuatrimestral", col: 3, row: 0,
    requisitos: [], horas: 64,
  },
  {
    id: "10103",
    nombre: "Derecho Político",
    nombreCorto: "Derecho Político",
    anio: 1, duracion: "cuatrimestral", col: 4, row: 0,
    requisitos: [], horas: 64,
  },
  {
    id: "10602",
    nombre: "Introducción al Pensamiento Científico",
    nombreCorto: "Intro Pensamiento Cient.",
    anio: 1, duracion: "cuatrimestral", col: 5, row: 0,
    requisitos: [], horas: 32,
  },
  {
    id: "10104",
    nombre: "Derecho Romano",
    nombreCorto: "Derecho Romano",
    anio: 1, duracion: "cuatrimestral", col: 6, row: 0,
    requisitos: [], horas: 64,
  },

  // ══════════════════════════════════════════════════════════════════
  // SEGUNDO AÑO  (row: 1)
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10122",
    nombre: "Derecho Privado I",
    nombreCorto: "D. Privado I",
    anio: 2, duracion: "cuatrimestral", col: 0, row: 1,
    requisitos: [
      { id: "10104", tipo: "aprobada" }, // Derecho Romano
      { id: "10101", tipo: "aprobada" }, // Intro al Derecho
    ],
    horas: 96,
  },
  {
    id: "10105",
    nombre: "Derecho Penal I",
    nombreCorto: "D. Penal I",
    anio: 2, duracion: "cuatrimestral", col: 1, row: 1,
    requisitos: [
      { id: "10101", tipo: "aprobada" }, // Intro al Derecho
    ],
    horas: 96,
  },
  {
    id: "10106",
    nombre: "Derecho Constitucional",
    nombreCorto: "D. Constitucional",
    anio: 2, duracion: "cuatrimestral", col: 2, row: 1,
    requisitos: [
      { id: "10101", tipo: "aprobada" }, // Intro al Derecho
      { id: "10102", tipo: "aprobada" }, // Historia Constitucional
      { id: "10103", tipo: "aprobada" }, // Derecho Político
    ],
    horas: 96,
  },
  {
    id: "10603",
    nombre: "Derechos Humanos",
    nombreCorto: "Derechos Humanos",
    anio: 2, duracion: "cuatrimestral", col: 3, row: 1,
    requisitos: [
      { id: "10101", tipo: "aprobada" }, // Intro al Derecho
      { id: "10102", tipo: "aprobada" }, // Historia Constitucional
    ],
    horas: 64,
  },
  {
    id: "10627",
    nombre: "Teoría del Conflicto",
    nombreCorto: "Teoría del Conflicto",
    anio: 2, duracion: "cuatrimestral", col: 4, row: 1,
    requisitos: [
      { id: "10602", tipo: "aprobada" }, // Intro Pensamiento Científico
      { id: "10601", tipo: "aprobada" }, // Intro Sociología
    ],
    horas: 64,
  },

  // ══════════════════════════════════════════════════════════════════
  // TERCER AÑO  (row: 2)
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10123",
    nombre: "Derecho Privado II",
    nombreCorto: "D. Privado II",
    anio: 3, duracion: "cuatrimestral", col: 0, row: 2,
    requisitos: [
      { id: "10122", tipo: "aprobada" }, // D. Privado I
      { id: "10627", tipo: "aprobada" }, // Teoría del Conflicto
    ],
    horas: 96,
  },
  {
    id: "10124",
    nombre: "Derecho Privado III",
    nombreCorto: "D. Privado III",
    anio: 3, duracion: "cuatrimestral", col: 1, row: 2,
    requisitos: [
      { id: "10122", tipo: "aprobada" }, // D. Privado I
    ],
    horas: 96,
  },
  {
    id: "10107",
    nombre: "Derecho Penal II",
    nombreCorto: "D. Penal II",
    anio: 3, duracion: "cuatrimestral", col: 2, row: 2,
    requisitos: [
      { id: "10105", tipo: "aprobada" }, // D. Penal I
    ],
    horas: 96,
  },
  {
    id: "10604",
    nombre: "Economía Política",
    nombreCorto: "Economía Política",
    anio: 3, duracion: "cuatrimestral", col: 3, row: 2,
    requisitos: [
      { id: "10600", tipo: "aprobada" }, // Intro Cs. Sociales
      { id: "10601", tipo: "aprobada" }, // Intro Sociología
    ],
    horas: 64,
  },
  {
    id: "10108",
    nombre: "Derecho Público Provincial y Municipal",
    nombreCorto: "D. Público Provincial",
    anio: 3, duracion: "cuatrimestral", col: 4, row: 2,
    requisitos: [
      { id: "10106", tipo: "aprobada" }, // D. Constitucional
    ],
    horas: 64,
  },
  {
    id: "10109",
    nombre: "Derecho Internacional Público",
    nombreCorto: "D. Internacional Público",
    anio: 3, duracion: "cuatrimestral", col: 5, row: 2,
    requisitos: [
      { id: "10106", tipo: "aprobada" }, // D. Constitucional
    ],
    horas: 64,
  },
  {
    id: "10125",
    nombre: "Derecho Privado IV (Comercial I)",
    nombreCorto: "D. Privado IV (Com. I)",
    anio: 3, duracion: "cuatrimestral", col: 6, row: 2,
    requisitos: [
      { id: "10122", tipo: "aprobada" }, // D. Privado I
    ],
    horas: 96,
  },

  // ══════════════════════════════════════════════════════════════════
  // CUARTO AÑO  (row: 3)
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10126",
    nombre: "Derecho Privado V (Civil IV — Reales y Sucesiones)",
    nombreCorto: "D. Privado V",
    anio: 4, duracion: "cuatrimestral", col: 0, row: 3,
    requisitos: [
      { id: "10123", tipo: "aprobada" }, // D. Privado II
      { id: "10124", tipo: "aprobada" }, // D. Privado III
    ],
    horas: 96,
  },
  {
    id: "10110",
    nombre: "Derecho Procesal I",
    nombreCorto: "D. Procesal I",
    anio: 4, duracion: "cuatrimestral", col: 1, row: 3,
    requisitos: [
      { id: "10122", tipo: "aprobada" }, // D. Privado I
      { id: "10106", tipo: "aprobada" }, // D. Constitucional
    ],
    horas: 96,
  },
  {
    id: "10111",
    nombre: "Derecho Procesal II (Penal)",
    nombreCorto: "D. Procesal II (Penal)",
    anio: 4, duracion: "cuatrimestral", col: 2, row: 3,
    requisitos: [
      { id: "10107", tipo: "aprobada" }, // D. Penal II
      { id: "10110", tipo: "aprobada" }, // D. Procesal I
    ],
    horas: 96,
  },
  {
    id: "10112",
    nombre: "Derecho Social (Trabajo y Previsión Social)",
    nombreCorto: "D. Social / Laboral",
    anio: 4, duracion: "cuatrimestral", col: 3, row: 3,
    requisitos: [
      { id: "10125", tipo: "aprobada" }, // D. Privado IV
    ],
    horas: 96,
  },
  {
    id: "10113",
    nombre: "Derecho Administrativo I",
    nombreCorto: "D. Administrativo I",
    anio: 4, duracion: "cuatrimestral", col: 4, row: 3,
    requisitos: [
      { id: "10126", tipo: "aprobada" }, // D. Privado V
      { id: "10110", tipo: "aprobada" }, // D. Procesal I
    ],
    horas: 96,
  },
  {
    id: "10605",
    nombre: "Filosofía del Derecho",
    nombreCorto: "Filosofía del Derecho",
    anio: 4, duracion: "cuatrimestral", col: 5, row: 3,
    requisitos: [
      { id: "10101", tipo: "aprobada" }, // Intro al Derecho
      { id: "10627", tipo: "aprobada" }, // Teoría del Conflicto
    ],
    horas: 64,
  },

  // ══════════════════════════════════════════════════════════════════
  // QUINTO AÑO  (row: 4)
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10127",
    nombre: "Derecho Privado VI (Comercial II)",
    nombreCorto: "D. Privado VI (Com. II)",
    anio: 5, duracion: "cuatrimestral", col: 0, row: 4,
    requisitos: [
      { id: "10125", tipo: "aprobada" }, // D. Privado IV
      { id: "10126", tipo: "aprobada" }, // D. Privado V
    ],
    horas: 96,
  },
  {
    id: "10128",
    nombre: "Derecho de las Sucesiones",
    nombreCorto: "D. Sucesiones",
    anio: 5, duracion: "cuatrimestral", col: 1, row: 4,
    requisitos: [
      { id: "10126", tipo: "aprobada" }, // D. Privado V
    ],
    horas: 96,
  },
  {
    id: "10114",
    nombre: "Derecho Administrativo II",
    nombreCorto: "D. Administrativo II",
    anio: 5, duracion: "cuatrimestral", col: 2, row: 4,
    requisitos: [
      { id: "10113", tipo: "aprobada" }, // D. Administrativo I
    ],
    horas: 96,
  },
  {
    id: "10115",
    nombre: "Derecho Internacional Privado",
    nombreCorto: "D. Internacional Privado",
    anio: 5, duracion: "cuatrimestral", col: 3, row: 4,
    requisitos: [
      { id: "10128", tipo: "aprobada" }, // D. Sucesiones
      { id: "10127", tipo: "aprobada" }, // D. Privado VI
    ],
    horas: 64,
  },
  {
    id: "10606",
    nombre: "Finanzas y Derecho Financiero",
    nombreCorto: "Finanzas y D. Financiero",
    anio: 5, duracion: "cuatrimestral", col: 4, row: 4,
    requisitos: [
      { id: "10604", tipo: "aprobada" }, // Economía Política
      { id: "10114", tipo: "aprobada" }, // D. Administrativo II
    ],
    horas: 96,
  },
  {
    id: "10116",
    nombre: "Derecho Procesal III (Administrativo y Laboral)",
    nombreCorto: "D. Procesal III",
    anio: 5, duracion: "cuatrimestral", col: 5, row: 4,
    requisitos: [
      { id: "10112", tipo: "aprobada" }, // D. Social
      { id: "10111", tipo: "aprobada" }, // D. Procesal II
    ],
    horas: 96,
  },

  // ══════════════════════════════════════════════════════════════════
  // TALLERES DE IDIOMA — Bimestrales (4 talleres, 1 por bimestre)
  // Requisito especial: 1er Año aprobado
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10700",
    nombre: "Taller de Idioma I",
    nombreCorto: "Idioma I",
    anio: 2, duracion: "bimestral", col: 5, row: 1,
    requisitos: [],
    requisitosEspeciales: { primerAnioCompleto: true },
    horas: 32,
  },
  {
    id: "10701",
    nombre: "Taller de Idioma II",
    nombreCorto: "Idioma II",
    anio: 3, duracion: "bimestral", col: 7, row: 2,
    requisitos: [{ id: "10700", tipo: "aprobada" }],
    horas: 32,
  },
  {
    id: "10702",
    nombre: "Taller de Idioma III",
    nombreCorto: "Idioma III",
    anio: 4, duracion: "bimestral", col: 6, row: 3,
    requisitos: [{ id: "10701", tipo: "aprobada" }],
    horas: 32,
  },
  {
    id: "10703",
    nombre: "Taller de Idioma IV",
    nombreCorto: "Idioma IV",
    anio: 5, duracion: "bimestral", col: 6, row: 4,
    requisitos: [{ id: "10702", tipo: "aprobada" }],
    horas: 32,
  },

  // ══════════════════════════════════════════════════════════════════
  // PRÁCTICAS PRE-PROFESIONALES — Bimestrales
  // Requisito especial: 1er Año aprobado
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10800",
    nombre: "Práctica Pre-profesional I",
    nombreCorto: "Práctica I",
    anio: 2, duracion: "bimestral", col: 6, row: 1,
    requisitos: [],
    requisitosEspeciales: { primerAnioCompleto: true },
    horas: 64,
  },
  {
    id: "10801",
    nombre: "Práctica Pre-profesional II",
    nombreCorto: "Práctica II",
    anio: 3, duracion: "bimestral", col: 8, row: 2,
    requisitos: [{ id: "10800", tipo: "aprobada" }],
    horas: 64,
  },
  {
    id: "10802",
    nombre: "Práctica Pre-profesional III",
    nombreCorto: "Práctica III",
    anio: 4, duracion: "bimestral", col: 7, row: 3,
    requisitos: [{ id: "10801", tipo: "aprobada" }],
    horas: 64,
  },
  {
    id: "10803",
    nombre: "Práctica Pre-profesional IV (Pasantía)",
    nombreCorto: "Práctica IV (Pasantía)",
    anio: 5, duracion: "bimestral", col: 7, row: 4,
    requisitos: [{ id: "10802", tipo: "aprobada" }],
    horas: 128,
  },

  // ══════════════════════════════════════════════════════════════════
  // SEMINARIOS — Semestral
  // Requisito especial: 50% de la carrera aprobada
  // ══════════════════════════════════════════════════════════════════
  {
    id: "10900",
    nombre: "Seminario de Investigación I",
    nombreCorto: "Seminario I",
    anio: 4, duracion: "semestral", col: 8, row: 3,
    requisitos: [],
    requisitosEspeciales: { porcentajeCarrera: 50 },
    horas: 64,
  },
  {
    id: "10901",
    nombre: "Seminario de Investigación II",
    nombreCorto: "Seminario II",
    anio: 5, duracion: "semestral", col: 8, row: 4,
    requisitos: [{ id: "10900", tipo: "aprobada" }],
    horas: 64,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────

export const TOTAL_MATERIAS_PLAN6 = MATERIAS_PLAN6.length;

/** Calcula cuántas materias del Plan 6 están aprobadas */
export function calcularPorcentaje(estados: Record<string, EstadoMateria>): number {
  const aprobadas = MATERIAS_PLAN6.filter(m => estados[m.id] === "aprobada").length;
  return Math.round((aprobadas / TOTAL_MATERIAS_PLAN6) * 100);
}

/** Verifica si el 1er año está completo */
export function primerAnioCompleto(estados: Record<string, EstadoMateria>): boolean {
  return MATERIAS_PLAN6
    .filter(m => m.anio === 1)
    .every(m => estados[m.id] === "aprobada");
}

/** Determina el estado visual de una materia dado el mapa de estados */
export function getEstadoVisual(
  materia: Materia,
  estados: Record<string, EstadoMateria>
): EstadoMateria | "habilitada" | "bloqueada" {
  const estadoPropio = estados[materia.id] || "pendiente";
  if (estadoPropio === "aprobada") return "aprobada";

  // Verificar requisitos especiales
  if (materia.requisitosEspeciales?.primerAnioCompleto && !primerAnioCompleto(estados)) {
    return "bloqueada";
  }
  if (materia.requisitosEspeciales?.porcentajeCarrera) {
    const pct = calcularPorcentaje(estados);
    if (pct < materia.requisitosEspeciales.porcentajeCarrera) return "bloqueada";
  }

  // Verificar correlativas (solo se acepta "aprobada")
  const todas = materia.requisitos.every(req => estados[req.id] === "aprobada");

  return todas ? "habilitada" : "bloqueada";
}

// ── Conexiones automáticas generadas de los requisitos ──────────────
export interface Conexion {
  fromId: string;
  toId: string;
}

export const CONEXIONES_PLAN6: Conexion[] = MATERIAS_PLAN6.flatMap(m =>
  m.requisitos.map(req => ({ fromId: req.id, toId: m.id }))
);

// ── Layout constants (px) ────────────────────────────────────────────
export const NODE_W   = 148;
export const NODE_H   = 72;
export const GAP_X    = 28;
export const GAP_Y    = 72;
export const PAD_X    = 40;
export const PAD_Y    = 48;

/** Posición top-left del nodo en el canvas */
export function getNodePos(m: Materia) {
  return {
    x: PAD_X + m.col * (NODE_W + GAP_X),
    y: PAD_Y + m.row * (NODE_H + GAP_Y),
  };
}

/** Dimensiones totales del canvas */
export function getCanvasSize() {
  const maxCol = Math.max(...MATERIAS_PLAN6.map(m => m.col));
  const maxRow = Math.max(...MATERIAS_PLAN6.map(m => m.row));
  return {
    width:  PAD_X * 2 + (maxCol + 1) * NODE_W + maxCol * GAP_X,
    height: PAD_Y * 2 + (maxRow + 1) * NODE_H + maxRow * GAP_Y,
  };
}
