import fs from 'fs'
import archiver from "archiver"
import {join} from "path"

export default async function zipFolder(currentLocation, zipLocation){
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(join(zipLocation, `${Date.now()}.zip`))
    const archive = archiver('zip', { zlib: {level: 5} })

    archive.on("error", (err) => {
      reject( err)
    })

    archive.pipe(output)

    archive.directory(currentLocation, false)
    archive.finalize().then(() => resolve());
  })
}
