import express from "express";
import puppeteer from "puppeteer";

const app = express();

const url = "https://booking-dp.lastminute.de/";
const content = ".HubOfferFolderstyles__Content-sc-13d6y6n-0";
const title = ".HubOfferFolderstyles__Title-sc-13d6y6n-1";
const label = ".HubOfferFolderstyles__CtaLabel-sc-13d6y6n-3";
const port = 3000;

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

    // Scrape die Titel und Preise
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(content)).map((offer) => ({
        title: offer.querySelector(title).textContent,
        price: offer.querySelector(label).textContent,
      }));
    });

    res.json(results);
  } catch (error) {
    console.error("❌ Scraping-Fehler:", error);
    res.status(500).json({ error: `Fehler beim Abrufen: ${error.message}` });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
