import {ipcMain, dialog} from "electron"
import { removeAllData } from './database/databaseHandler'

async function handleFolderOpen() {
  const {canceled, filePaths} = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled){
    return filePaths[0]
  }
}


export async function ipcHandlers(){
  ipcMain.handle('dialog:openFolder', handleFolderOpen)
  ipcMain.handle('dropTable', removeAllData)
}
