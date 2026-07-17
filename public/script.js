const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// INI MEMORINYA. Nyimpen 10 chat terakhir
let chatHistory = [];

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // 1. Tampilin chat user
    addMessage(message, 'user');
    chatHistory.push({ role: "user", content: message }); // simpen ke memori
    
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // 2. Tampilin "lagi ngetik..."
    addMessage('lagi mikir dulu...', 'ai loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // KIRIM PESAN + RIWAYAT BIAR AI INGET
            body: JSON.stringify({ 
                message: message,
                history: chatHistory.slice(-20) // kirim 20 pesan terakhir = 10 chat
            }),
        });

        if (!response.ok) {
            throw new Error('Gagal konek ke server');
        }

        const data = await response.json();
        
        // 3. Hapus loading, ganti sama jawaban AI
        removeLoading();
        addMessage(data.reply, 'ai');
        chatHistory.push({ role: "assistant", content: data.reply }); // simpen jawaban AI

        // 4. Biar memori ga kepenuhan, potong jadi 20 terakhir aja
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(-20);
        }

    } catch (error) {
        console.error('Error:', error);
        removeLoading();
        addMessage('Waduh servernya ngelag bro. Coba refresh 😅', 'ai error');
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `<p>${text}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // auto scroll ke bawah
}

function removeLoading() {
    const loadingMessage = chatBox.querySelector('.ai.loading');
    if (loadingMessage) {
        chatBox.removeChild(loadingMessage);
    }
}

// Biar bisa pencet Enter buat kirim
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Biar bisa klik tombol kirim
sendBtn.addEventListener('click', sendMessage);
