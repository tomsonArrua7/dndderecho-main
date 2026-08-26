-- Migration: Add permutas_historico_periodos table and archiving RPC for permanent stats preservation

CREATE TABLE IF NOT EXISTS public.permutas_historico_periodos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_periodo TEXT NOT NULL,
  fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_cierre TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_permutas INT NOT NULL DEFAULT 0,
  total_realizadas INT NOT NULL DEFAULT 0,
  total_activas INT NOT NULL DEFAULT 0,
  total_canceladas INT NOT NULL DEFAULT 0,
  personas_beneficiadas INT NOT NULL DEFAULT 0,
  stats_por_anio JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats_por_materia JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats_comisiones JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_data_backup JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.permutas_historico_periodos ENABLE ROW LEVEL SECURITY;

-- Lectura permitida para todos
DROP POLICY IF EXISTS "Permutas historico legible por todos" ON public.permutas_historico_periodos;
CREATE POLICY "Permutas historico legible por todos" 
  ON public.permutas_historico_periodos FOR SELECT USING (true);

-- Inserción / modificación por administradores
DROP POLICY IF EXISTS "Permutas historico gestionable por admin" ON public.permutas_historico_periodos;
CREATE POLICY "Permutas historico gestionable por admin" 
  ON public.permutas_historico_periodos FOR ALL TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- RPC Function to safely archive a period
CREATE OR REPLACE FUNCTION public.archivar_periodo_permutas(
  p_nombre_periodo TEXT,
  p_stats_por_anio JSONB DEFAULT '{}'::jsonb,
  p_stats_por_materia JSONB DEFAULT '[]'::jsonb,
  p_stats_comisiones JSONB DEFAULT '{}'::jsonb,
  p_raw_backup JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id UUID;
  v_total INT;
  v_realizadas INT;
  v_activas INT;
  v_canceladas INT;
  v_personas INT;
BEGIN
  -- Calcular métricas actuales de permutas
  SELECT 
    COUNT(*),
    COUNT(CASE WHEN status = 'realizada' THEN 1 END),
    COUNT(CASE WHEN status = 'activa' OR (status IS NULL AND activa = true) THEN 1 END),
    COUNT(CASE WHEN status = 'cancelada' THEN 1 END)
  INTO v_total, v_realizadas, v_activas, v_canceladas
  FROM public.permutas;

  v_personas := v_realizadas * 2;

  -- Insertar snapshot en el histórico permanente
  INSERT INTO public.permutas_historico_periodos (
    nombre_periodo,
    fecha_cierre,
    total_permutas,
    total_realizadas,
    total_activas,
    total_canceladas,
    personas_beneficiadas,
    stats_por_anio,
    stats_por_materia,
    stats_comisiones,
    raw_data_backup
  ) VALUES (
    p_nombre_periodo,
    now(),
    v_total,
    v_realizadas,
    v_activas,
    v_canceladas,
    v_personas,
    p_stats_por_anio,
    p_stats_por_materia,
    p_stats_comisiones,
    p_raw_backup
  )
  RETURNING id INTO v_id;

  -- Acumular las personas realizadas en app_settings
  IF v_personas > 0 THEN
    PERFORM public.increment_personas_permutadas(v_personas);
  END IF;

  -- Limpiar tabla actual de matches y permutas
  DELETE FROM public.matches WHERE id <> '00000000-0000-0000-0000-000000000000'::uuid;
  DELETE FROM public.permutas WHERE id <> '00000000-0000-0000-0000-000000000000'::uuid;

  RETURN v_id;
END $$;

GRANT EXECUTE ON FUNCTION public.archivar_periodo_permutas(TEXT, JSONB, JSONB, JSONB, JSONB) TO authenticated, anon;
