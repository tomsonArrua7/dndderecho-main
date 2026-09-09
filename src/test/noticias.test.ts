import { describe, it, expect } from "vitest";
import { slugify, tiempoDeLectura, copeteAutomatico, esOpinion, TAGS_NOTICIAS } from "@/lib/noticias";

describe("slugify", () => {
  it("saca tildes y ñ para que el slug sea ASCII", () => {
    expect(slugify("Notas de opinión sobre la Reforma")).toBe("notas-de-opinion-sobre-la-reforma");
    expect(slugify("El año que viene")).toBe("el-ano-que-viene");
  });

  it("colapsa símbolos y espacios en un solo guión, sin dejarlos en los bordes", () => {
    expect(slugify("  ¿Qué pasa con el plan?  ")).toBe("que-pasa-con-el-plan");
    expect(slugify("Civil III --- Apuntes 2026")).toBe("civil-iii-apuntes-2026");
  });

  it("devuelve cadena vacía cuando el título no tiene nada slugificable", () => {
    expect(slugify("¡!¿?")).toBe("");
  });
});

describe("tiempoDeLectura", () => {
  it("nunca baja de un minuto", () => {
    expect(tiempoDeLectura("")).toBe(1);
    expect(tiempoDeLectura("Tres palabras acá")).toBe(1);
  });

  it("redondea hacia arriba a 200 palabras por minuto", () => {
    expect(tiempoDeLectura(Array(200).fill("palabra").join(" "))).toBe(1);
    expect(tiempoDeLectura(Array(201).fill("palabra").join(" "))).toBe(2);
    // Una nota de tres carillas ronda las 1500 palabras
    expect(tiempoDeLectura(Array(1500).fill("palabra").join(" "))).toBe(8);
  });
});

describe("copeteAutomatico", () => {
  it("limpia la sintaxis de markdown más común", () => {
    const copete = copeteAutomatico("## Un título\n\nTexto con **negrita** y [un link](https://x.com).");
    expect(copete).toBe("Un título Texto con negrita y un link.");
  });

  it("no parte palabras al cortar y agrega elipsis", () => {
    const copete = copeteAutomatico("aaaa bbbb cccc dddd", 10);
    expect(copete).toBe("aaaa bbbb…");
  });

  it("deja el texto intacto si entra en el límite", () => {
    expect(copeteAutomatico("Corto y al pie", 200)).toBe("Corto y al pie");
  });
});

describe("esOpinion", () => {
  it("reconoce la categoría de notas de opinión", () => {
    expect(esOpinion("Notas de opinión")).toBe(true);
    expect(esOpinion("Novedades")).toBe(false);
  });

  it("la categoría está disponible en el panel de redacción", () => {
    expect(TAGS_NOTICIAS).toContain("Notas de opinión");
  });
});
