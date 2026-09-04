-- =========================================================================
-- MIGRATION: NOTIFICACIONES DE DUELO PERSISTENTES Y MULTI-DISPOSITIVO
-- =========================================================================
-- Problema que resuelve: hasta ahora la notificación de "tu rival terminó"
-- la fabricaba el navegador del jugador que seguía con la pestaña abierta y
-- la guardaba en localStorage. Si cerraba la pestaña, cambiaba de teléfono o
-- limpiaba el caché, el resultado se perdía para siempre.
--
-- Ahora la emite el servidor en el mismo instante en que cierra el duelo, para
-- LOS DOS jugadores, y queda en la base hasta que cada uno la lee.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.trivia_notificaciones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo        TEXT NOT NULL DEFAULT 'duelo',
    titulo      TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    -- Datos crudos para que el frontend arme el detalle sin volver a consultar.
    data        JSONB NOT NULL DEFAULT '{}'::JSONB,
    leida       BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un duelo genera como máximo una notificación por jugador, pase lo que pase.
CREATE UNIQUE INDEX IF NOT EXISTS idx_trivia_notif_unica
    ON public.trivia_notificaciones (user_id, tipo, (data->>'duelo_id'))
    WHERE data ? 'duelo_id';

CREATE INDEX IF NOT EXISTS idx_trivia_notif_bandeja
    ON public.trivia_notificaciones (user_id, leida, created_at DESC);

ALTER TABLE public.trivia_notificaciones ENABLE ROW LEVEL SECURITY;

-- Cada estudiante ve y administra únicamente su propia bandeja.
DROP POLICY IF EXISTS "Lectura de notificaciones propias" ON public.trivia_notificaciones;
CREATE POLICY "Lectura de notificaciones propias" ON public.trivia_notificaciones
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Actualizacion de notificaciones propias" ON public.trivia_notificaciones;
CREATE POLICY "Actualizacion de notificaciones propias" ON public.trivia_notificaciones
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Borrado de notificaciones propias" ON public.trivia_notificaciones;
CREATE POLICY "Borrado de notificaciones propias" ON public.trivia_notificaciones
    FOR DELETE USING (auth.uid() = user_id);

-- Deliberadamente NO hay política de INSERT: las notificaciones las escribe
-- solo el servidor, vía trigger SECURITY DEFINER. Un cliente no puede
-- fabricarse una notificación ni mandarle una a otro usuario.

-- -------------------------------------------------------------------------
-- EMISIÓN AUTOMÁTICA AL CERRARSE EL DUELO
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_trg_notificar_duelo_finalizado()
RETURNS TRIGGER AS $$
DECLARE
    v_rival_de_p1 TEXT := COALESCE(NEW.player2_nombre, 'Rival');
    v_rival_de_p2 TEXT := COALESCE(NEW.player1_nombre, 'Rival');
    v_motivo_p1   TEXT;
    v_motivo_p2   TEXT;
