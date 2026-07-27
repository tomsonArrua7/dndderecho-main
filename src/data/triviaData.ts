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
  // --- DERECHO CIVIL ---
  // =========================================================================
  {
    id: "civ-f-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "¿A qué edad se alcanza la mayoría de edad en la República Argentina según el artículo 25 del Código Civil y Comercial de la Nación?",
    opciones: [
      "A los 18 años de edad.",
      "A los 50 años de edad tras jurar en el Municipio.",
      "A los 10 años de edad con permiso escolar.",
      "A los 80 años de edad al jubilarse."
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
    pregunta: "De acuerdo con el artículo 19 del Código Civil y Comercial de la Nación, ¿en qué momento comienza legalmente la existencia de la persona humana?",
    opciones: [
      "Con la concepción.",
      "A los 30 años de edad.",
      "Al registrarse en un club social deportivo.",
      "Al graduarse de la universidad."
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
    pregunta: "¿Cuál es el plazo genérico de prescripción liberatoria establecido en el artículo 2560 del Código Civil y Comercial cuando la ley no fija un plazo especial?",
    opciones: [
      "Cinco (5) años.",
      "Cien (100) años.",
      "Dos días hábiles.",
      "Ochenta (80) años."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial, Art. 2560: 'El plazo de la prescripción es de cinco años, excepto que esté previsto uno diferente...'.",
    puntos_base: 10
  },
  {
    id: "civ-m-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "En el contrato de locación habitacional, ¿cuál es el plazo mínimo legal establecido en el artículo 1198 del CCyCN (texto vigente Ley 27.737)?",
    opciones: [
      "Tres (3) años.",
      "Seis (6) meses.",
      "Diez (10) años de ejecución obligatoria.",
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
    pregunta: "Según el artículo 332 del CCyCN, ¿qué vicio de los actos jurídicos permite demandar la nulidad o modificación cuando una parte explota la necesidad o inexperiencia de la otra?",
    opciones: [
      "Lesión.",
      "Simulación absoluta licita.",
      "Error de cálculo aritmético.",
      "Fuerza mayor imprevisible."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial, Art. 332: 'Puede demandarse la nulidad o la modificación de los actos jurídicos cuando una de las partes explotando la necesidad, debilidad síquica o inexperiencia de la otra...'.",
    puntos_base: 25
  },
  {
    id: "civ-d-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Respecto del régimen de nulidad relativa de un acto jurídico, ¿puede el juez declararla de oficio si la invalidez resulta manifiesta en el expediente?",
    opciones: [
      "No, la nulidad relativa no puede ser declarada de oficio por el juez bajo ninguna circunstancia, solo a petición de parte legitimada.",
      "Sí, siempre que la nulidad sea manifiesta el juez tiene el deber de declararla de oficio.",
      "Sí, pero únicamente si el Ministerio Público formula dictamen favorable en el expediente.",
      "No, salvo que el acto afecte indirectamente derechos patrimoniales del Estado Provincial."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial, Art. 388: 'La nulidad relativa sólo puede declararse a instancia de las personas en cuyo beneficio se establece... No puede ser declarada por el juez de oficio...'.",
    puntos_base: 50
  },
  {
    id: "civ-d-02",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "En la responsabilidad objetiva del principal por el hecho del dependiente (Art. 1753 CCyCN), ¿exime de responsabilidad probar la ausencia de culpa personal en la selección del dependiente?",
    opciones: [
      "No, la responsabilidad es objetiva y la falta de culpa del principal no constituye eximente legal.",
      "Sí, la prueba fehaciente de la debida diligencia libera íntegramente al principal.",
      "Sí, pero únicamente si el dependiente actuó fuera de su horario laboral habitual.",
      "No, salvo que el dependiente fuere un profesional matriculado independiente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial, Art. 1753: 'El principal responde objetivamente por los daños que causen los que están bajo su dependencia... La falta de culpa no exime de responsabilidad'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- DERECHO PENAL ---
  // =========================================================================
  {
    id: "pen-f-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "¿Cuál es la sanción principal establecida en el artículo 79 del Código Penal Argentino para el delito de homicidio simple?",
    opciones: [
      "Reclusión o prisión de 8 a 25 años.",
      "Una multa de diez pesos y apercibimiento verbal.",
      "Dos días de trabajos comunitarios en el colegio.",
      "Expulsión temporal del sistema educativo."
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
    pregunta: "Según el régimen penal de la minoridad (Ley 22.278), ¿a qué edad se fija el límite absoluto de no punibilidad penal de un menor de edad en Argentina?",
    opciones: [
      "A los 16 años de edad.",
      "A los 40 años de edad.",
      "A los 5 años de edad únicamente si asiste al jardín.",
      "A los 90 años de edad."
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
    pregunta: "Según el artículo 34 inciso 6° del Código Penal, ¿cuál de los siguientes es un requisito de la legítima defensa propia?",
    opciones: [
      "Falta de provocación suficiente por parte de quien se defiende.",
      "Contratar previamente un seguro contra accidentes personales.",
      "Pedir autorización escrita al comisario de la zona.",
      "Publicar un aviso en el diario oficial antes del hecho."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 34 inc. 6°: 'a) Agresión ilegítima; b) Necesidad racional del medio empleado...; c) Falta de provocación suficiente por parte del que se defiende'.",
    puntos_base: 10
  },
  {
    id: "pen-m-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "En el delito de robo con armas (Art. 166 inc. 2° CP), si se acredita que el arma de fuego no era apta para el disparo, ¿qué escala penal se aplica?",
    opciones: [
      "Prisión de 3 a 10 años.",
      "Prisión perpetua inmodificable.",
      "Multa administrativa menor.",
      "Pena de inhabilitación especial únicamente."
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
    pregunta: "De acuerdo con el artículo 42 del Código Penal, ¿cuándo se configura la tentativa de un delito?",
    opciones: [
      "Cuando se inicia la ejecución de un delito determinado pero no se consuma por circunstancias ajenas a la voluntad del autor.",
      "Cuando la persona solo piensa en cometer una infracción sin realizar acto alguno.",
      "Cuando el delito se consuma totalmente de manera perfecta.",
      "Cuando se comete una falta de tránsito menor."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 42: 'El que con el fin de cometer un delito determinado comienza su ejecución, pero no lo consuma por circunstancias ajenas a su voluntad, sufre las penas determinadas en el artículo 44'.",
    puntos_base: 25
  },
  {
    id: "pen-d-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "Si un sujeto inicia la ejecución de un robo cometiendo violación de domicilio, pero luego desiste voluntariamente de continuar con el robo, ¿cuál es su situación punitiva según el artículo 43 del CP?",
    opciones: [
      "Queda exento de pena por la tentativa de robo, pero responde por el delito consumado de violación de domicilio.",
      "Queda exento de pena por todos los actos realizados, incluidos los delitos ya consumados independientemente.",
      "Sufre la pena del robo consumado reducida en un tercio.",
      "El desistimiento carece de validez si se ingresó a la propiedad privada."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal, Art. 43: 'El que desistiere voluntariamente del delito, no estará sujeto a pena', pero ello no borra la punibilidad de los delitos independientes ya consumados en el trayecto.",
    puntos_base: 50
  },

  // =========================================================================
  // --- DERECHO CONSTITUCIONAL ---
  // =========================================================================
  {
    id: "con-f-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "¿Cuál es la Ley Suprema de la República Argentina según lo dispuesto en el artículo 31 de la Constitución Nacional?",
    opciones: [
      "La Constitución Nacional, las leyes de la Nación y los tratados internacionales con potencias extranjeras.",
      "El estatuto interno de un club social de barrio.",
      "Una circular de un banco comercial privado.",
      "Un reglamento dictado por un consorcio de propiedad horizontal."
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
      "El voto favorable de un solo diputado de turno.",
      "Unanimidad de todos los intendentes del país.",
      "Cincuenta votos en la junta de vecinos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional, Art. 30: 'La necesidad de reforma debe ser declarada por el Congreso con el voto de dos terceras partes, al menos, de sus miembros'.",
    puntos_base: 10
  },
  {
    id: "con-m-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "¿Qué tipo de sistema de control de constitucionalidad rige en el ordenamiento jurídico argentino a nivel federal?",
    opciones: [
      "Sistema judicial difuso, ejercido por todos y cada uno de los jueces de cualquier instancia.",
      "Sistema político concentrado exclusivo en el Ministerio de Economía.",
      "Sistema de jurados populares no letrados.",
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
      "Materia de administración interna de oficinas.",
      "Materia de fijación de días festivos nacionales.",
      "Materia de licitaciones de insumos de papelería."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional, Art. 99 inc. 3°: '...no regularan normas que regulen materia penal, tributaria, electoral o de régimen de los partidos políticos'.",
    puntos_base: 25
  },
  {
    id: "con-d-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "Conforme a la doctrina sentada por la CSJN en el precedente 'Rodríguez Pereyra' (2012), ¿cuál es el criterio respecto al control de constitucionalidad de oficio por parte de los magistrados?",
    opciones: [
      "Los jueces tienen la facultad y el deber de efectuar el control de constitucionalidad de oficio sin violar la división de poderes ni el derecho de defensa.",
      "El control de oficio está prohibido por vulnerar la división de poderes, requiriéndose siempre petición formal de parte.",
      "Solo la Corte Suprema puede ejercer el control de oficio, estando vedado a jueces inferiores.",
      "El control de oficio solo procede si la norma impugnada es un reglamento administrativo local."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 335:2333 ('Rodríguez Pereyra', 2012): Los jueces deben ejercer de oficio el control de constitucionalidad en el marco de sus competencias.",
    puntos_base: 50
  },

  // =========================================================================
  // --- DERECHO ADMINISTRATIVO ---
  // =========================================================================
  {
    id: "adm-f-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "¿Ante qué órgano u organismo del Estado se tramitan y resuelven los procedimientos administrativos en el ejercicio de la función administrativa pública?",
    opciones: [
      "Ante los órganos de la Administración Pública (Poder Ejecutivo y entes descentralizados).",
      "Ante una asociación civil de coleccionistas privados.",
      "Ante un club de fútbol local de barrio.",
      "Ante un estudio cinematográfico privado."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Nacional de Procedimientos Administrativos N° 19.549, Art. 1°: Regula el procedimiento ante la Administración Pública nacional.",
    puntos_base: 10
  },
  {
    id: "adm-m-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Según el artículo 7° de la Ley 19.549, ¿cuál de los siguientes es un requisito esencial de validez del acto administrativo?",
    opciones: [
      "La motivación del acto, expresando concretamente las razones de hecho y de derecho.",
      "El refrendo previo de la Bolsa de Comercio.",
      "La aprobación de la junta de vecinos del barrio.",
      "El juramento ante un escribano público privado."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 7° inc. e: 'Motivación. Deberá ser motivado, expresándose en forma concreta las razones que inducen a emitir el acto...'.",
    puntos_base: 25
  },
  {
    id: "adm-d-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "Conforme al artículo 17 de la Ley 19.549, si un acto administrativo firme padece de una nulidad absoluta e insanable, ¿cuál es la facultad de la Administración en sede administrativa?",
    opciones: [
      "Debe revocarlo o sustituirlo de oficio en sede administrativa por razones de ilegitimidad.",
      "Está impedida de revocarlo de oficio debiendo interponer obligatoriamente acción de lesividad judicial.",
      "Solo puede suspenderlo temporalmente por tres meses.",
      "Queda ratificado automáticamente por el transcurso de diez días."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 17: 'El acto administrativo afectado de nulidad absoluta se considera irregular y debe ser revocado o sustituido por razones de ilegitimidad aún en sede administrativa...'.",
    puntos_base: 50
  },

  // =========================================================================
  // --- DERECHO PROVINCIAL BA ---
  // =========================================================================
  {
    id: "pba-f-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "¿Cuál es la capital oficial de la Provincia de Buenos Aires establecida por ley provincial?",
    opciones: [
      "La ciudad de La Plata.",
      "La ciudad de Madrid.",
      "La ciudad de Tokio.",
      "La ciudad de Nueva York."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Provincial N° 1.469 de 1882 y Constitución de la Provincia de Buenos Aires: La ciudad de La Plata es la capital de la Provincia.",
    puntos_base: 10
  },
  {
    id: "pba-m-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "De conformidad con el artículo 84 de la Constitución de la Provincia de Buenos Aires, ¿cuál es el período establecido para las sesiones ordinarias de la Legislatura provincial?",
    opciones: [
      "Del 1° de marzo al 30 de noviembre de cada año.",
      "Del 1° de junio al 15 de junio únicamente.",
      "Dos días al año elegidos por sorteo público.",
      "Todo el año sin receso parlamentario."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Pcia. de Bs. As., Art. 84: 'Las Cámaras abrirán sus sesiones ordinarias automáticamente el primer día de marzo de cada año y las cerrarán el treinta de noviembre'.",
    puntos_base: 25
  },
  {
    id: "pba-d-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "De acuerdo con el artículo 182 de la Constitución de la Provincia de Buenos Aires y la Ley 13.661, ¿quién preside el Jurado de Enjuiciamiento de Magistrados bonaerense?",
    opciones: [
      "El Presidente de la Suprema Corte de Justicia de la Provincia.",
      "El Ministro de Economía provincial.",
      "El Decano de la Facultad de Derecho de la UBA.",
      "El Intendente del municipio sede del juzgado."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Pcia. de Bs. As., Art. 182 y Ley 13.661: El Jurado de Enjuiciamiento es presidido legalmente por el Presidente de la Suprema Corte de Justicia provincial.",
    puntos_base: 50
  },

  // =========================================================================
  // --- DERECHO MUNICIPAL Y LOCAL LA PLATA ---
  // =========================================================================
  {
    id: "lp-f-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "¿En qué provincia de la República Argentina se encuentra ubicado el Partido de La Plata?",
    opciones: [
      "En la Provincia de Buenos Aires.",
      "En la Provincia de Jujuy.",
      "En el Estado de California.",
      "En la Provincia de Mendoza."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Orgánica de las Municipalidades de la Pcia. de Bs. As. (Decreto-Ley 6769/58): La Plata es el municipio cabecera del Partido de La Plata en PBA.",
    puntos_base: 10
  },
  {
    id: "lp-m-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Conforme al Decreto-Ley 6769/58 (Ley Orgánica de las Municipalidades), ¿cuál es el órgano encargado de sancionar las Ordenanzas y Resoluciones locales?",
    opciones: [
      "El Concejo Deliberante.",
      "El centro de estudiantes universitarios.",
      "El club de remadores local.",
      "La comisaría de la zona."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley 6769/58, Art. 68 inc. 1°: Corresponde al Concejo Deliberante la sanción de las Ordenanzas y Resoluciones del Municipio.",
    puntos_base: 25
  },
  {
    id: "lp-d-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "¿Quién fue el ingeniero y agrimensor encargado del diseño técnico de la traza urbanística original, diagonales y plazas de la ciudad de La Plata en 1882?",
    opciones: [
      "Ingeniero Pedro Benoit.",
      "Arquitecto Francisco Salamone.",
      "Doctor Joaquín V. González.",
      "Ingeniero Carlos Thays."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la Ciudad de La Plata: La traza y dirección de planos de La Plata fue diseñada por el Ing. Pedro Benoit a pedido del gobernador Dardo Rocha.",
    puntos_base: 50
  },

  // =========================================================================
  // --- HISTORIA UNLP Y JURSOC ---
  // =========================================================================
  {
    id: "unlp-f-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿En qué ciudad se encuentra la sede central de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la Universidad Nacional de La Plata?",
    opciones: [
      "En la ciudad de La Plata.",
      "En la ciudad de París.",
      "En la ciudad de Londres.",
      "En la ciudad de Roma."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP: La Facultad de Ciencias Jurídicas y Sociales (Jursoc) tiene su sede histórica en el Edificio de la Reforma, La Plata.",
    puntos_base: 10
  },
  {
    id: "unlp-m-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "Según el Estatuto de la Universidad Nacional de La Plata (UNLP), ¿cuál es el órgano máximo de gobierno de la Universidad?",
    opciones: [
      "La Asamblea Universitaria.",
      "El tribunal de cuentas comunal.",
      "El centro de graduados de otra facultad.",
      "La federación mercantil."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP, Art. 11: 'La Asamblea Universitaria es el órgano supremo de la Universidad'.",
    puntos_base: 25
  },
  {
    id: "unlp-d-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "¿Mediante qué norma legal promovida por Joaquín V. González se otorgó el carácter definitivo de Universidad Nacional a la Universidad de La Plata en 1905?",
    opciones: [
      "Ley Nacional N° 4.699.",
      "Ley Avellaneda N° 1.597.",
      "Ley de Educación Superior N° 24.521.",
      "Decreto Nacional N° 1.010."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la UNLP: La Ley Nacional N° 4.699 sancionada en 1905 nacionalizó la antigua Universidad Provincial de La Plata tras el convenio suscrito por Joaquín V. González y el gobernador Marcelino Ugarte.",
    puntos_base: 50
  }
];
