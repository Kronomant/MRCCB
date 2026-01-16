import { RouteObject } from 'react-router-dom'
import App from '../App'
import {
  ReunionManager,
  Reunion,
  ProntuarioManager,
  UnityManager,
  Home,
  Dashboard,
  Settings
} from '../pages'

const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'reunioes',
        element: <ReunionManager />
      },
      {
        path: 'reunioes/:id',
        element: <Reunion />
      },
      {
        path: 'prontuarios',
        element: <ProntuarioManager />
      },
      {
        path: 'configuracoes',
        element: <Settings />
      },
      {
        path: 'unidades',
        element: <UnityManager />
      }
    ]
  }
]

export default AppRoutes
