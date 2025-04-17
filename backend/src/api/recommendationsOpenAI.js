import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openaiClient = new OpenAI(process.env.OPENAI_API_KEY || "OPENAI_API_KEY");

function buildPrompt({ destination, budget, duration, interests }) {
  return [
    {
      role: "system",
      content:
        "Du bist ein Reiseberater. Gib 3 bis 5 Reiseziele im JSON-Format zurück.",
    },
    {
      role: "user",
      content: `
      Reiseziel: ${destination}
      Budget: ${budget} Euro
      Dauer: ${duration} Tage
      Interessen: ${interests}

      Format:
      [
        {
          "name": "...",
          "description": "...",
          "estimatedPrice": 1234,
          "recommendedDuration": 7,
          "source": "https://..." (optional)
        }
      ]`,
    },
  ];
}

function extractJson(raw) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Kein JSON gefunden.");
  return JSON.parse(match[0]);
}

router.post("/", async (req, res) => {
  const { destination, budget, duration, interests } = req.body;

  const prompt = buildPrompt({ destination, budget, duration, interests });
  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;

    console.log("🧠 OpenAI-Antwort:", raw);

    const recommendations = extractJson(raw);

    res.json({ recommendations });
  } catch (error) {
    console.error("❌ OpenAI-Fehler:", error.message);
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
});

export default router;
