import { Client } from 'ssh2';

// Template HTML limpio sin comentarios, sin caracteres problemáticos
// Sintaxis Go-template correcta: {{ .ConfirmationURL }}
const templateHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirma tu cuenta</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1b2a;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1b2a;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

<tr><td align="center" style="padding-bottom:24px;">
<img src="https://dndjursoc.com.ar/dnd-logo.png" width="140" alt="DND Derecho UNLP" style="display:block;max-width:140px;height:auto;">
</td></tr>

<tr><td style="background-color:#111827;border-radius:16px;border:1px solid #1e293b;overflow:hidden;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="background:linear-gradient(135deg,#be123c 0%,#9f1239 100%);padding:28px 36px;text-align:center;">
<p style="margin:0 0 6px 0;color:#fecdd3;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:3px;">Plataforma Estudiantil</p>
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">DND DERECHO UNLP</h1>
</td></tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:40px 36px;text-align:center;">

<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px auto;">
<tr><td width="64" height="64" style="background-color:#1e3a5f;border-radius:50%;text-align:center;vertical-align:middle;font-size:28px;line-height:64px;">&#9993;</td></tr>
</table>

<h2 style="margin:0 0 14px 0;color:#f1f5f9;font-size:20px;font-weight:700;">Confirma tu direccion de correo</h2>
<p style="margin:0 0 32px 0;color:#94a3b8;font-size:14px;line-height:1.7;">
Para activar tu cuenta de alumno y acceder al plan de estudios,<br>apuntes y permutas de comision, hace clic en el boton de abajo.
</p>

<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px auto;">
<tr><td bgcolor="#be123c" style="border-radius:10px;">
<a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:15px 40px;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;border-radius:10px;">
Confirmar mi Cuenta
</a>
</td></tr>
</table>

<p style="margin:0 0 8px 0;color:#475569;font-size:11px;">Si el boton no funciona, copia y pega este enlace en tu navegador:</p>
<p style="margin:0;"><a href="{{ .ConfirmationURL }}" style="color:#60a5fa;font-size:11px;word-break:break-all;">{{ .ConfirmationURL }}</a></p>

</td></tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="background-color:#0f172a;padding:20px 36px;border-top:1px solid #1e293b;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="50%" style="vertical-align:top;padding-right:12px;">
<p style="margin:0 0 4px 0;color:#64748b;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Acceso a</p>
<p style="margin:0;color:#94a3b8;font-size:12px;">Plan de estudios, Apuntes, Permutas, Calendario</p>
</td>
<td width="50%" style="vertical-align:top;padding-left:12px;border-left:1px solid #1e293b;">
<p style="margin:0 0 4px 0;color:#64748b;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Facultad</p>
<p style="margin:0;color:#94a3b8;font-size:12px;">Cs. Juridicas y Sociales, UNLP</p>
</td>
</tr>
</table>
</td></tr>
</table>

</td></tr>

<tr><td style="padding:20px 0;text-align:center;">
<p style="margin:0;color:#334155;font-size:11px;">Agrupacion Estudiantil <strong style="color:#475569;">Defendamos Nuestro Derecho</strong></p>
<p style="margin:6px 0 0 0;color:#334155;font-size:11px;">Si no creaste esta cuenta, podes ignorar este correo.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH OK');

  // Escribir el template a un archivo temporal y luego moverlo
  let i = 0;
  const lines = templateHTML.split('\n');
  
  // Crear el archivo limpio usando python3 para manejar el contenido correctamente
  const pythonScript = `
content = """${templateHTML.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}"""
with open('/root/supabase/docker/volumes/auth/confirmation.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Template escrito OK, bytes:', len(content.encode('utf-8')))
`;

  const cmd = `python3 << 'PYEOF'
content = open('/dev/stdin').read() if False else None

# Escribir template directo sin heredoc para evitar problemas de escape
import sys

template = """${templateHTML.replace(/\\/g, '\\\\').replace(/`/g, '\\`')}"""

with open('/root/supabase/docker/volumes/auth/confirmation.html', 'w', encoding='utf-8') as f:
    f.write(template)

# Verificar
with open('/root/supabase/docker/volumes/auth/confirmation.html', 'r') as f:
    data = f.read()

print(f'Escrito OK: {len(data)} bytes')
print('Tiene ConfirmationURL:', '{{ .ConfirmationURL }}' in data)
print('Tiene DOCTYPE:', 'DOCTYPE' in data)
PYEOF`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', () => {
      console.log(out);
      // Restart auth
      conn.exec(`cd /root/supabase/docker/ && docker compose restart auth && echo "Auth reiniciado" && docker compose ps auth`, (err2, stream2) => {
        if (err2) throw err2;
        stream2.on('close', () => conn.end())
        .on('data', (c) => process.stdout.write(c))
        .stderr.on('data', (d) => process.stderr.write('STDERR: ' + d));
      });
    }).on('data', (c) => { out += c; process.stdout.write(c); })
    .stderr.on('data', (d) => process.stderr.write('STDERR: ' + d));
  });
}).connect({ host: '200.58.102.187', port: 22, username: 'root', password: '42428511tgAAA.A' });
