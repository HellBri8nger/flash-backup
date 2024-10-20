const yauzl = require('yauzl')
const path = require('path')
const fs = require('fs')
const { exec} = require('child_process')
const {join} = require('path')

let allowClose = true

export function checkPythonInstallation(path) {
  if (!fs.existsSync(join(path, 'emitRequest.pyw'))){
    fs.copyFileSync("./emitRequest.pyw", join(path, "emitRequest.pyw"))
  }

  exec('python --version', (error, stdout, stderr) => {
    if (stderr && error){
      allowCloseSetter(false)

      exec(`setx PATH "%PATH%${join(path, "python")}"`)
      extractZip('python.zip', path)
    }else{
      exec(`pip install pywin32 requests`)
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

    zipfile.on('end', () => {
      allowCloseSetter(true)
    });

    zipfile.readEntry()
  })
}

export function allowCloseGetter(){
  return allowClose
}

function allowCloseSetter(value){
  allowClose = value
}
