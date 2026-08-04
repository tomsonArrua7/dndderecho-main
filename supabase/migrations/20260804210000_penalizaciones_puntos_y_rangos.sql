-- Migration: Sistema de Penalizaciones por Derrotas y Desempeño Insuficiente (< 50% Aciertos)

-- 1. Actualizar fn_procesar_resultado_duelo con penalización (-40 PTS) para el perdedor
CREATE OR REPLACE FUNCTION public.fn_procesar_resultado_duelo(
    p_duelo_id TEXT,
    p_player1_puntos INT,
    p_player1_aciertos INT,
    p_player2_puntos INT,
    p_player2_aciertos INT
)
RETURNS JSONB AS $$
DECLARE
    v_duelo RECORD;
    v_ganador TEXT;
    v_p1_id UUID;
    v_p2_id UUID;
BEGIN
    SELECT * INTO v_duelo FROM public.trivia_duelos WHERE id = p_duelo_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Duelo no encontrado');
    END IF;

    -- Evitar re-procesar duelos finalizados previamente
    IF v_duelo.status = 'finalizado' THEN
        RETURN jsonb_build_object('success', true, 'mensaje', 'El duelo ya fue finalizado previamente');
    END IF;

    v_p1_id := v_duelo.player1_id;
    v_p2_id := v_duelo.player2_id;

    -- Determinar ganador basado en los puntajes y aciertos reales
    IF p_player1_puntos > p_player2_puntos THEN
        v_ganador := 'player1';
    ELSIF p_player2_puntos > p_player1_puntos THEN
        v_ganador := 'player2';
    ELSIF p_player1_aciertos > p_player2_aciertos THEN
        v_ganador := 'player1';
    ELSIF p_player2_aciertos > p_player1_aciertos THEN
        v_ganador := 'player2';
    ELSE
        v_ganador := 'empate';
    END IF;

    -- Actualizar estado de la sala a finalizado
    UPDATE public.trivia_duelos 
    SET 
        player1_puntos = p_player1_puntos,
        player1_aciertos = p_player1_aciertos,
        player1_completed = true,
        player2_puntos = p_player2_puntos,
        player2_aciertos = p_player2_aciertos,
        player2_completed = true,
        ganador_id = v_ganador,
        status = 'finalizado'
    WHERE id = p_duelo_id;

    -- Actualizar estadísticas de Jugador 1 (+50 si gana, +20 si empata, -40 si pierde)
    IF v_p1_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (user_id, victorias_duelo, derrotas_duelo, empates_duelo, puntos_duelista, puntos_totales)
        VALUES (
            v_p1_id,
            CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE 0 END,
            CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE 0 END
        )
        ON CONFLICT (user_id) DO UPDATE SET
            victorias_duelo = trivia_estadisticas_usuario.victorias_duelo + (CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END),
            derrotas_duelo = trivia_estadisticas_usuario.derrotas_duelo + (CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END),
            empates_duelo = trivia_estadisticas_usuario.empates_duelo + (CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END),
            puntos_duelista = GREATEST(0, trivia_estadisticas_usuario.puntos_duelista + (CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE -40 END)),
            puntos_totales = GREATEST(0, trivia_estadisticas_usuario.puntos_totales + (CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE -40 END)),
            updated_at = now();
    END IF;

    -- Actualizar estadísticas de Jugador 2 (+50 si gana, +20 si empata, -40 si pierde)
    IF v_p2_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (user_id, victorias_duelo, derrotas_duelo, empates_duelo, puntos_duelista, puntos_totales)
        VALUES (
            v_p2_id,
            CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE 0 END,
            CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE 0 END
        )
        ON CONFLICT (user_id) DO UPDATE SET
            victorias_duelo = trivia_estadisticas_usuario.victorias_duelo + (CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END),
            derrotas_duelo = trivia_estadisticas_usuario.derrotas_duelo + (CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END),
            empates_duelo = trivia_estadisticas_usuario.empates_duelo + (CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END),
            puntos_duelista = GREATEST(0, trivia_estadisticas_usuario.puntos_duelista + (CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE -40 END)),
            puntos_totales = GREATEST(0, trivia_estadisticas_usuario.puntos_totales + (CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 20 ELSE -40 END)),
            updated_at = now();
    END IF;

    RETURN jsonb_build_object('success', true, 'ganador', v_ganador);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
