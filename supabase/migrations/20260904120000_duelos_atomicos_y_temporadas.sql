-- =========================================================================
-- MIGRATION: RESOLUCIÓN ATÓMICA DE DUELOS + TEMPORADAS REALES + AUDITORÍA
-- =========================================================================
-- Objetivos:
--   1. Que el resultado del duelo lo determine EXCLUSIVAMENTE el servidor,
--      de forma atómica, sin depender de que ningún cliente siga vivo.
--   2. Que las salas abandonadas se cierren solas (victoria a los 5 minutos).
--   3. Que el reset semanal de temporada ocurra de verdad (pg_cron, jueves 19hs).
--   4. Que exista una auditoría capaz de recalcular el MMR desde el historial.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. AJUSTES DE ESQUEMA
-- -------------------------------------------------------------------------

ALTER TABLE public.trivia_estadisticas_usuario
    ADD COLUMN IF NOT EXISTS puntos_duelista INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS victorias_duelo INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS derrotas_duelo  INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS empates_duelo   INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.trivia_duelos
    -- Momento en que el PRIMER jugador terminó. Es el reloj del abandono.
    ADD COLUMN IF NOT EXISTS primer_completado_at TIMESTAMPTZ,
    -- Momento en que la sala quedó resuelta. Ordena la auditoría cronológica.
    ADD COLUMN IF NOT EXISTS finalizado_at        TIMESTAMPTZ,
    -- Marca si el cierre fue por abandono del rival y no por juego completo.
    ADD COLUMN IF NOT EXISTS por_abandono         BOOLEAN NOT NULL DEFAULT false,
    -- MMR efectivamente aplicado a cada lado. Deja rastro auditable.
    ADD COLUMN IF NOT EXISTS delta_player1        INTEGER,
    ADD COLUMN IF NOT EXISTS delta_player2        INTEGER;

-- Índice para que el barrido de abandonos no escanee la tabla entera.
CREATE INDEX IF NOT EXISTS idx_trivia_duelos_barrido
    ON public.trivia_duelos (status, primer_completado_at)
    WHERE status <> 'finalizado';

-- -------------------------------------------------------------------------
-- 2. HELPER: APLICAR DELTA DE MMR A UN JUGADOR
-- -------------------------------------------------------------------------
-- Centraliza el upsert de estadísticas para que las cuatro rutas de cierre
-- (juego completo, abandono, auditoría, temporada) usen exactamente la misma
-- aritmética y el mismo clamp en cero.

