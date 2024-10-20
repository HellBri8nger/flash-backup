import express from 'express'
import { getData } from "./database/databaseHandler"
import { Notification } from "electron";
import LocalBackup from "./backup services/local";

const app = express()
const port = 14004

export default function receiver(){
  app.use(express.urlencoded({extended: true}))

  app.post('/',async(req, res) => {
    const id = Number(req.body.id)
    const idData = await getData('itemData', "id", id)

    if (idData.rows.length < 1){
      new Notification({
        title: "No game found",
        body: "The game that you just launched hasn't been found in flash-backup"
      }).show()
    }else{
      await callBackupService(idData.rows[0].backupService, idData.rows[0].id)
    }

    res.sendStatus(200)
  })

  app.listen(port, () => {
    console.log("app listening")
  })

}

async function callBackupService(backupService, id, backupLocation){
  switch (backupService){
    case "Default":
      const service = await getData("userSettings", "id", 1)
      await callBackupService(service.rows[0].defaultService, id, service.rows[0].localBackupLocation)
      break

    case "Local":
      await LocalBackup(id, backupLocation)
      break
  }
}
