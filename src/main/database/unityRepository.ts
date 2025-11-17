import { getDb } from './db'

export type UnityData = {
  id?: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export function createUnity(data: Omit<UnityData, 'id' | 'createdAt' | 'updatedAt'>): UnityData {
  const db = getDb()
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO unities (name, createdAt, updatedAt) VALUES (?, ?, ?)
  `)
  const result = stmt.run(data.name, now, now)

  return { id: result.lastInsertRowid as number, name: data.name, createdAt: now, updatedAt: now }
}

export function getAllUnities(): UnityData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM unities ORDER BY name ASC')
  const rows = stmt.all() as UnityData[]
  return rows
}

export function getUnityById(id: number): UnityData | undefined {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM unities WHERE id = ?')
  const row = stmt.get(id) as UnityData
  return row || undefined
}

export function updateUnity(data: UnityData): UnityData {
  const db = getDb()
  if (data.id === undefined) throw new Error('ID is required to update unity')
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    UPDATE unities SET name = ?, updatedAt = ? WHERE id = ?
  `)
  stmt.run(data.name, now, data.id)
  return { ...data, updatedAt: now }
}

export function deleteUnity(id: number): void {
  const db = getDb()
  const stmt = db.prepare('DELETE FROM unities WHERE id = ?')
  stmt.run(id)
}