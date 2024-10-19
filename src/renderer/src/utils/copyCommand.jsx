import {IconCopy, IconCheck} from "@tabler/icons-react";
import {TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useClipboard} from "@mantine/hooks";

export default function({ name }){
  const [command, setCommand] = useState()
  const [showTick, setShowTick] = useState(false)

  const clipboard = useClipboard({ timeout: 500 });

  useEffect(() => {
    if (name){
      async function fetchData(){
        const id =  await window.electronAPI.getData('itemData','name', name)
        const appData = await window.electronAPI.getAppData()

        setCommand(`pythonw "${appData}/flash-backup/emitRequest.pyw" ${id.rows[0].id} %command%`)
      }

      fetchData()
    }
  }, [name])

  useEffect(() => {
    let timer;
    if (showTick){
      timer = setTimeout(() => setShowTick(false), 800)
    }

    return () => clearTimeout(timer);
  }, [showTick])

  return (
    <>
      <p style={{textAlign: "center", fontSize: "0.9rem"}}>Copy and paste this into your additional launch options in steam</p>
      <TextInput readOnly value={command || ""}
                 rightSection={<CopyIcon showTick={showTick} onClick={() => {setShowTick(true); clipboard.copy(command)} }/>}
      />
    </>
  )
}

function CopyIcon({ showTick, onClick }){
    return showTick ? <IconCheck size={16} style={{cursor: 'pointer'}}/> :
      <IconCopy size={16} style={{ cursor: 'pointer' }} onClick={onClick}/>
}
