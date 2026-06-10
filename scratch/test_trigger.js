import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection OK');

  const cmd = `docker exec -i supabase-db psql -U postgres -d postgres -c "
    DELETE FROM public.matches WHERE permuta_a = '95ea7eac-2210-4f84-bec7-d68969be54bb' AND permuta_b = 'f7f949f1-7aa2-43d6-9d63-aed05d1dd939';
    
    INSERT INTO public.matches (permuta_a, permuta_b, user_a, user_b)
    VALUES (
      '95ea7eac-2210-4f84-bec7-d68969be54bb',
      'f7f949f1-7aa2-43d6-9d63-aed05d1dd939',
      'd306dd80-9e77-4d4e-adab-845554c2c1d1',
      '7dcd6f1d-d40b-44be-950e-3777bd8d6d12'
    );
  "`;

  let out = '';
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('=== SQL TRIGGER TEST ===');
      console.log(out);
      conn.end();
    }).on('data', (c) => {
      out += c;
    }).stderr.on('data', (d) => {
      out += 'STDERR: ' + d;
    });
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
