import {useEffect, useState} from "react";
import {IconAlertCircle, IconPencil, IconTrash} from "@tabler/icons-react";
import {Alert, Button, Modal, TextInput} from "@mantine/core";
import "./styles/listItems.scss"
import "./styles/addGame.scss"
import {useDisclosure} from "@mantine/hooks";

const electronAPI = window.electronAPI

export default function ListItems(){
  const [allItems, setAllItems] = useState('')
  const [pathValue, setPathValue] = useState('')
  const [pathError, setPathError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [result, setResult] = useState()
  const [showResultModal, setShowResultModal] = useState(false)
  const [id, setid] = useState('')

  const [opened, handleEditGameModal] = useDisclosure(false)
  const [addGameConfirmationModal, confirmationModal] = useDisclosure(false)
  const [deleteConfirmation, deleteModal] = useDisclosure(false)
  const warningIcon = <IconAlertCircle/>

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
    if (name !== '' && pathValue !== ''){
      const result = await electronAPI.getData('name', name)

      if (result.rows[0] === undefined){
        setResult(await electronAPI.updateData('users', `name = '${name}', path = '${pathValue}'`, id))
        handleEditGameModal.close()
        confirmationModal.open()
        setShowResultModal(true)
      }else{
        setNameError("You already have an item with this name")
      }
    }else{
      if (name === '') {
        setNameError("Name must not be empty")
      }
      if (pathValue === '' || pathValue === "Location doesn't exist") {
        setPathError('Location must not be empty')
      }
    }
  }

  const handleEdit = (items) => {
    setid(items.id)
    setPathValue(items.path)
    setName(items.name)
    handleEditGameModal.open()
  }

  async function deleteItem(itemID){
    if (deleteConfirmation){
      setResult( await electronAPI.removeData("id", id))
      deleteModal.close()
      setShowResultModal(true)
      confirmationModal.open()
    }else{
      deleteModal.open()
      setid(itemID)
    }
  }

  async function get(){
    const result = await electronAPI.getAllData('users')
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
        <Button onClick={handleAddGame}>Edit Game</Button>
      </Modal>

      <Modal opened={addGameConfirmationModal} onClose={confirmationModal.close} title={"Updated Successfully"}>
        <div className="confirmationButtons"> <Button onClick={confirmationModal.close}> Ok </Button> </div>
      </Modal>

      {showResultModal &&
        <Modal opened={addGameConfirmationModal} onClose={confirmationModal.close} title={result.http_code === 200 ? "Operation Successful" : "Operation Failed"}>
          { result.http_code === 200 ?
            <div className="confirmationButtons"> <Button onClick={() => {confirmationModal.close(); setShowResultModal(false)}} data-autofocus>Ok</Button>  </div> :
            <p>Something went wrong, please try again.</p>
          }
        </Modal>
      }

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
            <Button variant='subtle' color='white' onClick={() => handleEdit(items)}>
              <IconPencil color='white'/>
            </Button>
            <Button variant='subtle' color='red' onClick={() => deleteItem(items.id)}>
              <IconTrash color="red"/>
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}
