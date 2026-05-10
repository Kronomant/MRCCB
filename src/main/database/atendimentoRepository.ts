// src/main/database/atendimentoRepository.ts
import { getDb } from './db'

export type AtendimentoData = {
  id?: number
  prontuarioId: number
  prontuarioNumber: number
  reunionId: number
  date: string
  aprovedValue: boolean
  value: number
  foodBasketQuantity: number
  onlyClothes: boolean
  emergency: boolean
  representacao: boolean
  devolvido: boolean
  repeat: boolean
  ministerio: boolean
  createdAt?: string
  updatedAt?: string
}

export function createAtendimento(
  data: Omit<AtendimentoData, 'id' | 'createdAt' | 'updatedAt'>
): AtendimentoData {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO atendimentos (
      prontuarioId, reunionId, date, aprovedValue, value, foodBasketQuantity, onlyClothes, emergency, representacao, devolvido, repeat, ministerio, createdAt, updatedAt, prontuarioNumber
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
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
    data.representacao ? 1 : 0,
    data.devolvido ? 1 : 0,
    data.repeat ? 1 : 0,
    data.ministerio ? 1 : 0,
    data.prontuarioNumber
  )

  const created = getAtendimentoById(result.lastInsertRowid as number)
  return created!
}

function mapRow(r: AtendimentoData): AtendimentoData {
  return {
    ...r,
    aprovedValue: Boolean(r.aprovedValue),
    onlyClothes: Boolean(r.onlyClothes),
    emergency: Boolean(r.emergency),
    representacao: Boolean(r.representacao),
    devolvido: Boolean(r.devolvido),
    repeat: Boolean(r.repeat),
    ministerio: Boolean(r.ministerio)
  }
}

export function getAllAtendimentos(): AtendimentoData[] {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM atendimentos ORDER BY date DESC').all() as AtendimentoData[]
  return rows.map(mapRow)
}

export function getAtendimentosByReunion(reunionId: number): AtendimentoData[] {
  const db = getDb()
  const rows = db
    .prepare('SELECT * FROM atendimentos WHERE reunionId = ? ORDER BY date DESC')
    .all(reunionId) as AtendimentoData[]
  return rows.map(mapRow)
}

export function getAtendimentosByProntuario(prontuarioId: number): AtendimentoData[] {
  const db = getDb()
  const rows = db
    .prepare('SELECT * FROM atendimentos WHERE prontuarioId = ? ORDER BY date DESC')
    .all(prontuarioId) as AtendimentoData[]
  return rows.map(mapRow)
}

export function getAtendimentoById(id: number): AtendimentoData | undefined {
  const db = getDb()
  const r = db.prepare('SELECT * FROM atendimentos WHERE id = ?').get(id) as AtendimentoData
  if (!r) return undefined
  return mapRow(r)
}

export function updateAtendimento(data: AtendimentoData): AtendimentoData {
  const db = getDb()
  if (data.id === undefined) throw new Error('ID is required to update atendimento')
  db.prepare(`
    UPDATE atendimentos SET
      prontuarioId = ?, reunionId = ?, date = ?, aprovedValue = ?, value = ?, foodBasketQuantity = ?,
      onlyClothes = ?, emergency = ?, representacao = ?, devolvido = ?, repeat = ?, ministerio = ?,
      prontuarioNumber = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.prontuarioId,
    data.reunionId,
    data.date,
    data.aprovedValue ? 1 : 0,
    data.value,
    data.foodBasketQuantity,
    data.onlyClothes ? 1 : 0,
    data.emergency ? 1 : 0,
    data.representacao ? 1 : 0,
    data.devolvido ? 1 : 0,
    data.repeat ? 1 : 0,
    data.ministerio ? 1 : 0,
    data.prontuarioNumber,
    data.id
  )
  return getAtendimentoById(data.id)!
}

export function toggleAtendimentoDelivery(id: number, devolvido: boolean): void {
  const db = getDb()
  db.prepare('UPDATE atendimentos SET devolvido = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(
    devolvido ? 1 : 0,
    id
  )
}

export function deleteAtendimento(id: number): void {
  const db = getDb()
  db.prepare('DELETE FROM atendimentos WHERE id = ?').run(id)
}
