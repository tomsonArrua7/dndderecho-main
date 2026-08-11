import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ExternalLink, Eye, X, FolderOpen, ClipboardList, FileEdit,
  BookMarked, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────────────────────
interface Documento {
  id: string;
  nombre: string;
  tipo: "pdf" | "doc";
  viewUrl: string;
  previewUrl?: string;
  descripcion?: string;
}

interface Seccion {
  id: string;
  titulo: string;
  subtitulo: string;
  icono: React.ElementType;
  color: "blue" | "violet" | "amber";
  documentos: Documento[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Datos
// ──────────────────────────────────────────────────────────────────────────────
const SECCIONES: Seccion[] = [
  {
    id: "documentacion-oficial",
    titulo: "Documentación Oficial",
    subtitulo: "Resoluciones y planes de estudio vigentes",
    icono: BookMarked,
    color: "blue",
    documentos: [
      {
        id: "digesto-plan5",
        nombre: "Digesto Normativo — Plan 5",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1dmYNP_GJTRCIuXU2-UGVZrYK4NbPAZZI/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1dmYNP_GJTRCIuXU2-UGVZrYK4NbPAZZI/preview",
        descripcion: "Digesto normativo completo del Plan de Estudios Nº 5 de la Facultad.",
      },
      {
        id: "plan6-doc",
        nombre: "Plan de Estudios Nº 6",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1kKIbKfihqUhxYXhksTwBc69wgMD8LL5r/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1kKIbKfihqUhxYXhksTwBc69wgMD8LL5r/preview",
        descripcion: "Plan de Estudios vigente (2019) de la carrera de Abogacía — FCJyS UNLP.",
      },
      {
        id: "regimen-ens",
        nombre: "Régimen de Enseñanza y Acreditación",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1kKIbKfihqUhxYXhksTwBc69wgMD8LL5r/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1kKIbKfihqUhxYXhksTwBc69wgMD8LL5r/preview",
        descripcion: "Resolución sobre el régimen de enseñanza y acreditación de la Facultad.",
      },
    ],
  },
  {
    id: "formularios-oficiales",
    titulo: "Formularios Oficiales",
    subtitulo: "Formularios descargables para trámites de la Facultad",
    icono: ClipboardList,
    color: "violet",
    documentos: [
      {
        id: "ddjj-informal",
        nombre: "DDJJ Trabajador Informal",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/13iscE5-jDlTGt5-FI2hiPVnsjxmgPDfD/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/13iscE5-jDlTGt5-FI2hiPVnsjxmgPDfD/preview",
        descripcion: "Declaración jurada para trabajadores informales.",
      },
      {
        id: "doc-trabajador",
        nombre: "Documentación Trabajador / Madre / Padre",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1TeqaWizA9CTT9b5GW8Kpt97IlFwfeSMa/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1TeqaWizA9CTT9b5GW8Kpt97IlFwfeSMa/preview",
        descripcion: "Documentación requerida para trabajadores, madres y padres.",
      },
      {
        id: "beca-ayuda",
        nombre: "Beca Ayuda Económica",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1aU5HHkQf0_1m2Moneq097EQOJyEJQCMX/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1aU5HHkQf0_1m2Moneq097EQOJyEJQCMX/preview",
        descripcion: "Formulario de solicitud de becas de ayuda económica.",
      },
      {
        id: "cert-inscripcion",
        nombre: "Certificado de Inscripción a la Carrera",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1h5Dz6Y88rAC7FLDii5KF-4GUzNt8P3kP/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1h5Dz6Y88rAC7FLDii5KF-4GUzNt8P3kP/preview",
        descripcion: "Certificado oficial de inscripción a la carrera de Abogacía.",
      },
      {
        id: "cert-regular",
        nombre: "Certificado de Alumno Regular",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/18SVsC4PeYRdub8QgcR_8uBu8boOtt0Yi/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/18SVsC4PeYRdub8QgcR_8uBu8boOtt0Yi/preview",
        descripcion: "Certificado de condición de alumno regular.",
      },
      {
        id: "sol-permuta",
        nombre: "Solicitud de Permuta",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/16fRWWGvShepYJVr9yyY3xjC1Wjkk5K3d1ad1JJ5VWQw/edit?usp=drive_link",
        descripcion: "Formulario de solicitud de permuta de comisiones.",
      },
      {
        id: "cert-examen",
        nombre: "Certificado de Examen",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/12MeODGcTXtWkqKSkb9W8iEuNXdvChBJ0/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/12MeODGcTXtWkqKSkb9W8iEuNXdvChBJ0/preview",
        descripcion: "Certificado de examen rendido.",
      },
      {
        id: "f06",
        nombre: "F06 — Cursada / Promoción",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F06 — Solicitud de cursada y promoción.",
      },
      {
        id: "f07",
        nombre: "F07 — Justificación de Inasistencias",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F07 — Justificación de inasistencias.",
      },
      {
        id: "f08",
        nombre: "F08 — Trámite de Título",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F08 — Inicio de trámite de título.",
      },
      {
        id: "f09",
        nombre: "F09 — Comprobante Cancelación de Matrícula",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F09 — Comprobante de cancelación de matrícula.",
      },
      {
        id: "f10",
        nombre: "F10 — Certificado Alumno Regular Notarial",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F10 — Certificado de alumno regular para uso notarial.",
      },
      {
        id: "f11",
        nombre: "F11 — Certificado Alumno Regular",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F11 — Certificado de alumno regular.",
      },
      {
        id: "f17",
        nombre: "F17 — Solicitud Pase a Otra Universidad",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1p-lJzEmgwiJOB8Wk8qwKFtx40wiSKG_5/preview",
        descripcion: "Formulario F17 — Solicitud de pase a otra universidad.",
      },
      {
        id: "f18",
        nombre: "F18 — Solicitud Pase a Otra Facultad",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1hexwhv6fdu8agXh6XUfvbeB741Q_JdjB/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1hexwhv6fdu8agXh6XUfvbeB741Q_JdjB/preview",
        descripcion: "Formulario F18 — Solicitud de pase a otra facultad de la UNLP.",
      },
      {
        id: "f19",
        nombre: "F19 — Reconocimiento de Materias",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1smaIEQy5Chu0JPThTwngovhMdH3szgC5/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1smaIEQy5Chu0JPThTwngovhMdH3szgC5/preview",
        descripcion: "Formulario F19 — Reconocimiento y equivalencia de materias.",
      },
      {
        id: "f20",
        nombre: "F20 — Comprobante Inicio Trámite Título",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/15taT6xMolhJYjFyYWbKLmyVb05lxnqxz/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/15taT6xMolhJYjFyYWbKLmyVb05lxnqxz/preview",
        descripcion: "Formulario F20 — Comprobante de inicio de trámite de título.",
      },
      {
        id: "f24",
        nombre: "F24 — RES. 402",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/16x8dNJRAS2epc_E6N-9m3AMpUkAPP5LW/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/16x8dNJRAS2epc_E6N-9m3AMpUkAPP5LW/preview",
        descripcion: "Formulario F24 — Resolución 402.",
      },
      {
        id: "otras-facultades",
        nombre: "Materias de Otras Facultades",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/1DA3wRT2mS_J3D5WnPhLnuoeLmtRNKN09/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/1DA3wRT2mS_J3D5WnPhLnuoeLmtRNKN09/preview",
        descripcion: "Formulario para solicitar materias de otras facultades.",
      },
      {
        id: "cambio-plan",
        nombre: "Solicitud Cambio de Plan",
        tipo: "pdf",
        viewUrl: "https://drive.google.com/file/d/12GIoNNT3h9N5WrKrhon_ZDVVAipXOHGS/view?usp=drive_link",
        previewUrl: "https://drive.google.com/file/d/12GIoNNT3h9N5WrKrhon_ZDVVAipXOHGS/preview",
        descripcion: "Solicitud oficial para cambio de plan de estudios.",
      },
    ],
  },
  {
    id: "notas-modelo",
    titulo: "Notas Modelo",
    subtitulo: "Modelos editables para trámites y solicitudes",
    icono: FileEdit,
    color: "amber",
    documentos: [
      {
        id: "nota-laboral",
        nombre: "Cambio por Horario Laboral Sobreviniente",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/18XK018pP9L5azff6r5sCFL27BiWqrpsq/edit?usp=drive_link",
        descripcion: "Nota modelo para solicitar cambio de comisión por horario laboral sobreviniente.",
      },
      {
        id: "ddjj-pasantia",
        nombre: "DDJJ Pasantía Rentada",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/1XShe2B2t7kJygChReREBccJEA2Gj1b9c/edit?usp=drive_link",
        descripcion: "Declaración jurada de pasantía rentada.",
      },
      {
        id: "inscripcion-mesa",
        nombre: "Inscripción a Mesa Fuera de Término",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/1C6kjWliIYIK-QD_czBfvDG5dLyUWruui/edit?usp=drive_link",
        descripcion: "Nota para solicitar inscripción a mesa de examen fuera de término.",
      },
      {
        id: "incorporacion-orientacion",
        nombre: "Nota de Incorporación — Orientación",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/11QYKrEg5rZYcNQv4Buy1q0LagnS0xz4Q/edit?usp=drive_link",
        descripcion: "Nota modelo para solicitar incorporación a una orientación.",
      },
      {
        id: "incorporacion-preeva",
        nombre: "Nota de Incorporación — Pre-evaluación",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/1ExF6qhQt35nM-FVF03UHOX2TyYfSvcKa/edit?usp=drive_link",
        descripcion: "Nota modelo para solicitar incorporación a instancia de pre-evaluación.",
      },
      {
        id: "nota-empleador",
        nombre: "Nota del Empleador",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/1ezB1RwrPP38vnEmqmA9LJleW85XaEZWt/edit?usp=drive_link",
        descripcion: "Modelo de nota del empleador para justificar situación laboral.",
      },
      {
        id: "incorporacion-fuera",
        nombre: "Nota de Incorporación Fuera de Término",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/1GIT58LnO4KYf30QqEVCfxUBISCzqEKW3Eo4WGnajiPY/edit?usp=drive_link",
        descripcion: "Nota para solicitar incorporación a cursada fuera de término.",
      },
      {
        id: "renuncia-fuera",
        nombre: "Renuncia Fuera de Término",
        tipo: "doc",
        viewUrl: "https://docs.google.com/document/d/12uPUoLG8wwAjyChsiOv3Pv_XUh6Gda1VPd_U6wdkQiw/edit?usp=drive_link",
        descripcion: "Nota modelo para renuncia a cursada fuera de término.",
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Colores por sección
// ──────────────────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  blue: {
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    icon: "text-blue-400",
    header: "text-blue-300",
    card: "bg-gradient-to-b from-[#0a1633] to-[#071020] border-blue-500/30 hover:border-blue-400",
    btn: "from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500",
    glow: "bg-blue-600/8",
  },
  violet: {
    badge: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    icon: "text-violet-400",
    header: "text-violet-300",
    card: "bg-gradient-to-b from-[#120a33] to-[#0a0720] border-violet-500/30 hover:border-violet-400",
    btn: "from-violet-700 to-violet-600 hover:from-violet-600 hover:to-violet-500",
    glow: "bg-violet-600/8",
  },
  amber: {
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    icon: "text-amber-400",
    header: "text-amber-300",
    card: "bg-gradient-to-b from-[#1c1200] to-[#100b00] border-amber-500/30 hover:border-amber-400",
    btn: "from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500",
    glow: "bg-amber-600/8",
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────
export default function NotasFormularios() {
  const [activeModal, setActiveModal] = useState<{
    doc: Documento;
    seccion: Seccion;
  } | null>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "documentacion-oficial": true,
    "formularios-oficiales": true,
    "notas-modelo": true,
  });

  const toggleSection = (id: string) =>
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-[#050B14] text-white py-8 md:py-14 px-4 md:px-8 relative overflow-hidden">
      {/* Luces decorativas */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-amber-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 md:space-y-12">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
            <FolderOpen className="w-4 h-4" />
            <span>Documentación Académica · FCJyS UNLP</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            Notas y Formularios
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Accedé a toda la documentación oficial, formularios y notas modelo de la Facultad de Ciencias Jurídicas y Sociales de la UNLP.
          </p>
        </div>

        {/* SECCIONES */}
        <div className="space-y-6">
          {SECCIONES.map(seccion => {
            const col = COLOR_MAP[seccion.color];
            const Icon = seccion.icono;
            const isExpanded = expandedSections[seccion.id];

            return (
              <motion.div
                key={seccion.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0D1527]/90 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
              >
                {/* Cabecera desplegable */}
                <button
                  onClick={() => toggleSection(seccion.id)}
                  className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0", col.icon)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg md:text-xl font-black text-white">{seccion.titulo}</h3>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border font-mono", col.badge)}>
                          {seccion.documentos.length} documentos
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{seccion.subtitulo}</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Grid de documentos */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 p-4 md:p-6 bg-slate-950/60"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {seccion.documentos.map(doc => (
                          <div
                            key={doc.id}
                            className={cn(
                              "p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 relative overflow-hidden group shadow-lg",
                              col.card
                            )}
                          >
                            {/* Glow de fondo */}
                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", col.glow)} />

                            <div className="relative z-10 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {doc.tipo === "pdf"
                                    ? <FileText className={cn("w-4 h-4 shrink-0 mt-0.5", col.icon)} />
                                    : <FileEdit className={cn("w-4 h-4 shrink-0 mt-0.5", col.icon)} />
                                  }
                                  <h4 className="text-sm font-bold text-white leading-tight group-hover:text-white transition-colors">
                                    {doc.nombre}
                                  </h4>
                                </div>
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border font-mono shrink-0",
                                  doc.tipo === "pdf"
                                    ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                                    : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                )}>
                                  {doc.tipo === "pdf" ? "PDF" : "DOC"}
                                </span>
                              </div>

                              {doc.descripcion && (
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {doc.descripcion}
                                </p>
                              )}
                            </div>

                            {/* Botones */}
                            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center gap-2">
                              {doc.tipo === "pdf" ? (
                                <>
                                  <button
                                    onClick={() => setActiveModal({ doc, seccion })}
                                    className={cn(
                                      "flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all min-w-0",
                                      col.btn
                                    )}
                                  >
                                    <Eye className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">Ver PDF</span>
                                  </button>
                                  <a
                                    href={doc.viewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all flex items-center justify-center cursor-pointer shrink-0"
                                    title="Abrir en Drive"
                                  >
                                    <ExternalLink className="w-4 h-4 text-blue-400" />
                                  </a>
                                </>
                              ) : (
                                <a
                                  href={doc.viewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all",
                                    col.btn
                                  )}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Abrir Documento</span>
                                </a>
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

      {/* MODAL VISOR PDF */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-5xl w-full bg-[#0D1527] border border-white/20 rounded-3xl p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl"
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-2xl bg-white/10 border border-white/10", COLOR_MAP[activeModal.seccion.color].icon)}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest", COLOR_MAP[activeModal.seccion.color].header)}>
                      {activeModal.seccion.titulo}
                    </p>
                    <h3 className="text-lg md:text-xl font-black text-white">
                      {activeModal.doc.nombre}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Iframe */}
              <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-white/10 overflow-hidden min-h-[500px]">
                <iframe
                  src={activeModal.doc.previewUrl}
                  className="w-full h-full min-h-[500px] border-0"
                  allow="autoplay"
                  title={activeModal.doc.nombre}
                />
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 shrink-0 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  {activeModal.doc.descripcion}
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={activeModal.doc.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    Abrir en Drive
                  </a>
                  <button
                    onClick={() => setActiveModal(null)}
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
