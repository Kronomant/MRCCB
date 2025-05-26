import { Box, Button, Flex } from '@chakra-ui/react'
import { Sidebar } from './components'
import { Outlet } from 'react-router-dom'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Flex w="100vw">
      <Sidebar />
      <Flex w="100%" padding="12px" bg="bg.muted">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default App
