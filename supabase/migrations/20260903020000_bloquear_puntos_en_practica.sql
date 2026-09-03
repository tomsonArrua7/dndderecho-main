-- =========================================================================
-- MIGRATION: BLOQUEAR DEFINITIVAMENTE PUNTOS DE RANGO EN MODO PRACTICA
-- =========================================================================

-- 1. ACTUALIZAR FUNCION DEL TRIGGER DE PARTIDAS INDIVIDUALES
-- Garantiza que insertar una partida de practica NUNCA modifique puntos_totales ni puntos_duelista.
CREATE OR REPLACE FUNCTION public.fn_actualizar_estadisticas_trivia()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (
            user_id, puntos_totales, puntos_duelista, partidas_jugadas, total_preguntas, total_aciertos, mejor_racha, materia_favorita, updated_at
        )
        VALUES (
            NEW.user_id, 0, 0, 1, NEW.total_preguntas, NEW.aciertos, NEW.racha_maxima, NEW.categoria_id, now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            -- puntos_totales y puntos_duelista PERMANECEN INTACTOS (solo duelos 1vs1 suman o restan)
            partidas_jugadas = trivia_estadisticas_usuario.partidas_jugadas + 1,
            total_preguntas = trivia_estadisticas_usuario.total_preguntas + EXCLUDED.total_preguntas,
            total_aciertos = trivia_estadisticas_usuario.total_aciertos + EXCLUDED.total_aciertos,
            mejor_racha = GREATEST(trivia_estadisticas_usuario.mejor_racha, EXCLUDED.mejor_racha),
            materia_favorita = EXCLUDED.materia_favorita,
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger asegurando su ejecucion
DROP TRIGGER IF EXISTS trg_actualizar_estadisticas_trivia ON public.trivia_partidas;

CREATE TRIGGER trg_actualizar_estadisticas_trivia
AFTER INSERT ON public.trivia_partidas
FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_estadisticas_trivia();

-- 2. PURGAR PUNTOS INDEBIDAMENTE SUMADOS POR PRACTICAS
-- Hace que puntos_totales sea identico a puntos_duelista (los puntos reales obtenidos en 1v1).
UPDATE public.trivia_estadisticas_usuario
SET puntos_totales = GREATEST(0, COALESCE(puntos_duelista, 0));

-- Resetear columna puntos de trivia_partidas a 0
UPDATE public.trivia_partidas
SET puntos = 0;
