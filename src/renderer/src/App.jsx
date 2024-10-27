import "./styles/app.scss";
import AddGame from "./components/AddGame";
import ListItems from "./components/ListItems";
import Settings from "./components/settings/Settings";
import DonateModal from "./components/DonateModal";


function App() {
  return (
    <>
      <div className="mainbar">
        <AddGame/>
        <Settings/>
      </div>
      <ListItems/>
      <DonateModal/>
    </>
  );
}

export default App;
