// src/renderer/src/services/treatmentService.ts
import { CreateTreatment, UpdateTreatment } from '../schemas/treatmentSchema'

export async function getTreatmentsByReunion(reunionId: number): Promise<Treatment[]> {
  return await window.electron.ipcRenderer.invoke('treatment:byReunion', reunionId)
}

export async function getTreatmentById(id: number): Promise<Treatment | undefined> {
  return await window.electron.ipcRenderer.invoke('treatment:getById', id)
}

export async function createTreatment(data: CreateTreatment): Promise<Treatment> {
  return await window.electron.ipcRenderer.invoke('treatment:create', data)
}

export async function updateTreatment(data: UpdateTreatment): Promise<Treatment> {
  return await window.electron.ipcRenderer.invoke('treatment:update', data)
}

export async function deleteTreatment(id: number): Promise<boolean> {
  return await window.electron.ipcRenderer.invoke('treatment:delete', id)
}