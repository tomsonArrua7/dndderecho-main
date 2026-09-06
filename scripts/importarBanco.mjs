/**
 * Importador del banco de preguntas de trivia.
 *
 * Lee los JSON exportados de los documentos de cátedra, deduplica, valida,
 * mapea el nombre de materia al código del plan de estudios y emite un módulo
 * TypeScript listo para consumir desde la app.
 *
 * Uso:
 *   node scripts/importarBanco.mjs [carpeta...]
 *
 * Sin argumentos usa las carpetas por defecto (RAMAS y AÑOS). Cuando estén las
 * reconversiones, agregar la carpeta nueva al final: los archivos que llegan
 * después pisan a los anteriores ante un empate de texto, así una pregunta
 * reetiquetada reemplaza a la vieja mal etiquetada.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const RAIZ_DESCARGAS = "C:/Users/aylen/Downloads/TRIVIA JURSOC-20260906T123036Z-1-001/TRIVIA JURSOC";
const CARPETAS_DEFAULT = [path.join(RAIZ_DESCARGAS, "RAMAS"), path.join(RAIZ_DESCARGAS, "A\u00d1OS")];

const SALIDA_TS = "src/data/bancoPreguntas.generated.ts";
const SALIDA_REPORTE = path.join(RAIZ_DESCARGAS, "reporte-importacion.json");

/** Etiquetas que el conversor puso cuando no supo separar por materia. */
const ETIQUETAS_GENERICAS = /^materias de (primer|segund|tercer|cuart|quint)/i;

/** Espejo de RAMAS_JURIDICAS en src/data/ramasTrivia.ts (fuente de verdad de la app). */
const RAMAS = {
  constitucional: ["10125", "10136"],
  penal: ["10124", "10135", "10134"],
  internacional: ["10626", "10138", "10156"],
  privado: ["10122", "10123", "10133", "10143", "10132", "10142"],
  administrativo: ["10141", "10151"]
};

const norm = s =>
  (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();

/** Lee el catálogo de materias desde triviaData.ts para no duplicarlo acá. */
function leerCatalogo() {
  const src = fs.readFileSync("src/data/triviaData.ts", "utf8");
  const bloque = src.slice(src.indexOf("export const CATEGORIAS_TRIVIA"));
  const catalogo = [];
  const re = /id:\s*"([^"]+)",\s*\n\s*nombre:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(bloque))) {
    if (m[1] !== "todas") catalogo.push({ id: m[1], nombre: m[2] });
  }
  if (catalogo.length < 30) {
    throw new Error(`Catálogo incompleto: sólo se parsearon ${catalogo.length} materias de triviaData.ts`);
  }
  return catalogo;
}

const CATALOGO = leerCatalogo();
const PORNOMBRE = new Map(CATALOGO.map(c => [norm(c.nombre), c]));

/** Variantes de nombre que puede escribir el conversor y no matchean exacto. */
const ALIAS = {
  "derecho publico provincial y municipal": "10136",
  "derecho publico provincial": "10136",
  "derecho procesal i penal": "10134",
  "derecho procesal penal": "10134",
  "derecho procesal ii civil y comercial": "10144",
  "contratos": "10133",
  "derecho privado iii contratos": "10133",
  "derechos reales": "10143",
  "derecho privado v reales": "10143",
  "quiebras": "10142",
  "derecho privado vi concursos y quiebras": "10142",
  "derecho comercial": "10132",
  "derecho privado iv comercial i": "10132",
  "derecho de la navegacion aeronautico": "10152",
  "finanzas y derecho tributario": "10158",
  "derecho notarial": "10157",
  "sucesiones": "10659"
};

function resolverMateria(nombre) {
  const n = norm(nombre);
  if (!n) return null;
  if (ETIQUETAS_GENERICAS.test(nombre)) return { generica: true };
  const directo = PORNOMBRE.get(n);
  if (directo) return directo;
  const porAlias = ALIAS[n];
  if (porAlias) return CATALOGO.find(c => c.id === porAlias) || null;
  return null;
}

/** Preguntas donde el conversor pegó varias en un mismo campo. */
function textoSospechoso(q) {
  const p = q.pregunta || "";
  return p.length > 400 || /✅/.test(p) || /\b[b-d]\)\s/.test(p) || (p.match(/\?/g) || []).length > 2;
}

function normalizarDificultad(d) {
  const n = norm(d);
  if (n.startsWith("facil")) return "facil";
  if (n.startsWith("dificil")) return "dificil";
  return "media";
}

function limpiarTexto(s) {
  return (s || "").toString()
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    // Algunos documentos pierden el espacio en el corte de l\u00EDnea y quedan
    // pegadas ("laConstituci\u00F3n", "elcaso"). Se separa cuando una min\u00FAscula
    // precede a una palabra que arranca en may\u00FAscula; las siglas en versales
    // (UNLP, CCyC, FCJyS) no matchean porque exigen dos min\u00FAsculas despu\u00E9s.
    .replace(/([a-z\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1])([A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1][a-z\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1]{2,})/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------- carga

const carpetas = process.argv.slice(2).length ? process.argv.slice(2) : CARPETAS_DEFAULT;
const crudas = [];

for (const dir of carpetas) {
  if (!fs.existsSync(dir)) {
    console.error(`AVISO: no existe la carpeta ${dir}, se omite.`);
    continue;
  }
  for (const f of fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".json"))) {
    const ruta = path.join(dir, f);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(ruta, "utf8"));
    } catch (e) {
      console.error(`ERROR de parseo en ${f}: ${e.message}`);
      continue;
    }
    if (!Array.isArray(data)) {
      console.error(`ERROR: la raíz de ${f} no es un array, se omite.`);
      continue;
    }
    data.forEach((q, i) => crudas.push({ q, origen: `${path.basename(dir)}/${f}`, indice: i }));
  }
}

