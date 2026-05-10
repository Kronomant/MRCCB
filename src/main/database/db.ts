// src/main/database/db.ts
import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { createUnitiesTable } from './migrations/002_create_unities_table'
import { createDeliveryTables } from './migrations/003_create_delivery_tables'
import { migrateDeliveryStatus } from './migrations/004_migrate_delivery_status'
import { loadConfig } from '../config'

let db: Database.Database | null = null

export function initDb(): void {
  const config = loadConfig()
  const dbPath = config.dbPath
  
  try {
    db = new Database(dbPath)
  } catch (error) {
    console.error(`Failed to open database at ${dbPath}. Fallback to default.`, error)
    const fallbackPath = path.join(process.cwd(), 'database.sqlite')
    db = new Database(fallbackPath)
  }

  db.pragma('journal_mode = DELETE')
  db.pragma('busy_timeout = 5000')
  db.pragma('synchronous = FULL')
  createUnitiesTable()
  createDeliveryTables()

  db.exec(`
    CREATE TABLE IF NOT EXISTS reunions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value REAL,
      basketValue REAL DEFAULT 200,
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
      representacao INTEGER NOT NULL DEFAULT 0,
      devolvido INTEGER NOT NULL DEFAULT 0,
      repeat INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prontuarioId) REFERENCES prontuarios (id),
      FOREIGN KEY (reunionId) REFERENCES reunions (id)
    )
  `)

  // Migrar coluna prontuarioNumber em atendimentos, se não existir
  const columns = db.prepare("PRAGMA table_info('atendimentos')").all() as Array<{ name: string }>
  const hasProntuarioNumber = columns.some((c) => c.name === 'prontuarioNumber')
  if (!hasProntuarioNumber) {
    db.exec('ALTER TABLE atendimentos ADD COLUMN prontuarioNumber INTEGER')
    db.exec(`
      UPDATE atendimentos
      SET prontuarioNumber = (
        SELECT number FROM prontuarios WHERE prontuarios.id = atendimentos.prontuarioId
      )
    `)
  }

  const hasMinisterio = columns.some((c) => c.name === 'ministerio')
  if (!hasMinisterio) {
    db.exec('ALTER TABLE atendimentos ADD COLUMN ministerio INTEGER DEFAULT 0')
  }

  migrateDeliveryStatus()
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

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_atendimentos_reunionId ON atendimentos (reunionId);
    CREATE INDEX IF NOT EXISTS idx_atendimentos_prontuarioId ON atendimentos (prontuarioId);
    CREATE INDEX IF NOT EXISTS idx_prontuarios_number ON prontuarios (number);
  `)
  
  const reunionColumns = db.prepare("PRAGMA table_info('reunions')").all() as Array<{ name: string }>
  const hasBasketValue = reunionColumns.some((c) => c.name === 'basketValue')
  if (!hasBasketValue) {
    db.exec('ALTER TABLE reunions ADD COLUMN basketValue REAL DEFAULT 200')
  }
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}
