// src/renderer/src/schemas/unitySchema.ts
import { z } from 'zod'

export const unitySchema = z.object({
  id: z.number().optional(),
  name: z.string({ message: 'Nome da unidade é obrigatório' }).min(1, { message: 'Nome não pode ser vazio' }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const createUnitySchema = unitySchema.omit({ id: true, createdAt: true, updatedAt: true })
export type CreateUnity = z.infer<typeof createUnitySchema>

export const updateUnitySchema = unitySchema.partial().required({ id: true })
export type UpdateUnity = z.infer<typeof updateUnitySchema>

// Schema para formulários (sem id/timestamps)
export const unityFormSchema = createUnitySchema
export type UnityFormData = z.infer<typeof unityFormSchema>