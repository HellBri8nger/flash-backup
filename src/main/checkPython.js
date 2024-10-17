const yauzl = require('yauzl')
const path = require('path')
const fs = require('fs')
const { exec} = require('child_process')
const {join} = require('path')

export function checkPythonInstallation(path) {
  exec('python --version', (error, stdout, stderr) => {
    console.log(`stderr: ${stderr} \n stdout: ${stdout} \n error: ${error}`)
    if (stderr && error){

      exec(`setx PATH "%PATH%${join(path, "python")}"`)
      extractZip('python.zip', path)
    }
  })
}


function extractZip(sourceZip, destinationDir) {
  yauzl.open(sourceZip, { lazyEntries: true }, (err, zipfile) => {
    if (err) return

    zipfile.on('entry', (entry) => {
      const entryPath = path.join(destinationDir, entry.fileName)

      if (entry.fileName.endsWith('/')) {
        fs.mkdirSync(entryPath, { recursive: true })
        zipfile.readEntry()
      } else {
        zipfile.openReadStream(entry, (err, readStream) => {
          if (err) return

          fs.mkdirSync(path.dirname(entryPath), { recursive: true })
          const writeStream = fs.createWriteStream(entryPath)
          readStream.pipe(writeStream).on('finish', () => zipfile.readEntry())
        })
      }
    })

    zipfile.readEntry()
  })
}


// TODO prevent the app from closing until extraction finishes
