// routes/generateQRCode.js
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

// Ensure that the 'qrcodes' directory exists
const qrCodeDir = path.join(__dirname, '../qrcodes');
if (!fs.existsSync(qrCodeDir)) {
    fs.mkdirSync(qrCodeDir, { recursive: true });
}

router.post('/generate-qrcode', async (req, res) => {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
        return res.status(400).send('Text is required for QR Code and must be a string.');
    }

    try {
        // Generate a unique filename for the QR code image
        const filename = `${uuid.v4()}.png`;
        const filePath = path.join(qrCodeDir, filename);

        // Generate QR code and save as PNG
        await QRCode.toFile(filePath, text);

        // Send the QR code image to the client
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Error downloading the QR code:', err);
                return res.status(500).send('Error downloading the QR code.');
            }

            // Clean up: Delete the QR code file after it has been sent
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting QR code file:', err);
                }
            });
        });
    } catch (error) {
        console.error('Error generating QR Code:', error);
        res.status(500).send('Error generating QR Code.');
    }
});

module.exports = router;
