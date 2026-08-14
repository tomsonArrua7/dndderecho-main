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

export interface CareerScoreBreakdown {
  baseOvrScore: number;
  eticaBonus: number;
  desafiosScore: number;
  patrimonioScore: number;
  logrosScore: number;
  victoriaBonus: number;
  puntosTotales: number;
}

export interface CarreraGuardada {
  id: string;
  userId?: string;
  nombreJugador?: string;
  avatarUrl?: string;
  fechaISO: string;
  ciudadNatal: string;
  edadFinal: number;
  ovrFinal: number;
  patrimonioFinal: number;
  prestigioFinal?: number;
  contactosFinal?: number;
  eticaFinal?: number;
  templanzaFinal?: number;
  tituloObtenido?: string;
  ramaPredominante: string;
  fueVictoria: boolean;
  motivoCierre: string;
  desafiosAcertados?: number;
  logrosCount?: number;
  puntosTotales?: number;
  scoreBreakdown?: CareerScoreBreakdown;
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

export function calculateCareerScore(
  ovr: number,
  etica: number,
  desafiosAcertados: number,
  dineroPesos: number,
  logrosCount: number,
  fueVictoria: boolean
): CareerScoreBreakdown {
  const baseOvrScore = ovr * 100;
  
  let eticaBonus = 0;
  if (etica >= 80) {
    eticaBonus = 1500;
  } else if (etica <= 30) {
    eticaBonus = -2000;
  }

  const desafiosScore = (desafiosAcertados || 0) * 500;
  const patrimonioScore = Math.min(3000, Math.floor(Math.max(0, dineroPesos) / 10000));
  const logrosScore = (logrosCount || 0) * 400;
  const victoriaBonus = fueVictoria ? 2500 : 0;

  const puntosTotales = Math.max(
    0,
    baseOvrScore + eticaBonus + desafiosScore + patrimonioScore + logrosScore + victoriaBonus
  );

  return {
    baseOvrScore,
    eticaBonus,
    desafiosScore,
    patrimonioScore,
    logrosScore,
    victoriaBonus,
    puntosTotales
  };
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
    nombre: "Referente del Foro Platense",
    icono: "Users",
    descripcion: "Construiste la red de relaciones profesionales e institucionales más amplia de la provincia.",
    requisitoTexto: "Alcanzar 85+ en Contactos / Relaciones"
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
    requisitoTexto: "Encabezar la conducción del CALP"
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
    descripcion: "Implementaste algoritmos de auditoría de contratos inteligentes y peritajes digitales.",
    requisitoTexto: "Llegar al máximo en la rama Cibertech"
  },
  {
    id: "logro_burnout_survivor",
    nombre: "Sobreviviente al Burnout",
    icono: "Activity",
    descripcion: "Estuviste al borde del colapso de estrés procesal y lograste recuperarte sin caer.",
    requisitoTexto: "Continuar la carrera tras haber tenido Templanza < 20"
  }
];

