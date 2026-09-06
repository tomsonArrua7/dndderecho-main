import { describe, it, expect } from "vitest";
import {
  RAMAS_JURIDICAS,
  CICLO_RAMAS,
  ANCLA_CICLO_RAMAS,
  getRamaDeLaSemana,
  getProximaRotacion,
  sortearRamasDuelo,
  seleccionarPreguntasDuelo,
  getPoolDeRama,
  getRamaDeMateria
} from "@/data/ramasTrivia";
import { BANCO_PREGUNTAS } from "@/data/bancoPreguntas.generated";
import { cargarBancoPreguntas } from "@/data/triviaData";

const SEMANA = 7 * 24 * 60 * 60 * 1000;
const enSemana = (n: number) => ANCLA_CICLO_RAMAS + n * SEMANA + 60_000;

describe("ciclo semanal de ramas", () => {
  it("el ancla del ciclo cae un jueves a las 19:00 de Argentina", () => {
    const d = new Date(ANCLA_CICLO_RAMAS);
    const enBsAs = new Date(d.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    expect(enBsAs.getDay()).toBe(4);
    expect(enBsAs.getHours()).toBe(19);
  });

  it("arranca en Constitucional y recorre las 5 ramas sin repetir", () => {
    const recorrido = Array.from({ length: CICLO_RAMAS.length }, (_, i) => getRamaDeLaSemana(enSemana(i)).id);
    expect(recorrido[0]).toBe("constitucional");
    expect(new Set(recorrido).size).toBe(RAMAS_JURIDICAS.length);
  });

  it("vuelve al inicio después de un ciclo completo", () => {
    expect(getRamaDeLaSemana(enSemana(5)).id).toBe(getRamaDeLaSemana(enSemana(0)).id);
    expect(getRamaDeLaSemana(enSemana(12)).id).toBe(getRamaDeLaSemana(enSemana(2)).id);
  });

  it("la próxima rotación siempre cae dentro de la semana siguiente", () => {
    const ahora = enSemana(3);
    const prox = getProximaRotacion(ahora);
    expect(prox).toBeGreaterThan(ahora);
    expect(prox - ahora).toBeLessThanOrEqual(SEMANA);
    expect((prox - ANCLA_CICLO_RAMAS) % SEMANA).toBe(0);
  });
});

describe("sorteo de duelo", () => {
  it("siempre incluye la rama de la semana y una segunda distinta", () => {
    const ahora = enSemana(1);
    for (let i = 0; i < 50; i++) {
      const [fija, azar] = sortearRamasDuelo(ahora);
      expect(fija).toBe(getRamaDeLaSemana(ahora).id);
      expect(azar).not.toBe(fija);
      expect(CICLO_RAMAS).toContain(azar);
    }
  });

  it("con el tiempo reparte todas las segundas ramas posibles", () => {
    const ahora = enSemana(0);
    const vistas = new Set(Array.from({ length: 200 }, () => sortearRamasDuelo(ahora)[1]));
    expect(vistas.size).toBe(CICLO_RAMAS.length - 1);
  });
});

describe("selección de preguntas del duelo", () => {
  it("devuelve 5 preguntas distintas", () => {
    for (const rama of CICLO_RAMAS) {
      const otra = CICLO_RAMAS.find(r => r !== rama)!;
      const elegidas = seleccionarPreguntasDuelo(rama, otra, BANCO_PREGUNTAS, 5);
      expect(elegidas).toHaveLength(5);
      expect(new Set(elegidas.map(q => q.id)).size).toBe(5);
    }
  });

  it("todas las preguntas salen de las dos ramas sorteadas", () => {
    const elegidas = seleccionarPreguntasDuelo("penal", "privado", BANCO_PREGUNTAS, 5);
    for (const q of elegidas) {
      expect(["penal", "privado"]).toContain(getRamaDeMateria(q.id_categoria)?.id);
    }
  });

  it("da mayoría a la rama fija de la semana", () => {
    const elegidas = seleccionarPreguntasDuelo("privado", "penal", BANCO_PREGUNTAS, 5);
    const deFija = elegidas.filter(q => getRamaDeMateria(q.id_categoria)?.id === "privado").length;
    expect(deFija).toBeGreaterThanOrEqual(3);
  });
});

describe("cobertura del banco importado", () => {
  it("no tiene ids repetidos", () => {
    expect(new Set(BANCO_PREGUNTAS.map(q => q.id)).size).toBe(BANCO_PREGUNTAS.length);
  });

  it("toda pregunta tiene 4 opciones y un índice válido", () => {
    for (const q of BANCO_PREGUNTAS) {
      expect(q.opciones).toHaveLength(4);
      expect(q.respuesta_correcta_index).toBeGreaterThanOrEqual(0);
      expect(q.respuesta_correcta_index).toBeLessThanOrEqual(3);
      expect(q.fundamento_juridico.length).toBeGreaterThan(4);
    }
  });

  it("cada rama tiene pool suficiente para no repetir duelos", () => {
    for (const rama of RAMAS_JURIDICAS) {
      expect(getPoolDeRama(rama.id, BANCO_PREGUNTAS).length).toBeGreaterThanOrEqual(50);
    }
  });
});

describe("carga diferida del banco", () => {
  it("devuelve el banco completo y reutiliza la misma instancia", async () => {
    const primera = await cargarBancoPreguntas();
    const segunda = await cargarBancoPreguntas();
    expect(primera.length).toBe(BANCO_PREGUNTAS.length);
    expect(segunda).toBe(primera);
  });
});
