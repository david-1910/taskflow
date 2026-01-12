import Database from "better-sqlite3";

const db = new Database("tasks.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    deadline TEXT
  )
`);

try {
  db.exec(`ALTER TABLE tasks ADD COLUMN deadline TEXT`);
} catch (e) {
  // Колонка уже существует
}

export default db;
