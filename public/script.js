import express from 'express';
const app = express();
import { launch } from 'puppeteer'; // for screenshot
import { Parser as json2csv } from 'json2csv'; // for CSV conversion
import { toBuffer } from 'qrcode'; // for QR code generation

// Screenshot route
app.get('/api/screenshot', async (req, res) => {
    const url = req.query.url;
    // Use Puppeteer to capture screenshot
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot();
    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(screenshot);
});

// Random data generation route
app.post('/api/generate-data', (req, res) => {
    const schema = req.body.schema;
    const count = req.body.count;
    // Generate random data based on schema and count
    const data = [];
    for (let i = 0; i < count; i++) {
        const rowData = {};
        Object.keys(schema).forEach((key) => {
            rowData[key] = generateRandomValue(schema[key]);
        });
        data.push(rowData);
    }
    // Convert data to CSV
    const json2csvParser = new json2csv();
    const csv = json2csvParser.parse(data);
    res.set("Content-Disposition", "attachment; filename=randomData.csv");
    res.set("Content-Type", "text/csv");
    res.send(csv);
});

// QR code generation route
app.get('/api/qrcode', async (req, res) => {
    const text = req.query.text;
    // Generate QR code
    const qrCode = await toBuffer(text);
    res.set("Content-Type", "image/png");
    res.send(qrCode);
});

app.listen(3000, () => {
    console.log('DataFusion API listening on port 3000');
});