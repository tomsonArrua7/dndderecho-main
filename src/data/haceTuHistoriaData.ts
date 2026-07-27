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
  opcionCorrectaIdx: number; // 0 (A), 1 (B), 2 (C), o 3 (D)
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
  laboral: number;
  ambiental: number;
  familia: number;
  internacional: number;
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
  desafioJuridico?: PreguntaJuridicaMinijuego;
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
  },
  {
    id: "logro_mente_acero",
    nombre: "Mente de Acero",
    icono: "Zap",
    descripcion: "Soportaste el estrés del litigio manteniendo un nivel de Templanza formidable.",
    requisitoTexto: "Llegar a 85+ en Templanza durante la carrera"
  },
  {
    id: "logro_operador",
    nombre: "Operador de Pasillos",
    icono: "Users",
    descripcion: "Construiste la red de influencias políticas más poderosa de la provincia.",
    requisitoTexto: "Alcanzar 85+ en Contactos / Influencia"
  },
  {
    id: "logro_laboralista",
    nombre: "Martillo de los Trabajadores",
    icono: "Briefcase",
    descripcion: "Especialista respetado en juicios laborales y convenios colectivos.",
    requisitoTexto: "Sobresalir en la rama del Derecho Laboral"
  },
  {
    id: "logro_ambientalista",
    nombre: "Guardián Ambiental",
    icono: "Leaf",
    descripcion: "Llevaste adelante una causa colectiva en defensa del medio ambiente bonaerense.",
    requisitoTexto: "Resolver con éxito un amparo ambiental"
  },
  {
    id: "logro_scba_juez",
    nombre: "Magistrado de la Suprema Corte",
    icono: "Scale",
    descripcion: "Obtuviste el acuerdo del Senado para integrar la Suprema Corte de Justicia.",
    requisitoTexto: "Ascender a la cúspide de la Magistratura PBA"
  },
  {
    id: "logro_tesis_doctor",
    nombre: "Doctor Summa Cum Laude",
    icono: "GraduationCap",
    descripcion: "Defendiste tu Tesis Doctoral con la máxima calificación en la UNLP.",
    requisitoTexto: "Completar el Doctorado en Ciencias Jurídicas"
  },
  {
    id: "logro_lider_calp",
    nombre: "Presidente del Colegio de Abogados",
    icono: "Building2",
    descripcion: "Presidiste el Colegio de Abogados de La Plata representando al fuero.",
    requisitoTexto: "Encabezar la lista ganadora del CALP"
  },
  {
    id: "logro_ddhh",
    nombre: "Defensor de Derechos Humanos",
    icono: "Shield",
    descripcion: "Litigaste ante la Corte Interamericana de Derechos Humanos (Corte IDH).",
    requisitoTexto: "Ganar una causa ante organismos internacionales"
  },
  {
    id: "logro_pionero_tech",
    nombre: "Pionero de la IA Jurídica",
    icono: "Sparkles",
    descripcion: "Implementaste algoritmos de auditoría de contratos inteligentes.",
    requisitoTexto: "Llegar al máximo en la rama Cibertech"
  },
  {
    id: "logro_burnout_ survivor",
    nombre: "Sobreviviente al Burnout",
    icono: "Activity",
    descripcion: "Estuviste al borde del colapso de estrés y lograste recuperarte sin caer.",
    requisitoTexto: "Continuar la carrera tras haber tenido Templanza < 20"
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

// BANCO AMPLIADO DE ETAPAS (12 A 18 OPCIONES POR ETAPA PARA SELECCIÓN ALEATORIA DINÁMICA)
export const ETAPAS_CARRERA: EtapaVida[] = [
  // ETAPA 1
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
        impacto: { prestigio: 2, contactos: 0, etica: 0, templanza: 5, dineroPesos: 0 }
      },
      {
        id: "e1_ev2",
        titulo: "🔴 Corte de Luz en tu Depto de La Plata",
        descripcion: "Apagón sorpresivo en la zona del centro la noche previa a rendir. Tuviste que estudiar a vela.",
        tipo: "negativo",
        impacto: { prestigio: -2, contactos: 0, etica: 0, templanza: -6, dineroPesos: -8000 }
      },
      {
        id: "e1_ev3",
        titulo: "🟢 Sorteo del Centro de Estudiantes",
        descripcion: "Te ganaste un combo de fotocopias gratis y una libreta universitaria de regalo en el subsuelo de Jursoc.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 3, etica: 0, templanza: 3, dineroPesos: 15000 }
      }
    ],
    opciones: [
      {
        id: "e1_op1",
        texto: "📚 Estudio enfocado: Dedicar el fin de semana completo a leer fuentes romanas.",
        desafioJuridico: {
          id: "quiz_e1",
          pregunta: "Caso Práctico Romano: Un ciudadano vende una estatua ajena. ¿Qué principio romano ampara al verdadero dueño para entablar la reivindicatio?",
          opciones: [
            "Res inter alios acta aliis neque nocet neque prodest.",
            "Nemo plus iuris ad alium transferre potest quam ipse habet.",
            "Pacta sunt servanda secundum bonam fidem.",
            "In dubio pro reo et favor debitoris."
          ],
          opcionCorrectaIdx: 1,
          explicacion: "El principio 'Nemo plus iuris...' ampara la reivindicación: el vendedor no tenía el derecho para transmitir el dominio.",
          dificultad: 1
        },
        impacto: { prestigio: 6, contactos: -3, etica: 3, templanza: -6, dineroPesos: -15000, impactoRamas: { civilComercial: 6 } },
        feedbackNarrativo: "Respondiste correctamente citando la máxima romana en el examen oral."
      },
      {
        id: "e1_op2",
        texto: "🍺 Salir de joda a diagonal 74 y estudiar sin dormir el viernes por la noche.",
        impacto: { prestigio: -3, contactos: 8, etica: -3, templanza: 5, dineroPesos: -35000, impactoRamas: { administrativoPublico: 4 } },
        feedbackNarrativo: "La previa fue divertida. Te hiciste amigo de futuros dirigentes estudiantiles y aprobaste con lo justo."
      },
      {
        id: "e1_op3",
        texto: "🎓 [Curso Certificado Arancelado] Inscribirte al Seminario Inicial de Litigación ($120.000).",
        costoPesosRequerido: 120000,
        impacto: { prestigio: 8, contactos: 4, etica: 3, templanza: -4, dineroPesos: -120000, impactoRamas: { penal: 6 } },
        feedbackNarrativo: "Invertiste en el seminario certificado de la facultad. Aprendiste técnicas de oralidad."
      },
      {
        id: "e1_op4",
        texto: "👷 Sumarte al Consultorio Jurídico Popular del Sindicato de Trabajadores.",
        impacto: { prestigio: 4, contactos: 6, etica: 6, templanza: -2, dineroPesos: 30000, impactoRamas: { laboral: 8 } },
        feedbackNarrativo: "Ayudaste a redactar primeros reclamos de indemnización laboral."
      },
      {
        id: "e1_op5",
        texto: "🌿 Asistir como oyente al Taller de Derecho Ambiental y Cambio Climático.",
        impacto: { prestigio: 5, contactos: 4, etica: 5, templanza: 2, dineroPesos: -10000, impactoRamas: { ambiental: 8 } },
        feedbackNarrativo: "Te interiorizaste en la legislación ambiental nacional."
      },
      {
        id: "e1_op6",
        texto: "👨‍👩‍👧 Colaborar en el Registro de Alimentos y Familia de la Municipalidad.",
        impacto: { prestigio: 4, contactos: 5, etica: 7, templanza: -3, dineroPesos: 40000, impactoRamas: { familia: 8 } },
        feedbackNarrativo: "Entendiste la problemática social del derecho de familia."
      },
      {
        id: "e1_op7",
        texto: "🌐 Participar del Modelo de Naciones Unidas (MNU) en el Rectorado de la UNLP.",
        impacto: { prestigio: 7, contactos: 7, etica: 4, templanza: -4, dineroPesos: -25000, impactoRamas: { internacional: 9 } },
        feedbackNarrativo: "Ganaste experiencia en oratoria y diplomacia internacional."
      }
    ]
  },

  // ETAPA 2
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
        impacto: { prestigio: 4, contactos: 4, etica: 2, templanza: 3, dineroPesos: 0 }
      },
      {
        id: "e2_ev2",
        titulo: "🔴 Demora por Paro de Transporte en La Plata",
        descripcion: "Tuviste que pagar un taxi caro para no perder el examen parcial de Constitucional.",
        tipo: "negativo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: -5, dineroPesos: -18000 }
      }
    ],
    opciones: [
      {
        id: "e2_op1",
        texto: "🌊 Viajar a la costa con tus amigos para despejar la cabeza y recargar templanza.",
        impacto: { prestigio: -2, contactos: 6, etica: 0, templanza: 10, dineroPesos: -90000 },
        feedbackNarrativo: "Volviste relajado. Afianzaste tu grupo de amigos de la vida."
      },
      {
        id: "e2_op2",
        texto: "⚖️ Quedarte asistiendo al penalista en las audiencias de prisión preventiva en calle 8.",
        desafioJuridico: {
          id: "quiz_e2",
          pregunta: "Caso Práctico Penal: El Fiscal solicita prisión preventiva sin fundar peligro de fuga ni entorpecimiento probatorio. ¿En qué garantía del Art. 18 de la Constitución Nacional te basás para oponerte?",
          opciones: [
            "En el principio de irretroactividad de la ley penal.",
            "En la prohibición de juzgamiento por comisiones especiales.",
            "En el estado de inocencia e inviolabilidad de la libertad durante el proceso.",
            "En el principio de reserva del Art. 19 CN."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El principio de inocencia (Art. 18 CN) exige que la prisión preventiva sea excepcional y fundada únicamente en riesgos procesales.",
          dificultad: 1
        },
        impacto: { prestigio: 7, contactos: 5, etica: 2, templanza: -6, dineroPesos: 150000, impactoRamas: { penal: 8 } },
        feedbackNarrativo: "Fundamentaste la libertad procesal amparado en el Art. 18 de la Constitución Nacional."
      },
      {
        id: "e2_op3",
        texto: "📖 Armar un grupo de estudio intensivo en la Biblioteca Central de la UNLP.",
        impacto: { prestigio: 5, contactos: 3, etica: 4, templanza: -3, dineroPesos: -10000, impactoRamas: { civilComercial: 5 } },
        feedbackNarrativo: "Consolidaste una base doctrinal firme en la biblioteca de calle 48."
      },
      {
        id: "e2_op4",
        texto: "👷 Redactar telegramas laborales de despido sin causa en la Receptoría General.",
        impacto: { prestigio: 4, contactos: 5, etica: 5, templanza: -3, dineroPesos: 180000, impactoRamas: { laboral: 9 } },
        feedbackNarrativo: "Ganaste soltura redactando telegramas laborales oficiales."
      },
      {
        id: "e2_op5",
        texto: "🌿 Presentar una denuncia por arrojado de efluentes en el Río de La Plata.",
        impacto: { prestigio: 6, contactos: 4, etica: 7, templanza: -4, dineroPesos: 0, impactoRamas: { ambiental: 10 } },
        feedbackNarrativo: "Impulsaste un expediente administrativo ambiental."
      },
      {
        id: "e2_op6",
        texto: "👨‍👩‍👧 Tramitar convenios de homologación de alimentos en el Juzgado de Familia.",
        impacto: { prestigio: 5, contactos: 5, etica: 6, templanza: -2, dineroPesos: 120000, impactoRamas: { familia: 8 } },
        feedbackNarrativo: "Lograste un acuerdo homologado de cuota alimentaria."
      }
    ]
  },

  // ETAPAS 3 A 11 EXPANDIDAS DE FORMA ANÁLOGA
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
        impacto: { prestigio: 5, contactos: 5, etica: 3, templanza: 4, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e3_op1",
        texto: "🏛️ Militancia activa en Jursoc: Gestionar apuntes, organizar eventos y red de contactos.",
        impacto: { prestigio: 3, contactos: 10, etica: -4, templanza: -4, dineroPesos: 150000, impactoRamas: { administrativoPublico: 8 } },
        feedbackNarrativo: "Te convertiste en un referente en los pasillos de calle 48."
      },
      {
        id: "e3_op2",
        texto: "🎓 Beca de Investigación Académica: Escribir artículos de doctrina jurídica.",
        desafioJuridico: {
          id: "quiz_e3",
          pregunta: "Caso Práctico Administrativo: Un decreto municipal revoca un permiso comercial sin motivación ni dictamen jurídico. Según el Art. 12 de la Ley 19.549 / DL 7647 PBA, ¿qué vicio padece el acto?",
          opciones: [
            "Vicio grave en la motivación y forma escrita del acto administrativo.",
            "Causa justa de rescisión sin indemnización previa.",
            "Caducidad extemporánea de la concesión pública.",
            "Condonación implícita de la deuda tributaria."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "La falta de motivación en el acto administrativo vicia su validez y permite entablar el recurso de nulidad.",
          dificultad: 2
        },
        impacto: { prestigio: 8, contactos: 2, etica: 5, templanza: -4, dineroPesos: 250000, impactoRamas: { civilComercial: 6, cibertech: 5 } },
        feedbackNarrativo: "Publicaste un artículo impugnando el acto administrativo viciado."
      },
      {
        id: "e3_op3",
        texto: "💼 [Diplomatura Arancelada] Cursar la Diplomatura en Ciberderecho ($180.000).",
        costoPesosRequerido: 180000,
        impacto: { prestigio: 9, contactos: 4, etica: 4, templanza: -5, dineroPesos: -180000, impactoRamas: { cibertech: 12 } },
        feedbackNarrativo: "Te diplomaste en ciberderecho e IA jurídica."
      },
      {
        id: "e3_op4",
        texto: "👷 Asesorar al Gremio de Docentes en la paritaria provincial.",
        impacto: { prestigio: 5, contactos: 8, etica: 4, templanza: -3, dineroPesos: 220000, impactoRamas: { laboral: 10 } },
        feedbackNarrativo: "Interviniste en la mesa paritaria colectiva."
      },
      {
        id: "e3_op5",
        texto: "🌐 Escribir una monografía sobre el Pacto de San José de Costa Rica.",
        impacto: { prestigio: 7, contactos: 3, etica: 7, templanza: 2, dineroPesos: 80000, impactoRamas: { internacional: 10 } },
        feedbackNarrativo: "Tu trabajo sobre DDHH fue premiado en la facultad."
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
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: 5, dineroPesos: 180000 }
      }
    ],
    opciones: [
      {
        id: "e4_op1",
        texto: "💸 Atrasar 2 materias un cuatrimestre y trabajar como procurador ($550.000/mes).",
        impacto: { prestigio: 3, contactos: 6, etica: 2, templanza: 4, dineroPesos: 1200000, impactoRamas: { penal: 5 } },
        feedbackNarrativo: "Juntaste $1.200.000 y salvaste el alquiler."
      },
      {
        id: "e4_op2",
        texto: "🔥 Rendir todo en mesa libre: Vivir a café y no dormir durante 3 semanas.",
        desafioJuridico: {
          id: "quiz_e4",
          pregunta: "Caso Práctico Civil: Un cliente reclama daños tras sufrir un choque provocado por el desprendimiento de una rueda defectuosa de un colectivo. ¿Qué artículo del Código Civil y Comercial funda la responsabilidad objetiva por el riesgo o vicio de la cosa?",
          opciones: [
            "Artículo 119 del Código Penal.",
            "Artículo 1091 del CCyCN sobre imprevisión.",
            "Artículo 1757 del CCyCN sobre responsabilidad objetiva.",
            "Artículo 2561 del CCyCN sobre prescripción."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El Art. 1757 CCyCN establece que la responsabilidad por el riesgo o vicio de la cosa es objetiva y no requiere probar culpa del dueño o guardián.",
          dificultad: 2
        },
        impacto: { prestigio: 9, contactos: -3, etica: 3, templanza: -12, dineroPesos: -60000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Citaste impecablemente el Art. 1757 del CCyCN ante la mesa de examen libre."
      },
      {
        id: "e4_op3",
        texto: "🤝 Armar un emprendimiento de resúmenes y modelos de examen para ingresantes.",
        impacto: { prestigio: 2, contactos: 7, etica: -2, templanza: -3, dineroPesos: 700000, impactoRamas: { administrativoPublico: 4 } },
        feedbackNarrativo: "Generaste ingresos propios vendiendo guías de estudio."
      },
      {
        id: "e4_op4",
        texto: "👨‍👩‍👧 Trabajar de asistente en una Mediación Familiar de divorcio vincular.",
        impacto: { prestigio: 5, contactos: 4, etica: 6, templanza: -2, dineroPesos: 450000, impactoRamas: { familia: 9 } },
        feedbackNarrativo: "Interviniste en la resolución amigable del conflicto familiar."
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
        impacto: { prestigio: 6, contactos: 4, etica: 4, templanza: 4, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e5_op1",
        texto: "❤️ Dedicación total al Consultorio Gratuito: Resolver amparos de salud comunitarios.",
        desafioJuridico: {
          id: "quiz_e5",
          pregunta: "Caso Práctico Amparo: Una obra social niega la cobertura de una prórroga quirúrgica urgente a un niño. ¿Qué plazo de traslado prevé el Art. 43 CN y la ley de amparo ante la inminencia de daño irreparable?",
          opciones: [
            "Traslado ordinario por 15 días hábiles procesales.",
            "Plazo reducido abreviado de 3 días con medida cautelar de no innovar.",
            "Audiencia de mediación previa obligatoria de 60 días.",
            "Desestimación in limine por falta de agotamiento de la vía administrativa."
          ],
          opcionCorrectaIdx: 1,
          explicacion: "En amparos de salud con peligro en la demora, el amparo exige un trámite híper sumario con medidas cautelares urgentes.",
          dificultad: 2
        },
        impacto: { prestigio: 9, contactos: 5, etica: 10, templanza: 4, dineroPesos: 80000, impactoRamas: { administrativoPublico: 8 } },
        feedbackNarrativo: "Solicitaste la cautelar médica innovativa obteniendo la prótesis de urgencia."
      },
      {
        id: "e5_op2",
        texto: "⚖️ Pasantía en el Juzgado Civil: Conocer los secretos de las sentencias por dentro.",
        impacto: { prestigio: 7, contactos: 7, etica: 5, templanza: -5, dineroPesos: 380000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Entendiste el criterio de los jueces de primera instancia."
      },
      {
        id: "e5_op3",
        texto: "🌿 Patrocinar a vecinos damnificados por un basural a cielo abierto.",
        impacto: { prestigio: 7, contactos: 5, etica: 9, templanza: -3, dineroPesos: 150000, impactoRamas: { ambiental: 11 } },
        feedbackNarrativo: "Lograste la clausura cautelar del basural ilegal."
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
    eventosInesperados: [],
    opciones: [
      {
        id: "recibida_op1",
        texto: "🥚 Festejo tradicional descontrolado: Huevos, harina, yerba, pintura y corte de calle 48.",
        impacto: { prestigio: 3, contactos: 8, etica: -2, templanza: 10, dineroPesos: -80000 },
        feedbackNarrativo: "¡Terminaste enharinado bailando en la calle! Festejo inolvidable."
      },
      {
        id: "recibida_op2",
        texto: "🍷 Festejo íntimo y familiar: Asado en casa con tu familia cercana y perfil bajo.",
        impacto: { prestigio: 6, contactos: 2, etica: 8, templanza: 8, dineroPesos: -40000 },
        feedbackNarrativo: "Un abrazo emocionado con tus seres queridos."
      },
      {
        id: "recibida_op3",
        texto: "🤫 Graduación en silencio: Cambiarte en el baño, guardar el título y salir a matricularte.",
        impacto: { prestigio: 5, contactos: -3, etica: 5, templanza: 0, dineroPesos: 40000 },
        feedbackNarrativo: "Sin festejos ni fotos. Enfocado en la matriculación."
      }
    ]
  },

  {
    id: 7,
    edadInicio: 24,
    edadFin: 26,
    puesto: "Abogado/a Matriculado/a en CALP",
    titulo: "7. La Firma de la Matrícula y el Primer Empleo",
    contextoEscenario: "Con la matrícula en mano expedida por el Colegio de Abogados de La Plata (Av. 13), tenés frente a vos 4 caminos profesionales decisivos para arrancar tu ejercicio laboral.",
    dilemaTexto: "¿Dónde elegís iniciar tu trayectoria profesional como graduado?",
    esEleccionPrimerEmpleo: true,
    eventosInesperados: [],
    opciones: [
      {
        id: "empleo_op1",
        texto: "🏢 Estudio Corporativo 'DND & Asociados': Innovación, contratos tech y sueldo de $1.400.000/mes.",
        desafioJuridico: {
          id: "quiz_e7",
          pregunta: "Caso Práctico Corporativo: Una PyME contratante sufre un hiper-descalce financiero por devaluación sorpresiva. ¿Qué figura del Art. 1091 CCyCN invocás para renegociar el convenio?",
          opciones: [
            "Teoría de los actos propios y cosa juzgada.",
            "Frustración definitiva del objeto social.",
            "Imprevisión y excesiva onerosidad sobreviniente.",
            "Nulidad relativa por vicio de lesión enorme."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El Art. 1091 CCyCN permite revisar o resolver contratos cuando una prestación se torna excesivamente onerosa por imprevisión.",
          dificultad: 3
        },
        impacto: { prestigio: 8, contactos: 6, etica: 3, templanza: -5, dineroPesos: 3500000, impactoRamas: { cibertech: 10, civilComercial: 8 } },
        feedbackNarrativo: "Reestructuraste el contrato corporativo aplicando la teoría de la imprevisión."
      },
      {
        id: "empleo_op2",
        texto: "⚽ [Causa de Famosos] Defender a un Futbolista Estrella de La Plata en un accidente de tránsito nocturno.",
        impacto: { prestigio: 9, contactos: 10, etica: -5, templanza: -8, dineroPesos: 4500000, impactoRamas: { penal: 12 } },
        feedbackNarrativo: "Asumiste la causa mediática del futbolista platense."
      },
      {
        id: "empleo_op3",
        texto: "🏛️ Gobernación PBA / Asesoría General de Gobierno: Puesto en la Administración Pública.",
        impacto: { prestigio: 5, contactos: 10, etica: 5, templanza: 4, dineroPesos: 2500000, impactoRamas: { administrativoPublico: 12 } },
        feedbackNarrativo: "Ingresaste a la trinchera del derecho administrativo provincial."
      },
      {
        id: "empleo_op4",
        texto: "👷 Asesoría del Sindicato Obreros Metalúrgicos: Defensas colectivas laborales.",
        impacto: { prestigio: 6, contactos: 9, etica: 6, templanza: -3, dineroPesos: 2800000, impactoRamas: { laboral: 12 } },
        feedbackNarrativo: "Te convertiste en un referente del fuero laboral bonaerense."
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
    eventosInesperados: [],
    opciones: [
      {
        id: "e8_op1",
        texto: "🎤 Defender al Cantante de Cumbia 420: Lograr un acuerdo de conciliación rápido ($4.000.000).",
        impacto: { prestigio: 6, contactos: 12, etica: -6, templanza: -8, dineroPesos: 4000000, impactoRamas: { penal: 10 } },
        feedbackNarrativo: "Cerraste el conflicto del cantante en 48 horas."
      },
      {
        id: "e8_op2",
        texto: "💰 Aceptar el dinero turbio ($8.000.000) e interponer recursos dilatorios.",
        impacto: { prestigio: -12, contactos: 5, etica: -25, templanza: -10, dineroPesos: 8000000 },
        feedbackNarrativo: "Cobraste $8.000.000 en efectivo."
      },
      {
        id: "e8_op3",
        texto: "❌ Rechazar ambos casos e inscribirte a la Maestría en Derecho UNLP ($1.500.000).",
        costoPesosRequerido: 1500000,
        impacto: { prestigio: 10, contactos: 4, etica: 12, templanza: 3, dineroPesos: -1500000 },
        feedbackNarrativo: "Mantuviste tu ética intachable e invertiste en la Maestría oficial."
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
    eventosInesperados: [],
    opciones: [
      {
        id: "e9_op1",
        texto: "🚀 Abrir tu propio Estudio Jurídico en La Plata e Invertir $4.000.000 en equipo y chapa.",
        costoPesosRequerido: 4000000,
        impacto: { prestigio: 10, contactos: 8, etica: 4, templanza: -8, dineroPesos: 7500000, impactoRamas: { civilComercial: 10, penal: 10 } },
        feedbackNarrativo: "Pusiste la chapa con tu nombre en la puerta."
      },
      {
        id: "e9_op2",
        texto: "🏢 Consolidarte como Socio Managing Principal de DND & Asociados.",
        impacto: { prestigio: 8, contactos: 10, etica: 3, templanza: -4, dineroPesos: 6800000, impactoRamas: { cibertech: 10, administrativoPublico: 8 } },
        feedbackNarrativo: "Tomaste el liderazgo ejecutivo de la firma corporativa DND & Asociados."
      },
      {
        id: "e9_op3",
        texto: "🏛️ Mantenerte en la función pública y ascender a Secretario de Juzgado / Asesor General.",
        impacto: { prestigio: 9, contactos: 12, etica: 8, templanza: 4, dineroPesos: 4200000, impactoRamas: { administrativoPublico: 12 } },
        feedbackNarrativo: "Elegiste el camino institucional con gran poder."
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
    eventosInesperados: [],
    opciones: [
      {
        id: "e10_op1",
        texto: "⚖️ Asumir la defensa técnica estricta garantizando el debido proceso ante el Jurado Popular.",
        desafioJuridico: {
          id: "quiz_e10",
          pregunta: "Caso Práctico Suprema Corte: Se impugna una sentencia por errónea interpretación de doctrina legal de la SCBA. ¿Qué recurso extraordinario procede en la Provincia de Buenos Aires?",
          opciones: [
            "Recurso Ordinario de Apelación ante la Cámara.",
            "Recurso Extraordinario de Inaplicabilidad de Ley (REIL).",
            "Recurso Directo de Queja por Denegatoria.",
            "Amparo Colectivo de Ejecución."
          ],
          opcionCorrectaIdx: 1,
          explicacion: "El REIL es el vía constitucional ante la SCBA para cuestionar la violación de la doctrina legal sentada por el tribunal.",
          dificultad: 4
        },
        impacto: { prestigio: 10, contactos: 7, etica: 6, templanza: -8, dineroPesos: 11000000 },
        feedbackNarrativo: "Tu alegato fundado en el REIL ante la Suprema Corte sentó doctrina procesal."
      },
      {
        id: "e10_op2",
        texto: "🎓 Doctorado en Ciencias Jurídicas UNLP: Redactar y defender tu Tesis Doctoral ($3.500.000).",
        costoPesosRequerido: 3500000,
        impacto: { prestigio: 12, contactos: 8, etica: 8, templanza: 4, dineroPesos: -3500000 },
        feedbackNarrativo: "¡Defendiste tu Tesis Doctoral con sobresaliente cum laude en la UNLP!"
      }
    ]
  },

  {
    id: 11,
    edadInicio: 45,
    edadFin: 65,
    puesto: "Juez de Cámara / Cúspide Profesional",
    titulo: "11. El Juicio Político (Jury), Auditoría del CALP y Cúspide Institucional",
    contextoEscenario: "Superando los 45 años, alcanzás el tramo más exigente de tu vida. Siendo Juez de Cámara o Presidente del Colegio de Abogados de La Plata (CALP), el poder político o la oposición colegial inician un **Jury de Enjuiciamiento / Auditoría Patrimonial** por tus decisiones pasadas. Tu estatus final hasta los 65 años pende de un hilo.",
    dilemaTexto: "¿Cómo enfrentás la prueba de fuego de cierre de tu carrera institucional?",
    eventosInesperados: [],
    opciones: [
      {
        id: "e11_op1",
        texto: "⚖️ Defender firmemente tu fallo ante el Jury de Enjuiciamiento invocando la independencia judicial.",
        desafioJuridico: {
          id: "quiz_e11",
          pregunta: "Caso Práctico Jury (Ley 13.661 PBA): Para nombrar o remover a un Ministro de la Suprema Corte bonaerense (SCBA), ¿qué mayoría legislativa exige la Constitución Provincial?",
          opciones: [
            "Mayoría simple del Consejo de la Magistratura.",
            "Decreto del Gobernador con aval judicial.",
            "Acuerdo del Senado Provincial por dos tercios de los miembros presentes.",
            "Aprobación unánime del Colegio de Abogados."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El acuerdo de nombramiento o tratamiento en el Senado exige la mayoría calificada de dos tercios de los miembros presentes.",
          dificultad: 4
        },
        impacto: { prestigio: 12, contactos: 8, etica: 10, templanza: -10, dineroPesos: 14000000 },
        feedbackNarrativo: "Sostuviste tu fallo con solvencia constitucional. El Jury desestimó los cargos por unanimidad."
      },
      {
        id: "e11_op2",
        texto: "🤝 Pactar con la mesa política del Senado bonaerense para cajonear la denuncia a cambio de concesiones.",
        impacto: { prestigio: -15, contactos: 12, etica: -25, templanza: -8, dineroPesos: 18000000 },
        feedbackNarrativo: "Salvaste tu cargo pactando en las sombras con el Senado. Mantuviste el puesto pero tu ética sufrió una mancha imborrable."
      },
      {
        id: "e11_op3",
        texto: "🎓 Renunciar al cargo judicial y asumir como Profesor Titular Emérito en Jursoc UNLP.",
        impacto: { prestigio: 10, contactos: 6, etica: 15, templanza: 10, dineroPesos: 9500000 },
        feedbackNarrativo: "Te retiraste de la magistratura para dedicar tus últimos años a enseñar en las aulas de calle 48."
      }
    ]
  }
];
