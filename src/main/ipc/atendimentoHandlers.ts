// src/main/ipc/atendimentoHandlers.ts
import { ipcMain } from 'electron'
import { broadcast } from '../server/httpServer'
import {
  createAtendimento,
  deleteAtendimento,
  getAllAtendimentos,
  getAtendimentosByReunion,
  getAtendimentosByProntuario,
  getAtendimentoById,
  updateAtendimento,
  toggleAtendimentoDelivery,
  type AtendimentoData
} from '../database/atendimentoRepository'

export function registerAtendimentoHandlers() {
  ipcMain.handle(
    'atendimento:create',
    async (_event, payload: Omit<AtendimentoData, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = createAtendimento(payload)
      broadcast({ entity: 'atendimento' })
      return result
    }
  )

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
    const result = updateAtendimento(payload)
    broadcast({ entity: 'atendimento' })
    return result
  })

  ipcMain.handle('atendimento:delete', async (_event, id: number) => {
    deleteAtendimento(id)
    broadcast({ entity: 'atendimento' })
    return true
  })

  ipcMain.handle('atendimento:toggleDelivery', async (_event, id: number, devolvido: boolean) => {
    toggleAtendimentoDelivery(id, devolvido)
    broadcast({ entity: 'atendimento' })
  })
}
