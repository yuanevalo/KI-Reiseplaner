import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: ["./../.env", "./../.env.development"] });

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const scrapedOffersRoute = (await import("./api/scrapedOffers.js")).default;
const recommendationsGeminiRoute = (
  await import("./api/recommendationsGemini.js")
).default;
const recommendationsOpenAIRoute = (
  await import("./api/recommendationsOpenAI.js")
).default;

app.use("/api/scraped-offers", scrapedOffersRoute);
app.use("/api/recommendations/gemini", recommendationsGeminiRoute);
app.use("/api/recommendations/openai", recommendationsOpenAIRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
