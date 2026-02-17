import { ipcMain, dialog } from 'electron'
import { loadConfig, saveConfig } from '../config'
import path from 'path'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', () => {
    return loadConfig()
  })

  ipcMain.handle('settings:select-db-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Selecione a pasta para salvar o banco de dados'
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })

  ipcMain.handle('settings:save-db-path', (_, folderPath: string) => {
    try {
      const config = loadConfig()
      config.dbPath = path.join(folderPath, 'database.sqlite')
      saveConfig(config)
      return { success: true }
    } catch (error) {
      console.error('Error saving config:', error)
      return { success: false, error: String(error) }
    }
  })
}
