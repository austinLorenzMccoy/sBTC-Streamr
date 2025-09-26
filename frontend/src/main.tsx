import React from 'react'
import ReactDOM from 'react-dom/client'
import { Connect } from '@stacks/connect-react'
import App from './App.tsx'
import './index.css'

const appConfig = {
  appDetails: {
    name: 'sBTC-Streamr',
    icon: '/vite.svg',
  },
  userSession: {
    appConfig: {
      scopes: ['store_write', 'publish_data'],
      redirectTo: '/',
      manifestPath: '/manifest.json',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Connect {...appConfig}>
      <App />
    </Connect>
  </React.StrictMode>,
)
