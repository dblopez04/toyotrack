// server.js (ESM; add "type":"module" in package.json)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: "../.env" });
const app = express();
app.use(cors({ origin: true })); // tighten for prod
app.use(express.json());

// 🔑 DEBUG: check that the env var is actually loaded
console.log("GEMINI_API_KEY present?", !!process.env.GEMINI_API_KEY);

// Create a single client object (new SDK pattern)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Pick a fast model (Flash).
const MODEL = "gemini-2.0-flash";

const SYSTEM_PROMPT = `
You are a concise car-finance helper inside a Toyota shopping app.
Explain lease vs finance and payment tradeoffs in simple language.
Use numbers from context if provided. Do not give legal or official advice.
Keep replies to ~3–5 sentences.
`.trim();

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], car = null, financeContext = null } = req.body;

    // Pull just the last user turn for a lightweight hackathon flow
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] }, // pseudo-system
      {
        role: "user",
        parts: [
          {
            text: `Context:
Selected car: ${car ? JSON.stringify(car) : "none"}
Finance numbers: ${financeContext ? JSON.stringify(financeContext) : "none"}

User: ${lastUser}`,
          },
        ],
      },
    ];

    const result = await ai.models.generateContent({
      model: MODEL,
      contents,
    });

    res.json({ reply: result.text });
  } catch (err) {
    console.error("❌ Gemini API error details:", err);
    res.status(500).json({ error: "Gemini API error", message: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 4000, () =>
  console.log(`API on http://localhost:${process.env.PORT || 4000}`)
);
