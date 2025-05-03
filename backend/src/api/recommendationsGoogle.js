import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const googleGenAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "GEMINI_API_KEY"
);

function buildPrompt({ destination, budget, duration, interests }) {
  return `
    Du bist ein KI-Reiseberater. Empfehle 3 bis 5 Reiseoptionen:
    Ziel: ${destination}
    Budget: ${budget} Euro
    Dauer: ${duration} Tage
    Interessen: ${interests}

    Antwortformat:
    [
      {
        "name": "...",
        "description": "...",
        "estimatedPrice": 1234,
        "recommendedDuration": 7,
        "source": "https://..."
      },
      ...
    ]`;
}

function extractJson(raw) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Kein JSON gefunden.");
  return JSON.parse(match[0]);
}

router.post("/", async (req, res) => {
  const { destination, budget, duration, interests } = req.body;

  try {
    const model = await googleGenAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });
    const prompt = buildPrompt({ destination, budget, duration, interests });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    console.log("🧠 Google-Antwort:", raw);

    const recommendations = extractJson(raw);
    res.json({ recommendations });
  } catch (error) {
    console.error("❌ Google-Fehler:", error.message);
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
});

export default router;
