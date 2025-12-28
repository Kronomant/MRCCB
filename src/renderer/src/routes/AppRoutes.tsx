import { RouteObject } from 'react-router-dom'
import App from '../App'
import { ReunionManager, Reunion, ProntuarioManager, UnityManager, Home } from '../pages'

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
        path: 'unidades',
        element: <UnityManager />
      }
    ]
  }
]

export default AppRoutes
