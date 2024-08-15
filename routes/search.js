const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const Car = require('../models/Car');
const { logSearch } = require('../utils/logger');

// Create a new PostgreSQL pool instance
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cars',
    password: 'Caliente1084@',
    port: 5432,
});

router.get('/', async (req, res) => {
    const { query, db, userId } = req.query;

    // Validate input parameters
    if (!query || !userId) {
        return res.status(400).send('Query and user ID are required');
    }

    // Log the search query
    logSearch(userId, query);

    try {
        let results = [];

        // Query PostgreSQL
        if (db === 'postgres' || db === 'both') {
            const client = await pool.connect();
            try {
                const result = await client.query(
                    'SELECT * FROM cars WHERE make ILIKE $1 OR model ILIKE $1 OR color ILIKE $1',
                    [`%${query}%`]
                );
                results.push(...result.rows);
            } catch (err) {
                console.error('PostgreSQL query error:', err);
                return res.status(500).send('Internal Server Error');
            } finally {
                client.release(); // Ensure the client is released
            }
        }

        // Query MongoDB
        if (db === 'mongodb' || db === 'both') {
            try {
                const cars = await Car.find({
                    $or: [
                        { make: new RegExp(query, 'i') },
                        { model: new RegExp(query, 'i') },
                        { color: new RegExp(query, 'i') }
                    ]
                });
                results.push(...cars);
            } catch (err) {
                console.error('MongoDB query error:', err);
                return res.status(500).send('Internal Server Error');
            }
        }

        // Render results view
        res.render('results', { results });
    } catch (err) {
        console.error('Error during search:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
