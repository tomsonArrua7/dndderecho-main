/**
 * Extractor del banco de preguntas desde los documentos originales de cátedra.
 *
 * Reemplaza la conversión asistida por IA, que venía desalineando opciones y
 * truncando texto. Acá se parsea la estructura real de cada documento, que es
 * regular, así que el resultado es determinístico y reproducible.
 *
 * Formatos reconocidos:
 *   A  enunciado + "a) ... ✅"                  (la tilde marca la correcta)
 *   B  "Pregunta N:" + "A) [ CORRECTA] ..."
 *   C  "N." + "[ ] A) ..." + "Explicación:"     (sin marca de correcta)
 *   D  markdown: "### Pregunta N", "**Respuesta Correcta: A**", "**Justificación Jurídica:**"
 *
 * Uso:  node scripts/extraerBanco.mjs [--out <carpeta>]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const BASE = "C:/Users/aylen/Downloads/TRIVIA JURSOC-20260906T123036Z-1-001/TRIVIA JURSOC";
const OUT = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : path.join(BASE, "EXTRAIDO");

/**
 * Qué materia contiene cada documento. Los marcados MULTI traen varias materias
 * separadas por títulos internos y se resuelven leyendo esos títulos.
 */
const DOCUMENTOS = {
  "PRIMERO/Derecho romano.docx": "Derecho Romano",
  "PRIMERO/Historia constitucional.pdf": "Historia Constitucional",
  "PRIMERO/introduccion a la sociologia.pdf": "Introducción a la Sociología",
  "PRIMERO/introduccion al derecho.docx": "Introducción al Derecho",
  "PRIMERO/Introduccion al pensamiento cientifico.pdf": "Introducción al Pensamiento Científico",
  "SEGUNDO/Preguntas trivias.docx": "MULTI",
  "TERCERO/Contratos.pdf": "Derecho Privado III - Civil",
  "TERCERO/cuestionario-penal-2-unlp.docx": "Derecho Penal II",
  "TERCERO/Economia Politica.pdf": "Economía Política",
  "TERCERO/Inter Publico.pdf": "Derecho Internacional Público",
  "TERCERO/Privado IV - Comercial I.pdf": "Derecho Privado IV - Comercial",
  "TERCERO/Proce 1.pdf": "Derecho Procesal I",
  "TERCERO/Publiquito.docx": "Derecho Público, Provincial y Municipal",
  "CUARTO/preguntas de cuarto -- trivia.docx": "MULTI",
  "QUINTO/Civil V_Familia (Plan 5)_.docx": "Derecho de Familia",
  "QUINTO/Derecho Administrativo II - Trivia_.docx": "Derecho Administrativo II",
  "QUINTO/Derecho Colectivo y de la Seguridad Social (Plan 6)_.docx": "Derecho Colectivo del Trabajo y Seg. Social",
  "QUINTO/Derecho de Familia (Plan 6)_.docx": "Derecho de Familia",
  "QUINTO/Derecho de la Navegación.pdf": "Derecho de la Navegación",
  "QUINTO/Derecho de las Sucesiones (Plan 6).docx": "Derecho de las Sucesiones",
  "QUINTO/Derecho de Mineria y Energia_.docx": "Derecho de Minería y Energía",
  "QUINTO/Derecho Internacional Privado.docx": "Derecho Internacional Privado",
  "QUINTO/Derecho Notarial y Registral.docx": "Derecho Notarial y Registral",
  "QUINTO/Finanzas y Derecho Financiero_.docx": "Finanzas y Derecho Financiero",
  "QUINTO/Sociologia Juridica.pdf": "Sociología Jurídica",
  "Constitucional/DERECHO CONSTITUCIONAL.docx": "Derecho Constitucional",
  "Penal/PENAL 1.docx": "Derecho Penal I",
  "Privado/PRIVADO 1 y 2.docx": "MULTI",
  "Privado/QUIEBRAS.docx": "Derecho Privado VI - Comercial",
  "Privado/reales.docx": "Derecho Privado V - Civil",
  "Internacional/DERECHOS HUMANOS.docx": "Derechos Humanos",
  "admin/ADMINISTRATIVO 1.docx": "Derecho Administrativo I"
};

