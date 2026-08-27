import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "https://api.dndjursoc.com.ar";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey);

    // 1. Obtener configuración actual
    const { data: config, error: configErr } = await supabase
      .from("instagram_config")
      .select("*")
      .eq("id", 1)
      .single();

    if (configErr && configErr.code !== "PGRST116") {
      console.error("Error al obtener config de Instagram:", configErr);
    }

    let token = config?.access_token;
    const now = new Date();

    // 2. Si el token tiene más de 30 días, auto-renovarlo automáticamente con Meta Graph API
    if (token && config?.last_token_refresh) {
      const lastRefresh = new Date(config.last_token_refresh);
      const daysSinceRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceRefresh >= 30) {
        console.log(`Auto-renovando token de Instagram (${daysSinceRefresh.toFixed(1)} días desde última renovación)...`);
        try {
          const refreshRes = await fetch(
            `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
          );
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.access_token) {
              token = refreshData.access_token;
              await supabase
                .from("instagram_config")
                .update({
                  access_token: token,
                  last_token_refresh: now.toISOString(),
                  last_error: null,
                  updated_at: now.toISOString(),
                })
                .eq("id", 1);
              console.log("Token de Instagram renovado con éxito.");
            }
          } else {
            const errText = await refreshRes.text();
            console.warn("No se pudo auto-renovar el token de Instagram:", errText);
          }
        } catch (e) {
          console.error("Excepción al auto-renovar token:", e);
        }
      }
    }

    let syncedPosts: any[] = [];

    // 3. Consultar publicaciones desde la API oficial de Meta si hay token
    if (token) {
      console.log("Consultando publicaciones desde Meta Graph API...");
      const graphUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=12&access_token=${token}`;
      const graphRes = await fetch(graphUrl);

      if (graphRes.ok) {
        const graphData = await graphRes.json();
        syncedPosts = graphData.data || [];
      } else {
        const errText = await graphRes.text();
        console.error("Error al consultar Meta Graph API:", errText);
        await supabase
          .from("instagram_config")
          .update({ last_error: errText, updated_at: now.toISOString() })
          .eq("id", 1);
      }
    }

    // 4. Guardar o actualizar publicaciones en la tabla instagram_feed
    let upsertCount = 0;
    if (syncedPosts.length > 0) {
      for (const post of syncedPosts) {
        const mediaUrl = post.media_type === "VIDEO" && post.thumbnail_url 
          ? post.thumbnail_url 
          : (post.media_url || "");

        const { error: upsertErr } = await supabase.from("instagram_feed").upsert({
          id: post.id,
          media_type: post.media_type || "IMAGE",
          media_url: mediaUrl,
          thumbnail_url: post.thumbnail_url || null,
          permalink: post.permalink || "https://www.instagram.com/agrupaciondnd/",
          caption: post.caption || "",
          timestamp: post.timestamp || now.toISOString(),
          updated_at: now.toISOString(),
        });

        if (!upsertErr) upsertCount++;
      }

      await supabase
        .from("instagram_config")
        .update({ last_sync_at: now.toISOString(), last_error: null })
        .eq("id", 1);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sincronización completada",
        synced_count: upsertCount,
        timestamp: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error general en sync-instagram-feed:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
