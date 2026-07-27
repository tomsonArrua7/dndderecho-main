// scripts/generateAllBatches.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUEVAS_PREGUNTAS_TODAS = [
  // =========================================================================
  // --- 1. DERECHO CIVIL (20 PREGUNTAS) ---
  // =========================================================================
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
    id_categoria: "derecho_penal", // Nota: mantenemos id_categoria derecho_civil
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

  // =========================================================================
  // --- 2. DERECHO CONSTITUCIONAL (20 PREGUNTAS) ---
  // =========================================================================
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

  // =========================================================================
  // --- 3. DERECHO ADMINISTRATIVO (20 PREGUNTAS) ---
  // =========================================================================
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

  // =========================================================================
  // --- 4. DERECHO PROVINCIAL BA (20 PREGUNTAS) ---
  // =========================================================================
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

  // =========================================================================
  // --- 5. NORMATIVA LOCAL Y MUNICIPAL LA PLATA (15 PREGUNTAS) ---
  // =========================================================================
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

  // =========================================================================
  // --- 6. HISTORIA UNLP Y JURSOC (15 PREGUNTAS) ---
  // =========================================================================
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
];

console.log(`Iniciando importación masiva de ${NUEVAS_PREGUNTAS_TODAS.length} preguntas en src/data/triviaData.ts...`);

const triviaDataPath = path.resolve(__dirname, "../src/data/triviaData.ts");
let triviaContent = fs.readFileSync(triviaDataPath, "utf-8");

const exportIndex = triviaContent.lastIndexOf("];");
if (exportIndex === -1) {
  console.error("Error: No se encontró el final del array TRIVIA_QUESTIONS.");
  process.exit(1);
}

const formatted = NUEVAS_PREGUNTAS_TODAS.map(q => `  {\n    id: ${JSON.stringify(q.id)},\n    id_categoria: ${JSON.stringify(q.id_categoria)},\n    categoria_nombre: ${JSON.stringify(q.categoria_nombre)},\n    dificultad: ${JSON.stringify(q.dificultad)},\n    pregunta: ${JSON.stringify(q.pregunta)},\n    opciones: ${JSON.stringify(q.opciones, null, 6).replace(/\n/g, "\n    ")},\n    respuesta_correcta_index: 0,\n    fundamento_juridico: ${JSON.stringify(q.fundamento_juridico)},\n    puntos_base: ${q.puntos_base}\n  }`).join(",\n");

const newContent = triviaContent.slice(0, exportIndex) + ",\n  // --- LOTE MASIVO TODAS LAS MATERIAS (Nuevas Preguntas) ---\n" + formatted + "\n" + triviaContent.slice(exportIndex);

fs.writeFileSync(triviaDataPath, newContent, "utf-8");

console.log(`✅ ¡Éxito! Se han importado ${NUEVAS_PREGUNTAS_TODAS.length} preguntas adicionales en src/data/triviaData.ts.`);
