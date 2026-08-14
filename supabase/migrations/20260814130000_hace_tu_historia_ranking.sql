-- Migración: Crear tabla de ranking y guardado de partidas para 'Hacé tu Historia'
-- Fecha: 2026-08-14

CREATE TABLE IF NOT EXISTS public.historia_carreras_ranking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_jugador TEXT NOT NULL DEFAULT 'Estudiante Anónimo',
    avatar_url TEXT,
    puntos_totales INTEGER NOT NULL DEFAULT 0,
    ovr_final INTEGER NOT NULL DEFAULT 50,
    patrimonio_final BIGINT NOT NULL DEFAULT 0,
    prestigio_final INTEGER NOT NULL DEFAULT 50,
    contactos_final INTEGER NOT NULL DEFAULT 50,
    etica_final INTEGER NOT NULL DEFAULT 50,
    templanza_final INTEGER NOT NULL DEFAULT 50,
    edad_final INTEGER NOT NULL DEFAULT 65,
    ciudad_natal TEXT NOT NULL DEFAULT 'La Plata (Capital)',
    titulo_obtenido TEXT NOT NULL DEFAULT 'Abogado/a de Grado',
    rama_predominante TEXT NOT NULL DEFAULT 'General',
    fue_victoria BOOLEAN NOT NULL DEFAULT false,
    motivo_cierre TEXT,
    desafios_juridicos_acertados INTEGER NOT NULL DEFAULT 0,
    logros_obtenidos_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_historia_ranking_puntos ON public.historia_carreras_ranking (puntos_totales DESC);
CREATE INDEX IF NOT EXISTS idx_historia_ranking_rama ON public.historia_carreras_ranking (rama_predominante);
CREATE INDEX IF NOT EXISTS idx_historia_ranking_user ON public.historia_carreras_ranking (user_id);
CREATE INDEX IF NOT EXISTS idx_historia_ranking_created_at ON public.historia_carreras_ranking (created_at DESC);

-- Habilitar RLS
ALTER TABLE public.historia_carreras_ranking ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública: cualquier usuario autenticado o anónimo puede ver el Hall de la Fama
CREATE POLICY "Lectura pública de ranking de historia"
    ON public.historia_carreras_ranking
    FOR SELECT
    USING (true);

-- Política de inserción: usuarios autenticados pueden registrar sus propias carreras
CREATE POLICY "Usuarios autenticados pueden insertar sus carreras"
    ON public.historia_carreras_ranking
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Política de eliminación: el usuario puede borrar sus propias carreras o administradores
CREATE POLICY "Usuarios pueden borrar sus carreras guardadas"
    ON public.historia_carreras_ranking
    FOR DELETE
    USING (auth.uid() = user_id);
