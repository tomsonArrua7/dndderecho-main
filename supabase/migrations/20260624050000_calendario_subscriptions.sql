-- 1. Add suscripto_calendario column to public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suscripto_calendario BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. Add es_global column to public.eventos
ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS es_global BOOLEAN DEFAULT FALSE NOT NULL;

-- 3. Update select policy for eventos
DROP POLICY IF EXISTS "Own eventos select" ON public.eventos;
CREATE POLICY "Own and global eventos select" ON public.eventos
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR es_global = true);

-- 4. Update insert policy for eventos
DROP POLICY IF EXISTS "Own eventos insert" ON public.eventos;
CREATE POLICY "Own and global eventos insert" ON public.eventos
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND (
      es_global = false OR 
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
      )
    )
  );

-- 5. Update update policy for eventos
DROP POLICY IF EXISTS "Own eventos update" ON public.eventos;
CREATE POLICY "Own and global eventos update" ON public.eventos
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id OR 
    (es_global = true AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    ))
  )
  WITH CHECK (
    auth.uid() = user_id AND (
      es_global = false OR 
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
      )
    )
  );

-- 6. Update delete policy for eventos
DROP POLICY IF EXISTS "Own eventos delete" ON public.eventos;
CREATE POLICY "Own and global eventos delete" ON public.eventos
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id OR 
    (es_global = true AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    ))
  );
