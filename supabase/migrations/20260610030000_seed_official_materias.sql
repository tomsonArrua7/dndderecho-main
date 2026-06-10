-- Migration: Seed official materias catalog from Plan 5 and Plan 6

-- 1. Add plan_id column to public.permutas
ALTER TABLE public.permutas ADD COLUMN IF NOT EXISTS plan_id text NOT NULL DEFAULT 'plan6';

-- 2. Clear old data to avoid foreign key conflicts
DELETE FROM public.matches;
DELETE FROM public.permutas;
DELETE FROM public.materias;

-- 3. Seed materias catalog
INSERT INTO public.materias (nombre, anio, codigo)
VALUES
  ('Introducción al Estudio de las Ciencias Sociales', 1, '10610'),
  ('Introducción al Derecho', 1, '10111'),
  ('Historia Constitucional', 1, '10112'),
  ('Introducción a la Sociología', 1, '10113'),
  ('Introducción al Pensamiento Científico', 1, '10616'),
  ('Derecho Romano', 1, '10121'),
  ('Derecho Político', 1, '10114'),
  ('Derecho Privado I - Civil', 2, '10122'),
  ('Derecho Privado II - Civil', 2, '10123'),
  ('Derecho Penal I', 2, '10124'),
  ('Derecho Constitucional', 2, '10125'),
  ('Derechos Humanos', 2, '10626'),
  ('Teoría del Conflicto', 2, '10627'),
  ('Taller de lecto-comprensión en Idioma I', 2, '10617'),
  ('Derecho Privado IV - Comercial', 3, '10132'),
  ('Derecho Privado III - Civil', 3, '10133'),
  ('Derecho Procesal I', 3, '10134'),
  ('Economía Política', 3, '10115'),
  ('Derecho Penal II', 3, '10135'),
  ('Derecho Público, Provincial y Municipal', 3, '10136'),
  ('Derecho Internacional Público', 3, '10138'),
  ('Taller de lecto-comprensión en Idioma II', 3, '10618'),
  ('Derecho Administrativo I', 4, '10141'),
  ('Derecho Privado VI - Comercial', 4, '10142'),
  ('Derecho Privado V - Civil', 4, '10143'),
  ('Derecho Procesal II', 4, '10144'),
  ('Derecho Social del Trabajo', 4, '10640'),
  ('Mediación y Medios de Resolución de Conflictos', 4, '10649'),
  ('Derecho Agrario', 4, '10146'),
  ('Filosofía del Derecho', 4, '10147'),
  ('Seminario', 4, '10179'),
  ('Derecho Administrativo II', 5, '10151'),
  ('Derecho de Familia', 5, '10653'),
  ('Derecho de la Navegación', 5, '10152'),
  ('Derecho Colectivo del Trabajo y Seg. Social', 5, '10650'),
  ('Derecho de Minería y Energía', 5, '10154'),
  ('Sociología Jurídica', 5, '10155'),
  ('Derecho Internacional Privado', 5, '10156'),
  ('Derecho de las Sucesiones', 5, '10659'),
  ('Derecho Notarial y Registral', 5, '10157'),
  ('Finanzas y Derecho Financiero', 5, '10158'),
  ('Práctica Supervisada Pre-profesional', 5, '10657'),
  ('Adaptaciones Profesionales Penales', 5, '10137'),
  ('Adaptaciones Profesionales Civiles', 5, '10148'),
  ('Derecho Social del trabajo y prevención', 4, '10145'),
  ('Derecho Civil V', 5, '10153')
ON CONFLICT (nombre) DO NOTHING;

-- 4. Update matching trigger to check plan_id
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
      AND p.plan_id = NEW.plan_id -- Match only same plan
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
