import { TRIVIA_QUESTIONS_EXTENDED } from './dbTriviaQuestionsExt';

export interface TriviaQuestion {
  id: string;
  id_categoria: string;
  categoria_nombre: string;
  dificultad: "facil" | "media" | "dificil";
  pregunta: string;
  opciones: string[];
  respuesta_correcta_index: number;
  fundamento_juridico: string;
  puntos_base: number;
}

export interface CategoriaTrivia {
  id: string;
  nombre: string;
  descripcion: string;
  anio: number; // 0 = Toda la carrera, 1 a 5 = Año específico del Plan de Estudios Nº 6 FCJyS
  icono: string;
  color: string;
}

export interface LeaderboardEntry {
  id: string;
  posicion: number;
  nombre: string;
  facultad: string;
  materiaFav: string;
  puntos: number;
  puntosPorCategoria?: Record<string, number>;
  aciertosPorcentaje: number;
  racha: number;
  avatarUrl?: string;
  rangoNombre?: string;
}

export interface DueloTrivia {
  id: string;
  esPublico: boolean;
  materiaId: string;
  materiaNombre: string;
  preguntasIds: string[];

  player1Id: string;
  player1Nombre: string;
  player1Aciertos: number;
  player1TiempoMs: number;
  player1Puntos: number;
  player1Completed: boolean;

  player2Id?: string;
  player2Nombre?: string;
  player2Aciertos?: number;
  player2TiempoMs?: number;
  player2Puntos?: number;
  player2Completed?: boolean;

  ganadorId?: string | "empate";
  status: "esperando_rival" | "en_curso" | "finalizado";
  createdAt: string;
}

export interface RangoJuridico {
  id: string;
  nombre: string;
  minPuntos: number;
  maxPuntos: number;
  iconoNombre: string;
  colorGradient: string;
  badgeStyle: string;
  descripcion: string;
}

// =========================================================================
// ESCALA OFICIAL DE 12 RANGOS JURÍDICOS
// =========================================================================
export const RANGOS_JURIDICOS: RangoJuridico[] = [
  {
    id: "ingresante",
    nombre: "Ingresante",
    minPuntos: 0,
    maxPuntos: 99,
    iconoNombre: "BookOpen",
    colorGradient: "from-slate-500 to-zinc-600",
    badgeStyle: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    descripcion: "Dando los primeros pasos en las aulas de la FCJyS y adaptándose al ingreso."
  },
  {
    id: "practicante",
    nombre: "Practicante",
    minPuntos: 100,
    maxPuntos: 249,
    iconoNombre: "Building2",
    colorGradient: "from-blue-500 to-cyan-600",
    badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    descripcion: "Recorriendo mesas de entradas, pasillos de Tribunales y con el Plan al día."
  },
  {
    id: "estudiante_avanzado",
    nombre: "Estudiante Avanzado",
    minPuntos: 250,
    maxPuntos: 499,
    iconoNombre: "GraduationCap",
    colorGradient: "from-cyan-500 to-teal-600",
    badgeStyle: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    descripcion: "Con las materias más pesadas metidas y los codos gastados en la biblioteca."
  },
  {
    id: "graduado_reciente",
    nombre: "Graduado Reciente",
    minPuntos: 500,
    maxPuntos: 899,
    iconoNombre: "FileText",
    colorGradient: "from-teal-500 to-emerald-600",
    badgeStyle: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    descripcion: "Título en mano, juramento cumplido y esperando la habilitación del diploma."
  },
  {
    id: "abogado_joven",
    nombre: "Abogado Joven",
    minPuntos: 900,
    maxPuntos: 1499,
    iconoNombre: "Briefcase",
    colorGradient: "from-emerald-500 to-green-600",
    badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    descripcion: "Matriculado con sello fresco, token en mano y los primeros escritos ingresados."
  },
  {
    id: "especialista_docente",
    nombre: "Especialista / Docente Adscripto",
    minPuntos: 1500,
    maxPuntos: 2299,
    iconoNombre: "Award",
    colorGradient: "from-green-500 to-lime-600",
    badgeStyle: "bg-green-500/20 text-green-300 border-green-500/30",
    descripcion: "Dominio de cátedra, posgrados en marcha y sólidas estrategias en el fuero."
  },
  {
    id: "abogado_experto",
    nombre: "Abogado Experto",
    minPuntos: 2300,
    maxPuntos: 3499,
    iconoNombre: "Scale",
    colorGradient: "from-amber-500 to-orange-600",
    badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    descripcion: "Litigante de peso, referencia de doctrina, jurisprudencia y casos complejos."
  },
  {
    id: "secretario_juzgado",
    nombre: "Secretario de Juzgado",
    minPuntos: 3500,
    maxPuntos: 4999,
    iconoNombre: "BookOpenCheck",
    colorGradient: "from-orange-500 to-rose-600",
    badgeStyle: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    descripcion: "Brazo ejecutor del despacho judicial, despachando expedientes con rigor técnico."
  },
  {
    id: "juez_primera_instancia",
    nombre: "Juez de Primera Instancia",
    minPuntos: 5000,
    maxPuntos: 6999,
    iconoNombre: "Gavel",
    colorGradient: "from-rose-500 to-red-600",
    badgeStyle: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    descripcion: "Titular de juzgado con solvencia jurídica, imparcialidad y firma decisiva."
  },
  {
    id: "camarista",
    nombre: "Camarista / Juez",
    minPuntos: 7000,
    maxPuntos: 9999,
    iconoNombre: "Landmark",
    colorGradient: "from-purple-500 to-violet-600",
    badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    descripcion: "Integrante de Cámara de Apelaciones revisando fallos y sentando jurisprudencia."
  },
  {
    id: "ministro_scba",
    nombre: "Ministro de la Suprema Corte Provincial",
    minPuntos: 10000,
    maxPuntos: 14999,
    iconoNombre: "Medal",
    colorGradient: "from-violet-500 to-indigo-600",
    badgeStyle: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    descripcion: "Máxima autoridad jurisprudencial a nivel provincial con impacto institucional."
  },
  {
    id: "juez_csjn",
    nombre: "Juez de la Corte Suprema de la Nación",
    minPuntos: 15000,
    maxPuntos: 999999,
    iconoNombre: "Sparkles",
    colorGradient: "from-yellow-400 via-amber-500 to-orange-500",
    badgeStyle: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-black",
    descripcion: "Cúspide de la magistratura constitucional de la República Argentina."
  }
];

export function calcularRango(puntos: number): RangoJuridico {
  for (let i = RANGOS_JURIDICOS.length - 1; i >= 0; i--) {
    if (puntos >= RANGOS_JURIDICOS[i].minPuntos) {
      return RANGOS_JURIDICOS[i];
    }
  }
  return RANGOS_JURIDICOS[0];
}

// =========================================================================
// CATEGORÍAS MATERIAS DEL PLAN DE ESTUDIOS Nº 6 FCJyS (UNLP)
// =========================================================================
export const CATEGORIAS_TRIVIA: CategoriaTrivia[] = [
  {
    id: "todas",
    nombre: "Toda la Carrera",
    descripcion: "Examen integral multi-materia con preguntas de 1º a 5º Año (Plan 6 FCJyS)",
    anio: 0,
    icono: "Sparkles",
    color: "from-amber-500 via-purple-600 to-indigo-600"
  },

  // --- 1ER AÑO ---
  {
    id: "10610",
    nombre: "Introducción al Estudio de las Ciencias Sociales",
    descripcion: "Pensamiento sociopolítico, teoría social, Estado y sociedad",
    anio: 1, icono: "Users", color: "from-teal-600 to-emerald-700"
  },
  {
    id: "10111",
    nombre: "Introducción al Derecho",
    descripcion: "Teoría del derecho, Kelsen, fuentes, validez y normas",
    anio: 1, icono: "BookOpen", color: "from-blue-600 to-indigo-700"
  },
  {
    id: "10112",
    nombre: "Historia Constitucional",
    descripcion: "Pactos preexistentes, 1853, reformas constitucionales y cabildos",
    anio: 1, icono: "Landmark", color: "from-amber-600 to-orange-700"
  },
  {
    id: "10113",
    nombre: "Introducción a la Sociología",
    descripcion: "Estructura social, Durkheim, Weber, Marx y cambio social",
    anio: 1, icono: "Building2", color: "from-cyan-600 to-blue-700"
  },
  {
    id: "10616",
    nombre: "Introducción al Pensamiento Científico",
    descripcion: "Epistemología, método científico, falsacionismo y lógica",
    anio: 1, icono: "BookOpenCheck", color: "from-indigo-600 to-purple-700"
  },
  {
    id: "10121",
    nombre: "Derecho Romano",
    descripcion: "Institutas, sujetos, contratos, dominio y acciones romanas",
    anio: 1, icono: "Scale", color: "from-purple-600 to-indigo-800"
  },
  {
    id: "10114",
    nombre: "Derecho Político",
    descripcion: "Teoría del Estado, soberanía, formas de gobierno y democracia",
    anio: 1, icono: "Landmark", color: "from-blue-700 to-slate-800"
  },

  // --- 2DO AÑO ---
  {
    id: "10122",
    nombre: "Derecho Privado I - Civil",
    descripcion: "Persona humana, capacidad, hechos y actos jurídicos, vicios",
    anio: 2, icono: "FileText", color: "from-blue-500 to-cyan-600"
  },
  {
    id: "10123",
    nombre: "Derecho Privado II - Civil",
    descripcion: "Obligaciones, elementos, mora, cumplimiento y responsabilidad civil",
    anio: 2, icono: "Scale", color: "from-violet-600 to-indigo-700"
  },
  {
    id: "10124",
    nombre: "Derecho Penal I",
    descripcion: "Teoría del delito, conducta, tipicidad, antijuridicidad y culpabilidad",
    anio: 2, icono: "ShieldAlert", color: "from-red-600 to-rose-700"
  },
  {
    id: "10125",
    nombre: "Derecho Constitucional",
    descripcion: "Constitución Nacional, garantías, amparo, división de poderes y DDHH",
    anio: 2, icono: "Landmark", color: "from-amber-500 to-yellow-600"
  },
  {
    id: "10626",
    nombre: "Derechos Humanos",
    descripcion: "CADH, Pacto de San José de Costa Rica, Corte IDH y sistema interamericano",
    anio: 2, icono: "Globe", color: "from-sky-600 to-blue-700"
  },
  {
    id: "10627",
    nombre: "Teoría del Conflicto",
    descripcion: "Mapeo de conflictos, negociación, mediación y resolución no adversaria",
    anio: 2, icono: "Users", color: "from-emerald-600 to-teal-700"
  },

  // --- 3ER AÑO ---
  {
    id: "10132",
    nombre: "Derecho Privado IV - Comercial",
    descripcion: "Derecho del consumidor, títulos valores, pagaré, cheque y bancario",
    anio: 3, icono: "Coins", color: "from-emerald-700 to-green-800"
  },
  {
    id: "10133",
    nombre: "Derecho Privado III - Civil",
    descripcion: "Contratos en general, compraventa, locación, leasing y conexidad",
    anio: 3, icono: "FileText", color: "from-blue-700 to-slate-800"
  },
  {
    id: "10134",
    nombre: "Derecho Procesal I",
    descripcion: "Principios procesales, jurisdicción, competencia, demanda y prueba",
    anio: 3, icono: "Gavel", color: "from-purple-700 to-violet-800"
  },
  {
    id: "10115",
    nombre: "Economía Política",
    descripcion: "Oferta y demanda, macroeconomía, inflación, dinero y comercio exterior",
    anio: 3, icono: "Coins", color: "from-emerald-600 to-green-700"
  },
  {
    id: "10135",
    nombre: "Derecho Penal II",
    descripcion: "Delitos contra las personas, la propiedad, la administración pública y fe pública",
    anio: 3, icono: "Gavel", color: "from-rose-700 to-red-800"
  },
  {
    id: "10136",
    nombre: "Derecho Público, Provincial y Municipal",
    descripcion: "Constitución PBA, autonomías municipales, LOM y coparticipación",
    anio: 3, icono: "Building2", color: "from-purple-600 to-violet-700"
  },
  {
    id: "10138",
    nombre: "Derecho Internacional Público",
    descripcion: "Tratados (Convención de Viena), costumbre internacional, ONU y responsabilidad estatal",
    anio: 3, icono: "Globe", color: "from-sky-600 to-blue-700"
  },

  // --- 4TO AÑO ---
  {
    id: "10141",
    nombre: "Derecho Administrativo I",
    descripcion: "Acto administrativo, elementos, vicios, procedimiento administrativo y fomento",
    anio: 4, icono: "FileText", color: "from-emerald-600 to-teal-700"
  },
  {
    id: "10142",
    nombre: "Derecho Privado VI - Comercial",
    descripcion: "Sociedades comerciales (LGS), SRL, SA, asambleas y responsabilidad de directores",
    anio: 4, icono: "Building2", color: "from-blue-800 to-slate-900"
  },
  {
    id: "10143",
    nombre: "Derecho Privado V - Civil",
    descripcion: "Derechos reales, dominio, condominio, propiedad horizontal y usufructo",
    anio: 4, icono: "Building2", color: "from-indigo-700 to-purple-800"
  },
  {
    id: "10144",
    nombre: "Derecho Procesal II",
    descripcion: "Recursos procesales, cautelares, ejecución de sentencia y procesos especiales",
    anio: 4, icono: "Gavel", color: "from-purple-700 to-violet-800"
  },
  {
    id: "10640",
    nombre: "Derecho Social del Trabajo",
    descripcion: "LCT 20.744, contrato de trabajo, despido arbitrario, indemnizaciones y jornada",
    anio: 4, icono: "Briefcase", color: "from-amber-600 to-yellow-700"
  },
  {
    id: "10649",
    nombre: "Mediación y Medios de Resolución de Conflictos",
    descripcion: "Ley de Mediación 13.951 PBA, conciliación, arbitraje y confidencialidad",
    anio: 4, icono: "Users", color: "from-teal-600 to-cyan-700"
  },
  {
    id: "10146",
    nombre: "Derecho Agrario",
    descripcion: "Arrendamientos rurales, aparcerías, empresa agraria y propiedad del ganado",
    anio: 4, icono: "Leaf", color: "from-green-600 to-emerald-800"
  },
  {
    id: "10147",
    nombre: "Filosofía del Derecho",
    descripcion: "Iusnaturalismo, positivismo, realismo, Alexy, Dworkin y justicia",
    anio: 4, icono: "BookOpenCheck", color: "from-indigo-600 to-purple-700"
  },

  // --- 5TO AÑO ---
  {
    id: "10151",
    nombre: "Derecho Administrativo II",
    descripcion: "Contratos administrativos, licitación pública, servicios públicos y responsabilidad estatal",
    anio: 5, icono: "Building2", color: "from-teal-600 to-cyan-700"
  },
  {
    id: "10653",
    nombre: "Derecho de Familia",
    descripcion: "Matrimonio, divorcio, uniones convivenciales, filiación y responsabilidad parental",
    anio: 5, icono: "Users", color: "from-rose-600 to-red-700"
  },
  {
    id: "10152",
    nombre: "Derecho de la Navegación",
    descripcion: "Ley de Navegación 20.094, buque, capitán, abordaje, asistencia y salvamento",
    anio: 5, icono: "Globe", color: "from-blue-600 to-sky-700"
  },
  {
    id: "10650",
    nombre: "Derecho Colectivo del Trabajo y Seg. Social",
    descripcion: "Sindicatos, convenios colectivos, huelga, ART y sistema previsional",
    anio: 5, icono: "Briefcase", color: "from-orange-600 to-amber-700"
  },
  {
    id: "10154",
    nombre: "Derecho de Minería y Energía",
    descripcion: "Código de Minería, concesión minera, hidrocarburos (Ley 17.319) y regalías",
    anio: 5, icono: "Zap", color: "from-amber-600 to-yellow-600"
  },
  {
    id: "10155",
    nombre: "Sociología Jurídica",
    descripcion: "Eficacia de las leyes, acceso a la justicia, profesión jurídica y control social",
    anio: 5, icono: "Building2", color: "from-cyan-600 to-blue-700"
  },
  {
    id: "10156",
    nombre: "Derecho Internacional Privado",
    descripcion: "Jurisdicción internacional, conflicto de leyes, reenvío y orden público internacional",
    anio: 5, icono: "Globe", color: "from-blue-600 to-indigo-800"
  },
  {
    id: "10659",
    nombre: "Derecho de las Sucesiones",
    descripcion: "Herederos legítimos, porción legítima, testamento, colación y partición",
    anio: 5, icono: "Users", color: "from-rose-600 to-red-700"
  },
  {
    id: "10157",
    nombre: "Derecho Notarial y Registral",
    descripcion: "Escribano público, escritura pública, fe pública y Registro de la Propiedad (Ley 17.801)",
    anio: 5, icono: "FileText", color: "from-purple-700 to-slate-800"
  },
  {
    id: "10158",
    nombre: "Finanzas y Derecho Financiero",
    descripcion: "Presupuesto de la Nación, crédito público, AFIP, ARBA y procedimiento tributario",
    anio: 5, icono: "Coins", color: "from-emerald-700 to-green-800"
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

// =========================================================================
// BANCO DE PREGUNTAS TÉCNICAS (CON VARIACIÓN DEL ÍNDICE DE RESPUESTA CORRECTA 0, 1, 2, 3)
// =========================================================================
const STATIC_QUESTIONS: TriviaQuestion[] = [
  // --- 10610: INTRODUCCIÓN AL ESTUDIO DE LAS CIENCIAS SOCIALES (100 PREGUNTAS OFICIALES DND) ---,
  {
    id: "10610-01", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Quién es considerado el fundador de la Universidad Nacional de La Plata en su etapa de nacionalización en 1905?",
    opciones: ["Joaquín V. González", "Rafael Hernández", "Máximo Paz", "Dardo Rocha"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Joaquín V. González impulsó la nacionalización de la UNLP en 1905 y fue su primer presidente.", puntos_base: 10
  },
  {
    id: "10610-02", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿En qué año se creó originariamente la Universidad Provincial de La Plata por ley promovida por Rafael Hernández?",
    opciones: ["1918", "1949", "1889", "1905"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Fue creada por ley provincial el 27 de diciembre de 1889 e inaugurada en 1897 con Dardo Rocha como rector.", puntos_base: 10
  },
  {
    id: "10610-03", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según el artículo 20 de la Ley de Educación Superior N° 24.521 y el Estatuto de la UNLP, el ingreso a las carreras de grado universitarias es:",
    opciones: ["Exclusivo para graduados de colegios universitarios", "Mediante examen eliminatorio con cupo estricto", "Libre e irrestricto para quienes hayan finalizado la educación secundaria", "Arancelado para estudiantes que provengan de colegios privados"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La Ley de Educación Superior (art. 7) y el Estatuto de la UNLP (art. 20) consagran el ingreso libre e irrestricto.", puntos_base: 10
  },
  {
    id: "10610-04", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "De acuerdo con la clasificación de Mario Bunge presentada por Nieves Cenicacelaya, ¿cómo se dividen las ciencias?",
    opciones: ["En ciencias naturales y ciencias exactas", "En ciencias formales (o ideales) y ciencias fácticas (o materiales)", "En ciencias normativas y ciencias empíricas", "En ciencias sociales y ciencias filosóficas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Bunge distingue entre ciencias formales (demuestran mediante lógica) y fácticas (verifican mediante observación/experimento).", puntos_base: 10
  },
  {
    id: "10610-05", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según Ibarra y Szychowski, ¿cuál es la diferencia principal entre una 'técnica' de estudio y una 'estrategia'?",
    opciones: ["La técnica es un procedimiento automatizado, mientras que la estrategia implica decisiones conscientes y reflexivas según el contexto", "La técnica se aplica en exámenes orales y la estrategia en escritos", "No existe diferencia, ambos términos son sinónimos absolutos", "La técnica requiere profesor y la estrategia es siempre individual"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Las técnicas son instrumentos fijados; las estrategias implican control reflexivo dentro de un plan guiado por las condiciones de aprendizaje.", puntos_base: 10
  },
  {
    id: "10610-06", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Cuáles son los cuatro estamentos que integran el cogobierno de la UNLP según su Estatuto (art. 1)?",
    opciones: ["Rectores, Consejeros, Estudiantes y Autoridades", "Docentes, Investigadores, Extensionistas y Nodocentes", "Docentes, Estudiantes, Graduados y No Docentes", "Decanos, Profesores, Ayudantes y Alumnos"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El cogobierno reformista de la UNLP está compuesto democráticamente por docentes, estudiantes, graduados y no docentes.", puntos_base: 10
  },
  {
    id: "10610-07", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué tipo de investigación busca dar una visión general y aproximada de un objeto poco estudiado?",
    opciones: ["Predictiva", "Explicativa", "Descriptiva", "Exploratoria"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Las investigaciones exploratorias abren camino cuando no hay antecedentes suficientes o el fenómeno es nuevo.", puntos_base: 10
  },
  {
    id: "10610-08", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "En la clasificación de Jean Piaget expuesta por Marucci, Paris y Ramírez, las 'Ciencias Nomotéticas' se caracterizan por:",
    opciones: ["Prescribir obligaciones y atribuciones jurídicas", "Intentar establecer leyes generales mediante la experimentación o análisis de pocas variables", "Reconstruir hechos históricos del pasado de forma singular", "Alcanzar la coordinación general de los valores humanos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Las ciencias nomotéticas (sociología, economía, lingüística, etc.) buscan elaborar leyes y relaciones generales.", puntos_base: 10
  },
  {
    id: "10610-09", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según Carlos Pettoruti, cuando decimos 'Tengo derecho a expresar mis ideas', ¿en qué sentido usamos la palabra derecho?",
    opciones: ["Como derecho objetivo o sistema de normas", "Como derecho subjetivo o facultad personal", "Como valor de justicia social", "Como ciencia del derecho"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Refiere a la facultad o potestad que posee una persona frente a los demás o ante el Estado.", puntos_base: 10
  },
  {
    id: "10610-10", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Cuál es el instrumento supremo de organización jurídica y política de la República Argentina?",
    opciones: ["La Ley Orgánica de Ministerios", "El Estatuto Universitario", "El Código Civil y Comercial", "La Constitución Nacional"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "La Constitución Nacional es la norma fundamental del sistema jurídico según el principio de supremacía federal (art. 31).", puntos_base: 10
  },
  {
    id: "10610-11", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿En qué ciudad argentina se inició el histórico movimiento de la Reforma Universitaria de 1918?",
    opciones: ["Rosario", "La Plata", "Buenos Aires", "Córdoba"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Se inició en la Universidad Nacional de Córdoba con la huelga estudiantil y el Manifiesto Liminar de junio de 1918.", puntos_base: 10
  },
  {
    id: "10610-12", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según el Plan de Estudios 6 de la carrera de Abogacía (UNLP), ¿cuántos bloques formativos componen la carrera?",
    opciones: ["2 bloques (Teórico y Práctico)", "3 bloques (Básico, Intermedio y Superior)", "4 bloques (General/Introductoria, Disciplinar, Orientación Profesional y Práctica Profesional)", "5 bloques de asignaturas anuales"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Se organiza en 4 bloques integrados para evitar la fragmentación curricular.", puntos_base: 10
  },
  {
    id: "10610-13", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué modalidad de enseñanza en la FCJyS supone rendir un examen final oral sobre la totalidad del programa ante mesa examinadora?",
    opciones: ["Régimen Libre", "Preevaluativo obligatorio", "Taller de lectura", "Régimen de Promoción"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La modalidad libre implica estudiar de manera autónoma y rendir la totalidad del programa en las mesas de examen.", puntos_base: 10
  },
  {
    id: "10610-14", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según el Decreto 29.337 dictado en 1949 bajo la presidencia de Juan Domingo Perón, la enseñanza universitaria de grado en Argentina es:",
    opciones: ["Arancelada solo para estudiantes extranjeros", "Financiada exclusivamente por las provincias", "Arancelada con sistema de crédito", "Gratuita mediante la suspensión del cobro de aranceles"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "El decreto de 1949 estableció la gratuidad universitaria al eliminar los aranceles de enseñanza de grado.", puntos_base: 10
  },
  {
    id: "10610-15", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Cuáles son los tres pilares o funciones sustantivas fundamentales de la Universidad pública argentina?",
    opciones: ["Administración, Gobierno y Matrícula", "Enseñar, Evaluar y Sancionar", "Docencia, Investigación y Extensión", "Cursar, Rendir y Graduarse"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Docencia, Investigación y Extensión conforman el triángulo indisoluble del quehacer universitario.", puntos_base: 10
  },
  {
    id: "10610-16", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "En la clasificación de secuencias textuales (Viñas / Ibarra y Szychowski), las sentencias o fallos judiciales destacan por el predominio de la secuencia:",
    opciones: ["Expositivo-explicativa", "Narrativa pura", "Argumentativa", "Dialogal"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Los fallos judiciales buscan fundamentar una decisión persuadiendo y conmoviendo con argumentos técnicos.", puntos_base: 10
  },
  {
    id: "10610-17", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué órgano es la máxima autoridad de gobierno dentro de cada Facultad de la UNLP según su Estatuto?",
    opciones: ["El Centro de Estudiantes", "El Consejo Directivo", "La Secretaría Académica", "El Decano"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El Consejo Directivo (compuesto por 16 miembros de los 4 estamentos) es el órgano máximo de gobierno de cada Facultad.", puntos_base: 10
  },
  {
    id: "10610-18", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Cuál es el objeto de estudio propio de las Ciencias Sociales?",
    opciones: ["Las estructuras formales lógicas", "Los componentes físicos del universo", "El mundo vegetal y animal", "El hombre y sus producciones en sociedad"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Estudian al ser humano, sus relaciones colectivas, producciones culturales e instituciones.", puntos_base: 10
  },
  {
    id: "10610-19", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué organismo nacional descentralizado se encarga de la acreditación periódica de la carrera de Abogacía en Argentina (art. 43 LES)?",
    opciones: ["Colegio de Abogados", "CIN (Consejo Interuniversitario Nacional)", "CONEAU (Comisión Nacional de Evaluación y Acreditación Universitaria)", "CONICET"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La CONEAU evalúa y acredita periódicamente las carreras reguladas por el Estado cuyos títulos comprometen el interés público.", puntos_base: 10
  },
  {
    id: "10610-20", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "En la teoría pura del Derecho de Hans Kelsen, el mundo del Derecho se ubica en el ámbito del:",
    opciones: ["Mundo del Ser (causalidad)", "Mundo del Deber Ser (imputación)", "Mundo de la metafísica teológica", "Mundo de la psicología individual"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Para Kelsen, la norma jurídica vincula un hecho antecedente con una consecuencia mediante el principio de imputación del Deber Ser.", puntos_base: 10
  },
  {
    id: "10610-21", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué autores históricos son considerados los padres fundadores simultáneos de la Ciencia Social según Marucci, Paris y Ramírez?",
    opciones: ["Auguste Comte y Karl Marx", "Hans Kelsen y Max Weber", "René Descartes e Immanuel Kant", "Platón y Aristóteles"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Nació en la obra de Comte (positivismo) y de Marx (crítico-dialéctica) en el siglo XIX.", puntos_base: 10
  },
  {
    id: "10610-22", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Verdadero o Falso: Según la Ley Provincial 5.177, para ejercer la profesión liberal de abogado en la Provincia de Buenos Aires se requiere únicamente poseer el título universitario.",
    opciones: ["Solo si se trabaja en el Estado", "Solo para jueces", "Verdadero", "Falso"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Falso. Se requiere poseer el título universitario expedido por universidad reconocida Y la matriculación obligatoria en el Colegio de Abogados departamental.", puntos_base: 10
  },
  {
    id: "10610-23", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "En la estructura de un texto académico descrita por Rossana Viñas, las 'palabras clave' cumplen la función de:",
    opciones: ["Listar los capítulos del libro", "Reemplazar la bibliografía consultada", "Sintetizar los conceptos centrales e incrementar la visibilidad en buscadores académicos", "Exponer la dedicatoria del autor"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Son de 3 a 5 términos que permiten ubicar e indexar el trabajo en repositorios y bases de datos.", puntos_base: 10
  },
  {
    id: "10610-24", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué función del lenguaje busca influir directamente en la conducta del destinatario mediante órdenes o prescripciones?",
    opciones: ["Descriptiva o informativa", "Expresiva", "Prescriptiva o directiva", "Operativa o realizativa"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Las normas jurídicas emplean predominantemente el lenguaje prescriptivo o directivo (imponen mandatos o prohibiciones).", puntos_base: 10
  },
  {
    id: "10610-25", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según Carlos Pettoruti, en el 'metalenguaje':",
    opciones: ["Hay palabras que hablan acerca de otras palabras o textos", "No se utilizan símbolos ni signos", "Se expresa el lenguaje poético exclusivamente", "Se habla directamente sobre objetos del mundo físico"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El lenguaje objeto habla de cosas; el metalenguaje habla sobre el lenguaje mismo (por ejemplo, cuando la doctrina comenta la ley).", puntos_base: 10
  },
  {
    id: "10610-26", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué elemento distingue al Estado de otras formas de organización política pre-estatales?",
    opciones: ["La ausencia de leyes escritas", "El gobierno de un solo líder religioso", "La usanza de costumbres nómadas", "El monopolio de la fuerza legítima sobre un territorio delimitado"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Según Max Weber y la teoría política, el Estado moderno detenta el monopolio de la coacción física legítima en un territorio.", puntos_base: 10
  },
  {
    id: "10610-27", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Cuál es la forma de gobierno adoptada por la República Argentina según el artículo 1° de la Constitución Nacional?",
    opciones: ["Corporativa y confederada", "Monárquica, parlamentaria y unitaria", "Representativa, republicana y federal", "Directa, socialista y centralizada"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El artículo 1° declara expresamente que la Nación adopta la forma representativa, republicana y federal.", puntos_base: 10
  },
  {
    id: "10610-28", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según Boaventura de Sousa Santos en 'La Sociología de las Ausencias', la razón metonímica se caracteriza por:",
    opciones: ["Ampliar el presente valorando todos los conocimientos", "Tomar la parte por el todo y contraer el presente produciendo ausencias de saberes no hegemónicos", "Unir la ciencia con las tradiciones populares sin jerarquías", "Analizar el futuro mediante indicadores estadísticos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "La razón metonímica reduce la totalidad a una parte homogénea, produciendo como 'no existentes' o invisibles otros conocimientos.", puntos_base: 10
  },
  {
    id: "10610-29", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "En las fases de la lectura propuestas por Ibarra y Szychowski, la 'pre-lectura' consiste en:",
    opciones: ["Una lectura global que capta la estructura, índice, introducción y subtítulos para formular hipótesis", "El subrayado detallado párrafo por párrafo", "La redacción de la monografía final", "Memorizar el texto completo"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Permite anticipar el contenido, identificar los ejes principales y evaluar la pertinencia del texto.", puntos_base: 10
  },
  {
    id: "10610-30", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "En el famoso Decálogo de Eduardo J. Couture, el primer mandamiento hacia el profesional de la abogacía es:",
    opciones: ["'Gana todos los juicios'", "'Memoriza las leyes'", "'Cobra altos honorarios'", "'Estudia. El derecho se transforma constantemente. Si no sigues sus pasos, serás cada día un poco menos abogado'"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Enfatiza el estudio continuo frente a la constante mutación de la realidad normativa y social.", puntos_base: 10
  },
  {
    id: "10610-31", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué tipo de conocimiento se caracteriza por ser acrílico, dogmático, asistemático y adquirido por la experiencia cotidiana?",
    opciones: ["Conocimiento epistemológico", "Conocimiento científico", "Conocimiento vulgar u ordinario", "Conocimiento filosófico"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El conocimiento vulgar se basa en vivencias e impresiones sensoriales sin método ni sistematización formal.", puntos_base: 10
  },
  {
    id: "10610-32", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según Marucci, Paris y Ramírez, el iusnaturalismo racionalista sitúa el fundamento del Derecho Natural en:",
    opciones: ["La voluntad divina revelada en las escrituras", "La naturaleza de la razón humana universal", "Las decisiones de los jueces", "Las leyes escritas del Congreso"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "A diferencia del iusnaturalismo teológico medieval, el racionalista ubica el fundamento en la razón del ser humano.", puntos_base: 10
  },
  {
    id: "10610-33", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según el artículo 15 del Estatuto de la UNLP, la investigación en la universidad debe abarcar:",
    opciones: ["La investigación básica, humanística, artística y aplicada", "Exclusivamente la investigación jurídica dogmática", "Únicamente proyectos financiados por el extranjero", "Únicamente la investigación aplicada para empresas"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Reconoce como función primordial el fomento de todas las formas generadoras de conocimiento.", puntos_base: 10
  },
  {
    id: "10610-34", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué diferencia básica existe entre los métodos cuantitativos y cualitativos según Cenicacelaya?",
    opciones: ["Los cuantitativos no sirven para las ciencias sociales", "Son métodos opuestos e incompatibles que jamás pueden combinarse", "Los cuantitativos usan letras y los cualitativos ecuaciones numéricas", "Los cuantitativos producen datos numéricos/estadísticos de universos extensos, mientras los cualitativos producen información alfabética/descriptiva profunda de pocos casos"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Uno privilegia la extensión y representatividad estadística; el otro la profundidad conceptual y descripción densa.", puntos_base: 10
  },
  {
    id: "10610-35", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué autor concibió la Universidad de La Plata en 1905 con un modelo novedoso 'científico-experimental' diferenciado del profesionalismo tradicional?",
    opciones: ["Juan B. Justo", "Dardo Rocha", "Joaquín V. González", "Alejandro Korn"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "González buscó superar la dicotomía tradicional creando institutos y laboratorios de investigación integrados a la docencia.", puntos_base: 10
  },
  {
    id: "10610-36", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la teoría de las normas de Herbert Hart expuesta por Pettoruti, las 'reglas de adjudicación' son aquellas que:",
    opciones: ["Imponen sanciones y deberes de abstención", "Permiten identificar cuáles normas pertenecen válidamente al sistema", "Atribuyen competencia a determinados órganos (como los jueces) para decidir cuándo se ha violado una regla y aplicar sanciones", "Regulan el procedimiento para derogar o modificar leyes"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Pertenecen a las reglas secundarias que facultan a los jueces a dirimir conflictos y aplicar sanciones.", puntos_base: 25
  },
  {
    id: "10610-37", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el texto 'La alfabetización jurídica', Cristian Furfaro distingue entre extensión unidireccional y bidireccional. ¿Qué caracteriza a la concepción bidireccional o de comunicación?",
    opciones: ["Que se considera a la comunidad no universitaria como sujeto activo en la construcción colectiva y horizontal del saber", "Que la universidad cobra servicios a empresas privadas", "Que solo intervienen docentes sin alumnos", "Que la universidad transmite de forma paternalista conocimientos a receptores pasivos"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Basado en Paulo Freire y Brusilovsky (democratización epistemológica), promueve un diálogo en igualdad de condiciones entre el saber académico y el popular.", puntos_base: 25
  },
  {
    id: "10610-38", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué corriente iusfilosófica sostiene que el objeto del Derecho comprende la interacción armónica de tres dimensiones: hechos, valores y normas?",
    opciones: ["Trialismo o Tridimensionalismo Jurídico", "Realismo jurídico norteamericano", "Positivismo normativista", "Iusnaturalismo teológico"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El trialismo (desarrollado por Reale y Goldschmidt) integra la dimensión fáctica, axiológica y normológica.", puntos_base: 25
  },
  {
    id: "10610-39", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el artículo 'Enseñar metodología de la investigación socio-jurídica', Salanueva y González señalan que el Decreto N° 2427/93 creó:",
    opciones: ["El Colegio de Abogados de La Plata", "El nuevo Plan de Estudios de Abogacía", "El Programa de Incentivos a los Docentes Investigadores", "La gratuidad de los estudios de posgrado"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Incentivó la investigación institucionalizada en las universidades nacionales mediante la categorización docente.", puntos_base: 25
  },
  {
    id: "10610-40", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué es la 'anomia' en la teoría sociológica de Émile Durkheim abordada por Sebastián Piana?",
    opciones: ["Un estado de perfecta cohesión y solidaridad mecánica", "La ausencia o falta de eficacia de normas morales y jurídicas para regular las relaciones sociales en momentos de rápida transformación", "El cumplimiento estricto del derecho positivo", "El monopolio de la fuerza estatal"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ocurre cuando la división del trabajo se desarrolla sin una reglamentación moral suficiente que encauce las conductas.", puntos_base: 25
  },
  {
    id: "10610-41", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según Boaventura de Sousa Santos, ¿cuáles son los dos procedimientos sociológicos insurgentes para combatir la razón indolente?",
    opciones: ["La Sociología de las Ausencias y la Sociología de las Emergencias", "El positivismo lógico y el empirismo", "El derecho dogmático y el análisis cuantitativo", "La estadística descriptiva y la inducción"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Las Ausencias expanden el presente tornando visibles los saberes silenciados; las Emergencias expanden el futuro valorando las señales del 'todavía no'.", puntos_base: 25
  },
  {
    id: "10610-42", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según Carlos Pettoruti, en la Teoría Egológica de Carlos Cossio, el objeto de estudio de la ciencia del derecho es:",
    opciones: ["El mandato del soberano respaldado por amenazas", "La justicia divina", "La norma jurídica escrita en el código", "La conducta humana en interferencia intersubjetiva realizada en libertad"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Cossio sostiene que la norma no es el objeto, sino el concepto con que se piensa la conducta humana en libertad.", puntos_base: 25
  },
  {
    id: "10610-43", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué distingue a la 'definición persuasiva' de otros tipos de definición según Pettoruti?",
    opciones: ["Fija el uso del término en un sistema cerrado", "Informa objetivamente el significado de un diccionario", "Busca influir emocionalmente en la actitud o valoración del receptor hacia el objeto definido", "Señala directamente al objeto mediante gestos ostensivos"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Su propósito principal es conmover o predisponer favorable/desfavorablemente a la audiencia (ej. 'El libro es un instrumento de la cultura').", puntos_base: 25
  },
  {
    id: "10610-44", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el texto de Alejandro Ciriza sobre Jean-Jacques Rousseau, ¿cuál es la crítica central planteada desde la teoría feminista (Carole Pateman) al Contrato Social?",
    opciones: ["Que Rousseau defendía la monarquía absoluta", "Que el contrato político se edifica sobre un 'contrato sexual' previo que recluye a las mujeres en el ámbito doméstico y las excluye de la ciudadanía", "Que no incluía la libertad de prensa", "Que eliminaba la propiedad privada"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Pateman demuestra que la fraternidad del pacto de varones libres presupone la subordinación previa de las mujeres en el hogar.", puntos_base: 25
  },
  {
    id: "10610-45", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué caracteriza al Estado Liberal burgués surgido tras las revoluciones de los siglos XVII y XVIII según Marucci?",
    opciones: ["El principio de abstención estatal (Estado gendarme), la división de poderes y la garantía de libertades individuales y propiedad privada", "La concentración del poder absoluto en el monarca", "La supresión de la Constitución escrita", "Su intervención directa en la economía de mercado y la propiedad colectiva"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Buscó limitar el poder estatal mediante la ley, absteniéndose de intervenir en el libre juego económico.", puntos_base: 25
  },
  {
    id: "10610-46", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el marco del transhumanismo analizado por Alejandro Batista en 'Breves comentarios entorno al transhumanismo', la corriente busca:",
    opciones: ["Eliminar el uso de computadoras en la universidad", "Regresar a las ciencias antiguas medievales", "Prohibir el uso de tecnología en la medicina", "Emplear la tecnología y biotecnología para modificar y mejorar las capacidades físicas, cognitivas y sensoriales humanas más allá de los límites biológicos"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Propone la mejora radical de la especie humana (posthumanismo/transhumanismo), desafiando categorías éticas y jurídicas tradicionales.", puntos_base: 25
  },
  {
    id: "10610-47", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿En qué consiste el 'principio de imputación' propuesto por Hans Kelsen para las ciencias normativas?",
    opciones: ["En la aplicación de la moral religiosa a las leyes", "En una relación de causa-efecto que se produce indefectiblemente en la naturaleza", "En un nexo lógico-normativo establecido por el legislador donde a una conducta ilícita le debe ser imputada una sanción", "En la verificación empírica de datos estadísticos"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "A diferencia de la causalidad natural (si es A, es B), en la imputación jurídica 'si es A, debe ser B' por mandato de la norma.", puntos_base: 25
  },
  {
    id: "10610-48", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la investigación de Alejandro Batista ('Derecho 2.0'), ¿cuál fue una de las principales conclusiones sobre la incorporación de las TIC en la FCJyS?",
    opciones: ["Que las TIC han reemplazado totalmente las clases presenciales", "Que las TIC se usan principalmente para comunicación y distribución de material, pero existe una vacancia en la inclusión sustantiva de problemáticas digitales en los contenidos curriculares", "Que los estudiantes rechazan el uso del correo electrónico", "Que el Código Civil contempla todas las problemáticas de Internet"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Se aprecia un uso instrumental creciente pero escasa actualización de los contenidos del derecho positivo frente a los desafíos del mundo digital.", puntos_base: 25
  },
  {
    id: "10610-49", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según Cenicacelaya, el método científico como 'modo de validación' se refiere a:",
    opciones: ["El conjunto de procedimientos dirigidos a probar, avalar y justificar el conocimiento alcanzado", "La redacción del informe de investigación", "La selección del tema por parte del investigador", "Las acciones destinadas al descubrimiento espontáneo de nuevas ideas"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El modo de validación busca aportar las pruebas y demostraciones que respaldan las hipótesis enunciadas.", puntos_base: 25
  },
  {
    id: "10610-50", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el texto de Enrique Dussel ('La modernidad como emancipación'), ¿qué filósofo renacentista justificó la conquista española en el Debate de Valladolid (1550) argumentando la 'inferioridad o torpeza' de los indígenas?",
    opciones: ["Thomas Hobbes", "Jean-Jacques Rousseau", "Bartolomé de Las Casas", "Juan Ginés de Sepúlveda"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Ginés de Sepúlveda utilizó el argumento de la 'barbarie/inferioridad' para legitimar la guerra justa y el dominio colonial.", puntos_base: 25
  },
  {
    id: "10610-51", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué distingue a la 'definición ostensiva' descrita por Pettoruti?",
    opciones: ["Formular una ley teórica abstracta", "Definir un término mediante un texto de diccionario", "Expresar el significado mediante gestos indicativos o mostrando directamente el objeto", "Utilizar un lenguaje simbólico matemático"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Define señalando directamente el objeto (ej. apuntar con el índice a un portafolios), requiriendo la presencia del objeto o su imagen.", puntos_base: 25
  },
  {
    id: "10610-52", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según el Estatuto de la UNLP (art. 25), ¿por cuántos años son designados los profesores ordinarios en sus cargos tras ganar un concurso público?",
    opciones: ["2 años", "4 años", "8 años (con posibilidad de renovación por evaluación)", "De por vida sin evaluación"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Se establece la periodicidad de cátedra con mandatos de 8 años sujetos a evaluación de desempeño.", puntos_base: 25
  },
  {
    id: "10610-53", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Cuál es la función del 'Poder Ejecutivo' en la división de poderes según Marucci, Morón y Catalano?",
    opciones: ["Ejecutar las leyes y llevar adelante la administración general del país", "Resolver conflictos aplicando las normas a casos concretos", "Controlar la constitucionalidad de los actos gubernamentales", "Dictar las leyes generales de la Nación"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El Presidente ejercita la administración general e instrucción de la ejecución de las leyes dictadas por el Congreso.", puntos_base: 25
  },
  {
    id: "10610-54", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el trabajo de Juan Paulo Gardinetti sobre Mariano Moreno, las ideas publicadas en 'La Gazeta de Buenos Aires' (1810) defendían:",
    opciones: ["La anexión del Río de la Plata a Gran Bretaña", "La supresión de las juntas provinciales", "El mantenimiento del absolutismo fernandino", "La necesidad de convocar a un Congreso Constituyente para dictar una Constitución y fijar la división de poderes"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Moreno abogó enfáticamente por la soberanía popular, el congreso representativo y el establecimiento de una norma constitucional como freno al poder.", puntos_base: 25
  },
  {
    id: "10610-55", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el enfoque sociológico de las Ciencias Jurídicas, la investigación 'cualitativa' prioriza:",
    opciones: ["El análisis cuantitativo de votos en la cámara", "La medición de la validez formal del sistema normativo mediante estadísticas", "El estudio del derecho como fenómeno social, observando la eficacia y el funcionamiento de las normas en su contexto real", "La deducción lógica estricta a partir de un axioma"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Privilegia el contexto, los significados e interpretación del fenómeno jurídico en la realidad social.", puntos_base: 25
  },
  {
    id: "10610-56", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según la Ley de Educación Superior N° 24.521 (art. 29), la 'autonomía académica e institucional' de las universidades comprende:",
    opciones: ["La facultad de dictar sus estatutos, crear carreras, formular planes de estudio y elegir sus autoridades", "La posibilidad de cobrar aranceles a todas las carreras de grado", "La exención total del control presupuestario estatal", "La facultad de juzgar delitos penales comunes"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Garantiza que la universidad autorregule sus planes pedagógicos, estatutos internos y gobierno sin injerencia del Poder Ejecutivo.", puntos_base: 25
  },
  {
    id: "10610-57", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué ocurrió institucionalmente en Argentina en la Reforma Constitucional de 1994 según Marucci y Morón?",
    opciones: ["Se incorporaron los tratados internacionales de derechos humanos con jerarquía constitucional y la figura del Jefe de Gabinete", "Se eliminó el federalismo", "Se prohibió el sufragio femenino", "Se derogó la forma republicana de gobierno"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Reorganizó las atribuciones del Estado, otorgó rango constitucional a pactos de DDHH (art. 75 inc. 22) y creó nuevos órganos.", puntos_base: 25
  },
  {
    id: "10610-58", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según Durkheim en 'La división del trabajo social' (analizado por Piana), la 'solidaridad orgánica' es propia de:",
    opciones: ["Comunidades religiosas feudales", "Estados autoritarios sin leyes escritas", "Sociedades primitivas con escasa división del trabajo y fuerte conciencia colectiva homogénea", "Sociedades modernas industrializadas con alta división del trabajo e interdependencia entre funciones especializadas"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Se basa en la diferenciación e interdependencia de los individuos especializados, unidos por el derecho restitutivo.", puntos_base: 25
  },
  {
    id: "10610-59", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la teoría de las interpretaciones del lenguaje de Pettoruti, las palabras 'vagas' son aquellas que:",
    opciones: ["No existen en el idioma español", "Poseen más de un significado completamente distinto en el diccionario", "Presentan imprecisión o falta de límites claros en su campo de referencia o aplicación empírica", "Se expresan exclusivamente mediante números"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La vaguedad afecta la extensionalidad del concepto (ej. determinar con precisión el límite exacto de 'joven' o 'noche').", puntos_base: 25
  },
  {
    id: "10610-60", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según Fernando Tauber en 'Hacia el segundo manifiesto', ¿cuál fue la principal falencia del modelo universitario 'napoleónico' adoptado en Latinoamérica en el siglo XIX?",
    opciones: ["Fomentar excesivamente la investigación científica pura", "Su marcado sesgo profesionalista y elitista, estructurado en escuelas autárquicas dedicadas a formar profesionales y funcionarios sin integrar la ciencia ni la investigación", "Permitir el cogobierno estudiantil", "Ser gratuito para las clases populares"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El modelo napoleónico fragmentó la universidad en facultades profesionales (abogacía, medicina) postergando el desarrollo científico e inclusivo.", puntos_base: 25
  },
  {
    id: "10610-61", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué es la 'jurisprudencia' como fuente del Derecho?",
    opciones: ["El conjunto de sentencias y decisiones concordantes dictadas por los tribunales de justicia", "La opinión de los profesores de derecho en sus manuales", "Las costumbres populares no escritas", "El texto escrito de las leyes sancionadas por el Congreso"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constituye el criterio de interpretación de las normas aplicado de manera reiterada por los jueces.", puntos_base: 25
  },
  {
    id: "10610-62", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En el texto de Leticia Vita ('Teoría del Estado y enfoque de género'), se señala que la teoría política clásica padece de androcentrismo porque:",
    opciones: ["Incluye únicamente abogadas en sus programas", "No utiliza textos escritos", "Recluye a los varones en la vida doméstica", "Ha sido formulada históricamente por varones que construyeron lo 'público' y lo 'político' como un espacio masculino, invisibilizando las relaciones de poder de género"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Evidencia cómo el canon clásico omitió a las mujeres y naturalizó la subordinación del ámbito privado.", puntos_base: 25
  },
  {
    id: "10610-63", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En las relaciones de federalismo señaladas por Catalano y Atela, la 'subordinación' se manifiesta en:",
    opciones: ["La fijación del presupuesto municipal", "Los tratados que firman las provincias entre sí", "La supremacía de la Constitución Nacional y el derecho federal sobre los ordenamientos jurídicos provinciales (art. 31 CN)", "La elección directa de gobernadores sin intervención del Congreso"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Exige que las constituciones y leyes provinciales se adecuen y no contradigan la Constitución Nacional.", puntos_base: 25
  },
  {
    id: "10610-64", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según el artículo 1° del Estatuto de la UNLP, ¿qué prohibición expresa se establece respecto a la pertenencia a la vida institucional de la universidad?",
    opciones: ["No pueden ingresar estudiantes de otras provincias", "No se permite la pertenencia de ninguna persona involucrada en violaciones a los derechos humanos y/o terrorismo de Estado", "Se prohíbe la participación de no docentes en el gobierno", "Se prohíbe el dictado de asignaturas no jurídicas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Principio ético-democrático innegociable de la UNLP en defensa de los Derechos Humanos.", puntos_base: 25
  },
  {
    id: "10610-65", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Qué diferencia existe entre un 'código' y una 'ley' simple?",
    opciones: ["El código es un cuerpo ordenado y sistemático de normas que regula de manera integral una rama especializada del derecho", "La ley simple no es de cumplimiento obligatorio", "No existe ninguna diferencia", "El código es dictado por el Presidente y la ley por las provincias"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Los códigos (Civil y Comercial, Penal, etc.) congregan de forma orgánica el régimen de una materia específica.", puntos_base: 25
  },
  {
    id: "10610-66", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la investigación de Maraniello sobre 'La crisis del federalismo', el autor cuestiona que la Corte Suprema Nacional:",
    opciones: ["Aplica únicamente el derecho provincial", "No revisa las sentencias de primera instancia", "Otorga demasiada autonomía a las provincias", "Ha asumido un rol de tribunal de casación centralizado, desvirtuando en la práctica el federalismo judicial"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Señala la tendencia hacia un centralismo judicial que limita el verdadero alcance del federalismo de los estados locales.", puntos_base: 25
  },
  {
    id: "10610-67", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la teoría política de John Locke analizada por Marucci, la salida del estado de naturaleza mediante el contrato social busca principalmente:",
    opciones: ["Eliminar el gobierno civil", "Instaurar una monarquía absoluta e irrevocable", "Proteger los derechos naturales previos del hombre: vida, libertad y propiedad privada", "Suprimir todas las leyes escritas"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El gobierno se crea con poderes limitados como un fideicomiso para garantizar los derechos naturales preexistentes.", puntos_base: 25
  },
  {
    id: "10610-68", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según Marisa Herrera en 'El enfoque de género en el derecho de familia', la incorporación de la 'compensación económica' en el Código Civil y Comercial busca:",
    opciones: ["Castigar con prisión al cónyuge adúltero", "Corregir el desequilibrio económico patrimonial que sufre uno de los cónyuges (habitualmente la mujer) por haber relegado su desarrollo profesional al dedicarse al cuidado de la familia", "Arancelar los trámites de divorcio", "Eliminar las uniones convivenciales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Mecanismo con perspectiva de género que visibiliza y compensa el trabajo doméstico y de cuidado no remunerado tras la ruptura.", puntos_base: 25
  },
  {
    id: "10610-69", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿En qué consiste el principio de 'razonabilidad' en las normas jurídicas?",
    opciones: ["En que los reglamentos del Poder Ejecutivo deben guardar una justa proporción con los fines de la ley constitucional sin alterar su espíritu (art. 28 CN)", "En que los jueces pueden inventar leyes sin Congreso", "En la aplicación de la pena de muerte", "En que las leyes deben ser escritas en latín"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Evita la arbitrariedad estatuyendo que los derechos no pueden ser destruidos por reglamentaciones desproporcionadas.", puntos_base: 25
  },
  {
    id: "10610-70", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según el artículo 7° de la Ley de Educación Superior N° 24.521, los mayores de 25 años que no posean título secundario completo pueden ingresar a la universidad si:",
    opciones: ["Tienen recomendación de un legislador", "No es posible bajo ninguna circunstancia", "Pagan una matrícula especial", "Demuestran preparación o experiencia laboral acorde y aprueban las evaluaciones de aptitud de la universidad"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Mecanismo de inclusión excepcional que contempla la idoneidad y trayectoria laboral comprobada.", puntos_base: 25
  },
  {
    id: "10610-71", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En 'La estructura de las revoluciones científicas' de Thomas Kuhn (analizado por Laura Delucchi), ¿qué es un 'paradigma'?",
    opciones: ["Una simple opinión sin base empírica", "Una ecuación matemática inmutable válida para siempre", "Una realización científica universalmente reconocida que, durante cierto tiempo, proporciona modelos de problemas y soluciones a una comunidad de investigadores", "Una norma jurídica dictada por el Congreso"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Configura la red de conceptos, métodos, valores y compromisos compartidos por una comunidad científica madura.", puntos_base: 50
  },
  {
    id: "10610-72", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Thomas Kuhn, ¿cuándo se produce una 'revolución científica'?",
    opciones: ["Cuando se agrega un nuevo dato empírico al libro de texto acumulativamente", "Cuando una anomalía persistente genera una crisis profunda que la ciencia normal no puede resolver, provocando la sustitución de un viejo paradigma por otro incompatible", "Cuando el gobierno cambia la financiación de los laboratorios", "Cuando un investigador publica un artículo periodístico"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Implica un cambio discontinuista e inconmensurable en la forma en que la comunidad científica ve el mundo.", puntos_base: 50
  },
  {
    id: "10610-73", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "¿A qué se refiere Thomas Kuhn con la noción de 'inconmensurabilidad' entre paradigmas rivales?",
    opciones: ["A que los científicos que adhieren a paradigmas opuestos usan lenguajes, conceptos y normas diferentes, imposibilitando un debate neutral de traducción lógica pura", "A que un paradigma dura exactamente 100 años", "A que los experimentos siempre dan el mismo resultado", "A que las ecuaciones de ambos paradigmas miden exactamente lo mismo"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Los paradigmas en pugna no son medibles con el mismo rasero lógico; implican modos de ver y practicar la ciencia incomparables.", puntos_base: 50
  },
  {
    id: "10610-74", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En la tesis de Boaventura de Sousa Santos, la 'Ecología de Saberes' propone:",
    opciones: ["La creación de una única teoría general universal", "La enseñanza exclusiva de lenguas antiguas", "Destruir todo el conocimiento científico moderno para volver a la Edad Media", "Un diálogo pragmático e intercultural entre el saber científico y otros saberes (populares, indígenas, campesinos) para superar la monocultura de la ciencia"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Supera el 'epistemicidio' reconociendo la validez e importancia de saberes alternativos en un marco no jerárquico.", puntos_base: 50
  },
  {
    id: "10610-75", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Marta M. Huertas, en los primeros fallos de la Corte Suprema de Justicia de la Nación (1863-1880), el tribunal adoptó el modelo norteamericano mediante un criterio de:",
    opciones: ["Aplicación exclusiva del derecho indiano colonial", "Adopción y copia textual dogmática en todos los casos", "Adaptación pragmática y selectiva, apartándose del modelo cuando existían 'disposiciones peculiares' o necesidades de la historia local", "Rechazo total de los precedentes de EE. UU."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Como estableció en el caso 'Lino de la Torre', la Corte utilizó la doctrina de EE. UU. salvo en lo modificado por leyes u ordenamientos peculiares argentinos.", puntos_base: 50
  },
  {
    id: "10610-76", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el pensamiento de Émile Durkheim expuesto por Piana, ¿qué rol cumplen las 'corporaciones' o grupos profesionales en las sociedades modernas?",
    opciones: ["Fomentar la huelga y la desintegración del Estado", "Actuar como cuerpos intermedios que encauzan la moral profesional, reintegran al individuo en la sociedad y superan la anomia", "Monopolizar los partidos políticos", "Suprimir la propiedad privada"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Para Durkheim, las corporaciones profesionales restauran los vínculos morales colectivos debilitados por la rápida industrialización.", puntos_base: 50
  },
  {
    id: "10610-77", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el ensayo 'La constitución del constitucionalismo' (Corbetta y Piana), ¿qué caracteriza a la 'constitución semántica' según la clasificación de Karl Loewenstein?",
    opciones: ["Que es una mera formalización del poder existente que beneficia a sus detentadores sin establecer límites efectivos al ejercicio del poder", "Que no está escrita", "Que solo rige en estados monárquicos", "Que se aplica plenamente limitando el poder del gobernante de forma garantista"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La constitución semántica formaliza la estructura de poder real pero no impone controles ni limitaciones verdaderas a los gobernantes.", puntos_base: 50
  },
  {
    id: "10610-78", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el texto de Alejandro Ciriza sobre Rousseau, ¿cuál es la tensión entre el 'Contrato Social' y 'Las Confesiones'?",
    opciones: ["No existe ninguna tensión entre ambas obras", "Las Confesiones fueron escritas por Voltaire", "El Contrato es un texto religioso y Las Confesiones es un tratado jurídico", "El Contrato exige un ciudadano abstracto despojado de particularidades, mientras Las Confesiones afirman la subjetividad individual densa e irrenunciable"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Muestra la dificultad fundacional del orden moderno entre la abstracción igualitaria de la política y el deseo/subjetividad irreductible del sujeto concreto.", puntos_base: 50
  },
  {
    id: "10610-79", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Salanueva y González, la principal resistencia histórica para incorporar la enseñanza de la metodología socio-jurídica en la carrera de Abogacía proviene de:",
    opciones: ["Mandatos constitucionales expresos", "El exceso de materias sociológicas en el Plan de Estudios", "El predominio de la matriz académica tradicional y profesionalista ('escuela de derecho') centrada exclusivamente en la dogmática de textos codificados", "La falta de bibliografía sobre el tema"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El modelo tradicional privilegia el litigio y el comentario dogmático de la ley por sobre la investigación científica del campo jurídico.", puntos_base: 50
  },
  {
    id: "10610-80", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "¿Qué sostiene Luigi Ferrajoli respecto al rol de la Ciencia Jurídica moderna (mencionado por Delucchi)?",
    opciones: ["Que debe limitarse a una tarea puramente descriptiva y neutral del derecho vigente", "Que debe ser una ciencia crítica y prescriptiva que constante la tensión entre el derecho que es y el derecho que debe ser, denunciando lagunas e inconstitucionalidades", "Que la ciencia jurídica ha desaparecido", "Que debe someterse al mandato del Poder Ejecutivo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ferrajoli postula un garantismo donde la doctrina cumple una función normativa crítica de verificación de la validez sustancial de las leyes.", puntos_base: 50
  },
  {
    id: "10610-81", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En 'De profesión: abogado', Atela y Gajate recuerdan que en la Ley N° 4699 de creación de la UNLP (1905), la Facultad de Ciencias Jurídicas y Sociales incluyó dos secciones pedagógicas de:",
    opciones: ["Pedagogía y Filosofía y lenguas latina y griega", "Economía política y Contabilidad", "Derecho Canónico", "Medicina legal y Criminología"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El diseño original de Joaquín V. González integró humanidades y pedagogía a la formación científica del jurista.", puntos_base: 50
  },
  {
    id: "10610-82", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Sebastián Piana en 'La evolución jurisprudencial del principio de autonomía de la voluntad', el artículo 19 de la Constitución Nacional argentina establece:",
    opciones: ["La pena de muerte para delitos de traición", "El monopolio de las empresas estatales", "La obligación de vacunación para todos los ciudadanos", "Que las acciones privadas de los hombres que de ningún modo ofendan al orden y a la moral pública, ni perjudiquen a un tercero, están reservadas a Dios y exentas de la autoridad de los magistrados"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Fundamento constitucional de la autonomía personal y zona de reserva frente a la intromisión del Estado.", puntos_base: 50
  },
  {
    id: "10610-83", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el fallo 'Bazterrica' (1986) de la Corte Suprema argentina, la mayoría sostuvo que la penalización de la tenencia de estupefacientes para consumo personal sin peligro a terceros era inconstitucional porque:",
    opciones: ["No había sido votada por el Senado", "Favorecía el tráfico internacional", "Violaba el principio de autonomía de la voluntad y la privacidad garantizados en el artículo 19 de la Constitución Nacional", "Contradecía el Código Penal"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La Corte declaró que el Estado no puede incriminar conductas privadas que no generen un daño concreto a terceros.", puntos_base: 50
  },
  {
    id: "10610-84", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En la teoría de Thomas Kuhn, la 'conversión' de los científicos a un nuevo paradigma se caracteriza por:",
    opciones: ["Un proceso de deducción matemática paso a paso", "Un cambio repentino de visión (similar a un cambio de la Gestalt) no forzado por la sola lógica, donde influyen la persuasión y la confianza en la capacidad futura del nuevo logro", "Una orden administrativa de las academias", "La suma cuantitativa de experimentos anteriores"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "La transición entre paradigmas inconmensurables implica una reorientación global de la percepción que no se logra por sola demostración lógica.", puntos_base: 50
  },
  {
    id: "10610-85", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el texto de Enrique Dussel, el concepto de 'colonialidad del poder' demuestra que la modernidad europea se constituyó a partir de:",
    opciones: ["La conquista y dominación colonial transoceánica de América desde el siglo XVI como centro del mercado mundial", "La imitación del Imperio Chino", "Un proceso puramente pacífico de intercambio cultural", "El desarrollo aislado de la filosofía alemana"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Dussel argumenta que la modernidad nace con la alteridad conquistada de América y la implantación del sistema-mundo colonial.", puntos_base: 50
  },
  {
    id: "10610-86", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Boaventura de Sousa Santos, la 'Sociología de las Emergencias' opera mediante el concepto del 'todavía no' (Ernst Bloch) para:",
    opciones: ["Medir los índices de inflación", "Repetir los dogmas del marxismo ortodoño", "Negar cualquier posibilidad de cambio futuro", "Identificar, valorar y ampliar simbólicamente los embriones y posibilidades latentes de utopías realistas que surgen en el presente"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Busca rescatar las señales de alternativas emergentes que la razón proléptica suele descalificar por ser incipientes.", puntos_base: 50
  },
  {
    id: "10610-87", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "¿Qué sostiene Pekka Himanen sobre el modelo del 'Bazar' en la era de la información (mencionado por Batista en 'Globalización y sociedad de la información')?",
    opciones: ["Que se aplica únicamente al comercio textil", "Que el conocimiento se planifica a puerta cerrada por una pequeña élite burocrática", "Que la ideación y el conocimiento se desarrollan mediante esquemas colaborativos abiertos a la crítica y prueba constante de la comunidad", "Que los libros de texto deben ser prohibidos"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Opone la 'Catedral' (cerrada y jerárquica) al 'Bazar' (abierto, distribuido y colaborativo, propio de la cultura hacker y la red).", puntos_base: 50
  },
  {
    id: "10610-88", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En la evolución jurisprudencial de la Corte Suprema analizada por Marta Huertas, la causa 'Sorbitol / Fisco Nacional contra comerciantes de San Juan' (1868) reflejó:",
    opciones: ["La defensa del gobierno provincial frente al nacional", "El recelo de la Corte ante los desórdenes y levantamientos de los gobiernos de provincia, priorizando el principio de supremacía federal", "La declaración de inconstitucionalidad de la ley de aduanas", "La supresión de la justicia de sección"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El tribunal consolidó la autoridad de las instituciones nacionales frente a las perturbaciones o revoluciones locales.", puntos_base: 50
  },
  {
    id: "10610-89", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En la teoría de la argumentación jurídica descrita por Pettoruti, las razones de autoridad basadas en la dogmática ceden cuando:",
    opciones: ["Las decisiones legales enfrentan situaciones de palmaria e insostenible injusticia que demandan justificaciones racionales y valorativas profundas", "Se interpone un recurso simple", "El texto de la ley es claro", "El juez aplica una multa de tránsito"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El argumento jurídico requiere justificación racional que atienda a los valores y principios constitucionales cuando la sola autoridad formal genera soluciones injustas.", puntos_base: 50
  },
  {
    id: "10610-90", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En la 'Lección de optimismo' pronunciada por Joaquín V. González en 1918 (reproducida en Tauber), el fundador de la UNLP afirma que los únicos derrotados son:",
    opciones: ["Los partidos políticos de oposición", "Los profesores que pierden un concurso", "Los estudiantes que pierden un examen", "Los que no creen en nada, no conciben un ideal y sólo ven el camino de su egoísmo o su negocio"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Mensaje reformista que exalta los ideales y el optimismo creador frente al pragmatismo utilitario.", puntos_base: 50
  },
  {
    id: "10610-91", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el análisis de Alejandro Ciriza sobre el 'Emilio' de Rousseau, la educación de Sofía (la mujer) se diferencia de la de Emilio porque:",
    opciones: ["Sofía es educada para ser magistrada", "Emilio es educado para la dependencia y Sofía para la libertad", "Emilio es educado para la autonomía y la ciudadanía en la vida pública, mientras Sofía es educada para agradar al varón y atender el hogar", "Ambos reciben exactamente la misma instrucción en filosofía y política"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Explicita la subordinación educacional de las mujeres en el pensamiento ilustrado rousseauniano.", puntos_base: 50
  },
  {
    id: "10610-92", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Durkheim (Piana), ¿qué caracteriza al derecho 'restitutivo' en contraste con el derecho 'represivo'?",
    opciones: ["El derecho restitutivo busca castigar con dolor al infractor de la conciencia colectiva (propio de la solidaridad mecánica)", "El derecho restitutivo busca devolver las cosas al estado anterior y restablecer relaciones en la solidaridad orgánica (ej. derecho civil y comercial)", "El derecho restitutivo no utiliza leyes escritas", "El derecho represivo es el único válido"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El derecho restitutivo (civil, comercial, laboral) rige en sociedades complejas divididas funcionalmente, reparando el daño en lugar de infligir una pena aflictiva.", puntos_base: 50
  },
  {
    id: "10610-93", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el texto de Cristian Furfaro, la propuesta pedagógica de Paulo Freire en '¿Extensión o comunicación?' sostiene que:",
    opciones: ["El conocimiento no se transmite como un objeto, sino que se construye a través del diálogo y el encuentro entre sujetos interlocutores", "La extensión universitaria debe cobrar aranceles a los obreros", "No debe existir diálogo entre la universidad y el pueblo", "El conocimiento es una materia estática que el profesor deposita en el estudiante"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Rechaza la educación bancaria/extensión unidireccional y postula la comunicación dialogada emancipadora.", puntos_base: 50
  },
  {
    id: "10610-94", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según el artículo 43 de la Ley de Educación Superior N° 24.521, ¿qué requisito adicional se exige a las carreras reguladas por el Estado cuyo ejercicio puede poner en riesgo los derechos o la salud?",
    opciones: ["Examen eliminatorio de ingreso obligatorio", "Que todos los docentes tengan título de Doctorado en el extranjero", "Aprobación del Poder Judicial únicamente", "Carga horaria mínima, contenidos curriculares básicos, formación práctica intensa y acreditación periódica por CONEAU"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Régimen especial para carreras de interés público como Abogacía, Medicina, Ingeniería, etc.", puntos_base: 50
  },
  {
    id: "10610-95", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el pensamiento de Alejandro Batista ('Breves comentarios entorno al transhumanismo'), la irrupción de inteligencias artificiales y biotecnología avanzada cuestiona en el Código Civil y Comercial:",
    opciones: ["El derecho de propiedad sobre bienes muebles", "El número de artículos de las sucesiones", "La noción biológica y antropocéntrica tradicional de 'persona humana' y sus límites jurídicos y éticos", "La duración del contrato de alquiler"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Interpela los conceptos clásicos de persona, capacidad e identidad ante la posibilidad de seres mejorados o sintientes no humanos.", puntos_base: 50
  },
  {
    id: "10610-96", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En 'La constitución del constitucionalismo', Corbetta y Piana afirman que las constituciones 'fachada' o 'pseudoconstituciones' son aquellas que:",
    opciones: ["Limitan con rigor absoluto el poder del gobernante", "Guardan una apariencia formal garantista pero no se aplican en la realidad política y social del Estado", "Son redactadas por asambleas populares", "Tienen más de 500 artículos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Simulan ser constituciones democráticas pero en la práctica el poder se ejerce sin controles verdaderos.", puntos_base: 50
  },
  {
    id: "10610-97", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según Thomas Kuhn, durante la etapa de 'ciencia normal', los científicos se dedican fundamentalmente a:",
    opciones: ["Resolver 'enigmas' acumulativos, ampliando la precisión y acoplamiento entre el paradigma y la naturaleza", "Buscar constantemente revoluciones científicas", "Escribir obras filosóficas sobre la duda", "Probar la falsedad del paradigma imperante"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La ciencia normal es una actividad articuladora y no busca producir novedades profundas o romper el paradigma vigente.", puntos_base: 50
  },
  {
    id: "10610-98", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En la clasificación de ausencias de Boaventura de Sousa Santos, la 'monocultura de la escala dominante' genera ausencia bajo la forma de:",
    opciones: ["Lo residual pre-moderno", "Lo improductivo", "Lo ignorante", "Lo particular y lo local, descredibilizados frente a lo universal y lo global hegemónico"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "El universalismo/globalismo reduce lo local a mero particularismo sin dignidad como alternativa válida.", puntos_base: 50
  },
  {
    id: "10610-99", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "En el pensamiento de Mariano Moreno analizado por Gardinetti, ¿cuál era la posición de Moreno sobre la posibilidad de una confederación de toda Hispanoamérica?",
    opciones: ["Abogaba por una monarquía constitucional única en Lima", "Consideraba que era un objetivo fácil de lograr en un año", "La tildaba de quimérica e inverificable debido a las enormes distancias e incompatibilidades reales de las distintas regiones", "Proponía someterse a la corona portuguesa"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Sostuvo que una confederación continental de toda la América española era inviable, prefiriendo constituciones separadas para las distintas regiones/países.", puntos_base: 50
  },
  {
    id: "10610-100", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según el Estatuto de la UNLP (art. 11), las materias aprobadas por un estudiante universitario son:",
    opciones: ["Válidas únicamente por un periodo de 2 años", "Derechos adquiridos e inalienables de los estudiantes que bajo ninguna circunstancia pueden ser perdidos o derogados", "Sujetas a la decisión del Decano de cada año", "Perstringibles si se cambia de plan de estudios"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Garantía estatutaria inalienable que protege la trayectoria académica regular de los estudiantes de la UNLP.", puntos_base: 50
  },
  // --- 10616: INTRODUCCIÓN AL PENSAMIENTO CIENTÍFICO (100 PREGUNTAS OFICIALES DND) ---,
  {
    id: "10616-01", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Según Irene Vasilachis, ¿cuáles son los tres componentes principales de la investigación cualitativa según Strauss y Corbin?",
    opciones: ["Los datos, los procedimientos analíticos/interpretativos y los informes escritos o verbales", "La deducción, la inducción y la verificación empírica estandarizada", "La encuesta, el experimento y la estadística descriptiva", "Las hipótesis, las variables y la muestra cuantitativa"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Strauss y Corbin (1990) señalan que los componentes son los datos, los procedimientos analíticos e interpretativos y los informes.", puntos_base: 10
  },
  {
    id: "10616-02", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Cuál es la diferencia fundamental propuesta por Félix Schuster entre 'describir' y 'explicar'?",
    opciones: ["Describir requiere leyes universales y explicar requiere entrevistas", "No existe ninguna diferencia entre describir y explicar en ciencias sociales", "Describir es cuantitativo y explicar es cualitativo", "Describir responde al 'cómo' es algo y explicar responde al 'por qué' algo es de determinada manera"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Describir responde a la pregunta acerca de cómo es algo, mientras que explicar responde a por qué algo se presenta de cierta manera.", puntos_base: 10
  },
  {
    id: "10616-03", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Para Clifford Geertz, el concepto de cultura que propugna es esencialmente de tipo:",
    opciones: ["Estructuralista de matriz matemática", "Conductista y cuantitativo", "Semiótico e interpretativo", "Biológico y evolucionista"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Geertz señala que la cultura es una urdimbre de tramas de significación y su análisis es una ciencia interpretativa en busca de significaciones.", puntos_base: 10
  },
  {
    id: "10616-04", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "En el texto de Nancy Cardinaux, ¿qué autor plantea la importancia del 'error fructífero' y la 'falsabilidad' en la epistemología?",
    opciones: ["Thomas Kuhn", "Karl Popper", "Imre Lakatos", "Paul Feyerabend"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Cardinaux inicia su trabajo citando la epistemología de Karl Popper a través de las reflexiones de George Steiner.", puntos_base: 10
  },
  {
    id: "10616-05", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Según Boaventura de Sousa Santos, el pensamiento occidental moderno es un pensamiento de tipo:",
    opciones: ["Abismal", "Positivista estricto", "Dialéctico hegeliano", "Lineal e inductivo"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Sousa Santos define el pensamiento occidental moderno como un 'pensamiento abismal' basado en distinciones visibles e invisibles.", puntos_base: 10
  },
  {
    id: "10616-06", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Verdadero o Falso? La investigación cualitativa constituye un enfoque monolítico e ideológicamente unificado.",
    opciones: ["Verdadero solo en América Latina", "Falso solo en la tradición anglosajona", "Verdadero", "Falso"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Vasilachis enfatiza que la investigación cualitativa no es un enfoque monolítico sino un variado mosaico de perspectivas.", puntos_base: 10
  },
  {
    id: "10616-07", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿De qué filósofo toma Clifford Geertz el concepto de 'descripción densa' (thick description)?",
    opciones: ["Max Weber", "Ludwig Wittgenstein", "Gilbert Ryle", "Susanne Langer"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Geertz toma la noción de 'descripción densa' de los ensayos de Gilbert Ryle sobre lo que hace Le Penseur.", puntos_base: 10
  },
  {
    id: "10616-08", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué ejemplo utiliza Schuster para ilustrar un razonamiento nomológico-deductivo simple?",
    opciones: ["La tasa de desempleo y la delincuencia", "La dilatación de un trozo de hierro al ser calentado", "El choque de dos automóviles en la vía pública", "La revolución francesa y la burguesía"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Schuster utiliza el ejemplo de que todos los metales se dilatan con el calor y el hierro es un metal.", puntos_base: 10
  },
  {
    id: "10616-09", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Cuáles son los dos lados de la línea visible que rigen la sociedad metropolitana occidental según Sousa Santos?",
    opciones: ["Legalidad y Caos", "Apropiación y Violencia", "Ciencia y Magia", "Regulación y Emancipación"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "En las sociedades metropolitanas se aplica la tensión visible entre regulación social y emancipación social.", puntos_base: 10
  },
  {
    id: "10616-10", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Cuál es la carrera profesional que tradicionalmente ha sido calificada como 'profesionalista' por excelencia en las universidades argentinas?",
    opciones: ["Medicina Veterinaria", "Filosofía", "Licenciatura en Sociología", "Abogacía / Derecho"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Cardinaux señala a la carrera de Derecho como la más importante entre las denominadas carreras 'profesionalistas'.", puntos_base: 10
  },
  {
    id: "10616-11", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué paradigma científico se caracteriza por la búsqueda de leyes sociales como expresión de regularidades y explicaciones causales?",
    opciones: ["Epistemología del Sujeto Conocido", "Paradigma Materialista-Histórico", "Paradigma Interpretativo", "Paradigma Positivista"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "El paradigma positivista se basa en la observación exterior, leyes como regularidades y explicaciones causales.", puntos_base: 10
  },
  {
    id: "10616-12", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "En el famoso ejemplo de Ryle citado por Geertz, ¿cuál es la diferencia entre un tic y una guiñada?",
    opciones: ["La velocidad del movimiento del párpado", "El tic es biológico e involuntario; la guiñada transmite un mensaje delimitado por un código social", "La guiñada es involuntaria y el tic es una burla", "No existe diferencia fenoménica ni cultural"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ambos movimientos son idénticos fenoménicamente, pero la guiñada comunica intencionalmente según un código público.", puntos_base: 10
  },
  {
    id: "10616-13", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué tipo de explicación científica busca entender un hecho histórico considerándolo el eslabón final de un proceso originado en el pasado?",
    opciones: ["Explicación Genética", "Explicación Funcional", "Explicación Disposicional", "Explicación Nomológico-Deductiva"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La explicación genética consiste en entender un hecho como la culminación o desarrollo de un proceso iniciado antes.", puntos_base: 10
  },
  {
    id: "10616-14", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "En los territorios coloniales del 'otro lado de la línea', ¿qué dicotomía reemplaza a la de regulación/emancipación?",
    opciones: ["Democracia / Autocracia", "Orden / Progreso", "Verdad / Falsedad", "Apropiación / Violencia"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "En los territorios coloniales la dicotomía aplicable es apropiación/violencia.", puntos_base: 10
  },
  {
    id: "10616-15", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Según Vasilachis, la investigación cualitativa se caracteriza por priorizar:",
    opciones: ["La neutralidad valorativa absoluta del investigador", "La extensión sobre la profundidad", "La profundidad y los matices sobre la extensión", "La cuantificación estandarizada de variables"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La investigación cualitativa privilegia la profundidad sobre la extensión y busca captar los matices de las experiencias.", puntos_base: 10
  },
  {
    id: "10616-16", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "El 'argumento realista' para insertar la investigación en la enseñanza del Derecho se apoya en que el Derecho es:",
    opciones: ["Un conjunto de normas abstractas e inmutables", "Comportamiento judicial y predicción de la decisión de los jueces ante los hechos", "Un producto exclusivo del derecho natural divino", "Un sistema formal puramente lógico"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Citando a Frank y Cueto Rúa, el realismo define el derecho como comportamiento judicial y predicción sobre hechos.", puntos_base: 10
  },
  {
    id: "10616-17", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Verdadero o Falso? Según Geertz, la etnografía consiste esencialmente en una serie de técnicas como llevar un diario, establecer genealogías y trazar mapas.",
    opciones: ["Falso", "Verdadero solo en la antropología física", "Verdadero solo en el laboratorio", "Verdadero"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Geertz aclara que esas son técnicas de libro de texto; lo que define a la etnografía es el esfuerzo intelectual de la 'descripción densa'.", puntos_base: 10
  },
  {
    id: "10616-18", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Cuando una explicación científica no menciona explícitamente ciertas leyes o condiciones por darles tácitamente por sentadas, se denomina:",
    opciones: ["Explicación estadística", "Explicación falsa", "Explicación elíptica", "Explicación imposible"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Schuster llama explicaciones elípticas a aquellas que omiten enunciar explícitamente leyes o datos que se dan por tácitos.", puntos_base: 10
  },
  {
    id: "10616-19", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "El concepto de 'terra nullius' y 'anima nullius' sirvió históricamente para justificar:",
    opciones: ["El comercio libre entre iguales", "La emancipación de los esclavos", "La invasión, ocupación y despojo de los territorios y poblaciones indígenas", "El desarrollo del derecho ambiental moderno"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Se consideraba el territorio colonial como vacío jurídico (terra nullius) e indígena como receptáculo vacío (anima nullius).", puntos_base: 10
  },
  {
    id: "10616-20", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "En el paradigma interpretativo de las ciencias sociales, el lenguaje es considerado como:",
    opciones: ["Un simple instrumento de transmisión de datos objetivos", "Un recurso y una creación, forma de reproducción y producción del mundo social", "Un obstáculo epistemológico que debe eliminarse", "Una variable cuantitativa discreta"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El paradigma interpretativo concibe el lenguaje como recurso y creación, clave en la producción del mundo social.", puntos_base: 10
  },
  {
    id: "10616-21", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "El argumento 'institucional' sobre la enseñanza de la investigación en Derecho en Argentina tiene raíces históricas en:",
    opciones: ["La Reforma Universitaria de 1918", "La Constitución de 1853", "El Código Civil de Vélez Sarsfield", "La Dictadura Militar de 1976"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El argumento institucional se asienta en la tradición argentina de la Reforma Universitaria y el rol activo del estudiante.", puntos_base: 10
  },
  {
    id: "10616-22", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Geertz afirma, siguiendo a Max Weber, que el hombre es un animal inserto en:",
    opciones: ["Estructuras económicas inconscientes e inmodificables", "Redes de estímulo y respuesta pavlovianas", "Leyes biológicas de supervivencia", "Tramas de significación que él mismo ha tejido"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Cita a Max Weber para fundamentar su concepto semiótico de la cultura como tramas de significación.", puntos_base: 10
  },
  {
    id: "10616-23", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué caracteriza a las explicaciones teleológicas o funcionales?",
    opciones: ["Niegan la existencia de objetivos o intenciones", "Explican los hechos por causas situadas exclusivamente en el pasado remoto", "Explican los acontecimientos en función de fines o consecuencias futuras/productos del sistema", "Se basan únicamente en la deducción matemática pura"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Las explicaciones teleológicas o funcionales centran su atención en las consecuencias, metas o fines de las acciones/sistemas.", puntos_base: 10
  },
  {
    id: "10616-24", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "El fenómeno por el cual los derechos humanos son violados para defender los derechos humanos o la democracia destruida para salvarla es signo de:",
    opciones: ["Progreso ilimitado del derecho occidental", "Contracción del espacio metropolitano y penetración de la lógica de apropiación/violencia", "La consolidación del Estado de Bienestar", "Un fallo técnico de la diplomacia internacional"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Refleja cómo el pensamiento abismal degrada la regulación/emancipación al contaminarse con la apropiación/violencia.", puntos_base: 10
  },
  {
    id: "10616-25", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué distingue a la 'reflexión epistemológica' de la 'epistemología' según Vasilachis?",
    opciones: ["La reflexión epistemológica es matemática y la epistemología es cualitativa", "Son exactamente el mismo concepto con distinto nombre", "La reflexión epistemológica se aplica solo a las ciencias naturales", "La epistemología es una disciplina normativa acabada; la reflexión epistemológica es una actividad permanente vinculada a la práctica de investigación"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Vasilachis sostiene que la reflexión epistemológica acompaña la práctica cotidiana de investigación frente a problemas no resueltos.", puntos_base: 10
  },
  {
    id: "10616-26", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué significa la frase latina 'Ex facto oritur ius' citada en el texto de Cardinaux?",
    opciones: ["El hecho destruye el derecho", "La ley es anterior al hecho", "Del derecho surge el hecho", "Del hecho surge el derecho"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Significa 'del hecho surge el derecho', aforismo central para enfatizar la determinación de los hechos en el litigio.", puntos_base: 10
  },
  {
    id: "10616-27", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Verdadero o Falso? Para Geertz, los escritos antropológicos son interpretaciones de segundo y tercer orden, y por lo tanto son 'ficciones' (fictio: algo hecho o formado).",
    opciones: ["Falso porque son copias exactas de la realidad", "Verdadero", "Falso", "Verdadero solo si son falsas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Geertz explica que son fictio (hechuras/construcciones teóricas), lo que no significa que sean falsas o engañosas.", puntos_base: 10
  },
  {
    id: "10616-28", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué filósofo sostuvo históricamente que la causalidad se reduce a una 'conjunción constante' de sucesos y no a una conexión necesaria verificable?",
    opciones: ["Immanuel Kant", "David Hume", "René Descartes", "Aristotle"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Hume argumentó que la experiencia solo muestra la conjunción constante de eventos, reemplazando la necesidad por hábito.", puntos_base: 10
  },
  {
    id: "10616-29", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿A qué llama Sousa Santos 'fascismo social'?",
    opciones: ["Un régimen social de relaciones de poder extremadamente desiguales que otorga a la parte fuerte poder de veto sobre la vida de la débil", "Un movimiento ideológico del siglo XX en Europa", "La prohibición constitucional de partidos políticos", "Un régimen político dictatorial militar tradicional"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El fascismo social es un régimen de extrema desigualdad socioeconómica que puede coexistir con la democracia liberal formal.", puntos_base: 10
  },
  {
    id: "10616-30", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Según Vasilachis, la investigación cualitativa se enraíza principalmente en el paradigma:",
    opciones: ["Neopositivista inductivo", "Funcionalista sistémico", "Positivista", "Interpretativo"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Los métodos cualitativos suponen y realizan los postulados del paradigma interpretativo.", puntos_base: 10
  },
  {
    id: "10616-31", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "En el debate sobre los 'momentos' de la investigación cualitativa de Denzin y Lincoln, ¿cuál es una de las principales críticas señaladas por autores como Atkinson o Morse?",
    opciones: ["Que es un modelo demasiado rígido pero indiscutible", "Que Denzin y Lincoln le dan demasiada importancia al positivismo", "Que establece una narrativa lineal/teleológica que mitifica el futuro e ignora las tensiones presentes y pasadas", "Que no incluye la investigación en América Latina"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Se critica el modelo por imponer una secuencia lineal que reinventa la narrativa del progreso académico y excluye otras voces.", puntos_base: 10
  },
  {
    id: "10616-32", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "En el modelo nomológico-deductivo de Hempel y Popper, las condiciones lógicas de adecuación exigen que:",
    opciones: ["El explanandum no se deduzca del explanans", "El explanans contenga leyes generales y tenga contenido empírico comprobable", "Las leyes sean meras opiniones personales del investigador", "El explanandum sea anterior al explanans en el tiempo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Las condiciones lógicas exigen deductibilidad del explanandum, inclusión de leyes generales y contenido empírico.", puntos_base: 10
  },
  {
    id: "10616-33", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Geertz rechaza el 'cognitivismo' o 'etnociencia' (Goodenough, Tyler) porque incurre en la falacia de considerar que la cultura:",
    opciones: ["Consiste en fenómenos mentales que se encuentran solo en la cabeza de los hombres y se analizan con algoritmos formales", "Es un conjunto de objetos materiales tangibles", "No existe en absoluto en las sociedades no occidentales", "Es una propiedad exclusiva del Estado"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Critica reducir la cultura a estructuras psicológicas/algoritmos de reglas mentales, ignorando que la significación es pública.", puntos_base: 10
  },
  {
    id: "10616-34", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿En qué consiste la 'sociología de las ausencias' propuesta por Boaventura de Sousa Santos?",
    opciones: ["En estudiar la falta de recursos económicos en los países del Norte", "En un método estadístico para analizar vacíos de datos", "En contar cuántos ciudadanos no votan en las elecciones", "En la crítica a la producción de lo no-existente por el pensamiento hegemónico, rescatando experiencias hechas invisibles"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "La sociología de las ausencias busca mostrar cómo el pensamiento abismal produce activamente la no-existencia e invisibilidad.", puntos_base: 10
  },
  {
    id: "10616-35", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "Dentro de los 5 argumentos analizados por Cardinaux, el 'argumento integracionista' sostiene que:",
    opciones: ["La universidad debe unificarse con el Poder Judicial", "El Derecho es una ciencia social más y la formación del abogado debe ser idéntica a la de cualquier científico social", "La religión y el derecho deben integrarse en una sola norma", "El derecho procesal debe eliminar las pericias médicas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El argumento integracionista sostiene que el Derecho es una ciencia social y minimiza la especificidad de las carreras dogmáticas.", puntos_base: 10
  },
  {
    id: "10616-36", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué es el proceso de 'Doble Hermenéutica' enunciado por Giddens y citado por Vasilachis?",
    opciones: ["La interpretación de textos en dos idiomas distintos", "El diálogo entre dos investigadores sobre el mismo objeto", "La relación donde los conceptos de segundo orden de los científicos son reapropiados por los actores como nociones de primer orden", "La separación tajante entre el sujeto que conoce y el objeto conocido"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La doble hermenéutica implica que los conceptos creados por los científicos son reincorporados por los actores a su mundo de la vida.", puntos_base: 25
  },
  {
    id: "10616-37", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿En qué consiste una 'Explicación Parcial' según Hempel y Klimovsky?",
    opciones: ["En brindar una explicación total de un hecho más débil (F) que está incluido en el hecho más fuerte (E) que se desea explicar", "En un razonamiento que utiliza premisas falsas", "En una predicción matemática sobre el futuro lejano", "En una explicación que es incompleta por falta de tiempo del investigador"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "En la explicación parcial se deduce un enunciado más amplio/débil (F) que abarca al hecho específico (E).", puntos_base: 25
  },
  {
    id: "10616-38", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Por qué sostiene Geertz que el análisis cultural es microscópico pero 'el lugar de estudio no es el objeto de estudio'?",
    opciones: ["Porque la etnografía no puede aplicarse a pequeñas comunidades", "Porque las pequeñas aldeas son un microcosmos idéntico a toda la nación", "Porque los antropólogos solo estudian microbios y bacterias en aldeas", "Porque los antropólogos no estudian aldeas, sino QUE estudian EN aldeas grandes cuestiones en contextos pequeños"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Geertz aclara la falacia de Jonesville: el antropólogo estudia grandes temas (poder, fe, cambio) en escenarios confinados.", puntos_base: 25
  },
  {
    id: "10616-39", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué caracteriza a la forma de 'fascismo contractual' dentro del fascismo social?",
    opciones: ["La eliminación de las empresas privadas por parte del Estado", "La prohibición de firmar contratos comerciales", "La extrema desigualdad de poder donde la parte débil acepta condiciones despóticas por no tener alternativa de supervivencia", "El uso de la fuerza militar para redactar el Código Civil"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Ocurre cuando la parte débil cede ante condiciones despóticas (privatizaciones, precarización laboral) por vulnerabilidad.", puntos_base: 25
  },
  {
    id: "10616-40", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "En el 'argumento profesionalista' para la investigación en Derecho, Ferrajoli compara el proceso judicial con:",
    opciones: ["Un experimento de laboratorio de física cuántica", "Una contienda entre hipótesis en competencia donde la acusación aporta pruebas y la defensa plantea contrahipótesis", "Un texto de ficción literaria sin reglas lógicas", "Un examen oral universitario tradicional"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ferrajoli concibe el proceso judicial como una contienda de hipótesis donde el juez evalúa pruebas y contrapruebas.", puntos_base: 25
  },
  {
    id: "10616-41", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Según Vasilachis, la 'Epistemología del Sujeto Cognoscente' se caracteriza tradicionalmente por:",
    opciones: ["Una relación dualista y unidireccional donde el sujeto que conoce investiga a un sujeto conocido pasivo u objetivado", "La eliminación de las teorías científicas en el análisis", "El rechazo absoluto de toda investigación empírica", "Una relación simétrica y cooperativa entre sujetos"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La epistemología tradicional del sujeto cognoscente parte del investigador activo que observa objetivadoramente al sujeto conocido.", puntos_base: 25
  },
  {
    id: "10616-42", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Cuál es la característica principal del modelo de explicación Estadístico-Inductivo?",
    opciones: ["No utiliza ningún dato empírico", "Es aplicable únicamente a hechos del pasado remoto", "Otorga una certeza deduible del 100% sobre el evento", "Utiliza leyes estadísticas y le confiere al explanandum un alto grado de probabilidad lógica o apoyo inductivo"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Al contener leyes estadísticas, no hay deducción estricta sino que confiere sobre el hecho una alta probabilidad.", puntos_base: 25
  },
  {
    id: "10616-43", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Para Geertz, la prueba principal de validez de una descripción cultural NO puede ser la mera coherencia interna porque:",
    opciones: ["La etnografía prohíbe la redacción coherente", "Nada es más coherente que la alucinación de un paranoide o el cuento de un estafador", "Las culturas son siempre totalmente caóticas sin ningún orden", "La coherencia solo existe en las matemáticas puras"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Geertz advierte que construir sistemas formales impecablemente coherentes no garantiza su contacto con la realidad social.", puntos_base: 25
  },
  {
    id: "10616-44", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué es el 'derecho suave' (soft law) y qué riesgo señala Sousa Santos respecto a él?",
    opciones: ["Un derecho penal para delitos menores que elimina las penas de cárcel", "Mecanismos de conformidad voluntaria (códigos de conducta) que bajo la apariencia benevolente ocultan la lógica de apropiación/violencia", "Leyes aprobadas por consenso unánime en el parlamento", "El derecho internacional humanitario garantizado por la ONU"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Se presenta como regulación voluntaria/flexible pero opera desprotegiendo a la parte débil (ej. trabajadores en sweatshops).", puntos_base: 25
  },
  {
    id: "10616-45", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "El 'argumento vocacionalista' en la enseñanza del Derecho señala que:",
    opciones: ["La carrera tiene múltiples salidas laborales y debe brindar herramientas para la vocación de docente e investigador", "La vocación del abogado es exclusivamente ganar dinero en juicios comerciales", "No se requiere ninguna formación pedagógica en la universidad", "Todos los graduados de derecho deben ser obligatoriamente profesores de secundaria"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Sostiene que al existir la vocación de investigador científico entre los graduados, la carrera debe ofrecer las herramientas básicas.", puntos_base: 25
  },
  {
    id: "10616-46", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "La propuesta de 'Triple Hermenéutica' desarrollada por Vasilachis analiza cómo:",
    opciones: ["El investigador, el juez y el legislador interpretan la misma ley", "Se aplican tres métodos cuantitativos en forma simultánea", "Se traducen textos bíblicos a tres idiomas", "Los científicos preinterpretan la realidad usando modelos de discursos dominantes (medios/política) que reproducen el poder"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Ocurre cuando los modelos interpretativos hegemónicos de la prensa/política predeterminan la interpretación científica y de los actores.", puntos_base: 25
  },
  {
    id: "10616-47", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Al analizar la causalidad como 'condición suficiente', Schuster demuestra que en la lógica formal el razonamiento adopta la forma válida del:",
    opciones: ["Falacia de Afirmación del Consecuente", "Modus Tollens", "Modus Ponens", "Silogismo Disyuntivo"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Al ubicar la causa como antecedente (condición suficiente), el esquema lógico corresponde al Modus Ponens válido.", puntos_base: 25
  },
  {
    id: "10616-48", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "La relación etnográfica del incidente de las ovejas de Cohen involucra la interacción de tres estructuras de interpretación:",
    opciones: ["Los españoles, los portugueses y los indígenas", "Los comerciantes judíos, los guerreros bereberes y los militares franceses", "Los británicos, los norteamericanos y los soviéticos", "Los médicos, los pacientes y los administradores"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "El incidente en Marruecos de 1912 involucró a los judíos (Cohen), los bereberes (jeque/ladrones) y los franceses (capitán Dumari).", puntos_base: 25
  },
  {
    id: "10616-49", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Cuáles son las tres formas en que retorna 'lo colonial' a las sociedades metropolitanas según Sousa Santos?",
    opciones: ["El terrorista, los trabajadores migrantes indocumentados y los refugiados", "La música, la gastronomía y la literatura", "Los estudiantes, los diplomáticos y los inversores", "El turismo, el comercio y el arte"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "El retorno de lo colonial irrumpe mediante las figuras del terrorista, el migrante indocumentado y el refugiado.", puntos_base: 25
  },
  {
    id: "10616-50", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "En el texto de Cardinaux, ¿qué obstáculo pedagógico se señala sobre la mayéutica tradicional en el aula universitaria?",
    opciones: ["Que los alumnos se niegan a hablar en público", "Que elimina la autoridad del profesor", "Que requiere el uso obligatorio de computadoras", "Que suele ser una impostación donde el docente conduce al alumno a recrear dudas cuyo resultado ya conoce de antemano"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Se advierte que a menudo la duda no es auténtica sino simulada dentro de un plan previamente fijado por el docente.", puntos_base: 25
  },
  {
    id: "10616-51", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Según Vasilachis, la 'Epistemología del Sujeto Conocido' postula que la identidad del ser humano tiene dos componentes:",
    opciones: ["Racional e Irracional", "Biológico y Psicológico", "Esencial (común a todos que los iguala) y Existencial (diferencial de cada individuo)", "Individual y Colectivo exclusivamente"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Postula el componente Esencial (igualdad ontológica humana) y el Existencial (unicidad e historia de cada persona).", puntos_base: 25
  },
  {
    id: "10616-52", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "En las explicaciones por intenciones, disposiciones o motivos, los 'motivos disposicionales' se caracterizan por:",
    opciones: ["Ser impulsos irreflexivos e instantáneos", "Formar parte de caracterizaciones de la personalidad y conjunto de objetivos comunes del agente", "Ocurrir únicamente bajo hipnosis", "Ser causas físicas externas del entorno"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Los motivos disposicionales clasifican el objetivo como perteneciente a un conjunto que el agente persigue habitualmente.", puntos_base: 25
  },
  {
    id: "10616-53", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué es la 'inferencia clínica' en la teoría cultural propuesta por Geertz?",
    opciones: ["Generalizar DENTRO de casos particulares comenzando con un conjunto de significantes y situándolos en un marco inteligible", "Deducir leyes universales aplicables a toda la humanidad a partir de una muestra", "Predecir el comportamiento futuro de los informantes", "Un tratamiento médico para antropólogos enfermos"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "En lugar de incluir observaciones bajo una ley, la inferencia clínica diagnostica e interpreta dentro del caso particular.", puntos_base: 25
  },
  {
    id: "10616-54", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "El 'fascismo del apartheid social' se manifiesta en la cartografía urbana mediante la división entre:",
    opciones: ["Barrios antiguos y barrios modernos", "Zonas públicas y zonas estatales", "Zonas industriales y zonas agrícolas", "Zonas 'salvajes' (estado de naturaleza) y zonas 'civilizadas' (enclaves fortificados/comunidades cerradas)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Secreta una segregación entre zonas urbanas salvajes de miseria/guerra y zonas civilizadas fortificadas.", puntos_base: 25
  },
  {
    id: "10616-55", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Nancy Cardinaux sostiene que la pedagogía universitaria en Derecho debería orientarse hacia una 'pedagogía de...':",
    opciones: ["La repetición de sentencias", "La certidumbre dogmática", "La duda e incertidumbre", "La memorización del Código Civil"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Plantea la importancia de formar investigadores enseñando la duda, la incertidumbre y la revisión crítica.", puntos_base: 25
  },
  {
    id: "10616-56", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué implica el principio de 'Igualdad Esencial' en la interacción cognitiva de la Epistemología del Sujeto Conocido?",
    opciones: ["Que el sujeto conocido es ignorante y debe ser educado por el investigador", "Que ambos sujetos poseen una idéntica capacidad innata de conocer y construyen cooperativamente el conocimiento", "Que el investigador debe abandonar su título universitario", "Que los resultados cuantitativos son idénticos a los cualitativos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Extiende la igualdad ontológica al proceso de conocimiento, reconociendo igual capacidad de conocer en el sujeto conocido.", puntos_base: 25
  },
  {
    id: "10616-57", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Las explicaciones por razones (Dray) se diferencian de las explicaciones causales en que:",
    opciones: ["Reconstruyen el cálculo racional del agente sobre los medios para alcanzar un fin según sus circunstancias y creencias", "Solo se aplican a animales no humanos", "Niegan que las personas tengan objetivos", "Describen leyes físicas inmodificables"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Exponen las razones o el cálculo que hace el agente a la luz de su situación e información disponible.", puntos_base: 25
  },
  {
    id: "10616-58", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Según Geertz, ¿por qué la teoría cultural no es predictiva en el sentido de las ciencias experimentales?",
    opciones: ["Porque los antropólogos no saben matemáticas", "Porque las culturas cambian cada segundo de manera aleatoria", "Porque no sirve para nada", "Porque se orienta a generar interpretaciones diagnósticas de hechos ocurridos y su valor se prueba al interpretar nuevos casos"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "La teoría no predice estados futuros como leyes físicas, sino que proporciona un marco para diagnosticar e interpretar el flujo social.", puntos_base: 25
  },
  {
    id: "10616-59", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué es la 'Ecología de Saberes' para Boaventura de Sousa Santos?",
    opciones: ["Una teoría económica sobre el mercado de patentes", "Un estudio biológico sobre las plantas medicinales de los indígenas", "Una contra-epistemología basada en el reconocimiento de la pluralidad de conocimientos heterogéneos y su interacción dinámica", "La destrucción de la ciencia moderna para reemplazarla por supersticiones"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Es el reconocimiento e interacción de saberes diversos (científicos y no científicos) sin jerarquías abismales abstractas.", puntos_base: 25
  },
  {
    id: "10616-60", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "En relación con las pericias científicas en los juicios, Cardinaux sugiere que el abogado debe formar destrezas de investigación para:",
    opciones: ["Aceptar ciegamente cualquier informe pericial sin cuestionarlo", "Valorar críticamente el proceso de producción y validación de la prueba científica y no depender pasivamente del perito", "Reemplazar al juez en la sentencia final", "Eliminar a los peritos de todos los procesos judiciales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Permite evaluar la validez del proceso científico pericial y argumentar sobre su mérito probatorio.", puntos_base: 25
  },
  {
    id: "10616-61", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Según Vasilachis, la 'Metaepistemología':",
    opciones: ["Contiene y complementa tanto la Epistemología del Sujeto Cognoscente como la del Sujeto Conocido sin excluirse", "Es un método exclusivamente matemático", "Se aplica únicamente a las ciencias naturales", "Reemplaza y destruye a la Epistemología del Sujeto Cognoscente"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La Metaepistemología abarca y articula ambas epistemologías, rescatando las exigencias de rigor y el respeto integral al sujeto.", puntos_base: 25
  },
  {
    id: "10616-62", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué problema plantea Schuster respecto a considerar la causalidad como una 'conexión necesaria' entre evento A y evento B?",
    opciones: ["Que la lógica rechaza las relaciones entre hechos", "Que el concepto de causa fue prohibido por las ciencias físicas", "Que es un postulado demasiado fácil de probar empíricamente", "Que empíricamente un hecho puede tener múltiples causas posibles y lógicamente conduce a la falacia de afirmación del consecuente"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Demuestra que pretender la necesidad de la causa es empíricamente restrictivo y genera invalidez lógica formal.", puntos_base: 25
  },
  {
    id: "10616-63", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Frente al problema del etnocentrismo y el subjetivismo, Geertz propone que la defensa contra el esteticismo vacío en antropología es:",
    opciones: ["Abandonar el estudio de los símbolos", "Encerrarse en ecuaciones matemáticas puras", "Realizar el análisis de las duras realidades políticas, económicas y necesidades biológicas dentro de las cuales están los hombres", "Inventar datos ficticios sin hacer trabajo de campo"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El análisis cultural debe mantener contacto con las superficies duras de la vida (política, economía, violencia, biología).", puntos_base: 25
  },
  {
    id: "10616-64", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "El proceso por el cual el conocimiento científico moderno provocó la destrucción y supresión masiva de saberes locales e indígenas en los últimos 5 siglos se denomina:",
    opciones: ["Filicidio", "Epistemicidio", "Homicidio epistémico", "Genocidio lingüístico exclusivamente"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Sousa Santos llama 'epistemicidio' a la eliminación de formas de conocimiento alternativas por parte de la ciencia hegemónica.", puntos_base: 25
  },
  {
    id: "10616-65", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "El 'subargumento probatorio' dentro del argumento profesionalista en Derecho enfatiza que:",
    opciones: ["El proceso judicial incorpora cada vez más datos de las ciencias que requieren conocer cómo fueron validados", "Las pruebas testimoniales son superiores a las periciales", "La investigación científica debe prohibirse en los tribunales", "Los abogados deben aprender a redactar contratos comerciales internacionales"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Destaca que la prueba judicial recurre crecientemente a datos científicos cuya lógica el abogado debe comprender.", puntos_base: 25
  },
  {
    id: "10616-66", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué papel juega la reflexividad del investigador en la metodología cualitativa según Flick y Vasilachis?",
    opciones: ["Es un error subjetivo que invalida la investigación", "Se aplica solo en los estudios cuantitativos", "Ninguno, el investigador debe ser un observador invisible y neutro", "Las reflexiones, impresiones y comunicación del investigador en el campo forman parte explícita de los datos y de la producción de conocimiento"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "La subjetividad del investigador y su comunicación con el campo son parte de los datos y de la interpretación.", puntos_base: 25
  },
  {
    id: "10616-67", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿En qué consiste la 'Explicación Genética' según Brown y Schuster?",
    opciones: ["En predecir genéticamente el comportamiento humano", "En analizar el ADN de los sujetos estudiados", "En formular enunciados que transmiten informes/descripciones de sucesos y procesos específicos fechados o fechables que explican el origen de un estado de cosas", "En aplicar leyes universales de la física cuántica a la historia"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Suministra un informe de sucesos específicos y fechables que constituyen la secuencia que originó el fenómeno final.", puntos_base: 25
  },
  {
    id: "10616-68", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué rasgo caracteriza a la postura semiótica de la cultura frente a la distinción entre 'objetivo' y 'subjetivo'?",
    opciones: ["Considera que la cultura es totalmente subjetiva en la mente", "Considera que la cuestión está mal planteada; la conducta es acción simbólica y la cultura es pública porque la significación lo es", "Afirma que la cultura es un objeto físico como una roca", "Niega la existencia de los símbolos públicos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Una vez vista la conducta como acción simbólica, pierde sentido la dicotomía; la cultura es pública como la significación.", puntos_base: 25
  },
  {
    id: "10616-69", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "La 'traducción intercultural' en la Ecología de Saberes permite:",
    opciones: ["Identificar preocupaciones comunes, complementariedades y contradicciones entre diferentes sistemas de conocimiento sin reducir uno al otro", "Traducir automáticamente todos los idiomas al inglés", "Eliminar las diferencias culturales de la humanidad", "Demostrar que la cultura occidental es superior a las demás"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Busca crear inteligibilidad recíproca entre saberes heterogéneos mediante la identificación de atavíos y sentidos compartidos.", puntos_base: 25
  },
  {
    id: "10616-70", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué sostiene Boaventura de Sousa Santos respecto a la 'investigación-acción' citada por Cardinaux en el ámbito universitario?",
    opciones: ["Que los estudiantes no deben participar en proyectos sociales", "Que la investigación sólo debe servir a grandes corporaciones", "Que la universidad debe privatizarse por completo", "Combina investigación y extensión mediante la participación de la comunidad para resolver necesidades de grupos populares sin poder mercantil"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Promueve la investigación-acción participativa articulada con las necesidades de comunidades y grupos subalternos.", puntos_base: 25
  },
  {
    id: "10616-71", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Qué es el 'Clinamen' y qué función cumple en el pensamiento postabismal según Sousa Santos?",
    opciones: ["Un fallo epistemológico de los conocimientos indígenas", "Un instrumento de medición del clima en zonas coloniales", "Un desvío leve y espontáneo (tomado de Epicuro) que altera la causalidad rutinaria y permite la acción creativa/rebelde no conformista", "Una ley de la física newtoniana que garantiza el determinismo"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Tomado de Epicuro/Lucrecio, es la capacidad de desvío espontáneo que fundamenta la acción creadora y no reproductiva.", puntos_base: 50
  },
  {
    id: "10616-72", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En la Epistemología del Sujeto Conocido, ¿cómo se redefine el concepto tradicional de 'Validez' del conocimiento científico?",
    opciones: ["Se mide únicamente por la replicación cuantitativa en laboratorio", "Se logra en la medida en que no se tergiverse la identidad (dimensiones esencial y existencial) del sujeto conocido ni se lo considere mero objeto", "Depende del nivel de ingresos del investigador", "Se obtiene aplicando el modelo de las ciencias naturales a la sociedad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "La validez depende de captar integralmente la identidad del sujeto conocido sin desmembrarla ni objetivarla.", puntos_base: 50
  },
  {
    id: "10616-73", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Cómo resuelve Schuster el dilema sobre si las teorías científicas son 'descripciones de la realidad' o 'instrumentos de explicación y predicción'?",
    opciones: ["Sosteniendo que ambas funciones son perfectamente compatibles, pues los enunciados describen la realidad de forma indirectamente confirmable", "Afirmando que las teorías son ficciones falsas", "Eliminando el concepto de teoría del ámbito científico", "Afirmando que son exclusivamente instrumentos sin relación con la realidad"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Schuster demuestra que describir y explicar/predecir son compatibles y se complementan en el conocimiento científico.", puntos_base: 50
  },
  {
    id: "10616-74", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Qué crítica formula Geertz al modelo etnográfico del 'laboratorio natural' (ej. Isla de Pascua)?",
    opciones: ["Que solo funciona en países industrializados", "Que la antropología debe realizarse únicamente en laboratorios cerrados", "Que es un modelo perfecto pero demasiado caro", "Que es una analogía falsa porque en la sociedad no se pueden manipular parámetros aislados y los datos no son 'más puros'"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Critica la falsa analogía con el laboratorio físico, pues el contexto cambia con las variables y los datos no son privilegios puros.", puntos_base: 50
  },
  {
    id: "10616-75", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Dentro del pensamiento abismal, la dicotomía entre 'Sociedad Civil' y 'Estado de Naturaleza' oculta que:",
    opciones: ["La sociedad civil es incompatible con el capitalismo", "Todos los países del mundo alcanzaron la sociedad civil en el siglo XIX", "La creación de la sociedad civil metropolitana exige la creación masiva de una región mundial condenada al estado de naturaleza al otro lado de la línea", "El estado de naturaleza nunca existió en América"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "El contrato social metropolitano silencia que su existencia presupone el estado de naturaleza permanente para las colonias.", puntos_base: 50
  },
  {
    id: "10616-76", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Según Vasilachis, la resistencia a la 'naturalización del mundo social' en el paradigma interpretativo implica que:",
    opciones: ["La sociedad se rige por las mismas leyes físicas que los planetas", "La sociedad es una producción humana donde prima el análisis de motivos, valores y significados sobre la búsqueda de causalidad estricta y predicción", "Se deben eliminar los estudios sobre la naturaleza", "Los actores sociales actúan por instinto animal inmodificable"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "La sociedad es una construcción donde la comprensión del sentido prima sobre la búsqueda de leyes causales físicas.", puntos_base: 50
  },
  {
    id: "10616-77", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En el texto de Cardinaux, el contraste generacional entre el neurocirujano Perowne y su hijo Theo en la novela de McEwan sirve para reflexionar sobre:",
    opciones: ["La capacidad y disponibilidad de dudar de las nuevas generaciones que han crecido en contextos sinceros pero descreídos sin certidumbres institucionales de las que dudar", "La necesidad de imponer exámenes militares en las facultades", "El aumento de las matrículas en la carrera de medicina", "La velocidad de la conexión a internet en las aulas"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ilustra las transformaciones generacionales respecto a la existencia de certezas y la disponibilidad hacia la duda genuina.", puntos_base: 50
  },
  {
    id: "10616-78", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿A qué llama Boaventura de Sousa Santos 'Cosmopolitismo Subalterno'?",
    opciones: ["A la imposición del idioma inglés en la educación básica", "A un modelo de las Naciones Unidas para unificar las leyes penales", "Al turismo de lujo realizado por elites de países periféricos", "A las iniciativas y movimientos de la globalización contrahegemónica que luchan contra la exclusión neoliberal desde el principio de igualdad y diferencia"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Es la variedad oposicional de globalización organizada por grupos subalternos (ej. Foro Social Mundial, movimientos indígenas).", puntos_base: 50
  },
  {
    id: "10616-79", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Qué diferencia existe entre la 'probabilidad estadística' y la 'probabilidad lógica/inductiva' según Carnap y Hempel en la explicación estadística?",
    opciones: ["La probabilidad estadística no utiliza números", "Son términos idénticos sin diferencia", "La probabilidad estadística es la frecuencia relativa en una clase de sucesos; la probabilidad lógica es el grado de credibilidad racional que el explanans confiere al explanandum", "La probabilidad lógica mide la velocidad de un objeto"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Distingue la frecuencia relativa empírica de la relación del apoyo inductivo entre enunciados (grado de credibilidad).", puntos_base: 50
  },
  {
    id: "10616-80", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Paul Ricoeur, citado por Geertz, responde a la pregunta '¿Qué fija la escritura en la inscripción etnográfica?' afirmando que se fija:",
    opciones: ["El acto físico de hablar y la articulación sonora", "'Lo dicho' en el hablar, es decir, el noema o la significación del evento de habla, no el hecho como hecho perecedero", "La gramática formal del idioma nativo", "Las opiniones personales del antropólogo sobre sus colegas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Fija la significación o 'lo dicho' del discurso social, rescatando el pensamiento o intención de su momento perecedero.", puntos_base: 50
  },
  {
    id: "10616-81", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Según Vasilachis, la 'Epistemología del Sujeto Conocido' modifica la relación entre teoría e investigación empírica en América Latina porque:",
    opciones: ["Permite crear conceptos y teorías originales a partir de los datos locales sin subordinarse a teorías legitimadas que encubren la opresión", "Prohíbe el uso de libros de autores europeos", "Sostiene que no se puede investigar en países en desarrollo", "Exige verificar ciegamente las teorías producidas en los países centrales"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Habilita la creación teórica desde la realidad empírica latinoamericana frente a teorías centrales inadecuadas.", puntos_base: 50
  },
  {
    id: "10616-82", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Qué es el 'fascismo territorial' según Sousa Santos?",
    opciones: ["El cobro de impuestos por parte del Estado nacional", "La delimitación de parques nacionales protegidos", "La división de un país en provincias democráticas", "La situación donde actores con fuerte capital patrimonial/militar disputan o coerced las instituciones del Estado y ejercen regulación despótica sobre los habitantes del territorio"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Ocurre cuando terratenientes, señores de la guerra o mafias ejercen control despótico en un territorio neutralizando al Estado.", puntos_base: 50
  },
  {
    id: "10616-83", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En el análisis de las explicaciones por intenciones, ¿cuáles son los elementos indispensables que deben estar presentes según Brown?",
    opciones: ["Que la acción sea obligada por una fuerza física externa", "Una ley física universal y una medición matemática", "Que el agente conozca su objetivo, crea que su acción es un medio para lograrlo y crea que tratará de lograrlo cuando le sea posible", "Que el agente actúe de manera totalmente inconsciente"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Exige la consciencia del objetivo por parte del agente y la creencia en la conexión causal entre la acción y el fin.", puntos_base: 50
  },
  {
    id: "10616-84", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "La metáfora del cuento indio sobre las 'tortugas' al final del ensayo de Geertz ilustra que:",
    opciones: ["La antropología descubrió el origen biológico del universo", "El análisis cultural es intrínsecamente incompleto y cuanto más profundamente se realiza, más trémulas son sus bases", "Las culturas son lentas como las tortugas", "Existe una verdad absoluta y definitiva en las ciencias sociales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Muestra que el análisis cultural no tiene un fondo absoluto o definitivo, es una discusión abierta e incompleta.", puntos_base: 50
  },
  {
    id: "10616-85", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "La diferencia entre 'acción conformista' y 'acción-con-clinamen' radica en que la primera es repetitiva y rutinaria, mientras la segunda:",
    opciones: ["Es una desviación leve y creativa que asume y redime el pasado pero se desvía de él, cruzando líneas abismales", "Es la obediencia estricta a las leyes del mercado capitalista", "Es una acción irrazonable que carece de todo sentido", "Es una revolución violenta que destruye todo el pasado"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Es una práctica desestabilizadora que no rompe dramáticamente sino que introduce un desvío creativo y liberador.", puntos_base: 50
  },
  {
    id: "10616-86", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En la 'Epistemología del Sujeto Conocido', el proceso de conocimiento es considerado como:",
    opciones: ["Una encuesta cuantitativa estandarizada", "Un monólogo del investigador traducido a lenguaje académico", "Un extractivismo de datos donde el investigador se lleva la información", "Una construcción cooperativa en la que sujetos esencialmente iguales realizan aportes diferentes empleando distintas formas de conocer"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Define el conocimiento como una construcción cooperativa entre iguales con aportes diferenciales.", puntos_base: 50
  },
  {
    id: "10616-87", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Al analizar los modelos de jurista y la investigación, Cardinaux y Santos proponen superar el perfil profesionalista tradicional mediante:",
    opciones: ["El aumento de los aranceles universitarios", "La eliminación completa de la carrera de Derecho", "La articulación de investigación-acción y extensión para responder a minorías y sectores desposeídos sin poder mercantil", "La formación exclusiva de jueces para el ámbito corporativo"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Promueve un perfil de egresado comprometido con la provisión de derechos a grupos vulnerables mediante investigación-acción.", puntos_base: 50
  },
  {
    id: "10616-88", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Por qué Schuster sostiene que el argumento de la 'unicidad e irrepetibilidad' de los acontecimientos humanos no invalida la explicación causal en ciencias sociales?",
    opciones: ["Porque los seres humanos son máquinas idénticas", "Porque las leyes causales no exigen la repetición de casos individuales únicos, sino la repetición de las características específicas antecedentes", "Porque en historia no existen eventos únicos", "Porque las ciencias sociales no estudian a los seres humanos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Aclara que todo evento singular es único, pero las leyes causales vinculan clases de características recurrentes.", puntos_base: 50
  },
  {
    id: "10616-89", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Frente al dilema entre la variación cultural y la unidad biológica de la humanidad, Geertz señala que la gran variación de formas culturales es:",
    opciones: ["El gran recurso de la antropología y el terreno de su más profundo dilema teórico", "Una ilusión provocada por errores de traducción", "La prueba de que los hombres pertenecen a especies distintas", "Un experimento de laboratorio controlado"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "La diversidad cultural es el recurso central y el dilema de cómo concatenar esa variación con la entidad humana.", puntos_base: 50
  },
  {
    id: "10616-90", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "La 'cartografía sucia' a la que conducen las nuevas líneas abismales se ejemplifica metafóricamente en el texto con:",
    opciones: ["Los mapas turísticos de las capitales europeas", "Las fronteras fluviales entre países sudamericanos", "Las rutas comerciales marítimas del siglo XVI", "El muro israelí de segregación en Palestina y la categoría de 'combatiente enemigo ilegal'"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Ejemplifica el serpenteo de la línea abismal interna mediante los muros físicos de segregación y limbos jurídicos.", puntos_base: 50
  },
  {
    id: "10616-91", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "Según Vasilachis, la 'Epistemología del Sujeto Conocido' surge históricamente de su investigación empírica sobre:",
    opciones: ["Los agricultores de la pampa húmeda argentina", "Los estudiantes universitarios de clase alta en Europa", "Las personas en situación de pobreza extrema que viven 'en la calle' en la ciudad de Buenos Aires", "Los empresarios multinacionales en América del Norte"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Surgió del estudio de la pobreza extrema y las personas que viven en la calle en Buenos Aires.", puntos_base: 50
  },
  {
    id: "10616-92", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En el modelo hipotético-deductivo de explicación (Popper), las leyes utilizadas en el explanans se caracterizan por ser:",
    opciones: ["Verdades absolutas e dogmáticas e inmutables", "Hipótesis de teorías suficientemente corroboradas pero susceptibles de revisión", "Meticulosas descripciones sin valor teórico", "Sentencias judiciales firmes"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Popper permite que las leyes sean concebidas como hipótesis bien corroboradas en el seno de teorías.", puntos_base: 50
  },
  {
    id: "10616-93", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Por qué Geertz sostiene que la coherencia 'hermética' de un sistema cultural puede ser peligrosa para el análisis?",
    opciones: ["Porque impide que los libros de antropología sean publicados", "Porque los informantes se niegan a hablar si hay coherencia", "Porque la lingüística estructural exige el caos", "Porque oculta la lógica informal de la vida real y hunde el análisis en el esquematismo"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Advierte que la búsqueda de cuadros formales impecables cierra las puertas a la lógica informal de la acción real.", puntos_base: 50
  },
  {
    id: "10616-94", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "La noción de 'Monocultura del saber' en el pensamiento abismal se combate mediante:",
    opciones: ["La prohibición de las universidades", "La eliminación de la investigación tecnológica", "La imposición de una nueva teoría científica única", "La Ecología de Saberes y la valoración del interconocimiento"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Contrapone la monocultura científica a la ecología de saberes basada en el interconocimiento.", puntos_base: 50
  },
  {
    id: "10616-95", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En el texto de Cardinaux, la crítica de Steiner al seminario de Popper resalta la paradoja de que:",
    opciones: ["La falsabilidad fue demostrada como matemática pura", "Popper no sabía hablar inglés", "Aunque en su teoría el error y la falsabilidad eran esenciales, en la práctica el maestro no recibía con gusto las críticas de sus discípulos", "Popper no permitía la entrada de mujeres a sus clases"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Señala la contradicción entre la pedagogía del error proclamada en la teoría y el gesto autoritario en el aula.", puntos_base: 50
  },
  {
    id: "10616-96", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Qué exige la Epistemología del Sujeto Conocido al investigador en términos de su propia actitud personal?",
    opciones: ["Mantener una distancia emocional helada e indiferente", "Convertirse en un igual pero distinto, abriendo su ser a la conmoción y transformación por la manifestación del sujeto conocido", "Reemplazar su lenguaje por señas no verbales únicamente", "Ceder su autoría científica a las instituciones estatales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Exige la conversión en un igual, abriéndose a ser conmocionado y transformado durante el proceso de investigación.", puntos_base: 50
  },
  {
    id: "10616-97", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "En las explicaciones funcionales en ciencias sociales, Stinchcombe señala que se propone una explicación funcional cuando:",
    opciones: ["Existe una uniformidad en las consecuencias de la acción pero una gran variedad de comportamientos que causan esas consecuencias", "Los individuos actúan sin ningún tipo de motivación", "La causa antecedente es un fenómeno biológico simple", "No existe ninguna consecuencia observable"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ocurre cuando las consecuencias son uniformes aunque los comportamientos para lograrlas sean diversos (ej. pautas de herencia).", puntos_base: 50
  },
  {
    id: "10616-98", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "La finalidad última de la antropología interpretativa según Geertz es:",
    opciones: ["Gobernar las colonias mediante el control de la información", "Elaborar leyes matemáticas de la conducta social", "Convertir a todos los seres humanos en antropólogos", "Ampliar el universo del discurso humano y darnos acceso a respuestas dadas por otros en otros valles"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Busca ampliar el universo del discurso humano, registrando las respuestas dadas por otras culturas.", puntos_base: 50
  },
  {
    id: "10616-99", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Qué diferencia a la 'exclusión abismal' de la 'exclusión no abismal'?",
    opciones: ["Son conceptos sinónimos en la obra de Sousa Santos", "La exclusión abismal es económica y la no abismal es política", "La exclusión abismal produce la no-existencia y subhumanidad del excluido, negando la posibilidad de co-presencia", "La exclusión no abismal ocurre solo en el espacio colonial"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La exclusión abismal niega la humanidad misma y declara no-existente al otro lado, impidiendo la inclusión tradicional.", puntos_base: 50
  },
  {
    id: "10616-100", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "¿Cuál es la conclusión de Irene Vasilachis sobre 'qué hay de nuevo en la metodología cualitativa'?",
    opciones: ["Nada en absoluto, es una copia del positivismo del siglo XIX", "Nada y todo a la vez: nada si se ve como extensión de tradiciones; todo si se admite la necesidad de modificar los presupuestos ontológicos sobre la identidad humana", "Todo, porque se inventó hace dos años en Estados Unidos", "Nada, porque la investigación cualitativa ha dejado de existir"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Concluye que es 'nada y todo a la vez', siendo revolucionaria si se acepta la transformación ontológica de la identidad humana.", puntos_base: 50
  },
{
    id: "10112-01", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál es la diferencia fundamental entre el Poder Constituyente Originario y el Poder Constituyente Derivado?",
    opciones: ["El originario solo puede ser ejercido por el Poder Ejecutivo, mientras que el derivado depende de la Corte Suprema.", "El originario rige exclusivamente para los gobiernos provinciales y el derivado para el gobierno nacional.", "El originario se aplica únicamente en situaciones de guerra exterior y el derivado en tiempos de paz.", "El originario no tiene límites jurídicos previos y crea la Constitución, mientras que el derivado la reforma respetando los límites del texto constitucional vigente."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-02", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "De acuerdo con el artículo 31 de la Constitución Nacional argentina, ¿qué principio jurídico establece la jerarquía donde la Constitución, las leyes nacionales y los tratados internacionales son la ley suprema de la Nación?",
    opciones: ["Federalismo de concertación", "Autonomía municipal", "Control de convencionalidad", "Supremacía constitucional"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-03", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué corriente historiográfica argentina cuestionó la narrativa oficial de Bartolomé Mitre, revalorizando la figura de los caudillos y buscando revisar la interpretación liberal de la historia?",
    opciones: ["El Materialismo Histórico Ortodoxo", "La Historiografía Positivista", "El Revisionismo Histórico", "La Escuela Nueva Histórica"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-04", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál es la característica distintiva de la etapa del \"Constitucionalismo Social\" surgida a comienzos del siglo XX?",
    opciones: ["El reconocimiento exclusivo de los derechos individuales y de libertad civil.", "La inclusión de derechos laborales, de la seguridad social y el rol activo del Estado en la economía.", "La eliminación completa de la división de poderes en el esquema constitucional.", "La prohibición absoluta de la propiedad privada de los medios de producción."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-05", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "En el sistema constitucional argentino, ¿cómo se clasifica el control de constitucionalidad?",
    opciones: ["Judicial, difuso y con efectos para el caso concreto.", "Ejecutivo y previo a la sanción de la ley.", "Popular, mediante consulta plebiscitaria obligatoria.", "Político y concentrado en un Tribunal Constitucional especial."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-06", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué títulos jurídicos sirvieron de fundamento inicial a la Corona de Castilla para justificar la dominación de los territorios americanos descubiertos?",
    opciones: ["El Real Patronato Vicariato y las Leyes de Burgos.", "El Tratado de Utrecht y las Ordenanzas de Intendentes.", "Las Capitulaciones de Santa Fe y la Ley de Indias.", "Las Bulas Alejandrinas expedidas por el Papa Alejandro VI."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-07", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué acuerdo firmado entre España y Portugal en 1494 trazó un meridiano para delimitar las zonas de exploración y conquista en el Océano Atlántico?",
    opciones: ["Tratado de Utrecht", "Tratado de Madrid", "Tratado de Tordesillas", "Tratado de San Ildefonso"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-08", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué condición jurídica se le otorgó legalmente a los indígenas americanos bajo las Leyes de Indias promulgadas por la Corona Española?",
    opciones: ["Esclavos de guerra sin derecho de propiedad.", "Vasallos libres de la Corona pero considerados menores de edad sujetos a tutela.", "Ciudadanos con plenitud de derechos políticos y representación ante las Cortes.", "Extranjeros residentes en territorios feudales del Rey."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-09", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué institución con sede en España tenía entre sus funciones principales asesorar al Rey, redactar las Leyes de Indias y actuar como máximo tribunal de apelación para los asuntos americanos?",
    opciones: ["El Real y Supremo Consejo de Indias", "La Real Audiencia", "El Cabildo Abierto", "La Casa de Contratación"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-10", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál era la función principal de la Casa de Contratación de Sevilla creada en 1503?",
    opciones: ["Ejercer la conducción militar de las tropas enviadas a las colonias.", "Juzgar los delitos comunes cometidos dentro del territorio americano.", "Controlar el monopolio comercial y fiscalizar la navegación entre España y las Indias.", "Elegir a los miembros del Consejo de Indias y nombrar Obispos."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-11", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál de los siguientes organismos instalados en América poseía funciones predominantemente judiciales y de control sobre los funcionarios coloniales?",
    opciones: ["La Capitanía General", "El Cabildo", "La Real Audiencia", "El Consulado"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-12", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿En qué consistía el mecanismo de control institucional denominado \"Juicio de Residencia\"?",
    opciones: ["Una inspección sorpresiva que un funcionario enviado por el Rey realizaba a una gobernación en cualquier momento.", "Un proceso judicial al que era sometido todo funcionario al terminar su mandato para evaluar su desempeño e investigar posibles irregularidades.", "Un trámite judicial mediante el cual los indígenas solicitaban la exención de los tributos de la encomienda.", "Una prueba de fe católica exigida a los comerciantes extranjeros para residir en América."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-13", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué diferencia existía entre un \"Juicio de Residencia\" y una \"Visita\" durante el periodo colonial hispánico?",
    opciones: ["El Juicio de Residencia se aplicaba obligatoriamente al finalizar la gestión del funcionario; la Visita era una inspección extraordinaria e imprevista realizada durante el ejercicio del cargo.", "El Juicio de Residencia era un trámite eclesiástico y la Visita era una auditoría comercial.", "Ambas instituciones eran idénticas y se aplicaban simultáneamente cada diez años.", "La Visita se realizaba al finalizar el mandato; el Juicio de Residencia era sorpresivo durante la gestión."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-14", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué medida clave de las Reformas Borbónicas en el siglo XVIII reestructuró territorial y administrativamente el sur de América del Sur en 1776?",
    opciones: ["La firma del Tratado del Pilar.", "La disolución de las Reales Audiencias de Charcas y Buenos Aires.", "La creación del Virreinato de Nueva Granada.", "La creación del Virreinato del Río de la Plata."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-15", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué sistema dictado en 1782 modificó la administración interna del Virreinato del Río de la Plata para centralizar la recaudación fiscal y descentralizar el control regional?",
    opciones: ["La Ley de Consolidación de Vales Reales", "La Real Ordenanza de Intendentes", "El Reglamento de Libre Comercio", "El Código de Comercio Colonial"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-16", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué consecuencia política local tuvieron las Invasiones Inglesas (1806-1807) en Buenos Aires respecto a la autoridad colonial?",
    opciones: ["El fortalecimiento del monopolio comercial español y el prestigio del virrey Sobremonte.", "La destitución del virrey Sobremonte por el Cabildo y el nacimiento de milicias urbanas locales criollas.", "La inmediata proclamación de la independencia absoluta de Inglaterra y España.", "La disolución de los Consulados de Comercio y de las Reales Audiencias."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-17", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué suceso ocurrido en Europa en 1808 desencadenó la crisis de legitimidad del trono español e inició el proceso revolucionario en las colonias?",
    opciones: ["La abdicación de Carlos IV y Fernando VII en Bayona a favor de Napoleón Bonaparte.", "La derrota de la Armada Española en la Batalla de Trafalgar.", "La firma del Congreso de Viena por parte del Fernando VII.", "La Revolución Francesa y la ejecución de Luis XVI."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-18", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué doctrina jurídica invocaron los patriotas americanos tras la caída de la Junta Central de Sevilla en 1810 para asumir el gobierno?",
    opciones: ["El Derecho Internacional de Gentes codificado en los Tratados de Utrecht.", "La Ley de Intendencias y los Fueros de Aragón.", "La doctrina de la Divinidad del Rey.", "La Retroversión de la Soberanía al Pueblo en ausencia del Monarca legítimo."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-19", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "Durante el Cabildo Abierto del 22 de mayo de 1810, ¿cuál fue el argumento central formulado por el obispo Benito Lué y Riega?",
    opciones: ["Que la soberanía pertenecía exclusivamente al Cabildo de Montevideo.", "Que mientras existiera un español en América, ese español debía mandar sobre los criollos.", "Que el pueblo debía ejercer inmediatamente el sufragio universal para elegir presidente.", "Que las provincias del interior debían independizarse antes que Buenos Aires."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-20", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "Durante el Cabildo Abierto del 22 de mayo de 1810, ¿cuál fue la postura sostenida por Juan José Castelli?",
    opciones: ["Sostuvo que caducado el gobierno legítimo en España, el poder volvía al pueblo y este debía reasumirlo.", "Propuso declarar la fidelidad incondicional al nuevo monarca José Bonaparte.", "Sugirió postergar la decisión hasta recibir tropas del Alto Perú.", "Defendió la permanencia indefinida del Virrey Baltasar Hidalgo de Cisneros al frente de la Junta."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-21", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál fue el matiz introducido por Manuel Genaro Villota en el debate del Cabildo Abierto del 22 de mayo de 1810?",
    opciones: ["Argumentó que los vecinos de Buenos Aires no podían por sí solos cambiar el gobierno sin consultar al resto de las provincias del Virreinato.", "Negó de manera categórica que el rey Fernando VII estuviera preso en Francia.", "Exigió la disolución inmediata del Cabildo y la abolición del Consulado de Comercio.", "Sostuvo que Buenos Aires tenía el derecho exclusivo e indiscutible de elegir el gobierno por toda la América del Sur."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-22", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cómo reatiñó Juan José Paso al argumento planteado por Villota el 22 de mayo de 1810?",
    opciones: ["Propuso ceder la capitalidad del país a la ciudad de Córdoba.", "Exigió que la decisión fuera sometida a la aprobación de la Real Audiencia.", "Aceptó esperar la llegada de las actas votadas por todas las provincias del interior.", "Sostuvo la doctrina de la \"hermana mayor\": Buenos Aires debía actuar como tutora y tomar la iniciativa urgente, invitando luego a las provincias."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-23", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cómo quedó integrada la Primera Junta de Gobierno establecida el 25 de mayo de 1810?",
    opciones: ["Encabezada por Bernardino Rivadavia bajo el título de Director Supremo.", "Presidida por Baltasar Hidalgo de Cisneros con vocales criollos.", "Presidida por Cornelio Saavedra, con Secretarios Mariano Moreno y Juan José Paso.", "Presidida por Manuel Belgrano, con el apoyo de las milicias de Santiago de Liniers."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-24", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué documento redactado por Mariano Moreno reflejó la línea más radical, jacobina y de control revolucionario estricto durante la Primera Junta?",
    opciones: ["La Representación de los Hacendados", "El Plan Operativo de Operaciones", "El Reglamento de la División de Poderes de 1811", "La Carta a los Pueblos del Interior"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-25", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál fue el motivo de la renuncia de Mariano Moreno a la Primera Junta en diciembre de 1810?",
    opciones: ["Su rechazo rotundo a la creación de banderas y símbolos patrios por Manuel Belgrano.", "La derrota militar de la Expedición al Paraguay en la Batalla de Tacuarí.", "La decisión de reinstaurar el Virreinato bajo tutela británica.", "Su oposición a la incorporación de los diputados del interior al ejecutivo, impulsada por Saavedra, creando la Junta Grande."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-26", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué organismo ejecutivo de gobierno reemplazó a la Junta Grande en septiembre de 1811 buscando concentrar el poder central?",
    opciones: ["El Directorio Supremo", "El Consejo de Regencia", "La Junta Conservadora", "El Primer Triunvirato"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-27", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué hecho político precipitó la caída del Primer Triunvirato en la Revolución del 8 de octubre de 1812?",
    opciones: ["El rechazo del Estatuto Provisional de 1815 por el Cabildo.", "La derrota patriotica en la Batalla de Huaqui.", "La acción combinada de la Logia Lautaro y la Sociedad Patriótica lideradas por San Martín y Alvear.", "El desembarco militar hispano en la ciudad de Rosario."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-28", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Cuál fue uno de los principales propósitos con los que fue convocada la Asamblea del Año XIII?",
    opciones: ["Firmar un pacto de neutralidad con el Imperio del Brasil y disolver los ejércitos patrios.", "Declarar la Independencia formal y sancionar una Constitución para las Provincias Unidas.", "Entregar la soberanía de las Provincias Unidas a la Corona Británica.", "Reinstaurar el sistema de Intendencias coloniales español."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-29", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "A pesar de no lograr declarar la independencia ni sancionar una constitución, ¿cuál de las siguientes fue una medida de trascendencia aprobada por la Asamblea del Año XIII?",
    opciones: ["La sanción de la Ley de Inmigración y la fundación del Banco Nacional.", "La creación de la figura del Presidente de la Nación Argentina.", "La adopción de la religión protestante como religión oficial.", "La abolición de la Inquisición, de los títulos de nobleza y la proclamación de la Libertad de Vientres."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-30", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué actitud adoptó la Asamblea del Año XIII frente a los diputados enviados por José Gervasio Artigas en representación de la Banda Oriental?",
    opciones: ["Los designó diplomáticos plenipotenciarios ante la Santa Sede.", "Los encarceló bajo cargos de traición al absolutismo español.", "Los incorporó inmediatamente nombrándolos autoridades de la Asamblea.", "Rechazó sus diplomas invocando vicios de forma, en realidad para frenar el ideario federal expresado en las Instrucciones Orientales."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-31", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué tres principios fundamentales exigían las Instrucciones del Año XIII redactadas por Artigas para los diputados orientales?",
    opciones: ["Anexión a las provincias de Cuyo, alianza militar con España y catolicismo obligatorio.", "Monarquía constitucional, centralismo político y libertad de comercio colonial.", "Independencia absoluta, República y un sistema Federal de gobierno.", "Autonomía municipal, sumisión al Poder Ejecutivo de Buenos Aires y proteccionismo aduanero."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-32", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué cargo unipersonal creó la Asamblea del Año XIII en enero de 1814 para unificar la conducción política y militar del Estado?",
    opciones: ["Presidente de la Nación", "Director Supremo de las Provincias Unidas del Río de la Plata", "Protector de los Pueblos Libres", "Regente Gubernativo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-33", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué liga de provincias constituyó José Artigas en 1815 para oponerse al centralismo del Directorio porteño?",
    opciones: ["La Liga de los Pueblos Libres (o Liga Federal)", "El Pacto de la Confluencia", "La Confederación Argentina", "La Liga del Interior"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 10
  },
{
    id: "10112-34", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿En qué ciudad se reunió el Congreso Soberano que declaró la Independencia de las Provincias Unidas en 1816?",
    opciones: ["Concepción del Uruguay", "Santa Fe", "Buenos Aires", "San Miguel de Tucumán"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-35", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Cuál fue el contexto internacional dominante en Europa al momento de la reunión del Congreso de Tucumán entre 1815 y 1816?",
    opciones: ["La independencia de Grecia y el afianzamiento de la República en Francia.", "El auge de las revoluciones liberales europeas y la expansión de Napoleón Bonaparte.", "La Restauración Absolutista tras el Congreso de Viena y la creación de la Santa Alianza.", "El estallido de la Primera Guerra Mundial y el fin de los imperios coloniales."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-36", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué adición aprobó el Congreso de Tucumán el 19 de julio de 1816 al acta original de la Declaración de la Independencia?",
    opciones: ["La frase \"y de toda otra dominación extranjera\", para cerrar el paso a proyectos de protectorado portugués o británico.", "El establecimiento del sistema federal republicano como forma definitiva.", "La designación de José de San Martín como Rey de las Provincias Unidas.", "La cesión de la provincia de Tarija al Virreinato del Perú."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-37", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué propuesta organizativa respecto a la forma de gobierno fue debatida en el Congreso de Tucumán por Manuel Belgrano y apoyada por San Martín?",
    opciones: ["La coronación de una Monarquía Constitucional Incaica integrada con el Río de la Plata.", "El establecimiento de un Triunvirato Vitalicio con sede en Córdoba.", "La división del país en tres reinos independientes.", "La instauración de una República Federal presidencialista."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-38", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué carácter tenía la Constitución de 1819 sancionada por el Congreso tras su traslado a Buenos Aires?",
    opciones: ["Confederal, permitiendo la secesión de las provincias a volunta", "D) Anárquica, aboliendo los poderes ejecutivo y judicial.", "Federal, descentralizada y respetuosa de los reglamentos provinciales.", "Unitaria, aristocrática y marcadamente centralista, omitiendo definir la forma definitiva de Estado."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-39", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué evento militar provocó el colapso del Directorio y del Congreso Nacional en febrero de 1820?",
    opciones: ["La Batalla de Vuelta de Obligado", "La Batalla de Pavón", "La Batalla de Cepeda", "La Batalla de Caseros"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-40", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Quiénes lideraron los ejércitos federales que derrotaron al Directorio en la primera Batalla de Cepeda (1820)?",
    opciones: ["José Gervasio Artigas y Juan Manuel de Rosas", "Estanislao López (Santa Fe) y Francisco Ramírez (Entre Ríos)", "Facundo Quiroga y Justo José de Urquiza", "Justo José de Urquiza y Bartolomé Mitre"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-41", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué tratado interprovincial, firmado en febrero de 1820 tras Cepeda, consagró el fin del poder central y proclamó el principio federal?",
    opciones: ["Tratado del Pilar", "Tratado de Benegas", "Pacto Federal", "Tratado del Cuadrilátero"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-42", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué hecho caracterizó al período político iniciado en Argentina en el año 1820 conocido históricamente como la \"Anarquía del Año XX\"?",
    opciones: ["El dominio hegemónico de un Presidente elegido democráticamente.", "La sanción de la primera Constitución Federal unánime.", "La disolución de las autoridades nacionales y la asunción de la plena soberanía por las provincias.", "La invasión victoriosa de las tropas napoleónicas en el Río de la Plata."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-43", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué tratado firmado entre Buenos Aires y Santa Fe en noviembre de 1820 buscó poner fin a la guerra entre ambas provincias mediante indemnizaciones en ganado?",
    opciones: ["Pacto San José de Flores", "Tratado del Pilar", "Tratado de Benegas", "Tratado del Cuadrilátero"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-44", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué cuatro provincias firmaron en 1822 el Tratado del Cuadrilátero para consolidar una alianza defensiva frente a la amenaza de una invasión brasileña?",
    opciones: ["Buenos Aires, Santa Fe, Entre Ríos y Corrientes.", "Córdoba, Salta, Tucumán y La Rioja.", "Buenos Aires, Córdoba, Mendoza y San Juan.", "Jujuy, Salta, Santiago del Estero y Catamarca."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-45", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "Durante el gobierno provincial de Martín Rodríguez en Buenos Aires (1820-1824), ¿quién fue la figura de su gabinete que impulsó un amplio conjunto de reformas liberales?",
    opciones: ["Bernardino Rivadavia", "Gregorio Funes", "Juan José Paso", "Manuel José García"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-46", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿En qué consistió la \"Ley de Enfiteusis\" aprobada durante la hegemonía política de Bernardino Rivadavia?",
    opciones: ["En la expropiación sin indemnización de los saladeros porteños.", "En la privatización y venta definitiva a bajo costo de los baldíos urbanos.", "En el reparto gratuito de tierras públicas a los campesinos e indígenas locales.", "En el alquiler a largo plazo de tierras públicas que quedaron hipotecadas como garantía del empréstito financiero con la Baring Brothers."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-47", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué reforma institucional relevante llevó a cabo Rivadavia en el plano político interno de la provincia de Buenos Aires en 1821?",
    opciones: ["La eliminación de la Sala de Representantes.", "La creación de la Corte Suprema de Justicia provincial.", "La supresión de los Cabildos de Buenos Aires y Luján e instauración del sufragio universal masculino.", "La prohibición del comercio exterior con Gran Bretaña."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-48", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué medida tomó la llamada \"Ley de Reforma del Clero\" impulsada por Rivadavia en 1822?",
    opciones: ["La supresión de algunas órdenes religiosas, la confiscación de sus bienes y la eliminación del diezmo.", "La ruptura inmediata de relaciones diplomáticas con el Vaticano.", "La expulsión de todos los sacerdotes nacidos en territorio español.", "La imposición de la religión protestante en las escuelas primarias públicas."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-49", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué organismo militar y diplomático promovió la sanción de la \"Ley Presidencial\" que nombró a Bernardino Rivadavia como Presidente en 1826?",
    opciones: ["La Santa Alianza mediante intervención directa.", "La Sala de Representantes de la Provincia de Santa Fe.", "El Convenio Militar de las Provincias del Norte.", "El Congreso General Constituyente reunido en Buenos Aires desde 1824 debido a la Guerra con el Imperio del Brasil."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-50", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué medida institucional adoptó la controvertida \"Ley de Capitalización\" impulsada por Rivadavia en 1826?",
    opciones: ["Dividió la provincia de Buenos Aires en tres territorios autónomos sin puerto.", "Prohibió la exportación de ganado vacuno desde el puerto porteño.", "Declaró a la ciudad de Buenos Aires capital de la República, desmembrando la provincia y nacionalizando la aduana y el puerto.", "Trasladó la capital del país a la ciudad de Rosario en Santa Fe."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-51", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Cuál fue el motivo por el cual la Constitución sancionada en 1826 bajo el gobierno de Rivadavia fue rechazada categóricamente por la mayoría de las provincias?",
    opciones: ["Porque disolvía el Ejército Nacional y la Armada.", "Porque prohibía el libre comercio con Inglaterra y Francia.", "Porque consagraba una forma de gobierno unitaria y centralista, permitiendo al Presidente elegir a los gobernadores provinciales.", "Porque otorgaba el derecho de voto a los sectores populares analfabetos."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-52", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué hito político y sangriento ocurrido en diciembre de 1828 quebró la paz interna en Buenos Aires y reactivó la guerra civil entre unitarios y federales?",
    opciones: ["La firma del Pacto Federal.", "El golpe militar de Juan Lavalle y el fusilamiento del gobernador Manuel Dorrego.", "La invasión de las tropas de Fructuoso Rivera a Entre Ríos.", "El asesinato de Facundo Quiroga en Barranca Yaco."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-53", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué facultad especial otorgó la Legislatura de Buenos Aires a Juan Manuel de Rosas al asumir su primer mandato como gobernador en 1829?",
    opciones: ["Las Facultades Extraordinarias", "La Declaración de Estado de Sitio permanente", "El Título de Presidente Interino de la Confederación", "La Suma del Poder Público"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-54", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué alianza defensiva y ofensiva crearon las provincias de Buenos Aires, Santa Fe y Entre Ríos el 4 de enero de 1831 para enfrentar a la Liga Unitaria del Interior liderada por el General Paz?",
    opciones: ["El Acuerdo de San Nicolás", "La Liga de las Provincias Unidas", "El Tratado del Pilar", "El Pacto Federal"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-55", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué importante organismo interprovincial creaba el artículo 16 del Pacto Federal de 1831 pero cuya instalación fue bloqueada sistemáticamente por Rosas?",
    opciones: ["El Estado Mayor del Ejército Confederado", "La Corte Suprema de Justicia Federal", "Una Comisión Representativa de las Provincias en Santa Fe con atribución de convocar a un Congreso Constituyente", "El Banco Central de las Provincias Unidas"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-56", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué posición sostuvo Juan Manuel de Rosas en su célebre \"Carta de la Hacienda de Figueroa\" dirigida a Facundo Quiroga en 1834 respecto a la organización constitucional?",
    opciones: ["Sostuvo que el país estaba completamente preparado para dictar de inmediato una Constitución Federal.", "Argumentó que las provincias debían organizarse internamente y ordenarse antes de pensar en sancionar una Constitución Nacional.", "Defendió la urgente adopción del modelo institucional y constitucional de los Estados Unidos.", "Sugirió someter la redacción de la Constitución a un arbitraje internacional de Gran Bretaña."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-57", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué atribución extrema concedió la Sala de Representantes a Juan Manuel de Rosas al asumir su segundo mandato como gobernador de Buenos Aires en 1835?",
    opciones: ["La Suma del Poder Público, concentrando los tres poderes del Estado sin más límites que la religión católica y la causa federal.", "El título de Emperador del Río de la Plata.", "El monopolio vitalicio de la venta de tierras fiscales.", "Solamente las Facultades Extraordinarias limitadas al ámbito militar."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-58", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué instrumento legal promulgado por Rosas en 1835 buscó proteger la producción artesanal e industrial del interior mediante aranceles a las importaciones extranjeras?",
    opciones: ["El Tratado de Navegación Ríos Interiores", "El Código de Comercio de Buenos Aires", "La Ley de Consolidación de Deudas", "La Ley de Aduana de 1835"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-59", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "Durante los gobiernos de Rosas, ¿quién ejercía de hecho el manejo de las Relaciones Exteriores de la Confederación Argentina?",
    opciones: ["Un Ministro Plenipotenciario nombrado por el Cabildo de Montevideo", "El Presidente del Congreso Constituyente", "El Gobernador de la Provincia de Buenos Aires, por delegación expresa de las demás provincias", "El Gobernador de la Provincia de Santa Fe"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-60", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué conflicto armado internacional derivó en el combate de la Vuelta de Obligado el 20 de noviembre de 1845?",
    opciones: ["El bloqueo anglo-francés en el Río de la Plata exigiendo la libre navegación de los ríos interiores.", "La guerra con Bolivia por el dominio del territorio de Tarija.", "La invasión del Imperio del Brasil a la provincia de Corrientes.", "La intervención armada de Estados Unidos en el territorio de la Patagonia."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-61", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué acontecimiento político dio inicio al proceso que culminaría con la caída definitiva del régimen rosista en mayo de 1851?",
    opciones: ["La firma del Tratado de Paz con Gran Bretaña.", "La sublevación de la escuadra militar comandada por Guillermo Brown.", "El derrocamiento de Manuel Oribe en la Banda Oriental.", "El Pronunciamiento de Justo José de Urquiza, gobernador de Entre Ríos."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-62", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿En qué batalla militar fue derrotado definitivamente Juan Manuel de Rosas por el Ejército Grande el 3 de febrero de 1852?",
    opciones: ["Batalla de Caseros", "Batalla de Arroyo Grande", "Batalla de Cepeda", "Batalla de Pavón"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-63", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué reunión de gobernadores firmada el 31 de mayo de 1852 fijó las bases para la convocatoria al Congreso Constituyente de Santa Fe?",
    opciones: ["La Conferencia de la Rinconada", "El Protocolo de Palermo", "El Acuerdo de San Nicolás de los Arroyos", "El Pacto de San José de Flores"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-64", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué cargo asumió Justo José de Urquiza en virtud de lo dispuesto por el Acuerdo de San Nicolás?",
    opciones: ["Presidente de la Nación Argentina", "Director Provisional de la Confederación Argentina", "Gobernador Intendente de Buenos Aires", "Encargado de Negocios en el Exterior"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-65", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Qué reacción tuvo la provincia de Buenos Aires frente al Acuerdo de San Nicolás y la figura de Urquiza?",
    opciones: ["Lo rechazó en las jornadas de junio de 1852, produciéndose la Revolución del 11 de septiembre que la separó de la Confederación.", "Exigió trasladar la sede del Congreso Constituyente a la ciudad de La Plata.", "Aprobó el Acuerdo pero se negó a financiar al ejército confederado.", "Lo ratificó unánimemente en la Sala de Representantes sin objeciones."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-66", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "¿Cuáles fueron las principales fuentes doctrinales y teóricas utilizadas por los constituyentes de 1853 para redactar la Constitución Nacional?",
    opciones: ["Las Leyes de Indias y las Partidas de Alfonso X.", "El Plan de Operaciones de Mariano Moreno y los manifiestos de San Martín.", "Las Bases y puntos de partida para la organización política de la República Argentina de Juan Bautista Alberdi y la Constitución de EE. UU. de 1787.", "El Contrato Social de Jean-Jacques Rousseau y la Constitución Francesa de 1791."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 25
  },
{
    id: "10112-67", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿En qué fecha y ciudad fue sancionada la Constitución Nacional de la República Argentina?",
    opciones: ["11 de noviembre de 1859 en San José de Flores", "25 de mayo de 1810 en Buenos Aires", "9 de julio de 1816 en Tucumán", "1° de mayo de 1853 en Santa Fe"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-68", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué forma de gobierno adopta la República Argentina de acuerdo con el Artículo 1° de la Constitución de 1853?",
    opciones: ["Representativa, Republicana y Federal", "Unitaria, Centralista y Monárquica", "Confederal, Democrática y Laica", "Parlamentaria, Socialista y Directoral"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-69", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué disposición constitucional de 1853 (Artículo 26) resultaba indispensable para el desarrollo del comercio del interior de la Confederación?",
    opciones: ["La libre navegación de los ríos interiores para todas las banderas extranjeras.", "La creación de aduanas interiores en cada límite provincial.", "La estatización inmediata de los fletes fluviales.", "La prohibición absoluta de importaciones europeas."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-70", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué situación institucional atravesó el país entre 1853 y 1859 tras la sanción de la Constitución Nacional?",
    opciones: ["La ocupación militar del país por tropas enviadas desde Brasil.", "La instauración de un sistema monárquico transitorio.", "La existencia de dos Estados coexistentes: la Confederación Argentina (con capital en Paraná) y el Estado de Buenos Aires, separado.", "El dominio político y militar absoluto de Buenos Aires sobre todas las provincias sin resistencia."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-71", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué enfrentamiento militar entre la Confederación de Urquiza y el Estado de Buenos Aires forzó a esta última a negociar su incorporación al texto constitucional?",
    opciones: ["Batalla de La Verde", "Batalla de Caseros", "Batalla de Cepeda (1859)", "Batalla de Pavón"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-72", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué pacto firmado en noviembre de 1859 reincorporó legalmente a Buenos Aires a la Confederación Argentina bajo la condición de revisar la Constitución?",
    opciones: ["Tratado del Cuadrilátero", "Pacto de San José de Flores", "Acuerdo de San Nicolás", "Protocolo de Palermo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-73", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Cuál fue la principal modificación introducida al texto constitucional en la Reforma Constitucional de 1860 impulsada por Buenos Aires?",
    opciones: ["La supresión de la cláusula que declaraba a Buenos Aires como Capital definitiva de la Nación, transfiriendo la decisión a una ley del Congreso.", "La abolición de la libertad de cultos en todo el país.", "La reducción del mandato presidencial de 6 a 2 años.", "La eliminación del Senado y la supresión del Poder Judicial."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-74", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué hecho militar acontecido en septiembre de 1861 entre Urquiza y Mitre derivó en el triunfo de Buenos Aires y la unificación definitiva del país bajo el mando porteño?",
    opciones: ["Batalla de Vuelta de Obligado", "Combate de San Lorenzo", "Batalla de Caseros", "Batalla de Pavón"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-75", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Quién fue el primer Presidente de la Nación Argentina con el país institucionalmente unificado tras el triunfo de Pavón en 1862?",
    opciones: ["Nicolás Avellaneda", "Justo José de Urquiza", "Bartolomé Mitre", "Domingo Faustino Sarmiento"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-76", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué reforma constitucional fue sancionada en 1866 bajo la presidencia de Bartolomé Mitre?",
    opciones: ["La reelección inmediata del Presidente y Vicepresidente.", "La nacionalización permanente de los derechos de exportación (retenciones aduaneras) para financiar el tesoro nacional.", "El establecimiento del sufragio femenino y la libertad de cultos.", "La creación de la figura del Jefe de Gabinete de Ministros."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-77", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué hito institucional resolvió definitivamente la denominada \"Cuestión Capital\" en el año 1880 bajo el gobierno de Nicolás Avellaneda?",
    opciones: ["La Ley de Federalización de la Ciudad de Buenos Aires aprobada por el Congreso Nacional tras aplastar la resistencia armada porteña.", "El traslado definitivo de la Capital Federal a la ciudad de Córdoba.", "La creación del Territorio Nacional de Tierra del Fuego.", "La firma del Tratado del Pilar."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-78", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué fuerza política hegemonizó el poder en Argentina entre 1880 y 1916 imponiendo el modelo agroexportador y la política de acuerdos \"conservadores\"?",
    opciones: ["El Partido Socialista", "El Partido Demócrata Progresista", "La Unión Cívica Radical", "El Partido Autonomista Nacional (PAN)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-79", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué ley fundamental impulsada por la Generación del 80 en 1884 estableció la educación primaria común, gratuita, obligatoria y laica en el país?",
    opciones: ["Ley Saenz Peña (N° 8871)", "Ley de Residencia (N° 4144)", "Ley Láinez (N° 4874)", "Ley 1420"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-80", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué modificación constitucional clave se aprobó en la Reforma Constitucional del año 1898?",
    opciones: ["La elevación del número de Ministros del Poder Ejecutivo de 5 a 8 y el cambio en la base de representación de los Diputados.", "La incorporación de los juicios por jurados para delitos de corrupción.", "El voto directo para la elección de Presidente y Senadores.", "La supresión del Colegio Electoral."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-81", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué norma sancionada en 1902 permitió al Poder Ejecutivo expulsar del territorio nacional a extranjeros considerados \"agitadores\" sin juicio previo?",
    opciones: ["Ley de Residencia (N° 4144)", "Ley de Registro Civil", "Ley de Marcialidad y Conscripción", "Ley de Defensa Social"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-82", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué ley electoral promulgada en 1912 democratizó el sistema político argentino al establecer el voto secreto, obligatorio y el padrón militar?",
    opciones: ["Ley de Lemas", "Ley de Paridad de Género", "Ley de Registro Civil", "Ley Sáenz Peña (N° 8871)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-83", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Quién asumió la Presidencia de la Nación en 1916 convirtiéndose en el primer mandatario elegido mediante el sistema de la Ley Sáenz Peña?",
    opciones: ["Roque Sáenz Peña", "Marcelo T. de Alvear", "Hipólito Yrigoyen", "Lisandro de la Torre"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-84", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué movimiento estudiantil e intelectual iniciado en la Universidad Nacional de Córdoba en 1918 democratizó las universidades argentinas consagrando el cogobierno y la libertad de cátedra?",
    opciones: ["El Movimiento de la Reforma Universitaria", "La Revolución del Parque", "El Manifiesto de las Escuelas Técnicas", "La Liga de Profesores Libres"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-85", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué quiebre de la legalidad constitucional se produjo el 6 de septiembre de 1930 en la República Argentina?",
    opciones: ["El primer golpe de Estado militar del siglo XX, liderado por José Félix Uriburu contra Hipólito Yrigoyen.", "El establecimiento de una dictadura por parte de Juan Domingo Perón.", "La declaración de disolución del Congreso por la Corte Suprema.", "La Revolución Radical encabeza por Yrigoyen."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-86", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué doctrina convalidó el gobierno de facto surgido tras el golpe de 1930 otorgándole legitimidad a los actos de los gobernantes de facto?",
    opciones: ["El Fallo \"Siri\" sobre derechos de garantía individual", "La Doctrina de la Soberanía Suspendida", "La Doctrina de las Funciones Inherentes", "La Acordada de la Corte Suprema de Justicia de la Nación de 1930 (Doctrina de los Gobiernos de Facto)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-87", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué medida social de enorme impacto político fue convertida en ley (Ley 13.010) en el año 1947 bajo la primera presidencia de Juan Domingo Perón e impulsada por Eva Perón?",
    opciones: ["Las vacaciones pagas garantizadas.", "La jornada laboral de ocho horas.", "El Sueldo Anual Complementario (Aguinaldo).", "El Derecho al Voto Femenino (Sufragio Femenino)."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-88", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué caracterizó esencialmente a la Reforma Constitucional de 1949 impulsada durante la primera presidencia de Juan Domingo Perón?",
    opciones: ["La incorporación formal de los derechos del trabajador, de la familia, de la ancianidad, la función social de la propiedad y la reelección presidencial inmediata.", "La reinstauración plena de la Constitución Unitaria de 1826.", "La supresión completa del Poder Legislativo y de las provincias.", "La adopción de un sistema parlamentario con Primer Ministro."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-89", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué medida tomó la dictadura autodenominada \"Revolución Libertadora\" respecto a la Constitución de 1949 mediante la proclama de abril de 1956?",
    opciones: ["La derogó totalmente de manera unilateral, restableciendo la vigencia del texto de 1853 con sus reformas hasta 1898.", "La ratificó agregando la reelección indefinida.", "La envió a estudio a la Corte Suprema de Justicia.", "La sometió a un plebiscito popular en todas las provincias."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-90", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué artículo fue incorporado al texto de la Constitución Nacional durante la Convención Constituyente celebrada en 1857/1957 para mantener vigentes las garantías laborales y del trabajo?",
    opciones: ["Artículo 75 inciso 22", "Artículo 21", "Artículo 14 bis", "Artículo 18"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-91", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué derechos se introdujeron formalmente en el plexo constitucional argentino mediante el Artículo 14 bis en 1957?",
    opciones: ["Derechos políticos para los integrantes de las fuerzas armadas.", "Derechos individuales clásicos de libertad de prensa y libre tránsito.", "Derechos del trabajador (condiciones dignas, descanso, huelga), derechos de los sindicatos y garantías de la seguridad social integral.", "Derechos exclusivamente de las empresas comerciales internacionales."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-92", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué acontecimiento institucional trágico quebró nuevamente la Constitución Nacional el 24 de marzo de 1976?",
    opciones: ["El estallido del Cordobazo.", "El golpe de Estado militar que instauró el dictatorial \"Proceso de Reorganización Nacional\".", "La renuncia incondicional de los miembros de la Corte Suprema.", "El cierre definitivo de la Aduana de Buenos Aires."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-93", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué presidente electo restituyó definitivamente el Estado de Derecho y la democracia en Argentina el 10 de diciembre de 1983?",
    opciones: ["Raúl Alfonsín", "Carlos Menem", "Fernando de la Rúa", "Arturo Illia"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-94", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué entendimiento o pacto político acordado entre Raúl Alfonsín y Carlos Menem en 1993 sentó las bases para la Reforma Constitucional de 1994?",
    opciones: ["Acuerdo de San Nicolás", "Convenio de la Rinconada", "Pacto Federal", "Pacto de Olivos"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-95", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué mecanismo o conjunto de puntos cerrados aprobó el Congreso mediante la Ley 24.309 para la Reforma de 1994 que debía votarse en bloque (\"por sí\" o \"por no\")?",
    opciones: ["El Protocolo Adicional de Olivos", "La Ley de Lemas", "El Núcleo de Coincidencias Básicas", "La Cláusula Cerrojo"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-96", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué modificación relativa a la duración y reelección del mandato presidencial se aprobó en la Reforma Constitucional de 1994?",
    opciones: ["Mantenimiento de 6 años con reelección indefinida.", "Reducción del mandato a 4 años con posibilidad de una sola reelección consecutiva.", "Elección vitalicia por el Congreso Nacional.", "Extensión del mandato a 8 años sin reelección."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-97", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué rango se otorgó en la Reforma de 1994 a los principales Tratados Internacionales sobre Derechos Humanos expresamente enumerados en el Artículo 75 inciso 22?",
    opciones: ["Jerarquía constitucional, en las condiciones de su vigencia, sin derogar artículo alguno de la primera parte.", "Jerarquía reglamentaria ejecutable por el Poder Ejecutivo.", "Carácter meramente consultivo para los jueces provinciales.", "Jerarquía inferior a las leyes ordinarias del Congreso."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-98", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué nueva figura o cargo institucional fue creado dentro del Poder Ejecutivo en la Reforma Constitucional de 1994 para atenuar el presidencialismo?",
    opciones: ["Procurador General de las Provincias", "Defensor de la Constitución", "Vicepresidente Ejecutivo", "Jefe de Gabinete de Ministros"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-99", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué dos garantías o acciones constitucionales de protección directa e inmediata de derechos fueron introducidas explícitamente en el Artículo 43 de la Constitución en 1994?",
    opciones: ["El Recurso de Casación Penal y el Embargo preventivo.", "El Juicio Político y la Revocatoria de Mandato.", "La Acción de Amparo colectiva, el Hábeas Data y la ratificación del Hábeas Corpus.", "El Estado de Sitio y la Intervención Federal."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10112-100", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "¿Qué estatus jurídico-político otorgó la Reforma Constitucional de 1994 a la Ciudad Autónoma de Buenos Aires (Artículo 129)?",
    opciones: ["Continuó como un municipio subordinado directamente al Gobernador de la Provincia de Buenos Aires.", "Un régimen de gobierno autónomo con facultades propias de legislación y jurisdicción, y un Jefe de Gobierno electo directamente por su pueblo.", "Territorio Nacional administrado exclusivamente por el Congreso de la Nación.", "Provincia independiente número 25 con prohibición de participar en el Senado."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Historia Constitucional.", puntos_base: 50
  },
{
    id: "10121-01", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cómo se define el término Fas en el Derecho Romano primitivo?",
    opciones: ["El derecho de origen divino y la ley religiosa que regulaba la relación con los dioses.", "Las costumbres comerciales establecidas entre romanos y extranjeros.", "Las decisiones adoptadas en las asambleas plebeyas.", "El conjunto de normas jurídicas dictadas exclusivamente por el Emperador."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-02", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿A qué se refiere el término Ius en la concepción jurídica romana?",
    opciones: ["Exclusivamente a las normas dictadas por los colegios sacerdotales.", "Al derecho internacional aplicable entre todos los pueblos antiguos.", "Al ordenamiento jurídico de origen humano destinado a regular la convivencia en sociedad.", "A las reglas morales internas de cada individuo que no poseen sanción."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-03", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuál de los siguientes NO es uno de los tres preceptos fundamentales del Derecho formulados por Ulpiano?",
    opciones: ["Pacta sunt servanda (Los pactos deben cumplirse).", "Honeste vivere (Vivir honestamente).", "Alterum non laedere (No dañar a otro).", "Suum cuique tribuere (Dar a cada uno lo suyo)."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-04", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "Según la clasificación romana, el Ius Publicum es aquel que:",
    opciones: ["Modifica la voluntad de los particulares según conveniencia.", "Regula el estado de la cosa pública romana y las relaciones del Estado con los particulares.", "Atañe exclusivamente a la utilidad privada y las relaciones patrimoniales entre particulares.", "Rige únicamente para los extranjeros residentes en las provincias."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-05", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuál es la definición clásica de Ius Gentium (Derecho de Gentes)?",
    opciones: ["El conjunto de normas del derecho civil que rige la relación entre los magistrados.", "El cuerpo de normas aplicables a todos los hombres, tanto ciudadanos como extranjeros, basado en la razón natural.", "Las disposiciones dictadas por los tribunos de la plebe durante la República.", "El derecho exclusivo creado para los patricios de la ciudad de Roma."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-06", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La Aequitas (Equidad) en el sistema procesal y sustantivo romano funcionaba como:",
    opciones: ["Una fuente del derecho aplicable únicamente por los censores.", "Un mecanismo para abolir el derecho de propiedad privada.", "Un principio rígido que impedía la evolución de las leyes escritas.", "El elemento moderador del derecho estricto (ius strictum) para lograr la justicia en casos concretos."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-07", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "En la periodización del Derecho Romano, ¿cuál es la característica principal del período preclásico o republicano?",
    opciones: ["La desaparición de las magistraturas tradicionales y el Senado.", "El predominio absoluto de las constituciones imperiales.", "La consolidación del Corpus Iuris Civilis.", "La coexistencia del Ius Civile con el desarrollo del Ius Honorarium creado por el Pretor."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-08", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué era la Gens en la estructura social de la Roma primitiva?",
    opciones: ["Un grupo de plebeyos unidos por un contrato comercial.", "Un conjunto de familias que descendían de un antepasado común y compartían culto, nombre y costumbres.", "La asamblea que elegía a los tribunos de la plebe.", "Una provincia conquistada que pagaba tributo al Estado."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-09", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuál de las siguientes atribuciones pertenecía al Rex durante la Monarquía romana?",
    opciones: ["Jefatura militar, suprema potestad religiosa y dirección política de la civitas.", "Ejercer la censura y confeccionar la lista del Senado cada 5 años.", "Dictar la Ley de Citas para los jurisconsultos.", "Dictar el Corpus Iuris Civilis."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-10", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué función principal desempeñaba el Colegio de los Pontífices en la Roma arcaica?",
    opciones: ["El cobro de los impuestos a los plebeyos.", "El mando directo de las legiones romanas en batalla.", "La declaración formal de guerra a otras naciones.", "La interpretación de las normas jurídicas y religiosas, y la custodia del calendario judicial."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-11", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuál de las siguientes es una característica propia de las magistraturas ordinarias durante la República?",
    opciones: ["Solo podían ser ejercidas por ciudadanos extranjeros.", "Eran vitalicias y hereditarias.", "Eran gratuitas (honorarias), colegiadas y de duración limitada (generalmente un año).", "Eran unipersonales y exentas de rendir cuentas."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-12", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "El Pretor Peregrino fue creado en el año 242",
    opciones: ["C. con la función específica de: A) Administrar la justicia en los litigios entre ciudadanos romanos exclusivamente.", "Presidir los comicios centuriados.", "Dirimir las controversias entre ciudadanos romanos y extranjeros, o entre extranjeros entre sí.", "Redactar la lista oficial de los senadores."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-13", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué magistrado republicano tenía entre sus facultades la confección del censo y el cuidado de la moral pública (cura morum)?",
    opciones: ["El Edil Curul.", "El Censor.", "El Tribuno de la Plebe.", "El Cuestor."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-14", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La Ley de Citas (426 d.C.) regulaba la autoridad judicial de los juristas del pasado. ¿Quiénes integraban el tribunal de juristas autorizados?",
    opciones: ["Escévola, Labeón, Capitón, Juliano y Sabino.", "Celso, Pomponio, Florente, Florentino y Ulpiano.", "Cicerón, Séneca, Marco Aurelio, Justiniano y Gayo.", "Papiniano, Paulo, Ulpiano, Modestino y Gayo."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-15", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "El Corpus Iuris Civilis impulsado por Justiniano está integrado por cuatro partes:",
    opciones: ["Cánones, Breviarios, Leyes Francesas y Comentarios.", "XII Tablas, Edictos, Sanciones y Novelas.", "Código, Digesto (Pandectas), Institutas y Novelas.", "Leyes, Plebiscitos, Senadoconsultos y Constituciones."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-16", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "Las Interpolaciones en el texto del Corpus Iuris Civilis fueron:",
    opciones: ["Falsificaciones cometidas durante la Edad Media por los Glosadores.", "Modificaciones y adaptaciones introducidas por los juristas de Justiniano en los textos clásicos para adecuarlos a la época.", "Traducciones al idioma griego ordenadas por los emperadores bizantinos.", "Errores de imprenta cometidos en el siglo XIX."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-17", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La Escuela de los Glosadores fundada por Irnerio en la Universidad de Bolonia se caracterizaba por:",
    opciones: ["Criticar el derecho romano e intentar sustituirlo por el derecho germánico.", "Redactar códigos modernos basados en la equidad social.", "Ignorar el Digesto y estudiar únicamente las Institutas.", "Explicar el texto romano mediante notas marginales o interlineales (glosas) respetando el texto al pie de la letra."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-18", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué requisito era indispensable para que un nacimiento fuera legalmente reconocido como persona en Roma?",
    opciones: ["Que fuera bautizado según el culto imperial.", "Que el padre otorgara una fianza pecuniaria en el foro.", "Que naciera por cesárea.", "Nacimiento con vida, desprendimiento total de la madre y forma humana."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-19", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La escuela Sabiniana sostenía respecto a la prueba de vida del recién nacido que:",
    opciones: ["Debía sobrevivir al menos tres días.", "Solo el llanto del bebé probaba la vida.", "Era necesaria una declaración del médico del Imperio.", "Cualquier manifestación de vida (respiración, movimiento) era suficiente."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-20", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La pérdida de la libertad por caer prisionero del enemigo provocaba la pérdida de los derechos de ciudadanía y famili",
    opciones: ["Esto se conocía como: A) Capitis deminutio minima.", "Capitis deminutio maxima.", "Infamia iuris.", "Postliminium praetorianum."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-21", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿En qué consistía el Ius Postliminium?",
    opciones: ["En la facultad de un ciudadano romano capturado por el enemigo de recuperar sus derechos al regresar al territorio romano.", "En el derecho de vender a un hijo como esclavo fuera de la ciuda", "D) En la prohibición de otorgar la libertad a los esclavos menores de 30 años.", "En la pérdida definitiva de todos los bienes al viajar al extranjero."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-22", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuál de las siguientes era una forma solemne de manumisión en el Derecho Romano Clásico?",
    opciones: ["Manumissio vindicta (mediante un juicio simulado ante un magistrado).", "Manumissio in convivio (en un banquete).", "Manumissio inter amicos (entre amigos).", "Manumissio per epistulam (por carta)."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-23", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La Capitis Deminutio Media ocurría cuando una persona:",
    opciones: ["Fallecía sin dejar testamento.", "Perdía la libertad y se convertía en esclavo.", "Perdía la ciudadanía romana pero conservaba la libertad.", "Cambiaba su posición dentro de la familia sin perder la ciudadanía."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-24", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué es la familia propio iure en el Derecho Romano?",
    opciones: ["El grupo de personas bajo la patria potestad directa de un mismo Paterfamilias actual.", "La totalidad de los parientes lejanos que comparten el mismo apellido.", "El conjunto de esclavos que pertenecen a un mismo amo.", "La unión de varias gentes con un objetivo militar."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-25", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La Adrogatio era el acto jurídico mediante el cual:",
    opciones: ["Un paterfamilias (persona sui iuris) ingresaba con toda su familia bajo la potestad de otro paterfamilias.", "Un esclavo era liberado por voluntad del Senado.", "Se adoptaba a una persona extranjera sin ciudadanía romana.", "Un filiusfamilias pasaba a depender de otro paterfamilias."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-26", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuáles eran los requisitos indispensables para que existiera un matrimonio válido (iustae nuptiae) en el Derecho Romano?",
    opciones: ["Celebración de la confarreatio, dote previa y haber cumplido 25 años de eda", "D) Inscripción ante el censor, prueba de ciudadanía para ambos censores y ritual militar.", "Autorización del Senado, ceremonia religiosa y pago de un impuesto.", "Capacidad jurídica (connubium), capacidad natural (pubertad), consentimiento de los contrayentes y del paterfamilias."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-27", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿En qué se diferenciaba el matrimonio cum manu del matrimonio sine manu?",
    opciones: ["El matrimonio cum manu no permitía el divorcio bajo ninguna circunstancia.", "En el matrimonio cum manu la mujer pasaba a integrar la familia agnática del marido bajo su potestad o la de su pater; en el sine manu conservaba su vínculo familiar originario.", "El matrimonio cum manu era para plebeyos y el sine manu para patricios.", "En el matrimonio sine manu los hijos nacidos no tenían derechos hereditarios."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-28", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué era la confarreatio en el contexto del matrimonio romano?",
    opciones: ["Un contrato mercantil para acordar el monto de la dote.", "Una ceremonia religiosa solemne reservada a patricios para constituir la manus sobre la esposa.", "La compra simulada de la mujer ante cinco testigos.", "El abandono de la casa conyugal por tres noches consecutivas."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-29", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿En qué consistía el Peculio Castrense concedido a un filiusfamilias?",
    opciones: ["Los bienes adquiridos por el hijo durante y con motivo del servicio militar.", "Los bienes que el hijo heredaba exclusivamente de su madre.", "Las deudas contraídas en juegos de azar.", "Los bienes otorgados por el paterfamilias para la administración del hogar."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-30", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué función cumplían las Acciones Adyecticias (actiones adiecticiae qualitatis)?",
    opciones: ["Invalidar los matrimonios celebrados sin autorización de la plebe.", "Garantizar el cobro de la dote únicamente después del divorcio.", "Permitir al paterfamilias demandar a sus propios hijos por desobediencia.", "Permitir a los acreedores demandar al paterfamilias o dueño por las deudas contraídas por los hijos o esclavos en ciertos casos."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-31", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Cuál es la diferencia principal en la gestión del tutor entre la Auctoritas Interpositio y la Gestio Negotiorum?",
    opciones: ["La Auctoritas la otorga el Emperador y la Gestio el Pretor.", "La Auctoritas se aplica a los esclavos y la Gestio a los ciudadanos.", "La Auctoritas es la aprobación presencial del tutor a los actos del pupilo impúber; la Gestio es la administración directa cuando el pupilo es un infante.", "La Auctoritas implica la venta de los bienes pupilares; la Gestio la compra de inmuebles."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-32", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué acción tenía el pupilo al finalizar la tutela para exigir la rendición general de cuentas y el traspaso del patrimonio?",
    opciones: ["Actio rationibus distrahendis.", "Actio tutelae.", "Accusatio suspecti tutoris.", "Vindicatio rei."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-33", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿En qué consistía la Tutela Perpetua de las Mujeres (tutela mulierum) en la Roma clásica?",
    opciones: ["En la sujeción de la mujer sui iuris a la asistencia de un tutor para realizar determinados actos de disposición jurídica.", "En el encarcelamiento preventivo de las mujeres que quedaban viudas.", "En la pérdida automática de la ciudadanía al cumplir los 25 años.", "En la imposibilidad total de las mujeres de poseer propiedades o bienes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 10
  },
{
    id: "10121-34", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿A qué personas se les asignaba de forma principal la institución de la Curatela?",
    opciones: ["A los esclavos que obtenían su libertad por manumisión no solemne.", "A los cónsules al finalizar su mandato.", "A los pupilos menores de 7 años.", "A los furiosi (enfermos mentales) y a los prodigos (quienes dilapidaban su patrimonio)."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-35", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué remedio procesal otorgaba el Pretor mediante la In Integrum Restitutio a favor de un menor de 25 años?",
    opciones: ["La libertad inmediata en caso de ser prisionero de guerra.", "La exención total del pago de tributos por cinco años.", "La anulación de los efectos de un negocio jurídico desfavorable para dejar las cosas en su estado anterior.", "El paso automático a la categoría de patricio."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-36", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuál es la distinción esencial entre un Derecho Real y un Derecho Personal (o de crédito)?",
    opciones: ["El derecho real oponible erga omnes crea una relación directa sobre una cosa; el derecho personal otorga la facultad de exigir una prestación a un sujeto determinado.", "El derecho real dura un año y el derecho personal es perpetuo.", "El derecho real solo recae sobre esclavos y el derecho personal sobre tierras.", "El derecho real surge de los delitos y el personal de las leyes solemnes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-37", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuáles eran las cosas Res Mancipi en el Derecho Romano?",
    opciones: ["Los fundos en suelo itálico, los esclavos, los animales de tiro y carga y las servidumbres rústicas.", "El dinero en efectivo y las monedas de oro.", "Las cosas situadas exclusivamente en las provincias extranjeras.", "Las cosas destinadas al consumo diario como comida y vestido."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-38", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cómo se dividían las cosas fuera del comercio de origen divino (Res Divini Iuris)?",
    opciones: ["Res Mancipi, Res Nec Mancipi y Res Derelictae.", "Res Mobiles, Res Immobiles y Res Fungibiles.", "Res Sacrae, Res Religiosae y Res Sanctae.", "Res Publicae, Res Communes y Res Universitatis."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-39", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuáles son los dos elementos constitutivos indispensables de la Posesión?",
    opciones: ["Mancipatio y Traditio.", "Ius y Fas.", "Corpus (tenencia material) y Animus domini (intención de comportarse como dueño).", "Titulus y Usucapio."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-40", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿En qué se diferencia la Posesión de la mera Tenencia (posesión natural)?",
    opciones: ["La tenencia otorga la propiedad inmediata y la posesión no.", "En la tenencia se posee el corpus reconociendo el dominio en otra persona, careciendo de animus domini.", "La posesión solo es válida para extranjeros y la tenencia para ciudadanos.", "No existe ninguna diferencia jurídica entre ambas."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-41", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué eran los Interdictos Posesorios en el procedimiento romano?",
    opciones: ["Órdenes emitidas por el Pretor para proteger la posesión frente a perturbaciones o despojos.", "Leyes aprobadas por los Comicios para repartir tierras públicas.", "Contratos Solemnes para la compraventa de esclavos.", "Sanciones penales para quienes robaban ganado."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-42", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuáles son los tres atributos o facultades del derecho de propiedad sobre una cosa?",
    opciones: ["Auctoritas, Potestas e Imperium.", "Ius Civile, Ius Gentium e Ius Naturale.", "Ius utendi (usar), Ius fruendi (gozar/frutos) y Ius abutendi (disponer).", "Corpus, Animus y Possessio."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-43", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué característica definía a la Propiedad Bonitaria o Pretoriana?",
    opciones: ["La propiedad exclusiva de los habitantes de las provincias conquistadas.", "La propiedad adquirida según el Ius Civile por un ciudadano romano.", "La situación jurídica protegida por el pretor cuando se transmitía una res mancipi por simple traditio sin cumplir las solemnidades.", "La propiedad que recaía sobre los templos y cosas sagradas."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-44", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué era la Mancipatio?",
    opciones: ["Un contrato consensual de arrendamiento de tierras.", "Un negocio jurídico solemne per aes et libram utilizado para transmitir la propiedad quiritaria de las res mancipi.", "La entrega física no solemne de las cosas muebles.", "Un proceso de divorcio mediante sentencia judicial."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-45", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿En qué consistía el modo de adquirir la propiedad llamado In Iure Cessio?",
    opciones: ["En un juicio simulado de reivindicación ante el magistrado donde el adquirente reclamaba la cosa y el enajenante se allanaba.", "En el descubrimiento de un tesoro en fundo ajeno.", "En la captura de animales salvajes mediante caza o pesca.", "En el transcurso del tiempo poseyendo la cosa de buena fe."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-46", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué requisitos exigía la Usucapión en el Derecho Romano Clásico?",
    opciones: ["Autorización del Senado y pago del impuesto a las herencias.", "Ser extranjero y tener la posesión por más de seis meses.", "Solo el paso del tiempo de 50 años.", "Cosa susceptible (res habilis), justo título, buena fe, posesión continuada y el tiempo fijado por la ley."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-47", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué es la Traditio como modo derivativo de adquisición de la propiedad?",
    opciones: ["La adjudicación de tierras por parte de los censores.", "Un procedimiento solemne con balanza y cinco testigos.", "La entrega material de una cosa realizada por el dueño a favor de otro con la intención de transmitir el dominio basada en una justa causa.", "La expropiación por causas de utilidad pública."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-48", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué acción judicial tenía a su disposición el propietario quiritario para recuperar la posesión de la cosa de quien la tuviera indebidamente?",
    opciones: ["Actio Publiciana.", "Actio Negatoria.", "Reivindicatio (Acción Reivindicatoria).", "Actio Familiae Erciscundae."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-49", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Para qué servía la Actio Publiciana creada por el Pretor?",
    opciones: ["Para proteger al poseedor de buena fe y con justo título que estaba en vías de usucapir (propietario bonitario) contra despojos de terceros.", "Para exigir la reparación de un muro derribado.", "Para declarar nula la manumisión de un esclavo.", "Para cobrar los impuestos municipales a los comerciantes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-50", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué eran los Derechos Reales sobre Cosa Ajena (Iura in re alien",
    opciones: ["Las deudas pecuniarias provenientes de un delito penal.", "Las propiedades confiscadas por el Estado en tiempos de guerra.", "? A) Derechos que otorgaban a su titular facultades directas sobre una cosa cuyo dominio pertenecía a otra persona.", "Contratos de préstamos entre ciudadanos de distintas provincias."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-51", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué es una servidumbre predial en el Derecho Romano?",
    opciones: ["La venta temporal del dominio sobre un bien raíz.", "Un contrato de arrendamiento sobre esclavos de un fundo.", "Un gravamen impuesto sobre un inmueble (fundo sirviente) en beneficio de otro inmueble (fundo dominante) perteneciente a distinto dueño.", "Una sanción impuesta al propietario que abandona sus tierras."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-52", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuál de las siguientes es una servidumbre personal?",
    opciones: ["Servidumbre de paso.", "Servidumbre de acueducto.", "Usufructo.", "Servidumbre de vista."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-53", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cómo se define el derecho real de Usufructo?",
    opciones: ["El derecho de usar y disfrutar de cosas ajenas dejando a salvo su sustancia (ius alienis rebus utendi fruendi salva rerum substantia).", "La posesión provisional concedida por el pretor durante un litigio.", "El alquiler de herramientas de trabajo por un plazo determinado.", "El derecho absoluto e indivisible de vender y destruir una cosa ajena."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-54", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿En qué consistía la Superficie como derecho real sobre cosa ajena?",
    opciones: ["La servidumbre de extraer agua de un pozo público.", "El uso exclusivo de los caminos reales.", "El derecho de sembrar cereales en el terreno del vecino durante la primavera.", "El derecho real que otorgaba el goce perpetuo o a largo plazo de una edificación levantada sobre suelo ajeno a cambio de una pensión (solarium)."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-55", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué era la Enfiteusis en el derecho romano tardío?",
    opciones: ["El derecho de hipotecar bienes muebles únicamente.", "Un contrato de compraventa de ganado a crédito.", "Un derecho real transmisible y gravable que otorgaba el pleno goce de un fundo ajeno a largo plazo o perpetuidad con la obligación de cultivarlo y pagar un canon anual (canon).", "La servidumbre de no levantar edificaciones más allá de cierta altura."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-56", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuál era la principal diferencia entre la Fiducia y la Pignus (Prend",
    opciones: ["como garantías reales? A) En la Fiducia se transmitía la propiedad de la cosa al acreedor; en la Prenda solo se transmitía la posesión.", "La Fiducia recaía sobre cosas consumibles y la Prenda sobre créditos.", "La Prenda era otorgada únicamente por el Emperador.", "No había diferencia, eran términos exactamente equivalentes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-57", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué caracterizaba a la Hipoteca (pignus conventum) frente a la prenda ordinaria?",
    opciones: ["El acreedor no recibía la posesión inicial de la cosa, la cual permanecía en manos del deudor hasta el incumplimiento de la deuda.", "La hipoteca solo podía constituirse sobre esclavos.", "El acreedor perdía el derecho a cobrar si el deudor fallecía.", "La entrega inmediata del bien al acreedor al momento de firmar."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-58", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cómo se define una Obligación en el sentido jurídico romano según las Institutas de Justiniano?",
    opciones: ["La sanción impuesta por el pretor al cometer un delito público.", "Un deber moral sin trascendencia ni acción en los tribunales.", "El vínculo de parentesco que une a los miembros de una misma gens.", "Un vínculo de derecho por el que somos constreñidos con la necesidad de pagar alguna cosa según las leyes de nuestra ciudad."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-59", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuáles son los elementos esenciales constitutivos de la estructura de la obligación?",
    opciones: ["Oferta, Aceptación y Testigos.", "Censor, Pretor y Juez.", "Sujeto activo (acreedor), sujeto pasivo (deudor) y objeto (prestación).", "Corpus, Animus y Titulus."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-60", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "En relación con la prestación de una obligación, ¿en qué consistía el Dare?",
    opciones: ["En la realización de un hecho o conducta positiva sin transmitir la propiedad.", "En la transferencia de la propiedad quiritaria o la constitución de un derecho real sobre una cosa.", "En la abstención total de realizar una conducta determinada.", "En la garantía personal otorgada por un tercero."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-61", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué caracterizaba a las Obligaciones Naturales en el Derecho Romano?",
    opciones: ["Carecían de acción procesal para exigir su cumplimiento, pero si el deudor pagaba voluntariamente, el acreedor podía retener lo pagado (soluti retentio).", "Nacían exclusivamente de los delitos gravísimos sancionados con la muerte.", "Se extinguían automáticamente a los tres días de contraídas.", "Tenían acción procesal para exigir su cumplimiento ante el juez pero carecían de causa."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-62", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué era una obligación Solidaria o In Solidum?",
    opciones: ["Una obligación nacida de un acto de caridad pública.", "Una obligación que solo podía pagarse con alimentos o ropa.", "Una obligación donde cada uno de los varios deudores debía pagar únicamente su cuota parte.", "Una obligación en la que cada acreedor podía exigir o cada deudor debía cumplir la totalidad de la prestación, extinguiendo la deuda para los demás."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-63", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuáles son las cuatro fuentes principales de las obligaciones según la clasificación de las Institutas de Justiniano?",
    opciones: ["Patria Potestad, Tutela, Curatela y Manumisión.", "Ley, Costumbre, Jurisprudencia y Edicto.", "Contrato, Cuasicontrato, Delito y Cuasidelito.", "Mancipatio, Traditio, Usucapio e In Iure Cessio."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-64", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué caracterizaba a los contratos Verbales en el sistema romano?",
    opciones: ["El simple acuerdo de voluntades manifestado de cualquier forma sin solemnidad.", "Se perfeccionaban mediante el pronunciamiento de palabras solemnes y rituales, como la Stipulatio.", "La entrega previa y efectiva de la cosa al momento de contratar.", "La anotación en el libro de contabilidad doméstica del padre de familia."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-65", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué era la Stipulatio (Estipulación)?",
    opciones: ["Un contrato verbal, formal y abstracto que se perfeccionaba mediante una pregunta congruente del acreedor y una respuesta del deudor (Spondes? Spondeo).", "Un pacto no protegido por acciones judiciales.", "La entrega de una fianza en efectivo ante el cónsul.", "Un contrato consensual mediante el cual se vendían mercaderías importadas."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-66", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Cuáles son los cuatro contratos Consensuales del Derecho Romano?",
    opciones: ["Estipulación, Dictio Dotis, Iusiurandum Liberti y Nexum.", "Permuta, Aestimatum, Precario y Transacción.", "Mutuo, Comodato, Depósito y Prenda.", "Compraventa (Emptio Venditio), Arrendamiento (Locatio Conductio), Sociedad y Mandato."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 25
  },
{
    id: "10121-67", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "En el contrato de Mutuo (Préstamo de consumo):",
    opciones: ["Se entrega un bien en garantía de una deuda anterior.", "Se entrega una cosa no fungible para que sea usada gratuitamente y devuelta en especie.", "Se entrega una cantidad de cosas fungibles o dinero transfiriendo la propiedad, obligándose el mutuario a devolver otra cantidad del mismo género y calidad.", "Se entrega una cosa para su custodia gratuita sin poder usarla."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-68", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Cuál era la diferencia fundamental entre el Mutuo y el Comodato?",
    opciones: ["El Mutuo es un préstamo de consumo (cosas fungibles) y transmite la propiedad; el Comodato es un préstamo de uso (cosas no fungibles) y transmite la mera tenencia.", "El Comodato es siempre oneroso y el Mutuo es siempre gratuito.", "El Mutuo requiere la firma del Emperador y el Comodato no.", "El Comodato solo recae sobre esclavos y el Mutuo sobre tierras."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-69", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué obligación principal asume el depositario en el contrato real de Depósito?",
    opciones: ["Guardar y conservar gratuitamente la cosa mueble entregada y devolverla a requerimiento del depositante, sin derecho a usarla.", "Vender la cosa en subasta pública si transcurren tres meses.", "Consumir los frutos de la cosa y pagar intereses.", "Pagar un precio de alquiler por usar la cosa depositada."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-70", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "En el contrato consensual de Compraventa (Emptio Venditio), la obligación principal del vendedor era:",
    opciones: ["Otorgar una fianza equivalente al doble del valor del precio.", "Garantizar que el comprador no pague impuestos sobre la cosa.", "Transferir la propiedad quiritaria inmediata de la cosa vendida.", "Entregar la posesión pacífica y definitiva de la cosa (vacua possessio) y responder por evicción y vicios redhibitorios."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-71", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿En qué consistía la garantía por Evicción en la compraventa romana?",
    opciones: ["En la posibilidad del comprador de rescindir el contrato en 24 horas sin causa.", "En la obligación del vendedor de indemnizar al comprador si este era privado total o parcialmente de la cosa por sentencia judicial basada en un derecho anterior.", "En la devolución del dinero si la cosa presentaba defectos ocultos de fabricación.", "En el pago de una multa al Estado si el precio era injusto."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-72", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué era la Locatio Conductio Rerum (Arrendamiento de cosas)?",
    opciones: ["El contrato por el cual una parte se obligaba a entregar a otra el uso y goce temporal de una cosa no consumible a cambio de un precio cierto en dinero (merces).", "El contrato por el cual una persona realizaba una obra encargada por otra a cambio de honorarios.", "La prestación de servicios laborales de un ciudadano libre a favor de la ciuda", "D) La venta de tierras públicas a los plebeyos."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-73", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Cuál es la característica distintiva del contrato de Mandato?",
    opciones: ["Es un contrato formal donde el mandatario recibe un sueldo fijo antes de realizar el encargo.", "Exige la entrega material de bienes inmuebles para su validez.", "Solo puede celebrarse entre un padre y su hijo sujeto a patria potestad.", "Es un contrato esencialmente gratuito por el cual una persona (mandatario) se encarga de realizar un negocio o gestión por cuenta e interés de otra (mandante)."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-74", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué es la Gestión de Negocios (Negotiorum Gestio) como fuente cuasicontractual?",
    opciones: ["Un contrato firmado ante el Pretor Peregrino.", "La venta de bienes de la tutela aprobada por el juez.", "La administración de los bienes del Estado por un cónsul electo.", "La realización voluntaria de actos o negocios de otra persona sin haber recibido mandato ni autorización previa de esta."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-75", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿En qué consistía el cuasicontrato de Enriquecimiento Sin Causa?",
    opciones: ["La adquisición de una herencia vacante por parte del Fisco.", "En el incremento patrimonial justificado por una donación solemne.", "En la situación en que una persona obtenía un beneficio patrimonial a costa de otra sin una causa jurídica que lo justificara, naciendo la obligación de restituir.", "El cobro legítimo de intereses en el contrato de mutuo."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-76", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué caracterizaba al Furtum (Hurto) como delito privado en el Derecho Romano?",
    opciones: ["El apoderamiento violento de un inmueble mediante el uso de armas.", "La sustracción fraudulenta de una cosa mueble ajena, de su uso o de su posesión, con ánimo de lucro y contra la voluntad de su dueño.", "La estafa cometida por los magistrados en el cobro de tributos.", "El daño involuntario causado a las cosechas del vecino."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-77", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué delito tipificó la famosa Lex Aquilia de Damno?",
    opciones: ["El daño injustamente causado (damnum iniuria datum) sobre bienes o esclavos ajenos, estableciendo la obligación de indemnizar.", "Las injurias verbales contra los magistrados en el foro.", "El homicidio del paterfamilias cometido por sus hijos.", "El robo cometido por bandas organizadas en los caminos."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-78", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué era el delito privado de Iniuria (Injuri",
    opciones: ["El incumplimiento de las solemnidades de la mancipatio.", "La destrucción de un edificio público durante una revuelta.", "? A) La falta de pago de un préstamo en la fecha pactada.", "Todo acto ilícito contrariante a derecho que implicara un ataque físico o moral a la personalidad o dignidad de un hombre libre."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-79", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Cuáles son las formas ordinarias o naturales de Extinción de las Obligaciones?",
    opciones: ["La adopción del deudor por el acreedor.", "La Capitis deminutio y el destierro.", "El Solutio (Pago efectivo) y la Novatio (Novación).", "El paso de un año de plazo y la muerte del acreedor."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-80", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿En qué consiste la Novación (Novatio) como modo de extinguir una obligación?",
    opciones: ["En el perdón absoluto y gratuito de la deuda concedido por el acreedor.", "En la sustitución y extinción de una obligación preexistente por una nueva obligación que nace para reemplazarla, cambiando algún elemento esencial.", "En la imposibilidad de cumplir la prestación por caso fortuito.", "En la compensación automática de saldos deudores por el banco."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-81", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué es la Compensación como modo de extinción de obligaciones?",
    opciones: ["La extinción simultánea de dos deudas recíprocas existentes entre las mismas personas hasta la concurrencia de la de menor valor.", "La prórroga del plazo concedida unilateralmente por el magistrado.", "El pago de daños y perjuicios derivados de un contrato nulo.", "El pago en especie mediante la entrega de un terreno."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-82", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué ocurría en la extinción de obligaciones por Confusión?",
    opciones: ["Cuando se entregaba una cosa de calidad inferior a la pactada.", "Cuando existían dos acreedores exigiendo la misma suma a distintos deudores.", "Cuando las partes olvidaban las cláusulas del contrato escrito.", "Cuando las calidades incompatibles de acreedor y deudor se reunían en una misma persona (por ejemplo, por herencia)."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-83", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué era la Mora Creditoris (Mora del Acreedor)?",
    opciones: ["La quiebra comercial decretada por el Pretor.", "La negativa injustificada del acreedor a recibir el pago válido y oportuno ofrecido por el deudor.", "El retraso imputable al deudor en el cumplimiento de la prestación.", "La falta de presentación de la demanda en el plazo procesal."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-84", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "En la responsabilidad contractual, ¿qué se entiende por Dolo?",
    opciones: ["La mera negligencia o falta de cuidado sin intención de causar daño.", "La conducta intencionada, consciente y maliciosa orientada a provocar un daño o a incumplir la obligación.", "El incumplimiento provocado por un terremoto o inundación.", "La pérdida accidental de la cosa vendida antes de la entrega."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-85", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué es la Culpa en el ámbito contractual romano?",
    opciones: ["La omisión de la diligencia debida en el cumplimiento de una obligación, sin intención maliciosa pero causando perjuicio.", "El cumplimiento estricto del plazo establecido.", "La muerte natural del esclavo objeto del contrato.", "La intención delictiva de defraudar al acreedor."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-86", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "En la Sucesión Romana, ¿cuál es la diferencia entre la sucesión A Intestato (Legítim",
    opciones: ["La Testamentaria es solo para los extranjeros y la A Intestato para los patricios.", "La A Intestato exige la venta inmediata de todos los bienes en subasta.", "y la sucesión Testamentaria? A) La A Intestato la decide el cónsul y la Testamentaria el Senado.", "La A Intestato ocurre a falta de testamento válido aplicando las reglas de la ley; la Testamentaria se rige por la voluntad expresada por el difunto en su testamento."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-87", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué principio regía respecto a la incompatibilidad entre ambas formas de sucesión en el derecho clásico (Nemo pro parte testatus...)?",
    opciones: ["Los bienes inmuebles siempre se distribuían según la ley intestada.", "Una persona podía dejar la mitad de sus bienes por testamento y la otra mitad por ley sin problemas.", "Nadie podía morir en parte testado y en parte intestado (salvo en el derecho militar).", "El testamento siempre quedaba anulado si existían parientes lejanos."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-88", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Quiénes eran los Heredes Sui et Necessarii en el Derecho Hereditario Romano?",
    opciones: ["Los acreedores del difunto que asumían el patrimonio para cobrarse.", "Las personas sometidas directamente a la patria potestad o manus del causante que se convertían en sui iuris a su muerte (hijos, esposa cum manu).", "Los esclavos manumitidos en la última voluntad sin asignación de bienes.", "Los parientes de la línea materna que no compartían la misma gens."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-89", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿En qué consistía la Bonorum Possessio concedida por el Pretor en materia sucesoria?",
    opciones: ["El sistema de posesión de los bienes hereditarios otorgado por el Pretor para corregir o suplir las rigideces del Ius Civile.", "El inventario obligatorio practicado por el tribunal de los Cincuenta.", "La subasta pública de los esclavos del difunto.", "En la adjudicación definitiva de la propiedad de las tierras al Fisco."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-90", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué era el Testamento per aes et libram?",
    opciones: ["Un documento escrito firmado en presencia del Emperador.", "La entrega de la herencia al templo de Vesta.", "Una declaración oral hecha ante el ejército en pie de guerra.", "Un testamento solemne derivado de la mancipatio donde el testador vendía su patrimonio a un comprador ficticio (familiae emptor) en presencia de 5 testigos y el libripens."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-91", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué es la Querella Inofficiosi Testamenti?",
    opciones: ["La demanda para declarar nula la venta de una cosa ajena.", "Una acción civil para expulsar a los arrendatarios del fundo hereditario.", "La impugnación judicial del testamento por parte de los parientes allegados alegando que el testador violó el deber del afecto (officium pietatis) al desheredarlos injustamente.", "La solicitud de prórroga para pagar los impuestos sucesorios."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-92", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Cuál es la diferencia fundamental entre un Heredero y un Legatario?",
    opciones: ["El heredero sucede a título universal en la totalidad o cuota del patrimonio; el legatario sucede a título singular recibiendo un bien o derecho concreto.", "El heredero solo recibe deudas y el legatario solo recibe créditos.", "El heredero es nombrado por el Pretor y el legatario por el Rey.", "No hay diferencia, son términos sinónimos en el derecho romano."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-93", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué limitación imponía la Lex Falcidia respecto a los legados?",
    opciones: ["Establecía que el testador no podía disponer en legados de más de tres cuartas partes de la herencia, reservando al heredero al menos una cuarta parte (Cuarta Falcidia).", "Obligaba a pagar el 50% del legado al Templo de Júpiter.", "Limitaba los legados a un máximo de tres objetos muebles.", "Prohibía otorgar legados a favor de mujeres."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-94", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿En qué consistía el Fideicomiso en el derecho sucesorio?",
    opciones: ["La venta forzosa del patrimonio hereditario.", "Una sanción impuesta al heredero que ocultaba bienes de la masa.", "Un contrato mercantil de depósito mercantil garantizado por el Pretor.", "Un ruego informal o encargo de confianza que el testador hacía a su heredero para que entregara un bien o beneficio a un tercero."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-95", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "En el sistema procesal de las Acciones de la Ley (Legis Actiones), ¿qué caracteriza al procedimiento?",
    opciones: ["La sentencia era dictada exclusivamente por el Censor.", "Era un proceso oral, sumamente riguroso, solemne y formalista accesible solo a ciudadanos romanos.", "Se tramitaba íntegramente mediante escritos elaborados por abogados imperiales.", "Estaba abierto a cualquier habitante del Imperio sin formalidades."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-96", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "En el Procedimiento Formulario, ¿cuál era la función de la Litis Contestatio?",
    opciones: ["El momento del pago efectivo de la condena impuesta en la sentencia.", "El punto central del juicio que fijaba definitivamente las pretensiones de las partes, cerraba la fase in iure y abría la fase apud iudicem.", "La apelación de la decisión ante el Emperador.", "La citación inicial efectuada con la fuerza pública."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-97", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Cómo se dividía el proceso romano ordinario (Ordo Iudiciorum Privatorum)?",
    opciones: ["En tres fases: Instrucción, Sumario y Sentencia Imperial.", "En una sola fase presidida por el Cónsul de turno.", "En cuatro instancias de apelación consecutivas.", "En dos fases: In Iure (ante el magistrado/pretor) y Apud Iudicem (ante el juez privado)."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-98", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué parte de la Fórmula procesal contenía la indicación dada por el Pretor al Juez para que condenara o absolviera según se probaran los hechos?",
    opciones: ["Condemnatio.", "Exceptio.", "Demonstratio.", "Intentio."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-99", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué era la Exceptio en la estructura de la fórmula procesal?",
    opciones: ["El recibo de pago de los costos judiciales.", "La cláusula introducida a solicitud del demandado para alegar un hecho que, de ser probado, neutralizaba o destruía la pretensión del actor.", "La reclamación principal planteada por el demandante.", "La firma de aprobación del Pretor al final del documento."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10121-100", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "¿Qué caracterizó al procedimiento de la Cognitio Extra Ordinem en el Bajo Imperio?",
    opciones: ["El retorno a las solemnidades antiguas de las Legis Actiones.", "La desaparición de la división en dos fases (In Iure y Apud Iudicem), siendo todo el proceso tramitado y resuelto por un magistrado-funcionario estatal.", "La prohibición absoluta de presentar pruebas documentales o testigos.", "La eliminación de la facultad de apelar la sentencia."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Romano.", puntos_base: 50
  },
{
    id: "10111-01", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué caracteriza principalmente al voluntarismo amorfo en la interpretación jurídica?",
    opciones: ["Que la interpretación es un acto de voluntad sin una estructura o forma lógica necesaria.", "Que la decisión del juez está rigurosamente atada a la voluntad histórica del legislador.", "Que no admite de ningún modo la existencia de vacíos jurídicos.", "Que el juez aplica la norma mediante una deducción matemática estricta."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-02", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿En cuál de las siguientes corrientes se encuadra el voluntarismo amorfo?",
    opciones: ["La Escuela del Derecho Libre.", "La Jurisprudencia de Conceptos.", "La Escuela de la Exégesis.", "La Teoría Pura del Derecho de Kelsen."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-03", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cuál es la postura de la Escuela del Derecho Libre frente a las lagunas o vacíos normativos?",
    opciones: ["Considera que el tribunal debe remitir el caso al Poder Legislativo para que sancione una nueva ley.", "Afirma que la ley es plena y no posee ninguna laguna.", "Sostiene que ante un vacío, el juez debe abstenerse de juzgar.", "Plantea que el juez debe integrar la laguna recurriendo a su propio criterio de justicia."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-04", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué facultad atribuye la Escuela del Derecho Libre al juez en casos extremos frente a la ley escrita?",
    opciones: ["La posibilidad de sustituir la ley si esta conduce a una solución manifiestamente injusta.", "La obligación de aplicar la ley sin importar si genera injusticia.", "La facultad de declarar la invalidez formal de la Constitución.", "La obligación de seguir únicamente la jurisprudencia de la Corte Suprema."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-05", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Por qué se denomina \"amorfo\" a este tipo de voluntarismo?",
    opciones: ["Porque carece de un método o estructura lógica previa que encauce o limite la voluntad del juez.", "Porque no reconoce el papel de los valores en la toma de decisiones.", "Porque fue formulado únicamente de manera anónima.", "Porque adopta la forma de las matemáticas superiores."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-06", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Contra qué concepción jurídica reacciona principalmente la Escuela del Derecho Libre?",
    opciones: ["El realismo jurídico norteamericano.", "El iusnaturalismo teológico medieval.", "El voluntarismo estructurado.", "El formalismo y el dogmatismo legalista del siglo XIX."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-07", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cómo concibe el voluntarismo amorfo la relación entre la actividad interpretativa y el intelecto?",
    opciones: ["Equipara el intelecto del juez con la lógica proposicional simbólica.", "Sostiene que la interpretación es 100% una operación intelectual de pura lógica formal.", "Considera que el intelecto es secundario y está subordinado al acto de voluntad e intuición del juez.", "Niega que el juez posea capacidad intelectiva."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-08", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿A qué tipo de voluntarismo pertenecen la Teoría Pura de Kelsen y la Teoría Egológica de Cossio?",
    opciones: ["Voluntarismo Amorfo.", "Voluntarismo Estructurado.", "Cognitivismo Ingenuo.", "Formalismo Absoluto."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-09", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "Según Hans Kelsen en la Teoría Pura del Derecho, la interpretación de la ley es un acto de:",
    opciones: ["Conocimiento para determinar las opciones y de voluntad para elegir una de ellas.", "Pura deducción silogística donde el juez no decide nada.", "Revelación divina y descubrimiento moral.", "Pura voluntad sin ningún marco normativo."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-10", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué representa la norma de grada superior para el juez según Hans Kelsen?",
    opciones: ["Una sugerencia de carácter moral sin fuerza obligatoria.", "Un obstáculo que debe ser superado mediante el libre arbitrio.", "Un mandato absoluto con una única respuesta correcta.", "Un marco de posibilidades dentro del cual puede moverse válidamente."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-11", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "Para Kelsen, la elección que hace el juez entre las diversas alternativas que ofrece la norma es un acto de:",
    opciones: ["Subsunción puramente lógica.", "Conocimiento empírico.", "Voluntad.", "Ciencia pura."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-12", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "Según la Teoría Pura del Derecho, ¿existen diferencias cuantitativas entre el acto de creación del legislador y del juez?",
    opciones: ["No, ambos crean normas del mismo alcance general.", "Sí, el legislador crea normas generales dentro del marco constitucional y el juez normas individuales dentro del marco de la ley.", "Sí, pero sólo el legislador realiza actos de volunta", "D) No, el juez no crea normas jurídicas bajo ninguna circunstancia."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-13", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué es la \"indeterminación intencional\" de la norma según Kelsen?",
    opciones: ["Aquella en la que el legislador conscientemente deja un margen de arbitrio al aplicador.", "La que ocurre por la ambigüedad inevitable del lenguaje natural.", "La imposibilidad del juez para comprender el idioma de la norma.", "Aquella que proviene de los errores tipográficos al redactar la ley."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-14", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué causa la \"indeterminación no intencional\" de una norma según Kelsen?",
    opciones: ["El deseo expreso del legislador de no regular el tema.", "La interferencia del Poder Ejecutivo en las sentencias judiciales.", "La delegación deliberada de facultades reglamentarias.", "Los defectos del lenguaje como la ambigüedad, vaguedad o contradicciones entre normas."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-15", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué posición adopta Kelsen sobre la existencia de una \"única solución correcta\" en la interpretación jurídica?",
    opciones: ["Considera que la solución correcta la define el Ministerio de Justicia.", "La defiende como el fin primordial de la ciencia del derecho.", "La rechaza por considerar que el derecho positivo solo ofrece un marco de varias soluciones posibles.", "Afirma que la única solución correcta se deduce analizando los valores morales universales."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-16", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿En qué consiste el objeto del derecho según la Teoría Egológica de Carlos Cossio?",
    opciones: ["En el texto escrito de las leyes aprobadas por el Congreso.", "En la conducta humana en interferencia intersubjetiva y en su libertad.", "En el sistema jerárquico de normas abstractas.", "En las decisiones administrativas del Estado."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-17", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "Según Carlos Cossio, ¿cuál es la función gnoseológica de las normas jurídicas?",
    opciones: ["Ser los conceptos o herramientas conceptuales mediante los cuales se conoce la conducta.", "Servir como meros adornos sintácticos dentro del proceso.", "Constituir mandatos morales que dictan mandamientos religiosos.", "Ser el objeto mismo que el juez debe conocer."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-18", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué método utiliza la Teoría Egológica para la interpretación y conocimiento del Derecho?",
    opciones: ["Método inductivo sociológico puro.", "Método axiomático matemático.", "Método deductivo exegético.", "Método empírico-dialéctico."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-19", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "En el método empírico-dialéctico de Cossio, ¿entre qué elementos oscila la comprensión del juez?",
    opciones: ["Entre la norma individual y la sentencia de apelación.", "Entre la voluntad del presidente y la opinión pública.", "Entre el sustrato material (la conducta) y el sentido o valor de la misma.", "Entre el derecho natural y el derecho romano."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-20", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cómo concibe Cossio el acto de dictar sentencia por parte del juez?",
    opciones: ["Como una operación de subsunción mecánica.", "Como una vivencia directa y recreación de valores jurídicos (justicia, orden, seguridad, et", "). C) Como un cálculo abstracto de costo-beneficio económico.", "Como una mera lectura en voz alta de la ley procesal."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-21", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cuál es la principal diferencia entre el voluntarismo amorfo y el voluntarismo estructurado?",
    opciones: ["El amorfo no reconoce límites normativos al acto de voluntad; el estructurado encuadra la voluntad dentro de un marco o norma.", "El amorfo es positivista y el estructurado es iusnaturalista.", "El amorfo proviene de la escuela de Kelsen y el estructurado de la Escuela del Derecho Libre.", "El amorfo usa la lógica y el estructurado la rechaza."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-22", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué autor es considerado la figura central y referente del voluntarismo estructurado normativista?",
    opciones: ["Francois Gény.", "Hermann Kantorowicz.", "Eugen Ehrlich.", "Hans Kelsen."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-23", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cuál fue uno de los principales exponentes o precursores de la Escuela del Derecho Libre?",
    opciones: ["Norberto Bobbio.", "Hans Kelsen.", "Hermann Kantorowicz.", "Carlos Cossio."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-24", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué estructura lógica atribuye Cossio a la norma jurídica para expresar la libertad de la conducta humana?",
    opciones: ["Un juicio categórico apodíctico.", "Un juicio disyuntivo (Endonorma - Perinorma).", "Un juicio hipotético condicional simple.", "Un imperativo absoluto de Kant."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-25", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "Para la Teoría Egológica de Cossio, el juez al interpretar la ley está interpretando:",
    opciones: ["La conducta humana a través de la ley.", "La gramática del idioma en que se escribió la norma.", "El grado de validez formal del texto en la pirámide de Kelsen.", "La intención del legislador que redactó el texto."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-26", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cómo define Kelsen la interpretación que realizan los órganos de aplicación del derecho (como los jueces)?",
    opciones: ["Interpretación doctrinaria e ilustrativa.", "Interpretación arbitraria e ilícita.", "Interpretación científica o no auténtica.", "Interpretación auténtica, porque produce normas jurídicas obligatorias."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-27", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué es la \"interpretación científica\" según la Teoría Pura del Derecho de Kelsen?",
    opciones: ["La norma individual emitida por un tribunal internacional.", "La que realiza el juez para dictar sentencia.", "La que realiza la ciencia jurídica al exhibir los posibles sentidos del marco normativo sin optar por ninguno.", "La dictada por peritos médicos en un juicio penal."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-28", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué papel juegan los valores según el voluntarismo amorfo de la Escuela del Derecho Libre?",
    opciones: ["Se determinan mediante un cálculo matemático previsible.", "Proceden del sentimiento de justicia individual e intuitivo del juez.", "No tienen ninguna relevancia en el juzgamiento.", "Son establecidos exclusivamente por el legislador positivista."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-29", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cuál de los siguientes postulados pertenece al formalismo jurídico tradicional opuesto a la Escuela del Derecho Libre?",
    opciones: ["El derecho positivo es pleno, coherente y no tiene lagunas.", "El juez realiza un acto de voluntad libre al interpretar.", "La sentencia judicial es un acto de creación de normas individuales.", "El sistema normativo tiene lagunas que el juez debe llenar con libertad."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-30", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "En el marco kelseniano, cuando existen varias interpretaciones posibles de una norma general, la elección de una de ellas por parte del juez se basa en:",
    opciones: ["Un silogismo formal ineludible.", "La validez formal de las premisas menores.", "Un criterio puramente de conocimiento científico.", "Factores políticos, morales o axiológicos ajenos a la ciencia del derecho."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-31", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué significa que la conducta humana sea \"en interferencia intersubjetiva\" según Cossio?",
    opciones: ["Que depende exclusivamente de decretos del Poder Ejecutivo.", "Que las personas actúan totalmente aisladas de las demás.", "Que el comportamiento de un sujeto se cruza o relaciona con la acción u omisión de otros sujetos.", "Que solo abarca el fuero interno de la conciencia individual."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-32", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Cuál es la crítica fundamental de Carlos Cossio a la Teoría Pura de Kelsen?",
    opciones: ["Que Kelsen se enfoca demasiado en la conducta concreta.", "Que Kelsen confunde el objeto del derecho (la conducta) con su instrumento conceptual (la norma).", "Que Kelsen rechaza el positivismo jurídico.", "Que Kelsen defiende el uso del voluntarismo amorfo."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-33", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Por qué se sostiene que la Escuela del Derecho Libre favorece la inseguridad jurídica en comparación con el formalismo?",
    opciones: ["Porque al otorgar amplia libertad al juez, las decisiones dependen del criterio personal de cada magistrado.", "Porque obliga a aplicar rigurosamente textos antiguos.", "Porque elimina la figura de los abogados procesalistas.", "Porque prohíbe las apelaciones a tribunales superiores."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 10
  },
{
    id: "10111-34", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál de las siguientes afirmaciones resume la concepción del juez en el formalismo exegético?",
    opciones: ["El juez debe valorar la conducta en interferencia intersubjetiva.", "El juez determina el marco kelseniano de posibilidades.", "El juez es creador libre del derecho por sobre la ley.", "El juez es simplemente la \"boca que pronuncia las palabras de la ley\"."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-35", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué relación establece la Teoría Egológica entre la libertad y la conducta objeto del derecho?",
    opciones: ["Que la conducta es una categoría puramente lógica vacía de contenido.", "Que la conducta es un hecho físico plenamente determinado por leyes naturales causalistas.", "Que la conducta es libertad metafísica manifestada fenomenológicamente en el mundo real.", "Que la libertad no existe dentro del ámbito del derecho positivo."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-36", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "Para la Teoría Pura de Kelsen, ¿qué ocurre si un juez dicta una sentencia aplicando una interpretación fuera del marco normativo?",
    opciones: ["La sentencia es nula ipso facto de pleno derecho.", "La sentencia mantiene su validez jurídica mientras no sea anulada o revocada por un órgano superior.", "El juez pierde automáticamente su título profesional.", "La norma general queda derogada en el acto."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-37", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál de los siguientes términos se asocia de forma directa con la teoría de Cossio?",
    opciones: ["Egología y Axiología jurídica.", "Jurisprudencia de conceptos legalista.", "Voluntarismo sin estructura.", "Subsunsión silogística pura."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-38", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "En el contexto del voluntarismo estructurado, la \"estructura\" está dada por:",
    opciones: ["Las presiones de los grupos de interés social.", "La moral religiosa dominante en la sociedad.", "El sentimiento intuitivo del juez.", "Las normas o marcos jurídicos vigentes que condicionan y encauzan la elección."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-39", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué postura tiene Kelsen respecto a los llamados \"métodos tradicionales de interpretación\" (histórico, teleológico, gramatical)?",
    opciones: ["Propone reemplazarlos por el método empírico-dialéctico egológico.", "Considera que conducen siempre a una única respuesta correcta.", "Sostiene que son instrumentos ideológicos que no garantizan una solución única y objetiva.", "Afirma que son de carácter puramente matemático."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-40", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cómo se denomina al derecho creado por la sociedad según la Escuela del Derecho Libre, que existe al margen de la ley del Estado?",
    opciones: ["Derecho natural teológico.", "Derecho libre o derecho vivo.", "Derecho codificado constitucional.", "Derecho estatutario imperativo."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-41", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "Según la Teoría Egológica, el valor central que realiza la sintesis y armonía de los demás valores jurídicos es:",
    opciones: ["La Justicia.", "El Orden.", "El Poder.", "La Seguridad."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-42", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué caracteriza a la función interpretativa según el esquema kelseniano cuando es realizada por un particular (por ejemplo, un ciudadano)?",
    opciones: ["Es un acto de voluntad imperativo estatal.", "Es invalidadora de la norma superior.", "Es un acto de creación de normas jurídicas obligatorias.", "Es una interpretación no auténtica, pues carece de fuerza vinculante sancionatoria."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-43", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué significa que la interpretación judicial sea un \"acto de voluntad\" para el voluntarismo?",
    opciones: ["Que la decisión se adopta mediante votación popular directa.", "Que el juez decide libremente sin leer las normas del caso.", "Que la decisión final no deriva solo del razonamiento lógico, sino de una elección voluntaria entre alternativas.", "Que la sentencia debe consultar la voluntad de las partes en litigio."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-44", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué crítica formula el voluntarismo en general al modelo de la \"subsunción\"?",
    opciones: ["Que la subsunción es demasiado rápida en su ejecución.", "Que oculta que el juez realiza una elección subjetiva de premisas y sentidos al calificar los hechos.", "Que solo funciona en materia de derecho administrativo.", "Que exige el uso obligatorio de la computadora."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-45", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál es la diferencia entre el objeto del conocimiento jurídico según Kelsen y según Cossio?",
    opciones: ["Kelsen considera objeto al sistema normativo; Cossio a la conducta humana en su libertad.", "Kelsen estudia los valores morales y Cossio las normas abstractas.", "Ambos consideran que el objeto es únicamente el sentimiento de justicia del juez.", "Kelsen estudia la costumbre y Cossio la norma escrita."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-46", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué función cumple la distinción entre \"endonorma\" y \"perinorma\" en la Teoría Egológica?",
    opciones: ["Separa las decisiones de primera instancia de las de apelación.", "Establece los límites geográficos de aplicación de la ley.", "Permite clasificar las leyes según su fecha de aprobación.", "Expresa conceptualmente tanto la conducta lícita debida como la sanción ante la conducta ilícita en un juicio disyuntivo."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-47", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué afirma la Escuela del Derecho Libre respecto del dogma de la plenitud del ordenamiento jurídico?",
    opciones: ["Que solo aplica en el derecho penal moderno.", "Que es una realidad absoluta innegable.", "Que es una ficción o mito del positivismo formalista.", "Que fue inventado por Hans Kelsen."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-48", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Por qué la Teoría Egológica de Cossio se clasifica como voluntarismo \"estructurado\"?",
    opciones: ["Porque elimina totalmente el papel de las normas en la sentencia.", "Porque encauza el acto de voluntad y valoración del juez dentro de la estructura dogmática del derecho y de los valores.", "Porque exige que las sentencias tengan una estructura sintáctica de exactamente tres párrafos.", "Porque fue desarrollada por ingenieros civiles."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-49", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué ocurre con la laguna del derecho según Hans Kelsen?",
    opciones: ["Las lagunas lógicas no existen; si la ley no prohíbe una conducta, esta está jurídicamente permitida (principio de clausura).", "Existen siempre que el juez no entienda el texto legal.", "Se resuelven acudiendo obligatoriamente al derecho romano.", "Las lagunas verdaderas existen y el juez debe resolverlas con la ley de libre derecho."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-50", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál de las siguientes afirmaciones resume la visión de Kelsen sobre el juez?",
    opciones: ["El juez está por encima de la Constitución y no tiene límites normativos.", "El juez solo debe aplicar la intuición pura del libre derecho sin analizar normas escritas.", "El juez es un autómata creador de silogismos.", "El juez es un órgano creador de normas individuales que ejerce un acto de voluntad dentro de un marco de posibilidades."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-51", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿A qué se refiere el término \"Egología\" acuñado por Cossio?",
    opciones: ["Al análisis exclusivo de las normas constitucionales.", "Al estudio del egoísmo como única base del derecho.", "Al conocimiento del \"yo\" actuante en su libertad a través de la conducta real.", "A la primacía de la norma estatal sobre el individuo."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-52", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "Según el voluntarismo amorfo, ¿cuál es la fuente primaria de donde surge la solución justa cuando la ley es insuficientemente clara?",
    opciones: ["La jurisprudencia comparada de países extranjeros.", "La equidad y el sentimiento de justicia del juzgador.", "Los dictámenes de las comisiones del parlamento.", "La hermenéutica de los gramáticos."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-53", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "Para Kelsen, la norma jurídica individual constituida por la sentencia judicial:",
    opciones: ["Pertenece al gradiente inferior del ordenamiento jerárquico del derecho.", "Es superior a la norma constitucional.", "Es meramente una recomendación académica.", "No forma parte del ordenamiento jurídico positivo."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-54", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué papel juegan las emociones y la personalidad del juez según la Escuela del Derecho Libre?",
    opciones: ["Son consideradas delitos graves dentro del ejercicio de la magistratura.", "Solo importan al momento de fijar los honorarios de los letrados.", "Son totalmente neutralizadas por el procedimiento mecánico.", "Son elementos inevitables y determinantes en la formulación de la sentencia."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-55", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿En qué consiste el principio de clausura (\"Todo lo que no está prohibido está jurídicamente permitido\") en Kelsen?",
    opciones: ["En una premisa que impide al juez dictar sentencia.", "En una norma que demuestra que nunca hay verdaderas lagunas lógicas en el sistema.", "En una regla ética para regular el comercio internacional.", "En una invención de la Escuela del Derecho Libre para derogar códigos."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-56", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál es la relación entre el voluntarismo estructurado y la valoración en Cossio?",
    opciones: ["Cossio niega que el juez pueda realizar valoraciones.", "Cossio sostiene que la valoración de la conducta mediante un plano axiológico es esencial en la decisión judicial.", "Cossio afirma que la valoración solo le corresponde al legislador cuando promulga la ley.", "Cossio limita la valoración a las sanciones económicas únicamente."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-57", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué crítica le hace la Escuela del Derecho Libre a los códigos napoleónicos y dogmáticos del siglo XIX?",
    opciones: ["Que pretendían regular exhaustivamente la vida humana petrificando el derecho en fórmulas estáticas.", "Que le otorgaban excesivo poder de invención a los magistrados.", "Que no estaban escritos en idioma latín.", "Que eran demasiado breves y carecían de artículos suficientes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-58", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "Para Kelsen, ¿puede la interpretación auténtica conducir a la creación de una norma individual que esté en contradicción con la norma general?",
    opciones: ["No, salvo en causas penales menores.", "Sí, pero sólo si el Congreso la ratifica por dos tercios de votos.", "No, es lógicamente imposible.", "Sí, la sentencia válida del tribunal produce cosa juzgada aunque haya errado en el contenido según la apreciación teórica."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-59", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué entiende Cossio por \"vivenciación de valores\"?",
    opciones: ["La aplicación de sanciones fijas sin considerar las circunstancias del caso.", "La memorización teórica de tratados sobre ética moral.", "La comprensión axiológica que realiza el juez al aprehender el sentido de una conducta concreta en el proceso.", "El acatamiento estricto a las directivas presupuestarias de la administración estatal."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-60", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál de los siguientes postulados resume mejor la postura de Kelsen respecto de la interpretación?",
    opciones: ["Interpretar es descubrir el único significado verdadero mediante la ciencia.", "Interpretar es determinar el marco de opciones posibles y elegir una por un acto de voluntad.", "Interpretar es liberarse por completo del texto formal de la norma.", "Interpretar es subsumir hechos históricos en deducciones matemáticas imperativas."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-61", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué postura adopta la Escuela del Derecho Libre frente a la analogía y la interpretación extensiva?",
    opciones: ["Las utiliza libremente como herramientas para adecuar el derecho a la realidad cambiante.", "Solo las permite en el ámbito del derecho penal tributario.", "Exige la autorización previa del Poder Ejecutivo para aplicarlas.", "Las rechaza absolutamente por considerarlas violatorias de la ley."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-62", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿En qué se fundamenta la validez de una norma individual creada por un juez según la Teoría Pura del Derecho?",
    opciones: ["En el aplauso popular del fallo en la opinión pública.", "En su coincidencia literal con los principios de la física cuántica.", "En su justicia intrínseca comprobada por la moral.", "En haber sido creada conforme a los procedimientos y límites formalmente establecidos por una norma de grada superior."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-63", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cuál es la noción de \"sentido\" en la Teoría Egológica del Derecho?",
    opciones: ["La dirección lógica de un vector en un plano cartesiano.", "El significado literal consignado en el diccionario de la lengua española.", "La cualidad axiológica o valorativa inherente a toda conducta humana libre.", "La orden dada por la jefatura del estado al juez."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-64", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Por qué el voluntarismo kelseniano no es \"amorfo\"?",
    opciones: ["Porque descarta por completo la presencia de la voluntad en la interpretación.", "Porque la decisión dispositiva del juez sólo es jurídicamente válida si se encuadra dentro de la norma marco superior.", "Porque fue elaborado bajo los parámetros de la física pura.", "Porque exige que las decisiones judiciales sean adoptadas por un jurado de científicos."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-65", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Qué movimiento influyó significativamente en la aparición de la Escuela del Derecho Libre?",
    opciones: ["El sociologismo jurídico y las transformaciones sociales de la Revolución Industrial.", "El dogmatismo normativista de Viena.", "El absolutismo monárquico del siglo XVII.", "La Ilustración y el racionalismo cartesiano."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-66", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "Según Cossio, la tarea interpretativa del abogado o juez frente a la norma implica considerar a esta como:",
    opciones: ["Un estorbo que destruye el sentido de la verdad empírica.", "Una cadena rígida incapaz de evolucionar en el tiempo.", "Un fin en sí misma que debe adorarse.", "Un instrumento analítico para conocer el verdadero objeto, que es la conducta."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 25
  },
{
    id: "10111-67", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué afirma Kelsen acerca de si el juez al decidir actúa como un científico del derecho?",
    opciones: ["No, el juez solo actúa como un funcionario de enlace administrativo.", "Sí, el juez hace pura ciencia jurídica teórica al fallar.", "No, la ciencia jurídica describe posibilidades; el juez realiza un acto de voluntad y política jurídica al dictar la norma individual.", "Sí, porque el fallo debe redactarse en lenguaje estrictamente matemático."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-68", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué entiende el voluntarismo amorfo por \"derecho estatuido\"?",
    opciones: ["El único derecho existente en el mundo real.", "El derecho oficial emanado del Estado, el cual resulta insuficiente para resolver la totalidad de la praxis social.", "El cuerpo normativo formulado por los tribunales de equidad anglosajones.", "Las reglas de trato social creadas por la etiqueta y la moda."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-69", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Según la Egología, la estructura disyuntiva de la norma se representa simbólicamente mediante:",
    opciones: ["Dado A debe ser P (Endonorma), o dado no-P debe ser S (Perinorma).", "\"A siempre implica B sin excepción\".", "\"Todos los hombres son mortales\".", "\"Si A es, debe ser B\" (Juicio hipotético)."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-70", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué propone la Escuela del Derecho Libre si una norma antigua choca frontalmente con las necesidades sociales del presente?",
    opciones: ["Suspender el funcionamiento del poder judicial indefinidamente.", "Enviar el caso al archivo histórico de la nación.", "Exigir que la población acate pacientemente la norma hasta que cambie el siglo.", "Permitir al juez inaplicar dicha norma y fallar conforme a la realidad actual y la equidad."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-71", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cuál es la función del \"acto de conocimiento\" en el proceso de interpretación judicial según Kelsen?",
    opciones: ["Evaluar las intenciones psicológicas subjetivas del legislador ya fallecido.", "Crear el texto legislativo de la ley general.", "Delimitar las distintas significaciones y alternativas probables que ofrece el texto de la norma a aplicar.", "Justificar moralmente el fallo ante la Iglesia."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-72", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué es el \"sustrato material\" en la interpretación egológica de Cossio?",
    opciones: ["El papel sobre el que está impresa la ley positiva.", "La conducta humana fenomenalmente realizada en el tiempo y el espacio.", "Las instalaciones físicas donde funciona el juzgado.", "La sanción monetaria fijada en el código."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-73", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Por qué Kelsen critica el postulado tradicional que afirma que hay un método de interpretación \"correcto\" sobre los demás?",
    opciones: ["Porque todos los métodos de interpretación tradicional pueden conducir a resultados divergentes, sin que el derecho positivo señale a uno como superior.", "Porque la Constitución determina exactamente qué método debe usarse en cada caso.", "Porque Kelsen creía que la interpretación debía prescindir de la lógica formal.", "Porque según Kelsen el método inductivo es siempre superior al deductivo."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-74", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿En cuál de estos aspectos coinciden Kelsen y Cossio (voluntarismo estructurado)?",
    opciones: ["En que las lagunas lógicas son omnipresentes en el derecho normativo.", "En que el juez debe ignorar la ley escrita y fallar según su corazón.", "En que el objeto del derecho es la conducta humana libre.", "En que la aplicación judicial no es una deducción puramente mecánica y contiene un momento irreductible de decisión/voluntad dentro de un marco."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-75", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cuál es la actitud de la Escuela del Derecho Libre ante el principio de legalidad formal estricta?",
    opciones: ["Sostiene que fue creado por las escuelas norteamericanas del siglo XXI.", "Lo defiende como un dogma sagrado del absolutismo.", "Lo relativiza al considerar que la justicia sustancial debe prevalecer sobre el mero legalismo estático.", "Lo eleva a la categoría de principio supremo de la ciencia pura."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-76", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué significa que la norma sea un \"marco de posibilidades\" en Kelsen?",
    opciones: ["Que el juez puede adoptar cualquier solución dentro de ese límite y todas serán jurídicamente válidas.", "Que el marco impide al juez dictar cualquier tipo de resolución.", "Que la norma es una sugerencia flexible modificable por el tribunal superior sin causa.", "Que solo hay una alternativa dentro del marco y las demás son delitos de prevaricato."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-77", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "En la Teoría Egológica de Cossio, los valores jurídicos como seguridad, orden, paz y justicia son considerados:",
    opciones: ["Cualidades inherentes a la conducta misma que la impregnan de sentido.", "Sentimientos puramente individuales que el juez debe suprimir de sus sentencias.", "Mandatos religiosos tomados del derecho canónico antiguo.", "Conceptos normativos abstractos sin relación con el mundo real."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-78", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué califica a la Escuela del Derecho Libre como un movimiento de \"voluntarismo\"?",
    opciones: ["La negación absoluta de la existencia de la voluntad humana en los juicios.", "La imposición de decisiones por votación directa de las partes procesales.", "Su postulado de que las decisiones judiciales emanan del acto de voluntad creadora del juez y su juicio de valor.", "Su insistencia en que solo el legislador tiene voluntad soberana."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-79", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Para Kelsen, cuando la indeterminación normatividad es intencional, el legislador actúa como:",
    opciones: ["Un observador externo al sistema de la pirámide jurídica.", "Un incompetente que no supo redactar la ley.", "Un órgano que delega deliberadamente en la autoridad aplicadora el poder de configurar el detalle de la norma.", "Un dictador que prohíbe la interpretación de la norma."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-80", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué ocurre con el juez en el esquema egológico si solo lee la ley pero ignora la realidad de la conducta que juzga?",
    opciones: ["Logra la máxima perfección metodológica possible.", "Incurre en un error gnoseológico al confundir el instrumento normativo con el verdadero objeto de conocimiento (la conducta).", "Es suspendido por la Escuela del Derecho Libre.", "Cumple con el estándar puro kelseniano de aplicación judicial."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-81", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cómo explica la Teoría Pura del Derecho la existencia de sentencias contrapuestas dictadas por distintos jueces sobre un mismo texto legal?",
    opciones: ["Como la consecuencia natural de que la norma superior ofrecía un marco con múltiples alternativas válidas y cada juez ejerció su voluntad sobre una distinta.", "Como la falla definitiva e irreparable del sistema positivista.", "Como una simple ilusión óptica propia del lenguaje forense.", "Como la prueba de que uno de los dos jueces ha cometido un delito procesal."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-82", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué papel cumple la \"intuición\" en la Escuela del Derecho Libre?",
    opciones: ["Es empleada únicamente por la doctrina teórica, pero jamás por los tribunales.", "Es la única herramienta permitida para la formulación de leyes de fondo.", "Está expresamente prohibida en el proceso de decisión del magistrado.", "Es una de las vías fundamentales a través de las cuales el juez capta la solución equitativa del caso."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-83", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Según Kelsen, la brecha que existe entre la norma general y la norma individual de la sentencia es llenada mediante:",
    opciones: ["Una votación de los miembros de la comunidad civil local.", "Un cálculo formal puramente analógico.", "Un acto de voluntad discrecional del órgano aplicador.", "La remisión directa al Tribunal Constitucional internacional."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-84", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cuál es el peligro de arbitrariedad que los críticos señalan en la Escuela del Derecho Libre?",
    opciones: ["Que los jueces queden atados a fórmulas legales caducas.", "Que al no existir una estructura normativa vinculante, las sentencias dependan del mero capricho del juez.", "Que las normas escritas sean demasiado complejas de interpretar.", "Que la administración pública reemplace a los tribunales de justicia."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-85", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "En la Teoría Egológica de Cossio, el método empírico-dialéctico implica:",
    opciones: ["Aplicar silogismos lógicos de modo unidireccional y sin retorno al caso empírico.", "Someter los hechos procesales a un interrogatorio bajo juramento únicamente.", "Comparar la legislación vigente con las normas vigentes en la Edad Media.", "Partir del hecho, elevarse a la norma y retornar al sentido axiológico de la conducta para comprenderla integradamente."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-86", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Para Kelsen, la denominada \"laguna técnica\" en el derecho es:",
    opciones: ["Un vicio de redacción exclusivo del derecho procesal laboral.", "La ausencia completa de normas constitucionales de base.", "Una falla estructural insuperable del sistema de codificación.", "Un desacuerdo entre el derecho existente y el derecho deseado o considerado justo por el aplicador."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-87", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cuál es el estatuto del legislador en la Escuela del Derecho Libre?",
    opciones: ["Es el encargado exclusivo de aplicar las penas en los juicios criminales.", "Es el único creador soberano y supremo de todo el orden jurídico.", "Es solo un colaborador en la producción del derecho, el cual debe ser completado y adecuado por la labor viva de los jueces.", "Es un órgano puramente decorativo sin funciones normativas reales."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-88", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué afirma Cossio sobre la sentencia judicial dentro del cuadro de fuentes del derecho?",
    opciones: ["Que es un mero derivado secundario y no constitutivo.", "Que es un hecho jurídico que expresa una norma individual creada en una vivencia axiológica.", "Que no posee relevancia para la Teoría Egológica.", "Que es un acto abstracto de conocimiento sin sustrato material."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-89", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Por qué se sostiene que la teoría kelseniana de la interpretación desacredita la visión del juez como un \"autómata\"?",
    opciones: ["Porque demuestra que la sentencia exige un acto libre de voluntad dentro de las posibilidades del marco normativo.", "Porque lo autoriza a legislar mediante decretos de urgencia dictados por él mismo.", "Porque restringe la función del juez a la mediación voluntaria extrajudicial.", "Porque le exige aplicar preceptos puramente religiosos."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-90", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cuál de las siguientes afirmaciones describe mejor al \"voluntarismo estructurado\"?",
    opciones: ["La voluntad del juez queda anulada por completo por el cálculo deductivo racional del sistema.", "La voluntad judicial se sustituye por la opinión manifestada por jurados populares en los medios de comunicación.", "La voluntad del juez opera sin límite alguno, creando normas de la nada según su criterio ético personal.", "La voluntad del juzgador es indispensable para concretar el derecho, pero está condicionada y contenida dentro de una estructura o marco normativo previo."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-91", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Para la Escuela del Derecho Libre, la labor jurisprudencial es eminentemente:",
    opciones: ["Histórica y archivística.", "Mecánica y repetitiva.", "Creativa y dinámica.", "Pasiva y contemplativa."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-92", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "En el esquema kelseniano, ¿quién determina cuál de las opciones del marco normativo es la más justa para resolver el caso concreto?",
    opciones: ["La ciencia del derecho positivo mediante fórmulas objetivas.", "El órgano aplicador (el juez) a través de un acto de valoración subjetiva y voluntad.", "El texto del diccionario oficial de la lengua.", "La doctrina académica por consenso unánime."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-93", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Según Cossio, la norma abstracta que no se aplica a ninguna conducta real es:",
    opciones: ["Un mero esquema lógico desprovisto de plenitud egológica actual.", "La única fuente válida de justicia substancial.", "Una sentencia judicial no notificada a las partes.", "El objeto supremo de la ciencia del derecho."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-94", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué crítica fundamental dirige el voluntarismo estructurado de Kelsen al voluntarismo amorfo?",
    opciones: ["Que la Escuela del Derecho Libre aplica demasiada lógica formalista.", "Que el voluntarismo amorfo fue creado para defender al positivismo extremo.", "Que el voluntarismo amorfo es demasiado apegado a la letra de la ley escriturada.", "Que el voluntarismo amorfo ignora la necesaria gradación y la vinculación normativa que otorga validez jurídica a la decisión del juez."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-95", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Para Cossio, ¿cuál es la tarea central de la Axiología Jurídica en el trabajo del juez?",
    opciones: ["Garantizar que se cobren las tasas de justicia correspondientes.", "Ordenar los expedientes procesales cronológicamente.", "Valorar las conductas contrapuestas en el proceso a la luz de los valores jurídicos en juego.", "Comprobar únicamente la ortografía de los escritos presentados por las partes."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-96", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué papel le otorga la Escuela del Derecho Libre a los principios generales de la justicia y la equidad?",
    opciones: ["Son fuentes secundarias y meramente supletorias en ausencia absoluta de cualquier indicio legal.", "Son fuentes principales directas que el juez puede aplicar incluso contra el texto formal escrito si este genera injusticia.", "Son herramientas filosóficas inservibles que deben eliminarse del foro judicial.", "Son aplicables únicamente en los procesos penales por delitos menores."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-97", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "Según Kelsen, la llamada \"voluntad del legislador\" como criterio interpretativo exclusivo es:",
    opciones: ["Un recurso de ficción inductiva o ideológico que no suprime la pluralidad de opciones del marco normativo.", "Un imperativo expresado de forma matemática en la pirámide jurídica.", "La base indiscutible sobre la que se asienta el voluntarismo amorfo.", "El único método válido aceptado por la Pura Teoría del Derecho."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-98", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Cómo concibe la Teoría Egológica la libertad individual del sujeto jurídicamente regulado?",
    opciones: ["Como un peligro de anarquía que el Estado debe suprimir mediante normas restrictivas absolutas.", "Como una abstracción teórica ajena al campo de las sentencias judiciales.", "Como un fenómeno al azar sin consecuencias procesales.", "Como el centro del objeto del derecho, el cual no consiste en un hacer forzado sino en la posibilidad de optar entre distintas alternativas de conducta."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-99", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué significado tiene que para Kelsen la interpretación judicial sea una función de \"creación normatival\"?",
    opciones: ["Que la sentencia tiene fuerza retroactiva modificatoria de la Constitución escrita.", "Que el juez dicta normas generales aplicables a toda la población del país.", "Que cada sentencia produce una norma jurídica individualizada válida y vinculante para el caso resuelto.", "Que el Poder Judicial sustituye formalmente las funciones del Poder Legislativo."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10111-100", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "En definitiva, la diferencia crucial entre las tres corrientes respecto a la decisión judicial radica en que:",
    opciones: ["El formalismo niega el arbitrio; el voluntarismo amorfo concede arbitrio sin atadura normativa formal; y el voluntarismo estructurado concibe el arbitrio/voluntad ejercido dentro de una estructura o marco normativo previo.", "Todas las corrientes coinciden exactamente en la interpretación literal de los códigos escritos.", "El voluntarismo amorfo confía en la física teórica mientras que el estructurado rechaza las matemáticas.", "La Escuela del Derecho Libre es la única que admite la existencia del Poder Judicial en el Estado moderno."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro al Derecho.", puntos_base: 50
  },
{
    id: "10113-01", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Quién es considerado el padre fundador de la sociología y proponía aplicar los métodos de las ciencias naturales al estudio del hombre y la sociedad?",
    opciones: ["Émile Durkheim", "Augusto Comte", "Karl Marx", "Max Weber"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-02", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿En cuál de las tres etapas de la \"Ley de los tres estados\" de Comte las personas explicaban el mundo mediante principios metafísicos, abstracciones o deducciones lógicas?",
    opciones: ["Tercera etapa (positiva)", "Etapa analítica", "Primera etapa (teológica)", "Segunda etapa (metafísica)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-03", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Según Émile Durkheim, ¿qué tipo de solidaridad caracteriza a las sociedades modernas e industriales, basada en la interdependencia y la división del trabajo?",
    opciones: ["Solidaridad afectiva", "Solidaridad orgánica", "Solidaridad mecánica", "Solidaridad comunitaria"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-04", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cómo definió Émile Durkheim a la falta o ausencia de normas que genera desorientación en la sociedad ante el debilitamiento de la conciencia colectiva?",
    opciones: ["Estratificación", "Alienación", "Anomia", "Asincronía"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-05", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cuál es la primera regla del método sociológico propuesta por Émile Durkheim para estudiar los hechos sociales?",
    opciones: ["Desechar todas las prenociones o ideas preconcebidas", "Definir el hecho social según el sentido común", "Aplicar modelos matemáticos abstractos", "Alejarse de las sensaciones subjetivas"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-06", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Según Max Weber, ¿qué tipo de dominación se basa en la creencia en la \"santidad de las reglas\" que han regido desde tiempos lejanos?",
    opciones: ["Dominación tradicional", "Dominación racional", "Dominación legal", "Dominación carismática"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-07", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué sociología, originada en Karl Marx, postula que los conflictos son inherentes a la sociedad capitalista y realiza una crítica al orden social y a la falta de compromiso del sociólogo?",
    opciones: ["Sociología comprensiva", "Sociología analítica", "Sociología funcional", "Sociología crítica"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-08", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cuál de los siguientes modos de producción propuestos por Karl Marx está basado en la sociedad agraria y la explotación del trabajo servil?",
    opciones: ["Modo antiguo", "Modo asiático", "Modo feudal", "Modo capitalista"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-09", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cómo se define la \"estratificación social\"?",
    opciones: ["Eliminación total de las desigualdades económicas mediante la intervención del Estado", "Disminución de la movilidad social basada exclusivamente en factores genéticos", "Clasificación biológica de las personas según su origen étnico", "Proceso por el cual la sociedad queda dividida en estratos con diferentes grados de prestigio, poder y propiedad"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-10", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué tipo de sistema de estratificación se caracteriza por ser agrupamientos sociales cerrados justificados por principios religiosos, donde se exige la endogamia y no hay movilidad vertical?",
    opciones: ["Clases sociales", "Status ocupacional", "Estamentos", "Castas"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-11", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "En la teoría de Ferdinand Tönnies, la \"voluntad esencial o natural\" da origen a:",
    opciones: ["La empresa capitalista", "La sociedad", "La comunidad", "El Estado"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-12", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cuál es la etapa del modelo de crecimiento económico de Rostow caracterizada por un alto consumo de bienes que sobrepasa las necesidades básicas y donde la población urbana supera a la rural?",
    opciones: ["Sociedad tradicional", "El impulso inicial", "La marcha hacia la madurez", "Alto consumo en masa"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-13", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué concepto remite a que la transición hacia el desarrollo o la modernización no ocurre simultáneamente en todos los lugares del mundo, generando sociedades duales?",
    opciones: ["Asincronía al cambio", "Anomia estructural", "Etnocentrismo", "Secularización"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-14", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cómo se denomina el proceso socio-histórico por el cual la religión pierde peso en la sociedad y la organización política tiende hacia el libre análisis de la razón?",
    opciones: ["Burocratización", "Integración", "Modernización", "Secularización"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-15", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "En el ámbito de la estratificación social, la consideración que hacen las personas al valorarse expresamente entre sí (ej. \"vive en un barrio pobre\") es un indicador de:",
    opciones: ["Movilidad descendente", "Tipo de asociación", "Posesión simbólica", "Valoraciones verbales"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-16", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué es el etnocentrismo?",
    opciones: ["La actitud de juzgar a las demás culturas valorándolas desde la propia con un sentido de superioridad", "La creencia de que todas las culturas tienen exactamente el mismo origen genético", "El estudio científico neutral de las comunidades indígenas", "El rechazo total a los valores tradicionales de la propia sociedad"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-17", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "El enfoque del relativismo cultural plantea que:",
    opciones: ["Las expresiones culturales deben comprenderse dentro de sus propios contextos y estructuras sin juzgarlas desde valores externos", "Las sociedades periféricas deben imitar obligatoriamente a las centrales", "La ley debe erradicar por completo las costumbres locales", "Existen culturas inherentemente superiores e inferiores"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-18", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Según M. Bajtín, la \"cultura popular\" desarrollada en la Edad Media y Renacimiento se caracterizaba por:",
    opciones: ["Ser promovida exclusivamente por el clero y la nobleza", "Nacer con la invención de los periódicos impresos", "Ser una cultura seria, religiosa y conservadora", "Estar vinculada a la plaza pública, el humor cómico y lo carnavalesco"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-19", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cómo define Max Weber el concepto de \"Poder\"?",
    opciones: ["El monopolio exclusivo de los medios de producción económicos", "La presencia de una autoridad legalmente constituida", "La probabilidad de imponer la propia voluntad dentro de una relación social, aun contra toda resistencia", "La aceptación voluntaria y afectiva de un mandato por parte de los subordinados"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-20", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Según la clasificación de las ciencias, la Matemática y la Lógica corresponden a ciencias:",
    opciones: ["Fácticas", "Formales", "Empíricas", "Sociales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-21", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué autor sostiene que en la sociedad el ser humano y la estructura son indisolubles, ya que la persona solo puede ser consciente de su existencia a través de la vida social?",
    opciones: ["David Ricardo", "Auguste Comte", "Thomas Malthus", "George Mead"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-22", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Según la tipología de David Riesman, ¿cómo se denominan las personas cuya conducta no concuerda con lo que la estructura social espera de ellas (disconformes)?",
    opciones: ["Anómicas", "Tradicionales", "Adaptadas", "Conformistas"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-23", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Un juicio previo sin fundamentación suficiente que se acompaña de un estado de ánimo favorable o desfavorable hacia una persona o grupo se denomina:",
    opciones: ["Estigma adscripto", "Discriminación", "Prejuicio", "Anomia"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-24", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Cuál es la diferencia conceptual entre \"prejuicio\" y \"discriminación\"?",
    opciones: ["La discriminación es una actitud interna y el prejuicio es un acto legal", "Puede haber prejuicio sin discriminación, pero no hay discriminación sin prejuicio", "El prejuicio solo ocurre en el ámbito económico y la discriminación en el educativo", "Son términos idénticos que expresan exactamente la misma conducta"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-25", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Según Anne Fausto-Sterling, ¿a qué refiere el concepto de \"sexo\"?",
    opciones: ["A las costumbres y vestimentas que la sociedad asigna", "A los atributos físicos determinados por la anatomía y la biología", "Al estatus ocupacional dentro de una empresa", "A las características psicológicas del yo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-26", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "En el modelo funcional de la sociedad, ¿cuál es el problema funcional que consiste en el ajuste del sistema social al medio no social mediante la producción y distribución de bienes?",
    opciones: ["Adaptación", "Logro de fines", "Mantenimiento de pautas", "Integración y control"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-27", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué subsistema o estructura social cumple principalmente la función de \"Mantenimiento de pautas y manejo de tensiones\" en el modelo funcionalista?",
    opciones: ["Partidos políticos y ministerios", "Empresas industriales y comerciales", "Grupos familiares e iglesias", "Tribunales judiciales y fuerzas armadas"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-28", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué autor sostiene que una clase privilegiada puede convivir con otra menos privilegiada sin que esto derive necesariamente en una lucha o revolución?",
    opciones: ["Karl Marx", "Max Weber", "Auguste Comte", "Ferdinand Tönnies"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-29", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué característica distingue a los Movimientos Sociales contemporáneos?",
    opciones: ["Poseen un carácter reflexivo e intentan modificar situaciones de injusticia y categorías culturales", "Son agrupaciones cerradas que exigen la endogamia estricta", "Rechazan el uso de cualquier plataforma o red de comunicación", "Buscan únicamente la toma por la fuerza del poder del Estado"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-30", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "Para qUe una localidad sea considerada una \"ciudad\" bajo el criterio estadístico en Argentina (INDEC), debe superar una población de:",
    opciones: ["10.000 habitantes", "100.000 habitantes", "500 habitantes", "2.000 habitantes"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-31", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué término utiliza Umberto Eco para referirse a las posturas que consideran a la sociedad de masas como totalmente negativa porque \"adormece la conciencia\"?",
    opciones: ["Posmodernas", "Integradas", "Apocalípticas", "Funcionales"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-32", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "De acuerdo con la postura de los \"Escépticos\" frente al proceso de Globalización, esta se caracteriza por:",
    opciones: ["Estar completamente desarrollada abarcando la totalidad de los países sin fronteras", "Ser un fenómeno sobreestimado, ya que la mayor parte del intercambio económico ocurre dentro de regiones y no a nivel puramente mundial", "Unificar la cultura del planeta bajo un solo gobierno global", "Eliminar completamente las desigualdades sociales en el Tercer Mundo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-33", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "facil",
    pregunta: "¿Qué tipo de acción social descrita por Max Weber es aquella realizada en función del hábito o la costumbre arraigada sin una reflexión previa?",
    opciones: ["Acción racional con arreglo a valores", "Acción tradicional", "Acción afectiva", "Acción racional con arreglo a fines"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 10
  },
{
    id: "10113-34", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "En la teoría social, ¿cuál es la distinción básica entre \"Status\" y \"Rol\"?",
    opciones: ["El status solo lo tienen los gobernantes y el rol el proletariado", "No existe diferencia, ambos términos se refieren exactamente al ingreso económico", "El status se ejerce y el rol se tiene", "El status es una posición social y el rol es la función o tarea que se desempeña (el status se tiene, el rol se ejerce)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-35", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Cuáles son los tipos de estigmas identificados por Erving Goffman?",
    opciones: ["Racionales, afectivos y tradicionales", "Económicos, políticos y culturales", "Atributos físicos, defectos del carácter e identidad tribal (raza, religión, et", ") C) Adscritos, adquiridos y funcionales"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-36", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "Según Antonio Gramsci, el proceso por el cual una clase dominante logra que sus intereses sean reconocidos y aceptados colectivamente por las clases subalternas se llama:",
    opciones: ["Anomia", "Hegemonía", "Burocracia", "Secularización"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-37", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "Los grupos sociales que poseen interacciones íntimas, cara a cara, con un alto grado de afectividad y permanencia (como la famili",
    opciones: ["Grupos de referencia", "Grupos primarios", "Exogrupos", "son clasificados como: A) Grupos secundarios"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-38", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿A qué se refiere el concepto de \"Exogrupo\"?",
    opciones: ["A las empresas trasnacionales en el capitalismo avanzado", "A las minorías que dominan el gobierno de un país", "Al grupo íntimo al cual se pertenece orgullosamente", "Al conjunto de personas consideradas extrañas, ajenas o ajenas al propio grupo (\"nosotros\")"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-39", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué tipo de capacidad estatal refiere a la habilidad del gobierno para problematizar las demandas de los grupos mayoritarios y tomar decisiones que los representen?",
    opciones: ["Capacidad institucional", "Capacidad administrativa", "Capacidad técnica", "Capacidad política"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-40", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Cómo concibe William Graham Sumner la desigualdad de clases dentro del modelo conflictivo?",
    opciones: ["Como un fenómeno negativo que debe ser destruido mediante la revolución proletaria", "Como una consecuencia de la lucha por la existencia donde la fuerza y el triunfo de algunos es algo justo", "Como un producto exclusivo de la falta de normas morales o anomia", "Como una ilusión creada por los medios masivos de comunicación"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-41", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "En la clasificación de los modos de producción de Marx, el sistema basado en la subordinación de todos los trabajadores al Estado corresponde al:",
    opciones: ["Modo asiático", "Modo feudal", "Modo capitalista", "Modo antiguo"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-42", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué es la \"Cohesión Social\"?",
    opciones: ["El grado de fuerza física aplicado por el Estado para contener protestas", "La imposición de una sola religión oficial por ley", "La división absoluta entre clases sociales sin punto de encuentro", "El grado de participación y la existencia de un régimen de oportunidades para los individuos en la vida social, económica y cultural"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-43", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "Las reglas de comportamiento que tienen antigüedad, fuerte arraigo tradicional y cuyas sanciones sociales por incumplimiento son graves se denominan:",
    opciones: ["Decretos de necesidad", "Usos", "Costumbres", "Leyes formales"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-44", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "Cuando una norma legal formalmente existe pero su incumplimiento generalizado no es sancionado por la comunidad ni por las autoridades, nos encontramos ante:",
    opciones: ["Una ley de emergencia", "Una evasión institucionalizada", "Una anomia orgánica", "Un dogma religioso"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-45", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué término sociológico define a la locación geográfica que cuenta con menos de 2.000 habitantes y se encuentra habitualmente alejada de los centros urbanos?",
    opciones: ["Rural", "Periférico estacional", "Aglomerado primario", "Agropecuario"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-46", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "En el ámbito agrario, la \"Pequeña burguesía pobre\" se caracteriza por:",
    opciones: ["Formar parte del proletariado industrial urbano", "Ser altos ejecutivos de empresas multinacionales de granos", "Ser terratenientes que contratan a cientos de peones asalariados", "Ser propietarios únicamente de sus propios medios de vida y trabajo sin explotar mano de obra ajena"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-47", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "En la teoría del diseño de políticas públicas, el paradigma \"Jerárquico\" de gestión se distingue por:",
    opciones: ["Una anarquía organizada irresoluble", "Fuertes vínculos de pertenencia y reglas de comportamiento claramente establecidas", "Ausencia total de lazos sociales y desregulación de contratos", "Lazos sociales fuertes sin ninguna regla ni autoridad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-48", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Cuál de las siguientes es una característica fundamental de la \"Sociedad Postindustrial\" descrita por Daniel Bell?",
    opciones: ["Transición hacia una economía basada primordialmente en la provisión de servicios y el conocimiento teórico", "Predominio absoluto de la mano de obra en la agricultura sobre la industria", "Desaparición completa de las universidades e instituciones científicas", "Retorno a las técnicas precientíficas de producción"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-49", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Cómo define Zygmunt Bauman a la \"Sociedad Líquida\"?",
    opciones: ["Una estructura caracterizada por vínculos humanos frágiles, individualismo, volatilidad y ausencia de certezas sólidas", "Un modelo donde el Estado controla absolutamente todos los medios de comunicación", "Una comunidad donde las relaciones de parentesco dictan las leyes", "Una sociedad rígida con valores tradicionales e inmutables"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-50", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué concepto alude a una sociedad donde todo lo vivido directamente se transforma en una mera representación utilizada como forma de dominación del tiempo libre y el ocio?",
    opciones: ["Sociedad tradicional", "Sociedad ascética", "Sociedad del riesgo", "Sociedad del espectáculo"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-51", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "La teoría tecnológica que afirma que las máquinas y dispositivos son neutrales e indiferentes a los fines para los cuales se utilicen se conoce como:",
    opciones: ["Teoría evolucionista", "Teoría sustancialista", "Teoría instrumental", "Teoría crítica"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-52", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué es una \"Contracultura\"?",
    opciones: ["El sistema general de significados aceptado por toda la sociedad", "Una ramificación o especialización de una cultura amplia", "Un grupo cultural que posee normas y valores que desafían y rechazan abiertamente a la cultura dominante", "Una práctica folclórica patrocinada por la Iglesia"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-53", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué fenómeno caracteriza la \"Sociedad del Riesgo\" según Ulrich Beck?",
    opciones: ["La presencia constante de amenazas e incertidumbres no calculables que generan desconfianza e individualización", "El retorno a la economía de trueque en comunidades rurales", "La erradicación total del terrorismo y los problemas ecológicos", "Un sentimiento generalizado de seguridad absoluta provisto por la tecnología"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-54", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿A qué alude la \"Sociedad Narcisista\"?",
    opciones: ["A la devoción religiosa hacia los líderes de casta", "A la búsqueda de la igualdad de ingresos mediante políticas de Estado", "Al predominio de la solidaridad y el trabajo en equipo en las fábricas", "Al culto excesivo a la individualidad, el aspecto físico, el consumo y la satisfacción inmediata del yo"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-55", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué Ley argentina reconoce y garantiza el derecho a la Identidad de Género autopercibida en los registros oficiales?",
    opciones: ["Ley 24.013", "Ley 14.208", "Ley 26.743", "Ley 12.000"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-56", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿A qué se refiere la \"Acción racional con arreglo a fines\" según Weber?",
    opciones: ["A las acciones dictadas exclusivamente por las emociones momentáneas", "A una acción donde el actor calcula los medios necesarios para alcanzar un objetivo medible previamente concebido", "A la obediencia a normas religiosas ancestrales", "A la conducta generada por la falta de leyes o anomia"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-57", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "Según Guy Debord, ¿cuál fue el elemento unificador que permitió integrar a la clase obrera en el consumo masivo dentro de la sociedad del espectáculo?",
    opciones: ["El afianzamiento y consolidación de la clase media", "El retorno al feudalismo agrario", "La prohibición de los medios electrónicos", "La abolición del trabajo asalariado"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-58", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué autor propuso el concepto de \"Panóptico\" para describir el sistema de vigilancia y control social en las sociedades modernas?",
    opciones: ["Karl Marx", "Émile Durkheim", "Max Weber", "Michel Foucault"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-59", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Cómo define Marshall McLuhan el concepto de \"Aldea Global\"?",
    opciones: ["Un modelo de ciudad con menos de 2.000 habitantes", "La vuelta a comunidades agrícolas aisladas sin tecnología", "La interconexión mundial generada por los medios electrónicos que permite una comunicación instantánea similar a la de una tribu", "El control de la información exclusivamente por el Estado"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-60", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "En la teoría de Habermas, la \"Esfera Pública\" emergió históricamente en el siglo XVIII a partir de:",
    opciones: ["La creación de tribunales de la Inquisición", "Los salones de debate y la prensa escrita vinculados al avance del capitalismo mercantil", "El monopolio de las transmisiones televisivas", "Las huelgas del proletariado industrial"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-61", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "La paradoja o fenómeno por el cual los medios de comunicación distorsionan la realidad al punto de que los sujetos no pueden discernir lo real de la ficción se denomina según Jean Baudrillard:",
    opciones: ["Hiperrealidad", "Secularización", "Asincronía", "Anomia mediática"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-62", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué es el \"Darwinismo Social\"?",
    opciones: ["Un programa estatal de subsidios para la salud pública", "El estudio exclusivo del comportamiento de los primates", "La aplicación biológica del origen del hombre formulada en las iglesias", "La extrapolación de la teoría de la selección natural a la economía y sociedad, sosteniendo que en el mercado triunfan los más aptos"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-63", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "En la propuesta de Durkheim, los \"Hechos Sociales\" son considerados:",
    opciones: ["Invenciones exclusivas de los medios masivos", "Fenómenos puramente psicológicos e individuales", "Modos de hacer, pensar y sentir exteriores al individuo que ejercen una coerción sobre él", "Ideas preconcebidas formuladas por los filósofos"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-64", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué característica posee el \"Status adscripto\"?",
    opciones: ["Es alcanzado mediante el mérito académico o la trayectoria laboral", "Es asignado involuntariamente al individuo por la mirada ajena o factores biológicos (ej. edad o género)", "Es comprado mediante títulos de propiedad dinerarios", "Se ejerce solo en la vida privada"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-65", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué es la \"Capacidad Estatal\"?",
    opciones: ["La aptitud de las organizaciones públicas para alcanzar los fines que le han sido asignados", "El número total de funcionarios contratados en el poder judicial", "El poder militar desplegado frente a otros países", "La cantidad total de recaudación de impuestos de un gobierno"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-66", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "media",
    pregunta: "¿Qué tipo de capacidad estatal refiere a la habilidad para proveer los insumos y gestionar los procesos requeridos para brindar bienes finales?",
    opciones: ["Capacidad simbiótica", "Capacidad ideológica", "Capacidad política", "Capacidad administrativa"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 25
  },
{
    id: "10113-67", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "Las \"Representaciones Colectivas\" en la sociología durkheimiana son:",
    opciones: ["Estrategias publicitarias del consumo masivo", "Pensamientos creados de forma aislada por cada individuo", "Categorías abstractas producidas colectivamente que forman el bagaje cultural que la sociedad impone", "Decretos legislativos votados por los parlamentos"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-68", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "La teoría crítica de la tecnología sostiene que:",
    opciones: ["La tecnología es totalmente neutral e indiferente al poder", "La tecnología es un proceso ambivalente donde la ideología y la técnica se cruzan para el control social y de recursos", "La tecnología debe ser eliminada por completo para regresar al comunismo primitivo", "Las herramientas tecnológicas no influyen en el comportamiento humano"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-69", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿A qué alude el concepto de \"Evasión institucionalizada\"?",
    opciones: ["Al incumplimiento habitual de una norma legal cuya infracción es tolerada socialmente y no se sanciona", "A la migración de profesionales hacia países del primer mundo", "Al impago de aranceles de importación por empresas agropecuarias", "Al escape de prisioneros de institutos penitenciarios"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-70", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "En la estructura de sectores populares en Argentina durante la última década, los \"Derechos sexuales y reproductivos\" implican:",
    opciones: ["El cobro de un impuesto específico por matrimonio", "La prohibición total del uso de métodos anticonceptivos", "La obligación del Estado de decidir cuántos hijos debe tener cada familia", "El derecho a vivir la sexualidad sin violencia y a decidir libremente si tener o no hijos y acceder a información y métodos gratuitos"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-71", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "Según la clasificación de las clases sociales según el mercado de trabajo, la \"Clase Media\" abarca a:",
    opciones: ["Beneficiarios de planes sociales sin empleo formal", "Exclusivamente a terratenientes y directivos de corporaciones de más de 100 empleados", "Dueños de pequeñas empresas, profesionales, técnicos, jefes y trabajadores no manuales de rutina", "Únicamente a trabajadores marginales del servicio doméstico"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-72", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿A qué remite la idea de \"Construcción del Enemigo Externo\" por parte de los Estados?",
    opciones: ["A la defensa justa de las fronteras ante una invasión confirmada", "A la creación o amplificación de una amenaza para justificar políticas represivas o discriminatorias y dar sensación de protección", "Al fomento del turismo y las relaciones internacionales", "Al fortalecimiento de los derechos humanos en las escuelas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-73", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué son los \"Derechos Sexuales\"?",
    opciones: ["El derecho a disfrutar de una vida sexual elegida, sin abusos, violencia, riesgos ni discriminación", "La prohibición de la educación sexual en las escuelas", "Normas aplicables únicamente a la clase alta", "Leyes que imponen el matrimonio obligatorio a cierta edad"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-74", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿En qué consiste el \"Proceso de Socialización\"?",
    opciones: ["El juzgamiento de las personas según el estigma biológico", "La imposición de leyes mediante la coerción militar", "Un entrenamiento estrictamente técnico y escolar dictado por un programa", "La incorporación espontánea, afectiva e informal de pautas culturales mediante la participación en sistemas de interacción"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-75", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿A qué se refiere la \"Discriminación Racial o Racismo\"?",
    opciones: ["A la migración de personas del campo a la ciudad", "A la mera constatación biológica de que las personas son diferentes", "Adjudicar un carácter negativo a las diferencias culturales o físicas, acompañándolo de desprecio o limitación de derechos", "Promover el intercambio de conocimientos entre etnias"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-76", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Cuál es la función del \"Proceso de Educación\" diferenciado de la socialización según la lectura durkheimiana?",
    opciones: ["Es conservador y puramente emocional", "Es innovador, posee contenidos específicos y agentes especializados (docentes) que forman para roles determinados", "Ocurre únicamente dentro del grupo familiar primario", "Consiste en la transmisión de mitos en las castas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-77", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "El concepto de \"Estilo de vida\" se distingue de la \"Clase social\" porque:",
    opciones: ["Sus componentes son más volátiles y es posible detentar un estilo de vida sin pertenecer necesariamente a esa clase social", "La clase social solo depende de las costumbres religiosas", "No hay diferencia alguna", "El estilo de vida es inmutable y no cambia nunca"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-78", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué caracteriza al \"Grupo Primario\"?",
    opciones: ["Se rige exclusivamente por el derecho legislado", "No existe sentimiento de pertenencia", "Lazos impersonales, gran número de miembros y relaciones contractuales", "Asociación cara a cara, intimidad, cooperación afectiva y tamaño reducido"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-79", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Cuál es un rasgo representativo de las \"Sociedades Distópicas\"?",
    opciones: ["Retorno a la sociedad sacralizada del Medioevo", "Armonía total entre el avance tecnológico y el nivel de bienestar de la población", "Desequilibrio o tensión severa entre un alto nivel tecnológico y un bajo nivel de vida o calidad institucional", "Ausencia completa de redes informáticas y de comunicación"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-80", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué comprende el concepto de \"Hábitat\"?",
    opciones: ["La cantidad de dinero ahorrado en los bancos centrales", "El ámbito en donde ocurren las interacciones entre sistemas y elementos que hacen posible la vida humana", "Las normas exclusivas del derecho laboral", "La producción exclusiva de granos y soja"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-81", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿En qué consiste el \"Consumo Ostentoso\"?",
    opciones: ["El consumo de bienes y servicios orientado a simbolizar y representar el estatus o la distinción social", "El ahorro compulsivo de divisas sin realizar compras", "La distribución gratuita de alimentos por parte del Estado", "Adquirir únicamente los alimentos necesarios para la subsistencia física"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-82", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué es la \"Movilidad Social Vertical\"?",
    opciones: ["La variación en los horarios de la jornada laboral", "La migración obligatoria impuesta por una guerra", "El desplazamiento geográfico de una ciudad a otra", "El cambio o pasaje de un individuo de un estrato o clase social a otro (ascendente o descendente)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-83", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué distingue a las \"Ciencias Fácticas\"?",
    opciones: ["Pertenecen únicamente al campo de la teología", "Trabajan sobre formas abstractas y demuestran mediante deducción pura", "Se ocupan de hechos, sucesos y procesos empíricos y requieren de la observación y experimentación", "No requieren contrastación con la realidad"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-84", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "En el análisis funcionalista, una \"Disfunción\" es:",
    opciones: ["El aporte positivo para el mantenimiento del orden social", "La consecuencia o aporte que obstaculiza la adaptación o ajuste del sistema generando desajustes", "Una regla jurídica aprobada por el congreso", "La falta absoluta de tecnología en un país"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-85", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué es la \"Neutralidad Valorativa\" en la sociología comprensiva de Max Weber?",
    opciones: ["La actitud del científico de abstenerse de emitir juicios de valor prácticos o ideológicos al analizar los hechos", "La indiferencia total hacia cualquier problema de la sociedad", "La prohibición de publicar investigaciones científicas", "La obligación del sociólogo de imponer sus valores ideológicos al investigar"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-86", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué tipo de dominación según Weber reposa en la devoción a la santidad, heroísmo o carácter ejemplar de una persona específica?",
    opciones: ["Dominación carismática", "Dominación estamental", "Dominación legal-racional", "Dominación tradicional"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-87", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué define al \"Grupo de Referencia\"?",
    opciones: ["La junta directiva de un banco transnacional", "El grupo al que una persona pertenece obligatoriamente desde su nacimiento", "El grupo o colectivo cuyas normas, valores y modelos adopta un sujeto para orientar su propia conducta, pertenezca o no a él", "Un grupo burocrático de más de 10.000 trabajadores"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-88", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "En la teoría de Parsons/Funcionalismo, el \"Logro de Fines\" consiste en:",
    opciones: ["La conservación de las pautas morales mediante la religión", "La definición y movilización de recursos y esfuerzos cooperativos para alcanzar los objetivos de la sociedad", "La represión policial de las conductas desviadas", "La desregulación de los mercados financieros"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-89", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿A qué refiere el concepto de \"Subcultura\"?",
    opciones: ["A un sistema de significados y pautas que proviene de una cultura general pero presenta rasgos propios de un grupo específico", "A las leyes aprobadas por los municipios", "Al rechazo total del orden social capitalista", "A una cultura inferior o inculta"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-90", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué es el \"Etnocentrismo Ideológico / Tradicionalismo Ideológico\"?",
    opciones: ["El uso de tecnologías intelectuales para reducir costos", "La erradicación de las religiones en la ciudad", "La adopción consciente e intencionada de lo tradicional como modo de oponerse a los cambios culturales", "La aceptación incondicional de las pautas extranjeras"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-91", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Cuál es la relación básica entre Ley y Costumbre expuesta en los textos sociológicos?",
    opciones: ["La costumbre es promulgada por el Poder Ejecutivo", "La ley elimina automáticamente la costumbre en cuanto se promulga", "La ley no puede erradicar la costumbre si carece de la fuerza de convicción cotidiana en los sujetos", "Las costumbres siempre están escritas en el código civil"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-92", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "En la teoría de Robert Merton, las funciones que son intencionadas y reconocidas por los participantes del sistema se denominan:",
    opciones: ["Funciones latentes", "Funciones manifiestas", "Disfunciones orgánicas", "Anomias sociales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-93", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué son las \"Funciones Latentes\"?",
    opciones: ["Los reglamentos escritos de una institución", "Las órdenes emitidas por una autoridad carismática", "Las actividades de ocio organizadas en la ciudad", "Aquellas consecuencias no buscadas ni reconocidas explícitamente por los actores sociales"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-94", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Cómo influyó la crisis socioeconómica de 2001 en Argentina respecto a los actores sociales populares?",
    opciones: ["Generó la privatización masiva de las escuelas primarias", "Eliminó la brecha entre clases altas y populares", "Provocó la erradicación total de la protesta social", "Llevó a la reaparición de ollas populares y al fortalecimiento de organizaciones de desocupados con reclamos territoriales"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-95", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué es la \"Acción Afectiva\" según Max Weber?",
    opciones: ["La adscripción a un partido político por razones intelectuales", "La conducta guiada por el cálculo racional de costos y beneficios", "La acción motivada directamente por sentimientos, emociones o estados de ánimo presentes", "El cumplimiento estricto de los contratos comerciales"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-96", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "En el análisis del espacio urbano, la creación de barrios cerrados o \"countries\" y shoppings durante el periodo neoliberal representa un proceso de:",
    opciones: ["Homogeneización e integración social absoluta", "Segmentación y fragmentación territorial y social", "Desarrollo agropecuario tradicional", "Descentralización de los poderes públicos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-97", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿A qué se refiere la \"Burocracia\" en el pensamiento sociológico de Weber?",
    opciones: ["Al ejercicio del mando basado en el conocimiento técnico, normas escritas, jerarquía y procedimientos impersonales", "A la administración directa por parte del líder carismático sin reglas", "Al gobierno exclusivo de los sindicatos obreros", "A un sistema ineficiente destinado únicamente a entorpecer trámites"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-98", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué es el \"Status Adquirido\"?",
    opciones: ["Un estigma corporal inalterable", "La adscripción obligatoria a una casta", "Una posición social asignada automáticamente al nacer", "Una posición obtenida por el individuo a lo largo de su vida a través de su esfuerzo, elección o experiencia (ej. título universitario)"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-99", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿Qué define a las \"Políticas Públicas Participativas\"?",
    opciones: ["El monopolio de la policía en la regulación de conflictos", "Estrategias donde el Estado toma decisiones en secreto sin consultar a la ciudadanía", "Mecanismos dirigidos a incrementar el protagonismo directo de las organizaciones y ciudadanos en la gestión e implementación pública", "La venta de empresas públicas a sectores privados extranjeros"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10113-100", id_categoria: "10113", categoria_nombre: "Intro a la Sociología", dificultad: "dificil",
    pregunta: "¿En qué consiste el principio de \"Marginalidad o Marginación Social\"?",
    opciones: ["La inclusión plena de todos los ciudadanos con igualdad de oportunidades", "La situación en la que se deja a una persona o grupo al margen de la sociedad, aislándolo y privándolo del acceso a oportunidades y beneficios sociales", "La participación voluntaria en partidos políticos", "El ascenso social mediante la movilidad vertical"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Intro a la Sociología.", puntos_base: 50
  },
{
    id: "10114-01", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cuál es el objeto específico de la Ciencia Política?",
    opciones: ["La Constitución.", "El poder y las relaciones políticas.", "El Derecho Público.", "El Estado."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-02", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según Fayt, la política en sentido genérico se refiere a:",
    opciones: ["La actividad de los partidos políticos.", "La administración pública.", "Únicamente al poder estatal.", "Toda relación de poder organizada."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-03", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué caracteriza al sentido específico de la política?",
    opciones: ["Se limita a la actividad partidaria.", "Comprende toda forma de autoridad.", "Se refiere exclusivamente al poder económico.", "Se vincula al poder estatal."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-04", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Etimológicamente, la palabra \"política\" proviene de:",
    opciones: ["Imperium.", "Civitas.", "Polis.", "Res publica."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-05", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué significa originalmente el término \"politeia\"?",
    opciones: ["Ciudad organizada.", "Estar en orden.", "Poder del pueblo.", "Gobierno popular."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-06", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según Aristóteles, la polis es:",
    opciones: ["La asociación de varias aldeas autosuficiente.", "Una forma de gobierno democrática.", "Una asociación militar.", "Una organización económica."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-07", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué estudia la Ciencia Política según Fayt?",
    opciones: ["Las relaciones económicas.", "Exclusivamente la Constitución.", "El Poder y las relaciones políticas.", "El Derecho Privado."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-08", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cuál de las siguientes NO es una característica de la realidad política según Mario López?",
    opciones: ["Polifacética.", "Variable.", "Simbólica.", "Inmutable."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-09", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "La faz estructural de la realidad política se caracteriza por:",
    opciones: ["Las instituciones y la organización jerarquizada.", "Las campañas políticas.", "Las revoluciones.", "La lucha electoral."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-10", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "La faz dinámica consiste en:",
    opciones: ["La elaboración de leyes.", "La división territorial.", "El estudio histórico del Estado.", "El ejercicio de funciones, cargos y roles políticos."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-11", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué representa la faz agonal?",
    opciones: ["La función judicial.", "El ejercicio cotidiano del gobierno.", "La competencia por conquistar y conservar el poder.", "La organización administrativa."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-12", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "La faz arquitectónica se orienta principalmente a:",
    opciones: ["Reformar la Constitución.", "Conservar el territorio.", "Alcanzar los fines de la comunidad política.", "Controlar la economía."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-13", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "La realidad política es variable porque:",
    opciones: ["Cambia según la época y el sistema político.", "Nunca mantiene las mismas fases.", "Depende exclusivamente de la economía.", "Carece de instituciones."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-14", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Para Bordeau, la realidad política es:",
    opciones: ["Una organización económica.", "Una estructura militar.", "Exclusivamente jurídica.", "Un universo de representaciones y apariencias."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-15", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué requisitos debe reunir el conocimiento político según Burdeau?",
    opciones: ["Historia, economía y filosofía.", "Poder, Estado y territorio.", "Objetividad, método y comunicabilidad.", "Moral, ética y derecho."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-16", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según Duverger, ¿quiénes son considerados los fundadores de la Ciencia Política?",
    opciones: ["Platón, Aristóteles y Sócrates.", "Hobbes, Locke y Rousseau.", "Tocqueville, Comte y Marx.", "Kelsen, Heller y Jellinek."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-17", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué estudia la Teoría del Estado?",
    opciones: ["El origen, evolución, estructura, funcionamiento y finalidad del Estado.", "Exclusivamente el gobierno.", "Solo el territorio.", "Solamente la Constitución."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-18", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cuáles son las tres fases desde las que debe estudiarse el Estado?",
    opciones: ["Jurídica, administrativa y económica.", "Filosófica, histórica y jurídica.", "Política, militar y económica.", "Sociológica, jurídica y política."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-19", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según Burdeau, el poder reside en:",
    opciones: ["El Parlamento.", "Los gobernantes.", "El pueblo.", "El Estado."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-20", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Para George Jellinek, el Estado solo puede describirse si previamente:",
    opciones: ["Se legisla.", "Se compara.", "Se explica y comprende.", "Se organiza."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-21", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cómo divide Jellinek la doctrina del Estado?",
    opciones: ["General y particular.", "Nacional e internacional.", "Pública y privada.", "Política y jurídica."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-22", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según Kelsen, el Estado es:",
    opciones: ["El orden jurídico total.", "Una asociación política.", "Una comunidad cultural.", "Una organización económica."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-23", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué autor sostiene que debe predominar la perspectiva sociológica y política en la Teoría del Estado?",
    opciones: ["Jellinek.", "Kelsen.", "Heller.", "Dabin."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-24", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cuál es el objeto del Derecho Político según Fayt?",
    opciones: ["La organización política y su estructura dinámica.", "Exclusivamente la Constitución.", "El Derecho Internacional.", "El proceso legislativo."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-25", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué expresión utilizó Domingo de Soto para referirse al Derecho Político?",
    opciones: ["Ius Politicum.", "Lex Fundamentalis.", "Imperium.", "Res Publica."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-26", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según Fayt, el Derecho Político estudia principalmente:",
    opciones: ["Las normas del Derecho Privado.", "La organización económica del Estado.", "La organización judicial del Estado.", "La estructura dinámica de la organización política y sus relaciones con la sociedad."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-27", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cuál es el objeto del Derecho Político?",
    opciones: ["El territorio estatal.", "La Constitución Nacional.", "El Poder Judicial.", "La organización política."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-28", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué significa afirmar que \"el derecho es política cristalizada\"?",
    opciones: ["Que el derecho reemplaza completamente a la política.", "Que el derecho expresa decisiones políticas transformadas en normas.", "Que la política depende exclusivamente de los jueces.", "Que la política carece de contenido jurídico."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-29", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "Según el resumen de Alejo Rocca, el Derecho se caracteriza porque:",
    opciones: ["Es un fenómeno exclusivamente económico.", "Es un sistema de reglas sociales obligatorias que ordenan la conducta humana.", "Es únicamente una manifestación de la moral.", "Nunca puede ser violado."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-30", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Quién utilizó la expresión ius politicum para referirse al Derecho Político?",
    opciones: ["Domingo de Soto.", "Hobbes.", "Montesquieu.", "Rousseau."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-31", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Qué autor utilizó la expresión \"Derecho Político\" en \"El espíritu de las leyes\"?",
    opciones: ["Bodin.", "Rousseau.", "Montesquieu.", "Locke."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-32", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿En qué obra Rousseau utiliza la expresión \"Derecho Político\"?",
    opciones: ["El espíritu de las leyes.", "Leviatán.", "El contrato social.", "La política."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-33", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Quién utilizó en 1810 la obra \"El contrato social\" de Rousseau como referencia política?",
    opciones: ["Mariano Moreno.", "Manuel Belgrano.", "Domingo F. Sarmiento.", "Juan Bautista Alberdi."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 10
  },
{
    id: "10114-34", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Mario López, ¿qué disciplina constituye uno de los cimientos del Derecho Político?",
    opciones: ["Historiografía.", "Física.", "Medicina.", "Matemática."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-35", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué relación establece Mario López entre economía y política?",
    opciones: ["La economía depende exclusivamente del derecho.", "No existe relación.", "La realidad económica influye sobre la actividad política.", "La política determina totalmente la economía."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-36", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Por qué la Teología se relaciona con el Derecho Político?",
    opciones: ["Porque regula la actividad judicial.", "Porque los grupos religiosos pueden actuar como factores de poder.", "Porque reemplaza al Estado.", "Porque crea las constituciones."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-37", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué caracteriza al conocimiento filosófico de la política según Fayt?",
    opciones: ["Busca conocer los valores supremos de la vida política.", "Solo utiliza estadísticas.", "Estudia exclusivamente las elecciones.", "Se limita a describir hechos."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-38", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cuál es una característica de la Filosofía Política?",
    opciones: ["Solo estudia normas jurídicas.", "Analiza únicamente el funcionamiento del Estado.", "Requiere pruebas científicas rigurosas.", "No necesita procedimientos científicos previamente establecidos."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-39", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Duverger, antes del siglo XIX los problemas políticos eran estudiados principalmente desde:",
    opciones: ["El derecho constitucional.", "La economía.", "La sociología.", "La moral."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-40", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Las teorías políticas buscan principalmente:",
    opciones: ["Modificar la realidad.", "Comprender y explicar la realidad política.", "Imponer una ideología.", "Organizar partidos políticos."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-41", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cuál de las siguientes características corresponde a una doctrina política?",
    opciones: ["Conocimiento especulativo.", "Busca influir y transformar la realida", "D) Ausencia de ideología.", "Neutralidad valorativa."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-42", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué tipo de doctrina política intenta conservar el orden existente?",
    opciones: ["Utópica.", "Reaccionaria.", "Revolucionaria.", "Conservadora."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-43", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Las doctrinas revolucionarias se caracterizan por:",
    opciones: ["Rechazar toda organización política.", "Restaurar el pasado.", "Mantener el orden vigente.", "Proyectar nuevas instituciones hacia el futuro."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-44", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué buscan las doctrinas reaccionarias?",
    opciones: ["Crear una sociedad imaginaria.", "Transformar radicalmente el futuro.", "Retrotraer la vida política al pasado.", "Mantener el equilibrio institucional."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-45", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Las doctrinas utópicas se caracterizan por:",
    opciones: ["Proyectar un futuro imaginario.", "Basarse únicamente en hechos históricos.", "Negar toda posibilidad de cambio.", "Defender exclusivamente el presente."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-46", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Fayt, la política como actividad consiste en:",
    opciones: ["La aplicación exclusiva de normas jurídicas.", "La organización económica de la comunidad.", "El estudio científico del Estado.", "La actividad humana destinada a ordenar jurídicamente la vida social."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-47", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cuáles son los tres momentos de la política como técnica de gobierno?",
    opciones: ["Poder, territorio y población.", "Constitución, legislación y jurisdicción.", "Conquista, ejercicio e institucionalización del poder.", "Nación, Estado y gobierno."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-48", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué busca el conocimiento político puro?",
    opciones: ["Resolver conflictos concretos.", "Formular políticas públicas.", "Alcanzar la mayor generalización posible sobre la realidad política.", "Organizar elecciones."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-49", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "El conocimiento político aplicado se orienta principalmente a:",
    opciones: ["La elaboración de teorías filosóficas.", "La interpretación exclusivamente jurídica.", "El estudio histórico del Estado.", "La práctica y el análisis de fenómenos concretos."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-50", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Fayt, la política como ciencia respecto de la ética es:",
    opciones: ["Idéntica a la moral.", "Subordinada al derecho natural.", "Totalmente dependiente.", "Completamente independiente."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-51", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Fayt, la política como técnica respecto de la ética es:",
    opciones: ["Exclusivamente jurídica.", "Completamente independiente.", "Vinculante, ya que la moral determina los fines y medios de la acción política.", "Contraria a la ética."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-52", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué estudia la ética?",
    opciones: ["El ejercicio del poder.", "La organización del Estado.", "La moralidad y las reglas de buena conducta fundadas en la virtu", "D) La administración pública."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-53", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué postura sostiene Platón sobre la relación entre política y ética?",
    opciones: ["La política está subordinada a la ética.", "La ética depende de la política.", "No existe relación entre ambas.", "Son completamente independientes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-54", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Aristóteles, la política y la moral:",
    opciones: ["Poseen ámbitos diferenciados.", "Deben estar siempre enfrentadas.", "Son idénticas.", "No guardan ninguna relación."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-55", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué postura sostiene Maquiavelo respecto de la política y la moral?",
    opciones: ["La moral reemplaza a la política.", "La política debe estar subordinada a la moral.", "Son completamente inseparables.", "La política es independiente de la moral."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-56", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Mario López, ¿qué es el método?",
    opciones: ["Una teoría filosófica.", "Un conjunto de procedimientos para alcanzar un fin determinado.", "Una institución política.", "Una norma jurídica."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-57", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cómo se denomina el estudio del método?",
    opciones: ["Metodología.", "Hermenéutica.", "Sociología.", "Epistemología."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-58", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Mario López, el método está relacionado con:",
    opciones: ["La religión.", "El sistema económico.", "La moral.", "El objeto que se pretende conocer."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-59", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cuál fue tradicionalmente considerado el objeto de estudio de la Ciencia Política?",
    opciones: ["Los partidos políticos.", "El gobierno.", "El Estado.", "La Constitución."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-60", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Actualmente, según el material, el objeto específico de la Ciencia Política es:",
    opciones: ["La Nación.", "El territorio.", "El poder.", "La Constitución."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-61", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Qué función cumplen las técnicas de investigación según Burdeau?",
    opciones: ["Conocer los hechos determinados por el método.", "Dictar políticas públicas.", "Crear instituciones.", "Elaborar normas jurídicas."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-62", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Burdeau, \"el espíritu inventa el método\" mientras que:",
    opciones: ["El Estado crea el método.", "La ética impone el conocimiento.", "La política determina la técnica.", "Lo real impone la técnica."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-63", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cuál de los siguientes es un método de investigación científica?",
    opciones: ["Método constitucional.", "Método de investigación.", "Método legislativo.", "Método judicial."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-64", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "¿Cuál de los siguientes es un método universal del conocimiento?",
    opciones: ["Electoral.", "Administrativo.", "Análisis.", "Parlamentario."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-65", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "El método de síntesis consiste en:",
    opciones: ["Recomponer el todo previamente analizado.", "Formular hipótesis jurídicas.", "Elaborar estadísticas.", "Separar un todo en sus partes."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-66", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "Según Comisión 1, la política es una relación:",
    opciones: ["Jurídica.", "Económica.", "Dual.", "Triádica."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 25
  },
{
    id: "10114-67", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué autor entiende la política desde la lógica amigo-enemigo?",
    opciones: ["Jellinek.", "Weber.", "Schmitt.", "Heller."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-68", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Schmitt, el Estado actúa como:",
    opciones: ["Competidor.", "Tercero mediador.", "Enemigo.", "Partido político."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-69", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué sostiene Foucault respecto del poder?",
    opciones: ["Hay poder cuando existe resistencia.", "El poder siempre implica violencia.", "El poder pertenece exclusivamente al gobierno.", "El poder existe únicamente en el Estado."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-70", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Foucault, cuando existe violencia:",
    opciones: ["Se fortalece el consenso.", "Desaparece el Estado.", "El poder aumenta.", "La resistencia ha sido vencida."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-71", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Cuál es una característica de la teoría política?",
    opciones: ["D) Tiene un carácter interesado.", "Está atravesada por la ideología.", "Busca objetividad.", "Pretende modificar la realida"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-72", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Cuál es una característica propia de la doctrina política?",
    opciones: ["Neutralidad valorativa.", "Objetividad absoluta.", "Conocimiento interesado atravesado por la ideología.", "Ausencia de fines prácticos."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-73", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Comisión 1, la Ciencia Política estudia principalmente:",
    opciones: ["Las relaciones de poder independientemente del Estado.", "Solo la organización constitucional.", "Exclusivamente las elecciones.", "El poder sometido al derecho."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-74", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Comisión 1, el Derecho Político estudia:",
    opciones: ["La historia de las ideas políticas.", "La organización judicial.", "El poder subordinado al derecho.", "El poder económico."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-75", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué diferencia fundamental existe entre Ciencia Política y Derecho Político según Comisión 1?",
    opciones: ["La Ciencia Política estudia exclusivamente el Estado argentino.", "La Ciencia Política estudia el poder en general, mientras que el Derecho Político analiza ese poder sometido al orden jurídico.", "No existe diferencia entre ambas disciplinas.", "El Derecho Político estudia únicamente la Constitución."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-76", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿En qué país comenzó a desarrollarse la teorización moderna del Estado hacia fines del siglo XIX?",
    opciones: ["Francia.", "Inglaterra.", "Alemania.", "Italia."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-77", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué autor sostuvo que la ciencia del Estado debía ser multidisciplinaria, incorporando aspectos jurídicos, sociales y culturales?",
    opciones: ["Kelsen.", "Jellinek.", "Schmitt.", "Heller."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-78", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Jellinek, la doctrina general del Estado tiene por finalidad:",
    opciones: ["Hallar el principio fundamental del Estado e investigar científicamente sus fenómenos generales.", "Analizar exclusivamente la legislación vigente.", "Estudiar un Estado en particular.", "Comparar únicamente constituciones."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-79", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Cómo divide Jellinek la doctrina particular del Estado?",
    opciones: ["Histórica y filosófica.", "Política y jurídica.", "Nacional e internacional.", "Especial e individual."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-80", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué propone investigar Heller respecto del Estado?",
    opciones: ["Una teoría jurídica pura.", "La específica realidad de la vida estatal, su estructura, función y evolución.", "Únicamente las constituciones.", "Solamente las normas jurídicas."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-81", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Kelsen, la teoría del Estado debe coincidir con:",
    opciones: ["La Filosofía.", "La Teoría del Derecho.", "La Economía.", "La Sociología."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-82", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Históricamente, la relación entre política y derecho se caracterizó porque:",
    opciones: ["Durante gran parte de la historia la política predominó sobre el derecho.", "Nunca existió relación entre ambas.", "El derecho siempre predominó sobre la política.", "La política estuvo subordinada al derecho desde la antigüedad."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-83", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según el material, en los últimos aproximadamente 200 años:",
    opciones: ["Desapareció el Estado.", "El derecho quedó subordinado a la política.", "La política pasó a estar subordinada al derecho.", "Se eliminó toda relación entre política y derecho."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-84", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué hecho histórico impulsó la separación entre política y religión?",
    opciones: ["La Revolución Industrial.", "La Reforma Universitaria.", "El pensamiento de Maquiavelo y la Revolución Francesa.", "La caída del Imperio Romano."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-85", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Aristóteles, la política era considerada:",
    opciones: ["La ética más sagrada.", "Una actividad económica.", "Un instrumento militar.", "Una técnica neutral."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-86", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según el material, la ética es:",
    opciones: ["Sinónimo de moral.", "Exclusivamente una doctrina religiosa.", "Una construcción social cambiante.", "Un conjunto de principios y valores fundados en el bien, la justicia y la verdad."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-87", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Comisión 1, la moral se diferencia de la ética porque:",
    opciones: ["La moral pertenece únicamente al derecho.", "La moral es única y la ética múltiple.", "La moral constituye una construcción social y pueden existir varias morales.", "Son exactamente lo mismo."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-88", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué obra escribió Max Weber sobre la política y el poder?",
    opciones: ["El contrato social.", "El espíritu de las leyes.", "El político y el científico.", "Leviatán."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-89", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "La ética de las convicciones, según Weber, se caracteriza porque:",
    opciones: ["Se guía por principios sin considerar las consecuencias.", "Solo puede ser aplicada por gobernantes.", "Depende de la razón de Estado.", "Prioriza exclusivamente las consecuencias."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-90", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "La ética de la responsabilidad exige que el gobernante:",
    opciones: ["Delegue todas sus responsabilidades.", "Ignore el interés general.", "Actúe únicamente según sus convicciones.", "Considere las consecuencias de sus decisiones."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-91", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Con qué concepto se relaciona directamente la ética de la responsabilidad?",
    opciones: ["Democracia directa.", "División de poderes.", "Razón de Estado.", "Estado de Derecho."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-92", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué se entiende por Razón de Estado?",
    opciones: ["La supremacía del Poder Judicial.", "El argumento utilizado por las autoridades para justificar decisiones orientadas al bien común aunque parte de la información permanezca reservada.", "El principio de legalida", "D) La soberanía popular."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-93", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué postura identifica Aranguren con el realismo político (Realpolitik)?",
    opciones: ["No existe relación entre política y moral.", "La política debe responder exclusivamente a la religión.", "La ética prevalece siempre sobre el poder.", "La política debe estar subordinada a la ética."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-94", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué autor es considerado el principal antecedente del Realpolitik mencionado por Aranguren?",
    opciones: ["Maquiavelo.", "Platón.", "Aristóteles.", "Rousseau."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-95", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Según Aranguren, el rechazo burgués hacia la política se caracteriza por:",
    opciones: ["Defender el absolutismo.", "Rechazar toda forma de organización social.", "Identificar a la política con la corrupción y la insatisfacción de intereses sociales.", "Promover la desaparición del Estado."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-96", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "El rechazo anarquista a la política implica:",
    opciones: ["Fortalecer el Estado.", "Rechazar cualquier organización superior al individuo.", "Defender la monarquía.", "Promover el parlamentarismo."],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-97", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "Para Aranguren, la política como imposibilidad trágica se vincula principalmente con:",
    opciones: ["El pensamiento religioso o cristiano.", "El positivismo jurídico.", "El marxismo.", "El liberalismo económico."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-98", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Cuál fue el primer tipo histórico de Estado estudiado en el material?",
    opciones: ["Estado moderno.", "Estado constitucional.", "Estado liberal.", "Estado antiguo teocrático oriental."],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-99", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "¿Qué característica distingue al Estado antiguo teocrático oriental?",
    opciones: ["La división de poderes.", "La separación entre religión y poder político.", "La identificación del poder con la divinidad.", "La soberanía popular."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10114-100", id_categoria: "10114", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "En el Estado antiguo teocrático oriental, el poder del faraón era considerado indiscutible porque:",
    opciones: ["Había sido elegido por el pueblo.", "Estaba sometido a la Constitución.", "Era considerado una autoridad de origen divino.", "Dependía del Poder Judicial."],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Programa Cátedra FCJyS UNLP - Derecho Político.", puntos_base: 50
  },
{
    id: "10122-01", id_categoria: "10122", categoria_nombre: "D. Privado I (Civil)", dificultad: "facil",
    pregunta: "¿A qué edad se alcanza la mayoría de edad legal en la República Argentina según el CCyCN?",
    opciones: ["A los 21 años", "A los 18 años", "A los 16 años", "A los 25 años"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 25 del Código Civil y Comercial de la Nación.", puntos_base: 10
  },
{
    id: "10122-02", id_categoria: "10122", categoria_nombre: "D. Privado I (Civil)", dificultad: "media",
    pregunta: "¿Cuáles son los atributos inherentes a la personalidad jurídica de la persona humana?",
    opciones: ["Nombre, Domicilio, Estado Civil, Capacidad y Patrimonio", "Firma, DNI, Trabajo y Salario", "Nacionalidad, Propiedad, Credencial y Contrato", "Libertad, Profesión, Matrícula y Título"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Libro Primero, Título I.", puntos_base: 25
  },
{
    id: "10122-03", id_categoria: "10122", categoria_nombre: "D. Privado I (Civil)", dificultad: "facil",
    pregunta: "¿En qué momento comienza la existencia de la persona humana según el Art. 19 del CCyCN?",
    opciones: ["Con el nacimiento con vida", "Con la concepción", "A los 3 meses de gestación", "Con la inscripción registral en el Registro Civil"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 19 CCyCN: 'La existencia de la persona humana comienza con la concepción'.", puntos_base: 10
  },
{
    id: "10122-04", id_categoria: "10122", categoria_nombre: "D. Privado I (Civil)", dificultad: "media",
    pregunta: "El vicio del acto jurídico en el que una parte explota la necesidad, miseria o inexperiencia de la otra se denomina:",
    opciones: ["Simulación", "Lesión enorme", "Dolo intencional", "Fraude a los acreedores"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 332 del Código Civil y Comercial de la Nación.", puntos_base: 25
  },
{
    id: "10122-05", id_categoria: "10122", categoria_nombre: "D. Privado I (Civil)", dificultad: "dificil",
    pregunta: "¿Cuál es el plazo de prescripción de la acción para declarar la nulidad de un acto jurídico viciado por dolo o violencia?",
    opciones: ["5 años", "2 años", "10 años", "1 año"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2562 inc. a del CCyCN.", puntos_base: 50
  },
{
    id: "10124-01", id_categoria: "10124", categoria_nombre: "D. Penal I", dificultad: "facil",
    pregunta: "¿Qué principio consagrado en el Art. 18 de la CN establece que nadie puede ser penado sin juicio previo ni ley anterior al hecho?",
    opciones: ["Principio de Oportunidad", "Principio de Legalidad (Nullum crimen sine lege)", "Principio de Inocencia", "Principio de Tipicidad Estricta"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 18 de la Constitución Nacional y Art. 2 del Código Penal.", puntos_base: 10
  },
{
    id: "10124-02", id_categoria: "10124", categoria_nombre: "D. Penal I", dificultad: "media",
    pregunta: "En la estructura de la teoría del delito, el juicio de reproche individual que se le hace al autor imputable es la:",
    opciones: ["Antijuridicidad", "Culpabilidad", "Tipicidad objetiva", "Punibilidad administrativa"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Dogmática Penal Parte General.", puntos_base: 25
  },
{
    id: "10124-03", id_categoria: "10124", categoria_nombre: "D. Penal I", dificultad: "facil",
    pregunta: "¿Cuándo se configura la Legítima Defensa como causa de justificación según el Art. 34 inc. 6 del CP?",
    opciones: ["Ante cualquier agresión verbal", "Cuando hay agresión ilegítima, falta de provocación suficiente y necesidad racional del medio empleado", "Solo si interviene la policía en el lugar", "Únicamente si ocurre dentro de la propia vivienda de noche"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 34 inc. 6 del Código Penal Argentino.", puntos_base: 10
  },
{
    id: "10124-04", id_categoria: "10124", categoria_nombre: "D. Penal I", dificultad: "media",
    pregunta: "La tentativa de delito sancionada en el Art. 42 del Código Penal exige que el sujeto:",
    opciones: ["Solo piense cometer un delito sin ejecutarlo", "Comience la ejecución de un delito determinado pero no se consuma por circunstancias ajenas a su voluntad", "Consume íntegramente el delito", "Desista voluntariamente antes de causar daño"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 42 del Código Penal de la Nación.", puntos_base: 25
  },
{
    id: "10124-05", id_categoria: "10124", categoria_nombre: "D. Penal I", dificultad: "dificil",
    pregunta: "En la teoría del concurso de delitos, cuando un solo hecho encuadra en varios tipos penales se configura un:",
    opciones: ["Concurso real de delitos", "Concurso ideal de delitos", "Delito continuado", "Concurso aparente de leyes"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 54 del Código Penal Argentino.", puntos_base: 50
  },
{
    id: "10125-01", id_categoria: "10125", categoria_nombre: "D. Constitucional", dificultad: "facil",
    pregunta: "¿Qué acción constitucional tutelada en el Art. 43 de la CN protege de forma rápida la libertad física o ambulatoria?",
    opciones: ["Acción de Amparo", "Habeas Corpus", "Habeas Data", "Recurso de Inconstitucionalidad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 43 último párrafo de la Constitución Nacional.", puntos_base: 10
  },
{
    id: "10125-02", id_categoria: "10125", categoria_nombre: "D. Constitucional", dificultad: "media",
    pregunta: "¿Qué mayoría calificada exige el Art. 30 de la CN a cada Cámara del Congreso para declarar la necesidad de la Reforma Constitucional?",
    opciones: ["Mayoría simple de los miembros presentes", "Dos terceras partes (2/3) de sus miembros al menos", "Tres cuartas partes de los votos", "Unanimidad de ambas Cámaras"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 30 de la Constitución Nacional Argentina.", puntos_base: 25
  },
{
    id: "10125-03", id_categoria: "10125", categoria_nombre: "D. Constitucional", dificultad: "facil",
    pregunta: "¿Qué órgano tiene el control de constitucionalidad en la República Argentina según la jurisprudencia de la CSJN?",
    opciones: ["Un Tribunal Constitucional especializado exclusivo", "Todos los jueces de cualquier fuero e instancia (Control Difuso)", "El Poder Ejecutivo Nacional mediante veto", "El Congreso de la Nación por Comisión Bicameral"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Fallos CSJN 'Sojo' (1887) y 'Elortondo' (1888).", puntos_base: 10
  },
{
    id: "10125-04", id_categoria: "10125", categoria_nombre: "D. Constitucional", dificultad: "media",
    pregunta: "El fallo histórico de la CSJN que creó pretorianamente la acción judicial de Amparo en 1957 fue:",
    opciones: ["Fallo Kot", "Fallo Siri", "Fallo Fayt", "Fallo Bazterrica"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "CSJN, Fallo 'Siri, Ángel' (27/12/1957).", puntos_base: 25
  },
{
    id: "10125-05", id_categoria: "10125", categoria_nombre: "D. Constitucional", dificultad: "dificil",
    pregunta: "Los Decretos de Necesidad y Urgencia (DNU) previstos en el Art. 99 inc. 3 de la CN prohíben expresamente dictar normas sobre materia:",
    opciones: ["Administrativa y comercial", "Penal, tributaria, electoral o de régimen de los partidos políticos", "Presupuestaria y de obras públicas", "Internacional y diplomática"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 99 inc. 3 de la CN tras la Reforma de 1994.", puntos_base: 50
  },
{
    id: "10134-01", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "facil",
    pregunta: "En el Código Procesal Civil y Comercial (CPCCBA), la facultad que tiene el demandado de reconvenir significa:",
    opciones: ["Impugnar la competencia del juez", "Demandar reconvencionalmente al actor en la misma contestación", "Pedir la caducidad de instancia", "Solamente negar los hechos de la demanda"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 355 del CPCCBA.", puntos_base: 10
  },
{
    id: "10134-02", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "media",
    pregunta: "¿Cuál es el plazo de caducidad de la instancia en primera instancia en el juicio ordinario en PBA?",
    opciones: ["3 meses", "6 meses", "1 año", "2 años"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 310 inc. 1 del CPCCBA.", puntos_base: 25
  },
{
    id: "10640-01", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "facil",
    pregunta: "¿Qué indemnización por antigüedad prevé el Art. 245 de la LCT (Ley 20.744) por despido incausado?",
    opciones: ["Medio sueldo por cada año de servicio", "Un mes de sueldo por cada año de servicio o fracción mayor de 3 meses", "Tres meses de sueldo fijos", "6 meses de salario garantizados"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 245 de la Ley de Contrato de Trabajo 20.744.", puntos_base: 10
  },
{
    id: "10141-01", id_categoria: "10141", categoria_nombre: "D. Administrativo I", dificultad: "facil",
    pregunta: "¿Cuáles son los elementos esenciales del Acto Administrativo según la Ley de Procedimiento Administrativo?",
    opciones: ["Competencia, Causa, Objeto, Procedimiento, Motivación y Finalidad", "Solamente la firma del Ministro", "El presupuesto y la licitación", "La publicación en el Boletín Oficial únicamente"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 7 de la Ley 19.549 / Decreto-Ley 7647 PBA.", puntos_base: 10
  },
{
    id: "10141-02", id_categoria: "10141", categoria_nombre: "D. Administrativo I", dificultad: "media",
    pregunta: "La presunción de legitimidad del acto administrativo implica que:",
    opciones: ["Es siempre inimpugnable ante la justicia", "Se presume válido y ajustado a derecho hasta que se declare su nulidad", "Carece de fuerza ejecutoria de pleno derecho", "Requiere homologación judicial obligatoria antes de aplicarse"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 12 de la Ley de Procedimientos Administrativos 19.549.", puntos_base: 25
  },
{
    id: "10626-01", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "facil",
    pregunta: "¿Qué tribunal internacional con sede en San José de Costa Rica tiene competencia para juzgar la responsabilidad de los Estados americanos?",
    opciones: ["Tribunal Penal Internacional", "Corte Interamericana de Derechos Humanos (Corte IDH)", "Corte Internacional de Justicia (La Haya)", "Comité de Derechos Humanos de la ONU"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Convención Americana sobre Derechos Humanos (Pacto de San José de Costa Rica).", puntos_base: 10
  },
{
    id: "10132-01", id_categoria: "10132", categoria_nombre: "D. Privado IV (Com.)", dificultad: "facil",
    pregunta: "El título valor librado por el girador que contiene una promesa incondicional de pagar una suma determinada de dinero a su vencimiento se denomina:",
    opciones: ["Cheque cruzado", "Pagaré", "Warrant", "Factura de crédito"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Decreto-Ley 5965/63 (Régimen de Letra de Cambio y Pagaré).", puntos_base: 10
  },
{
    id: "10142-01", id_categoria: "10142", categoria_nombre: "D. Privado VI (Com.)", dificultad: "media",
    pregunta: "En la Sociedad de Responsabilidad Limitada (SRL) regulada en la Ley 19.550, la responsabilidad de los socios está limitada a:",
    opciones: ["Todo su patrimonio personal sin tope", "La integración de las cuotas que suscriban o adquieran", "El capital social declarado en el balance anterior", "La decisión del órgano de fiscalización"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 146 de la Ley General de Sociedades 19.550.", puntos_base: 25
  },
{
    id: "10653-01", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "facil",
    pregunta: "En el Código Civil y Comercial, el divorcio unilateral puede ser solicitado por:",
    opciones: ["Solo uno de los cónyuges sin necesidad de invocar causa ni esperar plazo", "Ambos cónyuges de común acuerdo únicamente", "Solo si han transcurrido 3 años de separación de hecho", "Únicamente alegando culpa o infidelidad en la demanda"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 437 CCyCN: 'El divorcio se declara judicialmente a petición de uno o de ambos cónyuges'.", puntos_base: 10
  },
{
    id: "10659-01", id_categoria: "10659", categoria_nombre: "D. Sucesiones", dificultad: "media",
    pregunta: "Según el Art. 2445 del CCyCN, la porción legítima inviolable reservada al cónyuge supérstite en la sucesión es de:",
    opciones: ["Dos tercios (2/3)", "Un medio (1/2)", "Un tercio (1/3)", "Tres cuartos (3/4)"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2445 del Código Civil y Comercial de la Nación.", puntos_base: 25
  },
{
    id: "10147-01", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "media",
    pregunta: "¿Qué filósofo del derecho formuló la 'Fórmula de Radbruch' expresando que el derecho extremadamente injusto no es derecho?",
    opciones: ["Hans Kelsen", "Gustav Radbruch", "Robert Alexy", "John Finnis"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Gustav Radbruch, 'Gesetzliches Unrecht und übergesetzliches Recht' (1946).", puntos_base: 25
  },
{
    id: "10123-02", id_categoria: "10123", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Quién es considerado el padre de la teoría de la separación de poderes?",
    opciones: ["Jean-Jacques Rousseau", "John Locke", "Montesquieu", "Thomas Hobbes"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Montesquieu, 'El Espíritu de las Leyes' (1748).", puntos_base: 10
  },
{
    id: "10123-03", id_categoria: "10123", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "En la teoría de Thomas Hobbes, el 'estado de naturaleza' se caracteriza por:",
    opciones: ["La armonía social", "La guerra de todos contra todos", "La propiedad privada absoluta", "La democracia directa"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Thomas Hobbes, 'Leviatán' (1651), Capítulo XIII.", puntos_base: 25
  },
{
    id: "10123-04", id_categoria: "10123", categoria_nombre: "Derecho Político", dificultad: "dificil",
    pregunta: "La 'voluntad general' de Rousseau se distingue de la 'voluntad de todos' porque:",
    opciones: ["Es la suma de las voluntades individuales", "Busca el interés común y no la mera agregación de intereses particulares", "Es decidida por un monarca ilustrado", "Se forma solo en asambleas representativas"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Jean-Jacques Rousseau, 'El Contrato Social' (1762), Libro II, Cap. III.", puntos_base: 50
  },
{
    id: "10123-05", id_categoria: "10123", categoria_nombre: "Derecho Político", dificultad: "facil",
    pregunta: "¿Cuál es la forma de Estado en la que el poder se distribuye territorialmente entre un gobierno central y gobiernos locales?",
    opciones: ["Estado unitario", "Estado federal", "Confederación", "Monarquía constitucional"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1 CN: forma federal de gobierno.", puntos_base: 10
  },
{
    id: "10123-06", id_categoria: "10123", categoria_nombre: "Derecho Político", dificultad: "media",
    pregunta: "El concepto de 'soberanía popular' implica que la autoridad suprema del Estado reside en:",
    opciones: ["El monarca", "Los jueces", "El pueblo", "El parlamento exclusivamente"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Art. 33 CN: soberanía del pueblo. Rousseau, 'El Contrato Social'.", puntos_base: 25
  },
{
    id: "10124-02", id_categoria: "10124", categoria_nombre: "Derecho Penal I", dificultad: "facil",
    pregunta: "El principio de legalidad penal ('nullum crimen, nulla poena sine lege') está consagrado en:",
    opciones: ["El Art. 14 CN", "El Art. 18 CN", "El Art. 75 inc. 12 CN", "El Art. 1 del Código Civil"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 18 CN: 'Ningún habitante de la Nación puede ser penado sin juicio previo fundado en ley anterior al hecho del proceso'.", puntos_base: 10
  },
{
    id: "10124-03", id_categoria: "10124", categoria_nombre: "Derecho Penal I", dificultad: "media",
    pregunta: "En la teoría del delito, la 'antijuridicidad' significa que:",
    opciones: ["El autor obró con dolo", "La conducta es contraria al ordenamiento jurídico y no está justificada", "El delito es grave", "El imputado es inimputable"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Teoría general del delito. La antijuridicidad es el juicio de contrariedad entre la conducta típica y el ordenamiento jurídico.", puntos_base: 25
  },
{
    id: "10124-04", id_categoria: "10124", categoria_nombre: "Derecho Penal I", dificultad: "dificil",
    pregunta: "La legítima defensa como causa de justificación requiere, entre otros elementos:",
    opciones: ["Solo la voluntad de defenderse", "Agresión ilegítima actual o inminente, necesidad racional del medio empleado y falta de provocación suficiente", "Que el agresor sea mayor de edad", "Que el hecho ocurra en la vía pública"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 34 inc. 6 del Código Penal de la Nación.", puntos_base: 50
  },
{
    id: "10124-05", id_categoria: "10124", categoria_nombre: "Derecho Penal I", dificultad: "media",
    pregunta: "¿Cuál es la diferencia entre dolo directo y dolo eventual?",
    opciones: ["No hay diferencia", "En el dolo directo el autor quiere el resultado; en el eventual, lo acepta como posible y actúa igual", "En el dolo eventual hay intención directa", "El dolo eventual solo se aplica a contravenciones"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Teoría general del delito. El dolo eventual implica representación y aceptación del resultado típico.", puntos_base: 25
  },
{
    id: "10124-06", id_categoria: "10124", categoria_nombre: "Derecho Penal I", dificultad: "facil",
    pregunta: "¿Cuál es la edad mínima de imputabilidad penal plena en Argentina?",
    opciones: ["14 años", "16 años", "18 años", "21 años"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 22.278, Régimen Penal de Menores. A los 16 años son punibles por delitos graves.", puntos_base: 10
  },
{
    id: "10122-07", id_categoria: "10122", categoria_nombre: "D. Civil I - Privado II", dificultad: "facil",
    pregunta: "Según el CCyCN, ¿desde cuándo comienza la existencia de la persona humana?",
    opciones: ["Desde el nacimiento", "Desde la concepción", "Desde la inscripción en el Registro Civil", "Desde la mayoría de edad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 19 CCyCN: 'La existencia de la persona humana comienza con la concepción'.", puntos_base: 10
  },
{
    id: "10122-08", id_categoria: "10122", categoria_nombre: "D. Civil I - Privado II", dificultad: "media",
    pregunta: "¿Cuál es la edad para alcanzar la mayoría de edad según el CCyCN?",
    opciones: ["21 años", "18 años", "16 años", "25 años"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 25 CCyCN: 'Mayor de edad es la persona que cumple dieciocho años'.", puntos_base: 25
  },
{
    id: "10122-09", id_categoria: "10122", categoria_nombre: "D. Civil I - Privado II", dificultad: "dificil",
    pregunta: "La teoría del abuso del derecho está consagrada en el Art. 10 del CCyCN y establece que:",
    opciones: ["Todo ejercicio de un derecho es abusivo", "El ejercicio de un derecho es abusivo cuando contraría los fines del ordenamiento o excede los límites de la buena fe", "Solo los jueces pueden abusar del derecho", "El abuso del derecho solo se aplica a contratos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 10 CCyCN: Abuso del derecho.", puntos_base: 50
  },
{
    id: "10122-10", id_categoria: "10122", categoria_nombre: "D. Civil I - Privado II", dificultad: "media",
    pregunta: "Los atributos de la personalidad según la doctrina son:",
    opciones: ["Nombre, domicilio, capacidad, estado y patrimonio", "Solo nombre y domicilio", "Patrimonio y nacionalidad", "Edad y profesión"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina general. Los atributos de la personalidad son nombre, domicilio, capacidad, estado civil y patrimonio.", puntos_base: 25
  },
{
    id: "10122-11", id_categoria: "10122", categoria_nombre: "D. Civil I - Privado II", dificultad: "facil",
    pregunta: "¿Qué tipo de persona jurídica es una sociedad anónima?",
    opciones: ["Persona humana", "Persona jurídica privada", "Persona jurídica pública", "No es persona jurídica"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 148 inc. a) CCyCN: Las sociedades son personas jurídicas privadas.", puntos_base: 10
  },
{
    id: "10131-02", id_categoria: "10131", categoria_nombre: "D. Privado III - Contratos", dificultad: "facil",
    pregunta: "Según el CCyCN, el contrato es:",
    opciones: ["Un acuerdo unilateral", "El acto jurídico mediante el cual dos o más partes manifiestan su consentimiento para crear, regular, modificar, transferir o extinguir relaciones jurídicas patrimoniales", "Una declaración de voluntad sin efectos jurídicos", "Un acto ilícito que genera obligaciones"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 957 CCyCN.", puntos_base: 10
  },
{
    id: "10131-03", id_categoria: "10131", categoria_nombre: "D. Privado III - Contratos", dificultad: "media",
    pregunta: "La 'lesión subjetiva' como vicio del acto jurídico requiere:",
    opciones: ["Solo ventaja patrimonial desproporcionada", "Explotación de la necesidad, debilidad o inexperiencia de la otra parte y desproporción de las prestaciones", "Que ambas partes sean menores de edad", "Que el contrato sea verbal"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 332 CCyCN: Lesión.", puntos_base: 25
  },
{
    id: "10131-04", id_categoria: "10131", categoria_nombre: "D. Privado III - Contratos", dificultad: "dificil",
    pregunta: "La teoría de la imprevisión (Art. 1091 CCyCN) permite la resolución o adecuación del contrato cuando:",
    opciones: ["Una parte se arrepiente", "Eventos extraordinarios e imprevisibles alteran la ecuación económica de modo excesivo", "El contrato es nulo de nulidad absoluta", "El deudor simplemente no quiere pagar"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1091 CCyCN: Imprevisión.", puntos_base: 50
  },
{
    id: "10131-05", id_categoria: "10131", categoria_nombre: "D. Privado III - Contratos", dificultad: "media",
    pregunta: "¿Cuáles son los elementos esenciales del contrato?",
    opciones: ["Capacidad, consentimiento, objeto y causa", "Solo consentimiento y objeto", "Plazo y precio", "Escritura pública y testigos"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 957 a 1065 CCyCN: Elementos esenciales del contrato.", puntos_base: 25
  },
{
    id: "10131-06", id_categoria: "10131", categoria_nombre: "D. Privado III - Contratos", dificultad: "facil",
    pregunta: "La seña (arras) en un contrato de compraventa, ¿permite arrepentirse del negocio?",
    opciones: ["Nunca", "Sí, perdiendo la seña o devolviéndola doblada, salvo pacto en contrario", "Solo si lo autoriza un juez", "Solo en contratos de locación"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1059 CCyCN: Seña o arras.", puntos_base: 10
  },
{
    id: "10133-02", id_categoria: "10133", categoria_nombre: "D. Penal II", dificultad: "facil",
    pregunta: "El delito de homicidio simple está tipificado en el Art. 79 del Código Penal con una pena de:",
    opciones: ["3 a 6 años de prisión", "8 a 25 años de reclusión o prisión", "Prisión perpetua", "1 a 3 años de prisión"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 79 del Código Penal: 'Se aplicará reclusión o prisión de ocho a veinticinco años'.", puntos_base: 10
  },
{
    id: "10133-03", id_categoria: "10133", categoria_nombre: "D. Penal II", dificultad: "media",
    pregunta: "El delito de estafa (Art. 172 CP) requiere como elemento típico:",
    opciones: ["Violencia física", "Ardid o engaño que induzca en error a la víctima", "Uso de armas", "Coacción psicológica únicamente"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 172 del Código Penal de la Nación.", puntos_base: 25
  },
{
    id: "10133-04", id_categoria: "10133", categoria_nombre: "D. Penal II", dificultad: "dificil",
    pregunta: "La tentativa de delito (Art. 42 CP) se configura cuando el autor:",
    opciones: ["Piensa en cometer un delito", "Con el fin de cometer un delito determinado, comienza su ejecución pero no lo consuma por circunstancias ajenas a su voluntad", "Realiza actos preparatorios", "Confiesa su intención"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 42 del Código Penal de la Nación.", puntos_base: 50
  },
{
    id: "10133-05", id_categoria: "10133", categoria_nombre: "D. Penal II", dificultad: "media",
    pregunta: "¿Cuál es la diferencia entre hurto y robo en el Código Penal argentino?",
    opciones: ["No existe diferencia", "El robo involucra fuerza en las cosas o violencia en las personas", "El hurto es más grave que el robo", "El hurto solo se aplica a bienes inmuebles"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 162 (hurto) y 164 (robo) del Código Penal.", puntos_base: 25
  },
{
    id: "10133-06", id_categoria: "10133", categoria_nombre: "D. Penal II", dificultad: "facil",
    pregunta: "La pena de prisión perpetua en Argentina se aplica, entre otros, al delito de:",
    opciones: ["Lesiones leves", "Homicidio agravado (Art. 80 CP)", "Daño simple", "Calumnias"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 80 del Código Penal: homicidios agravados.", puntos_base: 10
  },
{
    id: "10134-02", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "facil",
    pregunta: "¿Qué principio procesal establece que el juez debe resolver según lo alegado y probado por las partes?",
    opciones: ["Principio inquisitivo", "Principio dispositivo", "Principio de oficiosidad", "Principio de oralidad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Principio dispositivo: Art. 163 inc. 6 del CPCCBA.", puntos_base: 10
  },
{
    id: "10134-03", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "media",
    pregunta: "La 'litispendencia' como excepción procesal se configura cuando:",
    opciones: ["El juez es incompetente", "Existe otro proceso pendiente entre las mismas partes, por el mismo objeto y la misma causa", "El demandado no contesta la demanda", "El actor desiste de la acción"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 345 inc. 4 del CPCCBA.", puntos_base: 25
  },
{
    id: "10134-04", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "dificil",
    pregunta: "La 'cosa juzgada material' implica que:",
    opciones: ["La sentencia puede ser revisada en cualquier momento", "La sentencia firme es inmutable e irrevocable respecto de las cuestiones decididas", "Solo se aplica a sentencias de primera instancia", "Equivale a la perención de instancia"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Principio de cosa juzgada material. Art. 278 del CPCCBA.", puntos_base: 50
  },
{
    id: "10134-05", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "media",
    pregunta: "¿Qué recurso procesal se interpone contra sentencias definitivas de primera instancia?",
    opciones: ["Recurso de reposición", "Recurso de apelación", "Recurso de queja", "Recurso extraordinario federal"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 242 y ss. del CPCCBA: Recurso de apelación.", puntos_base: 25
  },
{
    id: "10134-06", id_categoria: "10134", categoria_nombre: "D. Procesal I", dificultad: "facil",
    pregunta: "La demanda judicial debe contener, como mínimo:",
    opciones: ["Solo el nombre del actor", "Los hechos, el derecho invocado, la cosa demandada y la petición", "Una oferta de mediación", "La sentencia esperada"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 330 del CPCCBA: requisitos de la demanda.", puntos_base: 10
  },
{
    id: "10135-02", id_categoria: "10135", categoria_nombre: "D. Procesal II - Penal", dificultad: "facil",
    pregunta: "¿Quién ejerce la acción penal pública en Argentina?",
    opciones: ["El juez de instrucción", "El Ministerio Público Fiscal", "La víctima exclusivamente", "El abogado defensor"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 120 CN y Art. 5 CPPN: El Ministerio Público Fiscal promueve la acción penal pública.", puntos_base: 10
  },
{
    id: "10135-03", id_categoria: "10135", categoria_nombre: "D. Procesal II - Penal", dificultad: "media",
    pregunta: "El principio 'in dubio pro reo' significa que:",
    opciones: ["El acusado siempre es culpable", "En caso de duda, se debe estar a favor del imputado", "El fiscal puede modificar la acusación en cualquier momento", "El juez puede presumir la culpabilidad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Principio derivado de la presunción de inocencia (Art. 18 CN y Art. 8.2 CADH).", puntos_base: 25
  },
{
    id: "10135-04", id_categoria: "10135", categoria_nombre: "D. Procesal II - Penal", dificultad: "dificil",
    pregunta: "La suspensión del juicio a prueba ('probation') del Art. 76 bis del Código Penal es aplicable cuando:",
    opciones: ["El delito tiene pena de prisión perpetua", "El máximo de la pena no excede de 3 años y el imputado no tiene condenas anteriores", "El imputado es reincidente", "Solo en delitos de acción privada"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 76 bis del Código Penal de la Nación.", puntos_base: 50
  },
{
    id: "10135-05", id_categoria: "10135", categoria_nombre: "D. Procesal II - Penal", dificultad: "media",
    pregunta: "¿Qué es el 'juicio abreviado' en el proceso penal?",
    opciones: ["Un juicio sin abogado defensor", "Un procedimiento donde el imputado admite el hecho y se acuerda la pena con el fiscal", "Un juicio sin prueba testimonial", "Un juicio ante la Corte Suprema"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 431 bis del CPPN.", puntos_base: 25
  },
{
    id: "10135-06", id_categoria: "10135", categoria_nombre: "D. Procesal II - Penal", dificultad: "facil",
    pregunta: "La prisión preventiva es una medida:",
    opciones: ["Punitiva", "Cautelar de carácter excepcional", "Definitiva", "Administrativa"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 280 del CPPN. La prisión preventiva es excepcional y cautelar.", puntos_base: 10
  },
{
    id: "10626-02", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "facil",
    pregunta: "¿En qué año fue adoptada la Declaración Universal de Derechos Humanos?",
    opciones: ["1945", "1948", "1966", "1969"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "DUDH, adoptada por la Asamblea General de la ONU el 10 de diciembre de 1948.", puntos_base: 10
  },
{
    id: "10626-03", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "media",
    pregunta: "La Convención Americana sobre Derechos Humanos (Pacto de San José de Costa Rica) fue suscripta en:",
    opciones: ["1948", "1966", "1969", "1994"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "CADH, suscripta en San José, Costa Rica, el 22 de noviembre de 1969.", puntos_base: 25
  },
{
    id: "10626-04", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "dificil",
    pregunta: "¿Qué artículo de la Constitución Nacional otorga jerarquía constitucional a los tratados de derechos humanos?",
    opciones: ["Art. 14 bis", "Art. 43", "Art. 75 inc. 22", "Art. 116"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Art. 75 inc. 22 CN (reforma de 1994): tratados internacionales de DDHH con jerarquía constitucional.", puntos_base: 50
  },
{
    id: "10626-05", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "media",
    pregunta: "¿Ante qué órgano se puede presentar una petición individual contra un Estado parte de la CADH?",
    opciones: ["La Asamblea General de la ONU", "La Comisión Interamericana de Derechos Humanos", "El Tribunal Penal Internacional", "El Consejo de Europa"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 44 y 45 de la CADH: Peticiones ante la CIDH.", puntos_base: 25
  },
{
    id: "10626-06", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "facil",
    pregunta: "El principio 'pro homine' o 'pro persona' en materia de derechos humanos implica:",
    opciones: ["Aplicar la norma más restrictiva", "Interpretar y aplicar la norma que sea más favorable a la persona", "Que los derechos humanos son absolutos", "Que solo se aplica en tribunales internacionales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Principio pro persona: Art. 29 de la CADH.", puntos_base: 10
  },
{
    id: "10640-02", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "facil",
    pregunta: "El principio protectorio del derecho del trabajo se manifiesta en tres reglas. ¿Cuáles son?",
    opciones: ["In dubio pro operario, norma más favorable y condición más beneficiosa", "Igualdad, buena fe y razonabilidad", "Irrenunciabilidad, continuidad y primacía de la realidad", "Gratuidad, celeridad y oralidad"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 9 de la Ley 20.744 (LCT): Principio protectorio.", puntos_base: 10
  },
{
    id: "10640-03", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "media",
    pregunta: "¿Cuántos meses de antigüedad necesita un trabajador para acceder a la indemnización por despido sin causa del Art. 245 LCT?",
    opciones: ["1 mes", "3 meses", "6 meses", "1 año"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 245 y 92 bis de la LCT: período de prueba de 3 meses.", puntos_base: 25
  },
{
    id: "10640-04", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "dificil",
    pregunta: "La 'primacía de la realidad' como principio laboral significa que:",
    opciones: ["Los contratos escritos prevalecen siempre", "En caso de discordancia entre lo documentado y lo realmente ocurrido, prevalecen los hechos", "El trabajador siempre tiene razón", "Las normas laborales no admiten interpretación"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 14 LCT y doctrina del derecho del trabajo.", puntos_base: 50
  },
{
    id: "10640-05", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "media",
    pregunta: "La jornada legal máxima de trabajo para adultos es de:",
    opciones: ["6 horas diarias", "8 horas diarias o 48 semanales", "10 horas diarias", "12 horas diarias"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 11.544 y Art. 196 LCT: 8 horas diarias o 48 semanales.", puntos_base: 25
  },
{
    id: "10640-06", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "facil",
    pregunta: "El Art. 14 bis de la Constitución Nacional establece la protección de:",
    opciones: ["Los derechos patrimoniales", "El trabajo en todas sus formas gozará de la protección de las leyes", "El comercio internacional", "La propiedad intelectual"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 14 bis CN: derechos del trabajador, gremiales y de la seguridad social.", puntos_base: 10
  },
{
    id: "10143-01", id_categoria: "10143", categoria_nombre: "D. Administrativo II", dificultad: "facil",
    pregunta: "¿Qué tipo de responsabilidad tiene el Estado por los daños causados por la actividad legítima?",
    opciones: ["Responsabilidad subjetiva", "Responsabilidad objetiva y directa", "Ninguna responsabilidad", "Solo responsabilidad contractual"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 26.944 de Responsabilidad del Estado.", puntos_base: 10
  },
{
    id: "10143-02", id_categoria: "10143", categoria_nombre: "D. Administrativo II", dificultad: "media",
    pregunta: "El recurso jerárquico en sede administrativa se interpone ante:",
    opciones: ["El mismo funcionario que dictó el acto", "El superior jerárquico del funcionario que dictó el acto", "Un tribunal judicial", "El Defensor del Pueblo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 89 del Reglamento de Procedimientos Administrativos (Dto. 1759/72).", puntos_base: 25
  },
{
    id: "10143-03", id_categoria: "10143", categoria_nombre: "D. Administrativo II", dificultad: "dificil",
    pregunta: "La teoría de los 'actos separables' en materia de contratos administrativos permite:",
    opciones: ["Impugnar judicialmente los actos administrativos del procedimiento contractual de forma autónoma", "Modificar el contrato unilateralmente sin límites", "Anular todo el contrato por un vicio en un acto preparatorio", "Que el contratista se retire sin consecuencias"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, 'Mevopal S.A.' y doctrina de los actos separables.", puntos_base: 50
  },
{
    id: "10143-04", id_categoria: "10143", categoria_nombre: "D. Administrativo II", dificultad: "media",
    pregunta: "El 'ius variandi' en los contratos administrativos faculta a la Administración a:",
    opciones: ["Rescindir el contrato sin indemnización", "Modificar unilateralmente las condiciones del contrato dentro de ciertos límites", "Celebrar contratos sin licitación", "Suspender todos los pagos al contratista"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Doctrina del contrato administrativo. Prerrogativa de la Administración.", puntos_base: 25
  },
{
    id: "10143-05", id_categoria: "10143", categoria_nombre: "D. Administrativo II", dificultad: "facil",
    pregunta: "La acción de amparo contra actos de autoridad pública está regulada en:",
    opciones: ["El Código Penal", "El Art. 43 de la Constitución Nacional", "La Ley de Procedimientos Administrativos", "El Código de Comercio"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 43 CN: Acción de amparo.", puntos_base: 10
  },
{
    id: "10144-01", id_categoria: "10144", categoria_nombre: "D. Internacional Público", dificultad: "facil",
    pregunta: "¿Cuál es la fuente principal del derecho internacional público según el Art. 38 del Estatuto de la CIJ?",
    opciones: ["Las resoluciones de la ONU", "Los tratados internacionales, la costumbre internacional y los principios generales del derecho", "Solo la doctrina de los publicistas", "Las decisiones de los tribunales nacionales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 38 del Estatuto de la Corte Internacional de Justicia.", puntos_base: 10
  },
{
    id: "10144-02", id_categoria: "10144", categoria_nombre: "D. Internacional Público", dificultad: "media",
    pregunta: "El principio 'pacta sunt servanda' en el derecho internacional significa:",
    opciones: ["Los tratados pueden ser modificados unilateralmente", "Los tratados deben cumplirse de buena fe", "Los Estados no están obligados por tratados", "Solo se aplica a tratados bilaterales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 26 de la Convención de Viena sobre el Derecho de los Tratados (1969).", puntos_base: 25
  },
{
    id: "10144-03", id_categoria: "10144", categoria_nombre: "D. Internacional Público", dificultad: "dificil",
    pregunta: "Las normas de 'ius cogens' en el derecho internacional son:",
    opciones: ["Normas dispositivas que los Estados pueden modificar", "Normas imperativas aceptadas por la comunidad internacional que no admiten derogación", "Costumbres locales", "Resoluciones de organismos internacionales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 53 de la Convención de Viena sobre el Derecho de los Tratados (1969).", puntos_base: 50
  },
{
    id: "10144-04", id_categoria: "10144", categoria_nombre: "D. Internacional Público", dificultad: "media",
    pregunta: "La inmunidad diplomática está regulada principalmente por:",
    opciones: ["La Carta de la ONU", "La Convención de Viena sobre Relaciones Diplomáticas de 1961", "El Tratado de Versalles", "La Convención Americana de DDHH"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Convención de Viena sobre Relaciones Diplomáticas (1961).", puntos_base: 25
  },
{
    id: "10144-05", id_categoria: "10144", categoria_nombre: "D. Internacional Público", dificultad: "facil",
    pregunta: "¿Cuál es el principal órgano judicial de las Naciones Unidas?",
    opciones: ["El Tribunal Penal Internacional", "La Corte Internacional de Justicia", "La Corte Interamericana de DDHH", "El Tribunal de Justicia de la Unión Europea"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 92 de la Carta de las Naciones Unidas.", puntos_base: 10
  },
{
    id: "10145-01", id_categoria: "10145", categoria_nombre: "D. Privado V - Reales", dificultad: "facil",
    pregunta: "Según el CCyCN, los derechos reales son:",
    opciones: ["Derechos relativos", "Derechos absolutos que recaen sobre cosas determinadas y son oponibles erga omnes", "Derechos que solo surgen de contratos", "Derechos que no requieren publicidad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1882 CCyCN: Concepto de derecho real.", puntos_base: 10
  },
{
    id: "10145-02", id_categoria: "10145", categoria_nombre: "D. Privado V - Reales", dificultad: "media",
    pregunta: "¿Cuáles de los siguientes son derechos reales enumerados en el CCyCN?",
    opciones: ["Dominio, condominio, usufructo, uso, habitación, servidumbre, hipoteca, prenda, anticresis", "Solo dominio y posesión", "Solo hipoteca y prenda", "Locación y comodato"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 1887 CCyCN: Enumeración taxativa de los derechos reales.", puntos_base: 25
  },
{
    id: "10145-03", id_categoria: "10145", categoria_nombre: "D. Privado V - Reales", dificultad: "dificil",
    pregunta: "El principio de 'numerus clausus' en materia de derechos reales significa que:",
    opciones: ["Las partes pueden crear cualquier derecho real que deseen", "Los derechos reales solo pueden ser creados por la ley y su número es cerrado", "Los derechos reales no necesitan inscripción", "Solo existen dos derechos reales: dominio y posesión"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1884 CCyCN: Estructura y numerus clausus.", puntos_base: 50
  },
{
    id: "10145-04", id_categoria: "10145", categoria_nombre: "D. Privado V - Reales", dificultad: "media",
    pregunta: "La prescripción adquisitiva (usucapión) larga requiere posesión pública, pacífica y continua durante:",
    opciones: ["5 años", "10 años", "15 años", "20 años"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Art. 1899 CCyCN: Prescripción adquisitiva larga de 20 años.", puntos_base: 25
  },
{
    id: "10145-05", id_categoria: "10145", categoria_nombre: "D. Privado V - Reales", dificultad: "facil",
    pregunta: "El dominio es el derecho real que otorga:",
    opciones: ["Solo el uso de la cosa", "Todas las facultades de usar, gozar y disponer material y jurídicamente de una cosa", "Solo el goce de los frutos", "La tenencia temporal de la cosa"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1941 CCyCN: Dominio perfecto.", puntos_base: 10
  },
{
    id: "10146-01", id_categoria: "10146", categoria_nombre: "D. Seg. Social", dificultad: "facil",
    pregunta: "El sistema de seguridad social en Argentina cubre contingencias como:",
    opciones: ["Solo accidentes de trabajo", "Vejez, invalidez, muerte, enfermedad, desempleo y cargas de familia", "Exclusivamente jubilaciones", "Solo riesgos del trabajo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 14 bis CN y Ley 24.241 (SIPA).", puntos_base: 10
  },
{
    id: "10146-02", id_categoria: "10146", categoria_nombre: "D. Seg. Social", dificultad: "media",
    pregunta: "¿Cuál es la edad jubilatoria ordinaria para hombres y mujeres en Argentina?",
    opciones: ["60 y 55 años respectivamente", "65 y 60 años respectivamente", "70 y 65 años respectivamente", "60 para ambos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 19 de la Ley 24.241: 65 años para hombres y 60 para mujeres.", puntos_base: 25
  },
{
    id: "10146-03", id_categoria: "10146", categoria_nombre: "D. Seg. Social", dificultad: "dificil",
    pregunta: "El caso 'Badaro' de la CSJN (2006/2007) fue relevante para la seguridad social porque:",
    opciones: ["Declaró inconstitucional el sistema jubilatorio", "Ordenó la movilidad de los haberes jubilatorios ante la falta de actualización por el Congreso", "Eliminó las contribuciones patronales", "Privatizó las jubilaciones"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "CSJN, 'Badaro, Adolfo V. c/ ANSES' (2006/2007).", puntos_base: 50
  },
{
    id: "10146-04", id_categoria: "10146", categoria_nombre: "D. Seg. Social", dificultad: "media",
    pregunta: "Las asignaciones familiares son prestaciones de la seguridad social que:",
    opciones: ["Reemplazan el salario", "Compensan las cargas de familia del trabajador sin contraprestación", "Solo se pagan a trabajadores autónomos", "Son optativas para el empleador"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 24.714 de Asignaciones Familiares.", puntos_base: 25
  },
{
    id: "10146-05", id_categoria: "10146", categoria_nombre: "D. Seg. Social", dificultad: "facil",
    pregunta: "Las ART (Aseguradoras de Riesgos del Trabajo) fueron creadas por:",
    opciones: ["La Ley 20.744", "La Ley 24.557", "La Constitución Nacional", "El Código Civil"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 24.557 de Riesgos del Trabajo (1995).", puntos_base: 10
  },
{
    id: "10148-01", id_categoria: "10148", categoria_nombre: "D. Privado VII - Concursos", dificultad: "facil",
    pregunta: "¿Qué ley regula los concursos y quiebras en Argentina?",
    opciones: ["Ley 19.550", "Ley 24.522", "Ley 20.744", "Ley 26.994"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 24.522 de Concursos y Quiebras.", puntos_base: 10
  },
{
    id: "10148-02", id_categoria: "10148", categoria_nombre: "D. Privado VII - Concursos", dificultad: "media",
    pregunta: "El concurso preventivo tiene como finalidad principal:",
    opciones: ["Liquidar el patrimonio del deudor", "Permitir al deudor reestructurar sus pasivos y evitar la quiebra", "Castigar al deudor incumplidor", "Repartir los bienes entre los acreedores"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 5 de la Ley 24.522: Concurso preventivo.", puntos_base: 25
  },
{
    id: "10148-03", id_categoria: "10148", categoria_nombre: "D. Privado VII - Concursos", dificultad: "dificil",
    pregunta: "El 'cramdown' o salvataje empresarial (Art. 48 LCQ) se aplica cuando:",
    opciones: ["El deudor obtiene las mayorías necesarias", "El deudor no obtiene las mayorías para el acuerdo y terceros pueden ofertar", "El deudor declara su quiebra voluntaria", "Solo en empresas con más de 100 empleados"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 48 de la Ley 24.522: Supuesto especial (cramdown).", puntos_base: 50
  },
{
    id: "10148-04", id_categoria: "10148", categoria_nombre: "D. Privado VII - Concursos", dificultad: "media",
    pregunta: "¿Qué es el 'período de exclusividad' en el concurso preventivo?",
    opciones: ["El plazo para que el juez dicte sentencia", "El plazo que tiene el deudor para negociar y obtener conformidades de los acreedores", "El plazo de prescripción de las deudas", "El período de investigación penal"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 43 de la Ley 24.522.", puntos_base: 25
  },
{
    id: "10148-05", id_categoria: "10148", categoria_nombre: "D. Privado VII - Concursos", dificultad: "facil",
    pregunta: "La quiebra tiene como principal efecto sobre el deudor:",
    opciones: ["Le permite seguir administrando sus bienes", "Le produce el desapoderamiento de sus bienes", "Solo le impide viajar al exterior", "Le otorga un plazo de gracia para pagar"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 107 de la Ley 24.522: Desapoderamiento.", puntos_base: 10
  },
{
    id: "10149-01", id_categoria: "10149", categoria_nombre: "D. Internacional Privado", dificultad: "facil",
    pregunta: "El Derecho Internacional Privado se ocupa principalmente de:",
    opciones: ["Las relaciones entre Estados", "Los conflictos de leyes derivados de relaciones jurídicas con elementos internacionales", "El derecho penal internacional", "Los tratados de paz"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Doctrina general del DIPr. Goldschmidt, 'Derecho Internacional Privado'.", puntos_base: 10
  },
{
    id: "10149-02", id_categoria: "10149", categoria_nombre: "D. Internacional Privado", dificultad: "media",
    pregunta: "La 'norma de conflicto' o 'norma indirecta' del DIPr tiene como función:",
    opciones: ["Resolver directamente el caso", "Señalar el derecho aplicable a una relación jurídica con elemento extranjero", "Impedir la aplicación de derecho extranjero", "Solo regular la competencia judicial"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Doctrina del DIPr. Arts. 2594 a 2671 del CCyCN.", puntos_base: 25
  },
{
    id: "10149-03", id_categoria: "10149", categoria_nombre: "D. Internacional Privado", dificultad: "dificil",
    pregunta: "El 'orden público internacional' como límite a la aplicación del derecho extranjero opera cuando:",
    opciones: ["Siempre que se aplique derecho extranjero", "La ley extranjera es incompatible con los principios fundamentales del foro", "El derecho extranjero es más favorable al actor", "Solo en materia comercial"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2600 CCyCN: Orden público.", puntos_base: 50
  },
{
    id: "10149-04", id_categoria: "10149", categoria_nombre: "D. Internacional Privado", dificultad: "media",
    pregunta: "¿Qué es el 'reenvío' en el DIPr?",
    opciones: ["La remisión de un tribunal a otro", "Cuando la norma de conflicto del foro remite al derecho extranjero y éste, a su vez, remite a otro derecho", "La devolución de una mercadería importada", "El recurso ante un tribunal internacional"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2596 CCyCN: Reenvío.", puntos_base: 25
  },
{
    id: "10149-05", id_categoria: "10149", categoria_nombre: "D. Internacional Privado", dificultad: "facil",
    pregunta: "En materia de contratos internacionales, el CCyCN permite la autonomía de la voluntad para elegir:",
    opciones: ["Solo la jurisdicción", "El derecho aplicable al contrato", "Solo las cláusulas penales", "Nada, todo lo decide el juez"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2651 CCyCN: Autonomía de la voluntad en contratos internacionales.", puntos_base: 10
  },
{
    id: "10654-01", id_categoria: "10654", categoria_nombre: "Práctica Profesional", dificultad: "facil",
    pregunta: "Para ejercer la abogacía en la Provincia de Buenos Aires es necesario:",
    opciones: ["Solo tener el título universitario", "Tener título habilitante e inscripción en el Colegio de Abogados del Departamento Judicial correspondiente", "Ser mayor de 25 años", "Aprobar un examen del Poder Judicial"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 5177 de Ejercicio de la Abogacía (Prov. Bs. As.).", puntos_base: 10
  },
{
    id: "10654-02", id_categoria: "10654", categoria_nombre: "Práctica Profesional", dificultad: "media",
    pregunta: "¿Qué es la mediación prejudicial obligatoria en la Provincia de Buenos Aires?",
    opciones: ["Un juicio abreviado", "Un procedimiento de resolución de conflictos previo a la demanda judicial", "Una audiencia ante el juez", "Una pericia contable"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 13.951 de Mediación Prejudicial Obligatoria (Prov. Bs. As.).", puntos_base: 25
  },
{
    id: "10654-03", id_categoria: "10654", categoria_nombre: "Práctica Profesional", dificultad: "dificil",
    pregunta: "El secreto profesional del abogado implica que:",
    opciones: ["El abogado puede revelar la información del cliente si le conviene", "El abogado tiene el deber y el derecho de guardar secreto sobre los hechos conocidos en el ejercicio profesional", "Solo aplica en causas penales", "Es optativo para el abogado"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 6 de la Ley 5177 y Código de Ética del COLPROBA.", puntos_base: 50
  },
{
    id: "10654-04", id_categoria: "10654", categoria_nombre: "Práctica Profesional", dificultad: "media",
    pregunta: "Los honorarios del abogado en la Provincia de Buenos Aires se regulan por:",
    opciones: ["Solo lo que acuerden las partes", "La Ley 14.967 de Honorarios Profesionales", "El Código Civil", "Las tablas del Poder Ejecutivo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 14.967 de Honorarios Profesionales de Abogados y Procuradores (Prov. Bs. As.).", puntos_base: 25
  },
{
    id: "10654-05", id_categoria: "10654", categoria_nombre: "Práctica Profesional", dificultad: "facil",
    pregunta: "¿Qué documento da inicio formal a un proceso judicial civil?",
    opciones: ["La carta documento", "La demanda judicial", "El alegato", "La sentencia"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 330 del CPCCBA: Demanda.", puntos_base: 10
  },
{
    id: "10147-02", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "facil",
    pregunta: "Hans Kelsen, en su 'Teoría Pura del Derecho', sostiene que el derecho debe estudiarse:",
    opciones: ["Desde una perspectiva moral y religiosa", "Separado de la moral, la política y la sociología", "Solo a través de la jurisprudencia", "Exclusivamente desde la sociología"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Hans Kelsen, 'Teoría Pura del Derecho' (1934/1960).", puntos_base: 10
  },
{
    id: "10147-03", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "media",
    pregunta: "¿Qué es el 'iusnaturalismo'?",
    opciones: ["Una corriente que niega la existencia del derecho natural", "Una corriente que sostiene la existencia de un derecho natural superior y anterior al derecho positivo", "Lo mismo que el positivismo jurídico", "Una teoría exclusivamente procesal"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Corriente iusnaturalista: Santo Tomás de Aquino, Hugo Grocio, John Finnis.", puntos_base: 25
  },
{
    id: "10147-04", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "dificil",
    pregunta: "La 'regla de reconocimiento' en la teoría de H.L.A. Hart es:",
    opciones: ["Una norma penal", "La norma secundaria que establece los criterios para identificar qué normas pertenecen al sistema jurídico", "Un contrato entre ciudadanos", "La constitución nacional"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "H.L.A. Hart, 'El concepto de derecho' (1961), Capítulo V.", puntos_base: 50
  },
{
    id: "10147-05", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "media",
    pregunta: "El 'realismo jurídico' norteamericano sostiene que el derecho es fundamentalmente:",
    opciones: ["Lo que dice la ley escrita", "Lo que los tribunales efectivamente deciden", "Lo que establece la moral", "Lo que determina la costumbre"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Oliver W. Holmes, Karl Llewellyn. Realismo jurídico estadounidense.", puntos_base: 25
  },
{
    id: "10147-06", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "facil",
    pregunta: "La justicia distributiva según Aristóteles se refiere a:",
    opciones: ["La justicia en los intercambios entre particulares", "La distribución de bienes, honores y cargas según el mérito", "La venganza proporcional", "La justicia procesal exclusivamente"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Aristóteles, 'Ética a Nicómaco', Libro V.", puntos_base: 10
  },
{
    id: "10653-02", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "media",
    pregunta: "El CCyCN reconoce como régimen patrimonial del matrimonio:",
    opciones: ["Solo la comunidad de bienes", "Comunidad de bienes o separación de bienes, a elección de los cónyuges", "Solo la separación de bienes", "El régimen dotal"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 446 a 508 CCyCN: Régimen patrimonial del matrimonio.", puntos_base: 25
  },
{
    id: "10653-03", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "dificil",
    pregunta: "La responsabilidad parental en el CCyCN se ejerce por:",
    opciones: ["Solo el padre", "Ambos progenitores, sea que convivan o no", "Solo la madre hasta los 5 años del hijo", "El Estado"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 641 CCyCN: Ejercicio de la responsabilidad parental.", puntos_base: 50
  },
{
    id: "10653-04", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "facil",
    pregunta: "¿Desde cuándo es legal el matrimonio igualitario en Argentina?",
    opciones: ["2003", "2010", "2015", "2020"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 26.618 de Matrimonio Igualitario (2010).", puntos_base: 10
  },
{
    id: "10653-05", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "media",
    pregunta: "La compensación económica post-divorcio del Art. 441 CCyCN procede cuando:",
    opciones: ["Siempre, en todos los divorcios", "El divorcio produce un desequilibrio económico manifiesto para uno de los cónyuges", "Solo si hay hijos menores", "Solo en matrimonios de más de 20 años"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 441 CCyCN: Compensación económica.", puntos_base: 25
  },
{
    id: "10659-02", id_categoria: "10659", categoria_nombre: "D. Sucesiones", dificultad: "facil",
    pregunta: "¿Quiénes son los herederos forzosos según el CCyCN?",
    opciones: ["Solo los hijos", "Los descendientes, ascendientes y el cónyuge", "Solo el cónyuge", "Los hermanos y sobrinos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2444 CCyCN: Herederos legitimarios.", puntos_base: 10
  },
{
    id: "10659-03", id_categoria: "10659", categoria_nombre: "D. Sucesiones", dificultad: "dificil",
    pregunta: "La porción legítima reservada a los descendientes es de:",
    opciones: ["Un medio (1/2)", "Dos tercios (2/3)", "Tres cuartos (3/4)", "Un cuarto (1/4)"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2445 CCyCN: La legítima de los descendientes es de 2/3.", puntos_base: 50
  },
{
    id: "10659-04", id_categoria: "10659", categoria_nombre: "D. Sucesiones", dificultad: "media",
    pregunta: "La sucesión se abre con:",
    opciones: ["La declaración de los herederos", "La muerte del causante", "La lectura del testamento", "La inscripción en el Registro de Propiedad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2277 CCyCN: 'La muerte real... de una persona causa la apertura de su sucesión'.", puntos_base: 25
  },
{
    id: "10659-05", id_categoria: "10659", categoria_nombre: "D. Sucesiones", dificultad: "facil",
    pregunta: "¿Qué tipos de testamento reconoce el CCyCN?",
    opciones: ["Solo ológrafo", "Ológrafo y por acto público", "Solo notarial", "Solo verbal"],
    respuesta_correcta_index: 1,
  }
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [...STATIC_QUESTIONS, ...TRIVIA_QUESTIONS_EXTENDED];

