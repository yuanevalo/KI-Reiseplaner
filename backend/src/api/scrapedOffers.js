import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

const url = "https://booking-dp.lastminute.de/";

router.get("/", async (req, res) => {
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
      timeout: 5000,
    });

    // Check if we're past the CAPTCHA
    const content = await page.content();
    if (content.includes("Nur einen Moment…")) {
      throw new Error("CAPTCHA erkannt - Zugriff blockiert!");
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
    res.status(error.status || 500).json({
      message: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

export default router;
