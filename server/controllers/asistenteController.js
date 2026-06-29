import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Inicializar cliente de Supabase (se adaptará a las variables locales y de producción)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error("Error al inicializar el cliente de Supabase:", err.message);
  }
}

// Inicializar el SDK de Gemini
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({ apiKey: geminiApiKey });
} else {
  console.warn("⚠️ ADVERTENCIA: GEMINI_API_KEY no está configurada en las variables de entorno.");
}

/**
 * Controlador para procesar la pregunta de los estudiantes usando RAG
 */
export async function obtenerRespuestaAsistente(req, res) {
  try {
    const { pregunta, materia, catedra, comision } = req.body;

    // Validación de entrada
    if (!pregunta || !materia) {
      return res.status(400).json({
        error: "Los campos 'pregunta' y 'materia' son obligatorios."
      });
    }

    console.log(`[Asistente DND] Consulta recibida:
      - Materia: ${materia}
      - Cátedra: ${catedra || "No especificada"}
      - Comisión: ${comision || "No especificada"}
      - Pregunta: "${pregunta}"`);

    let contextoRecuperado = "";
    let origenContexto = "datos_simulados";

    // =========================================================================
    // ESTRUCTURA DE LA CONSULTA A TU BASE DE DATOS (RAG)
    // =========================================================================
    if (supabase) {
      try {
        /*
          [INSTRUCCIONES PARA INYECTAR TU QUERY ESPECÍFICA]:
          
          Opción A: Búsqueda exacta/texto sobre apuntes filtrados.
          Si tienes una tabla 'apuntes_fragmentos' que guarda texto de Drive mapeado
          a materias, cátedras y comisiones, puedes usar la siguiente query:
          
          let query = supabase
            .from('apuntes_fragmentos')
            .select('contenido, pagina, fuente')
            .eq('materia', materia);
            
          if (catedra) {
            query = query.eq('catedra', catedra);
          }
          if (comision) {
            query = query.eq('comision', comision);
          }
          
          const { data: fragmentos, error: dbError } = await query.limit(5);
          
          
          Opción B: Búsqueda Semántica con Vector Embeddings (pgvector en Supabase)
          Si creaste embeddings de tus apuntes (por ejemplo, con text-embedding-004 de Gemini)
          y los guardaste en Supabase, deberías invocar una función RPC que calcule la similitud:
          
          // Primero obtienes el embedding de la 'pregunta':
          const embedResponse = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: pregunta,
          });
          const embeddingPregunta = embedResponse.embedding.values;
          
          // Luego llamas a la función SQL de similitud pasándole los filtros:
          const { data: fragmentos, error: dbError } = await supabase.rpc('buscar_fragmentos_apuntes', {
            query_embedding: embeddingPregunta,
            match_threshold: 0.7, // Umbral de similitud mínimo
            match_count: 5,        // Número de resultados a traer
            filtro_materia: materia,
            filtro_catedra: catedra || null,
            filtro_comision: comision || null
          });
        */

        // Consulta de prueba (cambia esta tabla por la tuya):
        const { data: fragmentos, error: dbError } = await supabase
          .from("apuntes_fragmentos") // Nombre tentativo de tu tabla
          .select("contenido, fuente")
          .eq("materia", materia)
          .limit(4);

        if (!dbError && fragmentos && fragmentos.length > 0) {
          contextoRecuperado = fragmentos
            .map((f, idx) => `[Fragmento ${idx + 1} de ${f.fuente || "Apuntes"}]: ${f.contenido}`)
            .join("\n\n");
          origenContexto = "supabase_db";
        } else {
          if (dbError) {
            console.log("Aviso de Base de Datos (Mesa de ayuda: tabla 'apuntes_fragmentos' no configurada aún):", dbError.message);
          }
          // Si no hay resultados, cargamos datos simulados basados en tu estructura de cátedras y comisión
          contextoRecuperado = obtenerContextoSimulado(materia, catedra, comision);
        }
      } catch (err) {
        console.error("Fallo al conectar con la base de datos Supabase:", err.message);
        contextoRecuperado = obtenerContextoSimulado(materia, catedra, comision);
      }
    } else {
      console.log("Supabase no configurado. Utilizando fallback simulado.");
      contextoRecuperado = obtenerContextoSimulado(materia, catedra, comision);
    }

    // =========================================================================
    // INTEGRACIÓN CON EL SDK DE GEMINI (API CALL)
    // =========================================================================
    if (!ai) {
      // Si no hay API Key de Gemini, devolvemos un mensaje de error explicativo para testing
      return res.status(200).json({
        respuesta: `⚠️ **¡El backend está listo y configurado!**
        
Para recibir respuestas reales de la Inteligencia Artificial, necesitás agregar la variable \`GEMINI_API_KEY\` en el panel de tu hosting (Netlify, Vercel o archivo \`.env\` del servidor).
        
**Parámetros RAG recibidos con éxito:**
* **Materia:** ${materia}
* **Cátedra:** ${catedra || "No provista"}
* **Comisión:** ${comision || "No provista"}
* **Pregunta:** ${pregunta}

**Contexto recuperado (Simulado/RAG):**
${contextoRecuperado.substring(0, 300)}...`,
        origenContexto,
        nota: "Configura la GEMINI_API_KEY para activar las respuestas del modelo gemini-1.5-flash."
      });
    }

    // Construcción del Prompt con enfoque en cátedra/comisión y aprendizaje de profesores
    const prompt = `
Eres "Asistente DND", un tutor virtual académico experto y especializado para estudiantes de la Facultad de Derecho de la UNLP.
Tu objetivo es responder de forma rigurosa, amigable y muy estructurada las dudas sobre la materia "${materia}".

INFORMACIÓN ESPECÍFICA DE CURSADA SELECCIONADA POR EL ESTUDIANTE:
- Materia: ${materia}
- Cátedra: ${catedra || "Cátedra General / No especificada"}
- Comisión: ${comision || "Comisión General / No especificada"}

CONTEXTO DE ESTUDIO RECUPERADO (Base de Datos de Apuntes / Drive):
"""
${contextoRecuperado}
"""

PREGUNTA DEL ESTUDIANTE:
"${pregunta}"

INSTRUCCIONES IMPORTANTES PARA LA RESPUESTA:
1. Responde de forma clara, amigable y estructurada utilizando formato Markdown (usa negritas, listas y espaciados).
2. Prioriza el contexto recuperado arriba, el cual proviene de la carpeta de Drive oficial de apuntes de DND.
3. ADAPTACIÓN AL PROFESOR/CÁTEDRA: Como cada cátedra y comisión tiene contenidos y exigencias distintas (los profesores suelen ponderar ciertos temas más que otros), analiza el contexto para ver si hay directrices de lo que suele pedir esta cátedra/comisión específica. Si la información del contexto es sobre la cátedra del estudiante, dale prioridad absoluta a ese enfoque pedagógico.
4. Si la respuesta exacta no está en el contexto recuperado, utiliza tus conocimientos de Derecho aplicados a la currícula de la UNLP, pero adviértele amablemente al estudiante: *"Esta explicación se basa en doctrina general de la materia, ya que no se encuentra detallada de esta forma específica en los apuntes de la Cátedra/Comisión seleccionada."*
5. Mantén un tono empático de compañero de estudio que quiere ayudar, pero sumamente formal y preciso con los términos jurídicos y legales.
6. Si corresponde, sugiere que pueden verificar los archivos originales en la carpeta de Drive de la materia: https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF
`;

    // Llamada a la API de Gemini usando el modelo gemini-1.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const respuestaTexto = response.text;

    // Retornamos la respuesta al frontend de forma limpia
    return res.status(200).json({
      respuesta: respuestaTexto,
      origenContexto,
      materia,
      catedra: catedra || null,
      comision: comision || null
    });

  } catch (error) {
    console.error("Error crítico en el controlador del asistente:", error);
    return res.status(500).json({
      error: "Ocurrió un error inesperado al procesar tu consulta con el Asistente DND. Inténtalo de nuevo más tarde.",
      detalles: error.message
    });
  }
}

