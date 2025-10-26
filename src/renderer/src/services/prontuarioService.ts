// src/renderer/src/services/prontuarioService.ts
import { CreateProntuario, UpdateProntuario } from '../schemas/prontuarioSchema'

export async function getAllProntuarios(): Promise<Prontuario[]> {
  return await window.electron.ipcRenderer.invoke('prontuario:getAll')
}

export async function getProntuarioById(id: number): Promise<Prontuario | undefined> {
  return await window.electron.ipcRenderer.invoke('prontuario:getById', id)
}

export async function getProntuarioByNumber(number: number): Promise<Prontuario | undefined> {
  return await window.electron.ipcRenderer.invoke('prontuario:getByNumber', number)
}

export async function getProntuariosByUnity(unityId: number): Promise<Prontuario[]> {
  return await window.electron.ipcRenderer.invoke('prontuario:getByUnity', unityId)
}

export async function getActiveProntuarios(): Promise<Prontuario[]> {
  return await window.electron.ipcRenderer.invoke('prontuario:getActive')
}

export async function createProntuario(data: CreateProntuario): Promise<Prontuario> {
  return await window.electron.ipcRenderer.invoke('prontuario:create', data)
}

export async function updateProntuario(data: UpdateProntuario): Promise<Prontuario> {
  return await window.electron.ipcRenderer.invoke('prontuario:update', data)
}

export async function deleteProntuario(id: number): Promise<boolean> {
  return await window.electron.ipcRenderer.invoke('prontuario:delete', id)
}