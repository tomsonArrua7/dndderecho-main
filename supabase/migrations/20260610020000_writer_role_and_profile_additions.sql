-- 1. Add new columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS anio_ingreso integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Update handle_new_user trigger function to include anio_ingreso from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, anio_ingreso)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    (NEW.raw_user_meta_data->>'anio_ingreso')::integer
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

-- 3. Create noticias table
CREATE TABLE IF NOT EXISTS public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  desc_content TEXT NOT NULL,
  tag TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on noticias
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for noticias
DROP POLICY IF EXISTS "Allow public select on noticias" ON public.noticias;
CREATE POLICY "Allow public select on noticias" ON public.noticias
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin/writer insert on noticias" ON public.noticias;
CREATE POLICY "Allow admin/writer insert on noticias" ON public.noticias
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    )
  );

DROP POLICY IF EXISTS "Allow admin/writer update on noticias" ON public.noticias;
CREATE POLICY "Allow admin/writer update on noticias" ON public.noticias
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    )
  );

DROP POLICY IF EXISTS "Allow admin/writer delete on noticias" ON public.noticias;
CREATE POLICY "Allow admin/writer delete on noticias" ON public.noticias
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'escritor')
    )
  );

-- 6. Trigger to update updated_at automatically on noticias
DROP TRIGGER IF EXISTS trg_noticias_updated ON public.noticias;
CREATE TRIGGER trg_noticias_updated
  BEFORE UPDATE ON public.noticias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Seed initial static news
INSERT INTO public.noticias (title, desc_content, tag, created_at)
VALUES
  ('Inscripciones a permutas 2do cuatrimestre', 'Recordatorio: las solicitudes oficiales se cargan en SIU. Mientras tanto, usá el Permutero.', 'Cursada', now() - interval '1 day'),
  ('Asamblea estudiantil sobre nuevo plan', 'Convocamos a debatir las modificaciones del plan de estudios. Participación abierta.', 'Asamblea', now() - interval '3 days'),
  ('Nuevos resúmenes de Civil III subidos', 'Disponibles en la sección de Apuntes. Hechos por estudiantes que aprobaron en marzo.', 'Apuntes', now() - interval '10 days');

-- 8. Storage bucket for avatars (Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage policies for avatars bucket
DROP POLICY IF EXISTS "Allow public read on avatars" ON storage.objects;
CREATE POLICY "Allow public read on avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow auth upload on avatars" ON storage.objects;
CREATE POLICY "Allow auth upload on avatars" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow users to manage own avatars" ON storage.objects;
CREATE POLICY "Allow users to manage own avatars" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'avatars');
