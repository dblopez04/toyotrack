const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

let conversation = [
  { role: 'system', content: 'You are a helpful finance assistant.' }
];

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });
    const botText = response?.candidate?.[0]?.content?.[0]?.text || "No reply";
    res.json({ reply: botText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI request failed', details: err.message });
  }
});

app.listen(4000, () => console.log('Chatbot API running on http://localhost:4000'));
