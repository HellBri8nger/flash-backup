import {getData, updateData} from "../database/databaseHandler"
import {Notification} from 'electron'
import { authenticate } from '@google-cloud/local-auth'
import {google} from "googleapis";
import zipFolder from "../utils/zipFolder";
import fs from "fs";
import {join} from "path";
import showNotification from "../utils/showNotification";


export async function authenticateDrive(credentialsPath){
  const client = await authenticate({
    scopes: ['https://www.googleapis.com/auth/drive'],
    keyfilePath: credentialsPath
  })

  const credentials = require(credentialsPath)
  await updateData("", 'userSettings', `googleDriveToken = '${JSON.stringify(client.credentials)}', googleDriveCredentials = '${JSON.stringify(credentials.installed)}'`, 1)
}


export async function driveBackup(id) {
  const result = await getData("userSettings", "id", 1)
  let {googleDriveToken, googleDriveCredentials, googleDriveMainFolder} = result.rows[0]

  if (googleDriveToken) {
    googleDriveCredentials = JSON.parse(googleDriveCredentials)

    const credentials = {
      client_id: googleDriveCredentials.client_id,
      client_secret: googleDriveCredentials.client_secret,
    }

    const auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret
    )
    auth.setCredentials(JSON.parse(googleDriveToken))
    const drive = google.drive({version: 'v3', auth})

    if (!googleDriveMainFolder) {
      const folderMetaData = {name: "Flash Backup", mimeType: 'application/vnd.google-apps.folder'}

      try {
        const response = await drive.files.create({requestBody: folderMetaData, fields: 'id'})
        await updateData("", "userSettings", `googleDriveMainFolder = '${response.data.id}'`, 1)
      }catch (err) {
        showNotification("Something went wrong", err)
        return
      }
    }

    await backup(id, drive)
  }else showNotification("You didn't set up your Google Drive API", "Open settings to setup one now ")
}

async function backup(id, drive){
  const data = await getData('itemData', "id", id)
  const result = await getData("userSettings", "id", 1)

  try{
    if(!data.rows[0].googleDriveFolderID){
      const folderMetaData = {name: data.rows[0].name, mimeType: 'application/vnd.google-apps.folder', parents: [result.rows[0].googleDriveMainFolder]}

      try {
        const response = await drive.files.create({requestBody: folderMetaData, fields: 'id'})
        await updateData("", "itemData", `googleDriveFolderID = '${response.data.id}'`, id)
        data.rows[0].googleDriveFolderID = response.data.id
      }catch (err) {
        if(err.code === 404){
          showNotification("Parent Folder not found", "please try again")
          await updateData("", 'userSettings', `googleDriveMainFolder = ${null}`, 1)
          await updateData("", 'itemData', `googleDriveFolderID = ${null}`, id)
          return
        }else showNotification("Something went wrong", err)
      }
    }
  }catch (err) {showNotification("Something went wrong", err)}

  zipFolder(data.rows[0].path, data.rows[0].path)
    .then(async (zipName) => {
      const requestBody = {name: zipName, fields: 'id', parents: [data.rows[0].googleDriveFolderID]}
      const media = {mimeType: 'application/zip', body: fs.createReadStream(join(data.rows[0].path, zipName))}

      try {
        await drive.files.create({requestBody, media: media})
        await fs.unlink(join(data.rows[0].path, zipName), () => {})

        showNotification("Backup Completed", "")
      } catch (err) {
        if(err.code === 404){
          await fs.unlink(join(data.rows[0].path, zipName), () => {})
          showNotification("Parent Folder not found", "please try again")
          await updateData("", 'itemData', `googleDriveFolderID = ${null}`, id)
        }else showNotification("Something went wrong", err)
      }
    })
    .catch((err) => {console.log(err)})
}
