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
  anio: number; // 0 = Toda la carrera, 1 a 5 = Año específico del Plan de Estudios
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

export const RANGOS_JURIDICOS: RangoJuridico[] = [
  {
    id: "ingresante",
    nombre: "Ingresante",
    minPuntos: 0,
    maxPuntos: 99,
    iconoNombre: "BookOpen",
    colorGradient: "from-slate-500 to-zinc-600",
    badgeStyle: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    descripcion: "Dando los primeros pasos en las aulas de abogacía."
  },
  {
    id: "estudiante_avanzado",
    nombre: "Estudiante Avanzado",
    minPuntos: 100,
    maxPuntos: 299,
    iconoNombre: "GraduationCap",
    colorGradient: "from-blue-500 to-cyan-600",
    badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    descripcion: "Con los codos gastados y el Plan de Estudios al día."
  },
  {
    id: "abogado_joven",
    nombre: "Abogado Joven",
    minPuntos: 300,
    maxPuntos: 699,
    iconoNombre: "Briefcase",
    colorGradient: "from-emerald-500 to-teal-600",
    badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    descripcion: "Matriculado con la chapa en la mano litiga sus primeros expedientes."
  },
  {
    id: "abogado_experto",
    nombre: "Abogado Experto",
    minPuntos: 700,
    maxPuntos: 1299,
    iconoNombre: "Award",
    colorGradient: "from-amber-500 to-orange-600",
    badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    descripcion: "Dominio de expedientes, recursos de apelación y alegatos."
  },
  {
    id: "juez",
    nombre: "Juez de Cámara",
    minPuntos: 1300,
    maxPuntos: 2499,
    iconoNombre: "Gavel",
    colorGradient: "from-violet-500 to-purple-600",
    badgeStyle: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    descripcion: "Prestigioso magistrado que dicta sentencias y sienta doctrina."
  },
  {
    id: "doctrinario_leyenda",
    nombre: "Doctrinario Leyenda",
    minPuntos: 2500,
    maxPuntos: 999999,
    iconoNombre: "Sparkles",
    colorGradient: "from-yellow-400 via-amber-500 to-red-500",
    badgeStyle: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-black",
    descripcion: "Autor de tratados jurídicos consultado por la Suprema Corte."
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
// CATEGORÍAS ORGANIZADAS POR AÑO DEL PLAN DE ESTUDIOS (PLAN 6)
// =========================================================================
export const CATEGORIAS_TRIVIA: CategoriaTrivia[] = [
  {
    id: "todas",
    nombre: "Toda la Carrera",
    descripcion: "Examen integral multi-materia con preguntas de 1º a 5º Año",
    anio: 0,
    icono: "Sparkles",
    color: "from-amber-500 via-purple-600 to-indigo-600"
  },
  // --- 1ER AÑO ---
  {
    id: "intro_derecho",
    nombre: "Introducción al Derecho",
    descripcion: "Teoría general del derecho, fuentes, normas y sistemas jurídicos",
    anio: 1,
    icono: "BookOpen",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: "intro_cs_sociales",
    nombre: "Introducción a las Cs. Sociales",
    descripcion: "Pensamiento social, teoría sociopolítica y epistemología",
    anio: 1,
    icono: "Users",
    color: "from-teal-600 to-emerald-700"
  },
  {
    id: "historia_constitucional",
    nombre: "Historia Constitucional Arg.",
    descripcion: "Pactos preexistentes, 1853, reformas y evolución institucional",
    anio: 1,
    icono: "Landmark",
    color: "from-amber-600 to-orange-700"
  },
  {
    id: "derecho_romano",
    nombre: "Derecho Romano",
    descripcion: "Institutas, sujetos, dominios, obligaciones y acciones romanas",
    anio: 1,
    icono: "Scale",
    color: "from-purple-600 to-indigo-800"
  },
  {
    id: "sociologia_derecho",
    nombre: "Sociología del Derecho",
    descripcion: "Eficacia de las normas, control social y fenómeno jurídico",
    anio: 1,
    icono: "Building2",
    color: "from-cyan-600 to-blue-700"
  },
  {
    id: "economia_politica",
    nombre: "Economía Política",
    descripcion: "Mercado, inflación, sistemas económicos y finanzas estatales",
    anio: 1,
    icono: "Coins",
    color: "from-emerald-600 to-green-700"
  },

  // --- 2DO AÑO ---
  {
    id: "derecho_constitucional",
    nombre: "Derecho Constitucional",
    descripcion: "Constitución Nacional, garantías, amparo y control de constitucionalidad",
    anio: 2,
    icono: "Landmark",
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: "derecho_privado1",
    nombre: "Derecho Privado I (Civil Gral)",
    descripcion: "Persona humana, capacidad, atributos, hechos y actos jurídicos",
    anio: 2,
    icono: "FileText",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "derecho_penal1",
    nombre: "Derecho Penal I (Parte Gral)",
    descripcion: "Teoría del delito, tipicidad, antijuridicidad, culpabilidad y penas",
    anio: 2,
    icono: "ShieldAlert",
    color: "from-red-600 to-rose-700"
  },
  {
    id: "filosofia_derecho",
    nombre: "Filosofía del Derecho",
    descripcion: "Iusnaturalismo, iuspositivismo, iusrealismo y valores jurídicos",
    anio: 2,
    icono: "BookOpenCheck",
    color: "from-indigo-600 to-purple-700"
  },
  {
    id: "derecho_administrativo1",
    nombre: "Derecho Administrativo I",
    descripcion: "Acto administrativo, elementos, vicios, procedimiento y fomento",
    anio: 2,
    icono: "FileText",
    color: "from-emerald-600 to-teal-700"
  },
  {
    id: "derecho_internacional_pub",
    nombre: "Derecho Internacional Público",
    descripcion: "Tratados, sujetos internacionales, OEA, ONU y DDHH",
    anio: 2,
    icono: "Globe",
    color: "from-sky-600 to-blue-700"
  },

  // --- 3ER AÑO ---
  {
    id: "derecho_privado2",
    nombre: "Derecho Privado II (Obligaciones)",
    descripcion: "Elementos de la obligación, pago, mora, incumplimiento y daños",
    anio: 3,
    icono: "Scale",
    color: "from-violet-600 to-indigo-700"
  },
  {
    id: "derecho_penal2",
    nombre: "Derecho Penal II (Parte Especial)",
    descripcion: "Delitos contra las personas, la propiedad, la administración y fe pública",
    anio: 3,
    icono: "Gavel",
    color: "from-rose-700 to-red-800"
  },
  {
    id: "derecho_procesal_penal",
    nombre: "Derecho Procesal Penal",
    descripcion: "Código Procesal Penal PBA, prisión preventiva, investigación y jurados",
    anio: 3,
    icono: "ShieldAlert",
    color: "from-red-700 to-orange-700"
  },
  {
    id: "derecho_administrativo2",
    nombre: "Derecho Administrativo II",
    descripcion: "Contratos administrativos, licitación pública y responsabilidad del Estado",
    anio: 3,
    icono: "Building2",
    color: "from-teal-600 to-cyan-700"
  },
  {
    id: "derecho_trabajo1",
    nombre: "Derecho del Trabajo I",
    descripcion: "Ley de Contrato de Trabajo (LCT), despido, jornada y remuneración",
    anio: 3,
    icono: "Briefcase",
    color: "from-amber-600 to-yellow-700"
  },
  {
    id: "derecho_internacional_priv",
    nombre: "Derecho Internacional Privado",
    descripcion: "Jurisdicción internacional, conflicto de leyes y restitución",
    anio: 3,
    icono: "Globe",
    color: "from-blue-600 to-indigo-800"
  },

  // --- 4TO AÑO ---
  {
    id: "derecho_privado3",
    nombre: "Derecho Privado III (Contratos)",
    descripcion: "Autonomía de la voluntad, compraventa, locación, consumo y conexidad",
    anio: 4,
    icono: "FileText",
    color: "from-blue-700 to-slate-800"
  },
  {
    id: "derecho_procesal_civil",
    nombre: "Derecho Procesal Civil",
    descripcion: "CPCCBA, demanda, contestación, prueba, sentencia y recursos",
    anio: 4,
    icono: "Gavel",
    color: "from-purple-700 to-violet-800"
  },
  {
    id: "derecho_tributario",
    nombre: "Derecho Tributario",
    descripcion: "Impuestos, tasas, contribuciones, AFIP, ARBA y procedimiento tributario",
    anio: 4,
    icono: "Coins",
    color: "from-emerald-700 to-green-800"
  },
  {
    id: "derecho_trabajo2",
    nombre: "Derecho del Trabajo II",
    descripcion: "Derecho colectivo, sindicatos, convenios colectivos y huelga",
    anio: 4,
    icono: "Briefcase",
    color: "from-orange-600 to-amber-700"
  },
  {
    id: "derecho_seguridad_social",
    nombre: "Derecho de la Seguridad Social",
    descripcion: "Jubilaciones, pensiones, asignaciones y Riesgos del Trabajo (ART)",
    anio: 4,
    icono: "Shield",
    color: "from-cyan-700 to-teal-800"
  },
  {
    id: "derecho_financiero",
    nombre: "Derecho Financiero",
    descripcion: "Presupuesto público, crédito público y Banco Central (BCRA)",
    anio: 4,
    icono: "Coins",
    color: "from-emerald-600 to-blue-700"
  },

  // --- 5TO AÑO ---
  {
    id: "derecho_privado4",
    nombre: "Derecho Privado IV (Reales)",
    descripcion: "Dominio, condominio, propiedad horizontal, usufructo y garantías reales",
    anio: 5,
    icono: "Building2",
    color: "from-indigo-700 to-purple-800"
  },
  {
    id: "derecho_sucesiones",
    nombre: "Derecho de las Sucesiones",
    descripcion: "Herederos legítimos, legítima hereditaria, testamentos y partición",
    anio: 5,
    icono: "Users",
    color: "from-rose-600 to-red-700"
  },
  {
    id: "derecho_empresas",
    nombre: "Derecho de las Empresas",
    descripcion: "Sociedades (LGS), SRL, SA, concurso preventivo y quiebras",
    anio: 5,
    icono: "Building2",
    color: "from-blue-800 to-slate-900"
  },
  {
    id: "derecho_ambiental",
    nombre: "Derecho Ambiental",
    descripcion: "Ley General del Ambiente 25.675, daño ambiental, amparo y recursos",
    anio: 5,
    icono: "Leaf",
    color: "from-emerald-600 to-teal-800"
  },
  {
    id: "etica_profesional",
    nombre: "Ética y Resp. Profesional",
    descripcion: "Código de Ética del CALP, secreto profesional y sanciones",
    anio: 5,
    icono: "Award",
    color: "from-amber-600 to-yellow-600"
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

// =========================================================================
// BANCO COMPLETO DE PREGUNTAS CLASIFICADAS POR MATERIA DEL PLAN DE ESTUDIOS
// (SE REMUERE COMPLETAMENTE CUALQUIER PREGUNTA INSTITUCIONAL DE LA UNLP)
// =========================================================================
export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // --- 1ER AÑO: INTRODUCCIÓN AL DERECHO ---
  {
    id: "intro-f-01",
    id_categoria: "intro_derecho",
    categoria_nombre: "Introducción al Derecho",
    dificultad: "facil",
    pregunta: "¿Qué autor definió la pirámide jurídica de jerarquía normativa del positivismo jurídico?",
    opciones: ["Hans Kelsen", "Santo Tomás de Aquino", "Immanuel Kant", "Karl Marx"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Teoría Pura del Derecho de Hans Kelsen (Stufenbau).",
    puntos_base: 10
  },
  {
    id: "intro_m-01",
    id_categoria: "intro_derecho",
    categoria_nombre: "Introducción al Derecho",
    dificultad: "media",
    pregunta: "¿Cuál es la diferencia entre derecho objetivo y derecho subjetivo?",
    opciones: [
      "El derecho objetivo es la norma escrita y el subjetivo es la facultad o poder individual.",
      "El derecho objetivo es para Jueces y el subjetivo para ciudadanos.",
      "El derecho objetivo es oral y el subjetivo es formal en expediente.",
      "No existe diferencia procesal entre ambos conceptos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Teoría General del Derecho: Norma agendi vs Facultas agendi.",
    puntos_base: 25
  },

  // --- 1ER AÑO: DERECHO ROMANO ---
  {
    id: "romano-f-01",
    id_categoria: "derecho_romano",
    categoria_nombre: "Derecho Romano",
    dificultad: "facil",
    pregunta: "¿Qué principio romano consagra que nadie puede transmitir a otro un derecho más amplio del que posee?",
    opciones: [
      "Nemo plus iuris ad alium transferre potest quam ipse habet.",
      "Pacta sunt servanda.",
      "In dubio pro reo.",
      "Erga omnes."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Digesto de Justiniano 50.17.54.",
    puntos_base: 10
  },
  {
    id: "romano-m-01",
    id_categoria: "derecho_romano",
    categoria_nombre: "Derecho Romano",
    dificultad: "media",
    pregunta: "En la clasificación de los contratos en el Derecho Romano de Justiniano, los contratos formados por la entrega de una cosa (re) son:",
    opciones: [
      "Mutuo, Comodato, Depósito y Prenda.",
      "Compraventa, Locación, Sociedad y Mandato.",
      "Stipulatio y Nexum.",
      "Dictio dotis y Iusiurandum liberti."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Institutas de Justiniano, Libro III (De obligationibus quae re contrahuntur).",
    puntos_base: 25
  },

  // --- 2DO AÑO: DERECHO CONSTITUCIONAL ---
  {
    id: "const-f-01",
    id_categoria: "derecho_constitucional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "¿Qué artículo de la Constitución Nacional Argentina consagra el principio de reserva e intimidad personal?",
    opciones: ["Artículo 19 CN", "Artículo 14 CN", "Artículo 1 CN", "Artículo 75 inc 22"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 19 CN: 'Las acciones privadas de los hombres que de ningún modo ofendan al orden y a la moral pública...'",
    puntos_base: 10
  },
  {
    id: "const-m-01",
    id_categoria: "derecho_constitucional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "¿Cuál es la jerarquía normativa de los Tratados Internacionales de Derechos Humanos enumerados en el Art. 75 inc. 22 de la CN?",
    opciones: [
      "Jerarquía constitucional en las condiciones de su vigencia.",
      "Jerarquía infra-legal subordinada a las Leyes Nacionales.",
      "Jerarquía equivalente a los Códigos de Fondo.",
      "Jerarquía reglamentaria provincial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 75 inc. 22 de la Constitución Nacional Argentina tras la Reforma Constitucional de 1994.",
    puntos_base: 25
  },

  // --- 2DO AÑO: DERECHO PRIVADO I (CIVIL PARTE GENERAL) ---
  {
    id: "priv1-f-01",
    id_categoria: "derecho_privado1",
    categoria_nombre: "Derecho Privado I (Civil Gral)",
    dificultad: "facil",
    pregunta: "¿A qué edad se alcanza la mayoría de edad en la República Argentina según el CCyCN?",
    opciones: ["A los 18 años de edad.", "A los 21 años de edad.", "A los 16 años de edad.", "A los 25 años de edad."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 25 del Código Civil y Comercial de la Nación (Ley 26.994).",
    puntos_base: 10
  },
  {
    id: "priv1-m-01",
    id_categoria: "derecho_privado1",
    categoria_nombre: "Derecho Privado I (Civil Gral)",
    dificultad: "media",
    pregunta: "¿Cuáles son los tres vicios propios de los actos jurídicos en el Código Civil y Comercial?",
    opciones: [
      "Lesión, Simulación y Fraude.",
      "Error, Dolo y Violencia.",
      "Mora, Culpa y Dolo contractual.",
      "Vicio redhibitorio, evicción y frustración."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Libro Primero, Título IV, Capítulos 6, 7 y 8 (Arts. 332, 333 y 338).",
    puntos_base: 25
  },

  // --- 2DO AÑO: DERECHO PENAL I ---
  {
    id: "penal1-f-01",
    id_categoria: "derecho_penal1",
    categoria_nombre: "Derecho Penal I (Parte Gral)",
    dificultad: "facil",
    pregunta: "¿Cuáles son los cuatro elementos de la teoría del delito según la doctrina dogmática penal clásica?",
    opciones: [
      "Acción (Conducta), Tipicidad, Antijuridicidad y Culpabilidad.",
      "Delito, Querella, Sentencia y Apelación.",
      "Imputado, Víctima, Fiscal y Juez.",
      "Prisión, Dolo, Culpa y Reincidencia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina de Derecho Penal Parte General.",
    puntos_base: 10
  },

  // --- 3ER AÑO: DERECHO PRIVADO II (OBLIGACIONES) ---
  {
    id: "priv2-f-01",
    id_categoria: "derecho_privado2",
    categoria_nombre: "Derecho Privado II (Obligaciones)",
    dificultad: "facil",
    pregunta: "¿Cuál es el modo normal y por excelencia de extinción de la obligación jurídica?",
    opciones: ["El Pago.", "La Novación.", "La Transacción.", "La Prescripción Liberatoria."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 865 del Código Civil y Comercial de la Nación.",
    puntos_base: 10
  },
  {
    id: "priv2-m-01",
    id_categoria: "derecho_privado2",
    categoria_nombre: "Derecho Privado II (Obligaciones)",
    dificultad: "media",
    pregunta: "¿Qué exige el Código Civil y Comercial para configurar la mora del deudor en obligaciones a plazo determinado expreso?",
    opciones: [
      "La mora se produce por el solo vencimiento del plazo sin necesidad de interpelación previa (mora automática).",
      "Es obligatoria una carta documento de intimación formal con 15 días.",
      "Requiere una mediación judicial obligatoria.",
      "Requiere la homologación de un Juez de Comercio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 886 CCyCN: 'La mora del deudor se produce por el solo transcurso del tiempo fijado para el cumplimiento'.",
    puntos_base: 25
  },

  // --- 3ER AÑO: DERECHO PENAL II ---
  {
    id: "penal2-f-01",
    id_categoria: "derecho_penal2",
    categoria_nombre: "Derecho Penal II (Parte Especial)",
    dificultad: "facil",
    pregunta: "El delito de Homicidio Simple reprimido en el Art. 79 del Código Penal prevé una pena de:",
    opciones: [
      "Prisión de 8 a 25 años.",
      "Prisión perpetua únicamente.",
      "Multa pecuniaria fija.",
      "Prisión de 1 a 3 años excarcelable."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 79 del Código Penal de la Nación Argentina.",
    puntos_base: 10
  },

  // --- 3ER AÑO: DERECHO PROCESAL PENAL ---
  {
    id: "procpenal-m-01",
    id_categoria: "derecho_procesal_penal",
    categoria_nombre: "Derecho Procesal Penal",
    dificultad: "media",
    pregunta: "En la Ley 14.543 de Juicio por Jurados de la Provincia de Buenos Aires, ¿cuántos votos concordantes de los 12 jurados se exigen para veredicto de CULPABILIDAD en delitos no perpetuos?",
    opciones: ["Al menos 10 votos.", "Unanimidad absoluta (12 de 12).", "Mayoría simple (7 de 12).", "Al menos 8 votos."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 14.543 de la Provincia de Buenos Aires (Art. 371 quater del CPPBA).",
    puntos_base: 25
  },

  // --- 3ER AÑO: DERECHO DEL TRABAJO I ---
  {
    id: "trab1-f-01",
    id_categoria: "derecho_trabajo1",
    categoria_nombre: "Derecho del Trabajo I",
    dificultad: "facil",
    pregunta: "¿Qué principio fundamental del Derecho del Trabajo establece que ante la duda de interpretación se debe estar a favor del trabajador?",
    opciones: [
      "Principio In Dubio Pro Operario (Art. 9 LCT).",
      "Principio de Inalterabilidad Contrato.",
      "Principio del Libre Despido.",
      "Principio de Preclusión."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 9 de la Ley de Contrato de Trabajo (Ley 20.744).",
    puntos_base: 10
  },

  // --- 4TO AÑO: DERECHO PRIVADO III (CONTRATOS) ---
  {
    id: "priv3-f-01",
    id_categoria: "derecho_privado3",
    categoria_nombre: "Derecho Privado III (Contratos)",
    dificultad: "facil",
    pregunta: "El consentimiento en los contratos se integra por dos manifestaciones unilaterales de voluntad denominadas:",
    opciones: [
      "La Oferta y la Aceptación.",
      "La Carta Documento y la Firma.",
      "El Depósito y el Recibo.",
      "La Mediación y el Laudo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 971 del Código Civil y Comercial de la Nación.",
    puntos_base: 10
  },
  {
    id: "priv3-m-01",
    id_categoria: "derecho_privado3",
    categoria_nombre: "Derecho Privado III (Contratos)",
    dificultad: "media",
    pregunta: "¿Qué figura jurídica del Art. 1091 CCyCN autoriza a resolver o adecuar un contrato cuando la prestación se torna excesivamente onerosa por acontecimientos extraordinarios e imprevisibles?",
    opciones: [
      "Teoría de la Imprevisión.",
      "Pacto Comisorio Implícito.",
      "Señal o Arras probatoria.",
      "Evicción procesal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 1091 CCyCN sobre Imprevisión e Imposibilidad de Cumplimiento.",
    puntos_base: 25
  },

  // --- 4TO AÑO: DERECHO PROCESAL CIVIL ---
  {
    id: "proccivil-m-01",
    id_categoria: "derecho_procesal_civil",
    categoria_nombre: "Derecho Procesal Civil",
    dificultad: "media",
    pregunta: "En el Código Procesal Civil y Comercial de PBA (CPCCBA), ¿cuál es el plazo general para interponer el Recurso de Apelación contra una sentencia definitiva en Juicio Ordinario?",
    opciones: ["5 días hábiles procesales.", "10 días corridos.", "15 días hábiles.", "2 días de notificación."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPCCBA, Art. 244: 'El recurso de apelación se interpondrá dentro de quinto día'.",
    puntos_base: 25
  },

  // --- 4TO AÑO: DERECHO TRIBUTARIO ---
  {
    id: "trib-f-01",
    id_categoria: "derecho_tributario",
    categoria_nombre: "Derecho Tributario",
    dificultad: "facil",
    pregunta: "¿Qué principio constitucional exige que todo tributo o impuesto sea creado únicamente por una Ley formal del Congreso?",
    opciones: [
      "Principio de Legalidad / Reserva de Ley (Nullum tributum sine lege).",
      "Principio de Progresividad Voluntaria.",
      "Principio de Oportunidad Fiscal.",
      "Principio de Discrecionalidad Administrativa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 4, 17, 52 y 75 inc. 1 y 2 de la Constitución Nacional Argentina.",
    puntos_base: 10
  },

  // --- 5TO AÑO: DERECHO PRIVADO IV (REALES) ---
  {
    id: "priv4-f-01",
    id_categoria: "derecho_privado4",
    categoria_nombre: "Derecho Privado IV (Reales)",
    dificultad: "facil",
    pregunta: "¿Cuál es el derecho real por excelencia que otorga a su titular las facultades de usar, gozar y disponer material y jurídicamente de una cosa?",
    opciones: ["Dominio (Propiedad).", "Usufructo.", "Servidumbre de paso.", "Hipotecario."],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 1941 del Código Civil y Comercial de la Nación.",
    puntos_base: 10
  },

  // --- 5TO AÑO: DERECHO DE LAS SUCESIONES ---
  {
    id: "suc-m-01",
    id_categoria: "derecho_sucesiones",
    categoria_nombre: "Derecho de las Sucesiones",
    dificultad: "media",
    pregunta: "Según el Código Civil y Comercial de la Nación, ¿cuál es la porción legítima inviolable reservada a los hijos (descendientes)?",
    opciones: [
      "Dos tercios (2/3) del patrimonio hereditario.",
      "Un medio (1/2) del patrimonio.",
      "Cuatro quintos (4/5) del patrimonio.",
      "El 100% indisponible."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 2445 CCyCN: 'La porción legítima de los descendientes es de dos tercios'.",
    puntos_base: 25
  },

  // --- 5TO AÑO: DERECHO AMBIENTAL ---
  {
    id: "amb-f-01",
    id_categoria: "derecho_ambiental",
    categoria_nombre: "Derecho Ambiental",
    dificultad: "facil",
    pregunta: "¿Qué principio fundamental de la Ley General del Ambiente (25.675) establece que ante el peligro de daño grave o irreversible, la falta de certeza científica no pospondrá la adopción de medidas tutelares?",
    opciones: [
      "Principio Precautorio (Art. 4 Ley 25.675).",
      "Principio de Contaminador Pagador.",
      "Principio de Subsidiariedad.",
      "Principio de Congruencia Normativa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 4 de la Ley General del Ambiente 25.675.",
    puntos_base: 10
  },

  // --- 5TO AÑO: ÉTICA Y RESPONSABILIDAD PROFESIONAL ---
  {
    id: "etica-f-01",
    id_categoria: "etica_profesional",
    categoria_nombre: "Ética y Resp. Profesional",
    dificultad: "facil",
    pregunta: "¿Qué deber profesional prohíbe al abogado/a revelar las confidencias realizadas por su cliente con motivo del ejercicio profesional?",
    opciones: [
      "Secreto Profesional.",
      "Deber de Lealtad Comercial.",
      "Pacto de Cuota Litis.",
      "Exención de Matrícula."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código de Ética Profesional del Colegio de Abogados de La Plata (CALP) y Ley 5177.",
    puntos_base: 10
  }
];
