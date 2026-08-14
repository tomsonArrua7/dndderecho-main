import { TriviaQuestion } from './triviaData';

export const EXTRA_MATERIAS_QUESTIONS: TriviaQuestion[] = [
  // =========================================================================
  // 10123: DERECHO PRIVADO II - CIVIL (OBLIGACIONES Y RESPONSABILIDAD CIVIL)
  // =========================================================================
  {
    id: "10123-ob-01", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "facil",
    pregunta: "Según el Art. 724 del CCyCN, la obligación es una relación jurídica en virtud de la cual el acreedor tiene el derecho a exigir del deudor:",
    opciones: [
      "Un favor personal sin valor pecuniario",
      "Una prestación destinada a satisfacer un interés lícito y, ante el incumplimiento, a obtener forzadamente la satisfacción de dicho interés",
      "Una sanción penal privativa de la libertad",
      "La cesión obligatoria de todos sus bienes inmuebles"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 724 del Código Civil y Comercial de la Nación: Definición legal de obligación.", puntos_base: 100
  },
  {
    id: "10123-ob-02", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "facil",
    pregunta: "¿Cuáles son los cuatro elementos esenciales de toda relación obligacional?",
    opciones: [
      "Sujetos (activo y pasivo), Objeto (prestación), Causa Fuente y Vínculo Jurídico",
      "Acreedor, Juez, Sentencia y Embargo",
      "Contrato, Firma, Escribano y Registro",
      "Dinero, Plazo, Interés y Garantía"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Doctrina general de las Obligaciones (Alterini, Llambías, Borda).", puntos_base: 100
  },
  {
    id: "10123-ob-03", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "En el régimen del CCyCN (Art. 886), la regla general respecto a la mora del deudor es:",
    opciones: [
      "La mora por interpelación judicial previa obligatoria",
      "La mora automática por el solo transcurso del tiempo fijado para el cumplimiento",
      "La mora por intimación extrajudicial mediante carta documento",
      "La mora requiere siempre acuerdo expreso en audiencia"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 886 del CCyCN: 'La mora del deudor se produce por el solo transcurso del tiempo fijado para el cumplimiento de la obligación'.", puntos_base: 100
  },
  {
    id: "10123-ob-04", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "¿Qué cuatro presupuestos inexcusables exige la Responsabilidad Civil para que nazca el deber de resarcir?",
    opciones: [
      "Antijuridicidad, Daño resarcible, Factor de atribución y Nexo de causalidad",
      "Culpa, Delito, Dolo y Querella",
      "Demanda, Notificación, Rebeldía y Sentencia",
      "Incumplimiento, Intimación, Testigos y Peritaje"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 1716, 1721, 1726 y 1737 del CCyCN.", puntos_base: 100
  },
  {
    id: "10123-ob-05", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "dificil",
    pregunta: "En la responsabilidad objetiva (Art. 1757 CCyCN) por el riesgo o vicio de la cosa, ¿cuál de las siguientes es una eximente válida?",
    opciones: [
      "La falta de culpa del dueño o guardián",
      "El hecho de la víctima o de un tercero por quien no se debe responder, o el caso fortuito ajeno al riesgo",
      "Haber contratado un seguro de caución",
      "La ignorancia del vicio de la cosa"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 1729, 1730 y 1757 del CCyCN. La falta de culpa no es eximente en la responsabilidad objetiva.", puntos_base: 100
  },
  {
    id: "10123-ob-06", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "¿Qué diferencia existe entre las obligaciones solidarias (Art. 827) y las obligaciones concurrentes (Art. 850)?",
    opciones: [
      "No hay ninguna diferencia jurídica",
      "En las solidarias hay causa fuente única; en las concurrentes hay pluralidad de deudores por causas fuentes distintas e independientes",
      "Las concurrentes solo se aplican en derecho comercial",
      "En las solidarias cada deudor paga solo su cuota parte"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 827 y 850 del CCyCN: Distinción entre solidaridad y concurrencia obligacional.", puntos_base: 100
  },
  {
    id: "10123-ob-07", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "facil",
    pregunta: "Para que el pago sea extintivo y válido según el CCyCN, debe reunir cuatro requisitos de exactitud:",
    opciones: [
      "Identidad, Integridad, Puntualidad y Localización",
      "Forma, Firma, Sello y Recibo",
      "Cheque, Transferencia, Efectivo y Depósito",
      "Testigos, Acta, Escribano y Homologación"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 867 a 874 del CCyCN: Principios de identidad, integridad, puntualidad y localización del pago.", puntos_base: 100
  },
  {
    id: "10123-ob-08", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "¿En qué consiste la 'compensación' como modo de extinción de las obligaciones (Art. 921 CCyCN)?",
    opciones: [
      "En la sustitución de una obligación por otra nueva",
      "En la extinción recíproca de dos deudas cuando dos personas reúnen la calidad de acreedor y deudor recíprocamente",
      "En el perdón gratuito de la deuda por el acreedor",
      "En el cumplimiento mediante entrega de un inmueble"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 921 del CCyCN: Definición y efectos de la compensación legal.", puntos_base: 100
  },
  {
    id: "10123-ob-09", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "dificil",
    pregunta: "¿Cuál es el plazo genérico de la prescripción liberatoria en el Código Civil y Comercial (Art. 2560), salvo norma especial?",
    opciones: [
      "10 años",
      "5 años",
      "2 años",
      "3 años"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 2560 del CCyCN: 'El plazo de la prescripción es de cinco años, excepto que esté previsto uno diferente'.", puntos_base: 100
  },
  {
    id: "10123-ob-10", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "Las 'astreintes' o sanciones conminatorias pecuniarias previstas en el Art. 804 del CCyCN tienen por objeto:",
    opciones: [
      "Indemnizar el daño moral de la víctima",
      "Constreñir al cumplimiento de los deberes jurídicos impuestos en una resolución judicial",
      "Multar al juez que demora la sentencia",
      "Sancionar penalmente al deudor insolvente"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 804 del CCyCN: Sanciones conminatorias judiciales.", puntos_base: 100
  },
  {
    id: "10123-ob-11", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "facil",
    pregunta: "La 'novación' como modo de extinción obligacional (Art. 933 CCyCN) se produce cuando:",
    opciones: [
      "Se extingue una obligación por la creación de otra nueva destinada a reemplazarla",
      "El acreedor recibe una parte del dinero y perdona el resto",
      "El deudor cae en estado de insolvencia",
      "Se unifican las calidades de acreedor y deudor en la misma persona"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 933 del CCyCN: Definición de novación.", puntos_base: 100
  },
  {
    id: "10123-ob-12", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "En las obligaciones de dar sumas de dinero (Art. 765 CCyCN), si se pactó entregar moneda que no sea de curso legal (ej. dólares), el deudor puede liberarse:",
    opciones: [
      "Únicamente entregando la especie pactada sin excepción",
      "Dando el equivalente en moneda de curso legal al cambio oficial aplicable",
      "Entregando bienes muebles en compensación",
      "Solicitando la anulación inmediata del contrato"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 765 del CCyCN: Régimen de obligaciones en moneda extranjera.", puntos_base: 100
  },
  {
    id: "10123-ob-13", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "dificil",
    pregunta: "La acción directa (Art. 736 CCyCN) es la que compete al acreedor para percibir de un tercero lo que éste adeuda a su deudor. Es de carácter:",
    opciones: [
      "Universal y ejecutoria de oficio",
      "Excepcional, de interpretación restrictiva y sólo procede en los casos expresamente previstos por la ley",
      "Disponible para cualquier tipo de crédito sin requisito previo",
      "Subsidiaria a la acción penal"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 736 a 738 del CCyCN: Requisitos y efectos de la acción directa.", puntos_base: 100
  },
  {
    id: "10123-ob-14", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "media",
    pregunta: "En la función preventiva de la responsabilidad civil (Art. 1710 CCyCN), toda persona tiene el deber de:",
    opciones: [
      "Evitar causar un daño no justificado, adoptar medidas razonables para evitarlo o disminuir su magnitud",
      "Denunciar policialmente a cualquier persona sospechosa",
      "Indemnizar los daños que pudieran ocurrir en el futuro de forma tarifada",
      "Contratar un seguro contra todo riesgo"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 1710 del CCyCN: Deber de prevención del daño.", puntos_base: 100
  },
  {
    id: "10123-ob-15", id_categoria: "10123", categoria_nombre: "Derecho Privado II - Civil", dificultad: "facil",
    pregunta: "¿Qué comprende el daño patrimonial resarcible según el Art. 1738 del CCyCN?",
    opciones: [
      "Únicamente el dinero en efectivo perdido",
      "El daño emergente (pérdida sufrida) y el lucro cesante (ganancia frustrada), más la pérdida de chances",
      "Solo los gastos de honorarios judiciales",
      "Exclusivamente el valor fiscal de las cosas"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1738 del CCyCN: Indemnización y rubros resarcibles.", puntos_base: 100
  },

  // =========================================================================
  // 10132: DERECHO PRIVADO IV - COMERCIAL (TÍTULOS VALORES & CONSUMIDOR)
  // =========================================================================
  {
    id: "10132-tv-01", id_categoria: "10132", categoria_nombre: "Derecho Privado IV - Comercial", dificultad: "facil",
    pregunta: "Los caracteres esenciales de los títulos valores cartulares según la doctrina y el CCyCN son:",
    opciones: [
      "Necesidad, Literalidad, Autonomía y Legitimación",
      "Escritura pública, Registro, Homologación y Protocolo",
      "Publicidad, Gratuidad, Inembargabilidad y Bilateralidad",
      "Consensualidad, Onerosidad, Formalidad y Cláusula penal"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 1815 y ss. del CCyCN: Teoría general de los títulos valores.", puntos_base: 100
  },
  {
    id: "10132-tv-02", id_categoria: "10132", categoria_nombre: "Derecho Privado IV - Comercial", dificultad: "media",
    pregunta: "En la Ley de Cheques (Ley 24.452), ¿cuál es el plazo de validez para la presentación al cobro de un cheque común en Argentina?",
    opciones: [
      "15 días corridos",
      "30 días corridos contados desde su fecha de creación",
      "60 días hábiles bancarios",
      "1 año calendario"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 25 de la Ley 24.452 de Cheques.", puntos_base: 100
  },
  {
    id: "10132-tv-03", id_categoria: "10132", categoria_nombre: "Derecho Privado IV - Comercial", dificultad: "media",
    pregunta: "El 'aval' cambiario en un pagaré o letra de cambio se distingue de la 'fianza' civil porque:",
    opciones: [
      "Es una garantía cambiaria autónoma que es válida aun cuando la obligación garantizada sea nula por causa que no sea vicio de forma",
      "Requiere siempre beneficio de excusión previo del deudor",
      "Es una garantía bilateral que solo cubre la mitad de la deuda",
      "Solo puede ser otorgado por entidades financieras autorizadas"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Dec-Ley 5965/63, Arts. 32 a 34: Carácter autónomo del aval cambiario.", puntos_base: 100
  },
  {
    id: "10132-tv-04", id_categoria: "10132", categoria_nombre: "Derecho Privado IV - Comercial", dificultad: "facil",
    pregunta: "En la Ley de Defensa del Consumidor (Ley 24.240), el principio 'in dubio pro consumidor' (Art. 3) establece que:",
    opciones: [
      "En caso de duda sobre la interpretación de las normas o del contrato, prevalece la más favorable al consumidor",
      "El proveedor tiene derecho a rescindir unilateralmente sin indemnización",
      "Las cláusulas de letra chica son siempre obligatorias",
      "El consumidor debe probar la culpa del fabricante en todo reclamo"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 3 de la Ley 24.240 y Art. 1094 del CCyCN.", puntos_base: 100
  },
  {
    id: "10132-tv-05", id_categoria: "10132", categoria_nombre: "Derecho Privado IV - Comercial", dificultad: "dificil",
    pregunta: "El daño punitivo previsto en el Art. 52 bis de la Ley 24.240 consiste en una multa civil que el juez puede aplicar a favor del consumidor cuando el proveedor:",
    opciones: [
      "Demora el envío por más de 48 horas",
      "Actúa con grave indiferencia, dolo o culpa grave hacia los derechos del usuario o consumidor",
      "No entrega factura en soporte papel",
      "Presenta concurso preventivo"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 52 bis de la Ley 24.240 de Defensa del Consumidor.", puntos_base: 100
  },
  {
    id: "10132-tv-06", id_categoria: "10132", categoria_nombre: "Derecho Privado IV - Comercial", dificultad: "media",
    pregunta: "El endoso de un título valor nominativo endosable transmite:",
    opciones: [
      "Todos los derechos resultantes del título al endosatario de forma autónoma",
      "Solo una mera autorización para cobrar por cuenta del librador",
      "Una cesión de créditos ordinaria sujeta a las defensas personales del deudor contra el endosante",
      "Únicamente los intereses compensatorios devengados"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 1838 a 1842 CCyCN y Dec-Ley 5965/63.", puntos_base: 100
  },

  // =========================================================================
  // 10133: DERECHO PRIVADO III - CIVIL (CONTRATOS PARTE GENERAL Y ESPECIAL)
  // =========================================================================
  {
    id: "10133-ct-01", id_categoria: "10133", categoria_nombre: "Derecho Privado III - Civil", dificultad: "facil",
    pregunta: "Según el Art. 957 del CCyCN, el contrato es el acto jurídico mediante el cual dos o más partes manifiestan su consentimiento para:",
    opciones: [
      "Modificar normas penales y procesales",
      "Crear, regular, modificar, transferir o extinguir relaciones jurídicas patrimoniales",
      "Constituir únicamente sociedades anónimas",
      "Someterse a la jurisdicción exclusiva de tribunales extranjeros"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 957 del CCyCN: Definición legal de contrato.", puntos_base: 100
  },
  {
    id: "10133-ct-02", id_categoria: "10133", categoria_nombre: "Derecho Privado III - Civil", dificultad: "media",
    pregunta: "La 'cláusula resolutoria implícita' o pacto comisorio tácito (Art. 1087 CCyCN) en los contratos bilaterales exige para resolver:",
    opciones: [
      "Un incumplimiento esencial, emplazamiento al deudor bajo apercibimiento de resolución por un plazo no menor a 15 días, y que el deudor no cumpla",
      "Iniciar juicio ordinario de 5 años sin intimación previa",
      "Que el contrato esté protocolizado ante escribano",
      "El pago previo de una fianza en sede judicial"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 1087 y 1088 del CCyCN: Cláusula resolutoria implícita y procedimiento de resolución.", puntos_base: 100
  },
  {
    id: "10133-ct-03", id_categoria: "10133", categoria_nombre: "Derecho Privado III - Civil", dificultad: "media",
    pregunta: "En el contrato de compraventa de inmuebles, la 'obligación de saneamiento' comprende las garantías por:",
    opciones: [
      "Mora involuntaria y fuerza mayor",
      "Evicción (turbación de derecho) y Vicios Ocultos o redhibitorios (defectos de la cosa)",
      "Inflación y desvalorización monetaria",
      "Falta de pago de impuestos municipales exclusivamente"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 1033, 1044 y 1051 del CCyCN: Garantía de evicción y vicios redhibitorios.", puntos_base: 100
  },
  {
    id: "10133-ct-04", id_categoria: "10133", categoria_nombre: "Derecho Privado III - Civil", dificultad: "dificil",
    pregunta: "La 'frustración de la finalidad' del contrato (Art. 1090 CCyCN) autoriza a la parte perjudicada a declarar su resolución cuando:",
    opciones: [
      "Se arrepiente del precio pactado",
      "Una alteración extraordinaria de las circunstancias existentes al tiempo de su celebración, ajena a las partes, destruye la causa fin del contrato",
      "El deudor entra en mora automática",
      "Hay vicio de lesión subjetiva"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1090 del CCyCN: Frustración definitiva de la finalidad contractual.", puntos_base: 100
  },
  {
    id: "10133-ct-05", id_categoria: "10133", categoria_nombre: "Derecho Privado III - Civil", dificultad: "facil",
    pregunta: "En el contrato de locación habitacional según el CCyCN, el locatario puede rescindir anticipadamente el contrato:",
    opciones: [
      "Transcurridos los primeros 6 meses de vigencia notificando fehacientemente al locador",
      "Únicamente al finalizar el plazo convenido",
      "Solo con autorización judicial",
      "Pagando la totalidad de los alquileres restantes de una sola vez"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 1221 CCyCN: Resolución anticipada de la locación.", puntos_base: 100
  },

  // =========================================================================
  // 10134: DERECHO PROCESAL I
  // =========================================================================
  {
    id: "10134-pr-01", id_categoria: "10134", categoria_nombre: "Derecho Procesal I", dificultad: "facil",
    pregunta: "La 'competencia' judicial es la medida o límite en que un juez o tribunal ejerce válidamente la jurisdicción, y se determina por:",
    opciones: [
      "Materia, Territorio, Cuantía, Grado y Turno",
      "Edad del abogado y color de matrícula",
      "Voluntad del oficial de justicia",
      "Fecha de ingreso a la facultad"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 1 a 6 del CPCCBA: Reglas de competencia judicial.", puntos_base: 100
  },
  {
    id: "10134-pr-02", id_categoria: "10134", categoria_nombre: "Derecho Procesal I", dificultad: "media",
    pregunta: "En el proceso civil bonaerense (CPCCBA), las 'excepciones previas' (Art. 345) deben oponerse:",
    opciones: [
      "En los alegatos finales",
      "Dentro del plazo para contestar la demanda y en un solo escrito",
      "En la audiencia de vista de causa",
      "Únicamente en segunda instancia"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 344 y 345 del CPCCBA.", puntos_base: 100
  },
  {
    id: "10134-pr-03", id_categoria: "10134", categoria_nombre: "Derecho Procesal I", dificultad: "media",
    pregunta: "El principio de 'congruencia' procesal exige que la sentencia judicial:",
    opciones: [
      "Se dicte en el plazo de 24 horas",
      "Se ajuste estrictamente a las pretensiones y defensas oportunamente deducidas por las partes en la demanda y contestación",
      "Otorgue siempre más de lo pedido por el actor",
      "Sea aprobada por un jurado popular"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 163 inc. 6 CPCCBA: Principio de congruencia.", puntos_base: 100
  },
  {
    id: "10134-pr-04", id_categoria: "10134", categoria_nombre: "Derecho Procesal I", dificultad: "dificil",
    pregunta: "¿Qué efecto produce la declaración de rebeldía firme del demandado debidamente notificado (Art. 59 CPCCBA)?",
    opciones: [
      "La condena penal automática del demandado",
      "Crea una presunción de verdad de los hechos lícitos afirmados por el actor, a menos que sean contradichos por la prueba",
      "La clausura inmediata del proceso sin dictar sentencia",
      "La nulidad de todo lo actuado"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 59 y 60 del CPCCBA: Efectos procesales de la rebeldía.", puntos_base: 100
  },

  // =========================================================================
  // 10135: DERECHO PENAL II (PARTE ESPECIAL)
  // =========================================================================
  {
    id: "10135-pe-01", id_categoria: "10135", categoria_nombre: "Derecho Penal II", dificultad: "facil",
    pregunta: "El delito de homicidio calificado por el vínculo, alevosía, precio o femicidio (Art. 80 CP) tiene prevista la pena de:",
    opciones: [
      "8 a 25 años de prisión",
      "Prisión o reclusión perpetua",
      "10 a 15 años con libertad condicional",
      "Inhabilitación especial de 5 años"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 80 del Código Penal de la Nación.", puntos_base: 100
  },
  {
    id: "10135-pe-02", id_categoria: "10135", categoria_nombre: "Derecho Penal II", dificultad: "media",
    pregunta: "¿Cuál es la diferencia típica esencial entre la 'estafa' (Art. 172 CP) y la 'apropiación indebida' (Art. 173 inc. 2 CP)?",
    opciones: [
      "En la estafa el autor recibe la cosa por ardid o engaño inicial; en la apropiación indebida la tenencia se entrega legítimamente y luego no se restituye",
      "No hay diferencia, tienen la misma escala penal",
      "La estafa solo recae sobre bienes inmuebles",
      "La apropiación indebida exige violencia física"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 172 y 173 inc. 2 del Código Penal.", puntos_base: 100
  },
  {
    id: "10135-pe-03", id_categoria: "10135", categoria_nombre: "Derecho Penal II", dificultad: "dificil",
    pregunta: "El delito de 'Peculado' (Art. 261 CP) se configura cuando:",
    opciones: [
      "Un funcionario público sustrae caudales o efectos cuya administración, percepción o custodia le haya sido confiada por razón de su cargo",
      "Un particular soborna a un juez",
      "Un policía detiene ilegalmente a una persona",
      "Un comerciante evade el pago de tributos"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 261 del Código Penal: Delitos contra la Administración Pública.", puntos_base: 100
  },
  {
    id: "10135-pe-04", id_categoria: "10135", categoria_nombre: "Derecho Penal II", dificultad: "media",
    pregunta: "El 'Cohecho pasivo' (Art. 256 CP) sanciona al funcionario público que:",
    opciones: [
      "Dicta una sentencia contraria a la ley expresa",
      "Por sí o por persona interpuesta, recibe dinero o dádiva para hacer, retardar o dejar de hacer algo relativo a sus funciones",
      "Abandona su lugar de trabajo en horario de atención",
      "Rechaza un pedido de informes legislativo"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 256 del Código Penal: Cohecho.", puntos_base: 100
  },

  // =========================================================================
  // 10143: DERECHO PRIVADO V - CIVIL (DERECHOS REALES)
  // =========================================================================
  {
    id: "10143-dr-01", id_categoria: "10143", categoria_nombre: "Derecho Privado V - Civil", dificultad: "facil",
    pregunta: "Según el Art. 1882 del CCyCN, el derecho real es el poder jurídico, de estructura legal, que se ejerce:",
    opciones: [
      "Exclusivamente a través de un intermediario judicial",
      "Directamente sobre su objeto, en forma autónoma y que atribuye a su titular las facultades de persecución y preferencia",
      "Únicamente sobre créditos personales",
      "Solo mientras dure la tenencia precaria de la cosa"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1882 del CCyCN: Definición y caracteres de los Derechos Reales.", puntos_base: 100
  },
  {
    id: "10143-dr-02", id_categoria: "10143", categoria_nombre: "Derecho Privado V - Civil", dificultad: "media",
    pregunta: "En la adquisición derivada de derechos reales sobre inmuebles entre vivos, se exige inexcusablemente:",
    opciones: [
      "Solo boleto de compraventa firmado",
      "Título suficiente (escritura pública) y Modo suficiente (tradición posesoria efectiva)",
      "Inscripción en el Registro de la Propiedad como elemento constitutivo",
      "Aprobación municipal de planos"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 1892 y 1893 del CCyCN: Título y modo suficientes. La inscripción registral es declarativa para oponibilidad a terceros.", puntos_base: 100
  },
  {
    id: "10143-dr-03", id_categoria: "10143", categoria_nombre: "Derecho Privado V - Civil", dificultad: "media",
    pregunta: "La 'prescripción adquisitiva larga' o usucapión veinteañal sobre inmuebles (Art. 1899 CCyCN) requiere posesión ostensible y continua durante:",
    opciones: [
      "10 años con justo título y buena fe",
      "20 años sin necesidad de justo título ni buena fe",
      "5 años con pago de impuestos",
      "30 años ininterrumpidos"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 1899 del CCyCN: Prescripción adquisitiva larga.", puntos_base: 100
  },
  {
    id: "10143-dr-04", id_categoria: "10143", categoria_nombre: "Derecho Privado V - Civil", dificultad: "dificil",
    pregunta: "¿Qué acción real (Art. 2248 CCyCN) compete al titular de un derecho real para defender la existencia de su derecho ante el desapoderamiento total de la cosa?",
    opciones: [
      "Acción Negatoria",
      "Acción Confesoria",
      "Acción Reivindicatoria",
      "Acción de Deslinde"
    ],
    respuesta_correcta_index: 2,
    fundamento_juridico: "Art. 2248 del CCyCN: Acción reivindicatoria.", puntos_base: 100
  },

  // =========================================================================
  // 10640: DERECHO SOCIAL DEL TRABAJO
  // =========================================================================
  {
    id: "10640-st-01", id_categoria: "10640", categoria_nombre: "Derecho Social del Trabajo", dificultad: "facil",
    pregunta: "El principio de 'irrenunciabilidad' del Derecho del Trabajo (Art. 12 LCT) sanciona con nulidad absoluta todo acuerdo de partes que:",
    opciones: [
      "Suprima o reduzca los derechos previstos en la ley, estatutos profesionales o convenciones colectivas de trabajo",
      "Establezca un aumento de sueldo por encima de la paritaria",
      "Conceda más días de vacaciones pagas",
      "Reduzca la jornada laboral sin reducir el salario"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 12 de la LCT 20.744: Principio de irrenunciabilidad.", puntos_base: 100
  },
  {
    id: "10640-st-02", id_categoria: "10640", categoria_nombre: "Derecho Social del Trabajo", dificultad: "media",
    pregunta: "La presunción del Art. 23 de la LCT establece que el hecho de la prestación de servicios hace presumir:",
    opciones: [
      "Un contrato de locación de servicios civiles",
      "La existencia de un contrato de trabajo, salvo que por las circunstancias se demostrara lo contrario",
      "Que el trabajador es socio de la empresa",
      "Una relación comercial no laboral"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 23 de la Ley 20.744 de Contrato de Trabajo.", puntos_base: 100
  },
  {
    id: "10640-st-03", id_categoria: "10640", categoria_nombre: "Derecho Social del Trabajo", dificultad: "dificil",
    pregunta: "La indemnización por despido arbitrario del Art. 245 LCT se calcula tomando la mejor remuneración normal y habitual multiplicada por:",
    opciones: [
      "Los años de antigüedad o fracción mayor a 3 meses",
      "El número de hijos del trabajador",
      "Los años de vida del empleado",
      "Un factor fijo de 10 sueldos"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 245 de la Ley de Contrato de Trabajo.", puntos_base: 100
  },

  // =========================================================================
  // 10650: DERECHO COLECTIVO DEL TRABAJO Y SEGURIDAD SOCIAL
  // =========================================================================
  {
    id: "10650-dc-01", id_categoria: "10650", categoria_nombre: "Derecho Colectivo del Trabajo y Seg. Social", dificultad: "facil",
    pregunta: "En la Ley de Asociaciones Sindicales (Ley 23.551), la 'personería gremial' se otorga al sindicato que:",
    opciones: [
      "Tenga más años de antigüedad fundacional",
      "Resulte ser el más representativo en su ámbito territorial y personal de actuación (mayor cantidad de afiliados cotizantes)",
      "Tenga más dinero en su patrimonio bancario",
      "Sea designado por decreto directo del Poder Ejecutivo"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 25 de la Ley 23.551 de Asociaciones Sindicales.", puntos_base: 100
  },
  {
    id: "10650-dc-02", id_categoria: "10650", categoria_nombre: "Derecho Colectivo del Trabajo y Seg. Social", dificultad: "media",
    pregunta: "Los Convenios Colectivos de Trabajo homologados por el Ministerio de Trabajo (Ley 14.250) tienen efecto 'erga omnes', lo que significa que:",
    opciones: [
      "Se aplican obligatoriamente a todos los trabajadores y empleadores comprendidos en su actividad, estén o no afiliados al sindicato",
      "Solo obligan a los delegados que firmaron el acuerdo",
      "Son meras recomendaciones éticas no vinculantes",
      "Solo rigen si cada trabajador firma un anexo individual"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 4 de la Ley 14.250 de Convenciones Colectivas de Trabajo.", puntos_base: 100
  },
  {
    id: "10650-dc-03", id_categoria: "10650", categoria_nombre: "Derecho Colectivo del Trabajo y Seg. Social", dificultad: "dificil",
    pregunta: "En la Ley de Riesgos del Trabajo (Ley 24.557), las Comisiones Médicas Jurisdiccionales constituyen una instancia:",
    opciones: [
      "Optativa a elección del trabajador",
      "Previa, obligatoria y excluyente para determinar el carácter profesional de la enfermedad o el grado de incapacidad",
      "Inconstitucional según la jurisprudencia 'Pogonza' de la CSJN",
      "Consultiva sin efecto vinculante"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 27.348 complementaria de la LRT y fallo CSJN 'Pogonza, Jonathan' (2021).", puntos_base: 100
  },

  // =========================================================================
  // 10653: DERECHO DE FAMILIA
  // =========================================================================
  {
    id: "10653-fa-01", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "facil",
    pregunta: "En el régimen patrimonial del matrimonio del CCyCN, los futuros cónyuges pueden optar entre dos regímenes:",
    opciones: [
      "Régimen de comunidad de ganancias o Régimen de separación de bienes",
      "Régimen dotal o Régimen de condominio forzoso",
      "Régimen mercantil o Régimen sucesorio",
      "No existe opción, rige obligatoriamente la separación"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 446 y 448 del CCyCN: Convenciones matrimoniales y regímenes patrimoniales.", puntos_base: 100
  },
  {
    id: "10653-fa-02", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "media",
    pregunta: "La 'compensación económica' por divorcio (Art. 441 CCyCN) procede a favor del cónyuge que:",
    opciones: [
      "Acredita la culpa del otro por adulterio",
      "Sufre un desequilibrio manifiesto que signifique un empeoramiento de su situación y que tenga por causa adecuada el vínculo matrimonial y su ruptura",
      "Tiene menos de 30 años de edad",
      "No posee título universitario"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 441 y 442 del CCyCN: Compensación económica post-divorcio.", puntos_base: 100
  },
  {
    id: "10653-fa-03", id_categoria: "10653", categoria_nombre: "Derecho de Familia", dificultad: "facil",
    pregunta: "La obligación alimentaria de los progenitores respecto de sus hijos se extiende como regla hasta los:",
    opciones: [
      "18 años",
      "21 años, extendiéndose hasta los 25 años si estudia o se capacita en un arte u oficio y no puede proveerse medios propios",
      "16 años",
      "28 años de forma irrestricta"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 658 y 663 del CCyCN: Obligación de alimentos a los hijos.", puntos_base: 100
  },

  // =========================================================================
  // 10659: DERECHO DE LAS SUCESIONES
  // =========================================================================
  {
    id: "10659-su-01", id_categoria: "10659", categoria_nombre: "Derecho de las Sucesiones", dificultad: "facil",
    pregunta: "En el derecho sucesorio argentino (Art. 2444 CCyCN), son legitimarios o herederos forzosos:",
    opciones: [
      "Los descendientes, los ascendientes y el cónyuge supérstite",
      "Los hermanos, los tíos y los sobrinos",
      "El Estado nacional y provincial",
      "Los legatarios y amigos de confianza"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 2444 del CCyCN: Herederos legitimarios.", puntos_base: 100
  },
  {
    id: "10659-su-02", id_categoria: "10659", categoria_nombre: "Derecho de las Sucesiones", dificultad: "media",
    pregunta: "¿Cuáles son las porciones legítimas inviolables en el CCyCN según el Art. 2445?",
    opciones: [
      "Descendientes: dos tercios (2/3); Ascendientes: un medio (1/2); Cónyuge: un medio (1/2)",
      "Descendientes: cuatro quintos (4/5); Cónyuge: un tercio (1/3)",
      "Todos los herederos tienen tres cuartos (3/4)",
      "La legítima fue eliminada en el nuevo código"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 2445 del CCyCN: Cuotas de porción legítima.", puntos_base: 100
  },
  {
    id: "10659-su-03", id_categoria: "10659", categoria_nombre: "Derecho de las Sucesiones", dificultad: "media",
    pregunta: "El testamento ológrafo para ser plenamente válido según el Art. 2477 del CCyCN debe:",
    opciones: [
      "Estar escrito todo entero, fechado y firmado de puño y letra por el propio testador",
      "Estar impreso a computadora con firma digital",
      "Tener la presencia obligatoria de dos escribanos públicos",
      "Ser publicado en el Boletín Oficial antes del fallecimiento"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 2477 del CCyCN: Requisitos formales del testamento ológrafo.", puntos_base: 100
  },

  // =========================================================================
  // 10115: ECONOMÍA POLÍTICA
  // =========================================================================
  {
    id: "10115-ep-01", id_categoria: "10115", categoria_nombre: "Economía Política", dificultad: "facil",
    pregunta: "En la teoría microeconómica clásica, la 'Ley de la Oferta' establece que, ceteris paribus:",
    opciones: [
      "A mayor precio de un bien, mayor será la cantidad ofrecida por los productores en el mercado",
      "A mayor precio, menor será la cantidad producida",
      "El precio no influye en la producción",
      "La oferta siempre es igual a la demanda de forma fija"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Teoría económica general (Adam Smith, Alfred Marshall).", puntos_base: 100
  },
  {
    id: "10115-ep-02", id_categoria: "10115", categoria_nombre: "Economía Política", dificultad: "media",
    pregunta: "La 'inflación' en términos macroeconómicos se define técnicamente como:",
    opciones: [
      "El aumento puntual del precio de un producto estacional",
      "El aumento generalizado y sostenido en el nivel general de precios de una economía a lo largo del tiempo",
      "La devaluación del tipo de cambio financiero únicamente",
      "El incremento del gasto público sin déficit fiscal"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Macroeconomía general y teoría monetaria.", puntos_base: 100
  },
  {
    id: "10115-ep-03", id_categoria: "10115", categoria_nombre: "Economía Política", dificultad: "media",
    pregunta: "En la teoría macroeconómica keynesiana, ante una recesión económica con desempleo, el Estado debe intervenir mediante:",
    opciones: [
      "Una política fiscal expansiva incrementando el gasto público y la demanda agregada",
      "La eliminación total del dinero circulante",
      "El aumento indiscriminado de la tasa de interés",
      "El cierre de todas las importaciones y exportaciones"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "John Maynard Keynes, 'Teoría General del Empleo, el Interés y el Dinero' (1936).", puntos_base: 100
  },
  {
    id: "10115-ep-04", id_categoria: "10115", categoria_nombre: "Economía Política", dificultad: "facil",
    pregunta: "El Producto Bruto Interno (PBI) mide:",
    opciones: [
      "El valor monetario total de todos los bienes y servicios finales producidos en un país durante un período determinado",
      "La deuda externa total del Estado",
      "Las reservas en oro del Banco Central",
      "La recaudación del impuesto a las ganancias exclusivamente"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Cuentas nacionales y macroeconomía.", puntos_base: 100
  },
  {
    id: "10115-ep-05", id_categoria: "10115", categoria_nombre: "Economía Política", dificultad: "dificil",
    pregunta: "La 'curva de Phillips' original postulaba una relación inversa en el corto plazo entre:",
    opciones: [
      "Tasa de inflación y tasa de desempleo",
      "Tasa de interés y tipo de cambio",
      "Gasto público e inversión privada",
      "Ahorro y consumo"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "A.W. Phillips (1958) y macroeconomía moderna.", puntos_base: 100
  },

  // =========================================================================
  // 10146: DERECHO AGRARIO
  // =========================================================================
  {
    id: "10146-ag-01", id_categoria: "10146", categoria_nombre: "Derecho Agrario", dificultad: "facil",
    pregunta: "En la Ley de Arrendamientos y Aparcerías Rurales (Ley 13.246), el plazo legal mínimo del contrato de arrendamiento rural es de:",
    opciones: [
      "1 año",
      "3 años",
      "5 años",
      "10 años"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 4 de la Ley 13.246 de Arrendamientos Rurales.", puntos_base: 100
  },
  {
    id: "10146-ag-02", id_categoria: "10146", categoria_nombre: "Derecho Agrario", dificultad: "media",
    pregunta: "¿Cuál es la diferencia sustancial entre el contrato de arrendamiento rural y el de aparcería rural?",
    opciones: [
      "En el arrendamiento el precio es cierto en dinero; en la aparcería las partes se reparten los frutos o utilidades de la producción",
      "El arrendamiento solo se aplica a la ganadería",
      "La aparcería es un contrato laboral regido por la LCT",
      "No hay diferencia, son términos sinónimos"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 2 y 21 de la Ley 13.246.", puntos_base: 100
  },
  {
    id: "10146-ag-03", id_categoria: "10146", categoria_nombre: "Derecho Agrario", dificultad: "media",
    pregunta: "El 'contrato accidental de hasta dos cosechas' (Art. 39 Ley 13.246) queda excluido del plazo mínimo legal siempre que:",
    opciones: [
      "Se destine a pastoreo de hasta un año o a cultivo de hasta dos cosechas",
      "El arrendatario renuncie a reclamar por vía judicial",
      "El campo sea menor a 10 hectáreas",
      "El propietario sea una sociedad anónima"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 39 de la Ley 13.246: Contratos accidentales agrarios.", puntos_base: 100
  },
  {
    id: "10146-ag-04", id_categoria: "10146", categoria_nombre: "Derecho Agrario", dificultad: "facil",
    pregunta: "La propiedad del ganado en la República Argentina se acredita fundamentalmente a través de:",
    opciones: [
      "La posesión simple en el campo",
      "La marca o señal registrada a nombre del titular",
      "Un recibo firmado de puño y letra",
      "La declaración jurada de impuestos comunales"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Ley 22.939 de Régimen de Marcas y Señales de Ganado.", puntos_base: 100
  },

  // =========================================================================
  // 10152: DERECHO DE LA NAVEGACIÓN
  // =========================================================================
  {
    id: "10152-nav-01", id_categoria: "10152", categoria_nombre: "Derecho de la Navegación", dificultad: "facil",
    pregunta: "Según la Ley de la Navegación (Ley 20.094), el 'Capitán' del buque es:",
    opciones: [
      "Una persona contratada sin facultades disciplinarias",
      "La persona encargada de la dirección y gobierno del buque, y representante legal del propietario y del armador en todos los asuntos náuticos y comerciales del viaje",
      "El dueño registral del buque",
      "Un funcionario público del Registro Nacional de Buques"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 120 a 130 de la Ley 20.094 de Navegación.", puntos_base: 100
  },
  {
    id: "10152-nav-02", id_categoria: "10152", categoria_nombre: "Derecho de la Navegación", dificultad: "media",
    pregunta: "La 'Avería Gruesa o Común' en el derecho marítimo se configura cuando:",
    opciones: [
      "Un buque choca contra el muelle por error de maniobra",
      "Se ha hecho intencional y razonablemente un sacrificio o gasto extraordinario para la seguridad común, con el objeto de preservar de un peligro a los bienes comprometidos en la expedición marítima",
      "El motor del buque sufre desgaste natural por los años de uso",
      "La carga se arruina por humedad ordinaria"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Reglas de York-Amberes y Art. 403 de la Ley 20.094.", puntos_base: 100
  },
  {
    id: "10152-nav-03", id_categoria: "10152", categoria_nombre: "Derecho de la Navegación", dificultad: "media",
    pregunta: "En el contrato de transporte marítimo de mercaderías, el 'Conocimiento de Embarque' (Bill of Lading) cumple tres funciones esenciales:",
    opciones: [
      "Recibo de la mercadería, título valor representativo de la carga y prueba del contrato de transporte",
      "Póliza de seguro, factura comercial y permiso aduanero",
      "Certificado de origen, pasaporte de la tripulación y guía de viaje",
      "Título de dominio sobre el buque"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 295 y ss. de la Ley 20.094 y Convenio de Bruselas de 1924 (Reglas de La Haya-Visby).", puntos_base: 100
  },
  {
    id: "10152-nav-04", id_categoria: "10152", categoria_nombre: "Derecho de la Navegación", dificultad: "dificil",
    pregunta: "El 'Armador' del buque según el Art. 170 de la Ley 20.094 es:",
    opciones: [
      "El astillero que construyó la nave",
      "La persona que utiliza un buque del cual tiene la disponibilidad, por cuenta y riesgo propios, armándolo y proveyéndolo de todo lo necesario para su explotación",
      "El práctico de puerto",
      "El oficial de aduana asignado"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Art. 170 de la Ley 20.094 de Navegación.", puntos_base: 100
  },

  // =========================================================================
  // 10154: DERECHO DE MINERÍA Y ENERGÍA
  // =========================================================================
  {
    id: "10154-me-01", id_categoria: "10154", categoria_nombre: "Derecho de Minería y Energía", dificultad: "facil",
    pregunta: "Según el Código de Minería de la Nación (Art. 7), las minas de primera y segunda categoría son:",
    opciones: [
      "Propiedad privada originaria de los dueños del suelo",
      "Bienes privados de la Nación o de las Provincias, según el territorio en que se encuentren, quienes conceden a los particulares el derecho de buscar y explotar",
      "Bienes del dominio público internacional",
      "Propiedad exclusiva de las empresas extranjeras concesionarias"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Arts. 7 a 10 del Código de Minería de la Nación y Art. 124 CN.", puntos_base: 100
  },
  {
    id: "10154-me-02", id_categoria: "10154", categoria_nombre: "Derecho de Minería y Energía", dificultad: "media",
    pregunta: "En la Ley Nacional de Hidrocarburos (Ley 17.319), los yacimientos de hidrocarburos líquidos y gaseosos pertenecen:",
    opciones: [
      "Al patrimonio inalienable e imprescriptible del Estado Nacional o de los Estados Provinciales según su localización territorial",
      "A la empresa que perfore el primer pozo petrolero",
      "Al dueño del campo donde se descubre el pozo",
      "A la Organización Federal de Estados Productores de Hidrocarburos (OFEPHI)"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 1 de la Ley 17.319 modificada por Ley 26.197 (Ley Corta de Hidrocarburos).", puntos_base: 100
  },
  {
    id: "10154-me-03", id_categoria: "10154", categoria_nombre: "Derecho de Minería y Energía", dificultad: "media",
    pregunta: "El 'permiso de exploración o cateo' minero (Art. 25 Código de Minería) otorga:",
    opciones: [
      "El derecho exclusivo de explorar un área determinada durante el plazo legal para descubrir sustancias minerales",
      "El derecho de expropiar sin indemnización los campos vecinos",
      "La concesión definitiva de explotación minera perpetua",
      "La libre comercialización de minerales sin pagar canon"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 25 a 30 del Código de Minería de la Nación.", puntos_base: 100
  },
  {
    id: "10154-me-04", id_categoria: "10154", categoria_nombre: "Derecho de Minería y Energía", dificultad: "dificil",
    pregunta: "En el marco regulatorio eléctrico argentino (Ley 24.065), el mercado eléctrico mayorista divide la industria en tres etapas desreguladas y reguladas:",
    opciones: [
      "Generación (en competencia), Transporte (servicio público monopólico) y Distribución (servicio público monopólico concesionado)",
      "Importación, Refinación y Venta en surtidor",
      "Extracción, Gasoductos y Venta minorista",
      "Investigación, Desarrollo y Patentes"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Ley 24.065: Marco Regulatorio Eléctrico Nacional.", puntos_base: 100
  },

  // =========================================================================
  // 10155: SOCIOLOGÍA JURÍDICA
  // =========================================================================
  {
    id: "10155-sj-01", id_categoria: "10155", categoria_nombre: "Sociología Jurídica", dificultad: "facil",
    pregunta: "La Sociología Jurídica estudia principalmente:",
    opciones: [
      "La validez formal dogmática de los artículos del código",
      "Las relaciones recíprocas entre el Derecho y la Sociedad, analizando la eficacia social de las normas, el control social y el acceso a la justicia",
      "Las técnicas de liquidación impositiva",
      "La historia de los césares romanos exclusivamente"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Sociología del Derecho (Renato Treves, Max Weber, Boaventura de Sousa Santos).", puntos_base: 100
  },
  {
    id: "10155-sj-02", id_categoria: "10155", categoria_nombre: "Sociología Jurídica", dificultad: "media",
    pregunta: "El concepto de 'anomia' desarrollado por Émile Durkheim y Robert Merton describe una situación social donde:",
    opciones: [
      "Existe un exceso de leyes penales",
      "Hay una falta, debilitamiento o desajuste de las normas sociales y jurídicas que regulan la conducta de los individuos",
      "Todos los ciudadanos cumplen perfectamente las leyes",
      "Los jueces dictan sentencias en tiempo récord"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Teoría sociológica clásica de la anomia.", puntos_base: 100
  },
  {
    id: "10155-sj-03", id_categoria: "10155", categoria_nombre: "Sociología Jurídica", dificultad: "media",
    pregunta: "Max Weber clasifica los tipos ideales de dominación legítima en:",
    opciones: [
      "Tradicional, Carismática y Racional-Legal",
      "Militar, Dictatorial y Monárquica",
      "Democrática, Aristocrática y Tiránica",
      "Pública, Privada y Mixta"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Max Weber, 'Economía y Sociedad' (1922).", puntos_base: 100
  },
  {
    id: "10155-sj-04", id_categoria: "10155", categoria_nombre: "Sociología Jurídica", dificultad: "dificil",
    pregunta: "El 'pluralismo jurídico' según la sociología jurídica contemporánea sostiene que:",
    opciones: [
      "Solo el Estado nacional tiene el monopolio de crear normas jurídicas",
      "En un mismo espacio geopolítico pueden coexistir múltiples sistemas normativos u órdenes jurídicos eficaces reconocidos por la comunidad",
      "Existen dos cámaras legislativas en el Congreso",
      "Los tratados internacionales anulan las costumbres locales"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Sociología jurídica crítica (Boaventura de Sousa Santos, Eugen Ehrlich).", puntos_base: 100
  },

  // =========================================================================
  // 10158: FINANZAS Y DERECHO FINANCIERO
  // =========================================================================
  {
    id: "10158-df-01", id_categoria: "10158", categoria_nombre: "Finanzas y Derecho Financiero", dificultad: "facil",
    pregunta: "El principio constitucional de 'Legalidad Tributaria' (nullum tributum sine lege) exige que:",
    opciones: [
      "Cualquier tributo o impuesto debe ser creado obligatoriamente por una ley formal del Congreso",
      "El Poder Ejecutivo puede crear impuestos por Decreto de Necesidad y Urgencia",
      "Los municipios pueden crear impuestos aduaneros",
      "Los impuestos son voluntarios y optativos"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Arts. 4, 17, 75 inc. 2 y 99 inc. 3 de la Constitución Nacional.", puntos_base: 100
  },
  {
    id: "10158-df-02", id_categoria: "10158", categoria_nombre: "Finanzas y Derecho Financiero", dificultad: "media",
    pregunta: "En la clasificación de los tributos, la 'Tasa' se distingue del 'Impuesto' porque:",
    opciones: [
      "El impuesto exige una contraprestación estatal individualizada; la tasa no",
      "La tasa exige la prestación efectiva o potencial de un servicio público individualizado referido al contribuyente; el impuesto no tiene contraprestación directa",
      "La tasa es siempre de carácter nacional y el impuesto provincial",
      "Las tasas son creadas por decreto y los impuestos por ordenanza"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Doctrina de Derecho Financiero y Tributario (Giuliani Fonrouge, Villegas).", puntos_base: 100
  },
  {
    id: "10158-df-03", id_categoria: "10158", categoria_nombre: "Finanzas y Derecho Financiero", dificultad: "dificil",
    pregunta: "El principio de 'No Confiscatoriedad' tributaria elaborado por la jurisprudencia de la CSJN establece que un impuesto es inconstitucional cuando:",
    opciones: [
      "Supera el 10% de la ganancia",
      "Absorbe una parte sustancial de la renta o del capital gravado (históricamente más del 33% en fallos clásicos)",
      "Se cobra a través de bancos privados",
      "No es aprobado por unanimidad legislativa"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Jurisprudencia CSJN: Fallos 'Synge', 'Mellor', 'Navarro Viola' y Art. 17 CN.", puntos_base: 100
  },
  {
    id: "10158-df-04", id_categoria: "10158", categoria_nombre: "Finanzas y Derecho Financiero", dificultad: "media",
    pregunta: "En el régimen de Coparticipación Federal de Impuestos (Ley 23.548 y Art. 75 inc. 2 CN), los impuestos indirectos internos y directos creados por la Nación son:",
    opciones: [
      "Masa coparticipable distribuible entre la Nación, las Provincias y la CABA de acuerdo a pautas objetivas de reparto",
      "Propiedad exclusiva del Tesoro Nacional sin distribución",
      "Recaudados directamente por los municipios",
      "Distribuidos según la cantidad de habitantes del último censo exclusivamente"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Art. 75 inc. 2 de la Constitución Nacional y Ley 23.548.", puntos_base: 100
  },

  // =========================================================================
  // INGRESANTE: CURSO DE INTRODUCCIÓN Y VIDA UNIVERSITARIA UNLP
  // =========================================================================
  {
    id: "ing-01", id_categoria: "ingresante", categoria_nombre: "Ingresante", dificultad: "facil",
    pregunta: "¿Qué principio histórico consagró la Reforma Universitaria de 1918 en las universidades públicas argentinas?",
    opciones: [
      "El arancelamiento obligatorio de la matrícula",
      "La autonomía universitaria, el cogobierno (docentes, graduados y estudiantes), la gratuidad y los concursos docentes públicos",
      "El examen de ingreso restrictivo y cupificado",
      "La dependencia directa del Ministerio de Educación"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Manifiesto Liminar de la Reforma Universitaria de Córdoba de 1918 y Estatuto UNLP.", puntos_base: 100
  },
  {
    id: "ing-02", id_categoria: "ingresante", categoria_nombre: "Ingresante", dificultad: "facil",
    pregunta: "¿Cuál es el órgano máximo de gobierno de la Facultad de Ciencias Jurídicas y Sociales (FCJyS UNLP)?",
    opciones: [
      "El Centro de Estudiantes",
      "El Consejo Directivo, compuesto por el Decano y representantes de los claustros de Profesores, Graduados, Estudiantes y No Docentes",
      "El Rectorado de la UNLP",
      "La Suprema Corte de Justicia"
    ],
    respuesta_correcta_index: 1,
    fundamento_juridico: "Estatuto de la Universidad Nacional de La Plata (UNLP).", puntos_base: 100
  },
  {
    id: "ing-03", id_categoria: "ingresante", categoria_nombre: "Ingresante", dificultad: "media",
    pregunta: "¿Qué sistema informático oficial de autogestión utilizan los estudiantes de la UNLP para inscribirse a cursadas y exámenes finales?",
    opciones: [
      "Sistema SIU-Guaraní",
      "Sistema SAP",
      "Moodle Central",
      "Portal AFIP"
    ],
    respuesta_correcta_index: 0,
    fundamento_juridico: "Régimen de Enseñanza y Promoción de la FCJyS UNLP.", puntos_base: 100
  }
];
