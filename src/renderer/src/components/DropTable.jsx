import "./styles/dropTable.scss"
import { IconAlertCircle } from "@tabler/icons-react"
import {Alert, Button, Modal, Popover} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";
import ResultModal from "../utils/resultModal";

const electronAPI = window.electronAPI

export default function DropTable(){
  const [openedModal, handleModal] = useDisclosure(false)
  const warningIcon = <IconAlertCircle/>

  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState()

  const handleDataDelete = async () => {
    setResult(await electronAPI.dropTable())
    setShowResultModal(true)
    handleModal.close()
  }

  return(
    <>
      <Button color="red" style={{margin: "0 5px"}} onClick={handleModal.open}>
        Delete All Data
      </Button>

      <Modal opened={openedModal} onClose={handleModal.close} title={"Are you sure?"}>
        <Alert variant="filled" color="red" icon={warningIcon}> You can't undo this action, you'll lose all of your data </Alert>
        <div className="confirmationButtons">
          <Button color="red" onClick={handleDataDelete}>Yes</Button>
          <Button onClick={handleModal.close}>No</Button>
        </div>
      </Modal>

      <ResultModal result={result} showModal={showResultModal} setShowModal={setShowResultModal}/>
    </>
  )
}
