import { getDb } from './db'

export type CashTicket = {
  id?: number
  cashRegisterId: number
  reunionId: number
  volunteerName: string | null
  value: number
  notes: string | null
  createdAt?: string
}

export function createTicket(data: Omit<CashTicket, 'id' | 'createdAt'>): CashTicket {
  const db = getDb()

  const stmt = db.prepare(`
    INSERT INTO cash_register_tickets (cashRegisterId, reunionId, volunteerName, value, notes)
    VALUES (?, ?, ?, ?, ?)
  `)

  const result = stmt.run(data.cashRegisterId, data.reunionId, data.volunteerName, data.value, data.notes)

  return {
    id: result.lastInsertRowid as number,
    ...data,
    createdAt: new Date().toISOString() // Aproximação, o banco gera
  }
}

export function getTicketsByReunion(reunionId: number): CashTicket[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM cash_register_tickets WHERE reunionId = ? ORDER BY createdAt ASC')
  return stmt.all(reunionId) as CashTicket[]
}

export function updateTicket(id: number, data: Partial<CashTicket>): void {
  const db = getDb()
  const updates: string[] = []
  const values: any[] = []

  if (data.volunteerName !== undefined) {
    updates.push('volunteerName = ?')
    values.push(data.volunteerName)
  }
  if (data.value !== undefined) {
    updates.push('value = ?')
    values.push(data.value)
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?')
    values.push(data.notes)
  }

  if (updates.length === 0) return

  values.push(id)
  const stmt = db.prepare(`UPDATE cash_register_tickets SET ${updates.join(', ')} WHERE id = ?`)
  stmt.run(...values)
}

export function deleteTicket(id: number): void {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM cash_register_tickets WHERE id = ?')
  stmt.run(id)
}

export function getTotalTicketsByReunion(reunionId: number): number {
  const db = getDb()
  const stmt = db.prepare('SELECT SUM(value) as total FROM cash_register_tickets WHERE reunionId = ?')
  const result = stmt.get(reunionId) as { total: number }
  return result.total || 0
}
