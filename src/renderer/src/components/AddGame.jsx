import './styles/addGame.scss'
import {Button, Modal, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";

function AddGame(){
  const [opened, { open, close }] = useDisclosure(false)
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState(false)

  const handleFolder = async () => {
    const folderPath = await window.electronAPI.folder()
    setPathValue(folderPath)
  }

  const path = async (e) => {
    setPathValue(e.target.value)
    if (await window.electronAPI.checkPathExists(e.target.value) !== false){
      setPathError(false)
    }else{
      setPathError("Location doesn't exist")
    }
  }

  return(
    <div className={"addGame"}>
      <Modal opened={opened} onClose={close} title="Add Game" className="addGameModal">
        <TextInput label="Name" placeholder="Input Name" />
        <div className="pathSelector">
          <TextInput
            label="Path"
            placeholder="Input Save Location"
            value={pathValue}
            onChange={path}
            error={pathError}
          />
          <Button onClick={handleFolder}>Select Folder</Button>
        </div>
        <Button>Add Game</Button>
      </Modal>
      <Button onClick={open}>Add New Game</Button>
    </div>
  )
}

export default AddGame;
