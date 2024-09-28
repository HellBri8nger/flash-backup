import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('electronAPI', {
  folder: () => ipcRenderer.invoke('dialog:openFolder'),
  checkPathExists: (folderPath) => { return fs.existsSync(folderPath) },
  on: (cli) => { console.log(cli) },

  // Database APIs
  dropUsersTable: () => ipcRenderer.invoke("dropTable"),
  setData: (...args) => ipcRenderer.invoke('setData', ...args)
});
