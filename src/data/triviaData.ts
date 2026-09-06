
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
  /** Documento de cátedra del que se extrajo, para saber dónde corregirla. */
  origen?: string;
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
  /** true cuando la sala se cerró porque el rival abandonó y venció el plazo de 5 minutos. */
  porAbandono?: boolean;
  /** Ramas sorteadas al crear la sala (competitivo nuevo). Nulas en salas viejas por materia. */
  ramaFija?: string;
  ramaAzar?: string;
  status: "esperando_rival" | "en_curso" | "finalizado";
  createdAt: string;
  /** ISO timestamp original (para ordenar junto a otras actividades), a diferencia de `createdAt` que ya viene formateado para mostrar. */
  createdAtRaw?: string;
}

export interface RangoJuridico {
  id: string;
  nivel: number;
  nombre: string;
  minPuntos: number;
  maxPuntos: number;
  iconoNombre: string;
  imagenUrl: string;
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
    nivel: 1,
    nombre: "Ingresante",
    minPuntos: 0,
    maxPuntos: 99,
    iconoNombre: "BookOpen",
    imagenUrl: "/logos-rangos/Nivel1.png",
    colorGradient: "from-slate-500 to-zinc-600",
    badgeStyle: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    descripcion: "Dando los primeros pasos en las aulas de la FCJyS y adaptándose al ingreso."
  },
  {
    id: "practicante",
    nivel: 2,
    nombre: "Practicante",
    minPuntos: 100,
    maxPuntos: 249,
    iconoNombre: "Building2",
    imagenUrl: "/logos-rangos/Nivel2.png",
    colorGradient: "from-blue-500 to-cyan-600",
    badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    descripcion: "Recorriendo mesas de entradas, pasillos de Tribunales y con el Plan al día."
  },
  {
    id: "estudiante_avanzado",
    nivel: 3,
    nombre: "Estudiante Avanzado",
    minPuntos: 250,
    maxPuntos: 499,
    iconoNombre: "GraduationCap",
    imagenUrl: "/logos-rangos/Nivel3.png",
    colorGradient: "from-cyan-500 to-teal-600",
    badgeStyle: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    descripcion: "Con las materias más pesadas metidas y los codos gastados en la biblioteca."
  },
  {
    id: "graduado_reciente",
    nivel: 4,
    nombre: "Graduado Reciente",
    minPuntos: 500,
    maxPuntos: 899,
    iconoNombre: "FileText",
    imagenUrl: "/logos-rangos/Nivel4.png",
    colorGradient: "from-teal-500 to-emerald-600",
    badgeStyle: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    descripcion: "Título en mano, juramento cumplido y esperando la habilitación del diploma."
  },
  {
    id: "abogado_joven",
    nivel: 5,
    nombre: "Abogado Joven",
    minPuntos: 900,
    maxPuntos: 1499,
    iconoNombre: "Briefcase",
    imagenUrl: "/logos-rangos/Nivel5.png",
    colorGradient: "from-emerald-500 to-green-600",
    badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    descripcion: "Matriculado con sello fresco, token en mano y los primeros escritos ingresados."
  },
  {
    id: "especialista_docente",
    nivel: 6,
    nombre: "Especialista / Docente Adscripto",
    minPuntos: 1500,
    maxPuntos: 2299,
    iconoNombre: "Award",
    imagenUrl: "/logos-rangos/Nivel6.png",
    colorGradient: "from-green-500 to-lime-600",
    badgeStyle: "bg-green-500/20 text-green-300 border-green-500/30",
    descripcion: "Dominio de cátedra, posgrados en marcha y sólidas estrategias en el fuero."
  },
  {
    id: "abogado_experto",
    nivel: 7,
    nombre: "Abogado Experto",
    minPuntos: 2300,
    maxPuntos: 3499,
    iconoNombre: "Scale",
    imagenUrl: "/logos-rangos/Nivel7.png",
    colorGradient: "from-amber-500 to-orange-600",
    badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    descripcion: "Litigante de peso, referencia de doctrina, jurisprudencia y casos complejos."
  },
  {
    id: "secretario_juzgado",
    nivel: 8,
    nombre: "Secretario de Juzgado",
    minPuntos: 3500,
    maxPuntos: 4999,
    iconoNombre: "BookOpenCheck",
    imagenUrl: "/logos-rangos/Nivel8.png",
    colorGradient: "from-orange-500 to-rose-600",
    badgeStyle: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    descripcion: "Brazo ejecutor del despacho judicial, despachando expedientes con rigor técnico."
  },
  {
    id: "juez_primera_instancia",
    nivel: 9,
    nombre: "Juez de Primera Instancia",
    minPuntos: 5000,
    maxPuntos: 6999,
    iconoNombre: "Gavel",
    imagenUrl: "/logos-rangos/Nivel9.png",
    colorGradient: "from-rose-500 to-red-600",
    badgeStyle: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    descripcion: "Titular de juzgado con solvencia jurídica, imparcialidad y firma decisiva."
  },
  {
    id: "camarista",
    nivel: 10,
    nombre: "Camarista / Juez",
    minPuntos: 7000,
    maxPuntos: 9999,
    iconoNombre: "Landmark",
    imagenUrl: "/logos-rangos/Nivel10.png",
    colorGradient: "from-purple-500 to-violet-600",
    badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    descripcion: "Integrante de Cámara de Apelaciones revisando fallos y sentando jurisprudencia."
  },
  {
    id: "ministro_scba",
    nivel: 11,
    nombre: "Ministro de la Suprema Corte Provincial",
    minPuntos: 10000,
    maxPuntos: 14999,
    iconoNombre: "Medal",
    imagenUrl: "/logos-rangos/Nivel11.png",
    colorGradient: "from-violet-500 to-indigo-600",
    badgeStyle: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    descripcion: "Máxima autoridad jurisprudencial a nivel provincial con impacto institucional."
  },
  {
    id: "juez_csjn",
    nivel: 12,
    nombre: "Juez de la Corte Suprema de la Nación",
    minPuntos: 15000,
    maxPuntos: 999999,
    iconoNombre: "Sparkles",
    imagenUrl: "/logos-rangos/Nivel12.png",
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
// BANCO DE PREGUNTAS
//
// Se genera con scripts/extraerBanco.mjs + scripts/importarBanco.mjs, que
// parsean los documentos originales de cátedra. No se edita a mano.
//
// Son ~3 MB, así que se carga con import() dinámico y queda fuera del bundle
// inicial: sólo lo descarga quien entra a la Trivia o al panel de admin.
// =========================================================================
/**
 * Arranque de la Temporada 1 y, por lo tanto, momento en que la Trivia se abre
 * al público. Antes de esta fecha /trivia muestra la cuenta regresiva.
 *
 * Debe coincidir con el valor por defecto de fn_inicio_temporada_vigente() en
 * la base (migración 20260906180000).
 */
export const INICIO_TEMPORADA_1 = new Date("2026-09-06T19:00:00-03:00").getTime();

let bancoEnMemoria: TriviaQuestion[] | null = null;
let cargaEnCurso: Promise<TriviaQuestion[]> | null = null;

export async function cargarBancoPreguntas(): Promise<TriviaQuestion[]> {
  if (bancoEnMemoria) return bancoEnMemoria;
  if (!cargaEnCurso) {
    cargaEnCurso = import("./bancoPreguntas.generated").then(m => {
      bancoEnMemoria = m.BANCO_PREGUNTAS;
      return bancoEnMemoria;
    });
  }
  return cargaEnCurso;
}