// ---------------------------------------------------------------- proceso

const cuarentena = { sinMateria: [], materiaDesconocida: [], textoRoto: [], sinFundamento: [], estructura: [] };
const porTexto = new Map();

for (const item of crudas) {
  const q = item.q;
  const pregunta = limpiarTexto(q.pregunta);
  const clave = norm(pregunta);

  const ficha = {
    pregunta,
    opciones: Array.isArray(q.opciones) ? q.opciones.map(limpiarTexto) : [],
    respuesta_correcta_index: q.respuesta_correcta_index,
    fundamento_juridico: limpiarTexto(q.fundamento_juridico),
    dificultad: normalizarDificultad(q.dificultad),
    materiaCruda: q.materia,
    origen: item.origen
  };

  if (!clave || ficha.opciones.length !== 4 ||
      typeof ficha.respuesta_correcta_index !== "number" ||
      ficha.respuesta_correcta_index < 0 || ficha.respuesta_correcta_index > 3) {
    cuarentena.estructura.push(ficha);
    continue;
  }

  const materia = resolverMateria(q.materia);
  ficha.materia = materia && !materia.generica ? materia : null;
  ficha.generica = !!(materia && materia.generica);
  ficha.desconocida = !materia;
  ficha.roto = textoSospechoso(q);
  ficha.sinFundamento = ficha.fundamento_juridico.length < 5;

  // Ante duplicados gana la mejor versión: con materia real, texto sano y fundamento.
  const puntaje = (ficha.materia ? 100 : 0) + (ficha.roto ? 0 : 20) + (ficha.sinFundamento ? 0 : 10);
  const previo = porTexto.get(clave);
  if (!previo || puntaje >= previo.puntaje) porTexto.set(clave, { ficha, puntaje });
}

const preguntas = [];
for (const { ficha } of porTexto.values()) {
  if (ficha.roto) { cuarentena.textoRoto.push(ficha); continue; }
  if (ficha.desconocida) { cuarentena.materiaDesconocida.push(ficha); continue; }
  if (!ficha.materia) { cuarentena.sinMateria.push(ficha); continue; }
  if (ficha.sinFundamento) { cuarentena.sinFundamento.push(ficha); continue; }

  const hash = crypto.createHash("sha1").update(norm(ficha.pregunta)).digest("hex").slice(0, 8);
  preguntas.push({
    id: `${ficha.materia.id}-${hash}`,
    id_categoria: ficha.materia.id,
    categoria_nombre: ficha.materia.nombre,
    dificultad: ficha.dificultad,
    pregunta: ficha.pregunta,
    opciones: ficha.opciones,
    respuesta_correcta_index: ficha.respuesta_correcta_index,
    fundamento_juridico: ficha.fundamento_juridico,
    puntos_base: 100
  });
}

preguntas.sort((a, b) => a.id_categoria.localeCompare(b.id_categoria) || a.id.localeCompare(b.id));

const idsRepetidos = preguntas.length - new Set(preguntas.map(p => p.id)).size;
if (idsRepetidos > 0) throw new Error(`Se generaron ${idsRepetidos} ids duplicados, revisar el hash.`);

// ---------------------------------------------------------------- salida

const cabecera = `// ARCHIVO GENERADO POR scripts/importarBanco.mjs — NO EDITAR A MANO.
// Para regenerarlo: node scripts/importarBanco.mjs [carpetas...]
// Generado: ${new Date().toISOString()}
// Preguntas: ${preguntas.length}

import type { TriviaQuestion } from "./triviaData";

export const BANCO_PREGUNTAS: TriviaQuestion[] = `;

fs.writeFileSync(SALIDA_TS, cabecera + JSON.stringify(preguntas, null, 2) + ";\n", "utf8");

const porMateria = {};
preguntas.forEach(p => (porMateria[p.categoria_nombre] = (porMateria[p.categoria_nombre] || 0) + 1));

const porRama = {};
for (const [rama, materiaIds] of Object.entries(RAMAS)) {
  porRama[rama] = {
    total: preguntas.filter(p => materiaIds.includes(p.id_categoria)).length,
    materias: Object.fromEntries(materiaIds.map(id => {
      const nombre = CATALOGO.find(c => c.id === id)?.nombre || id;
      return [nombre, preguntas.filter(p => p.id_categoria === id).length];
    }))
  };
}

fs.writeFileSync(SALIDA_REPORTE, JSON.stringify({
  generado: new Date().toISOString(),
  carpetas,
  totales: {
    leidas: crudas.length,
    unicas: porTexto.size,
    importadas: preguntas.length,
    cuarentena: Object.fromEntries(Object.entries(cuarentena).map(([k, v]) => [k, v.length]))
  },
  porRama,
  porMateria,
  cuarentena
}, null, 2), "utf8");

console.log("=== IMPORTACION ===");
console.log(`leidas de disco : ${crudas.length}`);
console.log(`unicas por texto: ${porTexto.size}`);
console.log(`IMPORTADAS      : ${preguntas.length}   -> ${SALIDA_TS}`);
console.log("\ncuarentena:");
Object.entries(cuarentena).forEach(([k, v]) => console.log(`   ${String(v.length).padStart(5)}  ${k}`));
console.log("\n=== COBERTURA POR RAMA (modo competitivo) ===");
for (const [rama, info] of Object.entries(porRama)) {
  console.log(`\n${rama.toUpperCase()}  total ${info.total}`);
  Object.entries(info.materias).forEach(([m, n]) =>
    console.log(`   ${String(n).padStart(4)}  ${m}${n === 0 ? "   <-- VACIA" : ""}`));
}
console.log(`\nDetalle completo en: ${SALIDA_REPORTE}`);
