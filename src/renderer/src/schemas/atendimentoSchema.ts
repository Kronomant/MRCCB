// src/renderer/src/schemas/atendimentoSchema.ts
import { z } from 'zod'

export const atendimentoSchema = z.object({
  id: z.number().optional(),
  prontuarioId: z.number({ message: 'Prontuário é obrigatório' }).int().positive(),
  prontuarioNumber: z.number({ message: 'Número do prontuário é obrigatório' }).int().positive(),
  reunionId: z.number({ message: 'Reunião é obrigatória' }).int().positive(),
  date: z
    .string({ message: 'Data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  aprovedValue: z.boolean().default(false),
  value: z.number({ message: 'Valor deve ser um número' }).min(0, 'Valor deve ser maior ou igual a zero'),
  foodBasketQuantity: z.number({ message: 'Quantidade de cestas deve ser um número' }).int().min(0, 'Quantidade deve ser maior ou igual a zero'),
  onlyClothes: z.boolean().default(false),
  emergency: z.boolean().default(false),
  returned: z.boolean().default(false),
  repeat: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const createAtendimentoSchema = atendimentoSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})
export type CreateAtendimento = z.infer<typeof createAtendimentoSchema>

export const updateAtendimentoSchema = atendimentoSchema.partial().required({ id: true })
export type UpdateAtendimento = z.infer<typeof updateAtendimentoSchema>

// Schema para validação de formulários (sem id)
export const atendimentoFormSchema = createAtendimentoSchema
export type AtendimentoFormData = z.infer<typeof atendimentoFormSchema>