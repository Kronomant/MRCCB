import { getDb } from '../db'

export function createDeliveryTables(): void {
  const db = getDb()
  
  // Tabela de status de entrega de prontuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS prontuario_delivery_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prontuarioId INTEGER NOT NULL,
      reunionId INTEGER NOT NULL,
      status TEXT NOT NULL,
      deliveredAt TEXT,
      deliveredBy TEXT,
      returnedAt TEXT,
      returnedBy TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(prontuarioId, reunionId)
    )
  `)

  // Tabela de log de transições de status
  db.exec(`
    CREATE TABLE IF NOT EXISTS status_transition_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entityType TEXT NOT NULL,
      entityId INTEGER NOT NULL,
      previousStatus TEXT NOT NULL,
      newStatus TEXT NOT NULL,
      changedBy TEXT NOT NULL,
      changedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `)

  // Índices para performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_delivery_reunionId ON prontuario_delivery_status (reunionId);
    CREATE INDEX IF NOT EXISTS idx_delivery_prontuarioId ON prontuario_delivery_status (prontuarioId);
    CREATE INDEX IF NOT EXISTS idx_log_entity ON status_transition_log (entityType, entityId);
  `)
}
