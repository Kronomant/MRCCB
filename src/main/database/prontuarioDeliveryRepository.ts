// src/main/database/prontuarioDeliveryRepository.ts
import { getDb } from './db'

export type ProntuarioDeliveryStatus = 'pendente' | 'entregue' | 'devolvido'

export type ProntuarioDeliveryData = {
  id?: number
  prontuarioId: number
  reunionId: number
  status: ProntuarioDeliveryStatus
  deliveredAt?: string
  deliveredBy?: string
  returnedAt?: string
  returnedBy?: string
  createdAt?: string
  updatedAt?: string
}

export type StatusTransitionLogData = {
  id?: number
  entityType: 'reunion' | 'prontuario_delivery'
  entityId: number
  previousStatus: string
  newStatus: string
  changedBy: string
  changedAt?: string
  notes?: string
}

// CREATE ou UPDATE - cria ou atualiza o status de entrega
export function upsertProntuarioDelivery(
  data: Omit<ProntuarioDeliveryData, 'id' | 'createdAt' | 'updatedAt'>
): ProntuarioDeliveryData {
  const db = getDb()
  const now = new Date().toISOString()

  const existing = getProntuarioDeliveryByIds(data.prontuarioId, data.reunionId)

  if (existing) {
    // UPDATE
    const stmt = db.prepare(`
      UPDATE prontuario_delivery_status 
      SET status = ?, deliveredAt = ?, deliveredBy = ?, returnedAt = ?, returnedBy = ?, updatedAt = ?
      WHERE prontuarioId = ? AND reunionId = ?
    `)

    stmt.run(
      data.status,
      data.deliveredAt || existing.deliveredAt,
      data.deliveredBy || existing.deliveredBy,
      data.returnedAt || existing.returnedAt,
      data.returnedBy || existing.returnedBy,
      now,
      data.prontuarioId,
      data.reunionId
    )

    return {
      ...existing,
      ...data,
      updatedAt: now
    }
  } else {
    // CREATE
    const stmt = db.prepare(`
      INSERT INTO prontuario_delivery_status 
      (prontuarioId, reunionId, status, deliveredAt, deliveredBy, returnedAt, returnedBy, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.prontuarioId,
      data.reunionId,
      data.status,
      data.deliveredAt || null,
      data.deliveredBy || null,
      data.returnedAt || null,
      data.returnedBy || null,
      now,
      now
    )

    return {
      id: result.lastInsertRowid as number,
      ...data,
      createdAt: now,
      updatedAt: now
    }
  }
}

// READ - busca por IDs específicos
export function getProntuarioDeliveryByIds(
  prontuarioId: number,
  reunionId: number
): ProntuarioDeliveryData | undefined {
  const db = getDb()
  const stmt = db.prepare(
    'SELECT * FROM prontuario_delivery_status WHERE prontuarioId = ? AND reunionId = ?'
  )
  return stmt.get(prontuarioId, reunionId) as ProntuarioDeliveryData | undefined
}

// READ - busca todos os prontuários de uma reunião
export function getProntuarioDeliveriesByReunion(reunionId: number): ProntuarioDeliveryData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuario_delivery_status WHERE reunionId = ?')
  return stmt.all(reunionId) as ProntuarioDeliveryData[]
}

// READ - busca todas as reuniões de um prontuário
export function getProntuarioDeliveriesByProntuario(
  prontuarioId: number
): ProntuarioDeliveryData[] {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM prontuario_delivery_status WHERE prontuarioId = ?')
  return stmt.all(prontuarioId) as ProntuarioDeliveryData[]
}

// DELETE - remove registro (usado para testes ou limpeza)
export function deleteProntuarioDelivery(prontuarioId: number, reunionId: number): void {
  const db = getDb()
  const stmt = db.prepare(
    'DELETE FROM prontuario_delivery_status WHERE prontuarioId = ? AND reunionId = ?'
  )
  stmt.run(prontuarioId, reunionId)
}

// Status Transition Log functions
export function createStatusTransitionLog(data: StatusTransitionLogData): StatusTransitionLogData {
  const db = getDb()
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO status_transition_log 
    (entityType, entityId, previousStatus, newStatus, changedBy, changedAt, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    data.entityType,
    data.entityId,
    data.previousStatus,
    data.newStatus,
    data.changedBy,
    now,
    data.notes || null
  )

  return {
    id: result.lastInsertRowid as number,
    ...data,
    changedAt: now
  }
}

// READ - busca histórico de transições por entidade
export function getStatusTransitionLogs(
  entityType: 'reunion' | 'prontuario_delivery',
  entityId: number
): StatusTransitionLogData[] {
  const db = getDb()
  const stmt = db.prepare(
    'SELECT * FROM status_transition_log WHERE entityType = ? AND entityId = ? ORDER BY changedAt DESC'
  )
  return stmt.all(entityType, entityId) as StatusTransitionLogData[]
}

// Function to mark prontuario as delivered
export function markProntuarioAsDelivered(
  prontuarioId: number,
  reunionId: number,
  deliveredBy: string
): ProntuarioDeliveryData {
  const now = new Date().toISOString()

  const result = upsertProntuarioDelivery({
    prontuarioId,
    reunionId,
    status: 'entregue',
    deliveredAt: now,
    deliveredBy
  })

  // Log the status transition
  const existing = getProntuarioDeliveryByIds(prontuarioId, reunionId)
  const previousStatus = existing?.status || 'pendente'

  createStatusTransitionLog({
    entityType: 'prontuario_delivery',
    entityId: result.id!,
    previousStatus,
    newStatus: 'entregue',
    changedBy: deliveredBy,
    notes: `Prontuário ${prontuarioId} marcado como entregue na reunião ${reunionId}`
  })

  return result
}

// Function to get prontuarios that need to be returned next month
export function getProntuariosForNextMonthReturn(currentDate: Date = new Date()): ProntuarioDeliveryData[] {
  const db = getDb()
  
  // Calculate next month
  const nextMonth = new Date(currentDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  
  // Get all delivered prontuarios that haven't been returned yet
  const stmt = db.prepare(`
    SELECT * FROM prontuario_delivery_status 
    WHERE status = 'entregue' AND returnedAt IS NULL
    ORDER BY deliveredAt ASC
  `)
  
  return stmt.all() as ProntuarioDeliveryData[]
}

// Function to automatically create return records for next month
export function createAutomaticReturns(reunionId: number, processedBy: string): number {
  const db = getDb()
  const prontuariosForReturn = getProntuariosForNextMonthReturn()
  let createdCount = 0
  
  for (const prontuarioDelivery of prontuariosForReturn) {
    // Check if a return record already exists for this prontuario and reunion
    const existingReturn = getProntuarioDeliveryByIds(prontuarioDelivery.prontuarioId, reunionId)
    
    if (!existingReturn) {
      // Create a new return record with status 'pendente' for the new reunion
      upsertProntuarioDelivery({
        prontuarioId: prontuarioDelivery.prontuarioId,
        reunionId,
        status: 'pendente'
      })
      
      createdCount++
      
      // Log the automatic return creation
      createStatusTransitionLog({
        entityType: 'prontuario_delivery',
        entityId: prontuarioDelivery.id!,
        previousStatus: 'entregue',
        newStatus: 'pendente',
        changedBy: processedBy,
        notes: `Prontuário ${prontuarioDelivery.prontuarioId} automaticamente incluído para retorno na reunião ${reunionId}`
      })
    }
  }
  
  return createdCount
}

// Function to mark prontuario as returned
export function markProntuarioAsReturned(
  prontuarioId: number,
  reunionId: number,
  returnedBy: string
): ProntuarioDeliveryData {
  const now = new Date().toISOString()

  const result = upsertProntuarioDelivery({
    prontuarioId,
    reunionId,
    status: 'devolvido',
    returnedAt: now,
    returnedBy
  })

  // Log the status transition
  const existing = getProntuarioDeliveryByIds(prontuarioId, reunionId)
  const previousStatus = existing?.status || 'pendente'

  createStatusTransitionLog({
    entityType: 'prontuario_delivery',
    entityId: result.id!,
    previousStatus,
    newStatus: 'devolvido',
    changedBy: returnedBy,
    notes: `Prontuário ${prontuarioId} marcado como devolvido na reunião ${reunionId}`
  })

  return result
}