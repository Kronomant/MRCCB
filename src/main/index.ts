import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import Database from 'better-sqlite3'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 1300,
    minHeight: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.on('context-menu', (_, params) => {
    mainWindow.webContents.inspectElement(params.x, params.y)
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Inicialização do banco SQLite
const db = new Database('database.sqlite')
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS reunions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value REAL,
    treatmentQuantity INTEGER,
    foodBasketQuantity INTEGER,
    date TEXT,
    status TEXT
  )
`)

// CRUD de reuniões via IPC

// CREATE
ipcMain.handle('reunion:create', (event, data) => {
  const stmt = db.prepare(
    `INSERT INTO reunions (name, value, treatmentQuantity, foodBasketQuantity, date, status) VALUES (?, ?, ?, ?, ?, ?)`
  )
  const result = stmt.run(
    data.name,
    data.value,
    data.treatmentQuantity,
    data.foodBasketQuantity,
    data.date,
    data.status
  )
  return { id: result.lastInsertRowid, ...data }
})

// READ ALL
ipcMain.handle('reunion:all', () => {
  const stmt = db.prepare('SELECT * FROM reunions')
  return stmt.all()
})

// UPDATE
ipcMain.handle('reunion:update', (event, data) => {
  const stmt = db.prepare(
    `UPDATE reunions SET name = ?, value = ?, treatmentQuantity = ?, foodBasketQuantity = ?, date = ?, status = ? WHERE id = ?`
  )
  stmt.run(
    data.name,
    data.value,
    data.treatmentQuantity,
    data.foodBasketQuantity,
    data.date,
    data.status,
    data.id
  )
  return { ...data }
})

// DELETE
ipcMain.handle('reunion:delete', (event, id) => {
  const stmt = db.prepare('DELETE FROM reunions WHERE id = ?')
  stmt.run(id)
  return { success: true }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
