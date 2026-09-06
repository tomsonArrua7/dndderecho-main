-- Puesta a punto para la salida pública:
--   1. Las salas que nadie llegó a jugar no pueden otorgar puntos.
--   2. Las salas públicas sin rival expiran a los 30 minutos.
--   3. La temporada 1 arranca hoy 06/09/2026 a las 19:00 ART.
--   4. Se borran los puntos de las pruebas internas.

-- -------------------------------------------------------------------------
-- 1 y 2. BARRIDO DE DUELOS: DISTINGUIR ABANDONO DE SALA VACÍA
-- -------------------------------------------------------------------------
-- La versión anterior resolvía por abandono toda sala donde exactamente un
-- jugador figurara completo. Eso incluía las salas a las que nunca entró
-- nadie: quien la creaba respondía solo y, pasado el plazo, cobraba la
-- victoria. Ahora el abandono exige que haya existido un rival de verdad.

CREATE OR REPLACE FUNCTION public.fn_barrer_duelos_abandonados(
    p_minutos INT DEFAULT 5
)
RETURNS JSONB AS $$
DECLARE
    r                RECORD;
    v_resueltos      INT := 0;
    v_salas_muertas  INT := 0;
    v_vacias         INT := 0;
BEGIN
    -- Abandono real: entraron los dos, uno completó y el otro dejó vencer el plazo.
    FOR r IN
        SELECT id
        FROM public.trivia_duelos
        WHERE status <> 'finalizado'
          AND player2_id IS NOT NULL
          AND COALESCE(player1_completed,false) <> COALESCE(player2_completed,false)
          AND primer_completado_at IS NOT NULL
          AND primer_completado_at < now() - make_interval(mins => p_minutos)
        FOR UPDATE SKIP LOCKED
    LOOP
        PERFORM public.fn_resolver_duelo(r.id, true);
        v_resueltos := v_resueltos + 1;
    END LOOP;

    -- Salas públicas a las que nunca entró un rival: se borran a los 30 minutos
    -- sin computar nada, aunque quien la creó ya haya respondido.
    DELETE FROM public.trivia_duelos
    WHERE player2_id IS NULL
      AND status <> 'finalizado'
      AND created_at < now() - interval '30 minutes';
    GET DIAGNOSTICS v_vacias = ROW_COUNT;

    -- Higiene: salas con dos jugadores que ninguno llegó a jugar.
    DELETE FROM public.trivia_duelos
    WHERE status = 'en_curso'
      AND NOT COALESCE(player1_completed,false)
      AND NOT COALESCE(player2_completed,false)
      AND created_at < now() - interval '2 hours';
    GET DIAGNOSTICS v_salas_muertas = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', true,
        'duelos_resueltos_por_abandono', v_resueltos,
        'salas_vacias_expiradas', v_vacias,
        'salas_purgadas', v_salas_muertas
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.fn_barrer_duelos_abandonados(INT) FROM anon, authenticated;

-- -------------------------------------------------------------------------
-- 3. INICIO DE LA TEMPORADA 1
-- -------------------------------------------------------------------------
-- Mientras no haya ninguna temporada cerrada, el inicio vigente es esta fecha.

CREATE OR REPLACE FUNCTION public.fn_inicio_temporada_vigente()
RETURNS TIMESTAMPTZ AS $$
    SELECT COALESCE(
        (SELECT MAX(cerrada_at) FROM public.trivia_temporadas),
        '2026-09-06 22:00:00+00'::TIMESTAMPTZ  -- 06/09/2026 19:00 ART
    );
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION public.fn_inicio_temporada_vigente() TO anon, authenticated;

-- -------------------------------------------------------------------------
-- 4. BORRADO DE LOS PUNTOS DE PRUEBA
-- -------------------------------------------------------------------------
-- Se limpian los puntos y el récord competitivo generados durante las pruebas
-- internas. Se conservan partidas_jugadas, total_aciertos y mejor_racha, que
-- son estadística de estudio y no de ranking, con el mismo criterio que aplica
-- el cierre de temporada.

UPDATE public.trivia_estadisticas_usuario
SET puntos_totales  = 0,
    puntos_duelista = 0,
    victorias_duelo = 0,
    derrotas_duelo  = 0,
    empates_duelo   = 0,
    updated_at      = now();

-- Las medallas y temporadas de prueba no deben contar como historia oficial.
DELETE FROM public.trivia_medallas_usuario;
DELETE FROM public.trivia_temporadas;

-- Duelos de prueba: se borran todos para que el historial arranque limpio
-- junto con la temporada 1.
DELETE FROM public.trivia_duelos;
