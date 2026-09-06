-- Feedback de la plataforma y reportes de preguntas de la Trivia.
--
--   * trivia_reportes_pregunta  -> un alumno marca una pregunta como errónea.
--   * trivia_preguntas_ocultas  -> preguntas retiradas de circulación. Se llena
--                                  sola al tercer reporte y también a mano desde
--                                  el panel. El cliente la lee para filtrar.
--   * feedback_general          -> encuesta corta con estrellas por herramienta.

-- -------------------------------------------------------------------------
-- 1. REPORTES DE PREGUNTAS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trivia_reportes_pregunta (
    id          BIGSERIAL PRIMARY KEY,
    pregunta_id TEXT NOT NULL,
    user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    motivo      TEXT NOT NULL CHECK (motivo IN ('respuesta_incorrecta', 'redaccion', 'desactualizada', 'otro')),
    comentario  TEXT,
    -- Copia del enunciado al momento del reporte: el banco se regenera desde
    -- los documentos de cátedra y los ids podrían cambiar, así que sin esto un
    -- reporte viejo quedaría sin contexto para corregirlo.
    pregunta_texto TEXT,
    materia     TEXT,
    origen      TEXT,
    resuelto    BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (pregunta_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reportes_pregunta ON public.trivia_reportes_pregunta (pregunta_id);
CREATE INDEX IF NOT EXISTS idx_reportes_pendientes ON public.trivia_reportes_pregunta (resuelto, created_at DESC);

ALTER TABLE public.trivia_reportes_pregunta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reportar preguntas propias" ON public.trivia_reportes_pregunta;
CREATE POLICY "Reportar preguntas propias" ON public.trivia_reportes_pregunta
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Sólo administración lee los reportes: el alumno no tiene por qué saber
-- cuántas veces se reportó una pregunta ni si quedó oculta.
DROP POLICY IF EXISTS "Solo admin lee reportes" ON public.trivia_reportes_pregunta;
CREATE POLICY "Solo admin lee reportes" ON public.trivia_reportes_pregunta
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Solo admin actualiza reportes" ON public.trivia_reportes_pregunta;
CREATE POLICY "Solo admin actualiza reportes" ON public.trivia_reportes_pregunta
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- -------------------------------------------------------------------------
-- 2. PREGUNTAS RETIRADAS DE CIRCULACIÓN
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trivia_preguntas_ocultas (
    pregunta_id TEXT PRIMARY KEY,
    motivo      TEXT,
    automatica  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trivia_preguntas_ocultas ENABLE ROW LEVEL SECURITY;

-- Lectura abierta: el cliente necesita la lista para no servir esas preguntas.
-- Es sólo un listado de ids, no revela nada del reporte.
DROP POLICY IF EXISTS "Lectura de preguntas ocultas" ON public.trivia_preguntas_ocultas;
CREATE POLICY "Lectura de preguntas ocultas" ON public.trivia_preguntas_ocultas
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo admin gestiona ocultas" ON public.trivia_preguntas_ocultas;
CREATE POLICY "Solo admin gestiona ocultas" ON public.trivia_preguntas_ocultas
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Al tercer reporte de personas distintas, la pregunta sale de circulación sin
-- avisarle a nadie. Queda en el panel para que se corrija en el documento de
-- origen y se vuelva a habilitar.
CREATE OR REPLACE FUNCTION public.fn_ocultar_pregunta_muy_reportada()
RETURNS TRIGGER AS $$
DECLARE
    v_reportes INT;
BEGIN
    SELECT COUNT(DISTINCT user_id) INTO v_reportes
    FROM public.trivia_reportes_pregunta
    WHERE pregunta_id = NEW.pregunta_id;

    IF v_reportes >= 3 THEN
        INSERT INTO public.trivia_preguntas_ocultas (pregunta_id, motivo, automatica)
        VALUES (NEW.pregunta_id, 'Retirada automáticamente tras ' || v_reportes || ' reportes.', true)
        ON CONFLICT (pregunta_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_ocultar_pregunta_muy_reportada ON public.trivia_reportes_pregunta;
CREATE TRIGGER trg_ocultar_pregunta_muy_reportada
    AFTER INSERT ON public.trivia_reportes_pregunta
    FOR EACH ROW EXECUTE FUNCTION public.fn_ocultar_pregunta_muy_reportada();

-- -------------------------------------------------------------------------
-- 3. ENCUESTA GENERAL
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_general (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Estrellas por herramienta: { "trivia": 5, "biblioteca": 4, ... }.
    -- Va en jsonb para poder sumar o sacar herramientas sin migrar la tabla.
    puntajes    JSONB NOT NULL DEFAULT '{}'::jsonb,
    comentario  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_reciente ON public.feedback_general (created_at DESC);

ALTER TABLE public.feedback_general ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enviar feedback propio" ON public.feedback_general;
CREATE POLICY "Enviar feedback propio" ON public.feedback_general
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Ver si ya envie feedback" ON public.feedback_general;
CREATE POLICY "Ver si ya envie feedback" ON public.feedback_general
    FOR SELECT TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );
