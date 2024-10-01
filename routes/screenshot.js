// screenshot.js
const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ensure that the screenshots directory exists
const screenshotDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

router.get('/', async (req, res) => {
    const { url } = req.query;

    // Validate and sanitize input URL
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return res.status(400).send('Invalid URL');
    }

    try {
        // Launch the browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for the page to load completely

        // Capture the screenshot
        const screenshot = await page.screenshot({
            encoding: 'binary',
            type: 'png'
        });

        const outputPath = path.join(screenshotDir, 'screenshot.png');
        fs.writeFileSync(outputPath, screenshot); // Save the screenshot locally

        // Send the screenshot to the client
        res.download(outputPath, 'screenshot.png', (err) => {
            if (err) {
                console.error('Error downloading screenshot:', err);
            }

            // Clean up: Delete the screenshot after sending it
            fs.unlinkSync(outputPath);
        });

        await browser.close(); // Close the browser
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).send(`Error taking screenshot: ${error.message}`);
    }
});

module.exports = router;
