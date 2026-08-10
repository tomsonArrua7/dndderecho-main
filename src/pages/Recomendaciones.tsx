import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookmarkCheck, 
  Search, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Clock, 
  BookOpen, 
  AlertCircle,
  FileSearch,
  Filter,
  Layers,
  Sprout,
  Users
} from "lucide-react";
import { MATERIAS_PLAN6, Materia } from "@/data/plan6Structure";
import { cn } from "@/lib/utils";

export interface RecomendacionData {
  materiaId: string;
  driveViewUrl: string;
  drivePreviewUrl: string;
  descripcion: string;
  fechaActualizacion: string;
}

// Datos de Recomendaciones oficiales compartidas
export const RECOMENDACIONES_MAP: Record<string, RecomendacionData> = {

  // ══════════════════════════════════════════════════════
  // INGRESANTES / PRIMER AÑO (también aparecen en año 1)
  // ══════════════════════════════════════════════════════

  // INTRODUCCIÓN AL DERECHO (10111)
  "10111": {
    materiaId: "10111",
    driveViewUrl: "https://drive.google.com/file/d/1NohtHGiy1RGM9wbmpJ2ZnvJk3fzvxDjm/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1NohtHGiy1RGM9wbmpJ2ZnvJk3fzvxDjm/preview",
    descripcion: "Orientación inicial para ingresantes, resumen de doctrinas, cátedras recomendadas y modelos de examen.",
    fechaActualizacion: "Agosto 2026"
  },
  // HISTORIA CONSTITUCIONAL (10112)
  "10112": {
    materiaId: "10112",
    driveViewUrl: "https://drive.google.com/file/d/1eQ26_hb4a-a_kf6dHFidzvXy9cwRJ1kQ/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1eQ26_hb4a-a_kf6dHFidzvXy9cwRJ1kQ/preview",
    descripcion: "Guía oficial de lectura, análisis de programas de cátedras y tips de estudio para Historia Constitucional.",
    fechaActualizacion: "Agosto 2026"
  },
  // INTRODUCCIÓN A LA SOCIOLOGÍA (10113)
  "10113": {
    materiaId: "10113",
    driveViewUrl: "https://drive.google.com/file/d/15qk3_g2rn-Ff5NpSoE_nc9M3Qny9VPM6/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/15qk3_g2rn-Ff5NpSoE_nc9M3Qny9VPM6/preview",
    descripcion: "Recomendaciones de lectura de autores sociológicos, evaluación de comisiones y tips para los exámenes.",
    fechaActualizacion: "Agosto 2026"
  },
  // INTRODUCCIÓN AL PENSAMIENTO CIENTÍFICO (10616)
  "10616": {
    materiaId: "10616",
    driveViewUrl: "https://drive.google.com/file/d/1XYV0I0tlZO1u-IB-aLSnMjCIwIrIIzWg/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1XYV0I0tlZO1u-IB-aLSnMjCIwIrIIzWg/preview",
    descripcion: "Guía de estudio para Introducción al Pensamiento Científico: autores, metodología y tips de evaluación.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO ROMANO (10121)
  "10121": {
    materiaId: "10121",
    driveViewUrl: "https://drive.google.com/file/d/11-_ICXUzpZcl6z4qIbeO7meFf4K5K3QV/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/11-_ICXUzpZcl6z4qIbeO7meFf4K5K3QV/preview",
    descripcion: "Recomendaciones integrales de cursada, análisis de cátedras, metodología de parciales y conceptos clave para Derecho Romano.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO POLÍTICO (10114)
  "10114": {
    materiaId: "10114",
    driveViewUrl: "https://drive.google.com/file/d/1sJm9iTlYwAoPXmi5Sx7wLmgKYefzxPpX/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1sJm9iTlYwAoPXmi5Sx7wLmgKYefzxPpX/preview",
    descripcion: "Recomendaciones de cursada y autores esenciales para Derecho Político.",
    fechaActualizacion: "Agosto 2026"
  },

  // ══════════════════════════════════════════════════════
  // SEGUNDO AÑO
  // ══════════════════════════════════════════════════════

  // DERECHO PRIVADO I - CIVIL (10122)
  "10122": {
    materiaId: "10122",
    driveViewUrl: "https://drive.google.com/file/d/1QXK3ZU92k0P-nnK5Wtwj1dpoXopCoxpY/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1QXK3ZU92k0P-nnK5Wtwj1dpoXopCoxpY/preview",
    descripcion: "Recomendaciones de cursada, cátedras y metodología de exámenes para Derecho Privado I.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PENAL I (10124)
  "10124": {
    materiaId: "10124",
    driveViewUrl: "https://drive.google.com/file/d/1slxx9u6Gwe2LgNM0eA19ENIGk3i-aF_i/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1slxx9u6Gwe2LgNM0eA19ENIGk3i-aF_i/preview",
    descripcion: "Guía de cátedras, autores y estrategias de examen para Derecho Penal I.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO CONSTITUCIONAL (10125)
  "10125": {
    materiaId: "10125",
    driveViewUrl: "https://drive.google.com/file/d/1SmKzYmkQyUWsjav4V9A7nv0HCZ0tImvf/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1SmKzYmkQyUWsjav4V9A7nv0HCZ0tImvf/preview",
    descripcion: "Recomendaciones de cursada, bibliografía esencial y análisis de cátedras para Derecho Constitucional.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHOS HUMANOS (10626)
  "10626": {
    materiaId: "10626",
    driveViewUrl: "https://drive.google.com/file/d/1J5SBr4pqTC8CzMPQHbdJF_wjUl9BVbSW/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1J5SBr4pqTC8CzMPQHbdJF_wjUl9BVbSW/preview",
    descripcion: "Guía de estudio y recomendaciones para Derechos Humanos: tratados, organismos y metodología de cursada.",
    fechaActualizacion: "Agosto 2026"
  },
  // TEORÍA DEL CONFLICTO (10627)
  "10627": {
    materiaId: "10627",
    driveViewUrl: "https://drive.google.com/file/d/1ik6bDGe4221LTTFI1bkKOpfRF0epEQZt/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1ik6bDGe4221LTTFI1bkKOpfRF0epEQZt/preview",
    descripcion: "Recomendaciones de cursada y autores clave para Teoría del Conflicto.",
    fechaActualizacion: "Agosto 2026"
  },

  // ══════════════════════════════════════════════════════
  // TERCER AÑO
  // ══════════════════════════════════════════════════════

  // DERECHO PRIVADO IV - COMERCIAL (10132) → "Derecho Comercial I"
  "10132": {
    materiaId: "10132",
    driveViewUrl: "https://drive.google.com/file/d/10ls2HeTf0bgsXeODHSttDlh_qWPnBBWR/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/10ls2HeTf0bgsXeODHSttDlh_qWPnBBWR/preview",
    descripcion: "Recomendaciones de cátedras, bibliografía y estrategias para Derecho Privado IV / Comercial I.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PRIVADO III - CIVIL (10133) → "Civil III"
  "10133": {
    materiaId: "10133",
    driveViewUrl: "https://drive.google.com/file/d/1WYTz0HlKIz7oucRpPocgJ20FUkPR86sT/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1WYTz0HlKIz7oucRpPocgJ20FUkPR86sT/preview",
    descripcion: "Guía de cursada, autores y tips de examen para Derecho Privado III / Civil III.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PROCESAL I (10134)
  "10134": {
    materiaId: "10134",
    driveViewUrl: "https://drive.google.com/file/d/1yzZ2GHXh5Q-r5w_oGLsbKQiYI8_8rgRh/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1yzZ2GHXh5Q-r5w_oGLsbKQiYI8_8rgRh/preview",
    descripcion: "Recomendaciones de cursada, cátedras y metodología de parciales para Derecho Procesal I.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PÚBLICO, PROVINCIAL Y MUNICIPAL (10136)
  "10136": {
    materiaId: "10136",
    driveViewUrl: "https://drive.google.com/file/d/18ewX8dq1aUXKuCaMI4rSyv3dg-l-y-_G/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/18ewX8dq1aUXKuCaMI4rSyv3dg-l-y-_G/preview",
    descripcion: "Guía de estudio para Derecho Público, Provincial y Municipal: constituciones provinciales y régimen municipal.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO INTERNACIONAL PÚBLICO (10138)
  "10138": {
    materiaId: "10138",
    driveViewUrl: "https://drive.google.com/file/d/15DUxsD4UhJOcst8Bj3uu4qFuxnKjpd9K/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/15DUxsD4UhJOcst8Bj3uu4qFuxnKjpd9K/preview",
    descripcion: "Recomendaciones de cátedras, tratados y organismos internacionales para Derecho Internacional Público.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PENAL II (10135)
  "10135": {
    materiaId: "10135",
    driveViewUrl: "https://drive.google.com/file/d/15q1eJg8KuODdMvdz6Z5KOy2FAkLieNWh/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/15q1eJg8KuODdMvdz6Z5KOy2FAkLieNWh/preview",
    descripcion: "Recomendaciones de cursada, parte especial del Código Penal y estrategia de exámenes para Derecho Penal II.",
    fechaActualizacion: "Agosto 2026"
  },
  // ECONOMÍA POLÍTICA (10115)
  "10115": {
    materiaId: "10115",
    driveViewUrl: "https://drive.google.com/file/d/1BmK7vuCAUoQPv3FMYQdpKqpS4HDh88Ru/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1BmK7vuCAUoQPv3FMYQdpKqpS4HDh88Ru/preview",
    descripcion: "Guía de autores, corrientes económicas y metodología de cursada para Economía Política.",
    fechaActualizacion: "Agosto 2026"
  },

  // ══════════════════════════════════════════════════════
  // CUARTO AÑO
  // ══════════════════════════════════════════════════════

  // DERECHO ADMINISTRATIVO I (10141)
  "10141": {
    materiaId: "10141",
    driveViewUrl: "https://drive.google.com/file/d/1M9RQQpROiJeRoVFl8jp-pG1TQcBVUEvV/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1M9RQQpROiJeRoVFl8jp-pG1TQcBVUEvV/preview",
    descripcion: "Recomendaciones de cursada, bibliografía y análisis de cátedras para Derecho Administrativo I.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PRIVADO VI - COMERCIAL (10142) → "Comercial I" del 4to año
  "10142": {
    materiaId: "10142",
    driveViewUrl: "https://drive.google.com/file/d/1Wz0I13vqkSX2-PjVmvFuCu3fYWwiF5tC/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1Wz0I13vqkSX2-PjVmvFuCu3fYWwiF5tC/preview",
    descripcion: "Guía de cursada, cátedras y estrategias de examen para Derecho Privado VI / Comercial II.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO PRIVADO V - CIVIL (10143)
  "10143": {
    materiaId: "10143",
    driveViewUrl: "https://drive.google.com/file/d/1pZQz71TdR-7-iMmzhTRB5iwauoIX-pgn/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1pZQz71TdR-7-iMmzhTRB5iwauoIX-pgn/preview",
    descripcion: "Recomendaciones de cursada y autores clave para Derecho Privado V / Civil.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO SOCIAL DEL TRABAJO (10640)
  "10640": {
    materiaId: "10640",
    driveViewUrl: "https://drive.google.com/file/d/12NU2UkWTHeCeAmb9mXEgAPovmu3sq3Yu/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/12NU2UkWTHeCeAmb9mXEgAPovmu3sq3Yu/preview",
    descripcion: "Recomendaciones de cátedras, legislación laboral y metodología de parciales para Derecho Social del Trabajo.",
    fechaActualizacion: "Agosto 2026"
  },
  // MEDIACIÓN Y MEDIOS DE RESOLUCIÓN DE CONFLICTOS (10649)
  "10649": {
    materiaId: "10649",
    driveViewUrl: "https://drive.google.com/file/d/1thirnlOl60hlzYGHWwueZbxiUTOJ0YqF/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1thirnlOl60hlzYGHWwueZbxiUTOJ0YqF/preview",
    descripcion: "Guía de cursada, autores y técnicas de mediación para la materia Mediación y Medios de Resolución de Conflictos.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO AGRARIO (10146)
  "10146": {
    materiaId: "10146",
    driveViewUrl: "https://drive.google.com/file/d/1oApX9E7pyCuNglqWKbtjfE70sy3zGSD9/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1oApX9E7pyCuNglqWKbtjfE70sy3zGSD9/preview",
    descripcion: "Recomendaciones de cátedras y régimen legal del suelo agrario para Derecho Agrario.",
    fechaActualizacion: "Agosto 2026"
  },
  // FILOSOFÍA DEL DERECHO (10147)
  "10147": {
    materiaId: "10147",
    driveViewUrl: "https://drive.google.com/file/d/124WQMEBz8luJB3aJj47Qd0ep6404ZSIo/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/124WQMEBz8luJB3aJj47Qd0ep6404ZSIo/preview",
    descripcion: "Guía de autores, corrientes filosóficas y estrategia de cursada para Filosofía del Derecho.",
    fechaActualizacion: "Agosto 2026"
  },

  // ══════════════════════════════════════════════════════
  // QUINTO AÑO
  // ══════════════════════════════════════════════════════

  // DERECHO ADMINISTRATIVO II (10151)
  "10151": {
    materiaId: "10151",
    driveViewUrl: "https://drive.google.com/file/d/1m5BSOFKRtfAn-RaKCQt9-jp1GiatCzPk/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1m5BSOFKRtfAn-RaKCQt9-jp1GiatCzPk/preview",
    descripcion: "Recomendaciones de cátedras, control de legalidad y contencioso-administrativo para Derecho Administrativo II.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO DE FAMILIA (10653)
  "10653": {
    materiaId: "10653",
    driveViewUrl: "https://drive.google.com/file/d/18HOe_4lxfRZkVWchgGa43qpeBQGn22FG/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/18HOe_4lxfRZkVWchgGa43qpeBQGn22FG/preview",
    descripcion: "Guía de cursada, autores y legislación actualizada para Derecho de Familia.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO DE LA NAVEGACIÓN (10152)
  "10152": {
    materiaId: "10152",
    driveViewUrl: "https://drive.google.com/file/d/1kTXpj_7eF-2PtexG_R5HaNLSDkk8MiwX/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1kTXpj_7eF-2PtexG_R5HaNLSDkk8MiwX/preview",
    descripcion: "Recomendaciones de cursada, régimen de navegación y estrategia de exámenes para Derecho de la Navegación.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO COLECTIVO DEL TRABAJO Y SEG. SOCIAL (10650)
  "10650": {
    materiaId: "10650",
    driveViewUrl: "https://drive.google.com/file/d/1NLH62wu3d7QiD3AdNMeSv55iE4eN1YUC/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1NLH62wu3d7QiD3AdNMeSv55iE4eN1YUC/preview",
    descripcion: "Guía de cursada y legislación laboral colectiva para Derecho Colectivo del Trabajo y Seguridad Social.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO DE MINERÍA Y ENERGÍA (10154)
  "10154": {
    materiaId: "10154",
    driveViewUrl: "https://drive.google.com/file/d/1xgHB45CFVoAVcB8I3XcItX1TQ4__-_M8/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1xgHB45CFVoAVcB8I3XcItX1TQ4__-_M8/preview",
    descripcion: "Recomendaciones de cátedras y régimen minero-energético para Derecho de Minería y Energía.",
    fechaActualizacion: "Agosto 2026"
  },
  // SOCIOLOGÍA JURÍDICA (10155)
  "10155": {
    materiaId: "10155",
    driveViewUrl: "https://drive.google.com/file/d/1YGwuAxEBIdeLft4jcHDKMbcfQurO8g2e/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1YGwuAxEBIdeLft4jcHDKMbcfQurO8g2e/preview",
    descripcion: "Guía de autores, corrientes sociológicas y estrategia de cursada para Sociología Jurídica.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO INTERNACIONAL PRIVADO (10156)
  "10156": {
    materiaId: "10156",
    driveViewUrl: "https://drive.google.com/file/d/1SP4bkn2Y2rSYkm1U2ZPxjo3HMFZObWdK/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1SP4bkn2Y2rSYkm1U2ZPxjo3HMFZObWdK/preview",
    descripcion: "Recomendaciones de cursada, conflictos de leyes y metodología para Derecho Internacional Privado.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO NOTARIAL Y REGISTRAL (10157)
  "10157": {
    materiaId: "10157",
    driveViewUrl: "https://drive.google.com/file/d/1csYd1svJi5EE8JRTLDL0mkiVFRajiJqF/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1csYd1svJi5EE8JRTLDL0mkiVFRajiJqF/preview",
    descripcion: "Guía de cursada, función notarial y registros para Derecho Notarial y Registral.",
    fechaActualizacion: "Agosto 2026"
  },
  // FINANZAS Y DERECHO FINANCIERO (10158)
  "10158": {
    materiaId: "10158",
    driveViewUrl: "https://drive.google.com/file/d/1D_pr4VgwzKT_HmzqlVF8y-DZGqGCggLU/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/1D_pr4VgwzKT_HmzqlVF8y-DZGqGCggLU/preview",
    descripcion: "Recomendaciones de cursada, presupuesto y tributación para Finanzas y Derecho Financiero.",
    fechaActualizacion: "Agosto 2026"
  },
  // DERECHO DE LAS SUCESIONES (10659)
  "10659": {
    materiaId: "10659",
    driveViewUrl: "https://drive.google.com/file/d/16NFp7qwk-es7SuyMwBpLzqKrhhDUUxBs/view?usp=drive_link",
    drivePreviewUrl: "https://drive.google.com/file/d/16NFp7qwk-es7SuyMwBpLzqKrhhDUUxBs/preview",
    descripcion: "Guía de cursada y autores para Derecho de las Sucesiones: testamentos, intestada y proceso sucesorio.",
    fechaActualizacion: "Agosto 2026"
  }
};

// Secciones del menú: -1 = Ingresantes, 1..5 = Años 1 a 5
const NOM_SECCIONES: Record<number, string> = {
  [-1]: "INGRESANTES (Primer Año)",
  1: "Primer Año (1º Año)",
  2: "Segundo Año (2º Año)",
  3: "Tercer Año (3º Año)",
  4: "Cuarto Año (4º Año)",
  5: "Quinto Año (5º Año)"
};

export default function Recomendaciones() {
  const [selectedAnio, setSelectedAnio] = useState<number>(0); // 0 = Todas las secciones
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSecciones, setExpandedSecciones] = useState<Record<number, boolean>>({
    [-1]: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  // Modal para previsualización de PDF incorporado
  const [activePdfModal, setActivePdfModal] = useState<{
    materiaNombre: string;
    materiaCodigo: string;
    rec: RecomendacionData;
  } | null>(null);

  const toggleSeccion = (sec: number) => {
    setExpandedSecciones(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Filtrar materias por sección (Ingresantes vs Años 1 a 5)
  const materiasPorSeccion = useMemo(() => {
    const queryLower = searchQuery.toLowerCase().trim();

    const agrupadas: Record<number, { materia: Materia; rec?: RecomendacionData }[]> = {
      [-1]: [], 1: [], 2: [], 3: [], 4: [], 5: []
    };

    MATERIAS_PLAN6.forEach(materia => {
      const rec = RECOMENDACIONES_MAP[materia.id];
      const matchesSearch = 
        !queryLower ||
        materia.nombre.toLowerCase().includes(queryLower) ||
        materia.nombreCorto.toLowerCase().includes(queryLower) ||
        materia.id.includes(queryLower);

      if (matchesSearch) {
        // Las materias de 1º año se muestran tanto en INGRESANTES como en 1º Año.
        // Todos los años muestran su rec si existe en RECOMENDACIONES_MAP.
        if (materia.anio === 1) {
          agrupadas[-1].push({ materia, rec });
          agrupadas[1].push({ materia, rec });
        } else {
          agrupadas[materia.anio].push({ materia, rec });
        }
      }
    });

    return agrupadas;
  }, [searchQuery]);

  const totalActivas = useMemo(() => {
    return Object.keys(RECOMENDACIONES_MAP).length;
  }, []);

  return (
    <div className="min-h-screen bg-[#050B14] text-white py-8 md:py-14 px-4 md:px-8 relative overflow-hidden">
      {/* Luces decorativas de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 md:space-y-12">
        
        {/* HEADER DE LA SECCIÓN */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
            <BookmarkCheck className="w-4 h-4 text-red-400" />
            <span>Guía Académica DND Jursoc • UNLP</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-red-400 bg-clip-text text-transparent">
            Recomendaciones de Materias
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          </p>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS (INGRESANTES + AÑOS 1 A 5) */}
        <div className="bg-[#0D1527]/90 border border-white/15 rounded-3xl p-4 md:p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Campo de búsqueda */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por materia o código (ej: Romano, 10111)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 font-medium text-xs md:text-sm focus:outline-none focus:border-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selector de categorías: Ingresantes, 1º a 5º Año */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedAnio(0)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0",
                  selectedAnio === 0
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                )}
              >
                Todas las Materias
              </button>

              {/* Botón Destacado de INGRESANTES */}
              <button
                onClick={() => setSelectedAnio(-1)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 border",
                  selectedAnio === -1
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                )}
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>INGRESANTES</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="4 PDFs Disponibles" />
              </button>

              {/* Años 1 a 5 */}
              {[1, 2, 3, 4, 5].map(anio => (
                <button
                  key={anio}
                  onClick={() => setSelectedAnio(anio)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1",
                    selectedAnio === anio
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  )}
                >
                  <span>{anio}º Año</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* LISTADO DE SECCIONES (INGRESANTES + AÑOS 1 A 5) */}
        <div className="space-y-6">
          {[-1, 1, 2, 3, 4, 5].map(sec => {
            if (selectedAnio !== 0 && selectedAnio !== sec) return null;

            const materias = materiasPorSeccion[sec] || [];
            if (materias.length === 0 && searchQuery) return null;

            const isExpanded = expandedSecciones[sec] || !!searchQuery;
            const activasSeccion = materias.filter(m => m.rec).length;
            const isIngresantes = sec === -1;

            return (
              <motion.div
                key={sec}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl transition-colors",
                  isIngresantes 
                    ? "bg-gradient-to-b from-[#0A1C3D] via-[#0D1527] to-[#07101E] border-emerald-500/40" 
                    : "bg-[#0D1527]/90 border-white/15"
                )}
              >
                {/* CABECERA DE LA SECCIÓN (DESPLEGABLE) */}
                <button
                  onClick={() => toggleSeccion(sec)}
                  className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 font-serif font-bold text-lg",
                      isIngresantes 
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-gradient-to-br from-red-500/20 to-indigo-500/20 border-white/10 text-red-400"
                    )}>
                      {isIngresantes ? <Sprout className="w-6 h-6 text-emerald-400" /> : `${sec}º`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg md:text-xl font-black text-white">{NOM_SECCIONES[sec]}</h3>
                        {isIngresantes && (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {materias.length} materias del Plan Nº 6
                        {activasSeccion > 0 && (
                          <span className="text-emerald-400 font-bold ml-2">
                            • {activasSeccion} recomendación{activasSeccion !== 1 ? "es" : ""} disponible{activasSeccion !== 1 ? "s" : ""} (PDF)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activasSeccion > 0 ? (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        PDFs Disponibles
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 text-slate-400 border border-white/10 font-mono">
                        Próximamente
                      </span>
                    )}

                    <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* CONTENIDO DESPLEGABLE CON LAS MATERIAS */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 p-4 md:p-6 space-y-4 bg-slate-950/60"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materias.map(({ materia, rec }) => (
                          <div
                            key={`${sec}-${materia.id}`}
                            className={cn(
                              "p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group",
                              rec
                                ? "bg-gradient-to-b from-[#0A1C3D] to-[#071329] border-emerald-500/40 hover:border-emerald-500 shadow-lg shadow-emerald-500/5"
                                : "bg-slate-900/50 border-white/10 hover:border-white/20 opacity-80"
                            )}
                          >
                            <div className="space-y-3">
                              {/* Header de la materia */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-slate-300 font-mono border border-white/10">
                                      CÓD. {materia.id}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                      {materia.duracion} • {materia.horas}hs
                                    </span>
                                  </div>
                                  <h4 className="text-base md:text-lg font-black text-white group-hover:text-red-400 transition-colors">
                                    {materia.nombre}
                                  </h4>
                                </div>

                                {rec ? (
                                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono shrink-0 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Activa</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-white/5 text-slate-400 border border-white/10 font-mono shrink-0">
                                    En preparación
                                  </span>
                                )}
                              </div>

                              {/* Descripción o estado */}
                              {rec ? (
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {rec.descripcion}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-500 italic">
                                  Actualmente no hay recomendaciones cargadas para esta materia. ¡El equipo de DND está preparando el material!
                                </p>
                              )}
                            </div>

                            {/* Botones de acción */}
                            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                              {rec ? (
                                <>
                                  <button
                                    onClick={() => setActivePdfModal({
                                      materiaNombre: materia.nombre,
                                      materiaCodigo: materia.id,
                                      rec
                                    })}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#C41E24] hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all min-w-[140px]"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>Ver PDF Recomendación</span>
                                  </button>

                                  <a
                                    href={rec.driveViewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Abrir en Google Drive"
                                  >
                                    <ExternalLink className="w-4 h-4 text-blue-400" />
                                    <span className="hidden sm:inline">Drive</span>
                                  </a>
                                </>
                              ) : (
                                <div className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Próximamente</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* MODAL DE VISUALIZACIÓN DE PDF DE RECOMENDACIÓN */}
      <AnimatePresence>
        {activePdfModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-5xl w-full bg-[#0D1527] border border-white/20 rounded-3xl p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl relative"
            >
              {/* Encabezado del visor */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/20 text-red-300 font-mono border border-red-500/30">
                        CÓD. {activePdfModal.materiaCodigo}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Documento Oficial DND
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white">
                      Recomendaciones: {activePdfModal.materiaNombre}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActivePdfModal(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Visor Iframe de Google Drive */}
              <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-white/10 overflow-hidden min-h-[500px]">
                <iframe
                  src={activePdfModal.rec.drivePreviewUrl}
                  className="w-full h-full min-h-[500px] border-0"
                  allow="autoplay"
                  title={`Recomendaciones ${activePdfModal.materiaNombre}`}
                />
              </div>

              {/* Footer con opciones de descarga y cierre */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 shrink-0 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  {activePdfModal.rec.descripcion}
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={activePdfModal.rec.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>Abrir en Drive</span>
                  </a>

                  <button
                    onClick={() => setActivePdfModal(null)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
