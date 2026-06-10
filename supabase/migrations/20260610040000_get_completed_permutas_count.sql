-- Migration: Add secure function to count completed swaps bypassing RLS for guest users

CREATE OR REPLACE FUNCTION public.get_completed_permutas_count()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.permutas WHERE status = 'realizada');
END $$;

GRANT EXECUTE ON FUNCTION public.get_completed_permutas_count() TO anon, authenticated;
