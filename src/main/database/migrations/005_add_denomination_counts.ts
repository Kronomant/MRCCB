import { getDb } from '../db'

export function addDenominationCounts(): void {
  const db = getDb()
  const columns = db.prepare("PRAGMA table_info('cash_register')").all() as Array<{ name: string }>
  if (!columns.some((c) => c.name === 'openingCounts'))
    db.exec('ALTER TABLE cash_register ADD COLUMN openingCounts TEXT')
  if (!columns.some((c) => c.name === 'closingCounts'))
    db.exec('ALTER TABLE cash_register ADD COLUMN closingCounts TEXT')
}
