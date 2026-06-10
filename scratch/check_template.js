import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
echo "=== TAMAÑO Y ENCODING DEL TEMPLATE ==="
file /root/supabase/docker/volumes/auth/confirmation.html
wc -l /root/supabase/docker/volumes/auth/confirmation.html

echo ""
echo "=== PRIMERAS 20 LÍNEAS ==="
head -20 /root/supabase/docker/volumes/auth/confirmation.html

echo ""
echo "=== BUSCAR ConfirmationURL EN EL TEMPLATE ==="
grep -n "ConfirmationURL" /root/supabase/docker/volumes/auth/confirmation.html

echo ""
echo "=== LOGS RECIENTES DEL AUTH (buscar errores de template) ==="
docker logs supabase-auth --tail 20 2>&1 | grep -i "template\\|error\\|mail\\|smtp"
`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
    .on('data', (c) => process.stdout.write(c))
    .stderr.on('data', () => {});
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
