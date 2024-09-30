import './styles/addGame.scss'
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const electronAPI = window.electronAPI

function AddGame(){
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const [opened, handleAddGameModal] = useDisclosure(false)
  const [addGameConfirmationModal, confirmationModal] = useDisclosure(false)

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
      const result = await electronAPI.setData('users', '"name", "path", "command"', `"${name}", "${pathValue}", "null"`)
      if (result.http_code !== 200){
        if (result.http_code === 19) setNameError("You already have an item with this name")
      }else{
        handleAddGameModal.close()
        confirmationModal.open()
      }
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
      <Modal opened={opened} onClose={handleAddGameModal.close} title="Add Game" className="addGameModal">
        <TextInput
          label="Name"
          placeholder="Input Name"
          value={name}
          onChange={e => handleNameError(e.target.value)}
          error={nameError}
          withAsterisk
          data-autofocus
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
      <Button onClick={handleAddGameModal.open}>Add New Game</Button>

      <Modal opened={addGameConfirmationModal} onClose={confirmationModal.close} title={"Operation Successful"}>
          <div className="confirmationButtons"> <Button onClick={confirmationModal.close}> Ok </Button> </div>
      </Modal>

    </div>
  )
}

export default AddGame;
