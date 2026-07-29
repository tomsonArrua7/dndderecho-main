-- 1. Create table for assistant corrections and feedback
CREATE TABLE IF NOT EXISTS public.asistente_correcciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  materia TEXT NOT NULL,
  catedra TEXT,
  comision TEXT,
  pregunta_original TEXT NOT NULL,
  respuesta_original TEXT,
  respuesta_corregida TEXT NOT NULL,
  creado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.asistente_correcciones ENABLE ROW LEVEL SECURITY;

-- 3. Select policy for everyone
DROP POLICY IF EXISTS "Anyone can read asistente_correcciones" ON public.asistente_correcciones;
CREATE POLICY "Anyone can read asistente_correcciones" ON public.asistente_correcciones
  FOR SELECT TO public USING (true);

-- 4. Insert policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert asistente_correcciones" ON public.asistente_correcciones;
CREATE POLICY "Authenticated users can insert asistente_correcciones" ON public.asistente_correcciones
  FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Update policy for admins and writers
DROP POLICY IF EXISTS "Admins can update asistente_correcciones" ON public.asistente_correcciones;
CREATE POLICY "Admins can update asistente_correcciones" ON public.asistente_correcciones
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    )
  );

-- 6. Delete policy for admins and writers
DROP POLICY IF EXISTS "Admins can delete asistente_correcciones" ON public.asistente_correcciones;
CREATE POLICY "Admins can delete asistente_correcciones" ON public.asistente_correcciones
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    )
  );
