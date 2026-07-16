-- Agregar columna modo_mantenimiento a la tabla app_settings
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS modo_mantenimiento BOOLEAN NOT NULL DEFAULT false;
