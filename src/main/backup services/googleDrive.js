import {getData, updateData} from "../database/databaseHandler"
import {Notification} from 'electron'
import { authenticate } from '@google-cloud/local-auth'
import {google} from "googleapis";
import zipFolder from "../utils/zipFolder";
import fs from "fs";
import {join} from "path";


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
      }catch (err) {new Notification({title: "Something went wrong", body: err}).show(); return}
    }

    await backup(id, drive)
  }else new Notification({title: "You didn't set up your Google Drive API", body: "Open settings to setup one now "}.show())
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
          new Notification({title: "Parent Folder not found", body: "please try again"}).show()
          await updateData("", 'userSettings', `googleDriveMainFolder = ${null}`, 1)
          await updateData("", 'itemData', `googleDriveFolderID = ${null}`, id)
          return
        }else {new Notification({title: "Something went wrong", body: err}).show(); return}
      }
    }
  }catch (err) {new Notification({title: "Something went wrong", body: err}).show(); return}

  zipFolder(data.rows[0].path, data.rows[0].path)
    .then(async (zipName) => {
      const requestBody = {name: zipName, fields: 'id', parents: [data.rows[0].googleDriveFolderID]}
      const media = {mimeType: 'application/zip', body: fs.createReadStream(join(data.rows[0].path, zipName))}

      try {
        await drive.files.create({requestBody, media: media})
        await fs.unlink(join(data.rows[0].path, zipName), () => {})

        new Notification({title: "Backup Completed", body: ""}).show()
      } catch (err) {
        if(err.code === 404){
          await fs.unlink(join(data.rows[0].path, zipName), () => {})
          new Notification({title: "Parent Folder not found", body: "please try again"}).show()
          await updateData("", 'itemData', `googleDriveFolderID = ${null}`, id)
          // add return if you write more logic after this function

        }else new Notification({title: "Something went wrong", body: err}).show()
      }
    })
    .catch((err) => {console.log(err)})
}
