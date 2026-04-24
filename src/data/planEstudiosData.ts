// =====================================================================
// DND – Datos del Plan de Estudios (Plan 5 y Plan 6)
// Cada materia tiene: id, nombre, anio, tipo, posición en grilla (col, row)
// y prereqs (ids de materias previas requeridas para habilitarla)
// =====================================================================

export type TipoMateria = "bimestral" | "cuatrimestral" | "semestral" | "anual";
export type EstadoMateria = "pendiente" | "cursando" | "aprobada";

export interface MateriaNode {
  id: string;
  nombre: string;
  anio: number;
  tipo: TipoMateria;
  col: number;   // columna en la grilla (0-indexed)
  row: number;   // fila en la grilla (0-indexed)
  prereqs: string[]; // ids de materias previas requeridas
  creditos?: number;
}

export interface Conexion {
  from: string;
  to: string;
}

export interface PlanData {
  id: "plan5" | "plan6";
  nombre: string;
  descripcion: string;
  materias: MateriaNode[];
  conexiones: Conexion[];
}

// =====================================================================
// PLAN 6 — Plan Principal (más reciente)
// =====================================================================
const plan6Materias: MateriaNode[] = [
  // --- 1er Año ---
  { id: "p6_intro_dcho",       nombre: "Introducción al Derecho",           anio: 1, tipo: "cuatrimestral", col: 0, row: 0, prereqs: [] },
  { id: "p6_intro_cs_soc",     nombre: "Introducción a las Ciencias Sociales", anio: 1, tipo: "cuatrimestral", col: 1, row: 0, prereqs: [] },
  { id: "p6_hist_const",       nombre: "Historia Constitucional Argentina", anio: 1, tipo: "cuatrimestral", col: 2, row: 0, prereqs: [] },
  { id: "p6_dcho_romano",      nombre: "Derecho Romano",                    anio: 1, tipo: "anual",         col: 3, row: 0, prereqs: [] },
  { id: "p6_soc_dcho",         nombre: "Sociología del Derecho",            anio: 1, tipo: "cuatrimestral", col: 4, row: 0, prereqs: [] },
  { id: "p6_econ_pol",         nombre: "Economía Política",                 anio: 1, tipo: "cuatrimestral", col: 5, row: 0, prereqs: [] },

  // --- 2do Año ---
  { id: "p6_dcho_const",       nombre: "Derecho Constitucional",           anio: 2, tipo: "anual",         col: 0, row: 1, prereqs: ["p6_intro_dcho", "p6_hist_const"] },
  { id: "p6_dcho_priv1",       nombre: "Derecho Privado I (Civil)",        anio: 2, tipo: "anual",         col: 1, row: 1, prereqs: ["p6_dcho_romano"] },
  { id: "p6_dcho_penal1",      nombre: "Derecho Penal I",                  anio: 2, tipo: "anual",         col: 2, row: 1, prereqs: ["p6_intro_dcho"] },
  { id: "p6_fil_dcho",         nombre: "Filosofía del Derecho",            anio: 2, tipo: "cuatrimestral", col: 3, row: 1, prereqs: ["p6_intro_dcho", "p6_soc_dcho"] },
  { id: "p6_dcho_adm1",        nombre: "Derecho Administrativo I",        anio: 2, tipo: "anual",         col: 4, row: 1, prereqs: ["p6_dcho_const", "p6_intro_dcho"] },
  { id: "p6_dcho_intern_pub",  nombre: "Derecho Internacional Público",   anio: 2, tipo: "cuatrimestral", col: 5, row: 1, prereqs: ["p6_dcho_const"] },

  // --- 3er Año ---
  { id: "p6_dcho_priv2",       nombre: "Derecho Privado II (Obligaciones)", anio: 3, tipo: "anual",         col: 0, row: 2, prereqs: ["p6_dcho_priv1"] },
  { id: "p6_dcho_penal2",      nombre: "Derecho Penal II",                 anio: 3, tipo: "anual",         col: 1, row: 2, prereqs: ["p6_dcho_penal1"] },
  { id: "p6_dcho_proc_penal",  nombre: "Derecho Procesal Penal",          anio: 3, tipo: "anual",         col: 2, row: 2, prereqs: ["p6_dcho_penal1"] },
  { id: "p6_dcho_adm2",        nombre: "Derecho Administrativo II",       anio: 3, tipo: "anual",         col: 3, row: 2, prereqs: ["p6_dcho_adm1"] },
  { id: "p6_dcho_trab1",       nombre: "Derecho del Trabajo I",           anio: 3, tipo: "anual",         col: 4, row: 2, prereqs: ["p6_dcho_priv1"] },
  { id: "p6_dcho_intern_priv", nombre: "Derecho Internacional Privado",   anio: 3, tipo: "cuatrimestral", col: 5, row: 2, prereqs: ["p6_dcho_priv1", "p6_dcho_intern_pub"] },

  // --- 4to Año ---
  { id: "p6_dcho_priv3",       nombre: "Derecho Privado III (Contratos)", anio: 4, tipo: "anual",         col: 0, row: 3, prereqs: ["p6_dcho_priv2"] },
  { id: "p6_dcho_proc_civil",  nombre: "Derecho Procesal Civil",          anio: 4, tipo: "anual",         col: 1, row: 3, prereqs: ["p6_dcho_priv2"] },
  { id: "p6_dcho_trib",        nombre: "Derecho Tributario",              anio: 4, tipo: "cuatrimestral", col: 2, row: 3, prereqs: ["p6_dcho_adm2", "p6_dcho_priv2"] },
  { id: "p6_dcho_trab2",       nombre: "Derecho del Trabajo II",         anio: 4, tipo: "anual",         col: 3, row: 3, prereqs: ["p6_dcho_trab1"] },
  { id: "p6_dcho_seg_soc",     nombre: "Derecho de la Seguridad Social", anio: 4, tipo: "cuatrimestral", col: 4, row: 3, prereqs: ["p6_dcho_trab1"] },
  { id: "p6_dcho_financiero",  nombre: "Derecho Financiero",              anio: 4, tipo: "cuatrimestral", col: 5, row: 3, prereqs: ["p6_dcho_adm2", "p6_econ_pol"] },

  // --- 5to Año ---
  { id: "p6_dcho_priv4",       nombre: "Derecho Privado IV (Reales)",    anio: 5, tipo: "anual",         col: 0, row: 4, prereqs: ["p6_dcho_priv3"] },
  { id: "p6_dcho_sucesiones",  nombre: "Derecho de las Sucesiones",      anio: 5, tipo: "cuatrimestral", col: 1, row: 4, prereqs: ["p6_dcho_priv3"] },
  { id: "p6_dcho_empresas",    nombre: "Derecho de las Empresas",        anio: 5, tipo: "anual",         col: 2, row: 4, prereqs: ["p6_dcho_priv3"] },
  { id: "p6_dcho_ambiental",   nombre: "Derecho Ambiental",              anio: 5, tipo: "cuatrimestral", col: 3, row: 4, prereqs: ["p6_dcho_adm2"] },
  { id: "p6_etica",            nombre: "Ética y Responsabilidad Profesional", anio: 5, tipo: "bimestral", col: 4, row: 4, prereqs: ["p6_fil_dcho"] },
  { id: "p6_tesis",            nombre: "Trabajo Final Integrador",       anio: 5, tipo: "semestral",     col: 5, row: 4, prereqs: ["p6_dcho_priv4", "p6_dcho_proc_civil", "p6_dcho_empresas"] },
];

