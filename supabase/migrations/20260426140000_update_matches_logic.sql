-- =========================
-- TRIGGER: eliminar matches inactivos o finalizados
-- =========================
CREATE OR REPLACE FUNCTION public.cleanup_inactive_matches()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- If the permuta is no longer active, delete associated matches
  IF NEW.status != 'activa' THEN
    DELETE FROM public.matches 
    WHERE permuta_a = NEW.id OR permuta_b = NEW.id;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_cleanup_inactive_matches ON public.permutas;

CREATE TRIGGER trg_cleanup_inactive_matches
AFTER UPDATE ON public.permutas
FOR EACH ROW
WHEN (OLD.status = 'activa' AND NEW.status != 'activa')
EXECUTE FUNCTION public.cleanup_inactive_matches();
