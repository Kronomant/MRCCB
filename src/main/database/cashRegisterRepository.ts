import { getDb } from './db'

export type DenominationCounts = Record<number, number>

export type CashRegister = {
  id?: number
  reunionId: number
  openingValue: number
  availableValue: number
  openingCounts: DenominationCounts | null
  closingValue: number | null
  closingDifference: number | null
  closingCounts: DenominationCounts | null
  status: 'open' | 'closed'
  createdAt?: string
  updatedAt?: string
}

const serializeCounts = (counts: DenominationCounts | null | undefined): string | null =>
  counts && Object.keys(counts).length > 0 ? JSON.stringify(counts) : null

const parseCounts = (raw: string | null | undefined): DenominationCounts | null =>
  raw ? (JSON.parse(raw) as DenominationCounts) : null

const parseRow = (row: Record<string, unknown>): CashRegister => ({
  ...(row as Omit<CashRegister, 'openingCounts' | 'closingCounts'>),
  openingCounts: parseCounts(row.openingCounts as string | null),
  closingCounts: parseCounts(row.closingCounts as string | null)
})

export function createCashRegister(data: {
  reunionId: number
  openingValue: number
  availableValue: number
  openingCounts?: DenominationCounts | null
}): CashRegister {
  const db = getDb()

  const existing = getCashRegisterByReunion(data.reunionId)
  if (existing) return existing

  const stmt = db.prepare(`
    INSERT INTO cash_register (reunionId, openingValue, availableValue, openingCounts, status)
    VALUES (?, ?, ?, ?, 'open')
  `)

  const result = stmt.run(
    data.reunionId,
    data.openingValue,
    data.availableValue,
    serializeCounts(data.openingCounts)
  )

  return {
    id: result.lastInsertRowid as number,
    reunionId: data.reunionId,
    openingValue: data.openingValue,
    availableValue: data.availableValue,
    openingCounts: data.openingCounts ?? null,
    status: 'open',
    closingValue: null,
    closingDifference: null,
    closingCounts: null
  }
}

export function getCashRegisterByReunion(reunionId: number): CashRegister | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM cash_register WHERE reunionId = ?')
  const row = stmt.get(reunionId)
  if (!row) return undefined
  return parseRow(row as Record<string, unknown>)
}

export function updateCashRegisterOpening(
  id: number,
  data: { openingValue: number; availableValue: number; openingCounts?: DenominationCounts | null }
): void {
  const db = getDb()
  const stmt = db.prepare(`
    UPDATE cash_register
    SET openingValue = ?, availableValue = ?, openingCounts = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(data.openingValue, data.availableValue, serializeCounts(data.openingCounts), id)
}

export function closeCashRegister(
  id: number,
  closingValue: number,
  difference: number,
  closingCounts?: DenominationCounts | null
): void {
  const db = getDb()
  const stmt = db.prepare(`
    UPDATE cash_register
    SET closingValue = ?, closingDifference = ?, closingCounts = ?, status = 'closed', updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(closingValue, difference, serializeCounts(closingCounts), id)
}

export function reopenCashRegister(id: number): void {
  const db = getDb()
  const stmt = db.prepare(`
    UPDATE cash_register
    SET status = 'open', closingValue = NULL, closingDifference = NULL, closingCounts = NULL, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(id)
}

export function getCashRegisterById(id: number): CashRegister | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM cash_register WHERE id = ?')
  const row = stmt.get(id)
  if (!row) return undefined
  return parseRow(row as Record<string, unknown>)
}
