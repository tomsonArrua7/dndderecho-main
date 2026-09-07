import { describe, it, expect } from "vitest";
import { decidirNotificacionDuelo, EstadoPantalla } from "@/data/notificacionDuelo";
import { DueloTrivia } from "@/data/triviaData";

const YO = { userId: "u-yo", userName: "Tomás" };

/** Duelo mío, contra un rival, con el estado que se le indique. */
function duelo(id: string, over: Partial<DueloTrivia> = {}): DueloTrivia {
  return {
    id,
    esPublico: true,
    materiaId: "ramas",
    materiaNombre: "Derecho Constitucional + Primer Año",
    preguntasIds: ["q1", "q2", "q3", "q4", "q5"],
    player1Id: "u-yo",
    player1Nombre: "Tomás",
    player1Aciertos: 4,
    player1TiempoMs: 12000,
    player1Puntos: 400,
    player1Completed: true,
    player2Id: "u-rival",
    player2Nombre: "Rival",
    player2Aciertos: 3,
    player2TiempoMs: 15000,
    player2Puntos: 300,
    player2Completed: true,
    ganadorId: "u-yo",
    status: "finalizado",
    createdAt: "20:15",
    ...over
  } as DueloTrivia;
}

const LIBRE: EstadoPantalla = { partidaEnCurso: false, modalAbierto: null };
const JUGANDO: EstadoPantalla = { partidaEnCurso: true, modalAbierto: null };

describe("notificación de duelo mientras jugás otro", () => {
  it("con la pantalla libre, muestra el resultado", () => {
    const d = decidirNotificacionDuelo([duelo("DND-100")], [], LIBRE, YO);
    expect(d.accion).toBe("mostrar");
    if (d.accion === "mostrar") {
      expect(d.duelo.id).toBe("DND-100");
      expect(d.soyPlayer1).toBe(true);
    }
  });

  it("EL BUG REPORTADO: si estás respondiendo, no muestra nada y lo pospone", () => {
    const d = decidirNotificacionDuelo([duelo("DND-100")], [], JUGANDO, YO);
    expect(d.accion).toBe("posponer");
  });

  it("jugando y sin resultados nuevos, no hace nada", () => {
    const enCurso = duelo("DND-200", { status: "en_curso", player2Completed: false });
    const d = decidirNotificacionDuelo([enCurso], [], JUGANDO, YO);
    expect(d.accion).toBe("ninguna");
  });

  it("el duelo que estás jugando no se cuenta como resultado pendiente", () => {
    // Tu rival terminó, vos no: el duelo no está resuelto y no debe interrumpir.
    const miDueloEnCurso = duelo("DND-300", {
      status: "en_curso",
      player1Completed: false,
      player2Completed: true
    });
    expect(decidirNotificacionDuelo([miDueloEnCurso], [], JUGANDO, YO).accion).toBe("ninguna");
  });

  it("al liberarse la pantalla, el pospuesto sí aparece", () => {
    const duelos = [duelo("DND-100")];
    expect(decidirNotificacionDuelo(duelos, [], JUGANDO, YO).accion).toBe("posponer");
    expect(decidirNotificacionDuelo(duelos, [], LIBRE, YO).accion).toBe("mostrar");
  });
});

describe("resultados ya vistos y duelos ajenos", () => {
  it("un resultado ya visto no se vuelve a mostrar", () => {
    const d = decidirNotificacionDuelo([duelo("DND-100")], ["DND-100"], LIBRE, YO);
    expect(d.accion).toBe("ninguna");
  });

  it("un duelo de otras dos personas se ignora", () => {
    const ajeno = duelo("DND-900", {
      player1Id: "u-otro",
      player1Nombre: "Otro",
      player2Id: "u-tercero",
      player2Nombre: "Tercero"
    });
    expect(decidirNotificacionDuelo([ajeno], [], LIBRE, YO).accion).toBe("ninguna");
    expect(decidirNotificacionDuelo([ajeno], [], JUGANDO, YO).accion).toBe("ninguna");
  });

  it("reconoce el duelo cuando jugaste como player2", () => {
    const comoP2 = duelo("DND-400", {
      player1Id: "u-rival",
      player1Nombre: "Rival",
      player2Id: "u-yo",
      player2Nombre: "Tomás"
    });
    const d = decidirNotificacionDuelo([comoP2], [], LIBRE, YO);
    expect(d.accion).toBe("mostrar");
    if (d.accion === "mostrar") expect(d.soyPlayer1).toBe(false);
  });

  it("un duelo terminado por abandono también se notifica", () => {
    const abandonado = duelo("DND-500", { status: "finalizado", player2Completed: false, porAbandono: true });
    expect(decidirNotificacionDuelo([abandonado], [], LIBRE, YO).accion).toBe("mostrar");
  });
});

describe("pantalla de espera de un duelo", () => {
  const esperando = (id: string): EstadoPantalla => ({
    partidaEnCurso: false,
    modalAbierto: "esperando_rival",
    modalDueloId: id
  });

  it("la pantalla de espera se convierte en resultado cuando SU duelo se resuelve", () => {
    const d = decidirNotificacionDuelo([duelo("DND-100")], ["DND-100"], esperando("DND-100"), YO);
    // Aunque ya esté marcado como visto: es la pantalla que el jugador tiene abierta.
    expect(d.accion).toBe("mostrar");
    if (d.accion === "mostrar") expect(d.duelo.id).toBe("DND-100");
  });

  it("el resultado de OTRO duelo no pisa la pantalla de espera", () => {
    const duelos = [duelo("DND-999"), duelo("DND-100", { status: "en_curso", player2Completed: false })];
    const d = decidirNotificacionDuelo(duelos, [], esperando("DND-100"), YO);
    expect(d.accion).toBe("posponer");
  });

  it("con otro duelo pendiente primero en la lista, igual gana el que estás esperando", () => {
    // Este es el caso que se rompía: DND-999 aparecía antes y tapaba la
    // actualización del duelo cuya pantalla el jugador tiene enfrente.
    const duelos = [duelo("DND-999"), duelo("DND-100")];
    const d = decidirNotificacionDuelo(duelos, [], esperando("DND-100"), YO);
    expect(d.accion).toBe("mostrar");
    if (d.accion === "mostrar") expect(d.duelo.id).toBe("DND-100");
  });
});

describe("veredicto final ya en pantalla", () => {
  const conVeredicto: EstadoPantalla = { partidaEnCurso: false, modalAbierto: "final", modalDueloId: "DND-1" };

  it("no se reemplaza un veredicto por otro: queda pendiente", () => {
    const d = decidirNotificacionDuelo([duelo("DND-100")], [], conVeredicto, YO);
    expect(d.accion).toBe("posponer");
  });

  it("sin nada nuevo detrás, no hace nada", () => {
    const d = decidirNotificacionDuelo([duelo("DND-100")], ["DND-100"], conVeredicto, YO);
    expect(d.accion).toBe("ninguna");
  });
});
