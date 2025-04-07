import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* +++ scraped offers +++ */

const url = "https://booking-dp.lastminute.de/";

app.get("/api/scraped-offers", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set a user agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
    );

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // Check if we're past the CAPTCHA
    const content = await page.content();
    if (content.includes("Nur einen Moment…")) {
      throw new Error("CAPTCHA erkannt – Zugriff blockiert!");
    }

    // Scrape die Titel und Preise
    const results = await page.evaluate(() => {
      // Nur div-Elemente mit einer bestimmten Klasse, die das Angebot enthalten
      return Array.from(
        document.querySelectorAll(
          "div[class*='HubOfferFolderstyles__CardContentWrapper']"
        )
      ).map((offer) => ({
        title: offer.querySelector("h4")
          ? offer.querySelector("h4").textContent
          : null,
        price: offer.querySelector("span")
          ? offer.querySelector("span").textContent
          : null,
        image: offer.querySelector("img")
          ? offer.querySelector("img").src
          : null,
      }));
    });

    res.json(results);
  } catch (error) {
    console.error("❌ Scraping-Fehler:", error);
    res.status(503).json({ error: `Fehler beim Abrufen: ${error.message}` });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

/* --- scraped offers --- */
/* +++ Google Generative AI +++ */

const googleGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAvailableModel() {
  const models = ["gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

  for (const modelName of models) {
    try {
      const model = googleGenAI.getGenerativeModel({ model: modelName });
      await model.generateContent("Test");
      console.log(`✅ Modell erfolgreich verbunden: ${modelName}`);
      return model;
    } catch (err) {
      console.warn(`⚠️ Modellfehler (${modelName}): ${err.message}`);
    }
  }

  throw new Error("Kein verfügbares Modell gefunden.");
}

function buildPrompt({ destination, budget, duration, interests }) {
  return `Du bist ein KI-Reiseberater. Empfehle 3 bis 5 Reiseoptionen basierend auf den folgenden Präferenzen:
Ziel: ${destination}
Budget: ${budget} Euro
Dauer: ${duration} Tage
Interessen: ${interests}

Suche bitte mithilfe des Internets nach echten Reiseangeboten und gib echte Quellen/Links an. Budget darf um ±10 % abweichen.

Antwortformat:
[
  {
    "name": "Name der Reise",
    "description": "Detaillierte Beschreibung",
    "estimatedPrice": "Geschätzter Preis",
    "recommendedDuration": "Empfohlene Dauer",
    "source": "URL zur Quelle"
  },
  ...
]`;
}

function extractJson(raw) {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Kein JSON-Array in Antwort gefunden.");
  return JSON.parse(match[0]);
}

app.post("/api/recommendations/gemini", async (req, res) => {
  const { destination, budget, duration, interests } = req.body;

  try {
    const model = await getAvailableModel();
    const prompt = buildPrompt({ destination, budget, duration, interests });

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    console.log("🧠 Rohantwort:", rawResponse);

    const cleaned = extractJson(rawResponse);

    res.json({ success: true, recommendations: cleaned });
  } catch (error) {
    console.error("❌ Fehler:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      fallback: [
        {
          name: "Strandurlaub an der Costa del Sol",
          description:
            "Wunderschöner Urlaub mit Sonne, Strand und Entspannung.",
          estimatedPrice: "950",
          recommendedDuration: "7",
          source: "https://www.example-travel.com/costa-del-sol",
        },
        {
          name: "Städtereise nach Paris",
          description:
            "Erleben Sie die romantischste Stadt Europas mit Kunst, Kultur und Gastronomie.",
          estimatedPrice: "800",
          recommendedDuration: "5",
          source: "https://www.example-travel.com/paris-city-break",
        },
      ],
    });
  }
});

/* --- Google Generative AI --- */
/* --- Open AI --- */

const openaiClient = new OpenAI(process.env.OPENAI_API_KEY);

app.post("/api/recommendations/openai", async (req, res) => {
  const preferences = req.body;

  const messages = [
    {
      role: "system",
      content:
        "Du bist ein Reiseberater. Gib auf Basis der Nutzerpräferenzen maximal 3 passende Reiseziele aus – im JSON-Format.",
    },
    {
      role: "user",
      content: `Hier sind die Wünsche des Nutzers:\nReiseziel: ${preferences.destination}\nBudget: ${preferences.budget} Euro\nReisedauer: ${preferences.duration} Tage\nInteressen: ${preferences.interests}\n\nBitte antworte im folgenden JSON-Format:\n[\n  {\n    "name": "Reiseziel",\n    "description": "Kurzbeschreibung",\n    "estimatedPrice": 1234,\n    "recommendedDuration": 7,\n    "source": "https://..." (optional)\n  }, ...\n]`,
    },
  ];

  try {
    const chatCompletion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
    });

    const aiReply = chatCompletion.choices[0].message.content;

    let recommendations;
    try {
      recommendations = JSON.parse(aiReply);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Antwort der KI konnte nicht als JSON interpretiert werden.",
        raw: aiReply,
      });
    }

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    const status = error.status || 500;

    console.error("❌ Fehler bei der OpenAI-Anfrage:", error.message);
    if (error.response?.headers) {
      console.error("Headers:", error.response.headers);
    }

    // Extra-Handling bei 429-Fehler
    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: "Rate Limit erreicht. Bitte versuche es später erneut.",
      });
    }

    res.status(status).json({
      success: false,
      message: "Fehler bei der Anfrage an OpenAI",
    });
  }
});

/* --- Open AI --- */

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
