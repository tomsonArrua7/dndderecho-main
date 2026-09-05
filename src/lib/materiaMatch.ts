// Utilidades para emparejar nombres de materias provenientes de distintas fuentes
// (catálogo de la base de datos, mapa de carpetas de Drive, listado de archivos).
// Los nombres no coinciden literalmente: "Derecho Privado II - Civil" (DB) vs
// "Derecho Privado II (Obligaciones)" (links). Comparar por substring hacía que
// "Derecho Privado I" matcheara con II, III y IV, mezclando los resultados.

const ROMANOS: Record<string, string> = {
  i: "1", ii: "2", iii: "3", iv: "4", v: "5", vi: "6",
  vii: "7", viii: "8", ix: "9", x: "10",
};

const VACIAS = new Set(["de", "del", "la", "las", "el", "los", "y", "en", "al", "a", "plan"]);

// Abreviaturas usadas en los listados de Drive ("Adap. Profesional...", "Seg. Social").
const ABREVIATURAS: Record<string, string> = {
  adap: "adaptacion",
  prev: "prevencion",
  seg: "seguridad",
};

// Equivalencias entre nombres de la misma materia en distintos planes: las
// Civiles y Comerciales del Plan 5 son las Privado del Plan 6, y el material de
// Drive está guardado con el nombre nuevo. Clave y valor son nombres ya tokenizados.
const EQUIVALENCIAS: Record<string, string> = {
  "derecho civil 1": "derecho privado 1",
  "derecho civil 2": "derecho privado 2",     // Obligaciones
  "derecho civil 3": "derecho privado 3",     // Contratos
  "derecho civil 4": "derecho privado 5",     // Derechos Reales
  "derecho comercial 1": "derecho privado 4",
  "derecho comercial 2": "derecho privado 6", // Sociedades
  "finanza derecho tributario": "finanza derecho financiero",
  "derecho trabajo seguridad social": "derecho social trabajo prevencion social",
};

/** Normaliza un nombre de materia a tokens comparables (sin acentos, sin paréntesis, romanos → números). */
export function tokenizarMateria(nombre: string): string[] {
  const tokens = tokenizarCrudo(nombre);
  const equivalente = EQUIVALENCIAS[tokens.join(" ")];
  return equivalente ? equivalente.split(" ") : tokens;
}

function tokenizarCrudo(nombre: string): string[] {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((t) => ROMANOS[t] ?? t)
    .filter((t) => !VACIAS.has(t))
    // Singularizamos para tolerar "Taller/Talleres", "Idioma/Idiomas".
    .map((t) => {
      if (t.length > 5 && t.endsWith("es")) return t.slice(0, -2);
      if (t.length > 4 && t.endsWith("s")) return t.slice(0, -1);
      return t;
    })
    .map((t) => ABREVIATURAS[t] ?? t);
}

/** Número de orden de la materia (I, II, 2, ...) o null si no tiene. */
function ordinal(tokens: string[]): string | null {
  return tokens.find((t) => /^\d+$/.test(t)) ?? null;
}

/** Longitud del prefijo común entre dos listas de tokens. */
function prefijoComun(a: string[], b: string[]): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/** Tokens que aportan identidad (sin "derecho", que aparece en casi todas, ni el número de orden). */
function tokensDeContenido(tokens: string[]): Set<string> {
  return new Set(tokens.filter((t) => t !== "derecho" && !/^\d+$/.test(t)));
}

function interseccion(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) if (b.has(t)) n++;
  return n;
}

/** "derecho" pesa poco: está en casi todos los nombres y no distingue materias. */
function peso(token: string): number {
  return token === "derecho" ? 0.25 : 1;
}

function pesoTotal(tokens: string[]): number {
  return tokens.reduce((acc, t) => acc + peso(t), 0);
}

/**
 * Similitud entre dos nombres de materia: ~1 = idénticos, 0 = incompatibles.
 *
 * Reglas duras (score 0):
 *  - Números de orden distintos: "Privado I" nunca matchea con "Privado II".
 *  - El nombre más corto tiene que estar contenido en el más largo por sus
 *    palabras propias: así "Derecho Civil I" no cae en "Derecho Administrativo I"
 *    sólo por compartir "derecho" y el "I".
 *
 * Ante empate desempata el prefijo común ("Privado V - Civil" prefiere
 * "Privado V (Reales)" sobre "Civil V").
 */
export function similitudMateria(a: string, b: string): number {
  const ta = tokenizarMateria(a);
  const tb = tokenizarMateria(b);
  if (ta.length === 0 || tb.length === 0) return 0;

  const oa = ordinal(ta);
  const ob = ordinal(tb);
  if (oa && ob && oa !== ob) return 0;

  const ca = tokensDeContenido(ta);
  const cb = tokensDeContenido(tb);
  const comunesContenido = interseccion(ca, cb);
  const menor = Math.min(ca.size, cb.size);
  // El nombre corto tiene que quedar (casi) contenido en el largo.
  if (menor === 0 || comunesContenido / menor < 0.75) return 0;

  const setB = new Set(tb);
  const comunes = ta.filter((t) => setB.has(t)).reduce((acc, t) => acc + peso(t), 0);
  let score = comunes / Math.max(pesoTotal(ta), pesoTotal(tb));

  // Una lleva número de orden y la otra no: penalizamos, pero no descartamos
  // ("Taller ... en Idioma I" vs la carpeta única "Talleres ... en Idiomas").
  if (!oa !== !ob) score *= 0.9;

  return score + prefijoComun(ta, tb) / 1000;
}

/** Umbral mínimo para considerar que dos nombres refieren a la misma materia. */
export const UMBRAL_MATERIA = 0.4;

/**
 * Devuelve el candidato que mejor representa a `nombre`, o null si ninguno supera el umbral.
 * `getNombre` extrae el nombre de materia de cada candidato.
 */
export function mejorMateria<T>(
  nombre: string,
  candidatos: T[],
  getNombre: (c: T) => string,
): T | null {
  let mejor: T | null = null;
  let mejorScore = 0;
  for (const c of candidatos) {
    const s = similitudMateria(nombre, getNombre(c));
    if (s > mejorScore) {
      mejorScore = s;
      mejor = c;
    }
  }
  return mejorScore >= UMBRAL_MATERIA ? mejor : null;
}
