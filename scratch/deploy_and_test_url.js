import { Client } from 'ssh2';
import fs from 'fs';

// Read the clean template from local file
const localTemplateHTML = fs.readFileSync('scratch/confirmation.html', 'utf8');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH OK');

  // We write the file on the server using python
  const escapedTemplate = localTemplateHTML.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  const cmd = `
# Crear directorio templates en el webroot si no existe
mkdir -p /home/dndjursoc/htdocs/dndjursoc.com.ar/templates
chown -R dndjursoc:dndjursoc /home/dndjursoc/htdocs/dndjursoc.com.ar/templates

# Escribir el archivo
cat << 'EOF' > /home/dndjursoc/htdocs/dndjursoc.com.ar/templates/confirmation.html
${localTemplateHTML}
EOF

# Cambiar owner
chown dndjursoc:ftp-user /home/dndjursoc/htdocs/dndjursoc.com.ar/templates/confirmation.html
chmod 644 /home/dndjursoc/htdocs/dndjursoc.com.ar/templates/confirmation.html

echo "=== VERIFY FILE ON WEBROOT ==="
ls -la /home/dndjursoc/htdocs/dndjursoc.com.ar/templates/confirmation.html

echo "=== TEST FETCH FROM HOST ==="
curl -sI https://dndjursoc.com.ar/templates/confirmation.html | head -n 10

echo "=== TEST FETCH FROM AUTH CONTAINER ==="
docker exec supabase-auth wget -qO- https://dndjursoc.com.ar/templates/confirmation.html | head -n 5
`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      fs.writeFileSync('scratch/deploy_and_test_result.txt', out);
      console.log('Deploy and test result saved to scratch/deploy_and_test_result.txt');
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
