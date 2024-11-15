import {Button, Modal, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import { useEffect } from "react";
import "./styles/resultModal.scss"


export default function ResultModal({ showModal, setShowModal, result, Component, text }) {
  const [opened, { open, close }] = useDisclosure(false)

  if (text === undefined) text = {show: true}

  useEffect(() => {
    if (showModal && !opened) open()
    else if (!showModal && opened) close()

  }, [showModal, opened, open, close])

  const handleClose = () => {
    close()
    setShowModal(false)
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title={result?.http_code === 200 ? text.show ? "Operation Successful" : text.text : "Operation Failed"}>
        {result?.http_code === 200 ?
          <div>
            <ComponentRenderer component={Component}/>

            <div className="confirmation">
              <Button onClick={handleClose} data-autofocus>Ok</Button>
            </div>
          </div> :
          <p>Something went wrong, please try again.</p> }
      </Modal>
    </>
  );
}


function ComponentRenderer({ component }){
  if (component) return component
  else return <div></div>

}
