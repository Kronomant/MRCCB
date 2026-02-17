import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const CONFIG_FILE_NAME = 'settings.json'

export interface AppConfig {
  dbPath: string
}

export function getConfigPath(): string {
  return path.join(app.getPath('userData'), CONFIG_FILE_NAME)
}

export function loadConfig(): AppConfig {
  const configPath = getConfigPath()
  if (fs.existsSync(configPath)) {
    try {
      const data = fs.readFileSync(configPath, 'utf-8')
      const config = JSON.parse(data)
      // Validate config has dbPath
      if (config.dbPath) {
        return config
      }
    } catch (error) {
      console.error('Error loading config:', error)
    }
  }
  
  // Default config: use database.sqlite in the current working directory
  return {
    dbPath: path.join(process.cwd(), 'database.sqlite')
  }
}

export function saveConfig(config: AppConfig): void {
  const configPath = getConfigPath()
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}
