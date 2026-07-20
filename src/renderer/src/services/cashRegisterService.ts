import { invoke } from '@tauri-apps/api/core'

// ── Cash Register ────────────────────────────────────────────────────────────

export async function createCashRegister(data: CreateCashRegister): Promise<CashRegister> {
  return await invoke<CashRegister>('cash_register_create', {
    args: {
      reunionId: data.reunionId,
      openingValue: data.openingValue,
      availableValue: data.availableValue,
      openingCounts: data.openingCounts ?? null
    }
  })
}

export async function getCashRegisterByReunion(reunionId: number): Promise<CashRegister | undefined> {
  return await invoke<CashRegister | null>('cash_register_get_by_reunion', { reunionId }) ?? undefined
}

export async function getCashRegisterById(id: number): Promise<CashRegister | undefined> {
  return await invoke<CashRegister | null>('cash_register_get_by_id', { id }) ?? undefined
}

export async function updateCashRegisterOpening(
  id: number,
  data: { openingValue: number; availableValue: number; openingCounts?: DenominationCounts | null }
): Promise<void> {
  await invoke('cash_register_update_opening', { args: { id, data } })
}

export async function closeCashRegister(
  id: number,
  closingValue: number,
  difference: number,
  closingCounts?: DenominationCounts | null
): Promise<void> {
  await invoke('cash_register_close', { args: { id, closingValue, difference, closingCounts: closingCounts ?? null } })
}

export async function reopenCashRegister(id: number): Promise<void> {
  await invoke('cash_register_reopen', { id })
}

// ── Cash Ticket ──────────────────────────────────────────────────────────────

export async function createCashTicket(data: CreateCashTicket): Promise<CashTicket> {
  return await invoke<CashTicket>('cash_ticket_create', { data })
}

export async function getTicketsByReunion(reunionId: number): Promise<CashTicket[]> {
  return await invoke<CashTicket[]>('cash_ticket_list_by_reunion', { reunionId })
}

export async function updateCashTicket(
  id: number,
  data: { volunteerName?: string | null; value?: number; notes?: string | null }
): Promise<void> {
  await invoke('cash_ticket_update', { args: { id, data } })
}

export async function deleteCashTicket(id: number): Promise<void> {
  await invoke('cash_ticket_delete', { id })
}

export async function getTotalTicketsByReunion(reunionId: number): Promise<number> {
  return await invoke<number>('cash_ticket_total_by_reunion', { reunionId })
}

// ── Cash Expense ─────────────────────────────────────────────────────────────

export async function createCashExpense(data: CreateCashExpense): Promise<CashExpense> {
  return await invoke<CashExpense>('cash_expense_create', { data })
}

export async function getExpensesByReunion(reunionId: number): Promise<CashExpense[]> {
  return await invoke<CashExpense[]>('cash_expense_list_by_reunion', { reunionId })
}

export async function updateCashExpense(
  id: number,
  data: { establishmentName?: string; nfeNumber?: string | null; category?: string; value?: number; notes?: string | null }
): Promise<void> {
  await invoke('cash_expense_update', { args: { id, data } })
}

export async function deleteCashExpense(id: number): Promise<void> {
  await invoke('cash_expense_delete', { id })
}

export async function getTotalExpensesByReunion(reunionId: number): Promise<number> {
  return await invoke<number>('cash_expense_total_by_reunion', { reunionId })
}

export async function getTotalExpensesByCategory(reunionId: number): Promise<Record<string, number>> {
  return await invoke<Record<string, number>>('cash_expense_totals_by_category', { reunionId })
}
