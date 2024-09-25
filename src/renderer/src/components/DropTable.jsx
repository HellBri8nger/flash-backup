import "./styles/dropTable.scss"
import {IconAlertCircle, IconTrashFilled} from "@tabler/icons-react"
import {Alert, Button, Modal, Popover} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";

const electronAPI = window.electronAPI

export default function DropTable(){
  const [openedPopover, handlePopover] = useDisclosure(false)
  const [openedModal, handleModal] = useDisclosure(false)
  const warningIcon = <IconAlertCircle/>

  const [resultModal, handleResultModal] = useDisclosure(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState()

  const handleDataDelete = async () => {
    setResult(await electronAPI.dropUsersTable())
    setShowResultModal(true)
    handleModal.close()
    handleResultModal.open()
  }

  return(
    <>
      <Popover withArrow opened={openedPopover}>
        <Popover.Target>
          <Button
            variant="subtle"
            color="red"
            style={{margin: "0 5px"}}
            onMouseEnter={handlePopover.open}
            onMouseLeave={handlePopover.close}
            onClick={handleModal.open}
          >
            <IconTrashFilled color="red"/>
          </Button>
        </Popover.Target>

        <Popover.Dropdown style={{padding: "7px"}}>
          <div style={{fontSize: "15px"}}>Delete all data.</div>
        </Popover.Dropdown>
      </Popover>

      <Modal opened={openedModal} onClose={handleModal.close} title={"Are you sure?"}>
        <Alert variant="filled" color="red" icon={warningIcon}> You can't undo this action, you'll lose all of your data </Alert>
        <div className="confirmationButtons">
          <Button color="red" onClick={handleDataDelete}>Yes</Button>
          <Button onClick={handleModal.close}>No</Button>
        </div>
      </Modal>

      {showResultModal &&
        <Modal opened={resultModal} onClose={handleResultModal.close} title={result.http_code === 200 ? "Operation Successful" : "Operation Failed"}>
          { result.http_code === 200 ?
            <div className="confirmationButtons"> <Button>Ok</Button>  </div> :
            <p>Something went wrong, please try again.</p>
          }
        </Modal>
      }
    </>
  )
}
