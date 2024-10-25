import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { ipcHandlers } from './ipcHandlers'
import { createDatabase } from './database/databaseHandler'
import {checkPythonInstallation, allowCloseGetter} from "./checkPython";
import './backupRequestReciever'
import { receiver } from "./backupRequestReciever";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
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
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}


app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  if (process.platform === "win32"){
    checkPythonInstallation(join(app.getPath('appData'), 'flash-backup'))
  }
  createDatabase(join(app.getPath('appData'), 'flash-backup', 'database.db'))
  ipcHandlers()
  receiver()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on('window-all-closed', (e) => {
  function preventDefault() {
    if (!allowCloseGetter()) {
      e.preventDefault()
    } else {
      app.quit()
    }
  }

  setInterval(preventDefault, 500)

  if (process.platform !== 'darwin') {
    preventDefault()
  }
})

ipcMain.on('error', (event, error) => {
  console.error('IPC Error:', error);
});

