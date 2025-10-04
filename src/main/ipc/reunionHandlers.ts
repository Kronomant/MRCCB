import { ipcMain } from 'electron'

// CRUD de reuniões via IPC

import {
  createReunion,
  getAllReunions,
  updateReunion,
  deleteReunion,
  getReunionById
} from '../database/reunionRepository'

export function registerReunionHandlers() {
  // CREATE
  ipcMain.handle('reunion:create', (event, data: Omit<Reunion, 'id'>) => {
    return createReunion(data)
  })

  ipcMain.handle('reunion:getById', (event, id: number) => {
    return getReunionById(id)
  })

  // READ ALL
  ipcMain.handle('reunion:all', () => {
    return getAllReunions()
  })

  // UPDATE
  ipcMain.handle('reunion:update', (event, data: Reunion) => {
    return updateReunion(data)
  })

  // DELETE
  ipcMain.handle('reunion:delete', (event, id: number) => {
    deleteReunion(id)
    return { success: true }
  })
}
