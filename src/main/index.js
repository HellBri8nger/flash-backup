import { app, shell, BrowserWindow, ipcMain, Tray, Menu} from 'electron';
import { join } from 'path';
import icon from "../../sql.ico?asset"
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { ipcHandlers } from './ipcHandlers'
import { createDatabase } from './database/databaseHandler'
import {checkPythonInstallation, allowCloseGetter} from "./checkPython";
import './backupRequestReciever'
import { receiver } from "./backupRequestReciever";

let isExiting = false

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon: icon,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {

    shell.openExternal(details.url);
    return { action: 'deny' };
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', click: () => mainWindow.show()},
    {
      label: 'Exit',
      click: () => {
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


app.whenReady().then(() => {
  electronApp.setAppUserModelId('Flash Backup');

  if (process.platform === "win32"){
    checkPythonInstallation(join(app.getPath('appData'), 'flash-backup'))
  }
  createDatabase(join(app.getPath('appData'), 'flash-backup', 'database.db'))
  ipcHandlers()
  receiver()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

    window.setIcon(icon)

    window.on('close', (event) => {
      if (isExiting) {
        app.quit();
      } else {
        event.preventDefault()
        window.hide()
      }
    })
  })

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on('error', (event, error) => {
  console.error('IPC Error:', error);
});