BEGIN
    -- Texto según cómo terminó: juego completo o abandono del rival.
    IF NEW.por_abandono THEN
        v_motivo_p1 := CASE WHEN NEW.ganador_id = 'player1'
                            THEN v_rival_de_p1 || ' abandonó el duelo'
                            ELSE 'Abandonaste el duelo' END;
        v_motivo_p2 := CASE WHEN NEW.ganador_id = 'player2'
                            THEN v_rival_de_p2 || ' abandonó el duelo'
                            ELSE 'Abandonaste el duelo' END;
    ELSE
        v_motivo_p1 := v_rival_de_p1 || ' completó el duelo';
        v_motivo_p2 := v_rival_de_p2 || ' completó el duelo';
    END IF;

    IF NEW.player1_id IS NOT NULL THEN
        INSERT INTO public.trivia_notificaciones (user_id, tipo, titulo, descripcion, data)
        VALUES (
            NEW.player1_id::uuid,
            'duelo',
            '⚔️ Duelo 1v1: ' || COALESCE(NEW.materia_nombre, 'Trivia'),
            v_motivo_p1 || '. ' || CASE
                WHEN NEW.ganador_id = 'player1' THEN '¡Victoria! (+50 pts)'
                WHEN NEW.ganador_id = 'empate'  THEN '¡Empate! (+25 pts)'
                ELSE 'Derrota (-15 pts)' END,
            jsonb_build_object(
                'duelo_id', NEW.id,
                'materia_nombre', NEW.materia_nombre,
                'soy_player1', true,
                'ganador_id', NEW.ganador_id,
                'por_abandono', NEW.por_abandono,
                'mis_puntos', NEW.player1_puntos,
                'puntos_rival', NEW.player2_puntos,
                'mis_aciertos', NEW.player1_aciertos,
                'aciertos_rival', NEW.player2_aciertos,
                'rival_nombre', v_rival_de_p1,
                'delta_mmr', NEW.delta_player1
            )
        )
        ON CONFLICT DO NOTHING;
    END IF;

    IF NEW.player2_id IS NOT NULL THEN
        INSERT INTO public.trivia_notificaciones (user_id, tipo, titulo, descripcion, data)
        VALUES (
            NEW.player2_id::uuid,
            'duelo',
            '⚔️ Duelo 1v1: ' || COALESCE(NEW.materia_nombre, 'Trivia'),
            v_motivo_p2 || '. ' || CASE
                WHEN NEW.ganador_id = 'player2' THEN '¡Victoria! (+50 pts)'
                WHEN NEW.ganador_id = 'empate'  THEN '¡Empate! (+25 pts)'
                ELSE 'Derrota (-15 pts)' END,
            jsonb_build_object(
                'duelo_id', NEW.id,
                'materia_nombre', NEW.materia_nombre,
                'soy_player1', false,
                'ganador_id', NEW.ganador_id,
                'por_abandono', NEW.por_abandono,
                'mis_puntos', NEW.player2_puntos,
                'puntos_rival', NEW.player1_puntos,
                'mis_aciertos', NEW.player2_aciertos,
                'aciertos_rival', NEW.player1_aciertos,
                'rival_nombre', v_rival_de_p2,
                'delta_mmr', NEW.delta_player2
            )
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notificar_duelo_finalizado ON public.trivia_duelos;
CREATE TRIGGER trg_notificar_duelo_finalizado
    AFTER UPDATE ON public.trivia_duelos
    FOR EACH ROW
    WHEN (NEW.status = 'finalizado' AND OLD.status IS DISTINCT FROM 'finalizado')
    EXECUTE FUNCTION public.fn_trg_notificar_duelo_finalizado();

-- -------------------------------------------------------------------------
-- REALTIME: entrega en vivo sin polling
-- -------------------------------------------------------------------------
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_notificaciones;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN undefined_object THEN
            RAISE NOTICE 'La publicación supabase_realtime no existe en este entorno; omitido.';
    END;
END
$$;

-- -------------------------------------------------------------------------
-- RECUPERACIÓN: rellenar la bandeja con los duelos ya finalizados
-- -------------------------------------------------------------------------
-- Para que ningún jugador de la beta se quede sin ver un resultado que se
-- perdió mientras las notificaciones vivían solo en localStorage.

-- El filtro de formato UUID evita que un id corrupto/de prueba aborte todo
-- el backfill (player1_id/player2_id llegan a esta base como TEXT).
INSERT INTO public.trivia_notificaciones (user_id, tipo, titulo, descripcion, data, leida, created_at)
SELECT d.player1_id::uuid, 'duelo',
       '⚔️ Duelo 1v1: ' || COALESCE(d.materia_nombre, 'Trivia'),
       COALESCE(d.player2_nombre, 'Rival') || ' completó el duelo. ' || CASE
            WHEN d.ganador_id = 'player1' THEN '¡Victoria! (+50 pts)'
            WHEN d.ganador_id = 'empate'  THEN '¡Empate! (+25 pts)'
            ELSE 'Derrota (-15 pts)' END,
       jsonb_build_object('duelo_id', d.id, 'materia_nombre', d.materia_nombre,
                          'soy_player1', true, 'ganador_id', d.ganador_id,
                          'rival_nombre', COALESCE(d.player2_nombre,'Rival'),
                          'recuperada', true),
       true,  -- se marcan leídas: son historial, no deben explotar el badge
       COALESCE(d.finalizado_at, d.created_at)
FROM public.trivia_duelos d
WHERE d.status = 'finalizado'
  AND d.player1_id IS NOT NULL
  AND d.player1_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT DO NOTHING;

INSERT INTO public.trivia_notificaciones (user_id, tipo, titulo, descripcion, data, leida, created_at)
SELECT d.player2_id::uuid, 'duelo',
       '⚔️ Duelo 1v1: ' || COALESCE(d.materia_nombre, 'Trivia'),
       COALESCE(d.player1_nombre, 'Rival') || ' completó el duelo. ' || CASE
            WHEN d.ganador_id = 'player2' THEN '¡Victoria! (+50 pts)'
            WHEN d.ganador_id = 'empate'  THEN '¡Empate! (+25 pts)'
            ELSE 'Derrota (-15 pts)' END,
       jsonb_build_object('duelo_id', d.id, 'materia_nombre', d.materia_nombre,
                          'soy_player1', false, 'ganador_id', d.ganador_id,
                          'rival_nombre', COALESCE(d.player1_nombre,'Rival'),
                          'recuperada', true),
       true,
       COALESCE(d.finalizado_at, d.created_at)
FROM public.trivia_duelos d
WHERE d.status = 'finalizado'
  AND d.player2_id IS NOT NULL
  AND d.player2_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT DO NOTHING;

GRANT SELECT, UPDATE, DELETE ON public.trivia_notificaciones TO authenticated;
