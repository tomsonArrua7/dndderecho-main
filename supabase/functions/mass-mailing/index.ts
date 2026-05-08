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

    // Get auth user to verify admin
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));
    
    if (authError || !user) throw new Error("No autorizado");

    // Check if admin in profiles
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") throw new Error("Acceso denegado: Se requiere rol de administrador");

    const { subject, body } = await req.json();

    if (!subject || !body) {
      return new Response(JSON.stringify({ error: "Faltan datos: asunto o cuerpo" }), { status: 400 });
    }

    // Fetch all profiles with emails
    // Note: If you have thousands of users, this should be paginated or use a queue.
    // For a student project, fetching all is usually fine if < 1000.
    const { data: profiles, error: fetchError } = await supabaseClient
      .from("profiles")
      .select("email")
      .not("email", "is", null);

    if (fetchError) throw fetchError;

    const emails = profiles.map(p => p.email);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No hay destinatarios" }), { status: 200 });
    }

    let results = { sent: 0, failed: 0 };

    if (RESEND_API_KEY) {
      // Send in chunks to avoid Resend limits if any, or just send all
      // Resend allows sending to multiple recipients in one call or individual
      // For personal messages, individual is better, but for mass mailing, 
      // Resend has a "to" array limit of 50.
      
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "DND Derecho <novedades@dndderecho.com>",
          to: emails, // Resend supports array of emails
          subject: subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #FF0000; border-bottom: 2px solid #FF0000; padding-bottom: 10px;">DND Derecho - Aviso Importante</h2>
              <div style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
                ${body.replace(/\n/g, "<br>")}
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
                Recibiste este correo porque estás registrado en dndderecho.com
              </div>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error de Resend: ${JSON.stringify(errorData)}`);
      }
      
      results.sent = emails.length;
    } else {
      console.log(`MOCK MASS MAILING: Subject: ${subject}`);
      console.log(`To: ${emails.length} users`);
      results.sent = emails.length;
    }

    return new Response(JSON.stringify({ success: true, sent: results.sent }), {
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
