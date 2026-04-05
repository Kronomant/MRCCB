export async function createCashRegister(data: CreateCashRegister): Promise<CashRegister> {
  return await window.electron.ipcRenderer.invoke('cashRegister:create', data)
}

export async function getCashRegisterByReunion(reunionId: number): Promise<CashRegister | undefined> {
  return await window.electron.ipcRenderer.invoke('cashRegister:getByReunion', reunionId)
}

export async function updateCashRegisterOpening(id: number, data: { openingValue: number; availableValue: number }): Promise<void> {
  return await window.electron.ipcRenderer.invoke('cashRegister:updateOpening', { id, data })
}

export async function closeCashRegister(id: number, closingValue: number, difference: number): Promise<void> {
  return await window.electron.ipcRenderer.invoke('cashRegister:close', { id, closingValue, difference })
}

// Tickets
export async function createCashTicket(data: CreateCashTicket): Promise<CashTicket> {
  return await window.electron.ipcRenderer.invoke('cashTicket:create', data)
}

export async function getTicketsByReunion(reunionId: number): Promise<CashTicket[]> {
  return await window.electron.ipcRenderer.invoke('cashTicket:listByReunion', reunionId)
}

export async function updateCashTicket(id: number, data: Partial<CashTicket>): Promise<void> {
  return await window.electron.ipcRenderer.invoke('cashTicket:update', { id, data })
}

export async function deleteCashTicket(id: number): Promise<void> {
  return await window.electron.ipcRenderer.invoke('cashTicket:delete', id)
}

export async function getTotalTicketsByReunion(reunionId: number): Promise<number> {
  return await window.electron.ipcRenderer.invoke('cashTicket:totalByReunion', reunionId)
}

// Expenses
export async function createCashExpense(data: CreateCashExpense): Promise<CashExpense> {
  return await window.electron.ipcRenderer.invoke('cashExpense:create', data)
}

export async function getExpensesByReunion(reunionId: number): Promise<CashExpense[]> {
  return await window.electron.ipcRenderer.invoke('cashExpense:listByReunion', reunionId)
}

export async function updateCashExpense(id: number, data: Partial<CashExpense>): Promise<void> {
  return await window.electron.ipcRenderer.invoke('cashExpense:update', { id, data })
}

export async function deleteCashExpense(id: number): Promise<void> {
  return await window.electron.ipcRenderer.invoke('cashExpense:delete', id)
}

export async function getTotalExpensesByReunion(reunionId: number): Promise<number> {
  return await window.electron.ipcRenderer.invoke('cashExpense:totalByReunion', reunionId)
}

export async function getTotalExpensesByCategory(reunionId: number): Promise<Record<string, number>> {
  return await window.electron.ipcRenderer.invoke('cashExpense:totalsByCategory', reunionId)
}
