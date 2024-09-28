import {dialog, ipcMain} from "electron"
import {removeAllData, setData} from './database/databaseHandler'

async function handleFolderOpen() {
  const {canceled, filePaths} = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled){
    return filePaths[0]
  }
}


export async function ipcHandlers(){
  ipcMain.handle('dialog:openFolder', handleFolderOpen)
  ipcMain.handle('dropTable', removeAllData)

  ipcMain.handle('setData', async (event, ...args) => {
    try {
      return await setData(...args);
    } catch (error) {
      return error;
    }
  });

}
