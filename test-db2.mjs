const URL = "https://mnbzsamjjedbzwncichx.supabase.co/rest/v1";
const KEY = "sb_publishable_r-nXAS_Axj91S29dmzJk5Q_FD6h2rF6";

const opts = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };

Promise.all([
  fetch(`${URL}/app_settings?select=permutero_activo`, opts).then(r => r.json()),
  fetch(`${URL}/permutas?limit=1`, opts).then(r => r.json())
]).then(res => {
  console.log(JSON.stringify(res, null, 2));
}).catch(console.error);
