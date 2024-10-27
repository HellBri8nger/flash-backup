import {IconBrandGithubFilled, IconBrandBluesky, IconBrandX} from "@tabler/icons-react"
import {Divider, Button, Image} from "@mantine/core"
import "../styles/contact.scss"
import kofi from "./kofi.png"

export default function Contact() {
  const { shellOpen } = window.electronAPI

  return (
    <div className="contact">
      <div className="title">Contact</div>
      <Divider/>
      <div className="iconsParent">
        <Image src={kofi} alt="Support me on Ko-fi" className="kofiLogo" style={{cursor: 'pointer'}} onClick={async () => await shellOpen("https://ko-fi.com/hellbri8nger")}/>
        <div className="iconsInner">
          <div className="icons">
            <IconBrandGithubFilled style={{cursor: 'pointer'}} onClick={async () => await shellOpen("https://github.com/HellBri8nger")}/>
            <IconBrandBluesky style={{cursor: 'pointer'}} onClick={async () => await shellOpen("https://bsky.app/profile/hellbri8nger.bsky.social")}/>
            <IconBrandX style={{cursor: 'pointer'}} onClick={async () => await shellOpen("https://x.com/HellBri8nger")}/>
          </div>
          <Button variant="subtle" compact style={{cursor: 'pointer'}} onClick={async () => await shellOpen("https://github.com/HellBri8nger/flash-backup/issues")}>Report a bug</Button>
        </div>
      </div>
    </div>
  )
}

// TODO add links
