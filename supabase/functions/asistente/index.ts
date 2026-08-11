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
    const bodyData = await req.json();
    const { accion, pregunta, materia, catedra, comision, historial, pregunta_trivia, opcion_elegida, opcion_correcta, fundamento } = bodyData;

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

    // Cargar configuraciones desde la tabla 'app_settings'
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

    let openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY") || dbSettings?.openrouter_api_key || "";
    let openrouterModel = dbSettings?.openrouter_model || "deepseek/deepseek-chat";
    let anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY") || dbSettings?.anthropic_api_key || "";
    let localOllamaUrl = Deno.env.get("LOCAL_OLLAMA_URL") || dbSettings?.local_ollama_url || "";
    let anthropicModel = dbSettings?.anthropic_model || "claude-sonnet-4-6";
    let geminiApiKey = Deno.env.get("GEMINI_API_KEY") || dbSettings?.gemini_api_key || "";

    if (openrouterApiKey) {
      openrouterApiKey = openrouterApiKey.replace(/\s+/g, "");
      origenClave = Deno.env.get("OPENROUTER_API_KEY") ? "Deno.env (OpenRouter/DeepSeek)" : "base_de_datos (OpenRouter/DeepSeek)";
    }
    if (anthropicApiKey) {
      anthropicApiKey = anthropicApiKey.replace(/\s+/g, "");
      if (origenClave === "ninguno") {
        origenClave = Deno.env.get("ANTHROPIC_API_KEY") ? "Deno.env (Claude)" : "base_de_datos (Claude)";
      }
    }
    if (geminiApiKey) {
      geminiApiKey = geminiApiKey.replace(/\s+/g, "");
      if (origenClave === "ninguno") {
        origenClave = Deno.env.get("GEMINI_API_KEY") ? "Deno.env (Gemini)" : "base_de_datos (Gemini)";
      }
    }

    // =========================================================================
    // ACCIÓN 1: EXPLICAR FALLO EN LA TRIVIA
    // =========================================================================
    if (accion === "explicar_fallo") {
      const promptExplicacion = `Un estudiante de Derecho respondió INCORRECTAMENTE una pregunta en la Trivia Jurídica.
Pregunta: "${pregunta_trivia || ''}"
La opción que eligió el estudiante: "${opcion_elegida || ''}"
La opción correcta era: "${opcion_correcta || ''}"
Fundamento normativo base: "${fundamento || 'Normativa aplicable'}"

Por favor, explica en un tono pedagógico, directo y muy claro (EN MÁXIMO 2 ORACIONES CORTAS EN ESPAÑOL FORMAL) por qué su elección era incorrecta y por qué la opción correcta es la adecuada.`;

      let explicacion = "";
      if (openrouterApiKey) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openrouterApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: openrouterModel,
              messages: [{ role: "user", content: promptExplicacion }],
              temperature: 0.3
            })
          });
          if (res.ok) {
            const data = await res.json();
            explicacion = data.choices?.[0]?.message?.content || "";
          }
        } catch (e: any) {
          console.warn("Error al generar explicación con OpenRouter:", e.message);
        }
      }

      if (!explicacion) {
        explicacion = `La respuesta correcta es "${opcion_correcta}" debido al fundamento jurídico aplicable: ${fundamento || 'normativa legal de la materia'}.`;
      }

      return new Response(JSON.stringify({ explicacion }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // =========================================================================
    // ACCIÓN 2: GENERAR PARCIAL FLASH CON IA
    // =========================================================================
    if (accion === "generar_parcial_flash") {
      const promptParcial = `Genera EXACTAMENTE 5 preguntas de opción múltiple (Multiple Choice) para un examen parcial universitario enfocado EXCLUSIVAMENTE en la materia o tema de Derecho: "${materia || 'Derecho General'}".
¡REGLA OBLIGATORIA Y CRÍTICA!: Las 5 preguntas DEBEN tratar 100% sobre "${materia}". Está estrictamente prohibido incluir contenido o preguntas de otras materias o temas distintos.
Responde ÚNICAMENTE en formato JSON plano como una lista de objetos (un arreglo JSON sin bloques de código markdown ni texto adicional).
Estructura exacta de cada objeto:
{
  "id": "pf_1",
  "id_categoria": "${(materia || 'general').toLowerCase().replace(/\s+/g, "_")}",
  "categoria_nombre": "${materia || 'Derecho'}",
  "dificultad": "media",
  "pregunta": "¿Texto claro de la pregunta de la materia?",
  "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "respuesta_correcta_index": 0,
  "fundamento_juridico": "Artículo de ley o concepto explicativo de ${materia}",
  "puntos_base": 100
}`;

      let preguntas: any[] = [];
      if (openrouterApiKey) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openrouterApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: openrouterModel,
              messages: [{ role: "user", content: promptParcial }],
              temperature: 0.4
            })
          });
          if (res.ok) {
            const data = await res.json();
            const rawText = data.choices?.[0]?.message?.content || "";
            const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            preguntas = JSON.parse(cleanText);
          }
        } catch (e: any) {
          console.warn("Error al generar Parcial Flash:", e.message);
        }
      }

      return new Response(JSON.stringify({ preguntas }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Validación de campos para consulta del asistente
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

      // Consulta de fragmentos en base de datos
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

      // Buscar si existen correcciones previas aprobadas por admins para esta materia
      try {
        const { data: correcciones } = await supabase
          .from("asistente_correcciones")
          .select("pregunta_original, respuesta_corregida")
          .eq("materia", materia)
          .eq("aprobado", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (correcciones && correcciones.length > 0) {
          const textoCorrecciones = correcciones
            .map((c, idx) => `[CORRECCIÓN REGISTRADA ${idx + 1}]\nPregunta original: "${c.pregunta_original}"\nRespuesta Oficial Corregida: ${c.respuesta_corregida}`)
            .join("\n\n");

          contextoRecuperado += `\n\n=== DIRECTRICES Y CORRECCIONES OFICIALES DE ADMINISTRADORES (MÁXIMA PRIORIDAD) ===\n${textoCorrecciones}`;
        }
      } catch (e: any) {
        console.warn("Aviso al consultar asistente_correcciones:", e.message);
      }
    } catch (err: any) {
      console.error("Fallo al conectar con la base de datos Supabase:", err.message);
      contextoRecuperado = obtenerContextoSimulado(materia, catedra, comision);
    }

    // =========================================================================
    // API keys ya cargadas al inicio de la función (ver bloque superior)
    // =========================================================================

    // Si no hay ninguna clave o URL configurada, informamos al usuario para que la agregue
    if (!openrouterApiKey && !anthropicApiKey && !localOllamaUrl && !geminiApiKey) {
      return new Response(
        JSON.stringify({
          respuesta: `⚠️ **¡La Edge Function del Asistente DND está activa!**
          
Sin embargo, no se ha configurado ninguna clave de Inteligencia Artificial (OpenRouter/DeepSeek, Claude, Gemini u Ollama). Al usar **Supabase Self-hosted**, puedes agregarla fácilmente en tu base de datos:

**Desde tu Panel Web (Súper Fácil):**
1. Ve al **Table Editor** en el menú izquierdo de tu Supabase Dashboard.
2. Abre la tabla \`app_settings\`.
3. Haz clic en el botón de agregar columna \`+\` y crea alguna de las siguientes columnas de tipo \`text\`:
   - \`openrouter_api_key\` (para usar **DeepSeek V3** a ultrabajo costo, altamente recomendado).
   - \`anthropic_api_key\` (para usar **Claude 3.5 Sonnet**).
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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Acceso no autorizado. Se requiere iniciar sesión para usar el asistente." }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    try {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Sesión inválida o expirada. Por favor, inicia sesión nuevamente." }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const profileResponse = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      const profile = profileResponse?.data;
      if (profile?.full_name) {
        nombreEstudiante = profile.full_name.split(" ")[0]; // Primer nombre
      }
    } catch (e) {
      console.warn("Fallo al validar sesión del estudiante:", e.message);
      return new Response(
        JSON.stringify({ error: "Error de servidor al validar sesión de usuario." }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
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
Responde de forma extremadamente clara, directa y sintética en español formal. Limita tus explicaciones a un máximo de 2 o 3 párrafos muy cortos e independientes. Evita rodeos, introducciones innecesarias ("Por supuesto", "Entiendo tu consulta") o saludos repetidos para agilizar al máximo el tiempo de respuesta y la lectura.


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

    // --- OPCIÓN 0: INTEGRACIÓN CON OPENROUTER (DEEPSEEK V3 / OTROS) CON STREAMING SSE ---
    if (openrouterApiKey) {
      // Ventana deslizante de historial: tomamos como máximo las últimas 6 intervenciones para ahorrar tokens
      const messagesForOpenRouter = [
        { role: "system", content: systemInstructionText },
        ...simpleMessages.slice(-7)
      ];

      console.log(`[Asistente DND] Iniciando streaming desde OpenRouter (${openrouterModel})...`);

      const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openrouterApiKey}`,
          "HTTP-Referer": "https://dndderecho.unlp.edu.ar",
          "X-Title": "Asistente DND UNLP",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: openrouterModel,
          messages: messagesForOpenRouter,
          stream: true,
          temperature: 0.3
        })
      });

      if (!openrouterRes.ok) {
        const errText = await openrouterRes.text();
        throw new Error(`OpenRouter API error: ${openrouterRes.status} - ${errText}`);
      }

      if (openrouterRes.body) {
        const [streamClient, streamBg] = openrouterRes.body.tee();

        // Procesador en segundo plano para extraer pregunta de trivia sin demorar al cliente
        (async () => {
          try {
            const reader = streamBg.getReader();
            const decoder = new TextDecoder();
            let fullAnswer = "";
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                  const dataStr = trimmed.replace(/^data:\s*/, "");
                  if (dataStr === "[DONE]") break;
                  try {
                    const parsed = JSON.parse(dataStr);
                    const token = parsed.choices?.[0]?.delta?.content || "";
                    if (token) fullAnswer += token;
                  } catch (e) {}
                }
              }
            }

            if (fullAnswer.length > 40 && materia) {
              const promptTrivia = `A partir de la siguiente consulta académica y su respuesta sobre la materia "${materia}":
PREGUNTA DEL ALUMNO: "${pregunta}"
RESPUESTA DEL TUTOR: "${fullAnswer}"

Genera UNA sola pregunta de Trivia de opción múltiple (Multiple Choice) de nivel universitario para evaluar esta consulta.
Responde ÚNICAMENTE en formato JSON plano con esta estructura exacta sin bloques de código markdown:
{
  "pregunta": "¿Texto de la pregunta?",
  "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "respuesta_correcta_index": 0,
  "fundamento_juridico": "Artículo o concepto explicativo clave",
  "dificultad": "media"
}`;

              const triviaRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${openrouterApiKey}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  model: openrouterModel,
                  messages: [{ role: "user", content: promptTrivia }],
                  temperature: 0.3
                })
              });

              if (triviaRes.ok) {
                const triviaData = await triviaRes.json();
                const rawContent = triviaData.choices?.[0]?.message?.content || "";
                const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsedQ = JSON.parse(cleanJson);

                if (parsedQ.pregunta && Array.isArray(parsedQ.opciones) && parsedQ.opciones.length === 4) {
                  await supabase.from("trivia_preguntas").insert({
                    materia,
                    catedra: catedra || null,
                    dificultad: parsedQ.dificultad || "media",
                    pregunta: parsedQ.pregunta,
                    opciones: parsedQ.opciones,
                    respuesta_correcta_index: parsedQ.respuesta_correcta_index ?? 0,
                    fundamento_juridico: parsedQ.fundamento_juridico || "",
                    origen: "ia_asistente",
                    aprobado: false
                  });
                  console.log(`[Trivia IA] Pregunta de trivia generada con éxito desde consulta del asistente: "${parsedQ.pregunta}"`);
                }
              }
            }
          } catch (e: any) {
            console.warn("[Trivia IA] No se pudo auto-generar la pregunta de trivia en segundo plano:", e.message);
          }
        })();

        return new Response(streamClient, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      }

      return new Response(openrouterRes.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      });
    }

    // --- OPCIÓN 1: INTEGRACIÓN CON ANTHROPIC CLAUDE ---
    if (anthropicApiKey) {
      let apiResponse;
      let usedModel = anthropicModel;

      const systemPayload = [
        {
          type: "text",
          text: systemInstructionText,
          cache_control: { type: "ephemeral" }
        }
      ];

      try {
        apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "prompt-caching-2024-07-31",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: usedModel,
            max_tokens: 1500,
            system: systemPayload,
            messages: simpleMessages
          })
        });

        // Si devuelve 404 (modelo no permitido/encontrado en esta cuenta), intentamos el fallback a Claude Haiku
        if (!apiResponse.ok && apiResponse.status === 404 && usedModel !== "claude-haiku-4-5-20251001") {
          console.warn(`[Asistente DND] Modelo ${usedModel} no disponible (404). Intentando fallback a Claude Haiku...`);
          usedModel = "claude-haiku-4-5-20251001";
          apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": anthropicApiKey,
              "anthropic-version": "2023-06-01",
              "anthropic-beta": "prompt-caching-2024-07-31",
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: usedModel,
              max_tokens: 1500,
              system: systemPayload,
              messages: simpleMessages
            })
          });
        }
      } catch (err: any) {
        throw new Error(`Error de conexión con Anthropic: ${err.message}`);
      }

      const responseText = await apiResponse.text();
      if (!apiResponse.ok) {
        let availableModelsList = "No se pudieron listar";
        try {
          const modelsRes = await fetch("https://api.anthropic.com/v1/models", {
            method: "GET",
            headers: {
              "x-api-key": anthropicApiKey,
              "anthropic-version": "2023-06-01"
            }
          });
          if (modelsRes.ok) {
            const modelsData = await modelsRes.json();
            availableModelsList = (modelsData.data || []).map((m: any) => m.id).join(", ");
          } else {
            availableModelsList = `Error ${modelsRes.status}: ${await modelsRes.text()}`;
          }
        } catch (e: any) {
          availableModelsList = `Error al consultar: ${e.message}`;
        }
        throw new Error(`Anthropic API error: ${apiResponse.status} - ${responseText} | Modelos habilitados en tu cuenta: [${availableModelsList}]`);
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
