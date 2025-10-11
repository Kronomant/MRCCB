// src/renderer/src/schemas/treatmentSchema.ts
import { z } from 'zod'

export const treatmentSchema = z.object({
  id: z.number().optional(),
  enchiridionId: z.number({ message: 'Prontuário (Enchiridion) é obrigatório' }).int(),
  reunionId: z.number({ message: 'Reunião é obrigatória' }).int(),
  unityId: z.number({ message: 'Unidade é obrigatória' }).int(),
  date: z
    .string({ message: 'Data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  aprovedValue: z.boolean(),
  value: z.number().min(0),
  foodBasketQuantity: z.number().int().min(0),
  onlyClothes: z.boolean(),
  emergency: z.boolean(),
  returned: z.boolean(),
  repeat: z.boolean()
})

export const createTreatmentSchema = treatmentSchema.omit({ id: true })
export type CreateTreatment = z.infer<typeof createTreatmentSchema>

export const updateTreatmentSchema = treatmentSchema.required({ id: true })
export type UpdateTreatment = z.infer<typeof updateTreatmentSchema>