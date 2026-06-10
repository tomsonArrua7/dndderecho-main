import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `stat /home/dndjursoc/htdocs/dndjursoc.com.ar/index.html && stat /root/supabase/docker/volumes/functions/mass-mailing/index.ts`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== FILES STAT ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