CREATE OR REPLACE FUNCTION public.fn_aplicar_delta_mmr(
    p_user_id   UUID,
    p_delta     INT,
    p_resultado TEXT  -- 'victoria' | 'derrota' | 'empate'
)
RETURNS VOID AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN;
    END IF;

    INSERT INTO public.trivia_estadisticas_usuario (
        user_id, victorias_duelo, derrotas_duelo, empates_duelo,
        puntos_duelista, puntos_totales, updated_at
    )
    VALUES (
        p_user_id,
        CASE WHEN p_resultado = 'victoria' THEN 1 ELSE 0 END,
        CASE WHEN p_resultado = 'derrota'  THEN 1 ELSE 0 END,
        CASE WHEN p_resultado = 'empate'   THEN 1 ELSE 0 END,
        GREATEST(0, p_delta),
        GREATEST(0, p_delta),
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        victorias_duelo = public.trivia_estadisticas_usuario.victorias_duelo
                          + (CASE WHEN p_resultado = 'victoria' THEN 1 ELSE 0 END),
        derrotas_duelo  = public.trivia_estadisticas_usuario.derrotas_duelo
                          + (CASE WHEN p_resultado = 'derrota'  THEN 1 ELSE 0 END),
        empates_duelo   = public.trivia_estadisticas_usuario.empates_duelo
                          + (CASE WHEN p_resultado = 'empate'   THEN 1 ELSE 0 END),
        puntos_duelista = GREATEST(0, public.trivia_estadisticas_usuario.puntos_duelista + p_delta),
        puntos_totales  = GREATEST(0, public.trivia_estadisticas_usuario.puntos_totales  + p_delta),
        updated_at      = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- -------------------------------------------------------------------------
-- 3. NÚCLEO: RESOLVER UN DUELO DE FORMA ATÓMICA
-- -------------------------------------------------------------------------
-- Esta es AHORA la única fuente de verdad del MMR.
--
-- Diferencias clave contra la implementación anterior:
--   * Toma un lock de fila (SELECT ... FOR UPDATE) antes de decidir nada, así
--     dos llamadas simultáneas se serializan y la segunda ve status='finalizado'.
--   * Lee los puntajes DE LA FILA, no de parámetros del cliente. Un jugador ya
--     no puede reportar el puntaje de su rival (ni por error ni a propósito).
--   * No confía en que ningún cliente la invoque: la dispara un trigger.

CREATE OR REPLACE FUNCTION public.fn_resolver_duelo(
    p_duelo_id     TEXT,
    p_por_abandono BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
    d          RECORD;
    v_ganador  TEXT;
    v_delta_p1 INT;
    v_delta_p2 INT;
BEGIN
    -- Lock pesimista: serializa a los dos jugadores que terminan a la vez.
    SELECT * INTO d
    FROM public.trivia_duelos
    WHERE id = p_duelo_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Duelo no encontrado');
    END IF;

    -- Idempotencia dura: quien llegue segundo sale por acá.
    IF d.status = 'finalizado' THEN
        RETURN jsonb_build_object(
            'success', true,
            'ya_procesado', true,
            'ganador', d.ganador_id
        );
    END IF;

    IF p_por_abandono THEN
        -- Gana quien completó; el que se fue paga la penalización.
        IF d.player1_completed AND NOT d.player2_completed THEN
            v_ganador := 'player1'; v_delta_p1 := 50; v_delta_p2 := -15;
        ELSIF d.player2_completed AND NOT d.player1_completed THEN
            v_ganador := 'player2'; v_delta_p1 := -15; v_delta_p2 := 50;
        ELSE
            RETURN jsonb_build_object('success', false, 'error', 'No corresponde abandono');
        END IF;
    ELSE
        -- Cierre normal: exige que AMBOS hayan terminado.
        IF NOT (d.player1_completed AND COALESCE(d.player2_completed, false)) THEN
            RETURN jsonb_build_object('success', true, 'pendiente', true);
        END IF;

        -- Desempate: puntos, luego aciertos, luego empate real.
        IF    COALESCE(d.player1_puntos,0) > COALESCE(d.player2_puntos,0) THEN
            v_ganador := 'player1'; v_delta_p1 := 50; v_delta_p2 := -15;
        ELSIF COALESCE(d.player2_puntos,0) > COALESCE(d.player1_puntos,0) THEN
            v_ganador := 'player2'; v_delta_p1 := -15; v_delta_p2 := 50;
        ELSIF COALESCE(d.player1_aciertos,0) > COALESCE(d.player2_aciertos,0) THEN
            v_ganador := 'player1'; v_delta_p1 := 50; v_delta_p2 := -15;
        ELSIF COALESCE(d.player2_aciertos,0) > COALESCE(d.player1_aciertos,0) THEN
            v_ganador := 'player2'; v_delta_p1 := -15; v_delta_p2 := 50;
        ELSE
            v_ganador := 'empate';  v_delta_p1 := 25; v_delta_p2 := 25;
        END IF;
    END IF;

    -- Cerrar la sala ANTES de tocar el MMR: si algo falla después, la
    -- transacción entera se revierte y la sala vuelve a quedar abierta.
    UPDATE public.trivia_duelos
    SET ganador_id    = v_ganador,
        status        = 'finalizado',
        finalizado_at = now(),
        por_abandono  = p_por_abandono,
        delta_player1 = v_delta_p1,
        delta_player2 = v_delta_p2
    WHERE id = p_duelo_id;

    PERFORM public.fn_aplicar_delta_mmr(
        d.player1_id::uuid, v_delta_p1,
        CASE WHEN v_ganador = 'player1' THEN 'victoria'
             WHEN v_ganador = 'player2' THEN 'derrota'
             ELSE 'empate' END
    );

    PERFORM public.fn_aplicar_delta_mmr(
        d.player2_id::uuid, v_delta_p2,
        CASE WHEN v_ganador = 'player2' THEN 'victoria'
             WHEN v_ganador = 'player1' THEN 'derrota'
             ELSE 'empate' END
    );

    RETURN jsonb_build_object(
        'success', true,
        'ganador', v_ganador,
        'por_abandono', p_por_abandono,
        'delta_player1', v_delta_p1,
        'delta_player2', v_delta_p2
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- -------------------------------------------------------------------------
-- 4. TRIGGERS: EL SERVIDOR CIERRA EL DUELO SOLO
-- -------------------------------------------------------------------------

-- 4.a Sella el reloj del abandono cuando termina el primero de los dos.
CREATE OR REPLACE FUNCTION public.fn_trg_sellar_primer_completado()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.primer_completado_at IS NULL
       AND (COALESCE(NEW.player1_completed,false) OR COALESCE(NEW.player2_completed,false)) THEN
        NEW.primer_completado_at := now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sellar_primer_completado ON public.trivia_duelos;
CREATE TRIGGER trg_sellar_primer_completado
    BEFORE UPDATE ON public.trivia_duelos
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_trg_sellar_primer_completado();

-- 4.b Resuelve el duelo en cuanto la fila muestra a los dos jugadores listos.
--     Acá muere la condición de carrera: ya no importa quién lea primero ni si
--     el cliente que debía llamar al RPC se quedó sin internet.
CREATE OR REPLACE FUNCTION public.fn_trg_resolver_duelo_auto()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.fn_resolver_duelo(NEW.id, false);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_resolver_duelo_auto ON public.trivia_duelos;
CREATE TRIGGER trg_resolver_duelo_auto
    AFTER UPDATE ON public.trivia_duelos
    FOR EACH ROW
    -- La cláusula WHEN también corta la recursión: el UPDATE que hace
    -- fn_resolver_duelo deja status='finalizado' y no vuelve a disparar.
    WHEN (
        COALESCE(NEW.player1_completed, false)
        AND COALESCE(NEW.player2_completed, false)
        AND NEW.status IS DISTINCT FROM 'finalizado'
    )
    EXECUTE FUNCTION public.fn_trg_resolver_duelo_auto();

-- -------------------------------------------------------------------------
-- 5. COMPATIBILIDAD: fn_procesar_resultado_duelo SIGUE EXISTIENDO
-- -------------------------------------------------------------------------
-- El frontend actual la llama con los cinco parámetros. Se mantiene la firma
-- para no romper nada, pero ahora es una red de seguridad idempotente: delega
-- en fn_resolver_duelo, que lee los puntajes reales de la fila. Los parámetros
-- de puntaje quedan deliberadamente IGNORADOS — eran el vector por el cual un
-- cliente podía reportar el puntaje de su rival.

CREATE OR REPLACE FUNCTION public.fn_procesar_resultado_duelo(
    p_duelo_id        TEXT,
    p_player1_puntos  INT,
    p_player1_aciertos INT,
    p_player2_puntos  INT,
    p_player2_aciertos INT
)
RETURNS JSONB AS $$
BEGIN
    RETURN public.fn_resolver_duelo(p_duelo_id, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- -------------------------------------------------------------------------
-- 6. BARRIDO DE SALAS ABANDONADAS
-- -------------------------------------------------------------------------
-- Regla acordada: si un jugador terminó y el rival no aparece en 5 minutos,
-- gana quien jugó (+50) y el que abandonó pierde (-15).

CREATE OR REPLACE FUNCTION public.fn_barrer_duelos_abandonados(
    p_minutos INT DEFAULT 5
)
RETURNS JSONB AS $$
DECLARE
    r                RECORD;
    v_resueltos      INT := 0;
    v_salas_muertas  INT := 0;
BEGIN
    -- 6.a Abandonos: exactamente un jugador completó y venció el plazo.
    FOR r IN
        SELECT id
        FROM public.trivia_duelos
        WHERE status <> 'finalizado'
          AND COALESCE(player1_completed,false) <> COALESCE(player2_completed,false)
          AND primer_completado_at IS NOT NULL
          AND primer_completado_at < now() - make_interval(mins => p_minutos)
        FOR UPDATE SKIP LOCKED
    LOOP
        PERFORM public.fn_resolver_duelo(r.id, true);
        v_resueltos := v_resueltos + 1;
    END LOOP;

    -- 6.b Higiene: salas que nunca arrancaron o que nadie jugó no dejan MMR
    --     ni rastro útil, solo ensucian el listado de duelos públicos.
    DELETE FROM public.trivia_duelos
    WHERE status = 'esperando_rival'
      AND created_at < now() - interval '2 hours';
    GET DIAGNOSTICS v_salas_muertas = ROW_COUNT;

    DELETE FROM public.trivia_duelos
    WHERE status = 'en_curso'
      AND NOT COALESCE(player1_completed,false)
      AND NOT COALESCE(player2_completed,false)
      AND created_at < now() - interval '2 hours';

    RETURN jsonb_build_object(
        'success', true,
        'duelos_resueltos_por_abandono', v_resueltos,
        'salas_purgadas', v_salas_muertas
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- -------------------------------------------------------------------------
-- 7. TEMPORADAS: HISTORIAL Y CIERRE IDEMPOTENTE
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.trivia_temporadas (
    id           SERIAL PRIMARY KEY,
    nombre       TEXT NOT NULL,
    cerrada_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    campeon_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    campeon_pts  INTEGER,
    participantes INTEGER NOT NULL DEFAULT 0,
    detalle      JSONB
);

ALTER TABLE public.trivia_temporadas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica de temporadas" ON public.trivia_temporadas;
CREATE POLICY "Lectura publica de temporadas" ON public.trivia_temporadas
    FOR SELECT USING (true);

-- Marca de inicio de la temporada vigente: todo duelo finalizado después de
-- este instante es el que cuenta para el ranking actual. La auditoría la usa
-- para no "resucitar" puntos de temporadas ya cerradas.
CREATE OR REPLACE FUNCTION public.fn_inicio_temporada_vigente()
RETURNS TIMESTAMPTZ AS $$
    SELECT COALESCE(
        (SELECT MAX(cerrada_at) FROM public.trivia_temporadas),
        '2026-08-13 22:00:00+00'::TIMESTAMPTZ  -- arranque de la primera temporada
    );
$$ LANGUAGE sql STABLE;

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
BEGIN
    -- Guarda de idempotencia: si el cron se dispara dos veces (reintento,
    -- deploy, ejecución manual), la segunda no vuelve a repartir medallas
    -- sobre un ranking que ya quedó en cero.
    IF EXISTS (
        SELECT 1 FROM public.trivia_temporadas
        WHERE cerrada_at > now() - interval '12 hours'
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'omitido', true,
            'mensaje', 'Ya se cerró una temporada en las últimas 12 horas.'
        );
    END IF;

    v_nombre := COALESCE(
        p_nombre_temporada,
        'Temporada Semanal al ' ||
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

-- -------------------------------------------------------------------------
-- 8. AUDITORÍA: RECALCULAR EL MMR DESDE EL HISTORIAL DE DUELOS
-- -------------------------------------------------------------------------
-- Reconstruye puntos y récord de cada usuario reproduciendo, duelo por duelo y
-- en orden cronológico, la misma aritmética que aplica el juego (incluido el
-- clamp en cero, que hace que el orden importe). Solo considera los duelos
-- posteriores al último cierre de temporada.
--
--   SELECT public.fn_auditar_mmr(false);  -- simulacro: informa diferencias
--   SELECT public.fn_auditar_mmr(true);   -- aplica la corrección

CREATE OR REPLACE FUNCTION public.fn_auditar_mmr(
    p_aplicar BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
    d            RECORD;
    v_desde      TIMESTAMPTZ;
    v_divergentes INT := 0;
    v_duelos     INT := 0;
    v_muestra    JSONB := '[]'::JSONB;
BEGIN
    v_desde := public.fn_inicio_temporada_vigente();

    CREATE TEMP TABLE IF NOT EXISTS _mmr_calc (
        user_id   UUID PRIMARY KEY,
        puntos    INT NOT NULL DEFAULT 0,
        victorias INT NOT NULL DEFAULT 0,
        derrotas  INT NOT NULL DEFAULT 0,
        empates   INT NOT NULL DEFAULT 0
    ) ON COMMIT DROP;
    DELETE FROM _mmr_calc;

    FOR d IN
        SELECT player1_id, player2_id, ganador_id,
               COALESCE(delta_player1, CASE ganador_id
                    WHEN 'player1' THEN 50 WHEN 'player2' THEN -15 ELSE 25 END) AS d1,
               COALESCE(delta_player2, CASE ganador_id
                    WHEN 'player2' THEN 50 WHEN 'player1' THEN -15 ELSE 25 END) AS d2
        FROM public.trivia_duelos
        WHERE status = 'finalizado'
          AND ganador_id IN ('player1','player2','empate')
          AND COALESCE(finalizado_at, created_at) >= v_desde
        ORDER BY COALESCE(finalizado_at, created_at) ASC
    LOOP
        v_duelos := v_duelos + 1;

        IF d.player1_id IS NOT NULL THEN
            INSERT INTO _mmr_calc (user_id, puntos, victorias, derrotas, empates)
            VALUES (d.player1_id::uuid, GREATEST(0, d.d1),
                    (d.ganador_id = 'player1')::INT,
                    (d.ganador_id = 'player2')::INT,
                    (d.ganador_id = 'empate')::INT)
            ON CONFLICT (user_id) DO UPDATE SET
                puntos    = GREATEST(0, _mmr_calc.puntos + d.d1),
                victorias = _mmr_calc.victorias + (d.ganador_id = 'player1')::INT,
                derrotas  = _mmr_calc.derrotas  + (d.ganador_id = 'player2')::INT,
                empates   = _mmr_calc.empates   + (d.ganador_id = 'empate')::INT;
        END IF;

        IF d.player2_id IS NOT NULL THEN
            INSERT INTO _mmr_calc (user_id, puntos, victorias, derrotas, empates)
            VALUES (d.player2_id::uuid, GREATEST(0, d.d2),
                    (d.ganador_id = 'player2')::INT,
                    (d.ganador_id = 'player1')::INT,
                    (d.ganador_id = 'empate')::INT)
            ON CONFLICT (user_id) DO UPDATE SET
                puntos    = GREATEST(0, _mmr_calc.puntos + d.d2),
                victorias = _mmr_calc.victorias + (d.ganador_id = 'player2')::INT,
                derrotas  = _mmr_calc.derrotas  + (d.ganador_id = 'player1')::INT,
                empates   = _mmr_calc.empates   + (d.ganador_id = 'empate')::INT;
        END IF;
    END LOOP;

    -- Comparar contra lo que hoy tiene la tabla de estadísticas.
    SELECT COUNT(*), COALESCE(jsonb_agg(x) FILTER (WHERE x IS NOT NULL), '[]'::JSONB)
      INTO v_divergentes, v_muestra
    FROM (
        SELECT jsonb_build_object(
                   'user_id', e.user_id,
                   'puntos_actuales', e.puntos_totales,
                   'puntos_correctos', COALESCE(c.puntos, 0)
               ) AS x
        FROM public.trivia_estadisticas_usuario e
        LEFT JOIN _mmr_calc c ON c.user_id = e.user_id
        WHERE e.puntos_totales IS DISTINCT FROM COALESCE(c.puntos, 0)
        LIMIT 50
    ) s;

    IF p_aplicar THEN
        UPDATE public.trivia_estadisticas_usuario e
        SET puntos_totales  = COALESCE(c.puntos, 0),
            puntos_duelista = COALESCE(c.puntos, 0),
            victorias_duelo = COALESCE(c.victorias, 0),
            derrotas_duelo  = COALESCE(c.derrotas, 0),
            empates_duelo   = COALESCE(c.empates, 0),
            updated_at      = now()
        FROM (
            SELECT e2.user_id,
                   c2.puntos, c2.victorias, c2.derrotas, c2.empates
            FROM public.trivia_estadisticas_usuario e2
            LEFT JOIN _mmr_calc c2 ON c2.user_id = e2.user_id
        ) c
        WHERE c.user_id = e.user_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'aplicado', p_aplicar,
        'desde', v_desde,
        'duelos_considerados', v_duelos,
        'usuarios_divergentes', v_divergentes,
        'muestra', v_muestra
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- -------------------------------------------------------------------------
-- 9. PROGRAMACIÓN AUTOMÁTICA (pg_cron)
-- -------------------------------------------------------------------------
-- pg_cron interpreta los horarios en UTC. Buenos Aires es UTC-3 todo el año
-- (Argentina no aplica horario de verano), así que:
--     jueves 19:00 ART  ==  jueves 22:00 UTC  ->  '0 22 * * 4'
--
-- Si la extensión no está habilitada en el proyecto, la migración NO falla:
-- deja un aviso y las funciones quedan igualmente disponibles para invocarlas
-- a mano o desde una GitHub Action.

DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'pg_cron no pudo habilitarse (%). Activalo en Database > Extensions y reejecutá esta sección.', SQLERRM;
        RETURN;
    END;

    -- Reprogramar de cero para que la migración sea reejecutable.
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
        '0 22 * * 4',
        $cron$SELECT public.fn_cerrar_y_resetear_temporada();$cron$
    );

    RAISE NOTICE 'pg_cron programado: barrido de abandonos cada minuto y reset de temporada los jueves 19:00 ART.';
END
$$;

-- -------------------------------------------------------------------------
-- 10. PERMISOS
-- -------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.fn_resolver_duelo(TEXT, BOOLEAN)                    TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_procesar_resultado_duelo(TEXT, INT, INT, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_inicio_temporada_vigente()                        TO anon, authenticated;

-- Reservadas al backend / administración: no se exponen al cliente.
REVOKE EXECUTE ON FUNCTION public.fn_cerrar_y_resetear_temporada(TEXT) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_barrer_duelos_abandonados(INT)   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_auditar_mmr(BOOLEAN)             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fn_aplicar_delta_mmr(UUID, INT, TEXT) FROM anon, authenticated;
