// Service para CRUD de reuniões via IPC Electron

export async function getAllReunions(filters?: { startDate?: string; endDate?: string; status?: string }): Promise<Reunion[]> {
  return await window.electron.ipcRenderer.invoke('reunion:all', filters)
}

export async function getReunionById(id: number): Promise<Reunion | undefined> {
  return await window.electron.ipcRenderer.invoke('reunion:getById', id)
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
