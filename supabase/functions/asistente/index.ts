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
    let origenClave = "ninguno";
    let geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (geminiApiKey) {
      origenClave = "Deno.env";
    }

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
          origenClave = "base_de_datos";
        }
      } catch (err: any) {
        console.warn("No se pudo leer gemini_api_key de app_settings:", err.message);
      }
    }

    if (geminiApiKey) {
      geminiApiKey = geminiApiKey.replace(/\s+/g, "");
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
Eres "Asistente DND", un tutor virtual académico experto y especializado para estudiantes de la Facultad de Derecho de la UNLP.
Tu objetivo es guiar al estudiante de manera clara, rigurosa y amigable.

DATOS DEL ESTUDIANTE:
- Nombre: ${nombreEstudiante}

CONFIGURACIÓN DE LA MATERIA:
- Materia: ${materia}
- Cátedra: ${catedra || "General / No especificada"}
- Comisión: ${comision || "General / No especificada"}

CARPETAS PRINCIPALES DE DRIVE PARA ESTA MATERIA:
- Apuntes y Resúmenes: ${linksMateria.apuntes || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
- Bibliografía y Libros: ${linksMateria.bibliografia || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}
- Programas de Estudio: ${linksMateria.programas || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}

ARCHIVOS INDIVIDUALES CON LINK DIRECTO PARA ESTA MATERIA (Usa estos enlaces para responder con precisión):
${textoArchivosDisponibles}

INSTRUCCIONES DE RESPUESTA:
1. Dirígete al estudiante por su nombre (${nombreEstudiante}) al inicio o de manera natural durante la explicación para hacerlo cercano y personalizado.
2. Responde de forma clara, amigable y estructurada utilizando formato Markdown (negritas, listas, saltos de línea).
3. Adapta tu explicación al enfoque pedagógico de la cátedra seleccionada. Si hay directrices específicas en el contexto de esa cátedra, dales prioridad absoluta.
4. Si la respuesta exacta no está en el contexto recuperado, utiliza tus conocimientos generales del Derecho aplicados a la currícula de la UNLP, pero adviértele amablemente: *"Esta explicación se basa en doctrina general de la materia, ya que no se encuentra detallada de esta forma específica en los apuntes de la Cátedra/Comisión seleccionada."*
5. Mantén un tono de compañero de estudio empático pero sumamente formal y preciso con los términos jurídicos y legales.
6. ENLACES Y CITAS EXACTAS (CRÍTICO):
   - NUNCA encierres los enlaces Markdown como [Texto](URL) en comillas invertidas (backticks) ni bloques de código. Deben escribirse de forma plana directamente en el texto para que la web los convierta en botones clickeables.
   - Asegúrate de escribir el formato de enlace estrictamente como [Texto](URL) sin ningún espacio entre los corchetes y los paréntesis. Ej: [Programa de la Materia](URL).
   - Si el estudiante te pide el "programa" de la materia o de alguna cátedra, busca en la lista "ARCHIVOS INDIVIDUALES CON LINK DIRECTO PARA ESTA MATERIA" si hay algún archivo de tipo "Programa" o "Programas". Si existe, enlázalo directamente usando su URL exacta: [Programa de la Materia](URL_del_archivo). Si no lo encuentras, enlázalo a la carpeta de Programas de Estudio: [Carpeta de Programas](${linksMateria.programas || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}).
   - Si pide resúmenes, apuntes o libros de la bibliografía, busca si hay archivos individuales correspondientes en la lista para darle el enlace directo. Si no los hay, enlázalo a la carpeta de Apuntes y Resúmenes: [Carpeta de Apuntes y Resúmenes](${linksMateria.apuntes || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}), o a la de Bibliografía: [Carpeta de Bibliografía](${linksMateria.bibliografia || "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF"}).
   - NUNCA inventes URLs. Si no tienes un enlace en la lista o carpetas, usa como fallback general la carpeta raíz de Drive: https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF.

IMPORTANTE - PREGUNTAS SUGERIDAS (GUÍA DE ESTUDIO):
Al final de toda tu respuesta, debes incluir una línea especial con exactamente 3 preguntas sugeridas de seguimiento que le sirvan al estudiante para continuar estudiando este tema.
Sigue este formato exacto al final (usa una nueva línea sin nada más antes ni después):
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

    // Llamada a la API de Gemini usando Native Fetch con header x-goog-api-key (soporta el nuevo formato de claves AQ. de Google)
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

    if (!apiResponse.ok) {
      const status = apiResponse.status;
      const errorDetail = await apiResponse.text();
      if (status === 429) {
        throw new Error("LIMITE_CUOTA_EXCEDIDO");
      }
      const keyLength = geminiApiKey ? geminiApiKey.length : 0;
      const keyPreview = geminiApiKey 
        ? `${geminiApiKey.substring(0, 10)}...${geminiApiKey.substring(geminiApiKey.length - 6)} (largo: ${keyLength})`
        : "vacía";
      throw new Error(`Gemini API error: ${status} - ${errorDetail} | Origen Clave: ${origenClave} | Preview Clave: ${keyPreview}`);
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
