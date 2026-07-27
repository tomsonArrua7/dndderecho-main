// scripts/generateBatch3.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUEVAS_PREGUNTAS_MASIVAS_3 = [
  // =========================================================================
  // --- DERECHO CIVIL / COMERCIAL / SOCIETARIO ---
  // =========================================================================
  {
    id: "civ-m-14",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Conforme a la Ley General de Sociedades (N° 19.550), ¿cuál es la responsabilidad de los socios en una Sociedad de Responsabilidad Limitada (SRL)?",
    opciones: [
      "Limitan su responsabilidad a la integración de las cuotas que suscriban o adquieran, garantizando solidariamente la integración de los aportes en efectivo.",
      "Responden subsidiaria, ilimitada y solidariamente por todas las obligaciones sociales.",
      "Responden únicamente con sus bienes inmuebles registrados en la provincia.",
      "La responsabilidad caduca al momento de la inscripción en la Inspección de Justicia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley General de Sociedades N° 19.550, Art. 146.",
    puntos_base: 20
  },
  {
    id: "civ-d-10",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Según el artículo 1815 del CCyCN (Títulos Valores), ¿cuál es la consecuencia de la autonomía en la circulación de un título valor nominativo o al portador?",
    opciones: [
      "El adquirente de buena fe adquiere un derecho autónomo, no siéndole oponibles las defensas personales que el deudor podría haber opuesto a tenedores anteriores.",
      "El deudor puede oponer al último tenedor cualquier excepción derivada del contrato originario.",
      "El título pierde su fuerza ejecutiva si es transferido más de dos veces.",
      "Exige indispensablemente la cesión de derechos por escritura pública."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1815.",
    puntos_base: 30
  },
  {
    id: "civ-f-12",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 1002 del CCyCN, ¿quiénes tienen prohibido contratar en interés propio respecto de los bienes comprendidos en la gestión?",
    opciones: [
      "Los tutores, curadores y apoyos respecto de los bienes de las personas incapaces o con capacidad restringida que representan.",
      "Cualquier profesional matriculado que posea deuda impositiva.",
      "Los parientes consanguíneos en tercer grado en operaciones en efectivo.",
      "Los inquilinos respecto de contratos de locación con opción de compra."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1002.",
    puntos_base: 10
  },

  // =========================================================================
  // --- DERECHO PENAL Y PROCESAL PENAL ---
  // =========================================================================
  {
    id: "pen-f-11",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Según el artículo 209 del Código Penal Argentino, ¿qué tipo penal sanciona a quien hiciere públicamente la apología de un delito o de un condenado por delito?",
    opciones: [
      "El delito de Apología del Delito.",
      "El delito de Incitación a la Violencia Colectiva.",
      "El delito de Falso Testimonio Agravado.",
      "El delito de Encubrimiento por Omisión de Denuncia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 209.",
    puntos_base: 10
  },
  {
    id: "pen-m-14",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Conforme al Código Procesal Penal de la Provincia de Buenos Aires (Ley 11.922), ¿qué recurso procede contra la resolución de la Cámara de Apelación que confirma la prisión preventiva?",
    opciones: [
      "El Recurso de Casación ante el Tribunal de Casación Penal de la PBA.",
      "El Recurso de Revocatoria in extremis ante el Juez de Garantías.",
      "La Acción Ordinaria de Inconstitucionalidad municipal.",
      "No admite recurso alguno por ser medida cautelar no definitiva."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPPBA (Ley 11.922), Art. 448 y 450.",
    puntos_base: 20
  },
  {
    id: "pen-d-10",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "En el precedente de la CSJN 'Tarifeño' (1989), ¿qué doctrina fijó la Corte respecto de la invalidez de la condena dictada sin acusación fiscal?",
    opciones: [
      "Es nula por violar la garantía del debido proceso y la imparcialidad del juzgador (sistema acusatorio), no pudiendo el tribunal condenar sin acusación previa del Ministerio Público.",
      "El tribunal de juicio puede condenar de oficio independientemente de la postura fiscal.",
      "El querellante privado puede reemplazar integramente la acusación del fiscal en delitos de acción pública sin restricciones.",
      "La falta de acusación fiscal genera únicamente la suspensión por seis meses del juicio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 312:2506 ('Tarifeño, Francisco', 1989).",
    puntos_base: 30
  },

  // =========================================================================
  // --- DERECHO CONSTITUCIONAL Y DDHH ---
  // =========================================================================
  {
    id: "con-f-11",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Conforme al artículo 16 de la Constitución Nacional, ¿cuál es el principio fundante de la igualdad civil en Argentina?",
    opciones: [
      "La Nación Argentina no admite prerrogativas de sangre, ni de nacimiento: no hay en ella fueros personales ni títulos de nobleza. Todos sus habitantes son iguales ante la ley.",
      "La igualdad solo aplica a ciudadanos nativos mayores de edad con empleo formal.",
      "Existen fueros especiales de excepción para legisladores en causas comerciales.",
      "Se reconocen títulos de nobleza conferidos por organismos internacionales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 16.",
    puntos_base: 10
  },
  {
    id: "con-m-13",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Según el artículo 86 de la Constitución Nacional, ¿cuál es el órgano independiente que funciona en el ámbito del Congreso con autonomía funcional sin recibir instrucciones de ninguna autoridad?",
    opciones: [
      "El Defensor del Pueblo de la Nación.",
      "El Ministerio de Capital Humano.",
      "La Jefatura de Gabinete de Ministros.",
      "El Banco de la Nación Argentina."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 86.",
    puntos_base: 20
  },
  {
    id: "con-d-10",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "En el precedente de la Corte Interamericana de Derechos Humanos 'Barrios Altos c. Perú' y su aplicación por la CSJN en 'Mazzeo' (2007), ¿cuál es la invalidez constitucional de las leyes de amnistía o indultos en delitos de lesa humanidad?",
    opciones: [
      "Son manifiestamente incompatibles con la Convención Americana sobre Derechos Humanos y carecen de todo efecto jurídico, al ser crímenes imprescriptibles e inamnestiables.",
      "Son válidas siempre que hayan sido aprobadas por dos tercios del Congreso.",
      "Se aplican si transcurrieron más de 30 años de la comisión del hecho.",
      "Requieren únicamente la ratificación de las asambleas provinciales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Corte IDH ('Barrios Altos') y CSJN, Fallos 330:3248 ('Mazzeo', 2007).",
    puntos_base: 30
  },

  // =========================================================================
  // --- DERECHO ADMINISTRATIVO Y PROCESAL ADMINISTRATIVO ---
  // =========================================================================
  {
    id: "adm-f-11",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "En la Ley de Empleo Público Nacional (N° 25.164), ¿cuál es el derecho fundamental reconocido a los agentes de la planta permanente que hayan ingresado por concurso?",
    opciones: [
      "La estabilidad en el empleo público.",
      "El libre traslado sin causa justificada.",
      "La exención de responsabilidad patrimonial.",
      "El cobro de bonificaciones sin prestar servicio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 25.164, Art. 16 y Art. 14 bis CN.",
    puntos_base: 10
  },
  {
    id: "adm-m-13",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Conforme al Decreto 1759/72 t.o., ¿cuándo procede el Recurso de Queja por Denegación de Recursos o por Retardo de Justicia en sede administrativa?",
    opciones: [
      "Cuando se hubieren vencido los plazos fijados para resolver un recurso o cuando se denegare injustificadamente la tramitación de un recurso interpuesto.",
      "Siempre que se dicte un acto de alcance general que modifique una tasa.",
      "Solo en trámites de marcas y patentes ante el INPI.",
      "Cuando el administrado prefiera no aguardar la notificación formal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto N° 1759/72 t.o., Art. 71 y 72.",
    puntos_base: 20
  },
  {
    id: "adm-d-10",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "En la doctrina procesal administrativa bonaerense (Ley 12.008), ¿qué medida cautelar especial procede para suspender los efectos de un acto administrativo ruinoso antes de dictar sentencia?",
    opciones: [
      "La suspensión de los efectos del acto administrativo impugnado, acreditando la verosimilitud del derecho y el peligro en la demora.",
      "La inhibición general de bienes de los funcionarios actuantes.",
      "La clausura preventiva de la mesa de entradas administrativa.",
      "La intervención judicial del organismo provincial con sustitución de autoridades."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 12.008 PBA, Arts. 22 y 25.",
    puntos_base: 30
  },

  // =========================================================================
  // --- DERECHO PROVINCIAL Y PROCESAL CIVIL PBA ---
  // =========================================================================
  {
    id: "prv-f-11",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Según el Código Procesal Civil y Comercial de la PBA (Ley 7425/CPCC), ¿cuál es el plazo general para contestar la demanda en un juicio ordinario?",
    opciones: [
      "Quince (15) días hábiles judiciales.",
      "Cinco (5) días corridos improrrogables.",
      "Treinta (30) días calendario de corrido.",
      "Diez (10) días hábiles administrativos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPCC PBA, Art. 337.",
    puntos_base: 10
  },
  {
    id: "prv-m-13",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "De acuerdo con el CPCC de la PBA (Art. 310), ¿cuándo se opera la caducidad (perención) de la instancia en primera instancia por inactividad procesal de las partes?",
    opciones: [
      "A los seis (6) meses sin que se hubiere producido ningún acto de impulso procesal por las partes o por el juez.",
      "A los dos (2) meses contados desde la apertura a prueba.",
      "A los tres (3) años en todo tipo de procesos civiles.",
      "A los treinta (30) días corridos en causas con habilitación de día y hora."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPCC PBA, Art. 310 inc. 1º.",
    puntos_base: 20
  },
  {
    id: "prv-d-10",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "En la Ley de Mediación Previa Obligatoria de la PBA (Ley N° 13.951), ¿cuál es la consecuencia de la incomparecencia injustificada de la parte requerida a la audiencia de mediación?",
    opciones: [
      "Se le impondrá una multa equivalente a determinado número de JUS y se dará por cerrada la etapa previa con habilitación de la vía judicial.",
      "Provoca la caducidad automática del derecho sustancial reclamado.",
      "Genera la orden judicial de detención por desobediencia.",
      "Implica el archivo definitivo del expediente procesal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 13.951 PBA, Art. 14.",
    puntos_base: 30
  },

  // =========================================================================
  // --- NORMATIVA LOCAL LA PLATA Y MUNICIPAL ---
  // =========================================================================
  {
    id: "loc-f-11",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "En el partido de La Plata, ¿cuál es la entidad descentralizada encargada de la prestación del servicio de agua potable y saneamiento en la provincia y municipio?",
    opciones: [
      "Aguas Bonaerenses S.A. (ABSA).",
      "Empresa Distribuidora de Energía La Plata (EDELAP).",
      "Autoridad del Agua (ADA) exclusiva del departamento judicial.",
      "Cooperativa Eléctrica Municipal de Tolosa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Marco Regulatorio Sanitario de la PBA (Decreto 878/03).",
    puntos_base: 10
  },
  {
    id: "loc-m-10",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Según la LOM (Dec-Ley 6769/58 Art. 109), ¿quién reemplaza al Intendente Municipal de La Plata en caso de ausencia temporaria o licencia?",
    opciones: [
      "El primer concejal de la lista electa del partido al que pertenece el Intendente.",
      "El Presidente del Concejo Deliberante de forma automática.",
      "El Secretario de Gobierno comisionado de oficio.",
      "El Gobernador de la Provincia designando a un delegado local."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 109.",
    puntos_base: 20
  },
  {
    id: "loc-d-08",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "En el sistema de compras municipales de la PBA (LOM y RAFAM), ¿cuál es el sistema informático de administración financiera obligatorio para la registración del presupuesto municipal?",
    opciones: [
      "RAFAM (Reforma de la Administración Financiera en el Ámbito Municipal).",
      "SIDIF (Sistema de Información Financiera del Estado Nacional).",
      "SIGAF (Sistema Integrado de Gestión Financiera).",
      "SINTYS (Sistema de Identificación Tributaria)."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto N° 2980/00 PBA (Reglamento del RAFAM).",
    puntos_base: 30
  },

  // =========================================================================
  // --- HISTORIA UNLP Y ESTATUTO ---
  // =========================================================================
  {
    id: "unlp-f-09",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿Qué emblema y frase latina figuran en el escudo oficial de la Universidad Nacional de La Plata?",
    opciones: [
      "'Pro Scientia et Patria' (Por la Ciencia y por la Patria) acompañando la figura del Roble.",
      "'Veritas et Lux' bajo la imagen del Sol Naciente.",
      "'In Libertate Devotio' sobre la balanza de la justicia.",
      "'Ordo et Progressus' junto a la cruz del sur."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto y Simbología Oficial de la UNLP.",
    puntos_base: 10
  },
  {
    id: "unlp-m-09",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "De acuerdo con el Estatuto de la UNLP (Art. 3º), ¿cuál es la misión fundamental de la universidad pública?",
    opciones: [
      "La docencia de grado y posgrado, la investigación científica y tecnológica, y la extensión universitaria orientada a las necesidades del pueblo.",
      "La intermediación comercial de patentes privadas de software.",
      "La expedición exclusiva de licencias habilitantes para el comercio internacional.",
      "El arbitraje obligatorio entre cámaras empresariales de la provincia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 3º.",
    puntos_base: 20
  },
  {
    id: "unlp-d-06",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "¿Qué célebre jurista platense y profesor de la FCJyS redactó el Anteproyecto de Código Procesal Penal Tipo para Iberoamérica y fue una figura central de la escuela procesal penal argentina?",
    opciones: [
      "Clariá Olmedo y la influencia de procesalistas de la UNLP como Julio Maier y Gladys Romero.",
      "Guillermo Borda.",
      "Raymundo Salvat.",
      "Luis Jiménez de Asúa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la Cátedra de Derecho Procesal Penal FCJyS - UNLP.",
    puntos_base: 30
  }
];

const triviaDataPath = path.resolve(__dirname, "../src/data/triviaData.ts");
let triviaContent = fs.readFileSync(triviaDataPath, "utf-8");

const exportIndex = triviaContent.lastIndexOf("];");
if (exportIndex === -1) {
  console.error("Error: No se encontró el final del array TRIVIA_QUESTIONS.");
  process.exit(1);
}

const formatted = NUEVAS_PREGUNTAS_MASIVAS_3.map(q => `  {\n    id: ${JSON.stringify(q.id)},\n    id_categoria: ${JSON.stringify(q.id_categoria)},\n    categoria_nombre: ${JSON.stringify(q.categoria_nombre)},\n    dificultad: ${JSON.stringify(q.dificultad)},\n    pregunta: ${JSON.stringify(q.pregunta)},\n    opciones: ${JSON.stringify(q.opciones, null, 6).replace(/\n/g, "\n    ")},\n    respuesta_correcta_index: 0,\n    fundamento_juridico: ${JSON.stringify(q.fundamento_juridico)},\n    puntos_base: ${q.puntos_base}\n  }`).join(",\n");

const newContent = triviaContent.slice(0, exportIndex) + ",\n  // --- LOTE MASIVO 3 (Nuevas Preguntas Inéditas) ---\n" + formatted + "\n" + triviaContent.slice(exportIndex);

fs.writeFileSync(triviaDataPath, newContent, "utf-8");

console.log(`✅ ¡Éxito! Se han importado ${NUEVAS_PREGUNTAS_MASIVAS_3.length} preguntas adicionales en src/data/triviaData.ts.`);
