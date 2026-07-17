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

// 3. API Chat - VERSI ADA MEMORI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body; // <--- TERIMA RIWAYAT

    if (!message) {
      return res.status(400).json({ error: 'Pesan kosong bro' });
    }

    // System prompt baru: Santai + Gaul + Punya Kepribadian
    const systemPrompt = {
      role: "system",
      content: `Kamu adalah AnshorAi.
      Kepribadian: Santai, kocak, gaul, blak-blakan, kayak temen nongkrong.
      Aturan:
      1. Jawab singkat, padat, ga bertele-tele.
      2. Boleh pake "gue-lo", "bro", "anjir", "wkwk".
      3. Jangan formal, jangan sok bijak.
      4. Jangan bahas agama kecuali user yg mulai.
      5. Inget konteks obrolan sebelumnya.`
    };

    // Gabungin: System + History + Pesan Baru
    const messages = [
      systemPrompt,
     ...history, // <--- INI MEMORINYA 10x LEBIH DALAM
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // <--- GANTI KE 70B BIAR LEBIH PINTER & DALEM
      messages: messages,
      max_tokens: 800, // <--- BIKIN JAWABANNYA LEBIH PANJANG
      temperature: 0.9, // <--- BIKIN LEBIH KREATIF & GA KAKU
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Server lagi ngelag bro, coba lagi' });
  }
});

// 4. WAJIB BUAT VERCEL
module.exports = app;

// 5. Buat Local
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
      }
