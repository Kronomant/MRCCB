import { getDb } from './db'

export type CashExpense = {
  id?: number
  cashRegisterId: number
  reunionId: number
  establishmentName: string
  nfeNumber: string | null
  category: 'fuel' | 'food' | 'small_goods' | 'maintenance'
  value: number
  notes: string | null
  createdAt?: string
}

export function createExpense(data: Omit<CashExpense, 'id' | 'createdAt'>): CashExpense {
  const db = getDb()

  const stmt = db.prepare(`
    INSERT INTO cash_register_expenses (cashRegisterId, reunionId, establishmentName, nfeNumber, category, value, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    data.cashRegisterId,
    data.reunionId,
    data.establishmentName,
    data.nfeNumber,
    data.category,
    data.value,
    data.notes
  )

  return {
    id: result.lastInsertRowid as number,
    ...data,
    createdAt: new Date().toISOString()
  }
}

export function getExpensesByReunion(reunionId: number): CashExpense[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM cash_register_expenses WHERE reunionId = ? ORDER BY createdAt ASC')
  return stmt.all(reunionId) as CashExpense[]
}

export function updateExpense(id: number, data: Partial<CashExpense>): void {
  const db = getDb()
  const updates: string[] = []
  const values: any[] = []

  if (data.establishmentName !== undefined) {
    updates.push('establishmentName = ?')
    values.push(data.establishmentName)
  }
  if (data.nfeNumber !== undefined) {
    updates.push('nfeNumber = ?')
    values.push(data.nfeNumber)
  }
  if (data.category !== undefined) {
    updates.push('category = ?')
    values.push(data.category)
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
  const stmt = db.prepare(`UPDATE cash_register_expenses SET ${updates.join(', ')} WHERE id = ?`)
  stmt.run(...values)
}

export function deleteExpense(id: number): void {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM cash_register_expenses WHERE id = ?')
  stmt.run(id)
}

export function getTotalExpensesByReunion(reunionId: number): number {
  const db = getDb()
  const stmt = db.prepare('SELECT SUM(value) as total FROM cash_register_expenses WHERE reunionId = ?')
  const result = stmt.get(reunionId) as { total: number }
  return result.total || 0
}

export function getTotalExpensesByCategory(reunionId: number): Record<string, number> {
  const db = getDb()
  const stmt = db.prepare('SELECT category, SUM(value) as total FROM cash_register_expenses WHERE reunionId = ? GROUP BY category')
  const results = stmt.all(reunionId) as { category: string; total: number }[]
  
  const totals: Record<string, number> = {}
  results.forEach(r => {
    totals[r.category] = r.total
  })
  return totals
}
