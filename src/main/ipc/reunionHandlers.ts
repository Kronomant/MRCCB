import { ipcMain } from 'electron'

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
    return createReunion(data)
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
    return updateReunion(data)
  })

  // DELETE
  ipcMain.handle('reunion:delete', (event, id: number) => {
    deleteReunion(id)
    return { success: true }
  })
}
