// src/renderer/src/schemas/prontuarioSchema.ts
import { z } from 'zod'

export const prontuarioSchema = z.object({
  id: z.number().optional(),
  number: z.number({ message: 'Número do prontuário é obrigatório' }).int().positive(),
  unityId: z.number({ message: 'Unidade é obrigatória' }).int().positive(),
  ministry: z.boolean(),
  status: z.enum(['active', 'inactive'], { message: 'Status deve ser active ou inactive' }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const createProntuarioSchema = prontuarioSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})
export type CreateProntuario = z.infer<typeof createProntuarioSchema>

export const updateProntuarioSchema = prontuarioSchema.partial().required({ id: true })
export type UpdateProntuario = z.infer<typeof updateProntuarioSchema>

// Schema para validação de formulários (sem id)
export const prontuarioFormSchema = createProntuarioSchema
export type ProntuarioFormData = z.infer<typeof prontuarioFormSchema>