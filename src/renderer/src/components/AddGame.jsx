import './styles/addGame.scss'
import {Button, Modal, Select, TextInput} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ResultModal from "../utils/resultModal";
import backup_services from "./backUpServices";
import {IconCopy} from "@tabler/icons-react";
import CopyCommand from "../utils/copyCommand";

const electronAPI = window.electronAPI

function AddGame(){
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [backupValue, setBackupValue] = useState('Default')

  const [opened, handleAddGameModal] = useDisclosure(false)
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
      const result = await electronAPI.setData('itemData', '"name", "path", "backupService"', `"${name.trim()}", "${pathValue.trim()}", "${backupValue}"`)
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

        <div className="backupServiceName">
          <h5>Backup Service</h5>
          <div>*</div>
        </div>

        <div className={'backupServiceSelect'}>
          <Select
            placeholder="Select Backup Service"
            data={['Default', ...backup_services]}
            searchable
            required
            allowDeselect={false}
            defaultValue={'Default'}
            value={backupValue}
            onChange={setBackupValue}
          />
        </div>
        <Button onClick={handleAddGame}>Add Game</Button>
      </Modal>


      <Button onClick={handleAddGameModal.open}>Add New Game</Button>

      <ResultModal result={{http_code: 200}} showModal={showResultModal} setShowModal={setShowResultModal} Component={<CopyCommand name={name}/>}/>
    </div>
  )
}


export default AddGame;
