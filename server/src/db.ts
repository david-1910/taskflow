import Database from "better-sqlite3";

const db = new Database("tasks.db");

// Таблица пользователей
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Таблица задач
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    deadline TEXT,
    priority TEXT DEFAULT 'medium',
    category TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Миграции для существующих таблиц
const migrations = [
  "ALTER TABLE tasks ADD COLUMN deadline TEXT",
  "ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'",
  "ALTER TABLE tasks ADD COLUMN category TEXT",
  "ALTER TABLE tasks ADD COLUMN user_id INTEGER",
];

for (const sql of migrations) {
  try {
    db.exec(sql);
  } catch {
    // Колонка уже существует
  }
}

export default db;
