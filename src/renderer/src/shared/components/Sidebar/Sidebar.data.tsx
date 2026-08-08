import { FiHome, FiSettings, FiFolder, FiCalendar, FiPieChart } from 'react-icons/fi'

export const menuItems = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: <FiPieChart />
  },
  {
    title: 'Reuniões',
    path: 'reunioes',
    icon: <FiCalendar />
  },
  {
    title: 'Prontuários',
    path: 'prontuarios',
    icon: <FiFolder />
  },
  {
    title: 'Unidades',
    path: 'unidades',
    icon: <FiHome />
  },
  {
    title: 'Configurações',
    path: 'configuracoes',
    icon: <FiSettings />
  }
]
