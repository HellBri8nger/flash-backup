import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  folder: () => ipcRenderer.invoke('dialog:openFolder')
})
