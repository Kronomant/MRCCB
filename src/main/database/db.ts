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

  // Tabela de prontuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS prontuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER NOT NULL UNIQUE,
      unityId INTEGER NOT NULL,
      ministry INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabela de atendimentos (relaciona prontuários com reuniões)
  db.exec(`
    CREATE TABLE IF NOT EXISTS atendimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prontuarioId INTEGER NOT NULL,
      reunionId INTEGER NOT NULL,
      date TEXT NOT NULL,
      aprovedValue INTEGER NOT NULL DEFAULT 0,
      value REAL NOT NULL DEFAULT 0,
      foodBasketQuantity INTEGER NOT NULL DEFAULT 0,
      onlyClothes INTEGER NOT NULL DEFAULT 0,
      emergency INTEGER NOT NULL DEFAULT 0,
      returned INTEGER NOT NULL DEFAULT 0,
      repeat INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prontuarioId) REFERENCES prontuarios (id),
      FOREIGN KEY (reunionId) REFERENCES reunions (id)
    )
  `)

  // Manter tabela treatments para compatibilidade temporária
  db.exec(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enchiridionId INTEGER,
      reunionId INTEGER,
      unityId INTEGER,
      date TEXT,
      aprovedValue INTEGER,
      value REAL,
      foodBasketQuantity INTEGER,
      onlyClothes INTEGER,
      emergency INTEGER,
      returned INTEGER,
      repeat INTEGER
    )
  `)
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}
