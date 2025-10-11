// src/main/ipc/treatmentHandlers.ts
import { ipcMain } from 'electron'
import {
  createTreatment,
  deleteTreatment,
  getAllTreatments,
  getAllTreatmentsByReunion,
  getTreatmentById,
  updateTreatment,
  type TreatmentData
} from '../database/treatmentRepository'

export function registerTreatmentHandlers() {
  ipcMain.handle('treatment:create', async (_event, payload: Omit<TreatmentData, 'id'>) => {
    console.log('Backend - Recebendo dados para criar prontuário:', payload)
    const result = createTreatment(payload)
    console.log('Backend - Resultado da criação:', result)
    return result
  })

  ipcMain.handle('treatment:getAll', async () => {
    return getAllTreatments()
  })

  ipcMain.handle('treatment:byReunion', async (_event, reunionId: number) => {
    return getAllTreatmentsByReunion(reunionId)
  })

  ipcMain.handle('treatment:getById', async (_event, id: number) => {
    return getTreatmentById(id)
  })

  ipcMain.handle('treatment:update', async (_event, payload: TreatmentData) => {
    return updateTreatment(payload)
  })

  ipcMain.handle('treatment:delete', async (_event, id: number) => {
    deleteTreatment(id)
    return true
  })
}