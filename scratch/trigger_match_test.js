import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `curl -i -X POST http://localhost:8000/functions/v1/send-match-email \\
  -H "Content-Type: application/json" \\
  -d '{
    "record": {
      "id": "09bae8fe-6bcf-472c-9c42-87c10bd325cd",
      "permuta_a": "95ea7eac-2210-4f84-bec7-d68969be54bb",
      "permuta_b": "f7f949f1-7aa2-43d6-9d63-aed05d1dd939",
      "user_a": "d306dd80-9e77-4d4e-adab-845554c2c1d1",
      "user_b": "7dcd6f1d-d40b-44be-950e-3777bd8d6d12",
      "notified": false
    }
  }'`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== CURL OUTPUT ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
