import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('electronAPI', {
  folder: () => ipcRenderer.invoke('dialog:openFolder'),
  checkPathExists: (folderPath) => { return fs.existsSync(folderPath) },
  on: (cli) => { console.log(cli) },

  // Database APIs
  dropUsersTable: () => ipcRenderer.invoke("dropTable"),
  setData: (...args) => ipcRenderer.invoke('setData', ...args),
  updateData: (...args) => ipcRenderer.invoke('updateData', ...args),
  getData: (column, value) => ipcRenderer.invoke('getData', column, value),
  getAllData: (table) => ipcRenderer.invoke('getAllData', table),
  removeData: (column, value) => ipcRenderer.invoke('removeData', column, value)
});
