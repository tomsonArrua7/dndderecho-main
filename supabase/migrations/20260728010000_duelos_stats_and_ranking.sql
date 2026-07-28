-- Migration: Estadísticas de Duelista, Victorias/Derrotas y Ranking de Duelistas 1v1

-- 1. Agregar columnas a trivia_estadisticas_usuario si no existen
ALTER TABLE public.trivia_estadisticas_usuario 
ADD COLUMN IF NOT EXISTS victorias_duelo INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS derrotas_duelo INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS empates_duelo INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS puntos_duelista INTEGER NOT NULL DEFAULT 0;

-- 2. Función en Base de Datos para Procesar Resultado de Duelo
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

    v_p1_id := v_duelo.player1_id;
    v_p2_id := v_duelo.player2_id;

    -- Determinar ganador
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

    -- Actualizar estado de la sala
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

    -- Actualizar estadísticas de Jugador 1
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

    -- Actualizar estadísticas de Jugador 2
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

-- 3. Vista del Ranking Exclusivo de Duelistas (1v1)
DROP VIEW IF EXISTS public.trivia_leaderboard_duelistas CASCADE;

CREATE VIEW public.trivia_leaderboard_duelistas 
WITH (security_invoker = true) AS
SELECT 
    e.user_id,
    COALESCE(p.full_name, 'Estudiante de Abogacía') AS nombre,
    p.avatar_url,
    p.role,
    e.puntos_duelista,
    e.victorias_duelo AS victorias,
    e.derrotas_duelo AS derrotas,
    e.empates_duelo AS empates,
    e.puntos_totales AS puntos_globales,
    DENSE_RANK() OVER (ORDER BY e.puntos_duelista DESC, e.victorias_duelo DESC) AS posicion
FROM public.trivia_estadisticas_usuario e
JOIN public.profiles p ON e.user_id = p.id
WHERE (e.victorias_duelo > 0 OR e.derrotas_duelo > 0 OR e.empates_duelo > 0 OR e.puntos_duelista > 0)
ORDER BY e.puntos_duelista DESC, e.victorias_duelo DESC;
