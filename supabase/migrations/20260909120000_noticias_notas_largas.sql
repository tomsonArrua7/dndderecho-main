BEGIN;

-- Preparar la tabla de noticias para notas largas (notas de opinión)

-- 1. Nuevas columnas
ALTER TABLE public.noticias
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS content_format TEXT NOT NULL DEFAULT 'plain',
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- Solo permitimos los dos formatos que sabe renderizar el front
ALTER TABLE public.noticias DROP CONSTRAINT IF EXISTS noticias_content_format_check;
ALTER TABLE public.noticias
  ADD CONSTRAINT noticias_content_format_check
  CHECK (content_format IN ('plain', 'markdown'));

-- 2. Generador de slugs a partir del título (sin tildes, sin símbolos)
CREATE OR REPLACE FUNCTION public.slugify_noticia(txt TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' from
    regexp_replace(
      regexp_replace(
        lower(translate(
          coalesce(txt, ''),
          'áàäâãéèëêíìïîóòöôõúùüûñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ',
          'aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC'
        )),
        '[^a-z0-9]+', '-', 'g'
      ),
      '-{2,}', '-', 'g'
    )
  );
$$;

-- 3. Backfill de las noticias existentes: slug legible, numerado solo si hay choque
WITH base AS (
  SELECT
    id,
    COALESCE(NULLIF(public.slugify_noticia(title), ''), 'nota') AS raiz
  FROM public.noticias
  WHERE slug IS NULL
),
numerado AS (
  SELECT
    id,
    raiz,
    row_number() OVER (PARTITION BY raiz ORDER BY id) AS n
  FROM base
)
UPDATE public.noticias t
SET slug = CASE WHEN numerado.n = 1 THEN numerado.raiz
                ELSE numerado.raiz || '-' || numerado.n END
FROM numerado
WHERE t.id = numerado.id;

UPDATE public.noticias
SET excerpt = left(regexp_replace(desc_content, '\s+', ' ', 'g'), 200)
WHERE excerpt IS NULL;

-- 4. Recién ahora que no quedan nulos, hacemos el slug obligatorio y único
ALTER TABLE public.noticias ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS noticias_slug_key ON public.noticias (slug);

-- 5. Asignar slug automáticamente si el cliente no manda uno
CREATE OR REPLACE FUNCTION public.noticias_set_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  base TEXT;
  candidato TEXT;
  n INTEGER := 1;
BEGIN
  IF NEW.slug IS NOT NULL AND NEW.slug <> '' THEN
    base := public.slugify_noticia(NEW.slug);
  ELSE
    base := public.slugify_noticia(NEW.title);
  END IF;

  IF base IS NULL OR base = '' THEN
    base := 'nota';
  END IF;

  candidato := base;
  WHILE EXISTS (
    SELECT 1 FROM public.noticias WHERE slug = candidato AND id <> NEW.id
  ) LOOP
    n := n + 1;
    candidato := base || '-' || n;
  END LOOP;

  NEW.slug := candidato;
  RETURN NEW;
END $$;

-- Ojo: el slug se genera al crear la nota y al cambiarlo a mano, pero NO al editar
-- el titulo. Si se regenerara con cada correccion de titulo, los links ya compartidos
-- (WhatsApp, Instagram) quedarian rotos.
DROP TRIGGER IF EXISTS trg_noticias_slug ON public.noticias;
CREATE TRIGGER trg_noticias_slug
  BEFORE INSERT OR UPDATE OF slug ON public.noticias
  FOR EACH ROW EXECUTE FUNCTION public.noticias_set_slug();

-- 6. El índice de noticias ordena por fecha; ayudamos a esa consulta
CREATE INDEX IF NOT EXISTS noticias_created_at_idx ON public.noticias (created_at DESC);

-- 7. Minutos de lectura precalculados: el índice necesita mostrarlos sin traer
--    el cuerpo completo de cada nota.
ALTER TABLE public.noticias
  ADD COLUMN IF NOT EXISTS reading_minutes INTEGER NOT NULL DEFAULT 1;

CREATE OR REPLACE FUNCTION public.noticias_set_reading_minutes()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.reading_minutes := GREATEST(
    1,
    CEIL(
      array_length(
        regexp_split_to_array(trim(coalesce(NEW.desc_content, '')), '\s+'),
        1
      )::numeric / 200
    )::integer
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_noticias_reading_minutes ON public.noticias;
CREATE TRIGGER trg_noticias_reading_minutes
  BEFORE INSERT OR UPDATE OF desc_content ON public.noticias
  FOR EACH ROW EXECUTE FUNCTION public.noticias_set_reading_minutes();

-- Backfill de las noticias ya existentes
UPDATE public.noticias
SET reading_minutes = GREATEST(
  1,
  CEIL(
    array_length(regexp_split_to_array(trim(coalesce(desc_content, '')), '\s+'), 1)::numeric / 200
  )::integer
);

COMMIT;
