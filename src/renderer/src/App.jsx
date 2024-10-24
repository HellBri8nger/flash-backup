import "./styles/app.scss";
import AddGame from "./components/AddGame";
import ListItems from "./components/ListItems";
import Settings from "./components/settings/Settings";


function App() {
  return (
    <>
      <div className="mainbar">
        <AddGame/>
        <Settings/>
      </div>
      <ListItems/>
    </>
  );
}

export default App;
