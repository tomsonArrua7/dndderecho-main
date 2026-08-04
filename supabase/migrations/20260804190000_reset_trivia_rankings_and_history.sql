-- Migration: Resetear completo de tablas de estadísticas, partidas e historial de duelos de Trivia

-- 1. Vaciar registros acumulados de usuarios en el ranking
TRUNCATE TABLE public.trivia_estadisticas_usuario CASCADE;

-- 2. Vaciar historial de partidas jugadas
TRUNCATE TABLE public.trivia_partidas CASCADE;

-- 3. Vaciar salas de duelo 1vs1
TRUNCATE TABLE public.trivia_duelos CASCADE;
