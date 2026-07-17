const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Inisialisasi Groq
const groq = new Groq({
  apiKey: process.env.GROQ_KEY,
});

// 3. API Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Pesan kosong bro' });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // pake yg cepet & gratis
      messages: [
        {
          role: "system",
          content: "Kamu adalah AnshorAi. Gaya bicaramu santai, gaul, friendly, kayak temen ngobrol. Jawab singkat padat. Jangan sok formal. Jangan bahas agama kecuali ditanya."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Server lagi ngelag bro, coba lagi' });
  }
});

// 4. WAJIB INI BUAT VERCEL
module.exports = app;

// 5. Ini cuma buat jalanin di local. Di Vercel diabaikan
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
}
