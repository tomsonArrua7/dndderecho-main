import { CATEGORIAS_TRIVIA, TriviaQuestion } from "./triviaData";

export type RamaId = "constitucional" | "penal" | "internacional" | "privado" | "administrativo";

export interface RamaJuridica {
  id: RamaId;
  nombre: string;
  /** Materias que la componen, para mostrarle al jugador qué le puede tocar. */
  detalle: string;
  /** Códigos de CATEGORIAS_TRIVIA que alimentan el pool de preguntas de la rama. */
  materiaIds: string[];
  icono: string;
  color: string;
}

export const RAMAS_JURIDICAS: RamaJuridica[] = [
  {
    id: "constitucional",
    nombre: "Derecho Constitucional",
    detalle: "Constitucional y Público Provincial y Municipal",
    materiaIds: ["10125", "10136"],
    icono: "Landmark",
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: "penal",
    nombre: "Derecho Penal",
    detalle: "Penal I, Penal II y Procesal I",
    materiaIds: ["10124", "10135", "10134"],
    icono: "ShieldAlert",
    color: "from-red-600 to-rose-700"
  },
  {
    id: "internacional",
    nombre: "Derechos Humanos e Internacional",
    detalle: "Derechos Humanos, Internacional Público e Internacional Privado",
    materiaIds: ["10626", "10138", "10156"],
    icono: "Globe",
    color: "from-sky-600 to-blue-700"
  },
  {
    id: "privado",
    nombre: "Derecho Privado",
    detalle: "Privado I y II, Contratos, Reales, Comercial y Quiebras",
    materiaIds: ["10122", "10123", "10133", "10143", "10132", "10142"],
    icono: "Scale",
    color: "from-violet-600 to-indigo-700"
  },
  {
    id: "administrativo",
    nombre: "Derecho Administrativo",
    detalle: "Administrativo I y II",
    materiaIds: ["10141", "10151"],
    icono: "Building2",
    color: "from-teal-600 to-cyan-700"
  }
];

/**
 * Orden del ciclo de "rama de la semana". Rota cada jueves 19:00, junto con el
 * reset semanal de duelos 1v1. Empieza en Constitucional.
 */
export const CICLO_RAMAS: RamaId[] = ["constitucional", "penal", "privado", "internacional", "administrativo"];

/**
 * Jueves 19:00 en que arrancó la semana de Constitucional. Todo el ciclo se
 * calcula contando semanas desde acá, así el server y el cliente coinciden sin
 * necesidad de guardar estado.
 */
export const ANCLA_CICLO_RAMAS = new Date("2026-09-03T19:00:00-03:00").getTime();

const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

export function getRamaById(id: RamaId): RamaJuridica {
  return RAMAS_JURIDICAS.find(r => r.id === id) || RAMAS_JURIDICAS[0];
}

/** Índice de semana dentro del ciclo (0..4) para un momento dado. */
export function getIndiceSemana(now: number = Date.now()): number {
  const semanas = Math.floor((now - ANCLA_CICLO_RAMAS) / SEMANA_MS);
  const mod = semanas % CICLO_RAMAS.length;
  return mod < 0 ? mod + CICLO_RAMAS.length : mod;
}

/** Rama fija de la semana en curso. */
export function getRamaDeLaSemana(now: number = Date.now()): RamaJuridica {
  return getRamaById(CICLO_RAMAS[getIndiceSemana(now)]);
}

/** Rama que entra en la próxima rotación. */
export function getRamaSiguiente(now: number = Date.now()): RamaJuridica {
  return getRamaById(CICLO_RAMAS[(getIndiceSemana(now) + 1) % CICLO_RAMAS.length]);
}

/** Momento exacto de la próxima rotación (jueves 19:00). */
export function getProximaRotacion(now: number = Date.now()): number {
  const semanas = Math.floor((now - ANCLA_CICLO_RAMAS) / SEMANA_MS);
  return ANCLA_CICLO_RAMAS + (semanas + 1) * SEMANA_MS;
}

/**
 * Sorteo de duelo: la rama fija de la semana más una segunda al azar.
 * El resultado se fija al crear la sala y se guarda en la fila del duelo, así
 * el rival gira la ruleta y le cae exactamente lo mismo.
 */
export function sortearRamasDuelo(now: number = Date.now()): [RamaId, RamaId] {
  const fija = getRamaDeLaSemana(now).id;
  const resto = CICLO_RAMAS.filter(r => r !== fija);
  const azar = resto[Math.floor(Math.random() * resto.length)];
  return [fija, azar];
}

/** A qué rama pertenece una materia, o null si queda fuera del competitivo. */
export function getRamaDeMateria(materiaId: string): RamaJuridica | null {
  return RAMAS_JURIDICAS.find(r => r.materiaIds.includes(materiaId)) || null;
}

/** Nombres de materia de una rama, para mostrarlos en la UI. */
export function getMateriasDeRama(ramaId: RamaId): string[] {
  const rama = getRamaById(ramaId);
  return rama.materiaIds
    .map(id => CATEGORIAS_TRIVIA.find(c => c.id === id)?.nombre)
    .filter((n): n is string => !!n);
}

/** Todas las preguntas del pool que pertenecen a una rama. */
export function getPoolDeRama(ramaId: RamaId, pool: TriviaQuestion[]): TriviaQuestion[] {
  const { materiaIds } = getRamaById(ramaId);
  return pool.filter(q => materiaIds.includes(q.id_categoria));
}

function tomarAlAzar<T>(arr: T[], n: number): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}

/**
 * Arma las preguntas de un duelo: 3 de la rama fija de la semana y 2 de la
 * sorteada. Si alguna rama no llega a su cupo, la otra completa; si aun así
 * falta, se completa con el pool general para no dejar la sala sin preguntas.
 */
export function seleccionarPreguntasDuelo(
  ramaFija: RamaId,
  ramaAzar: RamaId,
  pool: TriviaQuestion[],
  total: number = 5
): TriviaQuestion[] {
  const cupoFija = Math.ceil(total * 0.6);
  const deFija = tomarAlAzar(getPoolDeRama(ramaFija, pool), cupoFija);
  const deAzar = tomarAlAzar(getPoolDeRama(ramaAzar, pool), total - deFija.length);

  const elegidas = [...deFija, ...deAzar];
  if (elegidas.length < total) {
    const yaElegidas = new Set(elegidas.map(q => q.id));
    elegidas.push(...tomarAlAzar(pool.filter(q => !yaElegidas.has(q.id)), total - elegidas.length));
  }
  return tomarAlAzar(elegidas, elegidas.length);
}
