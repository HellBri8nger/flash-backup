import {ipcMain, dialog} from "electron"
import Store from 'electron-store'

export const openDialog = () => {
  async function handleFolderOpen() {
    const {canceled, filePaths} = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (!canceled){
      return filePaths[0]
    }
  }

  ipcMain.handle('dialog:openFolder', handleFolderOpen)
}

export const electronStoreHandlers = () => {
  const store = new Store();

  ipcMain.handle('store:getAll', () => {
    return store.store
  })

  ipcMain.handle('store:get', (event, key) => {
    return store.get(key);
  });

  ipcMain.handle('store:set', (event, key, value) => {
    store.set(key, value);
  });

  ipcMain.handle('store:delete', (event, key) => {
    store.delete(key);
  });

  ipcMain.handle('store:clear', () => {
    store.clear();
  });

}
