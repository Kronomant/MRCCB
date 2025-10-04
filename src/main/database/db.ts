// src/main/database/db.ts
import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

let db: Database.Database | null = null

export function initDb(): void {
  const dbPath = path.join(process.cwd(), 'database.sqlite')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS reunions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value REAL,
      treatmentQuantity INTEGER,
      foodBasketQuantity INTEGER,
      date TEXT,
      status TEXT
    )
  `)
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}
