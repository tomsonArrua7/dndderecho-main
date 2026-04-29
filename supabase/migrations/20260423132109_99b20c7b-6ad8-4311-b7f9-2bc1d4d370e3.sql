
-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  anio_cursada INT,
  telefono TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated"
  ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- =========================
-- MATERIAS (catálogo público)
-- =========================
CREATE TABLE public.materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  anio INT NOT NULL,
  codigo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Materias publicas"
  ON public.materias FOR SELECT USING (true);

-- =========================
-- USER_MATERIAS (plan de estudios por usuario)
-- =========================
CREATE TYPE public.estado_materia AS ENUM ('pendiente','cursando','aprobada');

CREATE TABLE public.user_materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia_id UUID NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
  estado public.estado_materia NOT NULL DEFAULT 'pendiente',
  nota INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, materia_id)
);
ALTER TABLE public.user_materias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own user_materias select"
  ON public.user_materias FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own user_materias insert"
  ON public.user_materias FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own user_materias update"
  ON public.user_materias FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own user_materias delete"
  ON public.user_materias FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================
-- EVENTOS (calendario)
-- =========================
CREATE TYPE public.tipo_evento AS ENUM ('parcial','final','entrega','clase','otro');

CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo public.tipo_evento NOT NULL DEFAULT 'otro',
  fecha TIMESTAMPTZ NOT NULL,
  materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own eventos select"
  ON public.eventos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own eventos insert"
  ON public.eventos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own eventos update"
  ON public.eventos FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own eventos delete"
  ON public.eventos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================
-- PERMUTAS
-- =========================
CREATE TABLE public.permutas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia_id UUID NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
  comision_tiene INT NOT NULL,
  comisiones_busca INT[] NOT NULL,
  telefono TEXT NOT NULL,
  nombre_contacto TEXT NOT NULL,
  notas TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.permutas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permutas activas son publicas"
  ON public.permutas FOR SELECT USING (activa = true OR auth.uid() = user_id);
CREATE POLICY "Insert own permuta"
  ON public.permutas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own permuta"
  ON public.permutas FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Delete own permuta"
  ON public.permutas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================
-- MATCHES
-- =========================
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permuta_a UUID NOT NULL REFERENCES public.permutas(id) ON DELETE CASCADE,
  permuta_b UUID NOT NULL REFERENCES public.permutas(id) ON DELETE CASCADE,
  user_a UUID NOT NULL,
  user_b UUID NOT NULL,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(permuta_a, permuta_b)
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own matches"
  ON public.matches FOR SELECT TO authenticated
  USING (auth.uid() = user_a OR auth.uid() = user_b);

-- =========================
-- TRIGGER: updated_at helper
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_user_materias_updated BEFORE UPDATE ON public.user_materias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_permutas_updated BEFORE UPDATE ON public.permutas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- TRIGGER: auto crear profile al signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- TRIGGER: detectar match al insertar/actualizar permuta
-- =========================
CREATE OR REPLACE FUNCTION public.detect_permuta_match()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r RECORD;
BEGIN
  IF NEW.activa = false THEN
    RETURN NEW;
  END IF;

  FOR r IN
    SELECT * FROM public.permutas p
    WHERE p.activa = true
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

CREATE TRIGGER trg_detect_match
  AFTER INSERT OR UPDATE ON public.permutas
  FOR EACH ROW EXECUTE FUNCTION public.detect_permuta_match();
