-- Migration: Sistema de Medallas Olímpicas, Logros y Tabla de Medallero para Trivia Jurídica

-- 1. Tabla de Medallas de Usuario
CREATE TABLE IF NOT EXISTS public.trivia_medallas_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('oro', 'plata', 'bronce', 'rango', 'logro')),
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    icono TEXT NOT NULL DEFAULT 'trophy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.trivia_medallas_usuario ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica de medallas" ON public.trivia_medallas_usuario;
CREATE POLICY "Lectura publica de medallas" ON public.trivia_medallas_usuario FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insercion propia de medallas" ON public.trivia_medallas_usuario;
CREATE POLICY "Insercion propia de medallas" ON public.trivia_medallas_usuario FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Vista del Medallero Olímpico (Ordenado por Oro > Plata > Bronce)
CREATE OR REPLACE VIEW public.trivia_leaderboard_medallas 
WITH (security_invoker = true) AS
SELECT 
    p.id AS user_id,
    COALESCE(p.full_name, 'Estudiante de Abogacía') AS nombre,
    COALESCE(p.avatar_url, NULL) AS avatar_url,
    COUNT(CASE WHEN m.tipo = 'oro' THEN 1 END)::INT AS medallas_oro,
    COUNT(CASE WHEN m.tipo = 'plata' THEN 1 END)::INT AS medallas_plata,
    COUNT(CASE WHEN m.tipo = 'bronce' THEN 1 END)::INT AS medallas_bronce,
    COUNT(m.id)::INT AS total_medallas
FROM public.profiles p
LEFT JOIN public.trivia_medallas_usuario m ON p.id = m.user_id
GROUP BY p.id, p.full_name, p.avatar_url
HAVING COUNT(m.id) > 0
ORDER BY medallas_oro DESC, medallas_plata DESC, medallas_bronce DESC, total_medallas DESC;
