// src/main/database/treatmentRepository.ts
import { getDb } from './db'

export type TreatmentData = {
  id?: number
  enchiridionId: number
  reunionId: number
  unityId: number
  date: string
  aprovedValue: boolean
  value: number
  foodBasketQuantity: number
  onlyClothes: boolean
  emergency: boolean
  returned: boolean
  repeat: boolean
}

export function createTreatment(data: Omit<TreatmentData, 'id'>): TreatmentData {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO treatments (
      enchiridionId, reunionId, unityId, date, aprovedValue, value, foodBasketQuantity, onlyClothes, emergency, returned, repeat
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    data.enchiridionId,
    data.reunionId,
    data.unityId,
    data.date,
    data.aprovedValue ? 1 : 0,
    data.value,
    data.foodBasketQuantity,
    data.onlyClothes ? 1 : 0,
    data.emergency ? 1 : 0,
    data.returned ? 1 : 0,
    data.repeat ? 1 : 0
  )
  return { id: result.lastInsertRowid as number, ...data }
}

export function getAllTreatmentsByReunion(reunionId: number): TreatmentData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM treatments WHERE reunionId = ?')
  const rows = stmt.all(reunionId) as any[]
  return rows.map((r) => ({
    ...r,
    aprovedValue: !!r.aprovedValue,
    onlyClothes: !!r.onlyClothes,
    emergency: !!r.emergency,
    returned: !!r.returned,
    repeat: !!r.repeat
  }))
}

export function getTreatmentById(id: number): TreatmentData | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM treatments WHERE id = ?')
  const r = stmt.get(id) as any
  if (!r) return undefined
  return {
    ...r,
    aprovedValue: !!r.aprovedValue,
    onlyClothes: !!r.onlyClothes,
    emergency: !!r.emergency,
    returned: !!r.returned,
    repeat: !!r.repeat
  }
}

export function updateTreatment(data: TreatmentData): TreatmentData {
  const db = getDb()
  if (data.id === undefined) throw new Error('ID is required to update treatment')
  const stmt = db.prepare(`
    UPDATE treatments SET
      enchiridionId = ?, reunionId = ?, unityId = ?, date = ?, aprovedValue = ?, value = ?, foodBasketQuantity = ?, onlyClothes = ?, emergency = ?, returned = ?, repeat = ?
    WHERE id = ?
  `)
  stmt.run(
    data.enchiridionId,
    data.reunionId,
    data.unityId,
    data.date,
    data.aprovedValue ? 1 : 0,
    data.value,
    data.foodBasketQuantity,
    data.onlyClothes ? 1 : 0,
    data.emergency ? 1 : 0,
    data.returned ? 1 : 0,
    data.repeat ? 1 : 0,
    data.id
  )
  return data
}

export function deleteTreatment(id: number): void {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM treatments WHERE id = ?')
  stmt.run(id)
}