-- Migración para el Feed Automático de Instagram
CREATE TABLE IF NOT EXISTS public.instagram_feed (
    id TEXT PRIMARY KEY,
    media_type TEXT NOT NULL DEFAULT 'IMAGE',
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    permalink TEXT NOT NULL DEFAULT 'https://www.instagram.com/agrupaciondnd/',
    caption TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    like_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.instagram_config (
    id INT PRIMARY KEY DEFAULT 1,
    access_token TEXT,
    instagram_user_id TEXT,
    last_token_refresh TIMESTAMPTZ DEFAULT now(),
    last_sync_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT single_config_row CHECK (id = 1)
);

INSERT INTO public.instagram_config (id, access_token, last_token_refresh)
VALUES (1, NULL, now())
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.instagram_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública del feed de instagram" ON public.instagram_feed;
CREATE POLICY "Permitir lectura pública del feed de instagram"
ON public.instagram_feed
FOR SELECT
TO anon, authenticated, postgres, service_role
USING (true);

DROP POLICY IF EXISTS "Permitir gestión del feed a administradores y service_role" ON public.instagram_feed;
CREATE POLICY "Permitir gestión del feed a administradores y service_role"
ON public.instagram_feed
FOR ALL
TO authenticated, postgres, service_role
USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Acceso a config de instagram para admins" ON public.instagram_config;
CREATE POLICY "Acceso a config de instagram para admins"
ON public.instagram_config
FOR ALL
TO authenticated, postgres, service_role
USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

GRANT ALL ON TABLE public.instagram_feed TO postgres, service_role, anon, authenticated;
GRANT ALL ON TABLE public.instagram_config TO postgres, service_role, authenticated;

CREATE OR REPLACE FUNCTION public.upsert_instagram_post(
    p_id TEXT,
    p_media_type TEXT,
    p_media_url TEXT,
    p_thumbnail_url TEXT,
    p_permalink TEXT,
    p_caption TEXT,
    p_timestamp TIMESTAMPTZ,
    p_like_count INT DEFAULT 0,
    p_comments_count INT DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.instagram_feed (
        id, media_type, media_url, thumbnail_url, permalink, caption, timestamp, like_count, comments_count, updated_at
    )
    VALUES (
        p_id, p_media_type, p_media_url, p_thumbnail_url, p_permalink, p_caption, p_timestamp, p_like_count, p_comments_count, now()
    )
    ON CONFLICT (id) DO UPDATE SET
        media_type = EXCLUDED.media_type,
        media_url = EXCLUDED.media_url,
        thumbnail_url = EXCLUDED.thumbnail_url,
        permalink = EXCLUDED.permalink,
        caption = EXCLUDED.caption,
        timestamp = EXCLUDED.timestamp,
        like_count = COALESCE(EXCLUDED.like_count, public.instagram_feed.like_count),
        comments_count = COALESCE(EXCLUDED.comments_count, public.instagram_feed.comments_count),
        updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_instagram_post TO anon, authenticated, service_role, postgres;

NOTIFY pgrst, 'reload schema';
