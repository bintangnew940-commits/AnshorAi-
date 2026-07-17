// Cek status API
fetch('/api/status')
.then(res => res.json())
.then(data => {
  document.getElementById('status').innerText = data.status;
  document.getElementById('status').style.color = data.color;
})
.catch(() => {
  document.getElementById('status').innerText = "Gagal Cek";
  document.getElementById('status').style.color = "red";
});

// Ganti Tab - VERSI FIX
function showTab(tabName, element) {
  // Sembunyiin semua tab
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  // Hapus active di semua menu
  document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
  // Tampilkan tab yang diklik
  document.getElementById(tabName).classList.add('active');
  // Kasih active ke menu yang diklik
  element.classList.add('active');
}

// Kirim Chat
let history = [];
async function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  input.value = '';
  history.push({ role: "user", content: message });

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await res.json();
    addMessage(`[${data.source}] ${data.reply}`, 'bot');
    history.push({ role: "assistant", content: data.reply });
  } catch {
    addMessage("[Error] Gagal terhubung ke server", 'bot');
  }
}

function addMessage(text, sender) {
  const chatBox = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerHTML = `<b>${sender === 'user'? 'Kamu' : 'AnshorAi'}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Jadwal Sholat
async function getJadwal() {
  const kota = document.getElementById('kota').value;
  if(!kota) return alert("Isi nama kota dulu");
  document.getElementById('jadwalResult').innerHTML = "Loading...";
  try {
    const res = await fetch(`/api/islamic/jadwal/${kota}`);
    const data = await res.json();
    document.getElementById('jadwalResult').innerHTML = `<pre style="background:#0A1128;padding:10px;border-radius:10px;">${JSON.stringify(data, null, 2)}</pre>`;
  } catch {
    document.getElementById('jadwalResult').innerHTML = "Gagal ambil data";
  }
}

// Enter to send
document.getElementById('userInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
