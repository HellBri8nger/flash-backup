import {dialog, ipcMain} from "electron"
import {getAllData, getData, removeAllData, removeData, setData, updateData} from './database/databaseHandler'

async function handleFolderOpen() {
  const {canceled, filePaths} = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled){
    return filePaths[0]
  }
}


export async function ipcHandlers(){
  ipcMain.handle('dialog:openFolder', handleFolderOpen)

  // Database APIs
  ipcMain.handle('dropTable', removeAllData)
  ipcMain.handle('setData', async (event, ...args) => {
      return await setData(...args)
  })
  ipcMain.handle('getData', async (event, column, value) => {
    return await getData(column, value)
  })
  ipcMain.handle('getAllData', async (event, table) => {
    return await getAllData(table)
  })
  ipcMain.handle('updateData', async (...args) => {
    return await updateData(...args)
  })
  ipcMain.handle('removeData', async (event, column, value) => {
    return await removeData(column, value)
  })
}
