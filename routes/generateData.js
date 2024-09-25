const express = require('express');
const { Parser } = require('json2csv');
const { faker } = require('@faker-js/faker');
const router = express.Router();

router.post('/', (req, res) => {
    const { schema, count } = req.body;

    // Validate input
    if (!schema || !count || typeof count !== 'number' || count <= 0) {
        return res.status(400).send('Schema and count are required, count must be a positive integer');
    }

    try {
        const data = [];
        for (let i = 0; i < count; i++) {
            const row = {};
            for (const key in schema) {
                if (!faker[schema[key]]) {
                    throw new Error(`Unknown faker method: ${schema[key]}`);
                }
                row[key] = faker[schema[key]](); // Generates random data based on the schema
            }
            data.push(row);
        }

        // Convert to CSV
        const csv = new Parser().parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment('randomData.csv');
        res.send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating data');
    }
});

module.exports = router;