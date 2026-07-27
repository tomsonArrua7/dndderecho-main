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
    descripcion: "Dando los primeros pasos en las aulas de la FCJyS."
  },
  {
    id: "estudiante_avanzado",
    nombre: "Estudiante Avanzado",
    minPuntos: 100,
    maxPuntos: 299,
    iconoNombre: "GraduationCap",
    colorGradient: "from-blue-500 to-cyan-600",
    badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    descripcion: "Con los codos gastados y el Plan 6 al día."
  },
  {
    id: "abogado_joven",
    nombre: "Abogado Joven",
    minPuntos: 300,
    maxPuntos: 699,
    iconoNombre: "Briefcase",
    colorGradient: "from-emerald-500 to-teal-600",
    badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    descripcion: "Matriculado con sello fresco y los primeros escritos ingresados."
  },
  {
    id: "abogado_experto",
    nombre: "Abogado Experto",
    minPuntos: 700,
    maxPuntos: 1499,
    iconoNombre: "Scale",
    colorGradient: "from-purple-500 to-violet-600",
    badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    descripcion: "Dominio solvente de doctrina, jurisprudencia y estrategia judicial."
  },
  {
    id: "juez",
    nombre: "Juez",
    minPuntos: 1500,
    maxPuntos: 2999,
    iconoNombre: "Gavel",
    colorGradient: "from-amber-500 to-orange-600",
    badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    descripcion: "Titular de juzgado con solvencia jurídica e imparcialidad."
  },
  {
    id: "juez_csjn",
    nombre: "Juez de la Corte Suprema de la Nación",
    minPuntos: 3000,
    maxPuntos: Infinity,
    iconoNombre: "Landmark",
    colorGradient: "from-yellow-400 via-amber-500 to-red-600",
    badgeStyle: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-lg shadow-yellow-500/10",
    descripcion: "Máxima magistratura constitucional de la República Argentina."
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

export const CATEGORIAS_TRIVIA: CategoriaTrivia[] = [
  {
    id: "derecho_civil",
    nombre: "Derecho Civil",
    descripcion: "CCyCN, Obligaciones, Contratos, Reales, Familia y Sucesiones",
    icono: "Scale",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: "derecho_penal",
    nombre: "Derecho Penal",
    descripcion: "Código Penal Argentino, Parte General y Parte Especial",
    icono: "ShieldAlert",
    color: "from-red-600 to-rose-700"
  },
  {
    id: "constitucional_nacional",
    nombre: "Derecho Constitucional",
    descripcion: "Constitución Nacional Argentina, Historia y DDHH",
    icono: "Landmark",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "derecho_administrativo",
    nombre: "Derecho Administrativo",
    descripcion: "Acto administrativo, empleo público y procedimiento",
    icono: "FileText",
    color: "from-emerald-600 to-teal-700"
  },
  {
    id: "derecho_provincial_ba",
    nombre: "Derecho Provincial BA",
    descripcion: "Constitución de PBA y procedimiento provincial",
    icono: "MapPin",
    color: "from-cyan-600 to-blue-700"
  },
  {
    id: "normativa_local_lp",
    nombre: "Derecho Municipal y Local LP",
    descripcion: "Ley Orgánica de Municipalidades e Historia de La Plata",
    icono: "Building2",
    color: "from-purple-600 to-violet-700"
  },
  {
    id: "historia_unlp_jursoc",
    nombre: "UNLP y Jursoc",
    descripcion: "Estatuto UNLP, Reforma Universitaria e Historia",
    icono: "GraduationCap",
    color: "from-rose-600 to-pink-700"
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // =========================================================================
  // --- 1. DERECHO CIVIL ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "civ-f-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "¿A qué edad se alcanza la mayoría de edad legal en la República Argentina según el Código Civil y Comercial?",
    opciones: [
      "A los 18 años de edad.",
      "A los 95 años de edad.",
      "A los 4 años de edad con permiso escolar.",
      "A los 120 años de edad al jubilarse."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación (Ley 26.994), Art. 25: 'Menor de edad es la persona que no ha cumplido dieciocho años'.",
    puntos_base: 10
  },
  {
    id: "civ-f-02",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 19 del CCyCN, ¿en qué momento comienza legalmente la existencia de la persona humana?",
    opciones: [
      "Con la concepción.",
      "A los 40 años al comprar un inmueble.",
      "Al matricularse en un club social.",
      "Al tramitar el primer pasaporte internacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación, Art. 19: 'La existencia de la persona humana comienza con la concepción'.",
    puntos_base: 10
  },
  {
    id: "civ-f-03",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "¿Cuál es el plazo genérico de prescripción liberatoria del artículo 2560 del CCyCN cuando la ley no fija un plazo especial?",
    opciones: [
      "Cinco (5) años.",
      "Doscientos (200) años.",
      "Cuatro minutos hábiles.",
      "Tres mil años corridos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial, Art. 2560: 'El plazo de la prescripción es de cinco años, excepto que esté previsto uno diferente...'.",
    puntos_base: 10
  },
  {
    id: "civ-f-04",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "¿Cuál de los siguientes es un atributo inherente e inseparable de la persona humana consagrado en el Código Civil?",
    opciones: [
      "El Nombre.",
      "La posesión de un vehículo de alta gama.",
      "El número de tarjeta de crédito corporativa.",
      "La suscripción a un servicio de streaming."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 62: 'La persona humana tiene el derecho y el deber de usar el prenombre y el apellido que le corresponden'.",
    puntos_base: 10
  },

  // MEDIAS (Presupuestos legales, plazos y conceptos normativos)
  {
    id: "civ-m-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "En el contrato de locación habitacional, ¿cuál es el plazo mínimo legal establecido en el artículo 1198 del CCyCN (texto vigente Ley 27.737)?",
    opciones: [
      "Tres (3) años.",
      "Un (1) mes.",
      "Diez (10) años obligatorios.",
      "Cincuenta (50) años."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial, Art. 1198 (Ley 27.737): 'El contrato de locación de inmueble... se considera celebrado por el plazo mínimo legal de tres años'.",
    puntos_base: 25
  },
  {
    id: "civ-m-02",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Según el artículo 332 del CCyCN, ¿qué vicio permite demandar la nulidad de un acto jurídico cuando una parte explota la necesidad o inexperiencia de la otra?",
    opciones: [
      "Lesión.",
      "Simulación licita consentida.",
      "Error material involuntario.",
      "Caso fortuito ajeno."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 332: 'Puede demandarse la nulidad o la modificación de los actos jurídicos cuando una de las partes explotando la necesidad, debilidad síquica o inexperiencia...'.",
    puntos_base: 25
  },
  {
    id: "civ-m-03",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 1091 del CCyCN, ¿qué instituto permite la resolución o adecuación del contrato si la prestación se vuelve excesivamente onerosa por un cambio extraordinario de circunstancias?",
    opciones: [
      "Teoría de la Imprevisión.",
      "Pacto Comisorio Implícito por mora involuntaria.",
      "Enriquecimiento sin causa de buena fe.",
      "Abuso del derecho positivo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1091: 'Si en un contrato conmutativo de ejecución diferida o permanente, la prestación a cargo de una de las partes se torna excesivamente onerosa, por alteración extraordinaria de las circunstancias...'.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Doctrina fina, nulidades y trampas capciosas)
  {
    id: "civ-d-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Respecto del régimen de nulidad relativa de un acto jurídico, ¿puede el juez declararla de oficio si la invalidez resulta manifiesta en el expediente?",
    opciones: [
      "No, la nulidad relativa jamás puede ser declarada de oficio por el juez, solo a petición de las partes legitimadas.",
      "Sí, siempre que la nulidad sea manifiesta el juez tiene la obligación constitucional de declararla de oficio.",
      "Sí, pero únicamente si el Ministerio Público emite dictamen favorable expreso.",
      "No, salvo que el acto afecte indirectamente bienes de dominio público provincial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 388: 'La nulidad relativa sólo puede declararse a instancia de las personas en cuyo beneficio se establece... No puede ser declarada por el juez de oficio...'.",
    puntos_base: 50
  },
  {
    id: "civ-d-02",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "En la responsabilidad objetiva del principal por el hecho del dependiente (Art. 1753 CCyCN), ¿exime de responsabilidad demostrar la falta de culpa personal en la selección del dependiente?",
    opciones: [
      "No, la responsabilidad es objetiva y la falta de culpa del principal no constituye eximente legal.",
      "Sí, la prueba fehaciente de la diligencia en la selección libera íntegramente al principal.",
      "Sí, pero solo si el dependiente actuó fuera de la sede de la empresa.",
      "No, salvo que el dependiente sea un contratista independiente con fianza."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1753: 'El principal responde objetivamente por los daños que causen los que están bajo su dependencia... La falta de culpa no exime de responsabilidad'.",
    puntos_base: 50
  },
  {
    id: "civ-d-03",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Según el artículo 44 del CCyCN, ¿cuál es el requisito indispensable para declarar la nulidad de un acto jurídico entre vivos celebrado por una persona con capacidad restringida antes de la inscripción de la sentencia?",
    opciones: [
      "Que el acto sea perjudicable y que haya existido mala fe de la otra parte o sea a título gratuito.",
      "Que el acto haya sido suscripto ante dos testigos mayores de edad de la misma localidad.",
      "Que la sentencia judicial contenga la sanción de inhabilitación comercial previa.",
      "Que la parte demandante acredite estado de indigencia patrimonial absoluta."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 44: 'Los actos anteriores a la inscripción de la sentencia pueden ser declarados nulos si perjudican a la persona... si la enfermedad mental era ostensible, si hubo mala fe de la otra parte, o si el acto es a título gratuito'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- 2. DERECHO PENAL ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "pen-f-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "¿Cuál es la sanción principal establecida en el artículo 79 del Código Penal Argentino para el delito de homicidio simple?",
    opciones: [
      "Reclusión o prisión de 8 a 25 años.",
      "Una multa de $10 y llamado de atención por escrito.",
      "Dos días de trabajo comunitario escolar.",
      "Retiro temporal del carnet de biblioteca."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal Argentino, Art. 79: 'Se aplicará reclusión o prisión de ocho a veinticinco años, al que matare a otro...'.",
    puntos_base: 10
  },
  {
    id: "pen-f-02",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Según el régimen penal de la minoridad (Ley 22.278), ¿a qué edad se fija el límite absoluto de no punibilidad penal de un menor en Argentina?",
    opciones: [
      "A los 16 años de edad.",
      "A los 60 años de edad.",
      "A los 2 años de edad únicamente en guarderías.",
      "A los 99 años de edad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 22.278, Art. 1°: 'No es punible el menor que no haya cumplido dieciséis años de edad'.",
    puntos_base: 10
  },
  {
    id: "pen-f-03",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 34 inciso 6° del Código Penal, ¿cuál es un requisito imprescindible para la legítima defensa propia?",
    opciones: [
      "Falta de provocación suficiente por parte de quien se defiende.",
      "Haber tramitado previamente una autorización policial por escrito.",
      "Contratar un seguro comercial de responsabilidad civil contra terceros.",
      "Anunciar la defensa por edictos judiciales en el diario local."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 34 inc. 6°: 'a) Agresión ilegítima; b) Necesidad racional del medio empleado...; c) Falta de provocación suficiente por parte del que se defiende'.",
    puntos_base: 10
  },

  // MEDIAS (Presupuestos legales, escalas y conceptos de tipicidad)
  {
    id: "pen-m-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "En el delito de robo con armas (Art. 166 inc. 2° CP), si se acredita que el arma de fuego utilizada no era apta para el disparo, ¿cuál es la escala penal aplicable?",
    opciones: [
      "Prisión de 3 a 10 años.",
      "Prisión perpetua incondicional.",
      "Multa administrativa leve.",
      "Inhabilitación especial por dos semanas."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 166 inc. 2° in fine: 'Si se cometiere el robo con un arma de fuego cuya aptitud para el disparo no pudiera tenerse de ningún modo por acreditada... la pena será de tres a diez años de prisión'.",
    puntos_base: 25
  },
  {
    id: "pen-m-02",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Conforme al artículo 42 del Código Penal, ¿cuándo se configura técnicamente la tentativa?",
    opciones: [
      "Cuando se inicia la ejecución de un delito determinado sin consumarlo por circunstancias ajenas a la voluntad del autor.",
      "Cuando el autor piensa mentalmente en cometer una infracción sin realizar acto alguno.",
      "Cuando el delito resulta completamente consumado en su totalidad.",
      "Cuando se comete una falta administrativa menor."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 42: 'El que con el fin de cometer un delito determinado comienza su ejecución, pero no lo consuma por circunstancias ajenas a su voluntad...'.",
    puntos_base: 25
  },
  {
    id: "pen-m-03",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Según el artículo 45 del Código Penal, ¿quiénes son considerados autores en la participación criminal?",
    opciones: [
      "Los que toman parte en la ejecución del hecho o prestan una auxilio sin el cual no habría podido cometerse.",
      "Los encubridores que intervienen después de la consumación del delito.",
      "Los testigos presenciales que no formularon la denuncia en comisaría.",
      "Los familiares directos del damnificado."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 45: 'Los que tomasen parte en la ejecución del hecho o prestasen al autor o autores un auxilio o cooperación sin los cuales no habría podido cometerse el delito...'.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Doctrina penal fina, concursos y desistimiento)
  {
    id: "pen-d-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "Si un sujeto inicia la ejecución de un robo cometiendo violación de domicilio, pero luego desiste voluntariamente del robo, ¿cuál es su situación punitiva según el artículo 43 del CP?",
    opciones: [
      "Queda exento de pena por la tentativa de robo, pero responde por el delito consumado de violación de domicilio.",
      "Queda liberado de pena por todos los actos, incluidos los delitos independientes ya consumados.",
      "Responde por la pena del robo consumado reducida a la mitad.",
      "El desistimiento carece de efectos por haberse ingresado al domicilio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 43: 'El que desistiere voluntariamente del delito, no estará sujeto a pena', pero no borra la punibilidad de los delitos independientes ya consumados en el trayecto.",
    puntos_base: 50
  },
  {
    id: "pen-d-02",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "De acuerdo con el artículo 55 del Código Penal en materia de Concurso Real de delitos, ¿cuál es el tope máximo fijado para la acumulación de penas privativas de la libertad?",
    opciones: [
      "Cincuenta (50) años de prisión o reclusión.",
      "Cien (100) años de prisión ininterrumpida.",
      "Veinticinco (25) años acumulados en todos los casos.",
      "Treinta (30) años fijados por la jurisprudencia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 55 (texto según Ley 25.928): '...esta suma no podrá exceder del máximum legal de la especie de pena de que se trate... en ningún caso podrá exceder de cincuenta años de prisión o reclusión'.",
    puntos_base: 50
  },
  {
    id: "pen-d-03",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "En el delito de Homicidio Preterintencional (Art. 81 inc. 1°b CP), ¿cuál es la estructura subjetivo-objetiva exigida en el tipo penal?",
    opciones: [
      "Dolo de causar un daño en el cuerpo o en la salud, utilizando un medio que no debía razonablemente causar la muerte, produciéndose el resultado letal.",
      "Dolo eventual de matar combinado con culpa grave en el medio empleado.",
      "Culpa exclusiva en las lesiones leves y dolo directo en el homicidio final.",
      "Acción totalmente fortuita e imprevista sin dolo alguno en el inicio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 81 inc. 1°b: 'Al que, con el propósito de causar un daño en el cuerpo o en la salud, produjere la muerte de alguna persona, cuando el medio empleado no debía razonablemente ocasionarla'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- 3. DERECHO CONSTITUCIONAL ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "con-f-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "¿Cuál es la Ley Suprema de la República Argentina según lo dispuesto en el artículo 31 de la Constitución Nacional?",
    opciones: [
      "La Constitución Nacional, las leyes de la Nación y los tratados internacionales con potencias extranjeras.",
      "El reglamento interno de un club de barrio local.",
      "La circular informativa de una entidad bancaria privada.",
      "El acta de una reunión de consorcio edilicio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional, Art. 31: 'Esta Constitución, las leyes de la Nación que en su consecuencia se dicten por el Congreso y los tratados con las potencias extranjeras son la ley suprema de la Nación...'.",
    puntos_base: 10
  },
  {
    id: "con-f-02",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 30 de la CN, ¿qué mayoría especial se requiere en el Congreso para declarar la necesidad de la reforma constitucional?",
    opciones: [
      "Al menos dos terceras partes de sus miembros.",
      "El voto favorable de un solo legislador de turno.",
      "Unanimidad de todos los intendentes del país.",
      "Tres votos en la comisión vecinal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional, Art. 30: 'La necesidad de reforma debe ser declarada por el Congreso con el voto de dos terceras partes, al menos, de sus miembros'.",
    puntos_base: 10
  },

  // MEDIAS (Atribuciones, garantismo y amparo)
  {
    id: "con-m-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "¿Qué tipo de sistema de control de constitucionalidad rige en el ordenamiento jurídico argentino a nivel federal?",
    opciones: [
      "Sistema judicial difuso, ejercido por todos los jueces de cualquier instancia.",
      "Sistema político concentrado exclusivo en el Ministerio de Economía.",
      "Sistema de tribunal constitucional parlamentario único.",
      "Sistema preventivo a cargo de la Auditoría General."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina de la CSJN (Fallos 'Sojo' y 'Elortondo'): En Argentina el control de constitucionalidad es ejercido de manera difusa por todo el Poder Judicial.",
    puntos_base: 25
  },
  {
    id: "con-m-02",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Según el artículo 99 inciso 3° de la Constitución Nacional, ¿en qué materias le está prohibido expresamente al Poder Ejecutivo dictar DNU?",
    opciones: [
      "Materia penal, tributaria, electoral o de régimen de partidos políticos.",
      "Materia de compras de suministros de oficina.",
      "Materia de fijación de horarios de atención al público.",
      "Materia de protocolización de actos conmemorativos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional, Art. 99 inc. 3°: '...no regularan normas que regulen materia penal, tributaria, electoral o de régimen de los partidos políticos'.",
    puntos_base: 25
  },
  {
    id: "con-m-03",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Conforme al artículo 43 de la CN, ¿quiénes poseen legitimación expresa para interponer amparo ambiental o relativo a derechos de incidencia colectiva?",
    opciones: [
      "El afectado, el Defensor del Pueblo y las asociaciones registradas que propendan a esos fines.",
      "Únicamente el Fiscal General de la Nación de forma personal.",
      "Exclusivamente los senadores nacionales del distrito afectado.",
      "Cualquier ciudadano extranjero sin residencia en el país."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional, Art. 43 párrafo 3°: 'Podrán interponer esta acción el afectado, el defensor del pueblo y las asociaciones que propendan a esos fines, registradas conforme a la ley...'.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Precedentes CSJN y control de constitucionalidad de oficio)
  {
    id: "con-d-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "Conforme a la doctrina sentada por la CSJN en el precedente 'Rodríguez Pereyra' (2012), ¿cuál es el criterio respecto al control de constitucionalidad de oficio?",
    opciones: [
      "Los jueces tienen la facultad y el deber de efectuar el control de constitucionalidad de oficio sin violar la división de poderes ni la defensa en juicio.",
      "El control de oficio está prohibido por vulnerar la división de poderes, requiriéndose siempre petición formal de parte.",
      "Solo la Corte Suprema puede ejercer el control de oficio, estando vedado a jueces inferiores.",
      "El control de oficio solo procede si la norma impugnada es un reglamento municipal menor."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 335:2333 ('Rodríguez Pereyra', 2012): Los jueces deben ejercer de oficio el control de constitucionalidad en el marco de sus competencias.",
    puntos_base: 50
  },
  {
    id: "con-d-02",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "En la doctrina del Recurso Extraordinario Federal por Arbitrariedad de Sentencia (Art. 14 Ley 48), ¿cuándo se configura una sentencia arbitraria según la CSJN?",
    opciones: [
      "Cuando la resolución padece de un vicio grave en su fundamentación legal o fáctica que la descalifica como acto judicial válido.",
      "Cada vez que el tribunal de alzada revoca el fallo de primera instancia.",
      "Únicamente si la sentencia impone una condena en costas por el orden causatorio.",
      "Cuando la demanda civil es rechazada por falta de prueba pericial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina de la CSJN desde Fallos 'Rey c/ Rocha' (1909): La arbitrariedad atiende a fallos que carecen de fundamentación razonada con sustento en la ley aplicable.",
    puntos_base: 50
  },

  // =========================================================================
  // --- 4. DERECHO ADMINISTRATIVO ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "adm-f-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "¿Ante qué órgano u organismo del Estado se tramitan los procedimientos administrativos regulados por la Ley 19.549?",
    opciones: [
      "Ante los órganos de la Administración Pública (Poder Ejecutivo y entes descentralizados).",
      "Ante una asociación privada de filatelia local.",
      "Ante un club de fútbol de división regional.",
      "Ante un estudio de grabación musical privado."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Nacional de Procedimientos Administrativos N° 19.549, Art. 1°: Regula los procedimientos ante la Administración Pública nacional.",
    puntos_base: 10
  },
  {
    id: "adm-f-02",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 1° inciso c) de la Ley 19.549, ¿qué principio protege al administrado permitiendo subsanar defectos formales no esenciales?",
    opciones: [
      "Principio de Informalismo en favor del administrado.",
      "Principio de formalismo estricto e insubsanable.",
      "Principio de rechazo automático sin recurso.",
      "Principio de caducidad perentoria en 24 horas."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 1° inc. c: 'Informalismo. Excusación de la inobservancia de exigencias formales no esenciales, que puedan ser cumplidas posteriormente...'.",
    puntos_base: 10
  },

  // MEDIAS (Elementos del acto y recursos)
  {
    id: "adm-m-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Según el artículo 7° de la Ley 19.549, ¿cuál de los siguientes es un requisito esencial del acto administrativo?",
    opciones: [
      "La motivación del acto, expresando las razones de hecho y de derecho.",
      "El visado previo del tribunal arbitral privado.",
      "La consulta popular obligatoria antes de la firma.",
      "El certificado notarizado de firma en escribanía."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 7° inc. e: 'Motivación. Deberá ser motivado, expresándose en forma concreta las razones que inducen a emitir el acto...'.",
    puntos_base: 25
  },
  {
    id: "adm-m-02",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Conforme al Decreto 1759/72 (T.O. 2017), ¿cuál es el plazo para interponer el Recurso de Reconsideración contra un acto administrativo definitivo?",
    opciones: [
      "Diez (10) días hábiles administrativos.",
      "Cincuenta (50) días corridos.",
      "Un (1) día hábil judicial.",
      "Seis (6) meses ininterrumpidos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto 1759/72, Art. 84: 'El recurso de reconsideración deberá interponerse dentro de los diez (10) días de notificado el acto...'.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Revocación, lesividad y ejecutoriedad)
  {
    id: "adm-d-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "Conforme al artículo 17 de la Ley 19.549, si un acto administrativo firme padece de una nulidad absoluta e insanable, ¿cuál es la facultad de la Administración en sede administrativa?",
    opciones: [
      "Debe revocarlo o sustituirlo de oficio en sede administrativa por razones de ilegitimidad.",
      "Está impedida de revocarlo de oficio debiendo promover acción de lesividad judicial.",
      "Solo puede suspenderlo temporalmente por noventa días.",
      "Queda ratificado por el mero transcurso del tiempo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 17: 'El acto administrativo afectado de nulidad absoluta se considera irregular y debe ser revocado o sustituido por razones de ilegitimidad aún en sede administrativa...'.",
    puntos_base: 50
  },
  {
    id: "adm-d-02",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "Según el artículo 18 de la LNPA, si un acto administrativo es regular y confirió derechos subjetivos que se están cumpliendo, ¿puede la Administración revocarlo en sede administrativa?",
    opciones: [
      "No, salvo que el derecho se hubiere otorgado expresamente a título precario o se trate de revocar por razones de oportunidad, mérito o conveniencia indemnizando al afectado.",
      "Sí, la Administración puede revocar de oficio cualquier acto regular sin indemnizar jamás.",
      "Sí, pero únicamente si el administrado no registra domicilio en la Capital Federal.",
      "No, la revocación por oportunidad está vedada en todos los casos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 18: 'El acto administrativo regular, del que hubieren nacido derechos subjetivos en favor de los administrados, no puede ser revocado, modificado o sustituido en sede administrativa una vez notificado...'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- 5. DERECHO PROVINCIAL BA ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "pba-f-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "¿Cuál es la capital oficial de la Provincia de Buenos Aires según la legislación bonaerense?",
    opciones: [
      "La ciudad de La Plata.",
      "La ciudad de Madrid.",
      "La ciudad de Tokio.",
      "La ciudad de Nueva York."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Provincial N° 1.469 de 1882 y Constitución de PBA: La Plata es la capital oficial de la Provincia de Buenos Aires.",
    puntos_base: 10
  },
  {
    id: "pba-f-02",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Según el artículo 124 de la Constitución de la Provincia de Buenos Aires, ¿cuántos años dura el mandato del Gobernador y Vicegobernador?",
    opciones: [
      "Cuatro (4) años.",
      "Ochenta (80) años.",
      "Tres días hábiles.",
      "Veinticinco años sin reelección."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Pcia. de Bs. As., Art. 124: 'El gobernador y el vicegobernador permanecen cuatro años en el ejercicio de sus funciones...'.",
    puntos_base: 10
  },

  // MEDIAS (Legislatura y órganos de control)
  {
    id: "pba-m-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "De conformidad con el artículo 84 de la Constitución de PBA, ¿cuál es el período para las sesiones ordinarias de la Legislatura provincial?",
    opciones: [
      "Del 1° de marzo al 30 de noviembre de cada año.",
      "Un solo fin de semana en diciembre.",
      "Del 1° al 5 de enero exclusivamente.",
      "Todo el año sin receso parlamentario."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de PBA, Art. 84: 'Las Cámaras abrirán sus sesiones ordinarias automáticamente el primer día de marzo de cada año y las cerrarán el treinta de noviembre'.",
    puntos_base: 25
  },
  {
    id: "pba-m-02",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "Según el artículo 159 de la Constitución bonaerense, ¿qué órgano tiene a su cargo el examen de las cuentas de percepción e inversión de las rentas públicas provinciales y municipales?",
    opciones: [
      "El Tribunal de Cuentas de la Provincia.",
      "El Registro de la Propiedad Inmueble.",
      "El Colegio de Escribanos bonaerense.",
      "La Inspección General de Justicia Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de PBA, Art. 159: 'Habrá un Tribunal de Cuentas... con jurisdicción en toda la Provincia... para examinar las cuentas de percepción e inversión de las rentas públicas...'.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Jurado de Enjuiciamiento y Amparo Bonaerense)
  {
    id: "pba-d-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "De acuerdo con el artículo 182 de la Constitución de PBA y la Ley 13.661, ¿quién preside el Jurado de Enjuiciamiento de Magistrados bonaerense?",
    opciones: [
      "El Presidente de la Suprema Corte de Justicia de la Provincia.",
      "El Ministro de Economía provincial.",
      "El Decano de Derecho de la UBA.",
      "El Intendente municipal sede del tribunal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de PBA, Art. 182 y Ley 13.661: El Jurado de Enjuiciamiento es presidido legalmente por el Presidente de la Suprema Corte de Justicia provincial.",
    puntos_base: 50
  },
  {
    id: "pba-d-02",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "Según el artículo 20 inciso 2° de la Constitución de la Provincia de Buenos Aires, ¿ante qué jueces se puede interponer la acción individual de amparo en PBA?",
    opciones: [
      "Ante cualquier juez o tribunal de primera instancia de la jurisdicción donde el hecho se produzca o tenga efectos.",
      "Exclusivamente ante el Presidente de la Suprema Corte de Justicia en sesión plenaria.",
      "Únicamente ante la Cámara Federal de Apelaciones de La Plata.",
      "Ante los Tribunales de Faltas Municipales en primera opción."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de PBA, Art. 20 inc. 2°: 'La garantía del Amparo podrá ser ejercida por el afectado... ante cualquier juez de primera instancia del lugar donde se produzca o produzca efectos la lesión...'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- 6. DERECHO MUNICIPAL Y LOCAL LA PLATA ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "lp-f-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "¿En qué provincia argentina se encuentra ubicado el Partido y Municipio de La Plata?",
    opciones: [
      "En la Provincia de Buenos Aires.",
      "En la Provincia de Jujuy.",
      "En el Estado de California.",
      "En la Provincia de Mendoza."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley 6769/58 (Ley Orgánica de las Municipalidades): La Plata es el municipio cabecera del Partido de La Plata en PBA.",
    puntos_base: 10
  },
  {
    id: "lp-f-02",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "¿En qué fecha de 1882 se colocó la piedra fundamental y se celebró la fundación formal de la ciudad de La Plata?",
    opciones: [
      "El 19 de noviembre de 1882.",
      "El 25 de diciembre de 1999.",
      "El 1° de enero del año 2000.",
      "El 9 de julio del año 1816."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia Oficial de La Plata: La ciudad de La Plata fue fundada formalmente el 19 de noviembre de 1882 por el gobernador Dardo Rocha.",
    puntos_base: 10
  },

  // MEDIAS (Ley Orgánica de las Municipalidades y Concejo Deliberante)
  {
    id: "lp-m-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Conforme al Decreto-Ley 6769/58 (Ley Orgánica de las Municipalidades de PBA), ¿cuál es el órgano encargado de sancionar Ordenanzas locales?",
    opciones: [
      "El Concejo Deliberante.",
      "El centro de estudiantes universitarios.",
      "El club de remo municipal.",
      "La comisaría de policía de la zona."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley 6769/58, Art. 68 inc. 1°: Corresponde al Concejo Deliberante la sanción de las Ordenanzas y Resoluciones del Municipio.",
    puntos_base: 25
  },
  {
    id: "lp-m-02",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "¿Mediante qué norma legal provincial de 1882 se dispuso la creación y fundación de la ciudad de La Plata como Capital bonaerense?",
    opciones: [
      "Ley Provincial N° 1.469 de 1882.",
      "Decreto-Ley N° 6.769 de 1958.",
      "Ley N° 5.177 de ejercicio profesional.",
      "Ordenanza General N° 267 de tránsito."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Provincial N° 1.469 promulgada el 1° de mayo de 1882 por el gobernador Dardo Rocha para la fundación de La Plata.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Veto, insistenting y justicia de faltas)
  {
    id: "lp-d-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "¿Quién fue el ingeniero y agrimensor encargado del diseño técnico de la traza urbanística original, diagonales y plazas de La Plata en 1882?",
    opciones: [
      "Ingeniero Pedro Benoit.",
      "Arquitecto Francisco Salamone.",
      "Doctor Joaquín V. González.",
      "Ingeniero Carlos Thays."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la Ciudad de La Plata: La traza y planos de la nueva capital fueron dirigidos técnicamente por el Ing. Pedro Benoit.",
    puntos_base: 50
  },
  {
    id: "lp-d-02",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "Según la Ley Orgánica de las Municipalidades (Decreto-Ley 6769/58 Art. 108), si el Intendente veta una Ordenanza sancionada por el Concejo, ¿con qué mayoría puede insistir el Concejo Deliberante para promulgarla obligatoriamente?",
    opciones: [
      "Con el voto favorable de los dos tercios (2/3) del total de los miembros del Concejo.",
      "Con simple mayoría de los presentes en segunda votación.",
      "Únicamente con el consentimiento previo de la Suprema Corte Provincial.",
      "Con tres votos afirmativos en reunión de comisión especial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley 6769/58, Art. 108 inc. 2°: 'Vetada una Ordenanza por el Departamento Ejecutivo, volverá al Concejo... Si éste insistiera en su sanción por dos tercios de votos del total de sus miembros, quedará convertida en Ordenanza...'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- 7. UNLP Y JURSOC ---
  // =========================================================================
  
  // FÁCILES (Respuestas obvias / Distractores disparatados)
  {
    id: "unlp-f-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿En qué ciudad se encuentra ubicada la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP?",
    opciones: [
      "En la ciudad de La Plata.",
      "En la ciudad de París.",
      "En la ciudad de Londres.",
      "En la ciudad de Roma."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP: La Facultad de Ciencias Jurídicas y Sociales (Jursoc) tiene su sede histórica en el Edificio de la Reforma en La Plata.",
    puntos_base: 10
  },
  {
    id: "unlp-f-02",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿Qué principio histórico trascendental de la Reforma de 1918 se encuentra plenamente vigente en el Estatuto de la UNLP?",
    opciones: [
      "El Cogobierno Universitario Tripartito y la Autonomía Universitaria.",
      "El cobro obligatorio de cuotas mensuales a los estudiantes de grado.",
      "La designación a dedo de autoridades por el Poder Ejecutivo.",
      "La supresión del derecho a examen final."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP y Manifiesto Liminar de 1918: La UNLP se organiza bajo los principios de cogobierno y autonomía universitaria.",
    puntos_base: 10
  },

  // MEDIAS (Estatuto UNLP y gobierno de facultad)
  {
    id: "unlp-m-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "Según el artículo 11 del Estatuto de la UNLP, ¿cuál es el órgano máximo y supremo de gobierno de la Universidad Nacional de La Plata?",
    opciones: [
      "La Asamblea Universitaria.",
      "El tribunal de faltas comunal.",
      "La cámara de comercio de la región.",
      "El centro de graduados de otra institución."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 11: 'La Asamblea Universitaria es el órgano supremo de la Universidad'.",
    puntos_base: 25
  },
  {
    id: "unlp-m-02",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "De acuerdo con el Estatuto de la UNLP, ¿cuántos años dura el mandato del Decano o Decana de la Facultad de Ciencias Jurídicas y Sociales?",
    opciones: [
      "Cuatro (4) años de ejercicio.",
      "Veinticinco (25) años ininterrumpidos.",
      "Dos meses de verano.",
      "Diez años sin reelección."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 47: 'El Decano/a dura cuatro años en sus funciones...'.",
    puntos_base: 25
  },

  // DIFÍCILES / EXPERTO (Nacionalización y atribuciones estatutarias)
  {
    id: "unlp-d-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "¿Mediante qué norma legal nacional impulsada por Joaquín V. González se otorgó el carácter definitivo de Universidad Nacional a la UNLP en 1905?",
    opciones: [
      "Ley Nacional N° 4.699 de 1905.",
      "Ley Avellaneda N° 1.597 de 1885.",
      "Ley de Educación Superior N° 24.521.",
      "Decreto Nacional N° 1.010 de 1949."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la UNLP: La Ley Nacional N° 4.699 nacionalizó la Universidad Provincial de La Plata tras el convenio de Joaquín V. González y el gobernador Marcelino Ugarte.",
    puntos_base: 50
  },
  {
    id: "unlp-d-02",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "Según el Estatuto de la UNLP, ¿a qué órgano le corresponde en exclusiva la aprobación final de la creación de nuevas carreras de grado y modificaciones de planes de estudio a propuesta de las Facultades?",
    opciones: [
      "Al Consejo Superior de la Universidad Nacional de La Plata.",
      "Al Ministerio de Economía de la Provincia de Buenos Aires.",
      "A la Secretaría de Control Urbano de la Municipalidad.",
      "Al Colegio de Abogados de la Provincia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 34: Es atribución del Consejo Superior aprobar la creación o modificación de planes de estudio de las distintas Facultades.",
    puntos_base: 50
  },

  // =========================================================================
  // --- LOTE DERECHO PENAL ARGENTINO (Nuevas Preguntas Masivas) ---
  // =========================================================================
  {
    id: "pen-f-04",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "¿Cuál es la regla general del artículo 2 del Código Penal Argentino ante la sanción de una ley penal posterior más benigna?",
    opciones: [
      "Se aplicará siempre la ley más benigna, y si durante la condena se dictare una ley más benigna, la pena se limitará a la establecida por esa ley.",
      "Se aplicará incondicionalmente la ley vigente al momento de la comisión del hecho, prohibiendo la retroactividad.",
      "La ley más benigna solo se aplicará si el proceso no cuenta con imputación formal del Ministerio Público Fiscal.",
      "Se aplicará la ley posterior únicamente si el querellante o la víctima prestan conformidad en audiencia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 2: 'Si la ley vigente al tiempo de cometerse el delito fuere distinta de la que exista al pronunciarse el fallo o en el tiempo intermedio, se aplicará siempre la más benigna'.",
    puntos_base: 10
  },
  {
    id: "pen-f-05",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 42 del Código Penal Argentino, ¿qué requisito define a la tentativa punible?",
    opciones: [
      "El comienzo de ejecución de un delito determinado con el fin de cometerlo, sin llegar a la consumación por circunstancias ajenas a la voluntad del agente.",
      "La manifestación de la resolución criminal expresada únicamente mediante actos preparatorios previos.",
      "La consumación formal de la conducta típica sin que se produzca el resultado material perjudicial esperado.",
      "La producción de una lesión leve a un bien jurídico distinto del perseguido originalmente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 42.",
    puntos_base: 10
  },
  {
    id: "pen-f-06",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Según el artículo 43 del Código Penal Argentino, ¿cuál es la consecuencia jurídica para el autor de una tentativa que desiste voluntariamente del delito?",
    opciones: [
      "Queda exento de pena por la tentativa, sin perjuicio de la responsabilidad por los actos ya ejecutados si constituyen delito por sí mismos.",
      "Se le reduce la pena de la tentativa a la mitad de la escala fijada para el delito consumado.",
      "Queda sujeto a la aplicación obligatoria de una medida de seguridad no privativa de la libertad.",
      "Se le concede automáticamente la suspensión del juicio a prueba sin cumplir otros requisitos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 43.",
    puntos_base: 10
  },
  {
    id: "pen-f-07",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "¿Cuáles son los tres requisitos exigidos por el artículo 34 inciso 6º del Código Penal Argentino para configurar la legítima defensa propia?",
    opciones: [
      "Agresión ilegítima, necesidad racional del medio empleado para impedirla o repelerla, y falta de provocación suficiente por parte del que se defiende.",
      "Agresión ilegítima, proporcionalidad matemática exacta de los medios empleados e intimación previa fehaciente.",
      "Provocación previa atenuada, uso de fuerza física no letal y ratificación de la denuncia en sede judicial.",
      "Peligro inminente, intervención policial de apoyo y falta de intención dolo-eventual."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 34 inc. 6º.",
    puntos_base: 10
  },
  {
    id: "pen-f-08",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Conforme al artículo 35 del Código Penal Argentino, ¿cómo se sanciona al sujeto que excede los límites en las causales de justificación?",
    opciones: [
      "Con la pena fijada para el delito por culpa o imprudencia.",
      "Con la pena del delito doloso reducida a la mitad en su mínimo y máximo legal.",
      "Queda totalmente exento de pena por concurrir una causa de inculpabilidad absoluta.",
      "Con pena de inhabilitación especial obligatoria sin sanción privativa de la libertad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 35.",
    puntos_base: 10
  },
  {
    id: "pen-f-09",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Conforme al artículo 44 del Código Penal Argentino, ¿cómo se disminuye la pena en la tentativa para delitos con pena temporal?",
    opciones: [
      "La pena se disminuirá de un tercio a la mitad respecto de la fijada para el delito consumado.",
      "La pena se disminuye a la mitad exacta de su mínimo y de su máximo en todos los casos.",
      "La pena es la misma que la del delito consumado si el autor estuvo a punto de lograr el resultado.",
      "Se aplica pena de multa sustitutiva fijada prudencialmente por el juzgador."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 44.",
    puntos_base: 10
  },
  {
    id: "pen-m-04",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Conforme al artículo 45 del Código Penal Argentino, ¿qué participantes sufren la misma pena asignada por la ley a los autores?",
    opciones: [
      "Los que toman parte en la ejecución y los que prestan al autor un auxilio o cooperación sin los cuales el hecho no habría podido cometerse.",
      "Todos los cómplices primarios, secundarios y los encubridores con promesa posterior a la consumación.",
      "Únicamente los ejecutores materiales de la acción típica, quedando exentos los instigadores.",
      "Quienes prestaren cualquier auxilio secundario posterior al hecho sin acuerdo previo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 45.",
    puntos_base: 20
  },
  {
    id: "pen-m-05",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "En la doctrina penal argentina mayoritaria (Zaffaroni, Bacigalupo), ¿qué estrato de la teoría del delito elimina el error de prohibición invencible?",
    opciones: [
      "La culpabilidad, impidiendo que la conducta típica y antijurídica sea reprochada personalmente a su autor.",
      "La tipicidad, descartando el dolo penal y tornando la conducta en un hecho atípico.",
      "La antijuridicidad, actuando como una causa de justificación inominada de carácter objetivo.",
      "La punibilidad, convirtiendo la pena en una eximente personal facultativa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina penal argentina mayoritaria y Art. 34 inc. 1 del Código Penal.",
    puntos_base: 20
  },
  {
    id: "pen-m-06",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Según el artículo 34 inciso 1º del Código Penal Argentino, no es punible quien en el momento del hecho no haya podido comprender la criminalidad del acto por:",
    opciones: [
      "Insuficiencia de sus facultades, alteración morbosa de las mismas, o estado de inconsciencia.",
      "Un estado de ebriedad voluntaria que no haya privado totalmente de la lucidez mental.",
      "El desconocimiento o ignorancia de la publicación formal de la norma en el Boletín Oficial.",
      "Una perturbación emocional severa provocada por discusiones de pareja previas."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 34 inc. 1º.",
    puntos_base: 20
  },
  {
    id: "pen-m-07",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Tras la reforma de la Ley 26.791 al artículo 80 inciso 1º del Código Penal Argentino, ¿cuál es el alcance de la agravante del homicidio?",
    opciones: [
      "Comprende al que matare a su ascendiente, descendiente, cónyuge, ex cónyuge, o a la persona con quien mantiene o ha mantenido una relación de pareja, mediare o no convivencia.",
      "Aplica exclusivamente a cónyuges legalmente casados en régimen de comunidad de bienes y convivencia efectiva.",
      "Comprende únicamente a los parientes consanguíneos hasta el segundo grado en línea colateral.",
      "Exige de manera indispensable el cohabitar en el mismo domicilio al momento de la agresión."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 80 inc. 1º (según Ley 26.791).",
    puntos_base: 20
  },
  {
    id: "pen-m-08",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Conforme al artículo 81 inciso 1º apartado 'a' del Código Penal Argentino, ¿qué circunstancia exige la ley para atenuar la pena en el homicidio por emoción violenta?",
    opciones: [
      "Que el autor se encuentre en estado de emoción violenta y que las circunstancias que la provocaron la hicieren excusable.",
      "Que el estado pasional haya sido provocado de manera deliberada por el propio sujeto activo.",
      "Que la emoción violenta se funde en celos desmedidos o sentimientos de despecho.",
      "Que medie la previa conformidad de los derechohabientes de la víctima."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 81 inc. 1º ap. a.",
    puntos_base: 20
  },
  {
    id: "pen-m-09",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "¿Cuál es la diferencia medular en el Código Penal Argentino entre el delito de Hurto (Art. 162) y el delito de Robo (Art. 164)?",
    opciones: [
      "El robo requiere que la apoderación ilegítima se cometa con fuerza en las cosas o violencia física en las personas, mientras que el hurto carece de ellas.",
      "El hurto exige la participación de dos o más personas, mientras que el robo es unipersonal.",
      "El robo recae sobre bienes inmuebles y el hurto sobre bienes muebles ajenos.",
      "El hurto se persigue por acción privada y el robo por acción pública a instancia de parte."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Arts. 162 y 164.",
    puntos_base: 20
  },
  {
    id: "pen-m-10",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 172 del Código Penal Argentino, ¿cuál es el elemento ardidoso indispensable que caracteriza al delito de estafa?",
    opciones: [
      "Un ardid o engaño que induce en error a la víctima, determinándola a realizar una disposición patrimonial perjudicial.",
      "La fuerza física desplegada sobre las cosas para lograr la transferencia de la posesión.",
      "La retención ilegítima de una cosa mueble recibida con la obligación legal de restituirla.",
      "El daño físico directo ocasionado sobre bienes materiales ajenos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 172.",
    puntos_base: 20
  },
  {
    id: "pen-m-11",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Según el artículo 26 del Código Penal Argentino, ¿en qué casos los tribunales pueden disponer la condena de ejecución condicional?",
    opciones: [
      "En los casos de primera condena a pena de prisión que no exceda de tres años.",
      "En condenas a pena de prisión de hasta cinco años cuando el imputado repare el daño.",
      "En cualquier delito doloso contra la propiedad si el delincuente carece de antecedentes.",
      "Únicamente cuando el condenado tenga más de 70 años al momento del fallo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 26.",
    puntos_base: 20
  },
  {
    id: "pen-m-12",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "Conforme al artículo 76 bis del Código Penal Argentino, ¿cuándo procede la suspensión del juicio a prueba (probation)?",
    opciones: [
      "En delitos de acción pública reprimidos con pena de prisión cuyo máximo no exceda de tres años, o cuando las circunstancias permitieren condena condicional.",
      "Exclusivamente para delitos culposos de tránsito cuya inhabilitación no supere un año.",
      "En cualquier delito grave independientemente de la pena siempre que se pague fianza real.",
      "En delitos cometidos por funcionarios públicos en el ejercicio de sus funciones."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 76 bis.",
    puntos_base: 20
  },
  {
    id: "pen-d-04",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "En el fallo de la CSJN 'Gramajo' (2006), ¿qué pronunciamiento emitió la Corte respecto de la medida de seguridad del artículo 52 del Código Penal?",
    opciones: [
      "Declaró su inconstitucionalidad por violar el principio de culpabilidad por el hecho (derecho penal del acto) y proporcionalidad, al castigar la peligrosidad.",
      "Reafirmó su constitucionalidad considerando que la peligrosidad del imputado justifica la custodia indeterminada del Estado.",
      "Estableció que es únicamente aplicable a delitos contra la propiedad cometidos con armas de fuego.",
      "Dispuso su sustitución por inhabilitación perpetua para ejercer cargos públicos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 329:3680 ('Gramajo, Marcelo Eduardo s/ causa N° 1573', 2006).",
    puntos_base: 30
  },
  {
    id: "pen-d-05",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "Conforme a la doctrina de la CSJN sentada en el fallo 'Fiorentino' (1984), ¿qué requisitos debe reunir el consentimiento para validar la requisa domiciliaria sin orden judicial?",
    opciones: [
      "Debe ser expreso, libre, previo a la entrada de la prevención y prestado por persona capaz, exento de coerción o intimidación.",
      "Es suficiente que el morador no oponga resistencia física ostensible al momento del ingreso policial.",
      "Puede ser prestado por cualquier persona presente en la vivienda, incluidos menores.",
      "Carece de toda validez legal, por ser la orden judicial escrita un requisito insubsanable."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 306:1752 ('Fiorentino, Diego E.'), Art. 18 de la Constitución Nacional.",
    puntos_base: 30
  },
  {
    id: "pen-d-06",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "En la doctrina penal argentina (Zaffaroni, Soler), ¿cuál es el criterio subjetivo delimitador entre el Dolo Eventual y la Culpa Consciente?",
    opciones: [
      "En el dolo eventual el sujeto se representa la posibilidad del resultado típico y lo acepta o le es indiferente; en la culpa consciente confía en que no ocurrirá.",
      "En el dolo eventual la representación del peligro es remota, mientras que en la culpa consciente es cierta.",
      "En la culpa consciente el autor persigue intencionadamente el resultado pero con medios inidóneos.",
      "En el dolo eventual el autor actúa sin representación previa del riesgo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina penal mayoritaria argentina y Cámara Federal de Casación Penal.",
    puntos_base: 30
  },
  {
    id: "pen-d-07",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "Con la Ley 27.347 (Art. 84 bis 2º párrafo del CP), ¿cuál de los siguientes factores agrava la pena del homicidio culposo de tránsito a prisión de 3 a 6 años?",
    opciones: [
      "Darse a la fuga, no socorrer a la víctima, estar bajo efectos del alcohol o estupefacientes, o conducir con exceso de velocidad mayor a 30 km/h sobre la máxima.",
      "Que el vehículo no posea la Verificación Técnica Vehicular (VTV) aprobada.",
      "Que el hecho ocurra en una avenida pavimentada en horario nocturno o feriados.",
      "Que el conductor registre multas de tránsito impagas en los 12 meses previos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Art. 84 bis, 2° párrafo (Ley 27.347).",
    puntos_base: 30
  },
  {
    id: "pen-d-08",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "En los delitos de acción privada (Art. 73 CP), ¿qué efecto produce sobre la acción penal el desistimiento expreso formulado por el querellante particular?",
    opciones: [
      "Extingue la acción penal de manera irreversible conforme al artículo 59 inciso 4º del Código Penal.",
      "Convierte la acción privada en acción pública ejercida por el Ministerio Público Fiscal.",
      "Permite la continuidad de la causa mediante la designación de un Defensor Oficial.",
      "Suspende la prescripción de la acción penal por tres años."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación, Arts. 59 inc. 4º y 73.",
    puntos_base: 30
  }
,
  // --- LOTE MASIVO TODAS LAS MATERIAS (Nuevas Preguntas) ---
  {
    id: "civ-f-05",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "Según el artículo 23 del Código Civil y Comercial de la Nación, ¿quiénes pueden ejercer por sí mismos sus derechos en el ordenamiento legal argentino?",
    opciones: [
          "Toda persona humana, excepto las incapacidades o limitaciones expresamente previstas en la ley o en sentencia judicial.",
          "Únicamente los ciudadanos mayores de 21 años emancipados comercialmente.",
          "Solo las personas que posean título universitario o inscripción ante la AFIP/ARBA.",
          "Las personas jurídicas privadas exclusivamente a través de apoderados letrados."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación (CCyCN), Art. 23: 'Toda persona humana puede ejercer por sí misma sus derechos, excepto las limitaciones expresamente previstas...'.",
    puntos_base: 10
  },
  {
    id: "civ-f-06",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "Conforme al artículo 27 del CCyCN, ¿cuál es el efecto jurídico del matrimonio celebrado por una persona menor de edad?",
    opciones: [
          "Emancipa a la persona menor de edad de pleno derecho, liberándola de la responsabilidad parental.",
          "Otorga capacidad absoluta sin ninguna restricción para donar bienes recibidos a título gratuito.",
          "Mantiene la patria potestad de sus progenitores de forma inalterada hasta los 18 años.",
          "Anula automáticamente las obligaciones contractuales contraídas antes de los 16 años."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 27: 'La celebración del matrimonio antes de los dieciocho años emancipa a la persona menor de edad...'.",
    puntos_base: 10
  },
  {
    id: "civ-f-07",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "Según el artículo 51 del CCyCN, ¿qué principio inviolable rige sobre la persona humana?",
    opciones: [
          "La persona humana es inviolable y en cualquier circunstancia tiene derecho al reconocimiento y respeto de su dignidad.",
          "La inviolabilidad de la persona se adquiere recién con la obtención del DNI definitivo.",
          "Los derechos personalísimos pueden renunciarse mediante acuerdo de partes en instrumento público.",
          "La dignidad humana solo se tutela penalmente ante delitos dolosos de acción pública."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 51.",
    puntos_base: 10
  },
  {
    id: "civ-f-08",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 765 del CCyCN, ¿cómo se clasifica la obligación si el deudor se obligó a entregar una moneda que no sea de curso legal en la República?",
    opciones: [
          "La obligación debe considerarse como de dar cantidades de cosas y el deudor puede liberarse dando el equivalente en moneda de curso legal.",
          "Es una obligación nula de nulidad absoluta por ilicitud del objeto contractual.",
          "Es una obligación de hacer sujeta a autorización del Banco Central de la República Argentina.",
          "Se transforma de pleno derecho en una obligación natural no exigible judicialmente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 765.",
    puntos_base: 10
  },
  {
    id: "civ-f-09",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "Conforme al artículo 971 del CCyCN, ¿cómo se concluye un contrato entre partes presentes?",
    opciones: [
          "Con la recepción de la aceptación de una oferta o por la conducta de las partes que sea suficiente para demostrar la existencia de un acuerdo.",
          "Únicamente con la firma de un boleto ante escribano público con certificación de firmas.",
          "Con el pago del anticipo del 50% de la prestación convenida.",
          "Mediante la homologación previa expedida por un tribunal del fuero civil y comercial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 971.",
    puntos_base: 10
  },
  {
    id: "civ-f-10",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 1892 del CCyCN, ¿cuáles son los dos elementos indispensables para la adquisición derivada de un derecho real entre vivos?",
    opciones: [
          "El título suficiente y el modo suficiente (tradición posesoria o inscripción según el bien).",
          "El contrato privado con certificación consular y el recibo de pago total.",
          "La posesión ininterrumpida durante 10 años y la presencia de dos testigos.",
          "El acta notarial de inventario y la registración impositiva previa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1892.",
    puntos_base: 10
  },
  {
    id: "civ-m-05",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Según el artículo 332 del CCyCN, ¿cuándo se configura el vicio del acto jurídico denominado Lesión?",
    opciones: [
          "Cuando una de las partes explota la necesidad, debilidad síquica o inexperiencia de la otra, obteniendo una ventaja patrimonial desproporcionada y sin justificación.",
          "Cuando ambas partes celebran un acto simulado para engañar a terceros acreedores.",
          "Cuando existe un error de cálculo aritmético sobre el valor de mercado de las prestaciones.",
          "Cuando el acto se celebra bajo amenaza de ejercer un derecho legítimo ante la autoridad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 332.",
    puntos_base: 20
  },
  {
    id: "civ-m-06",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Conforme al artículo 334 del CCyCN, ¿quiénes pueden ejercer la acción de simulación ilícita?",
    opciones: [
          "Los terceros cuyos derechos u intereses legítimos son afectados por el acto simulado, y las partes si no obtienen ningún provecho de la ilicitud.",
          "Únicamente los otorgantes del acto mediante la presentación del contradocumento obligatorio.",
          "Exclusivamente el Ministerio Público Fiscal en representación del fisco provincial.",
          "Cualquier ciudadano a través de la acción popular de nulidad patrimonial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 334.",
    puntos_base: 20
  },
  {
    id: "civ-m-07",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 338 del CCyCN, ¿qué remedio jurídico procede contra los actos celebrados por el deudor en fraude a sus acreedores?",
    opciones: [
          "La declaración de inoponibilidad del acto respecto de los acreedores perjudicados.",
          "La nulidad absoluta y la confiscación del bien a favor del Estado Nacional.",
          "La transformación inmediata de la deuda en una obligación solidaria garantizada.",
          "La revocación judicial de la personería jurídica del deudor concursado."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 338.",
    puntos_base: 20
  },
  {
    id: "civ-m-08",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Según el artículo 886 del CCyCN, ¿cuál es la regla general sobre la constitución en mora del deudor en el derecho argentino?",
    opciones: [
          "La mora del deudor se produce por el solo transcurso del tiempo fijado para el cumplimiento de la obligación (mora automática).",
          "Se requiere indispensablemente la interpelación previa mediante carta documento o acta notarial.",
          "Exige el dictado de una providencia judicial de intimar el pago bajo apercibimiento de embargo.",
          "La mora no opera hasta tanto el acreedor no consigne judicialmente su prestación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 886.",
    puntos_base: 20
  },
  {
    id: "civ-m-09",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Conforme al artículo 790 del CCyCN, ¿cuál es la función de la Cláusula Penal?",
    opciones: [
          "Es aquella por la cual una persona, para asegurar el cumplimiento de una obligación, se sujeta a una pena o multa en caso de retardar o de no ejecutar la obligación.",
          "Es una garantía real que otorga un derecho de preferencia sobre el inmueble del deudor.",
          "Es una sanción punitiva penal dispuesta por el juez de garantías ante el incumplimiento.",
          "Es la suma fija no revisable que sustituye siempre el pago de los tributos de sellos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 790.",
    puntos_base: 20
  },
  {
    id: "civ-m-10",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Según el artículo 1088 del CCyCN, ¿cuáles son los requisitos para la resolución implícita (pacto comisorio tácito) de un contrato bilateral?",
    opciones: [
          "Un incumplimiento esencial, que el deudor esté en mora, y que el acreedor lo intime a cumplir en un plazo no menor a 15 días bajo apercibimiento de resolución.",
          "Cualquier falta de pago sin importar su gravedad e intimar por 48 horas hbiles.",
          "Solicitar la mediación obligatoria antes del vencimiento fijado en el contrato.",
          "Acreditar el dolo del deudor mediante sentencia penal firme."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1088.",
    puntos_base: 20
  },
  {
    id: "civ-m-11",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 1033 del CCyCN, ¿quiénes están obligados al saneamiento (garantía por evicción y vicios ocultos)?",
    opciones: [
          "El transmitente de bienes a título oneroso, quien dividió bienes con otros, y sus antecesores si hicieron la transferencia a título oneroso.",
          "Únicamente los martilleros públicos en las subastas judiciales de bienes muebles.",
          "Solo el transmitente a título gratuito en contratos de donación sin cargo.",
          "El Registro de la Propiedad Inmueble que expidió el certificado de dominio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1033.",
    puntos_base: 20
  },
  {
    id: "civ-m-12",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Conforme al artículo 446 del CCyCN, ¿qué régimen patrimonial suplementario se aplica al matrimonio si los contrayentes no optan por el régimen de separación de bienes?",
    opciones: [
          "El régimen de comunidad de ganancias.",
          "El régimen de indivisión forzosa de herencia.",
          "El régimen de administración exclusiva del cónyuge de mayor edad.",
          "El régimen de fideicomiso cónyugal obligatorio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Arts. 446 y 463.",
    puntos_base: 20
  },
  {
    id: "civ-d-04",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "En el artículo 1757 del CCyCN (Responsabilidad por actividades riesgosas o vicio de las cosas), ¿cuáles son las únicas causales que liberan de responsabilidad al dueño o guardián?",
    opciones: [
          "La prueba de la causa ajena (hecho de la víctima, de un tercero por quien no debe responder o caso fortuito), sin que sea suficiente la diligencia o la falta de culpa.",
          "La acreditación de que el dueño actuó con la prudencia de un buen padre de familia.",
          "La falta de intimación previa por carta documento emitida por la víctima.",
          "El pago de las primas del seguro de responsabilidad civil contratado previamente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1757 y 1758.",
    puntos_base: 30
  },
  {
    id: "civ-d-05",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Según el artículo 1753 del CCyCN, ¿cuál es el fundamento y carácter de la responsabilidad del principal por los daños causados por sus dependientes?",
    opciones: [
          "Es una responsabilidad objetiva e inexcusable derivada del ejercicio de las funciones encomendadas o con ocasión de ellas.",
          "Es una responsabilidad subjetiva basada en la culpa in eligendo o in vigilando del empleador.",
          "Es una obligación subsidiaria que requiere la previa insolvencia judicial del dependiente.",
          "Es una responsabilidad limitada exclusivamente al monto del salario mínimo vital y móvil."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1753.",
    puntos_base: 30
  },
  {
    id: "civ-d-06",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Conforme a los artículos 1897 y 1899 del CCyCN, ¿cuál es el plazo de posesión ostensible y continua requerido para la prescripción adquisitiva (usucapión) vicenal de inmuebles sin justo título ni buena fe?",
    opciones: [
          "Veinte (20) años sin que pueda invocarse contra ella la falta o nulidad del título.",
          "Diez (10) años contados desde la inscripción provisoria en el catastro municipal.",
          "Cinco (5) años con el pago del impuesto inmobiliario provincial al día.",
          "Cincuenta (50) años con edificación permanente de vivienda única."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 1899.",
    puntos_base: 30
  },
  {
    id: "civ-d-07",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "De acuerdo con el artículo 2281 del CCyCN, ¿quiénes son considerados indignos de suceder al causante?",
    opciones: [
          "Los autores, cómplices o instigadores de delitos dolosos contra la persona, el honor, la integridad sexual o la libertad del causante, entre otros supuestos taxativos.",
          "Los herederos que no hayan visitado al causante en los seis meses previos a su deceso.",
          "Los descendientes que professen una religión distinta a la del causante.",
          "Los parientes que hayan impugnado la validez de las disposiciones testamentarias."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 2281.",
    puntos_base: 30
  },
  {
    id: "civ-d-08",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Según el artículo 2445 del CCyCN, ¿cuáles son las porciones legítimas indisponibles de los herederos legitimarios en el derecho sucesorio argentino?",
    opciones: [
          "Dos tercios (2/3) para los descendientes, un medio (1/2) para los ascendientes y un medio (1/2) para el cónyuge.",
          "Cuatro quintos (4/5) para los descendientes y tres cuartos (3/4) para ascendientes y cónyuge.",
          "Cien por ciento (100%) sin posibilidad de testar donaciones a terceros.",
          "Un tercio (1/3) para todos los herederos sin distinción de grado o parentesco."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CCyCN, Art. 2445 (Ley 26.994).",
    puntos_base: 30
  },
  {
    id: "con-f-04",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "¿Qué forma de gobierno adopta la Nación Argentina para su gobierno según el artículo 1º de la Constitución Nacional?",
    opciones: [
          "La forma representativa, republicana y federal.",
          "La forma parlamentaria unicameral centralizada.",
          "La forma monárquica constitucional confederada.",
          "La forma directiva colegiada sin división de poderes."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional (CN), Art. 1º.",
    puntos_base: 10
  },
  {
    id: "con-f-05",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Según el artículo 31 de la Constitución Nacional, ¿cuál es la ley suprema de la Nación Argentina?",
    opciones: [
          "La Constitución Nacional, las leyes de la Nación que en su consecuencia se dicten y los tratados con las potencias extranjeras.",
          "Las constituciones provinciales y las decretos reglamentarios del Poder Ejecutivo.",
          "Los fallos plenarios de la Cámara de Casación Penal y la doctrina académica.",
          "Las ordenanzas municipales aprobadas por mayoría calificada."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 31.",
    puntos_base: 10
  },
  {
    id: "con-f-06",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Conforme al artículo 33 de la Constitución Nacional, ¿qué establece la regla sobre las garantías e derechos implícitos?",
    opciones: [
          "Las declaraciones, derechos y garantías enumerados no serán entendidos como negación de otros derechos no enumerados que nacen de la soberanía del pueblo y la forma republicana.",
          "Solo existen los derechos expresamente escritos en la primera parte de la Constitución.",
          "Los derechos no enumerados quedan condicionados a la sanción de una ley del Congreso.",
          "Las garantías implícitas caducan de pleno derecho durante el estado de sitio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 33.",
    puntos_base: 10
  },
  {
    id: "con-f-07",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 14 de la CN, ¿cuál es la libertad garantizada a todos los habitantes respecto de la prensa?",
    opciones: [
          "Publicar sus ideas por la prensa sin censura previa.",
          "Publicar únicamente previo depósito en la Secretaría de Comunicación.",
          "Editar periódicos solo bajo licencia ministerial concedida por plazo fijo.",
          "Publicar ideas condicionadas a la aprobación del Colegio de Periodistas."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 14 y 32.",
    puntos_base: 10
  },
  {
    id: "con-f-08",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Según el artículo 18 de la Constitución Nacional, ¿cuál es la condición requerida para el allanamiento de un domicilio?",
    opciones: [
          "Una orden escrita motivada por juez competente.",
          "El pedido verbal efectuado por la policía en cualquier momento.",
          "La resolución fundada emanada de la Intendencia Municipal.",
          "La solicitud efectuada por el presidente de la junta vecinal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 18.",
    puntos_base: 10
  },
  {
    id: "con-f-09",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Conforme al artículo 19 de la CN, ¿cuál es el célebre principio de reserva que protege la autonomía de la voluntad?",
    opciones: [
          "Las acciones privadas de los hombres que de ningún modo ofendan al orden y a la moral pública, ni perjudiquen a un tercero, están solo reservadas a Dios, y exentas de la autoridad de los magistrados.",
          "Ninguna persona puede comerciar bienes muebles sin autorización de los magistrados.",
          "Las acciones privadas deben ser informadas a la autoridad policial en un registro obligatorio.",
          "El Estado puede intervenir en los actos privados si afectan los ingresos públicos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 19.",
    puntos_base: 10
  },
  {
    id: "con-m-04",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Según el artículo 43 de la Constitución Nacional (incorporado en 1994), ¿cuándo procede la Acción de Amparo?",
    opciones: [
          "Contra todo acto u omisión de autoridades públicas o de particulares que en forma actual o inminente lesione, altere o amenace con arbitrariedad o ilegalidad manifiesta derechos reconocidos por la CN, un tratado o ley.",
          "Únicamente contra resoluciones judiciales definitivas dictadas por tribunales de alzada.",
          "Solo cuando no existan leyes sancionadas por el Congreso que regulen el caso concreto.",
          "Exclusivamente contra actos administrativos emanados del Poder Ejecutivo Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 43, 1° párrafo.",
    puntos_base: 20
  },
  {
    id: "con-m-05",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Conforme al artículo 43 de la CN, ¿qué garantía protege la libertad física o la agravación ilegítima en la forma y condiciones de detención?",
    opciones: [
          "La acción de Hábeas Corpus.",
          "La acción de Hábeas Data.",
          "El juicio político de destitución.",
          "El recurso extraordinario de inconstitucionalidad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 43, 4° párrafo.",
    puntos_base: 20
  },
  {
    id: "con-m-06",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 43 de la CN, ¿para qué sirve la acción de Hábeas Data?",
    opciones: [
          "Para tomar conocimiento de los datos a ella referidos y de su finalidad, que consten en registros o bancos de datos públicos, o los privados destinados a proveer informes.",
          "Para solicitar la quiebra de entidades financieras insolventes.",
          "Para rectificar el domicilio fiscal registrado ante la inspección de justicia.",
          "Para impugnar el resultado de las elecciones de autoridades nacionales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 43, 3° párrafo.",
    puntos_base: 20
  },
  {
    id: "con-m-07",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Tras la reforma de 1994, ¿qué jerarquía poseen los Tratados Internacionales de Derechos Humanos enumerados en el artículo 75 inciso 22 de la CN?",
    opciones: [
          "Tienen jerarquía constitucional, en las condiciones de su vigencia, y no derogan artículo alguno de la primera parte de la Constitución.",
          "Tienen jerarquía inferior a las leyes del Congreso Nacional pero superior a los decretos del Poder Ejecutivo.",
          "Tienen jerarquía suplementaria que requiere ratificación por plebiscito obligatorio.",
          "Son meramente orientativos para la interpretación judicial sin fuerza obligatoria directa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 75 inc. 22.",
    puntos_base: 20
  },
  {
    id: "con-m-08",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Conforme al artículo 99 inciso 3º de la CN, ¿en qué materias le está absolutamente prohibido al Poder Ejecutivo emitir Decretos de Necesidad y Urgencia (DNU)?",
    opciones: [
          "Materia penal, tributaria, electoral o el régimen de los partidos políticos.",
          "Materia de salud pública, seguridad vial y transporte interurbano.",
          "Materia de contrataciones de la administración pública y presupuesto nacional.",
          "Materia de relaciones exteriores y designación de embajadores."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 99 inc. 3º.",
    puntos_base: 20
  },
  {
    id: "con-m-09",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "En el procedimiento de Juicio Político (Arts. 53 y 59 de la CN), ¿qué rol cumple la Cámara de Diputados y la Cámara de Senadores?",
    opciones: [
          "Diputados posee la facultad exclusiva de acusar, y el Senado es el encargado de juzgar en juicio público a los acusados.",
          "El Senado acusa formalmente y la Cámara de Diputados dicta la sentencia definitiva de destitución.",
          "Ambas Cámaras acusan y juzgan en asamblea legislativa conjunta por mayoría simple.",
          "Diputados juzga a los magistrados y el Senado a los funcionarios del Poder Ejecutivo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Arts. 53 y 59.",
    puntos_base: 20
  },
  {
    id: "con-m-10",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Según el artículo 6º de la CN, ¿cuándo el Gobierno federal puede intervenir en el territorio de las provincias?",
    opciones: [
          "Para garaventa la forma republicana de gobierno, o repeler invasiones exteriores, y a requisa de sus autoridades creadas para sostenerlas o restablecerlas.",
          "Siempre que el Poder Ejecutivo Nacional desee reorganizar las finanzas provinciales.",
          "Cuando las leyes provinciales sean distintas a las sancionadas por el Congreso.",
          "Únicamente cuando se produzca el vencimiento del mandato del gobernador sin elecciones."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 6º.",
    puntos_base: 20
  },
  {
    id: "con-m-11",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "De acuerdo con el artículo 76 de la CN, ¿cuál es la regla sobre la delegación legislativa a favor del Poder Ejecutivo?",
    opciones: [
          "Se prohíbe la delegación legislativa en el Poder Ejecutivo, salvo en materias determinadas de administración o de emergencia pública, con plazo fijado para su ejercicio y bases fijadas por el Congreso.",
          "Está permitida de manera ilimitada siempre que el Presidente dicte decretos simples.",
          "Es facultativa del Presidente sin necesidad de autorización del Congreso Nacional.",
          "Requiere la previa conformidad de la Corte Suprema de Justicia de la Nación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 76.",
    puntos_base: 20
  },
  {
    id: "con-d-04",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "Según el artículo 30 de la Constitución Nacional, ¿qué mayoría especial se requiere en el Congreso de la Nación para declarar la necesidad de la reforma constitucional?",
    opciones: [
          "El voto de dos terceras partes (2/3), al menos, de sus miembros.",
          "La mayoría absoluta de los miembros presentes en cada Cámara.",
          "Tres cuartas partes (3/4) de la Cámara de Senadores en exclusiva.",
          "Unanimidad de ambas Cámaras en sesión plenaria conjunta."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 30.",
    puntos_base: 30
  },
  {
    id: "con-d-05",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "En el sistema constitucional argentino, ¿cuál es el modelo de control de constitucionalidad de las leyes y normas?",
    opciones: [
          "Es difuso, en caso concreto y judicial, ejerciendo cualquier juez de cualquier fuero la facultad de declarar la inconstitucionalidad con efectos inter partes.",
          "Es concentrado en un Tribunal Constitucional especial con efectos erga omnes de nulidad.",
          "Es preventivo y llevado a cabo exclusivamente por el Ministerio de Justicia antes de la promulgación.",
          "Es político y ejercido por la Comisión Bicameral Permanente del Congreso Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Jurisprudencia de la CSJN (Fallos: 'Sojo' 1887, 'Elortondo' 1888) y Art. 116 CN.",
    puntos_base: 30
  },
  {
    id: "con-d-06",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "¿Qué doctrina jurídica sentó la CSJN en los emblemáticos fallos 'Siri, Ángel' (1957) y 'Kot, Samuel' (1958)?",
    opciones: [
          "Creó pretorianamente la garantía constitucional del Amparo ante actos de autoridad pública (Siri) y de particulares (Kot), sin necesidad de ley previa que lo reglamentara.",
          "Declaró la invalidez de los decretos de necesidad y urxencia sin control del Congreso.",
          "Estableció que la libertad de prensa no ampara las injurias en redes sociales.",
          "Fijó la prohibición absoluta de la reelección presidencial consecutiva."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 239:459 ('Siri') y Fallos 241:291 ('Kot').",
    puntos_base: 30
  },
  {
    id: "con-d-07",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "Conforme a los artículos 116 y 117 de la CN, ¿en qué casos la Corte Suprema de Justicia de la Nación ejerce su competencia originaria y exclusiva?",
    opciones: [
          "En todos los asuntos concernientes a embajadores, ministros y cónsules extranjeros, y en aquellos en que alguna provincia fuese parte.",
          "En todos los juicios de divorcio vincular y sucesiones entre cónyuges domiciliados en distintas provincias.",
          "En las apelaciones sobre sentencias de tribunales del trabajo en juicios por despido.",
          "En las causas promovidas por la Auditoría General de la Nación por malversación de fondos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Arts. 116 y 117.",
    puntos_base: 30
  },
  {
    id: "con-d-08",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "Durante la vigencia del Estado de Sitio (Art. 23 CN), ¿cuál es la facultad atribuida al Presidente de la Nación respecto de las personas arrestadas?",
    opciones: [
          "Podrá arrestar o trasladar de un punto a otro de la Nación a las personas, si ellas no prefiriesen salir fuera del territorio nacional (derecho de opción).",
          "Podrá imponer penas privativas de la libertad definitivas por decreto simple.",
          "Podrá juzgar y condenar en causa penal sumaria sin intervención de juez.",
          "Podrá despojarlas de su ciudadanía argentina y confiscar sus bienes patrimoniales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CN, Art. 23.",
    puntos_base: 30
  },
  {
    id: "adm-f-04",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "En el marco de la Ley Nacional de Procedimiento Administrativo (N° 19.549), ¿qué es el Acto Administrativo?",
    opciones: [
          "Toda declaración unilateral emitida en ejercicio de la función administrativa que produce efectos jurídicos individuales de forma directa.",
          "El contrato celebrado libremente entre dos personas privadas comerciales.",
          "La sentencia dictada por un juez en el fuero penal ordinario.",
          "La ley formal sancionada por las comisiones del Congreso Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 7.",
    puntos_base: 10
  },
  {
    id: "adm-f-05",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "Conforme al artículo 12 de la Ley N° 19.549, ¿cuál es la presunción que ostenta el acto administrativo regular?",
    opciones: [
          "Presunción de legitimidad y ejecutividad, obligando a su cumplimiento desde la notificación salvo suspensión dispuesta expresamente.",
          "Presunción de ilegalidad hasta tanto el administrado no lo ratifique.",
          "Efecto suspensivo automático ante la sola interposición de un reclamo verbal.",
          "Carece de toda fuerza ejecutiva sin previa orden judicial de ejecución."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 12.",
    puntos_base: 10
  },
  {
    id: "adm-f-06",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "¿Cuáles son los elementos esenciales del acto administrativo expresados en el artículo 7º de la Ley N° 19.549?",
    opciones: [
          "Competencia, causa, objeto, procedimiento, motivación y finalidad.",
          "Precio, seña, plazo, firma notarial y sellado bancario.",
          "Dolo, culpa, fuerza en las cosas y consentimiento bilateral.",
          "Registro de propiedad, catastro municipal y testimonio notarial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 7º.",
    puntos_base: 10
  },
  {
    id: "adm-f-07",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "Según el artículo 1º inciso f) de la LNPA (Ley 19.549), ¿qué comprende el debido proceso adjetivo para los administrados?",
    opciones: [
          "El derecho a ser oído, el derecho a ofrecer y producir pruebas, y el derecho a una decisión fundada.",
          "El derecho a elegir el juez que intervendrá en el trámite administrativo.",
          "La exoneración automática de tasas o aranceles administrativos.",
          "El derecho a suspender las funciones del órgano competente por mera voluntad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 1 inc. f).",
    puntos_base: 10
  },
  {
    id: "adm-f-08",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 10 de la Ley N° 19.549, ¿cómo se interpreta la falta de pronunciamiento explícito de la Administración ante una petición (silencio administrativo)?",
    opciones: [
          "Se interpreta como una negativa tácita al pedido del administrado, habilitando las vías impugnativas.",
          "Se interpreta como la aceptación tácita de todos los términos de la petición.",
          "Genera la caducidad automática de la competencia del Poder Ejecutivo.",
          "Obliga al administrado a reiniciar el trámite en una mesa de entradas distinta."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 10.",
    puntos_base: 10
  },
  {
    id: "adm-f-09",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "Conforme a la LNPA (Ley 19.549), ¿cuándo surte efectos jurídicos el acto administrativo de alcance particular?",
    opciones: [
          "Desde el momento de su notificación personal y fehaciente al interesado.",
          "Desde su redacción y firma en el despacho del funcionario emisor.",
          "Desde su publicación formal en el Boletín Oficial durante 3 días.",
          "Desde que transcurren noventa días de emitido el dictamen jurídico."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 11.",
    puntos_base: 10
  },
  {
    id: "adm-m-04",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Según el artículo 14 de la Ley N° 19.549, ¿cuándo el acto administrativo padece de nulidad absoluta e insanable?",
    opciones: [
          "Cuando se hubiere dictado prescindiendo de las normas fundamentales del procedimiento o por órgano incompetente en razón de la materia o del territorio, entre otros causales graves.",
          "Cuando contenga un error puramente gramatical en el visto del expediente.",
          "Cuando sea omitida la indicación del número de teléfono del administrado.",
          "Cuando el acto no haya sido publicado en diarios de circulación nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 14.",
    puntos_base: 20
  },
  {
    id: "adm-m-05",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Conforme al artículo 17 de la Ley N° 19.549, ¿cuándo la Administración puede revocar en sede administrativa un acto nulo de nulidad absoluta?",
    opciones: [
          "Debe revocarlo o sustituirlo por sí en sede administrativa, salvo que el acto esté firme, consolidado y hubiere generado derechos subjetivos que se estén cumpliendo.",
          "Solo puede revocarlo si el administrado presta conformidad expresa ante escribano.",
          "Nunca puede revocarlo sin iniciar juicio contencioso administrativo previo de lesividad.",
          "Puede revocarlo libremente en cualquier tiempo sin importar los derechos adquiridos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 17.",
    puntos_base: 20
  },
  {
    id: "adm-m-06",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "En el Reglamento de Procedimientos Administrativos (Dec. 1759/72 t.o.), ¿cuál es el plazo ordinario para interponer el Recurso de Reconsideración contra un acto administrativo definitivo?",
    opciones: [
          "Diez (10) días hábiles administrativos contados desde la notificación del acto.",
          "Treinta (30) días corridos contados desde la emisión del acto.",
          "Tres (3) meses improrrogables contados desde la solicitud inicial.",
          "Cuarenta y ocho (48) horas hábiles desde su publicación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto N° 1759/72 t.o., Art. 84.",
    puntos_base: 20
  },
  {
    id: "adm-m-07",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "De acuerdo con el Reglamento de Procedimientos Administrativos (Dec. 1759/72), ¿ante qué autoridad se resuelve el Recurso Jerárquico?",
    opciones: [
          "Es resuelto por el Ministro o por el Poder Ejecutivo Nacional, agotando la vía administrativa.",
          "Es resuelto por el mismo funcionario inferior de rango que emitió el acto recurrido.",
          "Es resuelto por el Colegio de Abogados de la jurisdicción respectiva.",
          "Es resuelto por la Sindicatura General de la Nación (SIGEN)."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto N° 1759/72 t.o., Art. 89 y 90.",
    puntos_base: 20
  },
  {
    id: "adm-m-08",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Según el artículo 25 de la Ley N° 19.549, ¿cuál es el plazo de caducidad para deducir la demanda de impugnación judicial de un acto administrativo contra la Nación?",
    opciones: [
          "Noventa (90) días hábiles judiciales computados desde la notificación del acto que agota la vía administrativa.",
          "Dos (2) años corridos contados desde la fecha de inicio del trámite.",
          "Un (1) año computable a partir de la emisión del dictamen de la Procuración del Tesoro.",
          "Cincuenta (50) días corridos computados desde el rechazo en sede administrativa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 25 inc. a).",
    puntos_base: 20
  },
  {
    id: "adm-m-09",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Conforme a los artículos 30 y 31 de la LNPA (Ley 19.549), ¿qué requisito debe cumplirse antes de demandar judicialmente al Estado Nacional por daños derivados de hechos o la omisión administrativa?",
    opciones: [
          "Presentar el Reclamo Administrativo Previo ante el Ministerio u órgano competente.",
          "Iniciar una causa penal por la comisión del delito de malversación de fondos.",
          "Citar a audiencia de mediación obligatoria en el fuero comercial.",
          "Obtener la conformidad por escrito de la Sindicatura General."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Arts. 30 y 31.",
    puntos_base: 20
  },
  {
    id: "adm-m-10",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "En el régimen de Contrataciones de la Administración Nacional (Decreto N° 1023/01), ¿cuál es el procedimiento de selección general y obligatorio para las contrataciones estatales?",
    opciones: [
          "La Licitación Pública o Concurso Público.",
          "La contratación directa por compulsa de precios sin publicidad.",
          "La adjudicación directa a empresas estatales o sociedades del Estado.",
          "El concurso cerrado de precios por invitación reservada."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto N° 1023/01, Art. 24.",
    puntos_base: 20
  },
  {
    id: "adm-m-11",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Según la Ley de Responsabilidad del Estado (N° 26.944), ¿cuál es el plazo de prescripción para interponer la acción de responsabilidad contra el Estado por actividad legítima o ilegítima?",
    opciones: [
          "Tres (3) años computados a partir de la verificación del daño o desde que la acción de daños estuvo disponible.",
          "Cinco (5) años contados desde el inicio de las actuaciones en sede administrativa.",
          "Diez (10) años contados desde la sanción de la ley reglamentaria.",
          "Un (1) año contados desde la publicación en el Boletín Oficial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 26.944, Art. 7º.",
    puntos_base: 20
  },
  {
    id: "adm-d-04",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "En el régimen de la Ley N° 26.944 (Responsabilidad del Estado por actividad legítima), ¿qué rubro indemnizatorio excluye expresamente la ley?",
    opciones: [
          "El lucro cesante, limitando la indemnización exclusivamente al valor del daño emergente demostrado.",
          "El valor de reposición del bien inmueble dañado.",
          "Los gastos médicos e infectológicos de la víctima.",
          "Las costas y honorarios derivados del proceso judicial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 26.944, Art. 5º.",
    puntos_base: 30
  },
  {
    id: "adm-d-05",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "De acuerdo con el artículo 9º de la LNPA (Ley 19.549), ¿qué se entiende por 'Vía de Hecho Administrativa'?",
    opciones: [
          "Cualquier comportamiento material de la Administración que importe una ejecución de un acto sin que exista un acto administrativo formal que le sirva de fundamento, o lesionando derechos sustanciales.",
          "El dictado de una ordenanza municipal que fija nuevos tributos.",
          "El cumplimiento de una sentencia judicial con fuerza de cosa juzgada.",
          "La celebración de un contrato de obra pública con licitación transparente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 19.549, Art. 9º.",
    puntos_base: 30
  },
  {
    id: "adm-d-06",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "En el precedente de la CSJN 'CEPIS' (2016) sobre tarifas de servicios públicos, ¿qué requisito constitucional declaró exigible con carácter previo a cualquier modificación tarifaria general?",
    opciones: [
          "La celebración de una Audiencia Pública previa, abierta y participativa que garantice la información adecuada a los usuarios.",
          "La autorización expresa mediante ley del Congreso sancionada por dos tercios de votos.",
          "El visto bueno por parte del Banco Central de la República Argentina.",
          "El dictamen de aprobación previa emitido por las legislaturas provinciales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 339:1077 ('CEPIS', 2016), conforme al Art. 42 CN.",
    puntos_base: 30
  },
  {
    id: "adm-d-07",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "Según la doctrina de la Procuración del Tesoro de la Nación (PTN), ¿qué efecto tienen los dictámenes jurídicos emitidos por sus asesores sobre las autoridades administrativas?",
    opciones: [
          "No son vinculantes per se para el órgano decisor, pero constituyen un requisito esencial de procedimiento cuya omisión acarrea la nulidad del acto.",
          "Tienen efecto vinculante e irretroactivo con fuerza de sentencia judicial.",
          "Obligan al funcionario a acatar las instrucciones de la SIGEN sin excepción.",
          "Reemplazan la firma del Ministro en el acto administrativo final."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina de la Procuración del Tesoro de la Nación y Art. 7 inc d) Ley 19.549.",
    puntos_base: 30
  },
  {
    id: "adm-d-08",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "Conforme a la Ley N° 26.944, ¿cuál es el carácter de la responsabilidad personal del funcionario público que en el ejercicio de sus funciones cause un daño por dolo o culpa grave?",
    opciones: [
          "La responsabilidad del funcionario es directa y el Estado o el afectado pueden accionar contra él para repetir el importe de las indemnizaciones abonadas.",
          "Excluye toda responsabilidad del funcionario transfiriéndola enteramente al Estado de por vida.",
          "Implica únicamente sanciones disciplinarias internas sin consecuencias patrimoniales.",
          "Prescribe al cabo de treinta días contados desde la cesación en el cargo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 26.944, Art. 9º.",
    puntos_base: 30
  },
  {
    id: "prv-f-04",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 120 de la Constitución de la Provincia de Buenos Aires, ¿cuántos años dura en sus funciones el Gobernador y Vicegobernador?",
    opciones: [
          "Cuatro (4) años de ejercicio.",
          "Seis (6) años ininterrumpidos.",
          "Dos (2) años con reelección indefinida.",
          "Cinco (5) años sin opción a mandato posterior."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Provincia de Buenos Aires (CPBA), Art. 120.",
    puntos_base: 10
  },
  {
    id: "prv-f-05",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Conforme a la Constitución de la Provincia de Buenos Aires (Art. 70), ¿cómo está integrado el Poder Legislativo provincial?",
    opciones: [
          "Por dos Cámaras: la Cámara de Diputados y la Cámara de Senadores.",
          "Por un Congreso unicameral de representantes comunales.",
          "Por una Asamblea Legislativa presidida por el Intendente de La Plata.",
          "Por la Junta de Representantes de la provincia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 70.",
    puntos_base: 10
  },
  {
    id: "prv-f-06",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Según el artículo 160 de la Constitución de la PBA, ¿cuál es el órgano superior de la administración de justicia en el territorio bonaerense?",
    opciones: [
          "La Suprema Corte de Justicia de la Provincia de Buenos Aires (SCBA).",
          "El Tribunal de Casación Penal de la Nación.",
          "La Cámara de Diputados de la Provincia de Buenos Aires.",
          "El Consejo de la Magistratura Nacional."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 160.",
    puntos_base: 10
  },
  {
    id: "prv-f-07",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 84 de la CPBA, ¿cuándo se inicia y finaliza el período de sesiones ordinarias de la Legislatura bonaerense?",
    opciones: [
          "Desde el 1º de marzo hasta el 30 de noviembre de cada año.",
          "Desde el 1º de mayo hasta el 31 de diciembre.",
          "Desde el 15 de febrero hasta el 15 de octubre.",
          "Funciona de forma continua e ininterrumpida los 365 días."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 84.",
    puntos_base: 10
  },
  {
    id: "prv-f-08",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Conforme al artículo 124 de la CPBA, ¿cómo se eligen el Gobernador y el Vicegobernador de la Provincia de Buenos Aires?",
    opciones: [
          "A simple pluralidad de sufragios en elección directa por el pueblo de la provincia.",
          "Por voto secreto indirecto realizado en el Colegio Electoral Provincial.",
          "Por designación de la mayoría de dos tercios de la Cámara de Senadores.",
          "Mediante balotaje obligatorio entre las tres fórmulas más votadas."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 124.",
    puntos_base: 10
  },
  {
    id: "prv-f-09",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Según la Sección Séptima de la CPBA (Art. 190), ¿cuál es el régimen municipal consagrado en el ámbito provincial?",
    opciones: [
          "La administración de los intereses y servicios locales en cada partido estará a cargo de una Municipalidad compuesta por un Departamento Ejecutivo y un Departamento Deliberativo.",
          "La delegación de la administración municipal en comisionados nombrados por el Gobernador.",
          "La gestión de los municipios a través de juntas vecinales electas por concurso.",
          "La centralización de los tributos locales en el Ministerio de Gobierno."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 190.",
    puntos_base: 10
  },
  {
    id: "prv-m-04",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "En el fuero constitucional bonaerense (Art. 161 inc. 1º de la CPBA), ¿ante qué órgano se tramita de forma originaria y exclusiva la Acción de Inconstitucionalidad?",
    opciones: [
          "Ante la Suprema Corte de Justicia de la Provincia de Buenos Aires (SCBA).",
          "Ante la Cámara de Apelación en lo Contencioso Administrativo de La Plata.",
          "Ante el Tribunal de Casación Penal de la PBA.",
          "Ante el Juez de Garantías del departamento judicial correspondiente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 161 inc. 1º.",
    puntos_base: 20
  },
  {
    id: "prv-m-05",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "Conforme al Código Procesal Civil y Comercial de la PBA (Art. 278), ¿qué recurso extraordinario procede ante la SCBA contra sentencias definitivas por violación o aplicación errónea de la ley o doctrina legal?",
    opciones: [
          "El Recurso Extraordinario de Inaplicabilidad de Ley o Doctrina Legal.",
          "El Recurso Ordinario de Queja por retardo de justicia.",
          "La Acción de Amparo directa en instancia única.",
          "El Recurso de Apelación en relación con efecto suspensivo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPCC PBA, Art. 278.",
    puntos_base: 20
  },
  {
    id: "prv-m-06",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "Según el Código Procesal Civil y Comercial de la PBA (Art. 296), ¿cuándo procede el Recurso Extraordinario de Nulidad ante la SCBA?",
    opciones: [
          "Cuando en la sentencia definitiva se hayan omitido decidir cuestiones esenciales planteadas por las partes o faltare la mayoría de opiniones.",
          "Cualquier desacuerdo con la valoración probatoria realizada por la Cámara de Apelaciones.",
          "Cuando la cuantía económica del juicio sea menor a 10 JUS.",
          "Unicamente por vicios formales en la notificación del traslado de la demanda."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPCC PBA, Art. 296.",
    puntos_base: 20
  },
  {
    id: "prv-m-07",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "De acuerdo con el Decreto-Ley N° 7647/70 (Procedimiento Administrativo PBA), ¿cuál es el recurso que procede ante el mismo órgano que dictó el acto para que lo revoque por contrario imperio?",
    opciones: [
          "El Recurso de Revocatoria.",
          "El Recurso Jerárquico directo.",
          "El Reclamo Previo de Inconstitucionalidad.",
          "La Demanda Contencioso Administrativa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 7647/70 PBA, Art. 89.",
    puntos_base: 20
  },
  {
    id: "prv-m-08",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "En la Ley de Código Procesal Contencioso Administrativo de la PBA (Ley N° 12.008), ¿cuál es la regla general respecto del plazo para interponer la demanda contenciosa?",
    opciones: [
          "Noventa (90) días contados desde la notificación del acto definitivo que agota la vía administrativa.",
          "Cincuenta (50) días contados desde la resolución del recurso de revocatoria.",
          "Seis (6) meses desde la interposición del reclamo previo.",
          "Un (1) año corrido sin excepción alguna."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 12.008 PBA, Art. 18.",
    puntos_base: 20
  },
  {
    id: "prv-m-09",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "Conforme al artículo 182 de la CPBA, ¿qué órgano juzga la responsabilidad política de los jueces de primera instancia y demás magistrados de la PBA?",
    opciones: [
          "El Jurado de Enjuiciamiento de Magistrados (Jury de Enjuiciamiento).",
          "El Consejo de la Magistratura de la Nación.",
          "El Colegio de Abogados de la Provincia de Buenos Aires.",
          "El Poder Ejecutivo Provincial mediante resolución motivada."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 182 y Ley N° 13.661.",
    puntos_base: 20
  },
  {
    id: "prv-m-10",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "Según el artículo 159 de la CPBA, ¿qué organismo tiene a su cargo la fiscalización de las cuentas de la administración pública provincial y municipal?",
    opciones: [
          "El Tribunal de Cuentas de la Provincia de Buenos Aires.",
          "La Contaduría General de la Nación.",
          "La Secretaría de Control Técnico de la Gobernación.",
          "El Banco de la Provincia de Buenos Aires."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 159.",
    puntos_base: 20
  },
  {
    id: "prv-m-11",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "De acuerdo con el procedimiento de Amparo en la PBA (Ley N° 13.928), ¿qué jueces son competentes para recibir la demanda de amparo?",
    opciones: [
          "Cualquier juez o tribunal de primera instancia de la provincia que tenga jurisdicción en el lugar donde el acto se exteriorice o tuviere efectos.",
          "Únicamente los jueces de la Cámara Contencioso Administrativa de La Plata.",
          "Exclusivamente los magistrados del fuero civil y comercial de Quilmes.",
          "El Presidente de la Suprema Corte de Justicia en sesión única."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 13.928 PBA, Art. 2º.",
    puntos_base: 20
  },
  {
    id: "prv-d-04",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "En la Ley de Juicio por Jurados de la PBA (Ley N° 14.543), ¿cómo se compone el tribunal de jurados y qué mayoría exige para emitir un veredicto de culpabilidad en delitos graves?",
    opciones: [
          "Doce (12) ciudadanos titulares, requiriéndose al menos 10 votos afirmativos para veredicto de culpabilidad, o unanimidad si la pena fuere prisión perpetua.",
          "Seis (6) ciudadanos con mayoría simple de 4 votos en todos los casos.",
          "Ocho (8) ciudadanos y dos jueces profesionales decidiendo por unanimidad.",
          "Quince (15) jurados populares requiriéndose 12 votos para condena sin recurso."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 14.543 PBA y CPPBA Art. 371 cuater.",
    puntos_base: 30
  },
  {
    id: "prv-d-05",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "En la doctrina legal de la SCBA, ¿cuál es el alcance del deber de los jueces bonaerenses de ajustar sus fallos a los precedentes de la Suprema Corte de Justicia?",
    opciones: [
          "Los jueces de instancias inferiores tienen el deber de acatar la doctrina legal de la SCBA para resguardar la seguridad jurídica e igualdad ante la ley.",
          "Es facultativo y los jueces inferiores pueden apartarse libremente sin fundar el desvío.",
          "Solo obliga si la doctrina fue dictada con posterioridad al inicio de la causa penal.",
          "Aplica únicamente para las causas tramitadas en el Departamento Judicial La Plata."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina constante de la SCBA (Fallos C. 116.857, C. 101.442, entre otros).",
    puntos_base: 30
  },
  {
    id: "prv-d-06",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "Según la Ley Orgánica del Ministerio Público de la PBA (Ley N° 14.442), ¿cómo se estructuran sus tres áreas de gestión?",
    opciones: [
          "La Fiscalía General, la Defensoría General y la Asesoría General de Incapaces.",
          "El Fuero Penal, el Fuero Civil y el Tribunal de Faltas.",
          "El Cuerpo de Abogados del Estado, el Jury y la Sindicatura.",
          "La Policía Judicial, los Jueces de Paz y el Fuero del Trabajo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 14.442 PBA, Art. 2º.",
    puntos_base: 30
  },
  {
    id: "prv-d-07",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "Conforme al artículo 12 de la CPBA, ¿qué garantía particular relativa a la libertad personal consagra expresamente la provincia contra arrestos arbitrarios?",
    opciones: [
          "Nadie puede ser privado de su libertad sin orden escrita de juez competente, salvo caso de infraganti delito, y la orden debe manifestar la causa del arresto.",
          "El arresto policial por contravención no puede exceder de sesenta días hábiles.",
          "Todo ciudadano puede ser retenido sin orden durante 72 horas para averiguación de identidad.",
          "Las órdenes de arresto pueden ser emitidas por los comisarios de sección."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CPBA, Art. 12 inc. 1º.",
    puntos_base: 30
  },
  {
    id: "prv-d-08",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "En la Ley de Código Procesal Contencioso Administrativo (Ley N° 12.008 PBA), ¿qué procede cuando la Administración omite resolver una petición o recurso dentro de los plazos reglamentarios?",
    opciones: [
          "Se configura la denegatoria tácita por mora y habilita la vía contencioso administrativa sin necesidad de interponer pronto despacho previo en ciertos supuestos.",
          "Se aprueba el reclamo por silencio positivo impositivo.",
          "Se suspende la caducidad del derecho por el término de diez años.",
          "El expediente se remite automáticamente al fuero comercial ordinario."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley N° 12.008 PBA, Art. 16.",
    puntos_base: 30
  },
  {
    id: "loc-f-04",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "¿Qué norma provincial constituye el marco normativo orgánico regulador de los municipios bonaerenses y de la Municipalidad de La Plata?",
    opciones: [
          "La Ley Orgánica de las Municipalidades (Decreto-Ley N° 6769/58 y sus modificatorias).",
          "El Código Procesal Civil y Comercial de la Nación.",
          "La Ley de Educación Superior N° 24.521.",
          "El Estatuto General del Empleado Público Provincial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58 PBA.",
    puntos_base: 10
  },
  {
    id: "loc-f-05",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "Conforme a la Ley Orgánica de las Municipalidades, ¿cómo está integrado el gobierno municipal en La Plata?",
    opciones: [
          "Por un Departamento Ejecutivo a cargo del Intendente, y un Departamento Deliberativo a cargo del Concejo Deliberante.",
          "Por un Gobernador comisionado y un Consejo Consultivo Comunal.",
          "Por un Tribunal de Faltas y una Junta Vecinal de Representantes.",
          "Por una Asamblea de Mayores Contribuyentes de carácter permanente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 1º.",
    puntos_base: 10
  },
  {
    id: "loc-f-06",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "De acuerdo con la LOM (Dec-Ley 6769/58), ¿cuánto dura en sus funciones el Intendente Municipal de La Plata?",
    opciones: [
          "Cuatro (4) años de ejercicio.",
          "Seis (6) años ininterrumpidos.",
          "Dos (2) años con renovación por tercios.",
          "Cinco (5) años sin posibilidad de mandato ulterior."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 3º.",
    puntos_base: 10
  },
  {
    id: "loc-f-07",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "¿Mediante qué norma legal se declaró a la ciudad de La Plata como Capital de la Provincia de Buenos Aires en 1882?",
    opciones: [
          "Ley Provincial N° 1.440 de mayo de 1882 sancionada por la Legislatura bonaerense.",
          "Ley Nacional N° 4.699 de nacionalización universitaria.",
          "Ordenanza Municipal N° 1 de la ciudad de Buenos Aires.",
          "Decreto del Poder Ejecutivo Nacional durante la presidencia de Roca."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Provincial N° 1.440 (1882).",
    puntos_base: 10
  },
  {
    id: "loc-f-08",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "En la jerarquía de normas municipales, ¿qué instrumento legal sanciona el Concejo Deliberante de La Plata para dictar disposiciones generales y permanentes?",
    opciones: [
          "Ordenanzas Municipales.",
          "Decretos de Necesidad y Urgencia Comunal.",
          "Resoluciones ministeriales provinciales.",
          "Estatutos notarialmente certificados."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 77.",
    puntos_base: 10
  },
  {
    id: "loc-m-04",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Conforme a la LOM (Dec-Ley 6769/58), ¿qué órgano sanciona la Ordenanza Impositiva y el cálculo de recursos que crean tasas municipales?",
    opciones: [
          "La Asamblea de Concejales y Mayores Contribuyentes en sesión conjunta.",
          "El Intendente Municipal por decreto delegado en receso del concejo.",
          "El Tribunal de Cuentas de la Provincia de Buenos Aires.",
          "La Cámara de Senadores de la Provincia de Buenos Aires."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 29 y 98.",
    puntos_base: 20
  },
  {
    id: "loc-m-05",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "En el derecho tributario municipal bonaerense, ¿cuál es la diferencia conceptual entre una Tasa Municipal y un Impuesto?",
    opciones: [
          "La Tasa exige como contraprestación la prestación efectiva o potencial de un servicio público individualizado al contribuyente (ej. SUM, Seguridad e Higiene).",
          "La Tasa se cobra de manera idéntica en todo el territorio nacional.",
          "El Impuesto municipal es fijado libremente por las cámaras empresarias.",
          "No existe diferencia y ambos conceptos son jurídicamente idénticos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina de la SCBA y CSJN ('Laboratorios Raffo', 'Esso', entre otros).",
    puntos_base: 20
  },
  {
    id: "loc-m-06",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Según el artículo 108 de la LOM, ¿cuál es el plazo para que el Intendente Municipal de La Plata promedie el veto a una Ordenanza sancionada por el Concejo?",
    opciones: [
          "Diez (10) días hábiles desde su notificación o promulgación tácita.",
          "Treinta (30) días corridos desde la sesión de aprobación.",
          "Cinco (5) meses contados desde la recepción en mesa de entradas.",
          "No existe plazo y puede vetarse en cualquier momento del mandato."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 108.",
    puntos_base: 20
  },
  {
    id: "loc-m-07",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "De acuerdo con el procedimiento contravencional en La Plata, ¿ante qué fuero se apelan las sentencias dictadas por los Juzgados de Faltas Municipales?",
    opciones: [
          "Ante el Juzgado de Correccional o de Garantías del Departamento Judicial La Plata.",
          "Ante la Corte Suprema de Justicia de la Nación.",
          "Ante la Mesa Ejecutiva del Concejo Deliberante.",
          "Ante el Ministerio de Seguridad de la Provincia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 8751/77 (Código de Faltas Municipal PBA).",
    puntos_base: 20
  },
  {
    id: "loc-m-08",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Conforme a la LOM (Dec-Ley 6769/58), ¿cuál es la mayoría calificada requerida en el Concejo Deliberante para insistir con una Ordenanza vetada por el Intendente?",
    opciones: [
          "El voto de los dos tercios (2/3) del total de los miembros del Concejo Deliberante.",
          "La mayoría simple de los concejales presentes en la sesión.",
          "El voto de tres cuartas partes (3/4) de los mayores contribuyentes.",
          "Unanimidad absoluta de todos los bloques políticos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 108.",
    puntos_base: 20
  },
  {
    id: "loc-d-04",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "En la normativa de ordenamiento territorial de La Plata (Ordenanza N° 10.703 y modif. - COU), ¿cuál es el objeto principal del Código de Ordenamiento Urbano?",
    opciones: [
          "Regular el uso, ocupación, subdivisión del suelo y las alturas y densidades constructivas en el partido de La Plata.",
          "Fijar la tarifa del transporte público de colectivos urbanos.",
          "Regular el estatuto laboral de los empleados administrativos de la comuna.",
          "Determinar la representación de concejales por sección electoral."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ordenanza Municipal N° 10.703 de La Plata.",
    puntos_base: 30
  },
  {
    id: "loc-d-05",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "Según el artículo 241 de la LOM, ¿cuál es la responsabilidad patrimonial del Intendente y Concejales que autorizaren gastos en exceso de las partidas presupuestarias autorizadas?",
    opciones: [
          "Responden personal y solidariamente con sus bienes por los compromisos o pagos indebidos autorizados.",
          "Se les descuenta el 5% de la dieta mensual en doce cuotas.",
          "Responden únicamente con apercibimiento administrativo sin sanción civil.",
          "La responsabilidad queda absorbida íntegramente por el Tesoro Provincial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58, Art. 241.",
    puntos_base: 30
  },
  {
    id: "loc-d-06",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "¿Qué hito de planificación urbana higienista caracterizó la fundación de la ciudad de La Plata el 19 de noviembre de 1882 impulsada por Dardo Rocha?",
    opciones: [
          "Su trazado de cuadrado perfecto con diagonales, diseñado por el ingeniero Pedro Benoit, incorporando plazas cada seis cuadras y bulevares arbolados.",
          "La construcción del primer subterráneo de Sudamérica.",
          "La división en comunas autónomas con justicia propia en cada barrio.",
          "La prohibición de edificación de más de dos pisos de altura en todo el partido."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la Ciudad de La Plata y Plan Urbanístico de Pedro Benoit (1882).",
    puntos_base: 30
  },
  {
    id: "unlp-f-03",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿En qué año fue fundada originalmente la Universidad Provincial de La Plata bajo el impulso de Dardo Rocha?",
    opciones: [
          "En el año 1897 (inaugurada formalmente el 18 de abril de 1897).",
          "En el año 1983 tras el retorno de la democracia.",
          "En el año 1918 al calor de la Reforma Universitaria.",
          "En el año 1950 durante la sanción de la Gratuidad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la UNLP (Fundación provincial por Dardo Rocha en 1897).",
    puntos_base: 10
  },
  {
    id: "unlp-f-04",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "La Reforma Universitaria de 1918 iniciada en Córdoba consagró principios fundamentales que rigen en la UNLP. ¿Cuáles son tres de sus pilares históricos?",
    opciones: [
          "Autonomía universitaria, Cogobierno tripartito (docentes, graduados, estudiantes) y Gratuidad/Extensión universitaria.",
          "Ingreso arancelado, designación a dedo de profesores y régimen monárquico.",
          "Control directo del Ministerio de Economía, exámenes a libro cerrado e internado obligatorio.",
          "Prohibición de agrupaciones estudiantiles y nombramientos vitalicios."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Manifiesto Liminar de la Reforma Universitaria (1918) y Estatuto UNLP.",
    puntos_base: 10
  },
  {
    id: "unlp-f-05",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "Mediante el Decreto N° 29.337 dictado en 1949 por el Presidente Juan Domingo Perón, ¿qué medida trascendental se dispuso para la universidad pública argentina?",
    opciones: [
          "La suspensión del cobro de aranceles universitarios (Gratuidad Universitaria).",
          "La eliminación de los exámenes finales en todas las carreras de grado.",
          "La unificación de las universidades nacionales en una sola sede central.",
          "La prohibición de cursar más de dos materias por cuatrimestre."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto N° 29.337/1949 de Gratuidad Universitaria.",
    puntos_base: 10
  },
  {
    id: "unlp-f-06",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "Según el Estatuto de la UNLP, ¿cuáles son los claustros que integran el cogobierno universitario?",
    opciones: [
          "Docentes, Estudiantes, Graduados y Nodocentes.",
          "Profesores titulares únicamente.",
          "Docentes y funcionarios del Poder Judicial exclusivamente.",
          "Representantes del Municipio y del Gobierno Provincial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 8º.",
    puntos_base: 10
  },
  {
    id: "unlp-f-07",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿Dónde se encuentra ubicada la histórica sede principal de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP?",
    opciones: [
          "En el Edificio de la Reforma, calle 48 entre 6 y 7 de la ciudad de La Plata.",
          "En el Bosque Platense junto a la Facultad de Astronomía.",
          "En el edificio de la Presidencia de la UNLP en calle 7 entre 47 y 48.",
          "En el campus universitario de Gonnet sobre camino Centenario."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Sede Histórica de la FCJyS - UNLP.",
    puntos_base: 10
  },
  {
    id: "unlp-m-03",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "Según el Estatuto de la UNLP (Art. 41), ¿cómo está compuesto el Consejo Directivo de la Facultad de Ciencias Jurídicas y Sociales?",
    opciones: [
          "Por 16 miembros: 7 representantes docentes, 5 representantes estudiantes, 2 representantes graduados, 1 representante nodocente y el Decano/a.",
          "Por 10 miembros: 5 docentes y 5 estudiantes exclusivamente.",
          "Por 20 profesores titulares elegidos por concurso de antecedentes.",
          "Por el Decano y los directores de institutos de investigación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 41.",
    puntos_base: 20
  },
  {
    id: "unlp-m-04",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "Conforme al Estatuto de la UNLP, ¿cuánto dura el mandato de los representantes del claustro estudiantil ante el Consejo Directivo y el Consejo Superior?",
    opciones: [
          "Un (1) año de ejercicio.",
          "Dos (2) años con renovación parcial.",
          "Cuatro (4) años al igual que los representantes docentes.",
          "Seis (6) meses renovable por un período más."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 43.",
    puntos_base: 20
  },
  {
    id: "unlp-m-05",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "De acuerdo con el Estatuto de la UNLP, ¿cuánto dura el mandato de los representantes de los claustros docente y graduados ante los órganos de gobierno?",
    opciones: [
          "Cuatro (4) años en sus funciones.",
          "Un (1) año coincidiendo con el claustro estudiantil.",
          "Tres (3) años con opción a prórroga.",
          "Cinco (5) años sin opción a reelección inmediata."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 43.",
    puntos_base: 20
  },
  {
    id: "unlp-m-06",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "¿Cómo se elige la conducción del Centro de Estudiantes de la Facultad de Ciencias Jurídicas y Sociales (UNLP)?",
    opciones: [
          "Por voto directo, secreto y obligatorio de todos los alumnos regulares de la facultad en los comicios anuales.",
          "Por designación del Consejo Directivo a propuesta de los mejores promedios.",
          "Por consenso de los profesores titulares de cada cátedra.",
          "Mediante sorteo público entre los inscriptos al inicio del ciclo lectivo."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto del Centro de Estudiantes de Derecho (FCJyS - UNLP).",
    puntos_base: 20
  },
  {
    id: "unlp-m-07",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "¿Quién fue el gran jurista y político argentino que impulsó la nacionalización de la UNLP en 1905 y la creación de su modelo universitario integral?",
    opciones: [
          "Joaquín V. González.",
          "Dalmacio Vélez Sarsfield.",
          "Esteban Echeverría.",
          "Juan Bautista Alberdi."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la UNLP (Convenio de Joaquín V. González de 1905).",
    puntos_base: 20
  },
  {
    id: "unlp-d-03",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "¿Qué destacado jurista y constitucionalista de la FCJyS - UNLP fue el principal redactor de la Constitución Nacional de 1949 y de la corriente del constitucionalismo social argentino?",
    opciones: [
          "Arturo Enrique Sampay.",
          "Sebastián Soler.",
          "Guillermo Borda.",
          "Carlos Cossio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia del Derecho y de la FCJyS (Prof. Arturo Sampay).",
    puntos_base: 30
  },
  {
    id: "unlp-d-04",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "Según el Estatuto de la UNLP (Art. 34), ¿a qué órgano le corresponde sustanciar los Juicios Académicos contra profesores titulares por falta grave?",
    opciones: [
          "Al Consejo Superior de la UNLP constituido en Tribunal Académico.",
          "A la Cámara de Apelaciones en lo Contencioso Administrativo.",
          "Al Consejo Directivo de cada Facultad en sesión secreta.",
          "Al Centro de Graduados de la Universidad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 34 y 70.",
    puntos_base: 30
  }
,
  // --- LOTE MASIVO EXTRA (Nuevas Preguntas) ---
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
