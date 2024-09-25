// routes/generateQRCode.js
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const fs = require('fs');
const uuid = require('uuid');

router.post('/generate-qrcode', async (req, res) => {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
        return res.status(400).send('Text is required for QR Code and must be a string.');
    }

    // Sanitize input text
    const sanitizedText = text.replace(/[^a-zA-Z0-9\s]/g, '');

    try {
        const filename = `${uuid.v4()}.pdf`;
        await QRCode.toFile(filename, sanitizedText);
        res.download(filename, (err) => {
            // Delete the file after sending it
            fs.unlink(filename, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    } catch (error) {
        res.status(500).send('Error generating QR Code.');
    }
});

module.exports = router;