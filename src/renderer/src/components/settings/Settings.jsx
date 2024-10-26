import {Button, Divider, Drawer, Select, TextInput, Tooltip} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconSettings, IconHelpCircleFilled} from "@tabler/icons-react";
import "../styles/settings.scss"
import backup_services from "../backUpServices";
import DropTable from "../DropTable";
import {useEffect, useState} from "react";
import GoogleDrive from "./GoogleDrive";

const electronAPI = window.electronAPI

export default function Settings(){
  const [settingsDrawer, settingsDrawerHandler] = useDisclosure(false)

  const [path, setPath] = useState(null)
  const [pathError, setPathError] = useState(null)
  const [backupValue, setBackupValue] = useState(null)

  const handleFolder = async () => {
    const folderPath = await electronAPI.folder()
    await handlePathError(folderPath)
  }

  const handlePathError = async value => {
    setPath(value)
    if (await electronAPI.checkPathExists(value.trim())){
      setPathError(null)
    }else{
      setPathError("Location doesn't exist")
    }
  }

  useEffect(() => {
    const setDefaultPath = async () => {
      if (settingsDrawer){
        await handlePathError(path)
      }else{
        if (path){
          await electronAPI.updateData('userSettings', `localBackupLocation = '${path}'`, 1)
        }
      }
    }

    setDefaultPath()
  }, [settingsDrawer])

  useEffect(() => {
    const getDefault = async () => {
      const result = await electronAPI.getData('userSettings', 'id', 1)
      setBackupValue(result.rows[0].defaultService)
      setPath(result.rows[0].localBackupLocation)
    }

    getDefault()
  }, [])

  return(
    <>
      <Drawer opened={settingsDrawer} onClose={settingsDrawerHandler.close} title={"Settings"}>
        <div className="selectMenu">
          <Select
            placeholder="Select Backup Service"
            data={[...backup_services]}
            className="serviceDropdown"
            searchable
            required
            allowDeselect={false}
            value={backupValue}
            onChange={async (e) => {setBackupValue(e); await electronAPI.updateData("userSettings", `defaultService = '${e}'`, 1)}}
          />
          <HelpCircle/>
        </div>
        {backupValue === 'Local' &&
          <div className="pathSelector">
            <TextInput
              label="Backup Location"
              placeholder="Input Backup Location"
              value={path}
              onChange={e => handlePathError(e.target.value)}
              error={pathError}
              withAsterisk
            />
            <Button onClick={handleFolder}>Select Folder</Button>
          </div>}
        <GoogleDrive backupValue={backupValue}/>
        <Divider/>
        <div className='dropTable'>
          <DropTable/>
        </div>
      </Drawer>

      <Button onClick={settingsDrawerHandler.open}>
        <IconSettings/>
      </Button>
    </>

  )
}

function HelpCircle(){
  const backupHelp = "Select your default backup method, every item with the default option selected will use this backup method"

  return(
    <Tooltip label={backupHelp}>
      <IconHelpCircleFilled/>
    </Tooltip>
  )
}
