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
  }
];
