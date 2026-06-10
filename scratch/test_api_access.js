import { createClient } from "@supabase/supabase-js";

const URL = "https://api.dndjursoc.com.ar";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";

const supabase = createClient(URL, KEY);

async function run() {
  const { data, error } = await supabase.from("user_plan_progress").select("*").limit(5);
  if (error) {
    console.error("API Error:", error);
  } else {
    console.log("API Success:", data);
  }
}
run();
