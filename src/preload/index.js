import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('electronAPI', {
  folder: () => ipcRenderer.invoke('dialog:openFolder'),
  checkPathExists: (folderPath) => { return fs.existsSync(folderPath) },
  on: (cli) => { console.log(cli) },

  // Database APIs
  dropTable: () => ipcRenderer.invoke("dropTable"),
  setData: (...args) => ipcRenderer.invoke('setData', ...args),
  updateData: (...args) => ipcRenderer.invoke('updateData', ...args),
  getData: (table, column, value) => ipcRenderer.invoke('getData' , table, column, value),
  getAllData: (table) => ipcRenderer.invoke('getAllData', table),
  removeData: (column, value) => ipcRenderer.invoke('removeData', column, value)
});
