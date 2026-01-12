import { FiHome, FiSettings, FiUser, FiFileText, FiPieChart } from 'react-icons/fi'

export const menuItems = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: <FiPieChart />
  },
  {
    title: 'Reuniões',
    path: 'reunioes',
    icon: <FiHome />
  },
  {
    title: 'Prontuários',
    path: 'prontuarios',
    icon: <FiFileText />
  },
  {
    title: 'Unidades',
    path: 'unidades',
    icon: <FiSettings />
  }
]
