import {getData} from "../database/databaseHandler"
import {Notification} from 'electron'
import zipFolder from "../utils/zipFolder"

export default async function LocalBackup(gameId){
  const data = await getData('itemData', "id", gameId)
  const currentLocation = data.rows[0].path
  const gameName = data.rows[0].name

  let backupLocation = await getData('userSettings', "id", 1)
  backupLocation = backupLocation.rows[0].localBackupLocation

  zipFolder(currentLocation, backupLocation)
    .then(() => new Notification({title: "Backup Completed", body:""}).show())
    .catch((err) => new Notification({title: "An error occurred", body: err}).show())
}
