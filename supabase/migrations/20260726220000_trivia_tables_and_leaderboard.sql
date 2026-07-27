-- Migration: Tablas, Trigger y Vista de Ranking para la Trivia Jurídica

-- 1. Tabla de Historial de Partidas
CREATE TABLE IF NOT EXISTS public.trivia_partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    categoria_id TEXT NOT NULL,
    dificultad TEXT NOT NULL,
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
    materia_favorita TEXT DEFAULT 'Derecho General',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla Opcional de Preguntas en Base de Datos (para carga dinámica)
CREATE TABLE IF NOT EXISTS public.trivia_preguntas (
    id TEXT PRIMARY KEY,
    id_categoria TEXT NOT NULL,
    categoria_nombre TEXT NOT NULL,
    dificultad TEXT NOT NULL CHECK (dificultad IN ('facil', 'media', 'dificil')),
    pregunta TEXT NOT NULL,
    opciones JSONB NOT NULL,
    respuesta_correcta_index INTEGER NOT NULL,
    fundamento_juridico TEXT NOT NULL,
    puntos_base INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.trivia_partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_estadisticas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_preguntas ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
DROP POLICY IF EXISTS "Permitir lectura de partidas a usuarios autenticados" ON public.trivia_partidas;
CREATE POLICY "Permitir lectura de partidas a usuarios autenticados"
    ON public.trivia_partidas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir insercion de partidas propias" ON public.trivia_partidas;
CREATE POLICY "Permitir insercion de partidas propias"
    ON public.trivia_partidas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Permitir lectura publica de estadisticas para el ranking" ON public.trivia_estadisticas_usuario;
CREATE POLICY "Permitir lectura publica de estadisticas para el ranking"
    ON public.trivia_estadisticas_usuario FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir insertar o actualizar estadisticas propias" ON public.trivia_estadisticas_usuario;
CREATE POLICY "Permitir insertar o actualizar estadisticas propias"
    ON public.trivia_estadisticas_usuario FOR ALL TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Permitir lectura publica de preguntas" ON public.trivia_preguntas;
CREATE POLICY "Permitir lectura publica de preguntas"
    ON public.trivia_preguntas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir gestion de preguntas solo a admins" ON public.trivia_preguntas;
CREATE POLICY "Permitir gestion de preguntas solo a admins"
    ON public.trivia_preguntas FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5. Trigger y Función para Actualizar Estadísticas Automáticamente tras cada Partida
CREATE OR REPLACE FUNCTION public.fn_actualizar_estadisticas_trivia()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.trivia_estadisticas_usuario (
        user_id,
        puntos_totales,
        partidas_jugadas,
        total_preguntas,
        total_aciertos,
        mejor_racha,
        materia_favorita,
        updated_at
    )
    VALUES (
        NEW.user_id,
        NEW.puntos,
        1,
        NEW.total_preguntas,
        NEW.aciertos,
        NEW.racha_maxima,
        NEW.categoria_id,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        puntos_totales = trivia_estadisticas_usuario.puntos_totales + EXCLUDED.puntos_totales,
        partidas_jugadas = trivia_estadisticas_usuario.partidas_jugadas + 1,
        total_preguntas = trivia_estadisticas_usuario.total_preguntas + EXCLUDED.total_preguntas,
        total_aciertos = trivia_estadisticas_usuario.total_aciertos + EXCLUDED.total_aciertos,
        mejor_racha = GREATEST(trivia_estadisticas_usuario.mejor_racha, EXCLUDED.mejor_racha),
        materia_favorita = EXCLUDED.materia_favorita,
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_actualizar_estadisticas_trivia ON public.trivia_partidas;
CREATE TRIGGER trg_actualizar_estadisticas_trivia
AFTER INSERT ON public.trivia_partidas
FOR EACH ROW
EXECUTE FUNCTION public.fn_actualizar_estadisticas_trivia();

-- 6. Vista del Ranking / Leaderboard General y por Materia
CREATE OR REPLACE VIEW public.trivia_leaderboard AS
SELECT 
    e.user_id,
    p.full_name AS nombre,
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
