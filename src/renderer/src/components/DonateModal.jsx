import {Button, Image, Modal} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks";
import {useEffect} from "react";
import kofi from "./settings/kofi.png";


export default function DonateModal() {
  const [opened, { open, close }] = useDisclosure(false)
  const {shellOpen} = window.electronAPI

  useEffect(() => {
    function showModal() {
      const timer = localStorage.getItem("modal-timer")
      const showModalState = localStorage.getItem("showModal")

      if (showModalState === "false") {
        clearInterval(intervalId);
        return;
      }

      if (Number(timer) >= 5760) {
        localStorage.setItem("modal-timer", "0")
        open()
      } else {
        localStorage.setItem("modal-timer", `${Number(timer) + 5}`)
      }
    }
    const intervalId = setInterval(showModal, 300)
  }, []);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Are you enjoying Flash Backup?">
        <p style={{textAlign: "center"}}>If you're enjoying Flash Backup</p>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Image src={kofi} alt="Support me on Ko-fi" className="kofiLogo" style={{cursor: 'pointer'}} onClick={async () => await shellOpen("https://ko-fi.com/hellbri8nger")}/>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Button variant="subtle" onClick={() => {localStorage.setItem("showModal", "false");close()}}>Don't show again</Button>
          <Button onClick={close}>Remind me later</Button>
        </div>
      </Modal>
    </>
  )
}
