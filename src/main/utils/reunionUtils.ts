// src/main/utils/reunionUtils.ts
import { getProntuariosForNextMonthReturn } from '../database/prontuarioDeliveryRepository'
import { createStatusTransitionLog } from '../database/prontuarioDeliveryRepository'
import { getDb } from '../database/db'

export function createAutomaticReturnsForReunion(reunionId: number, processedBy: string): number {
  const db = getDb()
  const prontuariosForReturn = getProntuariosForNextMonthReturn()
  let createdCount = 0
  
  for (const prontuarioDelivery of prontuariosForReturn) {
    // Check if a return record already exists for this prontuario and reunion
    const existingReturn = db.prepare('SELECT * FROM prontuario_delivery_status WHERE prontuarioId = ? AND reunionId = ?').get(
      prontuarioDelivery.prontuarioId,
      reunionId
    ) as any
    
    if (!existingReturn) {
      // Create a new return record with status 'pendente' for the new reunion
      const stmt = db.prepare(`
        INSERT INTO prontuario_delivery_status 
        (prontuarioId, reunionId, status, createdAt, updatedAt)
        VALUES (?, ?, 'pendente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      
      const result = stmt.run(prontuarioDelivery.prontuarioId, reunionId)
      
      if (result.changes > 0) {
        createdCount++
        
        // Log the automatic return creation
        createStatusTransitionLog({
          entityType: 'prontuario_delivery',
          entityId: result.lastInsertRowid as number,
          previousStatus: 'entregue',
          newStatus: 'pendente',
          changedBy: processedBy,
          notes: `Prontuário ${prontuarioDelivery.prontuarioId} automaticamente incluído para retorno na reunião ${reunionId}`
        })
      }
    }
  }
  
  return createdCount
}