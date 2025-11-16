const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db;

async function initDB(){
  const dbPath = path.join(__dirname, '../db/data.sqlite');
  const dir = path.dirname(dbPath);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  db = await open({ filename: dbPath, driver: sqlite3.Database });
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.exec(schema);
  return db;
}

function getDB(){
  if(!db) throw new Error('DB not initialized');
  return db;
}

module.exports = { initDB, getDB };
