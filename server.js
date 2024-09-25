const express = require('express');
const { Parser } = require('json2csv');
const { faker } = require('@faker-js/faker');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const router = express.Router();
router.use(limiter);

const validateInput = (schema, count) => {
    if (!schema || !count || typeof count !== 'number' || count <= 0) {
        throw new Error('Schema and count are required, count must be a positive integer');
    }
};

const generateRandomData = async (schema, count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const row = {};
        for (const key in schema) {
            if (!faker[schema[key]]) {
                throw new Error(`Unknown faker method: ${schema[key]}`);
            }
            row[key] = await faker[schema[key]]();
        }
        data.push(row);
    }
    return data;
};

router.post('/', async (req, res) => {
    try {
        const { schema, count } = req.body;
        validateInput(schema, count);
        const data = await generateRandomData(schema, count);

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