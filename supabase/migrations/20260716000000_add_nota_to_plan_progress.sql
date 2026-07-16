-- Agregar columna nota a la tabla user_plan_progress
ALTER TABLE public.user_plan_progress ADD COLUMN IF NOT EXISTS nota NUMERIC;
