-- Migration: Add personas_permutadas_count to app_settings, update_personas_permutadas_count, and increment_personas_permutadas RPC

ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS personas_permutadas_count integer DEFAULT 0;

-- Function to safely update personas_permutadas_count bypassing PostgREST schema cache
CREATE OR REPLACE FUNCTION public.update_personas_permutadas_count(new_val integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.app_settings
  SET personas_permutadas_count = new_val
  WHERE id = 1;

  IF NOT FOUND THEN
    INSERT INTO public.app_settings (id, personas_permutadas_count)
    VALUES (1, new_val);
  END IF;

  RETURN new_val;
END $$;

-- Function to safely increment personas_permutadas_count
CREATE OR REPLACE FUNCTION public.increment_personas_permutadas(inc_val integer DEFAULT 2)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.app_settings
  SET personas_permutadas_count = COALESCE(personas_permutadas_count, 0) + inc_val
  WHERE id = 1
  RETURNING personas_permutadas_count INTO new_count;

  IF NOT FOUND THEN
    INSERT INTO public.app_settings (id, personas_permutadas_count)
    VALUES (1, inc_val)
    RETURNING personas_permutadas_count INTO new_count;
  END IF;

  RETURN COALESCE(new_count, 0);
END $$;

-- Update get_completed_permutas_count to sum persistent count + active realized count
CREATE OR REPLACE FUNCTION public.get_completed_permutas_count()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN COALESCE((SELECT personas_permutadas_count FROM public.app_settings WHERE id = 1), 0)
       + COALESCE((SELECT COUNT(*) FROM public.permutas WHERE status = 'realizada'), 0);
END $$;

GRANT EXECUTE ON FUNCTION public.update_personas_permutadas_count(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_personas_permutadas(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_completed_permutas_count() TO anon, authenticated;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
