-- ==========================================
-- TRIGGER: notify match via email webhook
-- ==========================================
-- Invokes the send-match-email Edge Function using pg_net when a new match is created.

CREATE OR REPLACE FUNCTION public.notify_match_via_email()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Execute asynchronous HTTP POST call to the internal edge function runtime container
  PERFORM net.http_post(
    url := 'http://supabase-edge-functions:9000/send-match-email',
    body := jsonb_build_object('record', row_to_json(NEW)::jsonb),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_match_email ON public.matches;

CREATE TRIGGER trg_notify_match_email
AFTER INSERT ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.notify_match_via_email();
