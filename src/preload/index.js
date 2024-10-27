import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('electronAPI', {
  folder: (isFile) => ipcRenderer.invoke('dialog:openFolder', isFile),
  checkPathExists: (folderPath) => { return fs.existsSync(folderPath) },
  on: (cli) => { console.log(cli) },
  getAppData: async () => await ipcRenderer.invoke('getAppData'),
  manualBackup: (id) => ipcRenderer.invoke('manualBackup', id),
  shellOpen: (link) => ipcRenderer.invoke('shellOpen', link),

  // Database APIs
  dropTable: () => ipcRenderer.invoke("dropTable"),
  setData: (...args) => ipcRenderer.invoke('setData', ...args),
  updateData: (...args) => ipcRenderer.invoke('updateData', ...args),
  getData: (table, column, value) => ipcRenderer.invoke('getData' , table, column, value),
  getAllData: (table) => ipcRenderer.invoke('getAllData', table),
  removeData: (table, column, value) => ipcRenderer.invoke('removeData', table, column, value),

  // Google drive APIs
  authenticateDrive: (credentialsPath) => ipcRenderer.invoke('authenticateDrive', credentialsPath)
})
