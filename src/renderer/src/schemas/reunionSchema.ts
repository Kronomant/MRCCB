import { z } from 'zod'
import { ReunionStatus } from '../types/reunion-status'

// Schema base que corresponde ao tipo Reunion global
export const reunionSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ message: 'Nome da reunião é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  date: z
    .string({ message: 'Data é obrigatória' })
    .min(1, 'Data é obrigatória')
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Data deve estar no formato YYYY-MM-DD'
    ),
  value: z
    .number({ message: 'Valor deve ser um número' })
    .min(0, 'Valor deve ser maior ou igual a zero')
    .max(999999.99, 'Valor deve ser menor que R$ 999.999,99'),
  treatmentQuantity: z
    .number({ message: 'Quantidade de atendimentos deve ser um número' })
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade deve ser maior ou igual a zero')
    .max(1000, 'Quantidade deve ser menor que 1000'),
  foodBasketQuantity: z
    .number({ message: 'Quantidade de cestas deve ser um número' })
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade deve ser maior ou igual a zero')
    .max(1000, 'Quantidade deve ser menor que 1000'),
  status: z.nativeEnum(ReunionStatus, {
    message: 'Status é obrigatório'
  })
})

// Schema para criação (sem ID) - usa o tipo Reunion global
export const createReunionSchema = reunionSchema.omit({ id: true })
export type CreateReunion = z.infer<typeof createReunionSchema>

// Schema para atualização (ID obrigatório) - usa o tipo Reunion global  
export const updateReunionSchema = reunionSchema.required({ id: true })
export type UpdateReunion = z.infer<typeof updateReunionSchema>

// Schema para formulários (ID opcional) - compatível com o tipo Reunion global
export const reunionFormSchema = reunionSchema
export type ReunionForm = z.infer<typeof reunionFormSchema>

// Tipo para formulários que estende Reunion mas com id opcional
export type ReunionFormData = Omit<Reunion, 'id'> & { id?: number }