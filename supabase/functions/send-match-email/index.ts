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
        <h2>¡Felicidades ${recipientName}!</h2>
        <p>Encontramos a alguien interesado en permutar la comisión de <strong>${materia}</strong>.</p>
        <p>Tu match es <strong>${partnerName}</strong>.</p>
        <p>Hacé clic en el siguiente enlace para contactar a tu match directamente por WhatsApp y arreglar los detalles:</p>
        <a href="${waLink}" style="display:inline-block;padding:10px 20px;background-color:#25D366;color:white;text-decoration:none;border-radius:5px;">Contactar por WhatsApp</a>
        <p>¡Gracias por usar el Permutero de DND!</p>
      `;

      if (RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "DND Permutero <permutas@tudominio.com>",
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
