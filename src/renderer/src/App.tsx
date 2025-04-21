import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from './components'
import { Outlet } from 'react-router-dom'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Flex>
      <Sidebar />
      <Box ml="240px" p="4" flex="1">
        <Outlet />
      </Box>
    </Flex>
  )
}

export default App
