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

    const { email, origin } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generar enlace de recuperación de contraseña de forma administrativa
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${origin || "https://dndjursoc.com.ar"}/auth/recovery`,
      },
    });

    if (error) {
      throw error;
    }

    const actionLink = data.properties?.action_link;

    if (!actionLink) {
      throw new Error("No se pudo generar el enlace de recuperación.");
    }

    // 1. Obtener API Key de Resend (entorno o app_settings)
    let resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("send-recovery-email: Buscando resend_api_key en app_settings...");
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
        console.warn("send-recovery-email: Error al leer app_settings:", err.message);
      }
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña - DND Derecho</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050b14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <img src="https://dndjursoc.com.ar/dnd-logo.png" width="140" alt="DND Derecho UNLP" style="display: block; max-width: 140px; height: auto;">
            </td>
          </tr>

          <!-- Box Principal -->
          <tr>
            <td style="background-color: #0d1224; border-radius: 20px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; padding: 40px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.25);">
              
              <!-- Tag y Título -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <span style="background-color: rgba(190, 18, 60, 0.15); border: 1px solid rgba(190, 18, 60, 0.3); color: #be123c; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding: 4px 12px; border-radius: 9999px; display: inline-block;">
                      Seguridad de la Cuenta
                    </span>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 16px 0 0 0; tracking: -0.025em;">
                      Restablecer tu Contraseña
                    </h1>
                  </td>
                </tr>

                <!-- Separador -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);"></div>
                  </td>
                </tr>

                <!-- Mensaje -->
                <tr>
                  <td style="color: #94a3b8; font-size: 14px; line-height: 1.6; padding-bottom: 32px; text-align: center;">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en la plataforma estudiantil de DND Derecho. Para proceder, presioná el botón de abajo:
                  </td>
                </tr>

                <!-- Botón de Acción -->
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-radius: 12px; background: linear-gradient(135deg, #be123c 0%, #9f1239 100%); box-shadow: 0 4px 12px rgba(190, 18, 60, 0.3);">
                          <a href="${actionLink}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                            Restablecer Contraseña
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Enlace alternativo -->
                <tr>
                  <td style="color: #475569; font-size: 11px; line-height: 1.5; text-align: center;">
                    Si el botón no funciona, podés copiar y pegar el siguiente enlace en tu navegador:
                    <div style="margin-top: 10px; word-break: break-all; color: #be123c; font-family: monospace; font-size: 11px; padding: 10px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; select-all: all;">
                      ${actionLink}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; color: #334155; font-size: 11px;">Agrupación Estudiantil <strong style="color: #475569;">Defendamos Nuestro Derecho</strong></p>
              <p style="margin: 6px 0 0 0; color: #334155; font-size: 11px;">Si no solicitaste este cambio, podés ignorar este correo de forma segura.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Enviar el correo usando la API de Resend
    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "DND Derecho <contacto@dndjursoc.com.ar>",
          to: email,
          subject: "Restablecer tu contraseña - DND Derecho",
          html: htmlContent,
        }),
      });

      if (!resendRes.ok) {
        const errorText = await resendRes.text();
        throw new Error(`Resend error: ${errorText}`);
      }
    } else {
      console.warn("send-recovery-email: RESEND_API_KEY no configurada. MOCK Link generado:");
      console.log(actionLink);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Error interno de servidor" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
