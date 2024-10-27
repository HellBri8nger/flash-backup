import {app, dialog, ipcMain, shell} from "electron"
import {getAllData, getData, removeAllData, removeData, setData, updateData} from './database/databaseHandler'
import {authenticateDrive} from "./backup services/googleDrive";
import {callBackupService} from "./backupRequestReciever";

async function handleFolderOpen(isFile) {
  let properties = ['']

  if (isFile) properties = ['openFile']
  else properties = ['openDirectory']

  const {canceled, filePaths} = await dialog.showOpenDialog({ properties: properties })
  if (!canceled){
    return filePaths[0]
  }
}

function shellOpen(link){shell.openExternal(link)}


export async function ipcHandlers(){
  ipcMain.handle('dialog:openFolder', (event, isFile) => handleFolderOpen(isFile))
  ipcMain.handle('getAppData', async () => app.getPath('appData'));
  ipcMain.handle('manualBackup', async (event, id) => callBackupService(id))
  ipcMain.handle('shellOpen', async (event, link) => shellOpen(link))

  // Database APIs
  ipcMain.handle('dropTable', removeAllData)
  ipcMain.handle('setData', async (event, ...args) => {
      return await setData(...args)
  })
  ipcMain.handle('getData', async (event, table, column, value) => {
    return await getData(table, column, value)
  })
  ipcMain.handle('getAllData', async (event, table) => {
    return await getAllData(table)
  })
  ipcMain.handle('updateData', async (...args) => {
    return await updateData(...args)
  })
  ipcMain.handle('removeData', async (event, table, column, value) => {
    return await removeData(table, column, value)
  })

  // Google drive APIs
  ipcMain.handle('authenticateDrive', async (event, credentialsPath) => authenticateDrive(credentialsPath))
}
