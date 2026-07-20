use rusqlite::{Connection, Result};
use std::sync::Mutex;

pub mod reunion;
pub mod prontuario;
pub mod atendimento;
pub mod unity;
pub mod treatment;
pub mod delivery;
pub mod cash_register;
pub mod cash_ticket;
pub mod cash_expense;

/// Shared database state wrapped in a Mutex for thread-safety.
pub struct DbState(pub Mutex<Connection>);

/// Opens (or creates) the SQLite database at the configured path and runs all migrations.
pub fn init_db(app: &tauri::AppHandle) -> Result<Connection> {
    use crate::config::load_config;

    let config = load_config(app);
    let conn = Connection::open(&config.db_path)?;

    conn.pragma_update(None, "journal_mode", "DELETE")?;
    conn.pragma_update(None, "busy_timeout", 5000)?;
    conn.pragma_update(None, "synchronous", "FULL")?;
    conn.pragma_update(None, "foreign_keys", "ON")?;

    run_migrations(&conn)?;

    Ok(conn)
}

/// Runs all schema migrations in order (idempotent — each uses CREATE TABLE IF NOT EXISTS / ALTER TABLE checks).
fn run_migrations(conn: &Connection) -> Result<()> {
    // ── Table: reunions ────────────────────────────────────────────────────────
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS reunions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            value REAL,
            basketValue REAL DEFAULT 200,
            treatmentQuantity INTEGER,
            foodBasketQuantity INTEGER,
            date TEXT,
            status TEXT
        );
    ")?;

    // ── Table: prontuarios ─────────────────────────────────────────────────────
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS prontuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number INTEGER NOT NULL UNIQUE,
            unityId INTEGER NOT NULL,
            ministry INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'active',
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    ")?;

    // ── Table: atendimentos ────────────────────────────────────────────────────
    conn.execute_batch("
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
            ministerio INTEGER NOT NULL DEFAULT 0,
            roupas INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (prontuarioId) REFERENCES prontuarios (id),
            FOREIGN KEY (reunionId) REFERENCES reunions (id)
        );
    ")?;

    // ── Migration: prontuarioNumber column ────────────────────────────────────
    let has_prontuario_number: bool = conn
        .prepare("PRAGMA table_info('atendimentos')")?
        .query_map([], |row| row.get::<_, String>(1))?
        .filter_map(|r| r.ok())
        .any(|col| col == "prontuarioNumber");

    if !has_prontuario_number {
        conn.execute_batch("
            ALTER TABLE atendimentos ADD COLUMN prontuarioNumber INTEGER;
            UPDATE atendimentos SET prontuarioNumber = (
                SELECT number FROM prontuarios WHERE prontuarios.id = atendimentos.prontuarioId
            );
        ")?;
    }

    // ── Migration: ministerio + roupas columns ─────────────────────────────────
    let atendimento_cols: Vec<String> = conn
        .prepare("PRAGMA table_info('atendimentos')")?
        .query_map([], |row| row.get::<_, String>(1))?
        .filter_map(|r| r.ok())
        .collect();

    if !atendimento_cols.iter().any(|c| c == "ministerio") {
        conn.execute_batch("ALTER TABLE atendimentos ADD COLUMN ministerio INTEGER DEFAULT 0;")?;
    }
    if !atendimento_cols.iter().any(|c| c == "roupas") {
        conn.execute_batch("ALTER TABLE atendimentos ADD COLUMN roupas INTEGER DEFAULT 0;")?;
    }

    // ── Migration: basketValue column in reunions ─────────────────────────────
    let has_basket_value: bool = conn
        .prepare("PRAGMA table_info('reunions')")?
        .query_map([], |row| row.get::<_, String>(1))?
        .filter_map(|r| r.ok())
        .any(|col| col == "basketValue");

    if !has_basket_value {
        conn.execute_batch("ALTER TABLE reunions ADD COLUMN basketValue REAL DEFAULT 200;")?;
    }

    // ── Table: unities ─────────────────────────────────────────────────────────
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS unities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    ")?;

    // ── Tables: prontuario_delivery_status + status_transition_log ────────────
    conn.execute_batch("
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
        );

        CREATE TABLE IF NOT EXISTS status_transition_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entityType TEXT NOT NULL,
            entityId INTEGER NOT NULL,
            previousStatus TEXT NOT NULL,
            newStatus TEXT NOT NULL,
            changedBy TEXT NOT NULL,
            changedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        );
    ")?;

    // ── Migration: delivery status 'pendente' default ─────────────────────────
    conn.execute_batch("
        UPDATE prontuario_delivery_status SET status = 'pendente' WHERE status IS NULL OR status = '';
    ")?;

    // ── Tables: cash_register, cash_register_tickets, cash_register_expenses ──
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS cash_register (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reunionId INTEGER NOT NULL UNIQUE,
            openingValue REAL NOT NULL,
            availableValue REAL NOT NULL,
            openingCounts TEXT,
            closingValue REAL,
            closingDifference REAL,
            closingCounts TEXT,
            status TEXT NOT NULL DEFAULT 'open',
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reunionId) REFERENCES reunions(id) ON DELETE CASCADE
        );

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
        );

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
        );
    ")?;

    // ── Migration: openingCounts/closingCounts in cash_register ───────────────
    let cash_cols: Vec<String> = conn
        .prepare("PRAGMA table_info('cash_register')")?
        .query_map([], |row| row.get::<_, String>(1))?
        .filter_map(|r| r.ok())
        .collect();

    if !cash_cols.iter().any(|c| c == "openingCounts") {
        conn.execute_batch("ALTER TABLE cash_register ADD COLUMN openingCounts TEXT;")?;
    }
    if !cash_cols.iter().any(|c| c == "closingCounts") {
        conn.execute_batch("ALTER TABLE cash_register ADD COLUMN closingCounts TEXT;")?;
    }

    // ── Table: treatments (legacy) ─────────────────────────────────────────────
    conn.execute_batch("
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
        );
    ")?;

    // ── Indexes ────────────────────────────────────────────────────────────────
    conn.execute_batch("
        CREATE INDEX IF NOT EXISTS idx_atendimentos_reunionId ON atendimentos (reunionId);
        CREATE INDEX IF NOT EXISTS idx_atendimentos_prontuarioId ON atendimentos (prontuarioId);
        CREATE INDEX IF NOT EXISTS idx_prontuarios_number ON prontuarios (number);
        CREATE INDEX IF NOT EXISTS idx_delivery_reunionId ON prontuario_delivery_status (reunionId);
        CREATE INDEX IF NOT EXISTS idx_delivery_prontuarioId ON prontuario_delivery_status (prontuarioId);
        CREATE INDEX IF NOT EXISTS idx_log_entity ON status_transition_log (entityType, entityId);
        CREATE INDEX IF NOT EXISTS idx_cash_register_reunion ON cash_register(reunionId);
        CREATE INDEX IF NOT EXISTS idx_tickets_cash_register ON cash_register_tickets(cashRegisterId);
        CREATE INDEX IF NOT EXISTS idx_tickets_reunion ON cash_register_tickets(reunionId);
        CREATE INDEX IF NOT EXISTS idx_expenses_cash_register ON cash_register_expenses(cashRegisterId);
        CREATE INDEX IF NOT EXISTS idx_expenses_reunion ON cash_register_expenses(reunionId);
        CREATE INDEX IF NOT EXISTS idx_expenses_category ON cash_register_expenses(category);
    ")?;

    Ok(())
}
