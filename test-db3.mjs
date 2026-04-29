import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
const URL = "https://mnbzsamjjedbzwncichx.supabase.co";
const KEY = "sb_publishable_r-nXAS_Axj91S29dmzJk5Q_FD6h2rF6";
const supabase = createClient(URL, KEY);

async function run() {
  try {
    const res = await Promise.all([
      supabase.from("materias").select("id,nombre,anio").order("anio").order("nombre"),
      supabase.from("permutas").select("*, materias(nombre, anio)").or("status.eq.activa,status.is.null").order("created_at", { ascending: false }),
      supabase.from("app_settings").select("permutero_activo").eq("id", 1).maybeSingle(),
    ]);
    console.log("Success:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Caught error:", err);
  }
}
run();
