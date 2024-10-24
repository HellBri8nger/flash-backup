import {updateData} from "../database/databaseHandler";
const {authenticate} = require('@google-cloud/local-auth')


export async function authenticateDrive(credentialsPath){
  const client = await authenticate({
    scopes: ['https://www.googleapis.com/auth/drive'],
    keyfilePath: credentialsPath
  })

  await updateData("", 'userSettings', `googleDriveToken = '${JSON.stringify(client.credentials)}'`, 1)
}
