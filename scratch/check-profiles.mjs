import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
const URL = "https://mnbzsamjjedbzwncichx.supabase.co";
const KEY = "sb_publishable_r-nXAS_Axj91S29dmzJk5Q_FD6h2rF6";
const supabase = createClient(URL, KEY);

async function run() {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);
  if (error) console.error(error);
  else console.log("Columns:", Object.keys(data[0] || {}));
}
run();