/** Títulos internos de los documentos MULTI y a qué materia corresponden. */
const TITULOS_MULTI = [
  [/^PRIVADO\s*1\b/i, "Derecho Privado I - Civil"],
  [/^PRIVADO\s*2\b/i, "Derecho Privado II - Civil"],
  [/^(OBLIGACIONES)\b/i, "Derecho Privado II - Civil"],
  [/^PENAL\s*1\b/i, "Derecho Penal I"],
  [/^(DERECHO\s+)?CONSTITUCIONAL\b/i, "Derecho Constitucional"],
  [/^DERECHOS\s+HUMANOS\b/i, "Derechos Humanos"],
  [/^TEOR[IÍ]A\s+DEL\s+CONFLICTO\b/i, "Teoría del Conflicto"],
  [/^ADMINISTRATIVO\s*1\b/i, "Derecho Administrativo I"],
  [/^(QUIEBRAS|CONCURSOS)\b/i, "Derecho Privado VI - Comercial"],
  [/^REALES\b/i, "Derecho Privado V - Civil"],
  [/^PROCE(SAL)?\s*2\b/i, "Derecho Procesal II"],
  [/^(TRABAJO|DERECHO\s+DEL\s+TRABAJO)\b/i, "Derecho Social del Trabajo"],
  // En el documento de cuarto año, la sección "Colectivo" es la materia de cuarto,
  // no la homónima de quinto (que tiene su propio documento en QUINTO/).
  [/^COLECTIVO\b/i, "Derecho Social del Trabajo"],
  [/^AGRARIO\b/i, "Derecho Agrario"],
  [/^(FILOSOF[IÍ]A)\b/i, "Filosofía del Derecho"],
  [/^(MEDIACI[OÓ]N)\b/i, "Mediación y Medios de Resolución de Conflictos"],
  [/^(COMERCIAL|PRIVADO\s*4)\b/i, "Derecho Privado IV - Comercial"]
];

// ------------------------------------------------------------ extracción

function textoDocx(ruta) {
  const xml = execFileSync("unzip", ["-p", ruta, "word/document.xml"], { maxBuffer: 1 << 28 }).toString("utf8");
  return xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:br\s*\/>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function textoPdf(ruta) {
  const d = await pdf(fs.readFileSync(ruta));
  // Los compendios repiten encabezado y pie en cada página; se descartan.
  return d.text
    .split("\n")
    .filter(l => !/^COMPENDIO DE|^Facultad de Ciencias Jur|P[áa]gina \d+$/.test(l.trim()))
    .join("\n");
}

const limpiar = s => (s || "").replace(/\s+/g, " ").replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'").trim();

// ------------------------------------------------------------ parsers

/** Formato A: enunciado suelto y 4 opciones "a) ...", la correcta con ✅. */
function parsearFormatoA(lineas, materiaBase) {
  const preguntas = [];
  let materia = materiaBase === "MULTI" ? null : materiaBase;
  let enunciado = null, opciones = [], correcta = -1;

  const cerrar = () => {
    if (enunciado && opciones.length === 4 && correcta >= 0 && materia) {
      preguntas.push({ materia, pregunta: enunciado, opciones, respuesta_correcta_index: correcta });
    }
    enunciado = null; opciones = []; correcta = -1;
  };

  for (const cruda of lineas) {
    const linea = limpiar(cruda);
    if (!linea) continue;

    if (materiaBase === "MULTI") {
      const titulo = TITULOS_MULTI.find(([re]) => re.test(linea));
      if (titulo && linea.length < 60) { cerrar(); materia = titulo[1]; continue; }
    }

    const op = linea.match(/^([a-d])\)\s*(.+)$/i);
    if (op) {
      const texto = op[2];
      if (/✅/.test(texto)) correcta = opciones.length;
      opciones.push(limpiar(texto.replace(/✅/g, "")));
      if (opciones.length === 4) cerrar();
      continue;
    }

    if (opciones.length > 0) cerrar();
    enunciado = limpiar(linea.replace(/^\d{1,3}[\.\)]\s*/, ""));
  }
  cerrar();
  return preguntas;
}

/**
 * Formato B: "Pregunta N: ..." con opciones "A) ..." donde la correcta lleva una
 * marca entre corchetes ("[ CORRECTA]", "[✓ RESPUESTA CORRECTA]", "[3 OPCIÓN
 * CORRECTA]"). Enunciados y opciones se cortan en varias líneas y la marca puede
 * caer en una línea de continuación, así que se acumula igual que en el formato E.
 */
const MARCA_CORRECTA = /\[[^\]]{0,30}CORRECTA[^\]]{0,10}\]/i;

