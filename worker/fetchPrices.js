const { fetchPriceByNsuid } = require('../backend/src/services/nintendo');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const COUNTRIES = (process.env.COUNTRIES || 'US,JP,GB,DE,FR,TH').split(',');

async function main(){
  const dbPath = path.join(__dirname, '../backend/src/db/data.sqlite');
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  const games = await db.all('SELECT * FROM games');
  for(const g of games){
    for(const c of COUNTRIES){
      try{
        const info = await fetchPriceByNsuid(g.nsuid, c);
        if(!info || info.final_price_amount === null) {
          console.warn('no price for', g.nsuid, c);
          continue;
        }
        const final_minor = Math.round(Number(info.final_price_amount) * 100);
        const regular_minor = info.regular_price_amount ? Math.round(Number(info.regular_price_amount) * 100) : final_minor;
        const discount = info.discount_percent || 0;

        // upsert prices row
        const existing = await db.get('SELECT id FROM prices WHERE game_id = ? AND country_code = ?', g.id, c);
        if(existing){
          await db.run('UPDATE prices SET price_minor=?, discount_percent=?, regular_price_minor=?, updated_at=datetime('now') WHERE id=?',
            final_minor, discount, regular_minor, existing.id);
        } else {
          await db.run('INSERT INTO prices (game_id, country_code, price_minor, discount_percent, regular_price_minor) VALUES (?,?,?,?,?)',
            g.id, c, final_minor, discount, regular_minor);
        }
        // insert history
        await db.run('INSERT INTO price_history (game_id, country_code, price_minor) VALUES (?,?,?)',
          g.id, c, final_minor);

        console.log(`Updated ${g.title} (${g.nsuid}) ${c} -> ${final_minor}`);
      }catch(e){
        console.error('Error fetching', g.nsuid, c, e.message);
      }
    }
  }
  console.log('Worker done');
}

if(require.main === module) main();
