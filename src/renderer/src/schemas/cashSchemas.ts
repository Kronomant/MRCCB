import { z } from 'zod'

export const cashRegisterSchema = z.object({
  id: z.number(),
  reunionId: z.number(),
  openingValue: z.number().min(0, 'Valor deve ser positivo'),
  availableValue: z.number().min(0, 'Valor deve ser positivo'),
  openingCounts: z.record(z.number(), z.number()).nullable().default(null),
  closingValue: z.number().nullable(),
  closingDifference: z.number().nullable(),
  closingCounts: z.record(z.number(), z.number()).nullable().default(null),
  status: z.enum(['open', 'closed']),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const createCashRegisterSchema = cashRegisterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  closingValue: true,
  closingDifference: true,
  closingCounts: true,
  status: true
})

export const updateOpeningSchema = z.object({
  openingValue: z.number().min(0, 'Valor deve ser positivo'),
  availableValue: z.number().min(0, 'Valor deve ser positivo'),
  openingCounts: z.record(z.number(), z.number()).nullable().default(null)
})

export const closeCashRegisterSchema = z.object({
  closingValue: z.number(),
  difference: z.number(),
  closingCounts: z.record(z.number(), z.number()).nullable().default(null)
})

// Tickets
export const cashTicketSchema = z.object({
  id: z.number(),
  cashRegisterId: z.number(),
  reunionId: z.number(),
  volunteerName: z.string().nullable().optional(), // Opcional conforme pedido
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  notes: z.string().nullable().optional(),
  createdAt: z.string()
})

export const createCashTicketSchema = cashTicketSchema.omit({
  id: true,
  createdAt: true
})

// Expenses
export const cashExpenseSchema = z.object({
  id: z.number(),
  cashRegisterId: z.number(),
  reunionId: z.number(),
  establishmentName: z.string().min(1, 'Nome do estabelecimento é obrigatório'),
  nfeNumber: z.string().nullable().optional(),
  category: z.enum(['fuel', 'food', 'small_goods', 'maintenance']),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  notes: z.string().nullable().optional(),
  createdAt: z.string()
})

export const createCashExpenseSchema = cashExpenseSchema.omit({
  id: true,
  createdAt: true
})

export type CreateCashRegisterSchema = z.infer<typeof createCashRegisterSchema>
export type UpdateOpeningSchema = z.infer<typeof updateOpeningSchema>
export type CloseCashRegisterSchema = z.infer<typeof closeCashRegisterSchema>
export type CreateCashTicketSchema = z.infer<typeof createCashTicketSchema>
export type CreateCashExpenseSchema = z.infer<typeof createCashExpenseSchema>
