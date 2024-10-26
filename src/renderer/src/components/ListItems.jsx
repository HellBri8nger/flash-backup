import {useEffect, useState} from "react";
import {IconAlertCircle, IconPencil, IconTrash, IconBaselineDensitySmall, IconFileExport} from "@tabler/icons-react";
import {Alert, Button, Menu, Modal, Select, TextInput} from "@mantine/core";
import "./styles/listItems.scss"
import "./styles/addGame.scss"
import {useDisclosure} from "@mantine/hooks";
import ResultModal from "../utils/resultModal";
import backup_services from "./backUpServices";
import CopyCommand from "../utils/copyCommand";

const electronAPI = window.electronAPI

export default function ListItems(){
  const [allItems, setAllItems] = useState('')
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [result, setResult] = useState()
  const [showResultModal, setShowResultModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [id, setid] = useState('')
  const [backupValue, setBackupValue] = useState('')

  const [opened, handleEditGameModal] = useDisclosure(false)
  const [commandOpened, showCommand] = useDisclosure()
  const [deleteConfirmation, deleteModal] = useDisclosure(false)
  const [showModal, setShowModal] = useState(false)
  const warningIcon = <IconAlertCircle/>

  const handleFolder = async () => {
    const folderPath = await electronAPI.folder()
    await handlePathError(folderPath)
  }

  const handlePathError = async value => {
    setPathValue(value)
    if (await electronAPI.checkPathExists(value.trim()) !== false){
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
    if (name !== '' && pathValue !== ''){
      const result = await electronAPI.getData('itemData','name', name.trim())

      if (result.rows[0] === undefined){
        setResult(await electronAPI.updateData('itemData', `name = '${name.trim()}', path = '${pathValue.trim()}', backupService = '${backupValue}'`, id))
        handleEditGameModal.close()
        setShowResultModal(true)
      }else{
        if (result.rows[0].id === id){
          setResult(await electronAPI.updateData('itemData', `name = '${name.trim()}', path = '${pathValue.trim()}', backupService = '${backupValue}'`, id))
          handleEditGameModal.close()
          setShowResultModal(true)
        }else{
          setNameError("You already have an item with this name")
        }
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

  const handleEdit = (items) => {
    setid(items.id)
    setPathValue(items.path)
    setName(items.name)
    setBackupValue(items.backupService)
    handleEditGameModal.open()
  }

  async function deleteItem(itemID){
    if (deleteConfirmation){
      setResult( await electronAPI.removeData("itemData", "id", id))
      deleteModal.close()
      setShowDeleteModal(true)
    }else{
      deleteModal.open()
      setid(itemID)
    }
  }

  async function get(){
    const result = await electronAPI.getAllData('itemData')
    setAllItems(result.rows)
  }
  useEffect(() => {
    get()
  })

  return(
    <>
      <Modal opened={opened} onClose={handleEditGameModal.close} title="Edit Game" className="addGameModal">
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
            value={backupValue}
            onChange={setBackupValue}
          />
        </div>

        <Button onClick={handleAddGame}>Edit Game</Button>
      </Modal>

      <ResultModal result={result} showModal={showResultModal} setShowModal={setShowResultModal} Component={<CopyCommand name={name}/>}/>
      <ResultModal result={result} showModal={showDeleteModal} setShowModal={setShowDeleteModal}/>

      <Modal opened={deleteConfirmation} onClose={deleteModal.close} title={"Are you sure?"}>
        <Alert variant="filled" color="red" icon={warningIcon}> You can't undo this action, you'll lose your data </Alert>
        <div className="confirmationButtons">
          <Button color="red" onClick={() => deleteItem()}>Yes</Button>
          <Button onClick={deleteModal.close}>No</Button>
        </div>
      </Modal>

      {allItems && allItems.map((items) => (
        <div className="items" key={items.id}>
          <div>{items.name}</div>
          <div>
            <Menu>
              <Menu.Target><Button>Options</Button></Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Options</Menu.Label>

                <Menu.Item leftSection={<IconPencil/>} onClick={() => handleEdit(items)}> Edit </Menu.Item>
                <Menu.Item leftSection={<IconTrash/>} onClick={() => deleteItem(items.id)}> Delete </Menu.Item>
                <Menu.Item
                  leftSection={<IconBaselineDensitySmall/>} onClick={() => {setShowModal(true); setName(items.name)}}>
                  Show Command
                </Menu.Item>
                <Menu.Item leftSection={<IconFileExport/>} onClick={() => callBackup(items.id)}>Backup Manually</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      ))}

      <CommandModal setShowModal={setShowModal} showModal={showModal} name={name}/>
    </>
  )
}

function CommandModal({showModal, setShowModal, name}){
  return(
    <ResultModal result={{http_code: 200}} showModal={showModal} setShowModal={setShowModal} Component={<CopyCommand name={name}/>} text={{show: false, text: "Command"}}/>
  )
}

async function callBackup(id){
  const { manualBackup } = window.electronAPI
  await manualBackup(id)
}
