export interface SkillDefinition {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  beneficio: string;
}

export interface LogroDefinition {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  requisitoTexto: string;
}

export interface PreguntaJuridicaMinijuego {
  id: string;
  pregunta: string;
  opciones: string[];
  opcionCorrectaIdx: number;
  explicacion: string;
  dificultad: 1 | 2 | 3 | 4;
}

export interface CarreraGuardada {
  id: string;
  fechaISO: string;
  ciudadNatal: string;
  edadFinal: number;
  ovrFinal: number;
  patrimonioFinal: number;
  ramaPredominante: string;
  fueVictoria: boolean;
  motivoCierre: string;
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
  templanza: number;
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
  costoPesosRequerido?: number;
  impacto: ImpactoStats;
  requiereSkillId?: string;
  requiereOrigenFueraLaPlata?: boolean;
  desafioJuridico?: PreguntaJuridicaMinijuego; // Minijuego de examen si la decisión es súpermportante
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

export const LOGROS_JUEGO: LogroDefinition[] = [
  {
    id: "logro_honores",
    nombre: "Graduado de Honor UNLP",
    icono: "GraduationCap",
    descripcion: "Egresaste de la FCJyS (UNLP) con un nivel de Prestigio Técnico extraordinario.",
    requisitoTexto: "Alcanzar 75+ de Prestigio al graduarte a los 23 años"
  },
  {
    id: "logro_magnate",
    nombre: "Magnate de la Abogacía",
    icono: "Coins",
    descripcion: "Construiste un imperio financiero superando los $25.000.000 de patrimonio.",
    requisitoTexto: "Acumular más de $25.000.000 en Pesos Argentinos"
  },
  {
    id: "logro_incorruptible",
    nombre: "Defensor Incorruptible",
    icono: "ShieldCheck",
    descripcion: "Mantuviste una conducta ética intachable a lo largo de toda tu carrera.",
    requisitoTexto: "Llegar a la jubilación con 85+ en Ética Profesional"
  },
  {
    id: "logro_estrellas",
    nombre: "Abogado de las Estrellas",
    icono: "Sparkles",
    descripcion: "Representaste o llevaste a juicio a famosos argentinos mediáticos.",
    requisitoTexto: "Completar la causa de un famoso o futbolista argentino"
  },
  {
    id: "logro_dnd_socio",
    nombre: "Socio Principal de DND & Asociados",
    icono: "Briefcase",
    descripcion: "Alcanzaste el liderazgo ejecutivo de la firma jurídica DND & Asociados.",
    requisitoTexto: "Consolidarte como socio en DND & Asociados"
  },
  {
    id: "logro_patria_chica",
    nombre: "Retorno a la Patria Chica",
    icono: "Home",
    descripcion: "Decidiste volver a tu ciudad de origen para fundar la firma jurídica local.",
    requisitoTexto: "Elegir volver a tu ciudad natal siendo del Interior"
  }
];

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
    nombre: "Oratoria & Derecho Público / Contactos",
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

export const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires (CABA)",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Entre Ríos",
  "Salta",
  "Misiones",
  "Chaco",
  "Corrientes",
  "San Juan",
  "Jujuy",
  "Río Negro",
  "Neuquén",
  "Formosa",
  "Chubut",
  "San Luis",
  "Catamarca",
  "La Rioja",
  "La Pampa",
  "Santa Cruz",
  "Tierra del Fuego"
];

export const MUNICIPIOS_PBA = [
  "La Plata (Capital)",
  "Mar del Plata (General Pueyrredón)",
  "Bahía Blanca",
  "Tandil",
  "Azul",
  "Pergamino",
  "Olavarría",
  "Junín",
  "San Nicolás",
  "Quilmes",
  "Lomas de Zamora",
  "San Isidro",
  "San Martín",
  "Morón",
  "La Matanza",
  "Tigre",
  "Pilar",
  "Necochea",
  "Tres Arroyos",
  "Chivilcoy",
  "Mercedes",
  "Campana",
  "Zárate",
  "Trenque Lauquen",
  "Pehuajó",
  "Balcarce",
  "Chascomús",
  "Luján",
  "Escobar"
];

