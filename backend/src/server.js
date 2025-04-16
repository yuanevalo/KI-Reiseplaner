import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: ["./.env", "./../.env"] });

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const scrapedOffersRoute = (await import("./api/scrapedOffers.js")).default;
const recommendationsGoogleRoute = (
  await import("./api/recommendationsGoogle.js")
).default;
const recommendationsOpenAIRoute = (
  await import("./api/recommendationsOpenAI.js")
).default;

app.use("/api/scraped-offers", scrapedOffersRoute);
app.use("/api/recommendations/google", recommendationsGoogleRoute);
app.use("/api/recommendations/openai", recommendationsOpenAIRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
