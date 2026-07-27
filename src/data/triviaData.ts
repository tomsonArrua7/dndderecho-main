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
  // --- DERECHO CIVIL ---
  {
    id: "civ-01",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "¿Cuál es el plazo genérico de prescripción liberatoria establecido en el artículo 2560 del Código Civil y Comercial de la Nación cuando la ley no fija un plazo diferente?",
    opciones: [
      "Cinco (5) años.",
      "Diez (10) años.",
      "Dos (2) años.",
      "Tres (3) años."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación (Ley 26.994), Art. 2560: 'El plazo de la prescripción es de cinco años, excepto que esté previsto uno diferente en las legislaciones especiales'.",
    puntos_base: 10
  },
  {
    id: "civ-02",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "En el contrato de locación de inmueble con destino habitacional, ¿cuál es el plazo mínimo legal establecido en el artículo 1198 del Código Civil y Comercial de la Nación (texto vigente Ley 27.737)?",
    opciones: [
      "Tres (3) años.",
      "Dos (2) años.",
      "Cinco (5) años.",
      "Un (1) año."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación, Art. 1198 (modificado por Ley 27.737): 'El contrato de locación de inmueble, cualquiera sea su destino, si carece de plazo expreso y determinado mayor, se considera celebrado por el plazo mínimo legal de tres años...'",
    puntos_base: 25
  },
  {
    id: "civ-03",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "Respecto del régimen de nulidad relativa de un acto jurídico, ¿puede el juez declararla de oficio si la invalidez resulta manifiesta en las actuaciones procesales?",
    opciones: [
      "No, la nulidad relativa no puede ser declarada de oficio por el juez bajo ninguna circunstancia, solo a petición de las partes en cuyo beneficio se establece.",
      "Sí, siempre que la nulidad sea manifiesta el juez tiene el deber constitucional de declararla de oficio.",
      "Sí, pero únicamente si el Ministerio Público Fiscal formula dictamen expreso solicitándolo en el expediente.",
      "No, salvo que el acto jurídico haya sido celebrado por un menor de edad emancipado por matrimonio."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación, Art. 388: 'La nulidad relativa sólo puede declararse a instancia de las personas en cuyo beneficio se establece... No puede ser declarada por el juez de oficio...'",
    puntos_base: 50
  },
  {
    id: "civ-04",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 19 del Código Civil y Comercial de la Nación, ¿en qué momento comienza legalmente la existencia de la persona humana?",
    opciones: [
      "Con la concepción.",
      "Al momento del nacimiento con vida.",
      "Con la inscripción en el Registro del Estado Civil.",
      "Al cumplir los 13 años de edad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación, Art. 19: 'La existencia de la persona humana comienza con la concepción'.",
    puntos_base: 10
  },
  {
    id: "civ-05",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "media",
    pregunta: "Según el artículo 25 del CCyCN, ¿cómo clasifica el ordenamiento civil a la persona menor de edad que ha cumplido los trece (13) años?",
    opciones: [
      "Adolescente.",
      "Incapaz absoluto de ejercicio.",
      "Mayor de edad relativo.",
      "Menor de edad emancipado por edictos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación, Art. 25: 'Menor de edad es la persona que no ha cumplido dieciocho años. Adolescente es la persona menor de edad que cumplió trece años'.",
    puntos_base: 25
  },
  {
    id: "civ-06",
    id_categoria: "derecho_civil",
    categoria_nombre: "Derecho Civil",
    dificultad: "dificil",
    pregunta: "En el régimen de responsabilidad civil del principal por el hecho del dependiente (Art. 1753 CCyCN), si el principal demuestra que actuó sin culpa personal en la selección y vigilancia del dependiente, ¿se exime de responsabilidad?",
    opciones: [
      "No, pues se trata de una responsabilidad objetiva donde la falta de culpa del principal no constituye eximente.",
      "Sí, la prueba fehaciente de la diligencia en la selección libera íntegramente al principal.",
      "Sí, pero únicamente si el dependiente actuó con dolo exclusivo sin su conocimiento.",
      "No, salvo que el dependiente fuere contratado a través de una empresa de servicios eventuales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Civil y Comercial de la Nación, Art. 1753: 'El principal responde objetivamente por los daños que causen los que están bajo su dependencia... La falta de culpa no exime de responsabilidad'.",
    puntos_base: 50
  },

  // --- DERECHO PENAL ---
  {
    id: "pen-01",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Según el artículo 34 inciso 6° del Código Penal Argentino, ¿cuál de los siguientes es un requisito indispensable para la eximente de legítima defensa propia?",
    opciones: [
      "Falta de provocación suficiente por parte del que se defiende.",
      "Denuncia policial previa realizada dentro de las 24 horas del hecho.",
      "Desproporción deliberada en la elección del medio empleado.",
      "Intención comprobada de infligir un daño patrimonial previo al agresor."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal de la Nación Argentina, Art. 34, inc. 6°: 'El que obrare en defensa de su persona o de sus derechos, siempre que concurrieren las siguientes circunstancias: a) Agresión ilegítima; b) Necesidad racional del medio empleado para impedirla o repelerla; c) Falta de provocación suficiente por parte del que se defiende'.",
    puntos_base: 10
  },
  {
    id: "pen-02",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "¿Cuál es la escala penal contemplada en el artículo 79 del Código Penal Argentino para el delito de Homicidio Simple?",
    opciones: [
      "Reclusión o prisión de ocho (8) a veinticinco (25) años.",
      "Prisión de seis (6) a veinte (20) años.",
      "Reclusión o prisión perpetua en todos los casos.",
      "Prisión de diez (10) a quince (15) años inexcusables."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal Argentino, Art. 79: 'Se aplicará reclusión o prisión de ocho a veinticinco años, al que matare a otro siempre que en este Código no se estableciere otra pena'.",
    puntos_base: 25
  },
  {
    id: "pen-03",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "dificil",
    pregunta: "Si un individuo inicia la ejecución de un delito consumando de paso una violación de domicilio, pero luego desiste voluntariamente de cometer el ilícito principal proyectado, ¿qué consecuencia jurídica establece el artículo 43 del Código Penal?",
    opciones: [
      "Queda exento de pena por el delito principiado del que desistió, pero responde por el delito consumado de violación de domicilio.",
      "Queda totalmente exento de pena por todos los actos realizados, incluidos los delitos ya consumados en el trayecto.",
      "Sufre la pena del delito principal reducida a la mitad por imperio de la tentativa desistida.",
      "El desistimiento no produce efectos liberatorios cuando se han consumado delitos subsidiarios."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal Argentino, Art. 43: 'El que desistiere voluntariamente del delito, no estará sujeto a pena', en concordancia con la dogmática penal uniforme según la cual el desistimiento no borra la punibilidad de los delitos independientes ya consumados.",
    puntos_base: 50
  },
  {
    id: "pen-04",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "facil",
    pregunta: "Conforme al Régimen Penal de la Minoridad (Ley 22.278), ¿a qué edad se fija el límite absoluto de no punibilidad penal de un menor de edad?",
    opciones: [
      "No es punible el menor que no haya cumplido dieciséis (16) años de edad.",
      "No es punible el menor que no haya cumplido catorce (14) años de edad.",
      "No es punible el menor que no haya cumplido dieciocho (18) años de edad.",
      "No es punible el menor que no haya cumplido doce (12) años de edad."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 22.278 (Régimen Penal de la Minoridad), Art. 1°: 'No es punible el menor que no haya cumplido dieciséis años de edad'.",
    puntos_base: 10
  },
  {
    id: "pen-05",
    id_categoria: "derecho_penal",
    categoria_nombre: "Derecho Penal",
    dificultad: "media",
    pregunta: "En el delito de Robo Calificado por el uso de armas (Art. 166 inc. 2° CP), si se acredita que el arma utilizada no era apta para el disparo, ¿cómo se escala legalmente la pena?",
    opciones: [
      "La pena será de tres (3) a diez (10) años de prisión.",
      "Se aplica la pena del robo simple sin agravante alguna.",
      "La pena se eleva al máximo legal de veinticinco (25) años de prisión.",
      "El hecho se transforma en tentativa de hurto en concurso ideal."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Código Penal Argentino, Art. 166 inc. 2° in fine: 'Si se cometiere el robo con un arma de fuego cuya aptitud para el disparo no pudiera tenerse de ningún modo por acreditada... la pena será de tres a diez años de prisión'.",
    puntos_base: 25
  },

  // --- DERECHO CONSTITUCIONAL ---
  {
    id: "con-01",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "De acuerdo con el artículo 30 de la Constitución Nacional Argentina, ¿qué mayoría especial se requiere en el Congreso para declarar la necesidad de la reforma constitucional?",
    opciones: [
      "Al menos las dos terceras partes de los miembros del Congreso.",
      "La mayoría absoluta de los miembros presentes en cada Cámara.",
      "Tres cuartas partes de los votos de los Senadores nacionales.",
      "Unanimidad de ambas Cámaras reunidas en Asamblea Legislativa."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional Argentina, Art. 30: 'La Constitución puede ser reformada en el todo o en cualquiera de sus partes. La necesidad de reforma debe ser declarada por el Congreso con el voto de dos terceras partes, al menos, de sus miembros...'",
    puntos_base: 10
  },
  {
    id: "con-02",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "¿Qué tipo de sistema de control de constitucionalidad rige en el ordenamiento jurídico argentino a nivel federal?",
    opciones: [
      "Sistema difuso, ejercido por todos y cada uno de los jueces de cualquier instancia.",
      "Sistema concentrado, ejercido de manera exclusiva por un Tribunal Constitucional especial.",
      "Sistema Político, a cargo del Senado de la Nación.",
      "Sistema preventivo, ejercido por el Procurador del Tesoro antes de la promulgación."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina Constitucional Argentina uniforme y Fallos de la CSJN desde 'Sojo' (1887) y 'Elortondo' (1888): El sistema de control de constitucionalidad argentino es judicial y difuso.",
    puntos_base: 25
  },
  {
    id: "con-03",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "dificil",
    pregunta: "Conforme a la doctrina sentada por la CSJN en el precedente 'Rodríguez Pereyra' (2012), ¿cuál es el criterio respecto al control de constitucionalidad de oficio por parte de los magistrados?",
    opciones: [
      "Los jueces tienen la facultad y el deber de efectuar el control de constitucionalidad de oficio sin que ello vulnere la división de poderes ni la defensa en juicio.",
      "El control de oficio está expresamente prohibido por vulnerar la división de poderes, requiriéndose siempre petición formal de parte.",
      "Solo la Corte Suprema de Justicia de la Nación puede ejercer el control de oficio, estando vedado a los tribunales inferiores.",
      "El control de oficio solo procede si la norma cuestionada es un decreto de necesidad y urgencia anterior a 1994."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "CSJN, Fallos 335:2333 ('Rodríguez Pereyra, Luis Raúl c/ Ejército Argentino', 2012), ratificando la doctrina de Fallos 324:4330 ('Banco Comercial de Finanzas'), donde se estableció la validez y el deber de los jueces de declarar de oficio la inconstitucionalidad de las normas.",
    puntos_base: 50
  },
  {
    id: "con-04",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "facil",
    pregunta: "Según el artículo 18 de la Constitución Nacional Argentina, ¿cuál de los siguientes principios consagra la garantía del Debido Proceso?",
    opciones: [
      "Ningún habitante de la Nación puede ser penado sin juicio previo fundado en ley anterior al hecho del proceso.",
      "Los jueces son designados por el Poder Ejecutivo sin necesidad de acuerdo parlamentario.",
      "Las declaraciones del imputado prestadas bajo juramento son prueba suficiente para condena.",
      "Los juicios penales se tramitan a puerta cerrada obligatoriamente."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional Argentina, Art. 18: 'Ningún habitante de la Nación puede ser penado sin juicio previo fundado en ley anterior al hecho del proceso... Es inviolable la defensa en juicio de la persona y de los derechos'.",
    puntos_base: 10
  },
  {
    id: "con-05",
    id_categoria: "constitucional_nacional",
    categoria_nombre: "Derecho Constitucional",
    dificultad: "media",
    pregunta: "Según el artículo 99 inciso 3° de la Constitución Nacional, ¿en qué materias le está prohibido expresamente al Poder Ejecutivo dictar Decretos de Necesidad y Urgencia (DNU)?",
    opciones: [
      "Materia penal, tributaria, electoral o de régimen de los partidos políticos.",
      "Materia de obras públicas y contrataciones administrativas.",
      "Materia de organización de ministerios y secretarías de Estado.",
      "Materia de relaciones exteriores y tratados bilaterales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución Nacional Argentina, Art. 99 inc. 3°: 'El Poder Ejecutivo no podrá en ningún caso bajo pena de nulidad absoluta e insanable, emitir disposiciones de carácter legislativo. Solamente cuando circunstancias excepcionales... no regularan normas que regulen materia penal, tributaria, electoral o de régimen de los partidos políticos'.",
    puntos_base: 25
  },

  // --- DERECHO ADMINISTRATIVO ---
  {
    id: "adm-01",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "facil",
    pregunta: "Según el artículo 7° de la Ley Nacional de Procedimientos Administrativos (Ley 19.549), ¿cuál de los siguientes es expresamente un requisito esencial del acto administrativo?",
    opciones: [
      "La motivación del acto, expresando las razones de hecho y de derecho.",
      "El refrendo del Ministro de Economía de la Nación.",
      "El consentimiento previo por escrito del particular administrado.",
      "El dictamen favorable y vinculante de la Corte Suprema."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Nacional de Procedimientos Administrativos (Ley 19.549), Art. 7° inc. e: 'Motivación. Deberá ser motivado, expresándose en forma concreta las razones que inducen a emitir el acto...'",
    puntos_base: 10
  },
  {
    id: "adm-02",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "media",
    pregunta: "Conforme al Reglamento de Procedimientos Administrativos (Decreto 1759/72 T.O. 2017), ¿de qué plazo dispone el administrado para interponer el Recurso de Reconsideración?",
    opciones: [
      "Diez (10) días hábiles administrativos.",
      "Quince (15) días hábiles administrativos.",
      "Treinta (30) días corridos.",
      "Cinco (5) días hábiles judiciales."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto 1759/72 (T.O. 2017), Art. 84: 'El recurso de reconsideración deberá interponerse dentro de los diez (10) días de notificado el acto ante el mismo órgano que lo dictó'.",
    puntos_base: 25
  },
  {
    id: "adm-03",
    id_categoria: "derecho_administrativo",
    categoria_nombre: "Derecho Administrativo",
    dificultad: "dificil",
    pregunta: "Si un acto administrativo definitivo es afectado por una nulidad absoluta e insanable (Art. 14 Ley 19.549), ¿qué prerrogativa y obligación tiene la Administración pública en sede administrativa?",
    opciones: [
      "Debe revocarlo o sustituirlo de oficio por sí en sede administrativa sin necesidad de recurrir a la justicia.",
      "Está impedida de revocarlo de oficio debiendo promover obligatoriamente acción judicial de lesividad.",
      "Solo puede suspender sus efectos pero no extinguirlo definitivamente.",
      "Debe someter la nulidad a arbitraje administrativo ante la Procuración del Tesoro."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 19.549, Art. 17: 'El acto administrativo afectado de nulidad absoluta se considera irregular y debe ser revocado o sustituido por razones de ilegitimidad aún en sede administrativa...'",
    puntos_base: 50
  },

  // --- DERECHO PROVINCIAL BA ---
  {
    id: "pba-01",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "media",
    pregunta: "De conformidad con el artículo 84 de la Constitución de la Provincia de Buenos Aires, ¿cuál es el período establecido para las sesiones ordinarias de la Legislatura provincial?",
    opciones: [
      "Del 1° de marzo al 30 de noviembre de cada año, abriéndose automáticamente.",
      "Del 1° de abril al 30 de diciembre de cada año, previa convocatoria gubernamental.",
      "Del 1° de febrero al 31 de octubre de cada año, por decisión del Presidente del Senado.",
      "Del 15 de marzo al 15 de noviembre de cada año, de manera ininterrumpida."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Provincia de Buenos Aires, Art. 84: 'Las Cámaras abrirán sus sesiones ordinarias automáticamente el primer día de marzo de cada año y las cerrarán el treinta de noviembre'.",
    puntos_base: 25
  },
  {
    id: "pba-02",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "facil",
    pregunta: "Según el artículo 124 de la Constitución de la Provincia de Buenos Aires, ¿cuánto dura el mandato del Gobernador y Vicegobernador provincial?",
    opciones: [
      "Cuatro (4) años en el ejercicio de sus funciones.",
      "Seis (6) años sin posibilidad de reelección.",
      "Cinco (5) años con renovación por tercios.",
      "Tres (3) años con reelección indefinida."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Provincia de Buenos Aires, Art. 124: 'El gobernador y el vicegobernador permanecen cuatro años en el ejercicio de sus funciones...'",
    puntos_base: 10
  },
  {
    id: "pba-03",
    id_categoria: "derecho_provincial_ba",
    categoria_nombre: "Derecho Provincial BA",
    dificultad: "dificil",
    pregunta: "De acuerdo con el régimen del Jurado de Enjuiciamiento de Magistrados en la Provincia de Buenos Aires (Art. 182 Const. PBA y Ley 13.661), ¿quién preside legalmente dicho órgano?",
    opciones: [
      "El Presidente de la Suprema Corte de Justicia de la Provincia.",
      "El Ministro de Justicia y Derechos Humanos de la Provincia.",
      "El Presidente de la Cámara de Diputados bonaerense.",
      "El Procurador General ante la Suprema Corte."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Constitución de la Pcia. de Bs. As., Art. 182 y Ley 13.661 Art. 2°: 'El Jurado de Enjuiciamiento de Magistrados será presidido por el Presidente de la Suprema Corte de Justicia...'",
    puntos_base: 50
  },

  // --- NORMATIVA LOCAL LA PLATA ---
  {
    id: "lp-01",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "media",
    pregunta: "Conforme a la Ley Orgánica de las Municipalidades de la Provincia de Buenos Aires (Decreto-Ley 6769/58), ¿cuál es el órgano encargado de sancionar las Ordenanzas y Resoluciones locales?",
    opciones: [
      "El Concejo Deliberante.",
      "El Departamento Ejecutivo Municipal.",
      "El Tribunal de Faltas del Municipio.",
      "La Junta Electoral de la Provincia."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Decreto-Ley N° 6769/58 (Ley Orgánica de las Municipalidades de la Pcia. de Bs. As.), Art. 68, inc. 1°: Corresponde al Concejo Deliberante la sanción de las Ordenanzas y Resoluciones del Municipio.",
    puntos_base: 25
  },
  {
    id: "lp-02",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "facil",
    pregunta: "¿Mediante qué instrumento legal provincial y en qué año se dispuso la creación y fundación de la ciudad de La Plata como nueva Capital bonaerense?",
    opciones: [
      "Ley Provincial N° 1.469 del año 1882.",
      "Decreto-Ley N° 6.769 del año 1958.",
      "Ley Provincial N° 5.177 del año 1947.",
      "Ordenanza Municipal N° 1 del año 1910."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley Provincial N° 1.469 sancionada en mayo de 1882 durante la gobernación de Dardo Rocha, que ordenó la fundación de La Plata en el paraje Lomas de Ensenada.",
    puntos_base: 10
  },
  {
    id: "lp-03",
    id_categoria: "normativa_local_lp",
    categoria_nombre: "Derecho Municipal y Local LP",
    dificultad: "dificil",
    pregunta: "¿Quién fue el eminente ingeniero y agrimensor encargado del diseño del trazado urbanístico original, plano de diagonales y plazas perfectas de la ciudad de La Plata?",
    opciones: [
      "Ingeniero Pedro Benoit.",
      "Arquitecto Francisco Salamone.",
      "Doctor Joaquín V. González.",
      "Ingeniero Carlos Thays."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Historia de la Ciudad de La Plata: El diseño y dirección técnica del plano de la traza original de La Plata fue realizado por el Ing. Pedro Benoit a pedido del gobernador Dardo Rocha.",
    puntos_base: 50
  },

  // --- HISTORIA UNLP Y JURSOC ---
  {
    id: "unlp-01",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "media",
    pregunta: "Según el Estatuto de la Universidad Nacional de La Plata (UNLP), ¿cuál es el órgano máximo de gobierno de la Universidad?",
    opciones: [
      "La Asamblea Universitaria.",
      "El Consejo Superior.",
      "El Decanato de la Facultad de Ciencias Jurídicas y Sociales.",
      "El Colegio de Profesores Titulares."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la Universidad Nacional de La Plata (UNLP), Art. 11: 'La Asamblea Universitaria es el órgano supremo de la Universidad'.",
    puntos_base: 25
  },
  {
    id: "unlp-02",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "facil",
    pregunta: "¿Qué principio trascendental consagrado en la Reforma Universitaria de 1918 se encuentra plenamente incorporado en el Estatuto de la UNLP?",
    opciones: [
      "El Cogobierno Universitario Tripartito y la Autonomía Universitaria.",
      "La arancelamiento progresivo de los posgrados únicamente.",
      "La designación vitalicia de autoridades decanales.",
      "La eliminación de la representación estudiantil en los Consejos."
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Estatuto de la UNLP y Manifiesto Liminar de 1918: La UNLP se organiza sobre la base del cogobierno democrático de los claustros y la autonomía universitaria.",
    puntos_base: 10
  },
  {
    id: "unlp-03",
    id_categoria: "historia_unlp_jursoc",
    categoria_nombre: "UNLP y Jursoc",
    dificultad: "dificil",
    pregunta: "¿Mediante qué norma legal nacional promovida por Joaquín V. González se otorgó el carácter definitivo de Universidad Nacional a la Universidad de La Plata en 1905?",
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
