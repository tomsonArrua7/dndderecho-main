-- Las temporadas pasan a ir de domingo a domingo.
--
-- La temporada 1 arranca el domingo 06/09/2026 a las 19:00 ART, así que el
-- cierre corresponde los domingos a la misma hora. Antes el cron estaba
-- programado para los jueves, lo que habría dejado la primera temporada en
-- apenas 4 días y desalineada del arranque.
--
-- pg_cron interpreta los horarios en UTC y Argentina es UTC-3 todo el año:
--     domingo 19:00 ART  ==  domingo 22:00 UTC  ->  '0 22 * * 0'

-- -------------------------------------------------------------------------
-- DURACIÓN MÍNIMA DE UNA TEMPORADA
-- -------------------------------------------------------------------------
-- La temporada 1 arranca un domingo 19:00, que es exactamente cuando corre el
-- cron: sin esta guarda, el primer disparo la cerraría en el mismo instante en
-- que empieza, repartiendo medallas sobre una tabla vacía y saltando el ciclo
-- de ramas a la segunda antes de que nadie juegue.
--
-- La guarda de 6 días también cubre reejecuciones manuales y redeploys.

CREATE OR REPLACE FUNCTION public.fn_cerrar_y_resetear_temporada(
    p_nombre_temporada TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_top            RECORD;
    v_count          INT := 0;
    v_tipo           TEXT;
    v_titulo         TEXT;
    v_nombre         TEXT;
    v_campeon        UUID;
    v_campeon_pts    INT;
    v_participantes  INT;
    v_podio          JSONB := '[]'::JSONB;
    v_inicio         TIMESTAMPTZ;
BEGIN
    v_inicio := public.fn_inicio_temporada_vigente();

    IF now() - v_inicio < interval '6 days' THEN
        RETURN jsonb_build_object(
            'success', false,
            'omitido', true,
            'mensaje', 'La temporada vigente arrancó hace menos de 6 días.'
        );
    END IF;

    v_nombre := COALESCE(
        p_nombre_temporada,
        'Temporada al ' ||
        to_char(now() AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY')
    );

    SELECT COUNT(*) INTO v_participantes
    FROM public.trivia_estadisticas_usuario
    WHERE puntos_totales > 0;

    -- Podio: medalla permanente para los tres primeros.
    FOR v_top IN
        SELECT e.user_id, e.puntos_totales, COALESCE(p.full_name,'Estudiante') AS nombre
        FROM public.trivia_estadisticas_usuario e
        JOIN public.profiles p ON p.id = e.user_id
        WHERE e.puntos_totales > 0
        ORDER BY e.puntos_totales DESC, e.victorias_duelo DESC
        LIMIT 3
    LOOP
        v_count := v_count + 1;

        IF v_count = 1 THEN
            v_tipo := 'oro';    v_titulo := 'Campeón de Temporada - 🥇 Oro';
            v_campeon := v_top.user_id;
            v_campeon_pts := v_top.puntos_totales;
        ELSIF v_count = 2 THEN
            v_tipo := 'plata';  v_titulo := 'Subcampeón de Temporada - 🥈 Plata';
        ELSE
            v_tipo := 'bronce'; v_titulo := 'Tercer Puesto de Temporada - 🥉 Bronce';
        END IF;

        INSERT INTO public.trivia_medallas_usuario (user_id, tipo, titulo, descripcion, icono)
        VALUES (
            v_top.user_id, v_tipo, v_titulo,
            'Condecoración por podio en ' || v_nombre ||
            ' con ' || v_top.puntos_totales || ' Pts de Rango.',
            'trophy'
        );

        v_podio := v_podio || jsonb_build_object(
            'puesto', v_count,
            'user_id', v_top.user_id,
            'nombre', v_top.nombre,
            'puntos', v_top.puntos_totales
        );
    END LOOP;

    -- Reset competitivo. Se conservan a propósito partidas_jugadas,
    -- total_aciertos y mejor_racha: son estadística de estudio, no de ranking.
    UPDATE public.trivia_estadisticas_usuario
    SET puntos_totales  = 0,
        puntos_duelista = 0,
        victorias_duelo = 0,
        derrotas_duelo  = 0,
        empates_duelo   = 0,
        updated_at      = now();

    INSERT INTO public.trivia_temporadas (nombre, campeon_id, campeon_pts, participantes, detalle)
    VALUES (v_nombre, v_campeon, v_campeon_pts, v_participantes,
            jsonb_build_object('podio', v_podio));

    RETURN jsonb_build_object(
        'success', true,
        'temporada', v_nombre,
        'medallas_otorgadas', v_count,
        'participantes', v_participantes,
        'podio', v_podio
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.fn_cerrar_y_resetear_temporada(TEXT) FROM anon, authenticated;

DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'pg_cron no pudo habilitarse (%). Activalo en Database > Extensions y volvé a ejecutar esta migración.', SQLERRM;
        RETURN;
    END;

    -- Se reprograma de cero para que la migración sea reejecutable.
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname IN ('trivia_barrer_abandonos', 'trivia_reset_temporada_semanal');

    PERFORM cron.schedule(
        'trivia_barrer_abandonos',
        '* * * * *',
        $cron$SELECT public.fn_barrer_duelos_abandonados(5);$cron$
    );

    PERFORM cron.schedule(
        'trivia_reset_temporada_semanal',
        '0 22 * * 0',
        $cron$SELECT public.fn_cerrar_y_resetear_temporada();$cron$
    );

    RAISE NOTICE 'pg_cron programado: barrido cada minuto y cierre de temporada los domingos 19:00 ART.';
END
$$;

-- Verificación: estas dos filas tienen que existir y estar activas.
-- Si la consulta falla o vuelve vacía, pg_cron no está habilitado y las
-- temporadas no van a cerrar solas.
--     SELECT jobname, schedule, active FROM cron.job
--     WHERE jobname LIKE 'trivia_%';