const plan6Conexiones: Conexion[] = plan6Materias
  .flatMap(m => m.prereqs.map(prereqId => ({ from: prereqId, to: m.id })));

// =====================================================================
// PLAN 5 — Plan anterior (aún vigente)
// =====================================================================
const plan5Materias: MateriaNode[] = [
  // --- 1er Año ---
  { id: "p5_intro_dcho",    nombre: "Introducción al Derecho",          anio: 1, tipo: "cuatrimestral", col: 0, row: 0, prereqs: [] },
  { id: "p5_dcho_romano",   nombre: "Derecho Romano",                   anio: 1, tipo: "anual",         col: 1, row: 0, prereqs: [] },
  { id: "p5_hist_const",    nombre: "Historia Constitucional",          anio: 1, tipo: "cuatrimestral", col: 2, row: 0, prereqs: [] },
  { id: "p5_soc",           nombre: "Sociología",                       anio: 1, tipo: "cuatrimestral", col: 3, row: 0, prereqs: [] },
  { id: "p5_econ",          nombre: "Economía",                         anio: 1, tipo: "cuatrimestral", col: 4, row: 0, prereqs: [] },

  // --- 2do Año ---
  { id: "p5_dcho_const",    nombre: "Derecho Constitucional",          anio: 2, tipo: "anual",         col: 0, row: 1, prereqs: ["p5_intro_dcho", "p5_hist_const"] },
  { id: "p5_civil1",        nombre: "Derecho Civil I (Parte Gral.)",   anio: 2, tipo: "anual",         col: 1, row: 1, prereqs: ["p5_dcho_romano", "p5_intro_dcho"] },
  { id: "p5_penal1",        nombre: "Derecho Penal I",                 anio: 2, tipo: "anual",         col: 2, row: 1, prereqs: ["p5_intro_dcho"] },
  { id: "p5_adm1",          nombre: "Derecho Administrativo I",        anio: 2, tipo: "anual",         col: 3, row: 1, prereqs: ["p5_dcho_const"] },
  { id: "p5_fil",           nombre: "Filosofía del Derecho",           anio: 2, tipo: "cuatrimestral", col: 4, row: 1, prereqs: ["p5_intro_dcho"] },

  // --- 3er Año ---
  { id: "p5_civil2",        nombre: "Derecho Civil II (Obligaciones)", anio: 3, tipo: "anual",         col: 0, row: 2, prereqs: ["p5_civil1"] },
  { id: "p5_proc_civil",    nombre: "Derecho Procesal Civil",          anio: 3, tipo: "anual",         col: 1, row: 2, prereqs: ["p5_civil1", "p5_dcho_const"] },
  { id: "p5_penal2",        nombre: "Derecho Penal II",                anio: 3, tipo: "anual",         col: 2, row: 2, prereqs: ["p5_penal1"] },
  { id: "p5_adm2",          nombre: "Derecho Administrativo II",       anio: 3, tipo: "anual",         col: 3, row: 2, prereqs: ["p5_adm1"] },
  { id: "p5_trab1",         nombre: "Derecho Laboral I",               anio: 3, tipo: "anual",         col: 4, row: 2, prereqs: ["p5_civil1"] },

  // --- 4to Año ---
  { id: "p5_civil3",        nombre: "Derecho Civil III (Contratos)",   anio: 4, tipo: "anual",         col: 0, row: 3, prereqs: ["p5_civil2"] },
  { id: "p5_proc_penal",    nombre: "Derecho Procesal Penal",          anio: 4, tipo: "anual",         col: 1, row: 3, prereqs: ["p5_penal2"] },
  { id: "p5_comercial",     nombre: "Derecho Comercial",               anio: 4, tipo: "anual",         col: 2, row: 3, prereqs: ["p5_civil2"] },
  { id: "p5_trib",          nombre: "Derecho Tributario",              anio: 4, tipo: "cuatrimestral", col: 3, row: 3, prereqs: ["p5_adm2", "p5_civil2"] },
  { id: "p5_trab2",         nombre: "Derecho Laboral II",              anio: 4, tipo: "anual",         col: 4, row: 3, prereqs: ["p5_trab1"] },

  // --- 5to Año ---
  { id: "p5_civil4",        nombre: "Derecho Civil IV (Reales)",       anio: 5, tipo: "anual",         col: 0, row: 4, prereqs: ["p5_civil3"] },
  { id: "p5_sucesiones",    nombre: "Derecho de las Sucesiones",       anio: 5, tipo: "cuatrimestral", col: 1, row: 4, prereqs: ["p5_civil3"] },
  { id: "p5_intern",        nombre: "Derecho Internacional",           anio: 5, tipo: "cuatrimestral", col: 2, row: 4, prereqs: ["p5_dcho_const"] },
  { id: "p5_seg_soc",       nombre: "Seguridad Social",                anio: 5, tipo: "cuatrimestral", col: 3, row: 4, prereqs: ["p5_trab2"] },
  { id: "p5_etica",         nombre: "Ética Jurídica",                  anio: 5, tipo: "bimestral",     col: 4, row: 4, prereqs: ["p5_fil"] },
];

