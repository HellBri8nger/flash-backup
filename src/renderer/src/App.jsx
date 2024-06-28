import './assets/app.scss';
import { Button, Modal, Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import Launch from './launch';

const backup_services = ['Local', 'Google Drive', 'Dropbox', 'Mega', 'OneDrive'];

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  const [launchOpened, { open: openLaunch, close: closeLaunch }] = useDisclosure(false);
  const [pathValue, setPathValue] = useState('');

  const handleFolder = async () => {
    const folderPath = await window.electronAPI.folder();
    setPathValue(folderPath);
  };

  const handleAddGame = () => {
    close();
    openLaunch();
  };

  return (
    <div className="mainbar">
      <Modal opened={opened} onClose={close} title="Add Game" className="addGameModal">
        <TextInput label="Name" placeholder="Input Name" />
        <div className="pathSelector">
          <TextInput
            label="Path"
            placeholder="Input Save Location"
            value={pathValue}
            onChange={(e) => setPathValue(e.target.value)}
          />
          <Button onClick={handleFolder}>Select Folder</Button>
        </div>
        <Button onClick={handleAddGame}>Add Game</Button>
      </Modal>

      <Select
        placeholder="Select Backup Service"
        data={backup_services}
        className="serviceDropdown"
        searchable
        required
      />
      <Button onClick={open}>Add New Game</Button>
      
      <Launch opened={launchOpened} close={closeLaunch} />
    </div>
  );
}

export default App;
