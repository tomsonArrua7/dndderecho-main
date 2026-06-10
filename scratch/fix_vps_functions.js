import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `
# Remove broken symlinks
rm -f /root/supabase/docker/volumes/functions/mass-mailing
rm -f /root/supabase/docker/volumes/functions/send-match-email

# Copy actual directories
cp -r /home/dndjursoc/htdocs/dndjursoc.com.ar/supabase/functions/mass-mailing /root/supabase/docker/volumes/functions/
cp -r /home/dndjursoc/htdocs/dndjursoc.com.ar/supabase/functions/send-match-email /root/supabase/docker/volumes/functions/

echo "=== VERIFY VOLUMES FILES ==="
ls -la /root/supabase/docker/volumes/functions/mass-mailing
ls -la /root/supabase/docker/volumes/functions/send-match-email
`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== FIX OUTPUT ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
