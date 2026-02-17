import './styles/main.scss'
import './styles/tutorial.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './components/ui/provider'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './libs/react-query'
import { TutorialProvider } from './contexts/TutorialContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <TutorialProvider>
          <RouterProvider router={router} />
        </TutorialProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
