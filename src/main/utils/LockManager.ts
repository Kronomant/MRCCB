import fs from 'fs'
import path from 'path'
import os from 'os'

interface LockData {
  hostname: string
  timestamp: string
  pid: number
}

export class LockManager {
  private lockPath: string
  private refreshInterval: NodeJS.Timeout | null = null

  constructor(dbPath: string) {
    const dir = path.dirname(dbPath)
    this.lockPath = path.join(dir, 'database.lock')
  }

  acquire(): { success: boolean; error?: string; lockedBy?: string; lockedAt?: string } {
    try {
      if (fs.existsSync(this.lockPath)) {
        const content = fs.readFileSync(this.lockPath, 'utf-8')
        try {
          const data = JSON.parse(content) as LockData
          // Check if it's stale (e.g., > 30 minutes)
          const lockTime = new Date(data.timestamp).getTime()
          const now = new Date().getTime()
          const diffMinutes = (now - lockTime) / 1000 / 60

          if (diffMinutes > 30) {
            // Stale lock, we can take over
            this.writeLock()
            return { success: true }
          }
          
          // If it's me (same hostname and pid), just update
          if (data.hostname === os.hostname() && data.pid === process.pid) {
             this.writeLock()
             return { success: true }
          }

          return { 
            success: false, 
            error: 'Database is locked', 
            lockedBy: data.hostname,
            lockedAt: new Date(data.timestamp).toLocaleString()
          }
        } catch (e) {
          // Invalid lock file, take over
          this.writeLock()
          return { success: true }
        }
      }

      this.writeLock()
      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  release(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
    try {
      if (fs.existsSync(this.lockPath)) {
        // Only delete if it's my lock
        const content = fs.readFileSync(this.lockPath, 'utf-8')
        const data = JSON.parse(content) as LockData
        if (data.hostname === os.hostname()) {
             fs.unlinkSync(this.lockPath)
        }
      }
    } catch (error) {
      console.error('Failed to release lock', error)
    }
  }

  private writeLock() {
    const data: LockData = {
      hostname: os.hostname(),
      timestamp: new Date().toISOString(),
      pid: process.pid
    }
    fs.writeFileSync(this.lockPath, JSON.stringify(data))
    
    // Start heartbeat
    if (this.refreshInterval) clearInterval(this.refreshInterval)
    this.refreshInterval = setInterval(() => {
      this.updateHeartbeat()
    }, 60 * 1000) // Every 1 minute
  }

  private updateHeartbeat() {
    try {
      if (fs.existsSync(this.lockPath)) {
        const content = fs.readFileSync(this.lockPath, 'utf-8')
        const data = JSON.parse(content) as LockData
        if (data.hostname === os.hostname()) {
          data.timestamp = new Date().toISOString()
          fs.writeFileSync(this.lockPath, JSON.stringify(data))
        }
      }
    } catch (e) {
      console.error('Failed to update heartbeat', e)
    }
  }
}
