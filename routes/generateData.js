const express = require('express');
const { Parser } = require('json2csv');
const { faker } = require('@faker-js/faker');
const router = express.Router();

router.post('/', (req, res) => {
    const { schema, count } = req.body;

    // Validate input
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
        return res.status(400).send('Invalid schema: must be a non-empty object.');
    }

    if (!count || typeof count !== 'number' || count <= 0) {
        return res.status(400).send('Count is required and must be a positive integer.');
    }

    try {
        const data = [];
        for (let i = 0; i < count; i++) {
            const row = {};
            for (const key in schema) {
                const method = schema[key];

                // Validate faker method
                if (typeof method !== 'string' || !faker[method] || typeof faker[method] !== 'function') {
                    throw new Error(`Unknown or invalid faker method for key '${key}': ${method}`);
                }

                // Generates random data based on the schema
                row[key] = faker[method]();
            }
            data.push(row);
        }

        // Convert to CSV
        const csv = new Parser().parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment('randomData.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error generating data:', error);
        res.status(500).send(`Error generating data: ${error.message}`);
    }
});

module.exports = router;
