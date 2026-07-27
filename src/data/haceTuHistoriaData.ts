export interface SkillDefinition {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  beneficio: string;
}

export interface RamasPuntuacion {
  penal: number;
  civilComercial: number;
  administrativoPublico: number;
  cibertech: number;
}

export interface ImpactoStats {
  prestigio: number;
  contactos: number;
  etica: number;
  dineroPesos: number;
  impactoRamas?: Partial<RamasPuntuacion>;
}

export interface OpcionDilema {
  id: string;
  texto: string;
  impacto: ImpactoStats;
  requiereSkillId?: string;
  feedbackNarrativo: string;
}

export interface EtapaVida {
  id: number;
  edadInicio: number;
  edadFin: number;
  puesto: string;
  titulo: string;
  contextoEscenario: string;
  dilemaTexto: string;
  esFestejoRecibida?: boolean;
  esEleccionPrimerEmpleo?: boolean;
  opciones: OpcionDilema[];
}

export const SKILLS_DISPONIBLES: SkillDefinition[] = [
  {
    id: "litigio_penal",
    nombre: "Litigio Penal & Garantías",
    icono: "Scale",
    descripcion: "Especialista en derecho penal bonaerense, habeas corpus y debate en juicios por jurados.",
    beneficio: "Desbloquea maniobras de defensa técnica penal de alto nivel."
  },
  {
    id: "contratos",
    nombre: "Derecho Civil, Comercial & Corporativo",
    icono: "FileText",
    descripcion: "Dominio de contratos complejos, fideicomisos, sociedades y auditoría comercial.",
    beneficio: "Desbloquea estructuración de negocios millonarios y sociedades."
  },
  {
    id: "rosca_politica",
    nombre: "Oratoria & Derecho Público / Rosca",
    icono: "Users",
    descripcion: "Manejo fluido de influencias en la UNLP, la Gobernación PBA y el Colegio de Abogados de La Plata.",
    beneficio: "Desbloquea acuerdos políticos e intermediación con el Estado."
  },
  {
    id: "ciberseguridad",
    nombre: "Ciberderecho & Prueba Digital",
    icono: "ShieldCheck",
    descripcion: "Experto en evidencia informática, contratos inteligentes, fraudes telemáticos e Inteligencia Artificial.",
    beneficio: "Desbloquea peritajes informáticos de vanguardia."
  }
];

