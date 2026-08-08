// src/renderer/src/services/atendimentoService.ts
import { invoke } from '@tauri-apps/api/core'
import { CreateAtendimento, UpdateAtendimento } from '../schemas/atendimentoSchema'

export async function getAllAtendimentos(): Promise<Atendimento[]> {
  return await invoke<Atendimento[]>('atendimento_get_all')
}

export async function getAtendimentosByReunion(reunionId: number): Promise<Atendimento[]> {
  return await invoke<Atendimento[]>('atendimento_get_by_reunion', { reunionId })
}

export async function getAtendimentosByProntuario(prontuarioId: number): Promise<Atendimento[]> {
  return await invoke<Atendimento[]>('atendimento_get_by_prontuario', { prontuarioId })
}

export async function getAtendimentoById(id: number): Promise<Atendimento | undefined> {
  return await invoke<Atendimento | null>('atendimento_get_by_id', { id }) ?? undefined
}

export async function createAtendimento(data: CreateAtendimento): Promise<Atendimento> {
  return await invoke<Atendimento>('atendimento_create', { data })
}

export async function updateAtendimento(data: UpdateAtendimento): Promise<Atendimento> {
  return await invoke<Atendimento>('atendimento_update', { data })
}

export async function deleteAtendimento(id: number): Promise<boolean> {
  return await invoke<boolean>('atendimento_delete', { id })
}

export async function toggleAtendimentoDelivery(id: number, devolvido: boolean): Promise<void> {
  await invoke('atendimento_toggle_delivery', { id, devolvido })
}
