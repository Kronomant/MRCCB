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
      COALESCE(COUNT(a.id), 0) as treatmentQuantity,
      COALESCE(SUM(a.foodBasketQuantity), 0) as foodBasketQuantity,
      COALESCE(SUM(a.value), 0) as totalAtendimentoValue,
      COALESCE(SUM(a.foodBasketQuantity), 0) * r.basketValue as totalBasketValue,
      COALESCE(COUNT(d.id), 0) as deliveredQuantity
    FROM reunions r
    LEFT JOIN atendimentos a ON a.reunionId = r.id
    LEFT JOIN prontuario_delivery_status d ON d.reunionId = r.id AND d.status = 'entregue'
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
    GROUP BY r.id
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

  const stmt = db.prepare('DELETE FROM reunions WHERE id = ?')
  stmt.run(id)
}
