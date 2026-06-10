import { Client } from 'ssh2';
import fs from 'fs';

const migrationSql = fs.readFileSync('supabase/migrations/20260610010000_match_notification_trigger.sql', 'utf8');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `docker exec -i supabase-db psql -U postgres -d postgres << 'EOF'
${migrationSql}
EOF
`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== MIGRATION OUTPUT ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
