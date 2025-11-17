import { ipcMain } from 'electron'
import {
  createUnity,
  getAllUnities,
  getUnityById,
  updateUnity,
  deleteUnity,
  type UnityData
} from '../database/unityRepository'

export function registerUnityHandlers() {
  ipcMain.handle('unity:create', (_event, payload: Omit<UnityData, 'id' | 'createdAt' | 'updatedAt'>) => {
    return createUnity(payload)
  })

  ipcMain.handle('unity:all', () => {
    return getAllUnities()
  })

  ipcMain.handle('unity:getById', (_event, id: number) => {
    return getUnityById(id)
  })

  ipcMain.handle('unity:update', (_event, payload: UnityData) => {
    return updateUnity(payload)
  })

  ipcMain.handle('unity:delete', (_event, id: number) => {
    deleteUnity(id)
    return { success: true }
  })
}