-- Memoria de preguntas ya servidas a cada usuario.
--
-- Hasta ahora cada partida sorteaba sobre el banco completo, sin recordar nada:
-- simulando con el banco real, a los 20 duelos un jugador ya repetía ~9
-- preguntas y a los 40 más de 30. El cuello de botella es la rama fija de la
-- temporada, de la que salen 3 de las 5 preguntas de todos los duelos.
--
-- Con esta tabla la selección prioriza lo no visto y sólo vuelve a repetir
-- cuando el jugador agotó el pool de la rama.

CREATE TABLE IF NOT EXISTS public.trivia_preguntas_vistas (
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pregunta_id TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, pregunta_id)
);

CREATE INDEX IF NOT EXISTS idx_vistas_usuario ON public.trivia_preguntas_vistas (user_id);

ALTER TABLE public.trivia_preguntas_vistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ver mis preguntas vistas" ON public.trivia_preguntas_vistas;
CREATE POLICY "Ver mis preguntas vistas" ON public.trivia_preguntas_vistas
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Registrar mis preguntas vistas" ON public.trivia_preguntas_vistas;
CREATE POLICY "Registrar mis preguntas vistas" ON public.trivia_preguntas_vistas
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- El reset de temporada NO borra esto a propósito: que la temporada reinicie el
-- ranking no significa que el alumno no haya visto ya esas preguntas.
