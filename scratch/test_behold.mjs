
async function test() {
  try {
    const res = await fetch('https://behold.so/api/feed/VLE0e125oUyyQydPF11F');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data).slice(0, 200));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
