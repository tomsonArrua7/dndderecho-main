-- Migration: Tablas, Realtime y Ranking para Trivia y Duelos 1vs1 Académicos

-- 1. Tabla de Historial de Partidas
CREATE TABLE IF NOT EXISTS public.trivia_partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    categoria_id TEXT NOT NULL DEFAULT 'todas',
    dificultad TEXT NOT NULL DEFAULT 'todas',
    puntos INTEGER NOT NULL DEFAULT 0,
    aciertos INTEGER NOT NULL DEFAULT 0,
    total_preguntas INTEGER NOT NULL DEFAULT 5,
    racha_maxima INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Estadísticas Acumuladas por Usuario
CREATE TABLE IF NOT EXISTS public.trivia_estadisticas_usuario (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    puntos_totales INTEGER NOT NULL DEFAULT 0,
    partidas_jugadas INTEGER NOT NULL DEFAULT 0,
    total_preguntas INTEGER NOT NULL DEFAULT 0,
    total_aciertos INTEGER NOT NULL DEFAULT 0,
    mejor_racha INTEGER NOT NULL DEFAULT 0,
    materia_favorita TEXT DEFAULT 'Toda la Carrera',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Salas de Duelo 1vs1 Académico
CREATE TABLE IF NOT EXISTS public.trivia_duelos (
    id TEXT PRIMARY KEY,
    es_publico BOOLEAN NOT NULL DEFAULT true,
    materia_id TEXT NOT NULL DEFAULT 'todas',
    materia_nombre TEXT NOT NULL DEFAULT 'Toda la Carrera',
    preguntas_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    player1_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player1_nombre TEXT NOT NULL,
    player1_aciertos INTEGER NOT NULL DEFAULT 0,
    player1_tiempo_ms INTEGER NOT NULL DEFAULT 0,
    player1_puntos INTEGER NOT NULL DEFAULT 0,
    player1_completed BOOLEAN NOT NULL DEFAULT false,
    player2_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player2_nombre TEXT,
    player2_aciertos INTEGER DEFAULT 0,
    player2_tiempo_ms INTEGER DEFAULT 0,
    player2_puntos INTEGER DEFAULT 0,
    player2_completed BOOLEAN DEFAULT false,
    ganador_id TEXT,
    status TEXT NOT NULL DEFAULT 'esperando_rival',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Habilitar RLS en todas las tablas
ALTER TABLE public.trivia_partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_estadisticas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_duelos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
DROP POLICY IF EXISTS "Lectura de partidas" ON public.trivia_partidas;
CREATE POLICY "Lectura de partidas" ON public.trivia_partidas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insercion de partidas" ON public.trivia_partidas;
CREATE POLICY "Insercion de partidas" ON public.trivia_partidas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura publica de estadisticas" ON public.trivia_estadisticas_usuario;
CREATE POLICY "Lectura publica de estadisticas" ON public.trivia_estadisticas_usuario FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestion de estadisticas propias" ON public.trivia_estadisticas_usuario;
CREATE POLICY "Gestion de estadisticas propias" ON public.trivia_estadisticas_usuario FOR ALL USING (true);

DROP POLICY IF EXISTS "Lectura publica de duelos" ON public.trivia_duelos;
CREATE POLICY "Lectura publica de duelos" ON public.trivia_duelos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insercion de duelos" ON public.trivia_duelos;
CREATE POLICY "Insercion de duelos" ON public.trivia_duelos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizacion de duelos" ON public.trivia_duelos;
CREATE POLICY "Actualizacion de duelos" ON public.trivia_duelos FOR UPDATE USING (true);

-- 5. Trigger y Función para Actualizar Estadísticas Automáticamente tras cada Partida
CREATE OR REPLACE FUNCTION public.fn_actualizar_estadisticas_trivia()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        INSERT INTO public.trivia_estadisticas_usuario (
            user_id, puntos_totales, partidas_jugadas, total_preguntas, total_aciertos, mejor_racha, materia_favorita, updated_at
        )
        VALUES (
            NEW.user_id, NEW.puntos, 1, NEW.total_preguntas, NEW.aciertos, NEW.racha_maxima, NEW.categoria_id, now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            puntos_totales = trivia_estadisticas_usuario.puntos_totales + EXCLUDED.puntos_totales,
            partidas_jugadas = trivia_estadisticas_usuario.partidas_jugadas + 1,
            total_preguntas = trivia_estadisticas_usuario.total_preguntas + EXCLUDED.total_preguntas,
            total_aciertos = trivia_estadisticas_usuario.total_aciertos + EXCLUDED.total_aciertos,
            mejor_racha = GREATEST(trivia_estadisticas_usuario.mejor_racha, EXCLUDED.mejor_racha),
            materia_favorita = EXCLUDED.materia_favorita,
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_actualizar_estadisticas_trivia ON public.trivia_partidas;
CREATE TRIGGER trg_actualizar_estadisticas_trivia
AFTER INSERT ON public.trivia_partidas
FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_estadisticas_trivia();

-- 6. Vista del Ranking / Leaderboard General
CREATE OR REPLACE VIEW public.trivia_leaderboard AS
SELECT 
    e.user_id,
    COALESCE(p.full_name, 'Estudiante de Abogacía') AS nombre,
    p.avatar_url,
    p.role,
    e.puntos_totales AS puntos,
    e.partidas_jugadas,
    e.total_aciertos,
    e.total_preguntas,
    CASE 
        WHEN e.total_preguntas > 0 THEN ROUND((e.total_aciertos::decimal / e.total_preguntas::decimal) * 100)
        ELSE 0 
    END AS aciertos_porcentaje,
    e.mejor_racha AS racha,
    e.materia_favorita AS materia_fav,
    DENSE_RANK() OVER (ORDER BY e.puntos_totales DESC) AS posicion
FROM public.trivia_estadisticas_usuario e
JOIN public.profiles p ON e.user_id = p.id
ORDER BY e.puntos_totales DESC;

-- 7. Publicación Realtime para Duelos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_duelos;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
