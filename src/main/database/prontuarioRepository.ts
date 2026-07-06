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
  hasPendingDelivery?: boolean
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
  const stmt = db.prepare(`
    SELECT p.*,
           (
             EXISTS (
               SELECT 1 
               FROM atendimentos a
               LEFT JOIN prontuario_delivery_status pds 
                 ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
               WHERE a.prontuarioId = p.id 
                 AND a.devolvido = 0
                 AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
             )
             OR EXISTS (
               SELECT 1 
               FROM prontuario_delivery_status pds
               WHERE pds.prontuarioId = p.id 
                 AND pds.status = 'pendente'
                 AND NOT EXISTS (
                   SELECT 1 
                   FROM atendimentos a 
                   WHERE a.prontuarioId = p.id 
                     AND a.reunionId = pds.reunionId 
                     AND a.devolvido = 1
                 )
             )
           ) AS hasPendingDelivery
    FROM prontuarios p
    ORDER BY p.number ASC
  `)
  const rows = stmt.all() as any[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry,
    hasPendingDelivery: !!r.hasPendingDelivery
  }))
}

export function getProntuarioById(id: number): ProntuarioData | undefined {
  const db = getDb()
  const stmt = db.prepare(`
    SELECT p.*,
           (
             EXISTS (
               SELECT 1 
               FROM atendimentos a
               LEFT JOIN prontuario_delivery_status pds 
                 ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
               WHERE a.prontuarioId = p.id 
                 AND a.devolvido = 0
                 AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
             )
             OR EXISTS (
               SELECT 1 
               FROM prontuario_delivery_status pds
               WHERE pds.prontuarioId = p.id 
                 AND pds.status = 'pendente'
                 AND NOT EXISTS (
                   SELECT 1 
                   FROM atendimentos a 
                   WHERE a.prontuarioId = p.id 
                     AND a.reunionId = pds.reunionId 
                     AND a.devolvido = 1
                 )
             )
           ) AS hasPendingDelivery
    FROM prontuarios p
    WHERE p.id = ?
  `)
  const r = stmt.get(id) as any

  if (!r) return undefined

  return {
    ...r,
    ministry: !!r.ministry,
    hasPendingDelivery: !!r.hasPendingDelivery
  }
}

export function getProntuariosByIds(ids: number[]): ProntuarioData[] {
  if (ids.length === 0) return []
  const db = getDb()
  const placeholders = ids.map(() => '?').join(',')
  const stmt = db.prepare(`
    SELECT p.*,
           (
             EXISTS (
               SELECT 1 
               FROM atendimentos a
               LEFT JOIN prontuario_delivery_status pds 
                 ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
               WHERE a.prontuarioId = p.id 
                 AND a.devolvido = 0
                 AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
             )
             OR EXISTS (
               SELECT 1 
               FROM prontuario_delivery_status pds
               WHERE pds.prontuarioId = p.id 
                 AND pds.status = 'pendente'
                 AND NOT EXISTS (
                   SELECT 1 
                   FROM atendimentos a 
                   WHERE a.prontuarioId = p.id 
                     AND a.reunionId = pds.reunionId 
                     AND a.devolvido = 1
                 )
             )
           ) AS hasPendingDelivery
    FROM prontuarios p
    WHERE p.id IN (${placeholders})
  `)
  const rows = stmt.all(ids) as any[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry,
    hasPendingDelivery: !!r.hasPendingDelivery
  }))
}

export function getProntuarioByNumber(number: number): ProntuarioData | undefined {
  const db = getDb()
  const stmt = db.prepare(`
    SELECT p.*,
           (
             EXISTS (
               SELECT 1 
               FROM atendimentos a
               LEFT JOIN prontuario_delivery_status pds 
                 ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
               WHERE a.prontuarioId = p.id 
                 AND a.devolvido = 0
                 AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
             )
             OR EXISTS (
               SELECT 1 
               FROM prontuario_delivery_status pds
               WHERE pds.prontuarioId = p.id 
                 AND pds.status = 'pendente'
                 AND NOT EXISTS (
                   SELECT 1 
                   FROM atendimentos a 
                   WHERE a.prontuarioId = p.id 
                     AND a.reunionId = pds.reunionId 
                     AND a.devolvido = 1
                 )
             )
           ) AS hasPendingDelivery
    FROM prontuarios p
    WHERE p.number = ?
  `)
  const r = stmt.get(number) as any

  if (!r) return undefined

  return {
    ...r,
    ministry: !!r.ministry,
    hasPendingDelivery: !!r.hasPendingDelivery
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
  const stmt = db.prepare(`
    SELECT p.*,
           (
             EXISTS (
               SELECT 1 
               FROM atendimentos a
               LEFT JOIN prontuario_delivery_status pds 
                 ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
               WHERE a.prontuarioId = p.id 
                 AND a.devolvido = 0
                 AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
             )
             OR EXISTS (
               SELECT 1 
               FROM prontuario_delivery_status pds
               WHERE pds.prontuarioId = p.id 
                 AND pds.status = 'pendente'
                 AND NOT EXISTS (
                   SELECT 1 
                   FROM atendimentos a 
                   WHERE a.prontuarioId = p.id 
                     AND a.reunionId = pds.reunionId 
                     AND a.devolvido = 1
                 )
             )
           ) AS hasPendingDelivery
    FROM prontuarios p
    WHERE p.unityId = ?
    ORDER BY p.number ASC
  `)
  const rows = stmt.all(unityId) as any[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry,
    hasPendingDelivery: !!r.hasPendingDelivery
  }))
}

export function getActiveProntuarios(): ProntuarioData[] {
  const db = getDb()
  const stmt = db.prepare(`
    SELECT p.*,
           (
             EXISTS (
               SELECT 1 
               FROM atendimentos a
               LEFT JOIN prontuario_delivery_status pds 
                 ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
               WHERE a.prontuarioId = p.id 
                 AND a.devolvido = 0
                 AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
             )
             OR EXISTS (
               SELECT 1 
               FROM prontuario_delivery_status pds
               WHERE pds.prontuarioId = p.id 
                 AND pds.status = 'pendente'
                 AND NOT EXISTS (
                   SELECT 1 
                   FROM atendimentos a 
                   WHERE a.prontuarioId = p.id 
                     AND a.reunionId = pds.reunionId 
                     AND a.devolvido = 1
                 )
             )
           ) AS hasPendingDelivery
    FROM prontuarios p
    WHERE p.status = ?
    ORDER BY p.number ASC
  `)
  const rows = stmt.all('active') as any[]

  return rows.map((r) => ({
    ...r,
    ministry: !!r.ministry,
    hasPendingDelivery: !!r.hasPendingDelivery
  }))
}
