import { ipcMain } from 'electron'
import {
  createCashRegister,
  getCashRegisterByReunion,
  updateCashRegisterOpening,
  closeCashRegister,
  getCashRegisterById,
  type CashRegister
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
  
  ipcMain.handle('cashRegister:create', (_, data: Omit<CashRegister, 'id' | 'createdAt' | 'updatedAt' | 'closingValue' | 'closingDifference' | 'status'>) => {
    return createCashRegister(data)
  })

  ipcMain.handle('cashRegister:getByReunion', (_, reunionId: number) => {
    return getCashRegisterByReunion(reunionId)
  })

  ipcMain.handle('cashRegister:getById', (_, id: number) => {
    return getCashRegisterById(id)
  })

  ipcMain.handle('cashRegister:updateOpening', (_, { id, data }: { id: number; data: { openingValue: number; availableValue: number } }) => {
    updateCashRegisterOpening(id, data)
    return { success: true }
  })

  ipcMain.handle('cashRegister:close', (_, { id, closingValue, difference }: { id: number; closingValue: number; difference: number }) => {
    closeCashRegister(id, closingValue, difference)
    return { success: true }
  })

  // --- TICKETS (PASSAGENS) ---

  ipcMain.handle('cashTicket:create', (_, data: Omit<CashTicket, 'id' | 'createdAt'>) => {
    return createTicket(data)
  })

  ipcMain.handle('cashTicket:listByReunion', (_, reunionId: number) => {
    return getTicketsByReunion(reunionId)
  })

  ipcMain.handle('cashTicket:update', (_, { id, data }: { id: number; data: Partial<CashTicket> }) => {
    updateTicket(id, data)
    return { success: true }
  })

  ipcMain.handle('cashTicket:delete', (_, id: number) => {
    deleteTicket(id)
    return { success: true }
  })
  
  ipcMain.handle('cashTicket:totalByReunion', (_, reunionId: number) => {
    return getTotalTicketsByReunion(reunionId)
  })

  // --- EXPENSES (NOTAS DE GASTO) ---

  ipcMain.handle('cashExpense:create', (_, data: Omit<CashExpense, 'id' | 'createdAt'>) => {
    return createExpense(data)
  })

  ipcMain.handle('cashExpense:listByReunion', (_, reunionId: number) => {
    return getExpensesByReunion(reunionId)
  })

  ipcMain.handle('cashExpense:update', (_, { id, data }: { id: number; data: Partial<CashExpense> }) => {
    updateExpense(id, data)
    return { success: true }
  })

  ipcMain.handle('cashExpense:delete', (_, id: number) => {
    deleteExpense(id)
    return { success: true }
  })

  ipcMain.handle('cashExpense:totalByReunion', (_, reunionId: number) => {
    return getTotalExpensesByReunion(reunionId)
  })

  ipcMain.handle('cashExpense:totalsByCategory', (_, reunionId: number) => {
    return getTotalExpensesByCategory(reunionId)
  })
}
