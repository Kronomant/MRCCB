// src/renderer/src/services/unityService.ts
import { CreateUnity, UpdateUnity } from '../schemas/unitySchema'

export async function getAllUnities(): Promise<Unity[]> {
  return await window.electron.ipcRenderer.invoke('unity:all')
}

export async function getUnityById(id: number): Promise<Unity | undefined> {
  return await window.electron.ipcRenderer.invoke('unity:getById', id)
}

export async function createUnity(data: CreateUnity): Promise<Unity> {
  return await window.electron.ipcRenderer.invoke('unity:create', data)
}

export async function updateUnity(data: UpdateUnity): Promise<Unity> {
  return await window.electron.ipcRenderer.invoke('unity:update', data)
}

export async function deleteUnity(id: number): Promise<{ success: boolean }> {
  return await window.electron.ipcRenderer.invoke('unity:delete', id)
}