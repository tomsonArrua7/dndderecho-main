-- =========================
-- USER_PLAN_PROGRESS (plan de estudios por usuario, con IDs de texto del plan)
-- =========================
-- Reemplaza el uso de user_materias para el plan de estudios.
-- Usa materia_codigo TEXT para coincidir con los IDs del plan estructural (e.g. "10100")

CREATE TABLE IF NOT EXISTS public.user_plan_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id     TEXT NOT NULL, -- "plan5" or "plan6"
  materia_id  TEXT NOT NULL, -- ID del plan estructural, e.g. "10100"
  estado      TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'cursando', 'aprobada'
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_id, materia_id)
);

ALTER TABLE public.user_plan_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own plan progress select"
  ON public.user_plan_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Own plan progress insert"
  ON public.user_plan_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Own plan progress update"
  ON public.user_plan_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Own plan progress delete"
  ON public.user_plan_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_plan_progress_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TRIGGER trg_plan_progress_updated
  BEFORE UPDATE ON public.user_plan_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_plan_progress_updated_at();
