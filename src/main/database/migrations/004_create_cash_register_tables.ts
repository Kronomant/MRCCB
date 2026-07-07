import { getDb } from '../db'

export function createCashRegisterTables(): void {
  const db = getDb()
  
  // Tabela principal de controle de caixa
  db.exec(`
    CREATE TABLE IF NOT EXISTS cash_register (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reunionId INTEGER NOT NULL UNIQUE,
      openingValue REAL NOT NULL,
      availableValue REAL NOT NULL,
      closingValue REAL,
      closingDifference REAL,
      status TEXT NOT NULL DEFAULT 'open',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reunionId) REFERENCES reunions(id) ON DELETE CASCADE
    )
  `)

  // Tabela de passagens (tickets)
  // volunteerName agora é opcional (TEXT pode ser null)
  db.exec(`
    CREATE TABLE IF NOT EXISTS cash_register_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cashRegisterId INTEGER NOT NULL,
      reunionId INTEGER NOT NULL,
      volunteerName TEXT,
      value REAL NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cashRegisterId) REFERENCES cash_register(id) ON DELETE CASCADE,
      FOREIGN KEY (reunionId) REFERENCES reunions(id) ON DELETE CASCADE
    )
  `)

  // Tabela de notas de gasto (expenses)
  db.exec(`
    CREATE TABLE IF NOT EXISTS cash_register_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cashRegisterId INTEGER NOT NULL,
      reunionId INTEGER NOT NULL,
      establishmentName TEXT NOT NULL,
      nfeNumber TEXT,
      category TEXT NOT NULL,
      value REAL NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cashRegisterId) REFERENCES cash_register(id) ON DELETE CASCADE,
      FOREIGN KEY (reunionId) REFERENCES reunions(id) ON DELETE CASCADE
    )
  `)

  // Índices para performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_cash_register_reunion ON cash_register(reunionId);
    CREATE INDEX IF NOT EXISTS idx_tickets_cash_register ON cash_register_tickets(cashRegisterId);
    CREATE INDEX IF NOT EXISTS idx_tickets_reunion ON cash_register_tickets(reunionId);
    CREATE INDEX IF NOT EXISTS idx_expenses_cash_register ON cash_register_expenses(cashRegisterId);
    CREATE INDEX IF NOT EXISTS idx_expenses_reunion ON cash_register_expenses(reunionId);
    CREATE INDEX IF NOT EXISTS idx_expenses_category ON cash_register_expenses(category);
  `)
}
