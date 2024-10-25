import fs from 'fs'
import archiver from "archiver"
import {join} from "path"

export default async function zipFolder(currentLocation, zipLocation){
  return new Promise((resolve, reject) => {
    const zipName = `${Date.now()}.zip`
    const output = fs.createWriteStream(join(zipLocation, zipName))
    const archive = archiver('zip', { zlib: {level: 5} })

    archive.on("error", (err) => {
      reject( err)
    })

    archive.pipe(output)

    archive.directory(currentLocation, false)
    archive.finalize().then(() => resolve(zipName))
  })
}
