import { app, shell, BrowserWindow, ipcMain, Tray, Menu} from 'electron'
import { join } from 'path'
import icon from "../../sql.ico?asset"
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { ipcHandlers } from './ipcHandlers'
import { createDatabase } from './database/databaseHandler'
import {checkPythonInstallation, allowCloseGetter} from "./checkPython"
import './backupRequestReciever'
import { receiver } from "./backupRequestReciever"

let activeWindows = 0
let isExiting = false

function getWindow(){
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon: icon,
    autoHideMenuBar: true,
    webPreferences: {preload: join(__dirname, '../preload/index.js'), sandbox: false},
  })

  mainWindow.webContents.session.clearCache().then()
  return mainWindow
}

function getMainWindow(){
  const mainWindow = getWindow()

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).then()
    return {action: 'deny'}
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')).then()
  }

  return mainWindow
}

function getAlternateWindow(){
  const alternateWindow = getWindow()
  alternateWindow.loadFile('./src/renderer/alternateWindow.html').then()

  return alternateWindow
}

app.whenReady().then(() => {
  let mainWindow
  let alternateWindow
  electronApp.setAppUserModelId('Flash Backup')

  if (process.platform === "win32") checkPythonInstallation(join(app.getPath('appData'), 'flash-backup'))
  createDatabase(join(app.getPath('appData'), 'flash-backup', 'database.db'))
  ipcHandlers().then()
  receiver()

  app.on('browser-window-created', (_, window) => {
    activeWindows++
    optimizer.watchWindowShortcuts(window)

    if(activeWindows === 1){
      alternateWindow = getAlternateWindow()
      alternateWindow.hide()
      activeWindows--
    }

    window.setIcon(icon)

    window.on('close', (event) => {
      if (isExiting) {
        app.quit()
      } else {
        event.preventDefault()
        window.destroy()
      }
    })

    if (activeWindows === 1){
      const tray = new  Tray(icon)
      const contextMenu = Menu.buildFromTemplate([
        {label: 'Show', click: () => {
            mainWindow = getMainWindow()
            mainWindow.show()
          }},
        {label: 'Exit', click: () => {
            function preventDefault(){
              if (allowCloseGetter()) {
                isExiting = true
                app.quit()
              }
            }
            preventDefault()
            setInterval(preventDefault, 500)
          }
        }
      ])

      tray.setToolTip('Flash Backup')
      tray.setContextMenu(contextMenu)
    }
  })

  mainWindow = getMainWindow()
  mainWindow.on('ready-to-show', () => mainWindow.show())

})

ipcMain.on('error', (event, error) => {
  console.error('IPC Error:', error);
})
