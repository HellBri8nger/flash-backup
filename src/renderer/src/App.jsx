import "./styles/app.scss";
import { useEffect } from "react";
import AddGame from "./components/AddGame";
import { Select } from '@mantine/core';

const backup_services = ['Local', 'Google Drive', 'Dropbox', 'Mega', 'OneDrive'];

function App() {
  useEffect(() => {
    const handleCLIArguments = (event, { id }) => {
      console.log(`Received CLI argument in renderer with id: ${id}`);
      // process to be added (backup)
    };


    window.electronAPI.ipcRenderer.on('cli-arguments', handleCLIArguments);


    return () => {
      window.electronAPI.ipcRenderer.removeListener('cli-arguments', handleCLIArguments);
    };
  }, []);

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
    </div>
  );
}

export default App;
