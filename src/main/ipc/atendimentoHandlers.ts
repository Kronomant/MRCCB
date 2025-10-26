// src/main/ipc/atendimentoHandlers.ts
import { ipcMain } from 'electron'
import {
  createAtendimento,
  deleteAtendimento,
  getAllAtendimentos,
  getAtendimentosByReunion,
  getAtendimentosByProntuario,
  getAtendimentoById,
  updateAtendimento,
  type AtendimentoData
} from '../database/atendimentoRepository'

export function registerAtendimentoHandlers() {
  ipcMain.handle('atendimento:create', async (_event, payload: Omit<AtendimentoData, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Backend - Recebendo dados para criar atendimento:', payload)
    const result = createAtendimento(payload)
    console.log('Backend - Resultado da criação:', result)
    return result
  })

  ipcMain.handle('atendimento:getAll', async () => {
    return getAllAtendimentos()
  })

  ipcMain.handle('atendimento:getByReunionId', async (_event, reunionId: number) => {
    return getAtendimentosByReunion(reunionId)
  })

  ipcMain.handle('atendimento:getByProntuarioId', async (_event, prontuarioId: number) => {
    return getAtendimentosByProntuario(prontuarioId)
  })

  ipcMain.handle('atendimento:getById', async (_event, id: number) => {
    return getAtendimentoById(id)
  })

  ipcMain.handle('atendimento:update', async (_event, payload: AtendimentoData) => {
    return updateAtendimento(payload)
  })

  ipcMain.handle('atendimento:delete', async (_event, id: number) => {
    deleteAtendimento(id)
    return true
  })
}