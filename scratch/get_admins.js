import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `docker exec -i supabase-db psql -U postgres -d postgres -c "
    SELECT p.id, p.full_name, p.role, au.email 
    FROM public.profiles p 
    JOIN auth.users au ON p.id = au.id;
  "`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== USERS AND ROLES ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
