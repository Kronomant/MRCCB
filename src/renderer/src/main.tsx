import './styles/main.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from './components/ui/provider'
import { RouterProvider } from 'react-router-dom'
import router from './routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
