import { describe, it, expect } from "vitest";
import {
  RAMAS_JURIDICAS,
  CICLO_RAMAS,
  getRamaDeTemporada,
  getRamaSiguiente,
  sortearRamasDuelo,
  seleccionarPreguntasDuelo,
  getPoolDeRama,
  getRamaDeMateria
} from "@/data/ramasTrivia";
import { BANCO_PREGUNTAS } from "@/data/bancoPreguntas.generated";
import { cargarBancoPreguntas } from "@/data/triviaData";

describe("ciclo de ramas por temporada", () => {
  it("la temporada 1 juega Constitucional", () => {
    expect(getRamaDeTemporada(1).id).toBe("constitucional");
  });

  it("recorre las 5 ramas sin repetir a lo largo del ciclo", () => {
    const recorrido = Array.from({ length: CICLO_RAMAS.length }, (_, i) => getRamaDeTemporada(i + 1).id);
    expect(new Set(recorrido).size).toBe(RAMAS_JURIDICAS.length);
  });

  it("vuelve al inicio después de un ciclo completo", () => {
    expect(getRamaDeTemporada(6).id).toBe(getRamaDeTemporada(1).id);
    expect(getRamaDeTemporada(13).id).toBe(getRamaDeTemporada(3).id);
  });

  it("la rama siguiente es la de la temporada que viene", () => {
    for (let t = 1; t <= 7; t++) {
      expect(getRamaSiguiente(t).id).toBe(getRamaDeTemporada(t + 1).id);
      expect(getRamaSiguiente(t).id).not.toBe(getRamaDeTemporada(t).id);
    }
  });
});

describe("sorteo de duelo", () => {
  it("siempre incluye la rama de la temporada y una segunda distinta", () => {
    for (let i = 0; i < 50; i++) {
      const [fija, azar] = sortearRamasDuelo(2);
      expect(fija).toBe(getRamaDeTemporada(2).id);
      expect(azar).not.toBe(fija);
      expect(CICLO_RAMAS).toContain(azar);
    }
  });

  it("con el tiempo reparte todas las segundas ramas posibles", () => {
    const vistas = new Set(Array.from({ length: 200 }, () => sortearRamasDuelo(1)[1]));
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

  it("no repite preguntas que el jugador ya vio mientras queden nuevas", () => {
    const poolPenal = getPoolDeRama("penal", BANCO_PREGUNTAS);
    // Todas las de Penal menos cinco quedan marcadas como ya vistas.
    const vistas = new Set(poolPenal.slice(5).map(q => q.id));

    for (let i = 0; i < 20; i++) {
      const elegidas = seleccionarPreguntasDuelo("penal", "privado", BANCO_PREGUNTAS, 5, vistas);
      const dePenal = elegidas.filter(q => getRamaDeMateria(q.id_categoria)?.id === "penal");
      for (const q of dePenal) expect(vistas.has(q.id)).toBe(false);
    }
  });

  it("cae en repetidas sólo cuando se agotaron las nuevas de la rama", () => {
    const todasVistas = new Set(BANCO_PREGUNTAS.map(q => q.id));
    const elegidas = seleccionarPreguntasDuelo("penal", "privado", BANCO_PREGUNTAS, 5, todasVistas);
    // Sin preguntas nuevas disponibles igual tiene que armar el duelo completo.
    expect(elegidas).toHaveLength(5);
    expect(new Set(elegidas.map(q => q.id)).size).toBe(5);
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
