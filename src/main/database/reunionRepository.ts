// src/main/database/reunionRepository.ts
import { getDb } from './db'

// Usando o tipo Reunion global definido em types/global.d.ts
type ReunionData = {
  id?: number
  name: string
  value: number
  treatmentQuantity: number
  foodBasketQuantity: number
  date: string
  status: string
}

// CREATE
export function createReunion(data: Omit<ReunionData, 'id'>): ReunionData {
  const db = getDb()

  const stmt = db.prepare(`
    INSERT INTO reunions (name, value, treatmentQuantity, foodBasketQuantity, date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    data.name,
    data.value,
    data.treatmentQuantity,
    data.foodBasketQuantity,
    data.date,
    data.status
  )

  return { id: result.lastInsertRowid as number, ...data }
}

// READ ALL
export function getAllReunions(): ReunionData[] {
  const db = getDb()

  const stmt = db.prepare('SELECT * FROM reunions')
  return stmt.all() as ReunionData[]
}

export function getReunionById(id: number): ReunionData | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM reunions WHERE id = ?')
  return stmt.get(id) as ReunionData | undefined
}

// UPDATE
export function updateReunion(data: ReunionData): ReunionData {
  const db = getDb()

  if (data.id === undefined) {
    throw new Error('ID is required to update a reunion')
  }

  const stmt = db.prepare(`
    UPDATE reunions
    SET name = ?, value = ?, treatmentQuantity = ?, foodBasketQuantity = ?, date = ?, status = ?
    WHERE id = ?
  `)

  stmt.run(
    data.name,
    data.value,
    data.treatmentQuantity,
    data.foodBasketQuantity,
    data.date,
    data.status,
    data.id
  )

  return data
}

// DELETE
export function deleteReunion(id: number): void {
  const db = getDb()

  const stmt = db.prepare('DELETE FROM reunions WHERE id = ?')
  stmt.run(id)
}
