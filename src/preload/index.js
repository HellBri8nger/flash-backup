import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('electronAPI', {
  folder: () => ipcRenderer.invoke('dialog:openFolder'),
  checkPathExists: (folderPath) => { return fs.existsSync(folderPath) },

  getStoreValue: async (key) => { return await ipcRenderer.invoke('store:get', key) },
  setStoreValue: async (key, value) => await ipcRenderer.invoke('store:set', key, value),
  deleteStoreValue: async (key) =>  await ipcRenderer.invoke('store:delete', key),
  clearStore: async () => await ipcRenderer.invoke('store:clear'),
  getStore: async () => { return await ipcRenderer.invoke('store:getAll') }
});
