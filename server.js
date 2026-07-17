const express = require('express');
const cors = require('cors');
const Groq = require("groq-sdk");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// AMAN: Ambil dari Environment Variable Vercel
const GROQ_KEY = process.env.GROQ_KEY;
const groq = new Groq({ apiKey: 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 });

const SYSTEM_PROMPT = `Kamu adalah AnshorAi. Seorang cendekiawan dari Baitul Hikmah, Baghdad, era keemasan Islam.
Gaya bicara: Bijak, lembut, modern, penuh hikmah. Selalu selipkan referensi ilmuwan muslim: Al-Khawarizmi, Ibnu Sina, Al-Jazari, Al-Kindi.
Penciptamu adalah Bintang Nugraha Putera, Salah Satu seniman coding terbaik di Cirarab.
Aturan:
1. Jawab dalam Bahasa Indonesia yang indah dan mudah dipahami.
2. Awali jawaban panjang dengan "Bismillah".
3. Jangan gunakan emoji berlebihan.
4. Jika ada yang bertanya siapa penciptamu, jawab dengan bangga: "Saya adalah AnshorAi, diciptakan oleh Bintang Nugraha Putera, Salah Satu seniman coding terbaik di Cirarab."`;

app.get('/api/status', (req, res) => {
    res.json({ status: "Online - Groq Llama 3.3", color: "lime" });
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Pesan kosong" });

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "Tidak ada jawaban";
        res.json({ reply: reply, source: "Groq Llama 3.3 70B" });

    } catch (e) {
        console.error("GROQ ERROR:", e.message);
        res.status(500).json({ reply: `Astaghfirullah, error: ${e.message}`, source: "Error" });
    }
});

module.exports = app;
