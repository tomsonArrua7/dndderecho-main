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
  aciertosPorcentaje: number;
  racha: number;
  avatarUrl?: string;
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
];
