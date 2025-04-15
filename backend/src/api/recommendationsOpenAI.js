import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openaiClient = new OpenAI(process.env.OPENAI_API_KEY || "OPENAI_API_KEY");

router.post("/", async (req, res) => {
  const { destination, budget, duration, interests } = req.body;

  const messages = [
    {
      role: "system",
      content:
        "Du bist ein Reiseberater. Gib 1-3 Reiseziele im JSON-Format zurück.",
    },
    {
      role: "user",
      content: `Reiseziel: ${destination}\nBudget: ${budget} Euro\nDauer: ${duration} Tage\nInteressen: ${interests}\n\nFormat:\n[\n  {\n    "name": "...",\n    "description": "...",\n    "estimatedPrice": 1234,\n    "recommendedDuration": 7,\n    "source": "https://..." (optional)\n  }\n]`,
    },
  ];

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
    });

    const aiReply = completion.choices[0].message.content;
    const recommendations = JSON.parse(aiReply);

    res.json({ success: true, recommendations });
  } catch (error) {
    console.error("❌ OpenAI Fehler:", error.message);
    res.status(error.status || 500).json({
      success: false,
      message: "Fehler bei der Anfrage an OpenAI",
    });
  }
});

export default router;
