import {Badge, Button, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconCheck} from "@tabler/icons-react";
import "../styles/googleDrive.scss";

export default function GoogleDrive({ backupValue }){
  const [path, setPath] = useState('')
  const [pathError, setPathError] = useState('')
  const [show, setShow] = useState(false)

  const { checkPathExists, folder, getData, updateData} = window.electronAPI

  async function getCredentials(){
    const folderPath = await folder(true)
    await handlePathError(folderPath)
  }

  const handlePathError = async value => {
    setPath(value)

    if (value.slice(-5) === ".json"){
      if (await checkPathExists(value.trim())){ setPathError(null)}
      else{ setPathError("Location doesn't exist") }}
    else { setPathError("This isn't a .json file") }
  }

  const removeOldToken = async () => {
    await updateData('userSettings', `googleDriveToken = ${null}, googleDriveCredentials = ${null}`, 1)
    setShow(true)
  }

  useEffect(() => {
    getData('userSettings', 'id', 1).then((result) => {
      const { googleDriveToken } = result.rows[0]
      if (!googleDriveToken){
        setShow(true)
        if (path === "") {setPathError("Location doesn't exist")}
      }else setShow(false)
    })

  }, [])

  return(
    <>
      {backupValue === "Google Drive" && show &&
        <>
          <div style={{display: "flex", gap: "5px"}}>
            <TextInput
              label="Credential Location"
              placeholder="Input Credential Location"
              value={path}
              onChange={e => handlePathError(e.target.value)}
              error={pathError}
              withAsterisk
              style={{width: "100%"}}
            />
            <Button style={{width: "60%", marginTop: "24px"}} onClick={() => getCredentials(setPath)}>Select Credentials</Button>
          </div>
          <div style={{display: "flex", justifyContent: "center", margin: "5px"}}>
            {!pathError && <Button onClick={() => authenticate(path, setShow)}> Authenticate </Button>}
          </div>
        </>
      }
      <div className="authenticatedButtons">
        {backupValue === "Google Drive" && !show &&
          <>
            <Badge size="lg" color='green' radius='sm' rightSection={<IconCheck/>} style={{marginTop: "0.5rem"}}>Authenticated</Badge>
            <Button style={{marginBottom: "0.5rem"}} onClick={() => removeOldToken()}>Remove Old API</Button>
          </>
        }
      </div>

    </>
  )
}

async function authenticate(path, setShow){
  const { authenticateDrive } = window.electronAPI
  await authenticateDrive(path)
  setShow(false)
}
