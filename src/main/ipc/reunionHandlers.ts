import { ipcMain } from 'electron'
import { broadcast } from '../server/httpServer'

// CRUD de reuniões via IPC

import {
  createReunion,
  getAllReunions,
  updateReunion,
  deleteReunion,
  getReunionById,
  type ReunionData
} from '../database/reunionRepository'

export function registerReunionHandlers() {
  // CREATE
  ipcMain.handle('reunion:create', (event, data: Omit<ReunionData, 'id'>) => {
    const result = createReunion(data)
    broadcast({ entity: 'reunion' })
    return result
  })

  ipcMain.handle('reunion:getById', (event, id: number) => {
    return getReunionById(id)
  })

  // READ ALL
  ipcMain.handle('reunion:all', (event, filters?: { startDate?: string; endDate?: string; status?: string }) => {
    return getAllReunions(filters)
  })

  // UPDATE
  ipcMain.handle('reunion:update', (event, data: ReunionData) => {
    const result = updateReunion(data)
    broadcast({ entity: 'reunion' })
    return result
  })

  // DELETE
  ipcMain.handle('reunion:delete', (event, id: number) => {
    deleteReunion(id)
    broadcast({ entity: 'reunion' })
    return { success: true }
  })
}
