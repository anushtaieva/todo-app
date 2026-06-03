const Database = require("better-sqlite3");

const db = new Database("todos.db");

db.prepare(`  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    category TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )`).run();

module.exports = db;
