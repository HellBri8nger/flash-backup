import {Button, Drawer, Select, Tooltip} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconSettings, IconHelpCircleFilled} from "@tabler/icons-react";
import "./styles/settings.scss"
import backup_services from "./backUpServices";
import DropTable from "./DropTable";

export default function Settings(){
  const [settingsDrawer, settingsDrawerHandler] = useDisclosure(false)

  return(
    <>
      <Drawer opened={settingsDrawer} onClose={settingsDrawerHandler.close} title={"Settings"}>
        <div className="selectMenu">
          <Select
            placeholder="Select Backup Service"
            data={backup_services}
            className="serviceDropdown"
            searchable
            required
          />
          <HelpCircle/>
        </div>
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
