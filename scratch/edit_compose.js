import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const pythonScript = `
import sys

filepath = '/root/supabase/docker/docker-compose.yml'
with open(filepath, 'r') as f:
    content = f.read()

target = '      VERIFY_JWT: "\${FUNCTIONS_VERIFY_JWT}"'
replacement = '      VERIFY_JWT: "\${FUNCTIONS_VERIFY_JWT}"\\n      RESEND_API_KEY: "\${SMTP_PASS}"'

if target in content:
    if 'RESEND_API_KEY' not in content[content.find(target):content.find(target)+300]:
        new_content = content.replace(target, replacement)
        with open(filepath, 'w') as f:
            f.write(new_content)
        print("Success: RESEND_API_KEY added to functions environment.")
    else:
        print("Notice: RESEND_API_KEY already present in functions environment.")
else:
    print("Error: Target string not found in docker-compose.yml.")
`;

  // Base64 encode the script to avoid shell escaping issues
  const b64script = Buffer.from(pythonScript).toString('base64');
  const cmd = `
python3 -c "import base64; exec(base64.b64decode('${b64script}').decode('utf-8'))"
echo "=== RESTARTING FUNCTIONS CONTAINER ==="
cd /root/supabase/docker
docker compose up -d functions
`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== EXECUTION OUTPUT ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
