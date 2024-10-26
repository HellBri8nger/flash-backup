import { getData } from "../database/databaseHandler"
import zipFolder from "../utils/zipFolder"
import {join} from "path";
import fs from "fs";
import showNotification from "../utils/showNotification";

export default async function LocalBackup(gameId){
  const data = await getData('itemData', "id", gameId)
  const currentLocation = data.rows[0].path
  const gameName = data.rows[0].name

  let backupLocation = await getData('userSettings', "id", 1)
  backupLocation = join(backupLocation.rows[0].localBackupLocation, `${gameId}.${gameName}`)

  try {
    if (!fs.existsSync(backupLocation)) fs.mkdirSync(backupLocation)

    zipFolder(currentLocation, backupLocation)
      .then(() => showNotification("Backup Completed", ""))
      .catch((err) => showNotification("An error occurred", err))

  } catch (err) {
    if (err.errno === -4058) {
      showNotification("Invalid Backup Location", "Please go into settings and choose a valid location")
    }
  }
}
