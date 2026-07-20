// src/renderer/src/services/treatmentService.ts
import { invoke } from '@tauri-apps/api/core'
import { CreateTreatment, UpdateTreatment } from '../schemas/treatmentSchema'

// Importar o tipo Treatment do global.d.ts
type Treatment = globalThis.Treatment

export async function getAllTreatments(): Promise<Treatment[]> {
  return await invoke<Treatment[]>('treatment_get_all')
}

export async function getTreatmentsByReunion(reunionId: number): Promise<Treatment[]> {
  return await invoke<Treatment[]>('treatment_get_by_reunion', { reunionId })
}

export async function getTreatmentById(id: number): Promise<Treatment | undefined> {
  return await invoke<Treatment | null>('treatment_get_by_id', { id }) ?? undefined
}

export async function createTreatment(data: CreateTreatment): Promise<Treatment> {
  return await invoke<Treatment>('treatment_create', { data })
}

export async function updateTreatment(data: UpdateTreatment): Promise<Treatment> {
  return await invoke<Treatment>('treatment_update', { data })
}

export async function deleteTreatment(id: number): Promise<boolean> {
  return await invoke<boolean>('treatment_delete', { id })
}
