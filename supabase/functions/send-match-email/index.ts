import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Asume el uso de un proveedor de emails transaccionales como Resend, SendGrid, etc.
// En este ejemplo usamos un mock o una llamada fetch a una API tipo Resend.
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

    // El payload del webhook de Base de Datos vendrá en el body
    const payload = await req.json();
    const match = payload.record; // El nuevo registro de match insertado en la tabla matches

    if (!match) {
      return new Response("No match record in payload", { status: 400 });
    }

    // Buscar los datos de las permutas para obtener nombres, teléfonos e IDs de usuario
    const { data: permutaA, error: errA } = await supabaseClient.from("permutas").select("*, materias(nombre)").eq("id", match.permuta_a).single();
    const { data: permutaB, error: errB } = await supabaseClient.from("permutas").select("*, materias(nombre)").eq("id", match.permuta_b).single();

    if (errA || errB || !permutaA || !permutaB) {
      throw new Error("No se pudieron cargar las permutas.");
    }

    // Buscar los emails de los usuarios
    const { data: userA } = await supabaseClient.auth.admin.getUserById(permutaA.user_id);
    const { data: userB } = await supabaseClient.auth.admin.getUserById(permutaB.user_id);

    const emailA = userA?.user?.email;
    const emailB = userB?.user?.email;

    const subject = `¡Hay un Match para tu permuta de ${permutaA.materias.nombre}! 🎉`;

    const sendEmail = async (to: string, recipientName: string, partnerName: string, partnerPhone: string, materia: string) => {
      const waLink = `https://wa.me/${partnerPhone.replace(/\D/g, "")}`;
      
      const html = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#0d1b2a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1b2a;padding:40px 20px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
<tr><td align="center" style="padding-bottom:24px;"><img src="https://dndjursoc.com.ar/dnd-logo.png" width="140" alt="DND Derecho UNLP" style="display:block;max-width:140px;height:auto;"></td></tr>
<tr><td style="background-color:#111827;border-radius:16px;border:1px solid #1e293b;overflow:hidden;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:linear-gradient(135deg,#be123c 0%,#9f1239 100%);padding:24px 32px;text-align:center;">
<p style="margin:0 0 4px 0;color:#fecdd3;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:3px;">Permutero DND</p>
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">&#127881; Tenes un Match!</h1>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:36px 32px;text-align:center;">
<h2 style="margin:0 0 12px 0;color:#f1f5f9;font-size:18px;font-weight:700;">Hola ${recipientName}!</h2>
<p style="margin:0 0 24px 0;color:#94a3b8;font-size:14px;line-height:1.7;">
Encontramos a alguien interesado en permutar la comision de <strong style="color:#f1f5f9;">${materia}</strong>.
Tu match es <strong style="color:#f1f5f9;">${partnerName}</strong>.
</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px auto;"><tr><td bgcolor="#25D366" style="border-radius:10px;">
<a href="${waLink}" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;border-radius:10px;">
Contactar por WhatsApp
</a></td></tr></table>
<p style="margin:0;color:#475569;font-size:12px;">Gracias por usar el Permutero de DND!</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#0f172a;padding:16px 32px;border-top:1px solid #1e293b;text-align:center;">
<p style="margin:0;color:#475569;font-size:11px;">Agrupacion Estudiantil <strong>Defendamos Nuestro Derecho</strong></p>
</td></tr></table>
</td></tr></table></td></tr></table>
</body></html>`;

      if (RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "DND Permutero <contacto@dndjursoc.com.ar>",
            to,
            subject,
            html,
          }),
        });
      } else {
        console.log(`MOCK EMAIL SENT TO: ${to}`);
        console.log(html);
      }
    };

    if (emailA) await sendEmail(emailA, permutaA.nombre_contacto, permutaB.nombre_contacto, permutaB.telefono, permutaA.materias.nombre);
    if (emailB) await sendEmail(emailB, permutaB.nombre_contacto, permutaA.nombre_contacto, permutaA.telefono, permutaA.materias.nombre);

    // Marcar como notificado
    await supabaseClient.from("matches").update({ notified: true }).eq("id", match.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
