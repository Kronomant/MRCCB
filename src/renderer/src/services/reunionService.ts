import { invoke } from '@tauri-apps/api/core'

// Service para CRUD de reuniões via Tauri command

export async function getAllReunions(filters?: { startDate?: string; endDate?: string; status?: string }): Promise<Reunion[]> {
  return await invoke<Reunion[]>('reunion_get_all', { filters: filters ?? null })
}

export async function getReunionById(id: number): Promise<Reunion | undefined> {
  return await invoke<Reunion | null>('reunion_get_by_id', { id }) ?? undefined
}

export async function createReunion(data: Omit<Reunion, 'id'>): Promise<Reunion> {
  return await invoke<Reunion>('reunion_create', { data })
}

export async function updateReunion(data: Reunion): Promise<Reunion> {
  return await invoke<Reunion>('reunion_update', { data })
}

export async function deleteReunion(id: number): Promise<{ success: boolean }> {
  await invoke<boolean>('reunion_delete', { id })
  return { success: true }
}
