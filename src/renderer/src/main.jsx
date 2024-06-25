import '@mantine/core/styles.css'
import {  MantineProvider } from '@mantine/core'
import "./assets/global.scss"

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme={'dark'}>
      <App />
    </MantineProvider>
  </React.StrictMode>
)
