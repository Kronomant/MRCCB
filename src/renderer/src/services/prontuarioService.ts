// src/renderer/src/services/prontuarioService.ts
import { invoke } from '@tauri-apps/api/core'
import { CreateProntuario, UpdateProntuario } from '../schemas/prontuarioSchema'

export async function getAllProntuarios(): Promise<Prontuario[]> {
  return await invoke<Prontuario[]>('prontuario_get_all')
}

export async function getProntuarioById(id: number): Promise<Prontuario | undefined> {
  return await invoke<Prontuario | null>('prontuario_get_by_id', { id }) ?? undefined
}

export async function getProntuarioByNumber(number: number): Promise<Prontuario | undefined> {
  return await invoke<Prontuario | null>('prontuario_get_by_number', { number }) ?? undefined
}

export async function getProntuariosByIds(ids: number[]): Promise<Prontuario[]> {
  return await invoke<Prontuario[]>('prontuario_get_by_ids', { ids })
}

export async function getProntuariosByUnity(unityId: number): Promise<Prontuario[]> {
  return await invoke<Prontuario[]>('prontuario_get_by_unity', { unityId })
}

export async function getActiveProntuarios(): Promise<Prontuario[]> {
  return await invoke<Prontuario[]>('prontuario_get_active')
}

export async function createProntuario(data: CreateProntuario): Promise<Prontuario> {
  return await invoke<Prontuario>('prontuario_create', { data })
}

export async function updateProntuario(data: UpdateProntuario): Promise<Prontuario> {
  return await invoke<Prontuario>('prontuario_update', { data })
}

export async function deleteProntuario(id: number): Promise<boolean> {
  return await invoke<boolean>('prontuario_delete', { id })
}