// src/renderer/src/schemas/treatmentSchema.ts
import { z } from 'zod'

export const treatmentSchema = z.object({
  id: z.number().optional(),
  enchiridionId: z.number({ message: 'Enchiridion é obrigatório' }).int().positive(),
  reunionId: z.number({ message: 'Reunião é obrigatória' }).int().positive(),
  unityId: z.number({ message: 'Unidade é obrigatória' }).int().positive(),
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

export const createTreatmentSchema = treatmentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})
export type CreateTreatment = z.infer<typeof createTreatmentSchema>

export const updateTreatmentSchema = treatmentSchema.partial().required({ id: true })
export type UpdateTreatment = z.infer<typeof updateTreatmentSchema>

// Schema para validação de formulários (sem id)
export const treatmentFormSchema = createTreatmentSchema
export type TreatmentFormData = z.infer<typeof treatmentFormSchema>