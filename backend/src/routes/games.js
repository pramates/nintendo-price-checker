const express = require('express');
const router = express.Router();
const { getDB } = require('../services/db');
const slugify = require('slugify');

// list games
router.get('/', async (req, res) => {
  const db = getDB();
  const rows = await db.all('SELECT * FROM games ORDER BY title');
  res.json(rows);
});

// add / upsert a game by nsuid
router.post('/', async (req, res) => {
  const { nsuid, title, publisher, release_date } = req.body;
  if(!nsuid || !title) return res.status(400).json({ error: 'nsuid and title required' });
  const db = getDB();
  const slug = slugify(title, { lower: true });
  await db.run('INSERT OR IGNORE INTO games (nsuid, title, slug, publisher, release_date) VALUES (?,?,?,?,?)',
    nsuid, title, slug, publisher || null, release_date || null);
  const game = await db.get('SELECT * FROM games WHERE nsuid = ?', nsuid);
  res.json(game);
});

router.get('/:id', async (req, res) => {
  const db = getDB();
  const game = await db.get('SELECT * FROM games WHERE id = ?', req.params.id);
  if(!game) return res.status(404).json({ error: 'not found' });
  const prices = await db.all('SELECT * FROM prices WHERE game_id = ?', req.params.id);
  res.json({ game, prices });
});

module.exports = router;
