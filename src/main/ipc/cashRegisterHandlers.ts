import { ipcMain } from 'electron'
import { broadcast } from '../server/httpServer'
import {
  createCashRegister,
  getCashRegisterByReunion,
  updateCashRegisterOpening,
  closeCashRegister,
  reopenCashRegister,
  getCashRegisterById,
  type CashRegister,
  type DenominationCounts
} from '../database/cashRegisterRepository'

import {
  createTicket,
  getTicketsByReunion,
  updateTicket,
  deleteTicket,
  getTotalTicketsByReunion,
  type CashTicket
} from '../database/cashTicketRepository'

import {
  createExpense,
  getExpensesByReunion,
  updateExpense,
  deleteExpense,
  getTotalExpensesByReunion,
  getTotalExpensesByCategory,
  type CashExpense
} from '../database/cashExpenseRepository'

export function registerCashRegisterHandlers() {
  // --- CASH REGISTER ---
  
  ipcMain.handle('cashRegister:create', (_, data: { reunionId: number; openingValue: number; availableValue: number; openingCounts?: DenominationCounts | null }) => {
    const result = createCashRegister(data)
    broadcast({ entity: 'cashRegister' })
    return result
  })

  ipcMain.handle('cashRegister:getByReunion', (_, reunionId: number) => {
    return getCashRegisterByReunion(reunionId)
  })

  ipcMain.handle('cashRegister:getById', (_, id: number) => {
    return getCashRegisterById(id)
  })

  ipcMain.handle('cashRegister:updateOpening', (_, { id, data }: { id: number; data: { openingValue: number; availableValue: number; openingCounts?: DenominationCounts | null } }) => {
    updateCashRegisterOpening(id, data)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })

  ipcMain.handle('cashRegister:close', (_, { id, closingValue, difference, closingCounts }: { id: number; closingValue: number; difference: number; closingCounts?: DenominationCounts | null }) => {
    closeCashRegister(id, closingValue, difference, closingCounts)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })

  ipcMain.handle('cashRegister:reopen', (_, id: number) => {
    reopenCashRegister(id)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })

  // --- TICKETS (PASSAGENS) ---

  ipcMain.handle('cashTicket:create', (_, data: Omit<CashTicket, 'id' | 'createdAt'>) => {
    const result = createTicket(data)
    broadcast({ entity: 'cashRegister' })
    return result
  })

  ipcMain.handle('cashTicket:listByReunion', (_, reunionId: number) => {
    return getTicketsByReunion(reunionId)
  })

  ipcMain.handle('cashTicket:update', (_, { id, data }: { id: number; data: Partial<CashTicket> }) => {
    updateTicket(id, data)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })

  ipcMain.handle('cashTicket:delete', (_, id: number) => {
    deleteTicket(id)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })
  
  ipcMain.handle('cashTicket:totalByReunion', (_, reunionId: number) => {
    return getTotalTicketsByReunion(reunionId)
  })

  // --- EXPENSES (NOTAS DE GASTO) ---

  ipcMain.handle('cashExpense:create', (_, data: Omit<CashExpense, 'id' | 'createdAt'>) => {
    const result = createExpense(data)
    broadcast({ entity: 'cashRegister' })
    return result
  })

  ipcMain.handle('cashExpense:listByReunion', (_, reunionId: number) => {
    return getExpensesByReunion(reunionId)
  })

  ipcMain.handle('cashExpense:update', (_, { id, data }: { id: number; data: Partial<CashExpense> }) => {
    updateExpense(id, data)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })

  ipcMain.handle('cashExpense:delete', (_, id: number) => {
    deleteExpense(id)
    broadcast({ entity: 'cashRegister' })
    return { success: true }
  })

  ipcMain.handle('cashExpense:totalByReunion', (_, reunionId: number) => {
    return getTotalExpensesByReunion(reunionId)
  })

  ipcMain.handle('cashExpense:totalsByCategory', (_, reunionId: number) => {
    return getTotalExpensesByCategory(reunionId)
  })
}
