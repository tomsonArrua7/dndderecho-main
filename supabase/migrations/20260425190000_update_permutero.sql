-- Create role enum and add to profiles
CREATE TYPE public.user_role AS ENUM ('estudiante', 'admin');
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'estudiante';

-- Create estado_permuta enum and add to permutas
CREATE TYPE public.estado_permuta AS ENUM ('activa', 'realizada', 'cancelada');
ALTER TABLE public.permutas ADD COLUMN status public.estado_permuta DEFAULT 'activa';

-- Update the match detection function to use status instead of just activa
CREATE OR REPLACE FUNCTION public.detect_permuta_match()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r RECORD;
BEGIN
  IF NEW.status != 'activa' THEN
    RETURN NEW;
  END IF;

  FOR r IN
    SELECT * FROM public.permutas p
    WHERE p.status = 'activa'
      AND p.user_id <> NEW.user_id
      AND p.materia_id = NEW.materia_id
      AND p.comision_tiene = ANY(NEW.comisiones_busca)
      AND NEW.comision_tiene = ANY(p.comisiones_busca)
  LOOP
    INSERT INTO public.matches (permuta_a, permuta_b, user_a, user_b)
    VALUES (
      LEAST(NEW.id, r.id),
      GREATEST(NEW.id, r.id),
      CASE WHEN NEW.id < r.id THEN NEW.user_id ELSE r.user_id END,
      CASE WHEN NEW.id < r.id THEN r.user_id ELSE NEW.user_id END
    )
    ON CONFLICT (permuta_a, permuta_b) DO NOTHING;
  END LOOP;
  RETURN NEW;
END $$;

-- Update RLS for Permutas
DROP POLICY IF EXISTS "Permutas activas son publicas" ON public.permutas;
CREATE POLICY "Permutas activas son publicas" ON public.permutas FOR SELECT USING (
  status = 'activa' OR auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Update own permuta" ON public.permutas;
CREATE POLICY "Update own permuta" ON public.permutas FOR UPDATE TO authenticated USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Delete own permuta" ON public.permutas;
CREATE POLICY "Delete own permuta" ON public.permutas FOR DELETE TO authenticated USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- App Settings table
CREATE TABLE public.app_settings (
  id INT PRIMARY KEY DEFAULT 1,
  permutero_activo BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings public viewable" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admins update settings" ON public.app_settings FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
CREATE POLICY "Admins insert settings" ON public.app_settings FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

INSERT INTO public.app_settings (id, permutero_activo) VALUES (1, true) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_app_settings_updated BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
