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
 * Orden del ciclo de ramas. Avanza en cada cierre de temporada, que ocurre los
 * domingos 19:00. Empieza en Constitucional.
 */
export const CICLO_RAMAS: RamaId[] = ["constitucional", "penal", "privado", "internacional", "administrativo"];

export function getRamaById(id: RamaId): RamaJuridica {
  return RAMAS_JURIDICAS.find(r => r.id === id) || RAMAS_JURIDICAS[0];
}

/**
 * La rama fija se ata al número de temporada, no a un ancla de tiempo: cada
 * temporada que cierra hace avanzar el ciclo. Así el cambio de rama y el cierre
 * de temporada nunca se desincronizan, aunque un cierre se atrase.
 * La temporada 1 juega Constitucional.
 */
export function getRamaDeTemporada(numeroTemporada: number): RamaJuridica {
  const largo = CICLO_RAMAS.length;
  const idx = (((numeroTemporada - 1) % largo) + largo) % largo;
  return getRamaById(CICLO_RAMAS[idx]);
}

/** Rama que entra en la temporada siguiente. */
export function getRamaSiguiente(numeroTemporada: number): RamaJuridica {
  return getRamaDeTemporada(numeroTemporada + 1);
}

/**
 * Sorteo de duelo: la rama fija de la temporada más una segunda al azar.
 * El resultado se fija al crear la sala y se guarda en la fila del duelo, así
 * el rival gira la ruleta y le cae exactamente lo mismo.
 */
export function sortearRamasDuelo(numeroTemporada: number): [RamaId, RamaId] {
  const fija = getRamaDeTemporada(numeroTemporada).id;
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
 * Arma las preguntas de un duelo: 3 de la rama fija de la temporada y 2 de la
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
