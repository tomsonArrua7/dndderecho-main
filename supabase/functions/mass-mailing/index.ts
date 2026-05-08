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

    // Debug Log
    console.log("Iniciando envío masivo...");

    // Intentamos obtener usuarios desde auth.admin
    const { data: { users }, error: listError } = await supabaseClient.auth.admin.listUsers();

    if (listError) {
      console.error("Error al listar usuarios de Auth:", listError);
      throw listError;
    }

    console.log(`Usuarios en Auth encontrados: ${users?.length || 0}`);

    const emails = users
      .map(u => u.email)
      .filter(email => email && email.includes("@")) as string[];

    console.log(`Emails válidos para enviar: ${emails.length}`);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "No se encontraron emails" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let sentCount = 0;

    if (RESEND_API_KEY) {
      const CHUNK_SIZE = 45;
      for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
        const chunk = emails.slice(i, i + CHUNK_SIZE);
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "DND Derecho <onboarding@resend.dev>",
            to: chunk,
            subject: subject,
            html: `<div>${body.replace(/\n/g, "<br>")}</div>`,
          }),
        });
        if (res.ok) sentCount += chunk.length;
        else console.error("Error en chunk de Resend:", await res.text());
      }
    }

    return new Response(JSON.stringify({ success: true, sent: sentCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error crítico en la función:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
