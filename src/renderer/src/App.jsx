import "./styles/app.scss"
import { Select } from '@mantine/core'
import { IconMenu2 } from '@tabler/icons-react'
import AddGame from "./components/AddGame";

const backup_services = ['Local', 'Google Drive', 'Dropbox', 'Mega', 'OneDrive']

function App() {
  return (
    <div className="mainbar">
      <AddGame/>

      <Select
        placeholder="Select Backup Service"
        data={backup_services}
        className="serviceDropdown"
        searchable="true"
        required={true}
      />
    </div>
  )
}

export default App

