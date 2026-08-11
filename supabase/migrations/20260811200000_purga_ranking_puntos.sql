-- ========================================================================
-- MIGRACIÓN DE PURGA TOTAL DE RANKINGS, PUNTOS Y HISTORIAL DE DUELOS
-- ========================================================================

-- 1. Reset de puntos y estadísticas de todos los usuarios
UPDATE public.trivia_estadisticas_usuario
SET 
  puntos_totales = 0,
  victorias_duelo = 0,
  derrotas_duelo = 0,
  empates_duelo = 0,
  puntos_duelista = 0,
  partidas_jugadas = 0,
  mejor_racha = 0,
  racha_actual = 0,
  aciertos_totales = 0,
  preguntas_totales = 0,
  updated_at = NOW();

-- 2. Limpieza de tablas de duelos, partidas y medallas
TRUNCATE TABLE public.trivia_duelos CASCADE;
TRUNCATE TABLE public.trivia_partidas CASCADE;
TRUNCATE TABLE public.trivia_medallas_usuario CASCADE;
