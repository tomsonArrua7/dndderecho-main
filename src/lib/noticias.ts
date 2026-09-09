export const TAGS_NOTICIAS = [
  "Novedades",
  "Cursada",
  "Asamblea",
  "Apuntes",
  "Institucional",
  "Notas de opinión",
] as const;

export type TagNoticia = (typeof TAGS_NOTICIAS)[number];

/** Las notas de opinión llevan tratamiento editorial propio (firma arriba, lectura angosta). */
export const TAG_OPINION = "Notas de opinión";

export const esOpinion = (tag: string) => tag === TAG_OPINION;

/** Mismo criterio que slugify_noticia() en la migración, para poder previsualizar la URL. */
export const slugify = (texto: string) => {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
};

/** ~200 palabras por minuto, redondeado hacia arriba con mínimo de 1. */
export const tiempoDeLectura = (contenido: string) => {
  const palabras = contenido.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palabras / 200));
};

/**
 * Copete de respaldo para las noticias que todavía no tienen uno cargado:
 * limpia el markdown más común y corta en el último espacio para no partir palabras.
 */
export const copeteAutomatico = (contenido: string, limite = 200) => {
  const plano = contenido
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plano.length <= limite) return plano;
  const cortado = plano.slice(0, limite);
  const ultimoEspacio = cortado.lastIndexOf(" ");
  return (ultimoEspacio > 0 ? cortado.slice(0, ultimoEspacio) : cortado) + "…";
};
