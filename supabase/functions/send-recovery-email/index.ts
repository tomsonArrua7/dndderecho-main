import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
      console.error("Error generating recovery link:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Apuntar directamente a la web del frontend con el hash del token
    const actionLink = `${origin || "https://dndjursoc.com.ar"}/auth/recovery?token=${data.properties.hashed_token}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Restablecer tu contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1b2a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1b2a;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

<tr><td align="center" style="padding-bottom:24px;">
<img src="https://dndjursoc.com.ar/dnd-logo.png" width="140" alt="DND Derecho UNLP" style="display:block;max-width:140px;height:auto;">
</td></tr>

<tr><td style="background-color:#111827;border-radius:16px;border:1px solid #1e293b;overflow:hidden;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="background:linear-gradient(135deg,#be123c 0%,#9f1239 100%);padding:28px 36px;text-align:center;">
<p style="margin:0 0 6px 0;color:#fecdd3;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:3px;">Plataforma Estudiantil</p>
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">DND DERECHO UNLP</h1>
</td></tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:40px 36px;text-align:center;">

<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px auto;">
<tr><td width="64" height="64" style="background-color:#1e3a5f;border-radius:50%;text-align:center;vertical-align:middle;font-size:28px;line-height:64px;">&#128274;</td></tr>
</table>

<h2 style="margin:0 0 14px 0;color:#f1f5f9;font-size:20px;font-weight:700;">Restablecer tu contraseña</h2>
<p style="margin:0 0 32px 0;color:#94a3b8;font-size:14px;line-height:1.7;">
Para restablecer tu contraseña y acceder nuevamente a tu cuenta de alumno, hace clic en el boton de abajo.
</p>

<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px auto;">
<tr><td bgcolor="#be123c" style="border-radius:10px;">
<a href="${actionLink}" target="_blank" style="display:inline-block;padding:15px 40px;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;border-radius:10px;">
Restablecer Contraseña
</a>
</td></tr>
</table>

<p style="margin:0 0 8px 0;color:#475569;font-size:11px;">Si el boton no funciona, copia y pega este enlace en tu navegador:</p>
<p style="margin:0;"><a href="${actionLink}" style="color:#60a5fa;font-size:11px;word-break:break-all;">${actionLink}</a></p>

</td></tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="background-color:#0f172a;padding:20px 36px;border-top:1px solid #1e293b;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="50%" style="vertical-align:top;padding-right:12px;">
<p style="margin:0 0 4px 0;color:#64748b;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Acceso a</p>
<p style="margin:0;color:#94a3b8;font-size:12px;">Plan de estudios, Apuntes, Permutas, Calendario</p>
</td>
<td width="50%" style="vertical-align:top;padding-left:12px;border-left:1px solid #1e293b;">
<p style="margin:0 0 4px 0;color:#64748b;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Facultad</p>
<p style="margin:0;color:#94a3b8;font-size:12px;">Cs. Juridicas y Sociales, UNLP</p>
</td>
</tr>
</table>
</td></tr>
</table>

</td></tr>

<tr><td style="padding:20px 0;text-align:center;">
<p style="margin:0;color:#334155;font-size:11px;">Agrupacion Estudiantil <strong style="color:#475569;">Defendamos Nuestro Derecho</strong></p>
<p style="margin:6px 0 0 0;color:#334155;font-size:11px;">Si no solicitaste este cambio, podes ignorar este correo de forma segura.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
    `;

    // Enviar el correo usando la API de Resend
    if (RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
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
      console.log("MOCK RESET EMAIL SENT (No RESEND_API_KEY):", actionLink);
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
