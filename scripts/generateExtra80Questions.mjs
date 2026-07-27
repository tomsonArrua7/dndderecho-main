// scripts/generateExtra80Questions.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUEVAS_PREGUNTAS_MASIVAS_2 = [
  // --- DERECHO CIVIL ---
  {
    id: "civ-f-11",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "Conforme al artículo 1934 del CCyCN, ¿cómo se presume la posesión de las cosas muebles no registrables?",
    opciones: [
      "Se presume la buena fe de la posesión a menos que exista prueba en contrario.",
      "Se presume ilegítima y de mala fe salvo inscripción judicial previa.",
      "Se presume propiedad del Estado Provincial por ocupación.",
      "Requiere siempre prueba documental mediante factura de compra original."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1934.",
    puntos_base: 10
  },
  {
    id: "civ-m-13",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Según el artículo 2337 del CCyCN, ¿cuándo los herederos ascendientes, descendientes y cónyuge quedan investidos de su calidad de tales?",
    opciones: [
      "De pleno derecho desde el día de la muerte del causante, sin necesidad de intervención de jueces ni declaración formal alguna.",
      "Únicamente a partir del dictado de la sentencia de declaratoria de herederos.",
      "Desde el momento de la publicación de edictos en el Boletín Oficial.",
      "Desde que abonan la tasa de justicia del proceso sucesorio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 2337.",
    puntos_base: 20
  },
  {
    id: "civ-d-09",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "En materia de contratos de consumo (Art. 1094 CCyCN), ¿cuál es la regla de interpretación ante dudas sobre el alcance de las obligaciones del consumidor?",
    opciones: [
      "Se interpreta siempre en el sentido más favorable al consumidor (principio In Dubio Pro Consumatore).",
      "Se interpreta de modo estrictamente literal a favor del proveedor de bienes y servicios.",
      "Se remite a la costumbre comercial del mercado de origen.",
      "Determina la nulidad inmediata del contrato sin posibilidad de subsanación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1094 y Ley 24.240 Art. 3º.",
    puntos_base: 30
  },

  // --- DERECHO PENAL ---
  {
    id: "pen-f-10",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 71 del Código Penal Argentino, ¿cuál es la regla general sobre la acción penal?",
    opciones: [
      "Deberán iniciarse de oficio todas las acciones penales, con excepción de las que dependieren de instancia privada y las privadas.",
      "Todas las acciones penales son privadas y requieren la iniciativa del querellante.",
      "Las acciones penales prescriben a los seis meses si no media acusación privada.",
      "Las acciones penales solo pueden ser ejercidas por el Defensor Oficial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 71.",
    puntos_base: 10
  },
  {
    id: "pen-m-13",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Según el artículo 166 inciso 2º del Código Penal Argentino, ¿cuándo se configura la figura agravada del robo por el uso de armas?",
    opciones: [
      "Si el robo se cometiere con armas de fuego o de cualquier otro tipo, incrementando la escala si el arma de fuego fuere apta para el disparo.",
      "Únicamente cuando el arma sea un cuchillo o elemento punzante registrado.",
      "Solo si el arma es disparada causando lesiones graves en la víctima.",
      "Cuando se cometa en despoblado por una sola persona desarmada."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 166 inc. 2º.",
    puntos_base: 20
  },
  {
    id: "pen-d-09",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "En la jurisprudencia de la CSJN ('Araya' / 'Veira'), ¿cuál es el requisito para que la reincidencia (Art. 50 CP) sea constitucionalmente válida?",
    opciones: [
      "Requiere el cumplimiento efectivo (total o parcial) de una pena privativa de la libertad previa por condena firme, descartando la condena condicional.",
      "Basta la mera existencia de un proceso penal abierto sin sentencia.",
      "Requiere que el segundo delito sea de la misma naturaleza o especie que el primero.",
      "Aplica de pleno derecho a cualquier persona procesada por delitos culposos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 311:1451 ('Araya') y Art. 50 del Código Penal.",
    puntos_base: 30
  },

  // --- DERECHO CONSTITUCIONAL ---
  {
    id: "con-f-10",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Según el artículo 14 bis de la Constitución Nacional (incorporado en 1957), ¿qué principio protege el trabajo en sus diversas formas?",
    opciones: [
      "El trabajo en sus diversas formas gozará de la protección de las leyes, las que asegurarán al trabajador condiciones dignas y equitativas de labor, jornada limitada, descanso y vacaciones pagadas.",
      "La libertad absoluta del empleador para fijar salarios por debajo de la subsistencia.",
      "La prohibición de toda actividad sindical o huelga en empresas estratégicas.",
      "El despido libre e incausado sin compensación indemnizatoria."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 14 bis, 1° párrafo.",
    puntos_base: 10
  },
  {
    id: "con-m-12",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Conforme al artículo 114 de la Constitución Nacional, ¿qué órgano tiene a su cargo la selección de los magistrados inferiores y la administración del Poder Judicial de la Nación?",
    opciones: [
      "El Consejo de la Magistratura de la Nación.",
      "La Procuración General de la Nación.",
      "La Sindicatura General de la República.",
      "La Cámara de Senadores del Congreso Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 114.",
    puntos_base: 20
  },
  {
    id: "con-d-09",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "En el precedente de la CSJN 'Ekmekdjian c/ Sofovich' (1992), ¿qué derecho de raigambre internacional consagró la Corte con carácter operativo directo?",
    opciones: [
      "El Derecho de Respuesta, Rectificación o Réplica (Art. 14 del Pacto de San José de Costa Rica).",
      "La libertad absoluta de imprenta sin responsabilidad ulterior.",
      "La inmunidad diplomática de los periodistas extranjeros.",
      "La exención impositiva de las empresas editoriales de diarios."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 315:1492 ('Ekmekdjian c/ Sofovich', 1992).",
    puntos_base: 30
  },

  // --- DERECHO ADMINISTRATIVO ---
  {
    id: "adm-f-10",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "De acuerdo con el principio de gratuidad en el procedimiento administrativo argentino, ¿qué regla rige la actuación de los particulares?",
    opciones: [
      "El procedimiento administrativo es gratuito para los administrados, no requiriéndose pago de tasa judicial ni patrocinio letrado obligatorio salvo norma expresa.",
      "Se exige el pago de un depósito previo equivalente al 10% del reclamo.",
      "Requiere siempre el patrocinio simultáneo de dos abogados matriculados.",
      "Se cobra una arancel oficial por cada foja presentada en mesa de entradas."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 1 inc. c).",
    puntos_base: 10
  },
  {
    id: "adm-m-12",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Según la Ley 19.549 (Art. 18), ¿cuándo la Administración puede revocar por sí un acto administrativo regular del que hubieren nacido derechos subjetivos?",
    opciones: [
      "Solo si el acto fuere nulo, o por razones de oportunidad, mérito o conveniencia indemnizando el perjuicio causado al administrado.",
      "En cualquier momento sin indemnización si cambia la autoridad política.",
      "Unicamente con acuerdo parlamentario de la comisión de presupuesto.",
      "Nunca bajo ninguna circunstancia, ni siquiera abonando indemnización."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 18.",
    puntos_base: 20
  },
  {
    id: "adm-d-09",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "En la doctrina del contrato de obra pública (Ley 13.064), ¿qué es la 'Teoría de la Imprevisión' (o hecho de la parte)?",
    opciones: [
      "Un alteración extraordinaria, imprevisible y ajena a la voluntad de las partes que torna excesivamente onerosa la prestación, otorgando derecho a recomposición contractual.",
      "La rescisión unilateral del contrato por falta de liquidez del contratista.",
      "El derecho del Estado a confiscar las maquinarias de la empresa constructora.",
      "La exención tributaria otorgada de oficio durante épocas de recesión."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 13.064 y Art. 1091 del CCyCN aplicable por analogía.",
    puntos_base: 30
  },

  // --- DERECHO PROVINCIAL BA ---
  {
    id: "prv-f-10",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Según el artículo 144 de la Constitución de la PBA, ¿quién preside la Cámara de Senadores de la provincia?",
    opciones: [
      "El Vicegobernador de la Provincia de Buenos Aires.",
      "El Intendente de la ciudad de La Plata.",
      "El Presidente de la Suprema Corte de Justicia.",
      "El Senador con mayor antigüedad de representación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 144.",
    puntos_base: 10
  },
  {
    id: "prv-m-12",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "Conforme a la Ley de Consejo de la Magistratura de la PBA (Ley N° 13.750), ¿cómo se seleccionan los postulantes a jueces de primera instancia e integrantes de cámaras de apelación?",
    opciones: [
      "Mediante concursos públicos de oposición y antecedentes organizados por el Consejo de la Magistratura bonaerense para integrar ternas vinculantes.",
      "Por designación directa y discrecional del Gobernador con acuerdo de la Policía Bonaerense.",
      "Por elección popular directa en las comisiones vecinales de cada partido.",
      "Por sorteo público realizado entre todos los abogados matriculados en el Colegio de la Provincia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA Art. 175 y Ley N° 13.750 PBA.",
    puntos_base: 20
  },
  {
    id: "prv-d-09",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "En la jurisprudencia de la SCBA sobre el procedimiento administrativo (Dec-Ley 7647/70), ¿cuándo procede la figura de la 'Caducidad del Procedimiento' por inactividad del interesado?",
    opciones: [
      "Transcurridos seis (6) meses de inactividad imputable al administrado en trámites iniciados a su instancia, previa intimación por 30 días para impulsar.",
      "Transcurridos 10 días hábiles sin que el interesado concurra al despacho.",
      "Automáticamente al momento del receso administrativo de verano.",
      "A solicitud verbal del agente mesa de entradas del ministerio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 7647/70 PBA, Art. 127.",
    puntos_base: 30
  },

  // --- NORMATIVA LOCAL Y MUNICIPAL LP ---
  {
    id: "loc-f-10",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "En la estructura administrativa de la Municipalidad de La Plata, ¿quién encabeza la Policía Comunal o la Secretaría de Seguridad del Municipio?",
    opciones: [
      "El Secretario de Seguridad designado por el Intendente Municipal.",
      "El Presidente del Colegio de Abogados de La Plata.",
      "El Decano de la Facultad de Ciencias Jurídicas y Sociales.",
      "El Defensor del Pueblo de la Provincia de Buenos Aires."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58 y estructura orgánica del Municipio de La Plata.",
    puntos_base: 10
  },
  {
    id: "loc-m-09",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 54 de la LOM, ¿cuántos concejales integran el Concejo Deliberante de un municipio de más de 200.000 habitantes como La Plata?",
    opciones: [
      "Veinticuatro (24) concejales titulares.",
      "Doce (12) concejales sin suplentes.",
      "Cincuenta (50) concejales por lista sábana.",
      "Catorce (14) representantes de cámaras gremiales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 54 inc. 1º.",
    puntos_base: 20
  },
  {
    id: "loc-d-07",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "En la regulación de la Justicia Municipal de Faltas de La Plata (Dec-Ley 8751/77), ¿cuál es el principio procesal sobre la valoración de la prueba por los Jueces de Faltas?",
    opciones: [
      "La prueba se aprecia según las reglas de la sana crítica razonada.",
      "La prueba se valora mediante el sistema de prueba tasada legal absoluta.",
      "El acta de constatación policial hace fe pública de pleno derecho sin admitir prueba en contrario.",
      "Corresponde aplicar exclusivamente la costumbre consuetudinaria."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 8751/77 PBA, Art. 38.",
    puntos_base: 30
  },

  // --- HISTORIA UNLP Y JURSOC ---
  {
    id: "unlp-f-08",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿Qué organismo máximo del gobierno universitario de la UNLP se encarga de la elección del Presidente/a de la Universidad cada cuatro años?",
    opciones: [
      "La Asamblea Universitaria (integrada por los miembros de todos los Consejos Directivos y representantes nodocentes).",
      "El Gobernador de la Provincia de Buenos Aires.",
      "El Poder Ejecutivo Nacional a propuesta del Ministerio de Educación.",
      "El Centro de Estudiantes de la Facultad de Derecho."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 11 y 12.",
    puntos_base: 10
  },
  {
    id: "unlp-m-08",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "De acuerdo con el Estatuto de la UNLP (Art. 74), ¿cuál es el título profesional otorgado por la Facultad de Ciencias Jurídicas y Sociales al culminar la carrera de grado principal?",
    opciones: [
      "Abogado / Abogada.",
      "Licenciado en Ciencias Jurídicas.",
      "Doctor en Derecho Constitucional.",
      "Escribano Público Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Plan de Estudios 6 - FCJyS - UNLP.",
    puntos_base: 20
  },
  {
    id: "unlp-d-05",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "¿Qué importante revista académica e instituto de investigación fundado en la FCJyS - UNLP es referente histórico en el pensamiento jurídico latinoamericano?",
    opciones: [
      "Revista Anales de la Facultad de Ciencias Jurídicas y Sociales de la UNLP.",
      "Boletín Judicial de la Suprema Corte.",
      "Gaceta del Foro Bonaerense.",
      "Anuario del Colegio de Magistrados."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la FCJyS - UNLP y Revista Anales.",
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

const formatted = NUEVAS_PREGUNTAS_MASIVAS_2.map(q => `  {\n    id: ${JSON.stringify(q.id)},\n    id_categoria: ${JSON.stringify(q.id_categoria)},\n    categoria_nombre: ${JSON.stringify(q.categoria_nombre)},\n    dificultad: ${JSON.stringify(q.dificultad)},\n    pregunta: ${JSON.stringify(q.pregunta)},\n    opciones: ${JSON.stringify(q.opciones, null, 6).replace(/\n/g, "\n    ")},\n    respuesta_correcta_index: 0,\n    fundamento_juridico: ${JSON.stringify(q.fundamento_juridico)},\n    puntos_base: ${q.puntos_base}\n  }`).join(",\n");

const newContent = triviaContent.slice(0, exportIndex) + ",\n  // --- LOTE MASIVO EXTRA (Nuevas Preguntas) ---\n" + formatted + "\n" + triviaContent.slice(exportIndex);

fs.writeFileSync(triviaDataPath, newContent, "utf-8");

console.log(`✅ ¡Éxito! Se han importado ${NUEVAS_PREGUNTAS_MASIVAS_2.length} preguntas adicionales en src/data/triviaData.ts.`);
