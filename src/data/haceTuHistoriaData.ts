export interface SkillDefinition {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  beneficio: string;
}

export interface ImpactoStats {
  prestigio: number;
  contactos: number;
  etica: number;
  billetera: number;
}

export interface OpcionDilema {
  id: string;
  texto: string;
  impacto: ImpactoStats;
  requiereSkillId?: string;
  feedbackNarrativo: string;
}

export interface TemporadaDilema {
  id: number;
  edadInicio: number;
  edadFin: number;
  puesto: string;
  titulo: string;
  contextoEscenario: string;
  dilemaTexto: string;
  opciones: OpcionDilema[];
}

export const SKILLS_DISPONIBLES: SkillDefinition[] = [
  {
    id: "litigio_penal",
    nombre: "Litigio Penal & Garantías",
    icono: "Scale",
    descripcion: "Dominio técnico del procedimiento penal bonaerense, habeas corpus y estrategia procesal contundente.",
    beneficio: "Desbloquea maniobras de defensa técnica de alto prestigio en causas complejas."
  },
  {
    id: "contratos",
    nombre: "Estrategia Contractual & Corporativo",
    icono: "FileText",
    descripcion: "Pericia para blindar negocios, detectar contingencias y negociar acuerdos comerciales millonarios.",
    beneficio: "Desbloquea soluciones financieras superiores y negociación corporativa."
  },
  {
    id: "rosca_politica",
    nombre: "Oratoria & Rosca Política",
    icono: "Users",
    descripcion: "Manejo fluido de influencias en la UNLP, el Colegio de Abogados de La Plata y la Administración Pública PBA.",
    beneficio: "Desbloquea acuerdos políticos e intermediación institucional directa."
  },
  {
    id: "ciberseguridad",
    nombre: "Ciberseguridad & Derecho Tecnológico",
    icono: "ShieldCheck",
    descripcion: "Especialista en prueba informática, evidencia digital, delincuencia financiera e inteligencia artificial.",
    beneficio: "Desbloquea peritajes informáticos inapelables e innovación en Antigravity."
  }
];

