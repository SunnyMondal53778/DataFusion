// screenshot.js
const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    const { url } = req.query;

    // Validate and sanitize input URL
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return res.status(400).send('Invalid URL');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForLoadState('networkidle2'); // Wait for page to load

        const screenshot = await page.screenshot({
            encoding: 'binary',
            type: 'png'
        });

        const outputPath = path.join(__dirname, '../screenshots/screenshot.png');
        fs.writeFileSync(outputPath, screenshot);

        res.download(outputPath); // Send the screenshot back to the client

        await browser.close();
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).send(`Error taking screenshot: ${error.message}`);
    }
});

module.exports = router;