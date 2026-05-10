// src/main/database/reunionRepository.ts
import { getDb } from './db'

// Usando o tipo Reunion global definido em types/global.d.ts
export type ReunionData = {
  id?: number
  name: string
  value: number
  basketValue: number
  treatmentQuantity: number
  foodBasketQuantity: number
  date: string
  status: string
  totalAtendimentoValue?: number
  totalBasketValue?: number
  deliveredQuantity?: number
}

// CREATE
export function createReunion(data: Omit<ReunionData, 'id'>): ReunionData {
  const db = getDb()

  const stmt = db.prepare(`
    INSERT INTO reunions (name, value, basketValue, treatmentQuantity, foodBasketQuantity, date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    data.name,
    data.value,
    data.basketValue,
    data.treatmentQuantity,
    data.foodBasketQuantity,
    data.date,
    data.status
  )

  return { id: result.lastInsertRowid as number, ...data }
}

// READ ALL
export function getAllReunions(filters?: { startDate?: string; endDate?: string; status?: string }): ReunionData[] {
  const db = getDb()

  let query = `
    SELECT
      r.id,
      r.name,
      r.value,
      r.basketValue,
      r.date,
      r.status,
      COALESCE((SELECT COUNT(*) FROM atendimentos a WHERE a.reunionId = r.id), 0) as treatmentQuantity,
      COALESCE((SELECT SUM(a.foodBasketQuantity) FROM atendimentos a WHERE a.reunionId = r.id), 0) as foodBasketQuantity,
      COALESCE((SELECT SUM(a.value) FROM atendimentos a WHERE a.reunionId = r.id), 0) as totalAtendimentoValue,
      COALESCE((SELECT SUM(a.foodBasketQuantity) FROM atendimentos a WHERE a.reunionId = r.id), 0) * r.basketValue as totalBasketValue,
      COALESCE((SELECT COUNT(*) FROM atendimentos a WHERE a.reunionId = r.id AND a.devolvido = 1), 0) as deliveredQuantity
    FROM reunions r
  `

  const conditions: string[] = []
  const params: any[] = []

  if (filters?.startDate) {
    conditions.push(`r.date >= ?`)
    params.push(filters.startDate)
  }

  if (filters?.endDate) {
    conditions.push(`r.date <= ?`)
    params.push(filters.endDate)
  }

  if (filters?.status) {
    conditions.push(`r.status = ?`)
    params.push(filters.status)
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += `
    ORDER BY r.date DESC
  `

  const stmt = db.prepare(query)
  return stmt.all(...params) as ReunionData[]
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
    SET name = ?, value = ?, basketValue = ?, treatmentQuantity = ?, foodBasketQuantity = ?, date = ?, status = ?
    WHERE id = ?
  `)

  stmt.run(
    data.name,
    data.value,
    data.basketValue,
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

  db.prepare('DELETE FROM atendimentos WHERE reunionId = ?').run(id)
  db.prepare('DELETE FROM reunions WHERE id = ?').run(id)
}
