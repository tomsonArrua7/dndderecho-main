-- Add 'academico' value to public.tipo_evento enum if not exists
ALTER TYPE public.tipo_evento ADD VALUE IF NOT EXISTS 'academico';

-- Update select policy for public.eventos so both authenticated and anon can view global events
DROP POLICY IF EXISTS "Own and global eventos select" ON public.eventos;
CREATE POLICY "Own and global eventos select" ON public.eventos
  FOR SELECT TO authenticated, anon
  USING (auth.uid() = user_id OR es_global = true);
