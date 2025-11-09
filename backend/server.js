const express = require('express');
const cors = require('cors');
// 1. Import the modern SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 2. Initialize using the new class
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 3. Get the model and set the system instruction *once*
// This is more efficient than doing it on every request.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "You are a helpful finance assistant.",
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 4. Call generateContent with just the user's message string
    const result = await model.generateContent(message);
    const response = result.response;

    // 5. Use the correct path to parse the response text
    const botText = response.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    res.json({ reply: botText });
  } catch (err) {
    console.error('AI Error:', err.message);
    // Send more specific error details if available
    let errorDetails = err.message;
    if (err.response && err.response.data) {
        errorDetails = JSON.stringify(err.response.data);
    }
    res.status(500).json({ error: 'AI request failed', details: errorDetails });
  }
});

app.listen(4000, () => console.log('Chatbot API running on http://localhost:4000'));
