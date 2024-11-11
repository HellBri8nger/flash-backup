import {Button, Image, Modal} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks";
import {useEffect} from "react";
import kofi from "./settings/kofi.png";


export default function DonateModal() {
  const [opened, { open, close }] = useDisclosure(false)
  const {donationTimer, updateData, getData, shellOpen} = window.electronAPI

  useEffect(() => {
    donationTimer()

    async function showModal() {
      const {donationTimer, showDonationModal} = await getData()

      if (showDonationModal === "false") {
        clearInterval(intervalId);
        return;
      }

      if (Number(donationTimer) >= 5760) {
        open()
        await updateData("userSettings", `timer = ${0}, showModalState = ${false}`, 1)
      }
    }

    const intervalId = setInterval(showModal, 300000)
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
