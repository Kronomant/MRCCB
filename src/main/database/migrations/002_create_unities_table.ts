import { getDb } from '../db'

export function createUnitiesTable(): void {
  const db = getDb()
  db.exec(`
    CREATE TABLE IF NOT EXISTS unities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}