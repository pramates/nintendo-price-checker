const express = require('express');
const bodyParser = require('body-parser');
const { initDB, getDB } = require('./services/db');
const gamesRouter = require('./routes/games');
const pricesRouter = require('./routes/prices');
const cors = require('cors');

async function main(){
  await initDB();
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api/games', gamesRouter);
  app.use('/api/prices', pricesRouter);

  app.get('/', (req, res) => res.send('Nintendo Price Checker API'));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, ()=> console.log(`API listening on ${PORT}`));
}

main().catch(e=>{ console.error(e); process.exit(1); });
