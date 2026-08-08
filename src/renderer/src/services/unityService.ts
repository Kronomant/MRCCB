// src/renderer/src/services/unityService.ts
import { invoke } from '@tauri-apps/api/core'
import { CreateUnity, UpdateUnity } from '../schemas/unitySchema'

export async function getAllUnities(): Promise<Unity[]> {
  return await invoke<Unity[]>('unity_get_all')
}

export async function getUnityById(id: number): Promise<Unity | undefined> {
  return await invoke<Unity | null>('unity_get_by_id', { id }) ?? undefined
}

export async function createUnity(data: CreateUnity): Promise<Unity> {
  return await invoke<Unity>('unity_create', { data })
}

export async function createUnitiesBulk(names: string[]): Promise<Unity[]> {
  return await invoke<Unity[]>('unity_create_bulk', { names })
}

export async function updateUnity(data: UpdateUnity): Promise<Unity> {
  return await invoke<Unity>('unity_update', { data })
}

export async function deleteUnity(id: number): Promise<{ success: boolean }> {
  await invoke<boolean>('unity_delete', { id })
  return { success: true }
}