/**
 * Función auxiliar para proveer apuntes de simulación RAG según la materia, cátedra y comisión.
 * Esto permite probar la herramienta en producción/Staging sin base de datos poblada inicialmente.
 */
function obtenerContextoSimulado(materia, catedra, comision) {
  let apuntes = "";

  // Apuntes simulados específicos para materias comunes
  if (materia.toLowerCase().includes("civil") || materia.toLowerCase().includes("privado")) {
    apuntes = `
- [Apunte Derecho Civil/Privado I - Cátedra ${catedra || "A"}] El Consentimiento y la Capacidad de hecho y derecho. Conceptos claves según el Código Civil y Comercial. El profesor suele evaluar la diferencia entre capacidad de ejercicio y de derecho, haciendo especial énfasis en los apoyos y salvaguardias en el nuevo régimen.
- [Preguntas Frecuentes Cátedra ${catedra || "A"} - Comisión ${comision || "1"}] La comisión suele exigir en los parciales la resolución de casos prácticos sobre nulidad de actos jurídicos por vicios de la voluntad (error, dolo, violencia).
`;
  } else if (materia.toLowerCase().includes("penal")) {
    apuntes = `
- [Apunte Derecho Penal I - Cátedra ${catedra || "B"}] Teoría del Delito. Evolución histórica: causalismo versus finalismo. Especial atención al dolo eventual y la culpa con representación. Los profesores de esta cátedra ponderan fuertemente la estructura del tipo subjetivo y suelen pedir casos de legítima defensa y estado de necesidad en los exámenes.
`;
  } else if (materia.toLowerCase().includes("romano")) {
    apuntes = `
- [Apunte Derecho Romano - Cátedra ${catedra || "Única"}] Negocio jurídico en Roma. Diferencias fundamentales con el concepto moderno. Tipos de contratos verbales (Stipulatio). En la comisión ${comision || "A"} se evalúa rigurosamente el procedimiento formulario y las acciones in rem.
`;
  } else {
    apuntes = `
- [Apuntes de Cátedra ${catedra || "General"}] Resumen del programa de ${materia}. Se enfatizan los primeros tres módulos del programa académico.
- [Directrices de Cátedra] En la cátedra de ${materia} se evalúa la comprensión conceptual sobre la memorización. Los profesores suelen pedir esquemas de conceptos fundamentales.
`;
  }

  return `[Simulación RAG - Archivos sincronizados de Drive (https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF)]:
${apuntes}
- Nota: Estos datos simulan la extracción de texto relevante desde el PDF correspondiente a la Materia: ${materia}, Cátedra: ${catedra || "General"}, Comisión: ${comision || "General"}.`;
}
