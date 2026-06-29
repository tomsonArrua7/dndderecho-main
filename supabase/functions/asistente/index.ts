import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejo de CORS (Preflight request)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pregunta, materia, catedra, comision } = await req.json();

    // Validación
    if (!pregunta || !materia) {
      return new Response(
        JSON.stringify({ error: "Los campos 'pregunta' y 'materia' son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[Asistente DND Edge Function] Consulta recibida:
      - Materia: ${materia}
      - Cátedra: ${catedra || "No especificada"}
      - Comisión: ${comision || "No especificada"}
      - Pregunta: "${pregunta}"`);

    // Inicializar cliente de Supabase interno de la función
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "http://kong:8000";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    
    if (!supabaseKey) {
      console.error("[Asistente DND] ERROR: No se encontró SUPABASE_SERVICE_ROLE_KEY ni SUPABASE_ANON_KEY en Deno.env.");
      return new Response(
        JSON.stringify({ error: "Error de configuración de red/entorno en el servidor de Deno." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    let contextoRecuperado = "";
    let origenContexto = "datos_simulados";

    // =========================================================================
    // ESTRUCTURA DE LA CONSULTA A LA BASE DE DATOS (RAG)
    // =========================================================================
    try {
      /*
        [INSTRUCCIONES PARA INYECTAR TU QUERY DE RAG ESPECÍFICA]:
        
        Opción A: Búsqueda exacta/texto sobre apuntes filtrados.
        Si guardas los apuntes fragmentados por materia/cátedra en la tabla 'apuntes_fragmentos':
        
        let query = supabase
          .from('apuntes_fragmentos')
          .select('contenido, fuente')
          .eq('materia', materia);
          
        if (catedra) {
          query = query.eq('catedra', catedra);
        }
        if (comision) {
          query = query.eq('comision', comision);
        }
        
        const { data: fragmentos, error: dbError } = await query.limit(5);
        
        
        Opción B: Búsqueda Semántica / Vectorial (pgvector en Supabase)
        Si creaste embeddings vectoriales de tus apuntes (por ejemplo con text-embedding-004):
        
        // 1. Inicializar Gemini
        const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        
        // 2. Generar el embedding de la pregunta
        const embedResponse = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: pregunta,
        });
        const embeddingPregunta = embedResponse.embedding.values;
        
        // 3. Consultar tu RPC de similitud
        const { data: fragmentos, error: dbError } = await supabase.rpc('buscar_fragmentos_apuntes', {
          query_embedding: embeddingPregunta,
          match_threshold: 0.7,
          match_count: 5,
          filtro_materia: materia,
          filtro_catedra: catedra || null,
          filtro_comision: comision || null
        });
      */

      // Consulta de prueba (Reemplaza con tu tabla real de apuntes/documentos):
      const { data: fragmentos, error: dbError } = await supabase
        .from("apuntes_fragmentos")
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
          console.warn("Aviso de Base de Datos (Mesa de ayuda: tabla 'apuntes_fragmentos' no configurada aún):", dbError.message);
        }
        contextoRecuperado = obtenerContextoSimulado(materia, catedra, comision);
      }
    } catch (err) {
      console.error("Fallo al conectar con la base de datos Supabase:", err.message);
      contextoRecuperado = obtenerContextoSimulado(materia, catedra, comision);
    }

    // =========================================================================
    // INTEGRACIÓN CON LA API DE GEMINI (SDK @google/genai)
    // =========================================================================
    let geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    // Fallback para Supabase Self-hosted: leemos la key desde tu tabla 'app_settings'
    if (!geminiApiKey) {
      try {
        const { data: settings } = await supabase
          .from("app_settings")
          .select("gemini_api_key")
          .limit(1)
          .maybeSingle();

        if (settings?.gemini_api_key) {
          geminiApiKey = settings.gemini_api_key;
        }
      } catch (err: any) {
        console.warn("No se pudo leer gemini_api_key de app_settings:", err.message);
      }
    }

    if (geminiApiKey) {
      geminiApiKey = geminiApiKey.trim();
    }

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          respuesta: `⚠️ **¡La Edge Function del Asistente DND está activa!**
          
Sin embargo, falta configurar tu clave de la API de Gemini. Al usar **Supabase Self-hosted**, puedes agregarla fácilmente sin usar la terminal:

**Desde tu Panel Web (Súper Fácil):**
1. Ve al **Table Editor** en el menú izquierdo de tu Supabase Dashboard.
2. Abre la tabla \`app_settings\`.
3. Haz clic en **Insert** o añade una nueva columna llamada \`gemini_api_key\` de tipo \`text\`.
4. Pega tu API Key (\`AQ.Ab8RN...8rA\`) en esa celda para la fila activa (ID 1).

**Detalles de la consulta recibida:**
* **Materia:** ${materia}
* **Cátedra:** ${catedra || "No especificada"}
* **Comisión:** ${comision || "No especificada"}
* **Pregunta:** "${pregunta}"`,
          origenContexto
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

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

    // Llamada a la API de Gemini usando Native Fetch con header x-goog-api-key (soporta el nuevo formato de claves AQ. de Google)
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!apiResponse.ok) {
      const errorDetail = await apiResponse.text();
      throw new Error(`Gemini API error: ${apiResponse.status} - ${errorDetail}`);
    }

    const apiData = await apiResponse.json();
    const respuestaTexto = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!respuestaTexto) {
      throw new Error("No se obtuvo texto de respuesta de la API de Gemini.");
    }

    return new Response(
      JSON.stringify({
        respuesta: respuestaTexto,
        origenContexto,
        materia,
        catedra: catedra || null,
        comision: comision || null
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (err) {
    console.error("Error crítico en la Edge Function del asistente:", err);
    return new Response(
      JSON.stringify({
        error: "Ocurrió un error inesperado al procesar tu consulta con el Asistente DND.",
        detalles: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

/**
 * Función auxiliar para proveer apuntes de simulación RAG según la materia, cátedra y comisión.
 */
function obtenerContextoSimulado(materia: string, catedra?: string, comision?: string) {
  let apuntes = "";

  if (materia.toLowerCase().includes("civil") || materia.toLowerCase().includes("privado")) {
    apuntes = `
- [Apunte Derecho Civil/Privado I - Cátedra ${catedra || "A"}] El Consentimiento y la Capacidad de hecho y derecho. Conceptos claves según el Código Civil y Comercial. El profesor suele evaluar la diferencia entre capacidad de ejercicio y de derecho, haciendo especial énfasis en los apoyos y salvaguardias en el nuevo régimen.
- [Preguntas Frecuentes Cátedra ${catedra || "A"} - Comisión ${comision || "1"}] La comisión suele exigir en los parciales la resolución de casos prácticos sobre vicios de la voluntad (error, dolo, violencia).
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
