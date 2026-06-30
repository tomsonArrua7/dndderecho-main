import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { MAPA_LINKS_MATERIAS } from "./links_carpetas.ts";
import { LISTA_ARCHIVOS_LINKS } from "./links_todos.ts";


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
    const { pregunta, materia, catedra, comision, historial } = await req.json();

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
    // Cargamos configuraciones desde la tabla 'app_settings'
    let dbSettings: any = null;
    let origenClave = "ninguno";
    try {
      const { data } = await supabase
        .from("app_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      dbSettings = data;
    } catch (err: any) {
      console.warn("No se pudo leer la tabla app_settings:", err.message);
    }

    let anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY") || dbSettings?.anthropic_api_key || "";
    let localOllamaUrl = Deno.env.get("LOCAL_OLLAMA_URL") || dbSettings?.local_ollama_url || "";
    let anthropicModel = dbSettings?.anthropic_model || "claude-3-5-sonnet-20240620";
    let geminiApiKey = Deno.env.get("GEMINI_API_KEY") || dbSettings?.gemini_api_key || "";

    if (anthropicApiKey) {
      anthropicApiKey = anthropicApiKey.replace(/\s+/g, "");
      origenClave = Deno.env.get("ANTHROPIC_API_KEY") ? "Deno.env (Claude)" : "base_de_datos (Claude)";
    }
    if (geminiApiKey) {
      geminiApiKey = geminiApiKey.replace(/\s+/g, "");
      if (origenClave === "ninguno") {
        origenClave = Deno.env.get("GEMINI_API_KEY") ? "Deno.env (Gemini)" : "base_de_datos (Gemini)";
      }
    }

    // Si no hay ninguna clave o URL configurada, informamos al usuario para que la agregue
    if (!anthropicApiKey && !localOllamaUrl && !geminiApiKey) {
      return new Response(
        JSON.stringify({
          respuesta: `⚠️ **¡La Edge Function del Asistente DND está activa!**
          
Sin embargo, no se ha configurado ninguna clave de Inteligencia Artificial (Claude, Gemini u Ollama). Al usar **Supabase Self-hosted**, puedes agregarla fácilmente en tu base de datos:

**Desde tu Panel Web (Súper Fácil):**
1. Ve al **Table Editor** en el menú izquierdo de tu Supabase Dashboard.
2. Abre la tabla \`app_settings\`.
3. Haz clic en el botón de agregar columna \`+\` y crea alguna de las siguientes columnas de tipo \`text\`:
   - \`anthropic_api_key\` (para usar **Claude 3.5 Sonnet**, altamente recomendado).
   - \`gemini_api_key\` (para usar **Gemini**).
   - \`local_ollama_url\` (para usar **Ollama local**).
4. Pega tu API Key correspondiente en esa celda para la fila activa (ID 1).`,
          origenContexto
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let nombreEstudiante = "Estudiante";
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const authResponse = await supabase.auth.getUser(token);
        const user = authResponse?.data?.user;
        if (user) {
          const profileResponse = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();
          const profile = profileResponse?.data;
          if (profile?.full_name) {
            nombreEstudiante = profile.full_name.split(" ")[0]; // Primer nombre
          }
        }
      } catch (e) {
        console.warn("No se pudo obtener el nombre del estudiante:", e.message);
      }
    }

    // Función auxiliar local para normalizar textos
    const normalizarTexto = (texto: string): string => {
      return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
        .replace(/\(.*?\)/g, "") // Remueve textos entre paréntesis como "(Plan 6)"
        .replace(/[^a-z0-9]/g, " ") // Conserva solo letras y números
        .replace(/\s+/g, " ") // Colapsa espacios
        .trim();
    };

    const normMateria = normalizarTexto(materia);

    // 1. Obtener enlaces a las carpetas oficiales de la materia
    let linksMateria = { apuntes: "", bibliografia: "", programas: "" };
    for (const [key, val] of Object.entries(MAPA_LINKS_MATERIAS)) {
      if (normalizarTexto(key) === normMateria) {
        linksMateria = val;
        break;
      }
    }
    // Si no hubo coincidencia exacta, intentamos coincidencia parcial
    if (!linksMateria.apuntes && !linksMateria.programas) {
      for (const [key, val] of Object.entries(MAPA_LINKS_MATERIAS)) {
        const normKey = normalizarTexto(key);
        if (normKey.includes(normMateria) || normMateria.includes(normKey)) {
          linksMateria = val;
          break;
        }
      }
    }

    // 2. Obtener lista de archivos individuales específicos para la materia
    let archivosMateria = LISTA_ARCHIVOS_LINKS.filter(a => normalizarTexto(a.materia) === normMateria);
    if (archivosMateria.length === 0) {
      archivosMateria = LISTA_ARCHIVOS_LINKS.filter(a => {
        const normKey = normalizarTexto(a.materia);
        return normKey.includes(normMateria) || normMateria.includes(normKey);
      });
    }

    let textoArchivosDisponibles = "";
    if (archivosMateria.length > 0) {
      textoArchivosDisponibles = archivosMateria
        .map(a => `- [${a.categoria}] "${a.nombre}": ${a.url}`)
        .join("\n");
    } else {
      textoArchivosDisponibles = "No se encontraron archivos individuales específicos cargados para esta materia en la biblioteca digital.";
    }

    const systemInstructionText = `
Eres el "Tutor Académico DND", un asistente virtual formal y profesional para estudiantes de la Facultad de Derecho de la UNLP.
Responde de forma clara, directa y sintética en español formal. Evita rodeos, modismos o repeticiones innecesarias para agilizar la lectura y el procesamiento.

DATOS DEL ESTUDIANTE:
- Nombre: ${nombreEstudiante}

CONFIGURACIÓN DE LA MATERIA:
- Materia: ${materia}
- Cátedra: ${catedra || "General / No especificada"}
- Comisión: ${comision || "General / No especificada"}

REGLAS DE LA WEB (NUNCA INVENTES OTROS DATOS):
* PERMUTERO: Herramienta interactiva exclusiva para que los alumnos publiquen y coordinen permutas (intercambios) de comisiones o cátedras de forma directa.
* APUNTES: Biblioteca digital del sitio. Contiene el buscador interactivo de PDFs (programas, resúmenes, libros) y los links directos a las carpetas de Drive oficiales.
* NOTICIAS / INICIO: Feed con novedades, comunicados y fechas de inscripción.
* INFORMACIÓN ÚTIL: Trámites universitarios y calendario académico oficial.
* MI PERFIL: Configuración de datos del alumno y sus materias activas.

CARPETAS PRINCIPALES DE DRIVE PARA ESTA MATERIA:
- Apuntes y Resúmenes: ${linksMateria.apuntes || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
- Bibliografía y Libros: ${linksMateria.bibliografia || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
- Programas de Estudio: ${linksMateria.programas || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}

ARCHIVOS INDIVIDUALES CON LINK DIRECTO PARA ESTA MATERIA:
${textoArchivosDisponibles}

INSTRUCCIONES DE RESPUESTA:
1. Saluda cortésmente al estudiante por su nombre (ej: "Hola, ${nombreEstudiante}.").
2. Si el alumno consulta por apuntes, guíalo a usar la sección "APUNTES" del menú superior, e incluye el enlace directo si aparece listado arriba.
3. Si el alumno realiza consultas teóricas o de derecho, responde de manera concisa y estructurada en formato Markdown.
4. ENLACES Y CITAS (CRÍTICO):
   - NUNCA envuelvas los enlaces Markdown [Texto](URL) en comillas invertidas (backticks) ni bloques de código.
   - Escribe el formato de enlace estrictamente como [Texto](URL) sin ningún espacio entre corchetes y paréntesis.
   - Si no posees un enlace en la lista o carpetas, usa como fallback: https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF.

IMPORTANTE - PREGUNTAS SUGERIDAS (GUÍA DE ESTUDIO):
Al final de tu respuesta, añade exactamente 3 preguntas sugeridas de seguimiento en este formato preciso:
[SUGERENCIAS]: ¿Pregunta sugerida 1? | ¿Pregunta sugerida 2? | ¿Pregunta sugerida 3?
`;

    const contents: any[] = [];
    
    // Añadimos el historial de chat previo de forma robusta
    if (historial && Array.isArray(historial)) {
      historial.forEach((msg: any) => {
        if (!msg.content) return;
        const role = msg.role === "assistant" ? "model" : "user";
        
        // Si el rol es igual al del turno anterior, combinamos los textos para mantener la alternancia estricta del API de Gemini
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += "\n\n" + msg.content;
        } else {
          contents.push({
            role,
            parts: [{ text: msg.content }]
          });
        }
      });
    }

    // Gemini requiere obligatoriamente que la conversación comience con un mensaje de 'user'
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    // Añadimos la consulta actual enriquecida con el contexto RAG
    const currentPrompt = `
CONTEXTO DE ESTUDIO RECUPERADO (Base de Datos de Apuntes / Drive):
"""
${contextoRecuperado}
"""

PREGUNTA DEL ESTUDIANTE:
"${pregunta}"
`;

    // Si el último mensaje del historial también era del usuario (user), los combinamos en un único turno
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      contents[contents.length - 1].parts[0].text += "\n\n" + currentPrompt;
    } else {
      contents.push({
        role: "user",
        parts: [{ text: currentPrompt }]
      });
    }

    // Convertimos el historial al formato simple para OpenAI/Anthropic/Ollama
    const simpleMessages = [];
    if (historial && Array.isArray(historial)) {
      historial.forEach((msg: any) => {
        if (!msg.content) return;
        // Ignoramos la sugerencia al final del mensaje de la IA
        let content = msg.content;
        const index = content.indexOf("[SUGERENCIAS]:");
        if (index !== -1) {
          content = content.substring(0, index).trim();
        }

        simpleMessages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: content
        });
      });
    }

    // Añadimos la consulta actual enriquecida con el contexto RAG
    simpleMessages.push({
      role: "user",
      content: currentPrompt
    });

    // --- OPCIÓN 1: INTEGRACIÓN CON ANTHROPIC CLAUDE (MÁXIMA PRIORIDAD) ---
    if (anthropicApiKey) {
      let apiResponse;
      let usedModel = anthropicModel;

      try {
        apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: usedModel,
            max_tokens: 1500,
            system: systemInstructionText,
            messages: simpleMessages
          })
        });

        // Si devuelve 404 (modelo no permitido/encontrado en esta cuenta), intentamos el fallback a Claude 3 Haiku
        if (!apiResponse.ok && apiResponse.status === 404 && usedModel !== "claude-3-haiku-20240307") {
          console.warn(`[Asistente DND] Modelo ${usedModel} no disponible (404). Intentando fallback a Claude 3 Haiku...`);
          usedModel = "claude-3-haiku-20240307";
          apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": anthropicApiKey,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: usedModel,
              max_tokens: 1500,
              system: systemInstructionText,
              messages: simpleMessages
            })
          });
        }
      } catch (err: any) {
        throw new Error(`Error de conexión con Anthropic: ${err.message}`);
      }

      const responseText = await apiResponse.text();
      if (!apiResponse.ok) {
        throw new Error(`Anthropic API error: ${apiResponse.status} - ${responseText}`);
      }

      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`La respuesta de Anthropic no es JSON válido. Status: ${apiResponse.status}. Body: ${responseText}`);
      }

      const respuestaTexto = apiData.content?.[0]?.text;
      if (!respuestaTexto) {
        throw new Error("No se obtuvo respuesta de texto de Claude.");
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
    }

    // --- OPCIÓN 2: INTEGRACIÓN CON OLLAMA LOCAL ---
    if (localOllamaUrl) {
      const messages = [
        { role: "system", content: systemInstructionText },
        ...simpleMessages
      ];

      // Llamada a la API local de Ollama (a través de ngrok con el header bypass)
      const apiResponse = await fetch(`${localOllamaUrl.replace(/\/$/, "")}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages,
          stream: false
        })
      });

      const responseText = await apiResponse.text();
      if (!apiResponse.ok) {
        throw new Error(`Ollama API error: ${apiResponse.status} - ${responseText}`);
      }

      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`La respuesta de Ollama no es JSON válido. Status: ${apiResponse.status}. Body: ${responseText}`);
      }

      const respuestaTexto = apiData.choices?.[0]?.message?.content;
      if (!respuestaTexto) {
        throw new Error("No se obtuvo respuesta de texto de Ollama.");
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
    }

    // --- OPCIÓN 3: GOOGLE GEMINI ---
    // Llamada a la API de Gemini usando Native Fetch con header x-goog-api-key
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        }
      }),
    });

    const responseText = await apiResponse.text();
    if (!apiResponse.ok) {
      const status = apiResponse.status;
      if (status === 429) {
        throw new Error("LIMITE_CUOTA_EXCEDIDO");
      }
      const keyLength = geminiApiKey ? geminiApiKey.length : 0;
      const keyPreview = geminiApiKey 
        ? `${geminiApiKey.substring(0, 10)}...${geminiApiKey.substring(geminiApiKey.length - 6)} (largo: ${keyLength})`
        : "vacía";
      throw new Error(`Gemini API error: ${status} - ${responseText} | Origen Clave: ${origenClave} | Preview Clave: ${keyPreview}`);
    }

    let apiData;
    try {
      apiData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`La respuesta de Gemini no es JSON válido. Status: ${apiResponse.status}. Body: ${responseText}`);
    }

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
    let errorMsg = "Ocurrió un error inesperado al procesar tu consulta con el Asistente DND.";
    if (err.message === "LIMITE_CUOTA_EXCEDIDO") {
      errorMsg = "⚠️ **Límite de velocidad/consultas excedido en la cuenta gratuita de Gemini.** Por favor, aguarda 15 segundos y vuelve a hacer clic en tu pregunta (tu historial y pregunta no se perderán).";
    } else {
      errorMsg = `❌ **Error del servidor:** ${err.message}`;
    }
    return new Response(
      JSON.stringify({
        error: errorMsg,
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