function parsearFormatoB(lineas, materia) {
  const preguntas = [];
  let enunciado = [], opciones = [], correcta = -1, destino = null;

  const cerrar = () => {
    if (enunciado.length && opciones.length === 4 && correcta >= 0) {
      preguntas.push({
        materia,
        pregunta: limpiar(enunciado.join(" ")),
        opciones: opciones.map(o => limpiar(o.join(" ").replace(new RegExp(MARCA_CORRECTA.source, "gi"), ""))),
        respuesta_correcta_index: correcta
      });
    }
    enunciado = []; opciones = []; correcta = -1; destino = null;
  };

  for (const cruda of lineas) {
    const linea = limpiar(cruda);
    if (!linea) continue;

    const preg = linea.match(/^Pregunta\s+\d+\s*[:.\-]\s*(.*)$/i);
    if (preg) { cerrar(); enunciado = preg[1] ? [preg[1]] : []; destino = "enunciado"; continue; }

    const op = linea.match(/^([A-D])\)\s*(.+)$/);
    if (op && enunciado.length && op[1].toUpperCase() === String.fromCharCode(65 + opciones.length)) {
      opciones.push([op[2]]);
      destino = "opcion";
      if (MARCA_CORRECTA.test(op[2])) correcta = opciones.length - 1;
      continue;
    }

    if (destino === "opcion" && opciones.length) {
      opciones[opciones.length - 1].push(linea);
      if (MARCA_CORRECTA.test(linea)) correcta = opciones.length - 1;
    } else if (destino === "enunciado") {
      enunciado.push(linea);
    }
  }
  cerrar();
  return preguntas;
}

/**
 * Formato C: "N. enunciado", "[ ] A) ...", "Explicación: ...".
 * La correcta se marca con un carácter no imprimible dentro del corchete
 * (el PDF trae un glifo de tilde que se extrae como  ), frente al espacio
 * de las incorrectas.
 */
function parsearFormatoC(lineas, materia) {
  const preguntas = [];
  let enunciado = null, opciones = [], explicacion = [], enExplicacion = false, correcta = -1;

  const cerrar = () => {
    if (enunciado && opciones.length === 4 && correcta >= 0) {
      preguntas.push({
        materia,
        pregunta: enunciado,
        opciones,
        respuesta_correcta_index: correcta,
        fundamento_juridico: limpiar(explicacion.join(" "))
      });
    }
    enunciado = null; opciones = []; explicacion = []; enExplicacion = false; correcta = -1;
  };

  for (const cruda of lineas) {
    const linea = limpiar(cruda);
    if (!linea) continue;

    const nueva = linea.match(/^(\d{1,3})\.\s+(.+)$/);
    if (nueva && !enExplicacion) { cerrar(); enunciado = limpiar(nueva[2]); continue; }
    if (nueva && enExplicacion) { cerrar(); enunciado = limpiar(nueva[2]); continue; }

    const op = cruda.replace(/\s+$/, "").match(/^\s*\[(.?)\]\s*([A-D])\)\s*(.+)$/);
    if (op) {
      const marca = op[1];
      if (marca && marca.trim() !== "" && marca !== " ") correcta = opciones.length;
      opciones.push(limpiar(op[3]));
      enExplicacion = false;
      continue;
    }

    if (/^Explicaci[oó]n\s*:/i.test(linea)) {
      enExplicacion = true;
      explicacion.push(limpiar(linea.replace(/^Explicaci[oó]n\s*:/i, "")));
      continue;
    }

    if (enExplicacion) { explicacion.push(linea); continue; }
    if (enunciado && opciones.length === 0) enunciado = limpiar(enunciado + " " + linea);
  }
  cerrar();
  return preguntas;
}

