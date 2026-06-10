import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `
# Remove any existing broken links or files
rm -rf /root/supabase/docker/volumes/functions/mass-mailing
rm -rf /root/supabase/docker/volumes/functions/send-match-email

# Create symlinks
ln -s /home/dndjursoc/htdocs/dndjursoc.com.ar/supabase/functions/mass-mailing /root/supabase/docker/volumes/functions/mass-mailing
ln -s /home/dndjursoc/htdocs/dndjursoc.com.ar/supabase/functions/send-match-email /root/supabase/docker/volumes/functions/send-match-email

echo "=== VERIFY SYMLINKS ==="
ls -la /root/supabase/docker/volumes/functions
`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== SYMLINK CREATION OUTPUT ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
