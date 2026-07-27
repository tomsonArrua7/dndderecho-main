// scripts/generateTrivia.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env
const envPath = path.resolve(__dirname, "../.env");
let GEMINI_KEY = process.env.GEMINI_API_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
  if (match && match[1]) {
    GEMINI_KEY = match[1];
  }
}

/**
 * Esquema esperado para cada pregunta:
 * {
 *   id: string;
 *   id_categoria: string;
 *   categoria_nombre: string;
 *   dificultad: "facil" | "media" | "dificil";
 *   pregunta: string;
 *   opciones: string[]; // 4 opciones, índice 0 es la correcta
 *   respuesta_correcta_index: 0;
 *   fundamento_juridico: string;
 *   puntos_base: number;
 * }
 */

export function validateQuestion(q, index = 0) {
  const errors = [];
  if (!q.id || typeof q.id !== "string") errors.push(`[Q #${index}] 'id' debe ser una cadena válida.`);
  if (!q.id_categoria || typeof q.id_categoria !== "string") errors.push(`[Q #${index}] 'id_categoria' es obligatorio.`);
  if (!["facil", "media", "dificil"].includes(q.dificultad)) errors.push(`[Q #${index}] 'dificultad' debe ser 'facil', 'media' o 'dificil'.`);
  if (!q.pregunta || typeof q.pregunta !== "string") errors.push(`[Q #${index}] 'pregunta' es obligatoria.`);
  if (!Array.isArray(q.opciones) || q.opciones.length !== 4) errors.push(`[Q #${index}] 'opciones' debe ser un array de 4 respuestas.`);
  if (q.respuesta_correcta_index !== 0) errors.push(`[Q #${index}] 'respuesta_correcta_index' debe ser 0.`);
  if (!q.fundamento_juridico || typeof q.fundamento_juridico !== "string") errors.push(`[Q #${index}] 'fundamento_juridico' es obligatorio.`);
  if (!q.puntos_base || typeof q.puntos_base !== "number") errors.push(`[Q #${index}] 'puntos_base' debe ser numérico.`);
  return errors;
}

console.log("=================================================");
console.log("   DnD Derecho - Generador y Validador de Trivia  ");
console.log("=================================================");

console.log("Modo de uso:");
console.log("1. node scripts/generateTrivia.mjs import <archivo.json>");
console.log("2. node scripts/generateTrivia.mjs generate <categoria> <cantidad>");
console.log("-------------------------------------------------");

const args = process.argv.slice(2);
const command = args[0] || "help";

if (command === "import") {
  const jsonFilePath = args[1];
  if (!jsonFilePath) {
    console.error("Error: Indica la ruta del archivo JSON a importar.");
    process.exit(1);
  }

  const absolutePath = path.resolve(jsonFilePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: El archivo ${absolutePath} no existe.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(absolutePath, "utf-8");
  try {
    const questions = JSON.parse(rawData);
    if (!Array.isArray(questions)) {
      console.error("Error: El JSON debe ser una lista/array de preguntas.");
      process.exit(1);
    }

    let allErrors = [];
    questions.forEach((q, idx) => {
      const errs = validateQuestion(q, idx + 1);
      allErrors = allErrors.concat(errs);
    });

    if (allErrors.length > 0) {
      console.error("\n❌ Se encontraron errores de validación en el JSON:");
      allErrors.forEach(e => console.error("  - " + e));
      process.exit(1);
    }

    console.log(`\n✅ ${questions.length} preguntas validadas correctamente.`);
    console.log("Mezclando e incorporando a src/data/triviaData.ts...");

    const triviaDataPath = path.resolve(__dirname, "../src/data/triviaData.ts");
    let triviaContent = fs.readFileSync(triviaDataPath, "utf-8");

    // Buscar el final de TRIVIA_QUESTIONS array
    const exportIndex = triviaContent.lastIndexOf("];");
    if (exportIndex === -1) {
      console.error("Error: No se encontró la declaración 'TRIVIA_QUESTIONS' en triviaData.ts");
      process.exit(1);
    }

    const formattedQuestions = questions.map(q => `  {\n    id: ${JSON.stringify(q.id)},\n    id_categoria: ${JSON.stringify(q.id_categoria)},\n    categoria_nombre: ${JSON.stringify(q.categoria_nombre)},\n    dificultad: ${JSON.stringify(q.dificultad)},\n    pregunta: ${JSON.stringify(q.pregunta)},\n    opciones: ${JSON.stringify(q.opciones, null, 6).replace(/\n/g, "\n    ")},\n    respuesta_correcta_index: 0,\n    fundamento_juridico: ${JSON.stringify(q.fundamento_juridico)},\n    puntos_base: ${q.puntos_base || (q.dificultad === "facil" ? 10 : q.dificultad === "media" ? 20 : 30)}\n  }`).join(",\n");

    const newTriviaContent = triviaContent.slice(0, exportIndex) + ",\n  // --- LOTE IMPORTADO MASIVAMENTE ---\n" + formattedQuestions + "\n" + triviaContent.slice(exportIndex);
    fs.writeFileSync(triviaDataPath, newTriviaContent, "utf-8");

    console.log("🎉 ¡Preguntas importadas con éxito en src/data/triviaData.ts!");
  } catch (err) {
    console.error("Error procesando JSON:", err.message);
    process.exit(1);
  }
} else if (command === "generate") {
  const categoria = args[1] || "derecho_penal";
  const cantidad = parseInt(args[2] || "10", 10);
  console.log(`Generando ${cantidad} preguntas para la categoría '${categoria}' usando Gemini API...`);

  if (!GEMINI_KEY) {
    console.error("❌ Error: No se encontró GEMINI_API_KEY en .env ni en el entorno.");
    process.exit(1);
  }

  const prompt = `Actúa como un equipo de profesores y abogados de la Facultad de Ciencias Jurídicas y Sociales (UNLP).
Genera exactamente ${cantidad} preguntas de opción múltiple de Derecho de la República Argentina para la categoría '${categoria}'.
Nivel de dificultad variado (fácil, media, dificil).
Cada pregunta debe ser devuelta en un array de JSON con la siguiente estructura:
[
  {
    "id": "pen-f-10",
    "id_categoria": "${categoria}",
    "categoria_nombre": "Derecho Penal",
    "dificultad": "facil",
    "pregunta": "...",
    "opciones": ["Correcta", "Incorrecta 1", "Incorrecta 2", "Incorrecta 3"],
    "respuesta_correcta_index": 0,
    "fundamento_juridico": "Art. XX del Código Penal / Fallo CSJN",
    "puntos_base": 10
  }
]
REGLAS:
- La respuesta correcta SIEMPRE debe ser el índice 0 del array 'opciones'.
- 'dificultad' debe ser 'facil' (10 pts), 'media' (20 pts) o 'dificil' (30 pts).
- Devuelve ÚNICAMENTE el código JSON puro, sin bloques markdown extra.`;

  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  })
    .then(res => res.json())
    .then(data => {
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const outputDir = path.resolve(__dirname, "../src/data/generated");
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, `batch_${categoria}_${Date.now()}.json`);
      fs.writeFileSync(outputPath, cleanedJson, "utf-8");
      console.log(`\n✅ Lote generado y guardado en: ${outputPath}`);
      console.log(`Para incorporarlo al juego, ejecuta: node scripts/generateTrivia.mjs import "${outputPath}"`);
    })
    .catch(err => console.error("Error en la llamada a Gemini:", err.message));
} else {
  console.log("Comando desconocido. Utiliza 'import' o 'generate'.");
}
