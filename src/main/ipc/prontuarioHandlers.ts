// src/main/ipc/prontuarioHandlers.ts
import { ipcMain } from 'electron'
import {
  createProntuario,
  deleteProntuario,
  getAllProntuarios,
  getProntuarioById,
  getProntuarioByNumber,
  getProntuariosByUnity,
  getActiveProntuarios,
  updateProntuario,
  type ProntuarioData
} from '../database/prontuarioRepository'

export function registerProntuarioHandlers() {
  ipcMain.handle('prontuario:create', async (_event, payload: Omit<ProntuarioData, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Backend - Recebendo dados para criar prontuário:', payload)
    const result = createProntuario(payload)
    console.log('Backend - Resultado da criação:', result)
    return result
  })

  ipcMain.handle('prontuario:getAll', async () => {
    return getAllProntuarios()
  })

  ipcMain.handle('prontuario:getById', async (_event, id: number) => {
    return getProntuarioById(id)
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
    console.log('Backend - Recebendo dados para atualizar prontuário:', payload)
    const result = updateProntuario(payload)
    console.log('Backend - Resultado da atualização:', result)
    return result
  })

  ipcMain.handle('prontuario:delete', async (_event, id: number) => {
    console.log('Backend - Deletando prontuário com ID:', id)
    deleteProntuario(id)
    return true
  })
}