import './styles/addGame.scss'
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ResultModal from "../utils/resultModal";

const electronAPI = window.electronAPI

function AddGame(){
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const [opened, handleAddGameModal] = useDisclosure(false)
  const [addGameConfirmationModal, confirmationModal] = useDisclosure(false)
  const [showResultModal, setShowResultModal] = useState(false)

  const handleFolder = async () => {
    const folderPath = await electronAPI.folder()
    await handlePathError(folderPath)
  }

  const handlePathError = async value => {
    setPathValue(value)

    if (await electronAPI.checkPathExists(value.trim())){
      setPathError(null)
    }else{
      setPathError("Location doesn't exist")
    }
  }

  const handleNameError = value => {
    setName(value)
    if (value.trim() === ''){
      setNameError('Name must not be empty')
    }else{
      setNameError(null)
    }
  }

  const handleAddGame = async () => {
    if (name.trim() !== '' && pathValue.trim() !== '') {
      const result = await electronAPI.setData('itemData', '"name", "path", "command"', `"${name.trim()}", "${pathValue.trim()}", "null"`)
      if (result.http_code !== 200){
        if (result.http_code === 19) setNameError("You already have an item with this name")
      }else{
        handleAddGameModal.close()
        setShowResultModal(true)
      }
    }
    else{
      if (name.trim() === '') {
        setNameError("Name must not be empty")
      }
      if (pathValue.trim() === '' || pathError === "Location doesn't exist") {
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

      <ResultModal result={{http_code: 200}} showModal={showResultModal} setShowModal={setShowResultModal}/>

    </div>
  )
}

export default AddGame;
