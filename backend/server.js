const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/api/scraped-offers', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a user agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the page
    await page.goto('https://booking-dp.lastminute.de', { waitUntil: 'networkidle0' });

    // Wait for the CAPTCHA to be solved (this might require manual intervention or a CAPTCHA solving service)
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    // Check if we're past the CAPTCHA
    const content = await page.content();
    if (content.includes('Nur einen Moment…')) {
      throw new Error('CAPTCHA not solved');
    }

    // Extract the content
    const offers = await page.evaluate(() => {
      // Here, you would write JavaScript to extract the offers from the page
      // This is just a placeholder example
      return Array.from(document.querySelectorAll('.offer')).map(offer => ({
        title: offer.querySelector('.title').textContent,
        price: offer.querySelector('.price').textContent,
      }));
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));