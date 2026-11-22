import Database from 'better-sqlite3'
import { config } from './config'

const db = new Database(config.dbFile)

// Таблица пользователей
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`)

// Таблица задач (полная схема — новые БД создаются сразу с нужными колонками)
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
`)

// Миграции для существующих (старых) таблиц: добавляем недостающие колонки.
// SQLite не поддерживает "ADD COLUMN IF NOT EXISTS", поэтому пробуем и
// игнорируем ошибку "duplicate column name".
const optionalColumns = [
  'ALTER TABLE tasks ADD COLUMN deadline TEXT',
  "ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'",
  'ALTER TABLE tasks ADD COLUMN category TEXT',
  'ALTER TABLE tasks ADD COLUMN user_id INTEGER',
]

for (const sql of optionalColumns) {
  try {
    db.exec(sql)
  } catch {
    // Колонка уже существует
  }
}

export default db