/** Formato D: markdown con "### Pregunta N", "**Respuesta Correcta: A**" y justificación. */
function parsearFormatoD(texto, materia) {
  const preguntas = [];
  // Los bloques arrancan con "### Pregunta N" o, en algunos compendios, "#### N."
  const bloques = texto.split(/#{3,4}\s*\**\s*(?:Pregunta\s*)?\d+[\.\s]\s*\**/i).slice(1);

  for (const bloque of bloques) {
    const plano = bloque.replace(/\s+/g, " ");

    // La letra puede venir dentro del mismo grupo en negrita o en el siguiente:
    // "**Respuesta Correcta: A**" o "**Respuesta Correcta:** **b)**"
    const mResp = plano.match(/Respuesta\s+Correcta\s*:?\s*\**\s*:?\s*\**\s*([A-Da-d])\s*\)?/i);
    if (!mResp) continue;
    const correcta = mResp[1].toUpperCase().charCodeAt(0) - 65;

    const antesResp = plano.slice(0, mResp.index);

    // Opciones: "* A) texto", "* **a)** texto" o "A) texto" sin viñeta.
    // Se ubican los marcadores en orden A,B,C,D y se corta el texto entre ellos,
    // que es más robusto que intentar delimitar cada opción con un lookahead.
    const marcadores = [];
    const reMarca = /(?:[-*]\s*)?\**\s*([A-Da-d])\)\s*\**\s*/g;
    let mm;
    while ((mm = reMarca.exec(antesResp))) {
      const esperada = String.fromCharCode(65 + marcadores.length);
      if (mm[1].toUpperCase() === esperada) {
        marcadores.push({ inicio: mm.index, finMarca: mm.index + mm[0].length });
        if (marcadores.length === 4) break;
      }
    }
    if (marcadores.length !== 4) continue;

    const opciones = marcadores.map((mk, i) =>
      limpiar(antesResp.slice(mk.finMarca, i + 1 < marcadores.length ? marcadores[i + 1].inicio : antesResp.length).replace(/\*+/g, ""))
    );
    if (opciones.some(o => o.length < 2)) continue;

    const idxPrimeraOpcion = marcadores[0].inicio;
    let enunciado = limpiar(antesResp.slice(0, idxPrimeraOpcion).replace(/\*\*/g, ""));
    enunciado = enunciado.replace(/^[#\s*>-]+/, "").trim();

    const mJust = plano.match(/[*_]{1,2}\s*(?:Justificaci[oó]n(?:\s+Jur[ií]dica)?|Fundamento(?:\s+Jur[ií]dico)?|Fundamentaci[oó]n(?:\s+Jur[ií]dica)?)\s*:?\s*[*_]*\s*([\s\S]+?)(?=---|###|$)/i);
    const fundamento = mJust ? limpiar(mJust[1].replace(/\*\*/g, "")) : "";

    if (enunciado.length < 15) continue;
    preguntas.push({ materia, pregunta: enunciado, opciones, respuesta_correcta_index: correcta, fundamento_juridico: fundamento });
  }
  return preguntas;
}

/**
 * Formato E: texto plano con "PREGUNTA N:", opciones "A) ...",
 * "RESPUESTA CORRECTA: B" y "Justificación: ...". Enunciados, opciones y
 * justificaciones pueden ocupar varias líneas, así que se van acumulando.
 */
function parsearFormatoE(lineas, materia) {
  const preguntas = [];
  let enunciado = [], opciones = [], fundamento = [], correcta = -1, destino = null;

  const cerrar = () => {
    if (enunciado.length && opciones.length === 4 && correcta >= 0) {
      preguntas.push({
        materia,
        pregunta: limpiar(enunciado.join(" ")),
        opciones: opciones.map(o => limpiar(o.join(" "))),
        respuesta_correcta_index: correcta,
        fundamento_juridico: limpiar(fundamento.join(" "))
      });
    }
    enunciado = []; opciones = []; fundamento = []; correcta = -1; destino = null;
  };

  for (const cruda of lineas) {
    const linea = limpiar(cruda);
    if (!linea) continue;

    const preg = linea.match(/^PREGUNTA\s*\d+\s*[:.\-]?\s*(.*)$/i);
    if (preg) { cerrar(); enunciado = preg[1] ? [preg[1]] : []; destino = "enunciado"; continue; }

    // "RESPUESTA CORRECTA: B" o la variante "Pregunta uno: opción Correcta [A]"
    const resp = linea.match(/^RESPUESTA\s+CORRECTA\s*:?\s*\(?([A-D])\)?/i)
      || linea.match(/opci[oó]n\s+correcta\s*:?\s*[\[\(]?\s*([A-D])\s*[\]\)]?/i);
    if (resp) { correcta = resp[1].toUpperCase().charCodeAt(0) - 65; destino = null; continue; }

    const just = linea.match(/^(?:Justificaci[oó]n|Fundamento(?:\s+jur[ií]dico)?|Fundamentaci[oó]n)\s*:?\s*(.*)$/i);
    if (just) { fundamento = just[1] ? [just[1]] : []; destino = "fundamento"; continue; }

    const op = linea.match(/^([A-D])\)\s*(.+)$/);
    if (op && enunciado.length) {
      const esperada = String.fromCharCode(65 + opciones.length);
      if (op[1].toUpperCase() === esperada) {
        opciones.push([op[2]]);
        destino = "opcion";
        continue;
      }
    }

    if (destino === "enunciado") enunciado.push(linea);
    else if (destino === "opcion" && opciones.length) opciones[opciones.length - 1].push(linea);
    else if (destino === "fundamento") fundamento.push(linea);
  }
  cerrar();
  return preguntas;
}

function detectarFormato(texto) {
  // D es markdown: se reconoce por su estructura, no por la marca de respuesta,
  // porque la frase "Respuesta Correcta" también aparece dentro de los corchetes de B.
  if (/###\s*\**\s*Pregunta/i.test(texto) || /\*\s*\*\*[A-Da-d]\)\*\*/.test(texto)) return "D";
  // Compendios en markdown que numeran con "#### 1." y listan opciones con viñeta.
  if (/#{3,4}\s*\d+\.\s/.test(texto) && /[-*]\s*[A-D]\)\s/.test(texto)) return "D";
  if (/\[[^\]\n]{0,30}CORRECTA[^\]\n]{0,10}\]/i.test(texto)) return "B";
  if (/✅/.test(texto)) return "A";
  if (/Explicaci[oó]n\s*:/i.test(texto) && /\[.?\]\s*[A-D]\)/.test(texto)) return "C";
  if (/RESPUESTA\s+CORRECTA\s*:\s*\(?[A-D]\)?\b/i.test(texto)) return "E";
  if (/opci[oó]n\s+correcta\s*:?\s*[\[\(]\s*[A-D]\s*[\]\)]/i.test(texto)) return "E";
  return null;
}

// ------------------------------------------------------------ main

fs.mkdirSync(OUT, { recursive: true });

const resumen = [];
let totalOk = 0, totalSinRespuesta = 0;

for (const [rel, materia] of Object.entries(DOCUMENTOS)) {
  const ruta = path.join(BASE, rel);
  if (!fs.existsSync(ruta)) { resumen.push({ rel, error: "no existe" }); continue; }

  let texto;
  try {
    texto = path.extname(ruta).toLowerCase() === ".pdf" ? await textoPdf(ruta) : textoDocx(ruta);
  } catch (e) {
    resumen.push({ rel, error: e.message.slice(0, 60) });
    continue;
  }

  const formato = detectarFormato(texto);
  if (!formato) { resumen.push({ rel, error: "formato no reconocido" }); continue; }

  const lineas = texto.split("\n");
  let preguntas;
  if (formato === "A") preguntas = parsearFormatoA(lineas, materia);
  else if (formato === "B") preguntas = parsearFormatoB(lineas, materia);
  else if (formato === "C") preguntas = parsearFormatoC(lineas, materia);
  else if (formato === "E") preguntas = parsearFormatoE(lineas, materia);
  else preguntas = parsearFormatoD(texto, materia);

  const sinRespuesta = preguntas.filter(p => p.respuesta_correcta_index < 0).length;
  totalSinRespuesta += sinRespuesta;
  totalOk += preguntas.length - sinRespuesta;

  const salida = preguntas.map(p => ({
    materia: p.materia,
    pregunta: p.pregunta,
    opciones: p.opciones,
    respuesta_correcta_index: p.respuesta_correcta_index,
    fundamento_juridico: p.fundamento_juridico || `Contenido de ${p.materia} conforme al programa oficial de la cátedra (FCJyS UNLP).`,
    dificultad: "media"
  }));

  const nombre = rel.replace(/[\/\\]/g, "__").replace(/\.(docx|pdf)$/i, "") + ".json";
  fs.writeFileSync(path.join(OUT, nombre), JSON.stringify(salida, null, 2), "utf8");

  const materias = [...new Set(preguntas.map(p => p.materia))];
  resumen.push({ rel, formato, total: preguntas.length, sinRespuesta, materias });
}

console.log("doc".padEnd(52) + "fmt  total  s/resp  materias");
for (const r of resumen) {
  if (r.error) { console.log(r.rel.padEnd(52) + "ERROR  " + r.error); continue; }
  console.log(
    r.rel.padEnd(52) + r.formato.padEnd(5) +
    String(r.total).padStart(5) + String(r.sinRespuesta).padStart(8) + "  " +
    (r.materias.length > 1 ? `${r.materias.length} materias` : r.materias[0] || "-")
  );
}
console.log(`\nCON respuesta: ${totalOk}   |   SIN respuesta (formato C): ${totalSinRespuesta}`);
console.log(`Salida: ${OUT}`);
