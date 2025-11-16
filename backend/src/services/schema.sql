PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY,
  nsuid TEXT UNIQUE,
  title TEXT,
  slug TEXT,
  publisher TEXT,
  release_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS countries (
  code TEXT PRIMARY KEY, -- e.g. US, JP, TH
  currency TEXT
);

CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY,
  game_id INTEGER,
  country_code TEXT,
  price_minor INTEGER,
  discount_percent REAL,
  regular_price_minor INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(game_id) REFERENCES games(id),
  FOREIGN KEY(country_code) REFERENCES countries(code)
);

CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY,
  game_id INTEGER,
  country_code TEXT,
  price_minor INTEGER,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(game_id) REFERENCES games(id),
  FOREIGN KEY(country_code) REFERENCES countries(code)
);

CREATE INDEX IF NOT EXISTS idx_price_game ON prices(game_id);
CREATE INDEX IF NOT EXISTS idx_hist_game ON price_history(game_id);
