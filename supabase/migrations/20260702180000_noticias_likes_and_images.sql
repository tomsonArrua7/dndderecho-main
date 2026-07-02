-- 1. Agregar columnas para la imagen a la tabla de noticias
ALTER TABLE public.noticias 
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_align TEXT DEFAULT 'center';

-- 2. Crear tabla de likes
CREATE TABLE IF NOT EXISTS public.noticias_likes (
  noticia_id UUID REFERENCES public.noticias(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (noticia_id, user_id)
);

-- 3. Habilitar seguridad de nivel de fila (RLS) en la tabla de likes
ALTER TABLE public.noticias_likes ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas RLS para noticias_likes
-- Lectura pública para poder contar los likes de cada noticia
DROP POLICY IF EXISTS "Allow public select on noticias_likes" ON public.noticias_likes;
CREATE POLICY "Allow public select on noticias_likes" ON public.noticias_likes
  FOR SELECT USING (true);

-- Permitir a usuarios autenticados insertar su propio like
DROP POLICY IF EXISTS "Allow authenticated insert on noticias_likes" ON public.noticias_likes;
CREATE POLICY "Allow authenticated insert on noticias_likes" ON public.noticias_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios autenticados remover su propio like
DROP POLICY IF EXISTS "Allow authenticated delete on noticias_likes" ON public.noticias_likes;
CREATE POLICY "Allow authenticated delete on noticias_likes" ON public.noticias_likes
  FOR DELETE USING (auth.uid() = user_id);
