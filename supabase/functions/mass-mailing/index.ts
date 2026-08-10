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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));
    
    if (authError || !user) throw new Error("No autorizado");

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") throw new Error("Acceso denegado");

    const { subject, body } = await req.json();

    console.log("Iniciando envío masivo individual...");

    // Obtener usuarios desde auth.admin (con paginación para superar el límite de 1000)
    let allUsers: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data, error: listError } = await supabaseClient.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

      if (listError) {
        console.error(`Error al listar usuarios de Auth en página ${page}:`, listError);
        throw listError;
      }

      const pageUsers = data?.users || [];
      if (pageUsers.length === 0) {
        hasMore = false;
      } else {
        allUsers.push(...pageUsers);
        if (pageUsers.length < 1000) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    const emails = allUsers
      .map(u => u.email)
      .filter(email => email && email.includes("@")) as string[];

    console.log(`Emails válidos para enviar individualmente: ${emails.length}`);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "No se encontraron emails" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 1. Obtener API Key de Resend (entorno o app_settings)
    let resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY no encontrada en Deno.env. Buscando en la tabla app_settings...");
      try {
        const { data: settings } = await supabaseClient
          .from("app_settings")
          .select("resend_api_key")
          .limit(1)
          .maybeSingle();
        if (settings?.resend_api_key) {
          resendApiKey = settings.resend_api_key;
        }
      } catch (err: any) {
        console.warn("Error al leer de app_settings:", err.message);
      }
    }

    if (!resendApiKey) {
      throw new Error(
        "Clave de API de Resend no configurada. Por favor, agregá 'resend_api_key' en la tabla 'app_settings' desde la base de datos o como variable de entorno."
      );
    }

    let sentCount = 0;
    const errors: Array<{ batch: number; error: string }> = [];

    const htmlTemplate = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head><body style="margin:0;padding:0;background-color:#0d1b2a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1b2a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;"><tr><td align="center" style="padding-bottom:24px;"><img src="https://dndjursoc.com.ar/dnd-logo.png" width="140" alt="DND Derecho UNLP" style="display:block;max-width:140px;height:auto;"></td></tr><tr><td style="background-color:#111827;border-radius:16px;border:1px solid #1e293b;overflow:hidden;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:linear-gradient(135deg,#be123c 0%,#9f1239 100%);padding:24px 32px;text-align:center;"><p style="margin:0 0 4px 0;color:#fecdd3;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:3px;">Plataforma Estudiantil</p><h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">DND DERECHO UNLP</h1></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:36px 32px;color:#94a3b8;font-size:14px;line-height:1.7;">${body.replace(/\n/g, "<br>")}</td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#0f172a;padding:16px 32px;border-top:1px solid #1e293b;text-align:center;"><p style="margin:0;color:#475569;font-size:11px;">Agrupación Estudiantil <strong>Defendamos Nuestro Derecho</strong></p><p style="margin:6px 0 0 0;color:#334155;font-size:10px;">Este correo fue enviado a todos los miembros registrados.</p></td></tr></table></td></tr></table></td></tr></table></body></html>`;

    // Enviar en lotes (batch API) de 100 emails para acelerar de 8 minutos a 4 segundos
    // y evitar que la Edge Function sea terminada por timeout (60s).
    const BATCH_SIZE = 100;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const chunk = emails.slice(i, i + BATCH_SIZE);
      const batchPayload = chunk.map(email => ({
        from: "DND Derecho UNLP <contacto@dndjursoc.com.ar>",
        to: email,
        subject: subject,
        html: htmlTemplate,
      }));

      try {
        const res = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify(batchPayload),
        });

        if (res.ok) {
          sentCount += chunk.length;
          console.log(`Lote ${Math.floor(i / BATCH_SIZE) + 1} enviado con éxito (${chunk.length} mails, acumulado: ${sentCount}/${emails.length})`);
        } else {
          const errorText = await res.text();
          console.error(`Error de Resend en lote ${Math.floor(i / BATCH_SIZE) + 1}:`, errorText);
          errors.push({ batch: Math.floor(i / BATCH_SIZE) + 1, error: errorText });
        }
      } catch (err: any) {
        console.error(`Excepción en lote ${Math.floor(i / BATCH_SIZE) + 1}:`, err.message);
        errors.push({ batch: Math.floor(i / BATCH_SIZE) + 1, error: err.message });
      }

      // Pausa de 150ms entre lotes de 100
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log(`Envío masivo completado. Éxitos: ${sentCount}/${emails.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: emails.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error crítico en la función mass-mailing:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
