import "./styles/app.scss";
import AddGame from "./components/AddGame";
import DropTable from './components/DropTable'
import ListItems from "./components/ListItems";
import { Select } from '@mantine/core';

const backup_services = ['Local'];

function App() {
  return (
    <>
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
      <ListItems/>
    </>
  );
}

export default App;
