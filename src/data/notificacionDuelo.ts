import { DueloTrivia } from "./triviaData";

/**
 * Estado de la pantalla en el momento en que llega la lista de duelos. Decide si
 * el resultado se puede mostrar ahora o hay que dejarlo para después.
 */
export interface EstadoPantalla {
  /** El jugador está respondiendo una partida ahora mismo. */
  partidaEnCurso: boolean;
  /** Resultado del modal de duelo abierto, si hay alguno. */
  modalAbierto?: "esperando_rival" | "final" | null;
  /** A qué duelo pertenece ese modal. */
  modalDueloId?: string;
}

export interface IdentidadJugador {
  userId?: string;
  userName: string;
}

export type DecisionNotificacion =
  /** Se puede abrir el resultado de este duelo ahora. */
  | { accion: "mostrar"; duelo: DueloTrivia; soyPlayer1: boolean }
  /** Hay un resultado sin ver, pero la pantalla está ocupada: se muestra después. */
  | { accion: "posponer" }
  /** No hay nada nuevo que mostrar. */
  | { accion: "ninguna" };

function esMio(duelo: DueloTrivia, { userId, userName }: IdentidadJugador): boolean {
  return (
    (!!userId && (duelo.player1Id === userId || duelo.player2Id === userId)) ||
    duelo.player1Nombre === userName ||
    duelo.player2Nombre === userName
  );
}

export function esPlayer1(duelo: DueloTrivia, { userId, userName }: IdentidadJugador): boolean {
  return (!!userId && duelo.player1Id === userId) || duelo.player1Nombre === userName;
}

function estaTerminado(duelo: DueloTrivia): boolean {
  return duelo.status === "finalizado" || (duelo.player1Completed && duelo.player2Completed);
}

/**
 * Decide qué hacer cuando llega una tanda de duelos del servidor.
 *
 * La regla que ordena todo: **nunca interrumpir lo que el jugador está
 * haciendo**. Mostrar el resultado de un duelo viejo mientras responde otro le
 * pisa el pool de preguntas y lo obliga a empezar de cero; y pisar la pantalla
 * de espera de un duelo con el veredicto de otro le muestra un resultado que no
 * es el que está esperando. En los dos casos se pospone.
 */
export function decidirNotificacionDuelo(
  duelos: DueloTrivia[],
  vistos: string[],
  pantalla: EstadoPantalla,
  jugador: IdentidadJugador
): DecisionNotificacion {
  const pendientes = duelos.filter(
    d => esMio(d, jugador) && estaTerminado(d) && !vistos.includes(d.id)
  );

  // Respondiendo: no se toca nada, pero se recuerda que quedó algo por mostrar.
  if (pantalla.partidaEnCurso) {
    return pendientes.length > 0 ? { accion: "posponer" } : { accion: "ninguna" };
  }

  // Con un veredicto final en pantalla, se espera a que lo cierre.
  if (pantalla.modalAbierto === "final") {
    return pendientes.length > 0 ? { accion: "posponer" } : { accion: "ninguna" };
  }

  // La pantalla de "esperando rival" sí se convierte en resultado, pero sólo con
  // el duelo que le corresponde. Por eso ese duelo se evalúa primero: si mirara
  // otro antes, ese otro taparía la actualización que el jugador está esperando.
  const esperandoId =
    pantalla.modalAbierto === "esperando_rival" ? pantalla.modalDueloId : undefined;

  if (esperandoId) {
    const suyo = duelos.find(d => d.id === esperandoId);
    if (suyo && esMio(suyo, jugador) && estaTerminado(suyo)) {
      return { accion: "mostrar", duelo: suyo, soyPlayer1: esPlayer1(suyo, jugador) };
    }
    // Está esperando otro duelo: cualquier resultado ajeno queda para después.
    return pendientes.length > 0 ? { accion: "posponer" } : { accion: "ninguna" };
  }

  const primero = pendientes[0];
  if (!primero) return { accion: "ninguna" };
  return { accion: "mostrar", duelo: primero, soyPlayer1: esPlayer1(primero, jugador) };
}