export const ETAPAS_CARRERA: EtapaVida[] = [
  // ETAPA 1: UNIVERSIDAD (18 A 20 AÑOS)
  {
    id: 1,
    edadInicio: 18,
    edadFin: 20,
    puesto: "Estudiante de 1er y 2do Año (Jursoc UNLP)",
    titulo: "Etapa 1: Ingreso a la Facultad y los Primeros Parciales",
    contextoEscenario: "Entrás por las escalinatas de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP a los 18 años. Todo es un mundo nuevo: los pasillos de calle 48, las fotocopias del centro de estudiantes en el subsuelo y las clases multitudinarias. Es jueves por la noche: tus compañeros de comisión armaron previa para salir a los boliches de diagonal 74, pero el sábado rindiendo tu primer parcial decisivo de Derecho Romano.",
    dilemaTexto: "¿Cómo administrás tu tiempo durante tus primeros meses universitarios?",
    opciones: [
      {
        id: "e1_op1",
        texto: "Quedarte encerrado estudiando todo el fin de semana para asegurar un 9 en Romano.",
        impacto: { prestigio: 15, contactos: -5, etica: 10, dineroPesos: -15000, impactoRamas: { civilComercial: 10 } },
        feedbackNarrativo: "Metiste un 9 clavado en Romano. Tu libreta universitaria brilla, pero te perdiste los primeros grupos de estudio y previas en la ciudad."
      },
      {
        id: "e1_op2",
        texto: "Salir de joda el jueves con tus compañeros y meter una maratón de estudio sin dormir el viernes.",
        impacto: { prestigio: -5, contactos: 20, etica: -5, dineroPesos: -45000, impactoRamas: { administrativoPublico: 10 } },
        feedbackNarrativo: "La previa en diagonal 74 fue legendaria. Te hiciste amigo de futuros dirigentes del centro de estudiantes. Aprobaste raspando con un 4 la materia."
      },
      {
        id: "e1_op3",
        texto: "Buscar un trabajo a medio tiempo como cadete en un estudio de calle 13 para juntar tu primer dinero.",
        impacto: { prestigio: 5, contactos: 10, etica: 5, dineroPesos: 320000, impactoRamas: { penal: 5, civilComercial: 5 } },
        feedbackNarrativo: "Empezaste a recorrer los pasillos de Tribunales llevando cédulas de notificación. Atrasaste un poco la lectura, pero juntaste tu primer sueldo de $320.000."
      }
    ]
  },

  // ETAPA 2: LA MITAD DE LA CARRERA Y AHOGO ECONÓMICO (20 A 22 AÑOS)
  {
    id: 2,
    edadInicio: 20,
    edadFin: 22,
    puesto: "Estudiante Avanzado (3er y 4to Año - UNLP)",
    titulo: "Etapa 2: Parciales de Derecho Penal y Presión Financiera",
    contextoEscenario: "Tenés 20 años y estás cursando las materias pesadas: Penal I, Contratos y Administrativo. El costo de vida en La Plata subió, el alquiler del departamento aprieta y tenés que decidir si priorizás la velocidad de graduación o el resguardo económico.",
    dilemaTexto: "Un estudio jurídico medio de la ciudad te ofrece ingresar como procurador por un sueldo mensual de $450.000, pero exige estar de 8 a 14 hs en Tribunales, lo que te obligaría a atrasar 2 materias.",
    opciones: [
      {
        id: "e2_op1",
        texto: "Aceptar el trabajo de procurador: juntar dinero acumulado y ganar experiencia de barandilla.",
        impacto: { prestigio: 10, contactos: 15, etica: 5, dineroPesos: 1200000, impactoRamas: { penal: 15 } },
        feedbackNarrativo: "Juntaste $1.200.000 acumulados y aprendiste el 'oficio de la calle' en tribunales. Tuviste que patear Contratos para el año que viene, pero tu bolsillo respiró."
      },
      {
        id: "e2_op2",
        texto: "Rechazar el empleo: pedir ayuda familiar/beca y meter 6 materias de un tirón para recibirte rápido.",
        impacto: { prestigio: 25, contactos: -5, etica: 10, dineroPesos: -120000, impactoRamas: { civilComercial: 15 } },
        feedbackNarrativo: "Viviste a arroz y café durante meses, pero metiste 6 materias al hilo en los turnos de julio y diciembre. Estás a un paso del título."
      },
      {
        id: "e2_op3",
        texto: "Sumarte a la militancia del Centro de Estudiantes para gestionar apuntes y pasantías institucionales.",
        impacto: { prestigio: 5, contactos: 35, etica: -5, dineroPesos: 200000, impactoRamas: { administrativoPublico: 20 } },
        feedbackNarrativo: "Te convertiste en una cara visible del subsuelo de Jursoc. Conseguiste una beca de investigación de $200.000 y una red de contactos tremenda."
      }
    ]
  },

  // ETAPA 3: EL FESTEJO DE RECIBIDA (23 AÑOS)
  {
    id: 3,
    edadInicio: 22,
    edadFin: 23,
    puesto: "¡Egresado de la Facultad de Ciencias Jurídicas y Sociales!",
    titulo: "Etapa 3: La Última Materia y la Recibida en Calle 48",
    contextoEscenario: "¡Llegó el día esperado! A los 23 años saliste del aula del 3er piso tras aprobar la última materia. Abajo en las escalinatas de la facultad en calle 48 te están esperando tus amigos, tus compañeros y tu familia. Es el momento de festejar la obtención del título de Abogado/a de la UNLP.",
    dilemaTexto: "¿Cómo elegís festejar tu ansiada graduación universitaria?",
    esFestejoRecibida: true,
    opciones: [
      {
        id: "recibida_op1",
        texto: "🥚 Festejo tradicional descontrolado: Huevos, harina, yerba, pintura y corte de calle 48 con tus amigos.",
        impacto: { prestigio: 10, contactos: 25, etica: -5, dineroPesos: -80000 },
        feedbackNarrativo: "¡Terminaste tapado de harina y huevo cantando por la UNLP! Las fotos circulan por todo Instagram y la facultad. Festejaste como corresponde la mística platense."
      },
      {
        id: "recibida_op2",
        texto: "🍷 Festejo íntimo y familiar: Asado en casa con tu familia cercana, brindis y perfil bajo.",
        impacto: { prestigio: 20, contactos: 5, etica: 20, dineroPesos: -40000 },
        feedbackNarrativo: "Un abrazo emocionado con tus padres y seres queridos. Un festejo cálido, sobrio e inolvidable que reforzó tus valores y tu enfoque profesional."
      },
      {
        id: "recibida_op3",
        texto: "🤫 No le contás a nadie: Te cambiás en el baño, guardás la libreta firmada y salís directo a buscar trabajo.",
        impacto: { prestigio: 15, contactos: -10, etica: 15, dineroPesos: 50000 },
        feedbackNarrativo: "Sin festejos ni estridencias. A las 2 horas estabas jurando fecha en el Colegio de Abogados. Enfocado 100% en la carrera laboral."
      }
    ]
  },

  // ETAPA 4: ELECCIÓN DEL PRIMER EMPLEO (23 A 25 AÑOS)
  {
    id: 4,
    edadInicio: 23,
    edadFin: 25,
    puesto: "Joven Abogado/a Matriculado/a",
    titulo: "Etapa 4: Primer Destino Profesional y la Firma de la Matrícula",
    contextoEscenario: "Con la matrícula expedida por el Colegio de Abogados de La Plata (Av. 13), tenés frente a vos 4 caminos laborales totalmente distintos para iniciar tu vida profesional a los 23 años.",
    dilemaTexto: "¿Dónde elegís empezar a ejercer la abogacía?",
    esEleccionPrimerEmpleo: true,
    opciones: [
      {
        id: "empleo_op1",
        texto: "🏢 Estudio Corporativo 'Antigravity': Innovación, contratos tech y sueldo inicial de $1.200.000/mes.",
        impacto: { prestigio: 20, contactos: 15, etica: 10, dineroPesos: 3500000, impactoRamas: { cibertech: 25, civilComercial: 15 } },
        feedbackNarrativo: "Ingresaste a Antigravity en pleno centro platense. Manejás expedientes digitales, firmas internacionales y acumulaste tu primera gran suma de dinero ($3.500.000)."
      },
      {
        id: "empleo_op2",
        texto: "⚖️ Estudio Penalista Tradicional de calle 13: Litigio en UFI y tribunales penales bonaerenses.",
        impacto: { prestigio: 25, contactos: 20, etica: 5, dineroPesos: 2800000, impactoRamas: { penal: 35 } },
        feedbackNarrativo: "Te curtiste en las barandillas de la fiscalía y juicios orales. Tu nombre empezó a sonar con fuerza entre los abogados penalistas del fuero."
      },
      {
        id: "empleo_op3",
        texto: "🏛️ Fiscalía de Estado / Gobernación PBA: Cargo en la Administración Pública Provincial.",
        impacto: { prestigio: 15, contactos: 35, etica: 15, dineroPesos: 2400000, impactoRamas: { administrativoPublico: 35 } },
        feedbackNarrativo: "Ingresaste a la trinchera del derecho administrativo. Conseguiste estabilidad, aportes a la Caja y contactos políticos de alto nivel en calle 6."
      },
      {
        id: "empleo_op4",
        texto: "⚖️ Poder Judicial PBA: Empleo como Auxiliar en un Juzgado de Garantías o Civil.",
        impacto: { prestigio: 30, contactos: 15, etica: 25, dineroPesos: 2100000, impactoRamas: { civilComercial: 20, penal: 15 } },
        feedbackNarrativo: "Pasaste del otro lado del escritorio. Proyectás sentencias y resoluciones, ganando una perspectiva judicial envidiable y respeto institucional."
      }
    ]
  },

  // ETAPA 5: CONSOLIDACIÓN Y DECISIÓN DE ESTUDIO PROPIO (25 A 30 AÑOS)
  {
    id: 5,
    edadInicio: 25,
    edadFin: 30,
    puesto: "Abogado/a Consolidado/a",
    titulo: "Etapa 5: ¿Fundar tu propio Estudio Jurídico Independiente?",
    contextoEscenario: "A los 27 años tenés experiencia de sobra. Ahorraste capital suficiente y se presenta la oportunidad de alquilar un piso en calle 12 y fundar tu propio **Estudio Jurídico Independiente**, o bien mantenerte dentro de la estructura corporativa/estatal.",
    dilemaTexto: "¿Darás el salto hacia la independencia profesional absoluta o mantendrás tu puesto actual?",
    opciones: [
      {
        id: "e5_op1",
        texto: "🚀 Abrir tu propio Estudio Jurídico Independiente en La Plata invirtiendo $2.000.000 de tus ahorros.",
        impacto: { prestigio: 30, contactos: 25, etica: 10, dineroPesos: 4500000, impactoRamas: { civilComercial: 20, penal: 20 } },
        feedbackNarrativo: "¡Pusiste la chapa con tu nombre en la puerta! Atrajiste tus propios clientes, contrataste procuradores y tus ingresos netos despegaron a $4.500.000."
      },
      {
        id: "e5_op2",
        texto: "🏢 Negociar hacerte Socio Senior en Antigravity / Asesor en el Estado manteniendo doble práctica legal.",
        impacto: { prestigio: 25, contactos: 30, etica: 5, dineroPesos: 6000000, impactoRamas: { administrativoPublico: 15, cibertech: 20 } },
        feedbackNarrativo: "Mantuviste tu salario corporativo y sumaste clientes privados seleccionados. Un esquema híbrido que disparó tus ahorros a $6.000.000."
      },
      {
        id: "e5_op3_skill",
        texto: "⭐ [Skill Especialista] Lanzar una firma boutique hiper-especializada de nicho.",
        impacto: { prestigio: 40, contactos: 20, etica: 20, dineroPesos: 7500000 },
        feedbackNarrativo: "Tu especialidad técnica te convirtió en el profesional de referencia de la provincia. Cobrás honorarios de éxito elevados por cada asunto."
      }
    ]
  },

  // ETAPA 6: CÚSPIDE Y JUBILACIÓN (30 A 65 AÑOS)
  {
    id: 6,
    edadInicio: 30,
    edadFin: 65,
    puesto: "Jurista Consagrado / Socio Principal",
    titulo: "Etapa 6: La Cúspide Profesional y la Retirada a los 65 Años",
    contextoEscenario: "Tras décadas de éxitos procesales, acuerdos millonarios, intervenciones en juicios por jurados y docencia universitaria en la FCJyS UNLP, llegás a la edad de 65 años. Es el momento de revisar tu trayectoria y definir cómo culminás tu brillante carrera jurídica en la capital bonaerense.",
    dilemaTexto: "¿Cómo decidís cerrar tu carrera profesional y pasar a la jubilación legal?",
    opciones: [
      {
        id: "e6_op1",
        texto: "👑 Donar el estudio a jóvenes graduados de la UNLP y retirarte como Docente Titular Emérito.",
        impacto: { prestigio: 50, contactos: 30, etica: 30, dineroPesos: 15000000 },
        feedbackNarrativo: "Dejaste un legado imborrable en las aulas de la UNLP y un estudio floreciente para las nuevas generaciones de abogados platenses."
      },
      {
        id: "e6_op2",
        texto: "🏛️ Aceptar la designación como Conjuez de la Suprema Corte de Justicia PBA hasta los 65 años.",
        impacto: { prestigio: 45, contactos: 50, etica: 25, dineroPesos: 20000000 },
        feedbackNarrativo: "Alcanzaste el máximo honor institucional de la provincia de Buenos Aires. Tu firma quedó registrada en fallos históricos de la SCBA."
      },
      {
        id: "e6_op3",
        texto: "💼 Retirarte multimillonario vendiendo tu firma jurídica a un grupo de inversión internacional.",
        impacto: { prestigio: 30, contactos: 20, etica: 15, dineroPesos: 45000000 },
        feedbackNarrativo: "Vendiste la firma por una cifra colosal de $45.000.000. Te retirás a disfrutar de tu patrimonio en total tranquilidad."
      }
    ]
  }
];
