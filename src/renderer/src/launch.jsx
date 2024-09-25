import React from 'react';
import { Button, Modal, TextInput } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy } from '@tabler/icons-react';

function Launch({ opened, close }) {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Modal opened={opened} onClose={close} title="Launcher Command" centered>
      <div style={{ position: 'relative', paddingBottom: '3rem' }}>
        <TextInput readOnly value="launch backup.exe" style={{ marginBottom: '1rem' }}
          rightSection={
            <IconCopy size={16} style={{ cursor: 'pointer' }} onClick={() => clipboard.copy('launch backup.exe')}/>
          }
        />
        <Button style={{ position: 'absolute', bottom: '1rem', right: '1rem' }} onClick={close}>
          Done
        </Button>
      </div>
    </Modal>
  );
}

export default Launch;

