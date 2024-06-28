import { contextBridge, ipcRenderer } from 'electron'
import fs from 'fs'

contextBridge.exposeInMainWorld('electronAPI', {
  folder: () => ipcRenderer.invoke('dialog:openFolder'),
  checkPathExists: (folderPath) => { return fs.existsSync(folderPath) }
})