export const SKILLS_DISPONIBLES: SkillDefinition[] = [
  {
    id: "litigio_penal",
    nombre: "Litigio Penal & Garantías",
    icono: "Scale",
    descripcion: "Especialista en derecho penal bonaerense, garantías constitucionales, hábeas corpus y juicios por jurados.",
    beneficio: "Otorga bono de +20 en la rama Penal y destreza en causas criminales."
  },
  {
    id: "civil_comercial",
    nombre: "Derecho Civil, Comercial & Corporativo",
    icono: "FileText",
    descripcion: "Dominio de contratos civiles y comerciales, fideicomisos, responsabilidad por daños y sociedades de la LGS.",
    beneficio: "Otorga bono de +20 en la rama Civil/Comercial y apertura a asesorías corporativas."
  },
  {
    id: "publico_administrativo",
    nombre: "Derecho Público & Administrativo",
    icono: "Landmark",
    descripcion: "Experto en contrataciones públicas, amparos, derecho constitucional y litigios ante el fuero Contencioso Administrativo.",
    beneficio: "Otorga bono de +20 en Derecho Público y relaciones clave con el Estado y la UNLP."
  },
  {
    id: "ciberderecho_tech",
    nombre: "Ciberderecho & Prueba Digital",
    icono: "ShieldCheck",
    descripcion: "Especialista en evidencia digital, peritajes informáticos, contratos inteligentes, privacidad e Inteligencia Artificial.",
    beneficio: "Otorga bono de +20 en Cibertech y resolución de fraudes informáticos complejos."
  },
  {
    id: "laboral_seg_social",
    nombre: "Derecho del Trabajo & Seguridad Social",
    icono: "Briefcase",
    descripcion: "Litigante en Tribunales del Trabajo de La Plata, despidos LCT, accidentes ART y negociaciones paritarias colectivas.",
    beneficio: "Otorga bono de +20 en Derecho Laboral y convenios colectivos gremiales."
  },
  {
    id: "familia_sucesiones",
    nombre: "Derecho de Familia & Sucesiones",
    icono: "Users",
    descripcion: "Especialista en divorcios, alimentos, compensaciones económicas, adopciones y particiones hereditarias complejas.",
    beneficio: "Otorga bono de +20 en Familia y Sucesiones con alta empatía procesal."
  },
  {
    id: "internacional_ddhh",
    nombre: "Derecho Internacional & DDHH",
    icono: "Globe",
    descripcion: "Enfocado en el Sistema Interamericano (CIDH / Corte IDH), derecho internacional público y privado, y litigio estratégico.",
    beneficio: "Otorga bono de +20 en Internacional/DDHH y prestigio ante tribunales supranacionales."
  },
  {
    id: "ambiental_recursos",
    nombre: "Derecho Ambiental & Recursos Naturales",
    icono: "Leaf",
    descripcion: "Defensa de bienes colectivos, amparos ambientales de la Ley General del Ambiente, derecho agrario y minería.",
    beneficio: "Otorga bono de +20 en Ambiental/Recursos y causas de impacto socio-ambiental."
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

// BANCO AMPLIADO DE ETAPAS (CON FOCO EN FCJyS UNLP, TRIBUNALES PBA Y EJERCICIO PROFESIONAL)
export const ETAPAS_CARRERA: EtapaVida[] = [
  // ETAPA 1
  {
    id: 1,
    edadInicio: 18,
    edadFin: 19,
    puesto: "Ingresante a 1er Año (Jursoc UNLP)",
    titulo: "1. El Ingreso a la Universidad y el Parcial de Romano",
    contextoEscenario: "Entrás por las escalinatas de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP. El ambiente es vibrante: pasillos desbordados, apuntes en fotocopiadoras y clases multitudinarias. Es jueves por la noche: tus compañeros de comisión armaron previa para ir a los bares de diagonal 74, pero el sábado rendís tu primer parcial decisivo de Derecho Romano.",
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
        titulo: "🟢 Sorteo del Centro de Fotocopiado",
        descripcion: "Te ganaste un combo de fotocopias de fallos y una libreta universitaria en el subsuelo de Jursoc.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 3, etica: 0, templanza: 3, dineroPesos: 15000 }
      }
    ],
    opciones: [
      {
        id: "e1_op1",
        texto: "📚 Estudio enfocado: Dedicar el fin de semana completo a leer fuentes romanas y latín jurídico.",
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
        impacto: { prestigio: 6, contactos: -2, etica: 3, templanza: -5, dineroPesos: -15000, impactoRamas: { civilComercial: 6 } },
        feedbackNarrativo: "Respondiste con precisión la máxima romana en el examen oral, impresionando a la cátedra."
      },
      {
        id: "e1_op2",
        texto: "🍺 Salir a diagonal 74 con amigos y estudiar sin dormir la noche previa.",
        impacto: { prestigio: -3, contactos: 8, etica: -2, templanza: 6, dineroPesos: -35000, impactoRamas: { administrativoPublico: 4 } },
        feedbackNarrativo: "La noche en los bares platenses fue memorable. Hiciste un grupo de amigos muy unido y aprobaste con lo justo."
      },
      {
        id: "e1_op3",
        texto: "🎓 [Curso Certificado Arancelado] Inscribirte al Seminario Inicial de Litigación y Oratoria ($120.000).",
        costoPesosRequerido: 120000,
        impacto: { prestigio: 8, contactos: 4, etica: 3, templanza: -3, dineroPesos: -120000, impactoRamas: { penal: 6 } },
        feedbackNarrativo: "Invertiste en el seminario de la facultad y ganaste soltura argumentativa."
      },
      {
        id: "e1_op4",
        texto: "👷 Sumarte como voluntario al Consultorio Jurídico Popular barrial.",
        impacto: { prestigio: 4, contactos: 6, etica: 7, templanza: -2, dineroPesos: 30000, impactoRamas: { laboral: 8 } },
        feedbackNarrativo: "Ayudaste a vecinos en primeros reclamos y entendiste el valor social del Derecho."
      },
      {
        id: "e1_op5",
        texto: "🌿 Asistir como oyente al Taller de Derecho Ambiental y Recursos Naturales.",
        impacto: { prestigio: 5, contactos: 4, etica: 6, templanza: 2, dineroPesos: -10000, impactoRamas: { ambiental: 8 } },
        feedbackNarrativo: "Te interiorizaste en la Ley General del Ambiente y la protección de humedales."
      },
      {
        id: "e1_op6",
        texto: "📖 Armar grupo de estudio en la Biblioteca Central de calle 48 y debatir fallos clásicos.",
        impacto: { prestigio: 5, contactos: 5, etica: 4, templanza: 3, dineroPesos: -12000, impactoRamas: { civilComercial: 5 } },
        feedbackNarrativo: "Las tardes en los boxes de la biblioteca te permitieron consolidar conceptos sin quemarte la cabeza."
      },
      {
        id: "e1_op7",
        texto: "🌐 Participar del Modelo de Naciones Unidas (MNU) en el Rectorado de la UNLP.",
        impacto: { prestigio: 7, contactos: 7, etica: 4, templanza: -3, dineroPesos: -25000, impactoRamas: { internacional: 9 } },
        feedbackNarrativo: "Ganaste experiencia en diplomacia, tratados internacionales y debate formal."
      }
    ]
  },

  // ETAPA 2
  {
    id: 2,
    edadInicio: 19,
    edadFin: 20,
    puesto: "Estudiante de 2do Año (Jursoc UNLP)",
    titulo: "2. Las Cursadas en Calle 48 y las Primeras Recorridas por Tribunales",
    contextoEscenario: "Tenés 19 años. Cursás Derecho Político, Constitucional y Penal I. Tus amigos organizaron una escapada de fin de semana a la costa y, en simultáneo, un conocido abogado penalista te ofrece acompañarlo a audiencias de flagrancia y excarcelación en el Fuero Penal de calle 8.",
    dilemaTexto: "¿Aceptás el viaje de relax con amigos o te metés de lleno en la práctica penal bonaerense?",
    eventosInesperados: [
      {
        id: "e2_ev1",
        titulo: "🟢 Invitación a Charla Magistral de un Juez de Garantías",
        descripcion: "Un Juez de Garantías de La Plata dictó una conferencia sobre garantías constitucionales y elogió tus preguntas.",
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
        feedbackNarrativo: "Volviste relajado y renovado. Afianzaste tu grupo de estudio y amistad de la facultad."
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
          explicacion: "El principio de inocencia (Art. 18 CN) exige que la prisión preventiva sea excepcional y fundada estrictamente en riesgos procesales.",
          dificultad: 1
        },
        impacto: { prestigio: 7, contactos: 5, etica: 3, templanza: -5, dineroPesos: 150000, impactoRamas: { penal: 8 } },
        feedbackNarrativo: "Fundamentaste la libertad procesal amparado en el Art. 18 de la Constitución Nacional."
      },
      {
        id: "e2_op3",
        texto: "📖 Cursar Taller de Redacción de Escritos Judiciales y Cédulas en la facultad.",
        impacto: { prestigio: 6, contactos: 3, etica: 4, templanza: -2, dineroPesos: -20000, impactoRamas: { civilComercial: 6 } },
        feedbackNarrativo: "Aprendiste la estructura formal de demandas, contestaciones y oficios de ley."
      },
      {
        id: "e2_op4",
        texto: "👷 Redactar telegramas laborales de despido sin causa y reclamos de horas extras.",
        impacto: { prestigio: 4, contactos: 5, etica: 5, templanza: -3, dineroPesos: 180000, impactoRamas: { laboral: 9 } },
        feedbackNarrativo: "Ganaste soltura redactando intimaciones laborales oficiales de la Ley de Contrato de Trabajo."
      },
      {
        id: "e2_op5",
        texto: "🌿 Presentar un pedido de acceso a la información pública ambiental por efluentes en el Río de La Plata.",
        impacto: { prestigio: 6, contactos: 4, etica: 7, templanza: -3, dineroPesos: 0, impactoRamas: { ambiental: 10 } },
        feedbackNarrativo: "Impulsaste un expediente administrativo de transparencia ambiental."
      },
      {
        id: "e2_op6",
        texto: "👨‍👩‍👧 Tramitar convenios de homologación de alimentos en el Juzgado de Familia de calle 45.",
        impacto: { prestigio: 5, contactos: 5, etica: 6, templanza: -2, dineroPesos: 120000, impactoRamas: { familia: 8 } },
        feedbackNarrativo: "Lograste un acuerdo homologado velando por el interés superior del niño."
      }
    ]
  },

  // ETAPA 3
  {
    id: 3,
    edadInicio: 20,
    edadFin: 21,
    puesto: "Estudiante de 3er Año (Jursoc UNLP)",
    titulo: "3. La Beca Académica vs La Procuración en Calle 13",
    contextoEscenario: "Llegás a los 20 años en la mitad de la carrera cursando Obligaciones y Contratos. Te ofrecen dos caminos formativos: sumarte como Ayudante Alumno ad-honorem de cátedra con una Beca de Investigación en Derecho Administrativo o entrar de procurador junior a caminar los juzgados civiles del Palacio de Tribunales de calle 13.",
    dilemaTexto: "¿Dónde invertís tus esfuerzos intelectuales y tu tiempo en este año bisagra?",
    eventosInesperados: [
      {
        id: "e3_ev1",
        titulo: "🟢 Reconocimiento Académico en Jursoc",
        descripcion: "Tu artículo sobre vicios del acto administrativo fue seleccionado para la revista de doctrina de la facultad.",
        tipo: "positivo",
        impacto: { prestigio: 5, contactos: 4, etica: 3, templanza: 4, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e3_op1",
        texto: "🎓 Beca de Investigación Académica: Estudiar derecho público y escribir artículos de doctrina.",
        desafioJuridico: {
          id: "quiz_e3",
          pregunta: "Caso Práctico Administrativo: Un decreto municipal revoca un permiso comercial sin motivación ni dictamen jurídico previo. Según la Ley 19.549 y el DL 7647 PBA, ¿qué vicio padece el acto?",
          opciones: [
            "Vicio grave en la motivación y forma escrita del acto administrativo.",
            "Causa justa de rescisión sin indemnización previa.",
            "Caducidad extemporánea de la concesión pública.",
            "Condonación implícita de la deuda tributaria."
          ],
          opcionCorrectaIdx: 0,
          explicacion: "La falta de motivación en el acto administrativo vicia su validez formal y sustancial, habilitando la impugnación de nulidad.",
          dificultad: 2
        },
        impacto: { prestigio: 8, contactos: 4, etica: 5, templanza: -3, dineroPesos: 250000, impactoRamas: { civilComercial: 6, administrativoPublico: 8 } },
        feedbackNarrativo: "Publicaste tu primer artículo de doctrina jurídica analizando los vicios esenciales del acto administrativo."
      },
      {
        id: "e3_op2",
        texto: "🏃 Procurar expedientes en la barandilla de Tribunales de calle 13: Cédulas, mandamientos y oficios.",
        impacto: { prestigio: 4, contactos: 9, etica: 3, templanza: -4, dineroPesos: 480000, impactoRamas: { civilComercial: 7 } },
        feedbackNarrativo: "Aprendiste el oficio real de la procuración y te hiciste conocido en todas las secretarías de juzgado."
      },
      {
        id: "e3_op3",
        texto: "💼 [Diplomatura Arancelada] Cursar la Diplomatura en Ciberderecho y Evidencia Digital ($180.000).",
        costoPesosRequerido: 180000,
        impacto: { prestigio: 9, contactos: 4, etica: 4, templanza: -4, dineroPesos: -180000, impactoRamas: { cibertech: 12 } },
        feedbackNarrativo: "Te capacitaste en preservación de prueba digital, hash criptográfico y contratos inteligentes."
      },
      {
        id: "e3_op4",
        texto: "🏠 Negociar legalmente cláusulas abusivas del contrato de alquiler platense ante la inmobiliaria.",
        impacto: { prestigio: 5, contactos: 3, etica: 6, templanza: 4, dineroPesos: 120000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Aplicaste la normativa de locaciones urbanas del CCyCN para defender tus derechos y ahorrar dinero."
      },
      {
        id: "e3_op5",
        texto: "👷 Colaborar con la asesoría gremial en la redacción de un convenio colectivo de trabajo.",
        impacto: { prestigio: 5, contactos: 8, etica: 4, templanza: -3, dineroPesos: 220000, impactoRamas: { laboral: 10 } },
        feedbackNarrativo: "Interviniste en la mesa de redacción de condiciones laborales y escalas salariales."
      },
      {
        id: "e3_op6",
        texto: "🌐 Escribir una monografía sobre el Pacto de San José de Costa Rica y el control de convencionalidad.",
        impacto: { prestigio: 7, contactos: 3, etica: 7, templanza: 2, dineroPesos: 80000, impactoRamas: { internacional: 10 } },
        feedbackNarrativo: "Tu trabajo sobre control de convencionalidad fue destacado por la cátedra de DDHH."
      }
    ]
  },

  // ETAPA 4
  {
    id: 4,
    edadInicio: 21,
    edadFin: 22,
    puesto: "Estudiante Avanzado de 4to Año",
    titulo: "4. Derecho Penal II, Daños y la Presión Económica de Alquiler",
    contextoEscenario: "A los 21 años las materias son de alto peso: cursás Penal II, Reales y Obligaciones/Daños. La inflación y el costo del alquiler en La Plata te aprietan el bolsillo. Tenés que decidir si estiras la carrera para trabajar más horas o rendís materias en mesa libre sacrificando templanza.",
    dilemaTexto: "¿Cómo encaras la recta de materias complejas frente a las exigencias financieras?",
    eventosInesperados: [
      {
        id: "e4_ev1",
        titulo: "🟢 Devolución de Depósito de Garantía",
        descripcion: "Recuperaste el dinero del depósito de tu alquiler anterior en La Plata tras una rescisión impecable.",
        tipo: "positivo",
        impacto: { prestigio: 0, contactos: 0, etica: 0, templanza: 5, dineroPesos: 180000 }
      }
    ],
    opciones: [
      {
        id: "e4_op1",
        texto: "💸 Atrasar 2 materias un cuatrimestre y trabajar de procurador senior ($600.000/mes).",
        impacto: { prestigio: 3, contactos: 7, etica: 3, templanza: 4, dineroPesos: 1400000, impactoRamas: { penal: 5, civilComercial: 5 } },
        feedbackNarrativo: "Sumaste $1.400.000, estabilizaste tu economía y ganaste experiencia procesal."
      },
      {
        id: "e4_op2",
        texto: "🔥 Rendir Responsabilidad Civil / Daños en mesa libre: Estudiar sin descanso durante 3 semanas.",
        desafioJuridico: {
          id: "quiz_e4",
          pregunta: "Caso Práctico Civil: Un cliente reclama daños tras un choque provocado por una falla en los frenos de un colectivo. ¿Qué artículo del Código Civil y Comercial funda la responsabilidad objetiva por el riesgo o vicio de la cosa?",
          opciones: [
            "Artículo 119 del Código Penal.",
            "Artículo 1091 del CCyCN sobre imprevisión.",
            "Artículo 1757 del CCyCN sobre responsabilidad objetiva.",
            "Artículo 2561 del CCyCN sobre prescripción."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El Art. 1757 CCyCN establece la responsabilidad objetiva por actividades riesgosas o cosas con vicios, sin exigir culpa del dueño o guardián.",
          dificultad: 2
        },
        impacto: { prestigio: 9, contactos: -2, etica: 3, templanza: -10, dineroPesos: -60000, impactoRamas: { civilComercial: 9 } },
        feedbackNarrativo: "Citaste con soltura el Art. 1757 del CCyCN y aprobaste la mesa libre con nota sobresaliente."
      },
      {
        id: "e4_op3",
        texto: "🤝 Armar un emprendimiento de resúmenes y esquemas procesales para ingresantes de Jursoc.",
        impacto: { prestigio: 2, contactos: 7, etica: 3, templanza: -2, dineroPesos: 750000, impactoRamas: { administrativoPublico: 4 } },
        feedbackNarrativo: "Tus guías y esquemas procesales se volvieron muy populares entre los alumnos de 1er año."
      },
      {
        id: "e4_op4",
        texto: "👨‍👩‍👧 Asistir en una mediación familiar de divorcio vincular y régimen de comunicación.",
        impacto: { prestigio: 5, contactos: 5, etica: 6, templanza: -2, dineroPesos: 450000, impactoRamas: { familia: 9 } },
        feedbackNarrativo: "Interviniste en la resolución pacífica de un conflicto de familia protegiendo los derechos de las partes."
      },
      {
        id: "e4_op5",
        texto: "🌿 Redactar una acción de amparo ambiental contra la tala no autorizada en el Parque Pereyra Iraola.",
        impacto: { prestigio: 7, contactos: 4, etica: 8, templanza: -3, dineroPesos: 100000, impactoRamas: { ambiental: 10 } },
        feedbackNarrativo: "Lograste una medida de no innovar que frenó la tala indiscriminada."
      }
    ]
  },

  // ETAPA 5
  {
    id: 5,
    edadInicio: 22,
    edadFin: 23,
    puesto: "Práctica Profesional / Último Año",
    titulo: "5. La Práctica Profesional Supervisada y la Recta Final",
    contextoEscenario: "Llegás a los 22 años a la materia final de Práctica Profesional en el Consultorio Jurídico Gratuito de la UNLP. Atendés casos reales de sectores vulnerables de La Plata. En paralelo, te ofrecen entrar como pasante meritorio en un Juzgado Civil de primera instancia.",
    dilemaTexto: "¿Dedicarte de lleno a los amparos del Consultorio Gratuito o meter la cabeza en el Poder Judicial?",
    eventosInesperados: [
      {
        id: "e5_ev1",
        titulo: "🟢 Elogio Público del Juez de Cámara",
        descripcion: "Un Juez de Cámara de La Plata elogió la solidez dogmática de tu primer escrito de práctica profesional.",
        tipo: "positivo",
        impacto: { prestigio: 6, contactos: 4, etica: 4, templanza: 4, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e5_op1",
        texto: "❤️ Dedicación total al Consultorio Gratuito: Resolver amparos de salud urgentes contra obras sociales/IOMA.",
        desafioJuridico: {
          id: "quiz_e5",
          pregunta: "Caso Práctico Amparo: Una obra social niega la cobertura de una cirugía urgente a un paciente vulnerable. Según el Art. 43 CN y la ley de amparo ante peligro en la demora, ¿qué trámite corresponde?",
          opciones: [
            "Traslado ordinario por 15 días hábiles procesales sin medidas previas.",
            "Trámite abreviado de amparo con medida cautelar innovativa urgente.",
            "Audiencia de mediación prejudicial obligatoria de 60 días.",
            "Desestimación in limine por falta de reclamo administrativo previo de 90 días."
          ],
          opcionCorrectaIdx: 1,
          explicacion: "En amparos de salud con peligro inminente de daño irreparable, rige el trámite sumarísimo con medidas cautelares urgentes.",
          dificultad: 2
        },
        impacto: { prestigio: 9, contactos: 5, etica: 10, templanza: 4, dineroPesos: 90000, impactoRamas: { administrativoPublico: 8, civilComercial: 6 } },
        feedbackNarrativo: "Solicitaste la cautelar médica de urgencia logrando que se autorice la intervención quirúrgica en 24 horas."
      },
      {
        id: "e5_op2",
        texto: "⚖️ Pasantía en el Juzgado Civil: Aprender los criterios de despacho y elaboración de sentencias.",
        impacto: { prestigio: 7, contactos: 7, etica: 5, templanza: -4, dineroPesos: 420000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Conociste por dentro el funcionamiento del despacho judicial y el sistema Augusta."
      },
      {
        id: "e5_op3",
        texto: "🌿 Patrocinar a vecinos damnificados por la contaminación de una cantera clandestina en las afueras de La Plata.",
        impacto: { prestigio: 7, contactos: 5, etica: 9, templanza: -3, dineroPesos: 160000, impactoRamas: { ambiental: 11 } },
        feedbackNarrativo: "Obtuviste la clausura preventiva del predio contaminante."
      },
      {
        id: "e5_op4",
        texto: "💼 Intervenir en la verificación de créditos de un concurso preventivo comercial de una PyME platense.",
        impacto: { prestigio: 6, contactos: 6, etica: 4, templanza: -2, dineroPesos: 380000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Presentaste el incidente de verificación tempestiva en el juzgado comercial."
      }
    ]
  },

  // ETAPA 6
  {
    id: 6,
    edadInicio: 23,
    edadFin: 24,
    puesto: "¡Egresado de la FCJyS (UNLP)!",
    titulo: "6. La Firma de la Libreta y la Graduación en Calle 48",
    contextoEscenario: "¡Día inolvidable! A los 23 años saliste del aula del 3er piso tras rendir y aprobar tu última materia. En las escalinatas de calle 48 te esperan tus compañeros, amigos y familia con cotillón, carteles y harina.",
    dilemaTexto: "¿Cómo elegís celebrar la obtención del título de Abogado/a de la UNLP?",
    esFestejoRecibida: true,
    eventosInesperados: [],
    opciones: [
      {
        id: "recibida_op1",
        texto: "🥚 Festejo tradicional descontrolado: Huevos, harina, témpera, cotillón y fiesta en la vereda de calle 48.",
        impacto: { prestigio: 3, contactos: 8, etica: -1, templanza: 10, dineroPesos: -80000 },
        feedbackNarrativo: "¡Terminaste enharinado festejando con toda la camada! Un momento inolvidable que quedó en fotos históricas."
      },
      {
        id: "recibida_op2",
        texto: "🍷 Festejo íntimo y familiar: Asado en casa con tu familia y afectos cercanos con perfil bajo.",
        impacto: { prestigio: 6, contactos: 3, etica: 8, templanza: 8, dineroPesos: -40000 },
        feedbackNarrativo: "Un emotivo brindis familiar agradeciendo el esfuerzo conjunto de todos los años de estudio."
      },
      {
        id: "recibida_op3",
        texto: "🤫 Graduación en silencio: Guardar la libreta firmada y salir directo a iniciar los trámites del diploma.",
        impacto: { prestigio: 5, contactos: -2, etica: 5, templanza: 2, dineroPesos: 40000 },
        feedbackNarrativo: "Sin festejos ruidosos. Totalmente enfocado en agilizar la expedición de tu título oficial."
      }
    ]
  },

  // ETAPA 7
  {
    id: 7,
    edadInicio: 24,
    edadFin: 26,
    puesto: "Abogado/a Matriculado/a en CALP",
    titulo: "7. La Jura de la Matrícula y el Primer Empleo",
    contextoEscenario: "Con la matrícula profesional en mano expedida por el Colegio de Abogados de La Plata (Av. 13), tenés frente a vos diversos rumbos profesionales para arrancar tu ejercicio laboral.",
    dilemaTexto: "¿Dónde elegís iniciar tu trayectoria profesional como nuevo graduado?",
    esEleccionPrimerEmpleo: true,
    eventosInesperados: [],
    opciones: [
      {
        id: "empleo_op1",
        texto: "🏢 Estudio Corporativo 'DND & Asociados': Contratos complejos, reestructuración y sueldo de $1.500.000/mes.",
        desafioJuridico: {
          id: "quiz_e7",
          pregunta: "Caso Práctico Corporativo: Una PyME sufre un descalce financiero extraordinario por devaluación sorpresiva. ¿Qué figura del Art. 1091 CCyCN invocás para adecuar el contrato?",
          opciones: [
            "Teoría de los actos propios y cosa juzgada.",
            "Frustración definitiva del objeto social.",
            "Teoría de la imprevisión y excesiva onerosidad sobreviniente.",
            "Nulidad relativa por lesión enorme."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El Art. 1091 CCyCN permite revisar o resolver contratos cuando la prestación se torna excesivamente onerosa por acontecimientos extraordinarios e imprevisibles.",
          dificultad: 3
        },
        impacto: { prestigio: 8, contactos: 6, etica: 3, templanza: -4, dineroPesos: 3600000, impactoRamas: { cibertech: 10, civilComercial: 8 } },
        feedbackNarrativo: "Reestructuraste el contrato comercial aplicando la doctrina de la excesiva onerosidad sobreviniente."
      },
      {
        id: "empleo_op2",
        texto: "🚗 Atender un caso de choque múltiple en Camino Centenario e ir a mediación prejudicial (Ley 13.951).",
        impacto: { prestigio: 7, contactos: 7, etica: 6, templanza: -3, dineroPesos: 3200000, impactoRamas: { civilComercial: 10 } },
        feedbackNarrativo: "Lograste un acuerdo de indemnización justo en la mediación prejudicial bonaerense cobrando tus primeros honorarios fuertes."
      },
      {
        id: "empleo_op3",
        texto: "⚽ [Causa de Famosos] Asumir la defensa técnica de un futbolista conocido en un conflicto contractual de pase.",
        impacto: { prestigio: 9, contactos: 10, etica: -3, templanza: -6, dineroPesos: 4800000, impactoRamas: { penal: 10, civilComercial: 8 } },
        feedbackNarrativo: "La causa tuvo amplia repercusión en medios deportivos y consolidó tu nombre en el ambiente."
      },
      {
        id: "empleo_op4",
        texto: "🏛️ Asesoría General de Gobierno PBA / Fiscalía de Estado: Dictaminar expedientes públicos de contrataciones.",
        impacto: { prestigio: 6, contactos: 9, etica: 6, templanza: 4, dineroPesos: 2600000, impactoRamas: { administrativoPublico: 12 } },
        feedbackNarrativo: "Ingresaste al cuerpo de asesores del Estado adquiriendo experiencia en licitaciones y actos de gobierno."
      },
      {
        id: "empleo_op5",
        texto: "👷 Asesoría legal en el Fuero Laboral: Defender reclamos de accidentes de trabajo (LRT) y despidos injustificados.",
        impacto: { prestigio: 6, contactos: 8, etica: 7, templanza: -3, dineroPesos: 2900000, impactoRamas: { laboral: 12 } },
        feedbackNarrativo: "Te consolidaste como un litigante tenaz ante los Tribunales de Trabajo de La Plata."
      }
    ]
  },

  // ETAPA 8
  {
    id: 8,
    edadInicio: 26,
    edadFin: 28,
    puesto: "Abogado/a Senior de Litigios",
    titulo: "8. El Caso Mediático, las Sucesiones Trabadas y la Ética Forense",
    contextoEscenario: "Tenés 26 años. Un artista musical te busca con urgencia por un conflicto contractual millonario. Al mismo tiempo, en el estudio ingresa una sucesión multimillonaria con herederos enfrentados, y un cliente corporativo ofrece dinero informal para demorar un embargo.",
    dilemaTexto: "¿Cómo balanceás las causas mediáticas, los honorarios y la ética procesal?",
    eventosInesperados: [],
    opciones: [
      {
        id: "e8_op1",
        texto: "🎤 Representar al artista musical: Negociar rescisión de contrato discográfico abusivo ($4.200.000).",
        impacto: { prestigio: 7, contactos: 11, etica: 3, templanza: -6, dineroPesos: 4200000, impactoRamas: { civilComercial: 8, cibertech: 8 } },
        feedbackNarrativo: "Lograste liberar al artista de las cláusulas leoninas del contrato discográfico."
      },
      {
        id: "e8_op2",
        texto: "📜 Tramitar la sucesión conflictiva logrando un acuerdo de partición privada extrajudicial entre herederos.",
        impacto: { prestigio: 7, contactos: 6, etica: 8, templanza: 3, dineroPesos: 3800000, impactoRamas: { familia: 10, civilComercial: 8 } },
        feedbackNarrativo: "Evitaste años de remates judiciales logrando una partición pacífica y cobrando honorarios acordados."
      },
      {
        id: "e8_op3",
        texto: "❌ Rechazar maniobras dilatorias turbias e inscribirte a la Maestría en Derecho de la UNLP ($1.500.000).",
        costoPesosRequerido: 1500000,
        impacto: { prestigio: 10, contactos: 5, etica: 12, templanza: 3, dineroPesos: -1500000 },
        feedbackNarrativo: "Priorizaste tu prestigio académico e integridad ética completando tu posgrado oficial en Jursoc."
      },
      {
        id: "e8_op4",
        texto: "💻 Intervenir como perito o consultor en un caso de fraude bancario electrónico y phishing ante la fiscalía.",
        impacto: { prestigio: 8, contactos: 7, etica: 7, templanza: -2, dineroPesos: 3500000, impactoRamas: { cibertech: 12 } },
        feedbackNarrativo: "Demostraste la trazabilidad informática del fraude protegiendo los ahorros de la víctima."
      }
    ]
  },

  // ETAPA 9
  {
    id: 9,
    edadInicio: 28,
    edadFin: 32,
    puesto: "Director/a de Firma Jurídica",
    titulo: "9. ¿Fundar tu propio Despacho e Incorporar Tecnología Jurídica?",
    contextoEscenario: "A los 28 años tenés capital acumulado, cartera de clientes y prestigio. Se presenta la oportunidad de alquilar un piso cerca de Plaza Paso / calle 12, poner tu chapa y contratar personal, asociarte con un colega de camada o consolidarte como socio director de DND & Asociados.",
    dilemaTexto: "¿Qué rumbo elegís para escalar tu práctica profesional?",
    eventosInesperados: [],
    opciones: [
      {
        id: "e9_op1",
        texto: "🚀 Abrir tu propio Estudio Jurídico en La Plata e invertir $4.000.000 en infraestructura y personal.",
        costoPesosRequerido: 4000000,
        impacto: { prestigio: 10, contactos: 8, etica: 5, templanza: -7, dineroPesos: 8000000, impactoRamas: { civilComercial: 10, penal: 8 } },
        feedbackNarrativo: "Inauguraste tu propio estudio con chapa en la puerta y un equipo de abogados a tu cargo."
      },
      {
        id: "e9_op2",
        texto: "🏢 Consolidarte como Socio Managing Principal de DND & Asociados liderando el área corporativa.",
        impacto: { prestigio: 8, contactos: 10, etica: 4, templanza: -4, dineroPesos: 7500000, impactoRamas: { cibertech: 10, administrativoPublico: 8 } },
        feedbackNarrativo: "Tomaste el liderazgo ejecutivo de la firma corporativa expandiendo sus áreas de práctica."
      },
      {
        id: "e9_op3",
        texto: "🤝 Asociarte con un colega de camada e incorporar software con IA jurídica para análisis de fallos SCBA.",
        impacto: { prestigio: 9, contactos: 8, etica: 7, templanza: 4, dineroPesos: 6200000, impactoRamas: { cibertech: 12, civilComercial: 8 } },
        feedbackNarrativo: "Modernizaron la gestión del despacho logrando una velocidad y precisión procesal inédita."
      },
      {
        id: "e9_op4",
        texto: "🏛️ Concursar para Secretario/a de Juzgado de Primera Instancia en el Poder Judicial PBA.",
        impacto: { prestigio: 9, contactos: 11, etica: 8, templanza: 4, dineroPesos: 4800000, impactoRamas: { administrativoPublico: 12 } },
        feedbackNarrativo: "Aprobaste el concurso y asumiste la secretaría del juzgado con firma y responsabilidad institucional."
      }
    ]
  },

  // ETAPA 10
  {
    id: 10,
    edadInicio: 32,
    edadFin: 45,
    puesto: "Jurista Consagrado / Managing Partner",
    titulo: "10. El Juicio por Jurados, Causas Colectivas y el Doctorado",
    contextoEscenario: "Entre los 32 y los 45 años encabezás las causas de mayor trascendencia en la Provincia de Buenos Aires: un juicio por jurados complejo, un amparo ambiental contra un polo industrial o la defensa de tu Tesis Doctoral en la UNLP.",
    dilemaTexto: "¿En qué ámbito desplegás tu máxima madurez como jurista?",
    eventosInesperados: [],
    opciones: [
      {
        id: "e10_op1",
        texto: "⚖️ Juicio por Jurados y Recurso ante la Suprema Corte: Impugnar por violación de doctrina legal (REIL).",
        desafioJuridico: {
          id: "quiz_e10",
          pregunta: "Caso Práctico Suprema Corte: Se impugna una sentencia por errónea aplicación de la doctrina legal sentada por la SCBA. ¿Qué recurso extraordinario procede en la Provincia de Buenos Aires?",
          opciones: [
            "Recurso Ordinario de Apelación ante la Cámara.",
            "Recurso Extraordinario de Inaplicabilidad de Ley o Doctrina Legal (REIL).",
            "Recurso Directo de Queja por Denegatoria de Medida Cautelar.",
            "Amparo Colectivo de Ejecución Sumaria."
          ],
          opcionCorrectaIdx: 1,
          explicacion: "El REIL es la vía constitucional ante la SCBA (Art. 161 inc. 3 Const. PBA) para cuestionar la violación de la doctrina legal obligatoria.",
          dificultad: 4
        },
        impacto: { prestigio: 11, contactos: 7, etica: 7, templanza: -7, dineroPesos: 12000000, impactoRamas: { penal: 12, civilComercial: 8 } },
        feedbackNarrativo: "Tu alegato y recurso fundado ante la Suprema Corte bonaerense sentaron un precedente procesal clave."
      },
      {
        id: "e10_op2",
        texto: "🎓 Doctorado en Ciencias Jurídicas UNLP: Redactar y defender tu Tesis Doctoral ($3.500.000).",
        costoPesosRequerido: 3500000,
        impacto: { prestigio: 12, contactos: 8, etica: 9, templanza: 4, dineroPesos: -3500000 },
        feedbackNarrativo: "¡Defendiste tu Tesis Doctoral con calificación Sobresaliente Summa Cum Laude en el aula magna de Jursoc!"
      },
      {
        id: "e10_op3",
        texto: "🌿 Encabezar un Amparo Colectivo Ambiental contra un polo químico que contamina napas de agua.",
        impacto: { prestigio: 10, contactos: 7, etica: 11, templanza: -4, dineroPesos: 8500000, impactoRamas: { ambiental: 14 } },
        feedbackNarrativo: "La sentencia ordenó el plan de remediación ambiental integral y reconoció tu rol pro-bono ejemplar."
      },
      {
        id: "e10_op4",
        texto: "⚖️ Concursar para Juez de Primera Instancia en el Consejo de la Magistratura PBA (calle 45).",
        impacto: { prestigio: 10, contactos: 10, etica: 9, templanza: -2, dineroPesos: 9000000, impactoRamas: { administrativoPublico: 12 } },
        feedbackNarrativo: "Encabezaste la terna de mérito tras un examen técnico brillante ante el Consejo."
      }
    ]
  },

  // ETAPA 11
  {
    id: 11,
    edadInicio: 45,
    edadFin: 65,
    puesto: "Juez de Cámara / Cúspide Profesional",
    titulo: "11. El Jury de Enjuiciamiento, la Conducción del CALP y la Cátedra Emérita",
    contextoEscenario: "Superando los 45 años, alcanzás el tramo más encumbrado de tu trayectoria. Siendo Magistrado o referente del foro, enfrentás un Jury de Enjuiciamiento o la oportunidad de presidir el Colegio de Abogados de La Plata (CALP) o asumir como Profesor Emérito en la UNLP.",
    dilemaTexto: "¿Cómo coronás tu legado profesional en el cierre de tu carrera?",
    eventosInesperados: [],
    opciones: [
      {
        id: "e11_op1",
        texto: "⚖️ Defender firmemente tu fallo judicial ante el Jury de Enjuiciamiento invocando la independencia judicial.",
        desafioJuridico: {
          id: "quiz_e11",
          pregunta: "Caso Práctico Jury (Ley 13.661 PBA): Para designar o prestar acuerdo a los Ministros de la Suprema Corte bonaerense (SCBA), ¿qué mayoría legislativa exige la Constitución Provincial?",
          opciones: [
            "Mayoría simple de la Cámara de Diputados.",
            "Decreto directo del Gobernador con acuerdo de ministros.",
            "Acuerdo del Senado Provincial por el voto de dos tercios de los miembros presentes.",
            "Aprobación de la asamblea del Colegio de Abogados."
          ],
          opcionCorrectaIdx: 2,
          explicacion: "El acuerdo constitucional en el Senado PBA exige la mayoría calificada de dos tercios de los miembros presentes.",
          dificultad: 4
        },
        impacto: { prestigio: 12, contactos: 8, etica: 10, templanza: -8, dineroPesos: 15000000 },
        feedbackNarrativo: "Sostuviste la independencia de tu fallo con solvencia constitucional y el Jury desestimó los cargos por unanimidad."
      },
      {
        id: "e11_op2",
        texto: "🏛️ Encabezar la conducción del Colegio de Abogados de La Plata (CALP) defendiendo la dignidad del ejercicio libre.",
        impacto: { prestigio: 11, contactos: 12, etica: 9, templanza: 5, dineroPesos: 12000000, impactoRamas: { administrativoPublico: 10 } },
        feedbackNarrativo: "Presidiste el CALP impulsando la digitalización, la defensa de los honorarios mínimos y la formación continua."
      },
      {
        id: "e11_op3",
        texto: "🎓 Asumir como Profesor Titular Emérito en Jursoc UNLP para formar a las futuras generaciones de abogados.",
        impacto: { prestigio: 12, contactos: 7, etica: 14, templanza: 10, dineroPesos: 10500000 },
        feedbackNarrativo: "Dedicaste tus últimos años a enseñar en las aulas de calle 48, siendo despedido de pie por cientos de alumnos."
      },
      {
        id: "e11_op4",
        texto: "🌐 Dictamen histórico ante la Corte Interamericana de Derechos Humanos (Corte IDH) en San José.",
        impacto: { prestigio: 12, contactos: 9, etica: 14, templanza: 6, dineroPesos: 14000000, impactoRamas: { internacional: 15 } },
        feedbackNarrativo: "Tu intervención sentó doctrina jurisprudencial obligatoria para todo el continente americano."
      }
    ]
  }
];
