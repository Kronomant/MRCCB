// src/renderer/src/services/atendimentoService.ts
import { CreateAtendimento, UpdateAtendimento } from '../schemas/atendimentoSchema'

export async function getAllAtendimentos(): Promise<Atendimento[]> {
  return await window.electron.ipcRenderer.invoke('atendimento:getAll')
}

export async function getAtendimentosByReunion(reunionId: number): Promise<Atendimento[]> {
  return await window.electron.ipcRenderer.invoke('atendimento:getByReunionId', reunionId)
}

export async function getAtendimentosByProntuario(prontuarioId: number): Promise<Atendimento[]> {
  return await window.electron.ipcRenderer.invoke('atendimento:getByProntuarioId', prontuarioId)
}

export async function getAtendimentoById(id: number): Promise<Atendimento | undefined> {
  return await window.electron.ipcRenderer.invoke('atendimento:getById', id)
}

export async function createAtendimento(data: CreateAtendimento): Promise<Atendimento> {
  return await window.electron.ipcRenderer.invoke('atendimento:create', data)
}

export async function updateAtendimento(data: UpdateAtendimento): Promise<Atendimento> {
  return await window.electron.ipcRenderer.invoke('atendimento:update', data)
}

export async function deleteAtendimento(id: number): Promise<boolean> {
  return await window.electron.ipcRenderer.invoke('atendimento:delete', id)
}