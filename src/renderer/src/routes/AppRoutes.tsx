import { RouteObject } from 'react-router-dom'
import App from '../App'
import { ReunionManager, Reunion, ProntuarioManager } from '../pages'

const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
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
        path: '*',
        element: <div>não encontrado</div>
      }
    ]
  }
]

export default AppRoutes
