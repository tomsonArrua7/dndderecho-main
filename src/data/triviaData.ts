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
export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // --- 10610: INTRODUCCIÓN AL ESTUDIO DE LAS CIENCIAS SOCIALES ---
  {
    id: "10610-01", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué autor social formuló el concepto de 'Hecho Social' como objeto de la sociología?",
    opciones: ["Karl Marx", "Émile Durkheim", "Max Weber", "Auguste Comte"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Émile Durkheim, 'Las reglas del método sociológico' (1895).", puntos_base: 10
  },
  {
    id: "10610-02", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la teoría marxista, la estructura económica sobre la que se levantan las normas e instituciones jurídicas se denomina:",
    opciones: ["Infraestructura", "Superestructura", "Plusvalía", "Medio de producción"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Karl Marx, 'Contribución a la crítica de la economía política' (1859).", puntos_base: 25
  },
  {
    id: "10610-03", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "¿Qué sociólogo desarrolló la tipología de la dominación legítima (tradicional, carismática y legal-racional)?",
    opciones: ["Alexis de Tocqueville", "Pierre Bourdieu", "Max Weber", "Talcott Parsons"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Max Weber, 'Economía y Sociedad'.", puntos_base: 10
  },
  {
    id: "10610-04", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "El proceso mediante el cual los individuos interiorizan los valores y normas de una sociedad se llama:",
    opciones: ["Aculturación", "Socialización", "Enajenación", "Estrificación"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Teoría sociológica general.", puntos_base: 25
  },
  {
    id: "10610-05", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "¿Qué filósofo postula que el poder no se localiza solo en el Estado sino en un entramado microfísico disciplinario?",
    opciones: ["Jürgen Habermas", "Antonio Gramsci", "Louis Althusser", "Michel Foucault"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Michel Foucault, 'Vigilar y Castigar' (1975).", puntos_base: 50
  },
  {
    id: "10610-06", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según el Compendio de Cátedra 1, ¿qué autor diferenció las ciencias de la naturaleza (explicativas) de las ciencias del espíritu (comprensivas)?",
    opciones: ["Auguste Comte", "Wilhelm Dilthey", "Karl Popper", "René Descartes"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Wilhelm Dilthey, 'Introducción a las ciencias del espíritu' (1883).", puntos_base: 25
  },
  {
    id: "10610-07", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "En la epistemología contemporánea de Thomas Kuhn, el conjunto de compromisos compartidos por una comunidad científica se denomina:",
    opciones: ["Obstáculo epistemológico", "Paradigma (o Matriz Disciplinar)", "Falsacionismo dogmático", "Anarquía metodológica"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Thomas Kuhn, 'La estructura de las revoluciones científicas' (1962).", puntos_base: 25
  },
  {
    id: "10610-08", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "¿Qué concepto desarrolló Pierre Bourdieu para referirse a los sistemas de disposiciones duraderas e interiorizadas que guían la práctica social?",
    opciones: ["Campo", "Habitus", "Capital simbólico", "Violencia de clase"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Pierre Bourdieu, 'El sentido práctico' (1980).", puntos_base: 50
  },
  {
    id: "10610-09", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "Según Max Weber, la acción social motivada por convicciones éticas o religiosas sin importar sus consecuencias se clasifica como:",
    opciones: ["Acción tradicional", "Acción racional con arreglo a valores", "Acción afectiva", "Acción racional con arreglo a fines"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Max Weber, 'Economía y Sociedad' (Tipología de la Acción Social).", puntos_base: 10
  },
  {
    id: "10610-10", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "La Teoría Crítica orientada a denunciar la razón instrumental de la sociedad industrial fue desarrollada por la:",
    opciones: ["Escuela de Viena", "Escuela de Frankfurt", "Escuela de Chicago", "Escuela de Birmingham"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Escuela de Frankfurt (Adorno, Horkheimer, Marcuse).", puntos_base: 25
  },
  {
    id: "10610-11", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "¿Quién concibió y promovió en 1904-1905 la nacionalización de la Universidad de La Plata para dotarla de un perfil científico y experimental moderno?",
    opciones: ["Dr. Dardo Rocha", "Dr. Joaquín V. González", "Rafael Hernández", "Máximo Paz"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Compendio Cátedra 1 / Memoria de 1905 (Ley Nacional 4699).", puntos_base: 25
  },
  {
    id: "10610-12", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según el Art. 11 del Estatuto de la UNLP, ¿cuál es la condición jurídica de las materias aprobadas por los estudiantes de grado?",
    opciones: ["Expiran si transcurren 5 años sin rendir", "Son derechos adquiridos inalienables que bajo ninguna circunstancia pueden ser derogados", "Requieren revalidación periódica quinquenal", "Quedan a decisión discrecional del Decano"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 11 del Estatuto de la Universidad Nacional de La Plata.", puntos_base: 25
  },
  {
    id: "10610-13", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "Según el Compendio de Cátedra 1, ¿cuál de los modelos universitarios coloniales españoles funcionaba como un 'convento-universidad'?",
    opciones: ["Universidad de Bolonia", "Universidad de Salamanca", "Universidad de Alcalá de Henares", "Universidad de Coímbra"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Compendio DND Cátedra 1 / Tünnermann Bernheim (Pág. 56).", puntos_base: 25
  },
  {
    id: "10610-14", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "El modelo napoleónico de universidad republicana implantado en América Latina durante el siglo XIX se caracterizó por:",
    opciones: ["Una estructura académica integrada centrada en la investigación pura", "Un conglomerado de escuelas autárquicas profesionalistas (abogacía, medicina)", "Universidades privadas sin fiscalización estatal", "Institutos dedicados exclusivamente a la teología"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Darcy Ribeiro / Compendio DND Cátedra 1 (Pág. 60).", puntos_base: 50
  },
  {
    id: "10610-15", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "El Art. 7 de la Ley de Educación Superior (Ley 24.521) permite el ingreso de mayores de 25 años sin título secundario siempre que:",
    opciones: ["Demuestren preparación o experiencia laboral acorde mediante evaluaciones institucionales", "Tengan prohibido el ingreso a carreras de grado", "Cursen un año previo eliminatorio obligatorio", "Rindan examen directo en el Ministerio de Educación"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 7 de la Ley de Educación Superior 24.521.", puntos_base: 25
  },
  {
    id: "10610-16", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "El ingreso libre e irrestricto y la gratuidad de la enseñanza de grado en la UNLP están consagrados en los artículos:",
    opciones: ["Artículos 1 y 2", "Artículos 20 y 21", "Artículos 49 y 50", "Artículos 88 y 94"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 20 y 21 del Estatuto de la UNLP.", puntos_base: 10
  },
  {
    id: "10610-17", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "facil",
    pregunta: "El célebre documento redactado por Deodoro Roca durante la Reforma Universitaria de Córdoba de 1918 se denomina:",
    opciones: ["Manifiesto de Mayo", "Manifiesto Liminar de la Juventud Argentina de Córdoba", "Carta de la Reforma Universitaria", "Declaración de Autonomía"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Reforma Universitaria de 1918 / Compendio DND Cátedra 1.", puntos_base: 10
  },
  {
    id: "10610-18", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "El órgano supremo de gobierno de la Universidad Nacional de La Plata integrado por el cogobierno cuatripartito es:",
    opciones: ["El Consejo Superior", "La Asamblea Universitaria", "El Consejo Directivo", "La Junta Ejecutiva"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 49 del Estatuto de la UNLP.", puntos_base: 25
  },
  {
    id: "10610-19", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "dificil",
    pregunta: "Según el Compendio Cátedra 1, la primera universidad fundada en el continente americano (1538) fue la:",
    opciones: ["Universidad de San Marcos (Lima)", "Real y Pontificia Universidad de México", "Universidad de Santo Domingo", "Universidad Nacional de Córdoba"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Compendio DND Cátedra 1 (Pág. 56).", puntos_base: 50
  },
  {
    id: "10610-20", id_categoria: "10610", categoria_nombre: "Intro Cs. Sociales", dificultad: "media",
    pregunta: "El modelo clásico de universidad republicana fundado por Andrés Bello en 1843 que consagró la 'universidad de abogados' fue la:",
    opciones: ["Universidad Central de Venezuela", "Universidad de Chile", "Universidad de Buenos Aires", "Universidad de San Carlos de Guatemala"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Andrés Bello / Compendio DND Cátedra 1 (Pág. 60).", puntos_base: 25
  },

  // --- 10111: INTRODUCCIÓN AL DERECHO ---
  {
    id: "10111-01", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "¿Qué autor desarrolló la pirámide jurídica de gradación normativa en la Teoría Pura del Derecho?",
    opciones: ["Hans Kelsen", "Alf Ross", "Herbert Hart", "Norberto Bobbio"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Hans Kelsen, 'Reine Rechtslehre' (Stufenbau).", puntos_base: 10
  },
  {
    id: "10111-02", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "¿Cómo se denomina la norma hipotética fundamental que otorga validez a la primera Constitución en el esquema kelseniano?",
    opciones: ["Norma Derogatoria", "Grundnorm (Norma Fundamental)", "Regla de Reconocimiento", "Imperativo Categórico"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Hans Kelsen, Teoría Pura del Derecho.", puntos_base: 25
  },
  {
    id: "10111-03", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "facil",
    pregunta: "La distinción entre reglas primarias (imponen deberes) y reglas secundarias (otorgan potestades) pertenece a:",
    opciones: ["Ronald Dworkin", "H.L.A. Hart", "Carlos Cossio", "Genaro Carrió"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "H.L.A. Hart, 'El concepto de derecho' (1961).", puntos_base: 10
  },
  {
    id: "10111-04", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "media",
    pregunta: "La Teoría Egológica del Derecho ideada en Argentina por Carlos Cossio concibe al derecho como:",
    opciones: ["Un conjunto de mandatos del soberano", "La conducta humana en interferencia intersubjetiva", "Un hecho social empírico", "La voluntad de Dios expresada en la naturaleza"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Carlos Cossio, 'La Teoría Egológica del Derecho'.", puntos_base: 25
  },
  {
    id: "10111-05", id_categoria: "10111", categoria_nombre: "Intro al Derecho", dificultad: "dificil",
    pregunta: "¿Qué principio establece que a falta de norma expresa el juez no puede dejar de juzgar bajo pretexto de silencio u oscuridad de las leyes?",
    opciones: ["Principio de Reserva", "Principio de Inexcusabilidad (Non Liquet)", "Principio de Irretroactividad", "Principio de Oportunidad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 3 del Código Civil y Comercial de la Nación.", puntos_base: 50
  },

  // --- 10112: HISTORIA CONSTITUCIONAL ---
  {
    id: "10112-01", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿En qué año se sancionó la primera Constitución Nacional Argentina jurada en Santa Fe?",
    opciones: ["1810", "1816", "1853", "1860"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Constitución de la Nación Argentina de 1853.", puntos_base: 10
  },
  {
    id: "10112-02", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "El pacto de 1852 firmado por los gobernadores que precedió a la Convención Constituyente de 1853 fue:",
    opciones: ["Pacto Federal", "Acuerdo de San Nicolás", "Pacto de San José de Flores", "Tratado del Pilar"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Acuerdo de San Nicolás de los Arroyos (31 de mayo de 1852).", puntos_base: 25
  },
  {
    id: "10112-03", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué obra de Juan Bautista Alberdi sirvió de base doctrinal determinante para el texto constitucional de 1853?",
    opciones: ["Facundo", "Bases y puntos de partida para la organización política de la República Argentina", "Dogma Socialista", "El Juicio del Siglo"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Juan Bautista Alberdi (1852).", puntos_base: 10
  },
  {
    id: "10112-04", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "El Pacto de San José de Flores (1859) permitió la incorporación formal a la Confederación Argentina de la provincia de:",
    opciones: ["Córdoba", "Buenos Aires", "Entre Ríos", "Santa Fe"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Pacto de San José de Flores del 11 de noviembre de 1859.", puntos_base: 25
  },
  {
    id: "10112-05", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "La reforma constitucional de 1949 incorporó por primera vez en el texto constitucional argentino los llamados:",
    opciones: ["Derechos Civiles clásicos", "Derechos Sociales del Trabajo y de la Ancianidad", "Derechos de Tercera Generación Ambiental", "Derechos de las Garantías Digitales"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Constitución de 1949 (Art. 37).", puntos_base: 50
  },

  // --- 10122: DERECHO PRIVADO I - CIVIL ---
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

  // --- 10124: DERECHO PENAL I ---
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

  // --- 10125: DERECHO CONSTITUCIONAL ---
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

  // --- 10134: DERECHO PROCESAL I ---
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

  // --- 10640: DERECHO SOCIAL DEL TRABAJO ---
  {
    id: "10640-01", id_categoria: "10640", categoria_nombre: "D. Social del Trabajo", dificultad: "facil",
    pregunta: "¿Qué indemnización por antigüedad prevé el Art. 245 de la LCT (Ley 20.744) por despido incausado?",
    opciones: ["Medio sueldo por cada año de servicio", "Un mes de sueldo por cada año de servicio o fracción mayor de 3 meses", "Tres meses de sueldo fijos", "6 meses de salario garantizados"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 245 de la Ley de Contrato de Trabajo 20.744.", puntos_base: 10
  },

  // --- 10141: DERECHO ADMINISTRATIVO I ---
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

  // --- 10113: INTRODUCCIÓN A LA SOCIOLOGÍA ---
  {
    id: "10113-01", id_categoria: "10113", categoria_nombre: "Intro Sociología", dificultad: "facil",
    pregunta: "Según Émile Durkheim, la solidaridad basada en la división del trabajo y en la interdependencia en sociedades complejas es:",
    opciones: ["Solidaridad Mecánica", "Solidaridad Orgánica", "Solidaridad Colectiva", "Solidaridad Estatutaria"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Émile Durkheim, 'La división del trabajo social' (1893).", puntos_base: 10
  },

  // --- 10616: INTRODUCCIÓN AL PENSAMIENTO CIENTÍFICO ---
  {
    id: "10616-01", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué epistemólogo sostuvo que la ciencia progresa mediante la refutación y falsación de hipótesis?",
    opciones: ["Rudolf Carnap", "Karl Popper", "Thomas Kuhn", "Paul Feyerabend"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Karl Popper, 'La lógica de la investigación científica' (1934).", puntos_base: 10
  },

  // --- 10626: DERECHOS HUMANOS ---
  {
    id: "10626-01", id_categoria: "10626", categoria_nombre: "Derechos Humanos", dificultad: "facil",
    pregunta: "¿Qué tribunal internacional con sede en San José de Costa Rica tiene competencia para juzgar la responsabilidad de los Estados americanos?",
    opciones: ["Tribunal Penal Internacional", "Corte Interamericana de Derechos Humanos (Corte IDH)", "Corte Internacional de Justicia (La Haya)", "Comité de Derechos Humanos de la ONU"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Convención Americana sobre Derechos Humanos (Pacto de San José de Costa Rica).", puntos_base: 10
  },

  // --- 10132: DERECHO PRIVADO IV - COMERCIAL ---
  {
    id: "10132-01", id_categoria: "10132", categoria_nombre: "D. Privado IV (Com.)", dificultad: "facil",
    pregunta: "El título valor librado por el girador que contiene una promesa incondicional de pagar una suma determinada de dinero a su vencimiento se denomina:",
    opciones: ["Cheque cruzado", "Pagaré", "Warrant", "Factura de crédito"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Decreto-Ley 5965/63 (Régimen de Letra de Cambio y Pagaré).", puntos_base: 10
  },

  // --- 10142: DERECHO PRIVADO VI - COMERCIAL (SOCIEDADES) ---
  {
    id: "10142-01", id_categoria: "10142", categoria_nombre: "D. Privado VI (Com.)", dificultad: "media",
    pregunta: "En la Sociedad de Responsabilidad Limitada (SRL) regulada en la Ley 19.550, la responsabilidad de los socios está limitada a:",
    opciones: ["Todo su patrimonio personal sin tope", "La integración de las cuotas que suscriban o adquieran", "El capital social declarado en el balance anterior", "La decisión del órgano de fiscalización"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 146 de la Ley General de Sociedades 19.550.", puntos_base: 25
  },

  // --- 10653: DERECHO DE FAMILIA ---
  {
    id: "10653-01", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "facil",
    pregunta: "En el Código Civil y Comercial, el divorcio unilateral puede ser solicitado por:",
    opciones: ["Solo uno de los cónyuges sin necesidad de invocar causa ni esperar plazo", "Ambos cónyuges de común acuerdo únicamente", "Solo si han transcurrido 3 años de separación de hecho", "Únicamente alegando culpa o infidelidad en la demanda"],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 437 CCyCN: 'El divorcio se declara judicialmente a petición de uno o de ambos cónyuges'.", puntos_base: 10
  },

  // --- 10659: DERECHO DE LAS SUCESIONES ---
  {
    id: "10659-01", id_categoria: "10659", categoria_nombre: "D. Sucesiones", dificultad: "media",
    pregunta: "Según el Art. 2445 del CCyCN, la porción legítima inviolable reservada al cónyuge supérstite en la sucesión es de:",
    opciones: ["Dos tercios (2/3)", "Un medio (1/2)", "Un tercio (1/3)", "Tres cuartos (3/4)"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2445 del Código Civil y Comercial de la Nación.", puntos_base: 25
  },

  // --- 10147: FILOSOFÍA DEL DERECHO ---
  {
    id: "10147-01", id_categoria: "10147", categoria_nombre: "Filosofía del Derecho", dificultad: "media",
    pregunta: "¿Qué filósofo del derecho formuló la 'Fórmula de Radbruch' expresando que el derecho extremadamente injusto no es derecho?",
    opciones: ["Hans Kelsen", "Gustav Radbruch", "Robert Alexy", "John Finnis"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Gustav Radbruch, 'Gesetzliches Unrecht und übergesetzliches Recht' (1946).", puntos_base: 25
  },

  // =====================================================
  // EXPANSIÓN MASIVA DE PREGUNTAS - PLAN DE ESTUDIOS Nº 6
  // =====================================================

  // --- 10113: INTRODUCCIÓN A LA SOCIOLOGÍA (Expansión) ---
  {
    id: "10113-02", id_categoria: "10113", categoria_nombre: "Intro Sociología", dificultad: "facil",
    pregunta: "¿Qué tipo de solidaridad predomina en las sociedades modernas con alta división del trabajo según Durkheim?",
    opciones: ["Mecánica", "Orgánica", "Tradicional", "Carismática"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Émile Durkheim, 'La división del trabajo social'.", puntos_base: 10
  },
  {
    id: "10113-03", id_categoria: "10113", categoria_nombre: "Intro Sociología", dificultad: "media",
    pregunta: "Para Max Weber, el Estado moderno se define fundamentalmente por:",
    opciones: ["Garantizar la igualdad económica", "El monopolio de la violencia física legítima", "La administración de la justicia divina", "Su capacidad de redistribuir la riqueza"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Max Weber, 'El político y el científico'.", puntos_base: 25
  },
  {
    id: "10113-04", id_categoria: "10113", categoria_nombre: "Intro Sociología", dificultad: "dificil",
    pregunta: "En la teoría de Karl Marx, el concepto de 'alienación' en el trabajo capitalista implica que:",
    opciones: ["El trabajador se siente realizado", "El Estado protege los medios de producción", "El empleador comparte las ganancias equitativamente", "El trabajador pierde el control sobre el producto de su trabajo"],
    respuesta_correcta_index: 3,
    fundamento_juridico: "Karl Marx, 'Manuscritos económicos y filosóficos de 1844'.", puntos_base: 50
  },
  {
    id: "10113-05", id_categoria: "10113", categoria_nombre: "Intro Sociología", dificultad: "media",
    pregunta: "¿Qué concepto utiliza Pierre Bourdieu para describir el conocimiento y habilidades culturales que confieren poder y estatus?",
    opciones: ["Capital económico", "Plusvalía", "Capital cultural", "Acción racional"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Pierre Bourdieu, 'Los tres estados del capital cultural'.", puntos_base: 25
  },
  {
    id: "10113-06", id_categoria: "10113", categoria_nombre: "Intro Sociología", dificultad: "facil",
    pregunta: "¿A quién se considera el creador del positivismo y acuñador del término 'sociología'?",
    opciones: ["Karl Marx", "Auguste Comte", "Talcott Parsons", "Georg Simmel"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Auguste Comte, 'Curso de filosofía positiva'.", puntos_base: 10
  },

  // --- 10112: HISTORIA CONSTITUCIONAL (Expansión) ---
  {
    id: "10112-02", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿En qué año se sancionó la primera Constitución Nacional Argentina?",
    opciones: ["1810", "1816", "1853", "1860"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "La Constitución Nacional fue sancionada el 1 de mayo de 1853 por el Congreso General Constituyente de Santa Fe.", puntos_base: 10
  },
  {
    id: "10112-03", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "El Pacto de San José de Flores (1859) permitió:",
    opciones: ["La declaración de independencia", "La incorporación de Buenos Aires a la Confederación", "La creación del Banco Central", "La abolición de la esclavitud"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Pacto de San José de Flores, 11 de noviembre de 1859.", puntos_base: 25
  },
  {
    id: "10112-04", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "dificil",
    pregunta: "Juan Bautista Alberdi planteó en 'Bases y Puntos de Partida' que la constitución debía fomentar:",
    opciones: ["El proteccionismo industrial", "La inmigración europea y el comercio libre", "Un Estado centralizado y unitario", "La restauración de la monarquía"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Juan B. Alberdi, 'Bases y Puntos de Partida para la Organización Política de la República Argentina' (1852).", puntos_base: 50
  },
  {
    id: "10112-05", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "media",
    pregunta: "La reforma constitucional de 1994 fue posible gracias a:",
    opciones: ["Un golpe de Estado", "El Pacto de Olivos entre Menem y Alfonsín", "Un referéndum popular vinculante", "Una decisión unilateral del Senado"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Pacto de Olivos (1993) y Ley 24.309 de necesidad de reforma.", puntos_base: 25
  },
  {
    id: "10112-06", id_categoria: "10112", categoria_nombre: "Historia Constitucional", dificultad: "facil",
    pregunta: "¿Qué forma de gobierno adoptó la Constitución de 1853?",
    opciones: ["Unitaria y monárquica", "Federal y parlamentaria", "Representativa, republicana y federal", "Confederal y presidencialista"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Art. 1 de la Constitución Nacional: 'La Nación Argentina adopta para su gobierno la forma representativa republicana federal'.", puntos_base: 10
  },

  // --- 10121: DERECHO ROMANO (Expansión) ---
  {
    id: "10121-02", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "¿Qué emperador mandó compilar el Corpus Iuris Civilis?",
    opciones: ["Augusto", "Justiniano", "Constantino", "Trajano"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Corpus Iuris Civilis, compilado por orden de Justiniano I (527-565 d.C.).", puntos_base: 10
  },
  {
    id: "10121-03", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "En el derecho romano, la 'manus' era:",
    opciones: ["Un tipo de contrato", "El poder del marido sobre la mujer", "Una forma de adquirir la ciudadanía", "El derecho a votar en el Senado"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Instituciones de Gayo, Libro I.", puntos_base: 25
  },
  {
    id: "10121-04", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "dificil",
    pregunta: "La 'stipulatio' en el derecho romano era un contrato que se perfeccionaba mediante:",
    opciones: ["La entrega de la cosa", "El consenso de las partes", "La pregunta solemne y la respuesta congruente", "La inscripción en el registro público"],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Gayo, Instituciones III.92: 'Verbis obligatio fit ex interrogatione et responsione'.", puntos_base: 50
  },
  {
    id: "10121-05", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "media",
    pregunta: "¿Qué era la 'patria potestad' en Roma?",
    opciones: ["El poder del Estado sobre los ciudadanos", "El poder absoluto del pater familias sobre los miembros de su familia", "El derecho de propiedad sobre esclavos únicamente", "La autoridad del pretor sobre los litigantes"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Instituciones de Gayo, Libro I. La patria potestas era perpetua y solo correspondía al pater familias.", puntos_base: 25
  },
  {
    id: "10121-06", id_categoria: "10121", categoria_nombre: "Derecho Romano", dificultad: "facil",
    pregunta: "La Ley de las XII Tablas (451-450 a.C.) fue importante porque:",
    opciones: ["Abolió la esclavitud", "Fue la primera codificación escrita del derecho romano", "Estableció la república", "Otorgó la ciudadanía a todos los habitantes del Imperio"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Lex Duodecim Tabularum (451-450 a.C.), primera compilación escrita de normas jurídicas romanas.", puntos_base: 10
  },

  // --- 10616: PENSAMIENTO CIENTÍFICO (Expansión) ---
  {
    id: "10616-02", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "¿Qué filósofo propuso el concepto de 'paradigma' en la filosofía de la ciencia?",
    opciones: ["Karl Popper", "Thomas Kuhn", "Paul Feyerabend", "Imre Lakatos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Thomas Kuhn, 'La estructura de las revoluciones científicas' (1962).", puntos_base: 10
  },
  {
    id: "10616-03", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "Según Karl Popper, una teoría es científica si:",
    opciones: ["Puede ser verificada empíricamente", "Puede ser falsada o refutada", "Es aceptada por la comunidad académica", "Es deducida de axiomas lógicos"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Karl Popper, 'La lógica de la investigación científica' (1934).", puntos_base: 25
  },
  {
    id: "10616-04", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "dificil",
    pregunta: "El 'anarquismo epistemológico' de Paul Feyerabend plantea que:",
    opciones: ["La ciencia debe seguir un único método universal", "No existe un método científico privilegiado y 'todo vale'", "Solo las ciencias naturales producen conocimiento verdadero", "La inducción es el único método válido"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Paul Feyerabend, 'Contra el método' (1975).", puntos_base: 50
  },
  {
    id: "10616-05", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "facil",
    pregunta: "El positivismo lógico del Círculo de Viena sostenía que los enunciados con sentido deben ser:",
    opciones: ["Metafísicos", "Verificables empíricamente o tautológicos", "Intuitivos", "Basados en la autoridad"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Manifiesto del Círculo de Viena (1929), 'La concepción científica del mundo'.", puntos_base: 10
  },
  {
    id: "10616-06", id_categoria: "10616", categoria_nombre: "Pensamiento Científico", dificultad: "media",
    pregunta: "¿Qué es una 'revolución científica' según Thomas Kuhn?",
    opciones: ["Un progreso lineal del conocimiento", "El reemplazo de un paradigma dominante por otro nuevo e inconmensurable", "La acumulación gradual de datos empíricos", "Un método experimental específico"],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Kuhn, 'La estructura de las revoluciones científicas', Cap. IX.", puntos_base: 25
  },

  // --- 10123: DERECHO POLÍTICO (Expansión) ---
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

  // --- 10124: DERECHO PENAL I (Expansión) ---
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

  // --- 10122: DERECHO CIVIL I - PRIVADO II (Expansión) ---
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

  // --- 10131: DERECHO PRIVADO III - CONTRATOS (Expansión) ---
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

  // --- 10133: DERECHO PENAL II (Expansión) ---
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

  // --- 10134: DERECHO PROCESAL I (Expansión) ---
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

  // --- 10135: DERECHO PROCESAL II - PENAL (Expansión) ---
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

  // --- 10626: DERECHOS HUMANOS (Expansión) ---
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

  // --- 10640: DERECHO SOCIAL DEL TRABAJO (Expansión) ---
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

  // --- 10143: DERECHO ADMINISTRATIVO II (Expansión) ---
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

  // --- 10144: DERECHO INTERNACIONAL PÚBLICO (Expansión) ---
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

  // --- 10145: DERECHO PRIVADO V - REALES (Expansión) ---
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

  // --- 10146: DERECHO SOCIAL DE LA SEGURIDAD SOCIAL (Expansión) ---
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

  // --- 10148: DERECHO PRIVADO VII - CONCURSOS (Expansión) ---
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

  // --- 10149: DERECHO INTERNACIONAL PRIVADO (Expansión) ---
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

  // --- 10654: PRÁCTICA PROFESIONAL (Expansión) ---
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

  // --- 10147: FILOSOFÍA DEL DERECHO (Expansión) ---
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

  // --- 10653: DERECHO DE FAMILIA (Expansión) ---
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

  // --- 10659: DERECHO DE LAS SUCESIONES (Expansión) ---
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
    fundamento_juridico: "Arts. 2477 (ológrafo) y 2479 (por acto público) del CCyCN.", puntos_base: 10
  }
];
