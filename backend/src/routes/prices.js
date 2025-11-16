const express = require('express');
const router = express.Router();
const { getDB } = require('../services/db');

// history
router.get('/history/:gameId', async (req, res) => {
  const db = getDB();
  const rows = await db.all('SELECT * FROM price_history WHERE game_id = ? ORDER BY recorded_at ASC', req.params.gameId);
  res.json(rows);
});

// best deals
router.get('/best-deals', async (req, res) => {
  const db = getDB();
  const rows = await db.all(`SELECT g.id as game_id, g.title, p.country_code, p.discount_percent, p.price_minor
    FROM prices p JOIN games g ON p.game_id = g.id
    WHERE p.discount_percent IS NOT NULL
    ORDER BY p.discount_percent DESC LIMIT 50`);
  res.json(rows);
});

module.exports = router;
