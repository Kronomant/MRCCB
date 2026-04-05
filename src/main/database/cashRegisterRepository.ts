import { getDb } from './db'

export type CashRegister = {
  id?: number
  reunionId: number
  openingValue: number
  availableValue: number
  closingValue: number | null
  closingDifference: number | null
  status: 'open' | 'closed'
  createdAt?: string
  updatedAt?: string
}

export function createCashRegister(data: Omit<CashRegister, 'id' | 'createdAt' | 'updatedAt' | 'closingValue' | 'closingDifference' | 'status'>): CashRegister {
  const db = getDb()

  const stmt = db.prepare(`
    INSERT INTO cash_register (reunionId, openingValue, availableValue, status)
    VALUES (?, ?, ?, 'open')
  `)

  const result = stmt.run(data.reunionId, data.openingValue, data.availableValue)

  return {
    id: result.lastInsertRowid as number,
    ...data,
    status: 'open',
    closingValue: null,
    closingDifference: null
  }
}

export function getCashRegisterByReunion(reunionId: number): CashRegister | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM cash_register WHERE reunionId = ?')
  return stmt.get(reunionId) as CashRegister | undefined
}

export function updateCashRegisterOpening(id: number, data: { openingValue: number; availableValue: number }): void {
  const db = getDb()
  const stmt = db.prepare(`
    UPDATE cash_register
    SET openingValue = ?, availableValue = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(data.openingValue, data.availableValue, id)
}

export function closeCashRegister(id: number, closingValue: number, difference: number): void {
  const db = getDb()
  const stmt = db.prepare(`
    UPDATE cash_register
    SET closingValue = ?, closingDifference = ?, status = 'closed', updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(closingValue, difference, id)
}

export function getCashRegisterById(id: number): CashRegister | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM cash_register WHERE id = ?')
  return stmt.get(id) as CashRegister | undefined
}
