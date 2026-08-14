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

export interface ArquetipoFinal {
  id: string;
  titulo: string;
  icono: string;
  descripcion: string;
  fraseCopero: string;
}

export function calcularArquetipoFinal(
  templanza: number,
  contactos: number,
  etica: number,
  prestigio: number
): ArquetipoFinal {
  // 1. LEYENDA DE DERECHO UNLP: Alto en las 4 estadísticas (>= 65)
  if (templanza >= 65 && contactos >= 65 && etica >= 65 && prestigio >= 65) {
    return {
      id: "leyenda_unlp",
      titulo: "👑 LEYENDA DE DERECHO UNLP",
      icono: "Crown",
      descripcion: "Equilibrio supremo entre rigor técnico, valores éticos, red de vínculos y templanza ante la adversidad.",
      fraseCopero: "Marcaste una época en la historia de la Facultad y de los Tribunales bonaerenses."
    };
  }

  // 2. Alta Templanza + Alta Ética
  if (templanza >= 70 && etica >= 70) {
    return {
      id: "abogado_calma",
      titulo: "👨‍⚖️ El Abogado que Nunca Perdió la Calma",
      icono: "Scale",
      descripcion: "Inmutable ante la presión de los tribunales y fiel a los principios deontológicos de la abogacía.",
      fraseCopero: "Tu templanza y conducta intachable fueron tu mayor capital en cada expediente."
    };
  }

  // 3. Alto Contactos + Alto Prestigio
  if (contactos >= 70 && prestigio >= 70) {
    return {
      id: "tribunales_conocido",
      titulo: "🏛️ Conoce a Todo el Mundo en Tribunales",
      icono: "Building2",
      descripcion: "El operador y referente por excelencia de calle 13 y el foro platense.",
      fraseCopero: "No hay despacho de juzgado ni pasillo de Jursoc donde no saluden tu nombre con respeto."
    };
  }

  // 4. Alto Prestigio + Baja Ética
  if (prestigio >= 70 && etica <= 45) {
    return {
      id: "brillante_oscuro",
      titulo: "😈 Brillante... pero nadie sabe cómo llegó hasta ahí",
      icono: "Sparkles",
      descripcion: "Estratega implacable de victorias fulminantes en el filo del reglamento.",
      fraseCopero: "Tus triunfos procesales son indiscutibles, aunque tus métodos despertaron más de una sospecha."
    };
  }

  // 5. Alta Ética + Bajo Contactos
  if (etica >= 70 && contactos <= 45) {
    return {
      id: "agenda_vacia",
      titulo: "📚 Excelente Profesional, con la Agenda Vacía",
      icono: "BookOpen",
      descripcion: "Conocedor enciclopédico del derecho que prefirió el anonimato a las relaciones públicas.",
      fraseCopero: "Tu rigor dogmático es intachable, aunque preferiste los libros a las mesas de café."
    };
  }

  // 6. Alto Contactos + Baja Templanza
  if (contactos >= 70 && templanza <= 45) {
    return {
      id: "vacaciones_segundo_anio",
      titulo: "☕ Conocés a toda la Facultad, pero necesitás vacaciones desde 2do año",
      icono: "Coffee",
      descripcion: "El alma de los pasillos de Jursoc y Diagonal 74, exhausto por el vértigo universitario.",
      fraseCopero: "Conectaste con todo el mundo, pero el estrés de la carrera te pasó factura."
    };
  }

  // Por defecto: Graduado Consagrado UNLP
  return {
    id: "abogado_consagrado",
    titulo: "⚖️ Jurista Graduado de la UNLP",
    icono: "GraduationCap",
    descripcion: "Trayectoria sólida forjada en las aulas de calle 48 y el ejercicio forense bonaerense.",
    fraseCopero: "Completaste una carrera profesional íntegra y de gran aporte a la comunidad."
  };
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
// INCORPORA LAS 50 SITUACIONES Y EVENTOS DEL MANUAL OFICIAL "OPCIONES HACE TU CARRERA"
export const ETAPAS_CARRERA: EtapaVida[] = [
  // ETAPA 1 (18-19 AÑOS): 1er AÑO - INGRESO Y EL PRIMER PARCIAL DE DERECHO ROMANO
  {
    id: 1,
    edadInicio: 18,
    edadFin: 19,
    puesto: "Ingresante a 1er Año (Jursoc UNLP)",
    titulo: "1. El Ingreso a la Universidad y el Primer Parcial de Romano",
    contextoEscenario: "Entrás por las escalinatas de la Facultad de Ciencias Jurídicas y Sociales (Jursoc) de la UNLP en calle 48. El ambiente es vibrante: pasillos desbordados, filas en las fotocopiadoras del subsuelo y clases multitudinarias. Faltan cinco días para tu primer parcial decisivo de Derecho Romano. Tenés 600 páginas, tres unidades y todavía no abriste el programa.",
    dilemaTexto: "Faltan cinco días para tu primer parcial. Tenés 600 páginas, tres unidades y todavía no abriste el programa. ¿Qué hacés?",
    eventosInesperados: [
      {
        id: "e1_ev_cargador",
        titulo: "🔋 ¿Quién tiene cargador en el aula?",
        descripcion: "Tu celular se queda sin batería en medio del aula 202 y un colega te comparte un cargador y su powerbank.",
        tipo: "positivo",
        impacto: { prestigio: 2, contactos: 5, etica: 4, templanza: 2, dineroPesos: 0 }
      },
      {
        id: "e1_ev_sinclases",
        titulo: "🛌 Te enterás de que mañana no hay clases",
        descripcion: "Se suspendieron las actividades docentes del viernes. Tuviste 24 horas extra inesperadas para adelantar estudio y descansar.",
        tipo: "positivo",
        impacto: { prestigio: 6, contactos: -1, etica: 5, templanza: -2, dineroPesos: 0 }
      },
      {
        id: "e1_ev_187msg",
        titulo: "📱 El grupo de WhatsApp tiene 187 mensajes",
        descripcion: "Aparecieron cientos de mensajes debatiendo qué fallos entran y los audios de la clase teórica.",
        tipo: "neutro",
        impacto: { prestigio: 1, contactos: 5, etica: 3, templanza: 2, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e1_op1",
        texto: "📖 Leer toda la bibliografía de punta a punta (Derecho Romano).",
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
        impacto: { prestigio: 4, contactos: -1, etica: 3, templanza: -4, dineroPesos: -15000, impactoRamas: { civilComercial: 6 } },
        feedbackNarrativo: "Dedicaste el fin de semana entero a leer fuentes y latín jurídico. Respondiste con precisión e impresionaste a la cátedra."
      },
      {
        id: "e1_op2",
        texto: "📝 Conseguir el resumen que 'usa toda la Facultad' en el centro de fotocopiado.",
        impacto: { prestigio: 1, contactos: 3, etica: 1, templanza: 3, dineroPesos: -6000, impactoRamas: { civilComercial: 4 } },
        feedbackNarrativo: "El resumen anillado del subsuelo te salvó las papas. Llegaste con los conceptos justos para aprobar."
      },
      {
        id: "e1_op3",
        texto: "🃏 Conseguir parciales viejos y estudiar lo que más toman los profesores.",
        impacto: { prestigio: 2, contactos: 4, etica: -1, templanza: 2, dineroPesos: 0, impactoRamas: { civilComercial: 3 } },
        feedbackNarrativo: "Identificaste las 10 preguntas fijas del titular y fuiste a lo seguro rindiendo con tranquilidad."
      },
      {
        id: "e1_op4",
        texto: "🙏 Confiar en que algo vas a recordar en el examen y salir a Diagonal 74 con amigos.",
        impacto: { prestigio: -4, contactos: -2, etica: 1, templanza: 5, dineroPesos: -25000 },
        feedbackNarrativo: "La noche en los bares platenses fue inolvidable, aunque en el examen transpiraste la camiseta hasta el último minuto."
      },
      {
        id: "e1_op5",
        texto: "🎓 [Seminario Arancelado] Inscribirte al Seminario Inicial de Litigación y Oratoria en Jursoc ($120.000).",
        costoPesosRequerido: 120000,
        impacto: { prestigio: 8, contactos: 4, etica: 3, templanza: -3, dineroPesos: -120000, impactoRamas: { penal: 6 } },
        feedbackNarrativo: "Invertiste en tu formación y adquiriste una soltura argumentativa destacada."
      }
    ]
  },

  // ETAPA 2 (19-20 AÑOS): 2do AÑO - EL MATE EN LA FACULTAD Y EL PROFESOR QUE SE ACUERDA DE TU NOMBRE
  {
    id: 2,
    edadInicio: 19,
    edadFin: 20,
    puesto: "Estudiante de 2do Año (Jursoc UNLP)",
    titulo: "2. Las Cursadas en Calle 48, El Mate y la Relación Docente",
    contextoEscenario: "Cursás Derecho Político, Constitucional y Penal I. Tenés dos horas libres entre cursadas en la puerta de la Facultad donde un grupo está tomando mate. Además, tras varias semanas de clases, el profesor titular te reconoce cuando entrás al aula.",
    dilemaTexto: "¿Cómo administrás tus pausas entre cursadas y cómo te posicionás académicamente frente al docente?",
    eventosInesperados: [
      {
        id: "e2_ev_comision",
        titulo: "🌅 Tenés que elegir comisión para el próximo cuatrimestre",
        descripcion: "Salió la grilla de horarios: ¿madrugar a las 8 AM con el profesor más exigente o cursar a la noche?",
        tipo: "neutro",
        impacto: { prestigio: 3, contactos: 3, etica: 3, templanza: 3, dineroPesos: 0 }
      },
      {
        id: "e2_ev_apuntes",
        titulo: "📚 Te piden apuntes de Constitucional",
        descripcion: "Varios compañeros te piden tus notas completas y los fallos de la Corte Suprema comentados.",
        tipo: "positivo",
        impacto: { prestigio: 5, contactos: 6, etica: 6, templanza: -1, dineroPesos: 0 }
      },
      {
        id: "e2_ev_micro",
        titulo: "🚌 El micro 273 a las 21:30 saliendo de cursar",
        descripcion: "Salís tarde de la Facultad con la cabeza explotada y tenés 40 minutos de viaje hasta tu casa.",
        tipo: "neutro",
        impacto: { prestigio: 2, contactos: 6, etica: 2, templanza: 3, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e2_op1",
        texto: "🧉 Quedarte a tomar mate en las escalinatas y conocer a todo el mundo.",
        impacto: { prestigio: 2, contactos: 7, etica: 1, templanza: 3, dineroPesos: 0 },
        feedbackNarrativo: "Te hiciste amigo de compañeros de todas las comisiones y construiste una red estudiantil muy sólida."
      },
      {
        id: "e2_op2",
        texto: "📚 Ir a la Biblioteca Central de calle 48 a estudiar a fondo doctrina y fallos de la Corte.",
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
        impacto: { prestigio: 4, contactos: -3, etica: 4, templanza: 1, dineroPesos: 0, impactoRamas: { penal: 7, civilComercial: 5 } },
        feedbackNarrativo: "Las horas en los boxes de la biblioteca te permitieron dominar las garantías del Art. 18 CN."
      },
      {
        id: "e2_op3",
        texto: "🙋 Empezar a participar activamente en todas las clases y debatir con el titular.",
        impacto: { prestigio: 6, contactos: 3, etica: 3, templanza: -2, dineroPesos: 0, impactoRamas: { penal: 8 } },
        feedbackNarrativo: "Tus intervenciones orales fundamentadas te posicionaron como uno de los alumnos más destacados de la comisión."
      },
      {
        id: "e2_op4",
        texto: "🤐 Seguir siendo un fantasma académico de bajo perfil y rendir en silencio.",
        impacto: { prestigio: -3, contactos: -2, etica: 1, templanza: 4, dineroPesos: 0 },
        feedbackNarrativo: "Mantuviste perfil bajo sin exponerte ni sumar estrés extra durante las cursadas."
      },
      {
        id: "e2_op5",
        texto: "☕ Quedarte después de clase a hablar con el profesor sobre doctrina y futuras pasantías.",
        impacto: { prestigio: 4, contactos: 6, etica: 3, templanza: -1, dineroPesos: 0 },
        feedbackNarrativo: "El profesor valoró tu interés técnico y te recomendó bibliografía avanzada y contactos en el fuero."
      }
    ]
  },

  // ETAPA 3 (20-21 AÑOS): 3er AÑO - EL GRUPO DE WHATSAPP, LA MESA DE EXAMEN Y EL GRUPO DE ESTUDIO
  {
    id: 3,
    edadInicio: 20,
    edadFin: 21,
    puesto: "Estudiante de 3er Año (Jursoc UNLP)",
    titulo: "3. La Medianoche en WhatsApp, el Cierre de Mesas y el Grupo de Estudio",
    contextoEscenario: "Cursás Obligaciones y Contratos. A las 23:58 en el grupo de WhatsApp alguien pregunta desesperado: '¿Alguien sabe qué entra mañana?'. Además, descubrís que la inscripción para la mesa de examen cerró ayer en el SIU Guaraní y tus compañeros te invitan a un grupo de estudio.",
    dilemaTexto: "¿Cómo respondés ante la urgencia de tus compañeros, el olvido administrativo y la organización del estudio?",
    eventosInesperados: [
      {
        id: "e3_ev_error_apunte",
        titulo: "⚠️ Descubrís que el apunte que todos estudian tiene un error importante",
        descripcion: "El resumen viral confundía prescripción con caducidad. Avisaste de inmediato y salvaste a toda la comisión.",
        tipo: "positivo",
        impacto: { prestigio: 4, contactos: 5, etica: 7, templanza: 2, dineroPesos: 0 }
      },
      {
        id: "e3_ev_bar_profe",
        titulo: "☕ Te cruzás al profesor titular en un café de calle 49",
        descripcion: "Tuviste una charla distendida sobre la carrera, la práctica profesional en Tribunales y el ejercicio del derecho.",
        tipo: "positivo",
        impacto: { prestigio: 3, contactos: 5, etica: 4, templanza: 4, dineroPesos: 0 }
      },
      {
        id: "e3_ev_parcial_4",
        titulo: "📝 Sacaste un 4 y revisás los errores con el docente",
        descripcion: "Aprovechaste la devolución del parcial para entender exactamente los criterios de corrección de la cátedra.",
        tipo: "positivo",
        impacto: { prestigio: 4, contactos: 3, etica: 6, templanza: -2, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e3_op1",
        texto: "📚 Responder en el grupo con el programa oficial y organizar un cronograma de estudio.",
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
        impacto: { prestigio: 3, contactos: 5, etica: 5, templanza: 2, dineroPesos: 0, impactoRamas: { civilComercial: 7, administrativoPublico: 6 } },
        feedbackNarrativo: "Pusiste orden en el caos del grupo, compartiste el programa y armaron un cronograma que los llevó al éxito."
      },
      {
        id: "e3_op2",
        texto: "🃏 Mandar el parcial del año pasado que tenías guardado en Drive.",
        impacto: { prestigio: 2, contactos: 5, etica: -3, templanza: 1, dineroPesos: 0 },
        feedbackNarrativo: "El parcial filtrado circuló por todos lados. Te ganaste el aprecio del grupo aunque la cátedra se molestó."
      },
      {
        id: "e3_op3",
        texto: "🏛️ Ir personalmente a hablar con el Departamento de Alumnos a pedir excepción de inscripción a la mesa.",
        impacto: { prestigio: 3, contactos: 2, etica: 4, templanza: -2, dineroPesos: 0 },
        feedbackNarrativo: "Explicaste tu situación con respeto en ventanilla y lograste que te habiliten el acta complementaria."
      },
      {
        id: "e3_op4",
        texto: "🏃 Procurar expedientes en la barandilla de Tribunales de calle 13: Cédulas, mandamientos y oficios.",
        impacto: { prestigio: 4, contactos: 9, etica: 3, templanza: -4, dineroPesos: 480000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Aprendiste el oficio real de la procuración y te hiciste conocido en todas las secretarías de juzgado."
      },
      {
        id: "e3_op5",
        texto: "🧠 Sumarte al grupo de estudio para explicar los temas complejos y debatir fallos.",
        impacto: { prestigio: 5, contactos: 4, etica: 5, templanza: -1, dineroPesos: 0 },
        feedbackNarrativo: "Explicar los temas a tus compañeros te obligó a fijar conceptos y consolidar tu liderazgo académico."
      }
    ]
  },

  // ETAPA 4 (21-22 AÑOS): 4to AÑO - EL PARCIAL IMPOSIBLE, EL APUNTE DE 327 PÁGINAS Y LA PREVIA
  {
    id: 4,
    edadInicio: 21,
    edadFin: 22,
    puesto: "Estudiante Avanzado de 4to Año",
    titulo: "4. El Parcial Imposible, el Apunte Legendario y la Previa",
    contextoEscenario: "Cursás Derecho Penal II, Daños y Reales. En el parcial la primera pregunta es exactamente el tema que decidiste no estudiar. Al mismo tiempo te llega el PDF 'RESUMEN DEFINITIVO FINAL AHORA SÍ 2026.pdf' de 327 páginas, tus amigos organizan una previa antes de rendir y la plata del alquiler aprieta.",
    dilemaTexto: "¿Cómo sorteás el parcial con temas imprevistos, el volumen inmenso de lectura y las salidas nocturnas?",
    eventosInesperados: [
      {
        id: "e4_ev_tarde",
        titulo: "🕗 Son las 7:57 y la clase empieza a las 8",
        descripcion: "Corriste desde Plaza Moreno hasta la Facultad esquivando el tráfico y llegaste justo a tiempo.",
        tipo: "neutro",
        impacto: { prestigio: 3, contactos: 0, etica: 4, templanza: -3, dineroPesos: 0 }
      },
      {
        id: "e4_ev_congreso",
        titulo: "🎓 Te invitan a un Congreso de Derecho en Mar del Plata",
        descripcion: "Viajaste con compañeros de la UNLP a debatir ponencias de derecho procesal y conocer juristas de todo el país.",
        tipo: "positivo",
        impacto: { prestigio: 7, contactos: 8, etica: 3, templanza: 2, dineroPesos: -40000 }
      },
      {
        id: "e4_ev_pasar",
        titulo: "🙋 El profesor pregunta quién quiere pasar al frente a exponer",
        descripcion: "Levantaste la mano con firmeza y resolviste el caso práctico en el pizarrón ganándote la felicitación de la cátedra.",
        tipo: "positivo",
        impacto: { prestigio: 7, contactos: 3, etica: 5, templanza: -3, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e4_op1",
        texto: "🧠 Improvisar relacionando doctrina, jurisprudencia y principios del Código Civil y Comercial.",
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
        impacto: { prestigio: 3, contactos: -1, etica: 2, templanza: 6, dineroPesos: 0, impactoRamas: { civilComercial: 8, penal: 6 } },
        feedbackNarrativo: "Mantuviste la calma, aplicaste principios generales del derecho y saliste airoso de una pregunta tramposa."
      },
      {
        id: "e4_op2",
        texto: "📖 Leer el apunte legendario de 327 páginas completo y compararlo con la bibliografía oficial.",
        impacto: { prestigio: 5, contactos: -1, etica: 4, templanza: -5, dineroPesos: -15000, impactoRamas: { civilComercial: 9 } },
        feedbackNarrativo: "Te quemaste las pestañas leyendo las 327 páginas pero dominaste cada artículo del programa."
      },
      {
        id: "e4_op3",
        texto: "🍕 Quedarte estudiando la noche previa y rechazar la previa con amigos.",
        impacto: { prestigio: 4, contactos: -4, etica: 5, templanza: -3, dineroPesos: 0 },
        feedbackNarrativo: "Priorizaste el examen y llegaste descansado y con la mente lúcida."
      },
      {
        id: "e4_op4",
        texto: "💸 Trabajar de procurador senior en La Plata para bancar el costo del alquiler ($1.400.000).",
        impacto: { prestigio: 4, contactos: 7, etica: 3, templanza: 4, dineroPesos: 1400000, impactoRamas: { penal: 5, civilComercial: 6 } },
        feedbackNarrativo: "Equilibraste las materias con el trabajo, ganando autonomía económica y roce profesional."
      },
      {
        id: "e4_op5",
        texto: "🤡 Estudiar solamente las 17 páginas que 'seguro toman' según los de años superiores.",
        impacto: { prestigio: -3, contactos: 2, etica: -2, templanza: 5, dineroPesos: 0 },
        feedbackNarrativo: "Apostaste a la suerte. Aprobaste con lo justo pero te quedó un bache conceptual en temas clave."
      }
    ]
  },

  // ETAPA 5 (22-23 AÑOS): 5to AÑO - LA PRÁCTICA SUPERVISADA, EL PRIMER TRABAJO Y LA IA
  {
    id: 5,
    edadInicio: 22,
    edadFin: 23,
    puesto: "Práctica Profesional / Último Año",
    titulo: "5. La Práctica Supervisada, el Primer Trabajo y la IA",
    contextoEscenario: "Llegás al último año de la carrera. Una escribanía te ofrece trabajar cuatro tardes por semana, tenés que entregar un trabajo práctico complejo donde descubrís que una IA puede asistirte, y en el Consultorio Jurídico Gratuito de la UNLP atendés amparos reales de personas vulnerables.",
    dilemaTexto: "¿Cómo balanceás el primer empleo formal, la ética con las nuevas tecnologías y el compromiso social en el Consultorio?",
    eventosInesperados: [
      {
        id: "e5_ev_tramite",
        titulo: "🏛️ El trámite en la Facultad: Ventanilla vs Página web",
        descripcion: "Mostraste la normativa oficial de la UNLP y lograste destrabar la equivalencia de tu última cursada.",
        tipo: "positivo",
        impacto: { prestigio: 5, contactos: 2, etica: 6, templanza: 2, dineroPesos: 0 }
      },
      {
        id: "e5_ev_ayudante",
        titulo: "🤝 Te ofrecen ser Ayudante Alumno ad-honorem de Cátedra",
        descripcion: "El titular de Derecho Civil te convocó para sumarte al equipo docente de la Facultad.",
        tipo: "positivo",
        impacto: { prestigio: 8, contactos: 6, etica: 6, templanza: -3, dineroPesos: 0 }
      },
      {
        id: "e5_ev_delegado",
        titulo: "👥 Te eligen delegado de comisión",
        descripcion: "Defendiste los reclamos del curso ante la secretaría académica logrando reprogramar fechas superpuestas.",
        tipo: "positivo",
        impacto: { prestigio: 7, contactos: 8, etica: 6, templanza: -3, dineroPesos: 0 }
      }
    ],
    opciones: [
      {
        id: "e5_op1",
        texto: "❤️ Dedicación total al Consultorio Gratuito de la UNLP: Resolver amparos de salud urgentes contra obras sociales/IOMA.",
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
        texto: "💼 Aceptar el trabajo en la escribanía cuatro tardes por semana ($800.000).",
        impacto: { prestigio: 6, contactos: 7, etica: 3, templanza: -5, dineroPesos: 800000, impactoRamas: { civilComercial: 8 } },
        feedbackNarrativo: "Adquiriste experiencia invaluable en escrituración, certificaciones y derecho notarial."
      },
      {
        id: "e5_op3",
        texto: "🤖 Usar la IA para investigar doctrina y jurisprudencia, y redactar vos mismo el dictamen.",
        impacto: { prestigio: 4, contactos: -1, etica: 5, templanza: 3, dineroPesos: 0, impactoRamas: { cibertech: 8 } },
        feedbackNarrativo: "Utilizaste la tecnología como asistente de investigación sin descuidar el análisis crítico personal."
      },
      {
        id: "e5_op4",
        texto: "⚖️ Negociar trabajar solamente dos tardes en la escribanía para no descuidar los últimos finales.",
        impacto: { prestigio: 5, contactos: 5, etica: 4, templanza: 2, dineroPesos: 450000, impactoRamas: { civilComercial: 6 } },
        feedbackNarrativo: "Lograste un equilibrio perfecto entre experiencia laboral e impulso académico final."
      },
      {
        id: "e5_op5",
        texto: "👨‍⚖️ 'Como estudiás derecho...': Explicarle a un familiar qué hacer con una carta documento con rigor ético.",
        impacto: { prestigio: 5, contactos: 4, etica: 5, templanza: 3, dineroPesos: 0, impactoRamas: { civilComercial: 5 } },
        feedbackNarrativo: "Asesoraste a tu familia con claridad explicando los alcances legales y los límites de tu rol como estudiante."
      }
    ]
  },

  // ETAPA 6 (23-24 AÑOS): ¡LA RECIBIDA EN CALLE 48 Y FOTO DE FIN DE CURSADA!
  {
    id: 6,
    edadInicio: 23,
    edadFin: 24,
    puesto: "¡Egresado de la FCJyS (UNLP)!",
    titulo: "6. La Firma de la Libreta, la Foto de Fin de Cursada y la Graduación",
    contextoEscenario: "¡Momento inolvidable! A los 23 años saliste del aula del 3er piso tras rendir y aprobar tu última materia de la carrera. En las escalinatas de calle 48 te esperan tus compañeros, amigos y familia con carteles, cotillón y harina.",
    dilemaTexto: "¿Cómo elegís celebrar la obtención del título de Abogado/a de la UNLP y la foto de fin de carrera?",
    esFestejoRecibida: true,
    eventosInesperados: [],
    opciones: [
      {
        id: "recibida_op1",
        texto: "🥚 Festejo tradicional descontrolado: Huevos, harina, témpera, cotillón y fiesta en la vereda de calle 48.",
        impacto: { prestigio: 3, contactos: 8, etica: -1, templanza: 10, dineroPesos: -80000 },
        feedbackNarrativo: "¡Terminaste enharinado festejando con toda la camada! Un momento histórico que quedó inmortalizado en fotos."
      },
      {
        id: "recibida_op2",
        texto: "🍷 Festejo íntimo y familiar: Asado en casa con tu familia y afectos cercanos con perfil bajo.",
        impacto: { prestigio: 6, contactos: 3, etica: 8, templanza: 8, dineroPesos: -40000 },
        feedbackNarrativo: "Un emotivo brindis familiar agradeciendo el esfuerzo conjunto de todos los años de estudio."
      },
      {
        id: "recibida_op3",
        texto: "📸 Organizar la foto grupal de la camada dejando que se luzcan los que organizaron todo.",
        impacto: { prestigio: 5, contactos: 8, etica: 7, templanza: 4, dineroPesos: -20000 },
        feedbackNarrativo: "Coordinaste una emotiva foto en el patio de la Reforma que todos guardarán de recuerdo para siempre."
      },
      {
        id: "recibida_op4",
        texto: "🤫 Graduación en silencio: Guardar la libreta firmada y salir directo a iniciar los trámites del diploma.",
        impacto: { prestigio: 5, contactos: -2, etica: 5, templanza: 2, dineroPesos: 40000 },
        feedbackNarrativo: "Sin festejos ruidosos. Totalmente enfocado en agilizar la expedición de tu título oficial."
      }
    ]
  },

  // ETAPA 7 (24-26 AÑOS): LA JURA DE LA MATRÍCULA EN EL CALP Y EL PRIMER EMPLEO
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

  // ETAPA 8 (26-28 AÑOS): LITIGIO SENIOR, CASO MEDIÁTICO Y ÉTICA FORENSE
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

  // ETAPA 9 (28-32 AÑOS): FUNDAR DESPACHO PROPIO O SOCIO MANAGING
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

  // ETAPA 10 (32-45 AÑOS): JUICIO POR JURADOS, CAUSAS COLECTIVAS Y DOCTORADO
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

  // ETAPA 11 (45-65 AÑOS): EL JURY DE ENJUICIAMIENTO, LA CONDUCCIÓN DEL CALP Y LA CÁTEDRA EMÉRITA
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
