const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // 1. Tampilin chat user
    addMessage(message, 'user');
    userInput.value = '';
    userInput.disabled = true;

    // 2. Tampilin "AnshorAi lagi ngetik..."
    addMessage('lagi mikir dulu...', 'ai loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // 3. Hapus loading, ganti sama jawaban AI
        removeLoading();
        addMessage(data.reply, 'ai');

    } catch (error) {
        console.error('Error:', error);
        removeLoading();
        addMessage('Waduh error bro. Coba refresh dulu ya 😅', 'ai error');
    } finally {
        userInput.disabled = false;
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
