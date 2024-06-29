import './styles/addGame.scss'
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Launch from "../launch";

const electronAPI = window.electronAPI

function AddGame(){
  const [opened, { open, close }] = useDisclosure(false)
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState(false)
  const [launchOpened, { open: openLaunch, close: closeLaunch }] = useDisclosure(false)

  const handleFolder = async () => {
    const folderPath = await electronAPI.folder()
    await path(folderPath)
  }

  const path = async value => {
    setPathValue(value)
    if (await electronAPI.checkPathExists(value) !== false){
      setPathError(false)
    }else{
      setPathError("Location doesn't exist")
    }
  }

  const handleAddGame = () => {
    close();
    openLaunch();
  }

  return(
    <div className={"addGame"}>
      <Modal opened={opened} onClose={close} title="Add Game" className="addGameModal">
        <TextInput label="Name" placeholder="Input Name" withAsterisk/>
        <div className="pathSelector">
          <TextInput
            label="Path"
            placeholder="Input Save Location"
            value={pathValue}
            onChange={(e) => path(e.target.value)}
            error={pathError}
            withAsterisk
          />
          <Button onClick={handleFolder}>Select Folder</Button>
        </div>
        <Button onClick={handleAddGame}>Add Game</Button>
      </Modal>
      <Button onClick={open}>Add New Game</Button>

      <Launch opened={launchOpened} close={closeLaunch} className="test"/>
    </div>
  )
}

export default AddGame;
