import { ipcMain } from 'electron'
import { broadcast } from '../server/httpServer'
import {
  createUnity,
  createUnitiesBulk,
  getAllUnities,
  getUnityById,
  updateUnity,
  deleteUnity,
  type UnityData
} from '../database/unityRepository'

export function registerUnityHandlers() {
  ipcMain.handle('unity:create', (_event, payload: Omit<UnityData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = createUnity(payload)
    broadcast({ entity: 'unity' })
    return result
  })

  ipcMain.handle('unity:createBulk', (_event, names: string[]) => {
    const result = createUnitiesBulk(names)
    broadcast({ entity: 'unity' })
    return result
  })

  ipcMain.handle('unity:all', () => {
    return getAllUnities()
  })

  ipcMain.handle('unity:getById', (_event, id: number) => {
    return getUnityById(id)
  })

  ipcMain.handle('unity:update', (_event, payload: UnityData) => {
    const result = updateUnity(payload)
    broadcast({ entity: 'unity' })
    return result
  })

  ipcMain.handle('unity:delete', (_event, id: number) => {
    deleteUnity(id)
    broadcast({ entity: 'unity' })
    return { success: true }
  })
}