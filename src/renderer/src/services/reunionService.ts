// Service para CRUD de reuniões via IPC Electron

export interface Reunion {
  id?: number
  name: string
  value: number
  treatmentQuantity: number
  foodBasketQuantity: number
  date: string
  status: string
}

export async function getAllReunions(): Promise<Reunion[]> {
  return await window.electron.ipcRenderer.invoke('reunion:all')
}

export async function createReunion(data: Omit<Reunion, 'id'>): Promise<Reunion> {
  return await window.electron.ipcRenderer.invoke('reunion:create', data)
}

export async function updateReunion(data: Reunion): Promise<Reunion> {
  return await window.electron.ipcRenderer.invoke('reunion:update', data)
}

export async function deleteReunion(id: number): Promise<{ success: boolean }> {
  return await window.electron.ipcRenderer.invoke('reunion:delete', id)
}
