// src/main/ipc/prontuarioHandlers.ts
import { ipcMain } from 'electron'
import { broadcast } from '../server/httpServer'
import {
  createProntuario,
  deleteProntuario,
  getAllProntuarios,
  getProntuarioById,
  getProntuarioByNumber,
  getProntuariosByIds,
  getProntuariosByUnity,
  getActiveProntuarios,
  updateProntuario,
  type ProntuarioData
} from '../database/prontuarioRepository'

export function registerProntuarioHandlers() {
  ipcMain.handle(
    'prontuario:create',
    async (_event, payload: Omit<ProntuarioData, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = createProntuario(payload)
      broadcast({ entity: 'prontuario' })
      return result
    }
  )

  ipcMain.handle('prontuario:getAll', async () => {
    return getAllProntuarios()
  })

  ipcMain.handle('prontuario:getById', async (_event, id: number) => {
    return getProntuarioById(id)
  })

  ipcMain.handle('prontuario:getByIds', async (_event, ids: number[]) => {
    return getProntuariosByIds(ids)
  })

  ipcMain.handle('prontuario:getByNumber', async (_event, number: number) => {
    return getProntuarioByNumber(number)
  })

  ipcMain.handle('prontuario:getByUnity', async (_event, unityId: number) => {
    return getProntuariosByUnity(unityId)
  })

  ipcMain.handle('prontuario:getActive', async () => {
    return getActiveProntuarios()
  })

  ipcMain.handle('prontuario:update', async (_event, payload: ProntuarioData) => {
    const result = updateProntuario(payload)
    broadcast({ entity: 'prontuario' })
    return result
  })

  ipcMain.handle('prontuario:delete', async (_event, id: number) => {
    deleteProntuario(id)
    broadcast({ entity: 'prontuario' })
    return true
  })
}
