-- Migration: Corregir función fn_procesar_resultado_duelo y limpiar empates duplicados acumulados en trivia_estadisticas_usuario

-- 1. Actualizar fn_procesar_resultado_duelo para garantizar que sea IDEMPOTENTE y no procese duelos finalizados previamente
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

    -- SI EL DUELO YA FUE PROCESADO Y FINALIZADO, EVITAR INCREMENTAR ESTADÍSTICAS NUEVAMENTE
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

    -- Actualizar estadísticas de Jugador 1 (una sola vez)
    IF v_p1_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (user_id, victorias_duelo, derrotas_duelo, empates_duelo, puntos_duelista, puntos_totales)
        VALUES (
            v_p1_id,
            CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END,
            CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END
        )
        ON CONFLICT (user_id) DO UPDATE SET
            victorias_duelo = trivia_estadisticas_usuario.victorias_duelo + (CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END),
            derrotas_duelo = trivia_estadisticas_usuario.derrotas_duelo + (CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END),
            empates_duelo = trivia_estadisticas_usuario.empates_duelo + (CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END),
            puntos_duelista = trivia_estadisticas_usuario.puntos_duelista + (CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END),
            puntos_totales = trivia_estadisticas_usuario.puntos_totales + (CASE WHEN v_ganador = 'player1' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END),
            updated_at = now();
    END IF;

    -- Actualizar estadísticas de Jugador 2 (una sola vez)
    IF v_p2_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (user_id, victorias_duelo, derrotas_duelo, empates_duelo, puntos_duelista, puntos_totales)
        VALUES (
            v_p2_id,
            CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END,
            CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END
        )
        ON CONFLICT (user_id) DO UPDATE SET
            victorias_duelo = trivia_estadisticas_usuario.victorias_duelo + (CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END),
            derrotas_duelo = trivia_estadisticas_usuario.derrotas_duelo + (CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END),
            empates_duelo = trivia_estadisticas_usuario.empates_duelo + (CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END),
            puntos_duelista = trivia_estadisticas_usuario.puntos_duelista + (CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END),
            puntos_totales = trivia_estadisticas_usuario.puntos_totales + (CASE WHEN v_ganador = 'player2' THEN 50 WHEN v_ganador = 'empate' THEN 25 ELSE 10 END),
            updated_at = now();
    END IF;

    RETURN jsonb_build_object('success', true, 'ganador', v_ganador);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para Recalcular y Corregir Estadísticas de Duelos a partir de duelos finalizados reales
CREATE OR REPLACE FUNCTION public.fn_recalcular_estadisticas_duelos()
RETURNS void AS $$
BEGIN
    -- Resetear acumulados de duelos
    UPDATE public.trivia_estadisticas_usuario
    SET victorias_duelo = 0,
        derrotas_duelo = 0,
        empates_duelo = 0,
        puntos_duelista = 0;

    -- Recalcular acumulados sumando duelos finalizados reales
    WITH duelos_finalizados AS (
        SELECT 
            player1_id AS user_id,
            CASE WHEN ganador_id = 'player1' THEN 1 ELSE 0 END AS vic,
            CASE WHEN ganador_id = 'player2' THEN 1 ELSE 0 END AS der,
            CASE WHEN ganador_id = 'empate' THEN 1 ELSE 0 END AS emp,
            CASE WHEN ganador_id = 'player1' THEN 50 WHEN ganador_id = 'empate' THEN 25 ELSE 10 END AS pts
        FROM public.trivia_duelos
        WHERE status = 'finalizado' AND player1_id IS NOT NULL

        UNION ALL

        SELECT 
            player2_id AS user_id,
            CASE WHEN ganador_id = 'player2' THEN 1 ELSE 0 END AS vic,
            CASE WHEN ganador_id = 'player1' THEN 1 ELSE 0 END AS der,
            CASE WHEN ganador_id = 'empate' THEN 1 ELSE 0 END AS emp,
            CASE WHEN ganador_id = 'player2' THEN 50 WHEN ganador_id = 'empate' THEN 25 ELSE 10 END AS pts
        FROM public.trivia_duelos
        WHERE status = 'finalizado' AND player2_id IS NOT NULL
    ),
    resumen AS (
        SELECT 
            user_id,
            SUM(vic)::INT AS total_vic,
            SUM(der)::INT AS total_der,
            SUM(emp)::INT AS total_emp,
            SUM(pts)::INT AS total_pts
        FROM duelos_finalizados
        GROUP BY user_id
    )
    UPDATE public.trivia_estadisticas_usuario e
    SET 
        victorias_duelo = r.total_vic,
        derrotas_duelo = r.total_der,
        empates_duelo = r.total_emp,
        puntos_duelista = r.total_pts
    FROM resumen r
    WHERE e.user_id::text = r.user_id::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ejecutar inmediatamente la corrección de datos para limpiar el excedente de empates en las filas existentes
SELECT public.fn_recalcular_estadisticas_duelos();