const plan5Conexiones: Conexion[] = plan5Materias
  .flatMap(m => m.prereqs.map(prereqId => ({ from: prereqId, to: m.id })));

// =====================================================================
// Exports
// =====================================================================
export const PLANES: PlanData[] = [
  {
    id: "plan6",
    nombre: "Plan de Estudios Nº 6",
    descripcion: "Plan vigente (2024). Mayor integración de materias y énfasis en formación jurídica contemporánea.",
    materias: plan6Materias,
    conexiones: plan6Conexiones,
  },
  {
    id: "plan5",
    nombre: "Plan de Estudios Nº 5",
    descripcion: "Plan anterior, aún vigente para estudiantes que lo iniciaron. Estructura clásica de 5 años.",
    materias: plan5Materias,
    conexiones: plan5Conexiones,
  },
];

export const TIPO_CONFIG: Record<TipoMateria, { label: string; color: string; border: string }> = {
  bimestral:      { label: "Bimestral",     color: "#7c3aed", border: "#9f67ff" },
  cuatrimestral:  { label: "Cuatrimestral", color: "#1d4ed8", border: "#3b82f6" },
  semestral:      { label: "Semestral",     color: "#0f766e", border: "#14b8a6" },
  anual:          { label: "Anual",         color: "#0a2463", border: "#1e40af" },
};
