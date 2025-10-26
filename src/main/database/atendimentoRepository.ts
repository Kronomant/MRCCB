// src/main/database/atendimentoRepository.ts
import { getDb } from './db'

export type AtendimentoData = {
  id?: number
  prontuarioId: number
  reunionId: number
  date: string
  aprovedValue: boolean
  value: number
  foodBasketQuantity: number
  onlyClothes: boolean
  emergency: boolean
  returned: boolean
  repeat: boolean
  createdAt?: string
  updatedAt?: string
}

export function createAtendimento(
  data: Omit<AtendimentoData, 'id' | 'createdAt' | 'updatedAt'>
): AtendimentoData {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO atendimentos (
      prontuarioId, reunionId, date, aprovedValue, value, foodBasketQuantity, onlyClothes, emergency, returned, repeat, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `)
  const result = stmt.run(
    data.prontuarioId,
    data.reunionId,
    data.date,
    data.aprovedValue ? 1 : 0,
    data.value,
    data.foodBasketQuantity,
    data.onlyClothes ? 1 : 0,
    data.emergency ? 1 : 0,
    data.returned ? 1 : 0,
    data.repeat ? 1 : 0
  )

  // Buscar o registro criado para retornar com timestamps
  const created = getAtendimentoById(result.lastInsertRowid as number)
  return created!
}

export function getAllAtendimentos(): AtendimentoData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM atendimentos ORDER BY date DESC')
  const rows = stmt.all() as AtendimentoData[]
  return rows.map((r) => ({
    ...r,
    aprovedValue: !!r.aprovedValue,
    onlyClothes: !!r.onlyClothes,
    emergency: !!r.emergency,
    returned: !!r.returned,
    repeat: !!r.repeat
  }))
}

export function getAtendimentosByReunion(reunionId: number): AtendimentoData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM atendimentos WHERE reunionId = ? ORDER BY date DESC')
  const rows = stmt.all(reunionId) as AtendimentoData[]
  return rows.map((r) => ({
    ...r,
    aprovedValue: !!r.aprovedValue,
    onlyClothes: !!r.onlyClothes,
    emergency: !!r.emergency,
    returned: !!r.returned,
    repeat: !!r.repeat
  }))
}

export function getAtendimentosByProntuario(prontuarioId: number): AtendimentoData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM atendimentos WHERE prontuarioId = ? ORDER BY date DESC')
  const rows = stmt.all(prontuarioId) as AtendimentoData[]
  return rows.map((r) => ({
    ...r,
    aprovedValue: !!r.aprovedValue,
    onlyClothes: !!r.onlyClothes,
    emergency: !!r.emergency,
    returned: !!r.returned,
    repeat: !!r.repeat
  }))
}

export function getAtendimentoById(id: number): AtendimentoData | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM atendimentos WHERE id = ?')
  const r = stmt.get(id) as AtendimentoData
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

export function updateAtendimento(data: AtendimentoData): AtendimentoData {
  const db = getDb()
  if (data.id === undefined) throw new Error('ID is required to update atendimento')
  const stmt = db.prepare(`
    UPDATE atendimentos SET
      prontuarioId = ?, reunionId = ?, date = ?, aprovedValue = ?, value = ?, foodBasketQuantity = ?, onlyClothes = ?, emergency = ?, returned = ?, repeat = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(
    data.prontuarioId,
    data.reunionId,
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

  // Buscar o registro atualizado para retornar com novo timestamp
  const updated = getAtendimentoById(data.id)
  return updated!
}

export function deleteAtendimento(id: number): void {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM atendimentos WHERE id = ?')
  stmt.run(id)
}
