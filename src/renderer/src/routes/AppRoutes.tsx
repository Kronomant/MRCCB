import { RouteObject } from 'react-router-dom'
import App from '../App'
import { Reunion } from '../pages'

const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Reunion />
      },
      {
        path: 'reunioes',
        element: <div>reuniões</div>
      },
      {
        path: 'reunioes/:id',
        element: <div>reunião</div>
      },
      {
        path: '*',
        element: <div>não encontrado</div>
      }
    ]
  }
]

export default AppRoutes
