export type MaterialFileType = "pdf" | "word";

export interface MaterialFile {
  id: string;
  kind: "file";
  name: string;
  subject: string;
  unit: string;
  fileType: MaterialFileType;
  actionLabel: "Descargar" | "Ver";
  externalUrl: string;
}

export interface MaterialFolder {
  id: string;
  kind: "folder";
  name: string;
  children: MaterialNode[];
}

export type MaterialNode = MaterialFolder | MaterialFile;

const DRIVE_PLACEHOLDER_URL = "https://drive.google.com/drive/folders/1wNSxLX3w0ArXhxhvPa1iaqkZrj2mxJUF";

const mkSubject = (id: string, name: string): MaterialFile => ({
  id,
  kind: "file",
  name,
  subject: name,
  unit: "Repositorio completo",
  fileType: "pdf",
  actionLabel: "Ver",
  externalUrl: DRIVE_PLACEHOLDER_URL,
});

// Reemplaza cada `externalUrl` por el link puntual de cada materia en Drive.
export const studyMaterialsTree: MaterialFolder = {
  id: "root",
  kind: "folder",
  name: "Material de Estudio",
  children: [
    {
      id: "anio-1",
      kind: "folder",
      name: "1er Año",
      children: [
        mkSubject("anio-1-intro", "Introduccion al Derecho"),
        mkSubject("anio-1-romano", "Derecho Romano"),
        mkSubject("anio-1-politico", "Derecho Politico"),
        mkSubject("anio-1-sociologia", "Sociologia Juridica"),
        mkSubject("anio-1-civil-1", "Derecho Civil I (Parte General)"),
      ],
    },
    {
      id: "anio-2",
      kind: "folder",
      name: "2do Año",
      children: [
        mkSubject("anio-2-constitucional-1", "Derecho Constitucional I"),
        mkSubject("anio-2-penal-1", "Derecho Penal I (Parte General)"),
        mkSubject("anio-2-civil-2", "Derecho Civil II (Obligaciones)"),
        mkSubject("anio-2-constitucional-2", "Derecho Constitucional II"),
        mkSubject("anio-2-penal-2", "Derecho Penal II (Parte Especial)"),
      ],
    },
    {
      id: "anio-3",
      kind: "folder",
      name: "3er Año",
      children: [
        mkSubject("anio-3-civil-3", "Derecho Civil III (Contratos)"),
        mkSubject("anio-3-procesal-1", "Derecho Procesal I"),
        mkSubject("anio-3-int-publico", "Derecho Internacional Publico"),
        mkSubject("anio-3-civil-4", "Derecho Civil IV (Derechos Reales)"),
        mkSubject("anio-3-comercial-1", "Derecho Comercial I"),
      ],
    },
    {
      id: "anio-4",
      kind: "folder",
      name: "4to Año",
      children: [
        mkSubject("anio-4-admin-1", "Derecho Administrativo I"),
        mkSubject("anio-4-procesal-2", "Derecho Procesal II"),
        mkSubject("anio-4-civil-5", "Derecho Civil V (Familia y Sucesiones)"),
        mkSubject("anio-4-comercial-2", "Derecho Comercial II (Sociedades)"),
        mkSubject("anio-4-admin-2", "Derecho Administrativo II"),
      ],
    },
    {
      id: "anio-5",
      kind: "folder",
      name: "5to Año",
      children: [
        mkSubject("anio-5-trabajo", "Derecho del Trabajo y la Seguridad Social"),
        mkSubject("anio-5-navegacion", "Derecho de la Navegacion y el Transporte"),
        mkSubject("anio-5-mineria", "Derecho de Mineria y Energia"),
        mkSubject("anio-5-agrario", "Derecho Agrario y Ambiental"),
        mkSubject("anio-5-tributario", "Finanzas y Derecho Tributario"),
      ],
    },
    {
      id: "anio-6",
      kind: "folder",
      name: "6to Año",
      children: [
        mkSubject("anio-6-int-privado", "Derecho Internacional Privado"),
        mkSubject("anio-6-filosofia", "Filosofia del Derecho"),
        mkSubject("anio-6-practica-1", "Practica Profesional I"),
        mkSubject("anio-6-practica-2", "Practica Profesional II"),
        mkSubject("anio-6-seminarios", "Seminarios y Optativas"),
      ],
    },
  ],
};
