import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const googleGenAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "GEMINI_API_KEY"
);

async function getAvailableModel() {
  const models = ["gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
  for (const modelName of models) {
    try {
      const model = googleGenAI.getGenerativeModel({ model: modelName });
      await model.generateContent("Test");
      console.log(`✅ Modell verbunden: ${modelName}`);
      return model;
    } catch (err) {
      console.warn(`⚠️ Fehler mit ${modelName}: ${err.message}`);
    }
  }
  throw new Error("Kein Gemini-Modell verfügbar");
}

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
        "name": "Name der Reise",
        "description": "Beschreibung",
        "estimatedPrice": "Preis",
        "recommendedDuration": "Dauer",
        "source": "URL"
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
    const model = await getAvailableModel();
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
