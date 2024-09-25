import "./styles/app.scss";
import AddGame from "./components/AddGame";
import DropTable from './components/DropTable'
import { Select } from '@mantine/core';

const backup_services = ['Local', 'Google Drive', 'Dropbox', 'Mega', 'OneDrive'];

function App() {
  return (
    <div className="mainbar">
      <AddGame />
      <Select
        placeholder="Select Backup Service"
        data={backup_services}
        className="serviceDropdown"
        searchable
        required
      />
      <DropTable/>
    </div>
  );
}

export default App;
