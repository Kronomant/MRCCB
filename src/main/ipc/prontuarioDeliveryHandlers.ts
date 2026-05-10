// src/main/ipc/prontuarioDeliveryHandlers.ts
import { ipcMain } from 'electron'
import * as repository from '../database/prontuarioDeliveryRepository'

export function registerProntuarioDeliveryHandlers(): void {
  // Get prontuario delivery status by IDs
  ipcMain.handle('prontuarioDelivery:getByIds', async (_, prontuarioId: number, reunionId: number) => {
    try {
      return repository.getProntuarioDeliveryByIds(prontuarioId, reunionId)
    } catch (error) {
      console.error('Error getting prontuario delivery status:', error)
      throw error
    }
  })

  // Get all prontuario deliveries for a reunion
  ipcMain.handle('prontuarioDelivery:getByReunion', async (_, reunionId: number) => {
    try {
      return repository.getProntuarioDeliveriesByReunion(reunionId)
    } catch (error) {
      console.error('Error getting prontuario deliveries by reunion:', error)
      throw error
    }
  })

  // Get all prontuario deliveries for a prontuario
  ipcMain.handle('prontuarioDelivery:getByProntuario', async (_, prontuarioId: number) => {
    try {
      return repository.getProntuarioDeliveriesByProntuario(prontuarioId)
    } catch (error) {
      console.error('Error getting prontuario deliveries by prontuario:', error)
      throw error
    }
  })

  // Mark prontuario as delivered
  ipcMain.handle('prontuarioDelivery:markDelivered', async (_, prontuarioId: number, reunionId: number, deliveredBy: string) => {
    try {
      return repository.markProntuarioAsDelivered(prontuarioId, reunionId, deliveredBy)
    } catch (error) {
      console.error('Error marking prontuario as delivered:', error)
      throw error
    }
  })

  // Mark prontuario as returned
  ipcMain.handle('prontuarioDelivery:markReturned', async (_, prontuarioId: number, reunionId: number, returnedBy: string) => {
    try {
      return repository.markProntuarioAsReturned(prontuarioId, reunionId, returnedBy)
    } catch (error) {
      console.error('Error marking prontuario as returned:', error)
      throw error
    }
  })

  // Update delivery status generically
  ipcMain.handle('prontuarioDelivery:updateStatus', async (_, prontuarioId: number, reunionId: number, status: string, by: string) => {
    try {
      const now = new Date().toISOString()
      const data: any = {
        prontuarioId,
        reunionId,
        status,
        updatedAt: now
      }
      
      if (status === 'entregue') {
         data.deliveredAt = now
         data.deliveredBy = by
      } else if (status === 'devolvido') {
         data.returnedAt = now
         data.returnedBy = by
      } else if (status === 'pendente') {
         // Reset dates if needed, or just status? Usually just status is enough for now, 
         // but let's keep it simple and just update status.
      }

      return repository.upsertProntuarioDelivery(data)
    } catch (error) {
      console.error('Error updating prontuario delivery status:', error)
      throw error
    }
  })

  // Get status transition logs
  ipcMain.handle('prontuarioDelivery:getStatusLogs', async (_, entityType: 'reunion' | 'prontuario_delivery', entityId: number) => {
    try {
      return repository.getStatusTransitionLogs(entityType, entityId)
    } catch (error) {
      console.error('Error getting status transition logs:', error)
      throw error
    }
  })

  // Create automatic returns for next month
  ipcMain.handle('prontuarioDelivery:createAutomaticReturns', async (_, reunionId: number, processedBy: string) => {
    try {
      return repository.createAutomaticReturns(reunionId, processedBy)
    } catch (error) {
      console.error('Error creating automatic returns:', error)
      throw error
    }
  })

  // Get prontuarios for next month return
  ipcMain.handle('prontuarioDelivery:getForNextMonthReturn', async () => {
    try {
      return repository.getProntuariosForNextMonthReturn()
    } catch (error) {
      console.error('Error getting prontuarios for next month return:', error)
      throw error
    }
  })

  // Get delivery summaries for multiple reunions (bulk)
  ipcMain.handle('prontuarioDelivery:getSummariesByReunions', async (_, reunionIds: number[]) => {
    try {
      return repository.getDeliverySummariesByReunions(reunionIds)
    } catch (error) {
      console.error('Error getting delivery summaries by reunions:', error)
      throw error
    }
  })
}