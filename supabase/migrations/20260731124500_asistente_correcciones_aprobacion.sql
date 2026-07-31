-- Add aprobado column to asistente_correcciones
ALTER TABLE public.asistente_correcciones ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT false NOT NULL;

-- Mark pre-existing admin corrections as approved by default
UPDATE public.asistente_correcciones SET aprobado = true WHERE aprobado IS FALSE;
