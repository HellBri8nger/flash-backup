import "./assets/app.scss"
import { Button, Modal, Select, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const backup_services = ['Local', 'Google Drive', 'Dropbox', 'Mega', 'OneDrive']

function App() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="mainbar">
      <Modal opened={opened} onClose={close} title="Add Game" className="addGameModal">
        <TextInput label="Name" placeholder="Input Name of The Game" />
        <TextInput label="Path" placeholder="Input Path of Game" />
        <Button>Add Game</Button>
      </Modal>

      <Select
        placeholder="Select Backup Service"
        data={backup_services}
        className="serviceDropdown"
        searchable="true"
        required="true"
      />
      <Button onClick={open}>Add New Game</Button>
    </div>
  )
}

export default App
