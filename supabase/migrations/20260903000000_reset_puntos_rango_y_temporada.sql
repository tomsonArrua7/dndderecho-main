-- =========================================================================
-- MIGRATION: RESET TOTAL DE PUNTOS DE RANGO / MMR Y RANKING UNIFICADO
-- =========================================================================

-- 1. RESET COMPLETO DE PUNTOS Y RANGOS PREVIOS (TODOS ARRANCAN DE CERO COMO INGRESANTE NIVEL 1)
UPDATE public.trivia_estadisticas_usuario
SET 
    puntos_totales = 0,
    puntos_duelista = 0,
    victorias_duelo = 0,
    derrotas_duelo = 0,
    empates_duelo = 0,
    mejor_racha = 0,
    updated_at = now();

-- Limpiar duelos de prueba o salas obsoletas
DELETE FROM public.trivia_duelos;

-- 2. FUNCIÓN DEFINITIVA PARA PROCESAR RESULTADOS DE DUELOS 1V1 (ÚNICA FUENTE DE PUNTOS DE RANGO)
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
    v_delta_p1 INT;
    v_delta_p2 INT;
BEGIN
    SELECT * INTO v_duelo FROM public.trivia_duelos WHERE id = p_duelo_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Duelo no encontrado');
    END IF;

    -- Idempotencia: evitar doble procesamiento
    IF v_duelo.status = 'finalizado' THEN
        RETURN jsonb_build_object('success', true, 'mensaje', 'El duelo ya fue finalizado previamente');
    END IF;

    v_p1_id := v_duelo.player1_id;
    v_p2_id := v_duelo.player2_id;

    -- Determinar ganador
    IF p_player1_puntos > p_player2_puntos THEN
        v_ganador := 'player1';
        v_delta_p1 := 50;
        v_delta_p2 := -15;
    ELSIF p_player2_puntos > p_player1_puntos THEN
        v_ganador := 'player2';
        v_delta_p1 := -15;
        v_delta_p2 := 50;
    ELSIF p_player1_aciertos > p_player2_aciertos THEN
        v_ganador := 'player1';
        v_delta_p1 := 50;
        v_delta_p2 := -15;
    ELSIF p_player2_aciertos > p_player1_aciertos THEN
        v_ganador := 'player2';
        v_delta_p1 := -15;
        v_delta_p2 := 50;
    ELSE
        v_ganador := 'empate';
        v_delta_p1 := 25;
        v_delta_p2 := 25;
    END IF;

    -- Cerrar la sala
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

    -- Actualizar Jugador 1
    IF v_p1_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (
            user_id, victorias_duelo, derrotas_duelo, empates_duelo, puntos_duelista, puntos_totales, updated_at
        )
        VALUES (
            v_p1_id,
            CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END,
            GREATEST(0, v_delta_p1),
            GREATEST(0, v_delta_p1),
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            victorias_duelo = trivia_estadisticas_usuario.victorias_duelo + (CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END),
            derrotas_duelo = trivia_estadisticas_usuario.derrotas_duelo + (CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END),
            empates_duelo = trivia_estadisticas_usuario.empates_duelo + (CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END),
            puntos_duelista = GREATEST(0, trivia_estadisticas_usuario.puntos_duelista + v_delta_p1),
            puntos_totales = GREATEST(0, trivia_estadisticas_usuario.puntos_totales + v_delta_p1),
            updated_at = now();
    END IF;

    -- Actualizar Jugador 2
    IF v_p2_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (
            user_id, victorias_duelo, derrotas_duelo, empates_duelo, puntos_duelista, puntos_totales, updated_at
        )
        VALUES (
            v_p2_id,
            CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END,
            CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END,
            GREATEST(0, v_delta_p2),
            GREATEST(0, v_delta_p2),
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            victorias_duelo = trivia_estadisticas_usuario.victorias_duelo + (CASE WHEN v_ganador = 'player2' THEN 1 ELSE 0 END),
            derrotas_duelo = trivia_estadisticas_usuario.derrotas_duelo + (CASE WHEN v_ganador = 'player1' THEN 1 ELSE 0 END),
            empates_duelo = trivia_estadisticas_usuario.empates_duelo + (CASE WHEN v_ganador = 'empate' THEN 1 ELSE 0 END),
            puntos_duelista = GREATEST(0, trivia_estadisticas_usuario.puntos_duelista + v_delta_p2),
            puntos_totales = GREATEST(0, trivia_estadisticas_usuario.puntos_totales + v_delta_p2),
            updated_at = now();
    END IF;

    RETURN jsonb_build_object('success', true, 'ganador', v_ganador);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. FUNCIÓN DE CIERRE DE TEMPORADA CON RESETEO REAL DE MMR Y ENTREGA DE MEDALLAS
CREATE OR REPLACE FUNCTION public.fn_cerrar_y_resetear_temporada(
    p_nombre_temporada TEXT DEFAULT 'Temporada Oficial'
)
RETURNS JSONB AS $$
DECLARE
    v_top_players RECORD;
    v_count INT := 0;
    v_medalla_tipo TEXT;
    v_medalla_titulo TEXT;
BEGIN
    -- Recorrer los 3 mejores estudiantes de la temporada según Puntos de Rango
    FOR v_top_players IN 
        SELECT user_id, puntos_totales 
        FROM public.trivia_estadisticas_usuario
        WHERE puntos_totales > 0
        ORDER BY puntos_totales DESC
        LIMIT 3
    LOOP
        v_count := v_count + 1;
        
        IF v_count = 1 THEN
            v_medalla_tipo := 'oro';
            v_medalla_titulo := 'Campeón de Temporada - 🥇 Oro';
        ELSIF v_count = 2 THEN
            v_medalla_tipo := 'plata';
            v_medalla_titulo := 'Subcampeón de Temporada - 🥈 Plata';
        ELSE
            v_medalla_tipo := 'bronce';
            v_medalla_titulo := 'Tercer Puesto de Temporada - 🥉 Bronce';
        END IF;

        -- Registrar medalla permanente en la vitrina del usuario
        INSERT INTO public.trivia_medallas_usuario (user_id, tipo, titulo, descripcion, icono)
        VALUES (
            v_top_players.user_id,
            v_medalla_tipo,
            v_medalla_titulo,
            'Condecoración por podio en ' || p_nombre_temporada || ' con ' || v_top_players.puntos_totales || ' Pts de Rango.',
            'trophy'
        );
    END LOOP;

    -- RESETEAR PUNTOS DE RANGO / MMR DE TODOS LOS USUARIOS PARA LA NUEVA TEMPORADA
    UPDATE public.trivia_estadisticas_usuario
    SET 
        puntos_totales = 0,
        puntos_duelista = 0,
        victorias_duelo = 0,
        derrotas_duelo = 0,
        empates_duelo = 0,
        updated_at = now();

    RETURN jsonb_build_object(
        'success', true, 
        'mensaje', 'Temporada cerrada exitosamente. Medallas asignadas y Puntos de Rango reseteados a 0.',
        'medallas_otorgadas', v_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. VISTA UNIFICADA DEL RANKING OFICIAL DE LA FACULTAD
DROP VIEW IF EXISTS public.trivia_leaderboard CASCADE;
CREATE VIEW public.trivia_leaderboard 
WITH (security_invoker = true) AS
SELECT 
    e.user_id AS id,
    COALESCE(p.full_name, 'Estudiante de Abogacía') AS nombre,
    COALESCE(p.avatar_url, NULL) AS avatar_url,
    'Facultad de Cs. Jurídicas y Sociales' AS facultad,
    e.puntos_totales AS puntos,
    e.mejor_racha AS racha,
    e.victorias_duelo AS victorias,
    e.derrotas_duelo AS derrotas,
    e.empates_duelo AS empates,
    CASE 
        WHEN (e.victorias_duelo + e.derrotas_duelo + e.empates_duelo) > 0 
        THEN ROUND((e.victorias_duelo::NUMERIC / (e.victorias_duelo + e.derrotas_duelo + e.empates_duelo)::NUMERIC) * 100)
        ELSE 0 
    END AS aciertos_porcentaje,
    DENSE_RANK() OVER (ORDER BY e.puntos_totales DESC, e.victorias_duelo DESC) AS posicion
FROM public.trivia_estadisticas_usuario e
JOIN public.profiles p ON e.user_id = p.id
WHERE e.puntos_totales > 0 OR (e.victorias_duelo + e.derrotas_duelo + e.empates_duelo) > 0;