export const ETAPAS_CARRERA: EtapaVida[] = [
  // ETAPA 1: INGRESO A JURSOC UNLP (18 AÑOS O +25)
  {
    id: 1,
    edadInicio: 18,
    edadFin: 19,
    puesto: "Ingresante a 1er Año (Jursoc UNLP)",
    titulo: "1. El Ingreso a la Universidad y el Parcial de Romano",
    contextoEscenario: "Entrás por las escalinatas de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP. El ambiente es vibrante: volantes en las puertas, pasillos desbordados y clases multitudinarias. Es jueves por la noche: tus compañeros de comisión armaron previa para ir a los boliches de diagonal 74, pero el sábado rindiendo tu primer parcial decisivo de Derecho Romano.",
    dilemaTexto: "¿Cómo administrás tu tiempo en tu primera prueba de fuego universitaria?",
    eventosInesperados: [
      {
        id: "e1_ev1",
        titulo: "🟢 Paro Sorpresa de Empleados de la UNLP",
        descripcion: "Se suspendieron las clases del viernes. Tuviste 24 horas extra inesperadas para estudiar o descansar.",
        tipo: "positivo",
        impacto: { prestigio: 4, contactos: 0, etica: 0, templanza: 10, dineroPesos: 0 }
      },
      {
        id: "e1_ev2",
        titulo: "🔴 Corte de Luz en tu Depto de La Plata",
        descripcion: "Apagón sorpresivo en la zona del centro la noche previa a rendir. Tuviste que estudiar a vela.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -10, dineroPesos: -8000 }
      },
      {
        id: "e1_ev3",
        titulo: "🟢 Sorteo del Centro de Estudiantes",
        descripcion: "Te ganaste un combo de fotocopias gratis y una libreta universitaria de regalo en el subsuelo de Jursoc.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 5, etica: 0, templanza: 5, dineroPesos: 15000 }
      },
      {
        id: "e1_ev4",
        titulo: "⚪ Hallazgo en la Biblioteca de Calle 48",
        descripcion: "Encontraste un ejemplar clásico de Derecho Romano anotado por un ex Juez de la Suprema Corte.",
        tipo: "neutro",
        impacto: { prestigio: 6, contactos: 0, etica: 0, templanza: 0, dineroPesos: 0 }
      },
      {
        id: "e1_ev5",
        titulo: "🔴 Colectivo de Línea Roto",
        descripcion: "Te quedaste tirado en plaza Italia y llegaste tarde a la clase teórica del Titular de Cátedra.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: -3, etica: 0, templanza: -8, dineroPesos: -4000 }
      }
    ],
    opciones: [
      {
        id: "e1_op1",
        texto: "📚 Estudio enfocado: Dedicar el fin de semana completo a leer fuentes romanas.",
        desafioJuridico: {
          id: "quiz_e1",
          pregunta: "¿Qué principio básico del Derecho Romano establece 'Nemo plus iuris ad alium transferre potest quam ipse habet'?",
          opciones: [
            "Nadie puede transmitir a otro un derecho más amplio del que él mismo posee.",
            "El contrato celebrado entre ausentes se presume perfeccionado al momento del pago.",
            "La cosa juzgada solo afecta a quienes participaron de la litis.",
            "El poseedor de buena fe no debe rendir cuentas de los frutos consumidos."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "Es la regla clásica de la transmisión de derechos: nadie puede otorgar más de lo que tiene.",
          dificultad: 1
        },
        impacto: { prestigio: 12, contactos: -4, etica: 5, templanza: -10, dineroPesos: -15000, impactoRamas: { civilComercial: 12 } },
        feedbackNarrativo: "Respondiste con precisión jurídica en la cátedra de Romano. Aprobaste con honores."
      },
      {
        id: "e1_op2",
        texto: "🍺 Salir de joda a diagonal 74 y estudiar sin dormir el viernes por la noche.",
        impacto: { prestigio: -5, contactos: 15, etica: -5, templanza: 10, dineroPesos: -35000, impactoRamas: { administrativoPublico: 5 } },
        feedbackNarrativo: "La previa fue inolvidable. Te hiciste amigo de futuros dirigentes estudiantiles y aprobaste con un 4."
      },
      {
        id: "e1_op3",
        texto: "🎓 [Curso Certificado Arancelado] Inscribirte al Seminario Inicial de Litigación ($120.000).",
        costoPesosRequerido: 120000,
        impacto: { prestigio: 18, contactos: 8, etica: 5, templanza: -8, dineroPesos: -120000, impactoRamas: { penal: 12 } },
        feedbackNarrativo: "Invertiste en el seminario certificado de la facultad. Aprendiste técnicas de oralidad antes que tus compañeros."
      },
      {
        id: "e1_op4",
        texto: "🏛️ Integrarte a la Mesa de Apuntes del Centro de Estudiantes para repartir guías de lectura.",
        impacto: { prestigio: 4, contactos: 18, etica: 0, templanza: -4, dineroPesos: 45000, impactoRamas: { administrativoPublico: 10 } },
        feedbackNarrativo: "Conociste a estudiantes de 5to año y armaste contactos claves en el subsuelo de Jursoc."
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
    contextoEscenario: "Tenés 19 años. Cursás Derecho Político y Constitucional. Tus amigos organizaron una escapada de fin de semana a la costa y, en simultáneo, un conocido abogado penalista te ofrece acompañarlo a audiencias de excarcelación en el Fuero Penal de calle 8.",
    dilemaTexto: "¿Aceptás el viaje de relax con amigos o te metés de lleno en la práctica penal bonaerense?",
    eventosInesperados: [
      {
        id: "e2_ev1",
        titulo: "🟢 Invitación a Charla Magistral de un Juez Penal",
        descripcion: "Un Juez de Garantías dictó una conferencia exclusiva y te regaló su libro autografiado.",
        tipo: "positivo",
        impacto: { prestigio: 8, contactos: 8, etica: 3, templanza: 5, dineroPesos: 0 }
      },
      {
        id: "e2_ev2",
        titulo: "🔴 Demora por Paro de Transporte en La Plata",
        descripcion: "Tuviste que pagar un taxi caro para no perder el examen parcial de Constitucional.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -8, dineroPesos: -18000 }
      },
      {
        id: "e2_ev3",
        titulo: "⚪ Encuentro Casual en la Plaza Moreno",
        descripcion: "Te cruzaste con un ex compañero del colegio secundario que ahora cursa Ciencia Política.",
        tipo: "neutro",
        impacto: { prestigio: 0, contactos: 6, etica: 0, templanza: 3, dineroPesos: 0 }
      },
      {
        id: "e2_ev4",
        titulo: "🟢 Descuento Especial en el Comedor Universitario",
        descripcion: "Aprovechaste el menú estudiantil del comedor de la UNLP y ahorraste bastante dinero este mes.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 3, etica: 0, templanza: 8, dineroPesos: 35000 }
      },
      {
        id: "e2_ev5",
        titulo: "🔴 Pérdida de Apuntes en la Fotocopiadora",
        descripcion: "Te extraviaron el resumen de Derecho Político la noche previa al examen.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -12, dineroPesos: -10000 }
      }
    ],
    opciones: [
      {
        id: "e2_op1",
        texto: "🌊 Viajar a la costa con tus amigos para despejar la cabeza y recargar templanza.",
        impacto: { prestigio: -3, contactos: 12, etica: 0, templanza: 20, dineroPesos: -90000 },
        feedbackNarrativo: "Volviste relajado y renovado. Afianzaste tu grupo de amigos de la vida."
      },
      {
        id: "e2_op2",
        texto: "⚖️ Quedarte asistiendo al penalista en las audiencias de prisión preventiva en calle 8.",
        desafioJuridico: {
          id: "quiz_e2",
          pregunta: "En el Fuero Penal de la Prov. de Buenos Aires, ¿qué órgano judicial dicta la medida de Prisión Preventiva a pedido del Fiscal?",
          opciones: [
            "El Juez de Garantías.",
            "El Tribunal de Casación Penal.",
            "El Fiscal de Cámara.",
            "El Defensor Oficial General."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "El Juez de Garantías es el único facultado para resolver sobre la libertad o prisión preventiva del imputado en la Investigación Penal Preparatoria (IPP).",
          dificultad: 1
        },
        impacto: { prestigio: 15, contactos: 12, etica: 3, templanza: -10, dineroPesos: 250000, impactoRamas: { penal: 18 } },
        feedbackNarrativo: "Demostraste solvencia procesal presenciando las audiencias ante el Juez de Garantías."
      },
      {
        id: "e2_op3",
        texto: "📖 Armar un grupo de estudio intensivo en la Biblioteca Central de la UNLP.",
        impacto: { prestigio: 8, contactos: 6, etica: 8, templanza: -5, dineroPesos: -10000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Consolidaste una base doctrinal firme en la biblioteca de calle 48."
      }
    ]
  },

  // ETAPA 3 A 6 (SIMILARES CON OPCIONES)
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
        impacto: { prestigio: 12, contactos: 12, etica: 5, templanza: 8, dineroPesos: 0 }
      },
      {
        id: "e3_ev2",
        titulo: "🔴 Discusión Fuerte en Asamblea Estudiantil",
        descripcion: "Un acalorado debate político en el patio de la facultad te generó tensión y agotamiento.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: -3, etica: 0, templanza: -10, dineroPesos: 0 }
      },
      {
        id: "e3_ev3",
        titulo: "🟢 Cobro de Beca de Ayudantía",
        descripcion: "El decanato liquidó un pago diferido por tus tareas de colaboración académica.",
        tipo: "positivo",
        impacto: { prestigio: 3, contactos: 3, etica: 0, templanza: 5, dineroPesos: 120000 }
      },
      {
        id: "e3_ev4",
        titulo: "⚪ Asistencia a Jornadas de Derecho Administrativo",
        descripcion: "Escuchaste exposiciones de juristas nacionales en el aula magna de calle 48.",
        tipo: "neutro",
        impacto: { prestigio: 6, contactos: 4, etica: 0, templanza: 0, dineroPesos: 0 }
      },
      {
        id: "e3_ev5",
        titulo: "🔴 Rotura de Computadora Personal",
        descripcion: "Se averió el disco de tu notebook con los modelos de escritos y resúmenes.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -12, dineroPesos: -90000 }
      }
    ],
    opciones: [
      {
        id: "e3_op1",
        texto: "🏛️ Militancia activa en Jursoc: Gestionar apuntes, organizar eventos y red de contactos.",
        impacto: { prestigio: 6, contactos: 22, etica: -8, templanza: -8, dineroPesos: 150000, impactoRamas: { administrativoPublico: 18 } },
        feedbackNarrativo: "Te convertiste en un referente indiscutido en los pasillos de calle 48."
      },
      {
        id: "e3_op2",
        texto: "🎓 Beca de Investigación Académica: Escribir artículos de doctrina jurídica.",
        desafioJuridico: {
          id: "quiz_e3",
          pregunta: "Según la doctrina del Derecho Administrativo, ¿cuál es el carácter esencial de los actos administrativos expedidos por el Poder Ejecutivo?",
          opciones: [
            "Presunción de legitimidad y ejecutividad.",
            "Nulidad absoluta de oficio sin revisión judicial.",
            "Carácter meramente consultivo sin fuerza obligatoria.",
            "Sujeción previa a homologación bancaria."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "El acto administrativo goza de presunción de legitimidad y fuerza ejecutiva conforme a la Ley de Procedimiento Administrativo.",
          dificultad: 2
        },
        impacto: { prestigio: 20, contactos: 4, etica: 12, templanza: -6, dineroPesos: 250000, impactoRamas: { civilComercial: 12, cibertech: 10 } },
        feedbackNarrativo: "Publicaste un artículo doctrinario respaldado por la ley administrativa provincial."
      },
      {
        id: "e3_op3",
        texto: "💼 [Diplomatura Arancelada] Cursar la Diplomatura en Ciberderecho ($180.000).",
        costoPesosRequerido: 180000,
        impacto: { prestigio: 22, contactos: 10, etica: 8, templanza: -10, dineroPesos: -180000, impactoRamas: { cibertech: 25 } },
        feedbackNarrativo: "Te diplomaste en ciberderecho e IA jurídica antes de egresar de la carrera."
      }
    ]
  },

  {
    id: 4,
    edadInicio: 21,
    edadFin: 22,
    puesto: "Estudiante Avanzado de 4to Año",
    titulo: "4. Derecho Penal II y el Ahogo Económico de Alquiler",
    contextoEscenario: "A los 21 años las exigencias crecen: cursás Penal II y Obligaciones. El costo del alquiler en La Plata se disparó y tenés que decidir si atrasás materias para trabajar más horas o apretás los dientes sacrificando templanza.",
    dilemaTexto: "¿Cómo enfrentás la recta final de materias pesadas frente a la presión financiera?",
    eventosInesperados: [
      {
        id: "e4_ev1",
        titulo: "🟢 Devolución de Depósito de Alquiler",
        descripcion: "Recuperaste dinero de una garantía de alquiler anterior en La Plata.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: 10, dineroPesos: 180000 }
      },
      {
        id: "e4_ev2",
        titulo: "🔴 Cambio de Cátedra Sorpresivo",
        descripcion: "Cambiaron la comisión de examen oral y el nuevo Profesor Titular es híper exigente.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -15, dineroPesos: 0 }
      },
      {
        id: "e4_ev3",
        titulo: "🟢 Regalo de Colección de Libros Penales",
        descripcion: "Un abogado jubilado donó su biblioteca de Códigos comentados al Centro de Estudiantes.",
        tipo: "positivo",
        impacto: { prestigio: 10, contactos: 4, etica: 0, templanza: 6, dineroPesos: 0 }
      },
      {
        id: "e4_ev4",
        titulo: "⚪ Debate Institucional sobre Reforma del Código Penal",
        descripcion: "Asististe como oyente a la comisión de legisladores bonaerenses en la Cámara de Diputados.",
        tipo: "neutro",
        impacto: { prestigio: 6, contactos: 6, etica: 0, templanza: 0, dineroPesos: 0 }
      },
      {
        id: "e4_ev5",
        titulo: "🔴 Multa por Trámite Municipal Extemporáneo",
        descripcion: "Tuviste que saldar una multa por una habilitación comercial de un familiar.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -8, dineroPesos: -45000 }
      }
    ],
    opciones: [
      {
        id: "e4_op1",
        texto: "💸 Atrasar 2 materias un cuatrimestre y trabajar como procurador ($550.000/mes).",
        impacto: { prestigio: 6, contactos: 12, etica: 3, templanza: 8, dineroPesos: 1200000, impactoRamas: { penal: 10 } },
        feedbackNarrativo: "Juntaste $1.200.000 y salvaste el alquiler holgadamente."
      },
      {
        id: "e4_op2",
        texto: "🔥 Rendir todo en mesa libre: Vivir a café y no dormir durante 3 semanas.",
        desafioJuridico: {
          id: "quiz_e4",
          pregunta: "Según el Art. 2561 del Código Civil y Comercial de la Nación (CCyCN), ¿cuál es el plazo general de prescripción de la acción por responsabilidad civil extracontractual?",
          opciones: [
            "3 años.",
            "1 año.",
            "5 años.",
            "10 años."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "El plazo prescripcional para reclamos de daños y perjuicios derivados de responsabilidad extracontractual es de 3 años.",
          dificultad: 2
        },
        impacto: { prestigio: 22, contactos: -6, etica: 6, templanza: -20, dineroPesos: -60000, impactoRamas: { civilComercial: 15 } },
        feedbackNarrativo: "Rendiste libre con nota perfecta de 10 citando el Código Civil y Comercial."
      },
      {
        id: "e4_op3",
        texto: "🤝 Armar un emprendimiento de resúmenes y modelos de examen para ingresantes.",
        impacto: { prestigio: 3, contactos: 15, etica: -3, templanza: -6, dineroPesos: 700000, impactoRamas: { administrativoPublico: 8 } },
        feedbackNarrativo: "Generaste una fuente de ingresos propia vendiendo guías de estudio."
      }
    ]
  },

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
        impacto: { prestigio: 15, contactos: 10, etica: 8, templanza: 10, dineroPesos: 0 }
      },
      {
        id: "e5_ev2",
        titulo: "🔴 Error de Foliado en Expediente de Práctica",
        descripcion: "Un fallo en el foliado físico te hizo perder 4 horas rehaciendo el trámite en casilleros.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -10, dineroPesos: 0 }
      },
      {
        id: "e5_ev3",
        titulo: "🟢 Otorgamiento de Mención de Honor Académica",
        descripcion: "La facultad distinguió tu promedio en la lista de graduación inminente.",
        tipo: "positivo",
        impacto: { prestigio: 14, contactos: 6, etica: 10, templanza: 8, dineroPesos: 0 }
      },
      {
        id: "e5_ev4",
        titulo: "⚪ Conferencia sobre Litigio Estratégico en SCBA",
        descripcion: "Presenciaste un alegato histórico en el salón de la Suprema Corte de calle 13.",
        tipo: "neutro",
        impacto: { prestigio: 6, contactos: 4, etica: 0, templanza: 0, dineroPesos: 0 }
      },
      {
        id: "e5_ev5",
        titulo: "🔴 Robo de Mochila con la Notebook",
        descripcion: "Te sustrajeron la mochila en la parada de colectivo con tus apuntes finales.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -20, dineroPesos: -120000 }
      }
    ],
    opciones: [
      {
        id: "e5_op1",
        texto: "❤️ Dedicación total al Consultorio Gratuito: Resolver amparos de salud comunitarios.",
        desafioJuridico: {
          id: "quiz_e5",
          pregunta: "Según el Art. 43 de la Constitución Nacional, ¿qué garantía constitucional procede ante cualquier forma de discriminación o lesión arbitraria a derechos garantizados si no existe otro medio judicial más idóneo?",
          opciones: [
            "Acción de Amparo.",
            "Juicio Ejecutivo Ordinario.",
            "Recurso de Casación.",
            "Interdicto de Recobrar la Posesión."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "La Acción de Amparo es la vía constitucional idónea y expedita para tutelar derechos fundamentales ante actos arbitrarios.",
          dificultad: 2
        },
        impacto: { prestigio: 22, contactos: 10, etica: 25, templanza: 8, dineroPesos: 80000, impactoRamas: { administrativoPublico: 18 } },
        feedbackNarrativo: "Redactaste una Acción de Amparo colectiva impecable que salvó una cobertura médica en La Plata."
      },
      {
        id: "e5_op2",
        texto: "⚖️ Pasantía en el Juzgado Civil: Conocer los secretos de las sentencias por dentro.",
        impacto: { prestigio: 15, contactos: 15, etica: 10, templanza: -10, dineroPesos: 380000, impactoRamas: { civilComercial: 18 } },
        feedbackNarrativo: "Entendiste cómo piensan los jueces de primera instancia."
      }
    ]
  },

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
        impacto: { prestigio: 10, contactos: 12, etica: 4, templanza: 10, dineroPesos: 0 }
      },
      {
        id: "e6_ev2",
        titulo: "🔴 Lluvia Torrencial en el Festejo de Calle 48",
        descripcion: "Una tormenta sorpresiva arruinó la pancarta de recibida que te prepararon tus amigos.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -8, dineroPesos: -12000 }
      },
      {
        id: "e6_ev3",
        titulo: "🟢 Regalo Sorpresa de Graduación",
        descripcion: "Tu familia te regaló un maletín de cuero y el primer Código Civil y Comercial profesional.",
        tipo: "positivo",
        impacto: { prestigio: 8, contactos: 3, etica: 0, templanza: 15, dineroPesos: 60000 }
      },
      {
        id: "e6_ev4",
        titulo: "⚪ Foto Oficial en las Escalinatas",
        descripcion: "Quedaste retratado en el álbum oficial de egresados de la UNLP.",
        tipo: "neutro",
        impacto: { prestigio: 4, contactos: 4, etica: 0, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e6_ev5",
        titulo: "🔴 Trámite de Título Demorado en Ministerio",
        descripcion: "Una demora burocrática atrasó 2 semanas la entrega física de tu diploma.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -10, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "recibida_op1",
        texto: "🥚 Festejo tradicional descontrolado: Huevos, harina, yerba, pintura y corte de calle 48.",
        impacto: { prestigio: 6, contactos: 18, etica: -3, templanza: 20, dineroPesos: -80000 },
        feedbackNarrativo: "¡Terminaste enharinado bailando en la calle! Festejo inolvidable."
      },
      {
        id: "recibida_op2",
        texto: "🍷 Festejo íntimo y familiar: Asado en casa con tu familia cercana y perfil bajo.",
        impacto: { prestigio: 15, contactos: 4, etica: 18, templanza: 15, dineroPesos: -40000 },
        feedbackNarrativo: "Un abrazo emocionado con tus seres queridos. Sobrio y enfocado."
      },
      {
        id: "recibida_op3",
        texto: "🤫 Graduación en silencio: Cambiarte en el baño, guardar el título y salir a matricularte.",
        impacto: { prestigio: 10, contactos: -6, etica: 10, templanza: 0, dineroPesos: 40000 },
        feedbackNarrativo: "Sin festejos ni fotos. Enfocado inmediatamente en la matriculación."
      }
    ]
  },

  // ETAPA 7 A 11 (EJERCICIO PROFESIONAL CON DESAFÍOS DE NIVEL 3 Y 4)
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
        impacto: { prestigio: 10, contactos: 8, etica: 8, templanza: 8, dineroPesos: 350000 }
      },
      {
        id: "e7_ev2",
        titulo: "🔴 Pago Obligatorio de Matrícula Anual CALP",
        descripcion: "Deducción automática de la cuota bianual obligatoria del Colegio de Abogados ($250.000).",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -8, dineroPesos: -250000 }
      },
      {
        id: "e7_ev3",
        titulo: "🟢 Invitación a Comisión de Jóvenes Abogados",
        descripcion: "Te invitaron a coordinar la Subcomisión de Derecho Procesal en el Colegio.",
        tipo: "positivo",
        impacto: { prestigio: 10, contactos: 18, etica: 4, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e7_ev4",
        titulo: "⚪ Juramento Colectivo en el Salón de Actos",
        descripcion: "Juraste la matrícula junto a 30 colegas de tu misma camada de la UNLP.",
        tipo: "neutro",
        impacto: { prestigio: 4, contactos: 6, etica: 4, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e7_ev5",
        titulo: "🔴 Falla Técnica en Firma Digital Bonaerense",
        descripcion: "Un problema con el token te obligó a perder toda la mañana en la delegación del Colegio.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -10, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "empleo_op1",
        texto: "🏢 Estudio Corporativo 'DND & Asociados': Innovación, contratos tech y sueldo de $1.400.000/mes.",
        desafioJuridico: {
          id: "quiz_e7",
          pregunta: "En la Ley de Juicio por Jurados de la Prov. de Buenos Aires (Ley 14.543), ¿cuántos votos de los 12 jurados se requieren para dictar un veredicto de CULPABILIDAD en delitos no perpetuos?",
          opciones: [
            "Al menos 10 votos de los 12 jurados.",
            "Unanimidad absoluta (12 de 12).",
            "Mayoría simple (7 de 12).",
            "Al menos 8 votos de 12."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "En la Prov. de Buenos Aires, el veredicto de culpabilidad en delitos con pena no perpetua exige al menos 10 votos concordantes.",
          dificultad: 3
        },
        impacto: { prestigio: 20, contactos: 15, etica: 6, templanza: -10, dineroPesos: 3500000, impactoRamas: { cibertech: 20, civilComercial: 15 } },
        feedbackNarrativo: "Superaste el examen técnico de ingreso a DND & Asociados con nota sobresaliente."
      },
      {
        id: "empleo_op2",
        texto: "⚽ [Causa de Famosos] Defender a un Futbolista Estrella de La Plata en un accidente de tránsito nocturno.",
        impacto: { prestigio: 22, contactos: 25, etica: -10, templanza: -15, dineroPesos: 4500000, impactoRamas: { penal: 25 } },
        feedbackNarrativo: "Asumiste la causa mediática del futbolista platense. Saliste en las portadas de todos los diarios deportivos."
      },
      {
        id: "empleo_op3",
        texto: "🏛️ Gobernación PBA / Asesoría General de Gobierno: Puesto en la Administración Pública.",
        impacto: { prestigio: 12, contactos: 25, etica: 10, templanza: 8, dineroPesos: 2500000, impactoRamas: { administrativoPublico: 25 } },
        feedbackNarrativo: "Ingresaste a la trinchera del derecho administrativo provincial."
      }
    ]
  },

  {
    id: 8,
    edadInicio: 26,
    edadFin: 28,
    puesto: "Abogado/a Senior de Litigios",
    titulo: "8. El Caso del Cantante de Cumbia 420 y el Dinero Turbio",
    contextoEscenario: "Tenés 26 años. Un famoso cantante de Cumbia 420 / Trap argentino te busca de urgencia por un escándalo con destrozos en un hotel y acusaciones graves. En paralelo, un cliente turbio ofrece $8.000.000 en efectivo por limpiar fondos.",
    dilemaTexto: "¿Aceptás la causa mediática del cantante o el dinero turbio corporativo?",
    eventosInesperados: [
      {
        id: "e8_ev1",
        titulo: "🟢 Regulación Extraordinaria de Honorarios",
        descripcion: "Un Juez de Primera Instancia reguló honorarios por encima del mínimo legal.",
        tipo: "positivo",
        impacto: { prestigio: 12, contactos: 6, etica: 3, templanza: 10, dineroPesos: 1100000 }
      },
      {
        id: "e8_ev2",
        titulo: "🔴 Inspección Sorpresiva de la AFIP / ARBA",
        descripcion: "Una auditoría fiscal de rutina te hizo perder 3 días revisando libros.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -12, dineroPesos: -180000 }
      },
      {
        id: "e8_ev3",
        titulo: "🟢 Cliente Recomendado por Colega",
        descripcion: "Un colega penalista te derivó un cliente corporativo importante.",
        tipo: "positivo",
        impacto: { prestigio: 10, contactos: 12, etica: 6, templanza: 6, dineroPesos: 650000 }
      },
      {
        id: "e8_ev4",
        titulo: "⚪ Publicación de Comentario de Fallo",
        descripcion: "Tu análisis sobre un fallo reciente de la Corte bonaerense fue publicado con elogios.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 4, etica: 4, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e8_ev5",
        titulo: "🔴 Conflicto de Intereses Inesperado",
        descripcion: "Tuviste que renunciar al patrocinio de un expediente por parentesco lejano.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: -3, etica: 8, templanza: -8, dineroPesos: -200000 }
      }
    ],
    opciones: [
      {
        id: "e8_op1",
        texto: "🎤 Defender al Cantante de Cumbia 420: Lograr un acuerdo de conciliación rápido ($4.000.000).",
        impacto: { prestigio: 15, contactos: 30, etica: -10, templanza: -15, dineroPesos: 4000000, impactoRamas: { penal: 20 } },
        feedbackNarrativo: "Cerraste el conflicto del cantante en 48 horas. Las redes sociales y programas de TV no paran de nombrarte."
      },
      {
        id: "e8_op2",
        texto: "💰 Aceptar el dinero turbio ($8.000.000) e interponer recursos dilatorios.",
        impacto: { prestigio: -20, contactos: 10, etica: -40, templanza: -20, dineroPesos: 8000000 },
        feedbackNarrativo: "Cobraste $8.000.000 en efectivo de una sola vez. Financieramente volás, pero la fiscalía investiga tu firma."
      },
      {
        id: "e8_op3",
        texto: "❌ Rechazar ambos casos e inscribirte a la Maestría en Derecho UNLP ($1.500.000).",
        costoPesosRequerido: 1500000,
        impacto: { prestigio: 25, contactos: 10, etica: 25, templanza: 5, dineroPesos: -1500000 },
        feedbackNarrativo: "Mantuviste tu ética intachable e invertiste en la Maestría oficial de la UNLP."
      }
    ]
  },

  {
    id: 9,
    edadInicio: 28,
    edadFin: 32,
    puesto: "Director/a de Firma Jurídica",
    titulo: "9. ¿Fundar tu propio Estudio Jurídico e Invertir en Empleados?",
    contextoEscenario: "A los 28 años tenés capital acumulado y prestigio. Se presenta la oportunidad de alquilar un piso en calle 12, poner tu chapa y contratar personal (Abogados Expertos, Junior y Contador), o bien hacerte Socio Principal en DND & Asociados.",
    dilemaTexto: "¿Darás el salto hacia la independencia profesional contratando tu propio equipo?",
    eventosInesperados: [
      {
        id: "e9_ev1",
        titulo: "🟢 Auditoría Contable Exitosa",
        descripcion: "Tu contador optimizó las declaraciones juradas ahorrando impuestos.",
        tipo: "positivo",
        impacto: { prestigio: 10, contactos: 5, etica: 10, templanza: 10, dineroPesos: 600000 }
      },
      {
        id: "e9_ev2",
        titulo: "🔴 Incremento de Expensas y Alquiler del Despacho",
        descripcion: "Un aumento no pactado del inmueble comercial redujo los márgenes netos.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -10, dineroPesos: -350000 }
      },
      {
        id: "e9_ev3",
        titulo: "🟢 Adjudicación de Asesoría Exclusiva a Empresa",
        descripcion: "Firmaste un abono mensual fijo con una distribuidora líder del Gran La Plata.",
        tipo: "positivo",
        impacto: { prestigio: 18, contactos: 15, etica: 4, templanza: 8, dineroPesos: 1800000 }
      },
      {
        id: "e9_ev4",
        titulo: "⚪ Entrevista en Radio / Diario Local Platense",
        descripcion: "Te consultaron como especialista opinando sobre un proyecto de ley procesal.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 8, etica: 0, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e9_ev5",
        titulo: "🔴 Torpeza Procesal de Abogado Junior",
        descripcion: "Un abogado junior del estudio omitió adjuntar una cédula provocando un apercibimiento.",
        tipo: "negativo",
        impacto: { prestigio: -8, contactos: 0, etica: 0, templanza: -12, dineroPesos: -150000 }
      }
    ],
    opciones: [
      {
        id: "e9_op1",
        texto: "🚀 Abrir tu propio Estudio Jurídico en La Plata e Invertir $4.000.000 en equipo y chapa.",
        costoPesosRequerido: 4000000,
        impacto: { prestigio: 25, contactos: 20, etica: 10, templanza: -15, dineroPesos: 7500000, impactoRamas: { civilComercial: 20, penal: 20 } },
        feedbackNarrativo: "¡Pusiste la chapa con tu nombre en la puerta! Tus ingresos netos despegaron."
      },
      {
        id: "e9_op2",
        texto: "🏢 Consolidarte como Socio Managing Principal de DND & Asociados.",
        impacto: { prestigio: 20, contactos: 25, etica: 8, templanza: -8, dineroPesos: 6800000, impactoRamas: { cibertech: 22, administrativoPublico: 15 } },
        feedbackNarrativo: "Tomaste el liderazgo ejecutivo de la firma corporativa DND & Asociados."
      },
      {
        id: "e9_op3",
        texto: "🏛️ Mantenerte en la función pública y ascender a Secretario de Juzgado / Asesor General.",
        impacto: { prestigio: 22, contactos: 28, etica: 18, templanza: 8, dineroPesos: 4200000, impactoRamas: { administrativoPublico: 25 } },
        feedbackNarrativo: "Elegiste el camino institucional con estabilidad absoluta y gran poder."
      }
    ]
  },

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
        impacto: { prestigio: 25, contactos: 18, etica: 10, templanza: 15, dineroPesos: 2200000 }
      },
      {
        id: "e10_ev2",
        titulo: "🔴 Operación Prensa Mediática en Contra",
        descripcion: "Un medio local publicó notas tendenciosas sobre un cliente polémico de tu firma.",
        tipo: "negativo",
        impacto: { prestigio: -10, contactos: -8, etica: 0, templanza: -18, dineroPesos: 0 }
      },
      {
        id: "e10_ev3",
        titulo: "🟢 Nombramiento como Miembro del Instituto de Derecho Procesal",
        descripcion: "Te incorporaron como académico titular en la Academia de Derecho de Buenos Aires.",
        tipo: "positivo",
        impacto: { prestigio: 22, contactos: 15, etica: 8, templanza: 8, dineroPesos: 0 }
      },
      {
        id: "e10_ev4",
        titulo: "⚪ Transmisión en Vivo del Debate Oral",
        descripcion: "Tu exposición en el debate penal fue transmitida en directo para todo el país.",
        tipo: "neutro",
        impacto: { prestigio: 15, contactos: 10, etica: 0, templanza: -4, dineroPesos: 0 }
      },
      {
        id: "e10_ev5",
        titulo: "🔴 Recusación Inesperada del Tribunal",
        descripcion: "Una maniobra de la querella demoró 3 meses el inicio del juicio por jurados.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -10, dineroPesos: -350000 }
      }
    ],
    opciones: [
      {
        id: "e10_op1",
        texto: "⚖️ Asumir la defensa técnica estricta garantizando el debido proceso ante el Jurado Popular.",
        desafioJuridico: {
          id: "quiz_e10",
          pregunta: "¿Qué recurso extraordinario procede ante la Suprema Corte de Justicia de la Prov. de Buenos Aires (SCBA) por violación de la doctrina legal del Tribunal?",
          opciones: [
            "Recurso Extraordinario de Inaplicabilidad de Ley (REIL).",
            "Recurso de Apelación Extraordinario de Garantías.",
            "Recurso Directo de Queja por Retardo de Justicia.",
            "Amparo Colectivo de Urgencia."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "El REIL es el recurso constitucional ante la SCBA cuando la sentencia recurrida viola la doctrina legal sentada por el Máximo Tribunal bonaerense.",
          dificultad: 4
        },
        impacto: { prestigio: 30, contactos: 20, etica: 18, templanza: -15, dineroPesos: 11000000 },
        feedbackNarrativo: "Tu alegato de clausura ante el Jurado Popular sentado en jurisprudencia de la SCBA fue aplaudido de pie."
      },
      {
        id: "e10_op2",
        texto: "🎓 Doctorado en Ciencias Jurídicas UNLP: Redactar y defender tu Tesis Doctoral ($3.500.000).",
        costoPesosRequerido: 3500000,
        impacto: { prestigio: 35, contactos: 25, etica: 25, templanza: 10, dineroPesos: -3500000 },
        feedbackNarrativo: "¡Defendiste tu Tesis Doctoral con sobresaliente cum laude en la UNLP!"
      }
    ]
  },

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
        impacto: { prestigio: 30, contactos: 20, etica: 18, templanza: 15, dineroPesos: 0 }
      },
      {
        id: "e11_ev2",
        titulo: "🔴 Reforma Judicial Provincial Repentina",
        descripcion: "Un cambio en la ley orgánica del Poder Judicial obligó a reestructurar expedientes y juzgados.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: 0, etica: 0, templanza: -10, dineroPesos: 0 }
      },
      {
        id: "e11_ev3",
        titulo: "🟢 Publicación del Libro Tratado de Derecho Bonaerense",
        descripcion: "Tu libro se transformó en la obra de referencia obligatoria para abogados y jueces de la provincia.",
        tipo: "positivo",
        impacto: { prestigio: 35, contactos: 15, etica: 10, templanza: 10, dineroPesos: 3800000 }
      },
      {
        id: "e11_ev4",
        titulo: "⚪ Discurso de Cierre de Año en el Colegio de Abogados",
        descripcion: "Brindaste el discurso principal de fin de año frente a 500 matriculados en calle 13.",
        tipo: "neutro",
        impacto: { prestigio: 10, contactos: 10, etica: 0, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e11_ev5",
        titulo: "🔴 Impugnación de Lista Colegial",
        descripcion: "Una presentación judicial de la oposición demoró la aprobación de los padrones electorales.",
        tipo: "negativo",
        impacto: { prestigio: -3, contactos: -6, etica: 0, templanza: -10, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e11_op1",
        texto: "🏛️ Encabezar la lista colegial y asumir la Presidencia del Colegio de Abogados de La Plata.",
        impacto: { prestigio: 30, contactos: 35, etica: 15, templanza: -8, dineroPesos: 14000000 },
        feedbackNarrativo: "Asumiste la Presidencia en calle 13. Lideraste la modernización del ejercicio profesional."
      },
      {
        id: "e11_op2",
        texto: "🎓 Asumir como Profesor Titular de Cátedra en Jursoc UNLP y formar a las nuevas generaciones.",
        impacto: { prestigio: 35, contactos: 22, etica: 28, templanza: 15, dineroPesos: 9500000 },
        feedbackNarrativo: "Te convertiste en el maestro de miles de futuros abogados platenses."
      },
      {
        id: "e11_op3",
        texto: "⚖️ Asumir la postulación definitiva a Juez de Cámara o Juez de la Suprema Corte (SCBA).",
        desafioJuridico: {
          id: "quiz_e11",
          pregunta: "Para asumir como Ministro de la Suprema Corte de Justicia de la Prov. de Buenos Aires (SCBA), ¿qué acuerdo legislativo se requiere según la Constitución Provincial?",
          opciones: [
            "Acuerdo del Senado Provincial por mayoría de dos tercios de sus miembros presentes.",
            "Decreto de necesidad y urgencia del Gobernador sin acuerdo parlamentario.",
            "Votación popular directa en elecciones generales.",
            "Designación unánime del Colegio de Abogados."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "El nombramiento de Ministros de la SCBA requiere propuesta del Ejecutivo y acuerdo del Senado bonaerense por mayoría de dos tercios.",
          dificultad: 4
        },
        impacto: { prestigio: 40, contactos: 35, etica: 25, templanza: 15, dineroPesos: 18000000 },
        feedbackNarrativo: "Superaste el pliego del Senado bonaerense. Juraste como Ministro de la Suprema Corte de la Provincia de Buenos Aires."
      }
    ]
  }
];
