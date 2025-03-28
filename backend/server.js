import express from "express";
import puppeteer from "puppeteer";

const app = express();

const url = "https://booking-dp.lastminute.de/";
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

    // Wait for the CAPTCHA to be solved (this might require manual intervention or a CAPTCHA solving service)
    await page.waitForNavigation({
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Check if we're past the CAPTCHA
    const content = await page.content();
    if (content.includes("Nur einen Moment…")) {
      throw new Error("CAPTCHA erkannt – Zugriff blockiert!");
    }

    // Scrape die Titel und Preise
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".offer")).map((offer) => ({
        title: offer.querySelector(".title").textContent,
        price: offer.querySelector(".price").textContent,
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
