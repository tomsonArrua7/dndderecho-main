import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all global events
    const { data: eventos, error } = await supabaseClient
      .from("eventos")
      .select("*")
      .eq("es_global", true)
      .order("fecha");

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DND Jursoc//Calendario Academico//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Avisos Fundamentales - DND Derecho",
      "X-WR-TIMEZONE:America/Argentina/Buenos_Aires",
    ];

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const cleanText = (str: string | null) => {
      if (!str) return "";
      return str.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    };

    (eventos || []).forEach((e: any) => {
      const start = new Date(e.fecha);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${e.id}@dndjursoc.com.ar`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:${cleanText(e.titulo)}`,
        `DESCRIPTION:${cleanText(e.descripcion)}`,
        "LOCATION:Facultad de Derecho UNLP",
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");

    const responseBody = icsContent.join("\r\n");

    return new Response(responseBody, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="avisos-dnd.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        ...corsHeaders,
      },
      status: 200,
    });
  } catch (err) {
    console.error("Unexpected error in calendar-ics function:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
