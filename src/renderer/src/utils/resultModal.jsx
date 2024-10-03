import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

export default function ResultModal({ showModal, setShowModal, result }) {
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    if (showModal && !opened) {
      open()
    } else if (!showModal && opened) {
      close()
    }
  }, [showModal, opened, open, close])

  const handleClose = () => {
    close()
    setShowModal(false)
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title={result?.http_code === 200 ? "Operation Successful" : "Operation Failed"}>
        {result?.http_code === 200 ?
          <div className="confirmationButtons"> <Button onClick={handleClose} data-autofocus>Ok</Button> </div> :
          <p>Something went wrong, please try again.</p> }
      </Modal>
    </>
  );
}
