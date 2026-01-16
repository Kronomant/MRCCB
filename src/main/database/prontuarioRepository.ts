// src/main/database/prontuarioRepository.ts
import { getDb } from './db'

export type ProntuarioData = {
  id?: number
  number: number
  unityId: number
  ministry: boolean
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export function createProntuario(
  data: Omit<ProntuarioData, 'id' | 'createdAt' | 'updatedAt'>
): ProntuarioData {
  const db = getDb()
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO prontuarios (
      number, unityId, ministry, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(data.number, data.unityId, data.ministry ? 1 : 0, data.status, now, now)

  return {
    id: result.lastInsertRowid as number,
    ...data,
    createdAt: now,
    updatedAt: now
  }
}

export function getAllProntuarios(): ProntuarioData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuarios ORDER BY number ASC')
  const rows = stmt.all() as ProntuarioData[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry
  }))
}

export function getProntuarioById(id: number): ProntuarioData | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuarios WHERE id = ?')
  const r = stmt.get(id) as ProntuarioData

  if (!r) return undefined

  return {
    ...r,
    ministry: !!r.ministry
  }
}

export function getProntuariosByIds(ids: number[]): ProntuarioData[] {
  if (ids.length === 0) return []
  const db = getDb()
  const placeholders = ids.map(() => '?').join(',')
  const stmt = db.prepare(`SELECT * FROM prontuarios WHERE id IN (${placeholders})`)
  const rows = stmt.all(ids) as ProntuarioData[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry
  }))
}

export function getProntuarioByNumber(number: number): ProntuarioData | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuarios WHERE number = ?')
  const r = stmt.get(number) as ProntuarioData

  if (!r) return undefined

  return {
    ...r,
    ministry: !!r.ministry
  }
}

export function updateProntuario(data: ProntuarioData): ProntuarioData {
  const db = getDb()
  if (data.id === undefined) throw new Error('ID is required to update prontuario')

  const now = new Date().toISOString()

  const stmt = db.prepare(`
    UPDATE prontuarios SET
      number = ?, unityId = ?, ministry = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `)

  stmt.run(data.number, data.unityId, data.ministry ? 1 : 0, data.status, now, data.id)

  return { ...data, updatedAt: now }
}

export function deleteProntuario(id: number): void {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM prontuarios WHERE id = ?')
  stmt.run(id)
}

export function getProntuariosByUnity(unityId: number): ProntuarioData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuarios WHERE unityId = ? ORDER BY number ASC')
  const rows = stmt.all(unityId) as ProntuarioData[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry
  }))
}

export function getActiveProntuarios(): ProntuarioData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuarios WHERE status = ? ORDER BY number ASC')
  const rows = stmt.all('active') as ProntuarioData[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry
  }))
}
