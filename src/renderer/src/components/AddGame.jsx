import './styles/addGame.scss'
import { Button, Modal, TextInput } from "@mantine/core";
import { v4 } from 'uuid'
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Launch from "../launch";

const electronAPI = window.electronAPI

function AddGame(){
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const [opened, { open, close }] = useDisclosure(false)
  const [launchOpened, { open: openLaunch, close: closeLaunch }] = useDisclosure(false)

  const handleFolder = async () => {
    const folderPath = await electronAPI.folder()
    await handlePathError(folderPath)
  }

  const handlePathError = async value => {
    setPathValue(value)
    if (await electronAPI.checkPathExists(value) !== false){
      setPathError('')
    }else{
      setPathError("Location doesn't exist")
    }
  }

  const handleNameError = value => {
    setName(value)
    if (value === ''){
      setNameError('Name must not be empty')
    }else{
      setNameError('')
    }
  }

  const handleAddGame = async () => {
    if (name !== '' && pathValue !== '') {
      const gameID = v4() // TODO add logic to add the game into database
      close()
    }
    else{
      if (name === '') {
        setNameError("Name must not be empty")
      }
      if (pathValue === '' || pathValue === "Location doesn't exist") {
        setPathError('Location must not be empty')
      }
    }
  }


  return(
    <div className={"addGame"}>
      <Modal opened={opened} onClose={close} title="Add Game" className="addGameModal">
        <TextInput
          label="Name"
          placeholder="Input Name"
          value={name}
          onChange={e => handleNameError(e.target.value)}
          error={nameError}
          withAsterisk
        />

        <div className="pathSelector">
          <TextInput
            label="Path"
            placeholder="Input Save Location"
            value={pathValue}
            onChange={e => handlePathError(e.target.value)}
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
