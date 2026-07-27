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
  saludMental: number;
  dineroPesos: number;
  impactoRamas?: Partial<RamasPuntuacion>;
}

export interface EventoInesperado {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "positivo" | "negativo" | "neutro";
  impacto: ImpactoStats;
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
  eventosInesperados: EventoInesperado[];
  opciones: OpcionDilema[];
}

export const SKILLS_DISPONIBLES: SkillDefinition[] = [
  {
    id: "litigio_penal",
    nombre: "Litigio Penal & Garantías",
    icono: "Scale",
    descripcion: "Especialista en derecho penal bonaerense, habeas corpus y debate en juicios por jurados.",
    beneficio: "Desbloquea maniobras de defensa técnica penal de alto rendimiento."
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
  // ETAPA 1: INGRESO A JURSOC UNLP (18 AÑOS)
  {
    id: 1,
    edadInicio: 18,
    edadFin: 19,
    puesto: "Ingresante a 1er Año (Jursoc UNLP)",
    titulo: "1. El Ingreso a la Universidad y el Parcial de Romano",
    contextoEscenario: "Entrás por las escalinatas de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP a los 18 años. El ambiente es vibrante: volantes en las puertas, pasillos desbordados y clases multitudinarias. Es jueves por la noche: tus compañeros de comisión armaron previa para ir a los boliches de diagonal 74, pero el sábado rindiendo tu primer parcial decisivo de Derecho Romano.",
    dilemaTexto: "¿Cómo administrás tu tiempo en tu primera prueba de fuego universitaria?",
    eventosInesperados: [
      {
        id: "e1_ev1",
        titulo: "🟢 Paro Sorpresa de Empleados de la UNLP",
        descripcion: "Se suspendieron las clases del viernes. Tuviste 24 horas extra inesperadas para estudiar o descansar.",
        tipo: "positivo",
        impacto: { prestigio: 5, contactos: 0, etica: 0, saludMental: 15, dineroPesos: 0 }
      },
      {
        id: "e1_ev2",
        titulo: "🔴 Corte de Luz en tu Depto de La Plata",
        descripcion: "Apagón sorpresivo en la zona del centro la noche previa a rendir. Tuviste que estudiar a vela.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -15, dineroPesos: -10000 }
      },
      {
        id: "e1_ev3",
        titulo: "🟢 Sorteo del Centro de Estudiantes",
        descripcion: "Te ganaste un combo de fotocopias gratis y una libreta universitaria de regalo en el subsuelo de Jursoc.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 10, etica: 0, saludMental: 5, dineroPesos: 15000 }
      },
      {
        id: "e1_ev4",
        titulo: "⚪ Hallazgo en la Biblioteca de Calle 48",
        descripcion: "Encontraste un ejemplar clásico de Derecho Romano anotado por un ex Juez de la Suprema Corte.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 0, etica: 0, saludMental: 0, dineroPesos: 0 }
      },
      {
        id: "e1_ev5",
        titulo: "🔴 Colectivo de Línea Roto",
        descripcion: "Te quedaste tirado en plaza Italia y llegaste tarde a la clase teórica del Titular de Cátedra.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: -5, etica: 0, saludMental: -10, dineroPesos: -5000 }
      }
    ],
    opciones: [
      {
        id: "e1_op1",
        texto: "📚 Estudio extremo: Encerrarte todo el fin de semana a leer fuentes romanas sin pestañear.",
        impacto: { prestigio: 20, contactos: -10, etica: 10, saludMental: -25, dineroPesos: -20000, impactoRamas: { civilComercial: 15 } },
        feedbackNarrativo: "Metiste un 9 clavado en Romano. Tu libreta universitaria brilla, pero te quemaste las pestañas y te perdiste los primeros grupos de amigos."
      },
      {
        id: "e1_op2",
        texto: "🍺 Salir de joda a diagonal 74 y estudiar sin dormir el viernes por la noche.",
        impacto: { prestigio: -10, contactos: 30, etica: -10, saludMental: 15, dineroPesos: -50000, impactoRamas: { administrativoPublico: 10 } },
        feedbackNarrativo: "La previa fue inolvidable. Te hiciste amigo de futuros dirigentes del centro de estudiantes. Aprobaste raspando con un 4 la materia."
      },
      {
        id: "e1_op3",
        texto: "💼 Conseguir un trabajo de cadete en un estudio de calle 13 para juntar tu primer dinero.",
        impacto: { prestigio: 10, contactos: 15, etica: 5, saludMental: -15, dineroPesos: 350000, impactoRamas: { penal: 10 } },
        feedbackNarrativo: "Empezaste a recorrer los pasillos de Tribunales llevando cédulas. Atrasaste la lectura, pero juntaste tu primer sueldo de $350.000."
      }
    ]
  },

  // ETAPA 2: JODAS UNIVERSITARIAS Y TRABAJO DE BARANDILLA (19 A 20 AÑOS)
  {
    id: 2,
    edadInicio: 19,
    edadFin: 20,
    puesto: "Estudiante de 2do Año (Jursoc UNLP)",
    titulo: "2. Las Jodas Platenses vs La Barandilla de Tribunales",
    contextoEscenario: "Tenés 19 años. Estás cursando Derecho Político y Constitucional. Tus amigos organizaron una escapada de fin de semana a la costa y, en simultáneo, un conocido abogado penalista te ofrece acompañarlo a audiencias de excarcelación en el Fuero Penal de calle 8.",
    dilemaTexto: "¿Aceptás el viaje de relax con amigos o te metés de lleno en la práctica penal bonaerense?",
    eventosInesperados: [
      {
        id: "e2_ev1",
        titulo: "🟢 Invitación a Charla Magistral de un Juez Penal",
        descripcion: "Un Juez de Garantías dictó una conferencia exclusiva y te regaló su libro autografiado.",
        tipo: "positivo",
        impacto: { prestigio: 15, contactos: 15, etica: 5, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e2_ev2",
        titulo: "🔴 Demora por Paro de Transporte en La Plata",
        descripcion: "Tuviste que pagar un taxi caro para no perder el examen parcial de Constitucional.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -10, dineroPesos: -25000 }
      },
      {
        id: "e2_ev3",
        titulo: "⚪ Encuentro Casual en la Plaza Moreno",
        descripcion: "Te cruzaste con un ex compañero del colegio secundario que ahora cursa Ciencia Política.",
        tipo: "neutro",
        impacto: { prestigio: 0, contactos: 10, etica: 0, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e2_ev4",
        titulo: "🟢 Descuento Especial en el Comedor Universitario",
        descripcion: "Aprovechaste el menú estudiantil del comedor de la UNLP y ahorraste bastante dinero este mes.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 5, etica: 0, saludMental: 10, dineroPesos: 40000 }
      },
      {
        id: "e2_ev5",
        titulo: "🔴 Pérdida de Apuntes en la Fotocopiadora",
        descripcion: "Te extraviaron el resumen de Derecho Político la noche previa al examen.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -20, dineroPesos: -15000 }
      }
    ],
    opciones: [
      {
        id: "e2_op1",
        texto: "🌊 Viajar a la costa con tus amigos para despejar la cabeza y recargar salud mental.",
        impacto: { prestigio: -5, contactos: 20, etica: 0, saludMental: 30, dineroPesos: -120000 },
        feedbackNarrativo: "Volviste relajado y renovado. Afianzaste tu grupo de amigos de la vida, aunque perdiste una oportunidad de aprendizaje en tribunales."
      },
      {
        id: "e2_op2",
        texto: "⚖️ Quedarte asistiendo al penalista en las audiencias de prisión preventiva en calle 8.",
        impacto: { prestigio: 25, contactos: 15, etica: 5, saludMental: -20, dineroPesos: 250000, impactoRamas: { penal: 25 } },
        feedbackNarrativo: "Te curtiste viendo audiencias de juzgados de garantías. Aprendiste cómo se negocia la libertad de un imputado en la trinchera real."
      },
      {
        id: "e2_op3",
        texto: "📖 Armar un grupo de estudio intensivo en la Biblioteca Central de la UNLP.",
        impacto: { prestigio: 15, contactos: 10, etica: 15, saludMental: -10, dineroPesos: -15000, impactoRamas: { civilComercial: 10 } },
        feedbackNarrativo: "Consolidaste una base doctrinal firme y ayudaste a tus compañeros a aprobar con excelentes notas."
      }
    ]
  },

  // ETAPA 3: MILITANCIA O BECA ACADÉMICA (20 A 21 AÑOS)
  {
    id: 3,
    edadInicio: 20,
    edadFin: 21,
    puesto: "Estudiante de 3er Año (Jursoc UNLP)",
    titulo: "3. La Militancia en el Subsuelo vs La Beca de Investigación",
    contextoEscenario: "Llegás a los 20 años en la mitad de la carrera. En la facultad surgen dos caminos políticos e institucionales: integrarte a la conducción del Centro de Estudiantes en el subsuelo o postularte a una Beca de Investigación en Derecho Administrativo.",
    dilemaTexto: "¿Dónde invertís tu capital político e intelectual dentro de la facultad?",
    eventosInesperados: [
      {
        id: "e3_ev1",
        titulo: "🟢 Reconocimiento en el Consejo Directivo UNLP",
        descripcion: "Tu proyecto de extensión fue aprobado por unanimidad en el Consejo Directivo de Jursoc.",
        tipo: "positivo",
        impacto: { prestigio: 20, contactos: 20, etica: 10, saludMental: 10, dineroPesos: 0 }
      },
      {
        id: "e3_ev2",
        titulo: "🔴 Discusión Fuerte en Asamblea Estudiantil",
        descripcion: "Un acalorado debate político en el patio de la facultad te generó tensión y agotamiento.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: -5, etica: 0, saludMental: -15, dineroPesos: 0 }
      },
      {
        id: "e3_ev3",
        titulo: "🟢 Cobro de Beca de Ayudantía",
        descripcion: "El decanato liquidó un pago diferido por tus tareas de colaboración académica.",
        tipo: "positivo",
        impacto: { prestigio: 5, contactos: 5, etica: 0, saludMental: 5, dineroPesos: 150000 }
      },
      {
        id: "e3_ev4",
        titulo: "⚪ Asistencia a Jornadas de Derecho Administrativo",
        descripcion: "Escuchaste exposiciones de juristas nacionales en el aula magna de calle 48.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 5, etica: 0, saludMental: 0, dineroPesos: 0 }
      },
      {
        id: "e3_ev5",
        titulo: "🔴 Rotura de Computadora Personal",
        descripcion: "Se averió el disco de tu notebook con los modelos de escritos y resúmenes.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -20, dineroPesos: -120000 }
      }
    ],
    opciones: [
      {
        id: "e3_op1",
        texto: "🏛️ Militancia activa en Jursoc: Gestionar apuntes, organizar eventos y rosca política.",
        impacto: { prestigio: 10, contactos: 40, etica: -15, saludMental: -15, dineroPesos: 180000, impactoRamas: { administrativoPublico: 25 } },
        feedbackNarrativo: "Te convertiste en un referente indiscutido en los pasillos de calle 48. La red de contactos políticos que armaste te servirá toda la vida."
      },
      {
        id: "e3_op2",
        texto: "🎓 Beca de Investigación Académica: Escribir artículos de doctrina jurídica.",
        impacto: { prestigio: 35, contactos: 5, etica: 20, saludMental: -10, dineroPesos: 300000, impactoRamas: { civilComercial: 15, cibertech: 15 } },
        feedbackNarrativo: "Publicaste tu primer artículo en la revista de derecho de la UNLP. Los profesores de la cátedra comenzaron a citar tu trabajo."
      },
      {
        id: "e3_op3",
        texto: "💼 Procurar a tiempo completo para un estudio de marcas y ciberderecho.",
        impacto: { prestigio: 15, contactos: 15, etica: 10, saludMental: -20, dineroPesos: 850000, impactoRamas: { cibertech: 30 } },
        feedbackNarrativo: "Cobraste $850.000 acumulados y aprendiste sobre registros de patentes y prueba informática antes que nadie."
      }
    ]
  },

  // ETAPA 4: PARCIALES DE PENAL Y PRESIÓN FINANCIERA (21 A 22 AÑOS)
  {
    id: 4,
    edadInicio: 21,
    edadFin: 22,
    puesto: "Estudiante Avanzado de 4to Año",
    titulo: "4. Derecho Penal II y el Ahogo Económico de Alquiler",
    contextoEscenario: "A los 21 años las exigencias crecen: cursás Penal II y Obligaciones. El costo del alquiler en La Plata se disparó y tenés que decidir si atrasás materias para trabajar más horas o apretás los dientes sacrificando salud mental.",
    dilemaTexto: "¿Cómo enfrentás la recta final de materias pesadas frente a la presión financiera?",
    eventosInesperados: [
      {
        id: "e4_ev1",
        titulo: "🟢 Devolución de Depósito de Alquiler",
        descripcion: "Recuperaste dinero de una garantía de alquiler anterior en La Plata.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: 15, dineroPesos: 200000 }
      },
      {
        id: "e4_ev2",
        titulo: "🔴 Cambio de Cátedra Sorpresivo",
        descripcion: "Cambiaron la comisión de examen oral y el nuevo Profesor Titular es híper exigente.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -25, dineroPesos: 0 }
      },
      {
        id: "e4_ev3",
        titulo: "🟢 Regalo de Colección de Libros Penales",
        descripcion: "Un abogado jubilado donó su biblioteca de Códigos comentados al Centro de Estudiantes.",
        tipo: "positivo",
        impacto: { prestigio: 15, contactos: 5, etica: 0, saludMental: 10, dineroPesos: 0 }
      },
      {
        id: "e4_ev4",
        titulo: "⚪ Debate Institucional sobre Reforma del Código Penal",
        descripcion: "Asististe como oyente a la comisión de legisladores bonaerenses en la Cámara de Diputados.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 10, etica: 0, saludMental: 0, dineroPesos: 0 }
      },
      {
        id: "e4_ev5",
        titulo: "🔴 Multa por Trámite Municipal Extemporáneo",
        descripcion: "Tuviste que saldar una multa por una habilitación comercial de un familiar.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -10, dineroPesos: -60000 }
      }
    ],
    opciones: [
      {
        id: "e4_op1",
        texto: "💸 Atrasar 2 materias un cuatrimestre y agarrar un puesto de procurador senior ($650.000/mes).",
        impacto: { prestigio: 10, contactos: 20, etica: 5, saludMental: 10, dineroPesos: 1500000, impactoRamas: { penal: 15 } },
        feedbackNarrativo: "Juntaste $1.500.000 y salvaste el alquiler holgadamente. Retardaste la recibida 6 meses, pero viviste sin asfixia económica."
      },
      {
        id: "e4_op2",
        texto: "🔥 Rendir todo en mesa libre: Vivir a café y no dormir durante 3 semanas consecutivas.",
        impacto: { prestigio: 30, contactos: -10, etica: 10, saludMental: -40, dineroPesos: -100000, impactoRamas: { civilComercial: 20 } },
        feedbackNarrativo: "Metiste Penal II con 10. Tu promedio voló por los cielos, pero el nivel de estrés y quemazón estuvo al límite del colapso."
      },
      {
        id: "e4_op3",
        texto: "🤝 Armar un emprendimiento de resúmenes y modelos de examen para ingresantes.",
        impacto: { prestigio: 5, contactos: 25, etica: -5, saludMental: -10, dineroPesos: 900000, impactoRamas: { administrativoPublico: 10 } },
        feedbackNarrativo: "Generaste una fuente de ingresos propia vendiendo guías de estudio. Ayudaste a cientos de alumnos y ganaste dinero."
      }
    ]
  },

  // ETAPA 5: EL EXAMEN INTEGRADOR Y LA REQUISITORIA (22 A 23 AÑOS)
  {
    id: 5,
    edadInicio: 22,
    edadFin: 23,
    puesto: "Práctica Profesional / Último Año",
    titulo: "5. La Práctica Profesional Supervisada y la Última Materia",
    contextoEscenario: "Llegás a los 22 años a la materia final de Práctica Profesional Consultorio Jurídico Gratuito. Atendés casos reales de sectores vulnerables de La Plata. En paralelo, te ofrecen entrar como pasante meritorio en un Juzgado Civil.",
    dilemaTexto: "¿Dedicarte de lleno al Consultorio Gratuito o meter la cabeza en el Poder Judicial?",
    eventosInesperados: [
      {
        id: "e5_ev1",
        titulo: "🟢 Elogio Público del Juez de Cámara",
        descripcion: "Un Juez de Cámara elogió la redacción de tu primer escrito de práctica procesal.",
        tipo: "positivo",
        impacto: { prestigio: 25, contactos: 15, etica: 10, saludMental: 15, dineroPesos: 0 }
      },
      {
        id: "e5_ev2",
        titulo: "🔴 Error de Foliado en Expediente de Práctica",
        descripcion: "Un fallo en el foliado físico te hizo perder 4 horas rehaciendo el trámite en casilleros.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -15, dineroPesos: 0 }
      },
      {
        id: "e5_ev3",
        titulo: "🟢 Otorgamiento de Mención de Honor Académica",
        descripcion: "La facultad distinguió tu promedio en la lista de graduación inminente.",
        tipo: "positivo",
        impacto: { prestigio: 20, contactos: 10, etica: 15, saludMental: 10, dineroPesos: 0 }
      },
      {
        id: "e5_ev4",
        titulo: "⚪ Conferencia sobre Litigio Estratégico en SCBA",
        descripcion: "Presenciaste un alegato histórico en el salón de la Suprema Corte de calle 13.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 5, etica: 0, saludMental: 0, dineroPesos: 0 }
      },
      {
        id: "e5_ev5",
        titulo: "🔴 Robo de Mochila con la Notebook",
        descripcion: "Te sustrajeron la mochila en la parada de colectivo con tus apuntes finales.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -30, dineroPesos: -150000 }
      }
    ],
    opciones: [
      {
        id: "e5_op1",
        texto: "❤️ Dedicación total al Consultorio Gratuito: Resolver amparos de salud para vecinos vulnerables.",
        impacto: { prestigio: 30, contactos: 15, etica: 35, saludMental: 10, dineroPesos: 100000, impactoRamas: { administrativoPublico: 20 } },
        feedbackNarrativo: "Sentiste el verdadero sentido social de la abogacía. Tu ética profesional se consagró al máximo en la facultad."
      },
      {
        id: "e5_op2",
        texto: "⚖️ Pasantía en el Juzgado Civil: Conocer los secretos de las sentencias por dentro.",
        impacto: { prestigio: 25, contactos: 25, etica: 15, saludMental: -15, dineroPesos: 450000, impactoRamas: { civilComercial: 25 } },
        feedbackNarrativo: "Entendiste cómo piensan los jueces de primera instancia y te ganaste la consideración de los secretarios del juzgado."
      },
      {
        id: "e5_op3",
        texto: "💻 Desarrollar un bot de inteligencia artificial para agilizar la lectura de expedientes.",
        impacto: { prestigio: 35, contactos: 20, etica: 10, saludMental: -10, dineroPesos: 1200000, impactoRamas: { cibertech: 35 } },
        feedbackNarrativo: "Revolucionaste la materia de Práctica con tecnología. Ganaste el concurso de innovación de la Jursoc UNLP."
      }
    ]
  },

  // ETAPA 6: EL FESTEJO DE RECIBIDA (23 AÑOS)
  {
    id: 6,
    edadInicio: 23,
    edadFin: 24,
    puesto: "¡Egresado de la FCJyS (UNLP)!",
    titulo: "6. La Firma de la Libreta y la Graduación en Calle 48",
    contextoEscenario: "¡Día glorioso! A los 23 años saliste del aula del 3er piso tras aprobar el examen final. Abajo en las escalinatas de calle 48 te están esperando tus amigos, tus compañeros y tu familia con bolsas de harina, huevos y cotillón.",
    dilemaTexto: "¿Cómo elegís festejar la obtención del título de Abogado/a de la UNLP?",
    esFestejoRecibida: true,
    eventosInesperados: [
      {
        id: "e6_ev1",
        titulo: "🟢 Felicitaciones del Decano de la Facultad",
        descripcion: "El Decano te saludó personalmente en el pasillo al entregarte el acta firmado.",
        tipo: "positivo",
        impacto: { prestigio: 15, contactos: 20, etica: 5, saludMental: 15, dineroPesos: 0 }
      },
      {
        id: "e6_ev2",
        titulo: "🔴 Lluvia Torrencial en el Festejo de Calle 48",
        descripcion: "Una tormenta sorpresiva arruinó la pancarta de recibida que te prepararon tus amigos.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -10, dineroPesos: -15000 }
      },
      {
        id: "e6_ev3",
        titulo: "🟢 Regalo Sorpresa de Graduación",
        descripcion: "Tu familia te regaló un maletín de cuero y el primer Código Civil y Comercial profesional.",
        tipo: "positivo",
        impacto: { prestigio: 10, contactos: 5, etica: 0, saludMental: 20, dineroPesos: 80000 }
      },
      {
        id: "e6_ev4",
        titulo: "⚪ Foto Oficial en las Escalinatas",
        descripcion: "Quedaste retratado en el álbum oficial de egresados de la UNLP.",
        tipo: "neutro",
        impacto: { prestigio: 5, contactos: 5, etica: 0, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e6_ev5",
        titulo: "🔴 Trámite de Titulo Demorado en Ministerio",
        descripcion: "Una demora burocrática atrasó 2 semanas la entrega física de tu diploma.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -15, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "recibida_op1",
        texto: "🥚 Festejo tradicional descontrolado: Huevos, harina, yerba, pintura y corte de calle 48.",
        impacto: { prestigio: 10, contactos: 30, etica: -5, saludMental: 30, dineroPesos: -100000 },
        feedbackNarrativo: "¡Terminaste enharinado bailando en la calle! La mística universitaria platense en su máxima expresión. Festejo inolvidable."
      },
      {
        id: "recibida_op2",
        texto: "🍷 Festejo íntimo y familiar: Asado en casa con tu familia cercana y perfil bajo.",
        impacto: { prestigio: 25, contactos: 5, etica: 25, saludMental: 20, dineroPesos: -50000 },
        feedbackNarrativo: "Un abrazo emocionado con tus seres queridos. Sobrio, cálido y enfocado en la nueva etapa profesional."
      },
      {
        id: "recibida_op3",
        texto: "🤫 Graduación en silencio: Cambiarte en el baño, guardar el título y salir a matricularte.",
        impacto: { prestigio: 15, contactos: -10, etica: 15, saludMental: 0, dineroPesos: 50000 },
        feedbackNarrativo: "Sin festejos ni fotos. Enfocado inmediatamente en la matriculación en el Colegio de Abogados."
      }
    ]
  },

  // ETAPA 7: PRIMER DESTINO PROFESIONAL (24 A 26 AÑOS)
  {
    id: 7,
    edadInicio: 24,
    edadFin: 26,
    puesto: "Abogado/a Matriculado/a en CALP",
    titulo: "7. La Firma de la Matrícula y el Primer Empleo",
    contextoEscenario: "Con la matrícula en mano expedida por el Colegio de Abogados de La Plata (Av. 13), tenés frente a vos 4 caminos profesionales decisivos para arrancar tu ejercicio laboral.",
    dilemaTexto: "¿Dónde elegís iniciar tu trayectoria profesional como graduado?",
    esEleccionPrimerEmpleo: true,
    eventosInesperados: [
      {
        id: "e7_ev1",
        titulo: "🟢 Asignación de Primer Caso de Oficio",
        descripcion: "Te asignaron una causa oficial rentable que te generó tus primeros honorarios regulados.",
        tipo: "positivo",
        impacto: { prestigio: 15, contactos: 10, etica: 10, saludMental: 10, dineroPesos: 450000 }
      },
      {
        id: "e7_ev2",
        titulo: "🔴 Aumento Sorpresivo de la Cuota Anual CALP",
        descripcion: "El Colegio de Abogados actualizó el valor del Jus y la matrícula profesional.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -10, dineroPesos: -180000 }
      },
      {
        id: "e7_ev3",
        titulo: "🟢 Invitación a Comisión de Jóvenes Abogados",
        descripcion: "Te invitaron a coordinar la Subcomisión de Derecho Procesal en el Colegio.",
        tipo: "positivo",
        impacto: { prestigio: 15, contactos: 25, etica: 5, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e7_ev4",
        titulo: "⚪ Juramento Colectivo en el Salón de Actos",
        descripcion: "Juraste la matrícula junto a 30 colegas de tu misma camada de la UNLP.",
        tipo: "neutro",
        impacto: { prestigio: 5, contactos: 10, etica: 5, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e7_ev5",
        titulo: "🔴 Falla Técnica en Firma Digital Bonaerense",
        descripcion: "Un problema con el token te obligó a perder toda la mañana en la delegación del Colegio.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -15, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "empleo_op1",
        texto: "🏢 Estudio Corporativo 'Antigravity': Innovación, contratos tech y sueldo de $1.400.000/mes.",
        impacto: { prestigio: 25, contactos: 20, etica: 10, saludMental: -15, dineroPesos: 4500000, impactoRamas: { cibertech: 30, civilComercial: 20 } },
        feedbackNarrativo: "Ingresaste a Antigravity en pleno centro platense. Manejás expedientes digitales y acumulaste tu primera gran suma ($4.500.000)."
      },
      {
        id: "empleo_op2",
        texto: "⚖️ Estudio Penalista Tradicional de calle 13: Defensa en querellas y juicios orales.",
        impacto: { prestigio: 30, contactos: 25, etica: 5, saludMental: -20, dineroPesos: 3800000, impactoRamas: { penal: 40 } },
        feedbackNarrativo: "Te curtiste en las barandillas de la fiscalía y juicios penales. Tu nombre comenzó a resonar fuerte en el fuero."
      },
      {
        id: "empleo_op3",
        texto: "🏛️ Gobernación PBA / Asesoría General de Gobierno: Puesto en la Administración Pública.",
        impacto: { prestigio: 20, contactos: 45, etica: 15, saludMental: 10, dineroPesos: 3200000, impactoRamas: { administrativoPublico: 40 } },
        feedbackNarrativo: "Ingresaste a la trinchera del derecho administrativo provincial. Ganaste estabilidad y vínculos de alto nivel."
      },
      {
        id: "empleo_op4",
        texto: "⚖️ Poder Judicial PBA: Cargo de Auxiliar en Juzgado de Garantías.",
        impacto: { prestigio: 35, contactos: 20, etica: 30, saludMental: -10, dineroPesos: 2800000, impactoRamas: { civilComercial: 25, penal: 20 } },
        feedbackNarrativo: "Pasaste del otro lado del escritorio. Proyectás sentencias y ganaste un respeto institucional inquebrantable."
      }
    ]
  },

  // ETAPA 8: EL PRIMER SOBORNO O DILEMA ÉTICO (26 A 28 AÑOS)
  {
    id: 8,
    edadInicio: 26,
    edadFin: 28,
    puesto: "Abogado/a Senior de Litigios",
    titulo: "8. El Dilema del Soborno y las Prácticas Límite",
    contextoEscenario: "Tenés 26 años. Un importante cliente acusado de fraude impositivo te ofrece una abultada suma en dólares en efectivo ($5.000.000 equivalentes) si lográs 'extraviar' una pericia contable comprometedora antes de que llegue a la fiscalía.",
    dilemaTexto: "¿Aceptás la maniobra límite para enriquecerte o mantenés la integridad profesional?",
    eventosInesperados: [
      {
        id: "e8_ev1",
        titulo: "🟢 Regulación Extraordinaria de Honorarios",
        descripcion: "Un Juez de Primera Instancia reguló honorarios por encima del mínimo legal en un juicio civil.",
        tipo: "positivo",
        impacto: { prestigio: 20, contactos: 10, etica: 5, saludMental: 15, dineroPesos: 1500000 }
      },
      {
        id: "e8_ev2",
        titulo: "🔴 Inspección Sorpresiva de la AFIP / ARBA",
        descripcion: "Una auditoría fiscal de rutina te hizo perder 3 días revisando libros del estudio.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -20, dineroPesos: -250000 }
      },
      {
        id: "e8_ev3",
        titulo: "🟢 Cliente Recomendado por colega",
        descripcion: "Un colega penalista te derivó un cliente corporativo importante por sobrecarga de trabajo.",
        tipo: "positivo",
        impacto: { prestigio: 15, contactos: 20, etica: 10, saludMental: 10, dineroPesos: 900000 }
      },
      {
        id: "e8_ev4",
        titulo: "⚪ Publicación de Comentario de Fallo en Revista Legal",
        descripcion: "Tu análisis sobre un fallo reciente de la Corte bonaerense fue publicado con elogios.",
        tipo: "neutro",
        impacto: { prestigio: 15, contactos: 5, etica: 5, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e8_ev5",
        titulo: "🔴 Conflicto de Intereses Inesperado",
        descripcion: "Tuviste que renunciar al patrocinio de un expediente por parentesco lejano de la contraparte.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: -5, etica: 10, saludMental: -10, dineroPesos: -300000 }
      }
    ],
    opciones: [
      {
        id: "e8_op1",
        texto: "❌ Rechazar rotundamente la maniobra y exigir el cumplimiento de la ley procesal.",
        impacto: { prestigio: 30, contactos: -5, etica: 35, saludMental: 10, dineroPesos: -200000 },
        feedbackNarrativo: "Mantuviste una ética inquebrantable. Aunque el cliente enfureció, en Tribunales se supo de tu rectitud profesional."
      },
      {
        id: "e8_op2",
        texto: "💰 Aceptar el sobre en efectivo e interponer recusaciones maliciosas para paralizar la causa.",
        impacto: { prestigio: -20, contactos: 10, etica: -45, saludMental: -25, dineroPesos: 5000000 },
        feedbackNarrativo: "Cobraste $5.000.000 en efectivo de una sola vez. Financieramente volás, pero tu nombre quedó marcado en la Fiscalía."
      },
      {
        id: "e8_op3_skill",
        texto: "⭐ [Skill Especialista] Demostrar la inconsistencia legal del peritaje sin violar la ley.",
        impacto: { prestigio: 40, contactos: 20, etica: 25, saludMental: 0, dineroPesos: 3500000 },
        feedbackNarrativo: "¡Jugada maestra! Anulaste el informe contable usando la doctrina procesal más avanzada. Ganaste el juicio y cobraste honorarios legítimos."
      }
    ]
  },

  // ETAPA 9: ESTUDIO JURÍDICO PROPIO O SOCIEDAD (28 A 32 AÑOS)
  {
    id: 9,
    edadInicio: 28,
    edadFin: 32,
    puesto: "Director/a de Firma Jurídica",
    titulo: "9. ¿Fundar tu propio Estudio Jurídico Independiente?",
    contextoEscenario: "A los 28 años tenés capital acumulado y prestigio. Se presenta la oportunidad de alquilar un piso en calle 12 y fundar tu propio **Estudio Jurídico Independiente**, o bien hacerte Socio Principal en Antigravity.",
    dilemaTexto: "¿Darás el salto hacia la independencia profesional absoluta?",
    eventosInesperados: [
      {
        id: "e9_ev1",
        titulo: "🟢 Incorporación de Procurador Brillante",
        descripcion: "Contrataste a un estudiante estrella de Jursoc UNLP que duplicó la eficiencia de la oficina.",
        tipo: "positivo",
        impacto: { prestigio: 20, contactos: 15, etica: 10, saludMental: 15, dineroPesos: 1200000 }
      },
      {
        id: "e9_ev2",
        titulo: "🔴 Incremento de Expensas y Alquiler del Despacho",
        descripcion: "Un aumento no pactado del inmueble comercial redujo los márgenes netos del mes.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, saludMental: -15, dineroPesos: -450000 }
      },
      {
        id: "e9_ev3",
        titulo: "🟢 Adjudicación de Asesoría Exclusiva a Empresa",
        descripcion: "Firmaste un abono mensual fijo con una distribuidora líder del Gran La Plata.",
        tipo: "positivo",
        impacto: { prestigio: 25, contactos: 20, etica: 5, saludMental: 10, dineroPesos: 2500000 }
      },
      {
        id: "e9_ev4",
        titulo: "⚪ Entrevista en Radio / Diario Local Platense",
        descripcion: "Te consultaron como especialista opinando sobre un proyecto de ley procesal.",
        tipo: "neutro",
        impacto: { prestigio: 15, contactos: 10, etica: 0, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e9_ev5",
        titulo: "🔴 Paro Judicial de 48 Horas",
        descripcion: "Se suspendieron términos procesales y se postergaron ejecuciones de honorarios.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -10, dineroPesos: -200000 }
      }
    ],
    opciones: [
      {
        id: "e9_op1",
        texto: "🚀 Abrir tu propio Estudio Jurídico en La Plata invirtiendo $3.000.000 de tus ahorros.",
        impacto: { prestigio: 35, contactos: 30, etica: 15, saludMental: -20, dineroPesos: 7500000, impactoRamas: { civilComercial: 25, penal: 25 } },
        feedbackNarrativo: "¡Pusiste la chapa con tu nombre en la puerta! Atrajiste tus propios clientes y tus ingresos se dispararon a $7.500.000."
      },
      {
        id: "e9_op2",
        texto: "🏢 Consolidarte como Socio Managing Principal de Antigravity.",
        impacto: { prestigio: 30, contactos: 35, etica: 10, saludMental: -10, dineroPesos: 9500000, impactoRamas: { cibertech: 30, administrativoPublico: 20 } },
        feedbackNarrativo: "Tomaste el liderazgo de la firma corporativa más innovadora de La Plata, facturando millones en contratos internacionales."
      },
      {
        id: "e9_op3",
        texto: "🏛️ Mantenerte en la función pública y ascender a Secretario de Juzgado / Asesor General.",
        impacto: { prestigio: 35, contactos: 40, etica: 25, saludMental: 10, dineroPesos: 5500000, impactoRamas: { administrativoPublico: 35 } },
        feedbackNarrativo: "Elegiste el camino institucional con estabilidad absoluta, excelente sueldo y gran poder en el fuero."
      }
    ]
  },

  // ETAPA 10: JUICIOS POR JURADOS Y GRANDES LITIGIOS (32 A 45 AÑOS)
  {
    id: 10,
    edadInicio: 32,
    edadFin: 45,
    puesto: "Jurista Consagrado / Managing Partner",
    titulo: "10. El Juicio por Jurados del Siglo y Causas Nacionales",
    contextoEscenario: "Entre los 32 y los 45 años encabezás las causas procesales de mayor impacto en la Provincia de Buenos Aires: un juicio por jurados mediático sobre un mega-fraude corporativo y ambiental en el Gran La Plata.",
    dilemaTexto: "¿Cómo encarás la defensa en el debate oral más importante de la década?",
    eventosInesperados: [
      {
        id: "e10_ev1",
        titulo: "🟢 Fallo Plenario Favorable de la SCBA",
        descripcion: "La Suprema Corte ratificó tu doctrina procesal en un fallo plenario histórico.",
        tipo: "positivo",
        impacto: { prestigio: 35, contactos: 25, etica: 15, saludMental: 20, dineroPesos: 3000000 }
      },
      {
        id: "e10_ev2",
        titulo: "🔴 Operación Prensa Mediática en Contra",
        descripcion: "Un medio local publicó notas tendenciosas sobre un cliente polémico de tu firma.",
        tipo: "negativo",
        impacto: { prestigio: -15, contactos: -10, etica: 0, saludMental: -25, dineroPesos: 0 }
      },
      {
        id: "e10_ev3",
        titulo: "🟢 Nombramiento como Miembro del Instituto de Derecho Procesal",
        descripcion: "Te incorporaron como académico titular en la Academia de Derecho de Buenos Aires.",
        tipo: "positivo",
        impacto: { prestigio: 30, contactos: 20, etica: 10, saludMental: 10, dineroPesos: 0 }
      },
      {
        id: "e10_ev4",
        titulo: "⚪ Transmisión en Vivo del Debate Oral",
        descripcion: "Tu exposición en el debate penal fue transmitida en directo para todo el país.",
        tipo: "neutro",
        impacto: { prestigio: 20, contactos: 15, etica: 0, saludMental: -5, dineroPesos: 0 }
      },
      {
        id: "e10_ev5",
        titulo: "🔴 Recusación Inesperada del Tribunal",
        descripcion: "Una maniobra de la querella demoró 3 meses el inicio del juicio por jurados.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -15, dineroPesos: -500000 }
      }
    ],
    opciones: [
      {
        id: "e10_op1",
        texto: "⚖️ Asumir la defensa técnica estricta garantizando el debido proceso ante el Jurado Popular.",
        impacto: { prestigio: 40, contactos: 30, etica: 25, saludMental: -20, dineroPesos: 15000000 },
        feedbackNarrativo: "Tu alegato de clausura ante el Jurado Popular fue transmitido por televisión. Ganaste el caso y sentaste doctrina penal."
      },
      {
        id: "e10_op2",
        texto: "❤️ Asumir la representación gratuita de la comunidad de vecinos damnificados.",
        impacto: { prestigio: 50, contactos: 35, etica: 45, saludMental: 10, dineroPesos: -1000000 },
        feedbackNarrativo: "Sacrificaste el dinero corporativo pero te convertiste en el jurista más respetado y admirado por la sociedad platense."
      },
      {
        id: "e10_op3_skill",
        texto: "⭐ [Skill Especialista] Presentar un peritaje digital irrefutable que cierra el debate en 1 hora.",
        impacto: { prestigio: 45, contactos: 40, etica: 30, saludMental: 0, dineroPesos: 22000000 },
        feedbackNarrativo: "Desmantelaste la acusación con evidencia científica inexpugnable. Antigravity cobró honorarios de éxito multimillonarios."
      }
    ]
  },

  // ETAPA 11: ELECCIONES DEL CALP Y CÁTEDRA UNLP (45 A 65 AÑOS)
  {
    id: 11,
    edadInicio: 45,
    edadFin: 65,
    puesto: "Juez de Cámara / Titular de Cátedra UNLP",
    titulo: "11. Elecciones del Colegio de Abogados y la Cúspide Académica",
    contextoEscenario: "Superando los 45 años, sos un referente ineludible en el ámbito jurídico bonaerense. Se te propone presidir el Colegio de Abogados de La Plata (CALP), asumir la Titularidad de Cátedra en la UNLP o integrar la nómina de Juez de Cámara / Juez de la Suprema Corte (SCBA).",
    dilemaTexto: "¿Hacia dónde dirigís el tramo final de tu carrera profesional hasta los 65 años?",
    eventosInesperados: [
      {
        id: "e11_ev1",
        titulo: "🟢 Homenaje Institucional en la Universidad de La Plata",
        descripcion: "La FCJyS UNLP te otorgó una placa de honor por tu trayectoria y aporte a la educación jurídica.",
        tipo: "positivo",
        impacto: { prestigio: 40, contactos: 30, etica: 25, saludMental: 20, dineroPesos: 0 }
      },
      {
        id: "e11_ev2",
        titulo: "🔴 Reforma Judicial Provincial Repentina",
        descripcion: "Un cambio en la ley orgánica del Poder Judicial obligó a reestructurar expedientes y juzgados.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: 0, etica: 0, saludMental: -15, dineroPesos: 0 }
      },
      {
        id: "e11_ev3",
        titulo: "🟢 Publicación del Libro Tratado de Derecho Bonaerense",
        descripcion: "Tu libro se transformó en la obra de referencia obligatoria para abogados y jueces de la provincia.",
        tipo: "positivo",
        impacto: { prestigio: 45, contactos: 20, etica: 15, saludMental: 15, dineroPesos: 5000000 }
      },
      {
        id: "e11_ev4",
        titulo: "⚪ Discurso de Cierre de Año en el Colegio de Abogados",
        descripcion: "Brindaste el discurso principal de fin de año frente a 500 matriculados en calle 13.",
        tipo: "neutro",
        impacto: { prestigio: 15, contactos: 15, etica: 0, saludMental: 5, dineroPesos: 0 }
      },
      {
        id: "e11_ev5",
        titulo: "🔴 Impugnación de Lista Colegial",
        descripcion: "Una presenting judicial de la oposición demoró la aprobación de los padrones electorales.",
        tipo: "negativo",
        impacto: { prestigio: -5, contactos: -10, etica: 0, saludMental: -15, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e11_op1",
        texto: "🏛️ Encabezar la lista colegial y asumir la Presidencia del Colegio de Abogados de La Plata.",
        impacto: { prestigio: 45, contactos: 50, etica: 20, saludMental: -10, dineroPesos: 18000000 },
        feedbackNarrativo: "Asumiste el sillón de conducción en calle 13. Lideraste la modernización del ejercicio profesional en toda la provincia."
      },
      {
        id: "e11_op2",
        texto: "🎓 Asumir como Profesor Titular de Cátedra en Jursoc UNLP y formar a las nuevas generaciones.",
        impacto: { prestigio: 50, contactos: 30, etica: 40, saludMental: 20, dineroPesos: 12000000 },
        feedbackNarrativo: "Te convertiste en el maestro de miles de futuros abogados. Las aulas de la UNLP se llenan para escuchar tus clases magistrales."
      },
      {
        id: "e11_op3",
        texto: "⚖️ Asumir la postulación definitiva a Juez de Cámara o Juez de la Suprema Corte (SCBA).",
        impacto: { prestigio: 50, contactos: 45, etica: 30, saludMental: 15, dineroPesos: 25000000 },
        feedbackNarrativo: "Alcanzaste la máxima magistratura de la Provincia de Buenos Aires. Tu firma quedó consagrada en fallos históricos de la SCBA."
      }
    ]
  }
];