export const TEMPORADAS_JUEGO: TemporadaDilema[] = [
  {
    id: 1,
    edadInicio: 23,
    edadFin: 25,
    puesto: "Abogado Asociado Junior",
    titulo: "Temporada 1: El Bautismo de Fuego en Antigravity",
    contextoEscenario: "Tras egresar de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP y jurar en el Colegio de Abogados en calle 13, fuiste contratado por 'Antigravity', una firma legal innovadora de La Plata. El estudio combina litigación estratégica con herramientas digitales avanzadas. Tu primer gran encargo involucra a un conocido empresario gastronómico del circuito nocturno platense acusado por la UFI N° 7 de presunta estafa procesal y maniobras contables.",
    dilemaTexto: "El cliente exige frenar una orden de inspección contable inminente y te ofrece una abultada suma en efectivo 'por fuera' para que dilates la medida o desvíes las pruebas antes del operativo.",
    opciones: [
      {
        id: "t1_op1",
        texto: "Rechazar maniobras y seguir el debido proceso estricto en la UFI N° 7.",
        impacto: { prestigio: 15, contactos: 0, etica: 20, billetera: -10 },
        feedbackNarrativo: "Mantuviste la integridad procesal impecable. Aunque el cliente rezongó por la falta de 'flexibilidad', los jueces de garantías respetaron tu escrito y tu reputación en pasillos comenzó limpia."
      },
      {
        id: "t1_op2",
        texto: "Aceptar la suma en efectivo e interponer recursos dilatorios límite.",
        impacto: { prestigio: -10, contactos: 5, etica: -25, billetera: 30 },
        feedbackNarrativo: "Lograste ganar tiempo y cobraste una sustanciosa comisión extra. Sin embargo, en la Fiscalía comenzó a circular el rumor sobre tus métodos poco transparentes."
      },
      {
        id: "t1_op3",
        texto: "Mover contactos políticos con ex-compañeros de Jursoc en la Gobernación.",
        impacto: { prestigio: 0, contactos: 25, etica: -10, billetera: 5 },
        feedbackNarrativo: "Un llamado oportuno desde calle 6 desvió la atención del fiscal hacia otra causa secundaria. Te hiciste de un favor valioso, aunque quedaste debiendo una atención política."
      },
      {
        id: "t1_op4_penal",
        texto: " Planteamiento de Nulidad Técnica por vicio probatorio en el expediente.",
        impacto: { prestigio: 25, contactos: 10, etica: 10, billetera: 15 },
        requiereSkillId: "litigio_penal",
        feedbackNarrativo: "¡Jugada maestra! Detectaste un defecto insanable en la notificación de la UFI. El juez declaró nulo el procedimiento, ganando la causa limpiamente y consagrándote en Antigravity."
      },
      {
        id: "t1_op4_contratos",
        texto: " Reestructuración express del patrimonio empresarial en un fideicomiso blindado.",
        impacto: { prestigio: 20, contactos: 5, etica: 5, billetera: 25 },
        requiereSkillId: "contratos",
        feedbackNarrativo: "Diseñaste una arquitectura de fideicomiso comercial impecable. La firma quedó 100% protegida dentro de la normativa legal bonaerense y los socios de Antigravity te felicitaron."
      },
      {
        id: "t1_op4_rosca",
        texto: " Negociar un acuerdo institucional de mediación con la cámara gastronómica.",
        impacto: { prestigio: 10, contactos: 30, etica: 10, billetera: 10 },
        requiereSkillId: "rosca_politica",
        feedbackNarrativo: "Convocaste a una mesa de diálogo en el Colegio de Abogados. El conflicto se cerró sin llegar a juicio penal y ganaste la confianza de los dirigentes de la ciudad."
      },
      {
        id: "t1_op4_ciber",
        texto: " Peritaje digital informático que demuestra una suplantación de identidad contable.",
        impacto: { prestigio: 25, contactos: 15, etica: 15, billetera: 20 },
        requiereSkillId: "ciberseguridad",
        feedbackNarrativo: "Extrajiste metadatos bancarios e IPs que demostraron que el fraude fue cometido por un ex-empleado mediante un malware informático. Caso cerrado con aplausos."
      }
    ]
  },
  {
    id: 2,
    edadInicio: 25,
    edadFin: 27,
    puesto: "Abogado Senior de Litigios en Antigravity",
    titulo: "Temporada 2: El Amparo Ambiental y los Intereses de la Ciudad",
    contextoEscenario: "Ascendiste a Abogado Senior a los 25 años. Antigravity ha crecido de manera exponencial. Se presenta en tu despacho un colectivo de vecinos de la zona de Gonnet y Villa Elisa solicitando un amparo colectivo por contaminación ambiental de napas subterráneas contra una poderosa desarrolladora inmobiliaria... que resulta ser cliente corporativo de uno de los socios mayores de tu estudio.",
    dilemaTexto: "Existe un claro conflicto de intereses. Si aceptás la representación de los vecinos perjudicados, ponés en riesgo tu estabilidad dentro de Antigravity. Si defendés a la desarrolladora, perjudicás a la comunidad platense.",
    opciones: [
      {
        id: "t2_op1",
        texto: "Asumir la querella comunitaria por el amparo ambiental contra viento y marea.",
        impacto: { prestigio: 25, contactos: 10, etica: 30, billetera: -15 },
        feedbackNarrativo: "El amparo fue portada en los diarios locales. Lograste una medida cautelar que detuvo la obra. Tu ética brilló en toda La Plata, aunque perdiste el bono corporativo del estudio."
      },
      {
        id: "t2_op2",
        texto: "Defender férreamente a la empresa desarrolladora asegurando millonarias ganancias.",
        impacto: { prestigio: -15, contactos: -10, etica: -30, billetera: 35 },
        feedbackNarrativo: "Frenaste la medida cautelar a favor de la corporación. Facturaste honorarios altísimos para el estudio, pero los vecinos marcharon frente a los tribunales con carteles señalándote."
      },
      {
        id: "t2_op3",
        texto: "Excusarte del expediente alegando impedimento ético y derivarlo estratégicamente.",
        impacto: { prestigio: 10, contactos: 15, etica: 10, billetera: 5 },
        feedbackNarrativo: "Decisión salomónica. Evitaste fisuras internas en Antigravity y recomendaste un estudio aliado para el caso, manteniendo un perfil equilibrado."
      },
      {
        id: "t2_op4_penal",
        texto: " Formular denuncia penal por estrago ambiental con prueba pericial irrefutable.",
        impacto: { prestigio: 30, contactos: 10, etica: 25, billetera: 10 },
        requiereSkillId: "litigio_penal",
        feedbackNarrativo: "Transformaste el amparo civil en una investigación penal de estrago doloso. La empresa tuvo que remediar el agua de inmediato y acordar una indemnización millonaria."
      },
      {
        id: "t2_op4_contratos",
        texto: " Redactar un Fideicomiso Ecológico de Recomposición Ambiental obligatorio.",
        impacto: { prestigio: 25, contactos: 20, etica: 20, billetera: 30 },
        requiereSkillId: "contratos",
        feedbackNarrativo: "Creaste una solución jurídica inédita en la PBA. La empresa destinó parte de sus utilidades a un fondo limpio auditado, satisfaciendo a vecinos y clientes."
      },
      {
        id: "t2_op4_rosca",
        texto: " Armar una audiencia pública en el Concejo Deliberante de La Plata.",
        impacto: { prestigio: 20, contactos: 35, etica: 15, billetera: 15 },
        requiereSkillId: "rosca_politica",
        feedbackNarrativo: "Lograste una ordenanza municipal de consenso aprobada por unanimidad. Te consolidaste como un actor político-jurídico clave en la capital bonaerense."
      },
      {
        id: "t2_op4_ciber",
        texto: " Desplegar monitoreo con sensores IoT para probar el volcado en tiempo real.",
        impacto: { prestigio: 30, contactos: 15, etica: 20, billetera: 25 },
        requiereSkillId: "ciberseguridad",
        feedbackNarrativo: "Implementaste prueba telemática inalterable registrada en Blockchain. Los jueces no tuvieron dudas y Antigravity sentó un precedente nacional en derecho digital."
      }
    ]
  },
  {
    id: 3,
    edadInicio: 27,
    edadFin: 29,
    puesto: "Socio Junior y Director de Innovación en Antigravity",
    titulo: "Temporada 3: Elecciones del Colegio de Abogados y Causa Constitucional",
    contextoEscenario: "Con 27 años tenés participación accionaria en Antigravity y encabezás el departamento de estrategia. Se aproximan las elecciones del Colegio de Abogados de La Plata (CALP). Una de las listas tradicionales te propone integrar la nómina de consejeros. Al mismo tiempo, ingresa a Antigravity un amparo constitucional masivo por los aumentos desmedidos en la Caja de Previsión Social de los abogados bonaerenses.",
    dilemaTexto: "La cúpula del Colegio de Abogados te pide que retires el amparo contra la Caja a cambio de asegurarte la Vicepresidencia de la institución y el respaldo político en la ciudad.",
    opciones: [
      {
        id: "t3_op1",
        texto: "Mantener el amparo constitucional en representación de los jóvenes matriculados.",
        impacto: { prestigio: 30, contactos: -15, etica: 25, billetera: -10 },
        feedbackNarrativo: "Los jóvenes abogados te aclamaron. La Justicia dictó la medida de no innovar. Te enfrentaste al 'establishment' colegial, ganando un enorme respeto técnico."
      },
      {
        id: "t3_op2",
        texto: "Retirar el amparo y pactar la candidatura de Vicepresidente del CALP.",
        impacto: { prestigio: -20, contactos: 35, etica: -30, billetera: 30 },
        feedbackNarrativo: "Accediste a la cúpula del Colegio de Abogados en calle 13. El peso institucional te otorgó vínculos de poder insuperables, aunque en Jursoc critican tu pragmatismo excesivo."
      },
      {
        id: "t3_op3",
        texto: "Proponer una solución intermedia mediante una subcomisión de jóvenes abogados.",
        impacto: { prestigio: 10, contactos: 15, etica: 10, billetera: 10 },
        feedbackNarrativo: "Neutralizaste la tensión armada. Lograste un descuento parcial de aportes para recién graduados sin romper tus relaciones institucionales."
      },
      {
        id: "t3_op4_penal",
        texto: " Exponer judicialmente irregularidades en los fondos de reserva de la Caja.",
        impacto: { prestigio: 35, contactos: 10, etica: 20, billetera: 20 },
        requiereSkillId: "litigio_penal",
        feedbackNarrativo: "Tu exhaustivo análisis procesal forzó una auditoría externa en la Caja. Las autoridades tuvieron que renunciar y tu nombre resonó en toda la provincia de Buenos Aires."
      },
      {
        id: "t3_op4_contratos",
        texto: " Estructurar un plan alternativo de cobertura previsional privada y cooperativa.",
        impacto: { prestigio: 25, contactos: 20, etica: 15, billetera: 35 },
        requiereSkillId: "contratos",
        feedbackNarrativo: "Diseñaste un modelo de previsión optativa que ahorró millones a los abogados jóvenes. Antigravity cerró contratos de asesoría con múltiples colegios profesionales."
      },
      {
        id: "t3_op4_rosca",
        texto: " Liderar una lista independiente obteniendo la mayoría de consejeros.",
        impacto: { prestigio: 25, contactos: 40, etica: 20, billetera: 25 },
        requiereSkillId: "rosca_politica",
        feedbackNarrativo: "¡Triunfo histórico en el CALP! Encabezaste una tercera fuerza impulsada por graduados de la UNLP y venciste a las estructuras tradicionales."
      },
      {
        id: "t3_op4_ciber",
        texto: " Lanzar la plataforma digital de fiscalización y firma transparente de actas.",
        impacto: { prestigio: 30, contactos: 25, etica: 25, billetera: 30 },
        requiereSkillId: "ciberseguridad",
        feedbackNarrativo: "Desarrollaste un sistema blockchain para las elecciones de la colegiación. Antigravity fue contratada para digitalizar Colegios de Abogados de todo el país."
      }
    ]
  },
  {
    id: 4,
    edadInicio: 29,
    edadFin: 31,
    puesto: "Socio Principal y Managing Director de Antigravity",
    titulo: "Temporada 4: El Juicio por Jurados del Siglo y el Liderazgo Antigravity",
    contextoEscenario: "Llegaste a los 29 años como Managing Partner de Antigravity. El estudio ocupa un edificio corporativo en La Plata. Se inicia el juicio por jurados más importante de la década en el Fuero Penal departamental: la acusación contra altos directivos de un consorcio financiero acusados de lavado de activos e intermediación no autorizada. El Tribunal en lo Criminal N° 2 asigna la causa.",
    dilemaTexto: "Te ofrecen encabezar la defensa corporativa con los honorarios más altos de la historia del fuero platense, pero la evidencia muestra implicaciones directas en desvío de fondos de obras públicas bonaerenses.",
    opciones: [
      {
        id: "t4_op1",
        texto: "Asumir la defensa respetando estrictamente las garantías procesales constitucionales.",
        impacto: { prestigio: 30, contactos: 20, etica: 15, billetera: 40 },
        feedbackNarrativo: "Lograste un veredicto de inocencia basado en el debido proceso ante el Jurado Popular. Tu alegato de clausura se convirtió en material de estudio obligatorio en la Jursoc UNLP."
      },
      {
        id: "t4_op2",
        texto: "Aceptar la causa pactando abreviados rápidos y comisiones de éxito bajo cuerda.",
        impacto: { prestigio: -20, contactos: 10, etica: -35, billetera: 60 },
        feedbackNarrativo: "Cerraste el negocio del siglo financieramente. Sos multimillonario, pero en los pasillos de Tribunales tu nombre quedó asociado a los negocios oscuros del fuero."
      },
      {
        id: "t4_op3",
        texto: "Asumir la querella de los ahorristas estafados renunciando al dinero corporativo.",
        impacto: { prestigio: 40, contactos: 25, etica: 40, billetera: -20 },
        feedbackNarrativo: "Elegiste el camino del compromiso social. Ganaste el juicio por jurados, recuperaste el dinero de miles de familias y te convertiste en el jurista más respetado de la provincia."
      },
      {
        id: "t4_op4_penal",
        texto: " Destrozar la acusación fiscal mediante un contrainterrogatorio pericial inolvidable.",
        impacto: { prestigio: 45, contactos: 25, etica: 25, billetera: 50 },
        requiereSkillId: "litigio_penal",
        feedbackNarrativo: "Demostraste inconsistencias científicas en el peritaje oficial. El Jurado emitió veredicto de 'No Culpable' por unanimidad. Antigravity alcanzó la cima del derecho penal argentino."
      },
      {
        id: "t4_op4_contratos",
        texto: " Demostrar la licitud de las operaciones mediante auditoría de cumplimiento compliance.",
        impacto: { prestigio: 40, contactos: 30, etica: 30, billetera: 55 },
        requiereSkillId: "contratos",
        feedbackNarrativo: "Presentaste un programa de Compliance corporativo impecable que probó la ausencia de dolo. Antigravity firmó alianzas estratégicas con firmas de Nueva York y Madrid."
      },
      {
        id: "t4_op4_rosca",
        texto: " Consolidar a Antigravity como el principal polo de consultoría legal y jurídica del país.",
        impacto: { prestigio: 35, contactos: 50, etica: 25, billetera: 45 },
        requiereSkillId: "rosca_politica",
        feedbackNarrativo: "Transformaste el caso en una reforma legislativa de fondo. Fuiste nombrado Conjuez de la Suprema Corte de Justicia PBA y docente titular en Jursoc UNLP."
      },
      {
        id: "t4_op4_ciber",
        texto: " Rastrear la ruta del dinero mediante peritaje en Blockchain probando origen legítimo.",
        impacto: { prestigio: 45, contactos: 35, etica: 30, billetera: 55 },
        requiereSkillId: "ciberseguridad",
        feedbackNarrativo: "Utilizaste trazabilidad forense digital para desmantelar la hipótesis fiscal. Creaste la primera división de LegalTech y Forensia Digital de Latinoamérica."
      }
    ]
  }
];
