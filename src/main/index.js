import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import express from 'express';
import bodyParser from 'body-parser';
import icon from '../../resources/icon.png?asset';


const expressApp = express();
const PORT = process.env.PORT || 3000; 

expressApp.use(bodyParser.json());


expressApp.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


expressApp.post('/cli-arguments', (req, res) => {
  const { id } = req.body;
  console.log(`Received game ID: ${id}`);
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(win => {
    win.webContents.send('cli-arguments', { id });
  });
  res.sendStatus(200);
});


expressApp.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});


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


async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (!canceled) {
    return filePaths[0];
  }
}


app.whenReady().then(() => {
  ipcMain.handle('dialog:openFolder', handleFolderOpen);
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.on('error', (event, error) => {
  console.error('IPC Error:', error);
});
